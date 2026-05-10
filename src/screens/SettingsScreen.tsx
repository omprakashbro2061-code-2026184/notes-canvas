import { useStore } from '../store/useStore'
import { THEMES } from '../data/index'

export default function SettingsScreen() {
  const { theme, setTheme, bgTexture, setBgTexture, setScreen } = useStore()

  return (
    <div style={{
      width:'100vw', height:'100vh', background:'var(--bg)',
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding:'52px 20px 16px',
        borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:14, flexShrink:0,
      }}>
        <button onClick={() => setScreen('home')}
          style={{ width:40, height:40, borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)',
            color:'var(--text)', cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ←
        </button>
        <div style={{ fontWeight:800, fontSize:'1.2rem' }}>Settings</div>
      </div>

      <div className="scroll-y" style={{ flex:1, padding:20, display:'flex', flexDirection:'column', gap:24 }}>

        {/* Theme */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:10 }}>App Theme</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id as typeof theme)}
                style={{
                  padding:'14px 16px', borderRadius:14, cursor:'pointer',
                  border:`1.5px solid ${theme === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: theme === t.id ? 'rgba(167,139,250,0.10)' : 'var(--surface)',
                  display:'flex', alignItems:'center', gap:14, textAlign:'left',
                  transition:'all 0.15s',
                }}>
                <span style={{ fontSize:'1.4rem', flexShrink:0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.92rem',
                    color: theme === t.id ? 'var(--accent)' : 'var(--text)' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:2 }}>{t.desc}</div>
                </div>
                {theme === t.id && (
                  <div style={{ marginLeft:'auto', color:'var(--accent)', fontSize:'1.1rem' }}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Default canvas background */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:10 }}>Default Canvas Texture</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { id:'none',  label:'Plain',     icon:'⬛' },
              { id:'dots',  label:'Dot Grid',  icon:'·  ·' },
              { id:'grid',  label:'Graph',     icon:'⊞' },
              { id:'lines', label:'Lines',     icon:'≡' },
            ].map(tx => (
              <button key={tx.id} onClick={() => setBgTexture(tx.id as typeof bgTexture)}
                style={{
                  padding:'14px', borderRadius:12, cursor:'pointer',
                  border:`1.5px solid ${bgTexture === tx.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: bgTexture === tx.id ? 'rgba(167,139,250,0.10)' : 'var(--surface)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                }}>
                <span style={{ fontSize:'1.2rem', color: bgTexture === tx.id ? 'var(--accent)' : 'var(--text2)' }}>
                  {tx.icon}
                </span>
                <span style={{ fontSize:'0.78rem', fontWeight:700,
                  color: bgTexture === tx.id ? 'var(--accent)' : 'var(--text2)' }}>
                  {tx.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{
          padding:16, borderRadius:14, background:'var(--surface)',
          border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:8,
        }}>
          <div style={{ fontWeight:800, fontSize:'0.88rem' }}>MyCanvas</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text2)', lineHeight:1.7 }}>
            Fully offline · No tracking · No ads · No account needed.{'\n'}
            All data stays on your device.
          </div>
          <div style={{ fontSize:'0.72rem', color:'var(--text3)' }}>v2.0.0</div>
        </div>

      </div>
    </div>
  )
}
