const fs = require('fs');
const path = require('path');

// Script utilitaire pour ajouter un nouveau morceau à la playlist
function addTrackToPlaylist(trackInfo) {
    try {
        // Lire la playlist actuelle
        const playlistPath = path.join(__dirname, 'playlist.json');
        const playlistData = fs.readFileSync(playlistPath, 'utf8');
        const playlist = JSON.parse(playlistData);

        // Générer un ID unique basé sur le titre
        const id = trackInfo.title.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Vérifier que le fichier existe
        const musicPath = path.join(__dirname, 'music', trackInfo.filename);
        if (!fs.existsSync(musicPath)) {
            console.error(`❌ Fichier non trouvé: ${trackInfo.filename}`);
            return false;
        }

        // Créer l'objet morceau
        const newTrack = {
            id: id,
            title: trackInfo.title,
            artist: trackInfo.artist || 'Artiste Inconnu',
            filename: trackInfo.filename,
            duration: null,
            image: trackInfo.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
            source: trackInfo.source || '',
            genre: trackInfo.genre || 'Non spécifié',
            description: trackInfo.description || '',
            tags: trackInfo.tags || []
        };

        // Ajouter à la playlist
        playlist.push(newTrack);

        // Sauvegarder
        fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2));
        console.log(`✅ Morceau ajouté: ${newTrack.title} par ${newTrack.artist}`);
        console.log(`   ID: ${newTrack.id}`);
        console.log(`   Fichier: ${newTrack.filename}`);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout:', error);
        return false;
    }
}

// Fonction pour lister tous les fichiers audio dans le dossier music
function scanMusicFolder() {
    try {
        const musicDir = path.join(__dirname, 'music');
        const files = fs.readdirSync(musicDir);
        const audioFiles = files.filter(file => 
            /\.(mp3|wav|ogg|m4a|flac)$/i.test(file)
        );

        console.log(`🎵 Fichiers audio trouvés dans le dossier music:`);
        audioFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file}`);
        });

        return audioFiles;
    } catch (error) {
        console.error('❌ Erreur lors du scan:', error);
        return [];
    }
}

// Fonction pour vérifier l'intégrité de la playlist
function validatePlaylist() {
    try {
        const playlistPath = path.join(__dirname, 'playlist.json');
        const playlistData = fs.readFileSync(playlistPath, 'utf8');
        const playlist = JSON.parse(playlistData);

        console.log(`📋 Validation de la playlist (${playlist.length} morceaux):`);
        
        let errors = 0;
        playlist.forEach((track, index) => {
            const musicPath = path.join(__dirname, 'music', track.filename);
            if (!fs.existsSync(musicPath)) {
                console.log(`❌ ${index + 1}. ${track.title} - Fichier manquant: ${track.filename}`);
                errors++;
            } else {
                console.log(`✅ ${index + 1}. ${track.title} - OK`);
            }
        });

        if (errors === 0) {
            console.log(`🎉 Playlist valide! Tous les fichiers sont présents.`);
        } else {
            console.log(`⚠️  ${errors} erreur(s) trouvée(s) dans la playlist.`);
        }

        return errors === 0;
    } catch (error) {
        console.error('❌ Erreur lors de la validation:', error);
        return false;
    }
}

// Interface en ligne de commande
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'add':
            // Exemple: node playlist-manager.js add "Mon Titre" "Mon Artiste" "fichier.mp3" "Electronic"
            const title = process.argv[3];
            const artist = process.argv[4];
            const filename = process.argv[5];
            const genre = process.argv[6];
            
            if (!title || !filename) {
                console.log('Usage: node playlist-manager.js add "Titre" "Artiste" "fichier.mp3" "Genre"');
                break;
            }
            
            addTrackToPlaylist({
                title: title,
                artist: artist,
                filename: filename,
                genre: genre,
                description: `${title} par ${artist}`,
                tags: [genre ? genre.toLowerCase() : 'music']
            });
            break;
            
        case 'scan':
            scanMusicFolder();
            break;
            
        case 'validate':
            validatePlaylist();
            break;
            
        case 'help':
        default:
            console.log(`
🎵 Gestionnaire de Playlist Radio Live Music

Commandes disponibles:
  add "titre" "artiste" "fichier.mp3" "genre"  - Ajouter un morceau
  scan                                          - Scanner le dossier music
  validate                                      - Vérifier l'intégrité de la playlist
  help                                          - Afficher cette aide

Exemples:
  node playlist-manager.js add "Ma Chanson" "Mon Artiste" "chanson.mp3" "Pop"
  node playlist-manager.js scan
  node playlist-manager.js validate
            `);
            break;
    }
}

module.exports = {
    addTrackToPlaylist,
    scanMusicFolder,
    validatePlaylist
};
