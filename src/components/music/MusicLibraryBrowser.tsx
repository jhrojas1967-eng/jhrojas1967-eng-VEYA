import React, { useState } from 'react';
import {
  Search,
  Folder,
  Music2,
  Heart,
  Sliders,
  MoreVertical,
  Disc3,
  Layers,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { SongTrack } from '../../types';
import { MUSIC_FOLDERS } from '../../data/musicData';

interface MusicLibraryBrowserProps {
  tracks: SongTrack[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: 'tracks' | 'folders' | 'albums';
  onCategoryChange: (cat: 'tracks' | 'folders' | 'albums') => void;
}

export const MusicLibraryBrowser: React.FC<MusicLibraryBrowserProps> = ({
  tracks,
  currentTrackIndex,
  onSelectTrack,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) => {
  const [formatFilter, setFormatFilter] = useState<'all' | 'FLAC' | 'WAV' | 'DSD' | 'fav'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'bitrate' | 'duration' | 'title'>('default');

  // Filter tracks based on search query and format filter
  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (formatFilter === 'fav') return t.isFavorite;
    if (formatFilter !== 'all') return t.format === formatFilter;
    return true;
  });

  // Sort tracks
  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'duration') return b.durationSeconds - a.durationSeconds;
    if (sortBy === 'bitrate') {
      const brA = parseInt(a.bitrate) || 0;
      const brB = parseInt(b.bitrate) || 0;
      return brB - brA;
    }
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar título, artista, álbum o resolución..."
          className="w-full bg-white dark:bg-[#131A22] text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none"
        />
      </div>

      {/* Category Pills: Canciones | Carpetas Android | Álbumes */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-0.5 rounded-xl font-bold text-[11px]">
          {[
            { id: 'tracks', label: 'Canciones' },
            { id: 'folders', label: 'Carpetas' },
            { id: 'albums', label: 'Álbumes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-[#1C242E] text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Selector Button */}
        {activeCategory === 'tracks' && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
            <ArrowUpDown className="w-3 h-3" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-[10px] text-slate-600 dark:text-slate-400 focus:outline-none font-bold cursor-pointer"
            >
              <option value="default">Orden original</option>
              <option value="bitrate">Bitrate (Mayor calidad)</option>
              <option value="duration">Duración</option>
              <option value="title">Título A-Z</option>
            </select>
          </div>
        )}
      </div>

      {/* Format Filter Badges for Tracks View */}
      {activeCategory === 'tracks' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold scrollbar-none">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'FLAC', label: 'FLAC Hi-Res' },
            { id: 'WAV', label: 'WAV 32-bit' },
            { id: 'DSD', label: 'DSD SACD' },
            { id: 'fav', label: 'Favoritas' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                formatFilter === f.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white dark:bg-[#131A22] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* VIEW: TRACK LIST */}
      {activeCategory === 'tracks' && (
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
          {sortedTracks.map((t) => {
            const originalIndex = tracks.findIndex((item) => item.id === t.id);
            const isCurr = originalIndex === currentTrackIndex;

            return (
              <div
                key={t.id}
                onClick={() => onSelectTrack(originalIndex)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border ${
                  isCurr
                    ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 shadow-xs'
                    : 'bg-white dark:bg-[#131A22] border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Thumbnail / Hue with Playing Indicator */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 relative overflow-hidden shadow-xs"
                    style={{ backgroundColor: t.coverHue }}
                  >
                    {isCurr ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <div className="w-1 bg-white animate-[bounce_0.8s_infinite] rounded-xs" />
                        <div className="w-1 bg-white animate-[bounce_0.6s_infinite_0.2s] rounded-xs" />
                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.4s] rounded-xs" />
                      </div>
                    ) : (
                      <Music2 className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurr ? 'text-sky-700 dark:text-sky-300 font-extrabold' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {t.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                      <span className="truncate">{t.artist}</span>
                      <span>·</span>
                      <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {t.format} {t.sampleRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">{t.duration}</span>
                    <span className="text-[8px] font-mono text-slate-500 block">{t.bitrate}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(t.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${t.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: ANDROID LOCAL FOLDERS */}
      {activeCategory === 'folders' && (
        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            ALMACENAMIENTO LOCAL Y TARJETA SD ({MUSIC_FOLDERS.length})
          </div>
          {MUSIC_FOLDERS.map((folder) => (
            <div
              key={folder.path}
              className="p-3 bg-white dark:bg-[#131A22] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-sky-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {folder.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {folder.path}
                  </p>
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono shrink-0">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">{folder.count} pistas</span>
                <span>{folder.size}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: ALBUMS GRID */}
      {activeCategory === 'albums' && (
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5">
          {tracks.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => onSelectTrack(idx)}
              className="p-2.5 bg-white dark:bg-[#131A22] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-all cursor-pointer flex flex-col space-y-2 group"
            >
              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center text-white relative overflow-hidden shadow-sm"
                style={{ backgroundColor: t.coverHue }}
              >
                <Disc3 className="w-8 h-8 opacity-60 group-hover:rotate-45 transition-transform" />
                <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-white font-bold backdrop-blur-xs">
                  {t.format}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {t.album}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {t.artist} · {t.year || 2024}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
