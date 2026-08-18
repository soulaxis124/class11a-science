import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useNavigate } from "@tanstack/react-router";
import * as THREE from "three";
import { houses } from "@/data/houses";
import { readCssColor } from "@/lib/house-theme";
import { GOLD, MolecularDust, NexusCanvas, SAGE, ScienceGrid, SILVER, Starfield } from "./shared";

function HouseParticles({ color, active }: { color: string; active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = new Float32Array(
    Array.from({ length: 40 * 3 }, (_, i) =>
      i % 3 === 1 ? Math.random() * 3.4 - 1.6 : (Math.random() - 0.5) * 1.8,
    ),
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.15;
    const m = ref.current.material as THREE.PointsMaterial;
    m.opacity += ((active ? 0.85 : 0.3) - m.opacity) * 0.08;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

function Tower({
  index,
  name,
  id,
  colorVar,
  accentVar,
}: {
  index: number;
  name: string;
  id: string;
  colorVar: string;
  accentVar: string;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const color = readCssColor(colorVar, SAGE);
  const accent = readCssColor(accentVar, SILVER);
  const x = (index - 1.5) * 2.6;
  const height = 3.2;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += hovered ? 0.008 : 0.003;
    const lift = hovered ? 0.28 : 0;
    ref.current.position.y +=
      (Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.08 + lift - ref.current.position.y) * 0.08;
    const s = hovered ? 1.07 : 1;
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    if (light.current) light.current.intensity += ((hovered ? 9 : 1.4) - light.current.intensity) * 0.1;
  });

  return (
    <group
      position={[x, 0, 0]}
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
        void navigate({ to: `/houses/${id}` });
      }}
    >
      <pointLight ref={light} color={color} position={[0, 1.2, 1.2]} distance={6} intensity={1.4} />
      <group ref={ref}>
        <HouseParticles color={accent} active={hovered} />
        <mesh position={[0, height / 2 - 1.6, 0]}>
          <cylinderGeometry args={[0.55, 0.8, height, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.65 : 0.2}
            transparent
            opacity={0.55}
            metalness={0.55}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, height - 1.35, 0]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color={accent}
            emissive={hovered ? GOLD : color}
            emissiveIntensity={hovered ? 1.5 : 0.55}
          />
        </mesh>
        <mesh position={[0, -1.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.01, 8, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.9 : 0.35} />
        </mesh>
      </group>
      <Html center position={[0, -2.15, 0]} distanceFactor={10} zIndexRange={[10, 0]}>
        <button
          type="button"
          onClick={() => void navigate({ to: `/houses/${id}` })}
          className="whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-white/90 backdrop-blur-md transition-transform duration-300"
          style={{ transform: `scale(${hovered ? 1.08 : 1})` }}
        >
          {name.toUpperCase()}
        </button>
      </Html>
    </group>
  );
}

export default function TowersScene() {
  return (
    <NexusCanvas cameraPosition={[0, 0.8, 9]} fov={52}>
      <fog attach="fog" args={["#12140f", 10, 24]} />
      <Starfield count={240} radius={20} />
      <MolecularDust layers={2} perLayer={70} />
      <ScienceGrid y={-1.62} />
      {houses.map((h, i) => (
        <Tower key={h.id} index={i} name={h.name} id={h.id} colorVar={h.colorVar} accentVar={h.colorVar3} />
      ))}
    </NexusCanvas>
  );
}
