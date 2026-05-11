import { useState } from 'react'
import { useStore } from '../../store/useStore'

interface Props {
  onBack: () => void
  onUndo: () => void
  onRedo: () => void
}

export default function TopBar({ onBack, onUndo, onRedo }: Props) {
  const { activeCanvasId, files, showToast } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const file = files.find(f => f.id === activeCanvasId)

  const exportPNG = () => {
    const fc = (window as any).__fc
    if (!fc) return
    try {
      const url = fc.toDataURL({ format:'png', multiplier:2, quality:1 })
      const a = document.createElement('a')
      a.href = url
      a.download = (file?.name || 'canvas') + '.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showToast('Exported! Check Downloads 📷')
    } catch(e) {
      showToast('Export failed — try smaller canvas')
    }
    setMenuOpen(false)
  }

  const groupSelected = () => {
    const fc = (window as any).__fc
    if (!fc) return
    const objs = fc.getActiveObjects()
    if (objs.length < 2) { showToast('Select 2+ objects to group'); return }
    fc.discardActiveObject()
    const grp = new (window as any).fabric.Group(objs, { data:{ type:'group' } })
    objs.forEach((o: any) => fc.remove(o))
    fc.add(grp); fc.setActiveObject(grp); fc.renderAll()
    showToast('Grouped ✓')
    setMenuOpen(false)
  }

  const ungroupSelected = () => {
    const fc = (window as any).__fc
    if (!fc) return
    const obj = fc.getActiveObject() as any
    if (!obj || obj.type !== 'group') { showToast('Select a group first'); return }
    obj.toActiveSelection()
    fc.requestRenderAll()
    showToast('Ungrouped ✓')
    setMenuOpen(false)
  }

  const duplicateSelected = () => {
    const fc = (window as any).__fc
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) { showToast('Select something first'); return }
    obj.clone((cloned: any) => {
      cloned.set({ left:(obj.left||0)+24, top:(obj.top||0)+24 })
      fc.add(cloned); fc.setActiveObject(cloned); fc.renderAll()
    })
    showToast('Duplicated ✓')
    setMenuOpen(false)
  }

  const deleteSelected = () => {
    const fc = (window as any).__fc
    if (!fc) return
    const objs = fc.getActiveObjects()
    if (!objs.length) { showToast('Select something first'); return }
    objs.forEach((o: any) => fc.remove(o))
    fc.discardActiveObject(); fc.renderAll()
    showToast('Deleted')
    setMenuOpen(false)
  }

  return (
    <>
      <div className="glass" style={{
        position:'fixed', top:0, left:0, right:0, height:52,
        display:'flex', alignItems:'center', padding:'0 8px', gap:4,
        zIndex:60, paddingTop:'env(safe-area-inset-top,0px)',
      }}>
        {/* Back */}
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:10,
          background:'var(--surface)', border:'1px solid var(--border)',
          color:'var(--text)', fontSize:'1.1rem', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>←</button>

        {/* Title */}
        <div style={{
          flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          fontWeight:700, fontSize:'0.88rem', color:'var(--text)', padding:'0 6px',
        }}>
          {file?.name || 'Canvas'}
        </div>

        {/* Undo Redo */}
        {[{fn:onUndo,icon:'↩',tip:'Undo'},{fn:onRedo,icon:'↪',tip:'Redo'}].map(b=>(
          <button key={b.tip} onClick={b.fn} title={b.tip} style={{
            width:36, height:36, borderRadius:9,
            background:'transparent', border:'1px solid var(--border)',
            color:'var(--text2)', cursor:'pointer', fontSize:'1rem',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{b.icon}</button>
        ))}

        {/* Menu */}
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{
          width:36, height:36, borderRadius:9,
          background: menuOpen ? 'var(--surface2)' : 'transparent',
          border:'1px solid var(--border)',
          color:'var(--text2)', cursor:'pointer', fontSize:'1.2rem',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>⋯</button>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:70 }} onClick={()=>setMenuOpen(false)} />
          <div className="glass anim-in" style={{
            position:'fixed', top:56, right:8, width:200,
            borderRadius:14, padding:8, zIndex:80,
            display:'flex', flexDirection:'column', gap:2,
          }}>
            {[
              { label:'📷 Export PNG',   fn: exportPNG        },
              { label:'⧉ Duplicate',     fn: duplicateSelected },
              { label:'⊞ Group',         fn: groupSelected     },
              { label:'⊟ Ungroup',       fn: ungroupSelected   },
              { label:'🗑 Delete',        fn: deleteSelected, danger:true },
            ].map(item=>(
              <button key={item.label} onClick={item.fn} style={{
                padding:'11px 14px', borderRadius:10, border:'none', cursor:'pointer',
                background:'transparent', fontFamily:'Nunito',
                color: item.danger ? '#f87171' : 'var(--text)',
                fontSize:'0.88rem', fontWeight:600, textAlign:'left', transition:'background 0.15s',
              }}
              onMouseEnter={(e:any)=>e.currentTarget.style.background='var(--surface)'}
              onMouseLeave={(e:any)=>e.currentTarget.style.background='transparent'}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
