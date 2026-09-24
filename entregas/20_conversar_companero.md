# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: CONVERSAR Y CATÁLOGO DEL COMPAÑERO (MATERIAL 3)

**De:** Gemini / Google AI Studio  
**Para:** José / Claude Code (Lead Integrador Android VEYA)  
**Documento de Entrega:** `entregas/20_conversar_companero.md`  
**Paquete objetivo:** `personal.veya.ui.chat` / `personal.veya.ui.today` / `personal.veya.ui.history`  
**Referencia de datos:** Directorio `entregas/companero/*.json` (12 catálogos temáticos)  
**Estado:** Finalizado · Contraste WCAG 2.1 AA / AAA · Regla de avatar intacto  

---

## 1. RESUMEN EJECUTIVO: QUÉ ES NUEVO

En esta entrega se articula la experiencia conversacional y de sugerencias proactivas de VEYA:

1. **Cabecera Compacta Dinámica en Chat**:
   - Al abrir el chat vacío, el avatar goza de presencia amplia y acogedora.
   - En cuanto hay al menos un mensaje en el hilo, la cabecera se comprime suavemente: el avatar se reubica en la barra superior en un tamaño discreto (44dp en Cómoda, 32dp en Compacta), concediendo el 85% de la superficie útil de pantalla al texto y a las tarjetas interactivas. **El avatar no sufre ninguna modificación interna ni de moods ni de lienzos**.
2. **Indicador «VEYA está pensando…»**:
   - Burbuja sutil con tres puntos pulsantes y tipografía en cursiva cálida mientras se procesa la inferencia en el modelo local o BYO.
3. **Botones de respuesta rápida (Quick Reply Chips)**:
   - Carrusel inferior de píldoras M3 que sugiere continuaciones contextuales al último mensaje recibido.
4. **Tarjeta de propuesta dentro del chat**:
   - Tarjeta enriquecida para recomendaciones de películas, series, libros, discos, recetas, escapadas o curiosidades, con botones de interacción ("La apunto", "Ya la conozco", "Cuéntame más").
5. **Tarjeta «Tu compañero» de Hoy en sus 3 estados**:
   - **Estado 1 (Reposo / Lista)**: Saludo matinal y presencia tranquila.
   - **Estado 2 (En reproducción / Activo)**: Reproducción de rutina o habla activa.
   - **Estado 3 (Seguimiento / Follow-Up)**: Días después, pregunta de forma cercana y sin presión qué te pareció la recomendación guardada.
6. **Pantalla «Lo que hemos hablado»**:
   - Vista de síntesis histórica organizada por temas y fechas, con filtro por categorías y acceso a recomendaciones guardadas.

---

## 2. ESPECIFICACIÓN DE LA PANTALLA DEL CHAT (G4)

### 2.1. Mockup ASCII de la Pantalla del Chat

```
┌──────────────────────────────────────────────────────────────┐
│ [←] [ Avatar 40dp ]  VEYA                    [Recuerdos: 4] ⋮│  <- Cabecera Compacta
│     Sereno · Trato: Tú                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Usuario · 10:14]                                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Recomiéndame alguna película española que me deje      │  │
│  │ pensando este fin de semana.                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [VEYA · 10:14]                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Te propongo esta joya de Víctor Erice. Es pausada,     │  │
│  │ bellísima y tiene una mirada infantil inolvidable:     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │  <- Tarjeta de Propuesta
│  │ 🎬 CINE · Película                                      │  │
│  │ El espíritu de la colmena (Víctor Erice)               │  │
│  │ ────────────────────────────────────────────────────── │  │
│  │ Una mirada infantil fascinada y silenciosa a la       │  │
│  │ posguerra castellana tras ver Frankenstein en el cine   │  │
│  │ ambulante. Su luz dorada se queda contigo días enteros.│  │
│  │                                                        │  │
│  │ [ 📌 La apunto para ver ]  [ ✓ Ya la he visto ]       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [VEYA · 10:15]                                              │
│  ┌──────────────────────────────┐                            │  <- Indicador Pensando
│  │ 💭 VEYA está pensando… • • • │                            │
│  └──────────────────────────────┘                            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [ ¿De qué año es? ]  [ Dime otra más reciente ]  [ Gracias ]│  <- Quick Reply Chips
├──────────────────────────────────────────────────────────────┤
│  [ 🎙️ ] [ Escribe a VEYA...                         ] [ ➤ ]  │  <- Barra de entrada
└──────────────────────────────────────────────────────────────┘
```

### 2.2. Tokens de Diseño Material 3 para Chat

| Elemento | Token Material 3 | Modo Claro | Modo Oscuro |
| :--- | :--- | :--- | :--- |
| **Fondo Pantalla** | `colorScheme.background` | `#F7FAFC` | `#101418` |
| **Burbuja Usuario Fondo** | `colorScheme.primary` | `#155E95` | `#8ECEFF` |
| **Burbuja Usuario Texto** | `colorScheme.onPrimary` | `#FFFFFF` | `#003355` |
| **Burbuja VEYA Fondo** | `colorScheme.surface` | `#FFFFFF` | `#1A222D` |
| **Burbuja VEYA Texto** | `colorScheme.onSurface` | `#16202A` | `#E0E3E8` |
| **Burbuja VEYA Borde** | `colorScheme.outlineVariant` | `#CBD2D9` (0.8dp) | `#42474E` |
| **Indicador «Pensando»** | `colorScheme.secondaryContainer`| `#F0E6FF` | `#2C0D5A` |
| **Texto «Pensando»** | `colorScheme.onSecondaryContainer`| `#2C0D5A` | `#F0E6FF` |
| **Tarjeta Propuesta Fondo**| `colorScheme.surfaceVariant` | `#F0F4F8` | `#141C24` |
| **Borde Tarjeta Propuesta**| `colorScheme.primaryContainer` | `#D7EEFF` | `#004A7B` |

---

## 3. TARJETA «TU COMPAÑERO» DE HOY EN SUS 3 ESTADOS

La tarjeta central de la pantalla `Hoy` comunica el estado de presencia de VEYA mediante una transición limpia y honesta:

### 3.1. Estado 1: En Reposo / Lista (`Idle / Ready`)
* **Momento:** Uso cotidiano habitual sin reproducción de audio activa.
* **Apariencia:** Avatar en respiración pausada, saludo temporalizado, frase de bienvenida corta y botones de acción rápida.
* **Texto:** *"VEYA está tranquila y lista · Buenos días, José. ¿Organizamos la mañana o prefieres conversar un rato?"*

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                         [ Avatar ]                           │
│                          (Reposado)                          │
│                                                              │
│              VEYA está tranquila y lista                     │
│       Buenos días, José. Cuando gustes, empezamos.           │
│                                                              │
│        [ ▶ Probar Rutina ]      [ ✨ Conversar ]             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.2. Estado 2: En Reproducción / Activo (`Playing / Active`)
* **Momento:** Cuando se inicia la rutina matinal o el usuario activa la escucha de voz por micrófono.
* **Apariencia:** Avatar modulando amplitud suavemente, indicador de paso actual y botón de pausa o silencio.
* **Texto:** *"Paso 3 de 6 · Previsión meteorológica sin rastreo GPS en curso..."*

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                     [ Avatar Reactivo ]                      │
│                        (Onda activa)                         │
│                                                              │
│                 Reproduciendo Rutina Matinal                 │
│              3/6 · Meteorología local (18°C)                 │
│                                                              │
│         [ ⏸ Pausar ]            [ ⏭ Saltar Paso ]           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.3. Estado 3: Seguimiento de Propuesta (`Follow-up / Feedback`)
* **Momento:** Entre 2 y 5 días después de que el usuario haya aceptado una sugerencia en el chat (por ejemplo, una película, un disco o un libro).
* **Apariencia:** Cabecera con insignia cálida, mención al título sugerido y opciones de valoración sinceras.
* **Texto:** *"¿Llegaste a ver El secreto de sus ojos? Tenía curiosidad por saber qué te pareció ese plano secuencia."*

```
┌──────────────────────────────────────────────────────────────┐
│  💬 RECORDATORIO DEL COMPAÑERO                               │
│                                                              │
│  El pasado martes guardaste esta película:                   │
│  🎬 El secreto de sus ojos                                   │
│                                                              │
│  ¿Llegaste a verla? ¿Qué te pareció?                         │
│                                                              │
│  [ Me encantó ]   [ Estuvo bien ]   [ No me gustó ]  [ Aún no ]
│                                                              │
│  [ Comentar en el chat con VEYA ➔ ]                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. PANTALLA «LO QUE HEMOS HABLADO» (`ConversationHistoryScreen.kt`)

Esta vista permite revisar la cronología de temas, reflexiones y recomendaciones intercambiadas, con búsqueda local cifrada y filtros temáticos:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Volver           Lo que hemos hablado               🔍  📅 │
│                    Historial temático y memoria local        │
├──────────────────────────────────────────────────────────────┤
│  [ Todos ]  [ Cine ]  [ Libros ]  [ Música ]  [ Ideas ]      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HOY · JUEVES 24 DE SEPTIEMBRE                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🎬 Cine y narrativa española                           │  │
│  │    Hablamos sobre El espíritu de la colmena y Víctor   │  │
│  │    Erice. Guardada para el fin de semana.              │  │
│  │    10:14 · 4 mensajes intercambiados                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  AYER · MIÉRCOLES 23 DE SEPTIEMBRE                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🌿 Pausas y bienestar                                  │  │
│  │    Reflexión breve sobre fatiga visual y respiración   │  │
│  │    después de picar código durante horas.              │  │
│  │    18:42 · 6 mensajes intercambiados                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  LUNES 21 DE SEPTIEMBRE                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🎵 Música y producción                                 │  │
│  │    Escuchamos detalles del disco Clics modernos de     │  │
│  │    Charly García y la anécdota de Nueva York.          │  │
│  │    Valoración: ⭐ Te pareció brillante                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [ 🗑️ Gestionar o vaciar historial en Bóveda de Memoria ]    │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. CATÁLOGO DEL COMPAÑERO (G3): MAPA DE ARCHIVOS ENTREGADOS

En cumplimiento de las instrucciones de José, se han generado **12 archivos JSON nuevos** en la carpeta `entregas/companero/`, sin tocar `base.json`, con entre 16 y 17 propuestas por tema, alto peso de cultura española e hispanoamericana, y textos originales y honestos:

1. `entregas/companero/cine.json` (17 propuestas · Erice, Campanella, Amenábar, Cuarón, Berlanga, Sorogoyen, etc.).
2. `entregas/companero/series.json` (17 propuestas · Crematorio, Fariña, Antidisturbios, Okupas, Los simuladores, etc.).
3. `entregas/companero/libros.json` (17 propuestas · Delibes, Rulfo, Borges, Irene Vallejo, Mariana Enriquez, etc.).
4. `entregas/companero/musica.json` (17 propuestas · Camarón, Charly García, Rosalía, Soda Stereo, Serrat, Drexler, etc.).
5. `entregas/companero/historia.json` (16 propuestas · Balmis, Cortes de León 1188, Galeón de Manila, Escuela de Toledo, etc.).
6. `entregas/companero/ciencia.json` (16 propuestas · Ramón y Cajal, Mario Molina, Margarita Salas, Torres Quevedo, etc.).
7. `entregas/companero/naturaleza.json` (16 propuestas · Posidonia de Formentera, Doñana, Lince ibérico, Perito Moreno, etc.).
8. `entregas/companero/deporte.json` (16 propuestas · Induráin, Seve Ballesteros, Nadal en Wimbledon, Maradona 86, Gasol, etc.).
9. `entregas/companero/cocina.json` (16 propuestas · Tortilla de patatas, Gazpacho andaluz, Ceviche, Fabada, Salmorejo, etc.).
10. `entregas/companero/viajes.json` (16 propuestas · Albarracín, Ronda, Cabo de Gata, Muralla de Ávila, Salar de Uyuni, etc.).
11. `entregas/companero/tecnologia.json` (16 propuestas · Enciclopedia de Ángela Ruiz Robles, Telekino, Cybersyn, MareNostrum, etc.).
12. `entregas/companero/arte.json` (16 propuestas · Meninas, Guernica, Saturno de Goya, Sorolla, Remedios Varo, Chillida, etc.).

---

## 6. CÓDIGO JETPACK COMPOSE PARA ANDROID

### 6.1. Componente de Tarjeta de Propuesta en Chat

```kotlin
package personal.veya.ui.chat

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import personal.veya.ui.theme.LocalVeyaSpacing

data class CompanionSuggestionUiModel(
    val id: String,
    val topic: String,
    val kind: String,
    val title: String,
    val pitch: String,
    val followUp: Boolean = true,
    val more: String? = null
)

@Composable
fun CompanionSuggestionCard(
    suggestion: CompanionSuggestionUiModel,
    onAccept: () => Unit,
    onDismiss: () => Unit,
    modifier: Modifier = Modifier
) {
    val spacing = LocalVeyaSpacing.current

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(spacing.cardInternalPadding)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${suggestion.topic} · ${suggestion.kind.uppercase()}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = suggestion.title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = suggestion.pitch,
                style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 20.sp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (!suggestion.more.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = suggestion.more,
                    style = MaterialTheme.typography.bodySmall.copy(lineHeight = 18.sp),
                    color = MaterialTheme.colorScheme.outline
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (suggestion.followUp) {
                    FilledTonalButton(
                        onClick = onAccept,
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Me la apunto",
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Ya la conozco",
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                } else {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "Curioso, gracias",
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
            }
        }
    }
}
```

### 6.2. Indicador «VEYA está pensando…»

```kotlin
package personal.veya.ui.chat

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun VeyaThinkingBubble(
    modifier: Modifier = Modifier,
    assistantName: String = "VEYA"
) {
    val infiniteTransition = rememberInfiniteTransition(label = "thinkingPulse")
    val alphaAnim by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Surface(
        modifier = modifier.padding(vertical = 4.dp),
        shape = MaterialTheme.shapes.small,
        color = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.7f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "$assistantName está pensando…",
                style = MaterialTheme.typography.bodySmall.copy(
                    fontSize = 12.sp,
                    fontStyle = FontStyle.Italic
                ),
                color = MaterialTheme.colorScheme.onSecondaryContainer
            )
            Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                repeat(3) {
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(
                                MaterialTheme.colorScheme.primary.copy(alpha = alphaAnim)
                            )
                    )
                }
            }
        }
    }
}
```

---

## 7. PROPUESTAS (MARCADAS SEGÚN REGLA FIRME)

* **«PROPUESTA 1 — Notificación Local de Seguimiento Silenciosa»**:  
  Si el usuario no entra en la pantalla Hoy transcurridos 4 días desde que apuntó una película o libro, programar mediante Android `WorkManager` un recordatorio silencioso en bandeja de notificaciones a las 20:30 con trato respetuoso: *"¿Tuviste un momento para ver El secreto de sus ojos? Cuando quieras me cuentas qué te pareció"*.

* **«PROPUESTA 2 — Filtro 'No sugerir más este tema'»**:  
  En los ajustes de `Tu Compañero`, añadir un interruptor para desactivar temas específicos del catálogo si el usuario no tiene interés en alguna categoría (por ejemplo, desactivar Deporte o Cocina), concentrando las propuestas en sus preferencias reales.
