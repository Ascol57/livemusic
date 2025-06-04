const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Charger la configuration
let config = {};
try {
  const configData = fs.readFileSync('config.json', 'utf8');
  config = JSON.parse(configData);
  console.log('Configuration chargée');
} catch (error) {
  console.error('Erreur lors du chargement de la configuration:', error);
  // Configuration par défaut
  config = {
    features: { autoAdvancePlaylist: false },
    audio: { defaultDuration: 180 }
  };
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/music', express.static('music'));

// État global de la radio
let radioState = {
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  lastUpdate: Date.now(),
  playlist: [],
  volume: 1.0
};

// Historique et statistiques
let radioHistory = [];
let connectedListeners = new Set();
let sessionStats = {
  startTime: Date.now(),
  totalTracksPlayed: 0,
  totalListeningTime: 0,
  peakListeners: 0
};

// Charger la playlist
function loadPlaylist() {
  try {
    const playlistData = fs.readFileSync('playlist.json', 'utf8');
    radioState.playlist = JSON.parse(playlistData);
    console.log(`Playlist chargée avec ${radioState.playlist.length} morceaux`);
  } catch (error) {
    console.error('Erreur lors du chargement de la playlist:', error);
    radioState.playlist = [];
  }
}

// Routes API
app.get('/api/playlist', (req, res) => {
  res.json(radioState.playlist);
});

app.get('/api/state', (req, res) => {
  // Calculer le temps actuel si la musique joue
  if (radioState.isPlaying && radioState.currentTrack) {
    const timePassed = (Date.now() - radioState.lastUpdate) / 1000;
    radioState.currentTime += timePassed;
    radioState.lastUpdate = Date.now();
  }
  
  res.json(radioState);
});

app.get('/api/history', (req, res) => {
  res.json(radioHistory.slice(-50)); // Derniers 50 morceaux
});

app.get('/api/stats', (req, res) => {
  const currentListeners = connectedListeners.size;
  const uptime = Date.now() - sessionStats.startTime;
  
  res.json({
    ...sessionStats,
    currentListeners,
    uptime,
    peakListeners: Math.max(sessionStats.peakListeners, currentListeners),
    uptimeFormatted: formatUptime(uptime)
  });
});

// Nouvelle route pour obtenir le nombre d'auditeurs en temps réel
app.get('/api/listeners', (req, res) => {
  res.json({
    count: connectedListeners.size,
    peak: sessionStats.peakListeners,
    listeners: Array.from(connectedListeners)
  });
});

// Fonction utilitaire pour formater le temps de fonctionnement
function formatUptime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}j ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

app.post('/api/play', (req, res) => {
  const { trackId, startTime = 0 } = req.body;
  
  const track = radioState.playlist.find(t => t.id === trackId);
  if (!track) {
    return res.status(404).json({ error: 'Morceau non trouvé' });
  }
  
  // Ajouter à l'historique si c'est un nouveau morceau (pas une reprise)
  if (!radioState.currentTrack || radioState.currentTrack.id !== trackId || startTime === 0) {
    radioHistory.push({
      track: track,
      startedAt: new Date().toISOString(),
      listeners: connectedListeners.size
    });
    sessionStats.totalTracksPlayed++;
  }
  
  radioState.currentTrack = track;
  radioState.currentTime = startTime;
  radioState.isPlaying = true;
  radioState.lastUpdate = Date.now();
  
  console.log(`▶️ Lecture: ${track.title} par ${track.artist}`);
  
  // Diffuser à tous les clients connectés
  io.emit('radio:play', {
    track: track,
    startTime: startTime,
    timestamp: Date.now()
  });
  
  res.json({ success: true, state: radioState });
});

app.post('/api/pause', (req, res) => {
  if (radioState.isPlaying) {
    // Mettre à jour le temps avant de pausser
    const timePassed = (Date.now() - radioState.lastUpdate) / 1000;
    radioState.currentTime += timePassed;
  }
  
  radioState.isPlaying = false;
  radioState.lastUpdate = Date.now();
  
  console.log('⏸️ Pause');
  
  io.emit('radio:pause', {
    currentTime: radioState.currentTime,
    timestamp: Date.now()
  });
  
  res.json({ success: true, state: radioState });
});

app.post('/api/stop', (req, res) => {
  radioState.isPlaying = false;
  radioState.currentTrack = null;
  radioState.currentTime = 0;
  radioState.lastUpdate = Date.now();
  
  console.log('⏹️ Arrêt');
  
  io.emit('radio:stop', {
    timestamp: Date.now()
  });
  
  res.json({ success: true, state: radioState });
});

app.post('/api/seek', (req, res) => {
  const { time } = req.body;
  
  radioState.currentTime = time;
  radioState.lastUpdate = Date.now();
  
  console.log(`⏩ Seek à ${time}s`);
  
  io.emit('radio:seek', {
    time: time,
    timestamp: Date.now()
  });
  
  res.json({ success: true, state: radioState });
});

app.post('/api/volume', (req, res) => {
  const { volume } = req.body;
  
  radioState.volume = Math.max(0, Math.min(1, volume));
  
  io.emit('radio:volume', {
    volume: radioState.volume,
    timestamp: Date.now()
  });
  
  res.json({ success: true, volume: radioState.volume });
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log(`🔌 Nouvel auditeur connecté: ${socket.id}`);
  
  // Ajouter à la liste des auditeurs connectés
  connectedListeners.add(socket.id);
  
  // Mettre à jour le pic d'auditeurs
  sessionStats.peakListeners = Math.max(sessionStats.peakListeners, connectedListeners.size);
  
  console.log(`👥 Auditeurs connectés: ${connectedListeners.size}`);
  
  // Envoyer l'état actuel au nouveau client
  socket.emit('radio:sync', radioState);
  
  // Diffuser le nombre d'auditeurs connectés à tous les clients
  io.emit('listeners:count', connectedListeners.size);
  
  socket.on('disconnect', () => {
    console.log(`📡 Auditeur déconnecté: ${socket.id}`);
    
    // Retirer de la liste des auditeurs connectés
    connectedListeners.delete(socket.id);
    console.log(`👥 Auditeurs connectés: ${connectedListeners.size}`);
    
    // Diffuser le nouveau nombre d'auditeurs connectés
    io.emit('listeners:count', connectedListeners.size);
  });
  
  // Ping pour garder la connexion active
  socket.on('ping', () => {
    socket.emit('pong');
  });
  
  // Gestion des événements spécifiques aux auditeurs
  socket.on('listener:heartbeat', () => {
    // Confirmer que l'auditeur est toujours actif
    socket.emit('heartbeat:ack');
  });
});

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dj', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dj.html'));
});

app.get('/streamPanel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'streamPanel.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Initialisation
loadPlaylist();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎵 Serveur radio démarré sur http://localhost:${PORT}`);
  console.log(`🎧 Interface auditeur: http://localhost:${PORT}`);
  console.log(`🎛️ Interface DJ: http://localhost:${PORT}/dj`);
  console.log(`📊 Interface Admin: http://localhost:${PORT}/admin`);
});
