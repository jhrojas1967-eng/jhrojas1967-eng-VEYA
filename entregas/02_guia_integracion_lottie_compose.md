# Guía de Integración VEYA: Lottie-Compose para Android
**Destinatario:** Claude Code (Lead Integrador Android)  
**Paquete objetivo:** `personal.veya.ui.components.avatar`  
**Referencia de diseño:** Avatar Cinemático VEYA (Estilo Pixar 3D / Dispersión Subsuperficial y Respiración Orgánica)  
**Archivo de configuración asociado:** `lottie_export_config.json`

---

## 1. Dependencias en Android (`app/build.gradle.kts`)

Asegurar la inclusión de la librería oficial de Lottie para Jetpack Compose:

```kotlin
dependencies {
    // Lottie Compose
    implementation("com.airbnb.android:lottie-compose:6.4.0")
    
    // Core Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
}
```

---

## 2. Convención de Recursos (`res/raw`)

Los archivos JSON exportados desde el **AvatarLaboratory** deben ubicarse en el directorio de recursos en crudo de Android:

```text
app/
└── src/
    └── main/
        └── res/
            └── raw/
                ├── veya_avatar_idle_sereno.json
                ├── veya_avatar_idle_cercano.json
                ├── veya_avatar_listening_sereno.json
                ├── veya_avatar_thinking_sereno.json
                ├── veya_avatar_speaking_animado.json
                └── veya_avatar_muted_espera.json
```

---

## 3. Componente Composable: `VeyaAvatarLottie.kt`

Implementación modular con soporte para:
1. **Respiración sinusoidal armónica continua** a 60 fps (1.8 Hz).
2. **Modulación reactiva de habla** vinculada a la amplitud RMS del micrófono (`VeyaVoiceBus`).
3. **Respeto a la accesibilidad del sistema operativo** (`LocalReducedMotion`).

```kotlin
package personal.veya.ui.components.avatar

import androidx.annotation.RawRes
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalAccessibilityManager
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.airbnb.lottie.RenderMode
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import com.airbnb.lottie.compose.rememberLottieComposition
import personal.veya.R

/**
 * Estados del Asistente VEYA
 */
enum class AvatarState {
    IDLE,
    LISTENING,
    THINKING,
    SPEAKING,
    MUTED
}

/**
 * Matices emocionales del Avatar
 */
enum class AvatarMood {
    SERENO,
    CERCANO,
    CONCENTRADO,
    ANIMADO,
    EMPATICO,
    ESPERA
}

/**
 * Resuelve el identificador de recurso R.raw según el estado del avatar.
 * Todos los estados IDLE mapean a R.raw.veya_avatar_idle_sereno, ya que el espectro
 * emocional (Mood) se aplica en tiempo de ejecución mediante KeyPaths con rememberVeyaMoodProperties.
 * Esto optimiza el tamaño del APK utilizando únicamente los 5 recursos JSON base entregados en res/raw/.
 */
@RawRes
fun resolveAvatarRawRes(state: AvatarState, mood: AvatarMood = AvatarMood.SERENO): Int {
    return when (state) {
        AvatarState.IDLE -> R.raw.veya_avatar_idle_sereno
        AvatarState.LISTENING -> R.raw.veya_avatar_listening_sereno
        AvatarState.THINKING -> R.raw.veya_avatar_thinking_sereno
        AvatarState.SPEAKING -> R.raw.veya_avatar_speaking_animado
        AvatarState.MUTED -> R.raw.veya_avatar_muted_espera
    }
}

/**
 * Avatar Cinemático VEYA implementado con Lottie Compose.
 *
 * @param state Estado reactivo de voz o asistente.
 * @param mood Tonalidad o espectro emocional actual.
 * @param amplitude Nivel RMS del micrófono (0.0f a 1.0f) para amplificar la vibración acústica en SPEAKING.
 * @param size Dimensión en Dp del contenedor del avatar (recomendado: 220dp a 280dp).
 */
@Composable
fun VeyaAvatarLottie(
    modifier: Modifier = Modifier,
    state: AvatarState = AvatarState.IDLE,
    mood: AvatarMood = AvatarMood.SERENO,
    amplitude: Float = 0.0f,
    size: Dp = 260.dp
) {
    val rawResId = resolveAvatarRawRes(state, mood)
    val composition by rememberLottieComposition(LottieCompositionSpec.RawRes(rawResId))

    // Velocidad de animación adaptada al estado
    val targetSpeed = when (state) {
        AvatarState.SPEAKING -> 1.2f + (amplitude * 0.4f)
        AvatarState.LISTENING -> 1.15f
        AvatarState.THINKING -> 0.85f
        AvatarState.MUTED -> 0.0f // Congela el bucle en silenciado
        AvatarState.IDLE -> 1.0f
    }

    val animatedSpeed by animateFloatAsState(
        targetValue = targetSpeed,
        animationSpec = tween(durationMillis = 300),
        label = "lottie_speed_anim"
    )

    // Si el estado es SPEAKING, aplicamos un squash & stretch extra reactivo al audio
    val reactiveScale by animateFloatAsState(
        targetValue = if (state == AvatarState.SPEAKING) 1.0f + (amplitude * 0.12f) else 1.0f,
        animationSpec = tween(durationMillis = 80),
        label = "reactive_audio_scale"
    )

    val progress by animateLottieCompositionAsState(
        composition = composition,
        isPlaying = state != AvatarState.MUTED,
        iterations = if (state == AvatarState.MUTED) 1 else LottieConstants.IterateForever,
        speed = animatedSpeed,
        restartOnPlay = false
    )

    Box(
        modifier = modifier
            .size(size)
            .scale(reactiveScale),
        contentAlignment = Alignment.Center
    ) {
        LottieAnimation(
            composition = composition,
            progress = { progress },
            modifier = Modifier.size(size),
            renderMode = RenderMode.HARDWARE,
            enableMergePaths = true
        )
    }
}
```

---

## 4. Tintado Dinámico de Capas (Dynamic Properties)

Si prefieres usar un único archivo base (`veya_avatar_idle_base.json`) y cambiar los colores de ánimo (*Mood*) en tiempo de ejecución sin recargar el archivo, utiliza `rememberLottieDynamicProperties`:

```kotlin
import androidx.compose.ui.graphics.toArgb
import com.airbnb.lottie.LottieProperty
import com.airbnb.lottie.compose.rememberLottieDynamicProperty
import com.airbnb.lottie.compose.rememberLottieDynamicProperties
import com.airbnb.lottie.model.KeyPath

@Composable
fun rememberVeyaMoodProperties(mood: AvatarMood): LottieDynamicProperties {
    val moodColors = getMoodColors(mood) // Obtiene Color(0xFF38BDF8), etc.

    return rememberLottieDynamicProperties(
        // Cambia el color del halo atmosférico
        rememberLottieDynamicProperty(
            property = LottieProperty.COLOR_FILTER,
            value = SimpleColorFilter(moodColors.glowColor.toArgb()),
            keyPath = KeyPath("Atmospheric_Glow_Halo", "Glow_Shape", "Aura_Gradient")
        ),
        // Cambia el color del rim light del orbe
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColors.rimColor.toArgb(),
            keyPath = KeyPath("Body_Breathing_Orb", "Main_Sphere", "Rim_Light_Stroke")
        ),
        // Cambia el color de la boca / sonrisa
        rememberLottieDynamicProperty(
            property = LottieProperty.STROKE_COLOR,
            value = moodColors.coreColor.toArgb(),
            keyPath = KeyPath("Smile_Aperture", "Smile_Shape", "Stroke")
        )
    )
}
```

---

## 5. Mapeo de Parámetros con `lottie_export_config.json`

| Parámetro | Valor en Configuración | Comportamiento en Android |
| :--- | :--- | :--- |
| **FPS** | `60` | Fluidez nativa sincronizada con la pantalla del dispositivo. |
| **Ciclo de Respiración** | `120 frames (2.0s)` | Frecuencia respiratoria en reposo de 1.8 Hz. |
| **Squash & Stretch** | `X: 97%-103%, Y: 98%-102%` | Expansión orgánica horizontal al inhalar y adelgazamiento vertical. |
| **Capa `Eye_Specularity_Glints`** | Doble destello de estrella Disney | Se mantiene en primer plano dando vida y mirada lúcida al avatar. |
| **Capa `Body_Breathing_Orb`** | Gradiente radial SSS | Simula dispersión subsuperficial con sombreado de porcelana translúcida. |
| **RenderMode** | `RenderMode.HARDWARE` | Garantiza procesamiento por GPU sin impacto en el hilo principal de Compose. |

---

## 6. Integración en Pantalla de Voz (`VeyaVoiceScreen.kt`)

```kotlin
@Composable
fun VeyaVoiceScreen(
    viewModel: VoiceViewModel = viewModel()
) {
    val voiceState by viewModel.voiceState.collectAsState()
    val currentMood by viewModel.currentMood.collectAsState()
    val micRmsAmplitude by viewModel.micRmsAmplitude.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        VeyaAvatarLottie(
            state = voiceState,
            mood = currentMood,
            amplitude = micRmsAmplitude,
            size = 280.dp
        )
    }
}
```
