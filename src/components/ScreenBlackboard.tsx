import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Clock,
  Atom,
  BarChart2,
  Compass,
  Wrench,
  Zap,
  Car,
  Scale,
  Activity,
  Users,
  Cpu,
  PieChart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ChevronRight,
  Box,
} from 'lucide-react';
import { BlackboardTemplateType, PedagogicalLevel, BlackboardSuiteCategory } from '../types';
import { ToolAstronomyPhysics } from './blackboard/ToolAstronomyPhysics';
import { ToolBiologyAnatomy } from './blackboard/ToolBiologyAnatomy';
import { ToolGeoGebraWolfram } from './blackboard/ToolGeoGebraWolfram';
import { EducationalSimulator3D } from './blackboard/EducationalSimulator3D';

interface ScreenBlackboardProps {
  initialTemplate?: BlackboardTemplateType;
  onBack: () => void;
}

export const ScreenBlackboard: React.FC<ScreenBlackboardProps> = ({
  initialTemplate = 'educational_simulator_3d',
  onBack,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<BlackboardTemplateType>(initialTemplate);
  const [pedagogicalLevel, setPedagogicalLevel] = useState<PedagogicalLevel>('cotidiano');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templatesList: { id: BlackboardTemplateType; label: string; icon: any; category: string; badge?: string }[] = [
    // Flagship Pro 3D Educational Simulator
    { id: 'educational_simulator_3d', label: '🧊 Simulador Educativo 3D', icon: Box, category: 'simuladores_3d', badge: '3D ENGINE' },

    // Flagship Pro Suites
    { id: 'nasa_eyes_astronomy', label: "🪐 NASA's Eyes & Stellarium", icon: Compass, category: 'astronomia', badge: 'NASA PRO' },
    { id: 'anatronica_biology', label: '🫀 Anatronica & Smithsonian 3D', icon: Activity, category: 'biologia', badge: '3D LAB' },
    { id: 'geogebra_wolfram', label: '📈 GeoGebra & WolframAlpha', icon: PieChart, category: 'matematicas', badge: 'SOLVER' },
    
    // Core Subject Modules
    { id: 'fractions_math', label: '🍕 Quebrados y Fracciones', icon: PieChart, category: 'matematicas' },
    { id: 'home_circuits', label: '⚡ Electricidad y Fontanería', icon: Wrench, category: 'oficios' },
    { id: 'automotive_engine', label: '🚗 Motor de 4 Tiempos', icon: Car, category: 'oficios' },
    { id: 'practical_law', label: '🛡️ Derecho Cotidiano', icon: Scale, category: 'ciudadania' },
    { id: 'skin_health', label: '🩺 Salud: Piel y Regla ABCD', icon: Activity, category: 'biologia' },
    { id: 'orbits_astronomy', label: '🌊 Mareas y Gravedad Newton', icon: Compass, category: 'astronomia' },
    { id: 'particle_simulator', label: '⚛️ Partículas y Gases', icon: Atom, category: 'fisica' },
    { id: 'distribution_stats', label: '📊 Tablero de Galton', icon: BarChart2, category: 'matematicas' },
    { id: 'behavioral_skills', label: '🤝 Habilidades Sociales (DESC)', icon: Users, category: 'ciudadania' },
    { id: 'ai_neural_concept', label: '🤖 Cómo Aprende la IA', icon: Cpu, category: 'tecnologia' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0E17] text-slate-100 font-['Nunito_Sans'] overflow-hidden select-none">
      {/* Top App Bar */}
      <header className="px-3.5 py-2.5 bg-[#101623]/95 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Volver"
            aria-label="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                Pizarra Universal VEYA
              </h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono font-bold">
                MULTINIVEL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
              Desde quebrados y oficios hasta relatividad e IA
            </p>
          </div>
        </div>

        {/* Pedagogical Depth Level Selector */}
        <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setPedagogicalLevel('cotidiano')}
            className={`px-2 py-1 rounded-lg transition-all ${
              pedagogicalLevel === 'cotidiano'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Explicación intuitiva para adolescentes o sin estudios previos"
          >
            🌱 Cotidiano
          </button>
          <button
            onClick={() => setPedagogicalLevel('practico')}
            className={`px-2 py-1 rounded-lg transition-all ${
              pedagogicalLevel === 'practico'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Aplicado a problemas reales, oficios y vida diaria"
          >
            🔧 Práctico
          </button>
          <button
            onClick={() => setPedagogicalLevel('universitario')}
            className={`px-2 py-1 rounded-lg transition-all ${
              pedagogicalLevel === 'universitario'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Rigor técnico, leyes, fórmulas y fundamentación científica"
          >
            🎓 Avanzado
          </button>
        </div>
      </header>

      {/* Category Pills Bar */}
      <div className="px-3 py-1 bg-[#090D17] border-b border-slate-800/40 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 text-[10px]">
        {[
          { id: 'all', label: '🌟 Todos los Módulos' },
          { id: 'simuladores_3d', label: '🧊 Simulador 3D (Anatomía & Física)' },
          { id: 'astronomia', label: "🪐 Astronomía & NASA's Eyes" },
          { id: 'biologia', label: '🫀 Biología & Anatronica 3D' },
          { id: 'matematicas', label: '📐 GeoGebra & Wolfram' },
          { id: 'oficios', label: '🛠️ Oficios & Automoción' },
          { id: 'ciudadania', label: '🛡️ Ciudadanía & Ley' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-0.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-700 text-cyan-300 border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Template Chips */}
      <div className="px-3 py-1.5 bg-[#0D121D] border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {templatesList
          .filter((t) => selectedCategory === 'all' || t.category === selectedCategory)
          .map((t) => {
            const isActive = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-900/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{t.label}</span>
                {t.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/50">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Dynamic Content Surface */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-3">
        {activeTemplate === 'educational_simulator_3d' && <EducationalSimulator3D level={pedagogicalLevel} />}
        {activeTemplate === 'nasa_eyes_astronomy' && <ToolAstronomyPhysics level={pedagogicalLevel} />}
        {activeTemplate === 'anatronica_biology' && <ToolBiologyAnatomy level={pedagogicalLevel} />}
        {activeTemplate === 'geogebra_wolfram' && <ToolGeoGebraWolfram level={pedagogicalLevel} />}
        {activeTemplate === 'fractions_math' && <TemplateFractionsMath level={pedagogicalLevel} />}
        {activeTemplate === 'home_circuits' && <TemplateHomeCircuits level={pedagogicalLevel} />}
        {activeTemplate === 'automotive_engine' && <TemplateAutomotiveEngine level={pedagogicalLevel} />}
        {activeTemplate === 'practical_law' && <TemplatePracticalLaw level={pedagogicalLevel} />}
        {activeTemplate === 'skin_health' && <TemplateSkinHealth level={pedagogicalLevel} />}
        {activeTemplate === 'orbits_astronomy' && <ToolAstronomyPhysics level={pedagogicalLevel} />}
        {activeTemplate === 'particle_simulator' && <TemplateParticleSimulator level={pedagogicalLevel} />}
        {activeTemplate === 'distribution_stats' && <TemplateDistributionStats level={pedagogicalLevel} />}
        {activeTemplate === 'behavioral_skills' && <TemplateBehavioralSkills level={pedagogicalLevel} />}
        {activeTemplate === 'ai_neural_concept' && <TemplateAiNeuralConcept level={pedagogicalLevel} />}
      </div>
    </div>
  );
};

/* =========================================================================
   1. TEMPLATE: QUEBRADOS, FRACCIONES Y PROPORCIONES MATEMÁTICAS
   ========================================================================= */
const TemplateFractionsMath: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [num1, setNum1] = useState(1);
  const [den1, setDen1] = useState(2);
  const [num2, setNum2] = useState(1);
  const [den2, setDen2] = useState(3);
  const [operation, setOperation] = useState<'+' | '-'>('+');

  // Common denominator calculation
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  const commonDen = lcm(den1, den2);
  const equivNum1 = num1 * (commonDen / den1);
  const equivNum2 = num2 * (commonDen / den2);
  const rawResultNum = operation === '+' ? equivNum1 + equivNum2 : equivNum1 - equivNum2;
  const resultGcd = Math.abs(gcd(rawResultNum, commonDen));
  const simplifiedNum = rawResultNum / (resultGcd || 1);
  const simplifiedDen = commonDen / (resultGcd || 1);
  const decimalVal = (rawResultNum / commonDen).toFixed(2);
  const percentVal = Math.round((rawResultNum / commonDen) * 100);

  return (
    <div className="flex flex-col gap-3">
      {/* Interactive Pizza / Bar Visualizer */}
      <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
        <div className="w-full flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>Visualizador de Fracciones (Quebrados)</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full">
            {percentVal}% del total
          </span>
        </div>

        {/* Dynamic Horizontal Fraction Bars */}
        <div className="w-full space-y-2.5 my-2">
          {/* Fraction 1 Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
              <span>Fracción A: <strong className="text-cyan-400 font-mono text-xs">{num1}/{den1}</strong></span>
              <span className="text-slate-400">Dividida en {den1} partes, tomamos {num1}</span>
            </div>
            <div className="w-full h-7 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex">
              {Array.from({ length: den1 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full border-r border-slate-800 flex items-center justify-center text-[10px] font-bold ${
                    i < num1 ? 'bg-cyan-600 text-white' : 'bg-transparent text-slate-600'
                  }`}
                >
                  1/{den1}
                </div>
              ))}
            </div>
          </div>

          {/* Operation Sign */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setOperation(operation === '+' ? '-' : '+')}
              className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-bold text-sm hover:bg-slate-700 transition-colors"
            >
              Operación: {operation}
            </button>
          </div>

          {/* Fraction 2 Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
              <span>Fracción B: <strong className="text-amber-400 font-mono text-xs">{num2}/{den2}</strong></span>
              <span className="text-slate-400">Dividida en {den2} partes, tomamos {num2}</span>
            </div>
            <div className="w-full h-7 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex">
              {Array.from({ length: den2 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full border-r border-slate-800 flex items-center justify-center text-[10px] font-bold ${
                    i < num2 ? 'bg-amber-600 text-white' : 'bg-transparent text-slate-600'
                  }`}
                >
                  1/{den2}
                </div>
              ))}
            </div>
          </div>

          {/* Common Denominator Unified Bar */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
              <span>Resultado con denominador común ({commonDen}):</span>
              <span className="font-mono text-emerald-400 font-bold text-xs">
                = {simplifiedNum}/{simplifiedDen} ({decimalVal})
              </span>
            </div>
            <div className="w-full h-8 bg-slate-900 border border-emerald-700/60 rounded-xl overflow-hidden flex">
              {Array.from({ length: commonDen }).map((_, i) => {
                const isPart1 = i < equivNum1;
                const isPart2 = operation === '+' ? i >= equivNum1 && i < rawResultNum : false;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full border-r border-slate-800/80 flex items-center justify-center text-[8px] font-bold ${
                      isPart1
                        ? 'bg-cyan-600/90 text-white'
                        : isPart2
                        ? 'bg-amber-600/90 text-white'
                        : 'bg-transparent text-slate-700'
                    }`}
                  >
                    1/{commonDen}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fraction Controls (Sliders / Steppers) */}
        <div className="w-full grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-800">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px]">
            <span className="font-bold text-cyan-300 block mb-1">Ajustar Fracción A:</span>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span>Numerador ({num1}):</span>
              <input
                type="range"
                min="1"
                max={den1}
                value={num1}
                onChange={(e) => setNum1(parseInt(e.target.value))}
                className="w-20 accent-cyan-400 h-1 bg-slate-800"
              />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span>Denominador ({den1}):</span>
              <input
                type="range"
                min="2"
                max="8"
                value={den1}
                onChange={(e) => {
                  const d = parseInt(e.target.value);
                  setDen1(d);
                  if (num1 > d) setNum1(d);
                }}
                className="w-20 accent-cyan-400 h-1 bg-slate-800"
              />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px]">
            <span className="font-bold text-amber-300 block mb-1">Ajustar Fracción B:</span>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span>Numerador ({num2}):</span>
              <input
                type="range"
                min="1"
                max={den2}
                value={num2}
                onChange={(e) => setNum2(parseInt(e.target.value))}
                className="w-20 accent-amber-400 h-1 bg-slate-800"
              />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span>Denominador ({den2}):</span>
              <input
                type="range"
                min="2"
                max="8"
                value={den2}
                onChange={(e) => {
                  const d = parseInt(e.target.value);
                  setDen2(d);
                  if (num2 > d) setNum2(d);
                }}
                className="w-20 accent-amber-400 h-1 bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Level-dependent Pedagogical Explanation */}
        <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          {level === 'cotidiano' && (
            <p>
              🍕 <strong>Analogía de la pizza:</strong> No puedes sumar rebanadas si una pizza está cortada en 2 trozos enormes y la otra en 3 trozos pequeños. Para sumarlas, tienes que cortar ambas en trocitos iguales ({commonDen} trozos). ¡Eso es el mínimo común múltiplo!
            </p>
          )}
          {level === 'practico' && (
            <p>
              📏 <strong>Aplicación en cocina y carpintería:</strong> Si una receta pide 1/2 vaso de leche y luego 1/3 más, necesitas cortar la medida en sextos (3/6 + 2/6 = 5/6 de vaso, o el 83% del recipiente).
            </p>
          )}
          {level === 'universitario' && (
            <p>
              📐 <strong>Estructura algebraica del cuerpo de fracciones:</strong> Las fracciones forman el cuerpo de los números racionales $\mathbb&#123;Q&#125;$, donde la suma se define formalmente como $\frac&#123;a&#125;&#123;b&#125; + \frac&#123;c&#125;&#123;d&#125; = \frac&#123;ad + bc&#125;&#123;bd&#125;$, cerradas bajo operaciones conmutativas y asociativas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. TEMPLATE: ELECTRICIDAD Y FONTANERÍA DEL HOGAR (OFICIOS Y VIVIENDA)
   ========================================================================= */
const TemplateHomeCircuits: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [subMode, setSubMode] = useState<'electric' | 'plumbing'>('electric');

  // Electric State
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [voltage, setVoltage] = useState(12); // V
  const [resistance, setResistance] = useState(4); // Ohms
  const currentAmps = isSwitchClosed ? (voltage / resistance).toFixed(1) : '0.0';
  const bulbPowerWatts = isSwitchClosed ? Math.round((voltage * voltage) / resistance) : 0;

  // Plumbing State
  const [isFaucetOpen, setIsFaucetOpen] = useState(true);
  const [hasWaterSeal, setHasWaterSeal] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      {/* Sub-selector */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => setSubMode('electric')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              subMode === 'electric'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Electricidad: Ley de Ohm
          </button>
          <button
            onClick={() => setSubMode('plumbing')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              subMode === 'plumbing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🚰 Fontanería: Sifón y Desatascos
          </button>
        </div>
      </div>

      {/* 2.1 ELECTRICITY VIEW */}
      {subMode === 'electric' && (
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
          {/* Circuit Canvas SVG */}
          <div className="relative w-full h-[180px] flex items-center justify-center">
            <svg viewBox="-120 -80 240 160" className="w-full h-full max-h-[180px]">
              {/* Circuit loop wire */}
              <rect x="-80" y="-50" width="160" height="100" fill="none" stroke="#475569" strokeWidth="3" rx="8" />

              {/* Battery on left (-80, 0) */}
              <g transform="translate(-80, 0)">
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#38BDF8" strokeWidth="4" />
                <line x1="-8" y1="8" x2="8" y2="8" stroke="#EF4444" strokeWidth="2" />
                <text x="-20" y="-6" fill="#38BDF8" fontSize="8" fontWeight="bold">+</text>
                <text x="-20" y="16" fill="#EF4444" fontSize="8" fontWeight="bold">-</text>
                <text x="-40" y="4" fill="#94A3B8" fontSize="8">{voltage}V</text>
              </g>

              {/* Interactive Switch on top (0, -50) */}
              <g
                transform="translate(0, -50)"
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className="cursor-pointer group"
              >
                <circle cx="-15" cy="0" r="3" fill="#E2E8F0" />
                <circle cx="15" cy="0" r="3" fill="#E2E8F0" />
                {isSwitchClosed ? (
                  <line x1="-15" y1="0" x2="15" y2="0" stroke="#22C55E" strokeWidth="3" />
                ) : (
                  <line x1="-15" y1="0" x2="10" y2="-16" stroke="#EF4444" strokeWidth="3" />
                )}
                <text x="0" y="-18" fill={isSwitchClosed ? '#22C55E' : '#EF4444'} fontSize="8" textAnchor="middle" fontWeight="bold">
                  {isSwitchClosed ? 'Cerrado (Pasa corriente)' : 'Abierto (Pulsar)'}
                </text>
              </g>

              {/* Light Bulb on right (80, 0) */}
              <g transform="translate(80, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  fill={isSwitchClosed ? '#F59E0B' : '#1E293B'}
                  stroke="#FBBF24"
                  strokeWidth="2"
                  filter={isSwitchClosed ? `drop-shadow(0 0 ${Math.min(bulbPowerWatts / 2, 20)}px #FBBF24)` : undefined}
                />
                <text x="0" y="3" fill={isSwitchClosed ? '#000000' : '#64748B'} fontSize="7" fontWeight="bold" textAnchor="middle">
                  {isSwitchClosed ? `${bulbPowerWatts}W` : 'Apagada'}
                </text>
                <text x="30" y="4" fill="#94A3B8" fontSize="8">{resistance}Ω</text>
              </g>

              {/* Electron flow dots if closed */}
              {isSwitchClosed && (
                <>
                  <circle cx="-40" cy="-50" r="2.5" fill="#38BDF8" className="animate-ping" />
                  <circle cx="40" cy="50" r="2.5" fill="#38BDF8" className="animate-ping" />
                </>
              )}
            </svg>
          </div>

          {/* Instruments */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">Voltaje (V)</span>
              <span className="text-xs font-mono font-extrabold text-cyan-400">{voltage} V</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">Intensidad (I)</span>
              <span className="text-xs font-mono font-extrabold text-emerald-400">{currentAmps} A</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">Potencia (P)</span>
              <span className="text-xs font-mono font-extrabold text-amber-400">{bulbPowerWatts} W</span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-2 gap-3 mt-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                <span>Voltaje (Pila):</span>
                <span className="font-mono text-cyan-300">{voltage} V</span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="3"
                value={voltage}
                onChange={(e) => setVoltage(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                <span>Resistencia (Bombilla):</span>
                <span className="font-mono text-amber-300">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={resistance}
                onChange={(e) => setResistance(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            {level === 'cotidiano' && (
              <p>
                💡 <strong>La manguera eléctrica:</strong> El <em>voltaje</em> es la fuerza con la que empujas el agua, la <em>resistencia</em> es lo estrecha que es la manguera y la <em>intensidad</em> son los litros de agua que salen por segundo (<span className="font-mono text-cyan-300">I = V / R</span>).
              </p>
            )}
            {level === 'practico' && (
              <p>
                🔌 <strong>Seguridad en el hogar:</strong> Si la resistencia cae a 0 (cables pelados tocándose), la corriente (amperios) se dispara hacia el infinito, calentando los cables y haciendo saltar el interruptor magnetotérmico para evitar un incendio.
              </p>
            )}
            {level === 'universitario' && (
              <p>
                ⚙️ <strong>Formulación diferencial y disipación de Joule:</strong> Densidad de corriente $\mathbf&#123;J&#125; = \sigma \mathbf&#123;E&#125;$ y potencia disipada por efecto térmico $P = I^2 R = V \cdot I$, base del cálculo de sección de conductores según el Reglamento Electrotécnico de Baja Tensión (REBT).
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2.2 PLUMBING VIEW (SIPHON) */}
      {subMode === 'plumbing' && (
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
          <div className="relative w-full h-[200px] flex items-center justify-center">
            <svg viewBox="-100 -80 200 160" className="w-full h-full max-h-[200px]">
              {/* Sink basin on top */}
              <path d="M -60 -60 L 60 -60 L 40 -20 L -40 -20 Z" fill="#334155" stroke="#64748B" strokeWidth="2" />
              <text x="0" y="-35" fill="#E2E8F0" fontSize="8" textAnchor="middle" fontWeight="bold">
                Lavabo
              </text>

              {/* Faucet stream if open */}
              {isFaucetOpen && (
                <rect x="-3" y="-75" width="6" height="55" fill="#38BDF8" opacity="0.8" />
              )}

              {/* S-shaped Siphon Pipe */}
              <path
                d="M 0 -20 L 0 10 Q 0 40 25 40 Q 50 40 50 15 Q 50 -5 70 -5 L 90 -5"
                fill="none"
                stroke="#64748B"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 0 -20 L 0 10 Q 0 40 25 40 Q 50 40 50 15 Q 50 -5 70 -5 L 90 -5"
                fill="none"
                stroke="#0F172A"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Water Seal trapped in the Siphon bottom */}
              {hasWaterSeal && (
                <path
                  d="M 5 22 Q 10 36 25 36 Q 40 36 45 22"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              )}

              {/* Odor barrier indicator */}
              <g transform="translate(85, -5)">
                <text x="0" y="-8" fill="#F87171" fontSize="7" textAnchor="middle">
                  Alcantarillado
                </text>
                <text x="0" y="16" fill={hasWaterSeal ? '#22C55E' : '#EF4444'} fontSize="7" textAnchor="middle" fontWeight="bold">
                  {hasWaterSeal ? '✓ Sin olores' : '⚠️ Mal olor'}
                </text>
              </g>
            </svg>
          </div>

          <div className="w-full flex items-center justify-between gap-2 mt-2">
            <button
              onClick={() => setIsFaucetOpen(!isFaucetOpen)}
              className="flex-1 py-1.5 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
            >
              {isFaucetOpen ? 'Cerrar Grifo' : 'Abrir Grifo'}
            </button>
            <button
              onClick={() => setHasWaterSeal(!hasWaterSeal)}
              className="flex-1 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold"
            >
              {hasWaterSeal ? 'Evaporar Sello (Sifón seco)' : 'Llenar Sello de Agua'}
            </button>
          </div>

          <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <strong className="text-white block mb-0.5">El secreto de la fontanería: El sello hidráulico</strong>
            El sifón en forma de U siempre retiene un tapón permanente de agua limpia. Ese tapón impide que los gases pestilentes y bacterias del alcantarillado suban por el desagüe hacia tu baño. Si una casa huele mal tras meses vacía, basta con abrir el grifo 5 segundos para reponer el sello evaporado.
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. TEMPLATE: AUTOMOCIÓN (MOTOR DE 4 TIEMPOS)
   ========================================================================= */
const TemplateAutomotiveEngine: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [stroke, setStroke] = useState<0 | 1 | 2 | 3>(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const strokesData = [
    {
      name: '1. Admisión',
      pistonY: 30, // Down
      intakeOpen: true,
      exhaustOpen: false,
      spark: false,
      color: '#38BDF8',
      desc: 'El pistón baja y crea vacío; la válvula de admisión se abre dejando entrar la mezcla de aire y gasolina.',
    },
    {
      name: '2. Compresión',
      pistonY: -20, // Up
      intakeOpen: false,
      exhaustOpen: false,
      spark: false,
      color: '#F59E0B',
      desc: 'Ambas válvulas se cierran herméticamente. El pistón sube comprimiendo la mezcla a alta presión y temperatura.',
    },
    {
      name: '3. Explosión / Combustión',
      pistonY: 25, // Driven Down
      intakeOpen: false,
      exhaustOpen: false,
      spark: true,
      color: '#EF4444',
      desc: 'La bujía lanza una chispa eléctrica. La mezcla explota violentamente empujando el pistón hacia abajo con enorme fuerza útil.',
    },
    {
      name: '4. Escape',
      pistonY: -15, // Up again
      intakeOpen: false,
      exhaustOpen: true,
      spark: false,
      color: '#94A3B8',
      desc: 'Se abre la válvula de escape. El pistón sube barriendo los gases quemados hacia el tubo de escape y catalizador.',
    },
  ];

  const current = strokesData[stroke];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStroke((prev) => ((prev + 1) % 4) as any);
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white">Ciclo Otto de Combustión (Motor 4 Tiempos)</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Engine Cylinder Graphic */}
      <div className="relative w-full h-[200px] flex items-center justify-center">
        <svg viewBox="-80 -90 160 180" className="w-full h-full max-h-[200px]">
          {/* Cylinder block */}
          <rect x="-45" y="-60" width="90" height="120" fill="none" stroke="#475569" strokeWidth="4" rx="2" />

          {/* Spark plug at top (0, -60) */}
          <rect x="-4" y="-72" width="8" height="12" fill="#E2E8F0" />
          {current.spark && (
            <circle cx="0" cy="-56" r="8" fill="#FBBF24" filter="drop-shadow(0 0 8px #EF4444)" />
          )}

          {/* Left Intake Valve */}
          <g transform={`translate(-25, ${current.intakeOpen ? -52 : -58})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={current.intakeOpen ? '#38BDF8' : '#64748B'} strokeWidth="3" />
            <line x1="0" y1="-10" x2="0" y2="0" stroke="#64748B" strokeWidth="2" />
          </g>

          {/* Right Exhaust Valve */}
          <g transform={`translate(25, ${current.exhaustOpen ? -52 : -58})`}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke={current.exhaustOpen ? '#F97316' : '#64748B'} strokeWidth="3" />
            <line x1="0" y1="-10" x2="0" y2="0" stroke="#64748B" strokeWidth="2" />
          </g>

          {/* Piston Head */}
          <g transform={`translate(0, ${current.pistonY})`} className="transition-transform duration-500 ease-in-out">
            <rect x="-42" y="-15" width="84" height="30" fill="#334155" stroke="#64748B" strokeWidth="2" rx="3" />
            {/* Connecting rod */}
            <line x1="0" y1="15" x2="0" y2="55" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            {/* Wrist pin */}
            <circle cx="0" cy="5" r="4" fill="#E2E8F0" />
          </g>
        </svg>
      </div>

      {/* Step Selector */}
      <div className="w-full grid grid-cols-4 gap-1.5 mt-2">
        {strokesData.map((st, idx) => (
          <button
            key={st.name}
            onClick={() => {
              setIsPlaying(false);
              setStroke(idx as any);
            }}
            className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition-all ${
              stroke === idx
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {st.name.split('. ')[1]}
          </button>
        ))}
      </div>

      <div className="w-full mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
        <h4 className="font-bold text-white text-xs mb-1">{current.name}</h4>
        <p className="leading-relaxed">{current.desc}</p>
      </div>
    </div>
  );
};

/* =========================================================================
   4. TEMPLATE: DERECHO PRÁCTICO DEL CIUDADANO (ÁRBOL DE DECISIÓN)
   ========================================================================= */
const TemplatePracticalLaw: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [topic, setTopic] = useState<'rental' | 'warranty' | 'dismissal'>('rental');

  return (
    <div className="flex flex-col gap-3">
      {/* Category selector */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setTopic('rental')}
          className={`flex-1 py-1 rounded-lg transition-colors ${
            topic === 'rental' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          🏠 Fianza de Alquiler
        </button>
        <button
          onClick={() => setTopic('warranty')}
          className={`flex-1 py-1 rounded-lg transition-colors ${
            topic === 'warranty' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          🛍️ Garantía 3 Años
        </button>
        <button
          onClick={() => setTopic('dismissal')}
          className={`flex-1 py-1 rounded-lg transition-colors ${
            topic === 'dismissal' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          💼 Despido y Derechos
        </button>
      </div>

      {topic === 'rental' && (
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl text-[11px] text-slate-300 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white text-xs">¿El casero no te devuelve la fianza tras dejar el piso?</h4>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full">Art. 36 LAU</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <strong className="text-white block">Plazo legal de 30 días naturales</strong>
                El arrendador tiene exactamente un mes desde la entrega de llaves para revisar el inmueble y liquidar la fianza.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <strong className="text-white block">Desgaste por uso habitual no es daño</strong>
                Pintar paredes por uso normal o pequeños arañazos inevitables no pueden descontarse legalmente de la fianza.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
              <div>
                <strong className="text-white block">Si pasa el mes: Intereses de demora</strong>
                A partir del día 31 devenga automáticamente el interés legal del dinero a tu favor. Burofax con acuse de recibo para reclamar antes de ir al juzgado.
              </div>
            </div>
          </div>
        </div>
      )}

      {topic === 'warranty' && (
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl text-[11px] text-slate-300 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white text-xs">Garantía Legal de Consumo en España</h4>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full">RDL 1/2007 (Modif. 2022)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-white block">3 Años de Garantía</span>
              Para cualquier producto nuevo comprado a partir del 1 de enero de 2022.
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-white block">2 Años de Presunción</span>
              Si se estropea en los primeros 2 años, la ley presume que venía roto de fábrica (no tienes que pagar peritaje).
            </div>
          </div>
        </div>
      )}

      {topic === 'dismissal' && (
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl text-[11px] text-slate-300 space-y-2">
          <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">Despido Laboral: Plazo estricto</h4>
          <p>
            Tienes <strong>20 días hábiles improrrogables</strong> (no cuentan sábados, domingos ni festivos) para presentar la papeleta de conciliación en el SMAC si no estás de acuerdo con la causa o el finiquito.
          </p>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   5. TEMPLATE: SALUD Y PIEL (CÁNCER DE PIEL Y REGLA ABCD DEL MELANOMA)
   ========================================================================= */
const TemplateSkinHealth: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [selectedRule, setSelectedRule] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const abcdRules = {
    A: {
      letter: 'A',
      title: 'Asimetría',
      benign: 'Simétrico: Si trazas una línea por la mitad, las dos mitades son iguales.',
      malignant: 'Asimétrico: Una mitad del lunar no coincide con la otra mitad.',
      advice: 'Cualquier lunar que crezca de forma irregular debe ser revisado por un dermatólogo.',
    },
    B: {
      letter: 'B',
      title: 'Bordes',
      benign: 'Bordes regulares: Límites definidos, suaves y nítidos.',
      malignant: 'Bordes irregulares: Bordes dentados, borrosos, ondulados o con picos.',
      advice: 'Los melanomas tienden a invadir el tejido circundante de forma despareja.',
    },
    C: {
      letter: 'C',
      title: 'Color',
      benign: 'Color homogéneo: Un solo tono uniforme de marrón o canela.',
      malignant: 'Policromía: Múltiples tonos mezclados (negro, marrón oscuro, rojizo o blanco).',
      advice: 'La presencia de zonas azuladas o muy oscuras requiere atención inmediata.',
    },
    D: {
      letter: 'D',
      title: 'Diámetro y Evolución',
      benign: 'Menor de 6 mm: Menor que la goma de borrar de un lápiz.',
      malignant: 'Mayor de 6 mm o cambios rápidos de tamaño, picor o sangrado.',
      advice: 'La "E" de evolución es clave: si un lunar viejo cambia de pronto, ve al médico.',
    },
  };

  const current = abcdRules[selectedRule];

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <h3 className="text-xs font-bold text-white">Detección Precoz: Regla ABCD del Melanoma</h3>
          <p className="text-[10px] text-slate-400">Autoexamen visual de lunares para salvar vidas</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full font-bold">
          99% Curable si es precoz
        </span>
      </div>

      {/* Rule selector pills */}
      <div className="grid grid-cols-4 gap-1.5">
        {(['A', 'B', 'C', 'D'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRule(r)}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRule === r
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {r} - {abcdRules[r].title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Visual Comparator */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/50">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lunar Normal (Benigno)</span>
          </div>
          <div className="w-16 h-16 mx-auto my-2 rounded-full bg-amber-800/80 border-2 border-emerald-500/40" />
          <p className="text-[10px] text-slate-300 leading-tight">{current.benign}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/50">
          <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Signo de Alarma (Sospechoso)</span>
          </div>
          <div
            className="w-16 h-16 mx-auto my-2 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-tr from-stone-900 via-rose-950 to-amber-900 border-2 border-rose-500/60"
          />
          <p className="text-[10px] text-slate-300 leading-tight">{current.malignant}</p>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
        <strong>Consejo dermatológico:</strong> {current.advice}
      </div>
    </div>
  );
};

/* =========================================================================
   6. TEMPLATES (REUTILIZADOS Y REFINADOS): ASTRONOMÍA, PARTÍCULAS, GALTON
   ========================================================================= */
const TemplateOrbitsAstronomy: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [moonAngle, setMoonAngle] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMoonAngle((prev) => (prev + 0.8) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const normAngle = Math.abs((moonAngle % 180) - 90);
  const isSpringTide = normAngle > 55;
  const isNeapTide = normAngle < 35;

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white">Simulador de Mareas y Gravedad Diferencial</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center">
        <svg viewBox="-160 -100 320 200" className="w-full h-full max-h-[180px]">
          {/* Sunlight */}
          <circle cx="-140" cy="0" r="16" fill="#F59E0B" filter="drop-shadow(0 0 10px #FBBF24)" />
          <text x="-140" y="26" fill="#FDE68A" fontSize="8" textAnchor="middle" fontWeight="bold">Sol</text>

          {/* Moon Orbit */}
          <circle cx="0" cy="0" r="75" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Tidal Ellipse */}
          <g transform={`rotate(${moonAngle})`}>
            <ellipse cx="0" cy="0" rx={32 + (isSpringTide ? 8 : isNeapTide ? 2 : 5)} ry="25" fill="#0284C7" opacity="0.5" />
          </g>

          {/* Earth */}
          <circle cx="0" cy="0" r="24" fill="#0369A1" />
          <text x="0" y="3" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Tierra</text>

          {/* Moon */}
          {(() => {
            const rad = (moonAngle * Math.PI) / 180;
            const mx = Math.cos(rad) * 75;
            const my = Math.sin(rad) * 75;
            return (
              <g transform={`translate(${mx}, ${my})`}>
                <circle cx="0" cy="0" r="9" fill="#E2E8F0" />
                <text x="0" y="16" fill="#E2E8F0" fontSize="7" textAnchor="middle">Luna</text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 mt-2">
        <strong>{isSpringTide ? '🌊 Marea Viva (Sizigia)' : isNeapTide ? '⚓ Marea Muerta (Cuadratura)' : 'Marea Intermedia'}:</strong>{' '}
        {isSpringTide
          ? 'El Sol y la Luna están alineados; sus gravedades se suman generando mareas altísimas.'
          : 'La Luna forma un ángulo recto de 90° con el Sol; las fuerzas gravitatorias se contrarrestan parcialmente.'}
      </div>
    </div>
  );
};

const TemplateParticleSimulator: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [temperature, setTemperature] = useState(300);
  const [count, setCount] = useState(35);
  const pressure = ((count * (temperature / 300)) / 25).toFixed(2);

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-white">Cinética de Gases: Ley de los Gases Ideales</h3>
        <span className="text-[10px] font-mono text-cyan-400 font-bold">P = {pressure} atm</span>
      </div>

      <div className="w-full h-36 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
        {/* Animated particle dots */}
        {Array.from({ length: Math.min(count, 40) }).map((_, i) => (
          <div
            key={i}
            style={{
              top: `${(i * 19) % 85}%`,
              left: `${(i * 27) % 90}%`,
              animationDuration: `${Math.max(0.4, 2.5 - temperature / 350)}s`,
            }}
            className="w-2 h-2 rounded-full bg-cyan-400 absolute animate-ping"
          />
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-3 text-[10px]">
        <div>
          <div className="flex justify-between text-slate-300 font-bold mb-1">
            <span>Temperatura (T):</span>
            <span className="font-mono text-cyan-300">{temperature} K</span>
          </div>
          <input
            type="range"
            min="100"
            max="700"
            step="50"
            value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-800"
          />
        </div>
        <div>
          <div className="flex justify-between text-slate-300 font-bold mb-1">
            <span>Moléculas (N):</span>
            <span className="font-mono text-amber-300">{count}</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full accent-amber-400 h-1 bg-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

const TemplateDistributionStats: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [balls, setBalls] = useState([2, 8, 22, 45, 60, 48, 24, 7, 2]);
  const addDrop = () => {
    setBalls((prev) => prev.map((v, i) => (i === 4 ? v + 4 : i === 3 || i === 5 ? v + 3 : v + 1)));
  };

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-white">Tablero de Galton: Campana de Gauss</h3>
        <button
          onClick={addDrop}
          className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold"
        >
          + Soltar Bolas
        </button>
      </div>

      <div className="w-full h-32 flex items-end gap-1 px-2 border-b-2 border-slate-700">
        {balls.map((v, idx) => (
          <div
            key={idx}
            style={{ height: `${Math.min((v / 70) * 100, 100)}%` }}
            className="flex-1 bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t transition-all duration-200"
          />
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center">
        Aunque cada bola toma decisiones 50/50 puramente aleatorias, la suma colectiva siempre genera la distribución normal simétrica.
      </p>
    </div>
  );
};

/* =========================================================================
   7. TEMPLATE: HABILIDADES SOCIALES Y COMUNICACIÓN ASERTIVA (DESC)
   ========================================================================= */
const TemplateBehavioralSkills: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [descStep, setDescStep] = useState<0 | 1 | 2 | 3>(0);

  const descSteps = [
    {
      letter: 'D',
      title: 'Describir los hechos objetivos',
      rule: 'Habla solo de lo que una cámara de vídeo podría grabar, sin juicios ni adjetivos hirientes.',
      example: '«Ayer habíamos quedado a las 18:00 y llegaste a las 18:35 sin avisar.»',
      antiExample: '❌ «Siempre eres un irresponsable y pasas de mí.»',
    },
    {
      letter: 'E',
      title: 'Expresar en primera persona cómo te sientes',
      rule: 'Habla desde tu emoción (yo me sentí...) en vez de culpar al otro con dedos acusadores.',
      example: '«Me sentí preocupado esperando en la calle y me dio la sensación de que mi tiempo no se valoraba.»',
      antiExample: '❌ «Me cabrea lo desconsiderado que eres.»',
    },
    {
      letter: 'S',
      title: 'Sugerir una petición concreta',
      rule: 'Pide una acción específica, medible y realizable, no un cambio genérico de personalidad.',
      example: '«La próxima vez que te retrases más de 10 minutos, avísame con un mensaje antes.»',
      antiExample: '❌ «A ver si maduras de una vez.»',
    },
    {
      letter: 'C',
      title: 'Concretar consecuencias positivas',
      rule: 'Explica el beneficio mutuo que ambos ganarán al cumplir el acuerdo.',
      example: '«Así yo podré aprovechar ese tiempo para hacer recados y los dos nos veremos tranquilos.»',
      antiExample: '❌ «O haces eso o no te vuelvo a esperar.»',
    },
  ];

  const current = descSteps[descStep];

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl text-[11px] text-slate-300 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-white">Técnica Asertiva DESC: Resolver Conflictos sin Violencia</h3>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full font-bold">
          Paso {descStep + 1} de 4
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {descSteps.map((st, i) => (
          <button
            key={st.letter}
            onClick={() => setDescStep(i as any)}
            className={`py-1.5 rounded-xl font-bold text-center transition-all ${
              descStep === i
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {st.letter}
          </button>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
            {current.letter}
          </span>
          <span>{current.title}</span>
        </h4>
        <p className="text-slate-300 leading-relaxed">{current.rule}</p>
        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-200">
          <span className="font-bold block text-[10px] uppercase text-emerald-400 mb-0.5">Forma Asertiva:</span>
          {current.example}
        </div>
        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/40 text-rose-300 text-[10px]">
          {current.antiExample}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. TEMPLATE: INTELIGENCIA ARTIFICIAL (LA NEURONA ARTIFICIAL Y LOS PESOS)
   ========================================================================= */
const TemplateAiNeuralConcept: React.FC<{ level: PedagogicalLevel }> = ({ level }) => {
  const [weight1, setWeight1] = useState(1.2);
  const [weight2, setWeight2] = useState(-0.8);
  const [bias, setBias] = useState(0.0);

  return (
    <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-white">¿Cómo aprende una IA? La Frontera de Decisión</h3>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full font-bold">
          Perceptrón Simple
        </span>
      </div>

      {/* 2D Decision Plane Visualizer */}
      <div className="w-full h-36 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
        {/* Category A Dots (Blue) */}
        <div className="w-3 h-3 rounded-full bg-cyan-400 absolute top-6 left-12" />
        <div className="w-3 h-3 rounded-full bg-cyan-400 absolute top-10 left-20" />
        <div className="w-3 h-3 rounded-full bg-cyan-400 absolute top-8 left-28" />

        {/* Category B Dots (Amber) */}
        <div className="w-3 h-3 rounded-full bg-amber-400 absolute bottom-6 right-12" />
        <div className="w-3 h-3 rounded-full bg-amber-400 absolute bottom-10 right-20" />
        <div className="w-3 h-3 rounded-full bg-amber-400 absolute bottom-8 right-28" />

        {/* Separating Decision Line */}
        <div
          style={{
            transform: `rotate(${weight1 * 25}deg) translateY(${bias * 20}px)`,
          }}
          className="w-56 h-0.5 bg-rose-500 absolute transition-transform duration-150 shadow-[0_0_8px_#F43F5E]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <span className="font-bold text-slate-300 block mb-1">Peso w1 (Inclinación): {weight1}</span>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={weight1}
            onChange={(e) => setWeight1(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-800"
          />
        </div>
        <div>
          <span className="font-bold text-slate-300 block mb-1">Sesgo Bias (Desplazamiento): {bias}</span>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={bias}
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full accent-amber-400 h-1 bg-slate-800"
          />
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
        <strong>Aprender es ajustar perillas:</strong> La neurona artificial calcula $y = w_1 \cdot x_1 + w_2 \cdot x_2 + b$. Entrenar una IA no es programar reglas a mano, sino mover automáticamente la línea roja hasta separar perfectamente los puntos azules de los amarillos sin cometer errores.
      </div>
    </div>
  );
};
