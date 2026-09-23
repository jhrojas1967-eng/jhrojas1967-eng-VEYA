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
  Smartphone,
  Sliders,
  Clock,
  Trash2,
  Brain,
  MessageSquare,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useVeya } from '../context/VeyaGlobalContext';
import {
  AiProvider,
  AiConnectionMode,
  ResponseDetailLevel,
  EphemeralMemoryRetention,
} from '../types';
import { GeminiDesignMockup } from './GeminiDesignMockup';

interface ScreenIntelligenceProps {
  onBack: () => void;
}

export const ScreenIntelligence: React.FC<ScreenIntelligenceProps> = ({ onBack }) => {
  const { aiKeyConfig, setAiKeyConfig, testAiConnection, activeInContextFacts } = useVeya();

  const [activeTab, setActiveTab] = useState<'preferences' | 'models' | 'memory'>('preferences');
  const [showMockupView, setShowMockupView] = useState<boolean>(false);

  // 1. Proactividad del asistente (slider 0 a 100)
  const [proactivity, setProactivity] = useState<number>(
    aiKeyConfig.proactivityLevel ?? 60
  );

  // 2. Nivel de detalle (bajo / medio / alto)
  const normalizeDetailLevel = (lvl?: string): 'bajo' | 'medio' | 'alto' => {
    if (lvl === 'bajo' || lvl === 'concise') return 'bajo';
    if (lvl === 'alto' || lvl === 'detailed') return 'alto';
    return 'medio';
  };
  const [detailLevel, setDetailLevel] = useState<'bajo' | 'medio' | 'alto'>(
    normalizeDetailLevel(aiKeyConfig.detailLevel)
  );

  // 3. Interruptor para la memoria efímera local (ON / OFF)
  const [ephemeralMemoryEnabled, setEphemeralMemoryEnabled] = useState<boolean>(
    aiKeyConfig.ephemeralMemoryEnabled ?? true
  );

  // Ajustes adicionales de memoria efímera
  const [retention, setRetention] = useState<EphemeralMemoryRetention>(
    aiKeyConfig.ephemeralMemoryRetention ?? 'session_only'
  );
  const [autoPurge, setAutoPurge] = useState<boolean>(
    aiKeyConfig.ephemeralMemoryAutoPurge ?? true
  );
  const [purgedMessage, setPurgedMessage] = useState<string | null>(null);
  const [ephemeralItemsCount, setEphemeralItemsCount] = useState<number>(3);

  // Estados de conexión y modelos
  const [mode, setMode] = useState<AiConnectionMode>(aiKeyConfig.mode || 'byo');
  const [provider, setProvider] = useState<AiProvider>(aiKeyConfig.provider || 'gemini');
  const [selectedModel, setSelectedModel] = useState<string>(
    aiKeyConfig.modelName || 'gemini-1.5-flash'
  );
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
  const [localContextInjection, setLocalContextInjection] = useState<boolean>(
    aiKeyConfig.localContextInjection ?? true
  );

  // Si el usuario activa la vista del Mockup de Diseño de Gemini
  if (showMockupView) {
    return (
      <GeminiDesignMockup
        onBack={() => setShowMockupView(false)}
        onApplyConfig={() => setShowMockupView(false)}
      />
    );
  }

  // Modelos disponibles según proveedor
  const getProviderModels = (prov: AiProvider) => {
    switch (prov) {
      case 'gemini':
        return [
          {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            badge: 'Recomendado · Ultrarrápido',
            tokens: '1M tokens contexto',
            latency: '~300ms',
          },
          {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            badge: 'Razonamiento Profundo',
            tokens: '2M tokens contexto',
            latency: '~900ms',
          },
        ];
      case 'anthropic':
        return [
          {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            badge: 'Alta Precisión',
            tokens: '200k tokens',
            latency: '~650ms',
          },
          {
            id: 'claude-3-5-haiku-20241022',
            name: 'Claude 3.5 Haiku',
            badge: 'Económico y Veloz',
            tokens: '200k tokens',
            latency: '~350ms',
          },
        ];
      case 'openai':
        return [
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            badge: 'Equilibrado',
            tokens: '128k tokens',
            latency: '~400ms',
          },
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            badge: 'Máxima Capacidad',
            tokens: '128k tokens',
            latency: '~750ms',
          },
        ];
      case 'local_ollama':
        return [
          {
            id: 'llama3.2:3b',
            name: 'Llama 3.2 (3B Local)',
            badge: 'Sin Internet',
            tokens: '128k tokens',
            latency: 'Depende de CPU/NPU',
          },
          {
            id: 'mistral:7b',
            name: 'Mistral 7B (Local)',
            badge: 'Servidor LAN',
            tokens: '32k tokens',
            latency: 'LAN 192.168.x.x',
          },
        ];
    }
  };

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
  const handleSaveAll = () => {
    setAiKeyConfig({
      mode,
      provider,
      apiKey: apiKeyInput.trim(),
      modelName: selectedModel,
      isTested: testResult?.success || false,
      lastPingMs: testResult?.latencyMs,
      lastTestedAt: testResult?.success
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : aiKeyConfig.lastTestedAt,
      notifyOnManagedAvailable: notifyManaged,
      proactivityLevel: proactivity,
      detailLevel,
      ephemeralMemoryEnabled,
      ephemeralMemoryRetention: retention,
      ephemeralMemoryAutoPurge: autoPurge,
      localContextInjection,
    });

    setSaveFeedback('Preferencias de Inteligencia guardadas correctamente');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // Purgar búfer efímero manualmente
  const handlePurgeEphemeralMemory = () => {
    setEphemeralItemsCount(0);
    setPurgedMessage('Búfer de memoria efímera purgado. Cero rastros en RAM/almacén.');
    setTimeout(() => setPurgedMessage(null), 3000);
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
      <div className="flex items-center justify-between gap-3">
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
                Mi inteligencia
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF]">
                Motor de IA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Proactividad, nivel de detalle, memoria efímera y modelos
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMockupView(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#155E95] dark:text-[#8ECEFF] text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-xs"
          title="Ver especificación visual y mockups de Gemini"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver Mockup Gemini</span>
          <span className="sm:hidden">Mockup</span>
        </button>
      </div>

      {/* PESTAÑAS M3 */}
      <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 flex border border-slate-200/80 dark:border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'preferences'
              ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferencias IA</span>
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'models'
              ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Modelos & Clave</span>
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'memory'
              ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Memoria Efímera</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN PRINCIPAL: PREFERENCIAS COGNITIVAS (SLIDER, DETALLE, INTERRUPTOR) */}
      {/* ===================================================================== */}
      {activeTab === 'preferences' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 1. SLIDER DE PROACTIVIDAD */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
                  <span>Proactividad del Asistente</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ajusta la frecuencia con la que VEYA inicia intervenciones y sugerencias
                </p>
              </div>
              <span className="text-xs font-mono font-black text-[#155E95] dark:text-[#8ECEFF] px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                {proactivity}%
              </span>
            </div>

            {/* Slider Material 3 */}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={proactivity}
              onChange={(e) => setProactivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#155E95]"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-0.5">
              <span>0% (Silencioso)</span>
              <span>50% (Equilibrado)</span>
              <span>100% (Muy proactivo)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              {proactivity < 30 && (
                <p>
                  <strong>Modo Silencioso:</strong> VEYA únicamente responderá cuando se le pregunte
                  directamente. Sin interrupciones espontáneas.
                </p>
              )}
              {proactivity >= 30 && proactivity <= 70 && (
                <p>
                  <strong>Modo Acompañante Orgánico:</strong> Sugiere recordatorios matutinos y
                  comprueba tu bienestar en momentos clave del día de forma natural y no invasiva.
                </p>
              )}
              {proactivity > 70 && (
                <p>
                  <strong>Modo Asistente Dinámico:</strong> Anticipa tareas, propone descansos y
                  dinamiza el seguimiento de tus objetivos del día.
                </p>
              )}
            </div>
          </div>

          {/* 2. NIVEL DE DETALLE: BAJO / MEDIO / ALTO */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Nivel de Detalle de las Respuestas</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Selecciona la extensión y profundidad que prefieres en las explicaciones
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'bajo' as const,
                  title: 'Bajo',
                  sub: '1-2 frases',
                  desc: 'Respuestas directas, concisas y sin rodeos',
                },
                {
                  id: 'medio' as const,
                  title: 'Medio',
                  sub: 'Equilibrado',
                  desc: 'Tono conversacional fluido y empático',
                },
                {
                  id: 'alto' as const,
                  title: 'Alto',
                  sub: 'Detallado',
                  desc: 'Explicaciones analíticas y paso a paso',
                },
              ].map((lvl) => {
                const isSelected = detailLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setDetailLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">{lvl.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">
                      {lvl.sub}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. INTERRUPTOR DE MEMORIA EFÍMERA LOCAL */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Memoria Efímera Local
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ephemeralMemoryEnabled
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {ephemeralMemoryEnabled ? 'ACTIVA' : 'DESACTIVADA'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Retiene el contexto de la charla reciente en la RAM del teléfono para dar continuidad al diálogo sin guardar copias en disco
                </p>
              </div>

              {/* Interruptor Switch M3 */}
              <button
                type="button"
                role="switch"
                aria-checked={ephemeralMemoryEnabled}
                onClick={() => setEphemeralMemoryEnabled(!ephemeralMemoryEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  ephemeralMemoryEnabled ? 'bg-[#155E95]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    ephemeralMemoryEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {ephemeralMemoryEnabled ? (
              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Estado: {ephemeralItemsCount} mensajes volátiles activos en el búfer actual</span>
                <button
                  onClick={handlePurgeEphemeralMemory}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-[10px] font-bold hover:bg-emerald-200 transition-colors"
                >
                  Limpiar búfer
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                Cada consulta se procesa de forma aislada e independiente. Ningún turno conversacional se conserva temporalmente en RAM.
              </div>
            )}
          </div>

          {/* BOTÓN GUARDAR */}
          <button
            onClick={handleSaveAll}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar Preferencias de Inteligencia</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 2: MODELOS COGNITIVOS Y CLAVE DE CONEXIÓN                     */}
      {/* ===================================================================== */}
      {activeTab === 'models' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* SELECTOR DE MODO: BYO KEY vs GESTIONADA */}
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

          {mode === 'managed' ? (
            /* VISTA GESTIONADA */
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
          ) : (
            /* VISTA BYO KEY */
            <div className="space-y-4">
              {/* PASO 1: SELECCIONAR PROVEEDOR */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-black">
                    1
                  </span>
                  Proveedor de IA
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'gemini' as AiProvider,
                      name: 'Google Gemini',
                      badge: 'Recomendado · Gratuito',
                      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                      desc: '15 req/min sin cobro en Google AI Studio. Ideal para uso diario.',
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
                      desc: 'Ejecución en tu propio hardware (Llama 3 / Mistral) sin conexión.',
                      icon: <Terminal className="w-4 h-4 text-purple-600" />,
                    },
                  ].map((p) => {
                    const isSelected = provider === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setProvider(p.id);
                          const firstModel = getProviderModels(p.id)[0].id;
                          setSelectedModel(firstModel);
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

              {/* SELECCIÓN DE MODELO ESPECÍFICO */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-black">
                    2
                  </span>
                  Modelo Cognitivo Activo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getProviderModels(provider).map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/40 dark:bg-blue-950/20 border-[#155E95] dark:border-[#8ECEFF]'
                            : 'bg-white dark:bg-[#141A24] border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">
                            {m.name}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {m.badge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span>{m.tokens}</span>
                          <span className="font-mono text-[#155E95] dark:text-[#8ECEFF] font-bold">
                            {m.latency}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GUÍA VISUAL PASO A PASO */}
              <div className="rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                <button
                  onClick={() => setIsGuideExpanded(!isGuideExpanded)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Guía visual: Cómo conseguir tu clave en 60 segundos
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                          Para no técnicos
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

                {isGuideExpanded && provider === 'gemini' && (
                  <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                        a
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Entra en Google AI Studio con tu cuenta habitual de Gmail
                        </h4>
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

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                        b
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Pulsa en el menú lateral en "Get API key"
                        </h4>
                        <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[10px] border border-slate-700 space-y-1">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                            <span className="text-blue-400 font-bold">≡ Google AI Studio</span>
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold animate-pulse">
                              [+ Get API key] 👈
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center text-xs font-bold shrink-0">
                        c
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Pulsa "Create API key" y copia la clave que empieza por <code className="font-mono text-[#155E95] dark:text-[#8ECEFF]">AIza...</code>
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT DE CLAVE Y TEST */}
              <div className="rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 p-4 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#155E95] text-white flex items-center justify-center text-[9px] font-black">
                      4
                    </span>
                    Clave API y Verificación
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
                      >
                        ✕
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

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
                        <span>Verificando conexión...</span>
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
                    onClick={handleSaveAll}
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 3: GESTIÓN DE MEMORIA EFÍMERA LOCAL                            */}
      {/* ===================================================================== */}
      {activeTab === 'memory' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-linear-to-br from-emerald-50/60 to-blue-50/60 dark:from-[#11221E] dark:to-[#131F2A] border border-emerald-200/80 dark:border-emerald-900/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
              <Brain className="w-4 h-4" />
              <span>Memoria Efímera Local-First (Zero-Knowledge)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              La memoria efímera retiene temporalmente el hilo conversacional para mantener coherencia en el diálogo.
              A diferencia de la Bóveda permanente, esta memoria vive en la RAM protegida de tu terminal y se destruye
              automáticamente según tu política.
            </p>
          </div>

          {/* POLÍTICA DE RETENCIÓN */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <span>Tiempo de Retención del Búfer Efímero</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'session_only' as EphemeralMemoryRetention, label: 'Solo Sesión', sub: 'Al salir de la app' },
                { id: '1_hour' as EphemeralMemoryRetention, label: '1 Hora', sub: 'Tras 60m inactivo' },
                { id: '24_hours' as EphemeralMemoryRetention, label: '24 Horas', sub: 'Día natural' },
                { id: 'never' as EphemeralMemoryRetention, label: 'No Retener', sub: 'Purga instantánea' },
              ].map((opt) => {
                const isSelected = retention === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setRetention(opt.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-[#155E95] dark:border-[#8ECEFF] text-[#155E95] dark:text-[#8ECEFF] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs block">{opt.label}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AUTO-PURGA Y CONTROLES */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Autopurga al Bloquear Dispositivo
                </h4>
                <p className="text-[11px] text-slate-400">
                  Sobrescribe los registros en memoria volátil tan pronto como la pantalla se apague.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoPurge}
                onChange={(e) => setAutoPurge(e.target.checked)}
                className="w-4 h-4 rounded text-[#155E95] focus:ring-[#155E95] cursor-pointer"
              />
            </div>

            {/* ESTADO DEL BÚFER EFÍMERO ACTUAL */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Búfer Efímero Actual
                </span>
                <span className="text-[11px] text-slate-400">
                  {ephemeralItemsCount} mensajes volátiles en contexto inmediato
                </span>
              </div>
              <button
                onClick={handlePurgeEphemeralMemory}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-200 dark:border-red-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purgar Ahora</span>
              </button>
            </div>

            {purgedMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{purgedMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEEDBACK DE GUARDADO GLOBAL */}
      {saveFeedback && (
        <div className="p-3 rounded-2xl bg-blue-50 text-[#155E95] dark:bg-blue-950/60 dark:text-[#8ECEFF] text-xs font-bold flex items-center gap-2 border border-blue-200 dark:border-blue-900 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* TARJETA DE GARANTÍA CRIPTOGRÁFICA ZERO-KNOWLEDGE */}
      <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#12171E] border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Garantía de Soberanía Criptográfica</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Tus preferencias, claves y búferes se almacenan exclusivamente en el chip de seguridad local
          (Android Keystore con AES-256). VEYA no tiene servidores centrales ni almacena telemetría:
          la comunicación viaja directamente desde tu móvil hacia los servidores del proveedor elegido.
        </p>
      </div>
    </div>
  );
};
