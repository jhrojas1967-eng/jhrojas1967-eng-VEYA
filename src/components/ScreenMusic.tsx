import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  Music2,
  Sparkles,
  Maximize2,
  Disc3,
  Power,
  Layers,
  Radio,
  Volume2,
} from 'lucide-react';
import { SongTrack, AudioDspState } from '../types';
import { AUDIOPHILE_TRACKS, INITIAL_DSP_STATE, EQ_PRESETS } from '../data/musicData';
import { EqualizerDspRack } from './music/EqualizerDspRack';
import { AudiophilePlayerModal } from './music/AudiophilePlayerModal';
import { MusicLibraryBrowser } from './music/MusicLibraryBrowser';

export const ScreenMusic: React.FC = () => {
  const [tracks, setTracks] = useState<SongTrack[]>(AUDIOPHILE_TRACKS);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSeconds, setProgressSeconds] = useState<number>(45);
  const [activeMainTab, setActiveMainTab] = useState<'library' | 'dsp'>('library');
  const [activeCategory, setActiveCategory] = useState<'tracks' | 'folders' | 'albums'>('tracks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDeckExpanded, setIsDeckExpanded] = useState<boolean>(false);
  const [dspState, setDspState] = useState<AudioDspState>(INITIAL_DSP_STATE);

  const currentTrack = tracks[selectedTrackIndex] || tracks[0];

  // Playback timer ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds((prev) => {
          if (prev >= (currentTrack.durationSeconds || 300)) {
            // Next track or loop
            setSelectedTrackIndex((idx) => (idx < tracks.length - 1 ? idx + 1 : 0));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSeconds, tracks.length]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
  };

  const handleNextTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0));
  };

  const handleToggleFavorite = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const activePreset = EQ_PRESETS.find((p) => p.id === dspState.activePresetId) || EQ_PRESETS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(
    100,
    (progressSeconds / (currentTrack.durationSeconds || 300)) * 100
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7FAFC] dark:bg-[#101418] relative">
      {/* Top Professional Navigation Header */}
      <div className="p-3 bg-white dark:bg-[#12181F] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
              <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  jetAudio HD Player
                </h2>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                  Hi-Res 24/192
                </span>
              </div>
            </div>
          </div>

          {/* Quick DSP Status Indicator & Toggle */}
          <button
            onClick={() =>
              setDspState((prev) => ({
                ...prev,
                masterDspEnabled: !prev.masterDspEnabled,
              }))
            }
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
              dspState.masterDspEnabled
                ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-400/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Conmutar procesamiento DSP maestro"
          >
            <Power className="w-3 h-3" />
            <span>{dspState.masterDspEnabled ? `DSP: ${activePreset.name.split(' ')[0]}` : 'DSP: OFF'}</span>
          </button>
        </div>

        {/* Primary View Switcher: Biblioteca Local vs Ecualizador DSP */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#161F28] p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveMainTab('library')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'library'
                ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => setActiveMainTab('dsp')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'dsp'
                ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ecualizador DSP</span>
            {dspState.masterDspEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 pb-24">
        {activeMainTab === 'library' ? (
          <MusicLibraryBrowser
            tracks={tracks}
            currentTrackIndex={selectedTrackIndex}
            onSelectTrack={(idx) => {
              setSelectedTrackIndex(idx);
              setProgressSeconds(0);
              setIsPlaying(true);
            }}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        ) : (
          <EqualizerDspRack
            dsp={dspState}
            onUpdateDsp={setDspState}
          />
        )}
      </div>

      {/* Docked Audiophile Mini-Player (Bottom Sticky Bar) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12181F]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl p-2.5">
        {/* Progress Bar (Clickable to Seek) */}
        <div className="mb-2 group cursor-pointer">
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5 px-0.5">
            <span>{formatTime(progressSeconds)}</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">{currentTrack.format} Lossless</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Track Info & Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Track Artwork & Title (Tap to expand full audiophile deck) */}
          <div
            onClick={() => setIsDeckExpanded(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden group-hover:scale-105 transition-transform"
              style={{ backgroundColor: currentTrack.coverHue }}
            >
              <Music2 className="w-4 h-4" />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-white/90 animate-spin" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                  {currentTrack.title}
                </p>
                <Maximize2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentTrack.artist} · <span className="font-mono text-sky-600 dark:text-sky-400">{currentTrack.bitrate}</span>
              </p>
            </div>
          </div>

          {/* Quick Playback Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrevTrack}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Pista anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Siguiente pista"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Expand Deck Button */}
            <button
              onClick={() => setIsDeckExpanded(true)}
              className="p-1.5 text-slate-400 hover:text-sky-500 transition-colors"
              title="Abrir reproductor completo jetAudio"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Audiophile Player Modal (Deck with Realtime Spectrum, Pitch/Tempo, LRC) */}
      {isDeckExpanded && (
        <AudiophilePlayerModal
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          progressSeconds={progressSeconds}
          onSeekSeconds={setProgressSeconds}
          onClose={() => setIsDeckExpanded(false)}
          onOpenDsp={() => {
            setIsDeckExpanded(false);
            setActiveMainTab('dsp');
          }}
          dsp={dspState}
          onUpdateDsp={setDspState}
          onToggleFavorite={() => handleToggleFavorite(currentTrack.id)}
        />
      )}
    </div>
  );
};
