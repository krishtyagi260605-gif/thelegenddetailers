'use client';

import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, MeshReflectorMaterial, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function CarModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2.5, 0.6, 5]} />
        <meshPhysicalMaterial 
          color="#050505" 
          roughness={0.02} 
          metalness={1} 
          reflectivity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.01} 
          emissive="#FFD700"
          emissiveIntensity={0.02}
        />
      </mesh>
      {/* Headlights simulation */}
      <mesh position={[1, 0, 2.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <mesh position={[-1, 0, 2.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </Float>
  );
}

export default function CarViewer3D() {
  return (
    <div className="w-full h-[600px] bg-black rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl">
      <div className="absolute top-8 left-8 z-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Ceramic Coating Simulator</span>
          </div>
          <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter">Surface Reflectivity</h3>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [8, 3, 12], fov: 35 }}>
        <Suspense fallback={null}>
            <CarModel />
            
            {/* Reflective Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={60}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#101010"
                    metalness={0.5}
                />
            </mesh>

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <Environment preset="city" />
            
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000" />
            
            <OrbitControls 
                enableZoom={false} 
                autoRotate 
                autoRotateSpeed={0.3} 
                minPolarAngle={Math.PI / 4} 
                maxPolarAngle={Math.PI / 2.2} 
            />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-2 items-end">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
              <span className="text-[9px] text-[#FFD700] font-black uppercase tracking-widest block mb-1">Clearcoat Status</span>
              <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#00FFFF]" 
                  />
              </div>
          </div>
      </div>
    </div>
  );
}
