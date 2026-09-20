import React, { useState, useMemo } from 'react';
import { Disc3, ArrowUpDown, Clock, Music, Sparkles } from 'lucide-react';
import { SongTrack } from '../../../types';

export interface AlbumData {
  title: string;
  artist: string;
  year?: number;
  coverHue: string;
  coverGradient?: string;
  coverImage?: string;
  format: string;
  sampleRate: string;
  tracks: SongTrack[];
  totalDurationSeconds: number;
}

interface AlbumsViewProps {
  tracks: SongTrack[];
  onSelectAlbum: (album: AlbumData) => void;
  onSwitchToGallery?: () => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  tracks,
  onSelectAlbum,
  onSwitchToGallery,
}) => {
  const [albumSortBy, setAlbumSortBy] = useState<'title' | 'artist' | 'year' | 'tracks'>('title');

  // Group tracks by album
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

    const list = Array.from(map.values());

    return list.sort((a, b) => {
      if (albumSortBy === 'artist') return a.artist.localeCompare(b.artist);
      if (albumSortBy === 'year') return (b.year || 0) - (a.year || 0);
      if (albumSortBy === 'tracks') return b.tracks.length - a.tracks.length;
      return a.title.localeCompare(b.title);
    });
  }, [tracks, albumSortBy]);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3">
      {/* Header with Sort Selector */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Colección de Álbumes ({albums.length})
          </h3>
          <p className="text-[11px] text-slate-400">Ediciones Master & Discografías Locales</p>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToGallery && (
            <button
              onClick={onSwitchToGallery}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              title="Ver en Galería Visual con Glassmorphism"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>Galería Art</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-white dark:bg-[#131A22] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={albumSortBy}
              onChange={(e) => setAlbumSortBy(e.target.value as any)}
              className="bg-transparent border-none text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="title">Por Título</option>
              <option value="artist">Por Artista</option>
              <option value="year">Por Año de Lanzamiento</option>
              <option value="tracks">Por N° de Canciones</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spacious 2-Column Grid of Albums */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3.5 pb-20 pr-0.5">
        {albums.map((album) => (
          <div
            key={album.title}
            onClick={() => onSelectAlbum(album)}
            className="group bg-white dark:bg-[#131A22] p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col space-y-2.5"
          >
            {/* Square Album Cover with subtle vinyl peek */}
            <div
              className={`w-full aspect-square rounded-xl relative overflow-hidden shadow-sm flex items-center justify-center text-white bg-gradient-to-br ${
                album.coverGradient || 'from-sky-800 to-blue-900'
              }`}
              style={{ backgroundColor: album.coverHue }}
            >
              {album.coverImage ? (
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Disc3 className="w-10 h-10 text-white/40 group-hover:rotate-45 group-hover:scale-105 transition-all duration-300" />
              )}

              {/* Format Badge */}
              <span className="absolute top-2 left-2 text-[9px] font-mono font-bold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                {album.format}
              </span>

              {/* Tracks Count Badge */}
              <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                <Music className="w-2.5 h-2.5" />
                <span>{album.tracks.length}</span>
              </span>
            </div>

            {/* Album Info */}
            <div className="min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {album.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {album.artist}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                {album.year && <span>{album.year}</span>}
                {album.year && <span>·</span>}
                <span className="flex items-center gap-0.5 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTotalTime(album.totalDurationSeconds)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
