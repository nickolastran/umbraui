import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color } from 'three';
import type { Points } from 'three';
import { seeded } from '../hero-scene/HeroScene.scene';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps } from '../stage/types';

interface Props extends SceneBaseProps {
  count?: number;
  speed: number;
}

function Field({ colors, quality, pointer, count, speed }: Omit<Props, 'active' | 'onReady'>) {
  const points = useRef<Points>(null);
  const total = Math.min(count ?? detail(quality, 500, 1400, 3200), 6000);
  const [positions, tints] = useMemo(() => {
    const rand = seeded(11);
    const p = new Float32Array(total * 3);
    const c = new Float32Array(total * 3);
    const a = new Color(colors.accentText);
    const b = new Color(colors.neon);
    const mix = new Color();
    for (let i = 0; i < total; i++) {
      p.set([(rand() - 0.5) * 16, (rand() - 0.5) * 9, (rand() - 0.5) * 8], i * 3);
      mix.copy(a).lerp(b, rand());
      c.set([mix.r, mix.g, mix.b], i * 3);
    }
    return [p, c];
  }, [total, colors.accentText, colors.neon]);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    const p = points.current;
    if (!p) return;
    p.rotation.y += step * 0.03 * speed;
    p.rotation.x += (pointer.current.y * 0.12 - p.rotation.x) * step * 1.5;
    p.position.x += (pointer.current.x * 0.4 - p.position.x) * step * 1.5;
  });

  return (
    <points ref={points} key={total}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[tints, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.045} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

export default function ParticleFieldImpl({ active, quality, onReady, colors, ...rest }: Props) {
  return (
    <SceneCanvas active={active} quality={quality} onReady={onReady} camera={{ position: [0, 0, 7], fov: 50 }}>
      <fog attach="fog" args={[colors.bg, 5, 12]} />
      <Field colors={colors} quality={quality} {...rest} />
    </SceneCanvas>
  );
}
