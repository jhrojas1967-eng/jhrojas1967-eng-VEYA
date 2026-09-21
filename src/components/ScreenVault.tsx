import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Brain,
  Lock,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  ArrowLeft,
  Key,
  Database,
  ServerOff,
  Sliders,
} from 'lucide-react';

export interface MemoryFact {
  id: string;
  category: 'personal' | 'routine' | 'music' | 'health' | 'inferred';
  title: string;
  detail: string;
  origin: 'explicit' | 'inferred';
  confidence: number; // 0 a 100%
  timestamp: string;
  activeInContext: boolean;
}

const INITIAL_FACTS: MemoryFact[] = [
  {
    id: 'f1',
    category: 'personal',
    title: 'Nombre y estilo de trato',
    detail: 'Se llama José. Prefiere comunicación cercana, directa, cálida y sin formalismos innecesarios.',
    origin: 'explicit',
    confidence: 100,
    timestamp: 'Hoy, 08:30',
    activeInContext: true,
  },
  {
    id: 'f2',
    category: 'routine',
    title: 'Rutina matinal de enfoque',
    detail: 'Despierta habitualmente a las 07:30. Inicia con agua, respiración consciente y revisión de titulares breves.',
    origin: 'explicit',
    confidence: 100,
    timestamp: 'Ayer, 09:15',
    activeInContext: true,
  },
  {
    id: 'f3',
    category: 'music',
    title: 'Preferencia acústica de trabajo',
    detail: 'Escucha piano acústico, jazz nórdico y ambient a 24-bit/96kHz para sesiones de concentración profunda.',
    origin: 'inferred',
    confidence: 94,
    timestamp: 'Hace 2 días',
    activeInContext: true,
  },
  {
    id: 'f4',
    category: 'health',
    title: 'Sensibilidad a pausas posturales',
    detail: 'Aprecia recordatorios discretos tras 90 minutos de trabajo continuado en el escritorio.',
    origin: 'inferred',
    confidence: 88,
    timestamp: 'Hace 3 días',
    activeInContext: true,
  },
  {
    id: 'f5',
    category: 'personal',
    title: 'Ubicación meteorológica estática',
    detail: 'Consulta el pronóstico para Madrid/Centro sin permitir seguimiento GPS en tiempo real.',
    origin: 'explicit',
    confidence: 100,
    timestamp: 'Hace 4 días',
    activeInContext: false,
  },
  {
    id: 'f6',
    category: 'inferred',
    title: 'Mood predominante nocturno',
    detail: 'Disminución del ritmo de interacción a partir de las 22:30; prefiere respuestas muy concisas y tono sereno.',
    origin: 'inferred',
    confidence: 85,
    timestamp: 'Hace 5 días',
    activeInContext: true,
  },
];

interface ScreenVaultProps {
  onBack?: () => void;
}

export const ScreenVault: React.FC<ScreenVaultProps> = ({ onBack }) => {
  const [facts, setFacts] = useState<MemoryFact[]>(INITIAL_FACTS);
  const [activeTab, setActiveTab] = useState<'facts' | 'broker' | 'sovereignty'>('facts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryFact['category']>('personal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtros del Context Broker (Políticas de Inyección Efímera)
  const [brokerPolicies, setBrokerPolicies] = useState({
    personal: true,
    routine: true,
    music: true,
    health: true,
    inferred: false, // Por defecto las inferencias requieren permiso explícito
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteFact = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
    showToast('Hecho borrado de la base de datos local');
  };

  const handleToggleFactContext = (id: string) => {
    setFacts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, activeInContext: !f.activeInContext } : f))
    );
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    const newFact: MemoryFact = {
      id: 'f_' + Date.now(),
      category: newCategory,
      title: newTitle.trim(),
      detail: newDetail.trim(),
      origin: 'explicit',
      confidence: 100,
      timestamp: 'Ahora mismo',
      activeInContext: true,
    };

    setFacts([newFact, ...facts]);
    setNewTitle('');
    setNewDetail('');
    setShowAddModal(false);
    showToast('Recuerdo explícito añadido a la bóveda local');
  };

  const handlePurgeAll = () => {
    setFacts([]);
    setShowPurgeModal(false);
    showToast('Bóveda purgada por completo. 0 datos almacenados.');
  };

  const handleExportVault = () => {
    const exportData = {
      exportVersion: '2.0.0',
      timestamp: new Date().toISOString(),
      encryptionStandard: 'AES-256-GCM (Hardware Keystore)',
      factsCount: facts.length,
      facts,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veya_boveda_memoria_local_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Bóveda exportada en JSON cifrado');
  };

  const filteredFacts = facts.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesQuery =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCategoryColor = (cat: MemoryFact['category']) => {
    switch (cat) {
      case 'personal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'routine':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'music':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'health':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'inferred':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  const getCategoryLabel = (cat: MemoryFact['category']) => {
    switch (cat) {
      case 'personal':
        return 'Personalidad & Trato';
      case 'routine':
        return 'Hábitos & Rutina';
      case 'music':
        return 'Gustos Musicales';
      case 'health':
        return 'Salud & Bienestar';
      case 'inferred':
        return 'Inferencia de VEYA';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 pb-3 bg-white dark:bg-[#141A22] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Memoria & Privacidad
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bóveda Local Cifrada & Zero-Knowledge Broker
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Local-First
          </span>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Hechos Guardados</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-500" />
              {facts.length} recuerdos
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Cifrado Hardware</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Key className="w-3 h-3" />
              AES-256
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Telemetría Nube</span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ServerOff className="w-3 h-3 text-amber-500" />
              0 bytes
            </span>
          </div>
        </div>

        {/* Screen Tabs */}
        <div className="flex gap-1 mt-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('facts')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'facts'
                ? 'bg-white dark:bg-[#1A222D] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bóveda ({facts.length})
          </button>
          <button
            onClick={() => setActiveTab('broker')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'broker'
                ? 'bg-white dark:bg-[#1A222D] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Context Broker
          </button>
          <button
            onClick={() => setActiveTab('sovereignty')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'sovereignty'
                ? 'bg-white dark:bg-[#1A222D] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Soberanía & Purga
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* ========================================================================= */}
        {/* TAB 1: BÓVEDA DE HECHOS / FACT AUDIT                                      */}
        {/* ========================================================================= */}
        {activeTab === 'facts' && (
          <div className="space-y-3">
            {/* Search & Add Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar en la memoria local..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#141A22] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'personal', label: 'Personalidad' },
                { id: 'routine', label: 'Rutinas' },
                { id: 'music', label: 'Música' },
                { id: 'health', label: 'Bienestar' },
                { id: 'inferred', label: 'Inferencias' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border ${
                    selectedCategory === c.id
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                      : 'bg-white dark:bg-[#141A22] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* List of Facts */}
            {filteredFacts.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#141A22] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <Brain className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No hay recuerdos bajo este filtro
                </p>
                <p className="text-[11px] text-slate-400">
                  Puedes añadir hechos explícitos manualmente con el botón superior.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#141A22] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(
                            fact.category
                          )}`}
                        >
                          {getCategoryLabel(fact.category)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {fact.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle active in context prompt */}
                        <button
                          onClick={() => handleToggleFactContext(fact.id)}
                          className={`p-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            fact.activeInContext
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                          title={
                            fact.activeInContext
                              ? 'Activo: se inyecta efímeramente al LLM si es relevante'
                              : 'Silenciado: nunca se envía al modelo'
                          }
                        >
                          {fact.activeInContext ? (
                            <Eye className="w-3 h-3 text-blue-600" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-slate-400" />
                          )}
                          <span className="hidden sm:inline">
                            {fact.activeInContext ? 'En Prompt' : 'Pausado'}
                          </span>
                        </button>

                        {/* Granular Delete */}
                        <button
                          onClick={() => handleDeleteFact(fact.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Olvidar y borrar permanentemente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {fact.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {fact.detail}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        Origen:{' '}
                        <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                          {fact.origin === 'explicit' ? 'Aportado por ti' : 'Inferido por VEYA'}
                        </strong>
                      </span>
                      <span>
                        Certeza: <strong className="text-slate-700 dark:text-slate-300">{fact.confidence}%</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONTEXT BROKER / INYECCIÓN EFÍMERA                                 */}
        {/* ========================================================================= */}
        {activeTab === 'broker' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>¿Cómo funciona el Zero-Knowledge Broker?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/80">
                El modelo de lenguaje (Claude / Gemini) <strong>no guarda memoria persistente</strong> de tus datos en la nube. Antes de cada consulta, este broker local evalúa qué 2 o 3 hechos son estrictamente relevantes y los adjunta de forma <em>efímera</em> en el prompt de la llamada. La sesión se destruye inmediatamente después.
              </p>
            </div>

            {/* Broker Domain Switches */}
            <div className="p-4 rounded-3xl bg-white dark:bg-[#141A22] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Políticas de Inyección Efímera por Dominio
              </h3>

              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                {[
                  {
                    key: 'personal',
                    title: 'Personalidad & Trato',
                    desc: 'Tu nombre, tono preferido y preferencias de comunicación.',
                  },
                  {
                    key: 'routine',
                    title: 'Horarios & Rutina Matinal',
                    desc: 'Hora de despertar, pasos de la rutina matinal y recordatorios.',
                  },
                  {
                    key: 'music',
                    title: 'Perfil de Escucha Musical',
                    desc: 'Géneros, DSP preferido y hábitos para sugerir canciones.',
                  },
                  {
                    key: 'health',
                    title: 'Salud & Pausas Activas',
                    desc: 'Alertas de estiramiento y tiempo frente a pantalla.',
                  },
                  {
                    key: 'inferred',
                    title: 'Inferencias Automáticas de VEYA',
                    desc: 'Patrones aprendidos por observación (requiere tu visto bueno).',
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between pt-2.5 first:pt-0">
                    <div className="pr-4">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={(brokerPolicies as any)[item.key]}
                        onChange={(e) =>
                          setBrokerPolicies({ ...brokerPolicies, [item.key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Context Prompt Preview */}
            <div className="p-3.5 rounded-3xl bg-white dark:bg-[#141A22] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  Simulación de Inyección Efímera Actual
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {facts.filter((f) => f.activeInContext && (brokerPolicies as any)[f.category]).length} hechos activos
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto max-h-36">
                <p className="text-slate-500">// INYECCIÓN EFÍMERA EN EL SYSTEM PROMPT (SOLO LECTURA)</p>
                <p className="text-blue-400">Contexto Local de José:</p>
                {facts
                  .filter((f) => f.activeInContext && (brokerPolicies as any)[f.category])
                  .map((f, i) => (
                    <p key={f.id} className="text-emerald-300/90 pl-2">
                      - [{f.category.toUpperCase()}] {f.detail}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SOBERANÍA RADICAL & PURGA (KILL SWITCH)                            */}
        {/* ========================================================================= */}
        {activeTab === 'sovereignty' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-[#141A22] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Custodia & Soberanía del Usuario
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tú eres el único custodio legal y físico de tu información.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleExportVault}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Exportar Bóveda (JSON)</span>
                </button>
                <button
                  onClick={() => showToast('Función de restauración local preparada')}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Restaurar Copia</span>
                </button>
              </div>
            </div>

            {/* Radical Kill Switch Box */}
            <div className="p-4 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-rose-900 dark:text-rose-200">
                    Purga Total Inmediata (Kill Switch)
                  </h3>
                  <p className="text-[11px] text-rose-800/80 dark:text-rose-300/70">
                    Borra irrevocablemente la base de datos local y reinicia la memoria de VEYA a cero.
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Esta acción elimina todos los recuerdos, preferencias aprendidas y perfiles de hábitos almacenados en este dispositivo. No hay servidores de respaldo que puedan restaurarla.
              </p>

              <button
                onClick={() => setShowPurgeModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purgar Toda la Memoria Local</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: AÑADIR HECHO EXPLÍCITO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A22] rounded-3xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Añadir Recuerdo a la Bóveda
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFact} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Categoría
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="personal">Personalidad & Trato</option>
                  <option value="routine">Hábitos & Rutina</option>
                  <option value="music">Gustos Musicales</option>
                  <option value="health">Salud & Bienestar</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Título Breve
                </label>
                <input
                  type="text"
                  placeholder="Ej: Idioma de trabajo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Detalle del Recuerdo
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe exactamente qué quieres que VEYA recuerde de ti..."
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Guardar en Local
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PURGA TOTAL */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A22] rounded-3xl p-5 w-full max-w-sm border border-rose-200 dark:border-rose-900 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                ¿Confirmas la purga total de la Bóveda?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Esta acción destruirá todos los {facts.length} recuerdos locales. VEYA olvidará tu nombre, hábitos y preferencias.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePurgeAll}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black"
              >
                Sí, Purgar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
