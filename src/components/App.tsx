'use client';
import Scene from './scene/Scene';
import Toolbar from './ui/Toolbar';
import PlanetPanel from './panels/PlanetPanel';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#04060f' }}>
      {/* 3D Canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Scene />
      </div>

      {/* Subtle scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
      }} />

      {/* Corner marks */}
      {[
        { top: 12, left: 12, borderTop: '1px solid', borderLeft: '1px solid' },
        { top: 12, right: 12, borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: 12, left: 12, borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: 12, right: 12, borderBottom: '1px solid', borderRight: '1px solid' },
      ].map((style, i) => (
        <div key={i} style={{
          position: 'fixed', width: 16, height: 16,
          borderColor: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none', zIndex: 50,
          ...style,
        }} />
      ))}

      <Toolbar />
      <PlanetPanel />
    </div>
  );
}
