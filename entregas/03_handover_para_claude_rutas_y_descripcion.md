# Handover VEYA: Archivos y Especificación para Claude Code (Android)

Este documento contiene la relación exacta de archivos generados, sus rutas dentro del repositorio, y las instrucciones precisas para que **Claude Code** (o cualquier asistente en el repositorio Android) continúe con la integración y ejecución del **Avatar VEYA en Jetpack Compose**.

---

## 1. Mapa de Archivos Generados en este Repositorio

| Archivo / Ruta relativa en el Repo | Formato | Propósito y Descripción para Claude |
| :--- | :--- | :--- |
| **`res_raw_export/`** <br> *(5 archivos `.json` generados)* | Lottie JSON (Bodymovin v5.5.2) | **Los 5 Assets de Animación Base compilados**:<br>• `veya_avatar_idle_sereno.json`<br>• `veya_avatar_listening_sereno.json`<br>• `veya_avatar_thinking_sereno.json`<br>• `veya_avatar_speaking_animado.json`<br>• `veya_avatar_muted_espera.json`<br>Listos para copiar a `app/src/main/res/raw/`. |
| **`LottieExportConfig.json`** (raíz) <br> *(y copia en `public/LottieExportConfig.json`)* | JSON | **Archivo Canónico de Configuración Lottie-Compose**. Define las 5 capas Bodymovin, frame rate a 60 fps (120 frames, 2.0 s, 1.8 Hz), puntos de anclaje `[x,y,z]`, deformación squash & stretch, flotación vertical de 6px y los KeyPaths para tintado dinámico en Android. |
| **`entregas/02_guia_integracion_lottie_compose.md`** | Markdown | **Guía de Integración Técnica Paso a Paso**. Contiene el código fuente completo del componente `VeyaAvatarLottie.kt`, configuración de `app/build.gradle.kts` (`com.airbnb.android:lottie-compose:6.4.0`), modulación reactiva por RMS acústico y accesibilidad (`LocalReducedMotion`). |
| **`entregas/01_tokens_y_avatar_para_claude.md`** | Markdown | **Tokens Material 3 y Colores**. Define `VeyaLightColorScheme`, `VeyaDarkColorScheme` y la paleta de los 6 estados emocionales (*Sereno*, *Cercano*, *Concentrado*, *Animado*, *Empático*, *Espera*). |
| **`src/lottieExporter.ts`** | TypeScript | **Motor Generador de JSON Bodymovin**. Algoritmo que genera los archivos `.json` de animación listos para colocar en `res/raw/` de Android. |
| **`src/lottieConfig.ts`** | TypeScript | Estructuras de datos, interfaces TypeScript y definiciones de los estados del Avatar. |
| **`entregas/08_specs_ui_memoria_y_privacidad_m3.md`** | Markdown | **Especificación Material 3 Bóveda de Memoria & Privacidad**. Room Entity con SQLCipher, purge programado y toggles de encriptación de hardware. |
| **`entregas/09_specs_pantallas_ajustes_completas_m3.md`** | Markdown | **Especificación Completa Pantallas de Ajustes**. Mapas de navegación M3, DataStore keys y contratos de los 7 módulos de ajustes. |
| **`entregas/10_specs_screen_voice_m3_para_claude.md`** | Markdown | **Especificación Pantalla "Voz y Personalidad" (M3)**. Catálogo de voces (Aura, Ópalo, Céfiro, Vesper), sliders continuos de prosodia y matriz de temperamento (Calidez, Concisión, Proactividad) con Jetpack Compose. |
| **`entregas/11_specs_screen_alarm_m3_para_claude.md`** | Markdown | **Especificación Pantalla "Música de Alarma" (M3)**. TimePicker con reloj circular M3, catálogo de pistas de audio local (FLAC), slider de fade-in (1-5 min), despertar progresivo bioacústico y rampa DSP en ForegroundService. |
| **`entregas/12_specs_screen_weather_m3_para_claude.md`** | Markdown | **Especificación Pantalla "Meteorología" (M3)**. Ubicación manual sin GPS (cero permisos en Manifest), hero card de temperatura actual, pronóstico de 5 días con iconos M3, toggles de avisos proactivos (paraguas > 50%, delta térmico > 5°C) y cliente Open-Meteo. |
| **`entregas/13_specs_screen_news_m3_para_claude.md`** | Markdown | **Especificación Pantalla "Medios de Noticias" (M3)**. Lista de tarjetas en formato 'Compact' (título y fuente, sin imágenes pesadas), selector de categorías FilterChip (Tecnología, Ciencia, Salud, Local), toggle de 'Resumen IA' para cada titular, indicador de tiempo de lectura y parser RSS XmlPullParser descentralizado. |
| **`entregas/14_specs_streaming_music_spotify_apple_m3_para_claude.md`** | Markdown | **Especificación Alarma: Servicios de Suscripción & Respaldo Infalible (M3)**. Soporte para Spotify (SpotifyAppRemote), Apple Music (MusicKit), YouTube Music y TIDAL en la alarma matinal, con verificación de conectividad y conmutación automática e inmediata a pista local FLAC en caso de fallo de red o modo avión. |

---

## 2. Instrucciones de Prompt para pasarle a Claude Code

Copia y pega el siguiente bloque a Claude en tu entorno de desarrollo Android:

```markdown
Hola Claude, 

Continuamos con la integración del Avatar VEYA en Android Jetpack Compose.
Toma como referencia los siguientes archivos generados en el módulo AvatarLaboratory:

1. Lee el archivo `LottieExportConfig.json`:
   - Revisa la especificación de capas Bodymovin (Capas 1 a 5: Eye_Specularity_Glints, Eyes_Pixar_Obsidian, Smile_Aperture, Body_Breathing_Orb, Atmospheric_Glow_Halo).
   - Revisa el frameRate (60 fps), duración (120 frames / 2.0s) y puntos de anclaje globales [250, 250, 0].
   - Configura las propiedades dinámicas (KeyPaths) para alterar los colores del halo (`Atmospheric_Glow_Halo`) y rim light (`Body_Breathing_Orb`) en tiempo real según el estado de ánimo (Mood).

2. Implementa en el paquete `personal.veya.ui.components.avatar`:
   - El componente Composable `VeyaAvatarLottie.kt` guiándote con el documento `entregas/02_guia_integracion_lottie_compose.md`.
   - Utiliza la dependencia `com.airbnb.android:lottie-compose:6.4.0`.
   - Configura la reactividad por voz: cuando el avatar esté en estado `SPEAKING`, modula la escala y velocidad de reproducción utilizando el RMS de audio.
   - Aplica `RenderMode.HARDWARE` y respeta `LocalReducedMotion`.

3. Recursos JSON de animación:
   - Coloca los archivos `.json` generados en `app/src/main/res/raw/veya_avatar_{state}_{mood}.json`.
```

---

## 3. Rutas Destino en el Proyecto Android (`personal.veya`)

Claude debe ubicar o crear cada recurso en las siguientes rutas estándar del proyecto Android:

```text
android-project-root/
├── app/
│   ├── build.gradle.kts                       <- Añadir com.airbnb.android:lottie-compose:6.4.0
│   └── src/
│       └── main/
│           ├── java/personal/veya/
│           │   ├── ui/
│           │   │   ├── components/
│           │   │   │   └── avatar/
│           │   │   │       ├── VeyaAvatarLottie.kt       <- Componente Composable de animación
│           │   │   │       └── VeyaAvatarDynamicProps.kt <- KeyPaths de tintado dinámico
│           │   │   └── theme/
│           │   │       ├── Color.kt
│           │   │       └── VeyaColor.kt                  <- Tokens entregados en 01_tokens_...
│           └── res/
│               └── raw/
│                   ├── veya_avatar_idle_sereno.json      <- Animaciones exportadas
│                   ├── veya_avatar_listening_sereno.json
│                   ├── veya_avatar_thinking_sereno.json
│                   ├── veya_avatar_speaking_animado.json
│                   └── veya_avatar_muted_espera.json
└── docs/
    └── LottieExportConfig.json                           <- Configuración de capas y anclajes
```
