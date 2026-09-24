import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Eye,
  Sliders,
  Sun,
  Moon,
  ChevronRight,
  Maximize2,
  Clock,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';
import { PedagogicalLevel } from '../../types';

interface ToolAstronomyPhysicsProps {
  level: PedagogicalLevel;
}

type AstronomySubView =
  | 'solar_system'    // NASA's Eyes: 3D Solar System & Keplerian Orbits
  | 'iss_tracker'     // SkyView Lite: Real-time ISS Orbit & Ground Track
  | 'stellarium_sky'  // Stellarium: Virtual Planetarium & Constellations
  | 'tides_gravity'   // Newton & Kepler: Tides & Orbital Gravitation
  | 'relativity';     // Einstein: Spacetime Curvature & Time Dilation

interface PlanetData {
  id: string;
  name: string;
  distAU: number;
  periodDays: number;
  radiusKm: number;
  gravity: number;
  tempC: number;
  moons: number;
  color: string;
  orbitRadiusPx: number;
  sizePx: number;
  description: {
    cotidiano: string;
    practico: string;
    universitario: string;
  };
}

const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercurio',
    distAU: 0.39,
    periodDays: 88,
    radiusKm: 2439,
    gravity: 3.7,
    tempC: 167,
    moons: 0,
    color: '#9CA3AF',
    orbitRadiusPx: 45,
    sizePx: 5,
    description: {
      cotidiano: 'El planeta más cercano al Sol: no tiene atmósfera para retener calor, así que pasa de congelarse a abrasarse.',
      practico: 'Visible justo antes del amanecer o tras el ocaso muy bajo en el horizonte. Difícil de observar sin prismáticos.',
      universitario: 'Órbita con excentricidad 0.2056; la precesión de su perihelio (43"/siglo) fue la primera confirmación de la Relatividad General de Einstein.',
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    distAU: 0.72,
    periodDays: 224.7,
    radiusKm: 6052,
    gravity: 8.87,
    tempC: 464,
    moons: 0,
    color: '#FBBF24',
    orbitRadiusPx: 68,
    sizePx: 8,
    description: {
      cotidiano: 'El gemelo infernal de la Tierra. El "lucero del alba". Su efecto invernadero extremo lo convierte en el lugar más caliente del sistema solar.',
      practico: 'El objeto más brillante del cielo nocturno tras la Luna. Muestra fases como la Luna observables con cualquier telescopio pequeño.',
      universitario: 'Atmósfera de CO2 (96.5%) a 92 bares de presión superficial. Rotación retrógrada con un período de 243 días terrestres.',
    },
  },
  {
    id: 'earth',
    name: 'Tierra',
    distAU: 1.0,
    periodDays: 365.25,
    radiusKm: 6371,
    gravity: 9.81,
    tempC: 15,
    moons: 1,
    color: '#38BDF8',
    orbitRadiusPx: 95,
    sizePx: 9,
    description: {
      cotidiano: 'Nuestro oasis cósmico. El único mundo conocido con agua líquida superficial, atmósfera rica en oxígeno y vida consciente.',
      practico: 'Punto de referencia para coordenadas celestes, husos horarios y navegación por satélites GPS en órbitas MEO.',
      universitario: 'Masa de 5.972 × 10²⁴ kg. Campo magnético bipolar generado por dínamo geodinámica en el núcleo externo de hierro fundido.',
    },
  },
  {
    id: 'mars',
    name: 'Marte',
    distAU: 1.52,
    periodDays: 687,
    radiusKm: 3389,
    gravity: 3.71,
    tempC: -63,
    moons: 2,
    color: '#EF4444',
    orbitRadiusPx: 125,
    sizePx: 7,
    description: {
      cotidiano: 'El planeta rojo: su color se debe al óxido de hierro (herrumbre). Tiene el volcán más grande de todo el sistema solar: el Monte Olimpo.',
      practico: 'Durante las oposiciones (cada ~26 meses) se acerca a la Tierra, permitiendo ver sus casquetes polares de hielo con telescopios de aficionado.',
      universitario: 'Presión atmosférica de solo 6.1 mbar (CO2 95%). Evidencia geológica de paleocauces fluviales y agua líquida en su pasado Noeico.',
    },
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    distAU: 5.2,
    periodDays: 4333,
    radiusKm: 69911,
    gravity: 24.79,
    tempC: -110,
    moons: 95,
    color: '#F97316',
    orbitRadiusPx: 165,
    sizePx: 16,
    description: {
      cotidiano: 'El gigante protector: es tan enorme que dentro cabrían más de 1.300 Tierras. Su gravedad desvía cometas que podrían impactarnos.',
      practico: 'Con prismáticos 10x50 se observan sus 4 lunas galileanas (Ío, Europa, Ganimedes y Calisto) alineadas en su plano ecuatorial.',
      universitario: 'Masa 317.8 veces la terrestre. Emite más radiación térmica interna de la que recibe del Sol debido al mecanismo de contracción de Kelvin-Helmholtz.',
    },
  },
  {
    id: 'saturn',
    name: 'Saturno',
    distAU: 9.58,
    periodDays: 10759,
    radiusKm: 58232,
    gravity: 10.44,
    tempC: -140,
    moons: 146,
    color: '#EAB308',
    orbitRadiusPx: 205,
    sizePx: 14,
    description: {
      cotidiano: 'La joya del cosmos: sus deslumbrantes anillos están formados por miles de millones de fragmentos de hielo puro que orbitan a gran velocidad.',
      practico: 'Sus anillos y la división de Cassini son visibles con telescopios de apertura a partir de 60 mm.',
      universitario: 'Densidad media de solo 0.687 g/cm³ (flotaría en agua). Sus anillos tienen un grosor de apenas 10 a 100 metros a pesar de medir 282.000 km de ancho.',
    },
  },
];

export const ToolAstronomyPhysics: React.FC<ToolAstronomyPhysicsProps> = ({ level }) => {
  const [subView, setSubView] = useState<AstronomySubView>('solar_system');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANETS[2]); // Earth default
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nightVisionMode, setNightVisionMode] = useState(false);

  // Animation angle state
  const [simTime, setSimTime] = useState(0);
  const animRef = useRef<number | null>(null);

  // ISS Tracker state
  const [issOrbitAngle, setIssOrbitAngle] = useState(42);
  const [showGroundTrack, setShowGroundTrack] = useState(true);

  // Tides simulation state
  const [moonAngle, setMoonAngle] = useState(0); // 0 = New Moon (spring tides), 90 = First Quarter (neap tides)

  // Relativity calculation state
  const [velocityFractionC, setVelocityFractionC] = useState(0.8); // 0.8c

  useEffect(() => {
    let lastStamp = performance.now();
    const loop = (timestamp: number) => {
      const dt = (timestamp - lastStamp) / 1000;
      lastStamp = timestamp;
      if (isPlaying) {
        setSimTime((prev) => prev + dt * speedMultiplier * 0.5);
        setIssOrbitAngle((prev) => (prev + dt * speedMultiplier * 4) % 360);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speedMultiplier]);

  // Relativity calculations
  const gamma = 1 / Math.sqrt(Math.max(0.0001, 1 - Math.pow(velocityFractionC, 2)));
  const earthYears = 10;
  const shipYears = earthYears / gamma;

  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 flex flex-col gap-3 p-3.5 shadow-2xl ${
        nightVisionMode
          ? 'bg-[#150303] border-rose-900/60 text-rose-200'
          : 'bg-[#0A0F1D] border-slate-800 text-slate-100'
      }`}
    >
      {/* Header with Sub-Tool Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl flex items-center justify-center ${
              nightVisionMode ? 'bg-rose-950 text-rose-400' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50'
            }`}
          >
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Observatorio Espacial VEYA
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                NASA & STELLARIUM ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Efemérides orbitales 3D, telemetría ISS, planetario y física relativista
            </p>
          </div>
        </div>

        {/* Night vision toggle */}
        <button
          onClick={() => setNightVisionMode(!nightVisionMode)}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
            nightVisionMode
              ? 'bg-rose-900/50 border-rose-700 text-rose-200 shadow-sm shadow-rose-950'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white'
          }`}
          title="Filtro rojo astronómico para preservar la adaptación a la oscuridad"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{nightVisionMode ? 'Visión Nocturna ON' : 'Filtro Rojo'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'solar_system', label: "🪐 NASA's Eyes (Órbitas 3D)" },
          { id: 'iss_tracker', label: '🛰️ ISS & Satélites en Vivo' },
          { id: 'stellarium_sky', label: '✨ Stellarium (Constelaciones)' },
          { id: 'tides_gravity', label: '🌊 Mareas y Gravedad Newton' },
          { id: 'relativity', label: '⏳ Relatividad y Tiempo Einstein' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubView(tab.id as AstronomySubView)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              subView === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/50 scale-[1.02]'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =====================================================================
          SUB-VIEW 1: NASA'S EYES (SOLAR SYSTEM ORBITS & REAL DATA)
          ===================================================================== */}
      {subView === 'solar_system' && (
        <div className="flex flex-col gap-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                title={isPlaying ? 'Pausar simulación' : 'Iniciar'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSimTime(0)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Reiniciar tiempo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 ml-2">
                <span className="text-[11px] text-slate-400">Velocidad:</span>
                {[0.5, 1, 3, 10].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      speedMultiplier === spd ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Zoom:</span>
              <button
                onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.2))}
                className="w-6 h-6 rounded-md bg-slate-800 text-slate-200 font-bold flex items-center justify-center hover:bg-slate-700"
              >
                -
              </button>
              <span className="text-[11px] font-mono text-cyan-300">{zoomLevel.toFixed(1)}x</span>
              <button
                onClick={() => setZoomLevel(Math.min(1.8, zoomLevel + 0.2))}
                className="w-6 h-6 rounded-md bg-slate-800 text-slate-200 font-bold flex items-center justify-center hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Interactive 3D/2D Planetary Orrery Canvas Display */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Background Stars Field */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

            {/* Central Sun */}
            <div className="relative flex items-center justify-center pointer-events-none z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-100 shadow-[0_0_35px_#F59E0B] flex items-center justify-center animate-pulse">
                <Sun className="w-5 h-5 text-amber-900" />
              </div>
            </div>

            {/* Asteroid Belt representation */}
            <div
              style={{
                width: `${145 * 2 * zoomLevel}px`,
                height: `${145 * 2 * zoomLevel}px`,
              }}
              className="absolute rounded-full border border-dashed border-slate-700/40 pointer-events-none animate-spin-reverse"
              title="Cinturón de Asteroides (Ceres, Vesta)"
            />

            {/* Orbit lines & Planet nodes */}
            {PLANETS.map((planet) => {
              const radius = planet.orbitRadiusPx * zoomLevel;
              // Keplerian angle: angular velocity inversely proportional to period
              const currentAngle = (simTime * (365 / planet.periodDays)) % (2 * Math.PI);
              const x = Math.cos(currentAngle) * radius;
              const y = Math.sin(currentAngle) * radius;
              const isSelected = selectedPlanet.id === planet.id;

              return (
                <React.Fragment key={planet.id}>
                  {/* Circular Orbit Path */}
                  <div
                    style={{
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                    }}
                    className={`absolute rounded-full border pointer-events-none transition-colors ${
                      isSelected ? 'border-cyan-400/60 shadow-[0_0_12px_rgba(56,189,248,0.2)]' : 'border-slate-800/70'
                    }`}
                  />

                  {/* Planet Body */}
                  <button
                    onClick={() => setSelectedPlanet(planet)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      width: `${planet.sizePx * Math.max(1, zoomLevel * 0.9)}px`,
                      height: `${planet.sizePx * Math.max(1, zoomLevel * 0.9)}px`,
                      backgroundColor: planet.color,
                    }}
                    className={`absolute rounded-full z-20 transition-transform duration-75 hover:scale-150 focus:outline-none ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-lg' : ''
                    }`}
                    title={`${planet.name} (${planet.distAU} UA)`}
                  >
                    {/* Ring for Saturn */}
                    {planet.id === 'saturn' && (
                      <span className="absolute -inset-1 rounded-full border-2 border-yellow-200/50 scale-y-50 pointer-events-none" />
                    )}
                  </button>

                  {/* Label if selected */}
                  {isSelected && (
                    <div
                      style={{
                        transform: `translate(${x}px, ${y - 18}px)`,
                      }}
                      className="absolute z-30 pointer-events-none px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-500/80 text-[10px] font-bold text-cyan-300 whitespace-nowrap shadow-md"
                    >
                      {planet.name}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Planet Telemetry Card (NASA-grade Data) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: selectedPlanet.color }}
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                />
                <h4 className="text-sm font-bold text-white">{selectedPlanet.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {selectedPlanet.distAU} UA ({Math.round(selectedPlanet.distAU * 149.6)}M km)
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                {level === 'cotidiano' ? 'Nivel Cotidiano' : level === 'practico' ? 'Nivel Práctico' : 'Nivel Universitario'}
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Año / Período</span>
                <span className="font-bold font-mono text-cyan-300">
                  {selectedPlanet.periodDays >= 365
                    ? `${(selectedPlanet.periodDays / 365.25).toFixed(1)} años`
                    : `${selectedPlanet.periodDays} días`}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Gravedad Superficial</span>
                <span className="font-bold font-mono text-emerald-400">
                  {selectedPlanet.gravity} m/s² ({(selectedPlanet.gravity / 9.81).toFixed(2)} g)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Temperatura Media</span>
                <span className="font-bold font-mono text-amber-400">{selectedPlanet.tempC} °C</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Satélites / Lunas</span>
                <span className="font-bold font-mono text-purple-300">{selectedPlanet.moons} lunas</span>
              </div>
            </div>

            {/* Pedagogical Explanation tailored to chosen Level */}
            <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-900/40 text-xs leading-relaxed text-slate-200">
              <p>{selectedPlanet.description[level]}</p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: SKYVIEW LITE & ISS REAL-TIME TRACKER
          ===================================================================== */}
      {subView === 'iss_tracker' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white">
                  Telemetría Orbital de la Estación Espacial Internacional (ISS)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                ÓRBITA LEO ACTIVA
              </span>
            </div>

            {/* Interactive World Map / Orbit Ground Track */}
            <div className="relative w-full h-52 bg-[#050C1A] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Earth Continents Abstract Vector */}
              <div className="absolute inset-0 opacity-30 flex items-center justify-around pointer-events-none">
                <div className="w-24 h-32 rounded-full border border-cyan-500/20 bg-cyan-900/10 blur-[1px]" />
                <div className="w-32 h-36 rounded-full border border-cyan-500/20 bg-cyan-900/10 blur-[1px]" />
              </div>

              {/* Equator & Latitudinal Grid */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
                <div className="w-full border-t border-cyan-400 border-dashed" />
                <div className="w-full border-t border-cyan-400" /> {/* Equator */}
                <div className="w-full border-t border-cyan-400 border-dashed" />
              </div>

              {/* Sinusoidal Ground Track Wave */}
              {showGroundTrack && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 0 100 Q 100 20, 200 100 T 400 100 T 600 100 T 800 100"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                </svg>
              )}

              {/* Real-time moving ISS marker */}
              <div
                style={{
                  left: `${((issOrbitAngle / 360) * 100)}%`,
                  top: `${50 - Math.sin((issOrbitAngle * Math.PI) / 180) * 35}%`,
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-75"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 animate-ping absolute -inset-1" />
                  <div className="px-2 py-1 rounded bg-slate-900/95 border border-emerald-400 text-white font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                    <span>🛰️ ISS</span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-emerald-300 mt-1 bg-black/80 px-1 rounded">
                  408 km · 27.600 km/h
                </div>
              </div>

              {/* Compass HUD Overlay */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300">
                Inclinación: 51.6° | Periodo: 92.68 min
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Velocidad Orbital</span>
                <span className="font-bold font-mono text-cyan-300">7.66 km/s (Mach 22.4)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Altitud Media</span>
                <span className="font-bold font-mono text-emerald-400">408.2 km sobre el mar</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Puesta de Sol</span>
                <span className="font-bold font-mono text-amber-400">16 amaneceres cada 24h</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tripulación Activa</span>
                <span className="font-bold font-mono text-purple-300">7 astronautas a bordo</span>
              </div>
            </div>

            {/* Educational takeaway according to level */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              {level === 'cotidiano' && (
                <p>
                  <strong>¿Cómo verla a simple vista?</strong> La ISS no tiene luces parpadeantes como los aviones: brilla como una estrella blanca intensísima que cruza el cielo en silencio durante 3 a 5 minutos, reflejando la luz del Sol con sus paneles solares de 73 metros.
                </p>
              )}
              {level === 'practico' && (
                <p>
                  <strong>Protocolo de avistamiento:</strong> Se puede ver durante el crepúsculo náutico (cuando la ciudad está a oscuras pero a 400 km de altura todavía da el sol). Si ves que de repente se apaga en pleno cielo, no ha desaparecido: acaba de entrar en el cono de sombra de la Tierra.
                </p>
              )}
              {level === 'universitario' && (
                <p>
                  <strong>Dinámica orbital kepleriana:</strong> Para mantenerse en órbita circular a r = R_Tierra + h ≈ 6.779 km, la fuerza centrífuga iguala a la gravedad: v = √(G·M_Tierra / r) ≈ 7.66 km/s. El rozamiento atmosférico residual hace decaer la órbita unos 2 km/mes, requiriendo re-boosts periódicos con los propulsores Progress/Cygnus.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: STELLARIUM VIRTUAL PLANETARIUM
          ===================================================================== */}
      {subView === 'stellarium_sky' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h4 className="text-xs font-bold text-white">
                  Planetario Virtual de Constelaciones (Catálogo Estelar)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                BÓVEDA CELESTE 360°
              </span>
            </div>

            {/* Interactive Sky Canvas */}
            <div className="relative w-full h-60 bg-[#030611] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              {/* Constellation Orion */}
              <div className="absolute top-8 left-12 flex flex-col items-center">
                <svg className="w-32 h-36">
                  {/* Orion Lines */}
                  <line x1="20" y1="20" x2="100" y2="25" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="20" x2="50" y2="70" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="100" y1="25" x2="70" y2="70" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="40" y1="70" x2="80" y2="70" stroke="#F59E0B" strokeWidth="2" /> {/* Belt */}
                  <line x1="50" y1="70" x2="30" y2="120" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="70" y1="70" x2="95" y2="115" stroke="#38BDF8" strokeWidth="1" />

                  {/* Betelgeuse (Red Supergiant) */}
                  <circle cx="20" cy="20" r="4.5" fill="#EF4444" className="animate-pulse" />
                  {/* Bellatrix */}
                  <circle cx="100" cy="25" r="3" fill="#E0F2FE" />
                  {/* Belt stars: Alnitak, Alnilam, Mintaka */}
                  <circle cx="45" cy="70" r="2.5" fill="#BAE6FD" />
                  <circle cx="60" cy="70" r="2.5" fill="#BAE6FD" />
                  <circle cx="75" cy="70" r="2.5" fill="#BAE6FD" />
                  {/* Saiph */}
                  <circle cx="30" cy="120" r="3" fill="#BAE6FD" />
                  {/* Rigel (Blue Supergiant) */}
                  <circle cx="95" cy="115" r="5" fill="#60A5FA" className="animate-pulse" />
                </svg>
                <span className="text-[10px] font-bold text-cyan-300 mt-1">Constelación de Orión</span>
                <span className="text-[9px] text-slate-400">Betelgeuse (roja) & Rigel (azul)</span>
              </div>

              {/* Constellation Ursa Major (Osa Mayor) */}
              <div className="absolute top-10 right-10 flex flex-col items-center">
                <svg className="w-36 h-28">
                  <polyline
                    points="20,70 50,60 80,75 110,65 115,35 145,30 140,60 110,65"
                    fill="none"
                    stroke="#A7F3D0"
                    strokeWidth="1.5"
                  />
                  <circle cx="20" cy="70" r="3" fill="#FFFFFF" />
                  <circle cx="50" cy="60" r="3" fill="#FFFFFF" />
                  <circle cx="80" cy="75" r="3" fill="#FFFFFF" />
                  <circle cx="110" cy="65" r="3" fill="#FFFFFF" />
                  <circle cx="115" cy="35" r="3" fill="#FFFFFF" />
                  <circle cx="145" cy="30" r="3" fill="#FFFFFF" />
                  <circle cx="140" cy="60" r="3" fill="#FFFFFF" />
                </svg>
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Osa Mayor (El Carro)</span>
                <span className="text-[9px] text-slate-400">Merak y Dubhe apuntan a Polaris</span>
              </div>

              {/* Horizon line indicator */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1">
                <span>[E] ESTE (90°)</span>
                <span>[S] SUR (180°)</span>
                <span>[O] OESTE (270°)</span>
              </div>
            </div>

            {/* Astronomical Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-red-400 block">🔴 Betelgeuse (Orión)</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Supergigante roja a 642 años luz. Es tan colosal que si estuviera en el lugar del Sol, engulliría a Mercurio, Venus, la Tierra y Marte.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-blue-400 block">🔵 Rigel (Orión)</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Supergigante azul con una luminosidad 120.000 veces superior a la de nuestro Sol. Temperatura superficial de 12.000 Kelvin.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 block">⭐ Polaris (Estrella Polar)</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Alineada casi exactamente con el eje de rotación terrestre norte. Desde el hemisferio norte, todas las estrellas parecen girar alrededor de ella.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 4: TIDES & NEWTON'S GRAVITATION
          ===================================================================== */}
      {subView === 'tides_gravity' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-cyan-300" />
                <h4 className="text-xs font-bold text-white">
                  Mecánica de Mareas: Gravedad Diferencial Sol-Tierra-Luna
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                {moonAngle === 0 || moonAngle === 180 ? 'MAREAS VIVAS (SIZIGIA)' : 'MAREAS MUERTAS (CUADRATURA)'}
              </span>
            </div>

            {/* Tide Visualizer Interactive Canvas */}
            <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Sun on far left */}
              <div className="absolute left-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-400 shadow-[0_0_20px_#F59E0B] flex items-center justify-center">
                  <Sun className="w-6 h-6 text-amber-950" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-1">Sol (Gravitación)</span>
              </div>

              {/* Earth in center with dynamic tidal bulge ellipse */}
              <div className="relative flex items-center justify-center">
                {/* Tidal Bulge Ellipse (Water envelope) */}
                <div
                  style={{
                    transform: `rotate(${moonAngle === 90 || moonAngle === 270 ? 90 : 0}deg)`,
                    width: moonAngle === 0 || moonAngle === 180 ? '110px' : '92px',
                    height: moonAngle === 0 || moonAngle === 180 ? '70px' : '82px',
                  }}
                  className="rounded-full bg-cyan-500/30 border border-cyan-400/80 transition-all duration-300 flex items-center justify-center"
                >
                  {/* Solid Earth Core */}
                  <div className="w-14 h-14 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] font-bold text-white">Tierra</span>
                  </div>
                </div>
              </div>

              {/* Moon rotating around Earth */}
              <div
                style={{
                  transform: `rotate(${moonAngle}deg) translate(95px) rotate(-${moonAngle}deg)`,
                }}
                className="absolute z-20 flex flex-col items-center transition-transform duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-400 shadow-md flex items-center justify-center">
                  <Moon className="w-3.5 h-3.5 text-slate-800" />
                </div>
                <span className="text-[9px] font-bold text-slate-300 mt-0.5">Luna</span>
              </div>
            </div>

            {/* Controls for Moon Angle */}
            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-300 font-bold">Fase Lunar:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: '🌑 Luna Nueva (0°)', angle: 0 },
                  { label: '🌓 Cuarto Creciente (90°)', angle: 90 },
                  { label: '🌕 Luna Llena (180°)', angle: 180 },
                  { label: '🌗 Cuarto Menguante (270°)', angle: 270 },
                ].map((f) => (
                  <button
                    key={f.angle}
                    onClick={() => setMoonAngle(f.angle)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      moonAngle === f.angle
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation tailored to level */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {level === 'cotidiano' && (
                <p>
                  <strong>¿Por qué hay dos mareas al día y no una?</strong> La Luna tira del agua que tiene más cerca (creando un abultamiento), pero también tira de la Tierra alejándola del agua del lado opuesto, creando un segundo abultamiento simultáneo en las antípodas. Por eso el mar sube cada ~12 horas y 25 minutos.
                </p>
              )}
              {level === 'practico' && (
                <p>
                  <strong>Mareas vivas vs muertas para pescadores y navegantes:</strong> Cuando el Sol y la Luna se alinean (sizigia, en luna llena o nueva), sus fuerzas gravitacionales se suman produciendo pleamares altísimas y bajamares mínimas. Cuando forman un ángulo de 90° (cuadratura), sus gravedades se contrarrestan, dando mareas suaves.
                </p>
              )}
              {level === 'universitario' && (
                <p>
                  <strong>Fuerza de marea diferencial:</strong> La aceleración mareal a_marea ≈ 2·G·M·R_Tierra / d³ decae con el cubo de la distancia (1/d³). Por eso la Luna, a pesar de tener una masa 2.7 × 10⁷ veces menor que el Sol, genera el 68% de las mareas terrestres al estar 389 veces más cerca.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 5: RELATIVITY & TIME DILATION
          ===================================================================== */}
      {subView === 'relativity' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">
                  Relatividad Especial de Einstein: Dilatación Temporal
                </h4>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                FACTOR DE LORENTZ γ = {gamma.toFixed(3)}
              </span>
            </div>

            {/* Velocity Slider */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  Velocidad de la Nave: {(velocityFractionC * 100).toFixed(0)}% de la velocidad de la luz (c)
                </span>
                <span className="font-mono text-purple-400 font-bold">
                  v = {(velocityFractionC * 299792).toLocaleString()} km/s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.995"
                step="0.005"
                value={velocityFractionC}
                onChange={(e) => setVelocityFractionC(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.0c (Reposo)</span>
                <span>0.5c</span>
                <span>0.8c</span>
                <span>0.99c</span>
                <span>c (Límite cósmico)</span>
              </div>
            </div>

            {/* Comparative Clocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Earth Clock */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Observador en la Tierra</span>
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {earthYears.toFixed(1)} años
                  </span>
                  <span className="text-[10px] text-slate-400 block">Tiempo transcurrido ($t$)</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 text-lg">
                  🌍
                </div>
              </div>

              {/* Astronaut Clock */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-300 block font-bold">Astronauta en la Nave</span>
                  <span className="text-xl font-bold font-mono text-purple-300">
                    {shipYears.toFixed(2)} años
                  </span>
                  <span className="text-[10px] text-purple-400 block">Tiempo propio ($t_0 = t / \gamma$)</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-600 flex items-center justify-center text-purple-200 text-lg">
                  🚀
                </div>
              </div>
            </div>

            {/* Explanation card according to level */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {level === 'cotidiano' && (
                <p>
                  <strong>La paradoja de los gemelos:</strong> Si viajas en una nave al 99% de la velocidad de la luz durante 1.4 años de tu reloj biológico, al regresar a la Tierra habrán pasado 10 años y tu hermano gemelo habrá envejecido 10 años mientras tú apenas tienes 1 año y medio más. El tiempo no es un reloj universal absoluto.
                </p>
              )}
              {level === 'practico' && (
                <p>
                  <strong>Aplicación en satélites GPS cotidianos:</strong> Los satélites GPS orbitan a 14.000 km/h (lo que atrasa sus relojes 7 microsegundos/día por relatividad especial) pero están en un campo gravitatorio más débil (lo que los adelanta 45 microsegundos/día por relatividad general). Si los ingenieros no corrigieran estos 38 microsegundos netos diarios, tu navegador de Google Maps fallaría por más de 11 kilómetros cada día.
                </p>
              )}
              {level === 'universitario' && (
                <p>
                  <strong>Métrica de Minkowski y factor de Lorentz:</strong> El intervalo espaciotemporal $ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2$ es invariante bajo transformaciones de Lorentz. A medida que $v \to c$, el factor $\gamma = (1 - v^2/c^2)^{-1/2} \to \infty$, lo que implica que el fotón no experimenta paso del tiempo propio ($d\tau = 0$) desde su emisión hasta su absorción.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
