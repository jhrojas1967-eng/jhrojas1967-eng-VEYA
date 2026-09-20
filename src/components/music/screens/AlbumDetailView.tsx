import React from 'react';
import {
  ArrowLeft,
  Play,
  Clock,
  Heart,
  Plus,
  Disc3,
  Volume2,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { SongTrack } from '../../../types';
import { AlbumData } from './AlbumsView';

interface AlbumDetailViewProps {
  album: AlbumData;
  currentTrack: SongTrack;
  isPlaying: boolean;
  onBack: () => void;
  onPlayTrack: (track: SongTrack) => void;
  onPlayAll: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddToPlaylist: (trackId: string) => void;
  onEditAlbumCover: (album: AlbumData) => void;
  onOpenTrackMetadata?: (track: SongTrack) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  currentTrack,
  isPlaying,
  onBack,
  onPlayTrack,
  onPlayAll,
  onToggleFavorite,
  onOpenAddToPlaylist,
  onEditAlbumCover,
  onOpenTrackMetadata,
}) => {
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4 pb-20">
      {/* Back Button Navigation */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 py-1.5 px-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Álbumes</span>
      </button>

      {/* Album Header Banner (Spacious, Sophisticated & Charming) */}
      <div className="bg-white dark:bg-[#131A22] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Album Artwork with Hover Action */}
        <div className="relative group shrink-0">
          <div
            className={`w-32 h-32 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center text-white bg-gradient-to-br ${
              album.coverGradient || 'from-sky-800 to-blue-900'
            }`}
            style={{ backgroundColor: album.coverHue }}
          >
            {album.coverImage ? (
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc3 className="w-14 h-14 text-white/30 animate-[spin_20s_linear_infinite]" />
            )}
            <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
              {album.format}
            </span>
          </div>

          <button
            onClick={() => onEditAlbumCover(album)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-xs font-bold"
            title="Cambiar portada del álbum"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px]">Cambiar</span>
          </button>
        </div>

        {/* Album Metadata */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            ÁLBUM MASTER DISCOGRÁFICO
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
            {album.title}
          </h2>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {album.artist}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-400 font-mono">
            {album.year && <span>Año {album.year}</span>}
            <span>•</span>
            <span>{album.tracks.length} canciones</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTotalTime(album.totalDurationSeconds)}
            </span>
          </div>

          {/* Action Buttons: Reproducir Álbum & Cambiar Portada */}
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              onClick={onPlayAll}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Reproducir Álbum</span>
            </button>

            <button
              onClick={() => onEditAlbumCover(album)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title="Cargar o cambiar portada del álbum"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Cambiar Portada</span>
            </button>
          </div>
        </div>
      </div>

      {/* Album Tracks List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Lista de Pistas del Álbum ({album.tracks.length})
        </h3>

        <div className="space-y-1.5">
          {album.tracks.map((t, index) => {
            const isCurr = currentTrack.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => onPlayTrack(t)}
                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                  isCurr
                    ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 shadow-xs'
                    : 'bg-white dark:bg-[#131A22] border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Track Number + Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-7 text-center font-mono text-xs font-bold text-slate-400 shrink-0">
                    {isCurr && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400 mx-auto animate-pulse" />
                    ) : (
                      <span>{index + 1}</span>
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
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {t.bitDepth || '24-bit'} • {t.sampleRate} • {t.bitrate}
                    </p>
                  </div>
                </div>

                {/* Right: Duration + Actions */}
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-xs font-mono text-slate-400 mr-1">{t.duration}</span>

                  {onOpenTrackMetadata && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTrackMetadata(t);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Ver metadatos de la pista"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddToPlaylist(t.id);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Añadir a lista de reproducción"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(t.id);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Favorito"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        t.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

