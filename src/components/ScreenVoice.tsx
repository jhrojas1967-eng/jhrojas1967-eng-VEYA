import React, { useState, useEffect } from 'react';
import {
  Volume2,
  ArrowLeft,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  FileCode,
  CheckCircle,
  Activity,
  Mic,
  MessageSquare,
  ShieldCheck,
  Zap,
  Flame,
  Gauge,
  Copy,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers,
  BookOpen,
} from 'lucide-react';

interface ScreenVoiceProps {
  onBack: () => void;
}

export interface VoiceProfile {
  id: string;
  name: string;
  archetype: string;
  timbre: string;
  sampleText: string;
  sampleDuration: string;
  frequencyRange: string;
  recommendedRole: string;
  description: string;
}

const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'voice_aura',
    name: 'Aura',
    archetype: 'Calmada, cálida y reflexiva',
    timbre: 'Femenino / Cálido medio (F0 ≈ 195 Hz)',
    sampleText: 'Buenos días, José. He preparado tu rutina matinal con música suave para empezar con total claridad mental.',
    sampleDuration: '4.2s',
    frequencyRange: '160 - 240 Hz',
    recommendedRole: 'Bienestar & Rutina Matinal',
    description: 'Acompasamiento armónico suave, ideal para transiciones matutinas y reducción de estrés.',
  },
  {
    id: 'voice_opalo',
    name: 'Ópalo',
    archetype: 'Empático, cercano y conversacional',
    timbre: 'Neutro / Terciopelo (F0 ≈ 145 Hz)',
    sampleText: 'Aquí tienes los dos titulares clave de hoy. Cuando quieras, revisamos tus notas de trabajo pendientes.',
    sampleDuration: '3.9s',
    frequencyRange: '120 - 180 Hz',
    recommendedRole: 'Compañero Cotidiano',
    description: 'Cadencia natural y articulación fluida, perfecta para interacción continua y feedback directo.',
  },
  {
    id: 'voice_cefiro',
    name: 'Céfiro',
    archetype: 'Ágil, dinámico y pedagógico',
    timbre: 'Masculino / Claro (F0 ≈ 130 Hz)',
    sampleText: 'He detectado 90 minutos continuos de concentración. Te sugiero una pausa activa de 3 minutos para estirar.',
    sampleDuration: '4.5s',
    frequencyRange: '100 - 165 Hz',
    recommendedRole: 'Enfoque & Productividad',
    description: 'Excelente inteligibilidad y ritmo ágil para sesiones de trabajo intensivo y avisos precisos.',
  },
  {
    id: 'voice_vesper',
    name: 'Vesper',
    archetype: 'Grave, envolvente y nocturno',
    timbre: 'Barítono suave / Texturado (F0 ≈ 98 Hz)',
    sampleText: 'La jornada ha concluido. Atenúo la iluminación de pantalla y activo el piano de fondo para tu descanso.',
    sampleDuration: '4.8s',
    frequencyRange: '80 - 135 Hz',
    recommendedRole: 'Desconexión Nocturna & DSP',
    description: 'Resonancia profunda en bajas frecuencias para inducir serenidad y relajación previa al sueño.',
  },
];

export const ScreenVoice: React.FC<ScreenVoiceProps> = ({ onBack }) => {
  // 1. Voice Profile State
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('voice_aura');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([35, 55, 40, 80, 60, 90, 50, 75, 45, 65, 30, 70]);

  // 2. Prosody Controls (Sliders)
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0); // 0.75x a 1.50x
  const [pitch, setPitch] = useState<number>(0); // -3 a +3 semitonos
  const [naturalPauses, setNaturalPauses] = useState<boolean>(true); // Biological organic pauses

  // 3. Temperament Matrix (Continuous Sliders 0..100)
  const [warmth, setWarmth] = useState<number>(75); // Calidez: Sobrio -> Afectuoso
  const [conciseness, setConciseness] = useState<number>(65); // Concisión: Telegráfico -> Pedagógico
  const [proactivity, setProactivity] = useState<number>(50); // Proactividad: Solo bajo demanda -> Sugerencias activas

  // UI Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClaudeInstructions, setShowClaudeInstructions] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [simulatedTestText, setSimulatedTestText] = useState<string>('');
  const [copiedInstructions, setCopiedInstructions] = useState<boolean>(false);

  const selectedVoice = VOICE_PROFILES.find((v) => v.id === selectedVoiceId) || VOICE_PROFILES[0];

  // Dynamic waveform simulation while playing
  useEffect(() => {
    let interval: any;
    if (playingVoiceId) {
      interval = setInterval(() => {
        setWaveformBars(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 70) + 30)
        );
      }, 110);
    } else {
      setWaveformBars([30, 45, 60, 40, 75, 50, 65, 35, 80, 45, 55, 30]);
    }
    return () => clearInterval(interval);
  }, [playingVoiceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleTogglePlaySample = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      const voice = VOICE_PROFILES.find((v) => v.id === voiceId);
      if (voice) {
        showToast(`Reproduciendo muestra acústica: ${voice.name}`);
      }
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 4200);
    }
  };

  const handleResetDefaults = () => {
    setSelectedVoiceId('voice_aura');
    setSpeechSpeed(1.0);
    setPitch(0);
    setNaturalPauses(true);
    setWarmth(75);
    setConciseness(65);
    setProactivity(50);
    showToast('Valores de fábrica M3 restaurados');
  };

  const applyTemperamentPreset = (type: 'zen' | 'mentor' | 'friend') => {
    if (type === 'zen') {
      setWarmth(40);
      setConciseness(90); // Muy directo
      setProactivity(25);
      showToast('Preajuste Zen & Directo aplicado');
    } else if (type === 'mentor') {
      setWarmth(70);
      setConciseness(30); // Didáctico
      setProactivity(80);
      showToast('Preajuste Mentor Didáctico aplicado');
    } else if (type === 'friend') {
      setWarmth(90);
      setConciseness(60);
      setProactivity(65);
      showToast('Preajuste Compañero Cálido aplicado');
    }
  };

  const handleSimulateResponse = () => {
    let result = '';
    if (conciseness > 75) {
      result = `[${selectedVoice.name} | ${speechSpeed.toFixed(2)}x | Concisión ${conciseness}%]: "Buenos días. Tres tareas hoy. Primera a las 09:00. Música iniciada."`;
    } else if (conciseness < 40) {
      result = `[${selectedVoice.name} | ${speechSpeed.toFixed(2)}x | Concisión ${conciseness}%]: "Buenos días, José. He preparado tu jornada con dos bloques de trabajo y una pausa de respiración consciente a las 11:30 para asegurar que tu nivel de energía se mantenga óptimo."`;
    } else {
      result = `[${selectedVoice.name} | ${speechSpeed.toFixed(2)}x | Concisión ${conciseness}%]: "Buenos días, José. Tu plan matinal está organizado con foco en arquitectura de sistemas. Cuando gustes, iniciamos."`;
    }
    setSimulatedTestText(result);
    showToast('Respuesta simulada con el temperamento actual');
  };

  const copyClaudePrompt = () => {
    const prompt = `Hola Claude, implementa la pantalla "Voz y Personalidad" en el proyecto Android de VEYA con Jetpack Compose y Material 3:

1. Ubicación de Archivos:
   - UI: personal.veya.ui.screen.settings.VoicePersonalityScreen.kt
   - ViewModel: personal.veya.ui.screen.settings.VoicePersonalityViewModel.kt
   - DataStore: personal.veya.data.preferences.VoicePreferenceKeys.kt
   - Modelos: personal.veya.domain.model.VoiceProfile.kt

2. Tokens Material 3 a utilizar:
   - Primary: Color(0xFF155E95) en Light / Color(0xFF8ECEFF) en Dark
   - Secondary: Color(0xFF7654A7) en Light / Color(0xFFDCB8FF) en Dark
   - Surface: Color(0xFFFFFFFF) en Light / Color(0xFF12181F) en Dark
   - ElevatedCard con RoundedCornerShape(24.dp) y padding de 16.dp.

3. Especificaciones funcionales:
   a) Selector de Perfil Vocal: LazyVerticalGrid con los 4 perfiles:
      - Aura (Femenino / Cálido medio, 195 Hz)
      - Ópalo (Neutro / Terciopelo, 145 Hz)
      - Céfiro (Masculino / Claro, 130 Hz)
      - Vesper (Barítono suave / Texturado, 98 Hz)
   b) Controles de Prosodia:
      - Slider de velocidad: 0.75f a 1.50f (paso 0.05f).
      - Slider de tono (pitch): -3 a +3 semitonos (Int).
      - Switch M3 para pausas orgánicas reflexivas.
   c) Matriz de Temperamento (Sliders Continuos 0..100):
      - Calidez (Sobrio 0% .. Afectuoso 100%)
      - Concisión (Explicativo 0% .. Telegráfico 100%)
      - Proactividad (Bajo demanda 0% .. Sugerencias activas 100%)
   d) Inyección de Prompt: Los valores de Calidez, Concisión y Proactividad deben modular el System Prompt del LLM on-device.

Consulta 'entregas/10_specs_screen_voice_m3_para_claude.md' para ver el código completo.`;

    navigator.clipboard.writeText(prompt);
    setCopiedInstructions(true);
    showToast('Instrucciones para Claude copiadas al portapapeles');
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification (M3 Snackbar) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#16202A]/95 dark:bg-[#E0E3E8]/95 text-white dark:text-[#16202A] text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in backdrop-blur-md border border-white/10 dark:border-black/10">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Material 3 TopAppBar */}
      <div className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#12181F] border-b border-[#CBD2D9]/70 dark:border-[#42474E]/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] transition-colors active:scale-95"
              title="Volver a Ajustes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#7654A7] text-white flex items-center justify-center shadow-xs">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-tight">
                  Voz y Personalidad
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF]">
                  Material 3
                </span>
              </div>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Síntesis neuronal local y temperamento de VEYA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowClaudeInstructions(!showClaudeInstructions)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                showClaudeInstructions
                  ? 'bg-[#155E95] text-white dark:bg-[#8ECEFF] dark:text-[#003355]'
                  : 'text-[#155E95] dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/60 dark:hover:bg-[#004A7B]/40'
              }`}
              title="Guía de implementación para Claude Code"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Guía Claude</span>
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-[#7654A7] dark:text-[#DCB8FF] hover:bg-[#F0E6FF]/70 dark:hover:bg-[#5C3B8D]/30 transition-colors"
              title="Ver código Compose Kotlin"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Restaurar valores de fábrica"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">

        {/* INSTRUCCIONES PARA CLAUDE CODE (COLLAPSIBLE BANNER) */}
        {showClaudeInstructions && (
          <div className="p-4 rounded-3xl bg-[#001D33] text-white border border-[#155E95] shadow-lg animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#155E95] text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                    Instrucciones para Claude Code (Lead Android)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Pautas directas para codificar esta pantalla en Jetpack Compose
                  </p>
                </div>
              </div>
              <button
                onClick={copyClaudePrompt}
                className="px-3 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#1E74B3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedInstructions ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstructions ? 'Copiado' : 'Copiar Prompt'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#8ECEFF] block">1. Paquetes y Rutas</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">personal.veya.ui.screen.settings.VoicePersonalityScreen.kt</span>
                <span className="text-[10px] text-slate-400 mt-1 block">ViewModel con Hilt + DataStore Preferences.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#DCB8FF] block">2. Tokens M3</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">Primary: #155E95 / Secondary: #7654A7</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Cards: RoundedCornerShape(24.dp), Sliders continuos.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Inyección LLM</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">SystemPromptBuilder.kt</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Concisión y Calidez calibran la extensión y trato del modelo.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
              <span>Especificación canónica completa: <code>entregas/10_specs_screen_voice_m3_para_claude.md</code></span>
              <button
                onClick={() => setShowClaudeInstructions(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* HERO STATUS CARD: ACTIVE VOICE & LIVE WAVEFORM */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#F0E6FF] via-[#FFFFFF] to-[#D7EEFF]/30 dark:from-[#2C0D5A]/40 dark:via-[#12181F] dark:to-[#004A7B]/20 border border-[#7654A7]/30 dark:border-[#DCB8FF]/20 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7654A7] dark:bg-[#DCB8FF] text-white dark:text-[#2C0D5A] flex items-center justify-center shadow-md relative">
                <Mic className="w-6 h-6" />
                {playingVoiceId && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#12181F] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-[#16202A] dark:text-[#E0E3E8]">
                    Voz Activa: {selectedVoice.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7654A7]/15 dark:bg-[#DCB8FF]/20 text-[#7654A7] dark:text-[#DCB8FF]">
                    {selectedVoice.recommendedRole}
                  </span>
                </div>
                <p className="text-xs text-[#42474E] dark:text-[#CBD2D9] mt-0.5">
                  {selectedVoice.archetype} • <span className="font-mono">{selectedVoice.frequencyRange}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleTogglePlaySample(selectedVoice.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                playingVoiceId === selectedVoice.id
                  ? 'bg-[#7654A7] text-white dark:bg-[#DCB8FF] dark:text-[#2C0D5A]'
                  : 'bg-white dark:bg-[#16202A] text-[#7654A7] dark:text-[#DCB8FF] border border-[#7654A7]/30 dark:border-[#DCB8FF]/30 hover:bg-[#F0E6FF]'
              }`}
            >
              {playingVoiceId === selectedVoice.id ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                  <span>Probar ({selectedVoice.sampleDuration})</span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic Audio EQ Waveform Visualizer */}
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#101418]/80 border border-[#CBD2D9]/60 dark:border-[#42474E]/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1 h-7 px-2">
              {waveformBars.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-full transition-all duration-100 ${
                    playingVoiceId
                      ? 'bg-gradient-to-t from-[#7654A7] to-[#8ECEFF]'
                      : 'bg-[#B7C5D0] dark:bg-[#42474E]'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] font-mono text-[#42474E] dark:text-[#CBD2D9] shrink-0 flex items-center gap-1 pl-2 border-l border-[#CBD2D9]/70 dark:border-[#42474E]/70">
              <Activity className="w-3 h-3 text-[#7654A7] dark:text-[#DCB8FF]" />
              <span>{speechSpeed.toFixed(2)}x • {pitch >= 0 ? `+${pitch}` : pitch}st</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: VOICE PROFILE SELECTOR (Aura, Ópalo, Céfiro, Vesper) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-[#7654A7] dark:text-[#DCB8FF]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#42474E] dark:text-[#CBD2D9]">
                1. Selector de Perfil de Voz (Síntesis On-Device)
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#155E95] dark:text-[#8ECEFF] font-mono">4 Voces Neuronales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {VOICE_PROFILES.map((voice) => {
              const isSelected = selectedVoiceId === voice.id;
              const isPlaying = playingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoiceId(voice.id);
                    showToast(`Perfil vocal seleccionado: ${voice.name}`);
                  }}
                  className={`p-3.5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#F0E6FF]/80 dark:bg-[#5C3B8D]/25 border-[#7654A7] dark:border-[#DCB8FF] shadow-xs ring-1 ring-[#7654A7]/30'
                      : 'bg-[#FFFFFF] dark:bg-[#12181F] border-[#CBD2D9]/70 dark:border-[#42474E]/60 hover:border-[#7654A7]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                            isSelected
                              ? 'bg-[#7654A7] text-white dark:bg-[#DCB8FF] dark:text-[#2C0D5A]'
                              : 'bg-[#DEE3EA]/60 dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8]'
                          }`}
                        >
                          {voice.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">
                            {voice.name}
                          </h3>
                          <span className="text-[9px] text-[#42474E] dark:text-[#CBD2D9] font-mono block">
                            {voice.timbre.split('(')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlaySample(voice.id);
                          }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isPlaying
                              ? 'bg-[#7654A7] text-white animate-pulse'
                              : 'bg-[#F0E6FF] dark:bg-[#5C3B8D]/30 text-[#7654A7] dark:text-[#DCB8FF] hover:bg-[#F0E6FF]/80'
                          }`}
                          title="Reproducir frase de prueba"
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                          )}
                        </button>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#7654A7] dark:bg-[#DCB8FF] text-white dark:text-[#2C0D5A] flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9] mt-2 line-clamp-2">
                      {voice.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#7654A7] dark:text-[#DCB8FF]">
                      {voice.recommendedRole}
                    </span>
                    <span className="text-[#42474E] dark:text-[#CBD2D9] font-mono">{voice.frequencyRange}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: PROSODY CONTROLS (M3 SLIDERS FOR SPEED & PITCH) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#7654A7] dark:text-[#DCB8FF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                2. Controles de Prosodia y Dinámica Acústica
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#42474E] dark:text-[#CBD2D9] font-mono">Sliders Continuos M3</span>
          </div>

          {/* Speech Speed Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#42474E] dark:text-[#CBD2D9]" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Velocidad de habla</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF] font-mono text-[11px] font-bold">
                  {speechSpeed.toFixed(2)}x
                </span>
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {speechSpeed < 0.95 ? '(Reflexiva)' : speechSpeed > 1.2 ? '(Ágil)' : '(Estándar)'}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min="0.75"
                max="1.50"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#7654A7] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9] mt-1 font-mono">
                <span>0.75x (Pausada)</span>
                <span className="font-bold text-[#16202A] dark:text-[#E0E3E8]">1.00x</span>
                <span>1.25x</span>
                <span>1.50x (Ágil)</span>
              </div>
            </div>
          </div>

          {/* Tone / Pitch Slider */}
          <div className="space-y-2 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#42474E] dark:text-[#CBD2D9]" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Tono acústico (Pitch)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF] font-mono text-[11px] font-bold">
                  {pitch > 0 ? `+${pitch}` : pitch} st
                </span>
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {pitch < 0 ? '(Grave)' : pitch > 0 ? '(Agudo)' : '(F0 natural)'}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value))}
                className="w-full accent-[#7654A7] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9] mt-1 font-mono">
                <span>-3 st (Profundo)</span>
                <span>-1 st</span>
                <span className="font-bold text-[#16202A] dark:text-[#E0E3E8]">0 st (Natural)</span>
                <span>+1 st</span>
                <span>+3 st (Claro)</span>
              </div>
            </div>
          </div>

          {/* Natural Organic Breathing Pauses (M3 Switch) */}
          <div className="flex items-center justify-between pt-3 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Pausas orgánicas de respiración
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Inserta cadencia biológica y micro-respiros antes de oraciones complejas.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={naturalPauses}
                onChange={(e) => {
                  setNaturalPauses(e.target.checked);
                  showToast(
                    e.target.checked
                      ? 'Pausas orgánicas activadas'
                      : 'Pausas orgánicas desactivadas'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7654A7]"></div>
            </label>
          </div>
        </div>

        {/* SECTION 3: TEMPERAMENT MATRIX (CALIDEZ, CONCISIÓN, PROACTIVIDAD) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7654A7] dark:text-[#DCB8FF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                3. Matriz de Temperamento y Comunicación
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#42474E] dark:text-[#CBD2D9] font-mono">3 Dimensiones</span>
          </div>

          {/* Quick Presets FilterChips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] mr-1">Preajustes rápidos:</span>
            <button
              onClick={() => applyTemperamentPreset('zen')}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#DEE3EA]/50 dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#F0E6FF] dark:hover:bg-[#5C3B8D]/30 transition-colors"
            >
              Zen / Directo
            </button>
            <button
              onClick={() => applyTemperamentPreset('mentor')}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#DEE3EA]/50 dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#F0E6FF] dark:hover:bg-[#5C3B8D]/30 transition-colors"
            >
              Mentor Didáctico
            </button>
            <button
              onClick={() => applyTemperamentPreset('friend')}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#DEE3EA]/50 dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#F0E6FF] dark:hover:bg-[#5C3B8D]/30 transition-colors"
            >
              Compañero Cálido
            </button>
          </div>

          {/* 1. Calidez y Cercanía Emocional */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Calidez y Empatía</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {warmth < 35 ? 'Sobrio / Distante' : warmth < 70 ? 'Equilibrado' : 'Afectuoso'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF] font-mono text-[11px]">
                  {warmth}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={warmth}
              onChange={(e) => setWarmth(parseInt(e.target.value))}
              className="w-full accent-[#7654A7] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
              <span>Sobrio y analítico</span>
              <span>Equilibrado</span>
              <span>Afectuoso y cercano</span>
            </div>
          </div>

          {/* 2. Concisión y Extensión de Respuestas */}
          <div className="space-y-1.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Concisión en Respuestas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {conciseness > 75 ? 'Telegráfico (≤ 15 palabras)' : conciseness < 35 ? 'Explicativo / Didáctico' : 'Equilibrado (2-3 frases)'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF] font-mono text-[11px]">
                  {conciseness}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={conciseness}
              onChange={(e) => setConciseness(parseInt(e.target.value))}
              className="w-full accent-[#7654A7] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
              <span>Explicativo / Didáctico</span>
              <span>Equilibrado</span>
              <span>Telegráfico / Directo</span>
            </div>
          </div>

          {/* 3. Proactividad e Iniciativa */}
          <div className="space-y-1.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Nivel de Proactividad</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {proactivity < 35 ? 'Bajo demanda' : proactivity < 70 ? 'Sugerencias discretas' : 'Anticipatorio'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#F0E6FF] dark:bg-[#5C3B8D]/40 text-[#7654A7] dark:text-[#DCB8FF] font-mono text-[11px]">
                  {proactivity}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={proactivity}
              onChange={(e) => setProactivity(parseInt(e.target.value))}
              className="w-full accent-[#7654A7] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
              <span>Solo cuando preguntas</span>
              <span>Moderado</span>
              <span>Sugerencias activas</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: INTERACTIVE LIVE RESPONSE SIMULATOR */}
        <div className="p-4 rounded-3xl bg-[#001D33] text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8ECEFF]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                Simulador de Respuesta Vocal en Vivo
              </h3>
            </div>
            <button
              onClick={handleSimulateResponse}
              className="px-3 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#1E74B3] text-white text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simular Diálogo</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-300">
            Prueba cómo interactúan la voz seleccionada ({selectedVoice.name}),
            la velocidad acústica ({speechSpeed.toFixed(2)}x) y los niveles de calidez ({warmth}%),
            concisión ({conciseness}%) y proactividad ({proactivity}%).
          </p>

          {simulatedTestText ? (
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs text-[#D7EEFF] leading-relaxed font-sans italic">
              {simulatedTestText}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-400 italic">
              Pulsa en "Simular Diálogo" para generar una frase representativa con esta calibración.
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Procesamiento 100% On-Device: Cero envío de audio a la nube.</span>
          </div>
        </div>
      </div>

      {/* MODAL: JETPACK COMPOSE M3 SPECIFICATION FOR CLAUDE */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#12181F] rounded-3xl p-5 w-full max-w-2xl border border-[#CBD2D9] dark:border-[#42474E] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0E6FF] text-[#7654A7] dark:bg-[#5C3B8D] dark:text-[#DCB8FF] flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                    Especificación Material 3 en Jetpack Compose
                  </h3>
                  <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                    Código Kotlin listo para VoicePersonalityScreen.kt + ViewModel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] hover:text-[#16202A] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#101418] text-[#E0E3E8] font-mono text-[11px] leading-relaxed space-y-2 border border-[#42474E]">
              <div className="flex justify-between items-center pb-2 border-b border-[#42474E]">
                <span className="text-[#DCB8FF] font-bold">VoicePersonalityScreen.kt</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `// ScreenVoice.kt - Jetpack Compose Material 3 implementation
@Composable
fun VoicePersonalityScreen(
    onNavigateBack: () -> Unit,
    viewModel: VoicePersonalityViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Voz y Personalidad") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            // 1. Selector de perfil (Aura, Ópalo, Céfiro, Vesper)
            item { VoiceProfilesGrid(selected = state.selectedVoice, onSelect = viewModel::selectVoice) }
            // 2. Prosodia (Velocidad 0.75f..1.50f y Tono -3..+3)
            item { Slider(value = state.speed, onValueChange = viewModel::setSpeed, valueRange = 0.75f..1.50f) }
            // 3. Matriz de Temperamento (Calidez, Concisión, Proactividad)
            item { ContinuousTraitSlider(label = "Calidez", value = state.warmth, onValueChange = viewModel::setWarmth) }
            item { ContinuousTraitSlider(label = "Concisión", value = state.conciseness, onValueChange = viewModel::setConciseness) }
            item { ContinuousTraitSlider(label = "Proactividad", value = state.proactivity, onValueChange = viewModel::setProactivity) }
        }
    }
}`
                    );
                    showToast('Código Compose copiado al portapapeles');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#16202A] hover:bg-[#232F3D] text-xs text-[#DCB8FF] flex items-center gap-1 border border-[#42474E]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Composable</span>
                </button>
              </div>
              <p className="text-slate-500">// Arquitectura Jetpack Compose con M3 Slider continuo y DataStore</p>
              <p className="text-purple-400">@Composable</p>
              <p className="text-yellow-300">fun VoicePersonalityScreen(</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit,</p>
              <p className="text-slate-300 pl-4">viewModel: VoicePersonalityViewModel = hiltViewModel()</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// 1. Selector de Voces M3 OutlinedCard</p>
              <p className="text-slate-300 pl-4">VoiceCard(voice = Aura, isSelected = state.voiceId == "voice_aura")</p>
              <p className="text-slate-300 pl-4">VoiceCard(voice = Ópalo, isSelected = state.voiceId == "voice_opalo")</p>
              <p className="text-slate-300 pl-4">VoiceCard(voice = Céfiro, isSelected = state.voiceId == "voice_cefiro")</p>
              <p className="text-slate-300 pl-4">VoiceCard(voice = Vesper, isSelected = state.voiceId == "voice_vesper")</p>
              <br />
              <p className="text-slate-400 pl-4">// 2. Sliders de Prosodia</p>
              <p className="text-slate-300 pl-4">Slider(value = state.speed, valueRange = 0.75f..1.50f, onValueChange = &#123; ... &#125;)</p>
              <p className="text-slate-300 pl-4">Slider(value = state.pitch.toFloat(), valueRange = -3f..3f, onValueChange = &#123; ... &#125;)</p>
              <br />
              <p className="text-slate-400 pl-4">// 3. Matriz de Temperamento</p>
              <p className="text-slate-300 pl-4">M3TraitSlider(title = "Calidez", value = state.warmth, range = 0..100)</p>
              <p className="text-slate-300 pl-4">M3TraitSlider(title = "Concisión", value = state.conciseness, range = 0..100)</p>
              <p className="text-slate-300 pl-4">M3TraitSlider(title = "Proactividad", value = state.proactivity, range = 0..100)</p>
              <p className="text-yellow-300">&#125;</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Ver documento: <code className="font-mono text-[#7654A7] dark:text-[#DCB8FF]">entregas/10_specs_screen_voice_m3_para_claude.md</code>
              </span>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="py-2 px-4 rounded-xl bg-[#DEE3EA]/70 dark:bg-[#16202A] text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#DEE3EA]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
