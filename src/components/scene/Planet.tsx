'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData, getOrbitalPosition, getRotationSpeed } from '@/lib/planetData';
import { generatePlanetTexture } from '@/lib/textureGen';
import { useStore } from '@/lib/store';

function SaturnRings({ r }: { r: number }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 1;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0,    'rgba(0,0,0,0)');
    g.addColorStop(0.08, 'rgba(180,155,110,0.15)');
    g.addColorStop(0.18, 'rgba(210,185,130,0.75)');
    g.addColorStop(0.28, 'rgba(190,165,115,0.55)');
    g.addColorStop(0.38, 'rgba(215,190,135,0.9)');
    g.addColorStop(0.45, 'rgba(195,170,120,0.4)');
    g.addColorStop(0.52, 'rgba(220,200,145,0.85)');
    g.addColorStop(0.62, 'rgba(200,175,125,0.5)');
    g.addColorStop(0.75, 'rgba(210,185,130,0.3)');
    g.addColorStop(0.88, 'rgba(185,160,110,0.15)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 1);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r * 1.25, r * 2.5, 256]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent depthWrite={false} />
    </mesh>
  );
}

function UranusRings({ r }: { r: number }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 1;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.35, 'rgba(100,180,200,0.25)');
    g.addColorStop(0.5, 'rgba(120,200,220,0.45)');
    g.addColorStop(0.65, 'rgba(100,180,200,0.25)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 1);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <ringGeometry args={[r * 1.4, r * 2.0, 128]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent depthWrite={false} />
    </mesh>
  );
}

interface Props { planet: PlanetData; timeElapsed: number; timeSpeed: number; }

export default function Planet({ planet, timeElapsed, timeSpeed }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef  = useRef<THREE.Mesh>(null);
  const [hov, setHov] = useState(false);

  const { setSelectedPlanet, selectedPlanet, hoveredPlanet, setHoveredPlanet, showLabels } = useStore();
  const isSel = selectedPlanet?.id === planet.id;
  const isHov = hoveredPlanet === planet.id;

  const texture = useMemo(() => generatePlanetTexture(planet, 512), [planet]);

  const atmMat = useMemo(() => {
    if (!planet.atmosphereColor || planet.atmosphereColor === 'transparent') return null;
    const col = new THREE.Color(planet.atmosphereColor.replace(/[0-9a-f]{2}$/i, ''));
    return new THREE.ShaderMaterial({
      uniforms: { atmColor: { value: col } },
      vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 atmColor; varying vec3 vN; void main(){ float p=pow(.72-dot(vN,vec3(0,0,1.)),3.); gl_FragColor=vec4(atmColor,p*.9); }`,
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
    });
  }, [planet.atmosphereColor]);

  useFrame((_, dt) => {
    if (!groupRef.current || !meshRef.current) return;
    const [x, y, z] = getOrbitalPosition(planet, timeElapsed, timeSpeed);
    groupRef.current.position.set(x, y, z);
    meshRef.current.rotation.z = THREE.MathUtils.degToRad(planet.axialTiltDeg);
    meshRef.current.rotation.y += getRotationSpeed(planet, timeSpeed) * dt;
  });

  const r = planet.scaledRadius;

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        scale={isHov || isSel ? 1.06 : 1}
        onPointerEnter={(e) => { e.stopPropagation(); setHov(true); setHoveredPlanet(planet.id); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHov(false); setHoveredPlanet(null); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); setSelectedPlanet(planet); }}
      >
        <sphereGeometry args={[r, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={planet.type === 'rocky' ? 0.85 : 0.5} metalness={0.05} />
      </mesh>

      {/* Atmosphere */}
      {atmMat && (
        <mesh><sphereGeometry args={[r * 1.10, 32, 32]} /><primitive object={atmMat} attach="material" /></mesh>
      )}

      {/* Rings */}
      {planet.id === 'saturn' && <SaturnRings r={r} />}
      {planet.id === 'uranus' && <UranusRings r={r} />}

      {/* Selection pulse ring */}
      {isSel && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r * 1.55, r * 1.65, 64]} />
          <meshBasicMaterial color="#e8f040" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Label */}
      {showLabels && (
        <Html center distanceFactor={35} position={[0, r + 0.35, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: "'Syne Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.25em',
            color: isSel ? '#e8f040' : isHov ? '#d8e4f0' : '#3a4d60',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s',
            userSelect: 'none',
          }}>
            {planet.name}
          </div>
        </Html>
      )}
    </group>
  );
}
