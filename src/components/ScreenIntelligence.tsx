import React, { useState } from 'react';
import {
  ArrowLeft,
  Key,
  Shield,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Clipboard,
  Cpu,
  Zap,
  Lock,
  Bell,
  Layers,
  ChevronDown,
  ChevronUp,
  Server,
  Terminal,
} from 'lucide-react';
import { useVeya } from '../context/VeyaGlobalContext';
import { AiProvider, AiConnectionMode } from '../types';

interface ScreenIntelligenceProps {
  onBack: () => void;
}

export const ScreenIntelligence: React.FC<ScreenIntelligenceProps> = ({ onBack }) => {
  const { aiKeyConfig, setAiKeyConfig, testAiConnection } = useVeya();

  const [mode, setMode] = useState<AiConnectionMode>(aiKeyConfig.mode || 'byo');
  const [provider, setProvider] = useState<AiProvider>(aiKeyConfig.provider || 'gemini');
  const [apiKeyInput, setApiKeyInput] = useState<string>(aiKeyConfig.apiKey || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(
    aiKeyConfig.isTested
      ? { success: true, latencyMs: aiKeyConfig.lastPingMs }
      : null
  );
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [isGuideExpanded, setIsGuideExpanded] = useState<boolean>(true);
  const [notifyManaged, setNotifyManaged] = useState<boolean>(
    aiKeyConfig.notifyOnManagedAvailable || false
  );

  // Validación rápida de formato de clave
  const validateKeyFormat = (val: string, prov: AiProvider) => {
    const trimmed = val.trim();
    if (!trimmed) return { valid: false, message: 'Introduce tu clave de API' };

    if (prov === 'gemini') {
      if (trimmed.startsWith('AIza') && trimmed.length >= 25) {
        return { valid: true, message: 'Formato válido detectado (Prefijo AIza de Google AI Studio)' };
      }
      return {
        valid: false,
        message: 'Las claves de Gemini habitualmente empiezan por "AIza" y tienen al menos 30 caracteres.',
      };
    }
    if (prov === 'anthropic') {
      if (trimmed.startsWith('sk-ant') && trimmed.length >= 25) {
        return { valid: true, message: 'Formato válido detectado (Prefijo sk-ant de Anthropic)' };
      }
      return {
        valid: false,
        message: 'Las claves de Anthropic Claude habitualmente empiezan por "sk-ant".',
      };
    }
    if (prov === 'openai') {
      if (trimmed.startsWith('sk-') && trimmed.length >= 25) {
        return { valid: true, message: 'Formato válido detectado (Prefijo sk- de OpenAI)' };
      }
      return {
        valid: false,
        message: 'Las claves de OpenAI habitualmente empiezan por "sk-".',
      };
    }
    if (prov === 'local_ollama') {
      return { valid: true, message: 'Servidor Ollama local en LAN (no requiere clave externa)' };
    }
    return { valid: true, message: 'Formato libre' };
  };

  const keyValidation = validateKeyFormat(apiKeyInput, provider);

  // Manejador de test de conexión
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setSaveFeedback(null);

    const result = await testAiConnection(provider, apiKeyInput);
    setIsTesting(false);
    setTestResult(result);
  };

  // Manejador de guardado seguro
  const handleSave = () => {
    setAiKeyConfig({
      mode,
      provider,
      apiKey: apiKeyInput.trim(),
      isTested: testResult?.success || false,
      lastPingMs: testResult?.latencyMs,
      lastTestedAt: testResult?.success
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : aiKeyConfig.lastTestedAt,
      notifyOnManagedAvailable: notifyManaged,
    });

    setSaveFeedback('Clave guardada exitosamente en el almacén cifrado local');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Pegar desde el portapapeles
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setApiKeyInput(text.trim());
        }
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4 font-['Nunito_Sans']">
      {/* BARRA SUPERIOR M3 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Volver a Ajustes"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Inteligencia
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF]">
              Motor de IA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Configuración del cerebro cognitivo y clave de acceso
          </p>
        </div>
      </div>

      {/* SELECTOR DE MODO: BYO KEY vs GESTIONADA (SEGMENTED BUTTON M3) */}
      <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 flex border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => {
            setMode('byo');
            setAiKeyConfig({ mode: 'byo' });
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'byo'
              ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Trae tu propia clave (BYO)</span>
        </button>
        <button
          onClick={() => {
            setMode('managed');
            setAiKeyConfig({ mode: 'managed' });
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'managed'
              ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Opción Gestionada</span>
          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Próx.
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* VISTA A: OPCIÓN GESTIONADA (PRÓXIMAMENTE)                              */}
      {/* ===================================================================== */}
      {mode === 'managed' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-linear-to-br from-white via-blue-50/30 to-amber-50/30 dark:from-[#141A24] dark:via-[#141E2B] dark:to-[#1C1A24] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                En desarrollo · VEYA v2
              </span>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Inteligencia sin configuración técnica
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Diseñada para quienes desean encender VEYA y conversar de inmediato, sin necesidad
                de crear cuentas de desarrollador en Google AI Studio o Anthropic, ni gestionar claves API.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Cero fricción ni configuración
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Activación instantánea mediante suscripción integrada y segura desde Google Play.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#155E95] dark:text-[#8ECEFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Proxy efímero Zero-Knowledge
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Tus consultas se procesan de forma ciega y sin registro. Nunca se retienen ni se
                    usan para entrenar modelos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Conmutación inteligente multi-modelo
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Acceso dinámico a lo mejor de Gemini 1.5, Claude 3.5 Sonnet y GPT-4o según la tarea.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const nextState = !notifyManaged;
                  setNotifyManaged(nextState);
                  setAiKeyConfig({ notifyOnManagedAvailable: nextState });
                }}
                className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  notifyManaged
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-[#155E95] hover:bg-[#124d7b] text-white shadow-xs'
                }`}
              >
                {notifyManaged ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Te avisaremos en cuanto esté disponible</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notificarme cuando esté disponible</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ¿Quieres empezar a conversar hoy mismo sin esperar?
            </p>
            <button
              onClick={() => setMode('byo')}
              className="text-xs font-bold text-[#155E95] dark:text-[#8ECEFF] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configurar tu clave gratuita en el modo BYO</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VISTA B: CAMINO BYO (BRING YOUR OWN KEY)                               */}
      {/* ===================================================================== */}
      {mode === 'byo' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* PASO 1: SELECCIONAR PROVEEDOR */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-black">
                1
              </span>
              Elige tu motor de inteligencia
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  id: 'gemini' as AiProvider,
                  name: 'Google Gemini',
                  badge: 'Recomendado · Gratuito',
                  badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                  desc: '15 peticiones/minuto gratuitas en Google AI Studio. Ideal para uso diario.',
                  icon: <Sparkles className="w-4 h-4 text-blue-600" />,
                },
                {
                  id: 'anthropic' as AiProvider,
                  name: 'Anthropic Claude',
                  badge: 'Pago por uso',
                  badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                  desc: 'Razonamiento matizado, tono natural y redacción analítica de gran precisión.',
                  icon: <Cpu className="w-4 h-4 text-amber-600" />,
                },
                {
                  id: 'openai' as AiProvider,
                  name: 'OpenAI (ChatGPT)',
                  badge: 'Pago por uso',
                  badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
                  desc: 'El estándar de la industria. Modelos GPT-4o y mini con amplia compatibilidad.',
                  icon: <Server className="w-4 h-4 text-emerald-600" />,
                },
                {
                  id: 'local_ollama' as AiProvider,
                  name: 'Local / Ollama',
                  badge: '100% Offline',
                  badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
                  desc: 'Ejecución en tu propio servidor LAN (Llama 3 / Mistral) sin salir a internet.',
                  icon: <Terminal className="w-4 h-4 text-purple-600" />,
                },
              ].map((p) => {
                const isSelected = provider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setProvider(p.id);
                      setAiKeyConfig({ provider: p.id });
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-[#172230] border-[#155E95] dark:border-[#8ECEFF] shadow-xs'
                        : 'bg-white dark:bg-[#141A24] border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                            {p.icon}
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                            {p.name}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${p.badgeColor}`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {p.desc}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                      <span
                        className={`text-[10px] font-bold ${
                          isSelected
                            ? 'text-[#155E95] dark:text-[#8ECEFF]'
                            : 'text-slate-400'
                        }`}
                      >
                        {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 2: ASISTENTE VISUAL PASO A PASO (PARA NO TÉCNICOS) */}
          <div className="rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <button
              onClick={() => setIsGuideExpanded(!isGuideExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Guía visual: Cómo conseguir tu clave en 60 segundos
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                      Paso a paso para no técnicos
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {provider === 'gemini'
                      ? 'Consigue tu clave gratuita oficial en Google AI Studio'
                      : `Pasos para obtener tu clave de ${provider}`}
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {isGuideExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isGuideExpanded && (
              <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                {provider === 'gemini' ? (
                  <>
                    <div className="space-y-3">
                      {/* Sub-paso 1 */}
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                          a
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Entra en Google AI Studio con tu cuenta habitual
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Usa tu cuenta de Gmail común. No necesitas ser programador ni pagar nada.
                          </p>
                          <a
                            href="https://aistudio.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155E95]/10 text-[#155E95] dark:text-[#8ECEFF] text-xs font-bold hover:bg-[#155E95]/20 transition-colors mt-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir aistudio.google.com</span>
                          </a>
                        </div>
                      </div>

                      {/* Sub-paso 2 con Wireframe Ilustrado */}
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                          b
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Pulsa en el botón azul "Get API key"
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Lo verás en la esquina superior izquierda o en la barra lateral del panel de Google.
                          </p>

                          {/* MOCKUP WIREFRAME DIDÁCTICO */}
                          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                              <span className="font-mono">Google AI Studio</span>
                              <span>Tu Cuenta (Gratuita)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                  Menú lateral
                                </span>
                                <div className="px-2 py-1 rounded-lg bg-[#155E95] text-white text-[10px] font-black animate-pulse flex items-center gap-1">
                                  <span>+ Get API key</span>
                                  <span>👈 Toca aquí</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-paso 3 */}
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                          c
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Pulsa "Create API key" y copia el texto
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Te aparecerá una ventana emergente con una cadena de letras y números que empieza por{' '}
                            <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-[#155E95] dark:text-[#8ECEFF]">
                              AIzaSy...
                            </code>
                            . Pulsa el botón de copiar y pégala aquí abajo.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-200 space-y-0.5">
                        <p className="font-bold">100% Gratuito para uso personal</p>
                        <p className="text-emerald-700/80 dark:text-emerald-300/80">
                          Google no te cobrará nada. El nivel gratuito incluye hasta 15 consultas por minuto, suficiente para usar VEYA todo el día.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                    <p>
                      Para obtener tu clave de <strong>{provider}</strong>, accede a la consola de tu proveedor, crea una clave con permisos estándar y pégala en el paso siguiente.
                    </p>
                    <p className="text-[11px]">
                      Ten en cuenta que proveedores como Anthropic y OpenAI operan habitualmente bajo modalidad de crédito prepago.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PASO 3: INTRODUCE LA CLAVE Y PRUEBA */}
          <div className="rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-black">
                  3
                </span>
                Introduce tu clave y comprueba
              </span>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] font-bold text-[#155E95] dark:text-[#8ECEFF] hover:underline flex items-center gap-1"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Pegar del portapapeles</span>
              </button>
            </div>

            {/* Input seguro de API Key */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder={
                  provider === 'gemini'
                    ? 'Pega aquí tu clave (empieza por AIzaSy...)'
                    : 'Pega aquí tu clave de API'
                }
                className="w-full pl-9 pr-20 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      setTestResult(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs"
                    title="Borrar texto"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
                  title={showKey ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Validación visual sintáctica */}
            {apiKeyInput.trim().length > 0 && (
              <div
                className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
                  keyValidation.valid
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
                }`}
              >
                {keyValidation.valid ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                )}
                <span>{keyValidation.message}</span>
              </div>
            )}

            {/* Botones de acción M3 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKeyInput.trim()}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isTesting || !apiKeyInput.trim()
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-[#155E95] hover:bg-[#124d7b] text-white shadow-xs'
                }`}
              >
                {isTesting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando conexión con el proveedor...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Probar conexión ahora</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!apiKeyInput.trim()}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !apiKeyInput.trim()
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Guardar clave</span>
              </button>
            </div>

            {/* Resultado del Test de Conexión */}
            {testResult && (
              <div
                className={`p-3 rounded-2xl border text-xs animate-in fade-in duration-200 ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-extrabold">
                      {testResult.success ? 'Conexión verificada con éxito' : 'Error en la verificación'}
                    </span>
                  </div>
                  {testResult.latencyMs && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                      Latencia: {testResult.latencyMs} ms
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-1 text-slate-600 dark:text-slate-300">
                  {testResult.success
                    ? 'La clave responde correctamente y está lista para ser utilizada por VEYA en este dispositivo.'
                    : testResult.error || 'Revisa que la clave no tenga espacios extra y corresponda al proveedor.'}
                </p>
              </div>
            )}

            {saveFeedback && (
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#155E95] dark:bg-blue-950/60 dark:text-[#8ECEFF] text-xs font-bold flex items-center gap-2 border border-blue-200 dark:border-blue-900 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveFeedback}</span>
              </div>
            )}
          </div>

          {/* TARJETA DE GARANTÍA CRIPTOGRÁFICA ZERO-KNOWLEDGE */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#12171E] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Garantía de Soberanía Criptográfica</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tu clave se almacena exclusivamente en el almacenamiento cifrado por hardware de tu teléfono
              (Android Keystore con AES-256). VEYA no tiene servidores centrales que puedan ver ni interceptar tu clave:
              la comunicación viaja directamente desde tu móvil hacia los servidores del proveedor elegido.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
