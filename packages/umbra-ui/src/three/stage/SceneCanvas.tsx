import { Canvas } from '@react-three/fiber';
import type { ComponentProps, ReactNode } from 'react';
import type { Quality } from './types';

const DPR: Record<Quality, number | [number, number]> = { low: 1, medium: [1, 1.5], high: [1, 2] };

interface SceneCanvasProps {
  active: boolean;
  /** Scene has nothing animating on its own: render only when something invalidates. */
  idle?: boolean;
  quality: Quality;
  onReady: () => void;
  camera?: ComponentProps<typeof Canvas>['camera'];
  children: ReactNode;
}

/**
 * The one place a WebGL canvas is created. Enforces the library's performance rules: capped DPR, render loop
 * stopped while offscreen/hidden, on-demand rendering for idle scenes. React Three Fiber disposes geometries,
 * materials and the renderer when the canvas unmounts.
 */
export function SceneCanvas({ active, idle = false, quality, onReady, camera, children }: SceneCanvasProps) {
  return (
    <Canvas
      className="umbra-stage__canvas"
      dpr={DPR[quality]}
      frameloop={!active ? 'never' : idle ? 'demand' : 'always'}
      gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      camera={camera}
      resize={{ debounce: 120 }}
      onCreated={() => onReady()}
    >
      {children}
    </Canvas>
  );
}

/** Geometry detail per quality level. */
export const detail = <T,>(quality: Quality, low: T, medium: T, high: T): T => (quality === 'low' ? low : quality === 'high' ? high : medium);
