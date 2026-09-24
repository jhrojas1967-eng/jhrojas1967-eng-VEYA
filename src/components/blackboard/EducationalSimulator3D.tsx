import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  RotateCcw,
  Sliders,
  Sparkles,
  Info,
  Code2,
  Box,
  Layers,
  Eye,
  Activity,
  Compass,
  Zap,
  Play,
  Pause,
  ChevronRight,
  HelpCircle,
  Cpu,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { PedagogicalLevel } from '../../types';

interface EducationalSimulator3DProps {
  level: PedagogicalLevel;
}

type DomainCategory = 'anatomy' | 'physics';
type RenderShaderMode = 'pbr' | 'wireframe' | 'xray' | 'normals';

interface ModelDefinition {
  id: string;
  name: string;
  domain: DomainCategory;
  polyCount: number;
  vertices: number;
  format: 'glTF 2.0 / GLB' | 'OBJ' | 'USDZ';
  description: {
    cotidiano: string;
    practico: string;
    universitario: string;
  };
  hotspots: {
    id: string;
    label: string;
    xPct: number;
    yPct: number;
    detail: string;
  }[];
  specSheet: { key: string; value: string }[];
}

const SIMULATOR_MODELS: ModelDefinition[] = [
  // ANATOMY MODELS
  {
    id: 'cranium_3d',
    name: 'Cráneo Humano y Huesos Faciales',
    domain: 'anatomy',
    polyCount: 48520,
    vertices: 24262,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'El casco protector natural de nuestro cerebro. Formado por 22 huesos soldados como un puzle tridimensional perfecto.',
      practico: 'Identificación de puntos de punción, senos paranasales y suturas óseas clave para diagnóstico de traumatismos craneoencefálicos.',
      universitario: 'Articulaciones sinartrodiales dentadas y escamosas. Fosa craneal anterior, media y posterior con orificios de salida de pares craneales.',
    },
    hotspots: [
      { id: 'h1', label: 'Hueso Frontal', xPct: 48, yPct: 30, detail: 'Protege el lóbulo frontal cerebral y forma el techo de las órbitas oculares.' },
      { id: 'h2', label: 'Mandíbula (Maxilar Inferior)', xPct: 50, yPct: 75, detail: 'Único hueso móvil del cráneo, articulado mediante la ATM (articulación temporomandibular).' },
      { id: 'h3', label: 'Arco Cigomático', xPct: 68, yPct: 52, detail: 'Pómulo óseo donde se inserta el músculo masetero para masticar con más de 70 kg de fuerza.' },
    ],
    specSheet: [
      { key: 'Huesos Totales', value: '22 (8 neurocráneo + 14 viscerocráneo)' },
      { key: 'Volumen Endo-craneal', value: '~1.350 - 1.450 cm³' },
      { key: 'Grosor Promedio', value: '6.5 - 7.1 mm (zona parietal)' },
      { key: 'Formato Modelo', value: 'skull_highpoly_pbr.glb (Draco comprimido)' },
    ],
  },
  {
    id: 'heart_4d',
    name: 'Corazón 4D con Ciclo Valvular',
    domain: 'anatomy',
    polyCount: 62140,
    vertices: 31070,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'Una bomba muscular incansable que late más de 100.000 veces al día sin detenerse jamás, impulsando la sangre oxigenada a cada rincón.',
      practico: 'Visualización del flujo sístole/diástole y auscultación de ruidos cardíacos (R1 cierre de mitral/tricúspide, R2 cierre aórtico/pulmonar).',
      universitario: 'Haces miocárdicos helicoidales que generan torsión ventricular. Presión ventricular izquierda de 120 mmHg vs ventrículo derecho de 25 mmHg.',
    },
    hotspots: [
      { id: 'h1', label: 'Arco Aórtico', xPct: 52, yPct: 22, detail: 'Arteria principal con 3 derivaciones: tronco braquiocefálico, carótida común y subclavia.' },
      { id: 'h2', label: 'Ventrículo Izquierdo', xPct: 60, yPct: 68, detail: 'Cámara de alta presión con pared muscular 3 veces más gruesa que el ventrículo derecho.' },
      { id: 'h3', label: 'Vena Cava Superior', xPct: 38, yPct: 25, detail: 'Retorna sangre desoxigenada de cabeza, cuello y extremidades superiores a la aurícula derecha.' },
    ],
    specSheet: [
      { key: 'Cámaras', value: '4 (2 aurículas + 2 ventrículos)' },
      { key: 'Gasto Cardíaco', value: '4.5 - 5.5 L/min en reposo' },
      { key: 'Animación Morphs', value: '12 Blendshapes de contracción muscular' },
      { key: 'Válvulas', value: 'Mitral, Tricúspide, Aórtica, Pulmonar' },
    ],
  },
  {
    id: 'neuron_synapse',
    name: 'Neurona Multipolar y Conexión Sináptica',
    domain: 'anatomy',
    polyCount: 39800,
    vertices: 19900,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'Los microchips vivos de nuestro pensamiento: se comunican disparando diminutas chispas eléctricas y liberando mensajeros químicos.',
      practico: 'Comprensión de cómo actúan los anestésicos locales (bloqueando canales de sodio) y los antidepresivos (recaptación de serotonina).',
      universitario: 'Ecuación de Nernst-Goldman para el potencial de membrana en reposo (-70 mV). Conducción saltatoria en los nódulos de Ranvier a 120 m/s.',
    },
    hotspots: [
      { id: 'h1', label: 'Soma / Cuerpo Celular', xPct: 40, yPct: 38, detail: 'Contiene el núcleo y el retículo endoplasmático rugoso (cuerpos de Nissl).' },
      { id: 'h2', label: 'Vaina de Mielina', xPct: 62, yPct: 55, detail: 'Aislante lipídico producido por células de Schwann en el SNP y oligodendrocitos en el SNC.' },
      { id: 'h3', label: 'Botón Terminal Sináptico', xPct: 82, yPct: 75, detail: 'Vesículas sinápticas que liberan neurotransmisores a la hendidura de 20 nanómetros.' },
    ],
    specSheet: [
      { key: 'Tipo Celular', value: 'Neurona piramidal cortical' },
      { key: 'Longitud Axonal', value: 'Hasta 1 metro en nervio ciático' },
      { key: 'Velocidad Impulso', value: '100 - 120 m/s con mielina' },
      { key: 'Resolución Texturas', value: '4K PBR (Albedo, Normal, Roughness)' },
    ],
  },

  // PHYSICS MODELS
  {
    id: 'lorentz_field',
    name: 'Campo Magnético y Fuerza de Lorentz',
    domain: 'physics',
    polyCount: 52300,
    vertices: 26150,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'El escudo invisible: cómo los imanes curvan las trayectorias de partículas cargadas. Es el mismo principio que crea las auroras boreales.',
      practico: 'Funcionamiento de motores eléctricos, ciclotrones médicos para radioterapia y tubos de rayos catódicos.',
      universitario: 'Fuerza total de Lorentz: F = q(E + v × B). La componente magnética no realiza trabajo (W = 0) al ser siempre perpendicular a la velocidad.',
    },
    hotspots: [
      { id: 'h1', label: 'Polo Norte Magnético', xPct: 48, yPct: 20, detail: 'Origen de las líneas de inducción magnética B (divergencia nula ∇·B = 0).' },
      { id: 'h2', label: 'Líneas Toroidales de Flujo', xPct: 75, yPct: 48, detail: 'Densidad de flujo magnético en Teslas (T). 1 Tesla = 10.000 Gauss.' },
      { id: 'h3', label: 'Trayectoria Helicoidal', xPct: 28, yPct: 58, detail: 'Movimiento en espiral de una partícula con radio de Larmor r = mv / (qB).' },
    ],
    specSheet: [
      { key: 'Ecuación Fundamental', value: 'F = q · (v × B)' },
      { key: 'Leyes Asociadas', value: 'Maxwell-Ampère y Gauss Magnético' },
      { key: 'Elementos Visuales', value: 'Vector B, Vector v, Vector F, Bobinas' },
      { key: 'Partículas Dinámicas', value: 'Electrones y protones en órbita' },
    ],
  },
  {
    id: 'keplerian_orbit',
    name: 'Pozo Gravitatorio y Órbitas Keplerianas',
    domain: 'physics',
    polyCount: 44100,
    vertices: 22050,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'La gravedad como un tobogán invisible: cómo el Sol curva el espacio-tiempo obligando a los planetas a girar sin caer.',
      practico: 'Cálculo de órbitas de satélites GPS, maniobras de transferencia de Hohmann y asistencia gravitacional de sondas espaciales.',
      universitario: 'Conservación del vector excentricidad de Runge-Lenz y momento angular específico h = r × v. 1ª y 2ª ley de Kepler en coordenadas polares.',
    },
    hotspots: [
      { id: 'h1', label: 'Masa Central (Foco)', xPct: 45, yPct: 50, detail: 'Centro de gravedad común. Ocupa uno de los dos focos de la elipse orbital.' },
      { id: 'h2', label: 'Periapsis (Máxima Velocidad)', xPct: 25, yPct: 50, detail: 'Punto más cercano al foco central donde la velocidad orbital alcanza su cénit.' },
      { id: 'h3', label: 'Apoapsis (Mínima Velocidad)', xPct: 80, yPct: 50, detail: 'Punto más lejano al foco; el radio vector barre áreas iguales en tiempos iguales.' },
    ],
    specSheet: [
      { key: '3ª Ley de Kepler', value: 'T² / a³ = 4π² / (G · M)' },
      { key: 'Curvatura Espaciotiempo', value: 'Geodésica en métrica de Schwarzschild' },
      { key: 'Malla Geodésica', value: 'Malla 3D deformable con shaders GLSL' },
      { key: 'Shader Efecto', value: 'Normal mapping con líneas de contorno de potencial' },
    ],
  },
  {
    id: 'bohr_quantum_atom',
    name: 'Modelo Atómico Cuántico (Nube Electrónica)',
    domain: 'physics',
    polyCount: 56900,
    vertices: 28450,
    format: 'glTF 2.0 / GLB',
    description: {
      cotidiano: 'El corazón de la materia: los electrones no giran como planetas, sino que existen como nubes de probabilidad cuántica que saltan de nivel.',
      practico: 'Fundamento físico de los lásers, la fluorescencia, paneles solares fotovoltaicos y resonancia magnética nuclear (RMN).',
      universitario: 'Ecuación de Schrödinger independiente del tiempo Ĥψ = Eψ. Números cuánticos n, l, m_l, m_s y principio de exclusión de Pauli.',
    },
    hotspots: [
      { id: 'h1', label: 'Núcleo Atómico', xPct: 50, yPct: 50, detail: 'Protones y neutrones unidos por la interacción nuclear fuerte mediada por gluones.' },
      { id: 'h2', label: 'Orbital 1s (Esférico)', xPct: 62, yPct: 40, detail: 'Densidad de probabilidad máxima en el radio de Bohr a₀ = 0.529 Å.' },
      { id: 'h3', label: 'Salto Cuántico / Fotón', xPct: 75, yPct: 28, detail: 'Emisión de un fotón con energía E = h·ν al decaer un electrón de nivel n=3 a n=2.' },
    ],
    specSheet: [
      { key: 'Constante de Planck', value: 'h = 6.626 × 10⁻³⁴ J·s' },
      { key: 'Función de Onda', value: 'Armónicos esféricos Y_lm(θ, φ)' },
      { key: 'Visualización', value: 'Volumetric Cloud Shaders + Raymarching' },
      { key: 'Niveles de Energía', value: 'E_n = -13.6 eV / n² (Átomo de Hidrógeno)' },
    ],
  },
];

export const EducationalSimulator3D: React.FC<EducationalSimulator3DProps> = ({ level }) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('anatomy');
  const [selectedModelId, setSelectedModelId] = useState<string>('cranium_3d');
  const [shaderMode, setShaderMode] = useState<RenderShaderMode>('pbr');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [yaw, setYaw] = useState<number>(35);
  const [pitch, setPitch] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1.0);
  const [explodedViewPct, setExplodedViewPct] = useState<number>(0);
  const [clippingPlanePct, setClippingPlanePct] = useState<number>(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inspect' | 'specs' | 'sdk_integration'>('inspect');

  // Animation turntable
  const animFrameRef = useRef<number | null>(null);
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isRotating) {
        setYaw((prev) => (prev + dt * 25) % 360);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRotating]);

  // Current model
  const activeModel =
    SIMULATOR_MODELS.find((m) => m.id === selectedModelId) || SIMULATOR_MODELS[0];

  return (
    <div className="bg-[#0A0F1D] border border-slate-800 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3 text-slate-100 font-['Nunito_Sans']">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
            <Box className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Simulador Educativo 3D: Anatomía & Física
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                VIEWPORT 3D ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualizador tridimensional interactivo con placeholders para motores de renderizado WebGL / Three.js y Android SceneView
            </p>
          </div>
        </div>

        {/* Domain Switcher Pill */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setSelectedDomain('anatomy');
              setSelectedModelId('cranium_3d');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedDomain === 'anatomy'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🫀 Anatomía Humana</span>
          </button>
          <button
            onClick={() => {
              setSelectedDomain('physics');
              setSelectedModelId('lorentz_field');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedDomain === 'physics'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚛️ Física Fundamental</span>
          </button>
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-[#0D1322] p-1.5 rounded-xl border border-slate-800/80">
        {SIMULATOR_MODELS.filter((m) => m.domain === selectedDomain).map((model) => {
          const isSelected = model.id === activeModel.id;
          return (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModelId(model.id);
                setActiveHotspotId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? selectedDomain === 'anatomy'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{model.domain === 'anatomy' ? '🦴' : '⚡'}</span>
              <span>{model.name}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 font-mono opacity-80">
                {(model.polyCount / 1000).toFixed(0)}k polys
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Viewport on Left (7 cols), Controls & Student Guide on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* ===================================================================
            LEFT: THE 3D RENDER ENGINE VIEWPORT PLACEHOLDER
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          {/* Viewport Top HUD */}
          <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            {/* Shader Mode Toggles */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1">Shader:</span>
              {[
                { id: 'pbr', label: '🎨 PBR Realista' },
                { id: 'wireframe', label: '📐 Wireframe' },
                { id: 'xray', label: '🩻 Rayos X' },
                { id: 'normals', label: '🌈 Normales' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShaderMode(s.id as RenderShaderMode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    shaderMode === s.id
                      ? 'bg-cyan-900 text-cyan-200 border border-cyan-600'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Turntable Auto-rotate */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold ${
                  isRotating
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Giro automático orbital (Turntable)"
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Giro 360°</span>
              </button>
              <button
                onClick={() => {
                  setYaw(35);
                  setPitch(15);
                  setZoom(1.0);
                  setExplodedViewPct(0);
                  setClippingPlanePct(0);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Restablecer cámara y controles"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* The High-Fidelity 3D Viewport Frame */}
          <div className="relative w-full h-80 sm:h-96 bg-[#040711] rounded-2xl border-2 border-dashed border-cyan-800/60 overflow-hidden flex items-center justify-center select-none group">
            {/* Developer & Student Placeholder Watermark Banner */}
            <div className="absolute top-2.5 left-3 z-30 pointer-events-none flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[10px] font-mono font-bold backdrop-blur-md">
                <Box className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                <span>3D RENDER VIEWPORT: CONTAINER HOOK</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-black/60 px-1.5 py-0.2 rounded w-fit">
                glTF / SceneView Target: &lt;canvas id="veya-3d-canvas" /&gt;
              </span>
            </div>

            {/* Viewport Live Telemetry HUD (Top Right) */}
            <div className="absolute top-2.5 right-3 z-30 pointer-events-none flex flex-col items-end gap-1 text-[9px] font-mono text-slate-400 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 60.0 FPS
              </span>
              <span>Polígonos: {activeModel.polyCount.toLocaleString()}</span>
              <span>Vértices: {activeModel.vertices.toLocaleString()}</span>
              <span>Yaw: {yaw.toFixed(0)}° | Pitch: {pitch.toFixed(0)}°</span>
              <span>Zoom: {zoom.toFixed(2)}x</span>
            </div>

            {/* Coordinate Axes 3D Gizmo Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-30 pointer-events-none bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 backdrop-blur-md flex flex-col items-center">
              <svg className="w-12 h-12">
                {/* Center of gizmo */}
                <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
                {/* X Axis (Red) */}
                <line x1="24" y1="24" x2="44" y2="24" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                <text x="45" y="27" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">X</text>
                {/* Y Axis (Green) */}
                <line x1="24" y1="24" x2="24" y2="4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <text x="21" y="4" fill="#10B981" fontSize="8" fontFamily="monospace" fontWeight="bold">Y</text>
                {/* Z Axis (Blue perspective diagonal) */}
                <line x1="24" y1="24" x2="10" y2="38" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                <text x="5" y="42" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">Z</text>
              </svg>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5">Gizmo 3D</span>
            </div>

            {/* 3D Grid Perspective Floor */}
            <div
              style={{
                transform: `perspective(600px) rotateX(65deg) translateY(120px) scale(${zoom})`,
              }}
              className="absolute w-[500px] h-[500px] border border-cyan-900/30 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"
            />

            {/* Active Model Geometric Silhouette & Dynamic Wireframe */}
            <div
              style={{
                transform: `perspective(800px) rotateY(${yaw}deg) rotateX(${pitch}deg) scale(${zoom})`,
                transition: isRotating ? 'none' : 'transform 0.1s ease-out',
              }}
              className="relative z-10 flex items-center justify-center transition-transform"
            >
              {/* Specialized Model Graphic depending on selection */}
              {activeModel.id === 'cranium_3d' && (
                <div className="relative flex flex-col items-center">
                  <div
                    style={{
                      transform: `translateY(${-explodedViewPct * 0.3}px)`,
                    }}
                    className={`w-40 h-44 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 ${
                      shaderMode === 'wireframe'
                        ? 'border-2 border-cyan-400 bg-transparent shadow-[0_0_25px_rgba(56,189,248,0.3)]'
                        : shaderMode === 'xray'
                        ? 'border border-cyan-300 bg-cyan-950/30 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                        : shaderMode === 'normals'
                        ? 'bg-gradient-to-tr from-emerald-500 via-purple-500 to-rose-500 border border-white/40'
                        : 'bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 border border-stone-100 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    <span className="text-6xl select-none filter drop-shadow-lg">💀</span>
                    <span
                      className={`text-[10px] font-mono font-bold mt-2 ${
                        shaderMode === 'pbr' ? 'text-stone-800' : 'text-cyan-300'
                      }`}
                    >
                      CRANIUM_HIGH_LOD
                    </span>
                  </div>

                  {/* Mandible (Separates with exploded view) */}
                  <div
                    style={{
                      transform: `translateY(${explodedViewPct * 0.5}px)`,
                    }}
                    className={`w-28 h-10 mt-1 rounded-b-2xl border flex items-center justify-center text-[9px] font-mono font-bold transition-transform ${
                      shaderMode === 'wireframe'
                        ? 'border-cyan-400 text-cyan-300'
                        : 'bg-stone-300 border-stone-400 text-stone-800'
                    }`}
                  >
                    Mandíbula Móvil
                  </div>
                </div>
              )}

              {activeModel.id === 'heart_4d' && (
                <div className="relative flex flex-col items-center animate-pulse">
                  <div
                    className={`w-40 h-44 rounded-3xl flex flex-col items-center justify-center transition-all ${
                      shaderMode === 'wireframe'
                        ? 'border-2 border-rose-400 bg-transparent shadow-[0_0_30px_rgba(244,63,94,0.4)]'
                        : shaderMode === 'xray'
                        ? 'border border-rose-300 bg-rose-950/40 shadow-[0_0_30px_rgba(244,63,94,0.6)]'
                        : shaderMode === 'normals'
                        ? 'bg-gradient-to-tr from-red-500 via-blue-500 to-yellow-400 border'
                        : 'bg-gradient-to-tr from-rose-700 via-rose-500 to-rose-400 border border-rose-300 shadow-[0_0_35px_rgba(225,29,72,0.5)]'
                    }`}
                  >
                    <span className="text-6xl select-none">🫀</span>
                    <span className="text-[10px] font-mono font-bold text-white mt-2">
                      MIOCARDIO 4D
                    </span>
                  </div>
                </div>
              )}

              {activeModel.id === 'neuron_synapse' && (
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all ${
                      shaderMode === 'wireframe'
                        ? 'border-2 border-purple-400 bg-transparent'
                        : 'bg-gradient-to-tr from-indigo-900 via-purple-700 to-pink-500 border border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                    }`}
                  >
                    <span className="text-5xl select-none">🧠</span>
                    <div className="w-32 h-1 bg-purple-400 mt-2 shadow-[0_0_8px_#A855F7]" />
                    <span className="text-[9px] font-mono text-purple-200 mt-1">AXÓN & SOMA</span>
                  </div>
                </div>
              )}

              {activeModel.id === 'lorentz_field' && (
                <div className="relative flex flex-col items-center">
                  <div className="w-44 h-44 rounded-full border-2 border-cyan-400/80 flex items-center justify-center relative shadow-[0_0_35px_rgba(6,182,212,0.3)]">
                    <div className="w-10 h-28 bg-gradient-to-b from-red-600 to-blue-600 rounded-lg flex flex-col justify-between items-center py-2 text-white font-bold text-xs shadow-lg">
                      <span>N</span>
                      <span>S</span>
                    </div>
                    {/* Magnetic field line rings */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 pointer-events-none" />
                    <div className="absolute inset-6 rounded-full border border-dotted border-cyan-300/40 pointer-events-none" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold mt-2">
                    LÍNEAS DE FLUJO MAGNÉTICO (B)
                  </span>
                </div>
              )}

              {activeModel.id === 'keplerian_orbit' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-48 h-28 rounded-full border-2 border-amber-400/80 scale-y-75 flex items-center justify-center relative shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                    <div className="w-8 h-8 rounded-full bg-amber-400 shadow-[0_0_20px_#F59E0B] absolute left-10 flex items-center justify-center text-xs font-bold text-amber-950">
                      ☀️
                    </div>
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#38BDF8] absolute right-6 flex items-center justify-center text-[8px] text-black font-bold">
                      🌍
                    </div>
                  </div>
                </div>
              )}

              {activeModel.id === 'bohr_quantum_atom' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full border border-cyan-500/60 flex items-center justify-center relative">
                    <div className="w-8 h-8 rounded-full bg-rose-600 border border-rose-300 flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                      Núcleo
                    </div>
                    <div className="w-28 h-28 rounded-full border border-dashed border-purple-400 absolute pointer-events-none animate-spin-slow" />
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#38BDF8] absolute top-2 right-12" title="Electrón n=2" />
                  </div>
                </div>
              )}
            </div>

            {/* Interactive 3D Hotspots / Marker Pins */}
            {activeModel.hotspots.map((spot) => {
              const isActive = activeHotspotId === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspotId(isActive ? null : spot.id)}
                  style={{
                    left: `${spot.xPct}%`,
                    top: `${spot.yPct}%`,
                  }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin transition-transform ${
                    isActive ? 'scale-125' : 'hover:scale-110'
                  }`}
                  title={spot.label}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-cyan-400/30 animate-ping absolute -inset-0.5" />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shadow-lg transition-colors ${
                        isActive
                          ? 'bg-cyan-400 border-white text-black'
                          : 'bg-slate-900 border-cyan-400 text-cyan-300'
                      }`}
                    >
                      ●
                    </div>
                  </div>

                  {/* Tooltip on Active or Hover */}
                  {isActive && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-48 p-2 rounded-xl bg-slate-900/95 border border-cyan-500 shadow-2xl text-[10px] text-slate-200 text-left backdrop-blur-md">
                      <span className="font-bold text-cyan-300 block mb-0.5">{spot.label}</span>
                      <p className="text-slate-300 leading-tight">{spot.detail}</p>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Clipping Plane Visualizer line if clipping > 0 */}
            {clippingPlanePct > 0 && (
              <div
                style={{
                  top: `${clippingPlanePct}%`,
                }}
                className="absolute inset-x-0 h-0.5 bg-rose-500/80 shadow-[0_0_10px_#F43F5E] pointer-events-none z-15 flex items-center justify-end px-3"
              >
                <span className="text-[9px] font-mono text-rose-300 bg-black/80 px-1 rounded">
                  Plano de Corte Sagital: {clippingPlanePct}%
                </span>
              </div>
            )}
          </div>

          {/* Interactive Camera & Model Sliders HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
            {/* Yaw Orbit */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Ángulo Yaw:</span>
                <span className="font-mono text-cyan-300">{yaw.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={yaw}
                onChange={(e) => {
                  setIsRotating(false);
                  setYaw(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
              />
            </div>

            {/* Pitch Incline */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Inclinación Pitch:</span>
                <span className="font-mono text-cyan-300">{pitch.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={pitch}
                onChange={(e) => {
                  setIsRotating(false);
                  setPitch(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
              />
            </div>

            {/* Zoom */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Zoom Cámara:</span>
                <span className="font-mono text-cyan-300">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
              />
            </div>

            {/* Exploded View / Despiece */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Despiece 3D:</span>
                <span className="font-mono text-cyan-300">{explodedViewPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={explodedViewPct}
                onChange={(e) => setExplodedViewPct(parseInt(e.target.value))}
                className="w-full accent-rose-400 h-1 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT: STUDENT INSPECTION & DEVELOPER INTEGRATION PANEL
            =================================================================== */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('inspect')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'inspect'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Pedagogía</span>
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'specs'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Ficha Técnica</span>
            </button>
            <button
              onClick={() => setActiveTab('sdk_integration')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'sdk_integration'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Código de integración para estudiantes y desarrolladores"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Integración SDK</span>
            </button>
          </div>

          {/* Model Title & Tag */}
          <div className="border-b border-slate-800 pb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{activeModel.domain === 'anatomy' ? '🫀' : '⚛️'}</span>
                <span>{activeModel.name}</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300">
                {activeModel.format}
              </span>
            </div>
          </div>

          {/* TAB 1: PEDAGOGICAL INSPECTION */}
          {activeTab === 'inspect' && (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-200">
                <span className="text-[10px] font-mono text-cyan-400 block font-bold uppercase tracking-wider mb-1">
                  Explicación ({level.toUpperCase()})
                </span>
                <p>{activeModel.description[level]}</p>
              </div>

              {/* Hotspots clickable list */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Marcadores de Inspección Táctil:
                </span>
                <div className="space-y-1.5">
                  {activeModel.hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() =>
                        setActiveHotspotId(activeHotspotId === spot.id ? null : spot.id)
                      }
                      className={`w-full p-2 rounded-xl text-left text-xs transition-all border flex items-start gap-2 ${
                        activeHotspotId === spot.id
                          ? 'bg-cyan-950/80 border-cyan-600 text-cyan-100 shadow-md'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-cyan-400 mt-0.5">●</span>
                      <div>
                        <strong className="block text-white">{spot.label}</strong>
                        <span className="text-[11px] text-slate-400">{spot.detail}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPEC SHEET METRICS */}
          {activeTab === 'specs' && (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-1 gap-2">
                {activeModel.specSheet.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-400 font-bold">{spec.key}</span>
                    <span className="font-mono text-cyan-300">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/40 text-xs text-slate-300">
                <strong>Optimizaciones del Asset:</strong> Los modelos cuentan con compresión de malla Google Draco para reducir el peso de descarga a menos de 2.5 MB y mapeo de texturas PBR comprimidas en formato KTX2/Basis Universal.
              </div>
            </div>
          )}

          {/* TAB 3: SDK INTEGRATION CODE FOR STUDENTS & DEVELOPERS */}
          {activeTab === 'sdk_integration' && (
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-[11px] leading-relaxed">
                <strong>¿Cómo integrar librerías 3D reales en este placeholder?</strong> Este contenedor está listo para recibir librerías de renderizado WebGL (Three.js / React Three Fiber) en la web, o Google Filament / SceneView en Android Jetpack Compose.
              </div>

              {/* Web React / Three.js snippet */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                  1. Web / React (Three.js & @react-three/fiber):
                </span>
                <pre className="p-2.5 rounded-xl bg-black/90 border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto">
{`// Instalar: npm install three @react-three/fiber @react-three/drei
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function ModelRenderer({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Reemplazar el placeholder con:
<Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
  <ambientLight intensity={0.7} />
  <directionalLight position={[10, 10, 5]} intensity={1.2} />
  <ModelRenderer url="/assets/models/${activeModel.id}.glb" />
  <OrbitControls enableDamping autoRotate={${isRotating}} />
</Canvas>`}
                </pre>
              </div>

              {/* Android SceneView / Filament snippet */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-purple-300 font-bold">
                  2. Android Jetpack Compose (SceneView / Filament):
                </span>
                <pre className="p-2.5 rounded-xl bg-black/90 border border-slate-800 text-[10px] font-mono text-purple-300 overflow-x-auto">
{`// build.gradle.kts:
// implementation("io.github.sceneview:sceneview:2.2.1")

@Composable
fun Veya3DModelViewer(modelFile: String) {
  Scene(
    modifier = Modifier.fillMaxSize(),
    model = rememberModelLoader(modelFile),
    cameraNode = rememberCameraNode { position = Position(0f, 1f, 3f) },
    isRotateEnabled = true
  )
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
