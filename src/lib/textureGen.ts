import * as THREE from 'three';
import { PlanetData } from '@/lib/planetData';

function noise2d(x: number, y: number, seed = 0): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, octaves = 5, seed = 0): number {
  let v = 0, a = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += a * noise2d(x * freq, y * freq, seed + i);
    a *= 0.5; freq *= 2;
  }
  return v;
}

export function generatePlanetTexture(planet: PlanetData, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size / 2;
  const ctx = canvas.getContext('2d')!;
  const W = size, H = size / 2;
  const img = ctx.createImageData(W, H);
  const d = img.data;

  const c1 = new THREE.Color(planet.color);
  const c2 = new THREE.Color(planet.color2);

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const u = px / W, v = py / H;
      const phi = u * Math.PI * 2;
      const theta = v * Math.PI;
      const sx = Math.sin(theta) * Math.cos(phi);
      const sy = Math.sin(theta) * Math.sin(phi);
      const sz = Math.cos(theta);

      let r = c1.r, g = c1.g, b = c1.b;

      if (planet.id === 'earth') {
        // Continents and ocean
        const landNoise = fbm(sx * 3, sy * 3 + sz * 2, 6, 42);
        const isLand = landNoise > 0.52;
        if (isLand) {
          const elevation = (landNoise - 0.52) * 8;
          // terrain coloring
          if (elevation < 0.05) { r=0.22; g=0.44; b=0.22; } // coast
          else if (elevation < 0.3) { r=0.24+elevation*0.2; g=0.48-elevation*0.1; b=0.18; }
          else if (elevation < 0.6) { r=0.5; g=0.42; b=0.32; } // rock
          else { r=0.85; g=0.88; b=0.92; } // snow
        } else {
          const depth = fbm(sx * 4, sy * 4, 4, 10);
          r = 0.04 + depth * 0.08;
          g = 0.22 + depth * 0.18;
          b = 0.55 + depth * 0.25;
        }
        // ice caps
        if (v < 0.06 || v > 0.94) { const t = v < 0.5 ? 1-v/0.06 : (v-0.94)/0.06; r=mix(r,0.9,t); g=mix(g,0.95,t); b=mix(b,1.0,t); }
      } else if (planet.id === 'mars') {
        const base = fbm(sx * 4, sy * 4, 6, 7);
        const craters = fbm(sx * 8, sy * 8, 3, 99);
        r = 0.60 + base * 0.18 - craters * 0.08;
        g = 0.22 + base * 0.08 - craters * 0.04;
        b = 0.05 + base * 0.03;
        if (v < 0.05 || v > 0.95) { const t = v < 0.5 ? 1-v/0.05 : (v-0.95)/0.05; r=mix(r,0.85,t*0.6); g=mix(g,0.88,t*0.6); b=mix(b,0.92,t*0.6); }
      } else if (planet.id === 'mercury') {
        const base = fbm(sx * 6, sy * 6, 7, 3);
        const tone = 0.35 + base * 0.35;
        r = tone * 0.88; g = tone * 0.82; b = tone * 0.78;
      } else if (planet.id === 'venus') {
        const clouds = fbm(sx * 3, sy * 3, 5, 55);
        r = 0.72 + clouds * 0.18;
        g = 0.62 + clouds * 0.12;
        b = 0.32 + clouds * 0.08;
      } else if (planet.id === 'jupiter') {
        // Bands
        const band = Math.sin(v * Math.PI * 14 + fbm(sx * 2, sz * 2, 3, 1) * 1.5);
        const t = (band + 1) / 2;
        r = mix(c1.r, c2.r + 0.15, t) + fbm(sx*6,sy*6,3,0)*0.05;
        g = mix(c1.g, c2.g, t);
        b = mix(c1.b, c2.b, t);
        // GRS
        const gx = sx - 0.1, gz = sz - 0.0;
        const gdist = Math.sqrt(gx*gx*4 + gz*gz*1.5);
        if (gdist < 0.18 && v > 0.42 && v < 0.58) {
          const gf = 1 - gdist / 0.18;
          r = mix(r, 0.55, gf * 0.8); g = mix(g, 0.12, gf * 0.8); b = mix(b, 0.05, gf * 0.8);
        }
      } else if (planet.id === 'saturn') {
        const band = Math.sin(v * Math.PI * 10 + fbm(sx * 2, sz * 2, 3, 2) * 1.2);
        const t = (band + 1) / 2;
        r = mix(c1.r, c2.r, t);
        g = mix(c1.g, c2.g, t);
        b = mix(c1.b, c2.b, t);
      } else if (planet.id === 'uranus') {
        const haze = fbm(sx * 2, sy * 2 + sz, 4, 77);
        r = 0.30 + haze * 0.10;
        g = 0.82 + haze * 0.10;
        b = 0.82 + haze * 0.12;
      } else if (planet.id === 'neptune') {
        const storm = fbm(sx * 3, sy * 3, 5, 88);
        const band = Math.sin(v * Math.PI * 6 + storm * 1.0) * 0.5 + 0.5;
        r = 0.10 + storm * 0.08 + band * 0.04;
        g = 0.20 + storm * 0.10;
        b = 0.65 + storm * 0.15 + band * 0.1;
        // Dark Spot
        const dsx = sx - 0.0, dsz = sz + 0.3;
        if (Math.sqrt(dsx*dsx+dsz*dsz) < 0.15 && v > 0.35 && v < 0.55) {
          r *= 0.6; g *= 0.6; b *= 0.85;
        }
      } else {
        const n = fbm(sx * 4, sy * 4, 5, 0);
        r = c1.r + (c2.r - c1.r) * n;
        g = c1.g + (c2.g - c1.g) * n;
        b = c1.b + (c2.b - c1.b) * n;
      }

      const idx = (py * W + px) * 4;
      d[idx]   = clamp(r * 255);
      d[idx+1] = clamp(g * 255);
      d[idx+2] = clamp(b * 255);
      d[idx+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function mix(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
function clamp(v: number) { return Math.max(0, Math.min(255, Math.round(v))); }
