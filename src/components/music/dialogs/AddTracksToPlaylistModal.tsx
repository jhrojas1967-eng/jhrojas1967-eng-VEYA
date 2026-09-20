import React, { useState } from 'react';
import { X, Search, Check, Music2, Heart, Plus } from 'lucide-react';
import { Playlist, SongTrack } from '../../../types';

interface AddTracksToPlaylistModalProps {
  playlist: Playlist;
  allTracks: SongTrack[];
  onClose: () => void;
  onAddTracks: (playlistId: string, trackIdsToAdd: string[]) => void;
}

export const AddTracksToPlaylistModal: React.FC<AddTracksToPlaylistModalProps> = ({
  playlist,
  allTracks,
  onClose,
  onAddTracks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavOnly, setFilterFavOnly] = useState(false);
  // Pre-select tracks that are NOT already in playlist
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);

  const filteredTracks = allTracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterFavOnly && !t.isFavorite) return false;
    return true;
  });

  const handleToggle = (id: string) => {
    if (playlist.trackIds.includes(id)) return; // Already in playlist
    setSelectedToAdd((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllAvailable = () => {
    const available = filteredTracks
      .filter((t) => !playlist.trackIds.includes(t.id))
      .map((t) => t.id);
    setSelectedToAdd(available);
  };

  const handleConfirm = () => {
    if (selectedToAdd.length > 0) {
      onAddTracks(playlist.id, selectedToAdd);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131A22] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Añadir Canciones a la Lista
            </h3>
            <p className="text-[11px] text-slate-400">
              "{playlist.name}" • Selecciona pistas para agregar
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, artista o álbum..."
              className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterFavOnly(!filterFavOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold border transition-colors ${
                  filterFavOnly
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/60 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-3 h-3 ${filterFavOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Solo Favoritos</span>
              </button>
            </div>

            <button
              onClick={handleSelectAllAvailable}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Seleccionar visibles
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <div className="p-4 overflow-y-auto space-y-1.5 flex-1">
          {filteredTracks.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <Music2 className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs font-medium">No se encontraron pistas con ese criterio</p>
            </div>
          ) : (
            filteredTracks.map((t) => {
              const isAlreadyIn = playlist.trackIds.includes(t.id);
              const isSelected = selectedToAdd.includes(t.id);

              return (
                <div
                  key={t.id}
                  onClick={() => handleToggle(t.id)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all border ${
                    isAlreadyIn
                      ? 'opacity-60 bg-slate-100/70 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 cursor-pointer shadow-2xs'
                      : 'bg-white dark:bg-[#18212C] border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: t.coverHue }}
                    >
                      <Music2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {t.title}
                        </p>
                        {t.isFavorite && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 px-1.5 py-0.2 rounded shrink-0">
                            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                            Favorito
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {t.artist} • {t.album}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[11px] font-mono text-slate-400">{t.duration}</span>

                    {isAlreadyIn ? (
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg">
                        Ya en lista
                      </span>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#16202A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {selectedToAdd.length} pista(s) seleccionada(s)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 rounded-xl"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedToAdd.length === 0}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir {selectedToAdd.length > 0 ? `(${selectedToAdd.length})` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
