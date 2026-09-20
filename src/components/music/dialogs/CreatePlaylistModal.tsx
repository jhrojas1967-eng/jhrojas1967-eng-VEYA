import React, { useState } from 'react';
import { X, Check, Music2, ListPlus } from 'lucide-react';
import { Playlist, SongTrack } from '../../../types';

interface CreatePlaylistModalProps {
  tracks: SongTrack[];
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}

const COLOR_OPTIONS = [
  { name: 'Océano', hex: '#155E95' },
  { name: 'Amatista', hex: '#7654A7' },
  { name: 'Ámbar Cálido', hex: '#B45309' },
  { name: 'Esmeralda', hex: '#006A67' },
  { name: 'Rubí', hex: '#E11D48' },
  { name: 'Índigo', hex: '#4F46E5' },
];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  tracks,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  const handleToggleTrack = (id: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newPlaylist: Playlist = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      coverHue: selectedColor,
      trackIds: selectedTrackIds,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreate(newPlaylist);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131A22] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Nueva Lista de Reproducción
              </h3>
              <p className="text-[11px] text-slate-400">Personaliza y selecciona canciones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre de la lista <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Sesión Nocturna, Jazz Acústico..."
              autoFocus
              className="w-full bg-slate-50 dark:bg-[#1B232E] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700/80 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas sobre el estado de ánimo o género..."
              className="w-full bg-slate-50 dark:bg-[#1B232E] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-700/80 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Color de Portada
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform ${
                    selectedColor === c.hex
                      ? 'scale-110 ring-2 ring-offset-2 ring-sky-500 dark:ring-offset-[#131A22]'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.hex && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Track Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Añadir Canciones Iniciales ({selectedTrackIds.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedTrackIds(
                    selectedTrackIds.length === tracks.length ? [] : tracks.map((t) => t.id)
                  )
                }
                className="text-[11px] text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                {selectedTrackIds.length === tracks.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 bg-slate-50/50 dark:bg-[#18212C]">
              {tracks.map((t) => {
                const isSelected = selectedTrackIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTrack(t.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-sky-100/70 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200'
                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{t.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{t.artist}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {t.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#16202A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            Crear Lista
          </button>
        </div>
      </div>
    </div>
  );
};
