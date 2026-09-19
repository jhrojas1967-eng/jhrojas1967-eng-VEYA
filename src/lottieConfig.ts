import { AvatarState, AvatarMood } from './types';

export interface LottieAnchorPoint {
  x: number;
  y: number;
  z?: number;
  description?: string;
}

export interface LottieLayerMapping {
  index: number;
  name: string;
  type: 'shape' | 'solid';
  description: string;
  anchorPoint: LottieAnchorPoint;
  position: {
    x: number;
    y: number;
    z?: number;
    animated?: boolean;
    keyFramesDescription?: string;
  };
  renderOrder: string;
  dynamicPropertyKey?: string;
}

export interface BreathingParameters {
  frequencyHz: number;
  cycleDurationFrames: number;
  fps: number;
  scaleMinPercent: number;
  scaleMaxPercent: number;
  squashStretchRatio: number;
  subsurfaceDisplacementPx: number;
}

export interface MoodColorConfig {
  coreHex: string;
  sssHex: string;
  rimHex: string;
  glowHex: string;
  rgbNormalized: {
    core: [number, number, number];
    sss: [number, number, number];
    rim: [number, number, number];
    glow: [number, number, number];
  };
}

export interface LottieExportConfiguration {
  schemaVersion: string;
  targetFramework: string;
  targetLibrary: string;
  targetPackage: string;
  assetConvention: {
    resFolder: string;
    filenamePattern: string;
    exampleFilename: string;
  };
  canvasDimensions: {
    width: number;
    height: number;
    recommendedDpSize: number;
    globalAnchorPoint: {
      x: number;
      y: number;
      z: number;
      description: string;
    };
  };
  breathing: BreathingParameters;
  layers: LottieLayerMapping[];
  states: Record<
    AvatarState,
    {
      label: string;
      scaleMultiplier: number;
      audioReactive: boolean;
      loopMode: 'forever' | 'once';
      defaultIterations: string;
    }
  >;
  moods: Record<AvatarMood, MoodColorConfig>;
  dynamicPropertiesAndroid: {
    colorKeyPaths: {
      keyPath: string[];
      propertyType: 'Color' | 'ColorFilter' | 'Opacity' | 'Scale';
      description: string;
    }[];
  };
}

export const DEFAULT_LOTTIE_EXPORT_CONFIG: LottieExportConfiguration = {
  schemaVersion: '1.0.0',
  targetFramework: 'Android (Jetpack Compose)',
  targetLibrary: 'com.airbnb.android:lottie-compose:6.4.0',
  targetPackage: 'personal.veya.ui.components.avatar',
  assetConvention: {
    resFolder: 'app/src/main/res/raw',
    filenamePattern: 'veya_avatar_{state}_{mood}.json',
    exampleFilename: 'veya_avatar_idle_sereno.json',
  },
  canvasDimensions: {
    width: 500,
    height: 500,
    recommendedDpSize: 260,
    globalAnchorPoint: {
      x: 250.0,
      y: 250.0,
      z: 0.0,
      description: 'Centro geométrico del lienzo 500x500 (Stage Origin)',
    },
  },
  breathing: {
    frequencyHz: 1.8,
    cycleDurationFrames: 120,
    fps: 60,
    scaleMinPercent: 97,
    scaleMaxPercent: 103,
    squashStretchRatio: 0.94,
    subsurfaceDisplacementPx: 6,
  },
  layers: [
    {
      index: 1,
      name: 'Eye_Specularity_Glints',
      type: 'shape',
      description: 'Destellos especulares en ojos estilo Disney/Pixar (doble punto de luz en cristal)',
      anchorPoint: { x: 0, y: 0, z: 0, description: 'Centro local relativo a los ojos' },
      position: { x: 250, y: 240, z: 0 },
      renderOrder: 'Primer plano (Frontal superior)',
      dynamicPropertyKey: 'SPECULARITY_OPACITY',
    },
    {
      index: 2,
      name: 'Eyes_Pixar_Obsidian',
      type: 'shape',
      description: 'Pupilas profundas de vidrio obsidian (#0B1522)',
      anchorPoint: { x: 0, y: 0, z: 0, description: 'Centro local relativo a los ojos' },
      position: { x: 250, y: 240, z: 0 },
      renderOrder: 'Capa facial media',
      dynamicPropertyKey: 'EYE_PUPIL_COLOR',
    },
    {
      index: 3,
      name: 'Smile_Aperture',
      type: 'shape',
      description: 'Curva bezier bucal / apertura resonante con stroke redondeado',
      anchorPoint: { x: 0, y: 0, z: 0, description: 'Centro local del trazo bucal' },
      position: { x: 250, y: 290, z: 0 },
      renderOrder: 'Capa facial inferior',
      dynamicPropertyKey: 'MOUTH_COLOR',
    },
    {
      index: 4,
      name: 'Body_Breathing_Orb',
      type: 'shape',
      description: 'Orbe 3D principal con gradiente de dispersión subsuperficial (SSS) y rim light',
      anchorPoint: { x: 0, y: 0, z: 0, description: 'Centro volumétrico del orbe' },
      position: {
        x: 250,
        y: 250,
        z: 0,
        animated: true,
        keyFramesDescription: 'Flotación vertical armónica de 6px en contrafase (Y: 250 -> 244 -> 250)',
      },
      renderOrder: 'Cuerpo volumétrico central',
      dynamicPropertyKey: 'BODY_GRADIENT_SSS',
    },
    {
      index: 5,
      name: 'Atmospheric_Glow_Halo',
      type: 'shape',
      description: 'Halo volumétrico difuso posterior que respira en contrafase lumínica',
      anchorPoint: { x: 0, y: 0, z: 0, description: 'Centro del halo ambiental' },
      position: { x: 250, y: 250, z: 0 },
      renderOrder: 'Fondo atmosférico posterior',
      dynamicPropertyKey: 'AURA_COLOR',
    },
  ],
  states: {
    idle: {
      label: 'Reposo / Respiración Continua',
      scaleMultiplier: 1.0,
      audioReactive: false,
      loopMode: 'forever',
      defaultIterations: 'LottieConstants.IterateForever',
    },
    listening: {
      label: 'Escucha Activa',
      scaleMultiplier: 1.04,
      audioReactive: false,
      loopMode: 'forever',
      defaultIterations: 'LottieConstants.IterateForever',
    },
    thinking: {
      label: 'Introspección / Proceso',
      scaleMultiplier: 0.98,
      audioReactive: false,
      loopMode: 'forever',
      defaultIterations: 'LottieConstants.IterateForever',
    },
    speaking: {
      label: 'Habla Reactiva (RMS)',
      scaleMultiplier: 1.15,
      audioReactive: true,
      loopMode: 'forever',
      defaultIterations: 'LottieConstants.IterateForever',
    },
    muted: {
      label: 'Silenciado / Standby',
      scaleMultiplier: 0.94,
      audioReactive: false,
      loopMode: 'once',
      defaultIterations: '1',
    },
  },
  moods: {
    sereno: {
      coreHex: '#155E95',
      sssHex: '#38BDF8',
      rimHex: '#BAE6FD',
      glowHex: '#38BDF8',
      rgbNormalized: {
        core: [0.0824, 0.3686, 0.5843],
        sss: [0.2196, 0.7412, 0.9725],
        rim: [0.7294, 0.902, 0.9922],
        glow: [0.2196, 0.7412, 0.9725],
      },
    },
    cercano: {
      coreHex: '#7654A7',
      sssHex: '#C084FC',
      rimHex: '#E9D5FF',
      glowHex: '#C084FC',
      rgbNormalized: {
        core: [0.4627, 0.3294, 0.6549],
        sss: [0.7529, 0.5176, 0.9882],
        rim: [0.9137, 0.8353, 1.0],
        glow: [0.7529, 0.5176, 0.9882],
      },
    },
    concentrado: {
      coreHex: '#006A67',
      sssHex: '#2DD4BF',
      rimHex: '#99F6E4',
      glowHex: '#2DD4BF',
      rgbNormalized: {
        core: [0.0, 0.4157, 0.4039],
        sss: [0.1765, 0.8314, 0.749],
        rim: [0.6, 0.9647, 0.8941],
        glow: [0.1765, 0.8314, 0.749],
      },
    },
    animado: {
      coreHex: '#D97706',
      sssHex: '#FBBF24',
      rimHex: '#FDE68A',
      glowHex: '#FBBF24',
      rgbNormalized: {
        core: [0.851, 0.4667, 0.0235],
        sss: [0.9843, 0.749, 0.1412],
        rim: [0.9961, 0.902, 0.5412],
        glow: [0.9843, 0.749, 0.1412],
      },
    },
    empatico: {
      coreHex: '#DB2777',
      sssHex: '#F472B6',
      rimHex: '#FBCFE8',
      glowHex: '#F472B6',
      rgbNormalized: {
        core: [0.8588, 0.1529, 0.4667],
        sss: [0.9569, 0.4471, 0.7137],
        rim: [0.9843, 0.8118, 0.9098],
        glow: [0.9569, 0.4471, 0.7137],
      },
    },
    espera: {
      coreHex: '#475569',
      sssHex: '#94A3B8',
      rimHex: '#CBD5E1',
      glowHex: '#94A3B8',
      rgbNormalized: {
        core: [0.2784, 0.3333, 0.4118],
        sss: [0.5804, 0.6392, 0.7216],
        rim: [0.7961, 0.8353, 0.8824],
        glow: [0.5804, 0.6392, 0.7216],
      },
    },
  },
  dynamicPropertiesAndroid: {
    colorKeyPaths: [
      {
        keyPath: ['Atmospheric_Glow_Halo', 'Glow_Shape', 'Aura_Gradient'],
        propertyType: 'ColorFilter',
        description: 'Permite tintar el halo exterior según el estado emocional sin recargar el archivo JSON',
      },
      {
        keyPath: ['Body_Breathing_Orb', 'Main_Sphere', 'Rim_Light_Stroke'],
        propertyType: 'Color',
        description: 'Tinta el borde de luz translúcido en tiempo real',
      },
      {
        keyPath: ['Smile_Aperture', 'Smile_Shape', 'Stroke'],
        propertyType: 'Color',
        description: 'Ajusta el color del trazo de sonrisa o boca',
      },
    ],
  },
};
