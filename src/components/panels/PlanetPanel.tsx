'use client';
import { useStore } from '@/lib/store';

function Bar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em', fontFamily: 'var(--ff-mono)' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--text)', fontFamily: 'var(--ff-mono)' }}>{value > 0 ? '+' : ''}{value} {unit}</span>
      </div>
      <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: value < 0 ? '#4080f0' : value > 200 ? '#f04040' : 'var(--accent)', transition: 'width 0.6s ease', borderRadius: 1 }} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--ff-mono)', letterSpacing: '0.12em', flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--text)', fontFamily: 'var(--ff-mono)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = { rocky: 'PLANET BERBATU', gas: 'RAKSASA GAS', ice: 'RAKSASA ES' };

export default function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet, sidebarOpen } = useStore();

  if (!selectedPlanet) return null;
  const p = selectedPlanet;

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 300,
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      zIndex: 100, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', letterSpacing: '0.35em', marginBottom: 6 }}>
              {TYPE_LABEL[p.type]}
            </div>
            <div style={{ fontSize: 24, fontFamily: 'var(--ff-display)', fontWeight: 800, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {p.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--ff-mono)', marginTop: 4, letterSpacing: '0.2em' }}>
              {p.latinName}
            </div>
          </div>
          <button onClick={() => setSelectedPlanet(null)} style={{
            background: 'none', border: '1px solid var(--border)', color: 'var(--text-dim)',
            width: 28, height: 28, cursor: 'pointer', fontFamily: 'var(--ff-mono)', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
        </div>
      </div>

      {/* Planet visual circle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 16px', flexShrink: 0 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${p.color2}, ${p.color})`,
          boxShadow: `0 0 30px ${p.color}40, 0 0 60px ${p.color}15`,
          position: 'relative',
        }}>
          {p.rings && (
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 130, height: 20, border: `1px solid ${p.color}88`,
              borderRadius: '50%', transform: 'translate(-50%, -50%) rotateX(75deg)',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {/* Fun fact */}
        <div style={{ background: 'rgba(232,240,64,0.05)', border: '1px solid rgba(232,240,64,0.12)', padding: '10px 12px', marginBottom: 16, borderRadius: 2 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', letterSpacing: '0.3em', marginBottom: 5 }}>FAKTA MENARIK</div>
          <p style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'var(--ff-body)' }}>{p.funFact}</p>
        </div>

        {/* Temperature bars */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--ff-mono)', color: 'var(--text-faint)', letterSpacing: '0.3em', marginBottom: 10 }}>SUHU PERMUKAAN</div>
          <Bar label="MINIMUM" value={p.surfaceTempMin} max={500} unit="°C" />
          <Bar label="RATA-RATA" value={p.surfaceTempAvg} max={500} unit="°C" />
          <Bar label="MAKSIMUM" value={p.surfaceTempMax} max={500} unit="°C" />
        </div>

        {/* Data rows */}
        <div style={{ fontSize: 9, fontFamily: 'var(--ff-mono)', color: 'var(--text-faint)', letterSpacing: '0.3em', marginBottom: 6 }}>DATA ORBITAL & FISIK</div>
        <Row label="DIAMETER" value={`${p.diameterKm.toLocaleString('id')} km`} />
        <Row label="MASSA" value={`${p.massEarth}× Bumi`} />
        <Row label="JARAK MATAHARI" value={`${p.distanceAU} AU`} />
        <Row label="PERIODE ORBIT" value={p.orbitalPeriodDays > 365 ? `${(p.orbitalPeriodDays/365.25).toFixed(2)} thn` : `${p.orbitalPeriodDays.toFixed(2)} hari`} />
        <Row label="PERIODE ROTASI" value={`${Math.abs(p.rotationPeriodHours).toFixed(1)} jam${p.rotationPeriodHours < 0 ? ' ↺' : ''}`} />
        <Row label="KEMIRINGAN AKSIAL" value={`${p.axialTiltDeg}°`} />
        <Row label="EKSENTRISITAS" value={p.eccentricity.toFixed(4)} />
        <Row label="INKLINASI" value={`${p.inclination}°`} />
        <Row label="GRAVITASI" value={`${p.gravityMs2} m/s²`} />
        <Row label="KECEPATAN LEPAS" value={`${p.escapeVelocityKms} km/s`} />
        <Row label="JUMLAH BULAN" value={`${p.moons}`} />
        <Row label="CINCIN" value={p.rings ? 'Ya' : 'Tidak'} />
        <div style={{ marginTop: 8 }}>
          <Row label="ATMOSFER" value={p.atmosphereMain} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontFamily: 'var(--ff-mono)', color: 'var(--text-faint)', letterSpacing: '0.2em' }}>
          SRC: NASA / JPL-CALTECH
        </div>
      </div>
    </div>
  );
}
