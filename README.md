# 🎵 Radio Live Music

> A synchronized radio system allowing a DJ to control music for all connected listeners in real-time.

> Un système de radio synchronisée permettant à un DJ de contrôler la musique pour tous les auditeurs connectés en temps réel.

-----

\<p align="center"\>
\<strong\>\<a href="\#-english"\>English\</a\>\</strong\>
\&nbsp;\&nbsp;\&bull;\&nbsp;\&nbsp;
\<strong\>\<a href="\#-français"\>Français\</a\>\</strong\>
\</p\>

-----

## 🇬🇧 English

### 🚀 Features

  - **Real-time synchronization**: All listeners hear the exact same thing at the same time.
  - **DJ interface with audio**: The DJ also hears the music with a visual indicator.
  - **Listener interface**: Elegant view with information on the current track.
  - **JSON Playlist**: Complete metadata with images, sources, tags, etc.
  - **WebSocket**: Bidirectional communication for perfect synchronization.
  - **Responsive**: Mobile and desktop-friendly interfaces.
  - **Playlist manager**: Tools to add and validate tracks.
  - **Flexible configuration**: `config.json` file to customize the system.

### 📁 Project Structure

```
livemusic/
├── music/                          # Folder containing audio files
├── public/                         # Public web files
│   ├── index.html                  # Listener interface
│   └── dj.html                     # DJ interface
├── playlist.json                   # Track catalog with metadata
├── config.json                     # System configuration
├── playlist-manager.js             # Playlist manager
├── server.js                       # Node.js server with Socket.IO
├── package.json                    # npm configuration
└── README.md                       # This file
```

### 🎛️ JSON Playlist Format

Each track in `playlist.json` contains:

```json
{
  "id": "unique-identifier",
  "title": "Track title",
  "artist": "Artist name",
  "filename": "filename.mp3",
  "duration": null,
  "image": "URL of the cover image",
  "source": "Source website (e.g., unminus.com)",
  "genre": "Music genre",
  "description": "Track description",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### 🖥️ Usage

#### Starting the server

```bash
npm start
```

#### Accessing the interfaces

  - **Listener Interface**: http://localhost:3000
  - **DJ Interface**: http://localhost:3000/dj

#### DJ Controls

1.  **Play**: Click on a track in the playlist or use the Play button.
2.  **Pause**: Pause button (synchronized for all).
3.  **Stop**: Stop button (resets to the beginning).
4.  **Volume**: Volume slider (recommended level for all).
5.  **Navigation**: Click on the progress bar to seek within the track.

#### Listener Experience

  - **Automatic synchronization**: Connects and syncs automatically.
  - **Personal volume**: Each listener can adjust their local volume.
  - **Rich information**: Title, artist, genre, tags, image.
  - **Real-time status**: Connection and playback status indicator.

### 🔧 REST API

#### Available Endpoints

  - `GET /api/playlist` - Get the full playlist
  - `GET /api/state` - Current state of the radio
  - `POST /api/play` - Play a track
  - `POST /api/pause` - Pause playback
  - `POST /api/stop` - Stop playback
  - `POST /api/seek` - Seek within the track
  - `POST /api/volume` - Change the volume

#### WebSocket Events

  - `radio:sync` - State synchronization
  - `radio:play` - Start playback
  - `radio:pause` - Pause
  - `radio:stop` - Stop
  - `radio:seek` - Seek
  - `radio:volume` - Volume change

### 🎵 Playlist Management

#### Playlist Manager (recommended)

```bash
# Add a new track
node playlist-manager.js add "Title" "Artist" "file.mp3" "Genre"

# Scan files in the music folder
node playlist-manager.js scan

# Validate playlist integrity
node playlist-manager.js validate

# Show help
node playlist-manager.js help
```

#### Manual Editing

You can also edit the `playlist.json` file directly, but be careful to maintain the correct format.

### 🎨 Customization

#### Adding new tracks

1.  Place the audio file in the `music/` folder.
2.  Add the corresponding entry in `playlist.json`.
3.  Restart the server.

#### Modifying the appearance

  - Edit the CSS styles in `public/index.html` (listeners).
  - Edit the CSS styles in `public/dj.html` (DJ interface).

### 🛠️ Technologies Used

  - **Backend**: Node.js, Express.js
  - **Real-time**: Socket.IO
  - **Frontend**: HTML5, CSS3, Vanilla JavaScript
  - **Audio**: HTML5 Audio API

### 📱 Compatibility

  - Modern browsers (Chrome, Firefox, Safari, Edge)
  - Full mobile support
  - Works on a local network or over the internet

### 🔍 Troubleshooting

#### Sound is not syncing

  - Check that all clients are using modern browsers.
  - Ensure audio files are accessible.
  - Restart the server if necessary.

#### Playback Issues

  - Check supported audio formats (MP3, WAV, OGG).
  - Ensure files are not corrupted.
  - Check file permissions.

### 🚀 Future Improvements

  - Support for additional audio formats
  - File upload via the interface
  - Multiple playlists
  - Real-time chat
  - Audio visualizations
  - Playback history

### 📄 License

MIT License - Free to use and modify.

### 🙏 Acknowledgements

> ![Ascol57](https://img.shields.io/badge/Made_with_%E2%9D%A4%EF%B8%8F_by-Ascol-red?style=flat&logo=github)

-----

<br>
<br>
<br>
<br>

-----

## 🇫🇷 Français

### 🚀 Fonctionnalités

  - **Synchronisation en temps réel** : Tous les auditeurs entendent exactement la même chose au même moment
  - **Interface DJ avec audio** : Le DJ entend aussi la musique avec indicateur visuel
  - **Interface Auditeur** : Vue élégante avec informations sur le morceau en cours
  - **Playlist JSON** : Métadonnées complètes avec images, sources, tags, etc.
  - **WebSocket** : Communication bidirectionnelle pour une synchronisation parfaite
  - **Responsive** : Interfaces adaptées mobile et desktop
  - **Gestionnaire de playlist** : Outils pour ajouter et valider les morceaux
  - **Configuration flexible** : Fichier config.json pour personnaliser le système

### 📁 Structure du projet

```
livemusic/
├── music/                          # Dossier contenant les fichiers audio
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

### 🎛️ Format de la playlist JSON

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

### 🖥️ Utilisation

#### Démarrage du serveur

```bash
npm start
```

#### Accès aux interfaces

  - **Interface Auditeur** : http://localhost:3000
  - **Interface DJ** : http://localhost:3000/dj

#### Contrôles DJ

1.  **Lecture** : Cliquer sur un morceau dans la playlist ou utiliser le bouton Play
2.  **Pause** : Bouton Pause (synchronisé pour tous)
3.  **Arrêt** : Bouton Stop (remet à zéro)
4.  **Volume** : Slider de volume (conseil pour tous)
5.  **Navigation** : Clic sur la barre de progression pour se déplacer dans le morceau

#### Expérience Auditeur

  - **Synchronisation automatique** : Se connecte et synchronise automatiquement
  - **Volume personnel** : Chaque auditeur peut ajuster son volume local
  - **Informations riches** : Titre, artiste, genre, tags, image
  - **Statut en temps réel** : Indicateur de connexion et d'état de lecture

### 🔧 API REST

#### Endpoints disponibles

  - `GET /api/playlist` - Récupère la playlist complète
  - `GET /api/state` - État actuel de la radio
  - `POST /api/play` - Lance un morceau
  - `POST /api/pause` - Met en pause
  - `POST /api/stop` - Arrête la lecture
  - `POST /api/seek` - Se déplace dans le morceau
  - `POST /api/volume` - Change le volume

#### Événements WebSocket

  - `radio:sync` - Synchronisation de l'état
  - `radio:play` - Début de lecture
  - `radio:pause` - Mise en pause
  - `radio:stop` - Arrêt
  - `radio:seek` - Déplacement dans le morceau
  - `radio:volume` - Changement de volume

### 🎵 Gestion de la playlist

#### Gestionnaire de playlist (recommandé)

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

#### Édition manuelle

Vous pouvez également éditer le fichier `playlist.json` manuellement, en respectant le format.

### 🎨 Personnalisation

#### Ajouter de nouveaux morceaux

1.  Placer le fichier audio dans le dossier `music/`
2.  Ajouter l'entrée correspondante dans `playlist.json`
3.  Redémarrer le serveur

#### Modifier l'apparence

  - Éditer les styles CSS dans `public/index.html` (auditeurs)
  - Éditer les styles CSS dans `public/dj.html` (interface DJ)

### 🛠️ Technologies utilisées

  - **Backend** : Node.js, Express.js
  - **Temps réel** : Socket.IO
  - **Frontend** : HTML5, CSS3, JavaScript vanilla
  - **Audio** : HTML5 Audio API

### 📱 Compatibilité

  - Navigateurs modernes (Chrome, Firefox, Safari, Edge)
  - Support mobile complet
  - Fonctionne en réseau local ou sur internet

### 🔍 Dépannage

#### Le son ne se synchronise pas

  - Vérifier que tous les clients utilisent des navigateurs modernes
  - S'assurer que les fichiers audio sont accessibles
  - Redémarrer le serveur si nécessaire

#### Problèmes de lecture

  - Vérifier les formats audio supportés (MP3, WAV, OGG)
  - S'assurer que les fichiers ne sont pas corrompus
  - Vérifier les permissions de fichiers

### 🚀 Améliorations futures

  - Support de formats audio supplémentaires
  - Upload de fichiers via l'interface
  - Playlists multiples
  - Chat en temps réel
  - Visualisations audio
  - Historique de lecture

### 📄 Licence

MIT License - Libre d'utilisation et de modification.

### 🙏 Remerciements

> ![Ascol57](https://img.shields.io/badge/Fait_avec_%E2%9D%A4%EF%B8%8F_par-Ascol-red?style=flat&logo=github)
