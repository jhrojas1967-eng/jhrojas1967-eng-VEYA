# Guía de Despliegue e Integración para Claude Code
## Rama: `feature/design-system-sync` — Proyecto VEYA Android

Esta guía proporciona a **Claude Code** los pasos exactos para desplegar e integrar los tokens de diseño y el Avatar VEYA exportados desde el estudio.

---

## 1. Estructura de Archivos Exportados en la Rama

Al ejecutar `sync_veya_studio.sh`, los siguientes recursos quedan sincronizados en el repositorio de destino:

```text
veya-android/
├── res_raw_export/                          <- Los 5 archivos Lottie JSON Bodymovin v5.5.2 exportados
│   ├── veya_avatar_idle_sereno.json
│   ├── veya_avatar_listening_sereno.json
│   ├── veya_avatar_thinking_sereno.json
│   ├── veya_avatar_speaking_animado.json
│   └── veya_avatar_muted_espera.json
├── docs/
│   └── design-system/
│       ├── LottieExportConfig.json          <- Configuración canónica (capas, 60fps, anclajes)
│       ├── themeTokens.ts                   <- Tokens TypeScript (colores M3, tipografía, moods)
│       ├── lottieConfig.ts                  <- Definición de estados, frecuencias y keypaths
│       └── DEPLOY_CLAUDE_CODE.md            <- Esta guía de despliegue
├── docs/
│   └── avatar-laboratory/                  <- Código fuente de referencia del Avatar Web
│       ├── AvatarLaboratory.tsx
│       ├── AvatarVisual.tsx
│       ├── PixarAvatarSvg.tsx
│       ├── CinematicAvatarCanvas.tsx
│       ├── TokenViewer.tsx
│       └── lottieExporter.ts                <- Generador de JSON Bodymovin 5.5.2
├── docs/
│   └── entregas/
│       ├── 01_tokens_y_avatar_para_claude.md
│       ├── 02_guia_integracion_lottie_compose.md
│       ├── 03_handover_para_claude_rutas_y_descripcion.md
│       └── 04_guia_despliegue_claude_code.md
└── app/
    └── src/main/res/raw/                    <- Ubicación en Android de los 5 JSON compilados
        ├── veya_avatar_idle_sereno.json
        ├── veya_avatar_listening_sereno.json
        ├── veya_avatar_thinking_sereno.json
        ├── veya_avatar_speaking_animado.json
        └── veya_avatar_muted_espera.json
```

---

## 2. Pasos de Despliegue para Claude Code

### Paso 1: Configurar Dependencias en `app/build.gradle.kts`
Asegúrate de que el módulo `app` incluya la dependencia oficial de Lottie para Jetpack Compose:

```kotlin
dependencies {
    // Lottie Compose para renderizado por hardware a 60 FPS
    implementation("com.airbnb.android:lottie-compose:6.4.0")
    
    // Jetpack Compose BOM y Foundation
    implementation(platform("androidx.compose:compose-bom:2024.04.01"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
}
```

---

### Paso 2: Integrar Tokens de Color Material 3
Ubica o actualiza los colores en `app/src/main/java/personal/veya/ui/theme/Color.kt`:

```kotlin
package personal.veya.ui.theme

import androidx.compose.ui.graphics.Color

// Primarios VEYA (Inspirados en la paleta Obsidian & Glass)
val VeyaPrimary = Color(0xFF0284C7)        // Ocean Teal Glow
val VeyaOnPrimary = Color(0xFFFFFFFF)
val VeyaPrimaryContainer = Color(0xFFE0F2FE)
val VeyaOnPrimaryContainer = Color(0xFF0369A1)

val VeyaSurfaceDark = Color(0xFF0B1522)     // Obsidian Deep
val VeyaSurfaceLight = Color(0xFFF8FAFC)    // Pure Glass Fog

// Moods Emocionales del Avatar
object VeyaMoodColors {
    val Sereno = Color(0xFF0284C7)      // Azul Océano Calmo (#0284C7)
    val Cercano = Color(0xFFD97706)     // Ámbar Cálido (#D97706)
    val Concentrado = Color(0xFF7C3AED) // Púrpura Foco (#7C3AED)
    val Animado = Color(0xFF10B981)     // Esmeralda Vital (#10B981)
    val Empatico = Color(0xFFEC4899)    // Rosa Compasión (#EC4899)
    val Espera = Color(0xFF64748B)      // Pizarra Neutro (#64748B)
}
```

---

### Paso 3: Crear el Componente Composable `VeyaAvatarLottie.kt`
Crea el archivo en `app/src/main/java/personal/veya/ui/components/avatar/VeyaAvatarLottie.kt`:

```kotlin
package personal.veya.ui.components.avatar

import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import com.airbnb.lottie.LottieProperty
import com.airbnb.lottie.RenderMode
import com.airbnb.lottie.compose.*
import com.airbnb.lottie.model.KeyPath

enum class AvatarState { IDLE, LISTENING, THINKING, SPEAKING, MUTED }
enum class AvatarMood { SERENO, CERCANO, CONCENTRADO, ANIMADO, EMPATICO, ESPERA }

/**
 * Resuelve el identificador de recurso R.raw según el estado del avatar.
 * Todos los estados IDLE mapean a R.raw.veya_avatar_idle_sereno, ya que el espectro
 * emocional (Mood) se aplica en tiempo de ejecución mediante KeyPaths con rememberVeyaMoodProperties.
 * Esto optimiza el tamaño del APK utilizando únicamente los 5 recursos JSON base entregados en res/raw/.
 */
@androidx.annotation.RawRes
fun resolveAvatarRawRes(state: AvatarState, mood: AvatarMood = AvatarMood.SERENO): Int {
    return when (state) {
        AvatarState.IDLE -> personal.veya.R.raw.veya_avatar_idle_sereno
        AvatarState.LISTENING -> personal.veya.R.raw.veya_avatar_listening_sereno
        AvatarState.THINKING -> personal.veya.R.raw.veya_avatar_thinking_sereno
        AvatarState.SPEAKING -> personal.veya.R.raw.veya_avatar_speaking_animado
        AvatarState.MUTED -> personal.veya.R.raw.veya_avatar_muted_espera
    }
}

@Composable
fun VeyaAvatarLottie(
    state: AvatarState = AvatarState.IDLE,
    mood: AvatarMood = AvatarMood.SERENO,
    audioRms: Float = 0f, // Amplitud del micrófono normalizada (0.0f a 1.0f)
    modifier: Modifier = Modifier
) {
    // 1. Cargar composición Lottie según estado (5 recursos base)
    val rawResId = resolveAvatarRawRes(state, mood)
    val composition by rememberLottieComposition(
        LottieCompositionSpec.RawRes(rawResId)
    )

    // 2. Modulación dinámica de velocidad por estado
    val baseSpeed = when (state) {
        AvatarState.IDLE -> 1.0f
        AvatarState.LISTENING -> 1.15f
        AvatarState.THINKING -> 0.85f
        AvatarState.SPEAKING -> 1.4f + (audioRms * 0.4f)
        AvatarState.MUTED -> 0.0f
    }

    val isPlaying = state != AvatarState.MUTED

    val progress by animateLottieCompositionAsState(
        composition = composition,
        iterations = LottieConstants.IterateForever,
        isPlaying = isPlaying,
        speed = baseSpeed
    )

    // 3. Reactividad acústica al habla (Squash & Stretch en tiempo real)
    val voiceScale by animateFloatAsState(
        targetValue = if (state == AvatarState.SPEAKING) 1.0f + (audioRms * 0.12f) else 1.0f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
        label = "VoiceScale"
    )

    // 4. Tintado dinámico en tiempo real mediante KeyPaths
    val moodColor = remember(mood) {
        when (mood) {
            AvatarMood.SERENO -> Color(0xFF0284C7)
            AvatarMood.CERCANO -> Color(0xFFD97706)
            AvatarMood.CONCENTRADO -> Color(0xFF7C3AED)
            AvatarMood.ANIMADO -> Color(0xFF10B981)
            AvatarMood.EMPATICO -> Color(0xFFEC4899)
            AvatarMood.ESPERA -> Color(0xFF64748B)
        }
    }

    val dynamicProperties = rememberLottieDynamicProperties(
        // Tintado del reborde de luz en el cuerpo esférico
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColor.toArgb(),
            keyPath = arrayOf("07_Body_Breathing_Orb", "Main_Sphere", "Rim_Light_Stroke")
        ),
        // Bioluminiscencia interna del iris
        rememberLottieDynamicProperty(
            property = LottieProperty.COLOR_FILTER,
            value = moodColor.toArgb(),
            keyPath = arrayOf("04_Iris_Bioluminescence", "**")
        ),
        // Tintado del trazo bucal
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColor.toArgb(),
            keyPath = arrayOf("06_Mouth_Micro_Expression", "**")
        )
    )

    Box(
        modifier = modifier
            .size(260.dp)
            .scale(voiceScale),
        contentAlignment = Alignment.Center
    ) {
        LottieAnimation(
            composition = composition,
            progress = { progress },
            dynamicProperties = dynamicProperties,
            renderMode = RenderMode.HARDWARE,
            modifier = Modifier.matchParentSize()
        )
    }
}
```

---

### Paso 4: Validar y Compilar
1. Ejecuta el preview en Android Studio sobre `VeyaAvatarLottie`.
2. Verifica la compilación sin errores:
   ```bash
   ./gradlew assembleDebug
   ```
3. Comprueba que a 60 FPS el orbe flote 6px verticalmente y responda al volumen del habla sin caídas de frames.
