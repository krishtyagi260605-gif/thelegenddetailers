'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Text,
} from '@react-three/drei';
import * as THREE from 'three';

function DetailPoint({ position, label, active, onClick }: { position: [number, number, number], label: string, active: boolean, onClick: () => void }) {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial 
          color={active ? "#FFD700" : "#ffffff"} 
          emissive={active ? "#FFD700" : "#ffffff"} 
          emissiveIntensity={active ? 2 : 0.5} 
        />
      </mesh>
      {active && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </Float>
      )}
    </group>
  );
}

function HighFidelityCar() {
  const bodyRef = useRef<THREE.Group>(null);
  
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0a',
    metalness: 0.9,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    reflectivity: 1,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#111',
    metalness: 0.1,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.5,
    transparent: true,
    opacity: 0.4,
  }), []);

  return (
    <group ref={bodyRef}>
      {/* Chassis / Main Body */}
      <mesh castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[4, 0.6, 1.8]} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0.2, 0.55, 0]} castShadow material={glassMaterial}>
        <boxGeometry args={[2, 0.5, 1.5]} />
      </mesh>

      {/* Wheels */}
      {[[-1.4, -0.3, 0.9], [1.4, -0.3, 0.9], [-1.4, -0.3, -0.9], [1.4, -0.3, -0.9]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}

      {/* Headlights VFX */}
      <group position={[2, 0.1, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
        <pointLight intensity={2} distance={5} color="#fff" />
      </group>
      <group position={[2, 0.1, -0.6]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
        <pointLight intensity={2} distance={5} color="#fff" />
      </group>

      {/* Tail lights */}
      <group position={[-2, 0.1, 0.6]}>
        <mesh>
          <boxGeometry args={[0.1, 0.2, 0.4]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        <pointLight intensity={1} distance={3} color="#ff0000" />
      </group>
      <group position={[-2, 0.1, -0.6]}>
        <mesh>
          <boxGeometry args={[0.1, 0.2, 0.4]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        <pointLight intensity={1} distance={3} color="#ff0000" />
      </group>
    </group>
  );
}

export default function FidelityCar() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const points = [
    { position: [1.8, 0.4, 0.7], label: "Ceramic Coating" },
    { position: [-1.5, 0.4, 0.7], label: "Paint Protection Film" },
    { position: [0.5, 0.8, 0], label: "Glass Protection" },
    { position: [0, 0.2, 1], label: "Wheel Detailing" },
  ];

  return (
    <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
      <div className="absolute top-8 left-8 z-10">
        <h3 className="text-xl font-bold uppercase tracking-widest text-white">Full Spectrum Protection</h3>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2 italic">Interactive 3D Masterpiece</p>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={35} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
        
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
          
          <HighFidelityCar />
          
          {points.map((p, i) => (
            <DetailPoint 
              key={i} 
              position={p.position as [number, number, number]} 
              label={p.label} 
              active={activePoint === i}
              onClick={() => setActivePoint(activePoint === i ? null : i)}
            />
          ))}

          <ContactShadows position={[0, -0.41, 0]} opacity={0.5} scale={10} blur={2} far={4.5} />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={40}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10 flex gap-3">
        {points.map((_, i) => (
          <button
            key={i}
            onClick={() => setActivePoint(i)}
            className={`w-3 h-3 rounded-full border transition-all ${activePoint === i ? 'bg-[#FFD700] border-[#FFD700] scale-125' : 'bg-transparent border-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
