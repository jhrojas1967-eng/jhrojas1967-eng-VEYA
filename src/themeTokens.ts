import { M3ColorScheme } from './types';

export const LightColorScheme: M3ColorScheme = {
  primary: '#155E95',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D7EEFF',
  onPrimaryContainer: '#001D33',
  secondary: '#7654A7',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F0E6FF',
  onSecondaryContainer: '#2C0D5A',
  tertiary: '#006A67',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#70F7F2',
  onTertiaryContainer: '#00201F',
  background: '#F7FAFC',
  onBackground: '#16202A',
  surface: '#FFFFFF',
  onSurface: '#16202A',
  surfaceVariant: '#DEE3EA',
  onSurfaceVariant: '#42474E',
  outline: '#B7C5D0',
  outlineVariant: '#CBD2D9',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
};

export const DarkColorScheme: M3ColorScheme = {
  primary: '#8ECEFF',
  onPrimary: '#003355',
  primaryContainer: '#004A7B',
  onPrimaryContainer: '#D7EEFF',
  secondary: '#DCB8FF',
  onSecondary: '#442375',
  secondaryContainer: '#5C3B8D',
  onSecondaryContainer: '#F0E6FF',
  tertiary: '#4EDAD5',
  onTertiary: '#003735',
  tertiaryContainer: '#004F4D',
  onTertiaryContainer: '#70F7F2',
  background: '#101418',
  onBackground: '#E0E3E8',
  surface: '#12181F',
  onSurface: '#E0E3E8',
  surfaceVariant: '#42474E',
  onSurfaceVariant: '#C2C7CE',
  outline: '#8C9299',
  outlineVariant: '#42474E',
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
};

export const ShapeTokens = {
  extraSmall: '8dp (rounded-lg)',
  small: '12dp (rounded-xl)',
  medium: '18dp (rounded-2xl)',
  large: '24dp (rounded-3xl)',
  extraLarge: '32dp (rounded-full/pill)',
};

export const TypographyTokens = {
  fontFamily: 'Nunito Sans, system-ui, sans-serif',
  displayLarge: '57sp / LineHeight 64sp / Weight 700',
  headlineMedium: '28sp / LineHeight 36sp / Weight 700',
  titleLarge: '22sp / LineHeight 28sp / Weight 600',
  titleMedium: '16sp / LineHeight 24sp / Weight 600',
  bodyLarge: '16sp / LineHeight 24sp / Weight 400',
  bodyMedium: '14sp / LineHeight 20sp / Weight 400',
  labelLarge: '14sp / LineHeight 20sp / Weight 600',
};

export const KotlinThemeSnippet = `package personal.veya.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

// Tokens definidos por Gemini / Google AI Studio para VEYA
val VeyaLightColorScheme = lightColorScheme(
    primary = Color(0xFF155E95),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFD7EEFF),
    onPrimaryContainer = Color(0xFF001D33),
    secondary = Color(0xFF7654A7),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFF0E6FF),
    onSecondaryContainer = Color(0xFF2C0D5A),
    tertiary = Color(0xFF006A67),
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Color(0xFF70F7F2),
    onTertiaryContainer = Color(0xFF00201F),
    background = Color(0xFFF7FAFC),
    onBackground = Color(0xFF16202A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF16202A),
    surfaceVariant = Color(0xFFDEE3EA),
    onSurfaceVariant = Color(0xFF42474E),
    outline = Color(0xFFB7C5D0),
    outlineVariant = Color(0xFFCBD2D9),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF)
)

val VeyaDarkColorScheme = darkColorScheme(
    primary = Color(0xFF8ECEFF),
    onPrimary = Color(0xFF003355),
    primaryContainer = Color(0xFF004A7B),
    onPrimaryContainer = Color(0xFFD7EEFF),
    secondary = Color(0xFFDCB8FF),
    onSecondary = Color(0xFF442375),
    secondaryContainer = Color(0xFF5C3B8D),
    onSecondaryContainer = Color(0xFFF0E6FF),
    tertiary = Color(0xFF4EDAD5),
    onTertiary = Color(0xFF003735),
    tertiaryContainer = Color(0xFF004F4D),
    onTertiaryContainer = Color(0xFF70F7F2),
    background = Color(0xFF101418),
    onBackground = Color(0xFFE0E3E8),
    surface = Color(0xFF12181F),
    onSurface = Color(0xFFE0E3E8),
    surfaceVariant = Color(0xFF42474E),
    onSurfaceVariant = Color(0xFFC2C7CE),
    outline = Color(0xFF8C9299),
    outlineVariant = Color(0xFF42474E),
    error = Color(0xFFF2B8B5),
    onError = Color(0xFF601410)
)
`;
