import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  Music2,
  Disc3,
  Power,
  Maximize2,
  Folder,
  ListMusic,
  Library,
  Volume2,
  Settings,
  Sparkles,
} from 'lucide-react';
import { SongTrack, AudioDspState, Playlist } from '../types';
import {
  AUDIOPHILE_TRACKS,
  INITIAL_DSP_STATE,
  EQ_PRESETS,
  INITIAL_PLAYLISTS,
  MUSIC_FOLDERS,
} from '../data/musicData';
import { EqualizerDspRack } from './music/EqualizerDspRack';
import { AudiophilePlayerModal } from './music/AudiophilePlayerModal';
import { TracksView } from './music/screens/TracksView';
import { AlbumsView, AlbumData } from './music/screens/AlbumsView';
import { AlbumArtGridView } from './music/screens/AlbumArtGridView';
import { AlbumDetailView } from './music/screens/AlbumDetailView';
import { PlaylistsView } from './music/screens/PlaylistsView';
import { PlaylistDetailView } from './music/screens/PlaylistDetailView';
import { FoldersView } from './music/screens/FoldersView';
import { CreatePlaylistModal } from './music/dialogs/CreatePlaylistModal';
import { AddToPlaylistModal } from './music/dialogs/AddToPlaylistModal';
import { AddTracksToPlaylistModal } from './music/dialogs/AddTracksToPlaylistModal';
import { MusicSettingsModal } from './music/dialogs/MusicSettingsModal';
import { TrackMetadataModal } from './music/dialogs/TrackMetadataModal';
import { EditCoverModal } from './music/dialogs/EditCoverModal';

type AudioBottomTab = 'library' | 'playlists' | 'dsp';
type LibraryCategory = 'tracks' | 'albums' | 'gallery' | 'folders';

export const ScreenMusic: React.FC = () => {
  const [tracks, setTracks] = useState<SongTrack[]>(AUDIOPHILE_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSeconds, setProgressSeconds] = useState<number>(45);

  // Bottom Tab Navigation (3 main sections)
  const [activeBottomTab, setActiveBottomTab] = useState<AudioBottomTab>('library');

  // Sub-category selector for Biblioteca
  const [libraryCategory, setLibraryCategory] = useState<LibraryCategory>('tracks');

  // Detail views state
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Modals
  const [isDeckExpanded, setIsDeckExpanded] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isAddTracksModalOpen, setIsAddTracksModalOpen] = useState<boolean>(false);
  const [isMusicSettingsOpen, setIsMusicSettingsOpen] = useState<boolean>(false);
  const [trackForPlaylistModal, setTrackForPlaylistModal] = useState<SongTrack | null>(null);

  // Track Metadata & Cover Upload Modals
  const [metadataTrack, setMetadataTrack] = useState<SongTrack | null>(null);
  const [coverTarget, setCoverTarget] = useState<
    | { type: 'track'; track: SongTrack }
    | {
        type: 'album';
        albumTitle: string;
        currentCover?: string;
        currentHue: string;
        currentGradient?: string;
      }
    | null
  >(null);

  const [dspState, setDspState] = useState<AudioDspState>(INITIAL_DSP_STATE);

  const currentTrack = tracks[selectedTrackIndex] || tracks[0];

  // Number of unique albums
  const albumCount = useMemo(() => new Set(tracks.map((t) => t.album)).size, [tracks]);

  // Playback timer ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds((prev) => {
          if (prev >= (currentTrack.durationSeconds || 300)) {
            setSelectedTrackIndex((idx) => (idx < tracks.length - 1 ? idx + 1 : 0));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSeconds, tracks.length]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
  };

  const handleNextTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0));
  };

  const handlePlaySpecificTrack = (track: SongTrack) => {
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setSelectedTrackIndex(idx);
    }
    setProgressSeconds(0);
    setIsPlaying(true);
  };

  const handleToggleFavorite = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );

    // If currently viewing the favorites playlist, dynamically update its trackIds
    setSelectedPlaylist((prev) => {
      if (!prev || prev.id !== 'favorites') return prev;
      const isAlreadyIn = prev.trackIds.includes(id);
      const updatedTrackIds = isAlreadyIn
        ? prev.trackIds.filter((tId) => tId !== id)
        : [...prev.trackIds, id];
      return { ...prev, trackIds: updatedTrackIds };
    });
  };

  // Reorder tracks inside any playlist (Drag & Drop or Move Buttons)
  const handleReorderPlaylistTracks = (playlistId: string, newTrackIds: string[]) => {
    if (playlistId === 'favorites') {
      setSelectedPlaylist((prev) => (prev ? { ...prev, trackIds: newTrackIds } : prev));
      return;
    }

    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlistId ? { ...pl, trackIds: newTrackIds } : pl))
    );

    setSelectedPlaylist((prev) =>
      prev && prev.id === playlistId ? { ...prev, trackIds: newTrackIds } : prev
    );
  };

  // Add multiple tracks to a playlist
  const handleAddTracksToPlaylist = (playlistId: string, trackIdsToAdd: string[]) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const combined = Array.from(new Set([...pl.trackIds, ...trackIdsToAdd]));
        return { ...pl, trackIds: combined };
      })
    );

    setSelectedPlaylist((prev) => {
      if (!prev || prev.id !== playlistId) return prev;
      const combined = Array.from(new Set([...prev.trackIds, ...trackIdsToAdd]));
      return { ...prev, trackIds: combined };
    });
  };

  // Playlist handlers
  const handleCreatePlaylist = (newPlaylist: Playlist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setIsCreatePlaylistOpen(false);
    setSelectedPlaylist(newPlaylist);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const handleToggleTrackInPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const exists = pl.trackIds.includes(trackId);
        const updatedTrackIds = exists
          ? pl.trackIds.filter((id) => id !== trackId)
          : [...pl.trackIds, trackId];
        return { ...pl, trackIds: updatedTrackIds };
      })
    );

    setSelectedPlaylist((prev) => {
      if (!prev || prev.id !== playlistId) return prev;
      const exists = prev.trackIds.includes(trackId);
      const updatedTrackIds = exists
        ? prev.trackIds.filter((id) => id !== trackId)
        : [...prev.trackIds, trackId];
      return { ...prev, trackIds: updatedTrackIds };
    });
  };

  const handleRemoveTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return {
          ...pl,
          trackIds: pl.trackIds.filter((id) => id !== trackId),
        };
      })
    );

    setSelectedPlaylist((prev) => {
      if (!prev || prev.id !== playlistId) return prev;
      return {
        ...prev,
        trackIds: prev.trackIds.filter((id) => id !== trackId),
      };
    });
  };

  // Metadata update handler
  const handleSaveTrackMetadata = (updated: SongTrack) => {
    setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedAlbum && selectedAlbum.tracks.some((t) => t.id === updated.id)) {
      setSelectedAlbum((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tracks: prev.tracks.map((t) => (t.id === updated.id ? updated : t)),
        };
      });
    }
  };

  // Cover image update handler (supports both individual track or entire album)
  const handleSaveCover = (coverData: {
    coverImage?: string;
    coverHue?: string;
    coverGradient?: string;
  }) => {
    if (!coverTarget) return;

    if (coverTarget.type === 'track') {
      const trackId = coverTarget.track.id;
      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId
            ? {
                ...t,
                ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
                ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
                ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
              }
            : t
        )
      );
      if (metadataTrack && metadataTrack.id === trackId) {
        setMetadataTrack((prev) =>
          prev
            ? {
                ...prev,
                ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
                ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
                ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
              }
            : null
        );
      }
      if (selectedAlbum) {
        setSelectedAlbum((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            tracks: prev.tracks.map((t) =>
              t.id === trackId
                ? {
                    ...t,
                    ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
                    ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
                    ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
                  }
                : t
            ),
          };
        });
      }
    } else if (coverTarget.type === 'album') {
      const albumTitle = coverTarget.albumTitle;
      setTracks((prev) =>
        prev.map((t) =>
          t.album === albumTitle
            ? {
                ...t,
                ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
                ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
                ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
              }
            : t
        )
      );
      if (selectedAlbum && selectedAlbum.title === albumTitle) {
        setSelectedAlbum((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
            ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
            ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
            tracks: prev.tracks.map((t) => ({
              ...t,
              ...(coverData.coverImage !== undefined ? { coverImage: coverData.coverImage } : {}),
              ...(coverData.coverHue ? { coverHue: coverData.coverHue } : {}),
              ...(coverData.coverGradient ? { coverGradient: coverData.coverGradient } : {}),
            })),
          };
        });
      }
    }
    setCoverTarget(null);
  };

  const activePreset = EQ_PRESETS.find((p) => p.id === dspState.activePresetId) || EQ_PRESETS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(
    100,
    (progressSeconds / (currentTrack.durationSeconds || 300)) * 100
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0D1117] select-none">
      {/* 1. TOP HEADER (Desaturated & Professional) */}
      <header className="p-3 bg-white dark:bg-[#12181F] border-b border-slate-200/80 dark:border-slate-800 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          {/* Brand & Engine Status */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
              <Disc3 className={`w-4.5 h-4.5 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  jetAudio HD Player
                </h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  Hi-Res 24/192
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {activeBottomTab === 'library' && 'Biblioteca de Audio Local'}
                {activeBottomTab === 'playlists' && 'Gestión de Listas y Colecciones'}
                {activeBottomTab === 'dsp' && 'Procesamiento de Señal Digital (DSP)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Settings (ReplayGain, Engine) */}
            <button
              onClick={() => setIsMusicSettingsOpen(true)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Ajustes de Audio & Normalización ReplayGain"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Quick DSP Toggle Pill */}
            <button
              onClick={() =>
                setDspState((prev) => ({
                  ...prev,
                  masterDspEnabled: !prev.masterDspEnabled,
                }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all border shadow-2xs ${
                dspState.masterDspEnabled
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-400/50 ring-1 ring-sky-400/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title="Conmutar procesamiento DSP maestro"
            >
              <Power className="w-3 h-3" />
              <span>
                {dspState.masterDspEnabled ? `DSP: ${activePreset.name.split(' ')[0]}` : 'DSP: BYPASS'}
              </span>
            </button>
          </div>
        </div>

        {/* Library Sub-Filter Pills (Only shown on "Biblioteca" tab to avoid visual saturation) */}
        {activeBottomTab === 'library' && !selectedAlbum && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#161F28] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setLibraryCategory('tracks')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                libraryCategory === 'tracks'
                  ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Music2 className="w-3 h-3 shrink-0" />
              <span>Canciones ({tracks.length})</span>
            </button>

            <button
              onClick={() => setLibraryCategory('albums')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                libraryCategory === 'albums'
                  ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Disc3 className="w-3 h-3 shrink-0" />
              <span>Álbumes ({albumCount})</span>
            </button>

            <button
              onClick={() => setLibraryCategory('gallery')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                libraryCategory === 'gallery'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 shrink-0 text-sky-200" />
              <span>Galería Art</span>
            </button>

            <button
              onClick={() => setLibraryCategory('folders')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                libraryCategory === 'folders'
                  ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-2xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Folder className="w-3 h-3 shrink-0" />
              <span>Carpetas ({MUSIC_FOLDERS.length})</span>
            </button>
          </div>
        )}
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT (Independent Viewport) */}
      <main className="flex-1 min-h-0 overflow-y-auto p-3.5 pb-4">
        {/* TAB 1: BIBLIOTECA */}
        {activeBottomTab === 'library' && (
          <>
            {selectedAlbum ? (
              <AlbumDetailView
                album={selectedAlbum}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onBack={() => setSelectedAlbum(null)}
                onPlayTrack={handlePlaySpecificTrack}
                onPlayAll={() => {
                  if (selectedAlbum.tracks.length > 0) {
                    handlePlaySpecificTrack(selectedAlbum.tracks[0]);
                  }
                }}
                onToggleFavorite={handleToggleFavorite}
                onOpenAddToPlaylist={(trackId) => {
                  const trk = tracks.find((t) => t.id === trackId);
                  if (trk) setTrackForPlaylistModal(trk);
                }}
                onEditAlbumCover={(alb) =>
                  setCoverTarget({
                    type: 'album',
                    albumTitle: alb.title,
                    currentCover: alb.coverImage,
                    currentHue: alb.coverHue,
                    currentGradient: alb.coverGradient,
                  })
                }
                onOpenTrackMetadata={(track) => setMetadataTrack(track)}
              />
            ) : libraryCategory === 'gallery' ? (
              <AlbumArtGridView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectAlbum={(alb) => setSelectedAlbum(alb)}
                onPlayTrack={handlePlaySpecificTrack}
                onToggleFavorite={handleToggleFavorite}
                onEditAlbumCover={(alb) =>
                  setCoverTarget({
                    type: 'album',
                    albumTitle: alb.title,
                    currentCover: alb.coverImage,
                    currentHue: alb.coverHue,
                    currentGradient: alb.coverGradient,
                  })
                }
                onOpenTrackMetadata={(track) => setMetadataTrack(track)}
              />
            ) : libraryCategory === 'albums' ? (
              <AlbumsView
                tracks={tracks}
                onSelectAlbum={(alb) => setSelectedAlbum(alb)}
                onSwitchToGallery={() => setLibraryCategory('gallery')}
              />
            ) : libraryCategory === 'folders' ? (
              <FoldersView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlaySpecificTrack}
                onPlayFolderTracks={(fTracks) => {
                  if (fTracks.length > 0) handlePlaySpecificTrack(fTracks[0]);
                }}
              />
            ) : (
              <TracksView
                tracks={tracks}
                currentTrackIndex={selectedTrackIndex}
                isPlaying={isPlaying}
                replayGainEnabled={dspState.replayGainEnabled}
                onSelectTrack={(idx) => {
                  setSelectedTrackIndex(idx);
                  setProgressSeconds(0);
                  setIsPlaying(true);
                }}
                onToggleFavorite={handleToggleFavorite}
                onOpenAddToPlaylist={(trackId) => {
                  const trk = tracks.find((t) => t.id === trackId);
                  if (trk) setTrackForPlaylistModal(trk);
                }}
                onOpenTrackMetadata={(track) => setMetadataTrack(track)}
              />
            )}
          </>
        )}

        {/* TAB 2: LISTAS DE REPRODUCCIÓN */}
        {activeBottomTab === 'playlists' && (
          <>
            {selectedPlaylist ? (
              <PlaylistDetailView
                playlist={selectedPlaylist}
                allTracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onBack={() => setSelectedPlaylist(null)}
                onPlayTrack={handlePlaySpecificTrack}
                onPlayAll={() => {
                  const firstId = selectedPlaylist.trackIds[0];
                  const firstTrack = tracks.find((t) => t.id === firstId);
                  if (firstTrack) handlePlaySpecificTrack(firstTrack);
                }}
                onOpenAddTracksModal={() => setIsAddTracksModalOpen(true)}
                onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
                onReorderPlaylistTracks={handleReorderPlaylistTracks}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <PlaylistsView
                playlists={playlists}
                tracks={tracks}
                onSelectPlaylist={(pl) => setSelectedPlaylist(pl)}
                onOpenCreateModal={() => setIsCreatePlaylistOpen(true)}
                onDeletePlaylist={handleDeletePlaylist}
              />
            )}
          </>
        )}

        {/* TAB 3: ECUALIZADOR & DSP RACK */}
        {activeBottomTab === 'dsp' && (
          <EqualizerDspRack
            dsp={dspState}
            onUpdateDsp={setDspState}
            onOpenSettings={() => setIsMusicSettingsOpen(true)}
          />
        )}
      </main>

      {/* 3. DOCKED BOTTOM CONSOLE: MINI-PLAYER + PROFESSIONAL BOTTOM TABS */}
      <footer className="shrink-0 bg-white dark:bg-[#111720] border-t border-slate-200/80 dark:border-slate-800 shadow-2xl z-30">
        {/* Layer A: Docked Audiophile Mini-Player */}
        <div className="px-3 pt-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
          {/* Seekable Micro Timeline */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const width = rect.width;
              const newPercent = Math.max(0, Math.min(1, clickX / width));
              setProgressSeconds(Math.floor(newPercent * (currentTrack.durationSeconds || 300)));
            }}
            className="mb-1.5 group cursor-pointer"
            title="Barra de progreso (haz clic para avanzar/retroceder)"
          >
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5 px-0.5">
              <span>{formatTime(progressSeconds)}</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">{currentTrack.format} Lossless</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Mini-Deck Control Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Track Info (Tap to expand deck) */}
            <div
              onClick={() => setIsDeckExpanded(true)}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden group-hover:scale-105 transition-transform"
                style={{ backgroundColor: currentTrack.coverHue }}
              >
                {currentTrack.coverImage ? (
                  <img src={currentTrack.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Music2 className="w-4 h-4" />
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <Disc3 className="w-4.5 h-4.5 text-white/90 animate-spin" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                    {currentTrack.title}
                  </p>
                  <Maximize2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentTrack.artist} · <span className="font-mono text-sky-600 dark:text-sky-400">{currentTrack.bitrate}</span>
                </p>
              </div>
            </div>

            {/* Compact Transport Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Pista anterior"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Siguiente pista"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsDeckExpanded(true)}
                className="p-1.5 text-slate-400 hover:text-sky-500 transition-colors"
                title="Abrir reproductor completo jetAudio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Layer B: Pro Audio Bottom Tab Bar (Biblioteca · Listas · Ecualizador) */}
        <nav
          aria-label="Pestañas de Audio jetAudio"
          className="h-13 px-2 flex items-center justify-around bg-slate-50/70 dark:bg-[#0E131A]"
        >
          {/* TAB 1: BIBLIOTECA */}
          <button
            onClick={() => {
              setActiveBottomTab('library');
              setSelectedAlbum(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all min-h-[44px] ${
              activeBottomTab === 'library'
                ? 'text-sky-700 dark:text-sky-400 font-bold bg-sky-100/50 dark:bg-sky-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Library className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Biblioteca</span>
          </button>

          {/* TAB 2: LISTAS */}
          <button
            onClick={() => {
              setActiveBottomTab('playlists');
              setSelectedPlaylist(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all min-h-[44px] relative ${
              activeBottomTab === 'playlists'
                ? 'text-sky-700 dark:text-sky-400 font-bold bg-sky-100/50 dark:bg-sky-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ListMusic className="w-4 h-4" />
              {playlists.length > 0 && (
                <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {playlists.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Listas</span>
          </button>

          {/* TAB 3: ECUALIZADOR & DSP */}
          <button
            onClick={() => {
              setActiveBottomTab('dsp');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all min-h-[44px] relative ${
              activeBottomTab === 'dsp'
                ? 'text-sky-700 dark:text-sky-400 font-bold bg-sky-100/50 dark:bg-sky-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Sliders className="w-4 h-4" />
              {/* Dynamic Status LED */}
              <span
                className={`absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full ${
                  dspState.masterDspEnabled
                    ? 'bg-emerald-500 shadow-[0_0_6px_#10B981] animate-pulse'
                    : 'bg-slate-400 dark:bg-slate-600'
                }`}
              />
            </div>
            <span className="text-[10px] tracking-tight">Ecualizador</span>
          </button>
        </nav>
      </footer>

      {/* Fullscreen Audiophile Player Modal (Deck with Realtime Spectrum, Pitch/Tempo, LRC) */}
      {isDeckExpanded && (
        <AudiophilePlayerModal
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          progressSeconds={progressSeconds}
          onSeekSeconds={setProgressSeconds}
          onClose={() => setIsDeckExpanded(false)}
          onOpenDsp={() => {
            setIsDeckExpanded(false);
            setActiveBottomTab('dsp');
          }}
          dsp={dspState}
          onUpdateDsp={setDspState}
          onToggleFavorite={() => handleToggleFavorite(currentTrack.id)}
        />
      )}

      {/* Modal: Crear Nueva Lista de Reproducción */}
      {isCreatePlaylistOpen && (
        <CreatePlaylistModal
          tracks={tracks}
          onClose={() => setIsCreatePlaylistOpen(false)}
          onCreate={handleCreatePlaylist}
        />
      )}

      {/* Modal: Añadir Pista a Lista de Reproducción */}
      {trackForPlaylistModal && (
        <AddToPlaylistModal
          track={trackForPlaylistModal}
          playlists={playlists}
          onClose={() => setTrackForPlaylistModal(null)}
          onToggleTrackInPlaylist={handleToggleTrackInPlaylist}
          onOpenCreatePlaylist={() => {
            setTrackForPlaylistModal(null);
            setIsCreatePlaylistOpen(true);
          }}
        />
      )}

      {/* Modal: Añadir Canciones a la Lista Actual */}
      {isAddTracksModalOpen && selectedPlaylist && (
        <AddTracksToPlaylistModal
          playlist={selectedPlaylist}
          allTracks={tracks}
          onClose={() => setIsAddTracksModalOpen(false)}
          onAddTracks={handleAddTracksToPlaylist}
        />
      )}

      {/* Modal: Ajustes de Audio & Normalización ReplayGain */}
      {isMusicSettingsOpen && (
        <MusicSettingsModal
          dsp={dspState}
          onUpdateDsp={setDspState}
          onClose={() => setIsMusicSettingsOpen(false)}
        />
      )}

      {/* Modal: Metadatos e Información Técnica */}
      {metadataTrack && (
        <TrackMetadataModal
          track={metadataTrack}
          onClose={() => setMetadataTrack(null)}
          onSaveTrack={handleSaveTrackMetadata}
          onOpenCoverEditor={(trk) => {
            setCoverTarget({
              type: 'track',
              track: trk,
            });
          }}
        />
      )}

      {/* Modal: Cargar Portada de Álbum o Pista */}
      {coverTarget && (
        <EditCoverModal
          title={
            coverTarget.type === 'album'
              ? `Portada del Álbum "${coverTarget.albumTitle}"`
              : `Portada de "${coverTarget.track.title}"`
          }
          subtitle={
            coverTarget.type === 'album'
              ? `Se actualizarán las portadas de todas las canciones del álbum`
              : `${coverTarget.track.artist} · ${coverTarget.track.album}`
          }
          currentCoverImage={
            coverTarget.type === 'album'
              ? coverTarget.currentCover
              : coverTarget.track.coverImage
          }
          currentHue={
            coverTarget.type === 'album'
              ? coverTarget.currentHue
              : coverTarget.track.coverHue
          }
          currentGradient={
            coverTarget.type === 'album'
              ? coverTarget.currentGradient
              : coverTarget.track.coverGradient
          }
          onClose={() => setCoverTarget(null)}
          onSaveCover={handleSaveCover}
        />
      )}
    </div>
  );
};
