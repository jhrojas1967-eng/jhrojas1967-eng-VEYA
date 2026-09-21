# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: PANTALLA "METEOROLOGÍA" (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega de Pantalla Meteorológica & Pronóstico 5 Días para Claude Code  
**Documento:** `entregas/12_specs_screen_weather_m3_para_claude.md`  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX DataStore, Ktor/Retrofit & WorkManager.

---

## 1. RESUMEN Y ARQUITECTURA GENERAL

La pantalla **Meteorología** (`WeatherSettingsScreen.kt`) permite al usuario gestionar:
1. **Selector de ubicación manual (Sin GPS)**:
   * **PROHIBICIÓN ESTRICTA**: No solicitar `ACCESS_FINE_LOCATION` ni `ACCESS_COARSE_LOCATION`.
   * El usuario introduce su ciudad/municipio o selecciona una opción rápida. Las coordenadas se obtienen mediante la API libre de Geocodificación de Open-Meteo (`geocoding-api.open-meteo.com/v1/search`) y se almacenan de forma local en DataStore.
2. **Visualización de temperatura actual (Hero Card M3)**:
   * Temperatura destacada con tipografía de alto contraste (`displayLarge`), sensación térmica, estado del cielo, humedad relativa, velocidad de viento e índice UV.
3. **Pronóstico de 5 días con iconos M3**:
   * Desglose diario (Hoy, Mañana, D+2, D+3, D+4) con iconos vectoriales dinámicos, probabilidad de precipitación en porcentaje (%) y barra gráfica de amplitud térmica (mín/máx).
4. **Toggles de avisos meteorológicos proactivos**:
   * Switch general para activar sugerencias discretas del avatar VEYA.
   * Sub-toggles: aviso de paraguas por lluvia inminente (precipitación $> 50\%$), alerta de oscilación térmica brusca ($> 5^\circ\text{C}$) y resumen en el saludo matinal al desactivar la alarma.

---

## 2. ESQUEMA DE DATOS Y PREFERENCIAS

### `WeatherPreferences.kt`

```kotlin
package personal.veya.data.preferences

import androidx.datastore.preferences.core.*

object WeatherPreferenceKeys {
    val MANUAL_CITY_NAME = stringPreferencesKey("weather_city_name") // "Madrid (Centro), España"
    val MANUAL_LATITUDE = doublePreferencesKey("weather_latitude") // 40.4168
    val MANUAL_LONGITUDE = doublePreferencesKey("weather_longitude") // -3.7038
    val PROACTIVE_ALERTS_ENABLED = booleanPreferencesKey("weather_proactive_alerts")
    val MORNING_BRIEFING_ENABLED = booleanPreferencesKey("weather_morning_briefing")
    val UMBRELLA_ALERT_ENABLED = booleanPreferencesKey("weather_umbrella_alert")
    val THERMAL_SHIFT_ALERT_ENABLED = booleanPreferencesKey("weather_thermal_shift_alert")
}
```

---

## 3. CÓDIGO FUENTE JETPACK COMPOSE COMPLETO

### 3.1. `WeatherSettingsScreen.kt`

```kotlin
package personal.veya.ui.screen.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import personal.veya.domain.model.ForecastDayModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherSettingsScreen(
    onNavigateBack: () -> Unit,
    viewModel: WeatherViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    var showCitySearchDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Meteorología",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Previsión privada sin GPS",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                },
                actions = {
                    IconButton(onClick = viewModel::refreshForecast) {
                        Icon(Icons.Default.Refresh, contentDescription = "Actualizar clima")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.surface
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ZERO-GPS NOTICE
            item {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            Icons.Outlined.Shield,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                        Column {
                            Text(
                                text = "Privacidad de Ubicación Absoluta (Sin GPS)",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "VEYA no requiere permisos de localización de Android. Las previsiones se consultan con la API libre de Open-Meteo por nombre de ciudad.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // 1. SELECTOR DE UBICACIÓN MANUAL & 2. TEMPERATURA ACTUAL (HERO CARD)
            item {
                ElevatedCard(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = state.cityName,
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            TextButton(onClick = { showCitySearchDialog = true }) {
                                Text("Cambiar")
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Tarjeta Hero Temperatura Actual
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "${state.currentTemp}°C",
                                        style = MaterialTheme.typography.displayLarge,
                                        fontWeight = FontWeight.Black,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "${state.currentConditionText} · Sensación ${state.feelsLikeTemp}°C",
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Text(
                                        text = "Mín ${state.minTemp}°C / Máx ${state.maxTemp}°C",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                WeatherIconComposable(
                                    condition = state.currentConditionCode,
                                    modifier = Modifier.size(54.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Indicadores de Humedad, Viento e Índice UV
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            WeatherMetricBox(label = "Humedad", value = "${state.humidity}%", modifier = Modifier.weight(1f))
                            WeatherMetricBox(label = "Viento", value = "${state.windSpeed} km/h", modifier = Modifier.weight(1f))
                            WeatherMetricBox(label = "Índice UV", value = "${state.uvIndex} (Mod)", modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            // 3. PRONÓSTICO DE 5 DÍAS CON ICONOS M3
            item {
                Text(
                    text = "Pronóstico de 5 Días",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    state.forecastDays.forEachIndexed { index, day ->
                        ForecastDayCard(day = day, isToday = index == 0)
                    }
                }
            }

            // 4. TOGGLES DE AVISOS METEOROLÓGICOS PROACTIVOS
            item {
                ElevatedCard(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Avisos Meteorológicos Proactivos de VEYA",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // Master Toggle
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Activar Sugerencias Proactivas",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Intervenciones contextuales en tu rutina sin generar ruido",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = state.proactiveAlertsEnabled,
                                onCheckedChange = viewModel::setProactiveAlertsEnabled
                            )
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Sub-toggle: Paraguas por lluvia > 50%
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Aviso de paraguas (Lluvia inminente)",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Alerta si la probabilidad de lluvia supera el 50% en las próximas horas",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = state.umbrellaAlertEnabled,
                                onCheckedChange = viewModel::setUmbrellaAlertEnabled,
                                enabled = state.proactiveAlertsEnabled
                            )
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = MaterialTheme.colorScheme.outlineVariant)

                        // Sub-toggle: Aviso de cambios térmicos bruscos (> 5°C)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Alerta de oscilación térmica brusca",
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Aviso de abrigo si la variación supera los 5°C",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = state.thermalShiftAlertEnabled,
                                onCheckedChange = viewModel::setThermalShiftAlertEnabled,
                                enabled = state.proactiveAlertsEnabled
                            )
                        }
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }

    // DIÁLOGO M3 PARA SELECCIÓN DE CIUDAD
    if (showCitySearchDialog) {
        CitySelectionDialog(
            currentCity = state.cityName,
            onDismiss = { showCitySearchDialog = false },
            onSelectCity = { newCity ->
                viewModel.setCity(newCity)
                showCitySearchDialog = false
            }
        )
    }
}
```

---

## 4. COMPONENTES REUTILIZABLES M3

### 4.1. `ForecastDayCard.kt`

```kotlin
@Composable
fun ForecastDayCard(day: ForecastDayModel, isToday: Boolean) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = if (isToday) MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surfaceContainerHigh,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Día y fecha
            Column(modifier = Modifier.width(80.dp)) {
                Text(
                    text = day.dayName,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = day.dateStr,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Icono y condición
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f)
            ) {
                WeatherIconComposable(condition = day.conditionCode, modifier = Modifier.size(24.dp))
                Text(
                    text = day.conditionLabel,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            // Probabilidad de precipitación
            Text(
                text = "${day.rainProbability}% 🌧",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = if (day.rainProbability > 50) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
                modifier = Modifier.width(50.dp)
            )

            // Rango térmico
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "${day.tempMin}°",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "-",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = "${day.tempMax}°",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
```

---

## 5. CLIENTE HTTP OPEN-METEO (SIN API KEY NI TELEMETRÍA)

```kotlin
package personal.veya.data.remote

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import personal.veya.data.remote.dto.OpenMeteoResponseDto

class OpenMeteoClient(private val httpClient: HttpClient) {
    suspend fun getDailyForecast(latitude: Double, longitude: Double): OpenMeteoResponseDto {
        return httpClient.get("https://api.open-meteo.com/v1/forecast") {
            parameter("latitude", latitude)
            parameter("longitude", longitude)
            parameter("current_weather", true)
            parameter("hourly", "relativehumidity_2m,apparent_temperature,precipitation_probability,uv_index")
            parameter("daily", "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max")
            parameter("timezone", "auto")
        }.body()
    }
}
```

---

## 6. INSTRUCCIONES PARA CLAUDE CODE

Copia las siguientes instrucciones a Claude en tu terminal de Android:

```text
Claude, integra la pantalla "Meteorología" en Jetpack Compose respetando la especificación canónica:
1. Lee el archivo 'entregas/12_specs_screen_weather_m3_para_claude.md'.
2. Ubica los archivos en:
   - personal.veya.ui.screen.settings.WeatherSettingsScreen.kt
   - personal.veya.ui.screen.settings.WeatherViewModel.kt
   - personal.veya.data.remote.OpenMeteoClient.kt
   - personal.veya.data.preferences.WeatherPreferences.kt
3. REGLA ESTRICTA: No añadas ACCESS_FINE_LOCATION ni ACCESS_COARSE_LOCATION al AndroidManifest.xml. Toda ubicación es manual sin rastreo.
4. Implementa el pronóstico de 5 días con la API pública de Open-Meteo y los iconos correspondientes de Material 3.
5. Integra los conmutadores Switch para avisos proactivos (aviso de paraguas si probabilidad > 50% y alerta de cambios térmicos > 5°C).
```
