# Entrega #05: Arquitectura y Módulo de Música Audiófilo (Estilo jetAudio HD)

**Para:** Claude Code (Ingeniero Android / Jetpack Compose)  
**De:** Google AI Studio (Director de Diseño & Arquitectura de Audio VEYA)  
**Referencia:** jetAudio Plus Android / Jetpack Media3 Audio Pipeline  

---

## 1. Visión y Requisitos de Nivel de Producción

El usuario ha solicitado explícitamente elevar el módulo de música local a los estándares de **jetAudio**, uno de los reproductores audiófilos más reconocidos en Android.

### Principios Fundamentales Implementados:
1. **Configurabilidad Total del Motor DSP por el Usuario**:
   - El DSP **no es obligatorio ni estático**. Se provee un conmutador maestro **BYPASS / DIRECT**.
   - Si el usuario lo desactiva, la cadena de audio opera en **Bit-Perfect Direct**, sin resampling ni ecualización (ideal para audiófilos con DACs externos USB o auriculares planos).
2. **Biblioteca de Presets de Ecualización Profesionales**:
   - Modos predefinidos: **Rock, Pop, Clásico, Dance / EDM, Estadio (Live Arena), Acústica, Jazz & Blues, Heavy Metal, Vocal / Podcasts, Bass Boost (Sub-Graves), Treble Boost (Agudos) y Plano (Flat)**.
   - Cada preset actualiza dinámicamente las 10 bandas y la curva de respuesta visual.
3. **Efectos Avanzados DSP Clásicos de jetAudio**:
   - **BBE Sound Clarity**: Alineación armónica de frecuencias para eliminar distorsión de fase y resaltar micro-detalles.
   - **BBE ViVA 3D**: Expansión holográfica del escenario sonoro estéreo.
   - **X-Bass**: Refuerzo de frecuencias sub-graves con selector de corte (60 Hz, 80 Hz, 100 Hz).
   - **Wide Stereo & Reverb**: Reverberación física con entornos (Sala, Auditorio, Estadio, Escenario, Catedral) y nivel de mezcla húmeda (*wet mix*).
   - **AGC & ReplayGain**: Normalización automática de volumen para evitar saltos bruscos entre pistas.
   - **Control de Tono y Tempo**: Estiramiento temporal (0.5x - 2.0x) y cambio de tono semitonal (-6 a +6 semitonos).
   - **Bucle A-B Repeat**: Repetición de segmentos A-B con precisión de milisegundos para músicos y aprendizaje auditivo.

---

## 2. Mapeo de Frecuencias y Presets del Ecualizador (10 Bandas)

Frecuencias centrales estándar de 10 bandas ISO:
`[32 Hz, 64 Hz, 125 Hz, 250 Hz, 500 Hz, 1 kHz, 2 kHz, 4 kHz, 8 kHz, 16 kHz]`

Ganancia por banda: `-10.0 dB` a `+10.0 dB` (paso de `0.5 dB`).

```kotlin
// Android / Kotlin Data Model
data class EqPreset(
    val id: String,
    val name: String,
    val genre: String,
    val bands: FloatArray // 10 valores dB
)

val PRESETS = listOf(
    EqPreset("flat", "Plano (Flat)", "Neutro", floatArrayOf(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f)),
    EqPreset("rock", "Rock", "Guitar/Punch", floatArrayOf(4.5f, 3.5f, 1.0f, -1.5f, -2.0f, 0.5f, 2.5f, 3.5f, 4.0f, 4.5f)),
    EqPreset("pop", "Pop", "Vocal/Beat", floatArrayOf(-1.0f, 1.5f, 3.0f, 4.0f, 3.0f, 1.5f, -0.5f, 1.0f, 2.5f, 3.0f)),
    EqPreset("clasico", "Clásico", "Orquesta", floatArrayOf(4.0f, 3.0f, 2.0f, 1.5f, -0.5f, -1.0f, 0.5f, 2.0f, 3.0f, 3.5f)),
    EqPreset("dance", "Dance / EDM", "Sub-Bass/Clubs", floatArrayOf(6.0f, 5.0f, 2.5f, 0f, -1.5f, -1.0f, 1.5f, 3.5f, 5.0f, 6.0f)),
    EqPreset("estadio", "Estadio (Live Arena)", "Concierto", floatArrayOf(3.5f, 2.5f, 0f, -2.0f, -2.5f, -1.0f, 1.5f, 3.5f, 5.0f, 6.0f)),
    EqPreset("acustica", "Acústica", "Unplugged", floatArrayOf(3.0f, 2.5f, 1.5f, 2.0f, 3.0f, 2.5f, 3.0f, 3.5f, 3.0f, 2.5f)),
    EqPreset("jazz", "Jazz & Blues", "Calidez/Metales", floatArrayOf(3.0f, 2.0f, 1.0f, 1.5f, -1.0f, -1.0f, 0.5f, 1.5f, 2.5f, 3.5f)),
    EqPreset("metal", "Heavy Metal", "High-Gain", floatArrayOf(5.0f, 4.0f, 1.0f, -2.5f, -3.5f, -1.5f, 2.0f, 4.5f, 5.5f, 6.5f)),
    EqPreset("vocal", "Vocal / Claridad", "Voces/Podcasts", floatArrayOf(-3.0f, -2.0f, 0f, 2.5f, 4.5f, 4.0f, 3.0f, 1.5f, 0f, -1.0f)),
    EqPreset("bass_boost", "Bass Boost (X-Bass)", "Subgraves", floatArrayOf(7.5f, 6.0f, 4.5f, 2.0f, 0.5f, 0f, 0f, 0f, 0f, 0f)),
    EqPreset("treble_boost", "Treble Boost", "Aire/Detalle", floatArrayOf(0f, 0f, 0f, 0f, 0f, 1.0f, 2.5f, 4.5f, 6.0f, 7.5f))
)
```

---

## 3. Arquitectura de Audio en Android (Jetpack Media3 + AudioTrack)

En Android nativo, jetAudio y los reproductores de referencia estructuran el pipeline de audio mediante:

```
[ Archivo Local FLAC / WAV / DSD ]
               │
               ▼
[ Media3 ExoPlayer / AudioTrack Extractor ]
               │
               ▼
┌────────────────────────────────────────────────┐
│             CADENA DSP JET-AUDIO               │
│                                                │
│  [BYPASS MASTER SWITCH]                        │
│     ├── Si FALSE ──> Salida Directa (AAudio)   │
│     └── Si TRUE                                │
│          ├── DynamicsProcessing (Preamp/Limiter)│
│          ├── 10-Band Graphic Equalizer         │
│          ├── BBE Sound Harmonics Filter        │
│          ├── X-Bass Sub-woofer Filter (Bi-quad)│
│          ├── EnvironmentalReverb (Preset Hall) │
│          └── SonicAudioProcessor (Tempo/Pitch) │
└────────────────────────────────────────────────┘
               │
               ▼
[ Android Audio HAL / DAC Hi-Res 24-bit 192kHz ]
```

### Componentes Nativos Clave:
1. **`android.media.audiofx.DynamicsProcessing`**:
   - Proporciona EQ paramétrico multibanda y limitador pre-post ganancia nativo con aceleración por hardware.
2. **`android.media.audiofx.EnvironmentalReverb`**:
   - Proporciona reverberación de sala, escenario, auditorio y estadio.
3. **`androidx.media3.common.audio.SonicAudioProcessor`**:
   - Integrado en Media3 para cambiar velocidad (`speed`) y tono (`pitch`) independientemente y en tiempo real sin artefactos metálicos.
4. **Bucle A-B Repeat**:
   - `exoPlayer.seekTo(pointA)` cuando `currentPosition >= pointB`.

---

## 4. Estructura de Pantallas y Componentes en Compose

1. **`ScreenMusic.kt` (Contenedor Principal)**:
   - Header con badge Hi-Res y selector de vista (**Biblioteca** vs **Ecualizador DSP**).
   - Mini-Player inferior persistente con barra de progreso interactiva, arte en disco de vinilo rotatorio y botón para expandir el reproductor completo.
2. **`EqualizerDspRack.kt`**:
   - Conmutador Maestro DSP con indicador luminoso (Procesando vs Bypass).
   - Selector de Presets horizontales en chips táctiles (≥ 48dp).
   - Visualizador de Curva SVG en tiempo real calculada con spline cúbica.
   - Fader de Preamp con Limiter.
   - 10 Faders de frecuencia vertical con lectura numérica en dB.
   - Pestañas secundarias para BBE Clarity, BBE ViVA 3D, X-Bass (corte 60/80/100 Hz), Amplitud Estéreo y Motor de Audio.
3. **`AudiophilePlayerModal.kt`**:
   - Deck completo con arte de tapa y halo ambiental dinámico.
   - Visualizador de espectro analítico RTA (16 bandas) animado al ritmo de reproducción.
   - Selector A-B Loop con etiquetado de marcas temporales.
   - Fader de tiempo y lectura de metadatos audiófilos (`FLAC 24-bit · 96.0 kHz · 2840 kbps · ReplayGain -1.2 dB`).
   - Visor sincronizado de letras LRC tipo karaoke.
   - Controles independientes de tono semitonal y tempo de reproducción.
4. **`MusicLibraryBrowser.kt`**:
   - Vistas por Canciones (con filtros de resolución FLAC/WAV/DSD y ordenación por bitrate), Carpetas físicas de almacenamiento (`/storage/emulated/0/Music/`) y Álbumes con grid visual.
