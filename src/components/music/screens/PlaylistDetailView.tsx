import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Plus,
  Clock,
  Music2,
  Trash2,
  ListMusic,
  Volume2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Heart,
  Search,
  X,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { Playlist, SongTrack } from '../../../types';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  allTracks: SongTrack[];
  currentTrack: SongTrack;
  isPlaying: boolean;
  onBack: () => void;
  onPlayTrack: (track: SongTrack) => void;
  onPlayAll: () => void;
  onOpenAddTracksModal: () => void;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  onReorderPlaylistTracks: (playlistId: string, newTrackIds: string[]) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  allTracks,
  currentTrack,
  isPlaying,
  onBack,
  onPlayTrack,
  onPlayAll,
  onOpenAddTracksModal,
  onRemoveTrackFromPlaylist,
  onReorderPlaylistTracks,
  onToggleFavorite,
}) => {
  const isFavoritesPlaylist = playlist.id === 'favorites';

  // Search filter inside this playlist
  const [searchFilter, setSearchFilter] = useState('');
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Drag & Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Resolve track objects in the playlist order
  const playlistTracks: SongTrack[] = playlist.trackIds
    .map((id) => allTracks.find((t) => t.id === id))
    .filter((t): t is SongTrack => Boolean(t));

  const totalDurationSecs = playlistTracks.reduce((acc, t) => acc + t.durationSeconds, 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  // Filtered tracks for search
  const visibleTracks = playlistTracks.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    );
  });

  // Reorder using drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Only reset if leaving the container
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTrackIds = [...playlist.trackIds];
    const [movedId] = newTrackIds.splice(draggedIndex, 1);
    newTrackIds.splice(targetIndex, 0, movedId);

    onReorderPlaylistTracks(playlist.id, newTrackIds);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move buttons (for touch or quick 1-step move)
  const handleMoveStep = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= playlist.trackIds.length) return;

    const newTrackIds = [...playlist.trackIds];
    const [movedId] = newTrackIds.splice(currentIndex, 1);
    newTrackIds.splice(targetIndex, 0, movedId);

    onReorderPlaylistTracks(playlist.id, newTrackIds);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4 pb-20">
      {/* Back Button Navigation */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 py-1 px-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Listas de Reproducción</span>
      </button>

      {/* Playlist Header Banner */}
      <div
        className={`p-5 rounded-3xl border shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all ${
          isFavoritesPlaylist
            ? 'bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-[#241219] dark:via-[#19141D] dark:to-[#131A22] border-rose-200/80 dark:border-rose-900/40'
            : 'bg-white dark:bg-[#131A22] border-slate-200/80 dark:border-slate-800'
        }`}
      >
        {/* Cover Artwork */}
        <div
          className={`w-28 h-28 rounded-2xl shrink-0 shadow-lg relative overflow-hidden flex items-center justify-center text-white ${
            isFavoritesPlaylist ? 'bg-gradient-to-br from-rose-500 to-pink-600 ring-2 ring-rose-400/40 shadow-rose-500/20' : ''
          }`}
          style={!isFavoritesPlaylist ? { backgroundColor: playlist.coverHue } : undefined}
        >
          {isFavoritesPlaylist ? (
            <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
          ) : (
            <ListMusic className="w-12 h-12 text-white/80" />
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                isFavoritesPlaylist
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40'
              }`}
            >
              {isFavoritesPlaylist ? 'COLECCIÓN INTELIGENTE' : 'LISTA DE REPRODUCCIÓN'}
            </span>
          </div>

          <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight flex items-center justify-center sm:justify-start gap-2">
            <span>{playlist.name}</span>
            {isFavoritesPlaylist && (
              <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
            )}
          </h2>

          {playlist.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5 text-[11px] text-slate-400 font-mono">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {playlistTracks.length} canciones
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalMins} min totales
            </span>
          </div>

          {/* Action Buttons: Reproducir, Añadir, Modo Reordenar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <button
              onClick={onPlayAll}
              disabled={playlistTracks.length === 0}
              className={`px-4 py-2 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                isFavoritesPlaylist
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                  : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Reproducir Lista</span>
            </button>

            {!isFavoritesPlaylist && (
              <button
                onClick={onOpenAddTracksModal}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Canciones</span>
              </button>
            )}

            {playlistTracks.length > 1 && (
              <button
                onClick={() => setIsReorderMode(!isReorderMode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  isReorderMode
                    ? 'bg-sky-500 text-white border-sky-600 shadow-2xs'
                    : 'bg-white dark:bg-[#18212C] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                }`}
                title="Activar modo arrastrar y soltar para reordenar pistas"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{isReorderMode ? 'Terminar Reordenación' : 'Reordenar Pistas'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Helper Banner when in Reorder Mode */}
      {isReorderMode && (
        <div className="p-3 bg-sky-50 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-800 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs text-sky-800 dark:text-sky-200">
            <GripVertical className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>
              <strong>Modo Reordenar:</strong> Arrastra desde el icono de agarre o pulsa las flechas para cambiar la posición de las pistas.
            </span>
          </div>
          <button
            onClick={() => setIsReorderMode(false)}
            className="px-2.5 py-1 bg-sky-600 text-white rounded-lg text-[11px] font-bold shrink-0 hover:bg-sky-500"
          >
            Listo
          </button>
        </div>
      )}

      {/* Track List Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Canciones en la lista ({playlistTracks.length})
          </h3>

          {playlistTracks.length > 4 && (
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar pistas..."
                className="w-full bg-white dark:bg-[#131A22] text-[11px] rounded-xl pl-8 pr-6 py-1.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {playlistTracks.length === 0 ? (
          <div className="bg-white dark:bg-[#131A22] p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Music2 className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isFavoritesPlaylist
                ? 'Aún no has añadido canciones a tus favoritos'
                : 'Esta lista no tiene canciones aún'}
            </p>
            {!isFavoritesPlaylist && (
              <button
                onClick={onOpenAddTracksModal}
                className="px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir canciones ahora</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            {visibleTracks.map((t, index) => {
              const isCurr = currentTrack.id === t.id;
              const isBeingDragged = draggedIndex === index;
              const isOverTarget = dragOverIndex === index && draggedIndex !== index;

              return (
                <div
                  key={t.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(index);
                  }}
                  onDragEnd={handleDragEnd}
                  onClick={() => onPlayTrack(t)}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    isBeingDragged
                      ? 'opacity-40 scale-[0.98] border-dashed border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
                      : isOverTarget
                      ? 'border-sky-500 ring-2 ring-sky-500/40 bg-sky-50/70 dark:bg-sky-950/40 shadow-md'
                      : isCurr
                      ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 shadow-xs'
                      : 'bg-white dark:bg-[#131A22] border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Drop indicator bar at top of target element */}
                  {isOverTarget && (
                    <div className="absolute -top-1 left-2 right-2 h-1 bg-sky-500 rounded-full animate-pulse shadow-sm" />
                  )}

                  {/* Left: Drag Handle + Track Number + Artwork */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Drag Grip Handle */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-sky-600 dark:text-slate-600 dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Arrastrar para cambiar orden"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Sequential Index Number / Wave icon */}
                    <div className="w-5 text-center font-mono text-xs font-bold text-slate-400 shrink-0">
                      {isCurr && isPlaying ? (
                        <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400 mx-auto animate-pulse" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Album Artwork Hue */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs relative overflow-hidden"
                      style={{ backgroundColor: t.coverHue }}
                    >
                      {t.coverImage ? (
                        <img src={t.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music2 className="w-4 h-4" />
                      )}
                      {t.isFavorite && (
                        <div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border border-white dark:border-[#131A22] flex items-center justify-center shadow-xs"
                          title="Marcada como Favorita"
                        >
                          <Heart className="w-2.5 h-2.5 fill-white text-white" />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurr ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {t.title}
                      </p>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {t.artist} • {t.album}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Move arrows, Favorite Toggle, Duration & Delete */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Up / Down Reorder Arrows */}
                    <div className="flex items-center">
                      <button
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStep(index, 'up');
                        }}
                        className="p-1 text-slate-300 hover:text-sky-600 dark:text-slate-600 dark:hover:text-sky-400 disabled:opacity-20 disabled:pointer-events-none rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Subir posición"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === playlist.trackIds.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveStep(index, 'down');
                        }}
                        className="p-1 text-slate-300 hover:text-sky-600 dark:text-slate-600 dark:hover:text-sky-400 disabled:opacity-20 disabled:pointer-events-none rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Bajar posición"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-mono text-slate-400">{t.duration}</span>

                    {/* Toggle Favorite Button with Visual Marker Feedback */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(t.id);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        t.isFavorite
                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      }`}
                      title={t.isFavorite ? 'Quitar de Favoritos' : 'Marcar como Favorito'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                          t.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>

                    {/* Remove from Playlist (or Unfavorite if viewing Favorites) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFavoritesPlaylist) {
                          onToggleFavorite(t.id);
                        } else {
                          onRemoveTrackFromPlaylist(playlist.id, t.id);
                        }
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title={isFavoritesPlaylist ? 'Quitar de favoritos' : 'Quitar de la lista'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
