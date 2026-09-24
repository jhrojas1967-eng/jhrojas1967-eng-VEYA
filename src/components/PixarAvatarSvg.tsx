import React, { useState, useEffect } from 'react';
import { AvatarState, AvatarMood } from '../types';

interface PixarAvatarSvgProps {
  state: AvatarState;
  mood: AvatarMood;
  size?: number;
  reducedMotion?: boolean;
  amplitude?: number; // 0.0 to 1.0 (microphone RMS level)
  showStatusLabel?: boolean;
}

const PIXAR_PALETTES: Record<
  AvatarMood,
  {
    gradientStart: string;
    gradientMid: string;
    gradientEnd: string;
    rimLight: string;
    particle: string;
    ambientGlow: string;
    label: string;
  }
> = {
  sereno: {
    gradientStart: '#E0F2FE', // Ice specular
    gradientMid: '#38BDF8',   // Sky Cyan
    gradientEnd: '#0C4A6E',   // Deep Ocean Shadow
    rimLight: '#BAE6FD',
    particle: '#7DD3FC',
    ambientGlow: 'rgba(56, 189, 248, 0.4)',
    label: 'Sereno',
  },
  cercano: {
    gradientStart: '#F3E8FF', // Soft Lilac
    gradientMid: '#C084FC',   // Purple Bloom
    gradientEnd: '#581C87',   // Deep Plum
    rimLight: '#E9D5FF',
    particle: '#D8B4FE',
    ambientGlow: 'rgba(192, 132, 252, 0.45)',
    label: 'Cercano',
  },
  concentrado: {
    gradientStart: '#CCFBF1', // Mint Glaze
    gradientMid: '#2DD4BF',   // Emerald Aqua
    gradientEnd: '#134E4A',   // Deep Pine Shadow
    rimLight: '#99F6E4',
    particle: '#5EEAD4',
    ambientGlow: 'rgba(45, 212, 191, 0.45)',
    label: 'Concentrado',
  },
  animado: {
    gradientStart: '#FEF3C7', // Warm Butter
    gradientMid: '#FBBF24',   // Sunset Amber
    gradientEnd: '#78350F',   // Warm Roasted Earth
    rimLight: '#FDE68A',
    particle: '#FCD34D',
    ambientGlow: 'rgba(251, 191, 36, 0.5)',
    label: 'Animado',
  },
  empatico: {
    gradientStart: '#FCE7F3', // Rose Quartz
    gradientMid: '#F472B6',   // Radiant Coral Pink
    gradientEnd: '#831843',   // Deep Berry
    rimLight: '#FBCFE8',
    particle: '#F9A8D4',
    ambientGlow: 'rgba(244, 114, 182, 0.45)',
    label: 'Empático',
  },
  espera: {
    gradientStart: '#F1F5F9', // Pearl
    gradientMid: '#94A3B8',   // Cool Slate
    gradientEnd: '#1E293B',   // Deep Charcoal
    rimLight: '#CBD5E1',
    particle: '#CBD5E1',
    ambientGlow: 'rgba(148, 163, 184, 0.3)',
    label: 'En espera',
  },
  vital: {
    gradientStart: '#FFEDD5', // Dawn light
    gradientMid: '#FB923C',   // Solar Coral Amber
    gradientEnd: '#9A3412',   // Deep Warm Amber
    rimLight: '#FEF08A',      // Sunlight rim
    particle: '#FDE047',      // Golden spark
    ambientGlow: 'rgba(251, 146, 60, 0.55)',
    label: 'Vital',
  },
};

export const PixarAvatarSvg: React.FC<PixarAvatarSvgProps> = ({
  state,
  mood,
  size = 220,
  reducedMotion = false,
  amplitude = 0.5,
  showStatusLabel = false,
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frameId: number;
    const animate = () => {
      setTime((t) => (t + 0.035) % (Math.PI * 200));
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion]);

  const palette = PIXAR_PALETTES[mood] || PIXAR_PALETTES.sereno;
  const cx = size / 2;
  const cy = size / 2;

  // Breathing dynamics: continuous sinusoidal expansion and contraction
  const breath = Math.sin(time * 1.8);
  const breathSub = Math.cos(time * 2.5);

  let scale = 1.0;
  let mouthOpen = 0;
  let eyeSquint = 1.0;
  let eyeOffsetY = 0;

  if (state === 'idle') {
    scale = 1.0 + (reducedMotion ? 0 : breath * 0.025);
  } else if (state === 'listening') {
    scale = 1.05 + (reducedMotion ? 0 : Math.sin(time * 3) * 0.04);
    eyeSquint = 1.15;
    eyeOffsetY = -2;
  } else if (state === 'thinking') {
    scale = 0.98 + (reducedMotion ? 0 : Math.sin(time * 4) * 0.02);
    eyeOffsetY = -4; // looking thoughtfully upwards
  } else if (state === 'speaking') {
    scale = 1.02 + amplitude * 0.12 + (reducedMotion ? 0 : Math.sin(time * 6) * 0.03);
    mouthOpen = 4 + amplitude * 12;
  } else if (state === 'muted') {
    scale = 0.93;
    eyeSquint = 0.7;
  }

  const baseR = size * 0.3 * scale;
  const deformX = reducedMotion ? 0 : breath * 2.5;
  const deformY = reducedMotion ? 0 : breathSub * 2.5;

  return (
    <div
      className="flex flex-col items-center justify-center select-none relative"
      style={{ width: size, height: size + (showStatusLabel ? 32 : 0) }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label={`Avatar VEYA Pixar SVG en estado ${state}, humor ${mood}`}
      >
        <defs>
          {/* Volumetric ambient glow filter */}
          <filter id={`pixarGlow-${mood}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.09} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3D Pearl Drop Shadow */}
          <filter id="pixarShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={size * 0.06} stdDeviation={size * 0.07} floodColor="#091424" floodOpacity="0.4" />
          </filter>

          {/* Subsurface scattering radial illumination */}
          <radialGradient id={`sssGrad-${mood}`} cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor={palette.gradientStart} />
            <stop offset="28%" stopColor={palette.rimLight} />
            <stop offset="68%" stopColor={palette.gradientMid} />
            <stop offset="92%" stopColor={palette.gradientEnd} />
            <stop offset="100%" stopColor="#0B1522" />
          </radialGradient>

          {/* Translucent rim light reflection */}
          <linearGradient id={`rimGrad-${mood}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="45%" stopColor={palette.rimLight} stopOpacity="0.2" />
            <stop offset="100%" stopColor={palette.gradientEnd} stopOpacity="0.6" />
          </linearGradient>

          {/* Core Soul Light */}
          <radialGradient id={`soulGrad-${mood}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor={palette.rimLight} stopOpacity="0.4" />
            <stop offset="100%" stopColor={palette.gradientMid} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Backlight Halo */}
        {state !== 'muted' && (
          <ellipse
            cx={cx}
            cy={cy}
            rx={baseR * 1.55}
            ry={baseR * 1.45}
            fill={palette.ambientGlow}
            filter={`url(#pixarGlow-${mood})`}
            opacity={0.7 + (reducedMotion ? 0 : breath * 0.15)}
          />
        )}

        {/* Listening Acoustic Pulses */}
        {state === 'listening' && !reducedMotion && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={baseR * (1.2 + ((time * 2) % 3) * 0.12)}
              fill="none"
              stroke={palette.rimLight}
              strokeWidth="2"
              opacity={Math.max(0, 1 - (((time * 2) % 3) * 0.35))}
            />
          </g>
        )}

        {/* Floating sentient sparks (Pixar fairy-dust effect) */}
        {!reducedMotion && state !== 'muted' && (
          <g>
            {[
              { angle: 0.8, dist: 1.25, rad: 2.2 },
              { angle: 2.3, dist: 1.35, rad: 1.8 },
              { angle: 3.7, dist: 1.22, rad: 2.5 },
              { angle: 5.1, dist: 1.4, rad: 1.5 },
            ].map((pt, idx) => {
              const currentAngle = pt.angle + time * (0.6 + idx * 0.2);
              const px = cx + Math.cos(currentAngle) * (baseR * pt.dist);
              const py = cy + Math.sin(currentAngle) * (baseR * pt.dist) + Math.sin(time * 3 + idx) * 4;
              const sparkAlpha = 0.3 + Math.sin(time * 3 + idx) * 0.35;
              return (
                <circle
                  key={idx}
                  cx={px}
                  cy={py}
                  r={pt.rad}
                  fill={palette.particle}
                  opacity={sparkAlpha}
                  filter="drop-shadow(0 0 4px #FFFFFF)"
                />
              );
            })}
          </g>
        )}

        {/* 3D Main Sphere Body with Shadows & Highlights */}
        <g filter="url(#pixarShadow)">
          <ellipse
            cx={cx}
            cy={cy + (reducedMotion ? 0 : Math.sin(time * 1.5) * 3)}
            rx={baseR + deformX}
            ry={baseR - deformY}
            fill={`url(#sssGrad-${mood})`}
          />

          {/* Internal Resonating Heartbeat */}
          <circle
            cx={cx}
            cy={cy + baseR * 0.15}
            r={baseR * 0.48}
            fill={`url(#soulGrad-${mood})`}
          />

          {/* Soft Subsurface Specular Rim */}
          <ellipse
            cx={cx}
            cy={cy + (reducedMotion ? 0 : Math.sin(time * 1.5) * 3)}
            rx={baseR + deformX}
            ry={baseR - deformY}
            fill="none"
            stroke={`url(#rimGrad-${mood})`}
            strokeWidth="2.5"
          />

          {/* Warm Pixar Eyes */}
          <g transform={`translate(0, ${eyeOffsetY + (reducedMotion ? 0 : Math.sin(time * 1.5) * 3)})`}>
            {[-1, 1].map((dir) => {
              const eyeX = cx + dir * (baseR * 0.42);
              const eyeY = cy - baseR * 0.08;
              const rX = baseR * 0.14 * eyeSquint;
              const rY = baseR * 0.18;

              return (
                <g key={dir}>
                  {/* Eye socket glow */}
                  <ellipse cx={eyeX} cy={eyeY} rx={rX * 1.3} ry={rY * 1.3} fill={palette.gradientMid} opacity="0.25" />
                  {/* Deep pupil */}
                  <ellipse cx={eyeX} cy={eyeY} rx={rX} ry={rY} fill={state === 'muted' ? '#334155' : '#0B1522'} />
                  {/* Iris color fringe */}
                  {state !== 'muted' && (
                    <ellipse cx={eyeX} cy={eyeY + 1} rx={rX * 0.7} ry={rY * 0.7} fill={palette.rimLight} opacity="0.65" />
                  )}
                  {/* Specular Disney Sparkle (Catchlight) */}
                  <ellipse cx={eyeX - rX * 0.35} cy={eyeY - rY * 0.35} rx={rX * 0.4} ry={rY * 0.35} fill="#FFFFFF" />
                  <ellipse cx={eyeX + rX * 0.3} cy={eyeY + rY * 0.3} rx={rX * 0.18} ry={rY * 0.18} fill="#FFFFFF" opacity="0.7" />
                </g>
              );
            })}

            {/* Pixar Smile / Speaking Mouth */}
            {state === 'speaking' ? (
              <ellipse
                cx={cx}
                cy={cy + baseR * 0.32}
                rx={baseR * 0.22}
                ry={mouthOpen}
                fill="#0F172A"
              />
            ) : (
              <path
                d={`M ${cx - baseR * 0.2} ${cy + baseR * 0.3} Q ${cx} ${cy + baseR * 0.42} ${cx + baseR * 0.2} ${cy + baseR * 0.3}`}
                fill="none"
                stroke={state === 'muted' ? '#64748B' : palette.gradientEnd}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Muted line indicator */}
          {state === 'muted' && (
            <line
              x1={cx - baseR * 0.75}
              y1={cy + baseR * 0.75}
              x2={cx + baseR * 0.75}
              y2={cy - baseR * 0.75}
              stroke="#E11D48"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>

      {showStatusLabel && (
        <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold tracking-wide">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: state === 'muted' ? '#E11D48' : palette.gradientMid }}
          />
          <span className="uppercase text-[11px] font-bold text-slate-700 dark:text-slate-200">
            {state} · {palette.label}
          </span>
        </div>
      )}
    </div>
  );
};
