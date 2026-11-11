import type { MutableRefObject, ReactNode } from 'react';
import type { ReducedMotionSetting } from '../../utils/reduced-motion';

/** Rendering budget. Controls device-pixel-ratio cap, antialiasing and geometry / particle counts. */
export type Quality = 'low' | 'medium' | 'high';

/** Props shared by every 3D component. */
export interface Scene3DProps {
  /** Rendering budget: DPR cap 1 / 1.5 / 2 and proportionally fewer or more polygons and particles. @default "medium" */
  quality?: Quality;
  /** Replaces the built-in static fallback shown when WebGL is unavailable, the scene fails to load, or motion is reduced. */
  fallback?: ReactNode;
  /** Reduced-motion override. Under reduced motion the static fallback is rendered instead of the scene. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Theme colours resolved from the active tokens, as strings three.js can parse. */
export interface SceneColors {
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  neon: string;
}

/** Pointer position over the stage, normalised to -1…1 on both axes (y up). */
export type StagePointer = MutableRefObject<{ x: number; y: number }>;

/** Props every lazy scene implementation receives from the stage. */
export interface SceneBaseProps {
  /** `false` while offscreen or in a hidden tab: the render loop must stop. */
  active: boolean;
  quality: Quality;
  colors: SceneColors;
  pointer: StagePointer;
  /** Call once the first frame is on screen so the placeholder can be removed. */
  onReady: () => void;
}
