import React from 'react';
import { AvatarState, AvatarMood } from '../types';
import { CinematicAvatarCanvas } from './CinematicAvatarCanvas';

interface AvatarVisualProps {
  state: AvatarState;
  mood: AvatarMood;
  size?: number;
  reducedMotion?: boolean;
  amplitude?: number;
  showStatusLabel?: boolean;
  interactiveGaze?: boolean;
  enableBlinking?: boolean;
  enableTapSquish?: boolean;
  onTap?: () => void;
}

/**
 * AvatarVisual (Pixar / Disney 3D Volumetric Edition)
 * Provides organic breathing, dynamic subsurface light scattering,
 * sentient ambient particles, interactive 2.5D gaze tracking,
 * procedural blinking, and responsive Pixar-style expressions.
 */
export const AvatarVisual: React.FC<AvatarVisualProps> = ({
  state,
  mood,
  size = 180,
  reducedMotion = false,
  amplitude = 0.5,
  showStatusLabel = false,
  interactiveGaze = true,
  enableBlinking = true,
  enableTapSquish = true,
  onTap,
}) => {
  return (
    <CinematicAvatarCanvas
      state={state}
      mood={mood}
      size={size}
      reducedMotion={reducedMotion}
      amplitude={amplitude}
      showMoodBadge={showStatusLabel}
      interactiveGaze={interactiveGaze}
      enableBlinking={enableBlinking}
      enableTapSquish={enableTapSquish}
      onTap={onTap}
    />
  );
};
