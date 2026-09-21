import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Lock,
  Unlock,
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
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileCode,
  Info,
  Check,
  X,
  Fingerprint,
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
  sha256Hash: string;
  embeddingVectorDims: number;
}

export type PurgeScheduleOption = 'never' | '7d' | '30d' | '90d' | 'session';

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
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    embeddingVectorDims: 384,
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
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    embeddingVectorDims: 384,
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
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    embeddingVectorDims: 384,
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
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    embeddingVectorDims: 384,
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
    sha256Hash: 'cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860',
    embeddingVectorDims: 384,
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
    sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    embeddingVectorDims: 384,
  },
];

interface ScreenVaultProps {
  onBack?: () => void;
}

export const ScreenVault: React.FC<ScreenVaultProps> = ({ onBack }) => {
  const [facts, setFacts] = useState<MemoryFact[]>(INITIAL_FACTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFactId, setExpandedFactId] = useState<string | null>(null);

  // Material 3 Security Controls State
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [showEncryptionWarningModal, setShowEncryptionWarningModal] = useState<boolean>(false);
  const [purgeSchedule, setPurgeSchedule] = useState<PurgeScheduleOption>('30d');
  const [purgeInferredOnly, setPurgeInferredOnly] = useState<boolean>(false);

  // Modals & Sheets
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Fact Form
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryFact['category']>('personal');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Toggle Hardware Encryption
  const handleToggleEncryption = () => {
    if (isEncrypted) {
      setShowEncryptionWarningModal(true);
    } else {
      setIsEncrypted(true);
      showToast('Cifrado de Hardware AES-256 activado');
    }
  };

  const confirmDisableEncryption = () => {
    setIsEncrypted(false);
    setShowEncryptionWarningModal(false);
    showToast('Cifrado desactivado (Almacenamiento en texto plano)');
  };

  // Delete Individual Fact
  const handleDeleteFact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacts((prev) => prev.filter((f) => f.id !== id));
    showToast('Recuerdo eliminado de la base de datos local');
  };

  // Toggle Context Prompt Injection
  const handleToggleFactContext = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, activeInContext: !f.activeInContext } : f))
    );
  };

  // Add Manual Fact
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
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      embeddingVectorDims: 384,
    };

    setFacts([newFact, ...facts]);
    setNewTitle('');
    setNewDetail('');
    setShowAddModal(false);
    showToast('Nuevo recuerdo guardado y cifrado en local');
  };

  // Sovereign Kill Switch Purge
  const handlePurgeAll = () => {
    setFacts([]);
    setShowPurgeModal(false);
    showToast('Bóveda purgada por completo. 0 datos almacenados.');
  };

  // Export JSON Vault
  const handleExportVault = () => {
    const exportData = {
      app: 'VEYA Personal Assistant',
      exportVersion: '2.4.0',
      timestamp: new Date().toISOString(),
      encryption: isEncrypted ? 'AES-256-GCM (AndroidKeyStore StrongBox)' : 'None (Plaintext)',
      scheduledPurge: purgeSchedule,
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
    showToast('Bóveda exportada en JSON local');
  };

  // Filtered facts
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
        return 'bg-[#D7EEFF] text-[#001D33] dark:bg-[#004A7B]/40 dark:text-[#D7EEFF] border-[#72B5E8]/40';
      case 'routine':
        return 'bg-[#FFE9D5] text-[#341100] dark:bg-[#6D3900]/40 dark:text-[#FFDCC2] border-[#FDB482]/40';
      case 'music':
        return 'bg-[#EDE7F6] text-[#280D4F] dark:bg-[#4E347A]/40 dark:text-[#EADBFF] border-[#C8B3E6]/40';
      case 'health':
        return 'bg-[#D5F5E3] text-[#043319] dark:bg-[#0E5C32]/40 dark:text-[#B8ECC8] border-[#81D99F]/40';
      case 'inferred':
        return 'bg-[#FFDFDF] text-[#410006] dark:bg-[#850D19]/40 dark:text-[#FFDAD9] border-[#FFB3B4]/40';
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

  const getNextPurgeText = (schedule: PurgeScheduleOption) => {
    switch (schedule) {
      case 'never':
        return 'Purga programada desactivada. Solo se eliminarán recuerdos manualmente.';
      case '7d':
        return 'Próxima purga: en 6 días (27 de Septiembre a las 04:00 AM).';
      case '30d':
        return 'Próxima purga: en 23 días (14 de Octubre a las 04:00 AM).';
      case '90d':
        return 'Próxima purga: en 83 días (13 de Diciembre a las 04:00 AM).';
      case 'session':
        return 'Próxima purga: automática al cerrar la app o tras 15 min de inactividad.';
    }
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

      {/* Material 3 Top App Bar */}
      <div className="px-4 py-3 bg-white dark:bg-[#141A24] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-2xl bg-[#155E95] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  Memoria & Privacidad
                </h1>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                  Local-First
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bóveda Local Cifrada M3 & Zero-Knowledge Broker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver especificación Compose M3"
            >
              <FileCode className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
            </button>
            <button
              onClick={handleExportVault}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Exportar Bóveda JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local Architecture Badges */}
        <div className="grid grid-cols-3 gap-2 mt-2.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 text-[11px]">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Recuerdos</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#155E95]" />
              {facts.length} guardados
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Seguridad</span>
            <span className={`font-extrabold flex items-center gap-1 ${isEncrypted ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
              <Key className="w-3 h-3" />
              {isEncrypted ? 'AES-256' : 'Sin Cifrado'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nube / Server</span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ServerOff className="w-3 h-3 text-slate-400" />
              0 KB (Aislado)
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">

        {/* ========================================================================= */}
        {/* M3 CARD 1: TOGGLE DE ESTADO DE CIFRADO DE HARDWARE (M3 SWITCH)            */}
        {/* ========================================================================= */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isEncrypted
            ? 'bg-white dark:bg-[#141A24] border-slate-200/80 dark:border-slate-800 shadow-xs'
            : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isEncrypted
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
              }`}>
                {isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Cifrado de Hardware AES-256-GCM
                  </h2>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isEncrypted
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300/40'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40'
                  }`}>
                    {isEncrypted ? 'Protegido' : 'Vulnerable'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEncrypted
                    ? 'Clave maestra custodiada por Android Keystore (StrongBox TEE). Base de datos SQLCipher sin fugas en memoria volátil.'
                    : 'Atención: Los datos se guardan en SQLite en texto plano. Desaconsejado salvo propósitos de depuración.'}
                </p>
              </div>
            </div>

            {/* Material 3 Switch Component (52dp x 32dp anatomy) */}
            <div className="pt-0.5 shrink-0">
              <button
                type="button"
                role="switch"
                aria-checked={isEncrypted}
                onClick={handleToggleEncryption}
                className={`relative w-[52px] h-[32px] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#155E95]/40 ${
                  isEncrypted
                    ? 'bg-[#155E95] dark:bg-[#8ECEFF]'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-[4px] left-[4px] w-[24px] h-[24px] rounded-full transition-transform duration-200 flex items-center justify-center shadow-xs ${
                    isEncrypted
                      ? 'translate-x-[20px] bg-white dark:bg-[#003355]'
                      : 'translate-x-0 bg-white dark:bg-slate-400'
                  }`}
                >
                  {isEncrypted ? (
                    <Check className="w-3.5 h-3.5 text-[#155E95] dark:text-[#8ECEFF] stroke-[3]" />
                  ) : (
                    <X className="w-3 h-3 text-slate-500 dark:text-slate-800 stroke-[3]" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Detailed Hardware Cryptographic Spec Strip */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3 text-[#155E95] dark:text-[#8ECEFF]" />
              <span>Alias: <code>veya_vault_master_key</code></span>
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg">
              StrongBox TEE
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* M3 CARD 2: SELECTOR DE PURGA DE DATOS PROGRAMADA (M3 RADIO / SEGMENTED)   */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Purga de Datos Programada
                </h2>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                  Auto-limpieza
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Configura la caducidad y borrado definitivo de los recuerdos en este dispositivo.
              </p>
            </div>
          </div>

          {/* M3 Segmented Button / Chips for Purge Frequency */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl text-[11px] font-bold">
            {[
              { id: 'never', label: 'Manual' },
              { id: '7d', label: '7 días' },
              { id: '30d', label: '30 días' },
              { id: '90d', label: '90 días' },
              { id: 'session', label: 'Sesión' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setPurgeSchedule(opt.id as PurgeScheduleOption);
                  showToast(`Frecuencia de purga: ${opt.label}`);
                }}
                className={`py-2 px-1.5 rounded-xl transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                  purgeSchedule === opt.id
                    ? 'bg-white dark:bg-[#1A222D] text-[#155E95] dark:text-[#8ECEFF] shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Next Scheduled Purge Banner */}
          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-start gap-2.5 text-xs text-indigo-950 dark:text-indigo-200">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <span className="font-bold block">
                {purgeSchedule === 'never' ? 'Modo Soberano Manual Activo' : 'Ciclo de Retención Efímera'}
              </span>
              <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                {getNextPurgeText(purgeSchedule)}
              </p>
            </div>
          </div>

          {/* Inferred vs All Facts Filter Toggle */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="pr-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Preservar recuerdos explícitos
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                La auto-purga solo eliminará las inferencias automáticas de la IA, sin tocar los recuerdos que tú agregaste.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={purgeInferredOnly}
                onChange={(e) => setPurgeInferredOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#155E95]"></div>
            </label>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* M3 SECTION 3: LISTA INTERACTIVA DE RECUERDOS LOCALES                      */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Recuerdos Locales Auditables
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                La IA consulta estos hechos en local antes de responder. Puedes editarlos o borrarlos.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>

          {/* M3 Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en la memoria local (por palabra, tema o detalle)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155E95]/30 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* M3 Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
            {[
              { id: 'all', label: `Todos (${facts.length})` },
              { id: 'personal', label: 'Personalidad' },
              { id: 'routine', label: 'Rutinas' },
              { id: 'music', label: 'Música' },
              { id: 'health', label: 'Bienestar' },
              { id: 'inferred', label: 'Inferencias' },
            ].map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#155E95] text-white border-[#155E95] dark:bg-[#8ECEFF] dark:text-[#003355] dark:border-[#8ECEFF] shadow-xs'
                      : 'bg-white dark:bg-[#141A24] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* List of Interactive Memory Cards */}
          {filteredFacts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#141A24] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <Brain className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No hay recuerdos registrados con estos criterios
              </p>
              <p className="text-[11px] text-slate-400">
                Puedes añadir un nuevo hecho explícito con el botón superior.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredFacts.map((fact) => {
                const isExpanded = expandedFactId === fact.id;
                return (
                  <div
                    key={fact.id}
                    onClick={() => setExpandedFactId(isExpanded ? null : fact.id)}
                    className="p-3.5 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                  >
                    {/* Header Row: Category Badge, Timestamp, Action Buttons */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                            fact.category
                          )}`}
                        >
                          {getCategoryLabel(fact.category)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {fact.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Context Injection Toggle: Eye / EyeOff */}
                        <button
                          onClick={(e) => handleToggleFactContext(fact.id, e)}
                          className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            fact.activeInContext
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800/80 border border-transparent'
                          }`}
                          title={
                            fact.activeInContext
                              ? 'En Prompt: VEYA lo consulta antes de responder'
                              : 'Aislado: VEYA no lo tiene en cuenta'
                          }
                        >
                          {fact.activeInContext ? (
                            <>
                              <Eye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>En Prompt</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>Aislado</span>
                            </>
                          )}
                        </button>

                        {/* Granular Delete Button */}
                        <button
                          onClick={(e) => handleDeleteFact(fact.id, e)}
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Olvidar y borrar permanentemente de la base de datos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Fact Content */}
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {fact.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {fact.detail}
                      </p>
                    </div>

                    {/* Footer Row: Origin & Confidence */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        Origen:{' '}
                        <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                          {fact.origin === 'explicit' ? 'Aportado por ti' : 'Inferido por VEYA'}
                        </strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <span>
                          Certeza: <strong className="text-slate-700 dark:text-slate-300">{fact.confidence}%</strong>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Technical Cryptographic Inspection */}
                    {isExpanded && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="font-bold uppercase tracking-wider text-[9px]">Inspección Criptográfica Local</span>
                          <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">SQLite Row ID: {fact.id}</span>
                        </div>
                        <p className="truncate">
                          <span className="text-slate-400">SHA-256: </span>
                          <span className="text-[#155E95] dark:text-[#8ECEFF]">{fact.sha256Hash}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Embedding Vector: </span>
                          <span>{fact.embeddingVectorDims}-dim float32 (Indexado en sqlite-vec local)</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Almacenamiento: </span>
                          <span>Partición privada de la app · Android Keystore AES-256-GCM</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* M3 SECTION 4: PURGA INMEDIATA SOBERANA (KILL SWITCH)                      */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-rose-900 dark:text-rose-200">
                Purga Inmediata Soberana (Kill Switch)
              </h3>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/70">
                Borrado irreversible de todos los recuerdos almacenados en este teléfono.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Esta acción destruye las claves criptográficas locales y limpia la base de datos SQLCipher. La IA quedará reseteada a estado inicial sin posibilidad de recuperación.
          </p>

          <button
            onClick={() => setShowPurgeModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purgar Toda la Memoria Local Ahora</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: AÑADIR RECUERDO EXPLÍCITO                                          */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Añadir Recuerdo a la Bóveda
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFact} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Categoría M3
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
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
                  placeholder="Ej: Idioma de trabajo / Café preferido"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Detalle del Recuerdo
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe qué deseas que VEYA recuerde de ti de forma permanente y privada..."
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
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
                  className="flex-1 py-2.5 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold shadow-xs"
                >
                  Guardar y Cifrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADVERTENCIA AL DESACTIVAR CIFRADO                                   */}
      {/* ========================================================================= */}
      {showEncryptionWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-amber-300 dark:border-amber-800 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                ¿Desactivar el Cifrado de Hardware?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Si desactivas el cifrado, la base de datos local SQLite se almacenará en texto plano en el almacenamiento del dispositivo. Otras apps con permisos de depuración podrían leer tus recuerdos.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEncryptionWarningModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Mantener Cifrado
              </button>
              <button
                type="button"
                onClick={confirmDisableEncryption}
                className="flex-1 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PURGA TOTAL SOLEDAD                                                */}
      {/* ========================================================================= */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-rose-300 dark:border-rose-900 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                ¿Confirmas la purga total de la Bóveda?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Esta acción destruirá todos los <strong>{facts.length} recuerdos locales</strong>. VEYA olvidará tu nombre, estilo de trato y hábitos.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-[10px] text-rose-900 dark:text-rose-200 text-center font-bold">
              Confirmación de custodia local requerida
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePurgeAll}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs"
              >
                Sí, Purgar Todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: JETPACK COMPOSE M3 CODE SPECIFICATION                              */}
      {/* ========================================================================= */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Especificación Material 3 en Jetpack Compose
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Estructura técnica para implementar en Android Studio con Claude Code
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
              <p className="text-slate-500">// VeyaMemoryAndPrivacyScreen.kt</p>
              <p className="text-blue-400">@Composable</p>
              <p className="text-yellow-300">fun MemoryAndPrivacyScreen(</p>
              <p className="text-slate-300 pl-4">viewModel: MemoryVaultViewModel = viewModel(),</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// 1. M3 Switch para Cifrado de Hardware Keystore</p>
              <p className="text-slate-300 pl-4">Switch(</p>
              <p className="text-slate-300 pl-8">checked = uiState.isHardwareEncrypted,</p>
              <p className="text-slate-300 pl-8">onCheckedChange = &#123; viewModel.toggleEncryption(it) &#125;,</p>
              <p className="text-slate-300 pl-8">thumbContent = &#123; if (uiState.isHardwareEncrypted) Icon(Icons.Default.Check) &#125;</p>
              <p className="text-slate-300 pl-4">)</p>
              <br />
              <p className="text-slate-400 pl-4">// 2. M3 SingleChoiceSegmentedButtonRow para Purga Programada</p>
              <p className="text-slate-300 pl-4">SingleChoiceSegmentedButtonRow &#123;</p>
              <p className="text-slate-300 pl-8">SegmentedButton(selected = uiState.purgeInterval == NEVER, ...) &#123; Text("Manual") &#125;</p>
              <p className="text-slate-300 pl-8">SegmentedButton(selected = uiState.purgeInterval == DAYS_7, ...) &#123; Text("7d") &#125;</p>
              <p className="text-slate-300 pl-8">SegmentedButton(selected = uiState.purgeInterval == DAYS_30, ...) &#123; Text("30d") &#125;</p>
              <p className="text-slate-300 pl-4">&#125;</p>
              <br />
              <p className="text-slate-400 pl-4">// 3. Lista LazyColumn con OutlinedCard de Recuerdos Locales</p>
              <p className="text-slate-300 pl-4">LazyColumn &#123;</p>
              <p className="text-slate-300 pl-8">items(uiState.memoryFacts) &#123; fact -&gt;</p>
              <p className="text-slate-300 pl-12">MemoryFactCard(fact = fact, onTogglePrompt = &#123; ... &#125;, onDelete = &#123; ... &#125;)</p>
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
