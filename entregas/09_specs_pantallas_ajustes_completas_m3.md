# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: PANTALLAS DE AJUSTES COMPLETAS (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega Integral de Pantallas de Ajustes para Claude Code  
**Documento:** `entregas/09_specs_pantallas_ajustes_completas_m3.md`  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX DataStore & Room.

---

## 1. MAPA DE NAVEGACIÓN Y ARQUITECTURA DE PANTALLAS

Todas las pantallas extienden de `ScreenSettings` en una jerarquía unificada de Jetpack Compose Navigation:

```
ScreenSettings (Ajustes Principales)
 ├── 1. Tu Compañero          -> PartnerProfileScreen.kt
 ├── 2. Voz y Personalidad    -> VoicePersonalityScreen.kt
 ├── 3. ENTRENA (Perfiles)    -> TrainingProfilesScreen.kt
 ├── 4. Bóveda de Memoria     -> MemoryAndPrivacyScreen.kt (Especificada en entrega 08)
 ├── 5. Música de Alarma      -> AlarmMusicScreen.kt
 ├── 6. Meteorología          -> WeatherPrivacyScreen.kt
 └── 7. Medios de Noticias    -> NewsFeedsScreen.kt
```

---

## 2. ESPECIFICACIÓN DETALLADA POR PANTALLA

### 2.1. "Tu Compañero VEYA" (`PartnerProfileScreen.kt`)

* **Objetivo:** Definir la identidad del usuario, el estilo de trato lingüístico y los límites de discreción.
* **Componentes Material 3:**
  * `OutlinedTextField`: Nombre del usuario (con validación de texto limpio).
  * `SingleChoiceSegmentedButtonRow`: Estilo de trato:
    * `TU`: Informal, empático y directo.
    * `USTED`: Respetuoso, formal y sobrio.
  * `ElevatedCard` con selector de rol percibido:
    * *Compañero de Rutina*: Equilibrio entre amabilidad y rigor.
    * *Mentor de Bienestar*: Foco en salud mental y pausas.
    * *Asistente Funcional*: Estricto, sin floreos verbales.
  * `Switch` M3 para *Modo No Invasivo* (silencio absoluto en No Molestar o en llamadas) y *Detección Local de Fatiga*.

```kotlin
@Composable
fun PartnerProfileScreen(
    onNavigateBack: () -> Unit,
    viewModel: PartnerProfileViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Tu Compañero VEYA") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            // Nombre y Pronombre
            item {
                OutlinedTextField(
                    value = state.userName,
                    onValueChange = viewModel::setUserName,
                    label = { Text("¿Cómo debe llamarte VEYA?") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
            // Switch Modo No Invasivo
            item {
                SwitchSettingRow(
                    title = "Modo no invasivo",
                    subtitle = "Silencio absoluto si el dispositivo está en No Molestar",
                    checked = state.nonInvasiveMode,
                    onCheckedChange = viewModel::setNonInvasiveMode
                )
            }
        }
    }
}
```

---

### 2.2. "Voz y Personalidad" (`VoicePersonalityScreen.kt`)

* **Objetivo:** Selección de síntesis neuronal on-device (TTS) y calibración de la matriz de temperamento.
* **Voces Neuronales Locales:**
  1. `Aura`: Calmada, cálida y reflexiva (Femenino / Cálido medio).
  2. `Ópalo`: Empático, cercano y conversacional (Neutro / Terciopelo).
  3. `Céfiro`: Ágil, dinámico y pedagógico (Masculino / Claro).
  4. `Vesper`: Grave, envolvente y nocturno (Barítono suave).
* **Parámetros de Prosodia:**
  * `Slider` de velocidad (0.75x a 1.50x).
  * `Slider` de tono semitonal (-3 a +3 semitonos).
  * `Switch` para pausas orgánicas reflexivas.
* **Matriz de Rasgos (Sliders continuos 0..100):**
  * *Calidez & Empatía*: de analítico/sobrio a afectuoso/protector.
  * *Extensión*: de telegráfico (≤15 palabras) a pedagógico/explicativo.
  * *Proactividad*: de reactivo bajo demanda a sugerencias contextuales discretas.
  * *Humor*: de sobrio y neutro a sutil e irónico.

---

### 2.3. "ENTRENA (Perfiles)" (`TrainingProfilesScreen.kt`)

* **Objetivo:** Gestión del aprendizaje federado local y adaptación a los hábitos cotidianos del usuario.
* **Entidad Room (`TrainingProfileEntity`):**
  * `id: String`
  * `name: String` (ej. "Despertar & Rutina", "Deep Work", "Pausas Activas", "Desconexión Nocturna")
  * `category: String`
  * `triggerCondition: String` (Horario o contexto del sensor)
  * `adherenceRate: Int` (0..100%)
  * `isActive: Boolean`
  * `habitsTrackedJson: String`
* **Comportamiento:**
  * `Switch` maestro para el motor de aprendizaje en segundo plano.
  * `OutlinedCard` por perfil con indicador de adherencia y badge de estado.
  * Botón flotante o acción superior para agregar nuevos perfiles personalizados.

---

### 2.4. "Música de Alarma" (`AlarmMusicScreen.kt`)

* **Objetivo:** Despertador bioacústico sincronizado con el motor jetAudio y el avatar VEYA.
* **Curva de Fade-in Gradual:**
  * Slider de ascenso suave (1 a 5 minutos) para evitar sobresaltos de cortisol matutino.
  * Control de volumen máximo (40% a 100%).
* **Fuentes de Audio:**
  * Archivos locales Hi-Res (24-bit/96kHz) en `/Music/Alarm`.
  * Generador bioacústico procedural (Lluvia en bosque de hayas, ondas alfa 432Hz).
* **Integración con Avatar:**
  * Al activarse la alarma, VEYA entra en estado `sereno`.
  * Al descartar la alarma, VEYA ofrece el saludo matinal suave con el volumen nivelado y el resumen del día.

---

### 2.5. "Meteorología" (`WeatherPrivacyScreen.kt`)

* **Objetivo:** Información climática privada sin telemetría ni rastreo de posición.
* **Política de Cero Rastreo:**
  * **Sin permiso `ACCESS_FINE_LOCATION` ni `ACCESS_COARSE_LOCATION`**.
  * El usuario define su ciudad o distrito manualmente.
* **Proveedor de Datos:**
  * API pública de **Open-Meteo** (llamada REST directa sin clave, sin cookies de sesión ni tokens vinculados a hardware).
* **Reglas de Proactividad:**
  * Solo avisa de lluvia si la probabilidad es > 50% en las 4 horas siguientes a la salida matinal.
  * Alertas de caídas térmicas bruscas (>6°C en 3 horas).

---

### 2.6. "Medios de Noticias" (`NewsFeedsScreen.kt`)

* **Objetivo:** Lector y sintetizador de estándares abiertos RSS/Atom sin algoritmos propietarios.
* **Fuentes Descentralizadas:**
  * Permite añadir URLs directas de canales RSS/Atom.
  * Parser nativo XML basado en Kotlinx Coroutines & OkHttp.
* **Modo Resumen Express Matinal:**
  * VEYA selecciona los 3 titulares principales de los canales activos.
  * Genera una síntesis hablada de máximo 60 segundos antes de comenzar la rutina de trabajo.
  * Filtro anti-sensacionalismo: descarte selectivo de palabras clave de alarma innecesaria.

---

## 3. PERSISTENCIA EN JETPACK DATASTORE & ROOM

### 3.1. Claves DataStore (`VeyaPreferences.kt`)

```kotlin
object VeyaPreferenceKeys {
    // Usuario & Trato
    val USER_NAME = stringPreferencesKey("user_name")
    val PRONOUN_TREATMENT = stringPreferencesKey("pronoun_treatment") // "tu" | "usted"
    val NON_INVASIVE_MODE = booleanPreferencesKey("non_invasive_mode")
    
    // Voz & Temperamento
    val SELECTED_VOICE_ID = stringPreferencesKey("selected_voice_id")
    val VOICE_SPEED = floatPreferencesKey("voice_speed")
    val VOICE_PITCH = intPreferencesKey("voice_pitch")
    val TRAIT_WARMTH = intPreferencesKey("trait_warmth")
    val TRAIT_VERBOSITY = intPreferencesKey("trait_verbosity")
    val TRAIT_PROACTIVITY = intPreferencesKey("trait_proactivity")
    val TRAIT_HUMOR = intPreferencesKey("trait_humor")
    
    // Alarma
    val ALARM_TIME = stringPreferencesKey("alarm_time")
    val ALARM_ENABLED = booleanPreferencesKey("alarm_enabled")
    val ALARM_FADE_MINUTES = intPreferencesKey("alarm_fade_minutes")
    val ALARM_TRACK_ID = stringPreferencesKey("alarm_track_id")
    
    // Clima
    val WEATHER_CITY = stringPreferencesKey("weather_city")
    val WEATHER_MORNING_ALERT = booleanPreferencesKey("weather_morning_alert")
    
    // Noticias
    val NEWS_EXPRESS_BRIEFING = booleanPreferencesKey("news_express_briefing")
    val NEWS_FILTER_SENSATIONAL = booleanPreferencesKey("news_filter_sensational")
}
```

---

## 4. VALIDACIÓN Y CHECKLIST PARA CLAUDE CODE
* [x] **Composables Modulares**: Cada pantalla se ubica en su propio archivo dentro del paquete `ui/screen/settings/`.
* [x] **Navegación Unificada**: Las 6 pantallas cuentan con TopAppBar M3 con flecha de retorno a la lista de Ajustes.
* [x] **Tokens Material 3**: Alineación absoluta con el Theme de VEYA (`#155E95` Primary, `#7654A7` Secondary, `#006A67` Teal, `#BA1A1A` Error, Nunito Sans).
* [x] **Inspección en Mockup**: Todas las pantallas son navegables directamente tanto desde la lista de Ajustes como desde los botones de navegación rápida del companion panel.
