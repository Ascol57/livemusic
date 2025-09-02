# Script PowerShell pour lancer une musique sur la radio
# Usage: .\play-music.ps1 -TrackId "berlin-dream" [-StartTime 0] [-Server "http://localhost:3000"]

param(
    [Parameter(Mandatory=$true)]
    [string]$TrackId,
    
    [Parameter(Mandatory=$false)]
    [int]$StartTime = 0,
    
    [Parameter(Mandatory=$false)]
    [string]$Server = "http://localhost:3000"
)

function Play-Music {
    param($TrackId, $StartTime, $Server)
    
    Write-Host "Lancement de la musique..." -ForegroundColor Cyan
    Write-Host "ID du morceau: $TrackId" -ForegroundColor Yellow
    
    if ($StartTime -gt 0) {
        Write-Host "Temps de demarrage: ${StartTime}s" -ForegroundColor Yellow
    }
    
    Write-Host "Serveur: $Server" -ForegroundColor Yellow
    
    try {
        # Preparer les donnees JSON
        $body = @{
            trackId = $TrackId
            startTime = $StartTime
        } | ConvertTo-Json
        
        # Faire la requete POST
        $response = Invoke-RestMethod -Uri "$Server/api/play" -Method Post -Body $body -ContentType "application/json"
        
        if ($response.success) {
            Write-Host "Musique lancee avec succes!" -ForegroundColor Green
            
            if ($response.state.currentTrack) {
                $track = $response.state.currentTrack
                Write-Host ""
                Write-Host "Lecture en cours:" -ForegroundColor Green
                Write-Host "   Titre: $($track.title)" -ForegroundColor White
                Write-Host "   Artiste: $($track.artist)" -ForegroundColor White
                Write-Host "   Genre: $($track.genre)" -ForegroundColor White
                
                if ($track.tags) {
                    Write-Host "   Tags: $($track.tags -join ', ')" -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "Erreur lors du lancement" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "Verifiez que l'ID du morceau existe dans la playlist" -ForegroundColor Yellow
        }
    }
}

function Get-AvailableTracks {
    param($Server)
    
    Write-Host "Recuperation de la playlist..." -ForegroundColor Cyan
    
    try {
        $playlist = Invoke-RestMethod -Uri "$Server/api/playlist" -Method Get
        
        Write-Host ""
        Write-Host "Morceaux disponibles:" -ForegroundColor Green
        Write-Host ""
        
        foreach ($track in $playlist) {
            Write-Host "ID: $($track.id)" -ForegroundColor Yellow
            Write-Host "   $($track.title) - $($track.artist) [$($track.genre)]" -ForegroundColor White
            Write-Host ""
        }
        
    } catch {
        Write-Host "Impossible de recuperer la playlist: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Affichage de l'aide si aucun parametre
if ($TrackId -eq "-help" -or $TrackId -eq "--help" -or $TrackId -eq "/?" -or $TrackId -eq "help") {
    Write-Host "Script de controle Radio Live Music" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\play-music.ps1 -TrackId ""berlin-dream""" -ForegroundColor White
    Write-Host "  .\play-music.ps1 -TrackId ""open-minded"" -StartTime 30" -ForegroundColor White
    Write-Host "  .\play-music.ps1 -TrackId ""tea-coldise"" -Server ""http://192.168.1.100:3000""" -ForegroundColor White
    Write-Host ""
    Write-Host "Parametres:" -ForegroundColor Yellow
    Write-Host "  -TrackId    ID du morceau a jouer (obligatoire)" -ForegroundColor White
    Write-Host "  -StartTime  Temps de demarrage en secondes (optionnel, defaut: 0)" -ForegroundColor White
    Write-Host "  -Server     URL du serveur radio (optionnel, defaut: http://localhost:3000)" -ForegroundColor White
    Write-Host ""
    Write-Host "Exemples d'ID disponibles:" -ForegroundColor Yellow
    Write-Host "  - berlin-dream" -ForegroundColor Green
    Write-Host "  - open-minded" -ForegroundColor Green
    Write-Host "  - tea-coldise" -ForegroundColor Green
    Write-Host "  - they-say" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pour voir tous les morceaux disponibles:" -ForegroundColor Yellow
    Write-Host "  .\play-music.ps1 -TrackId ""list""" -ForegroundColor White
    exit
}

# Commande spéciale pour lister les morceaux
if ($TrackId -eq "list") {
    Get-AvailableTracks -Server $Server
    exit
}

# Lancer la musique
Play-Music -TrackId $TrackId -StartTime $StartTime -Server $Server
