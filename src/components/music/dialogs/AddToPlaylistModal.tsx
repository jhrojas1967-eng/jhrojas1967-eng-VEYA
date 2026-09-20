import React from 'react';
import { X, Check, ListPlus, Music2, Plus } from 'lucide-react';
import { Playlist, SongTrack } from '../../../types';

interface AddToPlaylistModalProps {
  track: SongTrack;
  playlists: Playlist[];
  onClose: () => void;
  onToggleTrackInPlaylist: (playlistId: string, trackId: string) => void;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  track,
  playlists,
  onClose,
  onToggleTrackInPlaylist,
  onOpenCreatePlaylist,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131A22] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
              Añadir a Lista
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              "{track.title}" - {track.artist}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playlist List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {playlists.map((pl) => {
            const isInPlaylist = pl.trackIds.includes(track.id);

            return (
              <div
                key={pl.id}
                onClick={() => onToggleTrackInPlaylist(pl.id, track.id)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                  isInPlaylist
                    ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500'
                    : 'bg-slate-50 dark:bg-[#18212C] border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: pl.coverHue }}
                  >
                    <Music2 className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {pl.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {pl.trackIds.length} canciones
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isInPlaylist
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            );
          })}

          {/* Button to Create New Playlist from here */}
          <button
            onClick={() => {
              onClose();
              onOpenCreatePlaylist();
            }}
            className="w-full mt-2 py-3 px-4 border border-dashed border-sky-400/60 dark:border-sky-500/40 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-2xl text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Crear nueva lista de reproducción</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#16202A] border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-500"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
