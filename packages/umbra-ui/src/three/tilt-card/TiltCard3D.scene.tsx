import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, PointLight } from 'three';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps } from '../stage/types';

function Depth({ colors, quality, pointer }: Pick<SceneBaseProps, 'colors' | 'quality' | 'pointer'>) {
  const near = useRef<Group>(null);
  const far = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const d = detail(quality, 0, 1, 2);

  // Layers at different depths shift by different amounts: that difference is the parallax.
  useFrame((state, dt) => {
    const step = Math.min(dt, 0.05) * 5;
    const { x, y } = pointer.current;
    let moving = 0;
    const ease = (g: Group | null, k: number) => {
      if (!g) return;
      const dx = x * k - g.position.x;
      const dy = y * k - g.position.y;
      g.position.x += dx * step;
      g.position.y += dy * step;
      g.rotation.y += (x * 0.5 - g.rotation.y) * step;
      g.rotation.x += (-y * 0.5 - g.rotation.x) * step;
      moving += Math.abs(dx) + Math.abs(dy);
    };
    ease(near.current, 0.55);
    ease(far.current, 0.2);
    light.current?.position.set(x * 3, y * 2, 2.2);
    // On-demand loop: keep rendering only until the layers settle.
    if (moving > 0.002) state.invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={light} position={[0, 0, 2.2]} color={colors.text} intensity={14} />
      <pointLight position={[-3, 2, 1]} color={colors.neon} intensity={10} />
      <group ref={far} position={[0, 0, -1.5]}>
        <mesh position={[1.9, 0.5, 0]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.9, 0.035, 12, detail(quality, 48, 72, 96)]} />
          <meshStandardMaterial color={colors.accentText} emissive={colors.accent} emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
      </group>
      <group ref={near}>
        <mesh position={[1.7, -0.3, 0.4]}>
          <icosahedronGeometry args={[0.62, d]} />
          <meshStandardMaterial color={colors.accent} roughness={0.25} metalness={0.5} flatShading />
        </mesh>
        <mesh position={[2.55, 0.75, 0]}>
          <octahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color={colors.neon} roughness={0.3} metalness={0.4} flatShading />
        </mesh>
      </group>
    </>
  );
}

export default function TiltCardImpl({ active, quality, onReady, colors, pointer }: SceneBaseProps) {
  return (
    <SceneCanvas active={active} idle quality={quality} onReady={onReady} camera={{ position: [0, 0, 5], fov: 40 }}>
      <Depth colors={colors} quality={quality} pointer={pointer} />
    </SceneCanvas>
  );
}
