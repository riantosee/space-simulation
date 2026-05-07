'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PLANETS } from '@/lib/planetData';
import { useStore } from '@/lib/store';
import Sun from './Sun';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
import Stars from './Stars';
import AsteroidBelt from './AsteroidBelt';

function SolarScene() {
  const { timeSpeed, paused, showOrbits, showAsteroidBelt, selectedPlanet, setTimeElapsed } = useStore();
  const t = useRef(0);

  useFrame((_, dt) => {
    if (!paused) {
      t.current += dt;
      setTimeElapsed(t.current);
    }
  });

  return (
    <>
      <Sun />
      {showOrbits && PLANETS.map(p => (
        <OrbitLine key={p.id} planet={p} active={selectedPlanet?.id === p.id} />
      ))}
      {showAsteroidBelt && <AsteroidBelt />}
      {PLANETS.map(p => (
        <Planet key={p.id} planet={p} timeElapsed={t.current} timeSpeed={timeSpeed * 0.00008} />
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 55, 120], fov: 50, near: 0.1, far: 5000 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      dpr={[1, 1.5]}
      style={{ background: '#04060f' }}
    >
      <ambientLight intensity={0.03} />
      <Suspense fallback={null}>
        <Stars />
        <SolarScene />
      </Suspense>
      <OrbitControls
        enableDamping dampingFactor={0.06}
        minDistance={4} maxDistance={900}
        rotateSpeed={0.45} zoomSpeed={0.7}
        makeDefault
      />
    </Canvas>
  );
}
