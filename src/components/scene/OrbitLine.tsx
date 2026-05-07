'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { PlanetData } from '@/lib/planetData';

export default function OrbitLine({ planet, active }: { planet: PlanetData; active?: boolean }) {
  const geo = useMemo(() => {
    const a = planet.scaledDistance;
    const b = a * Math.sqrt(1 - planet.eccentricity ** 2);
    const inc = (planet.inclination * Math.PI) / 180;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        a * Math.cos(angle),
        a * Math.sin(angle) * Math.sin(inc),
        b * Math.sin(angle) * Math.cos(inc),
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [planet]);

  return (
    <line>
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial
        color={active ? '#e8f040' : '#ffffff'}
        transparent
        opacity={active ? 0.4 : 0.06}
        depthWrite={false}
      />
    </line>
  );
}
