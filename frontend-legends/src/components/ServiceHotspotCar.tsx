'use client';

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Html, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { HOTSPOT_SERVICES } from '@/lib/site';

function Hotspot({
  index,
  label,
  position,
  active,
  onSelect,
}: {
  index: number;
  label: string;
  position: [number, number, number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <group position={position}>
      <mesh onClick={onSelect}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial
          color={active ? '#FFD700' : '#7dd3fc'}
          emissive={active ? '#FFD700' : '#0ea5e9'}
          emissiveIntensity={active ? 0.8 : 0.35}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[0.13, 0.18, 42]} />
        <meshBasicMaterial color={active ? '#FFD700' : '#7dd3fc'} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <Html center distanceFactor={10}>
        <button
          type="button"
          onClick={onSelect}
          className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] shadow-2xl backdrop-blur-md transition-all ${
            active
              ? 'border-[#FFD700]/60 bg-[#FFD700] text-black'
              : 'border-white/15 bg-black/65 text-white hover:border-[#FFD700]/35'
          }`}
        >
          {index + 1}. {label}
        </button>
      </Html>
    </group>
  );
}

function CarBody() {
  const shellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0a0a0a',
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1.2,
        clearcoatRoughness: 0.03,
        reflectivity: 1.5,
      }),
    []
  );

  return (
    <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.3}>
      <group position={[0, 0.15, 0]}>
        <mesh material={shellMaterial} castShadow>
          <boxGeometry args={[3.4, 0.55, 1.55]} />
        </mesh>
        <mesh position={[0.15, 0.48, 0]} material={shellMaterial} castShadow>
          <boxGeometry args={[1.8, 0.48, 1.32]} />
        </mesh>
        <mesh position={[1.82, -0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.5, 40]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[-1.82, -0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.5, 40]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0.65, 0.5, 0.68]} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.08]} />
          <meshPhysicalMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0.65, 0.5, -0.68]} castShadow>
          <boxGeometry args={[0.95, 0.22, 0.08]} />
          <meshPhysicalMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-1.68, 0.12, 0.72]} castShadow>
          <boxGeometry args={[0.25, 0.18, 0.08]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <mesh position={[-1.68, 0.12, -0.72]} castShadow>
          <boxGeometry args={[0.25, 0.18, 0.08]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[2.25, 0.02, 12, 120]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ServiceHotspotCar() {
  const [activeId, setActiveId] = useState<string>(HOTSPOT_SERVICES[0].id);
  const activeService = HOTSPOT_SERVICES.find((service) => service.id === activeId) ?? HOTSPOT_SERVICES[0];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative h-[640px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,#060606,#020202)] shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute left-8 top-8 z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-black/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">
            3D Service Explorer
          </div>
          <h3 className="max-w-sm text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
            Tap the car to reveal every premium service layer
          </h3>
        </div>

        <Canvas dpr={[1, 2]} camera={{ position: [6.5, 2.8, 6], fov: 34 }}>
          <Suspense fallback={null}>
            <fog attach="fog" args={['#030303', 8, 20]} />
            <ambientLight intensity={0.15} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <spotLight position={[-10, 15, 10]} angle={0.2} intensity={4} penumbra={1} color="#60a5fa" castShadow />
            <spotLight position={[10, 15, -10]} angle={0.2} intensity={3} penumbra={1} color="#fbbf24" castShadow />
            <CarBody />
            {HOTSPOT_SERVICES.map((service, index) => (
              <Hotspot
                key={service.id}
                index={index}
                label={service.label}
                position={service.position}
                active={service.id === activeId}
                onSelect={() => setActiveId(service.id)}
              />
            ))}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[400, 200]}
                resolution={1024}
                mixBlur={1}
                mixStrength={50}
                roughness={1}
                depthScale={1}
                color="#040404"
                metalness={0.7}
              />
            </mesh>
            <Environment preset="night" />
            <ContactShadows resolution={2048} scale={20} blur={3} opacity={0.65} far={8} color="#000" />
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      <div className="space-y-5">
        <div className="rounded-[2rem] border border-[#FFD700]/20 bg-[#0b0b0b] p-7 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FFD700]">{activeService.label}</div>
          <h4 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">{activeService.title}</h4>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-sky-300">{activeService.stat}</p>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">{activeService.description}</p>
          <div className="mt-6 grid gap-3">
            {activeService.bullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200">
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {HOTSPOT_SERVICES.map((service) => (
            <button
              type="button"
              key={service.id}
              onClick={() => setActiveId(service.id)}
              className={`rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
                service.id === activeId
                  ? 'border-[#FFD700]/45 bg-[#FFD700]/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">{service.label}</div>
              <div className="mt-2 text-sm font-black uppercase tracking-tight text-white">{service.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
