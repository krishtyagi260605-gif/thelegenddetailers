'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSphere() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 8000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        // More dynamic distribution
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.4 + Math.random() * 0.2; // Slight variation in radius
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        
        // Predominantly Gold with Cyan sparks
        const isGold = Math.random() > 0.15;
        color.set(isGold ? '#FFD700' : '#00FFFF');
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        const time = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.x = time * 0.02;
        
        // Pulsing effect
        const s = 1 + Math.sin(time) * 0.05;
        pointsRef.current.scale.set(s, s, s);

        // Mouse interaction
        const { x, y } = state.mouse;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        pointsRef.current.position.x = lerp(pointsRef.current.position.x, x * 0.2, 0.1);
        pointsRef.current.position.y = lerp(pointsRef.current.position.y, y * 0.2, 0.1);
    }
  });

  return (
    <group>
        <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
            <PointMaterial
                transparent
                vertexColors
                size={0.012}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
        {/* Subtle inner core glow */}
        <mesh>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.015} />
        </mesh>
    </group>
  );
}

export default function HeroOrb() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.4} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <ParticleSphere />
        </Float>
      </Canvas>
    </div>
  );
}
