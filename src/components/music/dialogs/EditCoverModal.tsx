import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check, Disc3, RefreshCw } from 'lucide-react';

interface EditCoverModalProps {
  title: string;
  subtitle: string;
  currentCoverImage?: string;
  currentHue: string;
  currentGradient?: string;
  onClose: () => void;
  onSaveCover: (coverData: { coverImage?: string; coverHue?: string; coverGradient?: string }) => void;
}

// Curated high quality royalty-free music artworks and gradient templates
const ART_PRESETS = [
  {
    id: 'vinyl-gold',
    name: 'Oro Sinfónico',
    hue: '#D97706',
    gradient: 'from-[#78350F] via-[#B45309] to-[#F59E0B]',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-synth',
    name: 'Cyber Neon',
    hue: '#0284C7',
    gradient: 'from-[#082F49] via-[#0284C7] to-[#38BDF8]',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'jazz-club',
    name: 'Jazz Velvet',
    hue: '#9333EA',
    gradient: 'from-[#3B0764] via-[#7E22CE] to-[#C084FC]',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'minimal-piano',
    name: 'Piano Acústico',
    hue: '#0D9488',
    gradient: 'from-[#042F2E] via-[#0F766E] to-[#2DD4BF]',
    imageUrl: 'https://images.unsplash.com/photo-1520523839898-507121c172d8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rock-energy',
    name: 'Rock Carmesí',
    hue: '#E11D48',
    gradient: 'from-[#881337] via-[#E11D48] to-[#FB7185]',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'ambient-nature',
    name: 'Serenidad Azul',
    hue: '#2563EB',
    gradient: 'from-[#1E3A8A] via-[#2563EB] to-[#60A5FA]',
    imageUrl: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=600&auto=format&fit=crop&q=80',
  },
];

export const EditCoverModal: React.FC<EditCoverModalProps> = ({
  title,
  subtitle,
  currentCoverImage,
  currentHue,
  currentGradient,
  onClose,
  onSaveCover,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(currentCoverImage);
  const [selectedHue, setSelectedHue] = useState<string>(currentHue);
  const [selectedGradient, setSelectedGradient] = useState<string | undefined>(currentGradient);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: typeof ART_PRESETS[0]) => {
    setSelectedImage(preset.imageUrl);
    setSelectedHue(preset.hue);
    setSelectedGradient(preset.gradient);
  };

  const handleResetToGradient = () => {
    setSelectedImage(undefined);
  };

  const handleSave = () => {
    onSaveCover({
      coverImage: selectedImage,
      coverHue: selectedHue,
      coverGradient: selectedGradient,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#131A22] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Personalizar Portada</span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
              {title} • {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Live Cover Preview */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-700/60 group">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Vista previa de portada"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br ${
                    selectedGradient || 'from-sky-800 to-blue-950'
                  }`}
                  style={{ backgroundColor: selectedHue }}
                >
                  <Disc3 className="w-16 h-16 opacity-40 animate-[spin_20s_linear_infinite]" />
                  <span className="text-[10px] font-mono font-bold mt-2 opacity-80 uppercase tracking-wider">
                    Carátula Studio
                  </span>
                </div>
              )}

              {selectedImage && (
                <button
                  onClick={handleResetToGradient}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  title="Quitar imagen personalizada"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              {selectedImage ? '✓ Imagen de portada seleccionada' : 'Modo Arte Generativo'}
            </p>
          </div>

          {/* Subtabs: Subir archivo vs Galería curada */}
          <div className="flex bg-slate-100 dark:bg-[#18212C] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-[#131A22] text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar Imagen</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-[#131A22] text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galería de Álbumes</span>
            </button>
          </div>

          {activeTab === 'upload' && (
            <div className="space-y-3">
              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 bg-slate-50/50 dark:bg-[#18212C]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Haz clic para examinar o arrastra aquí
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Soporta JPG, PNG y WebP (Recomendado 600x600 px)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Selecciona una portada maestra de alta resolución:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {ART_PRESETS.map((preset) => {
                  const isSelected = selectedImage === preset.imageUrl;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all p-1.5 flex items-center gap-2 ${
                        isSelected
                          ? 'border-sky-500 ring-2 ring-sky-500/40 bg-sky-50 dark:bg-sky-950/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 bg-white dark:bg-[#18212C]'
                      }`}
                    >
                      <img
                        src={preset.imageUrl}
                        alt={preset.name}
                        className="w-11 h-11 rounded-lg object-cover shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {preset.name}
                        </p>
                        <span className="text-[9px] font-mono text-slate-400">Master Art</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#16202A] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aplicar Portada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
