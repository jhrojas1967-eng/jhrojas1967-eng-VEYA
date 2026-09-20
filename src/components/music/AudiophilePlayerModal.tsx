import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Mic2,
  Timer,
  Gauge,
  Waves,
  Music2,
  Radio,
  Disc3,
  Check,
} from 'lucide-react';
import { SongTrack, AudioDspState } from '../../types';

interface AudiophilePlayerModalProps {
  track: SongTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  progressSeconds: number;
  onSeekSeconds: (seconds: number) => void;
  onClose: () => void;
  onOpenDsp: () => void;
  dsp: AudioDspState;
  onUpdateDsp: (updater: (prev: AudioDspState) => AudioDspState) => void;
  onToggleFavorite: () => void;
}

export const AudiophilePlayerModal: React.FC<AudiophilePlayerModalProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  progressSeconds,
  onSeekSeconds,
  onClose,
  onOpenDsp,
  dsp,
  onUpdateDsp,
  onToggleFavorite,
}) => {
  const [activeDeckTab, setActiveDeckTab] = useState<'visualizer' | 'lyrics' | 'pitch'>('visualizer');
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one' | 'ab'>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [abPointA, setAbPointA] = useState<number | null>(null);
  const [abPointB, setAbPointB] = useState<number | null>(null);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [volume, setVolume] = useState(80);

  // Animated Audio Spectrum Bars (16 simulated frequency bins)
  const [spectrumLevels, setSpectrumLevels] = useState<number[]>(new Array(16).fill(12));

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateSpectrum = () => {
        setSpectrumLevels((prev) =>
          prev.map((_, i) => {
            const base = Math.sin(Date.now() / 180 + i * 0.4) * 35 + 45;
            const jitter = (Math.random() - 0.5) * 20;
            return Math.max(10, Math.min(95, base + jitter));
          })
        );
        animId = requestAnimationFrame(updateSpectrum);
      };
      animId = requestAnimationFrame(updateSpectrum);
    } else {
      setSpectrumLevels(new Array(16).fill(8));
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAbClick = () => {
    if (repeatMode !== 'ab') {
      setRepeatMode('ab');
      setAbPointA(progressSeconds);
      setAbPointB(null);
    } else if (abPointA !== null && abPointB === null) {
      setAbPointB(Math.max(abPointA + 2, progressSeconds));
    } else {
      setRepeatMode('all');
      setAbPointA(null);
      setAbPointB(null);
    }
  };

  const progressPercent = Math.min(100, (progressSeconds / (track.durationSeconds || 300)) * 100);

  return (
    <div className="absolute inset-0 z-50 bg-[#0B0F15] text-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-250 select-none">
      {/* Dynamic Background Glow based on Album Color */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: track.coverHue }}
      />

      {/* Top Header Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0 relative z-10 border-b border-white/10">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title="Minimizar reproductor"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="text-center min-w-0 px-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-sky-400 font-bold block">
            REPRODUCTOR AUDIOFILO JET-AUDIO
          </span>
          <p className="text-xs font-bold text-slate-200 truncate max-w-[200px]">
            {track.album}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSleepMenu(!showSleepMenu)}
            className={`p-1.5 rounded-lg transition-colors relative ${
              sleepTimerMinutes ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:text-white'
            }`}
            title="Temporizador de apagado"
          >
            <Timer className="w-4 h-4" />
            {sleepTimerMinutes && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={onOpenDsp}
            className={`p-1.5 rounded-lg transition-colors ${
              dsp.masterDspEnabled ? 'text-sky-400 bg-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
            title="Abrir Ecualizador & DSP"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sleep Timer Flyout Menu */}
      {showSleepMenu && (
        <div className="absolute top-14 right-4 z-50 bg-[#16202C] border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 text-xs">
          <p className="text-[10px] font-bold text-slate-400 px-2 py-1">APAGAR TRAS:</p>
          {[
            { label: 'Desactivado', val: null },
            { label: '15 Minutos', val: 15 },
            { label: '30 Minutos', val: 30 },
            { label: '60 Minutos', val: 60 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setSleepTimerMinutes(item.val);
                setShowSleepMenu(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 flex items-center justify-between"
            >
              <span>{item.label}</span>
              {sleepTimerMinutes === item.val && <Check className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          ))}
        </div>
      )}

      {/* Main Center Area: Visualizer / Vinyl Album / Lyrics */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 min-h-0 overflow-y-auto">
        {activeDeckTab === 'visualizer' && (
          <div className="w-full flex flex-col items-center space-y-3">
            {/* Album Cover with Vinyl disc effect */}
            <div className="relative group w-48 h-48 sm:w-56 sm:h-56">
              {/* Rotating Vinyl disc when playing */}
              <div
                className={`absolute -right-5 top-2 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#111] border-4 border-[#222] shadow-2xl flex items-center justify-center pointer-events-none transition-transform duration-700 ${
                  isPlaying ? 'rotate-[360deg] animate-[spin_8s_linear_infinite]' : ''
                }`}
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#333] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white/20" />
                </div>
              </div>

              {/* Main Album Jacket */}
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-2xl p-4 shadow-2xl border border-white/20 relative z-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                  track.coverGradient || 'from-sky-800 to-blue-950'
                }`}
                style={{ backgroundColor: track.coverHue }}
              >
                {track.coverImage && (
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {/* Gradient overlay for text contrast */}
                {track.coverImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
                )}

                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[10px] font-mono font-black bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20">
                    {track.format} LOSSLESS
                  </span>
                  <button
                    onClick={onToggleFavorite}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-transform active:scale-90"
                  >
                    <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </button>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <span className="text-[10px] text-white/80 font-medium">{track.genre}</span>
                  <h3 className="text-base font-black text-white leading-tight drop-shadow-md">
                    {track.title}
                  </h3>
                  <p className="text-xs text-white/90 font-medium drop-shadow-sm">
                    {track.artist}
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time 16-Band Graphic Spectrum Visualizer */}
            <div className="w-full max-w-[280px] bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1.5">
                <div className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-sky-400" />
                  <span>SPECTRUM RTA</span>
                </div>
                <span className={dsp.masterDspEnabled ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                  {dsp.masterDspEnabled ? `DSP: ${dsp.activePresetId.toUpperCase()}` : 'DSP: BYPASS'}
                </span>
              </div>
              <div className="h-10 flex items-end gap-1 px-1">
                {spectrumLevels.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-sky-600 via-blue-400 to-teal-300 rounded-xs transition-all duration-75"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LYRICS TAB */}
        {activeDeckTab === 'lyrics' && (
          <div className="w-full max-w-[300px] h-60 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 overflow-y-auto space-y-3 text-center">
            <div className="text-[10px] font-mono text-sky-400 font-bold tracking-wider mb-2">
              SINCRONIZACIÓN LRC KARAOKE
            </div>
            {(track.lyrics || ['Letra no disponible para esta pista instrumental']).map((line, idx) => (
              <p
                key={idx}
                className={`text-xs transition-all ${
                  idx === 1
                    ? 'text-sky-300 font-bold scale-105 drop-shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* PITCH & SPEED TAB (jetAudio Signature Feature) */}
        {activeDeckTab === 'pitch' && (
          <div className="w-full max-w-[300px] bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-4">
            <div className="text-[10px] font-mono text-sky-400 font-bold tracking-wider text-center">
              CONTROL DE TONO Y VELOCIDAD (PITCH & TEMPO)
            </div>

            {/* Playback Speed (Tempo Stretch without pitch shift) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Velocidad (Tempo)</span>
                <span className="font-mono font-bold text-sky-400">{dsp.playbackSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={dsp.playbackSpeed}
                onChange={(e) => onUpdateDsp((p) => ({ ...p, playbackSpeed: parseFloat(e.target.value) }))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Pitch Shifting (-6 to +6 semitones) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Tono (Pitch Shift)</span>
                <span className="font-mono font-bold text-sky-400">
                  {dsp.pitchSemitones > 0 ? `+${dsp.pitchSemitones}` : dsp.pitchSemitones} st
                </span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={dsp.pitchSemitones}
                onChange={(e) => onUpdateDsp((p) => ({ ...p, pitchSemitones: parseInt(e.target.value) }))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <button
              onClick={() => onUpdateDsp((p) => ({ ...p, playbackSpeed: 1.0, pitchSemitones: 0 }))}
              className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
            >
              Restablecer Normal (1.0x / 0 st)
            </button>
          </div>
        )}

        {/* Deck Tab Switcher: Visualizer / Lyrics / Pitch */}
        <div className="flex items-center gap-2 mt-2 bg-white/5 p-1 rounded-full text-[10px] font-bold">
          <button
            onClick={() => setActiveDeckTab('visualizer')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeDeckTab === 'visualizer' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visualizador
          </button>
          <button
            onClick={() => setActiveDeckTab('lyrics')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeDeckTab === 'lyrics' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Letra LRC
          </button>
          <button
            onClick={() => setActiveDeckTab('pitch')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeDeckTab === 'pitch' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pitch & Speed
          </button>
        </div>
      </div>

      {/* Audiophile Specs Badge Bar */}
      <div className="px-4 py-1.5 bg-black/60 border-t border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">{track.format}</span>
          <span>·</span>
          <span>{track.sampleRate}</span>
          <span>·</span>
          <span>{track.bitDepth}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sky-300">{track.bitrate}</span>
          <span>·</span>
          <span
            className={`px-1.5 py-0.2 rounded transition-colors ${
              dsp.replayGainEnabled
                ? 'text-emerald-300 bg-emerald-950/60 font-bold border border-emerald-500/30'
                : 'text-slate-500 line-through'
            }`}
            title={
              dsp.replayGainEnabled
                ? `ReplayGain Activo: Target ${dsp.replayGainTargetDb} dBFS (Pista: ${track.replayGainDb} dB)`
                : 'ReplayGain Desactivado'
            }
          >
            RG {dsp.replayGainEnabled ? `${dsp.replayGainTargetDb}dB` : 'OFF'}
          </span>
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="p-4 bg-gradient-to-t from-black via-[#0B0F15] to-transparent space-y-3 shrink-0">
        {/* Track Title & Artist */}
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-white truncate">{track.title}</h2>
            <p className="text-xs text-slate-400 truncate">{track.artist}</p>
          </div>

          {/* jetAudio A-B Repeat Button */}
          <button
            onClick={handleAbClick}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all ${
              repeatMode === 'ab'
                ? 'bg-amber-500 text-black border-amber-400 shadow-md animate-pulse'
                : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
            }`}
            title="Bucle A-B Repeat para estudio de audio"
          >
            {repeatMode === 'ab'
              ? `A-B [${abPointA ? formatTime(abPointA) : 'A'} → ${abPointB ? formatTime(abPointB) : 'B'}]`
              : 'A-B LOOP'}
          </button>
        </div>

        {/* Waveform Scrub Seekbar */}
        <div className="space-y-1">
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max={track.durationSeconds || 300}
              value={progressSeconds}
              onChange={(e) => onSeekSeconds(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-sky-400 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>{formatTime(progressSeconds)}</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Shuffle Mode */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${
              isShuffle ? 'text-sky-400 bg-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
            title="Modo aleatorio"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Prev Track */}
          <button
            onClick={onPrevTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Pista anterior"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-sky-500/30"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNextTrack}
            className="p-2 text-slate-300 hover:text-white transition-colors"
            title="Siguiente pista"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Repeat Mode (All, One, Off) */}
          <button
            onClick={() =>
              setRepeatMode((prev) =>
                prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'
              )
            }
            className={`p-2 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-sky-400 bg-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
            title="Modo repetición"
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Volume Slider Drawer */}
        <div className="flex items-center gap-2 pt-1 px-2 text-slate-400">
          <VolumeX className="w-3.5 h-3.5" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 h-1 bg-slate-800 rounded-full accent-sky-400 cursor-pointer"
          />
          <Volume2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono w-7 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  );
};
