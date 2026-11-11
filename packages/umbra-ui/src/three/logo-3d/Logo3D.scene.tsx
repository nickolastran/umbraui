import { Center, Float, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import { ExtrudeGeometry, REVISION } from 'three';
import type { Group } from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps } from '../stage/types';

interface Props extends SceneBaseProps {
  path: string;
  text?: string;
  font?: ComponentProps<typeof Text3D>['font'];
  depth: number;
}

function Mark({ path, depth, quality, color, emissive }: { path: string; depth: number; quality: Props['quality']; color: string; emissive: string }) {
  const geometry = useMemo(() => {
    const { paths } = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${path.replace(/"/g, '')}"/></svg>`);
    // three r185 moved SVG hole handling into ShapePath.toShapes() and deprecated SVGLoader.createShapes();
    // older releases (the peer range starts at r159) still need the loader's version.
    const shapes = paths.flatMap((p) => (Number(REVISION) >= 185 ? p.toShapes() : SVGLoader.createShapes(p)));
    const g = new ExtrudeGeometry(shapes, {
      depth: depth * 100,
      curveSegments: detail(quality, 12, 24, 40),
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelSegments: detail(quality, 1, 2, 4),
    });
    g.center();
    return g;
  }, [path, depth, quality]);
  return (
    // SVG's y axis points down; flip it. 0.026 maps the 100-unit box to ~2.6 world units.
    <mesh geometry={geometry} scale={[0.026, -0.026, 0.026]}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.25} roughness={0.22} metalness={0.7} />
    </mesh>
  );
}

function Sway({ pointer, children }: Pick<Props, 'pointer'> & { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const step = Math.min(dt, 0.05) * 3;
    g.rotation.y += (Math.sin(state.clock.elapsedTime * 0.5) * 0.45 + pointer.current.x * 0.5 - g.rotation.y) * step;
    g.rotation.x += (-pointer.current.y * 0.3 - g.rotation.x) * step;
  });
  return <group ref={group}>{children}</group>;
}

export default function Logo3DImpl({ active, quality, onReady, colors, pointer, path, text, font, depth }: Props) {
  return (
    <SceneCanvas active={active} quality={quality} onReady={onReady} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 5]} color={colors.text} intensity={2.4} />
      <pointLight position={[-3, -1, 2]} color={colors.neon} intensity={36} />
      <pointLight position={[3, 2, -1]} color={colors.accentText} intensity={36} />
      <Sway pointer={pointer}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
          {text && font ? (
            <Center>
              <Text3D font={font} size={1} height={depth * 2.6} curveSegments={detail(quality, 4, 8, 12)} bevelEnabled bevelSize={0.02} bevelThickness={0.03}>
                {text}
                <meshStandardMaterial color={colors.accentText} emissive={colors.accent} emissiveIntensity={0.25} roughness={0.22} metalness={0.7} />
              </Text3D>
            </Center>
          ) : (
            <Mark path={path} depth={depth} quality={quality} color={colors.accentText} emissive={colors.accent} />
          )}
        </Float>
      </Sway>
    </SceneCanvas>
  );
}
