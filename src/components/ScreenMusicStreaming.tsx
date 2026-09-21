import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Disc3,
  Wifi,
  WifiOff,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Link2,
  Unlink,
  Search,
  Filter,
  Sparkles,
  Sliders,
  Terminal,
  FileCode,
  Copy,
  Check,
  RotateCcw,
  Headphones,
  HardDrive,
  Globe,
  Zap,
  Lock,
  KeyRound,
  Download,
  Heart,
  Info,
  X,
  Layers,
} from 'lucide-react';
import { UnifiedTrack, OAuthServiceConfig, MusicSourceProvider } from '../types';
import { AUDIOPHILE_TRACKS } from '../data/musicData';

interface ScreenMusicStreamingProps {
  onBack: () => void;
  onSelectTrackForPlayback?: (track: UnifiedTrack) => void;
}

// OAuth Configurations for Services
const OAUTH_SERVICES_CONFIG: Record<string, OAuthServiceConfig> = {
  spotify: {
    provider: 'spotify',
    name: 'Spotify',
    tagline: 'Spotify Connect & Web API SDK',
    brandColor: '#1DB954',
    clientId: 'veya_spotify_android_pkce_0921',
    redirectUri: 'veya://oauth/spotify/callback',
    scopes: [
      'streaming (Control de reproducción en Android)',
      'user-read-playback-state (Estado activo del dispositivo)',
      'user-modify-playback-state (Transferencia de reproducción)',
      'playlist-read-private (Acceso a tus listas personalizadas)',
      'user-library-read (Pistas guardadas en Me Gusta)',
    ],
    docUrl: 'https://developer.spotify.com/documentation/android',
    supportedQuality: 'Ogg Vorbis 320 kbps (High Definition)',
  },
  apple_music: {
    provider: 'apple_music',
    name: 'Apple Music',
    tagline: 'Apple MusicKit for Android SDK',
    brandColor: '#FC3C44',
    clientId: 'veya.music.applemusic.client.id',
    redirectUri: 'veya://oauth/applemusic/callback',
    scopes: [
      'media-library-read (Acceso a biblioteca iCloud)',
      'listen-history-read (Recomendaciones matinales)',
      'music-user-token (Token seguro de sesión)',
    ],
    docUrl: 'https://developer.apple.com/musickit/',
    supportedQuality: 'ALAC Lossless 24-bit/48kHz + Spatial Audio',
  },
  tidal: {
    provider: 'tidal',
    name: 'TIDAL',
    tagline: 'TIDAL Connect & HiFi Master API',
    brandColor: '#00FFFF',
    clientId: 'veya_tidal_connect_client_hifi',
    redirectUri: 'veya://oauth/tidal/callback',
    scopes: [
      'playback.stream (Streaming sin pérdida MQA/FLAC)',
      'collection.read (Álbumes y listas favoritas)',
      'playlists.read (Exploración de listas Hi-Res)',
    ],
    docUrl: 'https://developer.tidal.com/',
    supportedQuality: 'Master FLAC / MQA hasta 24-bit/192kHz',
  },
};

// Initial Unified Tracks combining local storage and streaming content
const INITIAL_UNIFIED_TRACKS: UnifiedTrack[] = [
  // 1. Local Track from Audiophile library
  {
    id: 'loc_1',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    album: 'Suite Bergamasque (Master Edition)',
    source: 'local',
    duration: '5:04',
    durationSeconds: 304,
    coverHue: '#155E95',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'FLAC 24-bit/96kHz · On-Device',
    isAvailableOffline: true,
    localPath: '/storage/emulated/0/Music/Hi-Res/Debussy/Clair_de_Lune.flac',
    isFavorite: true,
  },
  // 2. Spotify Streaming Track
  {
    id: 'sp_1',
    title: 'Spiral (Acoustic Echoes)',
    artist: 'Ólafur Arnalds',
    album: 're:member (Morning Curated)',
    source: 'spotify',
    duration: '3:45',
    durationSeconds: 225,
    coverHue: '#1DB954',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'Spotify · 320 kbps Ogg',
    isAvailableOffline: false,
    streamingUri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT',
    serviceTrackId: '4cOdK2wGLETKBW3PvgPWqT',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Clair de Lune (FLAC Local)',
    isFavorite: true,
  },
  // 3. Apple Music Streaming Track
  {
    id: 'am_1',
    title: 'November (Spatial Strings)',
    artist: 'Max Richter',
    album: 'Memoryhouse (Dolby Atmos Edition)',
    source: 'apple_music',
    duration: '4:18',
    durationSeconds: 258,
    coverHue: '#FC3C44',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'Apple Music · ALAC Lossless',
    isAvailableOffline: false,
    streamingUri: 'applemusic:track:1440854321',
    serviceTrackId: '1440854321',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Gymnopédie No. 1 (FLAC Local)',
    isFavorite: false,
  },
  // 4. TIDAL Streaming Track
  {
    id: 'td_1',
    title: 'Blue in Green (Hi-Res Remaster)',
    artist: 'Miles Davis, Bill Evans',
    album: 'Kind of Blue (Master Quality)',
    source: 'tidal',
    duration: '5:37',
    durationSeconds: 337,
    coverHue: '#002B49',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'TIDAL · Master MQA 24-bit/192kHz',
    isAvailableOffline: false,
    streamingUri: 'tidal:track:12894109',
    serviceTrackId: '12894109',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Autumn Leaves (FLAC Local)',
    isFavorite: true,
  },
  // 5. Local Track from Audiophile library
  {
    id: 'loc_2',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    album: 'Piano Solo Classics',
    source: 'local',
    duration: '3:22',
    durationSeconds: 202,
    coverHue: '#7654A7',
    coverImage: 'https://images.unsplash.com/photo-1520523839898-5071270535a7?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'FLAC 24-bit/96kHz · On-Device',
    isAvailableOffline: true,
    localPath: '/storage/emulated/0/Music/Hi-Res/Satie/Gymnopedie_1.flac',
    isFavorite: true,
  },
  // 6. Spotify Streaming Track
  {
    id: 'sp_2',
    title: 'Says (Analog Sunrise)',
    artist: 'Nils Frahm',
    album: 'Spaces',
    source: 'spotify',
    duration: '8:18',
    durationSeconds: 498,
    coverHue: '#1DB954',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'Spotify · 320 kbps Ogg',
    isAvailableOffline: false,
    streamingUri: 'spotify:track:59P8y1C0n1qW9M10Zq4p',
    serviceTrackId: '59P8y1C0n1qW9M10Zq4p',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Gymnopédie No. 1 (FLAC Local)',
    isFavorite: false,
  },
  // 7. TIDAL Streaming Track
  {
    id: 'td_2',
    title: 'Nuvole Bianche (Acoustic Solo)',
    artist: 'Ludovico Einaudi',
    album: 'Una Mattina (Hi-Res Masters)',
    source: 'tidal',
    duration: '5:58',
    durationSeconds: 358,
    coverHue: '#002B49',
    coverImage: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'TIDAL · Master 24-bit/96kHz',
    isAvailableOffline: false,
    streamingUri: 'tidal:track:9812401',
    serviceTrackId: '9812401',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Clair de Lune (FLAC Local)',
    isFavorite: true,
  },
  // 8. Apple Music Streaming Track
  {
    id: 'am_2',
    title: 'Dot (Solo Piano III)',
    artist: 'Chilly Gonzales',
    album: 'Solo Piano III (Dolby Atmos)',
    source: 'apple_music',
    duration: '2:44',
    durationSeconds: 164,
    coverHue: '#FC3C44',
    coverImage: 'https://images.unsplash.com/photo-1445985543470-41f30c08f107?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'Apple Music · Lossless ALAC',
    isAvailableOffline: false,
    streamingUri: 'applemusic:track:28901842',
    serviceTrackId: '28901842',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Gymnopédie No. 1 (FLAC Local)',
    isFavorite: false,
  },
  // 9. Local Track from Audiophile library
  {
    id: 'loc_3',
    title: 'Nocturne in E-flat Major, Op. 9 No. 2',
    artist: 'Frédéric Chopin',
    album: 'Chopin: The Complete Nocturnes',
    source: 'local',
    duration: '4:32',
    durationSeconds: 272,
    coverHue: '#2C0D5A',
    coverImage: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'DSD 2.8MHz · On-Device',
    isAvailableOffline: true,
    localPath: '/storage/emulated/0/Music/Hi-Res/Chopin/Nocturne_Op9_No2.dsf',
    isFavorite: true,
  },
  // 10. Spotify Streaming Track
  {
    id: 'sp_3',
    title: 'Sleeping Lotus',
    artist: 'Joep Beving',
    album: 'Solipsism',
    source: 'spotify',
    duration: '2:27',
    durationSeconds: 147,
    coverHue: '#1DB954',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    qualityBadge: 'Spotify · 320 kbps Ogg',
    isAvailableOffline: false,
    streamingUri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
    serviceTrackId: '0VjIjW4GlUZAMYd2vXMi3b',
    hasFailsafeLocalFallback: true,
    fallbackTrackTitle: 'Clair de Lune (FLAC Local)',
    isFavorite: false,
  },
];

export const ScreenMusicStreaming: React.FC<ScreenMusicStreamingProps> = ({
  onBack,
  onSelectTrackForPlayback,
}) => {
  // 1. Unified Playlist State
  const [unifiedTracks, setUnifiedTracks] = useState<UnifiedTrack[]>(INITIAL_UNIFIED_TRACKS);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSeconds, setProgressSeconds] = useState<number>(38);
  const [volumePercent, setVolumePercent] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 2. Audio Source Filter ('all' | 'local' | 'spotify' | 'apple_music' | 'tidal')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'local' | 'spotify' | 'apple_music' | 'tidal'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyOfflineFilter, setOnlyOfflineFilter] = useState<boolean>(false);

  // 3. Subscription Accounts & OAuth Connection State
  const [streamingAccounts, setStreamingAccounts] = useState<Record<string, {
    isConnected: boolean;
    userAccount: string;
    plan: string;
    accessToken: string;
    expiresAt: string;
  }>>({
    spotify: {
      isConnected: true,
      userAccount: 'jhrojas@spotify.com',
      plan: 'Spotify Premium Individual',
      accessToken: 'sp_token_live_948201a4e...',
      expiresAt: '2026-09-21T23:59:00Z',
    },
    apple_music: {
      isConnected: true,
      userAccount: 'jhrojas@icloud.com',
      plan: 'Apple Music Lossless (Hi-Res)',
      accessToken: 'am_jwt_usertoken_830b...',
      expiresAt: '2026-10-15T12:00:00Z',
    },
    tidal: {
      isConnected: false,
      userAccount: 'jhrojas@tidal.com',
      plan: 'TIDAL HiFi Plus / Master Quality',
      accessToken: '',
      expiresAt: '',
    },
  });

  // 4. OAuth Interactive Modal State
  const [oauthModalTarget, setOauthModalTarget] = useState<'spotify' | 'apple_music' | 'tidal' | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [selectedScopesForAuth, setSelectedScopesForAuth] = useState<string[]>([]);

  // 5. Code Modals & UI Helpers
  const [showClaudeSpecs, setShowClaudeSpecs] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [copiedInstructions, setCopiedInstructions] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([25, 45, 60, 35, 70, 50, 80, 45, 65, 35, 50, 30]);

  const currentTrack = unifiedTracks[selectedTrackIndex] || unifiedTracks[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Dynamic waveform simulation while audio is playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveformBars(
          Array.from({ length: 14 }, () => Math.floor(Math.random() * 70) + 20)
        );
      }, 130);
    } else {
      setWaveformBars([25, 45, 60, 35, 70, 50, 80, 45, 65, 35, 50, 30, 20, 40]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Playback timer progression
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            // Next track
            setSelectedTrackIndex((idx) => (idx < unifiedTracks.length - 1 ? idx + 1 : 0));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSeconds, unifiedTracks.length]);

  // Filtered tracks based on sourceFilter, searchQuery, and onlyOfflineFilter
  const filteredTracks = useMemo(() => {
    return unifiedTracks.filter((track) => {
      // 1. Source filter
      if (sourceFilter !== 'all' && track.source !== sourceFilter) {
        return false;
      }
      // 2. Offline filter
      if (onlyOfflineFilter && !track.isAvailableOffline) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = track.title.toLowerCase().includes(query);
        const matchesArtist = track.artist.toLowerCase().includes(query);
        const matchesAlbum = track.album.toLowerCase().includes(query);
        const matchesBadge = track.qualityBadge.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesAlbum && !matchesBadge) {
          return false;
        }
      }
      return true;
    });
  }, [unifiedTracks, sourceFilter, onlyOfflineFilter, searchQuery]);

  // Track play handler with OAuth connection validation
  const handlePlayTrack = (track: UnifiedTrack) => {
    // If track is from streaming provider, check if provider is connected
    if (track.source !== 'local') {
      const account = streamingAccounts[track.source];
      if (!account || !account.isConnected) {
        // Prompt user to link account via OAuth
        setOauthModalTarget(track.source as any);
        showToast(`Conecta tu cuenta de ${track.source.toUpperCase()} para reproducir este tema`);
        return;
      }
    }

    const idx = unifiedTracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setSelectedTrackIndex(idx);
    }
    setProgressSeconds(0);
    setIsPlaying(true);
    showToast(`Reproduciendo: ${track.title} [${track.qualityBadge}]`);

    if (onSelectTrackForPlayback) {
      onSelectTrackForPlayback(track);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    showToast(isPlaying ? 'Reproducción en pausa' : `Continuando: ${currentTrack.title}`);
  };

  const handlePrevTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev > 0 ? prev - 1 : unifiedTracks.length - 1));
  };

  const handleNextTrack = () => {
    setProgressSeconds(0);
    setSelectedTrackIndex((prev) => (prev < unifiedTracks.length - 1 ? prev + 1 : 0));
  };

  const handleToggleFavorite = (trackId: string) => {
    setUnifiedTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  // Open OAuth Dialog
  const handleOpenOAuthModal = (provider: 'spotify' | 'apple_music' | 'tidal') => {
    const config = OAUTH_SERVICES_CONFIG[provider];
    setOauthModalTarget(provider);
    setSelectedScopesForAuth([...config.scopes]);
  };

  // Authorize OAuth Simulation Flow
  const handleConfirmAuthorizeOAuth = () => {
    if (!oauthModalTarget) return;

    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      const target = oauthModalTarget;
      const targetConfig = OAUTH_SERVICES_CONFIG[target];

      setStreamingAccounts((prev) => ({
        ...prev,
        [target]: {
          ...prev[target],
          isConnected: true,
          accessToken: `${target}_oauth_token_pkce_${Date.now()}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        },
      }));

      setOauthModalTarget(null);
      showToast(`¡Cuenta de ${targetConfig.name} vinculada exitosamente mediante OAuth 2.0!`);
    }, 1100);
  };

  // Disconnect OAuth Account
  const handleDisconnectOAuth = (provider: string) => {
    setStreamingAccounts((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        isConnected: false,
        accessToken: '',
        expiresAt: '',
      },
    }));
    showToast(`Sesión de ${provider.toUpperCase()} desvinculada de VEYA`);
  };

  const copyClaudePrompt = () => {
    const prompt = `Hola Claude, implementa la arquitectura de Streaming de Música y Lista Unificada (Material 3 + Jetpack Compose) en el módulo de audio de VEYA:

1. Arquitectura & Capas Android:
   - UI: personal.veya.ui.screen.music.UnifiedStreamingMusicScreen.kt
   - ViewModel: personal.veya.ui.screen.music.UnifiedStreamingViewModel.kt
   - Coordinador de Reproducción Dual: personal.veya.music.UnifiedPlaybackCoordinator.kt
   - Clientes OAuth & SDKs:
     * Spotify: personal.veya.music.spotify.SpotifyOAuthRemoteManager.kt (OAuth 2.0 PKCE + Spotify App Remote)
     * Apple Music: personal.veya.music.applemusic.AppleMusicKitManager.kt (MusicKit for Android)
     * TIDAL: personal.veya.music.tidal.TidalConnectManager.kt (TIDAL Open API OAuth 2.0)
     * Local: personal.veya.music.local.ExoPlayerDspEngine.kt (jetAudio DSP + Bit-Perfect AAudio)
   - Repositorio Unificado: personal.veya.music.repository.UnifiedMusicRepository.kt

2. Componentes Material 3:
   - Selector de Fuente de Audio: SingleChoiceSegmentedButtonRow M3 ('Todo Unificado', 'Local FLAC', 'Spotify', 'Apple Music', 'TIDAL').
   - Tarjetas de Cuentas OAuth M3: Estado de autenticación, plan suscrito, token seguro en Android Keystore y botón de vinculación.
   - Lista de Reproducción Híbrida: Items con badges de origen de audio (FLAC 24/96, Spotify 320k, Apple Lossless, TIDAL Master), indicador de respaldo local offline infalible y controles de reproducción.
   - Mini-Reproductor y Barra de Transporte M3 con visualizador de espectro dinámico y conmutación de motor en tiempo real.

Consulta la especificación técnica en 'entregas/15_specs_unified_music_streaming_oauth_m3_para_claude.md'.`;

    navigator.clipboard.writeText(prompt);
    setCopiedInstructions(true);
    showToast('Instrucciones copiadas al portapapeles para Claude Code');
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  // Helper formatting for seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = currentTrack.durationSeconds > 0
    ? Math.min(100, (progressSeconds / currentTrack.durationSeconds) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans'] select-none">
      {/* Toast Notification (Material 3 Snackbar) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#16202A]/95 dark:bg-[#E0E3E8]/95 text-white dark:text-[#16202A] text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in backdrop-blur-md border border-white/10 dark:border-black/10">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP APP BAR (Material 3 TopAppBar) */}
      <header className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#12181F] border-b border-[#CBD2D9]/70 dark:border-[#42474E]/60 shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] transition-colors active:scale-95"
              title="Volver a Biblioteca Local"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#155E95] text-white flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-tight">
                  Música & Streaming Unificado
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D7EEFF] dark:bg-[#004A7B]/40 text-[#155E95] dark:text-[#8ECEFF]">
                  Material 3
                </span>
              </div>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Local FLAC + Spotify, Apple Music & TIDAL vía OAuth 2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowClaudeSpecs(!showClaudeSpecs)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                showClaudeSpecs
                  ? 'bg-[#155E95] text-white dark:bg-[#8ECEFF] dark:text-[#003355]'
                  : 'text-[#155E95] dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/60 dark:hover:bg-[#004A7B]/40'
              }`}
              title="Guía de integración para Claude Code"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Guía Claude</span>
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-[#7654A7] dark:text-[#DCB8FF] hover:bg-[#EADDFF]/50 dark:hover:bg-[#4F378B]/30 transition-colors"
              title="Ver código Kotlin Jetpack Compose"
            >
              <FileCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-36">

        {/* COLLAPSIBLE CLAUDE CODE INSTRUCTIONS BANNER */}
        {showClaudeSpecs && (
          <div className="p-4 rounded-3xl bg-[#001D33] text-white border border-[#155E95] shadow-lg animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#155E95] text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                    Instrucciones de Arquitectura para Claude Code (Música Híbrida & OAuth)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Coordinador de reproducción unificado que amalgama bibliotecas locales FLAC y APIs de suscripción
                  </p>
                </div>
              </div>
              <button
                onClick={copyClaudePrompt}
                className="px-3 py-1.5 rounded-xl bg-[#155E95] hover:bg-[#1E74B3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedInstructions ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstructions ? 'Copiado' : 'Copiar Prompt'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-200">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#8ECEFF] block">1. OAuth 2.0 PKCE en Android</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">CustomTabs + Android Keystore</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Tokens encriptados con AES-256-GCM y refresco transparente.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-amber-300 block">2. UnifiedPlaybackCoordinator</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">MediaSessionCompat Router</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Conmuta de ExoPlayer local a Spotify App Remote o MusicKit sin saltos.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Garantía Offline Failsafe</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">ConnectivityManager Listener</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Si falla la red, conmuta a pista local idéntica o equivalente.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
              <span>Especificación canónica completa: <code>entregas/15_specs_unified_music_streaming_oauth_m3_para_claude.md</code></span>
              <button
                onClick={() => setShowClaudeSpecs(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* 2. CUENTAS DE SERVICIOS OAUTH (SPOTIFY, APPLE MUSIC, TIDAL) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                1. Vinculación de Cuentas OAuth 2.0 (Servicios por Suscripción)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Android Keystore Cifrado</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Spotify Card */}
            <div className={`p-3 rounded-2xl border transition-all ${
              streamingAccounts.spotify.isConnected
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-[#16202A] border-[#CBD2D9]/70 dark:border-[#42474E]/60'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#1DB954] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    S
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#16202A] dark:text-[#E0E3E8]">Spotify</h3>
                    <span className="text-[9px] font-mono text-[#42474E] dark:text-[#CBD2D9]">320 kbps Ogg</span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  streamingAccounts.spotify.isConnected
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {streamingAccounts.spotify.isConnected ? 'Conectado' : 'Sin vincular'}
                </span>
              </div>

              <div className="mt-2 text-[10px] text-[#42474E] dark:text-[#CBD2D9] truncate">
                {streamingAccounts.spotify.isConnected ? (
                  <span>{streamingAccounts.spotify.userAccount}</span>
                ) : (
                  <span className="italic text-slate-400">Requiere inicio de sesión OAuth</span>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between">
                <span className="text-[9px] font-medium text-slate-500">OAuth 2.0 PKCE</span>
                {streamingAccounts.spotify.isConnected ? (
                  <button
                    onClick={() => handleDisconnectOAuth('spotify')}
                    className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" />
                    <span>Desconectar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuthModal('spotify')}
                    className="px-2.5 py-1 rounded-lg bg-[#1DB954] text-white text-[10px] font-bold flex items-center gap-1 hover:opacity-90 shadow-2xs"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Vincular</span>
                  </button>
                )}
              </div>
            </div>

            {/* Apple Music Card */}
            <div className={`p-3 rounded-2xl border transition-all ${
              streamingAccounts.apple_music.isConnected
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-[#16202A] border-[#CBD2D9]/70 dark:border-[#42474E]/60'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#FC3C44] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#16202A] dark:text-[#E0E3E8]">Apple Music</h3>
                    <span className="text-[9px] font-mono text-[#42474E] dark:text-[#CBD2D9]">Lossless ALAC</span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  streamingAccounts.apple_music.isConnected
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {streamingAccounts.apple_music.isConnected ? 'Conectado' : 'Sin vincular'}
                </span>
              </div>

              <div className="mt-2 text-[10px] text-[#42474E] dark:text-[#CBD2D9] truncate">
                {streamingAccounts.apple_music.isConnected ? (
                  <span>{streamingAccounts.apple_music.userAccount}</span>
                ) : (
                  <span className="italic text-slate-400">Requiere Apple ID MusicKit</span>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between">
                <span className="text-[9px] font-medium text-slate-500">MusicKit JWT</span>
                {streamingAccounts.apple_music.isConnected ? (
                  <button
                    onClick={() => handleDisconnectOAuth('apple_music')}
                    className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" />
                    <span>Desconectar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuthModal('apple_music')}
                    className="px-2.5 py-1 rounded-lg bg-[#FC3C44] text-white text-[10px] font-bold flex items-center gap-1 hover:opacity-90 shadow-2xs"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Vincular</span>
                  </button>
                )}
              </div>
            </div>

            {/* TIDAL Card */}
            <div className={`p-3 rounded-2xl border transition-all ${
              streamingAccounts.tidal.isConnected
                ? 'bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-400 dark:border-cyan-800'
                : 'bg-slate-50 dark:bg-[#16202A] border-[#CBD2D9]/70 dark:border-[#42474E]/60'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-black text-[#00FFFF] flex items-center justify-center font-bold text-xs shadow-xs border border-white/10">
                    T
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#16202A] dark:text-[#E0E3E8]">TIDAL</h3>
                    <span className="text-[9px] font-mono text-[#42474E] dark:text-[#CBD2D9]">Master 24/192</span>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  streamingAccounts.tidal.isConnected
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {streamingAccounts.tidal.isConnected ? 'Conectado' : 'Sin vincular'}
                </span>
              </div>

              <div className="mt-2 text-[10px] text-[#42474E] dark:text-[#CBD2D9] truncate">
                {streamingAccounts.tidal.isConnected ? (
                  <span>{streamingAccounts.tidal.userAccount}</span>
                ) : (
                  <span className="italic text-slate-400">TIDAL HiFi Plus / Master</span>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between">
                <span className="text-[9px] font-medium text-slate-500">TIDAL Connect</span>
                {streamingAccounts.tidal.isConnected ? (
                  <button
                    onClick={() => handleDisconnectOAuth('tidal')}
                    className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" />
                    <span>Desconectar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenOAuthModal('tidal')}
                    className="px-2.5 py-1 rounded-lg bg-black text-[#00FFFF] border border-[#00FFFF]/40 text-[10px] font-bold flex items-center gap-1 hover:bg-slate-900 shadow-2xs"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Vincular</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. SELECTOR DE FUENTE DE AUDIO (MATERIAL 3 SEGMENTED BUTTON ROW) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                2. Selector de Fuente de Audio & Enrutamiento
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyOfflineFilter(!onlyOfflineFilter)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                  onlyOfflineFilter
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-[#16202A] dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Download className="w-3 h-3" />
                <span>Solo Offline ({unifiedTracks.filter(t => t.isAvailableOffline).length})</span>
              </button>
            </div>
          </div>

          {/* M3 Segmented Button Row */}
          <div className="flex bg-[#F0F4F8] dark:bg-[#16202A] p-1 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Todo Unificado', count: unifiedTracks.length, icon: Radio },
              { id: 'local', label: 'Local (FLAC)', count: unifiedTracks.filter(t => t.source === 'local').length, icon: HardDrive },
              { id: 'spotify', label: 'Spotify', count: unifiedTracks.filter(t => t.source === 'spotify').length, icon: Radio },
              { id: 'apple_music', label: 'Apple Music', count: unifiedTracks.filter(t => t.source === 'apple_music').length, icon: Music },
              { id: 'tidal', label: 'TIDAL', count: unifiedTracks.filter(t => t.source === 'tidal').length, icon: Disc3 },
            ].map((tab) => {
              const isSelected = sourceFilter === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSourceFilter(tab.id as any);
                    showToast(`Mostrando fuente: ${tab.label}`);
                  }}
                  className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-white dark:bg-[#12181F] text-[#155E95] dark:text-[#8ECEFF] shadow-xs border border-[#155E95]/20 dark:border-[#8ECEFF]/30 font-extrabold'
                      : 'text-[#42474E] dark:text-[#CBD2D9] hover:text-[#16202A] dark:hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-[#D7EEFF] text-[#155E95] dark:bg-[#004A7B] dark:text-[#D7EEFF]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Audio Engine & Output Indicator */}
          <div className="p-3 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#155E95] dark:text-[#8ECEFF]" />
              <span className="text-[#42474E] dark:text-[#CBD2D9]">Motor Activo:</span>
              <strong className="text-[#16202A] dark:text-[#E0E3E8] font-mono">
                {currentTrack.source === 'local' ? 'ExoPlayer Bit-Perfect AAudio (DSP Local)' :
                 currentTrack.source === 'spotify' ? 'Spotify App Remote SDK + MediaSession' :
                 currentTrack.source === 'apple_music' ? 'Apple MusicKit Audio Engine (Lossless)' :
                 'TIDAL Connect HiFi Streamer'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                Salida: USB DAC / Altavoz 24-bit
              </span>
            </div>
          </div>
        </div>

        {/* 4. LISTA DE REPRODUCCIÓN UNIFICADA (COMBINACIÓN LOCAL + STREAMING) */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8] flex items-center gap-2">
                <span>3. Lista de Reproducción Híbrida Unificada</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D7EEFF] dark:bg-[#004A7B]/40 text-[#155E95] dark:text-[#8ECEFF]">
                  {filteredTracks.length} canciones
                </span>
              </h2>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Tus archivos FLAC de alta resolución se integran con playlists de Spotify, Apple Music y TIDAL
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, artista..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60 text-xs text-[#16202A] dark:text-[#E0E3E8] focus:outline-none focus:ring-1 focus:ring-[#155E95]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Unified Tracks List */}
          <div className="space-y-2">
            {filteredTracks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#16202A] border border-dashed border-[#CBD2D9] dark:border-[#42474E] space-y-2">
                <Music className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-[#16202A] dark:text-[#E0E3E8]">
                  No se encontraron canciones con los filtros seleccionados
                </p>
                <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                  Prueba a limpiar la búsqueda o cambiar la fuente activa.
                </p>
                <button
                  onClick={() => {
                    setSourceFilter('all');
                    setSearchQuery('');
                    setOnlyOfflineFilter(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#155E95] text-white text-xs font-bold"
                >
                  Restaurar Filtros
                </button>
              </div>
            ) : (
              filteredTracks.map((track) => {
                const isSelected = currentTrack.id === track.id;
                const isThisPlaying = isSelected && isPlaying;
                const isConnected = track.source === 'local' || streamingAccounts[track.source]?.isConnected;

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#D7EEFF]/30 dark:bg-[#003355]/30 border-[#155E95] dark:border-[#8ECEFF] ring-1 ring-[#155E95]/30 shadow-xs'
                        : 'bg-white dark:bg-[#12181F] border-[#CBD2D9]/60 dark:border-[#42474E]/60 hover:border-[#155E95]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Album Art with Provider Icon Badge */}
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-xs">
                        {track.coverImage ? (
                          <img
                            src={track.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            style={{ backgroundColor: track.coverHue }}
                            className="w-full h-full flex items-center justify-center text-white"
                          >
                            <Music className="w-5 h-5" />
                          </div>
                        )}

                        {/* Source badge overlay */}
                        <div className={`absolute bottom-0 right-0 p-1 rounded-tl-md text-white text-[8px] ${
                          track.source === 'local' ? 'bg-[#155E95]' :
                          track.source === 'spotify' ? 'bg-[#1DB954]' :
                          track.source === 'apple_music' ? 'bg-[#FC3C44]' : 'bg-black'
                        }`}>
                          {track.source === 'local' ? <HardDrive className="w-2.5 h-2.5" /> :
                           track.source === 'spotify' ? <Radio className="w-2.5 h-2.5" /> :
                           track.source === 'apple_music' ? <Music className="w-2.5 h-2.5" /> :
                           <Disc3 className="w-2.5 h-2.5" />}
                        </div>

                        {/* Playing wave overlay */}
                        {isThisPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Disc3 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Track Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-black truncate leading-tight ${
                            isSelected ? 'text-[#155E95] dark:text-[#8ECEFF]' : 'text-[#16202A] dark:text-[#E0E3E8]'
                          }`}>
                            {track.title}
                          </h4>
                          {track.isAvailableOffline && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                              Offline
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] truncate">
                          {track.artist} · <span className="italic">{track.album}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.3 rounded-md text-[9px] font-mono font-bold ${
                            track.source === 'local'
                              ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                              : track.source === 'spotify'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                              : track.source === 'apple_music'
                              ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                              : 'bg-cyan-50 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                          }`}>
                            {track.qualityBadge}
                          </span>

                          {track.hasFailsafeLocalFallback && (
                            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Failsafe local</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right action controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#42474E] dark:text-[#CBD2D9]">
                        {track.duration}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(track.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          track.isFavorite
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={track.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${track.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(track);
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          isThisPlaying
                            ? 'bg-[#155E95] text-white animate-pulse'
                            : isConnected
                            ? 'bg-[#D7EEFF] text-[#155E95] dark:bg-[#004A7B]/50 dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/80'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        }`}
                        title={!isConnected ? 'Vincular OAuth para reproducir' : isThisPlaying ? 'Pausar' : 'Reproducir'}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : !isConnected ? (
                          <Link2 className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 5. PERSISTENT UNIFIED MINI-PLAYER & AUDIO DECK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12181F]/95 backdrop-blur-md border-t border-[#CBD2D9]/80 dark:border-[#42474E]/80 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Progress Timeline */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
              setProgressSeconds(Math.floor(newPercent * currentTrack.durationSeconds));
            }}
            className="w-full bg-[#DEE3EA] dark:bg-[#16202A] h-1.5 rounded-full overflow-hidden cursor-pointer group"
          >
            <div
              className={`h-full transition-all ${
                currentTrack.source === 'spotify' ? 'bg-[#1DB954]' :
                currentTrack.source === 'apple_music' ? 'bg-[#FC3C44]' :
                currentTrack.source === 'tidal' ? 'bg-[#00FFFF]' : 'bg-[#155E95]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Playing Track Info */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                {currentTrack.coverImage ? (
                  <img src={currentTrack.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div style={{ backgroundColor: currentTrack.coverHue }} className="w-full h-full flex items-center justify-center text-white">
                    <Music className="w-4 h-4" />
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Disc3 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8] truncate">
                    {currentTrack.title}
                  </h4>
                  <span className={`px-1.5 py-0.1 rounded text-[8px] font-mono font-bold ${
                    currentTrack.source === 'local' ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200' :
                    currentTrack.source === 'spotify' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' :
                    currentTrack.source === 'apple_music' ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200' :
                    'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200'
                  }`}>
                    {currentTrack.source.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] truncate">
                  {currentTrack.artist} · <span className="font-mono">{formatTime(progressSeconds)} / {currentTrack.duration}</span>
                </p>
              </div>
            </div>

            {/* Waveform Visualizer */}
            <div className="hidden md:flex items-center gap-1 h-5 w-24 px-1">
              {waveformBars.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-full transition-all duration-100 ${
                    currentTrack.source === 'spotify' ? 'bg-[#1DB954]' :
                    currentTrack.source === 'apple_music' ? 'bg-[#FC3C44]' :
                    currentTrack.source === 'tidal' ? 'bg-[#00FFFF]' : 'bg-[#155E95]'
                  }`}
                />
              ))}
            </div>

            {/* Transport Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevTrack}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] dark:text-[#CBD2D9] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Pista anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm transition-all active:scale-95 ${
                  currentTrack.source === 'spotify' ? 'bg-[#1DB954] hover:bg-[#1AA34A]' :
                  currentTrack.source === 'apple_music' ? 'bg-[#FC3C44] hover:bg-[#E0333A]' :
                  currentTrack.source === 'tidal' ? 'bg-black text-[#00FFFF] border border-[#00FFFF]/50' : 'bg-[#155E95] hover:bg-[#124D7B]'
                }`}
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] dark:text-[#CBD2D9] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Siguiente pista"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. OAUTH AUTHORIZATION CONSENT MODAL (MATERIAL 3 DIALOG) */}
      {oauthModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#12181F] rounded-3xl p-5 shadow-2xl border border-[#CBD2D9]/80 dark:border-[#42474E]/80 space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: OAUTH_SERVICES_CONFIG[oauthModalTarget].brandColor }}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
                >
                  {oauthModalTarget === 'spotify' ? 'S' : oauthModalTarget === 'apple_music' ? '' : 'T'}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                    Vincular cuenta con {OAUTH_SERVICES_CONFIG[oauthModalTarget].name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Protocolo OAuth 2.0 PKCE Seguro
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOauthModalTarget(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Permissions Info */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#16202A] dark:text-[#E0E3E8]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Permisos solicitados por VEYA:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                {OAUTH_SERVICES_CONFIG[oauthModalTarget].scopes.map((scope, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy & Keystore Guarantee */}
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 text-[10px] text-sky-950 dark:text-sky-200 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-sky-600" />
                <span>Garantía de Privacidad y Token Seguro</span>
              </span>
              <p className="leading-relaxed">
                El token de acceso se almacena localmente mediante <strong>Android Keystore (AES-256-GCM)</strong>. VEYA no almacena ni transmite tus contraseñas personales a ningún servidor intermedio.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
              <button
                type="button"
                onClick={() => setOauthModalTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#42474E] dark:text-[#CBD2D9] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isAuthorizing}
                onClick={handleConfirmAuthorizeOAuth}
                className="px-4 py-2 rounded-xl bg-[#155E95] hover:bg-[#124D7B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                {isAuthorizing ? (
                  <>
                    <Disc3 className="w-3.5 h-3.5 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Autorizar con OAuth</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. KOTLIN JETPACK COMPOSE CODE MODAL */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#12181F] rounded-3xl p-5 shadow-2xl border border-[#CBD2D9]/80 dark:border-[#42474E]/80 max-h-[85vh] flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#7654A7] dark:text-[#DCB8FF]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                  Código Kotlin: UnifiedStreamingMusicScreen.kt (Material 3)
                </h3>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[11px] bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2">
              <p className="text-emerald-400">// Material 3 SingleChoiceSegmentedButtonRow y Coordinador Híbrido</p>
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
{`@Composable
fun UnifiedStreamingMusicScreen(
    viewModel: UnifiedStreamingViewModel = hiltViewModel(),
    onBack: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Música & Streaming Unificado") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás")
                    }
                }
            )
        },
        bottomBar = {
            UnifiedMiniPlayer(
                currentTrack = state.currentTrack,
                isPlaying = state.isPlaying,
                onTogglePlay = viewModel::togglePlay
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            // Segmented Button Row para selector de fuente
            SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                state.availableSources.forEachIndexed { index, source ->
                    SegmentedButton(
                        selected = state.selectedSource == source,
                        onClick = { viewModel.setSourceFilter(source) },
                        shape = SegmentedButtonDefaults.itemShape(index, state.availableSources.size)
                    ) {
                        Text(source.displayName)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Lista unificada de pistas locales y remotas
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(state.unifiedPlaylist, key = { it.id }) { track ->
                    UnifiedTrackCard(
                        track = track,
                        isSelected = state.currentTrack?.id == track.id,
                        onTrackClick = { viewModel.playTrack(track) }
                    )
                }
            }
        }
    }
}`}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">Jetpack Compose + Material You M3</span>
              <button
                onClick={() => {
                  copyClaudePrompt();
                  setShowComposeCodeModal(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#7654A7] text-white text-xs font-bold"
              >
                Copiar Instrucciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
