import React, { useState } from 'react';
import {
  User,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  FileCode,
  Shield,
  Heart,
  MessageSquare,
  Sliders,
} from 'lucide-react';

interface ScreenPartnerProps {
  onBack: () => void;
  onOpenOnboarding: () => void;
}

export const ScreenPartner: React.FC<ScreenPartnerProps> = ({
  onBack,
  onOpenOnboarding,
}) => {
  const [userName, setUserName] = useState('José');
  const [assistantName, setAssistantName] = useState('VEYA');
  const [pronounTreatment, setPronounTreatment] = useState<'tu' | 'usted'>('tu');
  const [companionRole, setCompanionRole] = useState<'friend' | 'mentor' | 'functional'>('friend');
  const [detectFatigue, setDetectFatigue] = useState(true);
  const [nonInvasiveMode, setNonInvasiveMode] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0F141C] overflow-hidden font-['Nunito_Sans']">
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 text-xs font-bold shadow-lg flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar */}
      <div className="px-4 py-3 bg-white dark:bg-[#141A24] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title="Volver a Ajustes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#155E95] text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Tu Compañero VEYA
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Perfil de usuario, identidad y vínculo de confianza
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver especificación Compose M3"
            >
              <FileCode className="w-4 h-4 text-[#155E95] dark:text-[#9ECAFF]" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* IDENTIDAD USUARIO */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Tu Identidad
          </h2>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              ¿Cómo debe llamarte VEYA?
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => showToast('Nombre de usuario actualizado')}
              className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Estilo de Trato
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPronounTreatment('tu');
                  showToast('Trato cercano configurado: Tú');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  pronounTreatment === 'tu'
                    ? 'border-[#155E95] bg-blue-50/60 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-xs font-black block text-slate-900 dark:text-slate-100">
                  Tú (Cercano)
                </span>
                <span className="text-[10px] text-slate-400">
                  Trato informal, empático y directo.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPronounTreatment('usted');
                  showToast('Trato formal configurado: Usted');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  pronounTreatment === 'usted'
                    ? 'border-[#155E95] bg-blue-50/60 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-xs font-black block text-slate-900 dark:text-slate-100">
                  Usted (Formal)
                </span>
                <span className="text-[10px] text-slate-400">
                  Trato respetuoso, sobrio y reservado.
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* IDENTIDAD ASISTENTE */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Identidad de VEYA
          </h2>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Nombre o Apodo de la IA
            </label>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              onBlur={() => showToast('Nombre de VEYA actualizado')}
              className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">
              Rol Principal Percibido
            </label>
            <div className="space-y-2">
              {[
                { id: 'friend', title: 'Compañero de Rutina y Enfoque', desc: 'Equilibrio entre amabilidad y rigor.' },
                { id: 'mentor', title: 'Mentor de Bienestar & Hábitos', desc: 'Prioriza pausas y salud mental.' },
                { id: 'functional', title: 'Asistente Funcional & Conciso', desc: 'Respuestas directas sin rodeos.' },
              ].map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setCompanionRole(role.id as any);
                    showToast(`Rol seleccionado: ${role.title}`);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    companionRole === role.id
                      ? 'border-[#155E95] bg-blue-50/60 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{role.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LÍMITES Y SUTILEZA */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Límites y Discreción
          </h2>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Modo no invasivo
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Silencio absoluto si el móvil está en No Molestar o en llamada.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={nonInvasiveMode}
                onChange={(e) => setNonInvasiveMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#155E95]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Detección local de cansancio
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Sugiere pausas si detecta fatiga cognitiva tras varias horas.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={detectFatigue}
                onChange={(e) => setDetectFatigue(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#155E95]"></div>
            </label>
          </div>
        </div>

        {/* REINICIAR ONBOARDING */}
        <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Sparkles className="w-5 h-5 text-[#7654A7] mx-auto" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            ¿Deseas reiniciar la experiencia inicial?
          </h4>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            Puedes repetir el recorrido interactivo de 4 pasos para calibrar tu avatar y música.
          </p>
          <button
            onClick={onOpenOnboarding}
            className="mt-1 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
          >
            Iniciar Asistente de Configuración
          </button>
        </div>
      </div>

      {/* MODAL: JETPACK COMPOSE CODE */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Tu Compañero: Jetpack Compose Specs
              </h3>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed space-y-2">
              <p className="text-slate-500">// VeyaPartnerProfileScreen.kt</p>
              <p className="text-blue-400">@Composable</p>
              <p className="text-yellow-300">fun PartnerProfileScreen(onNavigateBack: () -&gt; Unit) &#123;</p>
              <p className="text-slate-400 pl-4">// M3 OutlinedTextField para Nombre</p>
              <p className="text-slate-300 pl-4">OutlinedTextField(value = state.userName, onValueChange = &#123; ... &#125;)</p>
              <p className="text-slate-300 pl-4">PronounSegmentedRow(selected = state.pronoun, onSelect = &#123; ... &#125;)</p>
              <p className="text-slate-300 pl-4">RoleCardSelector(selectedRole = state.role, onSelect = &#123; ... &#125;)</p>
              <p className="text-yellow-300">&#125;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
