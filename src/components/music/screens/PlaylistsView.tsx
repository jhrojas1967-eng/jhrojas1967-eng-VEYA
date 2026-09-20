import React, { useState } from 'react';
import {
  Plus,
  ListMusic,
  Play,
  Clock,
  Music2,
  Trash2,
  FolderPlus,
  Heart,
  Sparkles,
  ArrowUpDown,
  Search,
  X,
} from 'lucide-react';
import { Playlist, SongTrack } from '../../../types';

interface PlaylistsViewProps {
  playlists: Playlist[];
  tracks: SongTrack[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenCreateModal: () => void;
  onDeletePlaylist: (id: string) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  tracks,
  onSelectPlaylist,
  onOpenCreateModal,
  onDeletePlaylist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate favorites stats
  const favoriteTracks = tracks.filter((t) => t.isFavorite);
  const totalFavSecs = favoriteTracks.reduce((acc, t) => acc + t.durationSeconds, 0);
  const totalFavMins = Math.floor(totalFavSecs / 60);

  const getPlaylistDuration = (trackIds: string[]) => {
    let totalSecs = 0;
    trackIds.forEach((id) => {
      const found = tracks.find((t) => t.id === id);
      if (found) totalSecs += found.durationSeconds;
    });
    const mins = Math.floor(totalSecs / 60);
    return `${mins} min`;
  };

  const handleOpenFavorites = () => {
    const favPlaylist: Playlist = {
      id: 'favorites',
      name: 'Mis Favoritos',
      description: 'Colección de canciones marcadas como favoritas. Puedes arrastrar y soltar para reordenar tu lista personal.',
      coverHue: '#E11D48',
      trackIds: favoriteTracks.map((t) => t.id),
      createdAt: 'Inteligente',
    };
    onSelectPlaylist(favPlaylist);
  };

  const filteredPlaylists = playlists.filter((pl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return pl.name.toLowerCase().includes(q) || (pl.description && pl.description.toLowerCase().includes(q));
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4 pb-20">
      {/* 1. SMART PLAYLIST: MIS FAVORITOS (CARD DESTACADA) */}
      <div
        onClick={handleOpenFavorites}
        className="group relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 dark:from-[#9F1239] dark:via-[#BE185D] dark:to-[#881337] p-4 sm:p-5 rounded-3xl text-white shadow-lg shadow-rose-500/15 cursor-pointer border border-rose-400/30 hover:shadow-xl hover:scale-[1.008] transition-all"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform border border-white/30">
              <Heart className="w-7 h-7 fill-white text-white drop-shadow-sm" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs text-rose-100">
                  COLECCIÓN INTELIGENTE
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Mis Favoritos
              </h3>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-rose-100 font-mono">
                <span>{favoriteTracks.length} pistas marcadas</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {totalFavMins} min
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions on Favorites */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenFavorites();
              }}
              className="px-3.5 py-2 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Gestionar & Reordenar</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenFavorites();
              }}
              disabled={favoriteTracks.length === 0}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-xl flex items-center justify-center backdrop-blur-xs transition-colors"
              title="Reproducir favoritos"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION HEADER WITH CREATE BUTTON & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Listas de Reproducción Creadas ({playlists.length})
          </h3>
          <p className="text-[11px] text-slate-400">
            Organiza tus álbumes, mezclas y pistas por orden personalizado
          </p>
        </div>

        <div className="flex items-center gap-2">
          {playlists.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar lista..."
                className="bg-white dark:bg-[#131A22] text-xs rounded-xl pl-8 pr-6 py-1.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 w-36"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Lista</span>
          </button>
        </div>
      </div>

      {/* 3. PLAYLISTS CARDS LIST */}
      {filteredPlaylists.length === 0 ? (
        <div className="bg-white dark:bg-[#131A22] p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
          <FolderPlus className="w-10 h-10 mx-auto text-sky-500 opacity-60" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {searchQuery ? 'No se encontraron listas con esa búsqueda' : 'Aún no has creado listas personalizadas'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Crea una lista para organizar tus pistas favoritas por estado de ánimo o género
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear mi primera lista</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredPlaylists.map((pl) => {
            const trackCount = pl.trackIds.length;
            const duration = getPlaylistDuration(pl.trackIds);

            return (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className="group bg-white dark:bg-[#131A22] p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                {/* Artwork / Hue */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden"
                    style={{ backgroundColor: pl.coverHue }}
                  >
                    <ListMusic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {pl.name}
                    </h4>

                    {pl.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {pl.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                      <span className="flex items-center gap-1">
                        <Music2 className="w-2.5 h-2.5" />
                        {trackCount} canciones
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                        <ArrowUpDown className="w-2.5 h-2.5" />
                        Reordenable
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Play / Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlaylist(pl);
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
                    title="Abrir y gestionar lista"
                  >
                    <Play className="w-4 h-4 fill-sky-600 dark:fill-sky-400" />
                  </button>

                  {pl.id.startsWith('custom-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlaylist(pl.id);
                      }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Eliminar lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
