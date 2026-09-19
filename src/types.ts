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
  isFavorite: boolean;
  coverHue: string;
}

export interface OnboardingStep {
  step: number;
  title: string;
  subtitle: string;
  isOptional: boolean;
}
