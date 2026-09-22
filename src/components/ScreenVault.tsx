import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Lock,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Search,
  ArrowLeft,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileCode,
  Check,
  User,
  UserCheck,
  Cpu,
  Layers,
  HelpCircle,
  RotateCcw,
  Upload,
  Download,
  Briefcase,
  Sliders,
  Edit3,
  CheckCheck,
} from 'lucide-react';
import {
  MemoriaFact,
  MemoryCategory,
  MemoryOrigin,
  PurgeScheduleOption,
  StructuredVaultStorage,
} from '../types';

export type { MemoriaFact, PurgeScheduleOption };
export type MemoryFact = MemoriaFact;

const VAULT_STORAGE_KEY = 'veya_local_vault_facts_v2';

const INITIAL_FACTS: MemoriaFact[] = [
  {
    id: 'f1',
    category: 'personal',
    title: 'Nombre y estilo de trato',
    detail: 'Se llama José. Prefiere comunicación cercana, directa, cálida y sin formalismos innecesarios.',
    origin: 'explicit',
    timestamp: 'Hoy, 08:30',
    activeInContext: true,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    embeddingVectorDims: 384,
  },
  {
    id: 'f_work1',
    category: 'work',
    title: 'Arquitectura Local-First y Stacks',
    detail: 'Especialista en Kotlin, Jetpack Compose, TypeScript y bases de datos seguras SQLCipher en dispositivo.',
    origin: 'explicit',
    timestamp: 'Ayer, 16:45',
    activeInContext: true,
    sha256Hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    embeddingVectorDims: 384,
  },
  {
    id: 'f_pref1',
    category: 'preferences',
    title: 'Modo visual de interfaz y contraste',
    detail: 'Prioriza modo oscuro con alto contraste, bordes definidos M3 y cero animaciones superfluas o distractivas.',
    origin: 'explicit',
    timestamp: null, // Caso de prueba obligatorio: fecha nula (null ≠ 'Hoy')
    activeInContext: true,
    sha256Hash: 'c4ca4238a0b923820dcc509a6f75849b28489d81d6006e87f174e92eb0e5210e',
    embeddingVectorDims: 384,
  },
  {
    id: 'f2',
    category: 'routine',
    title: 'Rutina matinal de enfoque',
    detail: 'Despierta habitualmente a las 07:30. Inicia con agua, respiración consciente y revisión de titulares breves.',
    origin: 'explicit',
    timestamp: '18 de Septiembre',
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
    timestamp: null, // Caso de prueba obligatorio: fecha nula (null ≠ 'Hoy')
    activeInContext: false,
    sha256Hash: 'cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860',
    embeddingVectorDims: 384,
  },
  {
    id: 'f_work2',
    category: 'work',
    title: 'Ciclos de releases e integración continua',
    detail: 'Prefiere revisiones por pares exhaustivas y contratos de API estrictamente versionados antes de desplegar.',
    origin: 'inferred',
    timestamp: null, // Caso null ≠ hoy en categoría de trabajo
    activeInContext: false,
    sha256Hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    embeddingVectorDims: 384,
  },
  {
    id: 'f6',
    category: 'inferred',
    title: 'Mood nocturno y síntesis concisa',
    detail: 'Disminución del ritmo de interacción a partir de las 22:30; prefiere respuestas muy concisas y tono sereno.',
    origin: 'inferred',
    timestamp: 'Hace 5 días',
    activeInContext: true,
    sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    embeddingVectorDims: 384,
  },
];

// Helper para carga estructurada y resiliente desde LocalStorage
const loadSavedVaultState = (): {
  facts: MemoriaFact[];
  isEncrypted: boolean;
  purgeSchedule: PurgeScheduleOption;
  preserveExplicitFacts: boolean;
} => {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (raw) {
      const parsed: StructuredVaultStorage = JSON.parse(raw);
      if (Array.isArray(parsed.facts)) {
        return {
          facts: parsed.facts,
          isEncrypted: parsed.isHardwareEncrypted ?? true,
          purgeSchedule: parsed.purgeSchedule ?? '30d',
          preserveExplicitFacts: parsed.preserveExplicitFacts ?? true,
        };
      }
    }
  } catch (err) {
    console.warn('Error reading local vault storage:', err);
  }
  return {
    facts: INITIAL_FACTS,
    isEncrypted: true,
    purgeSchedule: '30d',
    preserveExplicitFacts: true,
  };
};

interface ScreenVaultProps {
  onBack?: () => void;
  // Las 3 acciones cableadas por Claude Code
  onToggleActiveInContext?: (id: string, active: boolean) => void;
  onDeleteFact?: (id: string) => void;
  onPurgeAll?: () => void;
}

// Metadatos de Categorías Material 3
const CATEGORY_META: Record<
  MemoriaFact['category'],
  { label: string; desc: string; icon: React.ReactNode; colorPill: string; headerBg: string }
> = {
  personal: {
    label: 'Personal',
    desc: 'Datos identitarios y estilo de comunicación preferido',
    icon: <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
    colorPill: 'bg-blue-100/70 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
    headerBg: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950',
  },
  work: {
    label: 'Trabajo & Proyectos',
    desc: 'Metas profesionales, stacks técnicos y contexto laboral',
    icon: <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
    colorPill: 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    headerBg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-950',
  },
  preferences: {
    label: 'Preferencias & Configuración',
    desc: 'Gustos visuales, formato de respuestas y personalización',
    icon: <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
    colorPill: 'bg-indigo-100/70 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
    headerBg: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-950',
  },
  routine: {
    label: 'Rutinas & Horarios',
    desc: 'Hábitos diarios, momentos de enfoque y descanso',
    icon: <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />,
    colorPill: 'bg-orange-100/70 text-orange-900 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900/50',
    headerBg: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-950',
  },
  music: {
    label: 'Música & Acústica',
    desc: 'Preferencias sónicas, códecs Hi-Res y géneros de estudio',
    icon: <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
    colorPill: 'bg-purple-100/70 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
    headerBg: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-950',
  },
  health: {
    label: 'Salud & Bienestar',
    desc: 'Pausas posturales, hidratación y descansos de vista',
    icon: <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    colorPill: 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
    headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950',
  },
  inferred: {
    label: 'Inferencias de VEYA',
    desc: 'Deducciones locales a partir de patrones observados',
    icon: <Brain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
    colorPill: 'bg-teal-100/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900/50',
    headerBg: 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-950',
  },
};

export const ScreenVault: React.FC<ScreenVaultProps> = ({
  onBack,
  onToggleActiveInContext: externalToggleContext,
  onDeleteFact: externalDeleteFact,
  onPurgeAll: externalPurgeAll,
}) => {
  const initialVault = useMemo(() => loadSavedVaultState(), []);
  const [facts, setFacts] = useState<MemoriaFact[]>(initialVault.facts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFactId, setExpandedFactId] = useState<string | null>(null);

  // Material 3 Security Controls State
  const [isEncrypted, setIsEncrypted] = useState<boolean>(initialVault.isEncrypted);
  const [showEncryptionWarningModal, setShowEncryptionWarningModal] = useState<boolean>(false);
  const [purgeSchedule, setPurgeSchedule] = useState<PurgeScheduleOption>(initialVault.purgeSchedule);
  const [preserveExplicitFacts, setPreserveExplicitFacts] = useState<boolean>(initialVault.preserveExplicitFacts);

  // Modals & Sheets
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal de Edición de Recuerdo Material 3
  const [editingFact, setEditingFact] = useState<MemoriaFact | null>(null);

  // File input ref for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal de confirmación SOLO para recuerdos explícitos
  const [factToDeleteExplicit, setFactToDeleteExplicit] = useState<MemoriaFact | null>(null);

  // New Fact Form
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoriaFact['category']>('personal');
  const [newDateType, setNewDateType] = useState<'now' | 'null'>('now');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // PERSISTENCIA ESTRUCTURADA: Guarda en localStorage en cada cambio
  useEffect(() => {
    try {
      const payload: StructuredVaultStorage = {
        version: '2.5.0',
        lastUpdated: new Date().toISOString(),
        isHardwareEncrypted: isEncrypted,
        purgeSchedule,
        preserveExplicitFacts,
        facts,
      };
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('No se pudo guardar la bóveda en LocalStorage:', e);
    }
  }, [facts, isEncrypted, purgeSchedule, preserveExplicitFacts]);

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

  // ACCIÓN 1 CABLEADA: Alternar inclusión en prompt efímero (activeInContext)
  const handleToggleFactContext = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacts((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = !f.activeInContext;
          if (externalToggleContext) {
            externalToggleContext(id, updated);
          }
          return { ...f, activeInContext: updated };
        }
        return f;
      })
    );
  };

  // ACCIÓN: Confirmar recuerdo (Promueve inferencia a explícito o ratifica validación)
  const handleConfirmFact = (fact: MemoriaFact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (fact.origin === 'inferred') {
      const updatedTimestamp =
        fact.timestamp !== null
          ? fact.timestamp
          : 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setFacts((prev) =>
        prev.map((f) =>
          f.id === fact.id
            ? {
                ...f,
                origin: 'explicit',
                timestamp: updatedTimestamp,
              }
            : f
        )
      );
      showToast(`Recuerdo "${fact.title}" confirmado y validado como hecho explícito`);
    } else {
      showToast(`El recuerdo "${fact.title}" ya se encuentra validado y confirmado`);
    }
  };

  // ACCIÓN: Abrir editor Material 3
  const handleOpenEdit = (fact: MemoriaFact, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFact({ ...fact });
  };

  // ACCIÓN: Guardar edición de recuerdo
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFact || !editingFact.title.trim() || !editingFact.detail.trim()) return;

    setFacts((prev) =>
      prev.map((f) =>
        f.id === editingFact.id
          ? {
              ...editingFact,
              title: editingFact.title.trim(),
              detail: editingFact.detail.trim(),
            }
          : f
      )
    );
    showToast(`Recuerdo "${editingFact.title.trim()}" guardado con éxito`);
    setEditingFact(null);
  };

  // ACCIÓN 2 CABLEADA: Eliminar recuerdo individual (Confirmar SOLO si es explícito)
  const handleRequestDelete = (fact: MemoriaFact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (fact.origin === 'explicit') {
      // Requisito Claude: confirmar solo explícito
      setFactToDeleteExplicit(fact);
    } else {
      // Si es inferido, se elimina inmediatamente sin fricción modal
      executeDeleteFact(fact.id);
      showToast('Inferencia eliminada de la base de datos local');
    }
  };

  const executeDeleteFact = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
    if (externalDeleteFact) {
      externalDeleteFact(id);
    }
    setFactToDeleteExplicit(null);
  };

  // ACCIÓN 3 CABLEADA: Purga Soberana (Kill Switch)
  const handlePurgeAll = () => {
    setFacts([]);
    setShowPurgeModal(false);
    try {
      localStorage.removeItem(VAULT_STORAGE_KEY);
    } catch (e) {
      console.warn('Error al vaciar localStorage:', e);
    }
    if (externalPurgeAll) {
      externalPurgeAll();
    }
    showToast('Bóveda purgada por completo. 0 datos almacenados.');
  };

  // Restablecer Recuerdos Iniciales (Canónicos)
  const handleRestoreInitialFacts = () => {
    setFacts(INITIAL_FACTS);
    showToast('Recuerdos canónicos restaurados');
  };

  // Añadir Hecho Explícito
  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    const assignedTimestamp =
      newDateType === 'null'
        ? null
        : 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newFact: MemoriaFact = {
      id: 'f_' + Date.now(),
      category: newCategory,
      title: newTitle.trim(),
      detail: newDetail.trim(),
      origin: 'explicit',
      timestamp: assignedTimestamp, // Lógica estricta de fecha (permite null ≠ hoy)
      activeInContext: true,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      embeddingVectorDims: 384,
    };

    setFacts([newFact, ...facts]);
    setNewTitle('');
    setNewDetail('');
    setNewDateType('now');
    setShowAddModal(false);
    showToast('Nuevo recuerdo guardado y cifrado en local');
  };

  // Exportar Bóveda JSON
  const handleExportVault = () => {
    const exportData: StructuredVaultStorage = {
      version: '2.5.0',
      lastUpdated: new Date().toISOString(),
      isHardwareEncrypted: isEncrypted,
      purgeSchedule,
      preserveExplicitFacts,
      facts,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veya_boveda_memoria_local_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Bóveda exportada en JSON estructurado');
  };

  // Importar Bóveda JSON
  const handleImportVault = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        const importedFacts = Array.isArray(data.facts) ? data.facts : Array.isArray(data) ? data : null;
        if (importedFacts && importedFacts.length > 0) {
          const validCategories: MemoryCategory[] = [
            'personal',
            'work',
            'preferences',
            'routine',
            'music',
            'health',
            'inferred',
          ];
          const sanitized: MemoriaFact[] = importedFacts.map((item: any, idx: number) => ({
            id: String(item.id || `f_imp_${Date.now()}_${idx}`),
            category: (validCategories.includes(item.category) ? item.category : 'personal') as MemoryCategory,
            title: String(item.title || 'Recuerdo importado'),
            detail: String(item.detail || ''),
            origin: item.origin === 'inferred' ? 'inferred' : 'explicit',
            timestamp: item.timestamp ?? null, // Preservar null strictly
            activeInContext: typeof item.activeInContext === 'boolean' ? item.activeInContext : true,
            sha256Hash: item.sha256Hash || '0000000000000000000000000000000000000000000000000000000000000000',
            embeddingVectorDims: item.embeddingVectorDims || 384,
          }));

          setFacts(sanitized);
          if (typeof data.isHardwareEncrypted === 'boolean') setIsEncrypted(data.isHardwareEncrypted);
          if (data.purgeSchedule) setPurgeSchedule(data.purgeSchedule);
          if (typeof data.preserveExplicitFacts === 'boolean') setPreserveExplicitFacts(data.preserveExplicitFacts);

          showToast(`${sanitized.length} recuerdos importados a la bóveda local`);
        } else {
          showToast('Formato JSON no válido o sin lista de recuerdos');
        }
      } catch (err) {
        showToast('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtrado de hechos
  const filteredFacts = useMemo(() => {
    return facts.filter((f) => {
      const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.detail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [facts, selectedCategory, searchQuery]);

  // REQUISITO CLAUDE: Agrupar por categoría
  const groupedFacts = useMemo(() => {
    const categoriesOrder: MemoriaFact['category'][] = [
      'personal',
      'work',
      'preferences',
      'routine',
      'music',
      'health',
      'inferred',
    ];
    const groups: { category: MemoriaFact['category']; items: MemoriaFact[] }[] = [];

    categoriesOrder.forEach((cat) => {
      if (selectedCategory === 'all' || selectedCategory === cat) {
        const items = filteredFacts.filter((f) => f.category === cat);
        if (items.length > 0) {
          groups.push({ category: cat, items });
        }
      }
    });

    return groups;
  }, [filteredFacts, selectedCategory]);

  // REQUISITO CLAUDE: Fechas null ≠ hoy
  const renderFactDate = (timestamp: string | null) => {
    if (timestamp === null || timestamp === undefined || timestamp === '') {
      return (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic font-mono flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400/80" />
          <span>Sin fecha registrada</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
        <Clock className="w-3 h-3 text-slate-400" />
        <span>{timestamp}</span>
      </span>
    );
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
            {/* Hidden JSON file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportVault}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleRestoreInitialFacts}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Restaurar recuerdos canónicos iniciales"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Importar Bóveda desde archivo JSON"
            >
              <Upload className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
            </button>
            <button
              onClick={handleExportVault}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Exportar Bóveda a JSON estructurado"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver contrato MemoriaFact y especificación Compose M3"
            >
              <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Añadir recuerdo explícito"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* ========================================================================= */}
        {/* M3 SECTION 1: TOGGLE DE CIFRADO DE HARDWARE AES-256-GCM                   */}
        {/* ========================================================================= */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isEncrypted
              ? 'bg-white dark:bg-[#141A24] border-slate-200/80 dark:border-slate-800 shadow-xs'
              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  isEncrypted
                    ? 'bg-blue-50 text-[#155E95] dark:bg-blue-950/60 dark:text-[#8ECEFF]'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Cifrado de Hardware AES-256-GCM
                  </h2>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isEncrypted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {isEncrypted ? 'Activo' : 'Desprotegido'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEncrypted
                    ? 'Clave maestra custodiada por Android Keystore (StrongBox TEE). Base de datos SQLCipher sin fugas en memoria volátil.'
                    : 'Peligro: Los recuerdos se almacenan en texto plano en la partición SQLite de la app.'}
                </p>
              </div>
            </div>

            {/* M3 Switch */}
            <button
              onClick={handleToggleEncryption}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative shrink-0 ${
                isEncrypted ? 'bg-[#155E95]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              title={isEncrypted ? 'Desactivar cifrado (peligro)' : 'Activar cifrado AES-256'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform flex items-center justify-center shadow-xs ${
                  isEncrypted ? 'translate-x-5 text-[#155E95]' : 'translate-x-0 text-slate-400'
                }`}
              >
                {isEncrypted ? <Check className="w-3 h-3 stroke-[3]" /> : <Lock className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* M3 SECTION 2: PURGA PROGRAMADA DE RECUERDOS                               */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Purga de Datos Programada
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">WorkManager 2.9</span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Configura el ciclo de auto-limpieza periódica. Un proceso en segundo plano de Android elimina registros antiguos para evitar acumulación de información caduca.
          </p>

          {/* M3 SingleChoiceSegmentedButtonRow */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
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
                  showToast(`Ciclo de purga actualizado: ${opt.label}`);
                }}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                  purgeSchedule === opt.id
                    ? 'bg-white dark:bg-[#1F2B38] text-slate-900 dark:text-slate-100 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              <span>{getNextPurgeText(purgeSchedule)}</span>
            </div>
          </div>

          {/* Toggle: Preservar recuerdos explícitos frente a inferencias */}
          <div className="pt-1 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Preservar recuerdos explícitos
              </span>
              <span className="text-[10px] text-slate-400">
                La auto-purga solo eliminará inferencias de la IA; nunca datos aportados directamente por ti.
              </span>
            </div>
            <button
              onClick={() => setPreserveExplicitFacts(!preserveExplicitFacts)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                preserveExplicitFacts ? 'bg-[#155E95]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  preserveExplicitFacts ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* M3 SECTION 3: PANEL VISUAL DE MEMORIA (MemoriaFact)                       */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          {/* Panel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#155E95] dark:text-[#8ECEFF] border border-blue-200/50 dark:border-blue-900/40">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Panel Visual de Memoria (MemoriaFact)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-900/50">
                    {filteredFacts.length} {filteredFacts.length === 1 ? 'ítem' : 'ítems'}
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400">
                  Agrupación por categoría, control de estado y persistencia estructurada local
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SQLCipher SQLite / Keystore</span>
            </div>
          </div>

          {/* Quick Metrics Bar (M3 Bento metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Bóveda
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {facts.length}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Confirmados
              </span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                {facts.filter((f) => f.origin === 'explicit').length}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                Inferencias
              </span>
              <span className="text-base font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                {facts.filter((f) => f.origin === 'inferred').length}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                En Prompt Activo
              </span>
              <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
                {facts.filter((f) => f.activeInContext).length}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en la memoria local por concepto, hábito, proyecto o palabra clave..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
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

          {/* M3 Filter Chips con categorías completas */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
            {[
              { id: 'all', label: `Todas (${facts.length})` },
              { id: 'personal', label: 'Personal' },
              { id: 'work', label: 'Trabajo' },
              { id: 'preferences', label: 'Preferencias' },
              { id: 'routine', label: 'Rutinas' },
              { id: 'music', label: 'Música' },
              { id: 'health', label: 'Salud' },
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

          {/* REQUISITO CLAUDE: Agrupación visual por categoría */}
          {groupedFacts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#141A24] rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {facts.length === 0
                    ? 'Bóveda local vacía (0 recuerdos almacenados)'
                    : 'No hay recuerdos que coincidan con el filtro actual'}
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  {facts.length === 0
                    ? 'Todos los datos fueron purgados localmente o estás en una nueva sesión sin recuerdos registrados.'
                    : 'Prueba a cambiar de categoría o limpiar el término de búsqueda.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {facts.length === 0 ? (
                  <>
                    <button
                      onClick={handleRestoreInitialFacts}
                      className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Canónicos</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importar Respaldo JSON</span>
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-3.5 py-2 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Añadir Hecho</span>
                    </button>
                  </>
                ) : (
                  <>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="px-3 py-1.5 rounded-xl bg-[#155E95]/10 text-[#155E95] dark:text-[#8ECEFF] text-xs font-bold"
                      >
                        Ver todas las categorías
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedFacts.map((group) => {
                const meta = CATEGORY_META[group.category];
                return (
                  <div
                    key={`cat-group-${group.category}`}
                    className="space-y-2.5 rounded-3xl bg-slate-50/60 dark:bg-slate-900/30 p-3 border border-slate-200/60 dark:border-slate-800/80"
                  >
                    {/* Header de Categoría M3 */}
                    <div className="flex items-center justify-between px-1.5 py-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                          {meta.icon}
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {meta.label}
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              {group.items.length} {group.items.length === 1 ? 'recuerdo' : 'recuerdos'}
                            </span>
                          </h3>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{meta.desc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tarjetas de hechos en la categoría (id como key) */}
                    <div className="space-y-2.5">
                      {group.items.map((fact) => {
                        const isExpanded = expandedFactId === fact.id;
                        return (
                          <div
                            key={fact.id} // REQUISITO CLAUDE: id como key
                            className="p-3.5 rounded-2xl bg-white dark:bg-[#141A24] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                          >
                            {/* Cabecera de la Tarjeta: Origen y Estado SEPARADOS */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              {/* 1. ORIGEN SEPARADO (Explícito vs Inferido) */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                    fact.origin === 'explicit'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/50'
                                      : 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900/50'
                                  }`}
                                >
                                  {fact.origin === 'explicit' ? (
                                    <>
                                      <UserCheck className="w-2.5 h-2.5" />
                                      <span>Aportado por ti</span>
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="w-2.5 h-2.5" />
                                      <span>Inferido por VEYA</span>
                                    </>
                                  )}
                                </span>

                                {/* REQUISITO CLAUDE: Fechas null ≠ hoy */}
                                {renderFactDate(fact.timestamp)}
                              </div>

                              {/* Indicador de Inyección en Prompt */}
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${
                                  fact.activeInContext
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/40'
                                    : 'bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800/80'
                                }`}
                              >
                                {fact.activeInContext ? 'En Prompt Activo' : 'Aislado de IA'}
                              </span>
                            </div>

                            {/* Contenido del Recuerdo */}
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                                {fact.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {fact.detail}
                              </p>
                            </div>

                            {/* BARRA DE ACCIONES MATERIAL 3: EDITAR, ELIMINAR, CONFIRMAR */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                {/* ACCIÓN: Confirmar */}
                                {fact.origin === 'inferred' ? (
                                  <button
                                    onClick={(e) => handleConfirmFact(fact, e)}
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 text-[10px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                    title="Confirmar y validar esta inferencia como un hecho explícito permanente"
                                  >
                                    <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                                    <span>Confirmar</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => handleConfirmFact(fact, e)}
                                    className="px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center gap-1 border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100 transition-colors"
                                    title="Hecho validado y confirmado"
                                  >
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    <span>Confirmado</span>
                                  </button>
                                )}

                                {/* ACCIÓN: Editar */}
                                <button
                                  onClick={(e) => handleOpenEdit(fact, e)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                  title="Editar título, detalle o categoría de este recuerdo"
                                >
                                  <Edit3 className="w-3 h-3 text-[#155E95] dark:text-[#8ECEFF]" />
                                  <span>Editar</span>
                                </button>

                                {/* ACCIÓN: Eliminar */}
                                <button
                                  onClick={(e) => handleRequestDelete(fact, e)}
                                  className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[10px] font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
                                  title={
                                    fact.origin === 'explicit'
                                      ? 'Eliminar recuerdo explícito (requiere confirmación deliberada)'
                                      : 'Eliminar inferencia inmediatamente sin confirmación'
                                  }
                                >
                                  <Trash2 className="w-3 h-3 text-rose-500" />
                                  <span>Eliminar</span>
                                </button>
                              </div>

                              {/* Controles Secundarios: Prompt Toggle + Criptografía */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleToggleFactContext(fact.id, e)}
                                  className={`p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                                    fact.activeInContext
                                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100'
                                      : 'text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200'
                                  }`}
                                  title={
                                    fact.activeInContext
                                      ? 'En Prompt: VEYA lo inyecta como contexto efímero'
                                      : 'Aislado: Preservado en bóveda pero fuera del prompt efímero'
                                  }
                                >
                                  {fact.activeInContext ? (
                                    <Eye className="w-3.5 h-3.5" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <button
                                  onClick={() => setExpandedFactId(isExpanded ? null : fact.id)}
                                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Inspección de hash criptográfico SHA-256"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Inspección Criptográfica Expandida */}
                            {isExpanded && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                              >
                                <div className="flex items-center justify-between text-slate-400">
                                  <span className="font-bold uppercase tracking-wider text-[9px]">
                                    Inspección Criptográfica SQLCipher
                                  </span>
                                  <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    Row: {fact.id}
                                  </span>
                                </div>
                                <p className="truncate">
                                  <span className="text-slate-400">SHA-256: </span>
                                  <span className="text-[#155E95] dark:text-[#8ECEFF]">{fact.sha256Hash}</span>
                                </p>
                                <p>
                                  <span className="text-slate-400">Vector Embedding: </span>
                                  <span>{fact.embeddingVectorDims || 384}-dim float32 (sqlite-vec)</span>
                                </p>
                                <p>
                                  <span className="text-slate-400">Tratamiento Prompt: </span>
                                  <span className={fact.activeInContext ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                                    {fact.activeInContext ? 'Inyectable en system_instruction' : 'Omitido en llamadas'}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-200">
                Purga Inmediata Soberana (Kill Switch)
              </h3>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80">
                Destrucción irrevocable de todos los recuerdos almacenados en este dispositivo.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Registros activos: {facts.length}
            </span>
            <button
              onClick={() => setShowPurgeModal(true)}
              className="px-3.5 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purgar Toda la Bóveda</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL REQUISITO CLAUDE: CONFIRMAR SOLO EXPLÍCITO                          */}
      {/* ========================================================================= */}
      {factToDeleteExplicit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-amber-300 dark:border-amber-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center justify-center mx-auto">
              <UserCheck className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                ¿Eliminar recuerdo explícito?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Este recuerdo fue aportado directamente por ti:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-left border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {factToDeleteExplicit.title}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                  {factToDeleteExplicit.detail}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Al borrarlo, VEYA olvidará esta preferencia de forma permanente e irreversible.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFactToDeleteExplicit(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => executeDeleteFact(factToDeleteExplicit.id)}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AÑADIR RECUERDO EXPLÍCITO                                          */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center font-bold">
                  +
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Añadir Recuerdo Explícito
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
                  <option value="personal">Personal (Identidad & Trato)</option>
                  <option value="work">Trabajo (Proyectos & Stack)</option>
                  <option value="preferences">Preferencias (UI & Respuestas)</option>
                  <option value="routine">Rutinas & Horarios</option>
                  <option value="music">Música & Acústica</option>
                  <option value="health">Salud & Bienestar</option>
                  <option value="inferred">Inferencia de VEYA</option>
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

              {/* Lógica de Fechas: null ≠ hoy */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Marca Temporal (Fecha)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDateType('now')}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors ${
                      newDateType === 'now'
                        ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Hoy (Registrar ahora)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDateType('null')}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors ${
                      newDateType === 'null'
                        ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Sin fecha (null)
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  {newDateType === 'null'
                    ? 'Cumple la regla estricta: un valor null no se transforma en "Hoy".'
                    : 'Asigna la marca temporal actual con hora de registro.'}
                </p>
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
      {/* MODAL MATERIAL 3: EDITAR RECUERDO EXISTENTE                               */}
      {/* ========================================================================= */}
      {editingFact && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] rounded-3xl p-5 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#155E95] dark:bg-blue-950 dark:text-[#8ECEFF] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Editar Recuerdo Material 3
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {editingFact.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingFact(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 flex-1 overflow-y-auto pr-1">
              {/* Categoría */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Categoría
                </label>
                <select
                  value={editingFact.category}
                  onChange={(e) =>
                    setEditingFact({ ...editingFact, category: e.target.value as MemoryCategory })
                  }
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="personal">Personal (Identidad & Trato)</option>
                  <option value="work">Trabajo (Proyectos & Stack)</option>
                  <option value="preferences">Preferencias (UI & Respuestas)</option>
                  <option value="routine">Rutinas & Horarios</option>
                  <option value="music">Música & Acústica</option>
                  <option value="health">Salud & Bienestar</option>
                  <option value="inferred">Inferencias de VEYA</option>
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Título del Recuerdo
                </label>
                <input
                  type="text"
                  value={editingFact.title}
                  onChange={(e) => setEditingFact({ ...editingFact, title: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                />
              </div>

              {/* Detalle */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Detalle y Contenido
                </label>
                <textarea
                  rows={3}
                  value={editingFact.detail}
                  onChange={(e) => setEditingFact({ ...editingFact, detail: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                />
              </div>

              {/* Origen (Separado de estado) */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Origen del Dato
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFact({ ...editingFact, origin: 'explicit' })}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      editingFact.origin === 'explicit'
                        ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Aportado por ti</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFact({ ...editingFact, origin: 'inferred' })}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      editingFact.origin === 'inferred'
                        ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Inferencia VEYA</span>
                  </button>
                </div>
              </div>

              {/* Lógica de Fechas: null ≠ hoy */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Fecha Registrada
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingFact({
                        ...editingFact,
                        timestamp:
                          editingFact.timestamp ||
                          'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      })
                    }
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors ${
                      editingFact.timestamp !== null
                        ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Con Fecha ({editingFact.timestamp || 'Hoy'})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFact({ ...editingFact, timestamp: null })}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-colors ${
                      editingFact.timestamp === null
                        ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Sin fecha (null)
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  {editingFact.timestamp === null
                    ? 'Regla de contrato: se guardará como null (aparecerá como "Sin fecha registrada", nunca "Hoy").'
                    : 'Texto de fecha asignado: ' + editingFact.timestamp}
                </p>
              </div>

              {/* Estado: activeInContext */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Inyección en Prompt Activo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Determina si este recuerdo viaja como contexto efímero a la IA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingFact({ ...editingFact, activeInContext: !editingFact.activeInContext })
                  }
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${
                    editingFact.activeInContext ? 'bg-[#155E95]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      editingFact.activeInContext ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-2 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingFact(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#155E95] hover:bg-[#124d7b] text-white text-xs font-bold shadow-xs"
                >
                  Guardar Cambios
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
      {/* MODAL: PURGA TOTAL SOBERANA (KILL SWITCH)                                 */}
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
      {/* MODAL: JETPACK COMPOSE M3 CODE & CONTRATO REAL (PARA CLAUDE CODE)         */}
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
                    Contrato MemoriaFact & Cableado de 3 Acciones
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Especificación Material 3 sincronizada con main (8795017) para Claude Code
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
              <p className="text-emerald-400 font-bold">// 1. Contrato Canónico MemoriaFact (Android / Room)</p>
              <p className="text-slate-300">
                data class MemoriaFact(<br />
                &nbsp;&nbsp;val id: String, // ID único como key en LazyColumn<br />
                &nbsp;&nbsp;val category: MemoryCategory, // PERSONAL, ROUTINE, MUSIC, HEALTH, INFERRED<br />
                &nbsp;&nbsp;val title: String,<br />
                &nbsp;&nbsp;val detail: String,<br />
                &nbsp;&nbsp;val origin: MemoryOrigin, // EXPLICIT vs INFERRED (Separado de estado)<br />
                &nbsp;&nbsp;val createdAt: Long?, // Nullable: fechas null ≠ hoy<br />
                &nbsp;&nbsp;val activeInContext: Boolean // Estado toggle prompt IA<br />
                )
              </p>
              <br />
              <p className="text-blue-400 font-bold">// 2. Las 3 Acciones Cableadas en VeyaMemoryAndPrivacyScreen</p>
              <p className="text-yellow-300">@Composable</p>
              <p className="text-yellow-300">fun VeyaMemoryAndPrivacyScreen(</p>
              <p className="text-slate-300 pl-4">facts: List&lt;MemoriaFact&gt;,</p>
              <p className="text-emerald-300 pl-4">// Acción 1: Toggle activeInContext</p>
              <p className="text-slate-300 pl-4">onToggleActiveInContext: (id: String, active: Boolean) -&gt; Unit,</p>
              <p className="text-emerald-300 pl-4">// Acción 2: Eliminar recuerdo (confirmar solo si es explícito)</p>
              <p className="text-slate-300 pl-4">onDeleteFact: (id: String) -&gt; Unit,</p>
              <p className="text-emerald-300 pl-4">// Acción 3: Purga Soberana (Kill Switch)</p>
              <p className="text-slate-300 pl-4">onPurgeAll: () -&gt; Unit,</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// Agrupación en LazyColumn por categoría</p>
              <p className="text-slate-300 pl-4">val grouped = facts.groupBy &#123; it.category &#125;</p>
              <p className="text-slate-300 pl-4">LazyColumn &#123;</p>
              <p className="text-slate-300 pl-8">grouped.forEach &#123; (cat, items) -&gt;</p>
              <p className="text-slate-300 pl-12">item(key = "header_$cat") &#123; CategoryHeader(cat, items.size) &#125;</p>
              <p className="text-slate-300 pl-12">items(items, key = &#123; it.id &#125;) &#123; fact -&gt;</p>
              <p className="text-slate-300 pl-16">MemoryCard(</p>
              <p className="text-slate-300 pl-20">fact = fact,</p>
              <p className="text-slate-300 pl-20">onTogglePrompt = &#123; onToggleActiveInContext(fact.id, !fact.activeInContext) &#125;,</p>
              <p className="text-slate-300 pl-20">onDelete = &#123;</p>
              <p className="text-slate-300 pl-24">if (fact.origin == MemoryOrigin.EXPLICIT) &#123; showConfirmDialog(fact) &#125;</p>
              <p className="text-slate-300 pl-24">else &#123; onDeleteFact(fact.id) &#125;</p>
              <p className="text-slate-300 pl-20">&#125;</p>
              <p className="text-slate-300 pl-16">)</p>
              <p className="text-slate-300 pl-12">&#125;</p>
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
