
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import * as THREE from "three";

interface HabitCubeProps {
  color?: string;
  wireframe?: boolean;
  speed?: number;
}

function RotatingCube({ color = "#16b8a2", wireframe = false, speed = 0.01 }: HabitCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "#25dad0" : color} wireframe={wireframe} />
    </mesh>
  );
}

export function HabitCube({ color, wireframe, speed }: HabitCubeProps) {
  return (
    <Card className="w-full h-[300px] shadow-md overflow-hidden">
      <CardContent className="p-0 h-full">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingCube color={color} wireframe={wireframe} speed={speed} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </CardContent>
    </Card>
  );
}
