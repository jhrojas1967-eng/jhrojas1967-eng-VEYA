import React, { useState } from 'react';
import {
  ArrowLeft,
  Key,
  Shield,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Copy,
  Terminal,
  Cpu,
  Layers,
  FileCode,
  Eye,
  Check,
  Server,
  Smartphone,
  Zap,
} from 'lucide-react';

interface GeminiDesignMockupProps {
  onBack: () => void;
  onApplyConfig?: () => void;
}

export const GeminiDesignMockup: React.FC<GeminiDesignMockupProps> = ({
  onBack,
  onApplyConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'wireframe' | 'specs' | 'tokens' | 'compose'>('wireframe');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [mockPingSuccess, setMockPingSuccess] = useState<boolean>(true);
  const [activeStepWireframe, setActiveStepWireframe] = useState<number>(2);

  const handleCopyDemoKey = () => {
    navigator.clipboard.writeText('AIzaSyD9x82k_DEMO_KEY_MOCKUP_VAL');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4 font-['Nunito_Sans']">
      {/* BARRA SUPERIOR M3 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Volver a Mi Inteligencia"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Gemini Design Mockup
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Spec v16 M3
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Especificaciones visuales de Gemini para el flujo BYO & Gestionada
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155E95]/10 text-[#155E95] dark:text-[#8ECEFF] text-xs font-bold hover:bg-[#155E95]/20 transition-colors"
        >
          <span>Ir a configuración en vivo</span>
        </button>
      </div>

      {/* TABS DE ESPECIFICACIÓN M3 (SEGMENTED BUTTON) */}
      <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 flex flex-wrap border border-slate-200/80 dark:border-slate-800 gap-1">
        {[
          { id: 'wireframe', label: 'Wireframe Visual', icon: <Smartphone className="w-3.5 h-3.5" /> },
          { id: 'specs', label: 'Entrega Doc (Nota)', icon: <FileCode className="w-3.5 h-3.5" /> },
          { id: 'tokens', label: 'Tokens M3', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'compose', label: 'Contrato Compose', icon: <Terminal className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: WIREFRAME VISUAL EXACTO DE LA ESPECIFICACIÓN GEMINI              */}
      {/* ========================================================================= */}
      {activeTab === 'wireframe' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* BANNER INTRODUCTORIO CON METÁFORA */}
          <div className="p-4 rounded-3xl bg-linear-to-r from-blue-50/80 to-indigo-50/80 dark:from-[#131B26] dark:to-[#171A2E] border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#155E95] dark:text-[#8ECEFF]">
                Metáfora Conceptual para Usuarios No Técnicos
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Una clave API es como una llave física personal que te entrega Google o Claude. En lugar de pagarle a un intermediario que guarde tus conversaciones, tú posees tu propia llave y hablas directamente con el cerebro de la IA. Tu teléfono guarda esa llave en una caja fuerte blindada (el chip de seguridad del teléfono)."
            </p>
          </div>

          {/* MOCKUP MARCO DE DISPOSITIVO M3 */}
          <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                <Smartphone className="w-3.5 h-3.5 text-[#155E95]" />
                Pantalla M3: Android 14+ / Jetpack Compose
              </span>
              <span>1080 x 2400 · Material You</span>
            </div>

            {/* MOCKUP INTERIOR DEL COMPONENTE */}
            <div className="rounded-2xl bg-white dark:bg-[#12171F] p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs">
              {/* HEADER WIREFRAME */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Mi inteligencia
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Motor cognitivo y conexión local
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF]">
                  BYO Activo
                </span>
              </div>

              {/* SEGMENTED BUTTON M3 */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold text-center gap-1">
                <div className="py-1.5 rounded-lg bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs flex items-center justify-center gap-1">
                  <span>●</span> Trae tu propia clave (BYO)
                </div>
                <div className="py-1.5 rounded-lg text-slate-400 flex items-center justify-center gap-1">
                  <span>○</span> Gestionada (Próx)
                </div>
              </div>

              {/* PASO 1 MOCKUP */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-bold">1</span>
                  PASO 1: ELIGE TU MOTOR DE INTELIGENCIA
                </div>
                <div className="p-3 rounded-xl border-2 border-[#155E95] bg-blue-50/40 dark:bg-blue-950/20 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="text-blue-600 font-bold">(*)</span> Google Gemini (Recomendado)
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Gratuito
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ideal para uso personal diario. 15 peticiones/minuto gratuitas en Google AI Studio.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    ( ) Anthropic Claude [Pago]
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    ( ) OpenAI ChatGPT [Pago]
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    ( ) Local Ollama [Offline]
                  </div>
                </div>
              </div>

              {/* PASO 2 MOCKUP GUIA PASO A PASO */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-bold">2</span>
                  PASO 2: GUÍA VISUAL PASO A PASO (GOOGLE AI STUDIO)
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ¿No tienes una clave todavía? Te guiaremos:
                    </span>
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#155E95] dark:text-[#8ECEFF] font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      aistudio.google.com
                    </a>
                  </div>

                  {/* Wireframe sub-pasos */}
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-[#155E95] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        <strong>Inicia sesión en Google AI Studio</strong> con tu cuenta normal de Gmail (sin coste alguno).
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-[#155E95] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                      <div className="space-y-1.5 flex-1">
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                          Pulsa en el menú lateral en <strong>"Get API key"</strong>:
                        </p>
                        {/* REPRODUCCIÓN DEL DIAGRAMA ASCII EN COMPONENTE VISUAL */}
                        <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[10px] border border-slate-700 space-y-1">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                            <span className="text-blue-400 font-bold">≡ Google AI Studio</span>
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold animate-pulse">
                              [+ Get API key] 👈
                            </span>
                          </div>
                          <div className="text-slate-400 text-[9px]">
                            Panel oficial de Google DeepMind / Cloud
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-[#155E95] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Pulsa <strong>"Create API key"</strong> y pulsa <strong>"Copy"</strong>. Obtendrás un texto que empieza por <code className="text-[#155E95] dark:text-[#8ECEFF] font-mono">AIza...</code>
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] space-y-0.5 border border-emerald-200 dark:border-emerald-900">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Es 100% gratuito para uso personal
                    </p>
                    <p className="text-emerald-700/80 dark:text-emerald-300/80">
                      No requiere tarjeta de crédito para uso básico.
                    </p>
                  </div>
                </div>
              </div>

              {/* PASO 3 MOCKUP INPUT Y TEST DE CONEXION */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-bold">3</span>
                  PASO 3: PEGA TU CLAVE Y COMPRUEBA LA CONEXIÓN
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                      AIzaSyD9x82k_DEMO_KEY_MOCKUP_VAL
                    </span>
                    <button
                      onClick={handleCopyDemoKey}
                      className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center gap-1 hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey ? 'Copiada' : 'Copiar Demo'}</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Formato válido detectado (prefijo AIza)
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMockPingSuccess(!mockPingSuccess)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#155E95] text-white text-xs font-bold hover:bg-[#124d7b] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>⚡ Probar conexión ahora</span>
                    </button>
                    <button
                      onClick={onBack}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
                    >
                      ✓ Guardar en Hardware
                    </button>
                  </div>

                  {/* ESTADO DE CONEXION */}
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                    <span>[ Estado: Conectado · Latencia: 240ms · 200 OK ]</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                      Activo
                    </span>
                  </div>
                </div>
              </div>

              {/* GARANTIA SOBERANIA CRIPTOGRAFICA */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🔒 GARANTÍA DE SOBERANÍA CRIPTOGRÁFICA</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tu clave se cifra con AES-256 en el chip Android Keystore del teléfono. VEYA no tiene servidores intermedios: la conexión viaja de tu móvil a Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: DOCUMENTO COMPLETO DE LA NOTA TÉCNICA GEMINI                     */}
      {/* ========================================================================= */}
      {activeTab === 'specs' && (
        <div className="rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 text-xs leading-relaxed animate-in fade-in duration-200">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-[#155E95] dark:text-[#8ECEFF] font-bold">
              NOTA-GEMINI-GUIA-CLAVE-IA.md (Commit dcc8c8d)
            </span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Guía Visual Paso a Paso para Clave de IA (Camino BYO & Opción Gestionada)
            </h2>
          </div>

          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">
                1. Resumen Ejecutivo y Propósito
              </h4>
              <p>
                VEYA es un asistente <em>Local-First</em> con custodia soberana de datos personales. Para procesar razonamiento contextual avanzado sin depender de servidores centralizados que puedan espiar o retener la privacidad del usuario, VEYA adopta dos caminos:
              </p>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[11px]">
                <li><strong>Camino BYO (Bring Your Own Key)</strong>: Conecta la clave personal directamente a los servidores del proveedor. Guía visual para usuarios no técnicos sin tarjeta ni conocimientos previos.</li>
                <li><strong>Opción Gestionada (Próximamente / En desarrollo)</strong>: Sin registros ni fricción para el usuario general, con proxy efímero Zero-Knowledge auditado.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">
                2. Requisitos de Implementación Android Jetpack Compose
              </h4>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-[11px] space-y-1 text-slate-800 dark:text-slate-200">
                <p>• <strong>Almacenamiento Seguro</strong>: EncryptedSharedPreferences respaldado por MasterKey en AndroidKeyStore.</p>
                <p>• <strong>Prefijos de Clave</strong>: veya_ai_mode, veya_ai_provider, veya_ai_api_key.</p>
                <p>• <strong>Ping de Verificación</strong>: HTTP HEAD/GET ligero para computar latencia y mostrar badge verde/ámbar/rojo.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: TOKENS DE DISEÑO MATERIAL 3 (COLOR & ELEVATION)                   */}
      {/* ========================================================================= */}
      {activeTab === 'tokens' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Paleta y Tokens Material You de VEYA
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#155E95] text-white space-y-1">
                <span className="font-bold block">Primary</span>
                <span className="font-mono text-[10px] opacity-90">#155E95</span>
                <span className="text-[9px] block opacity-80">Deep Oceanic Blue</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#8ECEFF] text-slate-950 space-y-1">
                <span className="font-bold block">Primary Dark Mode</span>
                <span className="font-mono text-[10px]">#8ECEFF</span>
                <span className="text-[9px] block opacity-80">Light Tone M3</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-600 text-white space-y-1">
                <span className="font-bold block">Success / Safe</span>
                <span className="font-mono text-[10px] opacity-90">#059669</span>
                <span className="text-[9px] block opacity-80">Criptografía Hardware</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500 text-white space-y-1">
                <span className="font-bold block">Badge Gestionada</span>
                <span className="font-mono text-[10px] opacity-90">#F59E0B</span>
                <span className="text-[9px] block opacity-80">Próximamente / VEYA v2</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              Reglas de Geometría y Radio de Esquinas (Material 3)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-700 dark:text-slate-200 block">Contenedor Principal</strong>
                <code>rounded-3xl (24px)</code>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-700 dark:text-slate-200 block">Tarjetas Hijas</strong>
                <code>rounded-2xl (16px)</code>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-700 dark:text-slate-200 block">Botones e Inputs</strong>
                <code>rounded-xl (12px) / Pill (9999px)</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 4: CONTRATO DE ESTADO JETPACK COMPOSE (KOTLIN)                       */}
      {/* ========================================================================= */}
      {activeTab === 'compose' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3 font-mono text-xs text-slate-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
            <span>Kotlin 2.0 / Jetpack Compose 1.6+</span>
            <span className="text-emerald-400 font-bold">Android 14 (API 34)</span>
          </div>

          <pre className="overflow-x-auto text-[11px] leading-relaxed text-blue-300">
{`enum class AiConnectionMode { BYO, MANAGED }
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

@Composable
fun ScreenIntelligenceM3(
    state: AiKeyConfig,
    onModeChange: (AiConnectionMode) -> Unit,
    onTestConnection: (AiProvider, String) -> Unit,
    onSaveKey: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    // Implementación Material 3 con Scaffold y TopAppBar
}`}
          </pre>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`enum class AiConnectionMode { BYO, MANAGED }`);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copiado al portapapeles' : 'Copiar Contrato'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
