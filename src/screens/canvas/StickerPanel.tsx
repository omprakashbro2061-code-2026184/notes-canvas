import { fabric } from 'fabric'
import { useStore } from '../../store/useStore'
import { STICKER_PACKS } from '../../data/index'

export default function StickerPanel() {
  const { stickerCategory, setStickerCategory, showToast, closePanel } = useStore()

  const addSticker = (emoji: string, name: string) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const txt = new fabric.Text(emoji, {
      left: fc.getWidth() / 2 - 35,
      top: fc.getHeight() / 2 - 35,
      fontSize: 70,
      selectable: true,
      data: { type: 'sticker', name },
    })
    fc.add(txt)
    fc.setActiveObject(txt)
    fc.renderAll()
    const json = JSON.stringify(fc.toJSON(['data']))
    const id = useStore.getState().activeCanvasId
    if (id) localStorage.setItem('mc_cv_' + id, json)
    showToast(name + ' added ✓')
  }

  const currentPack = STICKER_PACKS.find(p => p.id === stickerCategory) || STICKER_PACKS[0]

  return (
    <>
      <div style={{ position:'fixed', inset:0, zIndex:74 }} onClick={closePanel} />
      <div className="glass anim-slide" onClick={(e: any) => e.stopPropagation()}
        style={{
          position:'fixed', bottom:0, left:0, right:0,
          borderRadius:'20px 20px 0 0', zIndex:75,
          maxHeight:'68vh', display:'flex', flexDirection:'column',
        }}>

        <div style={{ padding:'10px 16px 0', flexShrink:0 }}>
          <div className="panel-handle" />
        </div>

        <div style={{ padding:'4px 14px 8px', flexShrink:0 }}>
          <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text)', marginBottom:6 }}>
            Sticker Packs
          </div>
          {/* Category pills */}
          <div className="scroll-x" style={{ display:'flex', gap:6 }}>
            {STICKER_PACKS.map(pack => (
              <button key={pack.id} onClick={() => setStickerCategory(pack.id)}
                style={{
                  padding:'6px 12px', borderRadius:100, border:'none',
                  cursor:'pointer', flexShrink:0, fontFamily:'Nunito',
                  fontSize:'0.8rem', fontWeight:700, whiteSpace:'nowrap',
                  background: stickerCategory === pack.id ? 'var(--accent)' : 'var(--surface)',
                  color: stickerCategory === pack.id ? '#fff' : 'var(--text2)',
                }}>
                {pack.icon} {pack.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sticker grid */}
        <div className="scroll-y" style={{ flex:1, padding:'0 14px 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {currentPack.items.map(item => (
              <button key={item.id}
                onClick={() => addSticker(item.e, item.name)}
                style={{
                  aspectRatio:'1', borderRadius:14,
                  border:'1px solid var(--border)',
                  background:'var(--surface)', cursor:'pointer',
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  gap:4, transition:'all 0.12s',
                }}
                onPointerDown={(e: any) => {
                  e.currentTarget.style.transform = 'scale(0.88)'
                  e.currentTarget.style.background = 'var(--surface2)'
                }}
                onPointerUp={(e: any) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}>
                <span style={{ fontSize:'2.2rem', lineHeight:1 }}>{item.e}</span>
                <span style={{ fontSize:'0.6rem', color:'var(--text3)', fontWeight:700 }}>
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
