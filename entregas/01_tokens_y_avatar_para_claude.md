# Entrega de Diseño VEYA — Gemini / AI Studio
**Destinatario:** Claude Code (Lead Integrador Android)  
**Paquete objetivo:** `personal.veya.ui.theme`  
**Referencia:** Brief de diseño para Google AI (Gemini / AI Studio / Stitch)

---

## 1. Mapeo de Tokens de Color (Material 3)

Tokens listos para actualizar en `VeyaColor.kt`:

```kotlin
package personal.veya.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

val VeyaLightColorScheme = lightColorScheme(
    primary = Color(0xFF155E95),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFD7EEFF),
    onPrimaryContainer = Color(0xFF001D33),
    secondary = Color(0xFF7654A7),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFF0E6FF),
    onSecondaryContainer = Color(0xFF2C0D5A),
    tertiary = Color(0xFF006A67),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFF70F7F2),
    onTertiaryContainer = Color(0xFF00201F),
    background = Color(0xFFF7FAFC),
    onBackground = Color(0xFF16202A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF16202A),
    surfaceVariant = Color(0xFFDEE3EA),
    onSurfaceVariant = Color(0xFF42474E),
    outline = Color(0xFFB7C5D0),
    outlineVariant = Color(0xFFCBD2D9),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF)
)

val VeyaDarkColorScheme = darkColorScheme(
    primary = Color(0xFF8ECEFF),
    onPrimary = Color(0xFF003355),
    primaryContainer = Color(0xFF004A7B),
    onPrimaryContainer = Color(0xFFD7EEFF),
    secondary = Color(0xFFDCB8FF),
    onSecondary = Color(0xFF442375),
    secondaryContainer = Color(0xFF5C3B8D),
    onSecondaryContainer = Color(0xFFF0E6FF),
    tertiary = Color(0xFF4EDAD5),
    onTertiary = Color(0xFF003735),
    tertiaryContainer = Color(0xFF004F4D),
    onTertiaryContainer = Color(0xFF70F7F2),
    background = Color(0xFF101418),
    onBackground = Color(0xFFE0E3E8),
    surface = Color(0xFF12181F),
    onSurface = Color(0xFFE0E3E8),
    surfaceVariant = Color(0xFF42474E),
    onSurfaceVariant = Color(0xFFC2C7CE),
    outline = Color(0xFF8C9299),
    outlineVariant = Color(0xFF42474E),
    error = Color(0xFFF2B8B5),
    onError = Color(0xFF601410)
)
```

---

## 2. Especificación del Avatar VEYA

- **Naturaleza:** Orgánico, abstracto, cálido y no fotorrealista.
- **5 Estados:**
  1. `Idle`: Pulsación suave respiratoria lenta (escala 1.0 a 1.03, frecuencia 0.5 Hz).
  2. `Listening`: Reacción circular concéntrica con borde punteado reactivo a escucha activa.
  3. `Thinking`: Anillo orbital con rotación suave y ligera deformación sinusoidal del núcleo.
  4. `Speaking`: Escala modulada directamente por la amplitud RMS de voz (`VeyaVoiceBus`) entre 1.02 y 1.25.
  5. `Muted`: Opacidad atenuada (0.2) y franja diagonal carmesí redondeada.
- **6 Moods:** Sereno (Azul/Celeste), Cercano (Lila/Rosa), Concentrado (Verde esmeralda), Animado (Ámbar), Empático (Magenta), En espera (Pizarra).
- **Accesibilidad:** Respeto estricto a `LocalReducedMotion`: si el usuario tiene activado movimiento reducido en Android, se suprimen las oscilaciones y rotaciones continuas, manteniendo únicamente los cambios discretos de color y estado.
