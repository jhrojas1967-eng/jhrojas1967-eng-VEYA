import { AvatarState, AvatarMood } from './types';

/**
 * Genera un archivo de animación JSON estándar compatible con Bodymovin / Lottie (v5.5+)
 * listo para ser cargado en Android Jetpack Compose con:
 * 
 * val composition by rememberLottieComposition(LottieCompositionSpec.RawRes(R.raw.veya_avatar_lottie))
 * LottieAnimation(composition = composition, iterations = LottieConstants.IterateForever)
 */

interface ColorRGB {
  r: number; // 0 a 1
  g: number; // 0 a 1
  b: number; // 0 a 1
}

const MOOD_LOTTIE_COLORS: Record<AvatarMood, { core: ColorRGB; sss: ColorRGB; rim: ColorRGB; glow: ColorRGB }> = {
  sereno: {
    core: { r: 21 / 255, g: 94 / 255, b: 149 / 255 },
    sss: { r: 56 / 255, g: 189 / 255, b: 248 / 255 },
    rim: { r: 186 / 255, g: 230 / 255, b: 253 / 255 },
    glow: { r: 56 / 255, g: 189 / 255, b: 248 / 255 },
  },
  cercano: {
    core: { r: 118 / 255, g: 84 / 255, b: 167 / 255 },
    sss: { r: 192 / 255, g: 132 / 255, b: 252 / 255 },
    rim: { r: 233 / 255, g: 213 / 255, b: 255 / 255 },
    glow: { r: 192 / 255, g: 132 / 255, b: 252 / 255 },
  },
  concentrado: {
    core: { r: 0 / 255, g: 106 / 255, b: 103 / 255 },
    sss: { r: 45 / 255, g: 212 / 255, b: 191 / 255 },
    rim: { r: 153 / 255, g: 246 / 255, b: 228 / 255 },
    glow: { r: 45 / 255, g: 212 / 255, b: 191 / 255 },
  },
  animado: {
    core: { r: 217 / 255, g: 119 / 255, b: 6 / 255 },
    sss: { r: 251 / 255, g: 191 / 255, b: 36 / 255 },
    rim: { r: 254 / 255, g: 240 / 255, b: 138 / 255 },
    glow: { r: 251 / 255, g: 191 / 255, b: 36 / 255 },
  },
  empatico: {
    core: { r: 219 / 255, g: 39 / 255, b: 119 / 255 },
    sss: { r: 244 / 255, g: 114 / 255, b: 182 / 255 },
    rim: { r: 251 / 255, g: 207 / 255, b: 232 / 255 },
    glow: { r: 244 / 255, g: 114 / 255, b: 182 / 255 },
  },
  espera: {
    core: { r: 71 / 255, g: 85 / 255, b: 105 / 255 },
    sss: { r: 148 / 255, g: 163 / 255, b: 184 / 255 },
    rim: { r: 226 / 255, g: 232 / 255, b: 240 / 255 },
    glow: { r: 148 / 255, g: 163 / 255, b: 184 / 255 },
  },
};

export function generateLottieAvatarJson(
  state: AvatarState = 'idle',
  mood: AvatarMood = 'sereno',
  amplitude: number = 0.5,
  reducedMotion: boolean = false
): object {
  const colors = MOOD_LOTTIE_COLORS[mood] || MOOD_LOTTIE_COLORS.sereno;
  const fps = 60;
  const durationFrames = 120; // 2 segundos de ciclo continuo de respiración

  // Factores de escala de respiración y squash & stretch
  let maxScaleX = 103;
  let minScaleX = 97;
  let maxScaleY = 98;
  let minScaleY = 102;
  let eyeSquashY = 100;
  let mouthScaleY = 100;

  if (state === 'speaking') {
    const pulse = amplitude * 15;
    maxScaleX = 105 + pulse;
    minScaleX = 95 - pulse * 0.5;
    maxScaleY = 94 - pulse * 0.5;
    minScaleY = 106 + pulse;
    mouthScaleY = 140 + amplitude * 60;
  } else if (state === 'listening') {
    maxScaleX = 104;
    minScaleX = 98;
    eyeSquashY = 115;
  } else if (state === 'thinking') {
    maxScaleX = 99;
    minScaleX = 97;
    eyeSquashY = 85;
  } else if (state === 'muted' || reducedMotion) {
    maxScaleX = 100;
    minScaleX = 100;
    maxScaleY = 100;
    minScaleY = 100;
  }

  // Estructura oficial de Lottie v5.5.2
  return {
    v: '5.5.2',
    fr: fps,
    ip: 0,
    op: durationFrames,
    w: 500,
    h: 500,
    nm: `VEYA_Avatar_${state}_${mood}`,
    ddd: 0,
    assets: [],
    layers: [
      // Layer 1: Destello especular en ojos (Catchlights)
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Eye_Specularity_Glints',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 240, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, eyeSquashY, 100], e: [100, eyeSquashY * 0.95, 100] },
              { t: 60, s: [100, eyeSquashY * 0.95, 100], e: [100, eyeSquashY, 100] },
              { t: 120, s: [100, eyeSquashY, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'Left_Eye_Glint',
            it: [
              { ty: 'el', nm: 'Glint_Circle', p: { a: 0, k: [-56, -18] }, s: { a: 0, k: [14, 12] } },
              { ty: 'fl', nm: 'Fill', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 95 }, r: 1 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
          {
            ty: 'gr',
            nm: 'Right_Eye_Glint',
            it: [
              { ty: 'el', nm: 'Glint_Circle', p: { a: 0, k: [44, -18] }, s: { a: 0, k: [14, 12] } },
              { ty: 'fl', nm: 'Fill', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 95 }, r: 1 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },

      // Layer 2: Ojos de Cristal Obsidian / Pupilas
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'Eyes_Pixar_Obsidian',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 240, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, eyeSquashY, 100], e: [100, eyeSquashY * 0.95, 100] },
              { t: 60, s: [100, eyeSquashY * 0.95, 100], e: [100, eyeSquashY, 100] },
              { t: 120, s: [100, eyeSquashY, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'Left_Eye',
            it: [
              { ty: 'el', nm: 'Pupil', p: { a: 0, k: [-50, -12] }, s: { a: 0, k: [32, 42] } },
              { ty: 'fl', nm: 'Fill', c: { a: 0, k: [11 / 255, 21 / 255, 34 / 255, 1] }, o: { a: 0, k: 100 }, r: 1 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
          {
            ty: 'gr',
            nm: 'Right_Eye',
            it: [
              { ty: 'el', nm: 'Pupil', p: { a: 0, k: [50, -12] }, s: { a: 0, k: [32, 42] } },
              { ty: 'fl', nm: 'Fill', c: { a: 0, k: [11 / 255, 21 / 255, 34 / 255, 1] }, o: { a: 0, k: 100 }, r: 1 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },

      // Layer 3: Expresión Bucal Cálida / Sonrisa Pixar
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: 'Smile_Aperture',
        sr: 1,
        ks: {
          o: { a: 0, k: state === 'muted' ? 30 : 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 290, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, mouthScaleY, 100], e: [100, mouthScaleY * 0.9, 100] },
              { t: 60, s: [100, mouthScaleY * 0.9, 100], e: [100, mouthScaleY, 100] },
              { t: 120, s: [100, mouthScaleY, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'Smile_Shape',
            it: [
              {
                ty: 'sh',
                nm: 'Path',
                ks: {
                  a: 0,
                  k: {
                    c: false,
                    i: [[0, 0], [0, 12], [0, 0]],
                    o: [[0, 12], [0, 0], [0, 0]],
                    v: [[-28, -6], [0, 10], [28, -6]],
                  },
                },
              },
              {
                ty: 'st',
                nm: 'Stroke',
                c: { a: 0, k: [colors.core.r, colors.core.g, colors.core.b, 1] },
                o: { a: 0, k: 90 },
                w: { a: 0, k: 6 },
                lc: 2,
                lj: 2,
              },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },

      // Layer 4: Cuerpo Principal 3D con Respiración y Squash & Stretch
      {
        ddd: 0,
        ind: 4,
        ty: 4,
        nm: 'Body_Breathing_Orb',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              { t: 0, s: [250, 250, 0], e: [250, 244, 0] },
              { t: 60, s: [250, 244, 0], e: [250, 250, 0] },
              { t: 120, s: [250, 250, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [minScaleX, minScaleY, 100], e: [maxScaleX, maxScaleY, 100] },
              { t: 60, s: [maxScaleX, maxScaleY, 100], e: [minScaleX, minScaleY, 100] },
              { t: 120, s: [minScaleX, minScaleY, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'Main_Sphere',
            it: [
              { ty: 'el', nm: 'Circle', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [260, 260] } },
              {
                ty: 'gf',
                nm: 'Subsurface_Gradient',
                o: { a: 0, k: 100 },
                r: 1,
                g: {
                  p: 3,
                  k: {
                    a: 0,
                    k: [
                      0, 1, 1, 1, // Blanco specular
                      0.35, colors.sss.r, colors.sss.g, colors.sss.b, // SSS Glow
                      1, colors.core.r, colors.core.g, colors.core.b, // Sombra base
                    ],
                  },
                },
                s: { a: 0, k: [-70, -80] },
                e: { a: 0, k: [130, 140] },
                t: 2, // Radial
              },
              {
                ty: 'st',
                nm: 'Rim_Light_Stroke',
                c: { a: 0, k: [colors.rim.r, colors.rim.g, colors.rim.b, 1] },
                o: { a: 0, k: 60 },
                w: { a: 0, k: 5 },
              },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },

      // Layer 5: Halo / Aura de Iluminación Ambiental (Subsurface Glow)
      {
        ddd: 0,
        ind: 5,
        ty: 4,
        nm: 'Atmospheric_Glow_Halo',
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [35], e: [55] },
              { t: 60, s: [55], e: [35] },
              { t: 120, s: [35] },
            ],
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, 100, 100], e: [115, 115, 100] },
              { t: 60, s: [115, 115, 100], e: [100, 100, 100] },
              { t: 120, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            nm: 'Glow_Shape',
            it: [
              { ty: 'el', nm: 'Halo', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [380, 380] } },
              {
                ty: 'gf',
                nm: 'Aura_Gradient',
                o: { a: 0, k: 100 },
                r: 1,
                g: {
                  p: 2,
                  k: {
                    a: 0,
                    k: [
                      0, colors.glow.r, colors.glow.g, colors.glow.b,
                      1, colors.core.r, colors.core.g, colors.core.b,
                    ],
                  },
                },
                s: { a: 0, k: [0, 0] },
                e: { a: 0, k: [190, 190] },
                t: 2,
              },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Descarga directamente un archivo JSON en el navegador
 */
export function downloadJsonFile(filename: string, data: object): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

