import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color } from 'three';
import type { Group, ShaderMaterial } from 'three';
import { SceneCanvas, detail } from '../stage/SceneCanvas';
import type { SceneBaseProps } from '../stage/types';

/** A fixed pseudo-random sequence so server/client and re-renders agree and tests are stable. */
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

// The corona is one quad with a procedural glow: a bright limb at the body's silhouette and a soft, slowly
// breathing falloff outside it. One draw call, no textures, no post-processing.
const coronaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const coronaFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uInner;
  uniform vec3 uOuter;
  uniform float uRadius;
  uniform float uTime;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);
    float d = max(r - uRadius, 0.0);
    float rays = 0.8 + 0.2 * sin(a * 5.0 + uTime * 0.25) * sin(a * 9.0 - uTime * 0.17);
    float glow = exp(-d * 11.0 / rays);
    float limb = smoothstep(0.014, 0.0, abs(r - uRadius - 0.003));
    vec3 color = mix(uInner, uOuter, smoothstep(0.0, 0.22, d));
    float alpha = clamp(glow * 0.6 + limb, 0.0, 1.0) * smoothstep(0.5, 0.36, r);
    gl_FragColor = vec4(color, alpha);
  }
`;
const PLANE = 10;
const BODY = 1.5;
const CAMERA_Z = 6.5;
const CORONA_Z = -0.6;
// Radius of the body's silhouette where the view cone meets the corona plane, in the plane's UV units.
const SILHOUETTE = ((CAMERA_Z - CORONA_Z) * Math.tan(Math.asin(BODY / CAMERA_Z))) / PLANE;

function Eclipse({ colors, quality, pointer }: Pick<SceneBaseProps, 'colors' | 'quality' | 'pointer'>) {
  const rig = useRef<Group>(null);
  const corona = useRef<ShaderMaterial>(null);
  const segments = detail(quality, 32, 48, 72);
  const uniforms = useMemo(
    () => ({ uInner: { value: new Color() }, uOuter: { value: new Color() }, uRadius: { value: SILHOUETTE }, uTime: { value: 0 } }),
    [],
  );
  uniforms.uInner.value.set(colors.accentText);
  uniforms.uOuter.value.set(colors.neon);

  const stars = useMemo(() => {
    const count = detail(quality, 250, 700, 1600);
    const rand = seeded(7);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 9;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi) - 6], i * 3);
    }
    return positions;
  }, [quality]);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    uniforms.uTime.value += step;
    if (rig.current) {
      // Turning the rig slides the body across its corona: the limb thickens on one side, like a diamond ring.
      rig.current.rotation.y += (pointer.current.x * 0.12 - rig.current.rotation.y) * step * 2;
      rig.current.rotation.x += (-pointer.current.y * 0.08 - rig.current.rotation.x) * step * 2;
    }
  });

  return (
    <group ref={rig}>
      <mesh position={[0, 0, CORONA_Z]}>
        <planeGeometry args={[PLANE, PLANE]} />
        <shaderMaterial ref={corona} vertexShader={coronaVertex} fragmentShader={coronaFragment} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* The umbra itself takes the page colour, so overlaid text keeps its contrast in both themes. */}
      <mesh>
        <sphereGeometry args={[BODY, segments, segments]} />
        <meshStandardMaterial color={colors.bg} roughness={0.7} metalness={0} />
      </mesh>
      <pointLight position={[2.4, 1.8, 2.2]} color={colors.neon} intensity={2.2} />
      <pointLight position={[-2.6, -1.4, 2.2]} color={colors.accentText} intensity={2.6} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color={colors.text} size={0.035} sizeAttenuation transparent opacity={0.55} />
      </points>
    </group>
  );
}

export default function HeroSceneImpl({ active, quality, colors, pointer, onReady }: SceneBaseProps) {
  return (
    <SceneCanvas active={active} quality={quality} onReady={onReady} camera={{ position: [0, 0, CAMERA_Z], fov: 42 }}>
      <fog attach="fog" args={[colors.bg, 7, 18]} />
      <ambientLight intensity={2.6} />
      <Eclipse colors={colors} quality={quality} pointer={pointer} />
    </SceneCanvas>
  );
}
