import React, { useState } from 'react';
import { AvatarVisual } from './AvatarVisual';
import { Play, AlarmClock, Sun, CloudRain, Bell, CheckCircle2, ChevronRight, Mic, Sparkles } from 'lucide-react';
import { RoutineStep } from '../types';

interface ScreenTodayProps {
  onGoToChat: () => void;
  onGoToRoutineSettings: () => void;
}

export const ScreenToday: React.FC<ScreenTodayProps> = ({ onGoToChat, onGoToRoutineSettings }) => {
  const [isPlayingRoutine, setIsPlayingRoutine] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const routineSteps: RoutineStep[] = [
    { id: '1', order: 1, time: '07:30', title: 'Alarma & Despertar', detail: 'Sonido suave de piano acústico', icon: 'alarm', status: 'completed' },
    { id: '2', order: 2, time: '07:32', title: 'Saludo personal', detail: 'Buenos días, José. Hoy es jueves', icon: 'greeting', status: 'completed' },
    { id: '3', order: 3, time: '07:33', title: 'Meteorología local', detail: '18°C, cielo despejado, sin lluvias', icon: 'weather', status: 'active' },
    { id: '4', order: 4, time: '07:35', title: 'Titulares de Noticias', detail: '3 noticias principales de tu feed RSS', icon: 'news', status: 'pending' },
    { id: '5', order: 5, time: '07:38', title: 'Recordatorios del día', detail: 'Revisión código VEYA a las 10:00', icon: 'reminder', status: 'pending' },
    { id: '6', order: 6, time: '07:40', title: 'Cierre y energía', detail: 'VEYA lista en segundo plano', icon: 'finish', status: 'pending' },
  ];

  const handleToggleRoutine = () => {
    setIsPlayingRoutine(!isPlayingRoutine);
    if (!isPlayingRoutine) {
      setCurrentStepIdx(2);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-4">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Jueves, 19 de Septiembre
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-['Nunito_Sans']">
            Buenos días, José
          </h1>
        </div>
        <button
          onClick={onGoToChat}
          className="w-12 h-12 rounded-full bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Hablar con VEYA"
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      {/* Avatar Ambient Presence Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D7EEFF]/60 via-[#F0E6FF]/40 to-white dark:from-[#003355]/40 dark:via-[#2C0D5A]/30 dark:to-[#12181F] p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
        <div className="mb-2">
          <AvatarVisual
            state={isPlayingRoutine ? 'speaking' : 'idle'}
            mood="sereno"
            size={130}
            amplitude={isPlayingRoutine ? 0.65 : 0.1}
          />
        </div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          VEYA está tranquila y lista
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mt-0.5">
          {isPlayingRoutine ? 'Reproduciendo rutina matinal...' : 'Tu privacidad está protegida. Todo el cómputo es local en tu dispositivo.'}
        </p>

        <div className="mt-4 flex items-center gap-2 w-full">
          <button
            onClick={handleToggleRoutine}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all ${
              isPlayingRoutine
                ? 'bg-[#B3261E] text-white hover:bg-[#961f18]'
                : 'bg-[#155E95] text-white hover:bg-[#124d7b] shadow'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isPlayingRoutine ? 'Pausar Rutina' : 'Probar Rutina'}
          </button>
          <button
            onClick={onGoToChat}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold bg-white dark:bg-[#1C242E] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7654A7] dark:text-[#DCB8FF]" />
            Conversar
          </button>
        </div>
      </div>

      {/* Routine Steps Interactive Timeline */}
      <div className="rounded-3xl bg-white dark:bg-[#12181F] p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Rutina Matinal (07:30)
            </h3>
          </div>
          <button
            onClick={onGoToRoutineSettings}
            className="text-xs font-semibold text-[#155E95] dark:text-[#8ECEFF] hover:underline"
          >
            Ajustar
          </button>
        </div>

        <div className="space-y-2.5">
          {routineSteps.map((step, idx) => {
            const isCurrent = idx === currentStepIdx && isPlayingRoutine;
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-all border ${
                  isCurrent
                    ? 'bg-[#D7EEFF]/70 dark:bg-[#004A7B]/40 border-[#155E95] dark:border-[#8ECEFF]'
                    : step.status === 'completed'
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 opacity-80'
                    : 'bg-white dark:bg-[#12181F] border-slate-100 dark:border-slate-800/80'
                }`}
              >
                <div className="mt-0.5">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#155E95] dark:border-[#8ECEFF] flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#155E95] dark:bg-[#8ECEFF]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Cards: Weather & Reminders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-3xl bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Clima</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">18°C</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Soleado · Humedad 45%</p>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Previsión local sin GPS</span>
        </div>

        <div className="p-3.5 rounded-3xl bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Recordatorio</span>
            <Bell className="w-4 h-4 text-[#7654A7] dark:text-[#DCB8FF]" />
          </div>
          <div className="my-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">Revisión VEYA</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Hoy 10:00 · En 2 horas</p>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">1 pendiente hoy</span>
        </div>
      </div>
    </div>
  );
};
