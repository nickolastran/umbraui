import { MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps } from '../stage/types';

interface Props extends SceneBaseProps {
  tone: 'accent' | 'neon';
  hovered: boolean;
  pressed: boolean;
  disabled: boolean;
}

function Body({ colors, quality, pointer, tone, hovered, pressed, disabled }: Omit<Props, 'active' | 'onReady'>) {
  const mesh = useRef<Mesh>(null);
  const segments = detail(quality, 24, 48, 64);
  const color = disabled ? colors.muted : tone === 'neon' ? colors.neon : colors.accent;
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const step = Math.min(dt, 0.05);
    const target = pressed ? 0.88 : hovered ? 1.08 : 1;
    m.scale.setScalar(m.scale.x + (target - m.scale.x) * step * 12);
    m.rotation.y += step * (hovered ? 0.9 : 0.35);
    m.rotation.x += (-pointer.current.y * 0.4 - m.rotation.x) * step * 4;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, segments, segments]} />
      <MeshDistortMaterial color={color} roughness={0.3} metalness={0.1} distort={disabled ? 0 : hovered ? 0.42 : 0.26} speed={disabled ? 0 : hovered ? 3 : 1.6} />
    </mesh>
  );
}

export default function OrbImpl({ active, quality, onReady, colors, ...rest }: Props) {
  return (
    <SceneCanvas active={active} quality={quality} onReady={onReady} camera={{ position: [0, 0, 3.4], fov: 40 }}>
      <ambientLight intensity={1.3} />
      <pointLight position={[2.5, 2.5, 3]} color={colors.text} intensity={30} />
      <pointLight position={[-3, -2, 1]} color={colors.neon} intensity={24} />
      <Body colors={colors} quality={quality} {...rest} />
    </SceneCanvas>
  );
}
