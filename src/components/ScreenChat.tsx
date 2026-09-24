import React, { useState } from 'react';
import { AvatarVisual } from './AvatarVisual';
import { Send, Trash2, Mic, MicOff, Volume2, Sparkles, User, Info, Layers, Eye, EyeOff, ShieldCheck, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import { ChatMessage, AvatarState, AvatarMood, BlackboardTemplateType } from '../types';
import { useVeya } from '../context/VeyaGlobalContext';

interface ScreenChatProps {
  onOpenBlackboard?: (template?: BlackboardTemplateType) => void;
}

export const ScreenChat: React.FC<ScreenChatProps> = ({ onOpenBlackboard }) => {
  const {
    partnerProfile,
    voiceProfile,
    activeInContextFacts,
    toggleFactContext,
    messages,
    sendMessage,
    clearMessages,
  } = useVeya();

  const [inputVal, setInputVal] = useState('');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('sereno');
  const [isListening, setIsListening] = useState(false);
  const [showBrokerContext, setShowBrokerContext] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const textToSend = inputVal.trim();
    setInputVal('');

    setAvatarState('thinking');
    setAvatarMood('concentrado');

    sendMessage(textToSend);

    // Coordinate avatar transition
    setTimeout(() => {
      setAvatarState('speaking');
      setAvatarMood(voiceProfile.warmth > 70 ? 'cercano' : 'sereno');

      setTimeout(() => {
        setAvatarState('idle');
        setAvatarMood('sereno');
      }, 2500);
    }, 700);
  };

  const handleToggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      setAvatarState('listening');
      setAvatarMood('concentrado');
    } else {
      setIsListening(false);
      setAvatarState('idle');
    }
  };

  const handleClear = () => {
    clearMessages();
    setAvatarState('idle');
  };

  const promptChips = [
    '🧊 Simulador Educativo 3D: Modelos y Render',
    "🪐 NASA's Eyes: Sistema Solar, Mareas e ISS",
    '🫀 Anatronica 3D: Corazón y Cuerpo Humano',
    '📈 GeoGebra & Wolfram: Funciones y Quebrados',
    '🦖 Smithsonian 3D: Fósiles y Célula Eucariota',
    '⚡ Electricidad, Fontanería y Motor 4T',
    '🩺 Salud: Piel y Regla ABCD Melanoma',
    '⚖️ Derecho Cotidiano y Alquileres',
    '¿Qué sabes sobre mí?',
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7FAFC] dark:bg-[#101418] font-['Nunito_Sans']">
      {/* Top Bar with Clear, Persona Badge, and Status */}
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12181F] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {partnerProfile.assistantName}
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                {partnerProfile.pronounTreatment === 'tu' ? 'Tú' : 'Usted'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-[#155E95] dark:text-[#8ECEFF] font-medium">
                {voiceProfile.selectedVoiceId.replace('voice_', '')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Motor local on-device · Privacidad absoluta</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Blackboard Launch Button */}
          {onOpenBlackboard && (
            <button
              onClick={() => onOpenBlackboard('orbits_astronomy')}
              className="px-2 py-1 rounded-xl text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 flex items-center gap-1 hover:bg-cyan-100 transition-colors"
              title="Abrir Pizarra Interactiva de VEYA"
            >
              <Compass className="w-3 h-3 text-cyan-500" />
              <span>Pizarra</span>
            </button>
          )}

          <button
            onClick={() => setShowBrokerContext(!showBrokerContext)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors border ${
              showBrokerContext
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800 text-[#155E95] dark:text-[#8ECEFF]'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="Ver contexto efímero inyectado (Stateless Broker)"
          >
            <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Prompt: {activeInContextFacts.length}</span>
            {showBrokerContext ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Vaciar transcripción"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ephemeral Injected Context Drawer (Stateless Broker Inspector) */}
      {showBrokerContext && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-[#151D26] border-b border-slate-200 dark:border-slate-800 text-xs shrink-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Contexto Efímero en Prompt (Stateless Broker)</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {activeInContextFacts.length} hechos cargados en RAM local
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            La IA no guarda estado. En cada turno solo recibe estos recuerdos recuperados de SQLite cifrado:
          </p>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {activeInContextFacts.length === 0 ? (
              <p className="text-[11px] italic text-slate-400 py-1">
                Ningún recuerdo activo en la Bóveda. El prompt efímero está limpio.
              </p>
            ) : (
              activeInContextFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1A222D] border border-slate-200/80 dark:border-slate-800 text-[11px]"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">
                      {fact.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {fact.detail}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFactContext(fact.id)}
                    className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
                    title="Excluir de este turno"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Interactive Avatar Banner */}
      <div className="py-2 px-4 flex items-center justify-center bg-gradient-to-b from-white/90 to-transparent dark:from-[#12181F]/90 shrink-0">
        <AvatarVisual
          state={avatarState}
          mood={avatarMood}
          size={100}
          amplitude={avatarState === 'speaking' ? 0.7 : 0.2}
          showStatusLabel
        />
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-[#7654A7] mb-2 opacity-50" />
            <p className="text-sm font-medium">Transcripción vacía</p>
            <p className="text-xs mt-1 max-w-xs">
              Escribe o pulsa un atajo contextual para conversar con {partnerProfile.assistantName}.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#155E95] text-white rounded-br-sm shadow-sm'
                      : 'bg-white dark:bg-[#1C242E] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Interactive Blackboard Launch Card */}
                  {m.interactivePayload && (
                    <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border border-cyan-700/50 text-left shadow-md">
                      <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{m.interactivePayload.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-2 leading-tight">
                        {m.interactivePayload.subtitle}
                      </p>
                      <button
                        onClick={() => onOpenBlackboard?.(m.interactivePayload?.template)}
                        className="w-full py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Abrir Pizarra Interactiva</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto bg-slate-50/80 dark:bg-[#12181F]/80 border-t border-slate-100 dark:border-slate-800/80 shrink-0 no-scrollbar">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputVal(chip);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-[#1C242E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#155E95] dark:hover:border-[#8ECEFF] transition-all shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12181F] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVoice}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-[#B3261E] text-white shadow-md animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
            aria-label={isListening ? 'Detener voz' : 'Iniciar voz'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Escuchando tu voz...' : `Escribe a ${partnerProfile.assistantName}...`}
            className="flex-1 bg-slate-100 dark:bg-[#1A222B] text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm px-4 py-3 rounded-full border border-transparent focus:border-[#155E95] dark:focus:border-[#8ECEFF] focus:outline-none transition-all"
          />

          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="w-11 h-11 rounded-full bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow hover:brightness-110 active:scale-95 transition-all"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
