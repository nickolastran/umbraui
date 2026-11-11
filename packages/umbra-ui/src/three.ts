// Light wrappers only. three.js, React Three Fiber and drei are imported exclusively by the lazy
// `*.scene.tsx` chunks, so importing from "umbra-ui/3d" never pulls WebGL code into first paint.
export type { Quality, Scene3DProps } from './three/stage/types';
export { detectWebGL } from './three/stage/webgl';
export * from './utils/reduced-motion';
export * from './three/hero-scene/HeroScene';
export * from './three/particle-field/ParticleField';
export * from './three/orb/Orb';
export * from './three/tilt-card/TiltCard3D';
export * from './three/model-viewer/ModelViewer';
export * from './three/logo-3d/Logo3D';
export { UMBRA_MARK } from './three/logo-3d/mark';
