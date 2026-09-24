import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Layers,
  Sparkles,
  Info,
  Sliders,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { PedagogicalLevel } from '../../types';

interface ToolBiologyAnatomyProps {
  level: PedagogicalLevel;
}

type BiologySubView =
  | 'anatronica_body'    // Anatronica 3D: Human Body Systems (Heart, Brain, Lungs, Skeleton)
  | 'smithsonian_3d'     // Smithsonian 3D: Natural History & Fossils Lab
  | 'cell_microscopy'    // Cellular Biology: Eukaryotic Cell 3D & Organelles
  | 'dermatology_abcd';  // Dermatology: Skin layers & Melanoma ABCD rule

interface OrganInfo {
  id: string;
  name: string;
  system: string;
  icon: string;
  vitalFunction: string;
  commonPathology: string;
  prevention: string;
  advancedPhysiology: string;
}

const ORGANS: Record<string, OrganInfo> = {
  heart: {
    id: 'heart',
    name: 'Corazón (Miocardio)',
    system: 'Cardiovascular',
    icon: '❤️',
    vitalFunction: 'Bomba muscular con 4 cámaras que impulsa ~5 litros de sangre por minuto a todo el organismo a través de 100.000 km de vasos sanguíneos.',
    commonPathology: 'Infarto agudo de miocardio por oclusión de arterias coronarias o arritmias ventriculares.',
    prevention: 'Dieta mediterránea, ejercicio aeróbico regular, evitar tabaquismo y control de presión arterial (<120/80 mmHg).',
    advancedPhysiology: 'Ley de Frank-Starling: a mayor retorno venoso y estiramiento del miocito, mayor fuerza contráctil sistólica. Gasto cardíaco Q = FC × VS.',
  },
  brain: {
    id: 'brain',
    name: 'Cerebro y Sistema Nervioso',
    system: 'Nervioso Central',
    icon: '🧠',
    vitalFunction: 'Órgano rector de 1.4 kg con 86.000 millones de neuronas que procesa pensamientos, emociones, memoria, movimiento y homeostasis.',
    commonPathology: 'Accidente cerebrovascular (ictus isquémico o hemorrágico), migrañas crónicas y enfermedades neurodegenerativas.',
    prevention: 'Sueño reparador de 7-8 horas, estimulación cognitiva constante, gestión del estrés y protección craneal.',
    advancedPhysiology: 'Transmisión sináptica mediante potencial de acción despolarizante dependiente de canales de Na⁺/K⁺ voltaje-dependientes.',
  },
  lungs: {
    id: 'lungs',
    name: 'Pulmones y Árbol Bronquial',
    system: 'Respiratorio',
    icon: '🫁',
    vitalFunction: 'Hematosis: intercambio de gases en 300 millones de alvéolos microscópicos, capturando O2 del aire e intercambiándolo por CO2 de desecho.',
    commonPathology: 'EPOC (enfermedad pulmonar obstructiva crónica), asma bronquial y neumonías bacterianas/víricas.',
    prevention: 'Aire limpio, no fumar, vacunación antigripal/neumocócica y ventilación adecuada en espacios cerrados.',
    advancedPhysiology: 'Difusión pasiva según la Ley de Fick a través de la membrana alvéolo-capilar de tan solo 0.5 micrómetros de espesor.',
  },
  kidneys: {
    id: 'kidneys',
    name: 'Riñones y Sistema Renal',
    system: 'Excretor / Renal',
    icon: '🫘',
    vitalFunction: 'Filtra 180 litros de sangre al día a través de 2 millones de nefronas, regulando la presión arterial, electrolitos y expulsando toxinas.',
    commonPathology: 'Insuficiencia renal crónica, cólicos nefríticos por litiasis (piedras) e infecciones del tracto urinario.',
    prevention: 'Hidratación suficiente (1.5-2L agua/día), moderar el consumo de sal (<5g/día) y evitar abuso de antiinflamatorios (AINEs).',
    advancedPhysiology: 'Regulación del filtrado glomerular por el sistema renina-angiotensina-aldosterona (SRAA) y hormona antidiurética (ADH).',
  },
  skeleton: {
    id: 'skeleton',
    name: 'Sistema Óseo y Articular',
    system: 'Locomotor',
    icon: '🦴',
    vitalFunction: 'Armazón de 206 huesos que protege órganos nobles, permite el movimiento como palancas biomecánicas y aloja la médula ósea hematopoyética.',
    commonPathology: 'Osteoporosis (pérdida de densidad mineral ósea), fracturas por sobrecarga y artrosis degenerativa.',
    prevention: 'Ingesta de calcio y vitamina D (exposición solar moderada) y entrenamiento de fuerza con impacto.',
    advancedPhysiology: 'Remodelado óseo dinámico continuo mediado por el balance acoplado entre osteoclastos (resorción) y osteoblastos (formación).',
  },
};

export const ToolBiologyAnatomy: React.FC<ToolBiologyAnatomyProps> = ({ level }) => {
  const [subView, setSubView] = useState<BiologySubView>('anatronica_body');
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>('heart');
  const [bpm, setBpm] = useState<number>(72);
  const [heartPhase, setHeartPhase] = useState<'systole' | 'diastole'>('diastole');

  // Smithsonian specimen state
  const [fossilSpecimen, setFossilSpecimen] = useState<'trex' | 'trilobite' | 'lucy'>('trex');
  const [fossilRotation, setFossilRotation] = useState<number>(0);

  // Dermatology ABCD test state
  const [skinLesionType, setSkinLesionType] = useState<'benign' | 'malignant'>('benign');

  // Heartbeat animation loop
  useEffect(() => {
    const intervalMs = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      setHeartPhase((prev) => (prev === 'diastole' ? 'systole' : 'diastole'));
    }, intervalMs / 2);
    return () => clearInterval(timer);
  }, [bpm]);

  const activeOrgan = ORGANS[selectedOrganKey] || ORGANS.heart;

  return (
    <div className="bg-[#0A0F1D] border border-slate-800 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 text-slate-100">
      {/* Header with Sub-Tool Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/50 flex items-center justify-center">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Laboratorio Anatómico y Biológico VEYA
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/60">
                ANATRONICA & SMITHSONIAN 3D
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cuerpo humano interactivo, cardiología 4D, fósiles 3D y dermatología clínica
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'anatronica_body', label: '🫀 Anatronica 3D (Cuerpo y Órganos)' },
          { id: 'smithsonian_3d', label: '🦖 Smithsonian 3D (Fósiles y Evolución)' },
          { id: 'cell_microscopy', label: '🔬 Microscopio Celular (Célula 3D)' },
          { id: 'dermatology_abcd', label: '🩺 Dermatología: Piel y Regla ABCD' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubView(tab.id as BiologySubView)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              subView === tab.id
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-950/50 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =====================================================================
          SUB-VIEW 1: ANATRONICA 3D HUMAN BODY & CARDIOLOGY SIMULATOR
          ===================================================================== */}
      {subView === 'anatronica_body' && (
        <div className="flex flex-col gap-3">
          {/* Organ Systems Navigation Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {Object.values(ORGANS).map((org) => (
              <button
                key={org.id}
                onClick={() => setSelectedOrganKey(org.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedOrganKey === org.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{org.icon}</span>
                <span>{org.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Interactive Anatomical Display Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Visualizer Canvas / Schematic (Left 7 cols) */}
            <div className="md:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-3.5 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
              {/* Specialized Interactive View for Heart */}
              {selectedOrganKey === 'heart' && (
                <div className="flex flex-col items-center justify-center w-full">
                  {/* Dynamic 4D Beating Heart Vector */}
                  <div className="relative flex items-center justify-center my-3">
                    <div
                      style={{
                        transform: `scale(${heartPhase === 'systole' ? 0.92 : 1.08})`,
                      }}
                      className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-rose-700 via-rose-500 to-rose-400 shadow-[0_0_40px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center transition-transform duration-200 relative border-2 border-rose-300"
                    >
                      <Heart className="w-16 h-16 text-rose-100 fill-rose-100/90" />
                      <span className="text-[10px] font-bold text-white font-mono uppercase tracking-wider mt-1">
                        {heartPhase === 'systole' ? 'Sístole (Vaciado)' : 'Diástole (Llenado)'}
                      </span>
                    </div>

                    {/* Blood vessel glow pathways */}
                    <div className="absolute -top-3 w-4 h-6 bg-red-500 rounded-t-full shadow-[0_0_12px_#EF4444]" title="Aorta" />
                    <div className="absolute -top-3 -right-2 w-3.5 h-6 bg-blue-500 rounded-t-full shadow-[0_0_12px_#3B82F6]" title="Vena Cava" />
                  </div>

                  {/* Real-time ECG Trace Simulation */}
                  <div className="w-full bg-[#050B14] p-2 rounded-xl border border-slate-800/80 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-pulse" /> ECG DII (Derivación II)
                      </span>
                      <span className="text-slate-400">{bpm} BPM ({heartPhase})</span>
                    </div>
                    {/* SVG ECG Waveform */}
                    <svg className="w-full h-10 overflow-hidden">
                      <path
                        d="M 0 20 L 30 20 L 35 15 L 40 20 L 50 20 L 55 5 L 60 35 L 65 20 L 75 20 L 85 10 L 95 20 L 140 20 L 145 15 L 150 20 L 160 20 L 165 5 L 170 35 L 175 20 L 185 20 L 195 10 L 205 20 L 260 20 L 265 15 L 270 20 L 280 20 L 285 5 L 290 35 L 295 20 L 305 20 L 315 10 L 325 20 L 380 20"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>

                  {/* BPM Rate Slider */}
                  <div className="w-full mt-2 flex items-center gap-2 text-xs">
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">Ritmo:</span>
                    <input
                      type="range"
                      min="45"
                      max="150"
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
                    />
                    <span className="font-mono text-rose-300 font-bold text-xs whitespace-nowrap">
                      {bpm} lat/min
                    </span>
                  </div>
                </div>
              )}

              {/* View for Brain */}
              {selectedOrganKey === 'brain' && (
                <div className="flex flex-col items-center justify-center p-2 w-full">
                  <div className="w-32 h-28 rounded-full bg-gradient-to-tr from-purple-800 via-pink-600 to-indigo-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center border border-purple-300 relative">
                    <span className="text-3xl">🧠</span>
                    <span className="text-[9px] font-bold text-white mt-1">Córtex Cerebral</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 w-full mt-3 text-[10px]">
                    <div className="p-1.5 rounded bg-purple-950/60 border border-purple-800/50">
                      <span className="font-bold text-purple-300 block">Lóbulo Frontal</span>
                      <span className="text-slate-400">Toma de decisiones, lenguaje motor (Broca)</span>
                    </div>
                    <div className="p-1.5 rounded bg-indigo-950/60 border border-indigo-800/50">
                      <span className="font-bold text-indigo-300 block">Lóbulo Temporal</span>
                      <span className="text-slate-400">Memoria (hipocampo), audición, emociones</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View for Lungs */}
              {selectedOrganKey === 'lungs' && (
                <div className="flex flex-col items-center justify-center p-2 w-full">
                  <div className="flex items-center gap-4 my-2">
                    <div className="w-16 h-28 rounded-l-3xl bg-cyan-700/80 border border-cyan-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      🫁
                    </div>
                    <div className="w-16 h-28 rounded-r-3xl bg-cyan-700/80 border border-cyan-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      🫁
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-200 text-center w-full">
                    300 millones de alvéolos · Superficie de intercambio de ~70 m² (como una pista de tenis)
                  </div>
                </div>
              )}

              {/* View for Skeleton */}
              {selectedOrganKey === 'skeleton' && (
                <div className="flex flex-col items-center justify-center p-2 w-full">
                  <div className="text-4xl my-2">🦴</div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 text-center w-full">
                    206 huesos articulados. El fémur es el más largo y resistente (soporta hasta 30 veces el peso corporal).
                  </div>
                </div>
              )}

              {/* View for Kidneys */}
              {selectedOrganKey === 'kidneys' && (
                <div className="flex flex-col items-center justify-center p-2 w-full">
                  <div className="text-4xl my-2">🫘</div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-200 text-center w-full">
                    Filtra y depura el plasma sanguíneo 60 veces al día para mantener el equilibrio osmótico y de pH.
                  </div>
                </div>
              )}
            </div>

            {/* Medical Data Card (Right 5 cols) */}
            <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2.5">
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{activeOrgan.icon}</span>
                  <span>{activeOrgan.name}</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {activeOrgan.system}
                </span>
              </div>

              {/* Vital function */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Función Vital
                </span>
                <p className="text-xs text-slate-200 leading-relaxed mt-0.5">
                  {activeOrgan.vitalFunction}
                </p>
              </div>

              {/* Pathology & Prevention */}
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-rose-400 block text-[11px]">
                  ⚠️ Patología más frecuente:
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{activeOrgan.commonPathology}</p>

                <span className="font-bold text-emerald-400 block text-[11px] mt-1.5">
                  🛡️ Pauta preventiva:
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{activeOrgan.prevention}</p>
              </div>

              {/* Pedagogical insight */}
              <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200">
                {level === 'cotidiano' && (
                  <p>
                    <strong>Para entenderlo fácil:</strong> Si el cuerpo humano fuera un coche, este órgano actuaría como una pieza clave indispensable sin la cual todo el motor se apagaría en cuestión de segundos.
                  </p>
                )}
                {level === 'practico' && (
                  <p>
                    <strong>Primeros auxilios:</strong> Ante dolor torácico opresivo irradiado a mandíbula o brazo izquierdo, llamar inmediatamente al 112 y mantener al paciente en reposo semisentado.
                  </p>
                )}
                {level === 'universitario' && (
                  <p>
                    <strong>Fisiología avanzada:</strong> {activeOrgan.advancedPhysiology}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: SMITHSONIAN 3D LAB (FOSSILS & NATURAL HISTORY)
          ===================================================================== */}
      {subView === 'smithsonian_3d' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🦖</span>
                <h4 className="text-xs font-bold text-white">
                  Smithsonian 3D: Especímenes de Historia Natural y Fósiles
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                LABORATORIO EVOLUTIVO
              </span>
            </div>

            {/* Specimen Switcher */}
            <div className="flex items-center gap-2">
              {[
                { id: 'trex', label: 'Cráneo de T-Rex (66 Ma)' },
                { id: 'trilobite', label: 'Trilobite Cámbrico (500 Ma)' },
                { id: 'lucy', label: 'Homínido "Lucy" (3.2 Ma)' },
              ].map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setFossilSpecimen(spec.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    fossilSpecimen === spec.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>

            {/* 3D Specimen Interactive Canvas */}
            <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
              <div
                style={{
                  transform: `rotateY(${fossilRotation}deg)`,
                }}
                className="transition-transform duration-100 flex flex-col items-center justify-center cursor-grab"
              >
                {fossilSpecimen === 'trex' && (
                  <div className="flex flex-col items-center">
                    <span className="text-6xl">🦖</span>
                    <span className="text-xs font-bold text-amber-400 mt-2">Tyrannosaurus rex</span>
                    <span className="text-[10px] font-mono text-slate-400">Espécimen Smithsonian USNM 555000</span>
                  </div>
                )}
                {fossilSpecimen === 'trilobite' && (
                  <div className="flex flex-col items-center">
                    <span className="text-6xl">🪲</span>
                    <span className="text-xs font-bold text-emerald-400 mt-2">Elrathia kingii (Trilobite)</span>
                    <span className="text-[10px] font-mono text-slate-400">Esquistos de Wheeler, Utah</span>
                  </div>
                )}
                {fossilSpecimen === 'lucy' && (
                  <div className="flex flex-col items-center">
                    <span className="text-6xl">🦴</span>
                    <span className="text-xs font-bold text-purple-400 mt-2">Australopithecus afarensis</span>
                    <span className="text-[10px] font-mono text-slate-400">Hadar, Etiopía (AL 288-1)</span>
                  </div>
                )}
              </div>

              {/* Rotation Slider */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400">Rotación 360°:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={fossilRotation}
                  onChange={(e) => setFossilRotation(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-800"
                />
                <span className="text-[10px] font-mono text-amber-300">{fossilRotation}°</span>
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              {fossilSpecimen === 'trex' && (
                <p>
                  <strong>Fuerza de mordida y visión tridimensional:</strong> Con una fuerza calculada de 35.000 Newtons, sus mandíbulas pulverizaban huesos con facilidad. Las cuencas oculares orientadas hacia adelante le otorgaban percepción de profundidad binocular para cazar como un halcón actual.
                </p>
              )}
              {fossilSpecimen === 'trilobite' && (
                <p>
                  <strong>Los primeros ojos de la Tierra:</strong> Vivieron durante 270 millones de años (más tiempo del que llevan los dinosaurios y mamíferos juntos). Sus ojos estaban compuestos por prismas de calcita pura inorgánica sin necesidad de lentes orgánicas flexibles.
                </p>
              )}
              {fossilSpecimen === 'lucy' && (
                <p>
                  <strong>El origen del bipedismo:</strong> La pelvis y la orientación del fémur de Lucy demostraron en 1974 que nuestros ancestros comenzaron a caminar erguidos sobre dos piernas mucho antes de que el cerebro experimentara su gran expansión craneal.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: CELLULAR MICROSCOPY (EUKARYOTIC CELL 3D)
          ===================================================================== */}
      {subView === 'cell_microscopy' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🔬</span>
                <h4 className="text-xs font-bold text-white">
                  Microscopio 3D: Estructura de la Célula Eucariota
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                AUMENTO 20.000X
              </span>
            </div>

            {/* Concentric Cell Cutaway */}
            <div className="relative w-full h-60 bg-[#040812] rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Outer Plasma Membrane */}
              <div className="w-52 h-52 rounded-full border-2 border-cyan-500/80 bg-cyan-950/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <span className="absolute top-2 text-[9px] font-mono text-cyan-400">
                  Membrana Plasmática Bicapa
                </span>

                {/* Cytoplasm with Organelles */}
                {/* Mitochondria 1 */}
                <div className="absolute top-8 left-8 w-8 h-4 rounded-full bg-amber-600 border border-amber-300 flex items-center justify-center text-[7px] font-bold text-white shadow-sm" title="Mitocondria (Genera ATP)">
                  ATP
                </div>
                {/* Mitochondria 2 */}
                <div className="absolute bottom-8 right-8 w-8 h-4 rounded-full bg-amber-600 border border-amber-300 flex items-center justify-center text-[7px] font-bold text-white shadow-sm" title="Mitocondria">
                  ATP
                </div>
                {/* Ribosomes / Golgi dots */}
                <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-emerald-400" title="Ribosoma" />
                <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-emerald-400" title="Ribosoma" />

                {/* Inner Nucleus */}
                <div className="w-24 h-24 rounded-full border-2 border-purple-400 bg-purple-950/80 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {/* Nucleolus */}
                  <div className="w-10 h-10 rounded-full bg-purple-600 border border-purple-300 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">ADN</span>
                  </div>
                  <span className="text-[9px] font-bold text-purple-300 mt-1">Núcleo</span>
                </div>
              </div>
            </div>

            {/* Organelles Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-purple-400 block">🧬 Núcleo Celular</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Custodia el genoma humano (3.200 millones de pares de bases de ADN empaquetados en 23 pares de cromosomas).
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block">⚡ Mitocondrias</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Las centrales energéticas: transforman la glucosa y el oxígeno en ATP mediante la fosforilación oxidativa.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block">🛡️ Membrana Plasmática</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Bicapa lipídica semipermeable que controla minuciosamente qué nutrientes entran y qué toxinas salen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 4: DERMATOLOGY & ABCD MELANOMA TEST
          ===================================================================== */}
      {subView === 'dermatology_abcd' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  Dermatología Preventiva: Regla ABCD del Cáncer de Piel
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                AUTOEXPLORACIÓN CLÍNICA
              </span>
            </div>

            {/* Test Toggle between Benign Mole and Melanoma */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSkinLesionType('benign')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  skinLesionType === 'benign'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lunar Benigno Normal (Nevus)</span>
              </button>
              <button
                onClick={() => setSkinLesionType('malignant')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  skinLesionType === 'malignant'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Melanoma Sospechoso (Alerta)</span>
              </button>
            </div>

            {/* Visualizer Simulation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              {/* Illustrated Mole */}
              <div className="w-32 h-32 rounded-2xl bg-[#E8C39E] flex items-center justify-center relative overflow-hidden border border-amber-900/40">
                {skinLesionType === 'benign' ? (
                  <div className="w-12 h-12 rounded-full bg-[#5C3A21] shadow-inner" title="Lunar simétrico, bordes lisos, color homogéneo" />
                ) : (
                  <div
                    className="w-16 h-14 bg-[#2A160A] shadow-inner"
                    style={{
                      borderRadius: '45% 65% 70% 30% / 55% 45% 65% 35%',
                      boxShadow: 'inset 0 0 10px #7F1D1D, 0 0 8px rgba(0,0,0,0.5)',
                    }}
                    title="Asimétrico, bordes dentados, policromía"
                  />
                )}
              </div>

              {/* ABCD Clinical Evaluation Matrix */}
              <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-lg border ${skinLesionType === 'benign' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border-rose-800 text-rose-200'}`}>
                  <strong>A: Asimetría</strong>
                  <p className="text-[11px] mt-0.5">{skinLesionType === 'benign' ? '✅ Simétrico (ambas mitades iguales)' : '❌ Muy asimétrico al trazar un eje'}</p>
                </div>
                <div className={`p-2 rounded-lg border ${skinLesionType === 'benign' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border-rose-800 text-rose-200'}`}>
                  <strong>B: Bordes</strong>
                  <p className="text-[11px] mt-0.5">{skinLesionType === 'benign' ? '✅ Regulares y bien definidos' : '❌ Irregulares, dentados o borrosos'}</p>
                </div>
                <div className={`p-2 rounded-lg border ${skinLesionType === 'benign' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border-rose-800 text-rose-200'}`}>
                  <strong>C: Color</strong>
                  <p className="text-[11px] mt-0.5">{skinLesionType === 'benign' ? '✅ Tono marrón uniforme' : '❌ Varios colores (negro, marrón, rojo)'}</p>
                </div>
                <div className={`p-2 rounded-lg border ${skinLesionType === 'benign' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-rose-950/40 border-rose-800 text-rose-200'}`}>
                  <strong>D: Diámetro</strong>
                  <p className="text-[11px] mt-0.5">{skinLesionType === 'benign' ? '✅ Menor de 6 mm (goma de lápiz)' : '❌ Mayor de 6 mm o en crecimiento'}</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong>Regla de oro médica:</strong> Si un lunar pica, sangra, cambia de tamaño o cumple cualquiera de los criterios ABCD negativos, se debe acudir al dermatólogo para dermatoscopia óptica. Detectado a tiempo en fase in situ, la tasa de curación supera el 98%.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
