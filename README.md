# 🎵 Radio Live Music

Un système de radio synchronisée permettant à un DJ de contrôler la musique pour tous les auditeurs connectés en temps réel.

## 🚀 Fonctionnalités

- **Synchronisation en temps réel** : Tous les auditeurs entendent exactement la même chose au même moment
- **Interface DJ avec audio** : Le DJ entend aussi la musique avec indicateur visuel
- **Interface Auditeur** : Vue élégante avec informations sur le morceau en cours
- **Playlist JSON** : Métadonnées complètes avec images, sources, tags, etc.
- **WebSocket** : Communication bidirectionnelle pour une synchronisation parfaite
- **Responsive** : Interfaces adaptées mobile et desktop
- **Gestionnaire de playlist** : Outils pour ajouter et valider les morceaux
- **Configuration flexible** : Fichier config.json pour personnaliser le système

## 📁 Structure du projet

```
livemusic/
├── music/                          # Dossier contenant les fichiers audio
│   ├── Berlin Dream - Unminus.com.mp3
│   ├── Open Minded - Kit Wheston _ Unminus.mp3
│   ├── Tea by Coldise _ Unminus.mp3
│   └── They Say _ unminus.com.mp3
├── public/                         # Fichiers web publics
│   ├── index.html                  # Interface auditeur
│   └── dj.html                     # Interface DJ
├── playlist.json                   # Catalogue des morceaux avec métadonnées
├── config.json                     # Configuration du système
├── playlist-manager.js             # Gestionnaire de playlist
├── server.js                       # Serveur Node.js avec Socket.IO
├── package.json                    # Configuration npm
└── README.md                       # Ce fichier
```

## 🎛️ Format de la playlist JSON

Chaque morceau dans `playlist.json` contient :

```json
{
  "id": "identifiant-unique",
  "title": "Titre du morceau",
  "artist": "Nom de l'artiste",
  "filename": "nom-du-fichier.mp3",
  "duration": null,
  "image": "URL de l'image de couverture",
  "source": "Site web source (ex: unminus.com)",
  "genre": "Genre musical",
  "description": "Description du morceau",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## 🖥️ Utilisation

### Démarrage du serveur

```bash
npm start
```

### Accès aux interfaces

- **Interface Auditeur** : http://localhost:3000
- **Interface DJ** : http://localhost:3000/dj

### Contrôles DJ

1. **Lecture** : Cliquer sur un morceau dans la playlist ou utiliser le bouton Play
2. **Pause** : Bouton Pause (synchronisé pour tous)
3. **Arrêt** : Bouton Stop (remet à zéro)
4. **Volume** : Slider de volume (conseil pour tous)
5. **Navigation** : Clic sur la barre de progression pour se déplacer dans le morceau

### Expérience Auditeur

- **Synchronisation automatique** : Se connecte et synchronise automatiquement
- **Volume personnel** : Chaque auditeur peut ajuster son volume local
- **Informations riches** : Titre, artiste, genre, tags, image
- **Statut en temps réel** : Indicateur de connexion et d'état de lecture

## 🔧 API REST

### Endpoints disponibles

- `GET /api/playlist` - Récupère la playlist complète
- `GET /api/state` - État actuel de la radio
- `POST /api/play` - Lance un morceau
- `POST /api/pause` - Met en pause
- `POST /api/stop` - Arrête la lecture
- `POST /api/seek` - Se déplace dans le morceau
- `POST /api/volume` - Change le volume

### Événements WebSocket

- `radio:sync` - Synchronisation de l'état
- `radio:play` - Début de lecture
- `radio:pause` - Mise en pause
- `radio:stop` - Arrêt
- `radio:seek` - Déplacement dans le morceau
- `radio:volume` - Changement de volume

## 🎵 Gestion de la playlist

### Gestionnaire de playlist (recommandé)

```bash
# Ajouter un nouveau morceau
node playlist-manager.js add "Titre" "Artiste" "fichier.mp3" "Genre"

# Scanner les fichiers dans le dossier music
node playlist-manager.js scan

# Vérifier l'intégrité de la playlist
node playlist-manager.js validate

# Afficher l'aide
node playlist-manager.js help
```

### Édition manuelle

## 🎨 Personnalisation

### Ajouter de nouveaux morceaux

1. Placer le fichier audio dans le dossier `music/`
2. Ajouter l'entrée correspondante dans `playlist.json`
3. Redémarrer le serveur

### Modifier l'apparence

- Éditer les styles CSS dans `public/index.html` (auditeurs)
- Éditer les styles CSS dans `public/dj.html` (interface DJ)

## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express.js
- **Temps réel** : Socket.IO
- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Audio** : HTML5 Audio API

## 📱 Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Support mobile complet
- Fonctionne en réseau local ou sur internet

## 🔍 Dépannage

### Le son ne se synchronise pas
- Vérifier que tous les clients utilisent des navigateurs modernes
- S'assurer que les fichiers audio sont accessibles
- Redémarrer le serveur si nécessaire

### Problèmes de lecture
- Vérifier les formats audio supportés (MP3, WAV, OGG)
- S'assurer que les fichiers ne sont pas corrompus
- Vérifier les permissions de fichiers

## 🚀 Améliorations futures

- Support de formats audio supplémentaires
- Upload de fichiers via l'interface
- Playlists multiples
- Chat en temps réel
- Visualisations audio
- Historique de lecture

## 📄 Licence

MIT License - Libre d'utilisation et de modification.
