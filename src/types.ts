export type ThemeMode = 'light' | 'dark';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'muted';

export type AvatarMood = 'sereno' | 'cercano' | 'concentrado' | 'animado' | 'empatico' | 'espera';

export type ScreenTab = 'onboarding' | 'today' | 'chat' | 'music' | 'settings';

export interface M3ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
}

export interface RoutineStep {
  id: string;
  order: number;
  time: string;
  title: string;
  detail: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'veya';
  text: string;
  timestamp: string;
  mood?: AvatarMood;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  isFavorite: boolean;
  coverHue: string;
  coverGradient?: string;
  format: 'FLAC' | 'WAV' | 'MP3' | 'DSD';
  bitDepth?: string; // e.g. '24-bit', '16-bit', '32-bit float'
  sampleRate: string; // e.g. '96.0 kHz', '192.0 kHz', '44.1 kHz'
  bitrate: string; // e.g. '2840 kbps', '9216 kbps', '320 kbps'
  genre?: string;
  year?: number;
  folderPath?: string;
  lyrics?: string[];
  replayGainDb?: number;
}

export interface EqPreset {
  id: string;
  name: string;
  genre: string;
  description: string;
  bands: number[]; // 10 values from -10 to +10 dB
  isCustom?: boolean;
}

export interface AudioDspState {
  masterDspEnabled: boolean;
  activePresetId: string;
  preampGain: number; // -10 to +10 dB
  eqBands: number[]; // 10 bands: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz
  // jetAudio Advanced Sound Enhancements:
  bbeClarityEnabled: boolean;
  bbeClarityLevel: number; // 0 to 100
  bbeVivaSurroundEnabled: boolean;
  bbeVivaSurroundLevel: number; // 0 to 100
  xBassEnabled: boolean;
  xBassLevel: number; // 0 to 100
  xBassCutoff: 60 | 80 | 100; // Hz
  wideStereoEnabled: boolean;
  wideStereoLevel: number; // 0 to 100
  reverbType: 'off' | 'room' | 'hall' | 'stadium' | 'stage' | 'cathedral';
  reverbWet: number; // 0 to 100
  agcVolumeLeveling: boolean; // Automatic Gain Control / ReplayGain
  crossfadeSeconds: number; // 0 to 10 seconds
  playbackSpeed: number; // 0.5x to 2.0x
  pitchSemitones: number; // -6 to +6 st
  hiResDirectOutput: boolean; // Direct bit-perfect AAudio/OpenSL ES
}

export interface OnboardingStep {
  step: number;
  title: string;
  subtitle: string;
  isOptional: boolean;
}
