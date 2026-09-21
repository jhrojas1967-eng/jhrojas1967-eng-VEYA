import React, { useState, useEffect } from 'react';
import {
  Bell,
  ArrowLeft,
  Play,
  Pause,
  Music,
  Clock,
  Sparkles,
  CheckCircle,
  FileCode,
  Volume2,
  Sliders,
  Check,
  RotateCcw,
  Sun,
  ShieldCheck,
  Terminal,
  Copy,
  Folder,
  Waves,
  Zap,
  Radio,
  Wifi,
  WifiOff,
  ExternalLink,
  Disc3,
  AlertTriangle,
  Link2,
  Unlink,
} from 'lucide-react';
import { MusicSourceProvider, StreamingAccount, StreamingPlaylistItem } from '../types';

interface ScreenAlarmProps {
  onBack: () => void;
}

export interface AlarmTrack {
  id: string;
  title: string;
  artist: string;
  type: 'local' | 'bioacoustic';
  duration: string;
  vibe: string;
  localPath: string;
  bitrate: string;
}

const LOCAL_ALARM_TRACKS: AlarmTrack[] = [
  {
    id: 'trk_1',
    title: 'Amanecer en Re Mayor (Piano)',
    artist: 'Biblioteca Local VEYA (24-bit/96kHz FLAC)',
    type: 'local',
    duration: '04:12',
    vibe: 'Cálido, armónico, sin percusión estridente para despertar sereno',
    localPath: '/storage/emulated/0/Music/Veya/Amanecer_Re_Mayor.flac',
    bitrate: '1411 kbps',
  },
  {
    id: 'trk_2',
    title: 'Lluvia en Bosque de Hayas',
    artist: 'Generador Bioacústico jetAudio (DSP On-Device)',
    type: 'bioacoustic',
    duration: 'Continuo',
    vibe: 'Ruido rosa natural y gotas suaves sobre follaje',
    localPath: 'internal://bioacoustic/rain_forest_432hz.raw',
    bitrate: 'Generación Sintética',
  },
  {
    id: 'trk_3',
    title: 'Nordic Jazz: Cuerdas y Silencio',
    artist: 'Carpeta /Music/Jazz_Morning (ALAC)',
    type: 'local',
    duration: '05:30',
    vibe: 'Contrabajo sutil y saxofón atmosférico no invasivo',
    localPath: '/storage/emulated/0/Music/Jazz_Morning/Track_03.m4a',
    bitrate: '920 kbps',
  },
  {
    id: 'trk_4',
    title: 'Resonancia Alpha 432Hz',
    artist: 'Síntesis Binaural Local (Zero Artifacts)',
    type: 'bioacoustic',
    duration: 'Continuo',
    vibe: 'Ondas sinusoidales de transición del sueño profundo al estado alfa',
    localPath: 'internal://bioacoustic/binaural_alpha_432.raw',
    bitrate: 'Generación Sintética',
  },
  {
    id: 'trk_5',
    title: 'Olas de Finisterre (Binaural)',
    artist: 'Grabación de Campo 3D (Ambisonic B-format)',
    type: 'local',
    duration: '06:45',
    vibe: 'Oleaje rítmico y respiración marina hipnótica',
    localPath: '/storage/emulated/0/Music/FieldRecordings/Finisterre_3D.flac',
    bitrate: '1536 kbps',
  },
];

const STREAMING_PLAYLISTS_CATALOG: Record<string, StreamingPlaylistItem[]> = {
  spotify: [
    {
      id: 'sp_1',
      provider: 'spotify',
      title: 'Amanecer Acústico (Guitarra & Calma)',
      curator: 'Spotify Editorial',
      trackCount: 45,
      vibe: 'Guitarras acústicas suaves sin crescendos bruscos',
      uri: 'spotify:playlist:37i9dQZF1DX0b1hHYQtJjp',
      isMorningRecommended: true,
    },
    {
      id: 'sp_2',
      provider: 'spotify',
      title: 'Peaceful Piano Morning',
      curator: 'Spotify Editorial',
      trackCount: 80,
      vibe: 'Pianistas contemporáneos con dinámicas armónicas cálidas',
      uri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO',
      isMorningRecommended: true,
    },
    {
      id: 'sp_3',
      provider: 'spotify',
      title: 'Lo-Fi Sunrise & Chill',
      curator: 'ChilledCow / Lofi Girl',
      trackCount: 62,
      vibe: 'Ritmos lentos a 70 BPM con sintetizadores analógicos vintage',
      uri: 'spotify:playlist:37i9dQZF1DWWQRwui0ExPn',
      isMorningRecommended: false,
    },
    {
      id: 'sp_4',
      provider: 'spotify',
      title: 'Tus Canciones Favoritas (Shuffle Matinal)',
      curator: 'Biblioteca Personal',
      trackCount: 120,
      vibe: 'Tus temas guardados con filtro de tempo tranquilo matinal',
      uri: 'spotify:user:liked_tracks',
      isMorningRecommended: false,
    },
  ],
  apple_music: [
    {
      id: 'am_1',
      provider: 'apple_music',
      title: 'Buenos Días Acústico',
      curator: 'Apple Music Acoustic',
      trackCount: 50,
      vibe: 'Melodías orgánicas y voces sutiles para empezar el día',
      uri: 'applemusic:playlist:pl.u-morning-acoustic',
      isMorningRecommended: true,
    },
    {
      id: 'am_2',
      provider: 'apple_music',
      title: 'Pure Piano Essentials',
      curator: 'Apple Music Classical',
      trackCount: 65,
      vibe: 'Piezas clásicas en Dolby Atmos espacial',
      uri: 'applemusic:playlist:pl.u-pure-piano',
      isMorningRecommended: true,
    },
  ],
  youtube_music: [
    {
      id: 'yt_1',
      provider: 'youtube_music',
      title: 'Morning Chillout Beats',
      curator: 'YouTube Music Vibes',
      trackCount: 40,
      vibe: 'Electrónica ambiental y texturas reconfortantes',
      uri: 'https://music.youtube.com/playlist?list=PL_morning_chill',
      isMorningRecommended: true,
    },
    {
      id: 'yt_2',
      provider: 'youtube_music',
      title: 'Sunrise Acoustic Folk',
      curator: 'YouTube Music',
      trackCount: 55,
      vibe: 'Folk sereno e instrumentos de cuerda orgánica',
      uri: 'https://music.youtube.com/playlist?list=PL_sunrise_folk',
      isMorningRecommended: false,
    },
  ],
  tidal: [
    {
      id: 'td_1',
      provider: 'tidal',
      title: 'Hi-Res Ambient Sunrise (Master)',
      curator: 'TIDAL Masters',
      trackCount: 35,
      vibe: 'Sonido 24-bit/192kHz sin compresión dinámica',
      uri: 'tidal:playlist:hi-res-sunrise',
      isMorningRecommended: true,
    },
    {
      id: 'td_2',
      provider: 'tidal',
      title: 'Neo-Classical Focus Dawn',
      curator: 'TIDAL Classical',
      trackCount: 48,
      vibe: 'Cuerdas minimalistas y sintetizadores de baja frecuencia',
      uri: 'tidal:playlist:neo-classical-dawn',
      isMorningRecommended: true,
    },
  ],
};

const STREAMING_PROVIDERS_CONFIG: { id: MusicSourceProvider; name: string; color: string; brandColor: string }[] = [
  { id: 'local', name: 'Almacenamiento Local', color: 'bg-blue-600', brandColor: '#2563EB' },
  { id: 'bioacoustic', name: 'Bioacústico On-Device', color: 'bg-emerald-600', brandColor: '#059669' },
  { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]', brandColor: '#1DB954' },
  { id: 'apple_music', name: 'Apple Music', color: 'bg-[#FC3C44]', brandColor: '#FC3C44' },
  { id: 'youtube_music', name: 'YouTube Music', color: 'bg-[#FF0000]', brandColor: '#FF0000' },
  { id: 'tidal', name: 'TIDAL', color: 'bg-[#00FFFF]', brandColor: '#000000' },
];

export const ScreenAlarm: React.FC<ScreenAlarmProps> = ({ onBack }) => {
  // 1. Time Picker State (Material 3 Circular Clock Dial)
  const [selectedHour, setSelectedHour] = useState<number>(7);
  const [selectedMinute, setSelectedMinute] = useState<number>(30);
  const [timePickerMode, setTimePickerMode] = useState<'hour' | 'minute'>('hour');
  const [isAm, setIsAm] = useState<boolean>(true);
  const [showCircularClock, setShowCircularClock] = useState<boolean>(false);
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(true);

  // 2. Music Source & Subscription Provider State
  const [activeProvider, setActiveProvider] = useState<MusicSourceProvider>('spotify');
  
  // Streaming Accounts Status
  const [streamingAccounts, setStreamingAccounts] = useState<Record<string, { isConnected: boolean; userAccount: string; plan: string }>>({
    spotify: { isConnected: true, userAccount: 'jhrojas@spotify.com', plan: 'Spotify Premium' },
    apple_music: { isConnected: true, userAccount: 'jhrojas@icloud.com', plan: 'Apple Music Individual' },
    youtube_music: { isConnected: false, userAccount: 'jhrojas1967@gmail.com', plan: 'YouTube Music Premium' },
    tidal: { isConnected: false, userAccount: 'jhrojas@tidal.com', plan: 'TIDAL HiFi Plus' },
  });

  // Selected Streaming Playlist ID per Provider
  const [selectedStreamingPlaylistIds, setSelectedStreamingPlaylistIds] = useState<Record<string, string>>({
    spotify: 'sp_1',
    apple_music: 'am_1',
    youtube_music: 'yt_1',
    tidal: 'td_1',
  });

  // Local Tracks and Fallback State
  const [selectedLocalTrackId, setSelectedLocalTrackId] = useState<string>('trk_1');
  const [fallbackLocalTrackId, setFallbackLocalTrackId] = useState<string>('trk_1');
  const [offlineFallbackEnabled, setOfflineFallbackEnabled] = useState<boolean>(true);

  // Audio Test Playback Simulation
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([20, 35, 50, 30, 65, 45, 75, 40, 60, 30, 45, 20]);

  // 3. Gradual Wakeup & Fade-in (1-5 min)
  const [progressiveWakeupEnabled, setProgressiveWakeupEnabled] = useState<boolean>(true);
  const [fadeDurationMinutes, setFadeDurationMinutes] = useState<number>(3); // 1 a 5 min
  const [maxVolume, setMaxVolume] = useState<number>(80); // 40 a 100%
  const [screenBrightnessRamp, setScreenBrightnessRamp] = useState<boolean>(true);
  const [avatarGreetingOnDismiss, setAvatarGreetingOnDismiss] = useState<boolean>(true);

  // UI Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClaudeInstructions, setShowClaudeInstructions] = useState<boolean>(false);
  const [showComposeCodeModal, setShowComposeCodeModal] = useState<boolean>(false);
  const [copiedInstructions, setCopiedInstructions] = useState<boolean>(false);

  const selectedLocalTrack = LOCAL_ALARM_TRACKS.find((t) => t.id === selectedLocalTrackId) || LOCAL_ALARM_TRACKS[0];
  const fallbackLocalTrack = LOCAL_ALARM_TRACKS.find((t) => t.id === fallbackLocalTrackId) || LOCAL_ALARM_TRACKS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Dynamic waveform simulation while playing test audio
  useEffect(() => {
    let interval: any;
    if (playingItemId) {
      interval = setInterval(() => {
        setWaveformBars(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 25)
        );
      }, 120);
    } else {
      setWaveformBars([20, 35, 50, 30, 65, 45, 75, 40, 60, 30, 45, 20]);
    }
    return () => clearInterval(interval);
  }, [playingItemId]);

  const handleTogglePlayLocalTrack = (trackId: string) => {
    if (playingItemId === trackId) {
      setPlayingItemId(null);
      showToast('Reproducción pausada');
    } else {
      setPlayingItemId(trackId);
      const track = LOCAL_ALARM_TRACKS.find((t) => t.id === trackId);
      if (track) {
        showToast(`Escuchando muestra local: ${track.title}`);
      }
      setTimeout(() => {
        setPlayingItemId(null);
      }, 6000);
    }
  };

  const handleTogglePlayStreamingPlaylist = (playlistId: string, title: string) => {
    if (playingItemId === playlistId) {
      setPlayingItemId(null);
      showToast('Reproducción de streaming pausada');
    } else {
      setPlayingItemId(playlistId);
      showToast(`Conectando con ${activeProvider.toUpperCase()}: "${title}"`);
      setTimeout(() => {
        setPlayingItemId(null);
      }, 6000);
    }
  };

  const handleToggleConnectAccount = (provider: string) => {
    const current = streamingAccounts[provider];
    if (current) {
      const nextState = !current.isConnected;
      setStreamingAccounts({
        ...streamingAccounts,
        [provider]: {
          ...current,
          isConnected: nextState,
        },
      });
      showToast(nextState ? `Cuenta de ${provider.toUpperCase()} vinculada con éxito` : `Sesión de ${provider.toUpperCase()} desvinculada`);
    }
  };

  const handleSimulateOfflineFallback = () => {
    showToast('⚠️ Simulando fallo de red: Conmutando instantáneamente a pista local de respaldo FLAC');
    setPlayingItemId('fallback_test');
    setTimeout(() => {
      setPlayingItemId(null);
      showToast('✅ Prueba de respaldo superada: Despertador 100% infalible');
    }, 4500);
  };

  const handleResetDefaults = () => {
    setSelectedHour(7);
    setSelectedMinute(30);
    setIsAm(true);
    setActiveProvider('spotify');
    setSelectedLocalTrackId('trk_1');
    setFallbackLocalTrackId('trk_1');
    setOfflineFallbackEnabled(true);
    setProgressiveWakeupEnabled(true);
    setFadeDurationMinutes(3);
    setMaxVolume(80);
    setScreenBrightnessRamp(true);
    setAvatarGreetingOnDismiss(true);
    showToast('Valores de alarma y música restaurados por defecto');
  };

  const formattedTimeString = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')} ${isAm ? 'AM' : 'PM'}`;

  // Copy prompt for Claude Code
  const copyClaudePrompt = () => {
    const prompt = `Hola Claude, integra el soporte multicanal de música por suscripción (Spotify, Apple Music, YouTube Music, Tidal) y almacenamiento local en la pantalla de Alarma de VEYA con Jetpack Compose y Material 3:

1. Arquitectura & Módulos:
   - UI: personal.veya.ui.screen.settings.AlarmMusicScreen.kt
   - ViewModel: personal.veya.ui.screen.settings.AlarmMusicViewModel.kt
   - Servicio de Alarma: personal.veya.alarm.AlarmPlaybackService.kt (ForegroundService con WAKE_LOCK)
   - Conector Spotify: personal.veya.music.spotify.SpotifyAppRemoteClient.kt (Spotify App Remote SDK + MediaSessionCompat)
   - Conector Apple Music: personal.veya.music.applemusic.AppleMusicKitClient.kt
   - Conector MediaBrowser: personal.veya.music.MediaBrowserPlaybackHelper.kt
   - Respaldo Infalible Offline: personal.veya.alarm.OfflineFailsafeController.kt (NetworkCapabilities + ExoPlayer local)

2. Componentes Material 3:
   a) Selector de Fuente Musical (SingleChoiceSegmentedButtonRow / FilterChips M3):
      - 'Local (FLAC)', 'Bioacústico', 'Spotify', 'Apple Music', 'YouTube Music', 'TIDAL'.
   b) Tarjetas de Listas de Reproducción de Streaming:
      - Título, curador, conteo de temas, etiqueta matinal recomendada y URI nativo (ej. spotify:playlist:...).
   c) Garantía de Despertar Infalible (Offline Fallback M3 Card):
      - Verificación de red mediante ConnectivityManager al sonar la alarma.
      - Si no hay señal Wi-Fi/4G o el servicio de streaming arroja timeout (>3s), VEYA arranca la pista FLAC local seleccionada sin silenciar la alarma.
   d) Rampa de Volumen / Fade-in Progresivo:
      - Compatible tanto con DSP interno como con rampa de ganancia en AudioManager.STREAM_ALARM / STREAM_MUSIC.

Consulta 'entregas/14_specs_streaming_music_spotify_apple_m3_para_claude.md' para la especificación completa.`;

    navigator.clipboard.writeText(prompt);
    setCopiedInstructions(true);
    showToast('Instrucciones para Claude copiadas al portapapeles');
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  // Helper for rendering the M3 Circular Clock Dial
  const renderClockDial = () => {
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const isHours = timePickerMode === 'hour';
    const items = isHours ? hours : minutes;
    const activeValue = isHours ? (selectedHour % 12 === 0 ? 12 : selectedHour % 12) : selectedMinute;

    const dialRadius = 96; // px
    const centerX = 120;
    const centerY = 120;

    const activeIndex = items.indexOf(activeValue);
    const angleDeg = (activeIndex * (360 / items.length)) - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const handEndX = centerX + dialRadius * Math.cos(angleRad);
    const handEndY = centerY + dialRadius * Math.sin(angleRad);

    return (
      <div className="flex flex-col items-center justify-center p-3 bg-[#FFE8CC]/20 dark:bg-[#2A1508]/40 rounded-3xl border border-[#D9480F]/20 select-none">
        <div className="relative w-[240px] h-[240px]">
          <div className="absolute inset-0 rounded-full bg-[#FFE8CC]/40 dark:bg-[#7A2700]/20 border border-[#D9480F]/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D9480F] dark:bg-[#FFA94D] z-20" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1={centerX}
              y1={centerY}
              x2={handEndX}
              y2={handEndY}
              stroke="#D9480F"
              strokeWidth="2.5"
              className="dark:stroke-[#FFA94D]"
            />
            <circle
              cx={handEndX}
              cy={handEndY}
              r="17"
              fill="#D9480F"
              className="dark:fill-[#FFA94D]"
            />
          </svg>

          {items.map((num, idx) => {
            const numAngleDeg = (idx * (360 / items.length)) - 90;
            const numAngleRad = (numAngleDeg * Math.PI) / 180;
            const numX = centerX + dialRadius * Math.cos(numAngleRad);
            const numY = centerY + dialRadius * Math.sin(numAngleRad);
            const isSelected = isHours ? (num === activeValue) : (Math.abs(num - activeValue) < 3);

            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (isHours) {
                    setSelectedHour(num);
                    setTimeout(() => setTimePickerMode('minute'), 220);
                  } else {
                    setSelectedMinute(num);
                  }
                }}
                style={{
                  left: `${numX}px`,
                  top: `${numY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-20 ${
                  isSelected
                    ? 'text-white dark:text-[#2C0D5A] font-extrabold scale-110'
                    : 'text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#D9480F]/15'
                }`}
              >
                {isHours ? num : String(num).padStart(2, '0')}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between w-full mt-3 px-3 text-[11px] font-bold text-[#42474E] dark:text-[#CBD2D9]">
          <span>{isHours ? 'Selecciona la Hora' : 'Selecciona los Minutos'}</span>
          <button
            type="button"
            onClick={() => setTimePickerMode(isHours ? 'minute' : 'hour')}
            className="text-[#D9480F] dark:text-[#FFA94D] hover:underline"
          >
            Cambiar a {isHours ? 'Minutos' : 'Horas'}
          </button>
        </div>
      </div>
    );
  };

  const isStreamingProvider = activeProvider !== 'local' && activeProvider !== 'bioacoustic';
  const currentStreamingAccount = streamingAccounts[activeProvider];
  const currentPlaylists = STREAMING_PLAYLISTS_CATALOG[activeProvider] || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7FAFC] dark:bg-[#101418] overflow-hidden font-['Nunito_Sans']">
      {/* Toast Notification (M3 Snackbar) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#16202A]/95 dark:bg-[#E0E3E8]/95 text-white dark:text-[#16202A] text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in backdrop-blur-md border border-white/10 dark:border-black/10">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Material 3 TopAppBar */}
      <div className="px-4 py-3 bg-[#FFFFFF] dark:bg-[#12181F] border-b border-[#CBD2D9]/70 dark:border-[#42474E]/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8] transition-colors active:scale-95"
              title="Volver a Ajustes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-2xl bg-[#D9480F] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#16202A] dark:text-[#E0E3E8] leading-tight">
                  Música de Alarma & Streaming
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFE8CC] dark:bg-[#7A2700]/40 text-[#D9480F] dark:text-[#FFA94D]">
                  Material 3
                </span>
              </div>
              <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Spotify, Apple Music, FLAC local y Respaldo Infalible Offline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowClaudeInstructions(!showClaudeInstructions)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                showClaudeInstructions
                  ? 'bg-[#155E95] text-white dark:bg-[#8ECEFF] dark:text-[#003355]'
                  : 'text-[#155E95] dark:text-[#8ECEFF] hover:bg-[#D7EEFF]/60 dark:hover:bg-[#004A7B]/40'
              }`}
              title="Guía de implementación para Claude Code"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Guía Claude</span>
            </button>
            <button
              onClick={() => setShowComposeCodeModal(true)}
              className="p-2 rounded-xl text-[#D9480F] dark:text-[#FFA94D] hover:bg-[#FFE8CC]/60 dark:hover:bg-[#7A2700]/30 transition-colors"
              title="Ver código Compose Kotlin"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A] transition-colors"
              title="Restaurar valores de fábrica"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">

        {/* INSTRUCCIONES PARA CLAUDE CODE (COLLAPSIBLE BANNER) */}
        {showClaudeInstructions && (
          <div className="p-4 rounded-3xl bg-[#001D33] text-white border border-[#155E95] shadow-lg animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#155E95] text-white flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#D7EEFF]">
                    Instrucciones para Claude Code (Streaming Spotify/Apple + Respaldo Local)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Soporte para suscripciones musicales en Alarma con garantía infalible offline
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
                <span className="font-bold text-[#8ECEFF] block">1. Spotify & Apple Music SDK</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">SpotifyAppRemote + MusicKit</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Conexión a playlists remotas con URIs nativas.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-amber-300 block">2. Respaldo Local Infalible</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">NetworkCapabilities check</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Si no hay Wi-Fi o red, reproduce FLAC local sin demora.</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-emerald-300 block">3. Rampa Fade-in Universal</span>
                <span className="font-mono text-[10px] text-slate-300 block mt-0.5">AudioManager rampa de ganancia</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Ascenso suave de 1 a 5 min en cualquier servicio.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
              <span>Especificación canónica completa: <code>entregas/14_specs_streaming_music_spotify_apple_m3_para_claude.md</code></span>
              <button
                onClick={() => setShowClaudeInstructions(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* 1. TIMEPICKER CARD CON RELOJ CIRCULAR M3 */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D9480F] dark:text-[#FFA94D]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                1. Programación Horaria de la Alarma
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alarmEnabled}
                  onChange={(e) => {
                    setAlarmEnabled(e.target.checked);
                    showToast(e.target.checked ? 'Alarma matinal programada' : 'Alarma matinal suspendida');
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9480F]"></div>
              </label>
            </div>
          </div>

          {/* M3 Time Input Displays (Hour & Minute Digits + AM/PM Toggle) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F7FAFC] dark:bg-[#16202A] border border-[#CBD2D9]/60 dark:border-[#42474E]/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTimePickerMode('hour');
                  setShowCircularClock(true);
                }}
                className={`px-4 py-2 rounded-2xl font-mono text-3xl font-black transition-all ${
                  timePickerMode === 'hour' && showCircularClock
                    ? 'bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/50 dark:text-[#FFA94D] ring-2 ring-[#D9480F]'
                    : 'bg-white dark:bg-[#12181F] text-[#16202A] dark:text-[#E0E3E8] border border-[#CBD2D9]/70 dark:border-[#42474E]/60'
                }`}
              >
                {String(selectedHour).padStart(2, '0')}
              </button>

              <span className="text-2xl font-black text-[#42474E] dark:text-[#CBD2D9]">:</span>

              <button
                type="button"
                onClick={() => {
                  setTimePickerMode('minute');
                  setShowCircularClock(true);
                }}
                className={`px-4 py-2 rounded-2xl font-mono text-3xl font-black transition-all ${
                  timePickerMode === 'minute' && showCircularClock
                    ? 'bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/50 dark:text-[#FFA94D] ring-2 ring-[#D9480F]'
                    : 'bg-white dark:bg-[#12181F] text-[#16202A] dark:text-[#E0E3E8] border border-[#CBD2D9]/70 dark:border-[#42474E]/60'
                }`}
              >
                {String(selectedMinute).padStart(2, '0')}
              </button>

              <div className="flex flex-col rounded-xl overflow-hidden border border-[#CBD2D9]/80 dark:border-[#42474E]/80 text-[11px] font-bold ml-1">
                <button
                  type="button"
                  onClick={() => setIsAm(true)}
                  className={`px-2.5 py-1 transition-colors ${
                    isAm
                      ? 'bg-[#D9480F] text-white dark:bg-[#FFA94D] dark:text-[#2C0D5A]'
                      : 'bg-white dark:bg-[#12181F] text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setIsAm(false)}
                  className={`px-2.5 py-1 transition-colors border-t border-[#CBD2D9]/60 dark:border-[#42474E]/60 ${
                    !isAm
                      ? 'bg-[#D9480F] text-white dark:bg-[#FFA94D] dark:text-[#2C0D5A]'
                      : 'bg-white dark:bg-[#12181F] text-[#42474E] dark:text-[#CBD2D9] hover:bg-[#DEE3EA]/50'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCircularClock(!showCircularClock)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  showCircularClock
                    ? 'bg-[#D9480F] text-white dark:bg-[#FFA94D] dark:text-[#2C0D5A]'
                    : 'bg-white dark:bg-[#12181F] text-[#D9480F] dark:text-[#FFA94D] border border-[#D9480F]/30 dark:border-[#FFA94D]/30 hover:bg-[#FFE8CC]/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{showCircularClock ? 'Ocultar Dial M3' : 'Abrir Reloj Circular M3'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Material 3 Circular Clock Dial */}
          {showCircularClock && (
            <div className="pt-2 animate-fade-in">
              {renderClockDial()}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-[#42474E] dark:text-[#CBD2D9] px-1">
            <span>Hora programada: <strong className="text-[#16202A] dark:text-[#E0E3E8] font-mono">{formattedTimeString}</strong></span>
            <span className="font-semibold">Lunes a Viernes • Despertar diario</span>
          </div>
        </div>

        {/* 2. FUENTE MUSICAL: SELECTOR DE PROVEEDOR (LOCAL VS STREAMING SUBSCRIPTIONS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#D9480F] dark:text-[#FFA94D]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#42474E] dark:text-[#CBD2D9]">
                2. Fuente Musical & Servicios de Suscripción
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#D9480F] dark:text-[#FFA94D] font-mono">
              {isStreamingProvider ? 'Streaming Activo' : 'Audio On-Device'}
            </span>
          </div>

          {/* Horizontal Provider FilterChips / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {STREAMING_PROVIDERS_CONFIG.map((p) => {
              const isSelected = activeProvider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveProvider(p.id);
                    showToast(`Fuente musical seleccionada: ${p.name}`);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-xs ${
                    isSelected
                      ? 'bg-[#16202A] text-white dark:bg-white dark:text-[#16202A] ring-2 ring-[#D9480F]'
                      : 'bg-white dark:bg-[#12181F] text-[#16202A] dark:text-[#E0E3E8] border border-[#CBD2D9]/80 dark:border-[#42474E]/80 hover:bg-[#DEE3EA]/40'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span>{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* STREAMING PROVIDER ACCOUNT DETAILS (IF SPOTIFY, APPLE MUSIC, YOUTUBE, TIDAL) */}
          {isStreamingProvider && currentStreamingAccount && (
            <div className="p-3.5 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${
                    activeProvider === 'spotify' ? 'bg-[#1DB954]' :
                    activeProvider === 'apple_music' ? 'bg-[#FC3C44]' :
                    activeProvider === 'youtube_music' ? 'bg-[#FF0000]' : 'bg-slate-900'
                  }`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">
                        {activeProvider === 'spotify' ? 'Spotify Connect' :
                         activeProvider === 'apple_music' ? 'Apple Music' :
                         activeProvider === 'youtube_music' ? 'YouTube Music' : 'TIDAL'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        currentStreamingAccount.isConnected
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {currentStreamingAccount.isConnected ? 'Conectado' : 'No Vinculado'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                      {currentStreamingAccount.isConnected
                        ? `${currentStreamingAccount.plan} • ${currentStreamingAccount.userAccount}`
                        : 'Vincula tu cuenta para cargar tus playlists de despertar'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleConnectAccount(activeProvider)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                    currentStreamingAccount.isConnected
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                      : 'bg-[#16202A] text-white dark:bg-white dark:text-[#16202A] hover:opacity-90'
                  }`}
                >
                  {currentStreamingAccount.isConnected ? <Unlink className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>{currentStreamingAccount.isConnected ? 'Desconectar' : 'Vincular'}</span>
                </button>
              </div>

              {/* Curated Playlists for this streaming provider */}
              <div className="space-y-2 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#42474E] dark:text-[#CBD2D9]">
                  <span>Listas recomendadas para despertar:</span>
                  <span className="font-mono text-[10px] text-[#D9480F] dark:text-[#FFA94D]">{currentPlaylists.length} Listas disponibles</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {currentPlaylists.map((pl) => {
                    const isSelected = selectedStreamingPlaylistIds[activeProvider] === pl.id;
                    const isPlaying = playingItemId === pl.id;

                    return (
                      <div
                        key={pl.id}
                        onClick={() => {
                          setSelectedStreamingPlaylistIds({
                            ...selectedStreamingPlaylistIds,
                            [activeProvider]: pl.id,
                          });
                          showToast(`Playlist de alarma seleccionada: ${pl.title}`);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFE8CC]/40 dark:bg-[#7A2700]/20 border-[#D9480F] dark:border-[#FFA94D] ring-1 ring-[#D9480F]/30 shadow-xs'
                            : 'bg-white dark:bg-[#12181F] border-[#CBD2D9]/60 dark:border-[#42474E]/60 hover:border-[#D9480F]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePlayStreamingPlaylist(pl.id, pl.title);
                              }}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                isPlaying
                                  ? 'bg-[#D9480F] text-white animate-pulse'
                                  : 'bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/50 dark:text-[#FFA94D] hover:bg-[#FFE8CC]/80'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">
                                  {pl.title}
                                </h4>
                                {pl.isMorningRecommended && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/60 dark:text-[#FFA94D]">
                                    Ideal Mañanas
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                                {pl.curator} • {pl.trackCount} pistas • <span className="italic">{pl.vibe}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#D9480F] text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>

                        {isPlaying && (
                          <div className="mt-2 pt-2 border-t border-[#CBD2D9]/30 flex items-center justify-between text-[10px] font-mono text-[#D9480F] dark:text-[#FFA94D]">
                            <span>Streaming activo vía SDK {activeProvider.toUpperCase()}</span>
                            <div className="flex items-center gap-1 h-3 w-16">
                              {waveformBars.slice(0, 8).map((h, i) => (
                                <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-[#D9480F] rounded-full" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRITICAL: GARANTÍA DE DESPERTAR INFALIBLE (FAILSAFE OFFLINE FALLBACK) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950 dark:text-amber-200">
                        Garantía de Despertar Infalible (Respaldo Local Offline)
                      </h4>
                      <p className="text-[10px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                        Si a la hora fijada tu móvil está en modo avión, sin Wi-Fi/4G o el servicio de streaming sufre una interrupción, VEYA conmuta instantáneamente a la pista local FLAC para asegurar tu despertar.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={offlineFallbackEnabled}
                      onChange={(e) => {
                        setOfflineFallbackEnabled(e.target.checked);
                        showToast(e.target.checked ? 'Respaldo local offline habilitado' : 'Respaldo desactivado');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {offlineFallbackEnabled && (
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200">
                      <Folder className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pista local de respaldo:</span>
                      <strong className="font-bold">{fallbackLocalTrack.title}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateOfflineFallback}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 text-amber-950 dark:text-amber-100 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <WifiOff className="w-3 h-3" />
                      <span>Probar fallo de red</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOCAL & BIOACOUSTIC TRACKS LIST (WHEN LOCAL OR BIOACOUSTIC IS SELECTED) */}
          {(!isStreamingProvider) && (
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE8CC] dark:bg-[#7A2700]/40 text-[#D9480F] dark:text-[#FFA94D] flex items-center justify-center shrink-0">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#16202A] dark:text-[#E0E3E8] block leading-tight">
                      {selectedLocalTrack.title}
                    </span>
                    <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9] font-mono">
                      {selectedLocalTrack.bitrate} • {selectedLocalTrack.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 h-6 w-20 px-1">
                    {waveformBars.map((height, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${height}%` }}
                        className={`flex-1 rounded-full transition-all duration-100 ${
                          playingItemId === selectedLocalTrack.id
                            ? 'bg-gradient-to-t from-[#D9480F] to-[#FFA94D]'
                            : 'bg-[#CBD2D9] dark:bg-[#42474E]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePlayLocalTrack(selectedLocalTrack.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                      playingItemId === selectedLocalTrack.id
                        ? 'bg-[#D9480F] text-white animate-pulse'
                        : 'bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/50 dark:text-[#FFA94D] hover:bg-[#FFE8CC]/80'
                    }`}
                  >
                    {playingItemId === selectedLocalTrack.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{playingItemId === selectedLocalTrack.id ? 'Pausar' : 'Probar'}</span>
                  </button>
                </div>
              </div>

              {/* Local tracks list filtered by local vs bioacoustic */}
              <div className="space-y-2">
                {LOCAL_ALARM_TRACKS.filter((t) => activeProvider === 'local' ? t.type === 'local' : t.type === 'bioacoustic').map((track) => {
                  const isSelected = selectedLocalTrackId === track.id;
                  const isPlaying = playingItemId === track.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setSelectedLocalTrackId(track.id);
                        showToast(`Pista local seleccionada: ${track.title}`);
                      }}
                      className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFE8CC]/40 dark:bg-[#7A2700]/20 border-[#D9480F] dark:border-[#FFA94D] shadow-xs ring-1 ring-[#D9480F]/30'
                          : 'bg-[#FFFFFF] dark:bg-[#12181F] border-[#CBD2D9]/70 dark:border-[#42474E]/60 hover:border-[#D9480F]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#D9480F] text-white'
                                : 'bg-[#DEE3EA]/60 dark:bg-[#16202A] text-[#16202A] dark:text-[#E0E3E8]'
                            }`}
                          >
                            <Music className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-black text-[#16202A] dark:text-[#E0E3E8]">
                                {track.title}
                              </h3>
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                                track.type === 'bioacoustic'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              }`}>
                                {track.type === 'bioacoustic' ? 'Bioacústico' : 'FLAC Local'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePlayLocalTrack(track.id);
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isPlaying
                                ? 'bg-[#D9480F] text-white'
                                : 'bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700]/50 dark:text-[#FFA94D] hover:bg-[#FFE8CC]/80'
                            }`}
                            title="Probar sonido"
                          >
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                          </button>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#D9480F] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40 flex items-center justify-between text-[10px]">
                        <span className="text-[#42474E] dark:text-[#CBD2D9] italic line-clamp-1">
                          "{track.vibe}"
                        </span>
                        <span className="font-mono text-[#D9480F] dark:text-[#FFA94D] shrink-0 font-bold ml-2">
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. SLIDER DE FADE-IN (1 A 5 MIN) & 4. TOGGLE DESPERTAR PROGRESIVO */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#12181F] border border-[#CBD2D9]/70 dark:border-[#42474E]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D9480F] dark:text-[#FFA94D]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#16202A] dark:text-[#E0E3E8]">
                3. Rampa DSP de Fade-in & Despertar Progresivo
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#D9480F] dark:text-[#FFA94D] font-mono">Curva Exponencial</span>
          </div>

          {/* TOGGLE PARA ACTIVAR EL DESPERTAR PROGRESIVO */}
          <div className="p-3.5 rounded-2xl bg-[#FFE8CC]/30 dark:bg-[#7A2700]/20 border border-[#D9480F]/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#D9480F] dark:text-[#FFA94D]" />
                <span className="text-xs font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                  Activar Despertar Progresivo (Bioacústico / Streaming)
                </span>
              </div>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Incrementa el volumen suavemente desde 0 dB sin generar picos de sobresalto ni taquicardia matutina (aplica a archivos locales y a Spotify / Apple Music vía AudioManager).
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={progressiveWakeupEnabled}
                onChange={(e) => {
                  setProgressiveWakeupEnabled(e.target.checked);
                  showToast(
                    e.target.checked
                      ? 'Despertar progresivo activado'
                      : 'Despertar progresivo desactivado'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9480F]"></div>
            </label>
          </div>

          {/* SLIDER DURACIÓN DEL FADE-IN (1-5 MIN) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D9480F] dark:text-[#FFA94D]" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Duración del ascenso de volumen (Fade-in)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#FFE8CC] dark:bg-[#7A2700]/40 text-[#D9480F] dark:text-[#FFA94D] font-mono text-[11px] font-bold">
                  {fadeDurationMinutes} {fadeDurationMinutes === 1 ? 'minuto' : 'minutos'}
                </span>
                <span className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                  {fadeDurationMinutes <= 2 ? '(Rápido)' : fadeDurationMinutes === 3 ? '(Recomendado)' : '(Ultra gradual)'}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                disabled={!progressiveWakeupEnabled}
                value={fadeDurationMinutes}
                onChange={(e) => setFadeDurationMinutes(parseInt(e.target.value))}
                className="w-full accent-[#D9480F] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9] mt-1 font-mono">
                <span>1 min (Ágil)</span>
                <span>2 min</span>
                <span className="font-bold text-[#D9480F] dark:text-[#FFA94D]">3 min (Ideal)</span>
                <span>4 min</span>
                <span>5 min (Profundo)</span>
              </div>
            </div>
          </div>

          {/* Volumen Máximo Alcanzado */}
          <div className="space-y-2 pt-2 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#42474E] dark:text-[#CBD2D9]" />
                <span className="text-[#16202A] dark:text-[#E0E3E8]">Volumen límite de la rampa</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#FFE8CC] dark:bg-[#7A2700]/40 text-[#D9480F] dark:text-[#FFA94D] font-mono text-[11px] font-bold">
                {maxVolume}%
              </span>
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={maxVolume}
                onChange={(e) => setMaxVolume(parseInt(e.target.value))}
                className="w-full accent-[#D9480F] h-2 bg-[#DEE3EA] dark:bg-[#16202A] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#42474E] dark:text-[#CBD2D9] mt-1 font-mono">
                <span>40% (Suave)</span>
                <span>60%</span>
                <span>80% (Estándar)</span>
                <span>100% (Máximo)</span>
              </div>
            </div>
          </div>

          {/* Brillo Progresivo de Pantalla (M3 Switch) */}
          <div className="flex items-center justify-between pt-3 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Rampa de iluminación ambiental (Display)
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                Incrementa gradualmente el brillo de la pantalla para simular la luz del alba.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={screenBrightnessRamp}
                onChange={(e) => {
                  setScreenBrightnessRamp(e.target.checked);
                  showToast(e.target.checked ? 'Iluminación ambiental activada' : 'Iluminación ambiental desactivada');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9480F]"></div>
            </label>
          </div>

          {/* Saludo del Avatar al Descartar (M3 Switch) */}
          <div className="flex items-center justify-between pt-3 border-t border-[#CBD2D9]/40 dark:border-[#42474E]/40">
            <div>
              <span className="font-bold text-[#16202A] dark:text-[#E0E3E8] text-xs">
                Despertar del Avatar al apagar la alarma
              </span>
              <p className="text-[10px] text-[#42474E] dark:text-[#CBD2D9]">
                VEYA te saluda con tono sereno y presenta el resumen de la rutina matinal.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={avatarGreetingOnDismiss}
                onChange={(e) => {
                  setAvatarGreetingOnDismiss(e.target.checked);
                  showToast(e.target.checked ? 'Saludo matinal activado' : 'Saludo matinal desactivado');
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#DEE3EA] peer-focus:outline-none rounded-full peer dark:bg-[#16202A] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD2D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9480F]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* MODAL: JETPACK COMPOSE M3 SPECIFICATION FOR CLAUDE */}
      {showComposeCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-[#12181F] rounded-3xl p-5 w-full max-w-2xl border border-[#CBD2D9] dark:border-[#42474E] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFE8CC] text-[#D9480F] dark:bg-[#7A2700] dark:text-[#FFA94D] flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#16202A] dark:text-[#E0E3E8]">
                    Alarma: Streaming & Respaldo Local (Compose M3)
                  </h3>
                  <p className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                    SpotifyAppRemote, MediaBrowser, rampa AudioManager y Failsafe Offline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#42474E] hover:text-[#16202A] hover:bg-[#DEE3EA]/50 dark:hover:bg-[#16202A]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#101418] text-[#E0E3E8] font-mono text-[11px] leading-relaxed space-y-2 border border-[#42474E]">
              <div className="flex justify-between items-center pb-2 border-b border-[#42474E]">
                <span className="text-[#FFA94D] font-bold">AlarmPlaybackService.kt</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `// AlarmPlaybackService.kt - Streaming (Spotify/Apple) con Failsafe Offline
class AlarmPlaybackService : Service() {
    private val spotifyRemoteHelper = SpotifyRemoteHelper(this)
    private val exoPlayerHelper = LocalExoPlayerHelper(this)

    fun triggerAlarm(provider: MusicProvider, streamUri: String, fallbackPath: String) {
        val hasInternet = checkNetworkConnectivity()
        if (provider != MusicProvider.LOCAL && hasInternet) {
            // Conectar a Spotify App Remote o Apple MusicKit
            spotifyRemoteHelper.playUri(streamUri, onFail = {
                // Fallback automático si la API remota falla
                exoPlayerHelper.playLocalFile(fallbackPath, isFadeIn = true)
            })
        } else {
            // Conexión ausente: Despertar 100% garantizado con archivo local
            exoPlayerHelper.playLocalFile(fallbackPath, isFadeIn = true)
        }
    }
}`
                    );
                    showToast('Código de servicio copiado al portapapeles');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#16202A] hover:bg-[#232F3D] text-xs text-[#FFA94D] flex items-center gap-1 border border-[#42474E]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Servicio</span>
                </button>
              </div>
              <p className="text-slate-500">// Arquitectura Android ForegroundService con conexión dual</p>
              <p className="text-purple-400">@AndroidEntryPoint</p>
              <p className="text-yellow-300">class AlarmPlaybackService : LifecycleService() &#123;</p>
              <p className="text-slate-300 pl-4">@Inject lateinit var spotifyClient: SpotifyAppRemoteClient</p>
              <p className="text-slate-300 pl-4">@Inject lateinit var localAudioEngine: LocalAudioEngine</p>
              <br />
              <p className="text-slate-400 pl-4">// Verificación instantánea de red antes de sonar</p>
              <p className="text-emerald-400 pl-4">val isOnline = connectivityManager.activeNetwork != null</p>
              <p className="text-slate-300 pl-4">if (isOnline &amp;&amp; provider == MusicProvider.SPOTIFY) &#123;</p>
              <p className="text-slate-300 pl-8">spotifyClient.play(uri, onTimeout = &#123; localAudioEngine.playFallback() &#125;)</p>
              <p className="text-slate-300 pl-4">&#125; else &#123;</p>
              <p className="text-slate-300 pl-8">localAudioEngine.playWithDspFadeIn(fallbackPath, fadeMinutes)</p>
              <p className="text-slate-300 pl-4">&#125;</p>
              <p className="text-yellow-300">&#125;</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#42474E] dark:text-[#CBD2D9]">
                Ver documento: <code className="font-mono text-[#D9480F] dark:text-[#FFA94D]">entregas/14_specs_streaming_music_spotify_apple_m3_para_claude.md</code>
              </span>
              <button
                onClick={() => setShowComposeCodeModal(false)}
                className="py-2 px-4 rounded-xl bg-[#DEE3EA]/70 dark:bg-[#16202A] text-xs font-bold text-[#16202A] dark:text-[#E0E3E8] hover:bg-[#DEE3EA]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
