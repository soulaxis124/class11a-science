import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Instrument palette — graphite base, sage/forest light, restrained gold. */
export const SAGE = "#9ec3ac";
export const FOREST = "#4f8767";
export const GOLD = "#c9a54e";
export const SILVER = "#d8dcd6";
export const OBSIDIAN = "#12140f";
/** Back-compat alias for older imports. */
export const CYAN = SAGE;
export const GREEN = FOREST;

export function NexusCanvas({
  children,
  cameraPosition = [0, 0, 8],
  fov = 50,
}: {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
}) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      dpr={mobile ? [1, 1.2] : [1, 1.6]}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: cameraPosition, fov }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.05} color={SILVER} />
      <directionalLight position={[-5, -3, -4]} intensity={0.45} color={FOREST} />
      <pointLight position={[0, 3, 4]} intensity={12} distance={18} color={GOLD} />
      {children}
    </Canvas>
  );
}

/** Soft parallax: the group leans toward the pointer with easing. */
export function PointerParallax({
  children,
  strength = 0.22,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y += (pointer.x * strength - ref.current.rotation.y) * 0.045;
    ref.current.rotation.x += (-pointer.y * strength - ref.current.rotation.x) * 0.045;
  });
  return <group ref={ref}>{children}</group>;
}

/** Smoothly eases the camera toward a target position (cinematic transitions). */
export function CameraRig({
  target = [0, 0, 8],
  lookAt = [0, 0, 0],
  speed = 0.035,
}: {
  target?: [number, number, number];
  lookAt?: [number, number, number];
  speed?: number;
}) {
  const vec = useMemo(() => new THREE.Vector3(...target), [target]);
  const look = useMemo(() => new THREE.Vector3(...lookAt), [lookAt]);
  useFrame(({ camera }) => {
    camera.position.lerp(vec, speed);
    camera.lookAt(look);
  });
  return null;
}

export function Starfield({ count = 700, radius = 26 }: { count?: number; radius?: number }) {
  const points = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={SILVER}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Depth-layered molecular dust that drifts and leans with the pointer.
 * Layer count scales down automatically on small viewports.
 */
export function MolecularDust({
  layers = 3,
  perLayer = 120,
  color = SAGE,
}: {
  layers?: number;
  perLayer?: number;
  color?: string;
}) {
  const { size } = useThree();
  const scaled = size.width < 768 ? Math.max(1, layers - 1) : layers;
  return (
    <>
      {Array.from({ length: scaled }, (_, i) => (
        <DustLayer key={i} depth={i + 1} count={perLayer} color={color} />
      ))}
    </>
  );
}

function DustLayer({ depth, count, color }: { depth: number; count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 2] = -depth * 2.4 - Math.random() * 2;
    }
    return arr;
  }, [count, depth]);

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;
    const k = 0.22 / depth;
    ref.current.position.x += (pointer.x * k * 3 - ref.current.position.x) * 0.03;
    ref.current.position.y += (-pointer.y * k * 2 - ref.current.position.y) * 0.03;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.04 * depth) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09 / depth + 0.03}
        color={color}
        transparent
        opacity={0.5 / depth + 0.12}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Faint scientific coordinate plane far below the scene. */
export function ScienceGrid({ y = -3.2 }: { y?: number }) {
  return (
    <gridHelper
      args={[60, 60, new THREE.Color(SAGE), new THREE.Color("#2b302a")]}
      position={[0, y, 0]}
    />
  );
}

export function useResponsiveScale(base = 1) {
  const { viewport } = useThree();
  return viewport.width < 6 ? base * 0.68 : base;
}
