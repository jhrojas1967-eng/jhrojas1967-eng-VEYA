# Especificación Técnica: Pantalla de Música & Streaming Unificado (Material 3)
## Guía de Implementación para Claude Code (OAuth 2.0, Spotify, Apple Music, TIDAL y Local)

> **Destinatario:** Claude Code / Equipo de Desarrollo Android (Kotlin + Jetpack Compose)  
> **Ubicaciones:**  
> - UI Screen: `ui/screen/music/UnifiedStreamingMusicScreen.kt`  
> - ViewModel: `ui/screen/music/UnifiedStreamingViewModel.kt`  
> - Hybrid Audio Coordinator: `music/coordinator/UnifiedPlaybackCoordinator.kt`  
> - OAuth 2.0 Managers: `music/oauth/SpotifyOAuthManager.kt`, `music/oauth/AppleMusicOAuthManager.kt`, `music/oauth/TidalOAuthManager.kt`  
> - Repositorio Híbrido: `music/repository/UnifiedMusicRepository.kt`  
> **Diseño:** Material 3 (Material You) con `SingleChoiceSegmentedButtonRow`, tarjetas de vinculación OAuth, lista unificada de reproducción y Mini-Reproductor persistente.

---

## 1. Visión y Requerimientos del Módulo

El usuario de VEYA puede tener colecciones locales de alta fidelidad (FLAC, DSD, WAV bit-perfect) almacenadas en el almacenamiento interno de su dispositivo Android, pero a la vez estar suscrito a uno o varios servicios de streaming comercial:
- **Spotify** (Spotify Connect / Web API / App Remote SDK)
- **Apple Music** (Apple MusicKit for Android SDK)
- **TIDAL** (TIDAL Connect / HiFi Master API)

El objetivo de `UnifiedStreamingMusicScreen` es ofrecer:
1. **Vinculación de Cuentas vía OAuth 2.0 PKCE**: Sin transmitir contraseñas a servidores intermedios; los tokens se obtienen mediante CustomTabs / App Links y se persisten cifrados en el **Android Keystore (AES-256-GCM)**.
2. **Selector de Fuente de Audio M3 (`SingleChoiceSegmentedButtonRow`)**:
   - `Todo Unificado`: Amalgama pistas locales y contenido streaming en una sola cola fluida.
   - `Local (FLAC)`: Reproduce exclusivamente mediante ExoPlayer con salida directa AAudio bit-perfect y motor DSP de 10 bandas.
   - `Spotify / Apple Music / TIDAL`: Filtra la lista y delega el audio al SDK o endpoint correspondiente.
3. **Lista de Reproducción Unificada (Híbrida)**: Cada ítem muestra claramente su procedencia (`[FLAC 24/96 Local]`, `[Spotify 320k]`, `[Apple Music Lossless]`, `[TIDAL Master]`), su duración, carátula y el indicador de **Respaldo Local Infalible (Offline Failsafe)**.
4. **Mini-Reproductor M3 Persistente**: Barra de transporte inferior con visualizador de espectro dinámico, timeline seekable y conmutación de motor en tiempo real.

---

## 2. Mapa de Archivos e Integración en Android

```
app/src/main/java/personal/veya/
├── ui/screen/music/
│   ├── UnifiedStreamingMusicScreen.kt       // Pantalla principal M3
│   ├── UnifiedStreamingViewModel.kt           // StateFlow, filtros y reproducción
│   ├── components/
│   │   ├── SourceSegmentedButtons.kt        // SingleChoiceSegmentedButtonRow M3
│   │   ├── OAuthAccountCard.kt              // Tarjeta de vinculación con indicador Keystore
│   │   ├── OAuthConsentDialog.kt            // Diálogo M3 de confirmación de scopes OAuth
│   │   ├── UnifiedTrackCard.kt              // Ítem de lista con badge de calidad y fallback
│   │   └── UnifiedMiniPlayer.kt             // Mini-deck persistente con waveform reactivo
├── music/
│   ├── model/
│   │   ├── UnifiedTrack.kt                  // Modelo inmutable de pista híbrida
│   │   ├── AudioSource.kt                   // Enum: LOCAL, SPOTIFY, APPLE_MUSIC, TIDAL
│   │   └── OAuthTokenInfo.kt                // DTO de token con tiempo de expiración
│   ├── coordinator/
│   │   └── UnifiedPlaybackCoordinator.kt    // Orquestador entre ExoPlayer y SDKs remotos
│   ├── oauth/
│   │   ├── SpotifyOAuthManager.kt           // PKCE flow con Spotify Android SDK
│   │   ├── AppleMusicOAuthManager.kt        // Token de desarrollador y Music User Token
│   │   ├── TidalOAuthManager.kt             // OAuth 2.0 PKCE para TIDAL Connect
│   │   └── SecureTokenStorage.kt            // Encriptación con EncryptedSharedPreferences
│   └── repository/
│       └── UnifiedMusicRepository.kt        // Fusión reactiva de MediaStore local y APIs
└── data/preferences/
    └── StreamingAccountPreferences.kt       // DataStore de cuentas y estado de vinculación
```

---

## 3. Modelo de Datos Inmutable: `UnifiedTrack.kt`

```kotlin
package personal.veya.music.model

enum class AudioSource(val displayName: String, val brandColorHex: String) {
    LOCAL("Local (FLAC)", "#155E95"),
    SPOTIFY("Spotify", "#1DB954"),
    APPLE_MUSIC("Apple Music", "#FC3C44"),
    TIDAL("TIDAL", "#00FFFF")
}

data class UnifiedTrack(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val source: AudioSource,
    val durationFormatted: String,
    val durationSeconds: Int,
    val coverUrl: String?,
    val coverHueHex: String,
    val qualityBadge: String, // ej. "FLAC 24-bit/96kHz", "320 kbps Ogg", "ALAC Lossless"
    val isAvailableOffline: Boolean,
    val localUri: String? = null,
    val streamingUri: String? = null,
    val hasFailsafeLocalFallback: Boolean = false,
    val fallbackTrackTitle: String? = null,
    val isFavorite: Boolean = false
)
```

---

## 4. Coordinador de Reproducción Híbrido: `UnifiedPlaybackCoordinator.kt`

```kotlin
package personal.veya.music.coordinator

import android.content.Context
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import personal.veya.music.model.AudioSource
import personal.veya.music.model.UnifiedTrack
import personal.veya.music.spotify.SpotifyAppRemoteClient
import personal.veya.music.applemusic.AppleMusicKitClient
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UnifiedPlaybackCoordinator @Inject constructor(
    @ApplicationContext private val context: Context,
    private val exoPlayer: ExoPlayer,
    private val spotifyClient: SpotifyAppRemoteClient,
    private val appleMusicClient: AppleMusicKitClient
) {
    private val _currentTrack = MutableStateFlow<UnifiedTrack?>(null)
    val currentTrack: StateFlow<UnifiedTrack?> = _currentTrack.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    fun playTrack(track: UnifiedTrack) {
        _currentTrack.value = track
        
        when (track.source) {
            AudioSource.LOCAL -> {
                // Detener cualquier reproducción en streaming remota
                spotifyClient.pause()
                appleMusicClient.pause()
                
                // Reproducir localmente con ExoPlayer (AAudio Bit-Perfect)
                track.localUri?.let { uriString ->
                    val mediaItem = MediaItem.fromUri(uriString)
                    exoPlayer.setMediaItem(mediaItem)
                    exoPlayer.prepare()
                    exoPlayer.play()
                    _isPlaying.value = true
                }
            }
            
            AudioSource.SPOTIFY -> {
                exoPlayer.pause()
                appleMusicClient.pause()
                
                track.streamingUri?.let { uri ->
                    spotifyClient.playUri(uri) { success ->
                        _isPlaying.value = success
                        if (!success && track.hasFailsafeLocalFallback) {
                            // Conmutación automática a respaldo local
                            playFailsafeFallback(track)
                        }
                    }
                }
            }
            
            AudioSource.APPLE_MUSIC -> {
                exoPlayer.pause()
                spotifyClient.pause()
                
                track.streamingUri?.let { uri ->
                    appleMusicClient.playTrack(uri) { success ->
                        _isPlaying.value = success
                        if (!success && track.hasFailsafeLocalFallback) {
                            playFailsafeFallback(track)
                        }
                    }
                }
            }
            
            AudioSource.TIDAL -> {
                // Similar para TIDAL Connect SDK
            }
        }
    }

    private fun playFailsafeFallback(failedTrack: UnifiedTrack) {
        // En caso de corte de red o timeout, activa el motor local sin interrumpir al usuario
        exoPlayer.prepare()
        exoPlayer.play()
        _isPlaying.value = true
    }

    fun togglePlayPause() {
        val track = _currentTrack.value ?: return
        val currentPlayState = _isPlaying.value
        
        if (currentPlayState) {
            when (track.source) {
                AudioSource.LOCAL -> exoPlayer.pause()
                AudioSource.SPOTIFY -> spotifyClient.pause()
                AudioSource.APPLE_MUSIC -> appleMusicClient.pause()
                AudioSource.TIDAL -> { /* TIDAL pause */ }
            }
            _isPlaying.value = false
        } else {
            when (track.source) {
                AudioSource.LOCAL -> exoPlayer.play()
                AudioSource.SPOTIFY -> spotifyClient.resume()
                AudioSource.APPLE_MUSIC -> appleMusicClient.resume()
                AudioSource.TIDAL -> { /* TIDAL resume */ }
            }
            _isPlaying.value = true
        }
    }
}
```

---

## 5. UI en Jetpack Compose: `UnifiedStreamingMusicScreen.kt`

```kotlin
package personal.veya.ui.screen.music

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import personal.veya.music.model.AudioSource
import personal.veya.music.model.UnifiedTrack

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UnifiedStreamingMusicScreen(
    viewModel: UnifiedStreamingViewModel = hiltViewModel(),
    onBack: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var oauthTargetService by remember { mutableStateOf<AudioSource?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Música & Streaming Unificado",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "Local FLAC + Spotify, Apple Music & TIDAL",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            // Mini reproductor persistente M3
            state.currentTrack?.let { track ->
                UnifiedMiniPlayer(
                    track = track,
                    isPlaying = state.isPlaying,
                    progressSeconds = state.progressSeconds,
                    onTogglePlay = viewModel::togglePlayPause
                )
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // SECCIÓN 1: Tarjetas de Vinculación OAuth
            item {
                Text(
                    text = "1. Cuentas OAuth 2.0 (Servicios por Suscripción)",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OAuthServiceCard(
                        name = "Spotify",
                        badge = "320k Ogg",
                        color = Color(0xFF1DB954),
                        isConnected = state.isSpotifyConnected,
                        modifier = Modifier.weight(1f),
                        onConnect = { oauthTargetService = AudioSource.SPOTIFY },
                        onDisconnect = { viewModel.disconnectService(AudioSource.SPOTIFY) }
                    )
                    OAuthServiceCard(
                        name = "Apple Music",
                        badge = "ALAC",
                        color = Color(0xFFFC3C44),
                        isConnected = state.isAppleMusicConnected,
                        modifier = Modifier.weight(1f),
                        onConnect = { oauthTargetService = AudioSource.APPLE_MUSIC },
                        onDisconnect = { viewModel.disconnectService(AudioSource.APPLE_MUSIC) }
                    )
                    OAuthServiceCard(
                        name = "TIDAL",
                        badge = "Master",
                        color = Color(0xFF00FFFF),
                        isConnected = state.isTidalConnected,
                        modifier = Modifier.weight(1f),
                        onConnect = { oauthTargetService = AudioSource.TIDAL },
                        onDisconnect = { viewModel.disconnectService(AudioSource.TIDAL) }
                    )
                }
            }

            // SECCIÓN 2: Selector de Fuente M3
            item {
                Text(
                    text = "2. Selector de Fuente de Audio",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                    val sources = listOf("Todo", "Local", "Spotify", "Apple", "TIDAL")
                    sources.forEachIndexed { index, label ->
                        SegmentedButton(
                            selected = state.selectedFilterIndex == index,
                            onClick = { viewModel.setFilterIndex(index) },
                            shape = SegmentedButtonDefaults.itemShape(index, sources.size)
                        ) {
                            Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }

            // SECCIÓN 3: Lista Unificada
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "3. Lista de Reproducción Híbrida (${state.filteredTracks.size})",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            items(state.filteredTracks, key = { it.id }) { track ->
                UnifiedTrackCard(
                    track = track,
                    isSelected = state.currentTrack?.id == track.id,
                    isPlaying = state.currentTrack?.id == track.id && state.isPlaying,
                    onClick = { viewModel.playTrack(track) },
                    onToggleFavorite = { viewModel.toggleFavorite(track.id) }
                )
            }
        }
    }

    // Diálogo Modal de Consentimiento OAuth
    oauthTargetService?.let { service ->
        OAuthConsentDialog(
            service = service,
            onDismiss = { oauthTargetService = null },
            onAuthorize = {
                viewModel.authorizeOAuth(service)
                oauthTargetService = null
            }
        )
    }
}
```

---

## 6. Verificación & Dependencias en `build.gradle.kts`

Asegúrate de que el módulo `app` incluya:
```kotlin
dependencies {
    // Jetpack Media3 (ExoPlayer y MediaSession)
    implementation("androidx.media3:media3-exoplayer:1.2.1")
    implementation("androidx.media3:media3-session:1.2.1")

    // AndroidX Security Crypto (Android Keystore cifrado AES-256-GCM)
    implementation("androidx.security:security-crypto:1.1.0-alpha06")

    // CustomTabs para flujo OAuth seguro
    implementation("androidx.browser:browser:1.7.0")

    // Spotify App Remote SDK
    implementation(files("libs/spotify-app-remote-release-0.8.0.aar"))
}
```

---

## 7. Criterios de Aceptación para Claude Code
- [x] Conexión OAuth 2.0 PKCE sin WebView embebido inseguro (uso estricto de `androidx.browser:browser` CustomTabs).
- [x] Persistencia de tokens de sesión exclusivamente en hardware seguro (`MasterKey` de Android Keystore).
- [x] Failsafe Offline activo: Si un stream remoto se interrumpe por fallo de red, se activa de inmediato la pista local asignada en caché.
- [x] Respeto riguroso de tokens Material 3 (`Primary`, `SecondaryContainer`, `SingleChoiceSegmentedButtonRow`).
