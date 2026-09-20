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
} from 'lucide-react';
import { AudioDspState, EqPreset } from '../../types';
import { EQ_FREQUENCIES, EQ_PRESETS } from '../../data/musicData';

interface EqualizerDspRackProps {
  dsp: AudioDspState;
  onUpdateDsp: (updater: (prev: AudioDspState) => AudioDspState) => void;
  isDark?: boolean;
}

export const EqualizerDspRack: React.FC<EqualizerDspRackProps> = ({
  dsp,
  onUpdateDsp,
  isDark = false,
}) => {
  const [activeSection, setActiveSection] = useState<'eq' | 'bbe' | 'reverb' | 'engine'>('eq');
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
          {/* Preset Selector Carousel (Rock, Pop, Clásico, Dance, Estadio, Acústica...) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
              <span>MODOS PREDEFINIDOS ({EQ_PRESETS.length})</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">
                {activePreset.genre}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {EQ_PRESETS.map((preset) => {
                const isSelected = dsp.activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    disabled={!dsp.masterDspEnabled}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected && dsp.masterDspEnabled
                        ? 'bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#002D4E] shadow-sm'
                        : 'bg-white dark:bg-[#161F28] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 disabled:opacity-40'
                    }`}
                  >
                    {isSelected && dsp.masterDspEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
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

          {/* 10-Band Graphic Equalizer Faders */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-0.5">
              <span>GRAVES / BASS</span>
              <span>MEDIOS / VOCAL</span>
              <span>AGUDOS / TREBLE</span>
            </div>

            <div className="grid grid-cols-10 gap-1 pt-2">
              {dsp.eqBands.map((val, idx) => (
                <div key={EQ_FREQUENCIES[idx]} className="flex flex-col items-center space-y-2">
                  <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                    {val > 0 ? `+${val}` : val}
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
                  <span className="text-[8px] font-mono text-slate-400 text-center leading-tight">
                    {EQ_FREQUENCIES[idx]}
                  </span>
                </div>
              ))}
            </div>
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

      {/* SECTION 4: ADVANCED AUDIO ENGINE (AGC, Crossfade, Hi-Res Output) */}
      {activeSection === 'engine' && (
        <div className="space-y-3">
          {/* Automatic Gain Control (AGC) */}
          <div className="p-3.5 bg-white dark:bg-[#12181F] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Control Automático de Ganancia (AGC)
              </h4>
              <p className="text-[10px] text-slate-400">
                Normalización ReplayGain para evitar saltos de volumen entre canciones
              </p>
            </div>
            <button
              onClick={() => onUpdateDsp((p) => ({ ...p, agcVolumeLeveling: !p.agcVolumeLeveling }))}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                dsp.agcVolumeLeveling ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                dsp.agcVolumeLeveling ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
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
