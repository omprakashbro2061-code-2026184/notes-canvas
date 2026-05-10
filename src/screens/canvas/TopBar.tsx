import { useState } from 'react'
import { useStore } from '../../store/useStore'

interface Props {
  onBack: () => void
  onExport: () => void
  onClear: () => void
  onUndo: () => void
  onRedo: () => void
}

export default function TopBar({ onBack, onExport, onClear, onUndo, onRedo }: Props) {
  const { activeCanvasId, files } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const file = files.find(f => f.id === activeCanvasId)

  return (
    <>
      <div className="glass" style={{
        position:'fixed', top:0, left:0, right:0,
        height:52, display:'flex', alignItems:'center',
        padding:'0 8px', gap:4, zIndex:60,
        paddingTop:'env(safe-area-inset-top, 0px)',
      }}>
        {/* Back */}
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:10,
          background:'var(--surface)', border:'1px solid var(--border)',
          color:'var(--text)', fontSize:'1rem', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0,
        }}>←</button>

        {/* Title */}
        <div style={{
          flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          fontWeight:700, fontSize:'0.88rem', color:'var(--text)', padding:'0 6px',
        }}>
          {file?.name || 'Canvas'}
        </div>

        {/* Undo / Redo */}
        <button onClick={onUndo} title="Undo" style={{
          width:36, height:36, borderRadius:9, background:'transparent',
          border:'1px solid var(--border)', color:'var(--text2)',
          cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center',
        }}>↩</button>
        <button onClick={onRedo} title="Redo" style={{
          width:36, height:36, borderRadius:9, background:'transparent',
          border:'1px solid var(--border)', color:'var(--text2)',
          cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center',
        }}>↪</button>

        {/* Menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          width:36, height:36, borderRadius:9, background:'transparent',
          border:'1px solid var(--border)', color:'var(--text2)',
          cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center',
        }}>⋯</button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:70 }} onClick={() => setMenuOpen(false)} />
          <div className="glass anim-in" style={{
            position:'fixed', top:56, right:8, width:190, borderRadius:14,
            padding:8, zIndex:80, display:'flex', flexDirection:'column', gap:2,
          }}>
            {[
              { label:'📷 Export PNG', fn: () => { onExport(); setMenuOpen(false) } },
              { label:'🗑 Clear Canvas', fn: () => { onClear(); setMenuOpen(false) }, danger: true },
            ].map(item => (
              <button key={item.label} onClick={item.fn} style={{
                padding:'11px 14px', borderRadius:10, border:'none', cursor:'pointer',
                background:'transparent', color: item.danger ? '#f87171' : 'var(--text)',
                fontSize:'0.88rem', fontFamily:'Nunito', fontWeight:600, textAlign:'left',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
