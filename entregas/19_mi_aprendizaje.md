# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: MI APRENDIZAJE (M3, PANTALLAS Y CATÁLOGO DE TARJETAS)

**De:** Gemini / Google AI Studio  
**Para:** José / Claude Code (Lead Integrador Android VEYA)  
**Documento de Entrega:** `entregas/19_mi_aprendizaje.md`  
**Paquete objetivo:** `personal.veya.ui.learning` / `personal.veya.data.learning`  
**Referencia de datos:** Directorio `entregas/aprendizaje/*.json`  

---

## 1. RESUMEN EJECUTIVO: QUÉ ES NUEVO

1. **Ampliación y revisión pedagógica con Figuras de Autoridad para Adolescentes**:
   - **Idiomas y Lingüística**: 4 bloques, 16 tarjetas explicadas por Noam Chomsky y Stephen Krashen (adquisición natural, filtro afectivo, fonética contrastada, falsos amigos y estrategias de circunloquio).
   - **Salud y Bienestar**: 4 bloques, 16 tarjetas explicadas por Ramón y Cajal, Rita Levi-Montalcini y Matthew Walker (desfase circadiano adolescente, eje intestino-cerebro, entrenamiento de fuerza sin mitos y el suspiro fisiológico contra la ansiedad).
   - **Tecnología e Inteligencia Artificial**: 4 bloques, 16 tarjetas explicadas por Alan Turing, Ada Lovelace y Claude Shannon (viaje del paquete de datos, criptografía de clave pública, memoria RAM vs SSD, y el funcionamiento probabilístico real de las redes neuronales y Transformers).
   - **Historia y Humanidades**: 4 bloques, 16 tarjetas explicadas por Sócrates, Mary Beard y Tucídides (el método mayéutico contra las fake news, la división de poderes de Montesquieu, las tres ocho y la crítica detectivesca de fuentes).
   - **Matemáticas y Modelado del Universo**: 5 bloques, 17 tarjetas explicadas por Gauss y Emmy Noether (el truco de Gauss de sumar 1 a 100 con 9 años, criptografía RSA con primos, derivadas con velocímetro, topología de la taza y donut, y plantillas matemáticas que modelan mareas, ondas y relatividad).
   - **Física y Cosmología**: 5 bloques, 17 tarjetas explicadas por Albert Einstein, Richard Feynman y Carl Sagan (gravedad como curvatura del espacio-tiempo, marea lunar, rotación terrestre, fusión estelar y relatividad especial).
   - **Derecho y Ciudadanía**: 4 bloques, 15 tarjetas explicadas por Montesquieu, Cesare Beccaria y Clara Campoamor (la Constitución, contratos cotidianos, presunción de inocencia y derechos laborales juveniles).
   - **Economía, Recursos Humanos y Formación del Profesorado**: Revisados y adaptados con casos prácticos y lenguaje claro sin tecnicismos opacos.

2. **Garantía de Formato JSON y Validación Estricta**:
   - Cada bloque contiene estrictamente entre 3 y 5 tarjetas con formato estándar `"cards": [{"q": "...", "a": "..."}]`.
   - Inclusión de metadatos `mentorRole` y `targetAudience` compatibles con el motor de flashcards de VEYA.
   - Textos honestos, cálidos, en riguroso español de España, con analogías vivas y sin condescendencia hacia la inteligencia de los jóvenes.

3. **Diseño de pantallas M3 completas**:
   - Catálogo general de materias con barras de progreso y categorías.
   - Experiencia de estudio interactiva por tarjetas (flashcards con giro háptico).
   - Sistema de Repaso Espaciado (SRS) on-device sin conexión a internet.

---

## 2. ARQUITECTURA DE PANTALLAS Y FLUJO DE USUARIO

```
ScreenLearning (Navegación principal)
  │
  ├── 1. LearningCatalogScreen.kt (Catálogo de Materias y Progreso Global)
  │      └── Selector de categoría (Todas, Ciencias, Humanidades, Salud, Tecnología)
  │
  ├── 2. LearningBlockDetailScreen.kt (Lista de Bloques de la Materia elegida)
  │      └── Indicador de tarjetas dominadas / pendientes por bloque
  │
  └── 3. LearningStudyCardScreen.kt (Sesión activa de tarjetas flashcards)
         ├── Cara frontal: Pregunta clara y concisa
         ├── Gesto de toque o swipe: Revelación suave de la respuesta
         └── Botones de autoevaluación: [ Repasar pronto ] [ Bien ] [ Dominada ]
```

---

## 3. MOCKUPS Y ESPECIFICACIÓN VISUAL (MATERIAL 3)

### 3.1. Pantalla 1: Catálogo de Materias (`LearningCatalogScreen.kt`)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Volver            Mi Aprendizaje                   🔍  ⚙️  │
│                     10 materias · 128 tarjetas activas       │
├──────────────────────────────────────────────────────────────┤
│  [ Todas ]  [ Ciencias ]  [ Humanidades ]  [ Salud ] [ Tec ] │  <- FilterChips M3
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TARJETA DE REPASO DEL DÍA (SRS PENDIENTE)                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🧠 8 tarjetas para repasar hoy                         │  │
│  │    Economía (3) · Salud y bienestar (5)                │  │
│  │    [ Iniciar sesión rápida (3 min) ➔ ]                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  MATERIAS DISPONIBLES                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 💶  Economía                                           │  │
│  │     4 bloques · 14 tarjetas                            │  │
│  │     ━━━━━━━━━━━━━━━━━━━░░░░░░░░  65% dominado          │  │
│  │     Último repaso: ayer · Inflación y política fiscal  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🍏  Salud y bienestar                         [ NUEVO ]│  │
│  │     4 bloques · 13 tarjetas                            │  │
│  │     ━━━━━░░░░░░░░░░░░░░░░░░░░░░  20% dominado          │  │
│  │     Último repaso: hace 3 días · Fisiología del sueño  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 💻  Tecnología e Informática                  [ NUEVO ]│  │
│  │     4 bloques · 13 tarjetas                            │  │
│  │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━  100% al día           │  │
│  │     Último repaso: hoy · Redes y Criptografía          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.2. Pantalla 2: Vista de Tarjeta Flashcard (`LearningStudyCardScreen.kt`)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Economía          Bloque 1/4 · Tarjeta 2 de 4        ✕     │
│                     Progreso de la sesión: ━━━━━░░░░░        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ PREGUNTA                                             │   │
│   │                                                      │   │
│   │ ¿Por qué la deflación prolongada suele ser temida   │   │
│   │ por los bancos centrales?                            │   │
│   │                                                      │   │
│   │                                                      │   │
│   │ 💡 [ Toca la tarjeta para ver la respuesta ]         │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   (Al tocar -> Animación de volteo 3D / desvanecimiento)     │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ RESPUESTA EXPLICADA                                  │   │
│   │                                                      │   │
│   │ Porque si los consumidores prevén que los precios   │   │
│   │ bajarán mañana, posponen sus compras e inversiones, │   │
│   │ contrayendo la actividad económica, los ingresos y   │   │
│   │ el empleo en una espiral recesiva.                   │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   ¿CÓMO LO HAS SENTIDO?                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│   │  🔄 Repasar  │   │   👍 Bien    │   │  ⭐ Dominada  │     │
│   │  (Mañana)    │   │  (en 4 días) │   │ (en 12 días) │     │
│   └──────────────┘   └──────────────┘   └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. MODELO DE DATOS Y PERSISTENCIA ON-DEVICE (ROOM / SQLITE)

Para garantizar la custodia soberana y el funcionamiento 100% sin conexión a internet, el progreso de aprendizaje se almacena en Room:

```kotlin
package personal.veya.data.learning

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.Instant

/**
 * Entidad que registra el estado de asimilación de cada tarjeta por el usuario.
 */
@Entity(tableName = "learning_progress")
data class LearningCardProgressEntity(
    @PrimaryKey val cardId: String,          // ej. "eco-b1-c1"
    val subjectId: String,                  // ej. "economia"
    val blockId: String,                    // ej. "eco-b1"
    val repetitionCount: Int = 0,           // Veces repasada con éxito
    val intervalDays: Int = 1,              // Días hasta el próximo repaso
    val easeFactor: Float = 2.5f,           // Factor de facilidad (algoritmo SRS)
    val lastReviewedAt: Instant? = null,
    val nextReviewDue: Instant = Instant.now(),
    val isMastered: Boolean = false
)
```

---

## 5. COMPONENTE JETPACK COMPOSE DE LA TARJETA DE ESTUDIO

```kotlin
package personal.veya.ui.learning

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import personal.veya.ui.theme.LocalVeyaSpacing

@Composable
fun FlashcardStudyItem(
    question: String,
    answer: String,
    onReviewClick: (rating: Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var isRevealed by remember { mutableStateOf(false) }
    val spacing = LocalVeyaSpacing.current

    val rotation by animateFloatAsState(
        targetValue = if (isRevealed) 180f else 0f,
        animationSpec = tween(durationMillis = 350),
        label = "cardFlipAnimation"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = spacing.screenHorizontalPadding),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ElevatedCard(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 240.dp)
                .graphicsLayer {
                    rotationY = rotation
                    cameraDistance = 12f * density
                }
                .clickable { isRevealed = !isRevealed },
            shape = MaterialTheme.shapes.large,
            colors = CardDefaults.elevatedCardColors(
                containerColor = if (rotation <= 90f) {
                    MaterialTheme.colorScheme.surface
                } else {
                    MaterialTheme.colorScheme.secondaryContainer
                }
            )
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(spacing.cardInternalPadding),
                contentAlignment = Alignment.Center
            ) {
                if (rotation <= 90f) {
                    // Cara A: Pregunta
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "PREGUNTA",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = question,
                            style = MaterialTheme.typography.titleMedium.copy(
                                lineHeight = 24.sp
                            ),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Text(
                            text = "Toca para voltear",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline
                        )
                    }
                } else {
                    // Cara B: Respuesta explicada (girada para leerse al derecho)
                    Column(
                        modifier = Modifier.graphicsLayer { rotationY = 180f },
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "RESPUESTA",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.secondary,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = answer,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                lineHeight = 22.sp
                            ),
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(spacing.cardGap))

        if (isRevealed) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        isRevealed = false
                        onReviewClick(1) // Repasar
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Repasar")
                }
                FilledTonalButton(
                    onClick = {
                        isRevealed = false
                        onReviewClick(2) // Bien
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Bien")
                }
                Button(
                    onClick = {
                        isRevealed = false
                        onReviewClick(3) // Dominada
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Dominada")
                }
            }
        }
    }
}
```

---

## 6. PROPUESTAS (MARCADAS SEGÚN REGLA FIRME)

* **«PROPUESTA 1 — Síntesis de Audio de Tarjetas en Reposo»**:  
  Permitir escuchar la pregunta y la respuesta mediante la voz neuronal seleccionada de VEYA (con una pausa de 4 segundos entre ambas para pensar), permitiendo repasar conceptos con la pantalla apagada mientras se pasea o viaja.
* **«PROPUESTA 2 — Tarjeta de Aprendizaje Breve en Pantalla Hoy»**:  
  Insertar opcionalmente una única tarjeta didáctica al final de la rutina matinal en la pantalla `Hoy`, bajo el lema "Píldora del día", reforzando el hábito de aprendizaje continuo sin esfuerzo.

---

## 7. ESPECIFICACIÓN DE CATÁLOGO G2: MENTORES DE AUTORIDAD Y PEDAGOGÍA PARA ADOLESCENTES

En esta versión revisada, cada materia ha sido reformulada asumiendo la voz y el rigor de los mayores referentes mundiales en su disciplina, adaptada con analogías cotidianas, ganchos empáticos y honestidad para adolescentes de 14 a 18 años:

| Materia | Archivo JSON | Figuras de Autoridad | Bloques | Tarjetas | Temáticas Clave para Jóvenes |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Idiomas y Lingüística** | `idiomas.json` | Noam Chomsky & Stephen Krashen | 4 | 16 | Adquisición natural vs. listas, filtro afectivo, ritmo del inglés (schwa), falsos amigos y técnica del circunloquio. |
| **Salud y Bienestar** | `salud_bienestar.json` | Ramón y Cajal, Rita Levi-Montalcini & Matthew Walker | 4 | 16 | Desfase circadiano adolescente, luz azul nocturna, eje intestino-cerebro, entrenamiento de fuerza sin mitos y suspiro fisiológico contra el estrés. |
| **Tecnología e Informática** | `tecnologia.json` | Alan Turing, Ada Lovelace & Claude Shannon | 4 | 16 | Viaje del paquete TCP/UDP por cables submarinos, criptografía asimétrica, transistores de silicio, y funcionamiento probabilístico de la IA sin magia. |
| **Historia y Humanidades** | `historia_humanidades.json` | Sócrates, Mary Beard & Tucídides | 4 | 16 | Preguntas socráticas contra fake news, separación de poderes de Montesquieu, las tres ocho en la revolución industrial y el método del historiador. |
| **Matemáticas** | `matematicas.json` | Carl Friedrich Gauss & Emmy Noether | 5 | 17 | Truco de Gauss sumando 1 a 100 con 9 años, primos gigantes en RSA, velocímetro como derivada, paradoja de Monty Hall y plantillas matemáticas universales (mareas, ondas, relatividad). |
| **Física y Cosmología** | `fisica.json` | Albert Einstein, Richard Feynman & Carl Sagan | 5 | 17 | Gravedad como curvatura del espacio-tiempo, marea lunar, rotación terrestre, fusión estelar y relatividad especial explicada para adolescentes. |
| **Derecho y Ciudadanía** | `derecho.json` | Montesquieu, Cesare Beccaria & Clara Campoamor | 4 | 15 | Constitución, contratos de alquiler y compras, presunción de inocencia, sufragio universal y derechos en el primer empleo. |

### 7.1. Estructura de Bloque Estándar en JSON
```json
{
  "subjectId": "identificador_unico",
  "subjectTitle": "Título de la Materia",
  "category": "categoria_m3",
  "mentorRole": "Nombre de la Autoridad · Especialidad y Pedagogía",
  "targetAudience": "Adolescentes y mentes curiosas · Enfoque",
  "description": "Breve sinopsis cálida y rigurosa",
  "blocks": [
    {
      "id": "prefijo-b1",
      "title": "Título del Bloque",
      "description": "Descripción pedagógica",
      "cards": [
        { "q": "¿Pregunta desafiante o cotidiana?", "a": "Respuesta rigurosa explicada con analogía clara." },
        { "q": "...", "a": "..." },
        { "q": "...", "a": "..." }
      ]
    }
  ]
}
```
*Cada bloque cuenta estrictamente con entre 3 y 5 tarjetas de alta calidad educativa.*
