import React, { useState, useMemo } from 'react';
import {
  Disc3,
  Play,
  Pause,
  Music,
  Clock,
  Sparkles,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ExternalLink,
  Volume2,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { SongTrack } from '../../../types';
import { AlbumData } from './AlbumsView';

interface AlbumArtGridViewProps {
  tracks: SongTrack[];
  currentTrack: SongTrack;
  isPlaying: boolean;
  onSelectAlbum: (album: AlbumData) => void;
  onPlayTrack: (track: SongTrack) => void;
  onToggleFavorite: (trackId: string) => void;
  onEditAlbumCover?: (album: AlbumData) => void;
  onOpenTrackMetadata?: (track: SongTrack) => void;
}

export const AlbumArtGridView: React.FC<AlbumArtGridViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectAlbum,
  onPlayTrack,
  onToggleFavorite,
  onEditAlbumCover,
  onOpenTrackMetadata,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'year' | 'tracks'>('title');
  const [expandedAlbumTitle, setExpandedAlbumTitle] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState<'2-col' | '1-col'>('2-col');

  // Group tracks into distinct AlbumData models
  const albums: AlbumData[] = useMemo(() => {
    const map = new Map<string, AlbumData>();

    tracks.forEach((t) => {
      const key = t.album;
      if (!map.has(key)) {
        map.set(key, {
          title: t.album,
          artist: t.artist,
          year: t.year,
          coverHue: t.coverHue,
          coverGradient: t.coverGradient,
          coverImage: t.coverImage,
          format: t.format,
          sampleRate: t.sampleRate,
          tracks: [t],
          totalDurationSeconds: t.durationSeconds,
        });
      } else {
        const item = map.get(key)!;
        if (!item.coverImage && t.coverImage) {
          item.coverImage = t.coverImage;
        }
        item.tracks.push(t);
        item.totalDurationSeconds += t.durationSeconds;
      }
    });

    return Array.from(map.values());
  }, [tracks]);

  // Extract unique genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach((t) => {
      if (t.genre) {
        const mainGenre = t.genre.split('/')[0].trim();
        set.add(mainGenre);
      }
    });
    return Array.from(set);
  }, [tracks]);

  // Filter and sort albums
  const filteredAlbums = useMemo(() => {
    return albums
      .filter((album) => {
        const matchesQuery =
          album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          album.artist.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGenre =
          selectedGenre === 'all' ||
          album.tracks.some((t) =>
            t.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
          );

        return matchesQuery && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
        if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
        if (sortBy === 'tracks') return b.tracks.length - a.tracks.length;
        return a.title.localeCompare(b.title);
      });
  }, [albums, searchQuery, selectedGenre, sortBy]);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      {/* 1. TOP CONTROLS & FILTER BAR */}
      <div className="space-y-3 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Galería Visual de Carátulas
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                  {filteredAlbums.length} álbumes
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Superficie de arte master con overlays de cristal translúcido (Glassmorphism)
              </p>
            </div>
          </div>

          {/* Quick controls: Sort & Grid size */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#131A22] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="title">Por Título</option>
                <option value="artist">Por Artista</option>
                <option value="year">Por Año</option>
                <option value="tracks">Por N° Pistas</option>
              </select>
            </div>

            {/* Density toggle */}
            <button
              onClick={() => setGridColumns((prev) => (prev === '2-col' ? '1-col' : '2-col'))}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A22] text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors text-xs font-semibold flex items-center gap-1"
              title="Cambiar tamaño de carátula"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] hidden sm:inline">
                {gridColumns === '2-col' ? '2 Columnas' : '1 Columna (Grande)'}
              </span>
            </button>
          </div>
        </div>

        {/* Search input & Genre pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por álbum, artista o repertorio..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#131A22] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Genre scrollable strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all ${
                selectedGenre === 'all'
                  ? 'bg-sky-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 dark:bg-[#161F28] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all ${
                  selectedGenre === genre
                    ? 'bg-sky-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 dark:bg-[#161F28] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. HIGH QUALITY ALBUM ART GRID WITH GLASSMORPHISM OVERLAYS */}
      <div
        className={`flex-1 overflow-y-auto grid gap-4 pb-20 pr-0.5 ${
          gridColumns === '2-col'
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-2'
            : 'grid-cols-1 max-w-xl mx-auto w-full'
        }`}
      >
        {filteredAlbums.map((album) => {
          const isCurrentAlbum = album.tracks.some((t) => t.id === currentTrack.id);
          const isExpanded = expandedAlbumTitle === album.title;

          return (
            <div
              key={album.title}
              className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end border ${
                isCurrentAlbum
                  ? 'border-sky-500/80 ring-2 ring-sky-500/20'
                  : 'border-slate-200/80 dark:border-slate-800/80 hover:border-sky-400/50'
              } min-h-[340px] sm:min-h-[380px]`}
              style={{
                backgroundColor: album.coverHue || '#0F172A',
              }}
            >
              {/* --- BACKGROUND HIGH-RES ARTWORK & GRADIENT LAYER --- */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
                {album.coverImage ? (
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.92] contrast-[1.05]"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${
                      album.coverGradient || 'from-sky-900 via-indigo-950 to-slate-950'
                    } flex items-center justify-center relative overflow-hidden`}
                  >
                    <Disc3 className="w-24 h-24 text-white/20 group-hover:rotate-45 transition-transform duration-700" />
                  </div>
                )}

                {/* Subtle vignette shade for guaranteed contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />
              </div>

              {/* --- TOP BADGES & QUICK ACTIONS (Floating Glass Tags) --- */}
              <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between pointer-events-none">
                {/* Format & Hi-Res Badge */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <span className="text-[10px] font-mono font-bold tracking-wide uppercase px-2.5 py-1 rounded-xl bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    {album.format} Lossless
                  </span>

                  <span className="text-[10px] font-mono px-2 py-1 rounded-xl bg-amber-500/30 backdrop-blur-md border border-amber-400/30 text-amber-200 font-bold hidden sm:inline">
                    {album.sampleRate}
                  </span>
                </div>

                {/* Top Action Buttons (Cover Editor & Total Tracks) */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {onEditAlbumCover && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAlbumCover(album);
                      }}
                      className="p-2 rounded-xl bg-black/40 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all shadow-sm"
                      title="Cambiar carátula de este álbum"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-xl bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-sm flex items-center gap-1">
                    <Music className="w-3 h-3 text-sky-400" />
                    <span>{album.tracks.length}</span>
                  </span>
                </div>
              </div>

              {/* --- VINYL DISK PEEK (Artistic Audiophile Detail) --- */}
              <div
                className={`absolute right-4 top-12 w-28 h-28 rounded-full bg-[#111] border-2 border-slate-700/80 shadow-2xl z-0 transition-all duration-700 pointer-events-none opacity-80 group-hover:translate-x-3 group-hover:-translate-y-2 group-hover:opacity-100 flex items-center justify-center ${
                  isCurrentAlbum && isPlaying ? 'animate-spin' : ''
                }`}
                style={{
                  background:
                    'radial-gradient(circle, #222 15%, #0d0d0d 30%, #2a2a2a 45%, #050505 60%, #1f1f1f 75%, #0a0a0a 100%)',
                }}
              >
                {/* Vinyl grooves */}
                <div className="w-16 h-16 rounded-full border border-white/10" />
                <div
                  className="w-9 h-9 rounded-full absolute flex items-center justify-center text-[8px] font-bold text-white shadow-inner"
                  style={{ backgroundColor: album.coverHue }}
                >
                  <Disc3 className="w-4 h-4 text-white/90" />
                </div>
              </div>

              {/* --- GLASSMORPHISM TRACK INFORMATION OVERLAY --- */}
              <div className="relative z-10 m-3 p-3.5 sm:p-4 rounded-2xl bg-white/15 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/15 shadow-2xl shadow-black/40 text-white transition-all duration-300">
                {/* Subtle top glare line */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                {/* Primary Info Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-white truncate tracking-tight drop-shadow-sm">
                        {album.title}
                      </h4>
                      {isCurrentAlbum && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-500/80 text-white flex items-center gap-1 shadow-xs">
                          <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                          En reproducción
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/80 font-medium truncate">
                      {album.artist}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-white/70 pt-0.5 font-mono">
                      {album.year && <span>{album.year}</span>}
                      {album.year && <span>·</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTotalTime(album.totalDurationSeconds)}
                      </span>
                      <span>·</span>
                      <span className="truncate">{album.tracks[0]?.genre || 'Hi-Fi'}</span>
                    </div>
                  </div>

                  {/* Play/Detail Action Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        if (album.tracks.length > 0) {
                          onPlayTrack(album.tracks[0]);
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 active:scale-95 transition-all cursor-pointer"
                      title="Reproducir Álbum Completo"
                    >
                      {isCurrentAlbum && isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* --- EXPANDABLE TRACKLIST IN FROSTED GLASS DRAWER --- */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/15 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 px-1">
                      Pistas del Álbum ({album.tracks.length})
                    </p>
                    {album.tracks.map((track, idx) => {
                      const isTrackPlaying = track.id === currentTrack.id && isPlaying;
                      const isThisTrackCurrent = track.id === currentTrack.id;

                      return (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between gap-2 p-2 rounded-xl transition-all ${
                            isThisTrackCurrent
                              ? 'bg-white/25 dark:bg-sky-950/60 border border-sky-400/40 text-white'
                              : 'bg-black/20 hover:bg-white/15 border border-transparent hover:border-white/10 text-white/90'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <button
                              onClick={() => onPlayTrack(track)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isThisTrackCurrent
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-white/20 hover:bg-white/30 text-white'
                              }`}
                            >
                              {isTrackPlaying ? (
                                <Pause className="w-3 h-3 fill-white" />
                              ) : (
                                <Play className="w-3 h-3 fill-white ml-0.5" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">
                                <span className="font-mono text-[10px] text-white/60 mr-1.5">
                                  {idx + 1}.
                                </span>
                                {track.title}
                              </p>
                              <span className="text-[9px] font-mono text-white/60">
                                {track.bitDepth} · {track.sampleRate}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-white/70">
                              {track.duration}
                            </span>
                            <button
                              onClick={() => onToggleFavorite(track.id)}
                              className={`p-1 rounded-md transition-colors ${
                                track.isFavorite
                                  ? 'text-rose-400'
                                  : 'text-white/40 hover:text-white'
                              }`}
                            >
                              <Heart
                                className={`w-3 h-3 ${track.isFavorite ? 'fill-rose-400' : ''}`}
                              />
                            </button>
                            {onOpenTrackMetadata && (
                              <button
                                onClick={() => onOpenTrackMetadata(track)}
                                className="p-1 text-white/50 hover:text-white transition-colors"
                                title="Metadatos"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer Bar of the Glassmorphism Card */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() =>
                      setExpandedAlbumTitle((prev) => (prev === album.title ? null : album.title))
                    }
                    className="flex items-center gap-1 text-white/80 hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Ocultar Pistas' : 'Ver Pistas'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={() => onSelectAlbum(album)}
                    className="flex items-center gap-1 text-sky-300 hover:text-sky-200 font-bold transition-colors cursor-pointer"
                  >
                    <span>Explorar Álbum</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
