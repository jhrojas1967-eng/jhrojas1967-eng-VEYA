# Especificación Técnica: Servicios de Música por Suscripción & Respaldo Infalible (Material 3)
## Guía de Implementación para Claude Code (Spotify, Apple Music, YouTube Music, TIDAL y Local)

> **Destinatario:** Claude Code / Equipo de Desarrollo Android (Kotlin + Jetpack Compose)  
> **Ubicaciones:**  
> - UI: `ui/screen/settings/AlarmMusicScreen.kt`  
> - Background Service: `alarm/AlarmPlaybackService.kt`  
> - Streaming: `music/spotify/SpotifyAppRemoteClient.kt`, `music/applemusic/AppleMusicKitClient.kt`  
> - Failsafe Offline: `alarm/OfflineFailsafeController.kt`  
> **Diseño:** Material 3 (Material You) con `SingleChoiceSegmentedButtonRow`, `FilterChips`, tarjetas de playlists y card de respaldo local offline.

---

## 1. El Dilema Arquitectónico y la Solución VEYA

Muchos usuarios están suscritos a **Spotify**, **Apple Music**, **YouTube Music** o **TIDAL** y desean que su alarma matinal comience con su lista de reproducción favorita (ej. *"Amanecer Acústico"* o *"Peaceful Piano"*).

### El Peligro Crítico en Android:
Si el usuario programa su alarma con una lista de Spotify o Apple Music y durante la noche:
1. El router Wi-Fi se reinicia o pierde internet.
2. El usuario activa el Modo Avión para descansar sin radiaciones/notificaciones.
3. La API o el servicio de streaming sufre lentitud o timeout (> 3 segundos).

**Resultado inaceptable:** La alarma no suena o suena en silencio, y el usuario llega tarde al trabajo.

### La Solución de VEYA: *Garantía de Despertar Infalible (Offline Failsafe)*
Al dispararse el `AlarmManager`:
1. `AlarmPlaybackService` comprueba la conectividad activa con `ConnectivityManager.getNetworkCapabilities`.
2. Si hay internet y el servicio de streaming responde en menos de 3.000 ms, inicia la reproducción en streaming aplicando la rampa suave de volumen (fade-in) mediante `AudioManager`.
3. **Si no hay conexión de datos o el streaming falla**, VEYA conmuta de forma **inmediata y transparente a la pista local de respaldo FLAC** (`/storage/emulated/0/Music/Veya/...` o generador bioacústico), garantizando que el usuario despierte puntualmente y sin sobresaltos.

---

## 2. Mapa de Archivos e Integración para Claude Code

```
app/src/main/java/personal/veya/
├── ui/screen/settings/
│   ├── AlarmMusicScreen.kt               // Pantalla M3 con selector multicanal
│   ├── components/
│   │   ├── MusicProviderSelector.kt     // FilterChips M3 (Local, Spotify, Apple, etc.)
│   │   ├── StreamingAccountCard.kt      // Estado de conexión y botón de vinculación
│   │   ├── StreamingPlaylistCard.kt     // Tarjeta de lista con URI y preview
│   │   └── OfflineFailsafeCard.kt       // Configuración de respaldo local infalible
│   └── AlarmMusicViewModel.kt           // Gestión de estado y proveedores
├── music/
│   ├── model/
│   │   ├── MusicSourceProvider.kt       // Enum: LOCAL, BIOACOUSTIC, SPOTIFY, APPLE_MUSIC, YT_MUSIC, TIDAL
│   │   └── StreamingPlaylist.kt         // Entidad inmutable de lista remota
│   ├── spotify/
│   │   └── SpotifyAppRemoteClient.kt    // Wrapper del Spotify App Remote SDK
│   ├── applemusic/
│   │   └── AppleMusicKitClient.kt       // Wrapper de Apple MusicKit for Android
│   └── local/
│       └── LocalAudioEngine.kt          // Reproductor ExoPlayer de audio local FLAC
├── alarm/
│   ├── AlarmScheduler.kt                // AlarmManager con setExactAndAllowWhileIdle
│   ├── AlarmPlaybackService.kt          // ForegroundService con WAKE_LOCK y control dual
│   └── OfflineFailsafeController.kt     // Verificación de red y fallback automático
└── data/preferences/
    └── AlarmMusicPreferences.kt         // DataStore de proveedor, URIs y fallback track
```

---

## 3. Código Kotlin del Servicio Dual: `AlarmPlaybackService.kt`

```kotlin
package personal.veya.alarm

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.lifecycle.LifecycleService
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.*
import personal.veya.R
import personal.veya.music.local.LocalAudioEngine
import personal.veya.music.model.MusicSourceProvider
import personal.veya.music.spotify.SpotifyAppRemoteClient
import javax.inject.Inject

@AndroidEntryPoint
class AlarmPlaybackService : LifecycleService() {

    @Inject lateinit var spotifyClient: SpotifyAppRemoteClient
    @Inject lateinit var localAudioEngine: LocalAudioEngine
    @Inject lateinit var failsafeController: OfflineFailsafeController

    private var wakeLock: PowerManager.WakeLock? = null
    private val serviceScope = CoroutineScope(Dispatchers.Main + Job())

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)

        // Adquirir WakeLock para que el móvil no entre en Doze mode durante la alarma
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "VEYA:AlarmPlaybackWakeLock"
        ).apply {
            acquire(10 * 60 * 1000L) // 10 minutos máximo
        }

        startForeground(NOTIFICATION_ID, createForegroundNotification())

        val provider = intent?.getStringExtra("EXTRA_PROVIDER") ?: MusicSourceProvider.LOCAL.name
        val streamUri = intent?.getStringExtra("EXTRA_STREAM_URI") ?: "spotify:playlist:37i9dQZF1DX0b1hHYQtJjp"
        val fallbackPath = intent?.getStringExtra("EXTRA_FALLBACK_PATH") ?: "/storage/emulated/0/Music/Veya/Amanecer_Re_Mayor.flac"
        val fadeMinutes = intent?.getIntExtra("EXTRA_FADE_MINUTES", 3) ?: 3
        val maxVolumePercent = intent?.getIntExtra("EXTRA_MAX_VOLUME", 80) ?: 80

        serviceScope.launch {
            triggerSmartAlarm(
                provider = MusicSourceProvider.valueOf(provider),
                streamUri = streamUri,
                fallbackPath = fallbackPath,
                fadeMinutes = fadeMinutes,
                maxVolumePercent = maxVolumePercent
            )
        }

        return START_NOT_STICKY
    }

    private suspend fun triggerSmartAlarm(
        provider: MusicSourceProvider,
        streamUri: String,
        fallbackPath: String,
        fadeMinutes: Int,
        maxVolumePercent: Int
    ) {
        val hasInternet = isNetworkAvailable()

        if (provider != MusicSourceProvider.LOCAL && provider != MusicSourceProvider.BIOACOUSTIC && hasInternet) {
            // Intentar reproducir en Streaming (Spotify, Apple Music) con timeout de 3 segundos
            val playSuccess = withTimeoutOrNull(3000L) {
                when (provider) {
                    MusicSourceProvider.SPOTIFY -> spotifyClient.playPlaylist(streamUri)
                    else -> false
                }
            } ?: false

            if (playSuccess) {
                // Iniciar rampa suave de volumen en AudioManager
                startAudioManagerFadeIn(fadeMinutes, maxVolumePercent)
            } else {
                // FALLBACK OFFLINE: El servicio de streaming falló o tardó demasiado
                triggerLocalFallback(fallbackPath, fadeMinutes, maxVolumePercent)
            }
        } else {
            // Sin conexión o proveedor local: Reproducción garantizada on-device
            triggerLocalFallback(fallbackPath, fadeMinutes, maxVolumePercent)
        }
    }

    private fun triggerLocalFallback(path: String, fadeMinutes: Int, maxVolume: Int) {
        localAudioEngine.playWithDspFadeIn(
            filePath = path,
            durationMinutes = fadeMinutes,
            targetVolumePercent = maxVolume
        )
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun startAudioManagerFadeIn(fadeMinutes: Int, targetPercent: Int) {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val maxStreamVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        val targetVolume = ((maxStreamVolume * targetPercent) / 100).coerceAtLeast(1)

        serviceScope.launch {
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, 1, 0)
            val stepTimeMs = (fadeMinutes * 60 * 1000L) / targetVolume
            for (step in 1..targetVolume) {
                delay(stepTimeMs)
                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, step, 0)
            }
        }
    }

    private fun createForegroundNotification(): Notification {
        val channelId = "veya_alarm_channel"
        val channel = NotificationChannel(channelId, "Alarma Matinal VEYA", NotificationManager.IMPORTANCE_HIGH)
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Alarma VEYA en Curso")
            .setContentText("Despertar sereno progresivo activo")
            .setSmallIcon(R.drawable.ic_alarm)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        wakeLock?.let { if (it.isHeld) it.release() }
        serviceScope.cancel()
    }

    companion object {
        private const val NOTIFICATION_ID = 2001
    }
}
```

---

## 4. Wrapper de Spotify: `SpotifyAppRemoteClient.kt`

```kotlin
package personal.veya.music.spotify

import android.content.Context
import com.spotify.android.appremote.api.ConnectionParams
import com.spotify.android.appremote.api.Connector
import com.spotify.android.appremote.api.SpotifyAppRemote
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.suspendCancellableCoroutine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

@Singleton
class SpotifyAppRemoteClient @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var spotifyAppRemote: SpotifyAppRemote? = null

    suspend fun connect(): Boolean = suspendCancellableCoroutine { continuation ->
        val connectionParams = ConnectionParams.Builder(SPOTIFY_CLIENT_ID)
            .setRedirectUri(SPOTIFY_REDIRECT_URI)
            .showAuthView(false)
            .build()

        SpotifyAppRemote.connect(context, connectionParams, object : Connector.ConnectionListener {
            override fun onConnected(appRemote: SpotifyAppRemote) {
                spotifyAppRemote = appRemote
                continuation.resume(true)
            }

            override fun onFailure(throwable: Throwable) {
                spotifyAppRemote = null
                continuation.resume(false)
            }
        })
    }

    suspend fun playPlaylist(playlistUri: String): Boolean {
        if (spotifyAppRemote == null) {
            val connected = connect()
            if (!connected) return false
        }
        return try {
            spotifyAppRemote?.playerApi?.play(playlistUri)
            true
        } catch (e: Exception) {
            false
        }
    }

    companion object {
        private const val SPOTIFY_CLIENT_ID = "veya_spotify_client_id"
        private const val SPOTIFY_REDIRECT_URI = "veya://spotify-callback"
    }
}
```

---

## 5. Esquema DataStore (`AlarmMusicPreferenceKeys.kt`)

```kotlin
package personal.veya.data.preferences

import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey

object AlarmMusicPreferenceKeys {
    // Proveedor activo: LOCAL, BIOACOUSTIC, SPOTIFY, APPLE_MUSIC, YT_MUSIC, TIDAL
    val MUSIC_PROVIDER = stringPreferencesKey("alarm_music_provider") 
    
    // URIs de streaming seleccionadas
    val SPOTIFY_PLAYLIST_URI = stringPreferencesKey("alarm_spotify_playlist_uri")
    val APPLE_MUSIC_PLAYLIST_URI = stringPreferencesKey("alarm_apple_music_playlist_uri")
    
    // Pista local elegida
    val LOCAL_TRACK_ID = stringPreferencesKey("alarm_local_track_id")
    
    // Garantía infalible offline
    val OFFLINE_FAILSAFE_ENABLED = booleanPreferencesKey("alarm_offline_failsafe_enabled") // default: true
    val FALLBACK_LOCAL_PATH = stringPreferencesKey("alarm_fallback_local_path")
    
    // Rampa de despertar
    val PROGRESSIVE_WAKEUP_ENABLED = booleanPreferencesKey("alarm_progressive_wakeup_enabled") // default: true
    val FADE_DURATION_MINUTES = intPreferencesKey("alarm_fade_duration_minutes") // 1 a 5 min
    val MAX_VOLUME_PERCENT = intPreferencesKey("alarm_max_volume_percent") // 40 a 100%
}
```

---

## 6. Prompt de Ejecución para Claude Code

```markdown
Hola Claude, implementa el soporte completo para servicios de música por suscripción (Spotify, Apple Music, YouTube Music, Tidal) y el sistema de Garantía de Despertar Infalible en la pantalla de Alarma de VEYA:

1. Modifica `AlarmMusicScreen.kt` con Material 3 para incluir:
   - Selector de proveedor (FilterChips M3).
   - Tarjetas de cuentas vinculadas y playlists de streaming.
   - Card dedicada a "Garantía de Despertar Infalible (Respaldo Local Offline)" con selector de pista FLAC de respaldo.
2. Implementa `AlarmPlaybackService.kt` con:
   - ForegroundService con PARTIAL_WAKE_LOCK.
   - Verificación de conectividad mediante ConnectivityManager.
   - Intento de reproducción de streaming con timeout de 3.000 ms.
   - Conmutación automática e instantánea al reproductor local si no hay internet o falla el streaming.
   - Rampa de volumen suave fade-in mediante AudioManager.
3. Añade el wrapper de Spotify App Remote y los esquemas DataStore en `AlarmMusicPreferenceKeys.kt`.

Consulta la especificación en `entregas/14_specs_streaming_music_spotify_apple_m3_para_claude.md`.
```
