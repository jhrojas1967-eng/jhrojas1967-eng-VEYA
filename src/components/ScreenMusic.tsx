import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Sliders, ListMusic, Music2, Volume2, Search } from 'lucide-react';
import { SongTrack } from '../types';

export const ScreenMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums' | 'dsp'>('tracks');
  const [selectedTrack, setSelectedTrack] = useState<number>(0);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(35);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tracks: SongTrack[] = [
    { id: '1', title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite Bergamasque', duration: '5:04', isFavorite: true, coverHue: '#155E95' },
    { id: '2', title: 'Gymnopédie No. 1', artist: 'Erik Satie', album: 'Piano Solo Classics', duration: '3:22', isFavorite: true, coverHue: '#7654A7' },
    { id: '3', title: 'Spiegel im Spiegel', artist: 'Arvo Pärt', album: 'Alina', duration: '8:12', isFavorite: false, coverHue: '#006A67' },
    { id: '4', title: 'Weightless', artist: 'Marconi Union', album: 'Ambient 1', duration: '8:08', isFavorite: false, coverHue: '#3B82F6' },
    { id: '5', title: 'Opening', artist: 'Philip Glass', album: 'Glassworks', duration: '6:24', isFavorite: true, coverHue: '#6366F1' },
  ];

  const current = tracks[selectedTrack] || tracks[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7FAFC] dark:bg-[#101418] pb-16">
      {/* Search Header */}
      <div className="p-3 bg-white dark:bg-[#12181F] border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en música local..."
            className="w-full bg-slate-100 dark:bg-[#1C242E] text-slate-800 dark:text-slate-100 text-xs rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-[#155E95] dark:focus:border-[#8ECEFF] focus:outline-none"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-[11px] font-bold">
          {(['tracks', 'albums', 'dsp'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[#155E95] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab === 'tracks' ? 'Canciones' : tab === 'albums' ? 'Álbumes' : 'Ecualizador DSP'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'dsp' ? (
          /* DSP / Equalizer View */
          <div className="p-4 rounded-3xl bg-white dark:bg-[#12181F] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#155E95] dark:text-[#8ECEFF]" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Motor de Audio & DSP</h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Activo
              </span>
            </div>

            <div className="space-y-3">
              {[
                { freq: '60 Hz (Subgraves)', val: 3 },
                { freq: '250 Hz (Graves)', val: 1 },
                { freq: '1 kHz (Medios)', val: 0 },
                { freq: '4 kHz (Presencia)', val: 2 },
                { freq: '16 kHz (Agudos)', val: 4 },
              ].map((eq) => (
                <div key={eq.freq} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <span>{eq.freq}</span>
                    <span className="font-mono">+{eq.val} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    defaultValue={eq.val}
                    className="w-full accent-[#155E95] dark:accent-[#8ECEFF] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Track List */
          <div className="space-y-1.5">
            {tracks.map((t, idx) => {
              const isCurr = idx === selectedTrack;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrack(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isCurr
                      ? 'bg-[#D7EEFF]/60 dark:bg-[#004A7B]/30 border-[#155E95] dark:border-[#8ECEFF]'
                      : 'bg-white dark:bg-[#12181F] border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: t.coverHue }}
                    >
                      <Music2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurr ? 'text-[#155E95] dark:text-[#8ECEFF]' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{t.artist} · {t.album}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{t.duration}</span>
                    <button className="text-slate-300 hover:text-rose-500">
                      <Heart className={`w-3.5 h-3.5 ${t.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating "Ahora Suena" Mini Player Card */}
      <div className="p-3 bg-white dark:bg-[#12181F] border-t border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#155E95] dark:bg-[#8ECEFF] h-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
            <span>1:45</span>
            <span>{current.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: current.coverHue }}
            >
              <Music2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{current.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{current.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTrack((prev) => (prev > 0 ? prev - 1 : tracks.length - 1))}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#155E95] dark:bg-[#8ECEFF] text-white dark:text-[#003355] flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => setSelectedTrack((prev) => (prev < tracks.length - 1 ? prev + 1 : 0))}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
