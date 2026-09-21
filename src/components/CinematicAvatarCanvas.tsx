import React, { useEffect, useRef } from 'react';
import { AvatarState, AvatarMood } from '../types';

export interface CinematicAvatarCanvasProps {
  state: AvatarState;
  mood: AvatarMood;
  size?: number;
  reducedMotion?: boolean;
  amplitude?: number; // 0.0 to 1.0 (microphone RMS level)
  showMoodBadge?: boolean;
  stageMode?: 'obsidian' | 'claridad';
  showFloorShadow?: boolean;
  showAtmosphere?: boolean;
  interactiveGaze?: boolean; // Follow pointer/touch with 2.5D head parallax
  enableBlinking?: boolean; // Periodic organic blinking & micro-blinks
  enableTapSquish?: boolean; // Haptic spring squash & sparkle burst on click/touch
  onTap?: () => void;
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

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: [number, number, number];
}

// Mood optical palette: Subsurface Scattering (SSS) hues, specular highlights, and aura rim lights
export const MOOD_SPECTRA: Record<
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
  interactiveGaze = true,
  enableBlinking = true,
  enableTapSquish = true,
  onTap,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Gaze target tracking references (normalized -1.0 to 1.0)
  const targetGazeRef = useRef<{ x: number; y: number; active: boolean; lastActivityTime: number }>({
    x: 0,
    y: 0,
    active: false,
    lastActivityTime: 0,
  });

  // Tap squish trigger reference
  const tapSquishTriggerRef = useRef<boolean>(false);

  // Maintain state references for the continuous 60fps render loop
  const propsRef = useRef({
    state,
    mood,
    reducedMotion,
    amplitude,
    size,
    stageMode,
    showFloorShadow,
    showAtmosphere,
    interactiveGaze,
    enableBlinking,
    enableTapSquish,
  });

  useEffect(() => {
    propsRef.current = {
      state,
      mood,
      reducedMotion,
      amplitude,
      size,
      stageMode,
      showFloorShadow,
      showAtmosphere,
      interactiveGaze,
      enableBlinking,
      enableTapSquish,
    };
  }, [
    state,
    mood,
    reducedMotion,
    amplitude,
    size,
    stageMode,
    showFloorShadow,
    showAtmosphere,
    interactiveGaze,
    enableBlinking,
    enableTapSquish,
  ]);

  // Pointer event handlers for interactive gaze and squish
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!propsRef.current.interactiveGaze || propsRef.current.reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize between -1.0 and 1.0 with soft dampening
    const rawX = (e.clientX - centerX) / (rect.width * 0.7);
    const rawY = (e.clientY - centerY) / (rect.height * 0.7);

    targetGazeRef.current = {
      x: Math.max(-1, Math.min(1, rawX)),
      y: Math.max(-1, Math.min(1, rawY)),
      active: true,
      lastActivityTime: performance.now(),
    };
  };

  const handlePointerLeave = () => {
    targetGazeRef.current.active = false;
  };

  const handlePointerDown = () => {
    if (propsRef.current.enableTapSquish) {
      tapSquishTriggerRef.current = true;
    }
    onTap?.();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-density retina support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Initialize organic ambient floating particles (spores / light dust)
    const particleCount = 28;
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

    // Sparkle burst particles on tap
    let burstParticles: BurstParticle[] = [];

    // Internal dynamic state variables
    let time = 0;

    // Smooth color interpolation vectors (starting at current mood)
    const initialSpectrum = MOOD_SPECTRA[mood] || MOOD_SPECTRA.sereno;
    const animColors = {
      core: [...initialSpectrum.coreColor] as [number, number, number],
      sss: [...initialSpectrum.sssColor] as [number, number, number],
      rim: [...initialSpectrum.ambientRim] as [number, number, number],
      part: [...initialSpectrum.particleHue] as [number, number, number],
    };

    // Gaze interpolation values
    let currentGazeX = 0;
    let currentGazeY = 0;

    // Procedural blinking engine
    let blinkTimer = 0;
    let nextBlinkDuration = 3.6 + Math.random() * 1.8; // seconds
    let isBlinking = false;
    let blinkProgress = 0;

    // Tap squish physics
    let squishOffset = 0;
    let squishVelocity = 0;
    let happySquintTimer = 0; // seconds

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      const {
        state: curState,
        mood: curMood,
        reducedMotion: isReduced,
        amplitude: curAmp,
        size: curSize,
        stageMode: curStage,
        showFloorShadow: hasFloorShadow,
        showAtmosphere: hasAtmosphere,
        interactiveGaze: hasInteractiveGaze,
        enableBlinking: hasBlinking,
      } = propsRef.current;

      const targetSpectrum = MOOD_SPECTRA[curMood] || MOOD_SPECTRA.sereno;

      // 1. SMOOTH COLOR LERPING (Silky emotional aura shifts)
      const colorLerpRate = isReduced ? 0.3 : 0.075;
      for (let c = 0; c < 3; c++) {
        animColors.core[c] += (targetSpectrum.coreColor[c] - animColors.core[c]) * colorLerpRate;
        animColors.sss[c] += (targetSpectrum.sssColor[c] - animColors.sss[c]) * colorLerpRate;
        animColors.rim[c] += (targetSpectrum.ambientRim[c] - animColors.rim[c]) * colorLerpRate;
        animColors.part[c] += (targetSpectrum.particleHue[c] - animColors.part[c]) * colorLerpRate;
      }

      const cr = Math.round(animColors.core[0]);
      const cg = Math.round(animColors.core[1]);
      const cb = Math.round(animColors.core[2]);

      const sr = Math.round(animColors.sss[0]);
      const sg = Math.round(animColors.sss[1]);
      const sb = Math.round(animColors.sss[2]);

      const rr = Math.round(animColors.rim[0]);
      const rg = Math.round(animColors.rim[1]);
      const rb = Math.round(animColors.rim[2]);

      const pr = Math.round(animColors.part[0]);
      const pg = Math.round(animColors.part[1]);
      const pb = Math.round(animColors.part[2]);

      if (!isReduced) {
        time += dt * 1.7;
      }

      // 2. TAP SQUISH PHYSICS UPDATE
      if (tapSquishTriggerRef.current) {
        tapSquishTriggerRef.current = false;
        squishVelocity = -0.38;
        happySquintTimer = 0.65;

        // Spawn burst particles around center
        const cx = curSize / 2;
        const cy = curSize / 2;
        const burstCount = 14;
        for (let b = 0; b < burstCount; b++) {
          const angle = (b / burstCount) * Math.PI * 2 + Math.random() * 0.2;
          const speed = Math.random() * 85 + 45;
          burstParticles.push({
            x: cx + Math.cos(angle) * (curSize * 0.22),
            y: cy + Math.sin(angle) * (curSize * 0.22),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2.5 + 1.2,
            alpha: 1.0,
            decay: Math.random() * 1.2 + 1.4,
            color: [sr, sg, sb],
          });
        }
      }

      // Spring physics integration
      squishOffset += squishVelocity * dt * 60;
      squishVelocity += (-squishOffset * 0.18 - squishVelocity * 0.14) * dt * 60;

      if (happySquintTimer > 0) {
        happySquintTimer = Math.max(0, happySquintTimer - dt);
      }

      // 3. PROCEDURAL BLINKING GENERATOR
      let blinkScaleY = 1.0;
      if (hasBlinking && !isReduced && curState !== 'muted') {
        blinkTimer += dt;
        if (!isBlinking && blinkTimer >= nextBlinkDuration) {
          isBlinking = true;
          blinkTimer = 0;
          blinkProgress = 0;
        }

        if (isBlinking) {
          blinkProgress += dt / 0.15; // 150ms blink cycle
          if (blinkProgress < 0.4) {
            // Quick close
            blinkScaleY = Math.max(0.04, 1.0 - (blinkProgress / 0.4) * 0.96);
          } else if (blinkProgress < 1.0) {
            // Smooth open
            const openFactor = (blinkProgress - 0.4) / 0.6;
            blinkScaleY = 0.04 + openFactor * 0.96;
          } else {
            isBlinking = false;
            // Schedule next blink randomly (3.0s to 5.2s, shorter if thinking)
            nextBlinkDuration = curState === 'thinking' ? 2.5 + Math.random() * 1.5 : 3.5 + Math.random() * 2.0;
            blinkScaleY = 1.0;
          }
        }
      }

      // Happy squint overrides/combines with blink
      if (happySquintTimer > 0) {
        const squintRatio = Math.sin((happySquintTimer / 0.65) * Math.PI);
        blinkScaleY = Math.min(blinkScaleY, Math.max(0.12, 1.0 - squintRatio * 0.88));
      }

      // 4. GAZE TRACKING INTERPOLATION
      let targetX = 0;
      let targetY = 0;

      if (hasInteractiveGaze && !isReduced && targetGazeRef.current.active) {
        targetX = targetGazeRef.current.x;
        targetY = targetGazeRef.current.y;
      } else if (!isReduced) {
        // Ambient natural micro-saccades
        targetX = Math.sin(time * 0.35) * 0.12;
        targetY = Math.cos(time * 0.28) * 0.08;
      }

      // State specific gaze bias
      if (curState === 'thinking') {
        targetY -= 0.35; // Contemplative upward gaze
        targetX += 0.18;
      } else if (curState === 'listening') {
        targetY -= 0.15; // Attentive forward gaze
      } else if (curState === 'muted') {
        targetY += 0.3;  // Downcast rest gaze
      }

      const gazeLerpRate = isReduced ? 1.0 : 0.09;
      currentGazeX += (targetX - currentGazeX) * gazeLerpRate;
      currentGazeY += (targetY - currentGazeY) * gazeLerpRate;

      // 5. CANVAS CLEAR & METRICS
      ctx.clearRect(0, 0, curSize, curSize);

      const cx = curSize / 2;
      const cy = curSize / 2;

      // Dynamic respiration
      const breathWave = Math.sin(time * 1.8);
      const secondaryWave = Math.cos(time * 2.4);

      let stateScale = 1.0;
      let auraAlpha = 0.35;
      let eyeSquint = 1.0;
      let eyeGazeOffsetY = currentGazeY * 6;
      let eyeGazeOffsetX = currentGazeX * 8;

      if (curState === 'idle') {
        stateScale = 1.0 + (isReduced ? 0 : breathWave * 0.024);
        auraAlpha = 0.35 + (isReduced ? 0 : breathWave * 0.08);
      } else if (curState === 'listening') {
        stateScale = 1.05 + (isReduced ? 0 : Math.sin(time * 3.5) * 0.035);
        auraAlpha = 0.58;
        eyeSquint = 1.15;
      } else if (curState === 'thinking') {
        stateScale = 0.98 + (isReduced ? 0 : Math.sin(time * 4) * 0.02);
        auraAlpha = 0.48;
        eyeSquint = 0.92;
      } else if (curState === 'speaking') {
        const audioPulse = curAmp * 0.14;
        stateScale = 1.02 + audioPulse + (isReduced ? 0 : Math.sin(time * 6) * 0.035);
        auraAlpha = 0.6 + curAmp * 0.32;
        eyeSquint = 1.05 + curAmp * 0.1;
      } else if (curState === 'muted') {
        stateScale = 0.94;
        auraAlpha = 0.14;
        eyeSquint = 0.72;
      }

      // Base radius with squish & stretch deformation
      const baseR = curSize * 0.28 * stateScale;
      const squishScaleX = 1 - squishOffset * 0.45;
      const squishScaleY = 1 + squishOffset * 0.65;

      // 6. STAGE AMBIENT BACKDROP IN CLARIDAD MODE
      if (curStage === 'claridad') {
        const stageGlow = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, curSize * 0.55);
        stageGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        stageGlow.addColorStop(0.6, 'rgba(241, 245, 249, 0.25)');
        stageGlow.addColorStop(1, 'rgba(241, 245, 249, 0)');
        ctx.fillStyle = stageGlow;
        ctx.fillRect(0, 0, curSize, curSize);
      }

      // 7. VOLUMETRIC BACKLIGHT & SUBSURFACE GLOW
      const auraGrad = ctx.createRadialGradient(cx, cy, baseR * 0.4, cx, cy, baseR * 2.3);
      auraGrad.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, ${auraAlpha * 0.85})`);
      auraGrad.addColorStop(0.45, `rgba(${cr}, ${cg}, ${cb}, ${auraAlpha * 0.4})`);
      auraGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 2.3, 0, Math.PI * 2);
      ctx.fill();

      // 8. AMBIENT PARTICLES (Disney dust motes)
      if (hasAtmosphere && !isReduced && curState !== 'muted') {
        particles.forEach((p) => {
          p.angle += p.orbitSpeed;
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.angle) * 0.2;

          if (p.y < 0) p.y = curSize;
          if (p.y > curSize) p.y = 0;
          if (p.x < 0) p.x = curSize;
          if (p.x > curSize) p.x = 0;

          const pAlpha = p.alpha * Math.sin(time * 2 + p.angle) * 0.5 + 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${pAlpha * 0.55})`;
          ctx.shadowColor = `rgba(${sr}, ${sg}, ${sb}, 0.55)`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 9. TAP BURST PARTICLES
      if (burstParticles.length > 0) {
        burstParticles = burstParticles.filter((bp) => {
          bp.x += bp.vx * dt;
          bp.y += bp.vy * dt;
          bp.alpha -= bp.decay * dt;
          if (bp.alpha <= 0) return false;

          ctx.beginPath();
          ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${bp.color[0]}, ${bp.color[1]}, ${bp.color[2]}, ${bp.alpha})`;
          ctx.shadowColor = `rgba(255, 255, 255, ${bp.alpha * 0.8})`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          return true;
        });
      }

      // 10. ACOUSTIC RIPPLES (Listening / Speaking)
      if ((curState === 'listening' || (curState === 'speaking' && curAmp > 0.3)) && !isReduced) {
        for (let ring = 1; ring <= 2; ring++) {
          const ringProgress = (time * 0.85 + ring * 0.5) % 1;
          const ringR = baseR * (1.1 + ringProgress * 0.75);
          const ringAlpha = (1 - ringProgress) * (curState === 'speaking' ? 0.6 : 0.45);

          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${ringAlpha})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }
      }

      // 11. 3D STAGE FLOOR CONTACT SHADOW
      const floatY = isReduced ? 0 : Math.sin(time * 1.5) * 4;
      if (hasFloorShadow) {
        const floorY = cy + baseR * 1.05;
        const shadowScaleX = Math.max(0.7, 1.0 - floatY * 0.035) * squishScaleX;
        const shadowScaleY = Math.max(0.65, 1.0 - floatY * 0.05);
        const shadowAlpha =
          curStage === 'claridad'
            ? Math.max(0.08, 0.22 - floatY * 0.015)
            : Math.max(0.15, 0.42 - floatY * 0.02);

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

      // 12. 3D SPHERICAL BODY (Pixar Pearl with 2.5D Head Parallax Tilt)
      const deformX = isReduced ? 0 : breathWave * 3.5;
      const deformY = isReduced ? 0 : secondaryWave * 3.5;

      ctx.save();
      // Apply center position, vertical float, head parallax offset and squish
      const headOffsetY = (isReduced ? 0 : floatY) + currentGazeY * 3;
      const headOffsetX = currentGazeX * 4;
      ctx.translate(cx + headOffsetX, cy + headOffsetY);
      ctx.scale(squishScaleX, squishScaleY);

      // Body Drop Shadow
      ctx.shadowColor = `rgba(0, 15, 35, 0.45)`;
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;

      // Base Body Contour
      ctx.beginPath();
      ctx.ellipse(0, 0, baseR + deformX, baseR - deformY, 0, 0, Math.PI * 2);

      // Multi-stop 3D sphere gradient simulating Pixar frosted porcelain + subsurface scattering
      // Light key position shifts subtly with gaze angle for dynamic specular response
      const keyLightX = -baseR * 0.32 + currentGazeX * (baseR * 0.12);
      const keyLightY = -baseR * 0.38 + currentGazeY * (baseR * 0.12);

      const bodyGrad = ctx.createRadialGradient(keyLightX, keyLightY, baseR * 0.08, 0, 0, baseR * 1.18);
      bodyGrad.addColorStop(0, '#FFFFFF'); // Specular keylight highlight
      bodyGrad.addColorStop(0.24, `rgb(${rr}, ${rg}, ${rb})`); // Translucent rim
      bodyGrad.addColorStop(0.64, `rgb(${sr}, ${sg}, ${sb})`); // Subsurface scattered glow
      bodyGrad.addColorStop(0.92, `rgb(${cr}, ${cg}, ${cb})`); // Core body shadow
      bodyGrad.addColorStop(
        1.0,
        `rgba(${Math.max(0, cr - 35)}, ${Math.max(0, cg - 35)}, ${Math.max(0, cb - 35)}, 0.95)`
      );

      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for inner facial features

      // 13. INTERNAL BIOLUMINESCENT CORE (Soul heartbeat)
      const corePulse = isReduced
        ? 1
        : 1 + Math.sin(time * 3.2) * (curState === 'speaking' ? 0.22 : 0.08);
      const coreParallaxX = currentGazeX * (baseR * 0.08);
      const coreParallaxY = baseR * 0.1 + currentGazeY * (baseR * 0.08);

      const innerCoreGrad = ctx.createRadialGradient(
        coreParallaxX,
        coreParallaxY,
        0,
        coreParallaxX,
        coreParallaxY,
        baseR * 0.55 * corePulse
      );
      innerCoreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      innerCoreGrad.addColorStop(0.4, `rgba(${sr}, ${sg}, ${sb}, 0.5)`);
      innerCoreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = innerCoreGrad;
      ctx.beginPath();
      ctx.arc(coreParallaxX, coreParallaxY, baseR * 0.55 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 14. EXPRESSIVE PIXAR EYES (Curious, glassy, with procedural blink & gaze)
      const eyeSpacing = baseR * 0.42;
      const eyeBaseY = -baseR * 0.1 + eyeGazeOffsetY;
      const eyeRadiusX = baseR * 0.14 * eyeSquint;
      const eyeRadiusY = Math.max(0.5, baseR * 0.19 * (curState === 'thinking' ? 0.86 : 1.0) * blinkScaleY);

      // Render Left & Right Eyes with Disney Depth
      [-1, 1].forEach((dir) => {
        const eyeX = dir * eyeSpacing + eyeGazeOffsetX;
        const eyeY = eyeBaseY;

        // A. Eye Socket Soft Ambient Glow
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, eyeRadiusX * 1.35, Math.max(1, eyeRadiusY * 1.35), 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, 0.28)`;
        ctx.fill();

        // B. Pupil Cornea (Deep Sapphire Obsidian)
        ctx.beginPath();
        ctx.ellipse(eyeX, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = curState === 'muted' ? '#334155' : '#0B1522';
        ctx.fill();

        // C. Iris Inner Bioluminescence (Only visible when eyes are open)
        if (curState !== 'muted' && blinkScaleY > 0.25) {
          ctx.beginPath();
          ctx.ellipse(eyeX, eyeY + 1, eyeRadiusX * 0.72, eyeRadiusY * 0.72, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, 0.65)`;
          ctx.fill();
        }

        // D. Primary Specular Catchlight (Star Glint that tracks gaze)
        if (blinkScaleY > 0.35) {
          const catchX = eyeX - eyeRadiusX * 0.35 + currentGazeX * 1.5;
          const catchY = eyeY - eyeRadiusY * 0.35 + currentGazeY * 1.5;

          ctx.beginPath();
          ctx.ellipse(catchX, catchY, eyeRadiusX * 0.38, eyeRadiusY * 0.32, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Secondary Soft Catchlight
          ctx.beginPath();
          ctx.ellipse(
            eyeX + eyeRadiusX * 0.28,
            eyeY + eyeRadiusY * 0.28,
            eyeRadiusX * 0.18,
            eyeRadiusY * 0.18,
            0,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fill();
        }

        // E. ORGANIC PIXAR EYEBROWS (Delicate, emotive arched brows)
        if (curState !== 'muted') {
          // Brow height & slant per state/mood
          let browLift = 0;
          let browTilt = 0;

          if (curState === 'thinking') {
            // Asymmetric eyebrow lift (Pixar curiosity)
            browLift = dir === 1 ? -6 : 1;
            browTilt = dir === 1 ? -0.15 : 0.08;
          } else if (curState === 'listening') {
            browLift = -4;
            browTilt = dir * 0.12; // Inward attentive slant
          } else if (curState === 'speaking') {
            browLift = -3 + Math.sin(time * 5) * 2;
          } else if (curMood === 'animado') {
            browLift = -5;
          } else if (curMood === 'empatico') {
            browTilt = -dir * 0.1;
          }

          const browY = eyeBaseY - eyeRadiusY * 1.25 + browLift;
          const browWidth = eyeRadiusX * 1.5;

          ctx.save();
          ctx.translate(eyeX, browY);
          ctx.rotate(browTilt);

          ctx.beginPath();
          ctx.arc(0, 0, browWidth * 0.8, Math.PI * 1.15, Math.PI * 1.85);
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, 0.75)`;
          ctx.lineWidth = 2.0;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.restore();
        }
      });

      // 15. EXPRESSIVE MOUTH / ORAL RESONANCE
      const mouthY = eyeBaseY + baseR * 0.38;
      const mouthWidth = baseR * 0.28;

      if (curState === 'speaking') {
        // Resonant speaking aperture modulated by RMS amplitude
        const openH = baseR * (0.12 + curAmp * 0.18);
        ctx.beginPath();
        ctx.ellipse(eyeGazeOffsetX * 0.5, mouthY, mouthWidth * 0.82, openH, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();

        // Inner warm resonance / tongue glow
        ctx.beginPath();
        ctx.ellipse(eyeGazeOffsetX * 0.5, mouthY + openH * 0.3, mouthWidth * 0.52, openH * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr}, ${rg}, ${rb}, 0.88)`;
        ctx.fill();
      } else {
        // Gentle smile curve
        const smileArch = happySquintTimer > 0 ? 0.9 : curMood === 'animado' ? 0.75 : 0.45;
        ctx.beginPath();
        ctx.arc(
          eyeGazeOffsetX * 0.5,
          mouthY - mouthWidth * 0.4,
          mouthWidth * smileArch,
          0.25 * Math.PI,
          0.75 * Math.PI
        );
        ctx.lineWidth = happySquintTimer > 0 ? 3.0 : 2.5;
        ctx.strokeStyle =
          curState === 'muted'
            ? '#64748B'
            : `rgba(${Math.max(0, cr - 20)}, ${Math.max(0, cg - 20)}, ${Math.max(0, cb - 20)}, 0.85)`;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 16. SOFT GLASS RIM SPECULARITY
      const rimGlossGrad = ctx.createLinearGradient(
        -baseR * 0.7,
        -baseR * 0.7,
        baseR * 0.7,
        baseR * 0.7
      );
      rimGlossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      rimGlossGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      rimGlossGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
      rimGlossGrad.addColorStop(1, `rgba(${rr}, ${rg}, ${rb}, 0.35)`);

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

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [size]);

  const currentSpectrum = MOOD_SPECTRA[mood] || MOOD_SPECTRA.sereno;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={`flex flex-col items-center justify-center select-none relative ${
        enableTapSquish ? 'cursor-pointer active:scale-98 transition-transform' : ''
      }`}
      style={{ width: size, height: size + (showMoodBadge ? 34 : 0) }}
      title={enableTapSquish ? 'Toca a VEYA para interactuar (Squish táctil & destellos)' : undefined}
    >
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
