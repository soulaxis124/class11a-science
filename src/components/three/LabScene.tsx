import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CYAN, NexusCanvas, PointerParallax, ScienceGrid, Starfield } from "./shared";

function Flask({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current)
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <coneGeometry args={[0.6, 1.1, 24, 1, true]} />
        <meshStandardMaterial
          color="#a9e8ff"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <coneGeometry args={[0.42, 0.5, 24]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.42, 16, 1, true]} />
        <meshStandardMaterial color="#a9e8ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Molecule({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.35;
      ref.current.rotation.x += d * 0.12;
    }
  });
  const atoms: [number, number, number][] = [
    [0, 0, 0],
    [0.85, 0.4, 0],
    [-0.85, 0.4, 0],
    [0, -0.8, 0.5],
    [0, 0.3, -0.9],
  ];
  return (
    <group ref={ref} position={position} scale={0.9}>
      {atoms.map((a, i) => (
        <mesh key={i} position={a}>
          <sphereGeometry args={[i === 0 ? 0.3 : 0.17, 18, 18]} />
          <meshStandardMaterial
            color={i === 0 ? "#ffffff" : "#8fe8ff"}
            emissive={CYAN}
            emissiveIntensity={i === 0 ? 0.5 : 0.9}
          />
        </mesh>
      ))}
      {atoms.slice(1).map((a, i) => {
        const dir = new THREE.Vector3(...a);
        const len = dir.length();
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        const e = new THREE.Euler().setFromQuaternion(q);
        return (
          <mesh key={i} position={dir.clone().multiplyScalar(0.5)} rotation={e}>
            <cylinderGeometry args={[0.02, 0.02, len, 8]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.55} />
          </mesh>
        );
      })}
    </group>
  );
}

function Wave() {
  const ref = useRef<THREE.Line>(null);
  const points = new Float32Array(200 * 3);
  useFrame((state) => {
    const line = ref.current;
    if (!line) return;
    const attr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < 200; i++) {
      const x = (i / 199) * 8 - 4;
      attr.setXYZ(i, x, Math.sin(x * 1.5 + t * 1.6) * 0.35, 0);
    }
    attr.needsUpdate = true;
  });
  return (
    // @ts-expect-error three line element
    <line ref={ref} position={[0, -1.9, -1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={CYAN} transparent opacity={0.5} />
    </line>
  );
}

export default function LabScene() {
  return (
    <NexusCanvas cameraPosition={[0, 0.3, 8]}>
      <fog attach="fog" args={["#0b1020", 9, 22]} />
      <Starfield count={260} radius={18} />
      <ScienceGrid y={-3} />
      <PointerParallax strength={0.18}>
        <Flask position={[-2.6, 0.2, 0]} />
        <Molecule position={[2.4, 0.3, 0]} />
        <Wave />
      </PointerParallax>
    </NexusCanvas>
  );
}
