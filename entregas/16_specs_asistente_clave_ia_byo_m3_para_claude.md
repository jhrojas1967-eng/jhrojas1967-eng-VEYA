# ESPECIFICACIÓN TÉCNICA Y DE DISEÑO: ASISTENTE VISUAL DE CLAVE IA (BYO & OPCIÓN GESTIONADA) (MATERIAL 3)

**Proyecto:** VEYA Personal Assistant  
**Fase:** Entrega de Diseño UI/UX y Especificación Jetpack Compose para Claude Code  
**Documento:** `entregas/16_specs_asistente_clave_ia_byo_m3_para_claude.md`  
**Referencia:** NOTA-GEMINI-GUIA-CLAVE-IA.md (commit dcc8c8d)  
**Conformidad:** Material 3 (Material You), Android 14+ (API 34), Jetpack Compose 1.6+, AndroidX Security Crypto & Keystore.

---

## 1. PRINCIPIOS DE ARQUITECTURA: LOCAL-FIRST & ZERO-KNOWLEDGE EN EL ACCESO A MODELOS

1. **Custodia Soberana de la Clave:**
   * La clave de API se almacena exclusivamente en el dispositivo del usuario (`EncryptedSharedPreferences` respaldado por `AndroidKeyStore`).
   * No existe backend de VEYA que almacene o audite las claves de los usuarios.
2. **Acceso Directo al Proveedor:**
   * La aplicación se comunica directamente desde el cliente con la API del proveedor configurado (`generativelanguage.googleapis.com` para Gemini, `api.anthropic.com` para Claude, etc.).
3. **Pedagogía Radical para Usuarios No Técnicos:**
   * La interfaz elimina toda terminología intimidante (curl, headers, endpoints, json).
   * Se utiliza la metáfora de la "llave personal", explicando que el nivel gratuito de Google AI Studio es suficiente para la inmensa mayoría de usuarios.
4. **Camino Dual: BYO (Inmediato) vs. Gestionada (Próxima):**
   * El usuario avanzado o consciente de la privacidad utiliza su propia clave de forma gratuita.
   * El usuario general que prefiera no interactuar con consolas de desarrollador tiene a la vista la opción gestionada que llegará en futuras versiones.

---

## 2. ANATOMÍA Y COMPONENTES MATERIAL 3 (JETPACK COMPOSE)

### 2.1. Top App Bar
* **Título:** "Inteligencia" / "Motor Cognitivo"
* **Navegación:** `IconButton` con `Icons.AutoMirrored.Filled.ArrowBack` para regresar a `ScreenSettings`.

### 2.2. Selector de Modo: `SingleChoiceSegmentedButtonRow`
* Opción 1: **"Trae tu propia clave (BYO)"** (Seleccionada por defecto).
* Opción 2: **"Gestionada (Próximamente)"** con badge de estado.

### 2.3. Bloque BYO: Stepper de 3 Pasos
1. **Paso 1: Selector de Proveedor (`Card` con `RadioButton` o `SegmentedButton`)**:
   * Google Gemini (Recomendado, nivel gratuito con 15 RPM).
   * Anthropic Claude.
   * OpenAI ChatGPT.
   * Ollama / Local (para usuarios con servidor local en LAN).
2. **Paso 2: Guía Visual Interactiva (`ElevatedCard`)**:
   * Desplegable con 3 pasos ilustrados con diagramas tipo wireframe del portal de Google AI Studio.
   * Botón de acción externa `aistudio.google.com` protegido mediante `Intent.ACTION_VIEW`.
   * Banner de tranquilidad: "No requiere tarjeta de crédito para uso habitual".
3. **Paso 3: Input de Clave y Test de Conexión (`OutlinedCard`)**:
   * `OutlinedTextField` con `visualTransformation = PasswordVisualTransformation()` y toggle `IconButton(Icons.Default.Visibility)`.
   * Botón de pegado directo desde el portapapeles (`ClipboardManager`).
   * Validación sintáctica automática en tiempo real:
     * Gemini: debe comenzar por `AIza` y tener al menos 30 caracteres.
     * Claude: debe comenzar por `sk-ant`.
     * OpenAI: debe comenzar por `sk-`.
   * Botón `Button` ("Probar conexión") que realiza una solicitud de verificación y muestra la latencia en milisegundos y estado `200 OK`.
   * Botón `FilledTonalButton` ("Guardar clave en dispositivo").

### 2.4. Bloque Opción Gestionada:
* `ElevatedCard` con gradiente sutil y avatar de VEYA.
* Indicador de "En desarrollo para VEYA v2".
* Resumen de ventajas: cero configuración, suscripción unificada, proxy Zero-Knowledge auditado.
* Botón interactivo "Notificarme cuando esté disponible".

---

## 3. CONTRATO DE ESTADO Y PERSISTENCIA (KOTLIN / COMPOSE)

```kotlin
enum class AiConnectionMode { BYO, MANAGED }
enum class AiProvider { GEMINI, ANTHROPIC, OPENAI, LOCAL_OLLAMA }

data class AiKeyConfig(
    val mode: AiConnectionMode = AiConnectionMode.BYO,
    val provider: AiProvider = AiProvider.GEMINI,
    val apiKey: String = "",
    val modelName: String = "gemini-1.5-flash",
    val isTested: Boolean = false,
    val lastPingMs: Long? = null,
    val lastTestedAt: String? = null,
    val notifyOnManagedAvailable: Boolean = false
)
```
