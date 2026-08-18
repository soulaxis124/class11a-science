import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useNavigate } from "@tanstack/react-router";
import * as THREE from "three";
import { campusLocations } from "@/data/navigation";
import { FOREST, GOLD, MolecularDust, NexusCanvas, SAGE, ScienceGrid, SILVER, Starfield } from "./shared";

function NodeParticles({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = new Float32Array(
    Array.from({ length: 24 * 3 }, () => (Math.random() - 0.5) * 1.4),
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.3;
    const target = active ? 1 : 0.25;
    const m = ref.current.material as THREE.PointsMaterial;
    m.opacity += (target - m.opacity) * 0.1;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={SAGE} transparent opacity={0.25} depthWrite={false} />
    </points>
  );
}

function LocationNode({
  index,
  total,
  label,
  to,
  code,
  focused,
  onFocusChange,
}: {
  index: number;
  total: number;
  label: string;
  to: string;
  code: string;
  focused: boolean;
  onFocusChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const active = hovered || focused;
  const ref = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  const angle = (index / total) * Math.PI * 2;
  const radius = 4.2;
  const y = Math.sin(index * 1.7) * 0.9;
  const base: [number, number, number] = [Math.cos(angle) * radius, y, Math.sin(angle) * radius];

  useFrame((state) => {
    if (!ref.current) return;
    const float = Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.12;
    // smooth depth push toward the camera on hover, never a hard snap
    const depth = active ? 0.55 : 0;
    ref.current.position.y += (base[1] + float + depth * 0.4 - ref.current.position.y) * 0.08;
    ref.current.position.x += (base[0] * (active ? 1.06 : 1) - ref.current.position.x) * 0.08;
    ref.current.position.z += (base[2] * (active ? 1.06 : 1) - ref.current.position.z) * 0.08;
    ref.current.rotation.y += 0.004;
    const target = active ? 1.3 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    if (light.current) light.current.intensity += ((active ? 6 : 0.6) - light.current.intensity) * 0.12;
  });

  return (
    <group
      ref={ref}
      position={base}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
        void navigate({ to });
      }}
    >
      <pointLight ref={light} color={GOLD} distance={4} intensity={0.6} />
      <NodeParticles active={active} />
      <mesh>
        <octahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color={active ? SILVER : SAGE}
          emissive={active ? GOLD : FOREST}
          emissiveIntensity={active ? 1.2 : 0.4}
          metalness={0.65}
          roughness={0.22}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.005, 8, 64]} />
        <meshBasicMaterial color={active ? GOLD : SILVER} transparent opacity={active ? 0.9 : 0.28} />
      </mesh>
      <Html center distanceFactor={11} zIndexRange={[10, 0]}>
        <button
          type="button"
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onClick={() => void navigate({ to })}
          className="whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/90 backdrop-blur-md transition-all duration-300"
          style={{ opacity: active ? 1 : 0.62, transform: `scale(${active ? 1.06 : 1})` }}
        >
          <span className="mr-1.5 text-[9px] opacity-70">{code}</span>
          {label.toUpperCase()}
        </button>
      </Html>
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.1;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial color={SILVER} emissive={FOREST} emissiveIntensity={0.3} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color={SAGE} emissive={FOREST} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function OrbitRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.05;
    ref.current.rotation.x += (-pointer.y * 0.14 - ref.current.rotation.x) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

export default function CampusScene() {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  return (
    <NexusCanvas cameraPosition={[0, 2.4, 9.5]} fov={52}>
      <fog attach="fog" args={["#12140f", 10, 25]} />
      <Starfield count={320} radius={20} />
      <MolecularDust layers={2} perLayer={90} />
      <ScienceGrid y={-2.6} />
      <OrbitRig>
        <Core />
        {campusLocations.map((loc, i) => (
          <LocationNode
            key={loc.to}
            index={i}
            total={campusLocations.length}
            label={loc.label}
            to={loc.to}
            code={loc.code}
            focused={focusIndex === i}
            onFocusChange={(v) => setFocusIndex(v ? i : null)}
          />
        ))}
      </OrbitRig>
    </NexusCanvas>
  );
}
