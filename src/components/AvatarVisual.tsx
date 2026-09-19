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
}

/**
 * AvatarVisual (Pixar / Disney 3D Volumetric Edition)
 * Provides organic breathing, dynamic subsurface light scattering,
 * sentient ambient particles, and responsive Pixar-style expressions.
 */
export const AvatarVisual: React.FC<AvatarVisualProps> = ({
  state,
  mood,
  size = 180,
  reducedMotion = false,
  amplitude = 0.5,
  showStatusLabel = false,
}) => {
  return (
    <CinematicAvatarCanvas
      state={state}
      mood={mood}
      size={size}
      reducedMotion={reducedMotion}
      amplitude={amplitude}
      showMoodBadge={showStatusLabel}
    />
  );
};
