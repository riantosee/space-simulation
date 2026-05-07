'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AsteroidBelt() {
  const ref = useRef<THREE.Points>(null);

  const { geo, mat } = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    // Main belt: 2.2–3.2 AU, scaled
    const AU = 9.5;
    for (let i = 0; i < count; i++) {
      const r = (2.2 + Math.random() * 1.0) * AU;
      const angle = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 0.4;
      pos[i * 3]     = r * Math.cos(angle);
      pos[i * 3 + 1] = tilt * r * 0.04;
      pos[i * 3 + 2] = r * Math.sin(angle);
      sizes[i] = 0.4 + Math.random() * 1.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const m = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (120.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.3, 2.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(0.65, 0.60, 0.55, (1.0 - d * 2.0) * 0.7);
        }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return { geo: g, mat: m };
  }, []);

  useFrame((state) => {
    mat.uniforms.time.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += 0.00005;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}
