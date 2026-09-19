import React, { useState } from 'react';
import { AvatarVisual } from './AvatarVisual';
import { Send, Trash2, Mic, MicOff, Volume2, Sparkles, User, Info } from 'lucide-react';
import { ChatMessage, AvatarState, AvatarMood } from '../types';

export const ScreenChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'veya',
      text: 'Hola José. Estoy aquí. ¿En qué puedo acompañarte hoy?',
      timestamp: '08:14',
      mood: 'sereno',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Recuérdame revisar la integración del tema Material 3 con Claude a las 10:00.',
      timestamp: '08:15',
    },
    {
      id: '3',
      sender: 'veya',
      text: 'Anotado en tu memoria local: "Revisar integración Material 3 con Claude a las 10:00". No saldrá de tu teléfono.',
      timestamp: '08:15',
      mood: 'concentrado',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('sereno');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setAvatarState('thinking');

    // Simulate local VEYA response
    setTimeout(() => {
      setAvatarState('speaking');
      setAvatarMood('cercano');
      const responseMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'veya',
        text: 'He procesado tu petición en local. Tu privacidad es sagrada.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: 'cercano',
      };
      setMessages((prev) => [...prev, responseMsg]);

      setTimeout(() => {
        setAvatarState('idle');
      }, 3000);
    }, 1200);
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
    setMessages([]);
    setAvatarState('idle');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7FAFC] dark:bg-[#101418]">
      {/* Top Bar with Clear and Status */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#12181F] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Conversar con VEYA</h2>
            <p className="text-[10px] text-slate-400">Canal local directo · Sin conexión externa</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Vaciar transcripción"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Interactive Avatar Banner */}
      <div className="py-2 px-4 flex items-center justify-center bg-gradient-to-b from-white/90 to-transparent dark:from-[#12181F]/90 shrink-0">
        <AvatarVisual
          state={avatarState}
          mood={avatarMood}
          size={105}
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
            <p className="text-xs mt-1 max-w-xs">Escribe o pulsa el micrófono para hablar directamente con VEYA.</p>
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
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#155E95] text-white rounded-br-sm shadow-sm'
                      : 'bg-white dark:bg-[#1C242E] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            );
          })
        )}
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
            placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe a VEYA...'}
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
