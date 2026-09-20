import React, { useState } from 'react';
import {
  Search,
  Music2,
  Heart,
  Plus,
  ArrowUpDown,
  X,
  Volume2,
  Info,
} from 'lucide-react';
import { SongTrack } from '../../../types';

interface TracksViewProps {
  tracks: SongTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  replayGainEnabled?: boolean;
  onSelectTrack: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddToPlaylist: (trackId: string) => void;
  onOpenTrackMetadata?: (track: SongTrack) => void;
}

export const TracksView: React.FC<TracksViewProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  replayGainEnabled = false,
  onSelectTrack,
  onToggleFavorite,
  onOpenAddToPlaylist,
  onOpenTrackMetadata,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'FLAC' | 'WAV' | 'DSD' | 'fav'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'bitrate' | 'duration' | 'title'>('default');

  // Filter tracks
  const filtered = tracks.filter((t) => {
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
  const sorted = [...filtered].sort((a, b) => {
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
    <div className="flex-1 flex flex-col min-h-0 space-y-3">
      {/* Search Input Bar with Clear Button */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por título, artista o álbum..."
          className="w-full bg-white dark:bg-[#131A22] text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-200 dark:border-slate-800/80 focus:border-sky-500 focus:outline-none transition-colors shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter and Sort Toolbar (Spacious & Clean) */}
      <div className="flex items-center justify-between gap-2">
        {/* Format Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'FLAC', label: 'FLAC Hi-Res' },
            { id: 'WAV', label: 'WAV' },
            { id: 'DSD', label: 'DSD' },
            {
              id: 'fav',
              label: `Favoritas (${tracks.filter((t) => t.isFavorite).length})`,
              isFavPill: true,
            },
          ].map((f) => {
            const isSel = formatFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFormatFilter(f.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSel
                    ? f.isFavPill
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : f.isFavPill
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:border-rose-300'
                    : 'bg-white dark:bg-[#131A22] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {f.isFavPill && (
                  <Heart className={`w-3 h-3 ${isSel ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
                )}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select Button */}
        <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0 bg-white dark:bg-[#131A22] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="default">Orden original</option>
            <option value="bitrate">Mayor resolución</option>
            <option value="duration">Duración</option>
            <option value="title">Título A-Z</option>
          </select>
        </div>
      </div>

      {/* Track List Section */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 pb-20">
        {sorted.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Music2 className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-medium">No se encontraron pistas con esos criterios</p>
          </div>
        ) : (
          sorted.map((t) => {
            const originalIndex = tracks.findIndex((item) => item.id === t.id);
            const isCurr = originalIndex === currentTrackIndex;

            return (
              <div
                key={t.id}
                onClick={() => onSelectTrack(originalIndex)}
                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                  isCurr
                    ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 shadow-xs'
                    : 'bg-white dark:bg-[#131A22] border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                {/* Left: Artwork + Title/Artist */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs relative overflow-hidden"
                    style={{ backgroundColor: t.coverHue }}
                  >
                    {t.coverImage ? (
                      <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                    ) : isCurr && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <div className="w-1 bg-white animate-[bounce_0.8s_infinite] rounded-xs" />
                        <div className="w-1 bg-white animate-[bounce_0.6s_infinite_0.2s] rounded-xs" />
                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.4s] rounded-xs" />
                      </div>
                    ) : isCurr ? (
                      <Volume2 className="w-5 h-5 text-white" />
                    ) : (
                      <Music2 className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform" />
                    )}

                    {/* Subtle Playing Equalizer Wave Overlay on Top of Cover Image */}
                    {t.coverImage && isCurr && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-end gap-0.5 h-3.5">
                          <div className="w-1 bg-white animate-[bounce_0.8s_infinite] rounded-xs" />
                          <div className="w-1 bg-white animate-[bounce_0.6s_infinite_0.2s] rounded-xs" />
                          <div className="w-1 bg-white animate-[bounce_1s_infinite_0.4s] rounded-xs" />
                        </div>
                      </div>
                    )}

                    {t.isFavorite && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border border-white dark:border-[#131A22] flex items-center justify-center shadow-xs"
                        title="Pista favorita"
                      >
                        <Heart className="w-2.5 h-2.5 fill-white text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate ${
                        isCurr
                          ? 'text-sky-700 dark:text-sky-300'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {t.title}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {t.artist}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                      <span className="font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/60 px-1.5 py-0.2 rounded">
                        {t.format}
                      </span>
                      <span className="font-mono">{t.sampleRate}</span>
                      {replayGainEnabled && t.replayGainDb !== undefined && (
                        <span className="font-mono text-[9px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20" title={`Ganancia ReplayGain analizada: ${t.replayGainDb} dB`}>
                          RG {t.replayGainDb > 0 ? `+${t.replayGainDb}` : t.replayGainDb}dB
                        </span>
                      )}
                      <span>·</span>
                      <span className="font-mono">{t.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions (Info/Metadata + Add to Playlist + Favorite) */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {onOpenTrackMetadata && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTrackMetadata(t);
                      }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Metadatos e información técnica"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddToPlaylist(t.id);
                    }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Añadir a lista de reproducción"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(t.id);
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      t.isFavorite
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-900/50 shadow-2xs'
                        : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    }`}
                    title={t.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                        t.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
