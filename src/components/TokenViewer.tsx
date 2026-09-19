import React, { useState } from 'react';
import { LightColorScheme, DarkColorScheme, ShapeTokens, TypographyTokens, KotlinThemeSnippet } from '../themeTokens';
import { Copy, Check, Palette, Smartphone, Sparkles, Layers } from 'lucide-react';

export const TokenViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'kotlin' | 'shapes'>('colors');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#155E95] dark:text-[#8ECEFF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tokens Material 3 para Claude Code (Jetpack Compose)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapeados estrictamente a <code className="font-mono text-[#155E95] dark:text-[#8ECEFF]">personal.veya.ui.theme</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
            {(['colors', 'kotlin', 'shapes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-xl transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#1C242E] text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab === 'colors' ? 'Paleta M3' : tab === 'kotlin' ? 'Código Kotlin' : 'Formas & Fuentes'}
              </button>
            ))}
          </div>

          {activeTab === 'kotlin' && (
            <button
              onClick={() => handleCopy(KotlinThemeSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#155E95] text-white hover:bg-[#124d7b] text-xs font-bold transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Kotlin'}</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Light Theme Tokens */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Esquema Claro (VeyaLightColorScheme)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(LightColorScheme).slice(0, 12).map(([key, hex]) => (
                <div key={key} className="p-2 rounded-xl bg-white dark:bg-[#1C242E] border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg shrink-0 border border-black/10 shadow-xs" style={{ backgroundColor: hex }} />
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] truncate text-slate-800 dark:text-slate-200">{key}</p>
                    <p className="font-mono text-[10px] text-slate-400">{hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark Theme Tokens */}
          <div className="p-4 rounded-2xl bg-[#0B1015] border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Esquema Oscuro (VeyaDarkColorScheme)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(DarkColorScheme).slice(0, 12).map(([key, hex]) => (
                <div key={key} className="p-2 rounded-xl bg-[#16202A] border border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg shrink-0 border border-white/10 shadow-xs" style={{ backgroundColor: hex }} />
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] truncate text-slate-200">{key}</p>
                    <p className="font-mono text-[10px] text-slate-400">{hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kotlin' && (
        <div className="relative">
          <pre className="p-4 rounded-2xl bg-[#0F172A] text-slate-200 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
            {KotlinThemeSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'shapes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7654A7]" />
              Formas (VeyaShapes)
            </h4>
            <div className="space-y-2">
              {Object.entries(ShapeTokens).map(([name, desc]) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1C242E] border border-slate-200 dark:border-slate-800">
                  <span className="font-bold capitalize">{name}</span>
                  <span className="font-mono text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#155E95]" />
              Tipografía (Nunito Sans)
            </h4>
            <div className="space-y-2 font-['Nunito_Sans']">
              {Object.entries(TypographyTokens).map(([styleName, spec]) => (
                <div key={styleName} className="p-2 rounded-xl bg-white dark:bg-[#1C242E] border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between font-bold">
                    <span>{styleName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{spec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
