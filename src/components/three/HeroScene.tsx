import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  FOREST,
  GOLD,
  MolecularDust,
  NexusCanvas,
  PointerParallax,
  SAGE,
  ScienceGrid,
  SILVER,
  Starfield,
} from "./shared";

function Nucleus() {
  const ref = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.16;
      ref.current.rotation.x += delta * 0.05;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
      shell.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color={SILVER}
          emissive={FOREST}
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.6}
          wireframe
        />
      </mesh>
      <mesh ref={shell}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial color={SAGE} emissive={FOREST} emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Orbit({
  tilt,
  speed,
  radius,
  color = SAGE,
}: {
  tilt: [number, number, number];
  speed: number;
  radius: number;
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <group ref={ref}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-radius, 0, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color={SILVER} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function Helix() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  const nodes = Array.from({ length: 26 }, (_, i) => i);
  return (
    <group ref={ref} position={[4.7, -0.4, -2.4]} scale={0.72}>
      {nodes.map((i) => {
        const t = i * 0.36;
        const y = i * 0.16 - 2;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[Math.cos(t) * 0.6, 0, Math.sin(t) * 0.6]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshBasicMaterial color={SAGE} transparent opacity={0.85} />
            </mesh>
            <mesh position={[-Math.cos(t) * 0.6, 0, -Math.sin(t) * 0.6]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Slow travelling sine wave — the physics layer of the hero. */
function Waveform({ z = -3, color = FOREST }: { z?: number; color?: string }) {
  const ref = useRef<THREE.Line>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Array(200 * 3).fill(0), 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = clock.elapsedTime * 0.5;
    for (let i = 0; i < 200; i++) {
      const x = (i / 199) * 16 - 8;
      attr.setXYZ(i, x, Math.sin(x * 0.8 + t) * 0.4 + Math.sin(x * 0.31 - t * 0.6) * 0.2 - 2.2, z);
    }
    attr.needsUpdate = true;
    if (ref.current) ref.current.computeLineDistances?.();
  });

  return (
    // @ts-expect-error three.js line primitive
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.45} />
    </line>
  );
}

function MoleculePlate({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.5;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.45 + position[0]) * 0.12;
  });
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return [Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0] as [number, number, number];
  });
  return (
    <group ref={ref} position={position}>
      {ring.map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={SAGE} emissive={FOREST} emissiveIntensity={0.6} />
          </mesh>
          <mesh
            position={[
              (p[0] + ring[(i + 1) % 6]![0]) / 2,
              (p[1] + ring[(i + 1) % 6]![1]) / 2,
              0,
            ]}
            rotation={[0, 0, (i / 6) * Math.PI * 2 + Math.PI / 2 + Math.PI / 6]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
            <meshBasicMaterial color={SILVER} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <NexusCanvas cameraPosition={[0, 0.4, 7.5]}>
      <fog attach="fog" args={["#12140f", 9, 26]} />
      <Starfield count={420} radius={26} />
      <MolecularDust />
      <ScienceGrid y={-3.4} />
      <PointerParallax>
        <Nucleus />
        <Orbit tilt={[1.2, 0.3, 0]} speed={0.5} radius={2.1} />
        <Orbit tilt={[-0.8, 0.9, 0.4]} speed={0.36} radius={2.8} color={GOLD} />
        <Orbit tilt={[0.4, -1.1, 0.9]} speed={0.26} radius={3.5} />
        <Helix />
        <Waveform />
        <MoleculePlate position={[-4.4, 0.5, -2]} />
        <MoleculePlate position={[-3.2, -1.4, -3.2]} />
      </PointerParallax>
    </NexusCanvas>
  );
}
