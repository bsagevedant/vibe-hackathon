import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Scanline,
  Glitch
} from '@react-three/postprocessing';
import {
  PerspectiveCamera,
  OrbitControls,
  Stars,
  Text,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';

interface StoreState {
  hoveredObject: string | null;
  setHoveredObject: (id: string | null) => void;
}

const useStore = create<StoreState>((set) => ({
  hoveredObject: null,
  setHoveredObject: (id) => set({ hoveredObject: id }),
}));

function BoltLogo() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create the shape for the lightning bolt
  const boltShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, 1);
    shape.lineTo(0.2, 0.2);
    shape.lineTo(0, 0.2);
    shape.lineTo(0.5, -1);
    shape.lineTo(-0.2, -0.2);
    shape.lineTo(0, -0.2);
    shape.lineTo(-0.5, 1);
    return shape;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + 4;
  });

  return (
    <group ref={meshRef} position={[0, 4, -3]}>
      <mesh>
        <shapeGeometry args={[boltShape]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Grid() {
  const gridSize = 20;
  const gridDivisions = 20;
  const material = useMemo(() => 
    new THREE.LineBasicMaterial({ 
      color: '#00ff88',
      transparent: true,
      opacity: 0.5,
    }), 
  []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    material.opacity = 0.3 + Math.sin(time) * 0.2;
  });

  return (
    <gridHelper
      args={[gridSize, gridDivisions, '#00ff88', '#00ff88']}
      position={[0, -2, 0]}
      material={material}
    />
  );
}

function FloatingOrb({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const setHoveredObject = useStore((state) => state.setHoveredObject);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.5;
    meshRef.current.rotation.y = time * 0.5;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHoveredObject('orb')}
      onPointerLeave={() => setHoveredObject(null)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#ff00ff"
        emissive="#ff00ff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function HolographicUI() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  const highlights = [
    "BOLT HACKATHON 2025",
    "$1M+ PRIZE POOL",
    "100,000 DEVELOPERS",
    "RAPID CHALLENGES",
    "REAL-WORLD IMPACT",
    "NETWORKING & EXPOSURE",
    "CUTTING-EDGE TECH"
  ];

  return (
    <group ref={groupRef}>
      {highlights.map((text, index) => (
        <Text
          key={index}
          color="#00ffff"
          fontSize={0.3}
          maxWidth={5}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="left"
          font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
          anchorX="left"
          anchorY="middle"
          position={[-2, 3 - index * 0.5, -3]}
        >
          {text}
        </Text>
      ))}
    </group>
  );
}

function ParticleField() {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        <color attach="background" args={['#000020']} />
        <fog attach="fog" args={['#000020', 5, 30]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <Grid />
        <FloatingOrb position={[-2, 2, 0]} />
        <FloatingOrb position={[2, 2, 0]} />
        <BoltLogo />
        <HolographicUI />
        <ParticleField />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Scanline density={2} opacity={0.1} />
          <Glitch
            delay={[1.5, 3.5]}
            duration={[0.2, 0.4]}
            strength={[0.2, 0.4]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}