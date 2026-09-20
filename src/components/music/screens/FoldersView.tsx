import React, { useState } from 'react';
import {
  Folder,
  ArrowLeft,
  Play,
  Music2,
  HardDrive,
  Clock,
  Volume2,
} from 'lucide-react';
import { SongTrack } from '../../../types';
import { MUSIC_FOLDERS } from '../../../data/musicData';

interface FoldersViewProps {
  tracks: SongTrack[];
  currentTrack: SongTrack;
  isPlaying: boolean;
  onPlayTrack: (track: SongTrack) => void;
  onPlayFolderTracks: (folderTracks: SongTrack[]) => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayFolderTracks,
}) => {
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null);

  const selectedFolder = MUSIC_FOLDERS.find((f) => f.path === selectedFolderPath);

  const folderTracks = selectedFolderPath
    ? tracks.filter((t) => t.folderPath === selectedFolderPath)
    : [];

  if (selectedFolder) {
    return (
      <div className="flex-1 flex flex-col min-h-0 space-y-4 pb-20">
        {/* Back Button */}
        <button
          onClick={() => setSelectedFolderPath(null)}
          className="self-start flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 py-1 px-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Carpetas</span>
        </button>

        {/* Folder Header */}
        <div className="bg-white dark:bg-[#131A22] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Folder className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {selectedFolder.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                {selectedFolder.path}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {folderTracks.length} archivos de audio reconocidos ({selectedFolder.size})
              </p>
            </div>
          </div>

          <button
            onClick={() => onPlayFolderTracks(folderTracks)}
            disabled={folderTracks.length === 0}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Reproducir Carpeta</span>
          </button>
        </div>

        {/* Folder Tracks List */}
        <div className="space-y-1.5">
          {folderTracks.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Music2 className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs">No se encontraron archivos en este directorio</p>
            </div>
          ) : (
            folderTracks.map((t) => {
              const isCurr = currentTrack.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => onPlayTrack(t)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    isCurr
                      ? 'bg-sky-50 dark:bg-[#0C2438] border-sky-400 dark:border-sky-500 shadow-xs'
                      : 'bg-white dark:bg-[#131A22] border-slate-100 dark:border-slate-800/80 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: t.coverHue }}
                    >
                      {isCurr && isPlaying ? (
                        <Volume2 className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Music2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurr ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {t.artist} • {t.format} {t.sampleRate}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 shrink-0 ml-2">
                    {t.duration}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3 pb-20">
      <div className="px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Directorios Locales ({MUSIC_FOLDERS.length})
        </h3>
        <p className="text-[11px] text-slate-400">
          Explorador de almacenamiento interno y tarjeta MicroSD
        </p>
      </div>

      <div className="space-y-2.5">
        {MUSIC_FOLDERS.map((folder) => (
          <div
            key={folder.path}
            onClick={() => setSelectedFolderPath(folder.path)}
            className="group bg-white dark:bg-[#131A22] p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-sky-400 dark:hover:border-sky-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Folder className="w-6 h-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {folder.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {folder.path}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {folder.count} pistas • {folder.size}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
