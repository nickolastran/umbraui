import { Center, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Box3, Vector3 } from 'three';
import type { Group } from 'three';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps, SceneColors, Quality } from '../stage/types';

export interface ModelView {
  /** Radians around the vertical axis. */
  rotY: number;
  /** Radians around the horizontal axis. */
  rotX: number;
  /** 1 = default distance; larger is closer. */
  zoom: number;
}

interface Props extends SceneBaseProps {
  view: ModelView;
  spinning: boolean;
  /** Skip easing: under reduced motion the model snaps to the requested view. */
  instant: boolean;
  src?: string;
  model?: ReactNode;
}

function Gltf({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  // Normalise any model to roughly 2.6 units so the default camera frames it.
  const scale = useMemo(() => {
    const size = new Box3().setFromObject(scene).getSize(new Vector3());
    return 2.6 / Math.max(size.x, size.y, size.z, 0.001);
  }, [scene]);
  return (
    <Center scale={scale}>
      <primitive object={scene} />
    </Center>
  );
}

function DefaultModel({ colors, quality }: { colors: SceneColors; quality: Quality }) {
  return (
    <mesh>
      <torusKnotGeometry args={[0.75, 0.26, detail(quality, 96, 160, 256), detail(quality, 16, 24, 32)]} />
      <meshPhysicalMaterial color={colors.accent} roughness={0.3} metalness={0.1} clearcoat={1} clearcoatRoughness={0.2} />
    </mesh>
  );
}

function Rig({ view, spinning, instant, children }: Pick<Props, 'view' | 'spinning' | 'instant'> & { children: ReactNode }) {
  const group = useRef<Group>(null);
  const spin = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  // The loop is on-demand while not spinning: a new view must request a frame.
  useEffect(() => invalidate(), [view, invalidate]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const step = instant ? 1 : Math.min(dt, 0.05) * 8;
    if (spinning) spin.current += Math.min(dt, 0.05) * 0.5;
    const dy = view.rotY + spin.current - g.rotation.y;
    const dx = view.rotX - g.rotation.x;
    const dz = 5 / view.zoom - camera.position.z;
    g.rotation.y += dy * step;
    g.rotation.x += dx * step;
    camera.position.z += dz * step;
    if (!spinning && Math.abs(dy) + Math.abs(dx) + Math.abs(dz) > 0.001) state.invalidate();
  });
  return <group ref={group}>{children}</group>;
}

export default function ModelViewerImpl({ active, quality, onReady, colors, view, spinning, instant, src, model }: Props) {
  return (
    <SceneCanvas active={active} idle={!spinning} quality={quality} onReady={onReady} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} color={colors.text} intensity={2.2} />
      <pointLight position={[-4, -2, 2]} color={colors.neon} intensity={30} />
      <pointLight position={[4, -3, -2]} color={colors.accentText} intensity={30} />
      <Rig view={view} spinning={spinning} instant={instant}>
        <Suspense fallback={null}>{src ? <Gltf src={src} /> : (model ?? <DefaultModel colors={colors} quality={quality} />)}</Suspense>
      </Rig>
    </SceneCanvas>
  );
}
