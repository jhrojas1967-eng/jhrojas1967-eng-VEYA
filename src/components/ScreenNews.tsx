import React, { useState } from 'react';
import {
  Newspaper,
  ArrowLeft,
  Rss,
  Sparkles,
  Clock,
  CheckCircle,
  FileCode,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Filter,
  Layers,
  BookOpen,
  Volume2,
} from 'lucide-react';

interface ScreenNewsProps {
  onBack: () => void;
}

export type NewsCategory = 'Todas' | 'Tecnología' | 'Ciencia' | 'Salud' | 'Local';

export interface CompactNewsArticle {
  id: string;
  title: string;
  source: string;
  category: 'Tecnología' | 'Ciencia' | 'Salud' | 'Local';
  publishedTime: string;
  readTimeEstimate: string; // "1 min", "45 s", "2 min"
  wordCount: number;
  originalUrl: string;
  aiSummary: string;
  keyPoints: string[];
}

const NEWS_ARTICLES: CompactNewsArticle[] = [
  {
    id: 'art_1',
    title: 'Nuevo estándar de compresión neuronal reduce el consumo de memoria en modelos locales',
    source: 'Ars Technica (RSS)',
    category: 'Tecnología',
    publishedTime: 'Hace 22 min',
    readTimeEstimate: '1 min de lectura',
    wordCount: 180,
    originalUrl: 'https://arstechnica.com/ai-quantization-standard',
    aiSummary: 'Investigadores presentan una técnica de cuantización a 3-bits que permite ejecutar inferencias LLM completas en terminales móviles con menos de 2GB de RAM.',
    keyPoints: [
      'Reducción de consumo de RAM en un 65% sin pérdida de coherencia sintáctica.',
      'Compatible con aceleradores NPU de Android 14+.',
    ],
  },
  {
    id: 'art_2',
    title: 'El telescopio espacial detecta vapor de agua en la atmósfera de un exoplaneta templado',
    source: 'Nature Astronomy (Atom)',
    category: 'Ciencia',
    publishedTime: 'Hace 45 min',
    readTimeEstimate: '2 min de lectura',
    wordCount: 310,
    originalUrl: 'https://nature.com/articles/exoplanet-atmosphere-water',
    aiSummary: 'Espectroscopía infrarroja confirma la presencia de firmas moleculares de vapor acuoso en un sistema estelar a 110 años luz, en zona de habitabilidad teórica.',
    keyPoints: [
      'Firma detectada a 1.4 y 1.9 micras con una significancia estadística de 5.2 sigma.',
      'Primer candidato con gradiente térmico compatible con condensación líquida.',
    ],
  },
  {
    id: 'art_3',
    title: 'Estudio clínico longitudinal asocia la luz azul matinal con mejor sincronización circadiana',
    source: 'The Lancet Digital Health',
    category: 'Salud',
    publishedTime: 'Hace 1 h',
    readTimeEstimate: '1 min de lectura',
    wordCount: 220,
    originalUrl: 'https://thelancet.com/journals/circadian-light-study',
    aiSummary: 'Exponerse a 20 minutos de iluminación natural o espectro diurno en la primera hora tras despertar acelera la eliminación de adenosina y reduce el insomnio nocturno.',
    keyPoints: [
      'Aumento del 28% en la eficiencia de la fase de sueño profundo N3.',
      'Recomendación de regular el brillo de pantallas en dispositivos personales.',
    ],
  },
  {
    id: 'art_4',
    title: 'La red municipal completa la instalación de 12 nuevos puntos de recarga y sensores de aire',
    source: 'Gaceta Municipal (RSS Abierto)',
    category: 'Local',
    publishedTime: 'Hace 2 h',
    readTimeEstimate: '45 s de lectura',
    wordCount: 120,
    originalUrl: 'https://ayuntamiento.local/noticias/movilidad-limpia',
    aiSummary: 'Entran en servicio las nuevas estaciones del distrito centro con mediciones en tiempo real de partículas PM2.5 accesibles en datos abiertos.',
    keyPoints: [
      'Puntos interoperables con carga rápida de 50kW.',
      'Datos microclimáticos disponibles mediante API abierta sin autenticación.',
    ],
  },
  {
    id: 'art_5',
    title: 'Desarrollan baterías de sodio de carga ultrarrápida sin uso de níquel ni cobalto',
    source: 'MIT Technology Review',
    category: 'Tecnología',
    publishedTime: 'Hace 3 h',
    readTimeEstimate: '2 min de lectura',
    wordCount: 290,
    originalUrl: 'https://technologyreview.com/sodium-ion-battery-breakthrough',
    aiSummary: 'La nueva arquitectura de cátodo a base de ferrita y carbón vegetal alcanza el 80% de carga en 12 minutos con una degradación mínima a lo largo de 4.000 ciclos.',
    keyPoints: [
      'Coste de producción estimado un 40% inferior al litio ferrofosfato.',
      'Rango térmico operativo de -20°C a 55°C sin riesgo de fuga térmica.',
    ],
  },
  {
    id: 'art_6',
    title: 'Secuenciación genética de árboles milenarios desvela resistencia al estrés hídrico',
    source: 'CSIC Divulgación',
    category: 'Ciencia',
    publishedTime: 'Hace 4 h',
    readTimeEstimate: '1 min de lectura',
    wordCount: 195,
    originalUrl: 'https://csic.es/noticias/arboles-resistencia-climatica',
    aiSummary: 'Identifican un conjunto de 14 genes reguladores de cierre estomático que permiten a las coníferas mediterráneas sobrevivir a sequías extremas.',
    keyPoints: [
      'Muestras tomadas de ejemplares de más de 800 años en parques protegidos.',
      'Claves genéticas aplicables a planes de reforestación adaptada al cambio climático.',
    ],
  },
  {
    id: 'art_7',
    title: 'Guía de ergonomía visual: la regla 20-20-20 disminuye la fatiga en jornadas de pantalla',
    source: 'Sociedad de Oftalmología (RSS)',
    category: 'Salud',
    publishedTime: 'Hace 5 h',
    readTimeEstimate: '45 s de lectura',
    wordCount: 110,
    originalUrl: 'https://oftalmologia.org/guia-pantallas-salud-visual',
    aiSummary: 'Pausar cada 20 minutos para mirar a 20 pies (6 metros) durante 20 segundos previene el síndrome de ojo seco y la tensión del músculo ciliar.',
    keyPoints: [
      'Parpadeo involuntario cae de 18 a 4 veces por minuto frente a monitores.',
      'Fácil implementación como hábito pasivo en rutinas de trabajo.',
    ],
  },
  {
    id: 'art_8',
    title: 'Plan de pacificación del tráfico en el casco histórico incorpora nuevas zonas verdes',
    source: 'Boletín del Distrito Centro',
    category: 'Local',
    publishedTime: 'Hace 6 h',
    readTimeEstimate: '1 min de lectura',
    wordCount: 145,
    originalUrl: 'https://ayuntamiento.local/urbanismo/zonas-verdes',
    aiSummary: 'Aprobada la peatonalización de 4 calles aledañas a la plaza mayor con arbolado autóctono y pavimentos drenantes para mitigar la isla de calor.',
    keyPoints: [
      'Inversión con cargo a fondos de sostenibilidad urbana.',
      'Inicio de obras programado para el próximo trimestre con acceso vecinal garantizado.',
    ],
  },
];

const CATEGORIES: NewsCategory[] = ['Todas', 'Tecnología', 'Ciencia', 'Salud', 'Local'];

export const ScreenNews: React.FC<ScreenNewsProps> = ({ onBack }) => {
  // 1. Category Selector State
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('Todas');

  // 2. AI Summary States (Per-card toggles + Global default)
  const [expandedSummaryIds, setExpandedSummaryIds] = useState<Set<string>>(
    new Set(['art_1', 'art_2']) // Default first two open
  );
  const [globalAiSummaryMode, setGlobalAiSummaryMode] = useState<boolean>(true);

  // 3. Sensationalism & Routine Settings
  const [filterSensationalism, setFilterSensationalism] = useState<boolean>(true);
  const [maxMorningArticles, setMaxMorningArticles] = useState<number>(3);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // UI Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClaudeInstructions, setShowClaudeInstructions] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [copiedInstructions, setCopiedInstructions] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle AI summary for an individual card
  const handleToggleCardSummary = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedSummaryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Resumen IA plegado');
      } else {
        next.add(id);
        showToast('Resumen IA generado');
      }
      return next;
    });
  };

  // Toggle all summaries
  const handleToggleAllSummaries = () => {
    if (expandedSummaryIds.size > 0) {
      setExpandedSummaryIds(new Set());
      showToast('Todos los resúmenes IA ocultados');
    } else {
      setExpandedSummaryIds(new Set(NEWS_ARTICLES.map((a) => a.id)));
      showToast('Todos los resúmenes IA desplegados');
    }
  };

  const handleRefreshFeeds = () => {
    setIsRefreshing(true);
    showToast('Consultando feeds RSS descentralizados...');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Titulares sincronizados desde fuentes abiertas');
    }, 900);
  };

  const handleResetDefaults = () => {
    setSelectedCategory('Todas');
    setExpandedSummaryIds(new Set(['art_1', 'art_2']));
    setGlobalAiSummaryMode(true);
    setFilterSensationalism(true);
    setMaxMorningArticles(3);
    showToast('Ajustes de noticias restaurados por defecto');
  };

  // Filtered articles by selected category
  const filteredArticles = NEWS_ARTICLES.filter((article) => {
    if (selectedCategory === 'Todas') return true;
    return article.category === selectedCategory;
  });

  const copyClaudePrompt = () => {
    const prompt = `Hola Claude, integra la pantalla "Medios de Noticias" en el proyecto Android de VEYA con Jetpack Compose y Material 3:

1. Arquitectura & Módulos:
   - UI: personal.veya.ui.screen.settings.NewsFeedsScreen.kt
   - ViewModel: personal.veya.ui.screen.settings.NewsViewModel.kt
   - Parser RSS/Atom: personal.veya.data.rss.RssXmlParser.kt (Parseo nativo SAX/XmlPullParser con OkHttp)
   - Motor de Resumen IA: personal.veya.ai.LocalNewsSummarizer.kt (Generación de resumen sereno on-device)
   - DataStore: personal.veya.data.preferences.NewsPreferences.kt

2. Componentes Material 3:
   a) Lista de Tarjetas 'Compact' (OutlinedCard M3):
      - Visualización ágil: Título principal en título mediano + Fuente y hora relativa en labelSmall.
      - PROHIBIDO descargar imágenes pesadas o trackers de publicidad externa (ahorro de batería y datos).
   b) Selector de Categorías (FilterChip M3):
      - Chips horizontales: 'Todas', 'Tecnología', 'Ciencia', 'Salud', 'Local'.
   c) Toggle de 'Resumen IA' para cada titular:
      - Switch/Botoncito compacto en cada tarjeta para expandir el resumen sintético de 2 frases.
   d) Indicador de tiempo estimado de lectura:
      - Badge con icono de reloj y cálculo según número de palabras (ej: '1 min', '45 s').

3. Filosofía Descentralizada (Zero Telemetry):
   - Conexión directa a URLs RSS/Atom de los medios, sin servidores intermediarios.
   - Filtrado anti-sensacionalismo por palabras clave en local.

Consulta 'entregas/13_specs_screen_news_m3_para_claude.md' para el código y guía completa.`;

    navigator.clipboard.writeText(prompt);
    setCopiedInstructions(true);
    showToast('Instrucciones para Claude copiadas al portapapeles');
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  const getCategoryColor = (cat: CompactNewsArticle['category']) => {
    switch (cat) {
      case 'Tecnología':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300';
      case 'Ciencia':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
      case 'Salud':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';
      case 'Local':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification (M3 Snackbar) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#16202A]/95 dark:bg-[#E0E3E8]/95 text-white dark:text-[#16202A] text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in backdrop-blur-md border border-white/10 dark:border-black/10">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Material 3 TopAppBar */}
      <div className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#12181F] border-b border-[#CBD2D9]/70 dark:border-[#42474E]/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] transition-colors active:scale-95"
              title="Volver a Ajustes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#4355B9] text-white flex items-center justify-center shadow-xs">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-tight">
                  Medios de Noticias
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DDE1FF] dark:bg-[#293CA0]/40 text-[#4355B9] dark:text-[#BAC3FF]">
                  Material 3
                </span>
              </div>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Titulares compactos RSS descentralizados con Resumen IA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowClaudeInstructions(!showClaudeInstructions)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                showClaudeInstructions
                  ? 'bg-[#155E95] text-white dark:bg-[#8ECEFF] dark:text-[#003355]'
                  : 'text-[#155E95] dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/60 dark:hover:bg-[#004A7B]/40'
              }`}
              title="Guía de implementación para Claude Code"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Guía Claude</span>
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-[#4355B9] dark:text-[#BAC3FF] hover:bg-[#DDE1FF]/60 dark:hover:bg-[#293CA0]/30 transition-colors"
              title="Ver código Compose Kotlin"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefreshFeeds}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Actualizar titulares RSS"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#4355B9]' : ''}`} />
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Restaurar valores de fábrica"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">

        {/* INSTRUCCIONES PARA CLAUDE CODE (COLLAPSIBLE BANNER) */}
        {showClaudeInstructions && (
          <div className="p-4 rounded-3xl bg-[#001D33] text-white border border-[#155E95] shadow-lg animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#155E95] text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                    Instrucciones para Claude Code (Motor de Noticias RSS M3)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Formato Compact sin imágenes pesadas, selector de categorías y Resumen IA
                  </p>
                </div>
              </div>
              <button
                onClick={copyClaudePrompt}
                className="px-3 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#1E74B3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedInstructions ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstructions ? 'Copiado' : 'Copiar Prompt'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#8ECEFF] block">1. Formato 'Compact' M3</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">OutlinedCard sin imágenes</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Ahorro de batería y carga instantánea offline.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#BAC3FF] block">2. FilterChips M3</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">Tecnología, Ciencia, Salud, Local</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Filtro dinámico con animaciones de lista.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Resumen IA + Tiempo Lectura</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">Párrafo sintético & 1 min badge</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Motor local VEYA sin clickbait sensacionalista.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
              <span>Especificación canónica completa: <code>entregas/13_specs_screen_news_m3_para_claude.md</code></span>
              <button
                onClick={() => setShowClaudeInstructions(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* ZERO TELEMETRY RSS BANNER */}
        <div className="p-3.5 rounded-3xl bg-[#DDE1FF]/60 dark:bg-[#293CA0]/20 border border-[#4355B9]/30 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#4355B9] dark:text-[#BAC3FF] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-[#1E2B77] dark:text-[#BAC3FF]">
              Feeds RSS Descentralizados y Privados
            </h4>
            <p className="text-[11px] text-[#29388B] dark:text-[#C5CCFF] leading-relaxed">
              VEYA lee directamente los estándares abiertos RSS y Atom desde las fuentes de confianza. No hay servidores de telemetría intermedios, rastreo de cookies ni algoritmos de recomendación adictivos.
            </p>
          </div>
        </div>

        {/* 2. SELECTOR DE CATEGORÍAS (MATERIAL 3 FILTER CHIPS) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#4355B9] dark:text-[#BAC3FF]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#42474E] dark:text-[#CBD2D9]">
                Selector de Categorías
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#42474E] dark:text-[#CBD2D9] font-mono">
              {filteredArticles.length} Titulares
            </span>
          </div>

          {/* Horizontal Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    showToast(`Filtrando por categoría: ${category}`);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#4355B9] text-white dark:bg-[#BAC3FF] dark:text-[#101F6E] shadow-xs'
                      : 'bg-white dark:bg-[#12181F] text-[#16202A] dark:text-[#E0E3E8] border border-[#CBD2D9]/80 dark:border-[#42474E]/80 hover:bg-[#DEE3EA]/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MASTER AI SUMMARY TOOLBAR */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DDE1FF] dark:bg-[#293CA0]/40 text-[#4355B9] dark:text-[#BAC3FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] block leading-tight">
                Modo Resumen Inteligente VEYA
              </span>
              <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                {expandedSummaryIds.size} de {filteredArticles.length} resúmenes desplegados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAllSummaries}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#4355B9] dark:text-[#BAC3FF] bg-[#DDE1FF]/50 dark:bg-[#293CA0]/30 hover:bg-[#DDE1FF] transition-colors"
            >
              {expandedSummaryIds.size > 0 ? 'Plegar todos' : 'Desplegar todos'}
            </button>
          </div>
        </div>

        {/* 1. LISTA DE TARJETAS DE NOTICIAS CON FORMATO 'COMPACT' (SIN IMÁGENES PESADAS) */}
        <div className="space-y-2.5">
          {filteredArticles.map((article) => {
            const isSummaryExpanded = expandedSummaryIds.has(article.id);

            return (
              <div
                key={article.id}
                className="rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 p-3.5 shadow-xs transition-all hover:border-[#4355B9]/60"
              >
                {/* Header Row: Source, Time, Category & Read Time Indicator */}
                <div className="flex items-center justify-between gap-2 text-[10px] text-[#42474E] dark:text-[#CBD2D9] mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                      {article.source}
                    </span>
                    <span>•</span>
                    <span>{article.publishedTime}</span>
                    <span className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>

                  {/* 4. INDICADOR DE TIEMPO ESTIMADO DE LECTURA */}
                  <div className="flex items-center gap-1 font-mono font-bold text-[#4355B9] dark:text-[#BAC3FF] bg-[#DDE1FF]/40 dark:bg-[#293CA0]/20 px-2 py-0.5 rounded-lg shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTimeEstimate}</span>
                  </div>
                </div>

                {/* 1. Titular Principal en Formato Compact (Sin imágenes pesadas) */}
                <h3 className="text-xs sm:text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-snug">
                  {article.title}
                </h3>

                {/* 3. TOGGLE DE 'RESUMEN IA' PARA CADA TITULAR */}
                <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleToggleCardSummary(article.id, e)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      isSummaryExpanded
                        ? 'bg-[#4355B9] text-white dark:bg-[#BAC3FF] dark:text-[#101F6E]'
                        : 'bg-[#DDE1FF]/60 dark:bg-[#293CA0]/30 text-[#4355B9] dark:text-[#BAC3FF] hover:bg-[#DDE1FF]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Resumen IA</span>
                    {isSummaryExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <a
                    href={article.originalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] font-bold text-[#42474E] dark:text-[#CBD2D9] hover:text-[#4355B9] dark:hover:text-[#BAC3FF] flex items-center gap-1 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Fuente original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* EXPANDED AI SUMMARY SECTION */}
                {isSummaryExpanded && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#DDE1FF] dark:border-[#293CA0]/40 animate-fade-in space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#DDE1FF] dark:bg-[#293CA0]/60 text-[#4355B9] dark:text-[#BAC3FF] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <p className="text-[11px] text-[#16202A] dark:text-[#E0E3E8] leading-relaxed">
                        {article.aiSummary}
                      </p>
                    </div>

                    <div className="pl-7 space-y-1">
                      {article.keyPoints.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-1.5 text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                          <span className="text-[#4355B9] dark:text-[#BAC3FF] font-bold">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-[#42474E] dark:text-[#CBD2D9] pt-1 border-t border-[#CBD2D9]/30 dark:border-[#42474E]/30 font-mono">
                      <span>Procesado por VEYA Local LLM</span>
                      <span>Sin sesgo publicitario</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SETTINGS CARD: EXPRESS BRIEFING & SENSATIONALISM FILTER */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4355B9] dark:text-[#BAC3FF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                Preferencias de Rutina y Moderación
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#4355B9] dark:text-[#BAC3FF] font-mono">En Dispositivo</span>
          </div>

          {/* Sensationalism Filter Switch */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-[11px] block">
                Filtrar noticias de alarma o sensacionalistas
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Prioriza descubrimientos científicos, cultura y avances constructivos.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={filterSensationalism}
                onChange={(e) => {
                  setFilterSensationalism(e.target.checked);
                  showToast(e.target.checked ? 'Filtro anti-clickbait activado' : 'Filtro desactivado');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4355B9]"></div>
            </label>
          </div>

          {/* Morning Routine Express Briefing Max Articles */}
          <div className="pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-[11px] block">
                Titulares en el saludo matinal de VEYA
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Lectura resumida por voz (máximo 60 segundos de audio).
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-xs">
              <button
                type="button"
                onClick={() => setMaxMorningArticles(Math.max(1, maxMorningArticles - 1))}
                className="w-7 h-7 rounded-lg bg-[#DEE3EA] dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] flex items-center justify-center hover:bg-[#CBD2D9]"
              >
                -
              </button>
              <span className="w-6 text-center text-[#4355B9] dark:text-[#BAC3FF]">
                {maxMorningArticles}
              </span>
              <button
                type="button"
                onClick={() => setMaxMorningArticles(Math.min(5, maxMorningArticles + 1))}
                className="w-7 h-7 rounded-lg bg-[#DEE3EA] dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] flex items-center justify-center hover:bg-[#CBD2D9]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: JETPACK COMPOSE M3 SPECIFICATION FOR CLAUDE */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#12181F] rounded-3xl p-5 w-full max-w-2xl border border-[#CBD2D9] dark:border-[#42474E] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#DDE1FF] text-[#4355B9] dark:bg-[#293CA0] dark:text-[#BAC3FF] flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                    Medios RSS: Especificación Jetpack Compose M3
                  </h3>
                  <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                    Tarjetas Compact, FilterChips, Resumen IA y Parser Descentralizado
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] hover:text-[#16202A] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#101418] text-[#E0E3E8] font-mono text-[11px] leading-relaxed space-y-2 border border-[#42474E]">
              <div className="flex justify-between items-center pb-2 border-b border-[#42474E]">
                <span className="text-[#BAC3FF] font-bold">NewsFeedsScreen.kt</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `// NewsFeedsScreen.kt - Jetpack Compose Material 3 implementation
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NewsFeedsScreen(
    onNavigateBack: () -> Unit,
    viewModel: NewsViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Medios de Noticias") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            // 1. Selector de Categorías (FilterChips M3)
            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(state.categories) { cat ->
                        FilterChip(
                            selected = cat == state.selectedCategory,
                            onClick = { viewModel.setCategory(cat) },
                            label = { Text(cat) }
                        )
                    }
                }
            }
            // 2. Lista de Tarjetas Compact (OutlinedCard)
            items(state.articles) { article ->
                CompactNewsCard(
                    article = article,
                    isAiSummaryExpanded = state.expandedArticleIds.contains(article.id),
                    onToggleAiSummary = { viewModel.toggleAiSummary(article.id) }
                )
            }
        }
    }
}`
                    );
                    showToast('Código Compose copiado al portapapeles');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#16202A] hover:bg-[#232F3D] text-xs text-[#BAC3FF] flex items-center gap-1 border border-[#42474E]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Composable</span>
                </button>
              </div>
              <p className="text-slate-500">// Arquitectura Jetpack Compose con parseo RSS nativo y Resumen IA</p>
              <p className="text-purple-400">@OptIn(ExperimentalMaterial3Api::class)</p>
              <p className="text-purple-400">@Composable</p>
              <p className="text-yellow-300">fun NewsFeedsScreen(</p>
              <p className="text-slate-300 pl-4">onNavigateBack: () -&gt; Unit,</p>
              <p className="text-slate-300 pl-4">viewModel: NewsViewModel = hiltViewModel()</p>
              <p className="text-yellow-300">) &#123;</p>
              <p className="text-slate-400 pl-4">// 1. Selector de Categorías FilterChip</p>
              <p className="text-slate-300 pl-4">CategoriesFilterRow(categories = state.categories, selected = state.selectedCat)</p>
              <br />
              <p className="text-slate-400 pl-4">// 2. Tarjetas Compactas con Resumen IA y Tiempo de Lectura</p>
              <p className="text-slate-300 pl-4">CompactNewsCard(title = item.title, source = item.source, readTime = item.readTime)</p>
              <br />
              <p className="text-slate-400 pl-4">// 3. Expansión de Resumen IA</p>
              <p className="text-slate-300 pl-4">AiSummaryView(summary = item.aiSummary, points = item.keyPoints)</p>
              <p className="text-yellow-300">&#125;</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Ver documento: <code className="font-mono text-[#4355B9] dark:text-[#BAC3FF]">entregas/13_specs_screen_news_m3_para_claude.md</code>
              </span>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="py-2 px-4 rounded-xl bg-[#DEE3EA]/70 dark:bg-[#16202A] text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#DEE3EA]"
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
