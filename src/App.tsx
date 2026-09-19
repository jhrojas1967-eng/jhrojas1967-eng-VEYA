import React, { useState } from 'react';
import { TokenViewer } from './components/TokenViewer';
import { AvatarLaboratory } from './components/AvatarLaboratory';
import { ScreenToday } from './components/ScreenToday';
import { ScreenChat } from './components/ScreenChat';
import { ScreenMusic } from './components/ScreenMusic';
import { ScreenSettings } from './components/ScreenSettings';
import { ScreenOnboarding } from './components/ScreenOnboarding';
import { BottomNav } from './components/BottomNav';
import { ScreenTab, ThemeMode } from './types';
import { Smartphone, Moon, Sun, Laptop, ArrowRight, Share2, Download, Sparkles, CheckCircle, ShieldCheck, GitBranch } from 'lucide-react';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [currentTab, setCurrentTab] = useState<ScreenTab>('today');
  const [activeStudioView, setActiveStudioView] = useState<'mockup' | 'tokens' | 'avatar' | 'collaboration'>('mockup');

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#0A0D12] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'} font-['Nunito_Sans'] antialiased transition-colors`}>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#12181F]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#155E95] text-white flex items-center justify-center font-black text-lg shadow-md">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">VEYA Design & UI Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D7EEFF] text-[#001D33] dark:bg-[#004A7B] dark:text-[#D7EEFF] font-bold">
                  Gemini Art Director
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Entrega de diseño Material 3 & Jetpack Compose para Claude Code
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold">
              {[
                { id: 'mockup', label: 'Pantallas Android' },
                { id: 'avatar', label: 'Avatar VEYA' },
                { id: 'tokens', label: 'Tokens M3' },
                { id: 'collaboration', label: 'Flujo 3 IA' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveStudioView(v.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeStudioView === v.id
                      ? 'bg-white dark:bg-[#1C242E] text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Cambiar tema claro/oscuro"
              title="Alternar entre tema Claro y Oscuro"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* VIEW 1: INTERACTIVE ANDROID MOCKUP VIEW */}
        {activeStudioView === 'mockup' && (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-2">
            {/* Mobile Device Frame */}
            <div className="w-[380px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col shrink-0 select-none">
              {/* Camera Notch / Speaker */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-3" />
              </div>

              {/* Mobile Screen Internal Surface */}
              <div className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative ${isDark ? 'dark bg-[#101418]' : 'bg-[#F7FAFC]'}`}>
                {/* Android Status Bar */}
                <div className="h-9 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 z-30 shrink-0">
                  <span className="font-mono">07:30</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>LTE</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Active Screen Rendering */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  {currentTab === 'onboarding' && (
                    <ScreenOnboarding onFinish={() => setCurrentTab('today')} />
                  )}
                  {currentTab === 'today' && (
                    <ScreenToday
                      onGoToChat={() => setCurrentTab('chat')}
                      onGoToRoutineSettings={() => setCurrentTab('settings')}
                    />
                  )}
                  {currentTab === 'chat' && <ScreenChat />}
                  {currentTab === 'music' && <ScreenMusic />}
                  {currentTab === 'settings' && (
                    <ScreenSettings onOpenOnboarding={() => setCurrentTab('onboarding')} />
                  )}
                </div>

                {/* Bottom Navigation (Only visible outside onboarding) */}
                {currentTab !== 'onboarding' && (
                  <BottomNav
                    currentTab={currentTab}
                    onSelectTab={setCurrentTab}
                    isDark={isDark}
                  />
                )}
              </div>
            </div>

            {/* Companion Side Panel: Screen Specs & Direct Actions */}
            <div className="flex-1 max-w-xl space-y-5">
              <div className="bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#155E95] dark:text-[#8ECEFF]">
                      Pantalla Activa en Mockup
                    </span>
                    <h2 className="text-xl font-extrabold capitalize text-slate-900 dark:text-slate-100">
                      {currentTab === 'onboarding' ? 'Onboarding (8 pasos)' : currentTab === 'today' ? 'Inicio (Hoy)' : currentTab === 'chat' ? 'Conversar' : currentTab === 'music' ? 'Música Local' : 'Ajustes'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('onboarding')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Ver Onboarding
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Conformidad con Restricciones Técnicas:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <li><strong>Jetpack Compose + M3</strong>: Diseñado para teléfono vertical con Nunito Sans.</li>
                    <li><strong>Accesibilidad</strong>: Objetivos táctiles ≥ 48dp, contraste AA validado y soporte para movimiento reducido.</li>
                    <li><strong>Color Roles</strong>: Primary (#155E95), Secondary (#7654A7) en claro y oscuro dinámico.</li>
                    <li><strong>Local & Privado</strong>: Sin llamadas externas ni streaming.</li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveStudioView('tokens')}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-[#155E95] text-white font-bold text-xs hover:bg-[#124d7b] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Ver Tokens para Claude Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveStudioView('avatar')}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#7654A7]" />
                    <span>Probar Avatar Reactivo</span>
                  </button>
                </div>
              </div>

              {/* Screen Quick Selector Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'today', label: '1. Hoy (Rutina)' },
                  { id: 'chat', label: '2. Conversar' },
                  { id: 'music', label: '3. Música Local' },
                  { id: 'settings', label: '4. Ajustes' },
                  { id: 'onboarding', label: '5. Onboarding (8 pasos)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentTab(s.id as any)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      currentTab === s.id
                        ? 'bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] shadow-sm'
                        : 'bg-white dark:bg-[#12181F] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: AVATAR DESIGN LABORATORY */}
        {activeStudioView === 'avatar' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <AvatarLaboratory />
          </div>
        )}

        {/* VIEW 3: TOKENS & JETPACK COMPOSE EXPORT */}
        {activeStudioView === 'tokens' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <TokenViewer />
          </div>
        )}

        {/* VIEW 4: TRI-AI COLLABORATIVE PROTOCOL */}
        {activeStudioView === 'collaboration' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-[#12181F] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-[#155E95] dark:text-[#8ECEFF]" />
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    Protocolo de Trabajo Colaborativo (Claude + ChatGPT + Gemini)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cómo canalizar las entregas de este entorno hacia el repositorio de VEYA en GitHub.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gemini Box */}
                <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#155E95] dark:text-[#8ECEFF]">GEMINI (Aquí)</span>
                    <span className="text-[10px] bg-sky-100 dark:bg-sky-900 px-2 py-0.5 rounded-full font-bold">Diseño & UI/UX</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Genera los mockups interactivos, tokens M3 (Light/Dark), la especificación reactiva del Avatar VEYA y los componentes base.
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">Entrega: Carpeta entregas/ y rama design/*</p>
                </div>

                {/* Claude Code Box */}
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#7654A7] dark:text-[#DCB8FF]">CLAUDE CODE</span>
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full font-bold">Lead Dev Android</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Integra los tokens y snippets en Jetpack Compose, compila con Gradle y verifica en emulador sin romper Media3 ni VeyaVoiceBus.
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">Ejecución: Repositorio GitHub directo</p>
                </div>

                {/* ChatGPT Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">CHATGPT / CODEX</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full font-bold">Lógica & NLP</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Diseña y optimiza las heurísticas de memoria explícita, parser RSS de noticias, pruebas unitarias y gestión de rutinas.
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">Ejecución: Scripts, testing & prompts</p>
                </div>
              </div>

              {/* Recommended Handshake Workflow */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Paso a paso para transferir el trabajo a Claude Code:
                </h4>
                <ol className="list-decimal pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <li>Copia el archivo de tokens generado en la pestaña <strong>Tokens M3</strong> hacia <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">personal.veya.ui.theme</code>.</li>
                  <li>Claude Code actualiza <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">VeyaColor.kt</code> y verifica la compilación limpia con <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">./gradlew assembleDebug</code>.</li>
                  <li>Implementar la pantalla <strong>Hoy (Rutina Matinal)</strong> siguiendo el diseño visual y estados del mockup.</li>
                  <li>Implementar el <strong>Avatar VEYA</strong> en Compose (Canvas con las fórmulas SVG del laboratorio o Lottie).</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
