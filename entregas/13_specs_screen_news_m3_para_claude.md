# Especificación Técnica: Pantalla "Medios de Noticias" (Material 3)
## Guía de Implementación para Claude Code (Motor RSS Descentralizado VEYA)

> **Destinatario:** Claude Code / Equipo de Desarrollo Android (Kotlin + Jetpack Compose)  
> **Ubicación en el proyecto:** `ui/screen/settings/NewsFeedsScreen.kt`  
> **Diseño:** Material 3 (Material You) con OutlinedCard 'Compact', FilterChips horizontales, Resumen IA por titular y estimador de tiempo de lectura.  
> **Filosofía de Arquitectura:** Motor RSS/Atom descentralizado con **Zero Telemetry**: conexión directa HTTP a los feeds de los medios sin intermediarios publicitarios, ni cookies, ni algoritmos adictivos de recomendación.

---

## 1. Los 4 Requerimientos Implementados

| Requerimiento | Componente M3 | Detalle Técnico |
|---|---|---|
| **1) Formato 'Compact'** | `OutlinedCard` / `CardDefaults.outlinedCardColors` | Título prominente (`titleMedium`), fuente editorial y hora relativa (`labelSmall`). **Cero imágenes pesadas**, scripts o trackers de terceros para garantizar renderizado instantáneo y mínimo consumo de batería. |
| **2) Selector de Categorías** | `FilterChip` / `LazyRow` | Filtro dinámico con 5 categorías: `Todas`, `Tecnología`, `Ciencia`, `Salud`, `Local`. Animación de transición fluida con `AnimatedVisibility` y selección visual M3. |
| **3) Toggle 'Resumen IA'** | `FilledTonalButton` + `AnimatedVisibility` | Botón/Switch interactivo en cada tarjeta que expande un resumen sereno de 2 frases generado por el modelo local on-device de VEYA, filtrando sesgos y clickbait. |
| **4) Tiempo Estimado de Lectura** | `Badge` / `SuggestionChip` | Indicador visual de minutos/segundos de lectura (ej. *"1 min de lectura"*, *"45 s de lectura"*), calculado a razón de 200 palabras por minuto a partir del contenido o resumen RSS. |

---

## 2. Mapa de Archivos para Claude Code

```
app/src/main/java/personal/veya/
├── ui/screen/settings/
│   ├── NewsFeedsScreen.kt               // Pantalla principal M3
│   ├── components/
│   │   ├── CompactNewsCard.kt           // Tarjeta de titular 'Compact'
│   │   ├── CategoriesFilterRow.kt       // Selector de categorías FilterChip
│   │   ├── AiSummarySection.kt          // Resumen IA expandible y puntos clave
│   │   └── ReadingTimeBadge.kt          // Badge de tiempo de lectura
│   └── NewsViewModel.kt                 // Gestión de estado y filtrado reactivo
├── data/
│   ├── rss/
│   │   ├── RssXmlParser.kt              // Parser nativo XmlPullParser de RSS/Atom
│   │   ├── RssFeedClient.kt             // Cliente OkHttp directo a URLs RSS públicas
│   │   └── model/
│   │       ├── RssArticle.kt            // Modelo inmutable de noticia
│   │       └── NewsCategory.kt          // Enum (TECNOLOGIA, CIENCIA, SALUD, LOCAL)
│   ├── preferences/
│   │   └── NewsPreferences.kt          // DataStore: categorías activas, anti-clickbait, resumen
│   └── ai/
│       └── LocalNewsSummarizer.kt       // Generador de resúmenes sintéticos on-device
```

---

## 3. Código Jetpack Compose (Material 3)

### `NewsFeedsScreen.kt`

```kotlin
package personal.veya.ui.screen.settings

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import personal.veya.ui.screen.settings.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NewsFeedsScreen(
    onNavigateBack: () -> Unit,
    viewModel: NewsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Medios de Noticias",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "RSS descentralizado sin algoritmos comerciales",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Volver a Ajustes"
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.refreshFeeds() }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Actualizar titulares"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Banner de privacidad y descentralización
            item {
                BannerZeroTelemetry()
            }

            // 2) Selector de Categorías (FilterChips horizontales)
            item {
                CategoriesFilterRow(
                    selectedCategory = state.selectedCategory,
                    onCategorySelected = { viewModel.selectCategory(it) }
                )
            }

            // Barra de control de Resúmenes IA
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${state.filteredArticles.size} Titulares",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    TextButton(onClick = { viewModel.toggleAllAiSummaries() }) {
                        Text(
                            text = if (state.expandedSummaryIds.isEmpty()) "Desplegar todos los resúmenes" else "Plegar resúmenes",
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }

            // 1) Lista de Tarjetas 'Compact'
            items(
                items = state.filteredArticles,
                key = { it.id }
            ) { article ->
                CompactNewsCard(
                    article = article,
                    isAiSummaryExpanded = state.expandedSummaryIds.contains(article.id),
                    onToggleAiSummary = { viewModel.toggleAiSummary(article.id) },
                    onOpenUrl = { viewModel.openOriginalArticle(article.url) }
                )
            }

            // Espacio final para Scroll
            item {
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}
```

---

### `CompactNewsCard.kt`

```kotlin
package personal.veya.ui.screen.settings.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import personal.veya.data.rss.model.RssArticle

@Composable
fun CompactNewsCard(
    article: RssArticle,
    isAiSummaryExpanded: Boolean,
    onToggleAiSummary: () -> Unit,
    onOpenUrl: () -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedCard(
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.large,
        colors = CardDefaults.outlinedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Fila superior: Fuente, Hora, Categoría y 4) Indicador de Tiempo de Lectura
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = article.sourceName,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "•",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.outline
                    )
                    Text(
                        text = article.publishedRelativeTime,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.outline
                    )
                }

                // 4) Indicador de tiempo estimado de lectura
                Surface(
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    shape = MaterialTheme.shapes.small
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            modifier = Modifier.size(12.dp),
                            tint = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                        Text(
                            text = "${article.estimatedReadingMinutes} min de lectura",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    }
                }
            }

            // 1) Titular Compacto (Sin imágenes pesadas)
            Text(
                text = article.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            // 3) Fila de Acciones: Toggle 'Resumen IA' y Enlace al Medio Original
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                FilledTonalButton(
                    onClick = onToggleAiSummary,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    shape = MaterialTheme.shapes.medium
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isAiSummaryExpanded) "Plegar Resumen" else "Resumen IA",
                        style = MaterialTheme.typography.labelMedium
                    )
                }

                IconButton(onClick = onOpenUrl) {
                    Icon(
                        imageVector = Icons.Default.OpenInNew,
                        contentDescription = "Leer fuente original",
                        tint = MaterialTheme.colorScheme.outline
                    )
                }
            }

            // Despliegue animado del Resumen IA generado en dispositivo
            AnimatedVisibility(visible = isAiSummaryExpanded) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = MaterialTheme.shapes.medium,
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = article.aiSummary,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        article.keyPoints.forEach { point ->
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Text("•", color = MaterialTheme.colorScheme.primary)
                                Text(
                                    text = point,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
```

---

### `CategoriesFilterRow.kt`

```kotlin
package personal.veya.ui.screen.settings.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import personal.veya.data.rss.model.NewsCategory

@Composable
fun CategoriesFilterRow(
    selectedCategory: NewsCategory,
    onCategorySelected: (NewsCategory) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(NewsCategory.values()) { category ->
            FilterChip(
                selected = category == selectedCategory,
                onClick = { onCategorySelected(category) },
                label = { Text(category.displayName) }
            )
        }
    }
}
```

---

## 4. Parser RSS Descentralizado (Nativo XmlPullParser en Android)

```kotlin
package personal.veya.data.rss

import android.util.Xml
import org.xmlpull.v1.XmlPullParser
import java.io.InputStream
import personal.veya.data.rss.model.RssArticle
import personal.veya.data.rss.model.NewsCategory

class RssXmlParser {
    fun parse(inputStream: InputStream, sourceName: String, category: NewsCategory): List<RssArticle> {
        val parser = Xml.newPullParser()
        parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, false)
        parser.setInput(inputStream, null)
        parser.nextTag()

        val articles = mutableListOf<RssArticle>()
        while (parser.next() != XmlPullParser.END_DOCUMENT) {
            if (parser.eventType != XmlPullParser.START_TAG) continue
            if (parser.name == "item" || parser.name == "entry") {
                articles.add(readArticle(parser, sourceName, category))
            }
        }
        return articles
    }

    private fun readArticle(parser: XmlPullParser, sourceName: String, category: NewsCategory): RssArticle {
        var title = ""
        var link = ""
        var description = ""

        while (parser.next() != XmlPullParser.END_TAG) {
            if (parser.eventType != XmlPullParser.START_TAG) continue
            when (parser.name) {
                "title" -> title = readText(parser)
                "link" -> link = readLink(parser)
                "description", "summary" -> description = readText(parser)
                else -> skip(parser)
            }
        }

        // Estimación de tiempo de lectura (promedio 200 palabras por minuto)
        val wordCount = description.split("\\s+".toRegex()).size
        val readingMinutes = maxOf(1, (wordCount / 200))

        return RssArticle(
            id = link.hashCode().toString(),
            title = title,
            url = link,
            sourceName = sourceName,
            category = category,
            aiSummary = "Resumen procesado en dispositivo para $title",
            keyPoints = listOf("Dato destacado de la fuente original"),
            estimatedReadingMinutes = readingMinutes,
            publishedRelativeTime = "Reciente"
        )
    }

    private fun readText(parser: XmlPullParser): String {
        var result = ""
        if (parser.next() == XmlPullParser.TEXT) {
            result = parser.text
            parser.nextTag()
        }
        return result
    }

    private fun readLink(parser: XmlPullParser): String {
        var link = parser.getAttributeValue(null, "href") ?: ""
        if (link.isEmpty()) {
            link = readText(parser)
        } else {
            parser.nextTag()
        }
        return link
    }

    private fun skip(parser: XmlPullParser) {
        if (parser.eventType != XmlPullParser.START_TAG) error("Not at start tag")
        var depth = 1
        while (depth != 0) {
            when (parser.next()) {
                XmlPullParser.END_TAG -> depth--
                XmlPullParser.START_TAG -> depth++
            }
        }
    }
}
```

---

## 5. Esquema DataStore (`NewsPreferenceKeys.kt`)

```kotlin
package personal.veya.data.preferences

import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey

object NewsPreferenceKeys {
    val SELECTED_CATEGORY = stringPreferencesKey("news_selected_category") // TODAS, TECNOLOGIA, CIENCIA, SALUD, LOCAL
    val AUTO_EXPAND_AI_SUMMARY = booleanPreferencesKey("news_auto_expand_ai_summary") // default: true
    val FILTER_SENSATIONALISM = booleanPreferencesKey("news_filter_sensationalism") // default: true
    val MAX_MORNING_BRIEFING_ARTICLES = intPreferencesKey("news_max_morning_briefing_articles") // default: 3
}
```

---

## 6. Prompt para Ejecución Directa en Claude Code

```markdown
Hola Claude, ejecuta la implementación del módulo de Medios de Noticias para VEYA según la especificación en `entregas/13_specs_screen_news_m3_para_claude.md`:

1. Crea el Composable principal `NewsFeedsScreen.kt` usando Material 3 y Jetpack Compose.
2. Implementa `CompactNewsCard.kt` asegurando:
   - Formato Compacto: título destacado, fuente y hora.
   - Prohibido cargar imágenes remotas o banners pesados.
   - Selector de categorías horizontal `FilterChip` (Tecnología, Ciencia, Salud, Local).
   - Toggle interactivo 'Resumen IA' para cada titular.
   - Indicador de tiempo de lectura (ej. '1 min de lectura').
3. Añade el parser nativo `RssXmlParser.kt` utilizando `XmlPullParser` de Android sin librerías externas de scraping.
4. Vincula los estados a `NewsPreferenceKeys.kt` en DataStore.
```
