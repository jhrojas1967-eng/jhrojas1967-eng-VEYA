import React from 'react';
import {
  X,
  Volume2,
  Sliders,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  Gauge,
  Radio,
  Check,
} from 'lucide-react';
import { AudioDspState } from '../../../types';

interface MusicSettingsModalProps {
  dsp: AudioDspState;
  onUpdateDsp: (updater: (prev: AudioDspState) => AudioDspState) => void;
  onClose: () => void;
}

// Common industry standard loudness targets for ReplayGain / Broadcast
const REPLAYGAIN_PRESETS = [
  {
    targetDb: -14,
    name: 'EBU R128 / Spotify (-14 dBFS)',
    desc: 'Estándar moderno de streaming de alta intensidad y presencia acústica.',
  },
  {
    targetDb: -18,
    name: 'jetAudio / ReplayGain 2.0 (-18 dBFS / 89 dB SPL)',
    desc: 'Calibración audiófila estándar recomendada para máxima dinámica sin fatiga.',
  },
  {
    targetDb: -23,
    name: 'ITU-R BS.1770 / Broadcast (-23 LUFS)',
    desc: 'Norma de radiodifusión europea y masterización orquestal clásica.',
  },
];

export const MusicSettingsModal: React.FC<MusicSettingsModalProps> = ({
  dsp,
  onUpdateDsp,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-white dark:bg-[#111720] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#161F2B]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Ajustes de Audio & Reproducción
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calibración del motor jetAudio y normalización acústica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* SECTION: REPLAYGAIN NORMALIZATION */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Normalización ReplayGain (RG 2.0)
                </h4>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  dsp.replayGainEnabled
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                }`}
              >
                {dsp.replayGainEnabled ? 'ACTIVO' : 'DESACTIVADO'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Analiza los metadatos psicoacústicos (LUFS / RMS) grabados en cada pista para igualar el volumen percibido, evitando sobresaltos entre diferentes álbumes o años de masterización.
            </p>

            {/* Main Toggle Switch */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Activar Normalización de Ganancia
                </span>
                <span className="text-[11px] text-slate-400">
                  Aplica compensación dinámica de volumen basada en metadatos ReplayGain
                </span>
              </div>
              <button
                onClick={() =>
                  onUpdateDsp((p) => ({
                    ...p,
                    replayGainEnabled: !p.replayGainEnabled,
                    agcVolumeLeveling: !p.replayGainEnabled,
                  }))
                }
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  dsp.replayGainEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                    dsp.replayGainEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Controls only available when ReplayGain is active */}
            {dsp.replayGainEnabled && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                {/* Mode Selector: Track Gain vs Album Gain */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                    Modo de Compensación
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onUpdateDsp((p) => ({ ...p, replayGainMode: 'track' }))}
                      className={`py-2 px-3 rounded-xl text-left border transition-all ${
                        dsp.replayGainMode === 'track'
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400/80 text-sky-700 dark:text-sky-300 font-bold'
                          : 'bg-white dark:bg-[#111720] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs block">Por Canción (Track)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Mismo nivel sonoro para cada pista individual
                      </span>
                    </button>

                    <button
                      onClick={() => onUpdateDsp((p) => ({ ...p, replayGainMode: 'album' }))}
                      className={`py-2 px-3 rounded-xl text-left border transition-all ${
                        dsp.replayGainMode === 'album'
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400/80 text-sky-700 dark:text-sky-300 font-bold'
                          : 'bg-white dark:bg-[#111720] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xs block">Por Álbum (Audiófilo)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Conserva la dinámica artística entre temas del mismo disco
                      </span>
                    </button>
                  </div>
                </div>

                {/* Target Gain Slider & Direct Preset Calibration */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        Target de Ganancia (Nivel Objetivo)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Punto de referencia de sonoridad en decibelios a escala completa
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-300/40">
                        {dsp.replayGainTargetDb} dBFS
                      </span>
                    </div>
                  </div>

                  {/* Target Range Slider */}
                  <div className="space-y-1.5">
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
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                      <span>-26 dB (Broadcast)</span>
                      <span className="text-sky-600 dark:text-sky-400 font-bold">-18 dB (jetAudio)</span>
                      <span>-10 dB (Agresivo)</span>
                    </div>
                  </div>

                  {/* Standard Presets Quick Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                      Normas Acústicas Predefinidas:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {REPLAYGAIN_PRESETS.map((pst) => {
                        const isSelected = dsp.replayGainTargetDb === pst.targetDb;
                        return (
                          <button
                            key={pst.targetDb}
                            onClick={() =>
                              onUpdateDsp((p) => ({ ...p, replayGainTargetDb: pst.targetDb }))
                            }
                            className={`p-2 rounded-xl text-left border transition-all text-xs ${
                              isSelected
                                ? 'bg-sky-500 text-white border-sky-600 shadow-xs font-bold'
                                : 'bg-white dark:bg-[#111720] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold">
                                {pst.targetDb} dB
                              </span>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[10px] block opacity-85 mt-0.5 line-clamp-1">
                              {pst.name.split(' (')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Preamp Gain Slider for Tagged Tracks */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        Preamp de Compensación Extra
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Ganancia adicional para pistas con etiqueta ReplayGain
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                      {dsp.replayGainPreampDb > 0 ? `+${dsp.replayGainPreampDb}` : dsp.replayGainPreampDb} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="0.5"
                    value={dsp.replayGainPreampDb}
                    onChange={(e) =>
                      onUpdateDsp((p) => ({
                        ...p,
                        replayGainPreampDb: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>-6.0 dB</span>
                    <span>0.0 dB (Neutro)</span>
                    <span>+6.0 dB</span>
                  </div>
                </div>

                {/* Anti-Clipping Limiter Guard */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        Protección Anti-Clipping (True Peak Limiter)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Atenúa picos si la ganancia excede los 0.0 dBFS para evitar distorsión digital
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateDsp((p) => ({
                        ...p,
                        replayGainPreventClipping: !p.replayGainPreventClipping,
                      }))
                    }
                    className={`w-10 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      dsp.replayGainPreventClipping ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        dsp.replayGainPreventClipping ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: AUDIO ENGINE EXTRA CONFIG (Crossfade & Hi-Res) */}
          <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Parámetros de Reproducción
            </h4>

            {/* Crossfade */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Fundido Cruzado (Crossfade)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Transición continua sin pausas entre canciones
                  </span>
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
                onChange={(e) =>
                  onUpdateDsp((p) => ({
                    ...p,
                    crossfadeSeconds: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Hi-Res Direct bit-perfect */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Salida Hi-Res Directa (AAudio / OpenSL ES)
                </span>
                <span className="text-[10px] text-slate-400">
                  Transmisión sin remuestreo forzado a 48kHz de Android
                </span>
              </div>
              <button
                onClick={() =>
                  onUpdateDsp((p) => ({
                    ...p,
                    hiResDirectOutput: !p.hiResDirectOutput,
                  }))
                }
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  dsp.hiResDirectOutput ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    dsp.hiResDirectOutput ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#161F2B]">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Radio className="w-3.5 h-3.5 text-sky-500" />
            <span>Motor de Audio jetAudio HD</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Guardar & Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
