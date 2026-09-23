import React, { useState } from 'react';
import {
  User,
  Volume2,
  CloudSun,
  Newspaper,
  Brain,
  Bell,
  ChevronRight,
  Shield,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { ScreenVoice } from './ScreenVoice';
import { ScreenTraining } from './ScreenTraining';
import { ScreenAlarm } from './ScreenAlarm';
import { ScreenWeather } from './ScreenWeather';
import { ScreenNews } from './ScreenNews';
import { ScreenPartner } from './ScreenPartner';
import { ScreenIntelligence } from './ScreenIntelligence';

type SettingsSubScreen =
  | 'partner'
  | 'voice'
  | 'training'
  | 'alarm'
  | 'weather'
  | 'news'
  | 'intelligence'
  | null;

interface ScreenSettingsProps {
  onOpenOnboarding: () => void;
  onOpenVault?: () => void;
  initialSubScreen?: SettingsSubScreen;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({
  onOpenOnboarding,
  onOpenVault,
  initialSubScreen = null,
}) => {
  const [activeSubScreen, setActiveSubScreen] = useState<SettingsSubScreen>(initialSubScreen);

  // If a subscreen is active, render that subscreen with a back button to settings
  if (activeSubScreen === 'voice') {
    return <ScreenVoice onBack={() => setActiveSubScreen(null)} />;
  }
  if (activeSubScreen === 'training') {
    return <ScreenTraining onBack={() => setActiveSubScreen(null)} />;
  }
  if (activeSubScreen === 'alarm') {
    return <ScreenAlarm onBack={() => setActiveSubScreen(null)} />;
  }
  if (activeSubScreen === 'weather') {
    return <ScreenWeather onBack={() => setActiveSubScreen(null)} />;
  }
  if (activeSubScreen === 'news') {
    return <ScreenNews onBack={() => setActiveSubScreen(null)} />;
  }
  if (activeSubScreen === 'partner') {
    return (
      <ScreenPartner
        onBack={() => setActiveSubScreen(null)}
        onOpenOnboarding={onOpenOnboarding}
      />
    );
  }
  if (activeSubScreen === 'intelligence') {
    return <ScreenIntelligence onBack={() => setActiveSubScreen(null)} />;
  }

  const settingsGroups = [
    {
      title: 'Mi Asistente & Personalidad',
      items: [
        {
          id: 'partner',
          title: 'Mi compañero',
          desc: 'Asistente VEYA · Nombre: José · Trato cercano',
          icon: <User className="w-4 h-4 text-[#155E95]" />,
          onClick: () => setActiveSubScreen('partner'),
        },
        {
          id: 'voice',
          title: 'Mi voz y personalidad',
          desc: 'Voz Aura · Calidez 75% · Prosodia local',
          icon: <Volume2 className="w-4 h-4 text-[#7654A7]" />,
          onClick: () => setActiveSubScreen('voice'),
        },
        {
          id: 'intelligence',
          title: 'Mi inteligencia',
          desc: 'Proactividad · Nivel de detalle · Memoria efímera local',
          icon: <Sparkles className="w-4 h-4 text-[#155E95]" />,
          onClick: () => setActiveSubScreen('intelligence'),
        },
        {
          id: 'entrena',
          title: 'Mi entrenamiento (Perfiles)',
          desc: '4 perfiles activos · Aprendizaje local federado',
          icon: <Cpu className="w-4 h-4 text-[#006A67]" />,
          onClick: () => setActiveSubScreen('training'),
        },
        {
          id: 'memory',
          title: 'Mi bóveda de memoria',
          desc: 'Recuerdos protegidos · Zero-Knowledge',
          icon: <Brain className="w-4 h-4 text-amber-600" />,
          onClick: onOpenVault,
        },
      ],
    },
    {
      title: 'Mis Servicios & Rutina',
      items: [
        {
          id: 'alarm',
          title: 'Mi música de alarma',
          desc: '07:30 · Piano acústico con fade-in gradual',
          icon: <Bell className="w-4 h-4 text-rose-600" />,
          onClick: () => setActiveSubScreen('alarm'),
        },
        {
          id: 'weather',
          title: 'Mi meteorología',
          desc: 'Madrid (Centro) · Sin GPS ni rastreo',
          icon: <CloudSun className="w-4 h-4 text-sky-600" />,
          onClick: () => setActiveSubScreen('weather'),
        },
        {
          id: 'news',
          title: 'Mis medios de noticias',
          desc: '4 feeds RSS suscritos · Resumen matinal 60s',
          icon: <Newspaper className="w-4 h-4 text-indigo-600" />,
          onClick: () => setActiveSubScreen('news'),
        },
      ],
    },
    {
      title: 'Mi Sistema & Privacidad',
      items: [
        {
          id: 'privacy',
          title: 'Mi memoria y privacidad',
          desc: '100% en dispositivo · Cifrado hardware AES-256',
          icon: <Shield className="w-4 h-4 text-emerald-600" />,
          onClick: onOpenVault,
        },
        {
          id: 'onboarding_restart',
          title: 'Mi configuración inicial (Onboarding)',
          desc: 'Volver a iniciar el asistente paso a paso',
          icon: <Sparkles className="w-4 h-4 text-[#7654A7]" />,
          onClick: onOpenOnboarding,
        },
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
