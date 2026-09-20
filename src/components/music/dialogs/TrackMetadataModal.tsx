import React, { useState } from 'react';
import {
  X,
  FileText,
  Sliders,
  Disc3,
  Calendar,
  User,
  Music,
  Folder,
  Layers,
  Sparkles,
  Save,
  Check,
  Edit2,
  HardDrive,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { SongTrack } from '../../../types';

interface TrackMetadataModalProps {
  track: SongTrack;
  onClose: () => void;
  onSaveTrack: (updatedTrack: SongTrack) => void;
  onOpenCoverEditor: (track: SongTrack) => void;
}

export const TrackMetadataModal: React.FC<TrackMetadataModalProps> = ({
  track,
  onClose,
  onSaveTrack,
  onOpenCoverEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'tags' | 'audiophile'>('tags');

  // Form State
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [album, setAlbum] = useState(track.album);
  const [year, setYear] = useState<number | undefined>(track.year);
  const [genre, setGenre] = useState(track.genre || '');
  const [composer, setComposer] = useState(track.composer || '');
  const [trackNumber, setTrackNumber] = useState<number | undefined>(track.trackNumber || 1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SongTrack = {
      ...track,
      title,
      artist,
      album,
      year,
      genre,
      composer,
      trackNumber,
    };
    onSaveTrack(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131A22] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Artwork preview */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden shadow-xs relative shrink-0 flex items-center justify-center text-white"
              style={{ backgroundColor: track.coverHue }}
            >
              {track.coverImage ? (
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Disc3 className="w-6 h-6" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                Metadatos e Información de Pista
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {track.title} • {track.artist}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-1.5 bg-slate-100 dark:bg-[#18212C] p-1 rounded-xl text-xs font-bold w-full">
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'tags'
                  ? 'bg-white dark:bg-[#131A22] text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Etiquetas ID3 / Info</span>
            </button>
            <button
              onClick={() => setActiveTab('audiophile')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'audiophile'
                  ? 'bg-white dark:bg-[#131A22] text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Especificaciones Hi-Res</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'tags' && (
            <form id="metadata-form" onSubmit={handleSave} className="space-y-3">
              {/* Cover Quick Change Banner */}
              <div className="p-3 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    {track.coverImage ? (
                      <img src={track.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white"
                        style={{ backgroundColor: track.coverHue }}
                      >
                        <Disc3 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Carátula del Álbum
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Personaliza o sube una imagen
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCoverEditor(track)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1 transition-all"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Cambiar</span>
                </button>
              </div>

              {/* Title & Artist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Título de la Canción
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Artista Principal
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Album & Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Álbum
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Género Musical
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Ej. Clásica, Rock, Jazz..."
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* Year & Track # & Composer */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Año
                  </label>
                  <input
                    type="number"
                    value={year || ''}
                    onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1995"
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Pista Nº
                  </label>
                  <input
                    type="number"
                    value={trackNumber || ''}
                    onChange={(e) => setTrackNumber(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1"
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Compositor
                  </label>
                  <input
                    type="text"
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    placeholder="Compositor"
                    className="w-full bg-slate-50 dark:bg-[#18212C] text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'audiophile' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Códec & Formato</span>
                  <p className="text-xs font-black text-sky-600 dark:text-sky-400">
                    {track.format} Lossless
                  </p>
                  <p className="text-[10px] text-slate-400">Compresión sin pérdida de audio</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Profundidad de Bits</span>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {track.bitDepth || '24-bit'} Studio Master
                  </p>
                  <p className="text-[10px] text-slate-400">144 dB Rango Dinámico Teórico</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Frecuencia de Muestreo</span>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {track.sampleRate}
                  </p>
                  <p className="text-[10px] text-slate-400">Ultra High-Resolution Audio</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Tasa de Transferencia</span>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {track.bitrate}
                  </p>
                  <p className="text-[10px] text-slate-400">Flujo binario sin recortes</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Etiqueta ReplayGain</span>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {track.replayGainDb ? `${track.replayGainDb >= 0 ? '+' : ''}${track.replayGainDb} dB` : '-1.2 dB'}
                  </p>
                  <p className="text-[10px] text-slate-400">Normalización EBU R128 calculada</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Canales de Salida</span>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                    2.0 Estéreo Puro
                  </p>
                  <p className="text-[10px] text-slate-400">Fase acústica alineada</p>
                </div>
              </div>

              {/* Local File Path */}
              <div className="p-3 bg-slate-50 dark:bg-[#18212C] rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <Folder className="w-3.5 h-3.5" />
                  <span>RUTA DEL ARCHIVO LOCAL</span>
                </div>
                <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
                  {track.folderPath || `/storage/emulated/0/Music/Master/${track.artist}/${track.album}/${track.title}.flac`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#16202A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cerrar
          </button>

          {activeTab === 'tags' ? (
            <button
              type="submit"
              form="metadata-form"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Metadatos</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('tags')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-all"
            >
              Editar Etiquetas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
