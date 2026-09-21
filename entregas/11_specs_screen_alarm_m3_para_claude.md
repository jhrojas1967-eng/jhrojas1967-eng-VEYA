# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: PANTALLA "MÚSICA DE ALARMA" (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega de Pantalla de Ajustes de Alarma & Despertar Progresivo para Claude Code  
**Documento:** `entregas/11_specs_screen_alarm_m3_para_claude.md`  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX DataStore, AlarmManager & ForegroundService.

---

## 1. RESUMEN Y ARQUITECTURA GENERAL

La pantalla **Música de Alarma** (`AlarmMusicScreen.kt`) permite al usuario configurar:
1. **Selector de hora con reloj circular M3**:
   * Implementación de `androidx.compose.material3.TimePicker` con soporte para dial analógico circular interactivo y modo numérico directo.
2. **Catálogo de pistas de despertar armónico (Almacenamiento Local)**:
   * Pistas locales en FLAC de alta resolución (24-bit/96kHz) y generadores bioacústicos on-device (ruido rosa, ondas alfa 432Hz) sin telemetría ni streaming externo.
3. **Control de duración de Fade-in (1 a 5 minutos)**:
   * Slider M3 continuo con pasos discretos para definir la rampa de ascenso acústico.
4. **Despertar progresivo bioacústico (Toggle M3 Switch)**:
   * Activación del ascenso logarítmico de volumen desde 0 dB y rampa de iluminación de pantalla para simular el amanecer sin picos de cortisol matinal.
5. **Programación en Android**:
   * `AlarmManager.setExactAndAllowWhileIdle()` mediante `AlarmClockInfo` para garantizar activación bajo modo Doze y modo avión.

---

## 2. ESQUEMA DE DATOS Y PREFERENCIAS

### `AlarmPreferences.kt`

```kotlin
package personal.veya.data.preferences

import androidx.datastore.preferences.core.*

object AlarmPreferenceKeys {
    val ALARM_HOUR = intPreferencesKey("alarm_hour") // 0..23
    val ALARM_MINUTE = intPreferencesKey("alarm_minute") // 0..59
    val ALARM_ENABLED = booleanPreferencesKey("alarm_enabled")
    val SELECTED_TRACK_ID = stringPreferencesKey("alarm_selected_track_id")
    val PROGRESSIVE_WAKEUP = booleanPreferencesKey("alarm_progressive_wakeup")
    val FADE_DURATION_MINUTES = intPreferencesKey("alarm_fade_duration_minutes") // 1..5
    val MAX_VOLUME = intPreferencesKey("alarm_max_volume") // 40..100
    val SCREEN_BRIGHTNESS_RAMP = booleanPreferencesKey("alarm_brightness_ramp")
    val AVATAR_GREETING_ON_DISMISS = booleanPreferencesKey("alarm_avatar_greeting")
}
```

---

## 3. CÓDIGO FUENTE JETPACK COMPOSE COMPLETO

### 3.1. `AlarmMusicScreen.kt`

```kotlin
package personal.veya.ui.screen.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
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
import personal.veya.domain.model.AlarmTrackModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlarmMusicScreen(
    onNavigateBack: () -> Unit,
    viewModel: AlarmMusicViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    var showTimePickerDialog by remember { mutableStateOf(false) }

    val timePickerState = rememberTimePickerState(
        initialHour = state.hour,
        initialMinute = state.minute,
        is24Hour = false
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Música de Alarma",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Despertar progresivo y pistas locales",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                },
                actions = {
                    IconButton(onClick = viewModel::resetToDefaults) {
                        Icon(Icons.Default.Refresh, contentDescription = "Restaurar valores de fábrica")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.surface
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. SELECTOR DE HORA CON RELOJ CIRCULAR M3
            item {
                ElevatedCard(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "1. Selector de Hora Matinal",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Switch(
                                checked = state.enabled,
                                onCheckedChange = viewModel::setAlarmEnabled
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Botón interactivo para abrir el TimePickerDialog con reloj circular M3
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = MaterialTheme.colorScheme.surface,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showTimePickerDialog = true }
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = String.format("%02d:%02d %s",
                                            if (state.hour % 12 == 0) 12 else state.hour % 12,
                                            state.minute,
                                            if (state.hour < 12) "AM" else "PM"
                                        ),
                                        style = MaterialTheme.typography.headlineLarge,
                                        fontWeight = FontWeight.Black,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "Pulsa para ajustar con el dial analógico M3",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                Button(
                                    onClick = { showTimePickerDialog = true },
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Modificar")
                                }
                            }
                        }
                    }
                }
            }

            // 2. LISTA DE PISTAS DE AUDIO LOCALES
            item {
                SectionHeader(title = "2. Pistas de Despertar Armónico (Almacenamiento Local)")
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    state.tracks.forEach { track ->
                        AlarmTrackCard(
                            track = track,
                            isSelected = track.id == state.selectedTrackId,
                            isPlaying = track.id == state.playingTrackId,
                            onSelect = { viewModel.selectTrack(track.id) },
                            onTogglePlay = { viewModel.togglePlayTrack(track.id) }
                        )
                    }
                }
            }

            // 3. CONFIGURACIÓN DE FADE-IN Y 4. TOGGLE DESPERTAR PROGRESIVO
            item {
                ElevatedCard(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "3. Despertar Progresivo & Fade-in Acústico",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // 4. Toggle Despertar Progresivo
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Activar Despertar Progresivo",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Rampa de volumen desde 0 dB para evitar sobresaltos matinales",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = state.progressiveWakeup,
                                onCheckedChange = viewModel::setProgressiveWakeup
                            )
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // 3. Slider Duración de Fade-in (1 a 5 min)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Duración del Fade-in", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                text = "${state.fadeDurationMinutes} min",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = state.fadeDurationMinutes.toFloat(),
                            onValueChange = { viewModel.setFadeDurationMinutes(it.toInt()) },
                            valueRange = 1f..5f,
                            steps = 3,
                            enabled = state.progressiveWakeup
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("1 min", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("3 min (Ideal)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("5 min", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Volumen Límite de la Rampa
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Volumen Máximo", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                text = "${state.maxVolume}%",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = state.maxVolume.toFloat(),
                            onValueChange = { viewModel.setMaxVolume(it.toInt()) },
                            valueRange = 40f..100f
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }

    // DIÁLOGO OFICIAL MATERIAL 3 TIMEPICKER (DIAL CIRCULAR)
    if (showTimePickerDialog) {
        TimePickerDialog(
            onDismissRequest = { showTimePickerDialog = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.setTime(timePickerState.hour, timePickerState.minute)
                        showTimePickerDialog = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showTimePickerDialog = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            TimePicker(state = timePickerState)
        }
    }
}
```

---

## 4. DIÁLOGO REUTILIZABLE TIMEPICKERDIALOG (M3)

```kotlin
@Composable
fun TimePickerDialog(
    title: String = "Selecciona la Hora de Alarma",
    onDismissRequest: () -> Unit,
    confirmButton: @Composable () -> Unit,
    dismissButton: @Composable () -> Unit,
    content: @Composable () -> Unit,
) {
    Dialog(onDismissRequest = onDismissRequest) {
        Surface(
            shape = RoundedCornerShape(28.dp),
            tonalElevation = 6.dp,
            modifier = Modifier.width(IntrinsicSize.Min)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp),
                    text = title,
                    style = MaterialTheme.typography.labelMedium
                )
                content()
                Row(
                    modifier = Modifier
                        .height(40.dp)
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    dismissButton()
                    confirmButton()
                }
            }
        }
    }
}
```

---

## 5. SERVICIO DE REPRODUCCIÓN Y RAMPA ACÚSTICA (DSP)

### `AlarmPlaybackService.kt`

```kotlin
package personal.veya.alarm

import android.app.Service
import android.content.Intent
import android.media.MediaPlayer
import android.os.IBinder
import kotlinx.coroutines.*
import kotlin.math.pow

class AlarmPlaybackService : Service() {
    private var mediaPlayer: MediaPlayer? = null
    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val trackUri = intent?.getStringExtra("TRACK_URI") ?: return START_NOT_STICKY
        val fadeMinutes = intent.getIntExtra("FADE_MINUTES", 3)
        val maxVolume = intent.getIntExtra("MAX_VOLUME", 80) / 100f
        val isProgressive = intent.getBooleanExtra("IS_PROGRESSIVE", true)

        startForegroundNotification()

        mediaPlayer = MediaPlayer().apply {
            setDataSource(trackUri)
            isLooping = true
            setVolume(0f, 0f)
            prepare()
            start()
        }

        if (isProgressive) {
            startExponentialFadeIn(fadeMinutes, maxVolume)
        } else {
            mediaPlayer?.setVolume(maxVolume, maxVolume)
        }

        return START_STICKY
    }

    private fun startExponentialFadeIn(durationMinutes: Int, targetVolume: Float) {
        serviceScope.launch {
            val totalSteps = durationMinutes * 60 * 2 // Cada 500ms
            val stepDurationMs = 500L

            for (step in 1..totalSteps) {
                val progress = step.toFloat() / totalSteps
                // Curva cuadrática / exponencial suave
                val currentVol = progress.pow(2) * targetVolume
                mediaPlayer?.setVolume(currentVol, currentVol)
                delay(stepDurationMs)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        mediaPlayer?.stop()
        mediaPlayer?.release()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

---

## 6. INSTRUCCIONES PARA CLAUDE CODE

Copia las siguientes instrucciones a Claude en tu terminal de Android:

```text
Claude, implementa la pantalla "Música de Alarma" en Jetpack Compose:
1. Revisa el documento canónico 'entregas/11_specs_screen_alarm_m3_para_claude.md'.
2. Ubica los archivos en:
   - personal.veya.ui.screen.settings.AlarmMusicScreen.kt
   - personal.veya.ui.screen.settings.AlarmMusicViewModel.kt
   - personal.veya.alarm.AlarmPlaybackService.kt
   - personal.veya.data.preferences.AlarmPreferences.kt
3. Asegura el uso de androidx.compose.material3.TimePicker con el dial circular analógico oficial de Material 3.
4. Implementa el Slider de 1 a 5 minutos para el fade-in y el conmutador Switch para el despertar progresivo.
5. Emplea la rampa acústica exponencial en AlarmPlaybackService para garantizar que el volumen ascienda suavemente sin sobresaltos.
```
