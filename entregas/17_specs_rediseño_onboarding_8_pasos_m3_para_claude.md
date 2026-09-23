# Entrega 17: Rediseño Visual del Onboarding de VEYA (Material 3 + Jetpack Compose)

**Art Director:** Gemini Design & UI Studio  
**Destinatario:** Claude Code (Ingeniero Android Lead) & Equipo de Arquitectura VEYA  
**Versión de especificación:** v2.0 (8 pasos, reanudable, con narración por voz y avatar por paso, nuevo paso de Alarmas y checklist final de bienvenida)  
**Principios irrenunciables:** Local-First, sin streaming como base, sin telemetría, sin SQLCipher (Android Keystore con AES-256-GCM nativo).

---

## 1. Sistema Visual Coherente M3 + Tokens de VEYA

### 1.1 Paleta Tonal Dinámica (Modo Claro & Oscuro)

| Token M3 | Modo Claro (HEX) | Modo Oscuro (HEX) | Uso en Onboarding |
| :--- | :--- | :--- | :--- |
| `primary` | `#155E95` | `#8ECEFF` | Botón CTA principal, selector de paso activo, bordes destacados |
| `onPrimary` | `#FFFFFF` | `#003355` | Texto/icono sobre botón de acción primario |
| `primaryContainer` | `#D7EEFF` | `#004A7B` | Píldoras de selección activa, tarjeta de voz activa |
| `onPrimaryContainer` | `#001D33` | `#D7EEFF` | Texto contrastado sobre contenedor primario |
| `secondary` | `#7654A7` | `#DCB8FF` | Acento emocional, calidez de voz, trato cercano |
| `secondaryContainer` | `#F2DAFF` | `#5D3C8D` | Tarjeta de trato personal y bienestar |
| `tertiary` | `#006A67` | `#80D5D0` | Acentos de rutinas y privacidad soberana |
| `surface` | `#F7FAFC` | `#101418` | Fondo de pantalla general |
| `surfaceContainerLow` | `#FFFFFF` | `#141A22` | Tarjeta de contenido interactivo del paso actual |
| `surfaceContainerHigh` | `#EAEFF5` | `#1C242E` | Búferes, inputs y selectores inactivos |
| `outline` | `#72777F` | `#8C9199` | Bordes sutiles y divisores |
| `outlineVariant` | `#E2E8F0` | `#232B36` | Contornos de tarjetas no seleccionadas |

### 1.2 Geometría y Elevaciones M3
- **Contenedores de Paso (Cards):** `rounded-3xl` (`28dp` / `ShapeDefaults.Large` o `ExtraLarge`).
- **Botones y Segmentos:** `rounded-2xl` (`16dp`) para interactivos táctiles con altura mínima accesible de `48dp` (WCAG AAA).
- **Indicador de Progreso:** Segmented Progress Bar lineal con píldora elástica de ancho variable (`w-6` activo, `w-2` completado en `#10B981` esmeralda, `w-2` pendiente en tono neutral).

---

## 2. Los 8 Pasos Canónicos: Ilustración/Acento + Microcopys Cálidos

| Paso | Título Canónico | Icono / Acento | Microcopy Cálido (Voz en off del Asistente) | Acción Principal / Input |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Bienvenida y Privacidad** | `ShieldCheck` + `Heart` (`#006A67`) | *"Hola. Soy VEYA. Nací para acompañarte con calma, sin enviar jamás tus datos ni tu voz a ningún servidor externo."* | Confirmación de soberanía criptográfica y garantía Zero-Knowledge. |
| **2** | **Tu Compañero** | `User` + `Sparkles` (`#155E95`) | *"Para que nuestra relación sea natural: ¿cómo te gusta que te llamen y qué nombre prefieres darme?"* | Inputs de texto: Nombre de usuario (`userName`) y Asistente (`assistantName`), selector tú/usted. |
| **3** | **Voz y Estilo** | `Volume2` + `Sliders` (`#7654A7`) | *"Mi voz vive en tu teléfono. Elige la calidez y el ritmo que sientas más agradable para conversar."* | Selector de voz (Aura, Brisa, Eco) con botón de escucha previa en local y barra de calidez. |
| **4** | **Apariencia y Accesibilidad** | `Sun` / `Moon` + `Eye` (`#155E95`) | *"Adapto mis colores y movimientos a tu vista. ¿Prefieres un tema claro, oscuro o reducir mis animaciones?"* | Tema (Claro, Oscuro, Sistema) y Toggle de Movimiento Reducido (`reducedMotion`). |
| **5** | **Alarma y Rutina Matinal** | `Bell` + `Clock` (`#E11D48`) | *"Despertar con paz cambia tu día. Dime a qué hora quieres que suene tu alarma y qué días te acompaño."* | **Selector de Hora (HH:MM) + Selector de Días de la semana + Resumen hablado:** Verbaliza en español natural (ej: *"Alarma programada a las 07:30 los lunes, miércoles y viernes..."* o *"de lunes a viernes"* / *"los fines de semana"*, nunca letras sueltas 'L', 'M'). |
| **6** | **Música Local** | `Music` + `Folder` (`#155E95`) | *"Tu música favorita vive en tu almacenamiento. VEYA reproduce tus pistas sin conexión y sin consumir datos."* | Selección de carpetas locales (`/Music/Veya`) y lista de pistas de alta fidelidad FLAC/WAV. |
| **7** | **Medios de Noticias** | `Newspaper` + `Rss` (`#4F46E5`) | *"Mantente al día sin ruido ni algoritmos adictivos. Resúmenes matinales limpios de tus fuentes RSS elegidas."* | Checkboxes de fuentes RSS respetuosas (Tecnología, Cultura, Ciencia, Actualidad). |
| **8** | **Resumen y Checklist** | `CheckCircle2` + `Sparkles` (`#10B981`) | *"Todo listo. Tu privacidad está sellada y tus rutinas configuradas. Aquí tienes tu guía de inicio rápido."* | **Checklist interactivo** con enlaces directos a cada sección de Ajustes para reajustar cuando quieras. |

---

## 3. Guía de Motion del Avatar por Paso (Mapeo de Estado/Mood)

El avatar volumétrico Pixar/Disney 2.5D actúa como el **anfitrión y guía sensorial permanente** durante todo el flujo.

```
       [Paso 1: Bienvenida]           ---> State: 'speaking' | Mood: 'cercano' (Sonrisa leve, mirada directa)
              │
       [Paso 2: Compañero]            ---> State: 'listening' | Mood: 'empatico' (Atención a la escritura del usuario)
              │
       [Paso 3: Voz y Estilo]         ---> State: 'speaking' | Mood: 'animado' (Ondulación armónica de partículas)
              │
       [Paso 4: Apariencia/A11y]      ---> State: 'idle' | Mood: 'sereno' (Respiración sutil, acomodación visual)
              │
       [Paso 5: Alarma y Rutina]      ---> State: 'thinking' | Mood: 'concentrado' -> 'speaking' (Resumen hablado)
              │
       [Paso 6: Música Local]         ---> State: 'speaking' | Mood: 'animado' (Pulso rítmico con la melodía de prueba)
              │
       [Paso 7: Noticias RSS]         ---> State: 'idle' | Mood: 'sereno' (Gaze atento, sin distracciones)
              │
       [Paso 8: Checklist Final]      ---> State: 'speaking' | Mood: 'animado' -> 'cercano' (Celebración y bienvenida)
```

### Tabla de Transición y Parámetros Motion
| Paso | `AvatarState` | `AvatarMood` | Amplitud | Partículas | Gaze Interactivo | Comportamiento en Movimiento Reducido |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | `speaking` | `cercano` | 0.6 | Flotación suave | Sí (Sigue puntero) | Sin balanceo ni partículas flotantes; ojos estáticos con parpadeo suave |
| 2 | `listening` | `empatico` | 0.4 | Inactivas | Sí (Mira hacia el campo de texto) | Transición de opacidad pura sin desplazamiento vertical |
| 3 | `speaking` | `animado` | 0.8 | Órbita armónica | Sí | Onda de audio lineal sin oscilaciones elásticas |
| 4 | `idle` | `sereno` | 0.3 | Suave | No (Centro) | Iluminación continua sin destellos |
| 5 | `thinking` | `concentrado` | 0.5 | Púrpura/Azul | Sí (Apunta a la hora) | Indicador estático de sincronía sin rotación |
| 6 | `speaking` | `animado` | 0.7 | Ondas de ecualizador | Sí | Rebote desactivado |
| 7 | `idle` | `sereno` | 0.4 | Suave | Sí | Sin paneo |
| 8 | `speaking` | `animado` | 0.9 | Chispa dorada de celebración | Sí | Icono de verificación sólido y aura suave fija |

---

## 4. Pantalla de Resumen Final (Paso 8: Checklist con Enlaces a Ajustes)

En el paso 8, se presenta un **Checklist de Inicio Rápido (Launch Checklist)** que sintetiza lo configurado y ofrece enlaces directos para saltar a cualquier pantalla de Ajustes en caso de querer refinar:

1. **Tu Compañero:** Nombre (`José`) y Trato (`Tú`) `[Modificar -> Ajustes > Mi compañero]`
2. **Tu Voz:** Voz Aura (`Calidez 75%`, `Velocidad 1.0x`) `[Escuchar -> Ajustes > Mi voz y personalidad]`
3. **Tu Inteligencia:** Motor local soberano con Gemini/BYO `[Revisar -> Ajustes > Mi inteligencia]`
4. **Tu Alarma Matinal:** `07:30`, días de semana, con fade-in `[Editar -> Ajustes > Mi música de alarma]`
5. **Tu Bóveda Privada:** Almacenamiento 100% cifrado por hardware en terminal `[Ver -> Ajustes > Mi memoria y privacidad]`

Al pulsar **"Comenzar mi experiencia con VEYA"**, el flujo guarda el estado de Onboarding completado en `localStorage` / `SharedPreferences` y transiciona con `Crossfade(animationSpec = tween(450))` hacia la pantalla **Hoy (`ScreenToday`)**.

---

## 5. Accesibilidad y Soporte para Movimiento Reducido (WCAG 2.2 AAA)

1. **Tokens de Contraste:** 
   - Fondos oscuros `#101418` con texto `#F7FAFC` (ratio 15.8:1).
   - Fondos claros `#F7FAFC` con texto `#0F172A` (ratio 16.2:1).
2. **Áreas Táctiles:**
   - Botón continuar y checkboxes con altura mínima de `52dp`.
   - Espaciado entre elementos táctiles mayor o igual a `8dp`.
3. **Modo Movimiento Reducido (`reducedMotion = true`):**
   - El avatar desactiva el bobbing elástico vertical, la distorsión squish y la generación continua de partículas en Canvas.
   - Las transiciones de pantalla se ejecutan exclusivamente mediante fundido cruzado alfa (`fade-in` / `fade-out`) sin deslizamientos laterales que puedan inducir mareo vestibular.
4. **Semántica de Lectura de Pantalla (TalkBack / Screen Readers):**
   - El resumen hablado del paso de alarma genera un `AccessibilityLiveRegion` con el texto completo para que el motor TTS de Android lo lea automáticamente al cambiar la hora o los días.

---

## 6. Contrato de Implementación en Jetpack Compose (Kotlin 2.0)

```kotlin
// Android Architecture Component: OnboardingState & Step Navigation
@Immutable
data class VeyaOnboardingUiState(
    val currentStepIndex: Int = 0,
    val userName: String = "José",
    val assistantName: String = "VEYA",
    val pronounTreatment: PronounTreatment = PronounTreatment.TU,
    val selectedVoiceId: String = "voice_aura",
    val reducedMotion: Boolean = false,
    val alarmTime: LocalTime = LocalTime.of(7, 30),
    val alarmDays: Set<DayOfWeek> = setOf(
        DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY, DayOfWeek.FRIDAY
    ),
    val spokenSummary: String = "Alarma fijada a las 07:30 de lunes a viernes con despertar progresivo.",
    val isCompleted: Boolean = false
)

@Composable
fun ScreenOnboardingM3(
    uiState: VeyaOnboardingUiState,
    onStepChanged: (Int) -> Unit,
    onUpdateAlarm: (LocalTime, Set<DayOfWeek>) -> Unit,
    onNavigateToSettingsItem: (String) -> Unit,
    onFinishOnboarding: () -> Unit
) {
    Scaffold(
        topBar = {
            OnboardingTopBarM3(
                currentStep = uiState.currentStepIndex + 1,
                totalSteps = 8,
                onBack = { onStepChanged(uiState.currentStepIndex - 1) },
                onSkip = onFinishOnboarding
            )
        },
        bottomBar = {
            OnboardingNavigationFooterM3(
                isLastStep = uiState.currentStepIndex == 7,
                onNext = {
                    if (uiState.currentStepIndex < 7) onStepChanged(uiState.currentStepIndex + 1)
                    else onFinishOnboarding()
                }
            )
        },
        containerColor = MaterialTheme.colorScheme.surface
    ) { innerPadding ->
        AnimatedContent(
            targetState = uiState.currentStepIndex,
            transitionSpec = {
                if (uiState.reducedMotion) {
                    fadeIn(animationSpec = tween(200)) togetherWith fadeOut(animationSpec = tween(200))
                } else {
                    (slideInHorizontally { width -> width } + fadeIn()).togetherWith(
                        slideOutHorizontally { width -> -width } + fadeOut()
                    )
                }
            },
            modifier = Modifier.padding(innerPadding)
        ) { targetStep ->
            when (targetStep) {
                0 -> OnboardingStepWelcomeM3()
                1 -> OnboardingStepNamesM3(userName = uiState.userName, assistantName = uiState.assistantName)
                2 -> OnboardingStepVoiceM3(selectedVoiceId = uiState.selectedVoiceId)
                3 -> OnboardingStepAccessibilityM3(reducedMotion = uiState.reducedMotion)
                4 -> OnboardingStepAlarmM3(
                    time = uiState.alarmTime,
                    days = uiState.alarmDays,
                    summary = uiState.spokenSummary,
                    onTimeChange = { newTime -> onUpdateAlarm(newTime, uiState.alarmDays) }
                )
                5 -> OnboardingStepMusicM3()
                6 -> OnboardingStepNewsM3()
                7 -> OnboardingStepSummaryChecklistM3(
                    onJumpToSettings = onNavigateToSettingsItem
                )
            }
        }
    }
}
```
