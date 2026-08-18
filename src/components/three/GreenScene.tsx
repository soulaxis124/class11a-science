import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GREEN, NexusCanvas, PointerParallax, Starfield } from "./shared";

function Earth() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.5, 42, 42]} />
        <meshStandardMaterial
          color="#1d4f4a"
          emissive={GREEN}
          emissiveIntensity={0.18}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.53, 32, 32]} />
        <meshBasicMaterial color={GREEN} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.15, 0.006, 8, 96]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Leaves({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const y = attr.getY(i) + Math.sin(t * 0.3 + i) * 0.0025 + 0.004;
      attr.setY(i, y > 4 ? -4 : y);
    }
    attr.needsUpdate = true;
    pts.rotation.y = t * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color={GREEN}
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Sapling() {
  const branches = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        h: 0.5 + Math.random() * 0.5,
      })),
    [],
  );
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
  });
  return (
    <group ref={ref} position={[3.6, -1.4, -1]} scale={0.9}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.09, 1.6, 8]} />
        <meshStandardMaterial color="#3c5c4a" />
      </mesh>
      {branches.map((b, i) => (
        <mesh
          key={i}
          position={[Math.cos(b.angle) * 0.45, 1.4 + b.h * 0.4, Math.sin(b.angle) * 0.45]}
        >
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial
            color="#2f7a5c"
            emissive={GREEN}
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function GreenScene() {
  return (
    <NexusCanvas cameraPosition={[0, 0.4, 8]}>
      <fog attach="fog" args={["#08150f", 9, 24]} />
      <directionalLight position={[3, 4, 4]} intensity={0.9} color={GREEN} />
      <Starfield count={220} radius={18} />
      <PointerParallax strength={0.16}>
        <Earth />
        <Sapling />
        <Leaves />
      </PointerParallax>
    </NexusCanvas>
  );
}
