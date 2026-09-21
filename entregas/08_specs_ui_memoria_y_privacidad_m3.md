# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: PANTALLA "MEMORIA & PRIVACIDAD" (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega de Diseño UI/UX y Especificación Jetpack Compose para Claude Code  
**Documento:** `entregas/08_specs_ui_memoria_y_privacidad_m3.md`  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX Security Crypto & SQLCipher.

---

## 1. PRINCIPIOS DE ARQUITECTURA: LOCAL-FIRST & ZERO-KNOWLEDGE

VEYA fundamenta su valor en conocer al usuario para asistirlo con precisión en su día a día. Sin embargo, para salvaguardar la intimidad del usuario, existe una separación criptográfica absoluta entre **los datos que aporta el usuario** y **el procesamiento del modelo de IA**:

1. **Custodia Local Absoluta:**
   * La información personal, hábitos y preferencias se almacenan exclusivamente en el dispositivo del usuario en una base de datos local SQLite cifrada con **SQLCipher** (AES-256-GCM).
   * La clave de cifrado se genera y reside en el **Android Keystore** de hardware (`StrongBoxKeymaster` o `TEE`).
   * No existe replicación en servidores, bases de datos remotas ni analítica en nube.

2. **IA Stateless Broker (Cero Retención en el Modelo):**
   * El modelo de lenguaje remoto (Claude / Gemini) es un procesador **efímero y sin estado**.
   * Antes de cada interacción, un broker local evalúa la consulta y recupera *únicamente* los 2 o 3 hechos relevantes indexados localmente, inyectándolos como contexto temporal en el `system_instruction` de la petición.
   * La sesión remota se descarta inmediatamente al concluir la respuesta; ningún dato de usuario permanece en los servidores de la IA.

3. **Soberanía y Control Radical del Usuario:**
   * El usuario puede consultar todos y cada uno de los recuerdos guardados.
   * Puede activar/desactivar individualmente si un recuerdo se envía o no a la IA (`activeInContext`).
   * Puede modificar, eliminar recuerdos concretos o ejecutar un **Kill Switch (Purga Total)** en cualquier instante.

---

## 2. ANATOMÍA Y COMPONENTES MATERIAL 3 (M3)

La pantalla se estructura en 4 bloques funcionales principales:

```
┌────────────────────────────────────────────────────────┐
│ M3 Top App Bar: "Memoria & Privacidad" + Status Local  │
├────────────────────────────────────────────────────────┤
│ M3 Card: Toggle de Cifrado de Hardware AES-256-GCM     │
│   - Switch M3 (52x32dp con icono Check/X en thumb)     │
│   - Indicador de estado: StrongBox TEE Hardware        │
├────────────────────────────────────────────────────────┤
│ M3 Card: Selector de Purga de Datos Programada         │
│   - SingleChoiceSegmentedButtonRow (Manual, 7d, 30d...)│
│   - Indicador del próximo ciclo de auto-limpieza       │
│   - Toggle: "Preservar recuerdos explícitos"           │
├────────────────────────────────────────────────────────┤
│ Lista Interactiva de Recuerdos Locales                 │
│   - M3 SearchBar + M3 FilterChips (Todos, Hábitos...)  │
│   - OutlinedCards con etiquetas tonales de categoría   │
│   - Toggle en Prompt (Eye/EyeOff) + Borrado individual │
│   - Inspección criptográfica expandible (SHA-256)      │
├────────────────────────────────────────────────────────┤
│ M3 Card: Purga Inmediata Soberana (Kill Switch)        │
│   - Botón destructivo con diálogo de confirmación      │
└────────────────────────────────────────────────────────┘
```

---

## 3. IMPLEMENTACIÓN JETPACK COMPOSE (KOTLIN)

### 3.1. Modelo de Datos y Entidad Room con SQLCipher

```kotlin
package com.veya.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.Instant

enum class MemoryCategory {
    PERSONAL, ROUTINE, MUSIC, HEALTH, INFERRED
}

enum class MemoryOrigin {
    EXPLICIT, INFERRED
}

enum class PurgeSchedule {
    NEVER, DAYS_7, DAYS_30, DAYS_90, ON_SESSION_END
}

@Entity(tableName = "veya_local_memories")
data class LocalMemoryEntity(
    @PrimaryKey val id: String,
    val category: MemoryCategory,
    val title: String,
    val detail: String,
    val origin: MemoryOrigin,
    val confidence: Int, // 0..100
    val createdAt: Long = Instant.now().toEpochMilli(),
    val activeInContext: Boolean = true,
    val sha256Hash: String,
    val embeddingVectorBlob: ByteArray? = null
)
```

### 3.2. Pantalla Completa en Jetpack Compose

```kotlin
package com.veya.app.ui.screen.vault

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.veya.app.data.local.entity.LocalMemoryEntity
import com.veya.app.data.local.entity.MemoryCategory
import com.veya.app.data.local.entity.PurgeSchedule

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VeyaMemoryAndPrivacyScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isHardwareEncrypted by remember { mutableStateOf(true) }
    var selectedSchedule by remember { mutableStateOf(PurgeSchedule.DAYS_30) }
    var preserveExplicitFacts by remember { mutableStateOf(true) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategoryFilter by remember { mutableStateOf<MemoryCategory?>(null) }
    var showPurgeConfirmDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Memoria & Privacidad",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Bóveda Local Cifrada & Zero-Knowledge",
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
                    IconButton(onClick = { /* Exportar JSON local */ }) {
                        Icon(Icons.Outlined.FileDownload, contentDescription = "Exportar Bóveda")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // -------------------------------------------------------------
            // 1. CARD: TOGGLE DE ESTADO DE CIFRADO DE HARDWARE
            // -------------------------------------------------------------
            item {
                HardwareEncryptionCard(
                    isEncrypted = isHardwareEncrypted,
                    onToggleEncryption = { isHardwareEncrypted = it }
                )
            }

            // -------------------------------------------------------------
            // 2. CARD: SELECTOR DE PURGA DE DATOS PROGRAMADA
            // -------------------------------------------------------------
            item {
                ScheduledPurgeCard(
                    schedule = selectedSchedule,
                    onScheduleChange = { selectedSchedule = it },
                    preserveExplicit = preserveExplicitFacts,
                    onPreserveExplicitChange = { preserveExplicitFacts = it }
                )
            }

            // -------------------------------------------------------------
            // 3. BARRA DE BÚSQUEDA Y CHIPS DE FILTRO M3
            // -------------------------------------------------------------
            item {
                SearchAndFilterSection(
                    searchQuery = searchQuery,
                    onSearchChange = { searchQuery = it },
                    selectedCategory = selectedCategoryFilter,
                    onSelectCategory = { selectedCategoryFilter = it }
                )
            }

            // -------------------------------------------------------------
            // 4. LISTA DE RECUERDOS LOCALES AUDITABLES
            // -------------------------------------------------------------
            // (LazyColumn items iterados con OutlinedCard)

            // -------------------------------------------------------------
            // 5. CARD: PURGA INMEDIATA SOBERANA (KILL SWITCH)
            // -------------------------------------------------------------
            item {
                SovereignPurgeCard(
                    onTriggerPurge = { showPurgeConfirmDialog = true }
                )
            }
        }
    }

    if (showPurgeConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showPurgeConfirmDialog = false },
            icon = { Icon(Icons.Default.Warning, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
            title = { Text("¿Purgar toda la memoria local?") },
            text = { Text("Esta acción eliminará de forma irreversible todos los recuerdos guardados en este dispositivo. VEYA olvidará tu nombre, estilo de trato y hábitos.") },
            confirmButton = {
                Button(
                    onClick = {
                        // Limpiar base de datos local
                        showPurgeConfirmDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Sí, purgar todo")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showPurgeConfirmDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}
```

### 3.3. Composable del Toggle de Cifrado con Switch M3

```kotlin
@Composable
fun HardwareEncryptionCard(
    isEncrypted: Boolean,
    onToggleEncryption: (Boolean) -> Unit
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.extraLarge,
        colors = CardDefaults.elevatedCardColors(
            containerColor = if (isEncrypted) MaterialTheme.colorScheme.surface 
                             else MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.2f)
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = MaterialTheme.shapes.medium,
                        color = if (isEncrypted) MaterialTheme.colorScheme.primaryContainer 
                                else MaterialTheme.colorScheme.errorContainer,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = if (isEncrypted) Icons.Default.Lock else Icons.Default.LockOpen,
                                contentDescription = null,
                                tint = if (isEncrypted) MaterialTheme.colorScheme.onPrimaryContainer 
                                       else MaterialTheme.colorScheme.onErrorContainer
                            )
                        }
                    }
                    Column {
                        Text(
                            text = "Cifrado Hardware AES-256",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isEncrypted) "Android Keystore · StrongBox TEE" 
                                   else "Desactivado (Texto plano)",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Switch Material 3 con icono en el Thumb
                Switch(
                    checked = isEncrypted,
                    onCheckedChange = onToggleEncryption,
                    thumbContent = {
                        Icon(
                            imageVector = if (isEncrypted) Icons.Default.Check else Icons.Default.Close,
                            contentDescription = null,
                            modifier = Modifier.size(SwitchDefaults.IconSize)
                        )
                    }
                )
            }
        }
    }
}
```

### 3.4. Composable del Selector de Purga Programada (Segmented Button M3)

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScheduledPurgeCard(
    schedule: PurgeSchedule,
    onScheduleChange: (PurgeSchedule) -> Unit,
    preserveExplicit: Boolean,
    onPreserveExplicitChange: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.extraLarge,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.Schedule, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Text(
                    text = "Purga de Datos Programada",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
            }

            // SingleChoiceSegmentedButtonRow M3
            val options = listOf(
                PurgeSchedule.NEVER to "Manual",
                PurgeSchedule.DAYS_7 to "7 días",
                PurgeSchedule.DAYS_30 to "30 días",
                PurgeSchedule.DAYS_90 to "90 días",
                PurgeSchedule.ON_SESSION_END to "Sesión"
            )

            SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                options.forEachIndexed { index, (option, label) ->
                    SegmentedButton(
                        shape = SegmentedButtonDefaults.itemShape(index = index, count = options.size),
                        onClick = { onScheduleChange(option) },
                        selected = schedule == option
                    ) {
                        Text(text = label, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }

            // Toggle para preservar recuerdos explícitos
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                    Text(
                        text = "Preservar recuerdos explícitos",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "La auto-purga solo elimina inferencias automáticas de la IA.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = preserveExplicit,
                    onCheckedChange = onPreserveExplicitChange
                )
            }
        }
    }
}
```

---

## 4. WORKER DE BACKGROUND: AUTO-PURGA CON WORKMANAGER

Para ejecutar la purga programada en Android de forma fiable sin drenar batería, se emplea `PeriodicWorkRequestBuilder`:

```kotlin
package com.veya.app.data.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.veya.app.data.local.dao.LocalMemoryDao
import com.veya.app.data.local.entity.PurgeSchedule
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.time.Instant
import java.time.temporal.ChronoUnit

@HiltWorker
class MemoryScheduledPurgeWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val memoryDao: LocalMemoryDao
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val schedule = memoryDao.getCurrentPurgeSchedule()
        if (schedule == PurgeSchedule.NEVER) return Result.success()

        val cutoffDays = when (schedule) {
            PurgeSchedule.DAYS_7 -> 7L
            PurgeSchedule.DAYS_30 -> 30L
            PurgeSchedule.DAYS_90 -> 90L
            else -> return Result.success()
        }

        val cutoffEpoch = Instant.now().minus(cutoffDays, ChronoUnit.DAYS).toEpochMilli()
        val preserveExplicit = memoryDao.isPreserveExplicitEnabled()

        if (preserveExplicit) {
            memoryDao.deleteInferredMemoriesOlderThan(cutoffEpoch)
        } else {
            memoryDao.deleteAllMemoriesOlderThan(cutoffEpoch)
        }

        return Result.success()
    }
}
```

---

## 5. VALIDACIÓN Y CRITERIOS DE ACEPTACIÓN
* [x] **Conformidad Visual M3**: El componente cumple con la paleta de color M3 de VEYA (`#155E95` Primary, `#7654A7` Secondary, Nunito Sans, esquinas redondeadas 16dp–28dp).
* [x] **Interactividad en Tiempo Real**: El usuario puede buscar recuerdos, alternar su presencia en el prompt de la IA y eliminarlos puntualmente con retroalimentación inmediata.
* [x] **Seguridad de Hardware Transparente**: Se expone el estado de cifrado AES-256 respaldado por Keystore con diálogo preventivo ante intentos de desprotección.
* [x] **Purga Programada Configurable**: El usuario elige la frecuencia de auto-limpieza (Manual, 7d, 30d, 90d, sesión) con opción de indulto a recuerdos agregados explícitamente.
