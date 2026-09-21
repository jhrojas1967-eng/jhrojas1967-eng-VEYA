# VEYA — Guía Técnica Canónica: Mapeo de Estados, Transiciones y Comportamiento del Avatar
## Versión 2.0 (Motor Cinemático 9 Capas & Jetpack Compose Lottie)

Esta guía define formalmente la máquina de estados, curvas cinéticas de transición y comportamiento reactivo del Avatar VEYA para su implementación unificada en **Web (Canvas 60FPS)** y **Android (Jetpack Compose / Lottie)**.

---

## 1. Arquitectura de Estados del Avatar

El Avatar VEYA opera mediante dos ejes ortogonales e independientes:
1. **Estado Operativo (`AvatarState`):** Define la intención y actividad cognitiva/física del asistente (5 estados).
2. **Matiz Emocional (`AvatarMood`):** Define el espectro cromático y resonancia empática (6 moods).

```text
               ┌─────────────┐
        ┌─────►│    IDLE     │◄────────────┐
        │      │ (Respirando)│             │
        │      └──────┬──────┘             │
        │             │                    │
        ▼             ▼                    ▼
  ┌───────────┐  ┌───────────┐       ┌───────────┐
  │   MUTED   │  │ LISTENING │──────►│ THINKING  │
  │ (Espera)  │  │ (Escucha) │       │ (Proceso) │
  └───────────┘  └─────┬─────┘       └─────┬─────┘
        ▲              │                   │
        │              └────────┐  ┌───────┘
        │                       ▼  ▼
        │                 ┌───────────┐
        └─────────────────┤ SPEAKING  │
                          │  (Habla)  │
                          └───────────┘
```

---

## 2. Especificación Detallada por Estado

### A. Estado `IDLE` (Reposo & Presencia Orgánica)
* **Propósito:** Transmitir vida, serenidad y disponibilidad atenta sin agotar visualmente al usuario.
* **Cinética:**
  * **Frecuencia de respiración:** $f = 1.8\text{ Hz}$ ($1.8\text{ rad/s}$ en el oscilador sinusoidal).
  * **Ciclo continuo:** 120 fotogramas a 60 FPS ($T = 2.0\text{ segundos}$).
  * **Squash & Stretch del Orbe:**
    * Eje X: Escala de $97\%$ (inhalación) a $103\%$ (exhalación).
    * Eje Y: Escala de $102\%$ (inhalación) a $98\%$ (exhalación) en contrafase.
  * **Flotación vertical en el escenario:** Oscilación armónica de $\pm 6\text{ px}$ en Y ($Y \in [244, 256]$).
* **Micro-comportamientos faciales:**
  * **Parpadeo espontáneo (Blink):** Trigger aleatorio cada $3.5\text{ s} \pm 1.2\text{ s}$. Duración de $150\text{ ms}$ con interpolación cúbica `FastOutSlowInEasing`.
  * **Expresión bucal:** Arco curvado sutil de sonrisa afable ($w = 56\text{ px}$, curvatura $h = 10\text{ px}$).
* **Recurso Lottie:** `res/raw/veya_avatar_idle_sereno.json`.

---

### B. Estado `LISTENING` (Escucha Activa)
* **Propósito:** Confirmar inequívocamente al usuario que el micrófono está activo y VEYA está procesando la voz.
* **Cinética:**
  * **Dilatación pupilar:** Los ojos obsidian se expanden un $+15\%$ en Y (pupilas abiertas para captar atención).
  * **Inclinación atenta:** Desplazamiento ocular de $Y = -4\text{ px}$ y leve rotación angular de $+1.5^\circ$ emulando atención empática.
  * **Ondas acústicas concéntricas (`00_Acoustic_Listening_Ripples`):**
    * Dos anillos pulsantes de trazo fino ($3\text{ px}$) que brotan desde el centro del orbe y se expanden de radio $145\text{ px} \to 180\text{ px}$.
    * Opacidad sincronizada que desvanece de $45\% \to 5\%$.
  * **Velocidad de reproducción Lottie:** $1.15\times$.
* **Recurso Lottie:** `res/raw/veya_avatar_listening_sereno.json`.

---

### C. Estado `THINKING` (Introspección / Procesamiento Cognitivo)
* **Propósito:** Mostrar concentración sin dar sensación de bloqueo o congelación del sistema.
* **Cinética:**
  * **Mirada ascendente (Gaze Shift):** Las pupilas y destellos se desplazan $Y = -8\text{ px}$ hacia la zona superior derecha ($X = +4\text{ px}$), simulando el acto reflexivo humano.
  * **Contricción reflexiva:** Escala de ojos en Y al $85\%$ (entrecerrado analítico).
  * **Pulsación del Núcleo (`08_Core_Soul_Heartbeat`):** El latido interno acelera su frecuencia a $2.4\text{ Hz}$ con mayor saturación de luz interna.
  * **Velocidad de reproducción Lottie:** $0.85\times$ (respiración más lenta y profunda).
* **Recurso Lottie:** `res/raw/veya_avatar_thinking_sereno.json`.

---

### D. Estado `SPEAKING` (Habla y Resonancia Acústica)
* **Propósito:** Sincronización labial orgánica y presencia vibrante durante la respuesta por voz.
* **Cinética:**
  * **Reactividad RMS en tiempo real:**
    * Modulación de amplitud: $A \in [0.0, 1.0]$.
    * Escala adicional por voz: $\text{Scale}_{\text{voice}} = 1.0 + (A \times 0.12)$.
  * **Apertura bucal y resonancia interna (`06_Mouth_Micro_Expression`):**
    * La cavidad oral se abre elípticamente según la amplitud sonora: alto de $14\text{ px} \to 28\text{ px}$.
    * Se expone la capa interior de resonancia / lengua (`Inner_Tongue_Resonance`) tintada con el color `rim` translúcido.
  * **Velocidad dinámica:** $\text{Speed} = 1.4\times + (A \times 0.4\times)$.
* **Recurso Lottie:** `res/raw/veya_avatar_speaking_animado.json`.

---

### E. Estado `MUTED` (Modo Espera / Silenciado)
* **Propósito:** Indicar apagado seguro del micrófono y estado en reposo latente.
* **Cinética:**
  * **Barra diagonal (`00_Muted_Slash_Indicator`):** Trazo diagonal carmesí/rosado `#E11D48` que cruza el orbe a $45^\circ$.
  * **Ojos en reposo suave:** Escala en Y al $70\%$ (ojos serenos descansados).
  * **Atenuación lumínica:** Opacidad del halo ambiental al $20\%$.
  * **Velocidad de reproducción Lottie:** $0.0\times$ (fotograma congelado en respiración media).
* **Recurso Lottie:** `res/raw/veya_avatar_muted_espera.json`.

---

## 3. Matriz de Transiciones Cinéticas (Curvas de Interpolación)

Para evitar saltos abruptos entre estados, en Compose se aplican interpoladores con especificaciones físicas concretas:

```kotlin
// Curva canónica para transiciones de expresión
val AvatarTransitionSpec = tween<Float>(
    durationMillis = 320,
    easing = CubicBezierEasing(0.25f, 0.1f, 0.25f, 1.0f) // FastOutSlowIn
)

// Curva elástica para reactividad RMS en habla
val AvatarVoiceSpring = spring<Float>(
    dampingRatio = Spring.DampingRatioMediumBouncy,
    stiffness = Spring.StiffnessLow
)
```

| Transición Origen $\to$ Destino | Duración | Comportamiento Óptico |
| :--- | :--- | :--- |
| `IDLE` $\to$ `LISTENING` | $200\text{ ms}$ | El orbe se expande $+4\%$, las ondas acústicas inician fase 0, ojos abren $+15\%$. |
| `LISTENING` $\to$ `THINKING` | $350\text{ ms}$ | Ojos suben en Y $-8\text{ px}$, ondas acústicas cesan, núcleo interno aumenta opacidad $+25\%$. |
| `THINKING` $\to$ `SPEAKING` | $180\text{ ms}$ | Ojos retornan a centro neutro, boca conmuta a modo apertura acústica interactiva. |
| `SPEAKING` $\to$ `IDLE` | $400\text{ ms}$ | La boca se relaja al arco de sonrisa, la escala elástica decae a $1.0\times$. |
| Cualquier $\to$ `MUTED` | $250\text{ ms}$ | La barra de mute se dibuja de izquierda a derecha, se atenúa el aura. |

---

## 4. Matriz de Moods y Tintado Dinámico en Compose

El cambio de Mood no requiere cambiar el archivo JSON; se inyecta en tiempo de ejecución:

```kotlin
val moodColor = when (mood) {
    AvatarMood.SERENO -> Color(0xFF0284C7)      // Azul Océano (Default Calmo)
    AvatarMood.CERCANO -> Color(0xFFD97706)     // Ámbar Dorado (Calidez)
    AvatarMood.CONCENTRADO -> Color(0xFF7C3AED) // Púrpura Foco (Estudio/Trabajo)
    AvatarMood.ANIMADO -> Color(0xFF10B981)     // Esmeralda Vital (Música/Entreno)
    AvatarMood.EMPATICO -> Color(0xFFEC4899)    // Rosa Compasión (Apoyo)
    AvatarMood.ESPERA -> Color(0xFF64748B)      // Pizarra Neutro (Reposo)
}

val dynamicProperties = rememberLottieDynamicProperties(
    rememberLottieDynamicProperty(
        property = LottieProperty.STROKE_COLOR,
        value = moodColor.toArgb(),
        keyPath = arrayOf("07_Body_Breathing_Orb", "Main_Sphere", "Rim_Light_Stroke")
    ),
    rememberLottieDynamicProperty(
        property = LottieProperty.COLOR_FILTER,
        value = moodColor.toArgb(),
        keyPath = arrayOf("04_Iris_Bioluminescence", "**")
    ),
    rememberLottieDynamicProperty(
        property = LottieProperty.STROKE_COLOR,
        value = moodColor.toArgb(),
        keyPath = arrayOf("06_Mouth_Micro_Expression", "**")
    )
)
```
