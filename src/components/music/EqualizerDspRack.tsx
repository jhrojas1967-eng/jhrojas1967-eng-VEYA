import React, { useState } from 'react';
import {
  Sliders,
  SlidersHorizontal,
  Power,
  RotateCcw,
  Sparkles,
  Waves,
  Zap,
  Volume2,
  Check,
  Activity,
  Layers,
  Info,
  Radio,
  ShieldCheck,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { AudioDspState, EqPreset } from '../../types';
import { EQ_FREQUENCIES, EQ_PRESETS } from '../../data/musicData';

interface EqualizerDspRackProps {
  dsp: AudioDspState;
  onUpdateDsp: (updater: (prev: AudioDspState) => AudioDspState) => void;
  onOpenSettings?: () => void;
  isDark?: boolean;
}

export const EqualizerDspRack: React.FC<EqualizerDspRackProps> = ({
  dsp,
  onUpdateDsp,
  onOpenSettings,
  isDark = false,
}) => {
  const [activeSection, setActiveSection] = useState<'eq' | 'bbe' | 'reverb' | 'engine'>('eq');
  const [eqMode, setEqMode] = useState<'10bands' | '3bands'>('10bands');
  const [showPresetInfo, setShowPresetInfo] = useState(false);

  const activePreset = EQ_PRESETS.find((p) => p.id === dsp.activePresetId) || EQ_PRESETS[0];

  const handleToggleMasterDsp = () => {
    onUpdateDsp((prev) => ({
      ...prev,
      masterDspEnabled: !prev.masterDspEnabled,
    }));
  };

  const handleSelectPreset = (preset: EqPreset) => {
    onUpdateDsp((prev) => ({
      ...prev,
      activePresetId: preset.id,
      eqBands: [...preset.bands],
    }));
  };

  const handleBandChange = (index: number, val: number) => {
    onUpdateDsp((prev) => {
      const newBands = [...prev.eqBands];
      newBands[index] = val;
      return {
        ...prev,
        eqBands: newBands,
      };
    });
  };

  const handlePreampChange = (val: number) => {
    onUpdateDsp((prev) => ({ ...prev, preampGain: val }));
  };

  const handleResetBands = () => {
    onUpdateDsp((prev) => ({
      ...prev,
      preampGain: 0,
      eqBands: [...activePreset.bands],
    }));
  };

  // Generate SVG curve points for frequency response curve (300px width, 60px height)
  // Bands range from -10 to +10 dB. Center is 0 dB (y = 30).
  const curvePoints = dsp.eqBands.map((val, i) => {
    const x = 15 + (i * (270 / (dsp.eqBands.length - 1)));
    // Clamp to -10 to +10
    const clamped = Math.max(-10, Math.min(10, val + dsp.preampGain * 0.4));
    // y goes from 8 (-10dB) to 52 (+10dB), inverted
    const y = 30 - clamped * 2.2;
    return { x, y };
  });

  const svgPathD = curvePoints.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = curvePoints[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const svgAreaD = `${svgPathD} L ${curvePoints[curvePoints.length - 1].x},58 L ${curvePoints[0].x},58 Z`;

  return (
    <div className="flex flex-col space-y-3 pb-6">
      {/* Master DSP Power Bar (jetAudio Audiophile Style) */}
      <div className={`p-3.5 rounded-2xl border transition-all ${
        dsp.masterDspEnabled
          ? 'bg-gradient-to-r from-blue-950/20 via-sky-950/20 to-indigo-950/20 dark:from-[#002D4E] dark:to-[#121E2C] border-blue-400/40 dark:border-sky-500/50 shadow-sm'
          : 'bg-slate-100 dark:bg-[#151B22] border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleMasterDsp}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                dsp.masterDspEnabled
                  ? 'bg-gradient-to-tr from-sky-600 to-blue-500 text-white shadow-md ring-2 ring-sky-400/30'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-400'
              }`}
              title="Activar / Desactivar procesamiento DSP maestro"
            >
              <Power className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-wide">
                  MOTOR DSP jetAudio
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                  dsp.masterDspEnabled
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  {dsp.masterDspEnabled ? 'PROCESANDO' : 'BYPASS / DIRECT'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {dsp.masterDspEnabled
                  ? 'Ecualizador 10-Bandas + BBE + X-Bass activo'
                  : 'Salida directa sin coloración (Bit-Perfect Direct)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
                title="Ajustes de Audio & ReplayGain"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowPresetInfo(!showPresetInfo)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              title="Información del perfil acústico"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetBands}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800"
              title="Restablecer valores del preset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showPresetInfo && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-sky-700 dark:text-sky-300">{activePreset.name}:</span> {activePreset.description}
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs inside DSP */}
      <div className="flex items-center p-1 bg-slate-200/70 dark:bg-[#131A22] rounded-xl text-[11px] font-bold">
        {[
          { id: 'eq', label: '10-Band EQ', icon: Sliders },
          { id: 'bbe', label: 'BBE & X-Bass', icon: Zap },
          { id: 'reverb', label: 'Espacial & Reverb', icon: Waves },
          { id: 'engine', label: 'Audio Engine', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurr = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                isCurr
                  ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: 10-BAND GRAPHIC EQUALIZER & PRESETS */}
      {activeSection === 'eq' && (
        <div className="space-y-3">
          {/* Preset Selector Dropdown (Lista Desplegable Inteligente) */}
          <div className="bg-white dark:bg-[#131A22] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>MODO DSP / PERFIL ACÚSTICO</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                {activePreset.genre}
              </span>
            </div>

            <div className="relative">
              <select
                value={dsp.activePresetId}
                onChange={(e) => {
                  const found = EQ_PRESETS.find((p) => p.id === e.target.value);
                  if (found) handleSelectPreset(found);
                }}
                disabled={!dsp.masterDspEnabled}
                className="w-full appearance-none bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl px-3.5 py-2.5 pr-9 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50 cursor-pointer transition-all shadow-2xs"
              >
                {EQ_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} — {preset.genre}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {activePreset.description}
            </p>
          </div>

          {/* SVG Real-time Frequency Response Curve Visualizer */}
          <div className="p-3 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
              <span>CURVA DE RESPUESTA EN FRECUENCIA</span>
              <span className={dsp.masterDspEnabled ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-400'}>
                {dsp.masterDspEnabled ? `Preamp: ${dsp.preampGain >= 0 ? '+' : ''}${dsp.preampGain} dB` : 'BYPASS'}
              </span>
            </div>

            <div className="h-16 w-full bg-slate-50 dark:bg-[#0A0D12] rounded-xl p-1 relative border border-slate-100 dark:border-slate-900 flex items-center justify-center">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-solid border-sky-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
              </div>

              {/* Dynamic SVG Curve */}
              <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="eqGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={dsp.masterDspEnabled ? "0.45" : "0.08"} />
                    <stop offset="100%" stopColor="#155E95" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={svgAreaD} fill="url(#eqGlow)" />
                <path
                  d={svgPathD}
                  fill="none"
                  stroke={dsp.masterDspEnabled ? '#0284C7' : '#94A3B8'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {curvePoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="2.5"
                    fill={dsp.masterDspEnabled ? '#38BDF8' : '#64748B'}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Preamp Control Slider */}
          <div className="p-3 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                GANANCIA PREAMP
              </span>
              <span className="text-xs font-mono font-extrabold text-slate-800 dark:text-slate-200">
                {dsp.preampGain > 0 ? `+${dsp.preampGain}` : dsp.preampGain} dB
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              disabled={!dsp.masterDspEnabled}
              value={dsp.preampGain}
              onChange={(e) => handlePreampChange(parseFloat(e.target.value))}
              className="flex-1 accent-sky-600 disabled:opacity-40 cursor-pointer"
            />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
              Limiter ON
            </span>
          </div>

          {/* Graphic Equalizer Faders Section */}
          <div className="p-4 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Ajuste de Bandas
                </span>
                <span className="text-[10px] text-slate-400">
                  {eqMode === '10bands' ? '10 Frecuencias ISO Independientes' : 'Controles Esenciales 3-Vías'}
                </span>
              </div>

              {/* View Switcher: 10 Bandas vs 3 Vías */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setEqMode('10bands')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    eqMode === '10bands'
                      ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  10 Bandas
                </button>
                <button
                  type="button"
                  onClick={() => setEqMode('3bands')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    eqMode === '3bands'
                      ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  3 Vías Rápido
                </button>
              </div>
            </div>

            {eqMode === '10bands' ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1">
                  <span>GRAVES (32-125Hz)</span>
                  <span>MEDIOS (250Hz-2kHz)</span>
                  <span>AGUDOS (4k-16kHz)</span>
                </div>

                {/* Horizontal Scrollable Rack with 48dp Touch Targets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none px-1">
                  {dsp.eqBands.map((val, idx) => (
                    <div
                      key={EQ_FREQUENCIES[idx]}
                      className="flex flex-col items-center space-y-1.5 min-w-[50px] shrink-0 bg-slate-50/70 dark:bg-[#18212C] p-2 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300">
                        {val > 0 ? `+${val}` : val} dB
                      </span>
                      <div className="h-28 flex items-center justify-center py-1">
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          step="0.5"
                          disabled={!dsp.masterDspEnabled}
                          value={val}
                          onChange={(e) => handleBandChange(idx, parseFloat(e.target.value))}
                          className="h-24 -rotate-90 w-24 accent-sky-600 dark:accent-sky-400 cursor-pointer disabled:opacity-40"
                          style={{ transformOrigin: 'center' }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 text-center leading-tight">
                        {EQ_FREQUENCIES[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 3-Band Simplified Sliders */
              <div className="space-y-3 pt-1">
                {/* Bass Range (Bands 0, 1, 2: 32Hz, 64Hz, 125Hz) */}
                <div className="p-2.5 bg-slate-50/70 dark:bg-[#18212C] rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Graves (Bass)</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      {dsp.eqBands[1] > 0 ? `+${dsp.eqBands[1]}` : dsp.eqBands[1]} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    disabled={!dsp.masterDspEnabled}
                    value={dsp.eqBands[1]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      handleBandChange(0, v * 1.1);
                      handleBandChange(1, v);
                      handleBandChange(2, v * 0.8);
                    }}
                    className="w-full accent-sky-600 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>-10 dB</span>
                    <span>32 Hz - 125 Hz</span>
                    <span>+10 dB</span>
                  </div>
                </div>

                {/* Mid Range (Bands 3, 4, 5, 6: 250Hz - 2kHz) */}
                <div className="p-2.5 bg-slate-50/70 dark:bg-[#18212C] rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Medios / Voces (Midrange)</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      {dsp.eqBands[4] > 0 ? `+${dsp.eqBands[4]}` : dsp.eqBands[4]} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    disabled={!dsp.masterDspEnabled}
                    value={dsp.eqBands[4]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      handleBandChange(3, v * 0.8);
                      handleBandChange(4, v);
                      handleBandChange(5, v);
                      handleBandChange(6, v * 0.8);
                    }}
                    className="w-full accent-sky-600 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>-10 dB</span>
                    <span>250 Hz - 2 kHz</span>
                    <span>+10 dB</span>
                  </div>
                </div>

                {/* Treble Range (Bands 7, 8, 9: 4kHz - 16kHz) */}
                <div className="p-2.5 bg-slate-50/70 dark:bg-[#18212C] rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Agudos / Brillo (Treble)</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      {dsp.eqBands[8] > 0 ? `+${dsp.eqBands[8]}` : dsp.eqBands[8]} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    disabled={!dsp.masterDspEnabled}
                    value={dsp.eqBands[8]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      handleBandChange(7, v * 0.8);
                      handleBandChange(8, v);
                      handleBandChange(9, v * 1.1);
                    }}
                    className="w-full accent-sky-600 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>-10 dB</span>
                    <span>4 kHz - 16 kHz</span>
                    <span>+10 dB</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: BBE SOUND, BBE ViVA & X-BASS (jetAudio Signature DSP) */}
      {activeSection === 'bbe' && (
        <div className="space-y-3">
          {/* BBE Clarity Card */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    BBE Sound Clarity
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Alineación armónica de fase para micro-detalle cristalino
                  </p>
                </div>
              </div>
              <button
                onClick={() => onUpdateDsp((prev) => ({ ...prev, bbeClarityEnabled: !prev.bbeClarityEnabled }))}
                disabled={!dsp.masterDspEnabled}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 disabled:opacity-40 ${
                  dsp.bbeClarityEnabled && dsp.masterDspEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  dsp.bbeClarityEnabled && dsp.masterDspEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                disabled={!dsp.bbeClarityEnabled || !dsp.masterDspEnabled}
                value={dsp.bbeClarityLevel}
                onChange={(e) => onUpdateDsp((p) => ({ ...p, bbeClarityLevel: parseInt(e.target.value) }))}
                className="flex-1 accent-sky-600 disabled:opacity-30 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold w-9 text-right text-slate-700 dark:text-slate-300">
                {dsp.bbeClarityLevel}%
              </span>
            </div>
          </div>

          {/* BBE ViVA Surround Card */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    BBE ViVA (3D Spatial Stage)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Expansión acústica 3D holográfica para auriculares
                  </p>
                </div>
              </div>
              <button
                onClick={() => onUpdateDsp((prev) => ({ ...prev, bbeVivaSurroundEnabled: !prev.bbeVivaSurroundEnabled }))}
                disabled={!dsp.masterDspEnabled}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 disabled:opacity-40 ${
                  dsp.bbeVivaSurroundEnabled && dsp.masterDspEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  dsp.bbeVivaSurroundEnabled && dsp.masterDspEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                disabled={!dsp.bbeVivaSurroundEnabled || !dsp.masterDspEnabled}
                value={dsp.bbeVivaSurroundLevel}
                onChange={(e) => onUpdateDsp((p) => ({ ...p, bbeVivaSurroundLevel: parseInt(e.target.value) }))}
                className="flex-1 accent-sky-600 disabled:opacity-30 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold w-9 text-right text-slate-700 dark:text-slate-300">
                {dsp.bbeVivaSurroundLevel}%
              </span>
            </div>
          </div>

          {/* X-Bass Sub-woofer Enhancement */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    X-Bass (Sub-graves Profundos)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Potenciador de frecuencias subgraves con punto de corte
                  </p>
                </div>
              </div>
              <button
                onClick={() => onUpdateDsp((prev) => ({ ...prev, xBassEnabled: !prev.xBassEnabled }))}
                disabled={!dsp.masterDspEnabled}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 disabled:opacity-40 ${
                  dsp.xBassEnabled && dsp.masterDspEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  dsp.xBassEnabled && dsp.masterDspEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Cutoff frequency selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-slate-500">Corte de Frecuencia:</span>
              <div className="flex gap-1">
                {([60, 80, 100] as const).map((freq) => (
                  <button
                    key={freq}
                    disabled={!dsp.xBassEnabled || !dsp.masterDspEnabled}
                    onClick={() => onUpdateDsp((p) => ({ ...p, xBassCutoff: freq }))}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      dsp.xBassCutoff === freq
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {freq} Hz
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="100"
                disabled={!dsp.xBassEnabled || !dsp.masterDspEnabled}
                value={dsp.xBassLevel}
                onChange={(e) => onUpdateDsp((p) => ({ ...p, xBassLevel: parseInt(e.target.value) }))}
                className="flex-1 accent-sky-600 disabled:opacity-30 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold w-9 text-right text-slate-700 dark:text-slate-300">
                {dsp.xBassLevel}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: REVERB & STEREO WIDENING */}
      {activeSection === 'reverb' && (
        <div className="space-y-3">
          {/* Stereo Widening */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Amplitud Estéreo (Wide DSP)
                </h4>
                <p className="text-[10px] text-slate-400">
                  Separación panorámica de canales I/D
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                {dsp.wideStereoLevel}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              disabled={!dsp.masterDspEnabled}
              value={dsp.wideStereoLevel}
              onChange={(e) => onUpdateDsp((p) => ({ ...p, wideStereoLevel: parseInt(e.target.value) }))}
              className="w-full accent-sky-600 disabled:opacity-30 cursor-pointer"
            />
          </div>

          {/* Reverb Presets */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Reverberación de Sala (Reverb Engine)
              </h4>
              <p className="text-[10px] text-slate-400">
                Simulación física de acústica ambiental
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'off', label: 'Apagado' },
                { id: 'room', label: 'Sala (Room)' },
                { id: 'hall', label: 'Auditorio' },
                { id: 'stadium', label: 'Estadio' },
                { id: 'stage', label: 'Escenario' },
                { id: 'cathedral', label: 'Catedral' },
              ].map((rev) => {
                const isSelected = dsp.reverbType === rev.id;
                return (
                  <button
                    key={rev.id}
                    disabled={!dsp.masterDspEnabled}
                    onClick={() => onUpdateDsp((p) => ({ ...p, reverbType: rev.id as any }))}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                      isSelected && dsp.masterDspEnabled
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-40'
                    }`}
                  >
                    {rev.label}
                  </button>
                );
              })}
            </div>

            {dsp.reverbType !== 'off' && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Mezcla Efecto Húmedo (Wet Mix)</span>
                  <span className="font-mono">{dsp.reverbWet}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  disabled={!dsp.masterDspEnabled}
                  value={dsp.reverbWet}
                  onChange={(e) => onUpdateDsp((p) => ({ ...p, reverbWet: parseInt(e.target.value) }))}
                  className="w-full accent-sky-600 disabled:opacity-30 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: ADVANCED AUDIO ENGINE (ReplayGain, Crossfade, Hi-Res Output) */}
      {activeSection === 'engine' && (
        <div className="space-y-3">
          {/* ReplayGain Volume Normalization Card */}
          <div className="p-4 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Normalización ReplayGain (RG 2.0)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Iguala el volumen percibido entre pistas para evitar cambios bruscos
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdateDsp((p) => ({
                    ...p,
                    replayGainEnabled: !p.replayGainEnabled,
                    agcVolumeLeveling: !p.replayGainEnabled,
                  }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  dsp.replayGainEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Activar o desactivar ReplayGain"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    dsp.replayGainEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Target Gain & Options when enabled */}
            {dsp.replayGainEnabled && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                {/* Target Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Target de Ganancia Objetivo
                    </span>
                    <span className="font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-300/40 text-xs">
                      {dsp.replayGainTargetDb} dBFS
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-26"
                    max="-10"
                    step="1"
                    value={dsp.replayGainTargetDb}
                    onChange={(e) =>
                      onUpdateDsp((p) => ({
                        ...p,
                        replayGainTargetDb: parseInt(e.target.value),
                      }))
                    }
                    className="w-full accent-sky-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>-26 dB (Broadcast)</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">-18 dB (jetAudio Estándar)</span>
                    <span>-10 dB (Streaming)</span>
                  </div>
                </div>

                {/* Target Presets Quick Pills */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: -14, lbl: 'Spotify / -14 dB' },
                    { val: -18, lbl: 'jetAudio / -18 dB' },
                    { val: -23, lbl: 'EBU / -23 dB' },
                  ].map((preset) => {
                    const isSel = dsp.replayGainTargetDb === preset.val;
                    return (
                      <button
                        key={preset.val}
                        onClick={() =>
                          onUpdateDsp((p) => ({ ...p, replayGainTargetDb: preset.val }))
                        }
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all text-center ${
                          isSel
                            ? 'bg-sky-500 text-white border-sky-600 font-bold shadow-2xs'
                            : 'bg-slate-50 dark:bg-[#161F28] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {preset.lbl}
                      </button>
                    );
                  })}
                </div>

                {/* Mode: Track vs Album & Anti-Clipping */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#161F28] p-0.5 rounded-xl">
                    <button
                      onClick={() => onUpdateDsp((p) => ({ ...p, replayGainMode: 'track' }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        dsp.replayGainMode === 'track'
                          ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Pista
                    </button>
                    <button
                      onClick={() => onUpdateDsp((p) => ({ ...p, replayGainMode: 'album' }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        dsp.replayGainMode === 'album'
                          ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Álbum
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      onUpdateDsp((p) => ({
                        ...p,
                        replayGainPreventClipping: !p.replayGainPreventClipping,
                      }))
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                      dsp.replayGainPreventClipping
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-400/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Anti-Clipping</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Crossfade Slider */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Fundido Encadenado (Crossfade)
                </h4>
                <p className="text-[10px] text-slate-400">
                  Transición suave y sin silencios entre pistas
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                {dsp.crossfadeSeconds} seg
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={dsp.crossfadeSeconds}
              onChange={(e) => onUpdateDsp((p) => ({ ...p, crossfadeSeconds: parseInt(e.target.value) }))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Bit-perfect Direct Audio Output */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Salida Hi-Res Directa (AAudio / OpenSL ES)
                </h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold">
                  32-bit Float
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Omite el mezclador estándar de Android para evitar resampling forzado a 48kHz
              </p>
            </div>
            <button
              onClick={() => onUpdateDsp((p) => ({ ...p, hiResDirectOutput: !p.hiResDirectOutput }))}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                dsp.hiResDirectOutput ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                dsp.hiResDirectOutput ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
