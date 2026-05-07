'use client';
import { useStore } from '@/lib/store';
import { PLANETS } from '@/lib/planetData';
import { useState } from 'react';

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      background: on ? 'rgba(232,240,64,0.1)' : 'transparent',
      border: `1px solid ${on ? 'rgba(232,240,64,0.4)' : 'var(--border)'}`,
      color: on ? 'var(--accent)' : 'var(--text-dim)',
      fontFamily: 'var(--ff-mono)', fontSize: 9,
      padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.2em',
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  );
}

function Btn({ onClick, children, active }: { onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'var(--accent)' : 'transparent',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      color: active ? '#000' : 'var(--text-dim)',
      fontFamily: 'var(--ff-mono)', fontSize: 9,
      padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.2em',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>
      {children}
    </button>
  );
}

const SPEEDS = [
  { label: 'PAUSED', value: 0 },
  { label: '0.1×', value: 36 },
  { label: '1×', value: 365 },
  { label: '10×', value: 3650 },
  { label: '100×', value: 36500 },
  { label: '1000×', value: 365000 },
];

export default function Toolbar() {
  const {
    timeSpeed, setTimeSpeed, paused, togglePause,
    showOrbits, toggleOrbits, showLabels, toggleLabels,
    showGrid, toggleGrid, showAsteroidBelt, toggleAsteroidBelt,
    setSelectedPlanet, timeElapsed,
  } = useStore();
  const [showPlanetList, setShowPlanetList] = useState(false);

  // Format simulated date from timeElapsed
  const simDays = Math.floor(timeElapsed * timeSpeed * 0.00008 * (365 / (2 * Math.PI)));
  const simYears = Math.floor(simDays / 365);
  const simDate = new Date(2000, 0, 1 + (simDays % 365));
  const dateStr = `Y${simYears} — ${simDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'linear-gradient(to bottom, rgba(4,6,15,0.98), rgba(4,6,15,0))',
        zIndex: 50, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, pointerEvents: 'all' }}>
          <span style={{ fontFamily: 'var(--ff-display)', fontSize: 16, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>HELIOSPHERE</span>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.3em' }}>v2.0</span>
        </div>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.2em', pointerEvents: 'none' }}>
          {dateStr}
        </div>
      </div>

      {/* Left panel — planet navigator */}
      <div style={{
        position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 4, zIndex: 50,
      }}>
        {PLANETS.map((p) => (
          <button key={p.id}
            onClick={() => setSelectedPlanet(p)}
            title={p.name}
            style={{
              width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
              background: p.color, border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: `0 0 0 0 ${p.color}`,
              fontSize: 0, padding: 0,
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.3)';
              (e.target as HTMLButtonElement).style.boxShadow = `0 0 12px ${p.color}99`;
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              (e.target as HTMLButtonElement).style.boxShadow = `0 0 0 0 ${p.color}`;
            }}
          >
            <span style={{ width: '60%', height: '60%', borderRadius: '50%', background: p.color2, display: 'block' }} />
          </button>
        ))}
      </div>

      {/* Bottom toolbar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(to top, rgba(4,6,15,0.98) 60%, rgba(4,6,15,0))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, zIndex: 50, flexWrap: 'wrap',
      }}>
        {/* Play/Pause + speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={togglePause} style={{
            width: 32, height: 32, background: 'var(--accent)', border: 'none',
            color: '#000', cursor: 'pointer', fontFamily: 'var(--ff-mono)', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {paused ? '▶' : '⏸'}
          </button>
          {SPEEDS.slice(1).map(s => (
            <Btn key={s.value} onClick={() => { setTimeSpeed(s.value); }} active={timeSpeed === s.value && !paused}>
              {s.label}
            </Btn>
          ))}
        </div>

        {/* View toggles */}
        <div style={{ display: 'flex', gap: 4 }}>
          <Toggle on={showOrbits} onClick={toggleOrbits}>ORBIT</Toggle>
          <Toggle on={showLabels} onClick={toggleLabels}>LABEL</Toggle>
          <Toggle on={showAsteroidBelt} onClick={toggleAsteroidBelt}>ASTEROID</Toggle>
        </div>

        {/* Hint */}
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.15em', textAlign: 'right', lineHeight: 1.8 }}>
          <div>SCROLL ZOOM · DRAG ORBIT</div>
          <div>KLIK PLANET UNTUK INFO</div>
        </div>
      </div>

      {/* Crosshair decoration */}
      <div style={{ position:'fixed', bottom:80, right:20, zIndex:50, pointerEvents:'none', opacity:0.12 }}>
        <div style={{ fontFamily:'var(--ff-mono)', fontSize:32, color:'var(--text)', lineHeight:1 }}>⊕</div>
      </div>
    </>
  );
}
