import React, { useState } from 'react';
import { User, Volume2, CloudSun, Newspaper, Brain, Bell, Palette, ChevronRight, Shield, Cpu, Sparkles } from 'lucide-react';

interface ScreenSettingsProps {
  onOpenOnboarding: () => void;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({ onOpenOnboarding }) => {
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('Voz 1 (Calmada & Cercana)');

  const settingsGroups = [
    {
      title: 'Tu Compañero VEYA',
      items: [
        { id: 'partner', title: 'Tu compañero', desc: 'Asistente VEYA · Nombre: José · Trato cercano', icon: <User className="w-4 h-4 text-[#155E95]" />, onClick: onOpenOnboarding },
        { id: 'voice', title: 'Voz y personalidad', desc: selectedVoice, icon: <Volume2 className="w-4 h-4 text-[#7654A7]" /> },
        { id: 'entrena', title: 'ENTRENA (Perfiles)', desc: 'Perfiles de aprendizaje activo y hábitos', icon: <Cpu className="w-4 h-4 text-[#006A67]" /> },
        { id: 'memory', title: 'Personalización y memoria explícita', desc: '4 memorias guardadas en local', icon: <Brain className="w-4 h-4 text-amber-600" /> },
      ],
    },
    {
      title: 'Servicios & Rutina',
      items: [
        { id: 'alarm', title: 'Música de alarma', desc: 'Piano acústico matinal', icon: <Bell className="w-4 h-4 text-rose-600" /> },
        { id: 'weather', title: 'Meteorología', desc: 'Sin GPS · Ubicación preestablecida', icon: <CloudSun className="w-4 h-4 text-sky-600" /> },
        { id: 'news', title: 'Medios de noticias', desc: '2 feeds RSS seleccionados', icon: <Newspaper className="w-4 h-4 text-indigo-600" /> },
      ],
    },
    {
      title: 'Sistema & Privacidad',
      items: [
        { id: 'privacy', title: 'Privacidad y datos', desc: '100% en dispositivo · Sin telemetría', icon: <Shield className="w-4 h-4 text-emerald-600" /> },
        { id: 'onboarding_restart', title: 'Reconfigurar Onboarding', desc: 'Volver a iniciar el asistente paso a paso', icon: <Sparkles className="w-4 h-4 text-[#7654A7]" />, onClick: onOpenOnboarding },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Nunito_Sans']">
            Ajustes
          </h1>
          <p className="text-xs text-slate-400">Preferencias de VEYA en este dispositivo</p>
        </div>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            {group.title}
          </span>
          <div className="rounded-3xl bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm">
            {group.items.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className={`flex items-center justify-between p-3.5 transition-colors ${
                  item.onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
