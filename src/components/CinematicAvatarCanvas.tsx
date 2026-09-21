import React, { useEffect, useRef } from 'react';
import { AvatarState, AvatarMood } from '../types';

interface CinematicAvatarCanvasProps {
  state: AvatarState;
  mood: AvatarMood;
  size?: number;
  reducedMotion?: boolean;
  amplitude?: number; // 0.0 to 1.0 (microphone RMS level)
  showMoodBadge?: boolean;
  stageMode?: 'obsidian' | 'claridad';
  showFloorShadow?: boolean;
  showAtmosphere?: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  speedY: number;
  speedX: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  hueOffset: number;
}

// Mood optical palette: Subsurface Scattering (SSS) hues, specular highlights, and aura rim lights
const MOOD_SPECTRA: Record<
  AvatarMood,
  {
    coreColor: [number, number, number];
    sssColor: [number, number, number];
    ambientRim: [number, number, number];
    particleHue: [number, number, number];
    label: string;
  }
> = {
  sereno: {
    coreColor: [21, 94, 149],       // VEYA Primary Sapphire
    sssColor: [56, 189, 248],       // Sky Azure
    ambientRim: [147, 197, 253],    // Luminous Periwinkle
    particleHue: [125, 211, 252],
    label: 'Sereno',
  },
  cercano: {
    coreColor: [118, 84, 167],      // VEYA Secondary Lilac
    sssColor: [192, 132, 252],      // Violet Blossom
    ambientRim: [244, 114, 182],    // Warm Rose Tint
    particleHue: [216, 180, 254],
    label: 'Cercano',
  },
  concentrado: {
    coreColor: [0, 106, 103],       // Deep Emerald Cyan
    sssColor: [45, 212, 191],       // Luminous Mint
    ambientRim: [153, 246, 228],    // Glacial Rim
    particleHue: [94, 234, 212],
    label: 'Concentrado',
  },
  animado: {
    coreColor: [217, 119, 6],       // Warm Amber
    sssColor: [251, 191, 36],       // Golden Sunlight
    ambientRim: [254, 240, 138],    // Warm Halo
    particleHue: [252, 211, 77],
    label: 'Animado',
  },
  empatico: {
    coreColor: [219, 39, 119],      // Radiant Magenta
    sssColor: [244, 114, 182],      // Soft Coral Pink
    ambientRim: [251, 207, 232],    // Gentle Lavender
    particleHue: [249, 168, 212],
    label: 'Empático',
  },
  espera: {
    coreColor: [71, 85, 105],       // Slate Mist
    sssColor: [148, 163, 184],      // Pearl Gray
    ambientRim: [226, 232, 240],    // Silver Rim
    particleHue: [203, 213, 225],
    label: 'En espera',
  },
};

export const CinematicAvatarCanvas: React.FC<CinematicAvatarCanvasProps> = ({
  state,
  mood,
  size = 280,
  reducedMotion = false,
  amplitude = 0.5,
  showMoodBadge = false,
  stageMode = 'obsidian',
  showFloorShadow = true,
  showAtmosphere = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Maintain state references for the continuous 60fps render loop
  const propsRef = useRef({ state, mood, reducedMotion, amplitude, size, stageMode, showFloorShadow, showAtmosphere });
  useEffect(() => {
    propsRef.current = { state, mood, reducedMotion, amplitude, size, stageMode, showFloorShadow, showAtmosphere };
  }, [state, mood, reducedMotion, amplitude, size, stageMode, showFloorShadow, showAtmosphere]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-density retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Initialize organic ambient floating particles (spores / light dust)
    const particleCount = 26;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * size,
        y: Math.random() * size,
        radius: Math.random() * 2.2 + 0.8,
        baseRadius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        speedY: (Math.random() * 0.4 + 0.2) * -1,
        speedX: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * (size * 0.38) + size * 0.15,
        orbitSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        hueOffset: Math.random() * 20 - 10,
      });
    }

    let time = 0;

    const render = () => {
      const {
        state: curState,
        mood: curMood,
        reducedMotion: isReduced,
        amplitude: curAmp,
        size: curSize,
        stageMode: curStage,
        showFloorShadow: hasFloorShadow,
        showAtmosphere: hasAtmosphere,
      } = propsRef.current;

      const spectrum = MOOD_SPECTRA[curMood] || MOOD_SPECTRA.sereno;
      const [cr, cg, cb] = spectrum.coreColor;
      const [sr, sg, sb] = spectrum.sssColor;
      const [rr, rg, rb] = spectrum.ambientRim;
      const [pr, pg, pb] = spectrum.particleHue;

      if (!isReduced) {
        time += 0.028;
      }

      ctx.clearRect(0, 0, curSize, curSize);

      const cx = curSize / 2;
      const cy = curSize / 2;

      // 1. DYNAMIC RESPIRATION & ORGANIC SQUASH/STRETCH
      let breathWave = Math.sin(time * 1.8);
      let secondaryWave = Math.cos(time * 2.4);

      // Micro-reactions per state
      let stateScale = 1.0;
      let auraAlpha = 0.35;
      let eyeSquint = 1.0;
      let eyeGazeOffsetY = 0;
      let mouthCurvature = 0.4; // 0 = flat, 1 = happy smile

      if (curState === 'idle') {
        stateScale = 1.0 + (isReduced ? 0 : breathWave * 0.024);
        auraAlpha = 0.35 + (isReduced ? 0 : breathWave * 0.08);
      } else if (curState === 'listening') {
        stateScale = 1.05 + (isReduced ? 0 : Math.sin(time * 3.5) * 0.035);
        auraAlpha = 0.55;
        eyeSquint = 1.15;
        eyeGazeOffsetY = -2;
      } else if (curState === 'thinking') {
        stateScale = 0.98 + (isReduced ? 0 : Math.sin(time * 4) * 0.02);
        auraAlpha = 0.45;
        eyeGazeOffsetY = -4; // looking thoughtfully upward
        mouthCurvature = 0.2;
      } else if (curState === 'speaking') {
        // Direct audio amplitude reactivity with acoustic bounce
        const audioPulse = curAmp * 0.12;
        stateScale = 1.02 + audioPulse + (isReduced ? 0 : Math.sin(time * 6) * 0.035);
        auraAlpha = 0.6 + curAmp * 0.3;
        mouthCurvature = 0.6 + curAmp * 0.5;
      } else if (curState === 'muted') {
        stateScale = 0.94;
        auraAlpha = 0.12;
        eyeSquint = 0.7;
        mouthCurvature = 0.0;
      }

      const baseR = curSize * 0.28 * stateScale;

      // Optional Stage 3D Ambient Base in Claridad Mode
      if (curStage === 'claridad') {
        const stageGlow = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, curSize * 0.55);
        stageGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        stageGlow.addColorStop(0.6, 'rgba(241, 245, 249, 0.2)');
        stageGlow.addColorStop(1, 'rgba(241, 245, 249, 0)');
        ctx.fillStyle = stageGlow;
        ctx.fillRect(0, 0, curSize, curSize);
      }

      // 2. VOLUMETRIC BACKLIGHT & SUBSURFACE GLOW (Layered Radial Gradients)
      const auraGrad = ctx.createRadialGradient(cx, cy, baseR * 0.4, cx, cy, baseR * 2.2);
      auraGrad.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, ${auraAlpha * 0.85})`);
      auraGrad.addColorStop(0.45, `rgba(${cr}, ${cg}, ${cb}, ${auraAlpha * 0.4})`);
      auraGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 3. AMBIENT SENTIENT PARTICLES (Dust motes floating in Pixar studio lighting)
      if (hasAtmosphere && !isReduced && curState !== 'muted') {
        particles.forEach((p) => {
          p.angle += p.orbitSpeed;
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.angle) * 0.2;

          // Wrap particles smoothly within bounds
          if (p.y < 0) p.y = curSize;
          if (p.y > curSize) p.y = 0;
          if (p.x < 0) p.x = curSize;
          if (p.x > curSize) p.x = 0;

          const pDist = Math.hypot(p.x - cx, p.y - cy);
          const pAlpha = p.alpha * Math.sin(time * 2 + p.angle) * 0.5 + 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${pAlpha * 0.55})`;
          ctx.shadowColor = `rgba(${sr}, ${sg}, ${sb}, 0.6)`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 4. ACOUSTIC / LISTENING RADIAL RIPPLES (When listening or speaking)
      if (curState === 'listening' && !isReduced) {
        for (let ring = 1; ring <= 2; ring++) {
          const ringProgress = (time * 0.8 + ring * 0.5) % 1;
          const ringR = baseR * (1.1 + ringProgress * 0.7);
          const ringAlpha = (1 - ringProgress) * 0.5;

          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${ringAlpha})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }
      }

      // 4.5. 3D STAGE FLOOR CONTACT SHADOW (Contact Occlusion in counter-phase)
      const floatY = isReduced ? 0 : Math.sin(time * 1.5) * 4;
      if (hasFloorShadow) {
        const floorY = cy + baseR * 1.05;
        // Inverted scaling: higher float -> smaller, softer shadow
        const shadowScaleX = Math.max(0.7, 1.0 - (floatY * 0.035));
        const shadowScaleY = Math.max(0.65, 1.0 - (floatY * 0.05));
        const shadowAlpha = curStage === 'claridad' ? Math.max(0.08, 0.22 - floatY * 0.015) : Math.max(0.15, 0.42 - floatY * 0.02);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, floorY, baseR * 0.72 * shadowScaleX, baseR * 0.16 * shadowScaleY, 0, 0, Math.PI * 2);
        const shadowGrad = ctx.createRadialGradient(cx, floorY, 0, cx, floorY, baseR * 0.72 * shadowScaleX);
        const shadowBaseColor = curStage === 'claridad' ? '15, 23, 42' : '0, 8, 20';
        shadowGrad.addColorStop(0, `rgba(${shadowBaseColor}, ${shadowAlpha})`);
        shadowGrad.addColorStop(0.5, `rgba(${shadowBaseColor}, ${shadowAlpha * 0.45})`);
        shadowGrad.addColorStop(1, `rgba(${shadowBaseColor}, 0)`);
        ctx.fillStyle = shadowGrad;
        ctx.fill();
        ctx.restore();
      }

      // 5. THE ORGANIC PEARL CHARACTER BODY (Volumetric 3D Sphere with Subsurface Lighting)
      // Soft organic deformation using cubic splines
      const deformX = isReduced ? 0 : breathWave * 3.5;
      const deformY = isReduced ? 0 : secondaryWave * 3.5;

      ctx.save();
      ctx.translate(cx, cy + (isReduced ? 0 : Math.sin(time * 1.5) * 4));

      // Cast Drop Shadow
      ctx.shadowColor = `rgba(0, 15, 35, 0.45)`;
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;

      // Base Body Contour
      ctx.beginPath();
      ctx.ellipse(0, 0, baseR + deformX, baseR - deformY, 0, 0, Math.PI * 2);

      // Multi-stop 3D sphere gradient simulating Pixar frosted porcelain + subsurface scattering
      const bodyGrad = ctx.createRadialGradient(
        -baseR * 0.32,
        -baseR * 0.38,
        baseR * 0.08,
        0,
        0,
        baseR * 1.15
      );
      bodyGrad.addColorStop(0, '#FFFFFF'); // Specular keylight highlight
      bodyGrad.addColorStop(0.25, `rgb(${rr}, ${rg}, ${rb})`); // Translucent rim
      bodyGrad.addColorStop(0.65, `rgb(${sr}, ${sg}, ${sb})`); // Subsurface scattered glow
      bodyGrad.addColorStop(0.92, `rgb(${cr}, ${cg}, ${cb})`); // Core body shadow
      bodyGrad.addColorStop(1.0, `rgba(${Math.max(0, cr - 35)}, ${Math.max(0, cg - 35)}, ${Math.max(0, cb - 35)}, 0.95)`); // Ambient occlusion

      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow for inner details

      // 6. INTERNAL ILLUMINATED CORE (Heartbeat / Soul of VEYA)
      const corePulse = isReduced ? 1 : 1 + Math.sin(time * 3.2) * (curState === 'speaking' ? 0.22 : 0.08);
      const innerCoreGrad = ctx.createRadialGradient(0, baseR * 0.1, 0, 0, baseR * 0.1, baseR * 0.55 * corePulse);
      innerCoreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      innerCoreGrad.addColorStop(0.4, `rgba(${sr}, ${sg}, ${sb}, 0.5)`);
      innerCoreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = innerCoreGrad;
      ctx.beginPath();
      ctx.arc(0, baseR * 0.1, baseR * 0.55 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 7. EXPRESSIVE PIXAR-STYLE EYES (Curious, warm, luminous glassy depth)
      const eyeSpacing = baseR * 0.42;
      const eyeBaseY = -baseR * 0.1 + eyeGazeOffsetY;
      const eyeRadiusX = baseR * 0.14 * eyeSquint;
      const eyeRadiusY = baseR * 0.19 * (curState === 'thinking' ? 0.85 : 1.0);

      // Draw Left & Right Eyes
      [-1, 1].forEach((dir) => {
        const eyeX = dir * eyeSpacing;
        const eyeY = eyeBaseY;

        // Eye Socket Soft Ambient Glow
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, eyeRadiusX * 1.35, eyeRadiusY * 1.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, 0.25)`;
        ctx.fill();

        // Eye Pupil/Cornea (Deep Sapphire Obsidian)
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = curState === 'muted' ? '#334155' : '#0B1522';
        ctx.fill();

        // Iris Inner Bioluminescence
        if (curState !== 'muted') {
          ctx.beginPath();
          ctx.ellipse(eyeX, eyeY + 1, eyeRadiusX * 0.72, eyeRadiusY * 0.72, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, 0.65)`;
          ctx.fill();
        }

        // Primary Specular Catchlight (Pixar Disney Star Glint)
        ctx.beginPath();
        ctx.ellipse(eyeX - eyeRadiusX * 0.35, eyeY - eyeRadiusY * 0.35, eyeRadiusX * 0.38, eyeRadiusY * 0.32, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Secondary Soft Catchlight
        ctx.beginPath();
        ctx.ellipse(eyeX + eyeRadiusX * 0.28, eyeY + eyeRadiusY * 0.28, eyeRadiusX * 0.18, eyeRadiusY * 0.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      });

      // 8. WARM EXPRESSIVE MOUTH / MICRO-EXPRESSION
      ctx.beginPath();
      const mouthY = eyeBaseY + baseR * 0.38;
      const mouthWidth = baseR * 0.28;

      if (curState === 'speaking') {
        // Interactive resonant speaking aperture
        const openH = baseR * (0.12 + curAmp * 0.16);
        ctx.ellipse(0, mouthY, mouthWidth * 0.8, openH, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        // Inner warm tongue/resonance
        ctx.beginPath();
        ctx.ellipse(0, mouthY + openH * 0.3, mouthWidth * 0.5, openH * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr}, ${rg}, ${rb}, 0.85)`;
        ctx.fill();
      } else {
        // Friendly gentle smile curve
        ctx.beginPath();
        ctx.arc(0, mouthY - mouthWidth * 0.4, mouthWidth * 0.75, 0.25 * Math.PI, 0.75 * Math.PI);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = curState === 'muted' ? '#64748B' : `rgba(${Math.max(0, cr - 20)}, ${Math.max(0, cg - 20)}, ${Math.max(0, cb - 20)}, 0.85)`;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 9. SOFT GLASS RIM SPECULARITY (Final Surface Finish)
      const rimGlossGrad = ctx.createLinearGradient(-baseR * 0.7, -baseR * 0.7, baseR * 0.7, baseR * 0.7);
      rimGlossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      rimGlossGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      rimGlossGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
      rimGlossGrad.addColorStop(1, `rgba(${rr}, ${rg}, ${rb}, 0.3)`);

      ctx.beginPath();
      ctx.ellipse(0, 0, baseR + deformX, baseR - deformY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = rimGlossGrad;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Muted strike-through if muted
      if (curState === 'muted') {
        ctx.beginPath();
        ctx.moveTo(-baseR * 0.7, baseR * 0.7);
        ctx.lineTo(baseR * 0.7, -baseR * 0.7);
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.restore();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [size]);

  const currentSpectrum = MOOD_SPECTRA[mood] || MOOD_SPECTRA.sereno;

  return (
    <div className="flex flex-col items-center justify-center select-none relative" style={{ width: size, height: size + (showMoodBadge ? 34 : 0) }}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="touch-none"
        aria-label={`Avatar cinemático VEYA en estado ${state}, humor ${mood}`}
      />

      {showMoodBadge && (
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#16202A]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor:
                state === 'muted'
                  ? '#E11D48'
                  : `rgb(${currentSpectrum.sssColor.join(',')})`,
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-['Nunito_Sans']">
            {state} · {currentSpectrum.label}
          </span>
        </div>
      )}
    </div>
  );
};
