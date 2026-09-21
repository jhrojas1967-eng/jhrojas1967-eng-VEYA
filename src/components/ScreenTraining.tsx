import React, { useState } from 'react';
import {
  Cpu,
  ArrowLeft,
  Plus,
  Play,
  Pause,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Target,
  Clock,
  Trash2,
  FileCode,
  Shield,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface ScreenTrainingProps {
  onBack: () => void;
}

export interface TrainingProfile {
  id: string;
  name: string;
  category: 'routine' | 'work' | 'wellness' | 'night';
  description: string;
  trigger: string;
  adherenceRate: number; // 0..100
  isActive: boolean;
  habitsTracked: string[];
}

const INITIAL_PROFILES: TrainingProfile[] = [
  {
    id: 'p1',
    name: 'Despertar & Rutina Matinal',
    category: 'routine',
    description: 'Acompasamiento del despertar con música gradual, hidratación y titulares de síntesis breve.',
    trigger: 'Diario · 07:30 a 08:30',
    adherenceRate: 94,
    isActive: true,
    habitsTracked: ['Respiración consciente', 'Vaso de agua', 'Revisión sin estrés'],
  },
  {
    id: 'p2',
    name: 'Enfoque Profundo (Deep Work)',
    category: 'work',
    description: 'Bloqueo de notificaciones superfluas, audio DSP ambient a 24-bit y pausas de 5 minutos.',
    trigger: 'Bajo demanda o al iniciar sesión de concentración',
    adherenceRate: 88,
    isActive: true,
    habitsTracked: ['Bloque de 50 minutos', 'Postura erguida', 'Cero multitasking'],
  },
  {
    id: 'p3',
    name: 'Pausas Activas & Bienestar',
    category: 'wellness',
    description: 'Recordatorio discreto de estiramiento y relajación ocular tras 90 min de pantalla continuada.',
    trigger: 'Tras 90 min continuos frente al móvil',
    adherenceRate: 76,
    isActive: true,
    habitsTracked: ['Estiramiento de cuello', 'Mirada al horizonte (20-20-20)'],
  },
  {
    id: 'p4',
    name: 'Desconexión Nocturna Serena',
    category: 'night',
    description: 'Disminución del ritmo verbal de VEYA a partir de las 22:30. Tono sereno y pantalla atenuada.',
    trigger: 'Diario · 22:30 a 07:00',
    adherenceRate: 91,
    isActive: false,
    habitsTracked: ['Sin consultas densas', 'Modo nocturno visual', 'Música de piano'],
  },
];

export const ScreenTraining: React.FC<ScreenTrainingProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<TrainingProfile[]>(INITIAL_PROFILES);
  const [continuousLearning, setContinuousLearning] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New profile form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newCategory, setNewCategory] = useState<TrainingProfile['category']>('routine');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    showToast('Estado del perfil actualizado');
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    showToast('Perfil de entrenamiento eliminado');
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProfile: TrainingProfile = {
      id: 'p_' + Date.now(),
      name: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Perfil personalizado de adaptación de hábitos.',
      trigger: newTrigger.trim() || 'Activación manual',
      adherenceRate: 100,
      isActive: true,
      habitsTracked: ['Hábito 1', 'Objetivo de constancia'],
    };

    setProfiles([newProfile, ...profiles]);
    setNewTitle('');
    setNewDesc('');
    setNewTrigger('');
    setShowAddModal(false);
    showToast('Nuevo perfil ENTRENA activado');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0F141C] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification */}
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
            <div className="w-9 h-9 rounded-2xl bg-[#006A67] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                ENTRENA (Perfiles)
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Aprendizaje activo y adaptación de hábitos en local
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver especificación Compose M3"
            >
              <FileCode className="w-4 h-4 text-[#006A67] dark:text-[#80D5D2]" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#006A67] text-white text-xs font-bold shadow-xs hover:bg-[#00524F] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* SECTION 1: ON-DEVICE LEARNING ENGINE STATUS */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#006A67] dark:text-[#80D5D2] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Aprendizaje Federado en Dispositivo
                </h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  VEYA observa tus patrones de rutina localmente para calibrar recordatorios sin enviar registros a servidores externos.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
              <input
                type="checkbox"
                checked={continuousLearning}
                onChange={(e) => setContinuousLearning(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006A67]"></div>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold">
              <Shield className="w-3 h-3 text-emerald-500" />
              100% Procesamiento Local
            </span>
            <span className="font-mono">SQLite Vector Database</span>
          </div>
        </div>

        {/* SECTION 2: PROFILES LIST */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Perfiles Activos de Adaptación ({profiles.length})
            </span>
            <span className="text-[10px] text-slate-500">Pulsa para activar / pausar</span>
          </div>

          <div className="space-y-2.5">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleToggleProfile(profile.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  profile.isActive
                    ? 'bg-white dark:bg-[#141A24] border-teal-200 dark:border-teal-900/60 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {profile.name}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        profile.isActive
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {profile.isActive ? 'Activo' : 'En pausa'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {profile.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDeleteProfile(profile.id, e)}
                    className="p-1 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                    title="Eliminar perfil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Trigger and adherence */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#006A67]" />
                    {profile.trigger}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    Adherencia: {profile.adherenceRate}%
                  </span>
                </div>

                {/* Habits pills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.habitsTracked.map((habit, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      • {habit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: NUEVO PERFIL ENTRENA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#006A67]" />
                Crear Perfil de Aprendizaje
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Categoría
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="routine">Rutina Diaria</option>
                  <option value="work">Trabajo y Enfoque</option>
                  <option value="wellness">Salud y Pausas</option>
                  <option value="night">Desconexión Nocturna</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Nombre del Perfil
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sesión de Lectura Profunda"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Disparador Horario / Contexto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lunes a Viernes a las 18:00"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Descripción del Comportamiento de VEYA
                </label>
                <textarea
                  rows={2}
                  placeholder="Cómo debe adaptarse el asistente (tono, música, límites)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#006A67] hover:bg-[#00524F] text-white text-xs font-bold shadow-xs"
                >
                  Activar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: JETPACK COMPOSE M3 CODE SPECIFICATION */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    ENTRENA: Jetpack Compose Specs
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Room DAO + State Machine para Perfiles de Aprendizaje
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed space-y-2">
              <p className="text-slate-500">// VeyaTrainingProfilesScreen.kt</p>
              <p className="text-teal-400">@Composable</p>
              <p className="text-yellow-300">fun TrainingProfilesScreen(</p>
              <p className="text-slate-300 pl-4">viewModel: TrainingViewModel = viewModel(),</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// 1. Switch M3 para Aprendizaje Continuo On-Device</p>
              <p className="text-slate-300 pl-4">Switch(checked = state.isFederatedLearningEnabled, onCheckedChange = &#123; ... &#125;)</p>
              <br />
              <p className="text-slate-400 pl-4">// 2. LazyColumn de Perfiles de Aprendizaje</p>
              <p className="text-slate-300 pl-4">LazyColumn &#123;</p>
              <p className="text-slate-300 pl-8">items(state.profiles) &#123; profile -&gt;</p>
              <p className="text-slate-300 pl-12">TrainingProfileCard(profile = profile, onToggle = &#123; ... &#125;)</p>
              <p className="text-slate-300 pl-8">&#125;</p>
              <p className="text-slate-300 pl-4">&#125;</p>
              <p className="text-yellow-300">&#125;</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
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
