'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sun() {
  const coronaRef = useRef<THREE.Mesh>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);

  const surfaceMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec2 vUv; varying vec3 vNormal; varying vec3 vPos;
      void main() {
        vUv = uv; vNormal = normalize(normalMatrix * normal);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv; varying vec3 vNormal; varying vec3 vPos;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      float fbm(vec2 p){
        float v=0.;float a=.5;
        for(int i=0;i<6;i++){v+=a*noise(p);a*=.5;p*=2.;}
        return v;
      }
      void main() {
        vec2 uv = vUv * 5.0;
        float n = fbm(uv + time * 0.08);
        float n2 = fbm(uv * 1.7 - time * 0.05 + 3.0);
        float granule = fbm(uv * 4.0 + time * 0.04);
        
        vec3 hotspot = vec3(1.0, 0.95, 0.6);
        vec3 mid = vec3(1.0, 0.6, 0.1);
        vec3 dark = vec3(0.7, 0.25, 0.02);
        vec3 flare = vec3(1.0, 0.85, 0.3);
        
        float t = n * 0.6 + n2 * 0.3 + granule * 0.1;
        vec3 col = mix(dark, mid, smoothstep(0.3, 0.6, t));
        col = mix(col, hotspot, smoothstep(0.55, 0.8, t));
        col = mix(col, flare, smoothstep(0.78, 0.95, granule));
        
        // Limb darkening
        float limb = dot(vNormal, vec3(0,0,1));
        col *= 0.6 + 0.4 * limb;
        
        gl_FragColor = vec4(col, 1.0);
      }`,
  }), []);

  const coronaMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float time;
      varying vec3 vNormal; varying vec3 vPos;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPos))), 2.5);
        float pulse = 0.85 + 0.15 * sin(time * 1.2);
        vec3 coronaColor = mix(vec3(1.0, 0.5, 0.05), vec3(1.0, 0.85, 0.3), fresnel);
        float alpha = fresnel * pulse * 0.75;
        gl_FragColor = vec4(coronaColor, alpha);
      }`,
    transparent: true, blending: THREE.AdditiveBlending,
    side: THREE.BackSide, depthWrite: false,
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    surfaceMat.uniforms.time.value = t;
    coronaMat.uniforms.time.value = t;
    if (surfaceRef.current) surfaceRef.current.rotation.y = t * 0.02;
  });

  return (
    <group>
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <primitive object={surfaceMat} attach="material" />
      </mesh>
      {/* Inner glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <primitive object={coronaMat} attach="material" />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[4.0, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.04}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <pointLight color="#fff8e8" intensity={10} distance={0} decay={1.5} />
      <pointLight color="#ff8833" intensity={4} distance={15} decay={2} />
    </group>
  );
}
