'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

export default function Stars() {
  const { geo, mat } = useMemo(() => {
    const count = 10000;
    const pos = new Float32Array(count * 3);
    const starCol = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 500 + Math.random() * 1500;
      pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      pos[i*3+2] = r * Math.cos(ph);
      const t = Math.random();
      starCol[i*3]   = t > 0.7 ? 0.7 + t * 0.3 : 1.0;
      starCol[i*3+1] = 0.88 + Math.random() * 0.12;
      starCol[i*3+2] = t < 0.3 ? 0.7 + (1-t)*0.3 : 1.0;
      sizes[i] = 0.3 + Math.random() * Math.random() * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('starCol', new THREE.BufferAttribute(starCol, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const m = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size; attribute vec3 starCol; varying vec3 vCol;
        void main(){
          vCol = starCol;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.4, 3.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vCol;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          float a = 1.0 - smoothstep(0.05, 0.5, d);
          gl_FragColor = vec4(vCol, a * 0.95);
        }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    return { geo: g, mat: m };
  }, []);

  return <points geometry={geo} material={mat} />;
}
