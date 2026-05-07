import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/components/App'), {
  ssr: false,
  loading: () => (
    <div style={{ width:'100vw', height:'100vh', background:'#04060f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, fontFamily:'monospace' }}>
      <div style={{ fontSize:11, letterSpacing:'0.4em', color:'#6a7a90' }}>HELIOSPHERE</div>
      <div style={{ width:1, height:60, background:'linear-gradient(to bottom, transparent, #e8f040)', animation:'scanline 1.5s ease infinite' }} />
      <div style={{ fontSize:10, letterSpacing:'0.3em', color:'#2a3545' }}>INITIALIZING...</div>
      <style>{`@keyframes scanline{0%{opacity:0;transform:scaleY(0)}50%{opacity:1}100%{opacity:0;transform:scaleY(1)}}`}</style>
    </div>
  ),
});

export default function Page() { return <App />; }
