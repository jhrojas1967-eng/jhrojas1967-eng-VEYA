# NOTA-GEMINI: GUÍA VISUAL PASO A PASO PARA CLAVE DE IA (CAMINO BYO & OPCIÓN GESTIONADA)

**De:** Gemini (Model Assistant en Google AI Studio)  
**Para:** Claude Code / Equipo de Desarrollo VEYA  
**Fecha:** 22 de Septiembre de 2026  
**Documento de Entrega:** `entregas/16_specs_asistente_clave_ia_byo_m3_para_claude.md`  
**Referencia:** Commit de especificación `dcc8c8d` · Sección "Inteligencia" en Ajustes M3

---

## 1. RESUMEN EJECUTIVO Y PROPÓSITO

VEYA es un asistente *Local-First* con custodia soberana de datos personales. Para procesar razonamiento contextual avanzado sin depender de servidores centralizados que puedan espiar o retener la privacidad del usuario, VEYA adopta dos caminos:

1. **Camino BYO (*Bring Your Own Key*) [Disponible Ahora]**:
   - Permite al usuario conectar su propia llave personal de IA directamente a los servidores del proveedor (Google Gemini, Anthropic Claude, OpenAI).
   - **Para usuarios no técnicos**: Se elimina la barrera de complejidad mediante un asistente visual ilustrado paso a paso ("Cómo conseguir tu clave gratuita en 60 segundos sin saber programar").
   - **Garantía Criptográfica**: La clave se guarda exclusivamente en el **Android Keystore** / hardware local del dispositivo. Ni VEYA ni ningún intermediario tienen acceso a ella.
2. **Opción Gestionada (*Próximamente / En desarrollo*)**:
   - Diseñada para quienes no desean realizar ningún paso manual de registro en consolas de desarrollador.
   - Presentada con etiqueta de "Próximamente", suscripción unificada y proxy efímero Zero-Knowledge auditado.

---

## 2. METÁFORA CONCEPTUAL PARA USUARIOS NO TÉCNICOS

> *"Una clave API es como una llave física personal que te entrega Google o Claude. En lugar de pagarle a un intermediario que guarde tus conversaciones, tú posees tu propia llave y hablas directamente con el cerebro de la IA. Tu teléfono guarda esa llave en una caja fuerte blindada (el chip de seguridad del teléfono)."*

---

## 3. ESQUEMA VISUAL MOCKUP DEL ASISTENTE BYO (MATERIAL 3)

```
┌──────────────────────────────────────────────────────────────┐
│ ← Ajustes          Inteligencia Artificial                   │
│                    Motor cognitivo y conexión local          │
├──────────────────────────────────────────────────────────────┤
│  [ ● Trae tu propia clave (BYO) ]   [ ○ Gestionada (Próx) ]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PASO 1: ELIGE TU MOTOR DE INTELIGENCIA                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ (*) Google Gemini (Recomendado)     [ Gratuito ]       │  │
│  │     Ideal para uso personal diario. 15 req/min gratis. │  │
│  │ ( ) Anthropic Claude                [ Pago por uso ]   │  │
│  │     Razonamiento analítico profundo y matices.         │  │
│  │ ( ) OpenAI (ChatGPT)                [ Pago por uso ]   │  │
│  │     El estándar popular del sector.                    │  │
│  │ ( ) Local / Ollama                  [ 100% Offline ]   │  │
│  │     Ejecución local en tu propio hardware.             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  PASO 2: GUÍA VISUAL PASO A PASO (GOOGLE AI STUDIO)          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ¿No tienes una clave todavía? Te guiaremos:           │  │
│  │                                                        │  │
│  │  1. Inicia sesión en Google AI Studio                  │  │
│  │     [ Abrir aistudio.google.com ↗ ]                    │  │
│  │     Usa tu cuenta normal de Gmail (sin coste alguno). │  │
│  │                                                        │  │
│  │  2. Pulsa en el menú lateral en "Get API key"         │  │
│  │     ┌──────────────────────────────────────────────┐   │  │
│  │     │ ≡  Google AI Studio          [+ Get API key] │   │  │
│  │     └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │  3. Pulsa "Create API key" y pulsa "Copy"             │  │
│  │     Obtendrás un texto que empieza por "AIza..."       │  │
│  │                                                        │  │
│  │  ✓ Es 100% gratuito para uso personal.                │  │
│  │  ✓ No requiere tarjeta de crédito para uso básico.    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  PASO 3: PEGA TU CLAVE Y COMPRUEBA LA CONEXIÓN               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Clave API de Google Gemini                             │  │
│  │ [ AIzaSyD9x82k...                    [ Pegar ] [ 👁 ] ]│  │
│  │                                                        │  │
│  │ Formato válido detectado (prefijo AIza)               │  │
│  │                                                        │  │
│  │ [ ⚡ Probar conexión ahora ]    [ ✓ Guardar en Hardware ]│  │
│  │                                                        │  │
│  │ [ Estado: Conectado · Latencia: 240ms · 200 OK ]       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🔒 GARANTÍA DE SOBERANÍA CRIPTOGRÁFICA                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Tu clave se cifra con AES-256 en el chip Android       │  │
│  │ Keystore del teléfono. VEYA no tiene servidores        │  │
│  │ intermedios: la conexión viaja de tu móvil a Google.   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. ESQUEMA MOCKUP DE LA OPCIÓN GESTIONADA (PRÓXIMAMENTE)

```
┌──────────────────────────────────────────────────────────────┐
│  [ ○ Trae tu propia clave (BYO) ]   [ ● Gestionada (Próx) ]  │
├──────────────────────────────────────────────────────────────┤
│  ✨ OPCIÓN GESTIONADA                                        │
│  Insignia: [ EN DESARROLLO · VEYA v2 ]                       │
│                                                              │
│  Inteligencia artificial con cero fricción técnica           │
│                                                              │
│  Pensado para quienes desean encender VEYA y conversar de     │
│  inmediato, sin crear cuentas de desarrollador.              │
│                                                              │
│  Beneficios planificados:                                    │
│  • Cero configuración: Activación con un solo toque.         │
│  • Suscripción unificada gestionada desde Google Play.       │
│  • Conmutación inteligente entre Gemini, Claude y GPT.       │
│  • Proxy efímero Zero-Knowledge auditado: Tus datos nunca se │
│    usan para entrenar modelos y se purgan al instante.       │
│                                                              │
│  [ 🔔 Notificarme cuando esté disponible ]                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. REQUISITOS DE IMPLEMENTACIÓN EN JETPACK COMPOSE (ANDROID)

1. **Almacenamiento Seguro**:
   - `EncryptedSharedPreferences` respaldado por `MasterKey` con alias en `AndroidKeyStore`.
   - Claves de prefijo:
     - `veya_ai_mode`: `"BYO"` | `"MANAGED"`
     - `veya_ai_provider`: `"GEMINI"` | `"ANTHROPIC"` | `"OPENAI"` | `"LOCAL_OLLAMA"`
     - `veya_ai_api_key`: String cifrado.
2. **Ping / Verificación en Vivo**:
   - Llamada HTTP `HEAD` o `GET` ligera con payload mínimo (`models.list` o token dummy) para computar latencia en ms.
   - Mostrar indicador de latencia (Verde < 500ms, Ámbar 500-1500ms, Rojo > 1500ms).
3. **Navegación**:
   - Sub-ruta `ScreenSettings` -> `ScreenIntelligence` integrada con Compose Navigation y botón de retorno M3.
