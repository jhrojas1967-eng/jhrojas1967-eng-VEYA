import React from 'react';
import { ScreenTab } from '../types';
import { Calendar, MessageSquare, Music, Settings, Sparkles } from 'lucide-react';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  isDark: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, isDark }) => {
  const navItems: { id: ScreenTab; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Hoy', icon: <Calendar className="w-5 h-5" /> },
    { id: 'chat', label: 'Conversar', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'music', label: 'Música', icon: <Music className="w-5 h-5" /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="veya-bottom-navigation"
      aria-label="Navegación principal de VEYA"
      className="w-full h-16 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#12181F]/95 backdrop-blur-md flex items-center justify-around px-2 z-30 select-none transition-colors"
    >
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-btn-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 px-3 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? 'text-[#155E95] dark:text-[#8ECEFF] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-all ${
                isActive
                  ? 'bg-[#D7EEFF] dark:bg-[#004A7B] text-[#001D33] dark:text-[#D7EEFF] px-4'
                  : 'bg-transparent'
              }`}
            >
              {item.icon}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
