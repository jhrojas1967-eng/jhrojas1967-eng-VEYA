# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: PANTALLA "VOZ Y PERSONALIDAD" (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega de Pantalla de Ajustes de Voz & Temperamento para Claude Code  
**Documento:** `entregas/10_specs_screen_voice_m3_para_claude.md`  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX DataStore & Android TextToSpeech.

---

## 1. RESUMEN Y ARQUITECTURA GENERAL

La pantalla **Voz y Personalidad** (`VoicePersonalityScreen.kt`) permite al usuario configurar:
1. **El perfil vocal on-device**: Catálogo de 4 voces neuronales locales (**Aura**, **Ópalo**, **Céfiro**, **Vesper**).
2. **Controles de prosodia acústica**:
   * Slider de velocidad de habla (0.75x a 1.50x).
   * Slider de tono semitonal (-3 a +3 semitonos).
   * Conmutador M3 para pausas orgánicas reflexivas (respiración biológica).
3. **Matriz de temperamento continuo (Sliders M3 0..100)**:
   * **Calidez & Empatía**: de analítico/sobrio a afectuoso/protector.
   * **Concisión**: de telegráfico (≤15 palabras) a pedagógico/explicativo.
   * **Proactividad**: de reactivo bajo demanda a sugerencias contextuales discretas.
   * **Humor**: de formal/neutro a sutil e irónico.
4. **Persistencia**: `DataStore<Preferences>` cifrado con AndroidX Security / MasterKeys.

---

## 2. CATÁLOGO DE PERFILES VOCALES LOCALES

| ID | Nombre | Arquetipo | Timbre & Frecuencia | Rol Recomendado | Frase de Muestra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `voice_aura` | **Aura** | Calmada, cálida y reflexiva | Femenino / Cálido medio (F0 ≈ 195 Hz) | Bienestar & Rutina Matinal | *"Buenos días, José. He preparado tu rutina matinal con música suave para empezar con total claridad mental."* |
| `voice_opalo` | **Ópalo** | Empático, cercano y conversacional | Neutro / Terciopelo (F0 ≈ 145 Hz) | Compañero Cotidiano | *"Aquí tienes los dos titulares clave de hoy. Cuando quieras, revisamos tus notas de trabajo pendientes."* |
| `voice_cefiro` | **Céfiro** | Ágil, dinámico y pedagógico | Masculino / Claro (F0 ≈ 130 Hz) | Enfoque & Productividad | *"He detectado 90 minutos continuos de concentración. Te sugiero una pausa activa de 3 minutos para estirar."* |
| `voice_vesper` | **Vesper** | Grave, envolvente y nocturno | Barítono suave / Texturado (F0 ≈ 98 Hz) | Desconexión Nocturna & DSP | *"La jornada ha concluido. Atenúo la iluminación de pantalla y activo el piano de fondo para tu descanso."* |

---

## 3. CÓDIGO FUENTE JETPACK COMPOSE COMPLETO

### 3.1. `VoicePersonalityScreen.kt`

```kotlin
package personal.veya.ui.screen.settings

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import personal.veya.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VoicePersonalityScreen(
    onNavigateBack: () -> Unit,
    viewModel: VoicePersonalityViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Voz y Personalidad",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Síntesis neuronal on-device y temperamento",
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
            // SECCIÓN 1: SELECTOR DE PERFIL DE VOZ (Aura, Ópalo, Céfiro, Vesper)
            item {
                SectionHeader(title = "1. Selector de Perfil de Voz (Síntesis On-Device)")
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    state.availableVoices.forEach { voice ->
                        VoiceCard(
                            voice = voice,
                            isSelected = voice.id == state.selectedVoiceId,
                            isPlaying = voice.id == state.playingSampleId,
                            onSelect = { viewModel.selectVoice(voice.id) },
                            onPlaySample = { viewModel.togglePlaySample(voice.id) }
                        )
                    }
                }
            }

            // SECCIÓN 2: CONTROLES DE PROSODIA (Sliders de Velocidad y Tono)
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
                            text = "2. Controles de Prosodia y Dinámica Acústica",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // Slider de Velocidad (0.75x a 1.50x)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Velocidad de habla", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                text = String.format("%.2fx", state.speed),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = state.speed,
                            onValueChange = viewModel::setSpeed,
                            valueRange = 0.75f..1.50f,
                            steps = 14
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("0.75x (Reflexiva)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("1.00x", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("1.50x (Ágil)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Slider de Tono / Pitch (-3 a +3 semitonos)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Tono acústico (Pitch)", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(
                                text = "${if (state.pitch > 0) "+${state.pitch}" else "${state.pitch}"} st",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Slider(
                            value = state.pitch.toFloat(),
                            onValueChange = { viewModel.setPitch(it.toInt()) },
                            valueRange = -3f..3f,
                            steps = 5
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("-3 st (Profundo)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("0 st (Natural)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            Text("+3 st (Claro)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Pausas Orgánicas (Switch M3)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Pausas orgánicas de respiración",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Inserta cadencia biológica y micro-respiros reflexivos",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = state.organicPauses,
                                onCheckedChange = viewModel::setOrganicPauses
                            )
                        }
                    }
                }
            }

            // SECCIÓN 3: MATRIZ DE TEMPERAMENTO (Calidez, Concisión, Proactividad)
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
                            text = "3. Matriz de Temperamento y Comunicación",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // Calidez
                        ContinuousTraitSlider(
                            title = "Calidez y Empatía",
                            value = state.warmth,
                            onValueChange = viewModel::setWarmth,
                            leftLabel = "Sobrio y distante",
                            rightLabel = "Afectuoso y cercano"
                        )

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Concisión
                        ContinuousTraitSlider(
                            title = "Concisión en Respuestas",
                            value = state.conciseness,
                            onValueChange = viewModel::setConciseness,
                            leftLabel = "Explicativo / Didáctico",
                            rightLabel = "Telegráfico (≤ 15 palabras)"
                        )

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Proactividad
                        ContinuousTraitSlider(
                            title = "Nivel de Proactividad",
                            value = state.proactivity,
                            onValueChange = viewModel::setProactivity,
                            leftLabel = "Solo bajo demanda",
                            rightLabel = "Sugerencias contextuales activas"
                        )

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Humor
                        ContinuousTraitSlider(
                            title = "Humor y Espontaneidad",
                            value = state.humor,
                            onValueChange = viewModel::setHumor,
                            leftLabel = "Riguroso y formal",
                            rightLabel = "Cálido e irónico"
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }
}
```

### 3.2. Subcomponente `ContinuousTraitSlider`

```kotlin
@Composable
fun ContinuousTraitSlider(
    title: String,
    value: Int,
    onValueChange: (Int) -> Unit,
    leftLabel: String,
    rightLabel: String
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text(
                    text = "$value%",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                )
            }
        }
        Slider(
            value = value.toFloat(),
            onValueChange = { onValueChange(it.toInt()) },
            valueRange = 0f..100f
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = leftLabel, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            Text(text = rightLabel, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
        }
    }
}
```

---

## 4. VIEWMODEL Y DATASTORE REPOSITORY

### 4.1. `VoicePreferences.kt`

```kotlin
package personal.veya.data.preferences

import androidx.datastore.preferences.core.*

object VoicePreferenceKeys {
    val SELECTED_VOICE_ID = stringPreferencesKey("voice_selected_id")
    val SPEED = floatPreferencesKey("voice_speed")
    val PITCH = intPreferencesKey("voice_pitch")
    val ORGANIC_PAUSES = booleanPreferencesKey("voice_organic_pauses")
    val WARMTH = intPreferencesKey("trait_warmth")
    val CONCISENESS = intPreferencesKey("trait_conciseness")
    val PROACTIVITY = intPreferencesKey("trait_proactivity")
    val HUMOR = intPreferencesKey("trait_humor")
}
```

### 4.2. `VoicePersonalityViewModel.kt`

```kotlin
package personal.veya.ui.screen.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import personal.veya.data.repository.VoiceRepository
import personal.veya.audio.TextToSpeechManager
import javax.inject.Inject

data class VoiceUiState(
    val selectedVoiceId: String = "voice_aura",
    val speed: Float = 1.0f,
    val pitch: Int = 0,
    val organicPauses: Boolean = true,
    val warmth: Int = 75,
    val conciseness: Int = 65,
    val proactivity: Int = 50,
    val humor: Int = 30,
    val playingSampleId: String? = null,
    val availableVoices: List<VoiceProfileModel> = emptyList()
)

@HiltViewModel
class VoicePersonalityViewModel @Inject constructor(
    private val voiceRepository: VoiceRepository,
    private val ttsManager: TextToSpeechManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(VoiceUiState())
    val uiState: StateFlow<VoiceUiState> = _uiState.asStateFlow()

    init {
        loadPreferences()
    }

    private fun loadPreferences() {
        viewModelScope.launch {
            voiceRepository.voicePreferencesFlow.collect { prefs ->
                _uiState.update { current ->
                    current.copy(
                        selectedVoiceId = prefs.selectedVoiceId,
                        speed = prefs.speed,
                        pitch = prefs.pitch,
                        organicPauses = prefs.organicPauses,
                        warmth = prefs.warmth,
                        conciseness = prefs.conciseness,
                        proactivity = prefs.proactivity,
                        humor = prefs.humor,
                        availableVoices = voiceRepository.getVoiceCatalog()
                    )
                }
            }
        }
    }

    fun selectVoice(voiceId: String) {
        viewModelScope.launch {
            voiceRepository.saveSelectedVoice(voiceId)
        }
    }

    fun setSpeed(speed: Float) {
        viewModelScope.launch {
            voiceRepository.saveSpeed(speed)
        }
    }

    fun setPitch(pitch: Int) {
        viewModelScope.launch {
            voiceRepository.savePitch(pitch)
        }
    }

    fun setOrganicPauses(enabled: Boolean) {
        viewModelScope.launch {
            voiceRepository.saveOrganicPauses(enabled)
        }
    }

    fun setWarmth(value: Int) {
        viewModelScope.launch { voiceRepository.saveWarmth(value) }
    }

    fun setConciseness(value: Int) {
        viewModelScope.launch { voiceRepository.saveConciseness(value) }
    }

    fun setProactivity(value: Int) {
        viewModelScope.launch { voiceRepository.saveProactivity(value) }
    }

    fun setHumor(value: Int) {
        viewModelScope.launch { voiceRepository.saveHumor(value) }
    }

    fun togglePlaySample(voiceId: String) {
        if (_uiState.value.playingSampleId == voiceId) {
            ttsManager.stop()
            _uiState.update { it.copy(playingSampleId = null) }
        } else {
            _uiState.update { it.copy(playingSampleId = voiceId) }
            val voice = _uiState.value.availableVoices.find { it.id == voiceId }
            voice?.let {
                ttsManager.speakSample(
                    sampleText = it.sampleText,
                    voiceId = voiceId,
                    speed = _uiState.value.speed,
                    pitch = _uiState.value.pitch,
                    onComplete = {
                        _uiState.update { state -> state.copy(playingSampleId = null) }
                    }
                )
            }
        }
    }

    fun resetToDefaults() {
        viewModelScope.launch {
            voiceRepository.resetDefaults()
        }
    }
}
```

---

## 5. INYECCIÓN AL MOTOR DE LENGUAJE (PROMPT LOCAL)

Los valores de la matriz de temperamento se formatean en `SystemPromptBuilder.kt` para calibrar el modelo LLM on-device (Gemini Nano):

```kotlin
fun buildTemperamentInstruction(warmth: Int, conciseness: Int, proactivity: Int): String {
    val verbosityRule = when {
        conciseness > 75 -> "Sé extremadamente telegráfico y directo. Respuestas de máximo 15 a 20 palabras."
        conciseness < 35 -> "Sé explicativo, didáctico y enriquecedor sin ser redundante."
        else -> "Mantén un equilibrio sobrio de 2 a 3 oraciones por respuesta."
    }

    val warmthRule = when {
        warmth > 70 -> "Usa un trato cálido, protector y profundamente empático."
        warmth < 30 -> "Mantén un tono sobrio, neutro y eminentemente analítico."
        else -> "Trato educado, cercano y cordial."
    }

    return "Reglas de estilo: $verbosityRule $warmthRule"
}
```

---

## 6. INSTRUCCIONES DE INTEGRACIÓN PARA CLAUDE CODE

Copia las siguientes instrucciones a Claude Code en la consola de Android:

```text
Claude, implementa la pantalla de Ajustes "Voz y Personalidad" en Jetpack Compose:
1. Revisa 'entregas/10_specs_screen_voice_m3_para_claude.md'.
2. Ubica los archivos en:
   - personal.veya.ui.screen.settings.VoicePersonalityScreen.kt
   - personal.veya.ui.screen.settings.VoicePersonalityViewModel.kt
   - personal.veya.data.preferences.VoicePreferenceKeys.kt
3. Asegura el uso de Material 3 (Slider continuo, ElevatedCard con shape = 24.dp, TopAppBar con flecha de retorno).
4. Verifica que los 4 perfiles (Aura, Ópalo, Céfiro, Vesper) reproduzcan sus muestras de audio con TextToSpeechManager.
```
