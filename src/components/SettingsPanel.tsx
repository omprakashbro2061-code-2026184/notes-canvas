import { useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from '../store/useStore'
import { THEMES } from '../data/stickers'

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme, bgTexture, setBgTexture, showToast } = useStore()

  const exportPNG = () => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const url = fc.toDataURL({ format: 'png', multiplier: 2 })
    const a = document.createElement('a')
    a.href = url
    a.download = `notes-${Date.now()}.png`
    a.click()
    showToast('Exported as PNG 🎨')
    setOpen(false)
  }

  const exportJSON = () => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const json = JSON.stringify(fc.toJSON(['data']), null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `notes-${Date.now()}.json`
    a.click()
    showToast('Canvas saved as JSON 💾')
    setOpen(false)
  }

  const importJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const json = ev.target?.result as string
        const fc = (window as any).__fabricCanvas as fabric.Canvas | null
        if (!fc) return
        fc.loadFromJSON(json, () => {
          fc.renderAll()
          showToast('Canvas loaded ✅')
        })
      }
      reader.readAsText(file)
    }
    input.click()
    setOpen(false)
  }

  const clearAll = () => {
    if (!confirm('Clear everything? This cannot be undone.')) return
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    fc.clear()
    fc.renderAll()
    localStorage.removeItem('notes_canvas_data')
    showToast('Canvas cleared 🗑️')
    setOpen(false)
  }

  return (
    <>
      <button className="glass tool-btn"
        style={{ position:'fixed', top:8, right:8, width:44, height:44, borderRadius:12, fontSize:'1.1rem', zIndex:50 }}
        onClick={() => setOpen(!open)} title="Settings">
        ⚙
      </button>

      {open && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:80 }} onClick={() => setOpen(false)} />
          <div className="glass anim-fade" style={{
            position:'fixed', top:60, right:8, width:252, borderRadius:18,
            padding:16, zIndex:100, display:'flex', flexDirection:'column', gap:14,
          }}>

            {/* Mood themes */}
            <div>
              <div className="section-label" style={{ marginBottom:8 }}>🎨 Mood Theme</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id as typeof theme)}
                    style={{
                      padding:'9px 12px', borderRadius:10, cursor:'pointer', textAlign:'left',
                      border:`1px solid ${theme===t.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: theme===t.id ? 'rgba(167,139,250,0.12)' : 'transparent',
                      color: theme===t.id ? 'var(--accent)' : 'var(--text-muted)',
                      display:'flex', flexDirection:'column', gap:2, fontFamily:'Nunito',
                    }}>
                    <span style={{ fontWeight:600, fontSize:'0.88rem' }}>{t.label}</span>
                    <span style={{ fontSize:'0.71rem', opacity:0.7 }}>{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas texture */}
            <div>
              <div className="section-label" style={{ marginBottom:8 }}>📄 Canvas Texture</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[
                  { id:'none',     label:'⬛ Plain'    },
                  { id:'dots',     label:'· · Dots'    },
                  { id:'grid',     label:'⊞ Grid'      },
                  { id:'parchment',label:'📜 Parchment' },
                ].map(tx => (
                  <button key={tx.id} onClick={() => setBgTexture(tx.id as typeof bgTexture)}
                    style={{
                      padding:'8px 6px', borderRadius:8, cursor:'pointer',
                      border:`1px solid ${bgTexture===tx.id ? 'var(--accent)' : 'var(--border)'}`,
                      background: bgTexture===tx.id ? 'rgba(167,139,250,0.12)' : 'transparent',
                      color: bgTexture===tx.id ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize:'0.78rem', fontFamily:'Nunito',
                    }}>
                    {tx.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height:1, background:'var(--border)' }} />

            {/* File actions */}
            <div>
              <div className="section-label" style={{ marginBottom:8 }}>💾 File</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { label:'📷 Export PNG',     fn: exportPNG,  color:'var(--neon-green)',  bg:'rgba(52,211,153,0.08)' },
                  { label:'💾 Save JSON',      fn: exportJSON, color:'var(--neon-blue)',   bg:'rgba(96,165,250,0.08)' },
                  { label:'📂 Load JSON',      fn: importJSON, color:'var(--neon-purple)', bg:'rgba(167,139,250,0.08)' },
                  { label:'🗑️ Clear Canvas',  fn: clearAll,   color:'#f87171',            bg:'rgba(248,113,113,0.08)' },
                ].map(a => (
                  <button key={a.label} onClick={a.fn}
                    style={{
                      padding:'10px 14px', borderRadius:10, cursor:'pointer', textAlign:'left',
                      border:'1px solid var(--border)', background:a.bg, color:a.color,
                      fontSize:'0.85rem', fontFamily:'Nunito', fontWeight:600,
                    }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textAlign:'center', opacity:0.5 }}>
              Auto-saved to device storage ✓
            </div>
          </div>
        </>
      )}
    </>
  )
}
