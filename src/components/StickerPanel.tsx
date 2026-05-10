import { fabric } from 'fabric'
import { useStore } from '../store/useStore'
import { STICKER_CATEGORIES, WASHI_PATTERNS } from '../data/stickers'

export default function StickerPanel() {
  const { tool, stickerCategory, setStickerCategory } = useStore()

  if (tool !== 'sticker' && tool !== 'washi') return null

  const addSticker = (emoji: string) => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const text = new fabric.Text(emoji, {
      left: fc.getWidth() / 2 - 30,
      top: fc.getHeight() / 2 - 30,
      fontSize: 52,
      selectable: true,
      data: { type: 'sticker' },
    })
    fc.add(text)
    fc.setActiveObject(text)
    fc.renderAll()
    localStorage.setItem('notes_canvas_data', JSON.stringify(fc.toJSON(['data'])))
  }

  const addWashi = (pattern: typeof WASHI_PATTERNS[0]) => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const cx = fc.getWidth() / 2
    const cy = fc.getHeight() / 2
    const tape = new fabric.Rect({ width: 220, height: 30, fill: pattern.bg, rx: 4, ry: 4 })
    const tapeLabel = new fabric.Text((pattern.pattern + ' ').repeat(8), {
      fontSize: 13, fill: pattern.color, top: 6, left: 8, fontFamily: 'Nunito',
    })
    const grp = new fabric.Group([tape, tapeLabel], {
      left: cx - 110, top: cy - 15, opacity: 0.88, data: { type: 'washi' },
    })
    fc.add(grp)
    fc.setActiveObject(grp)
    fc.renderAll()
    localStorage.setItem('notes_canvas_data', JSON.stringify(fc.toJSON(['data'])))
  }

  const currentCategory = STICKER_CATEGORIES.find(c => c.id === stickerCategory) || STICKER_CATEGORIES[0]

  if (tool === 'washi') {
    return (
      <div className="glass anim-slide" data-scroll style={{
        position:'fixed', right:8, top:'50%', transform:'translateY(-50%)',
        width:200, borderRadius:18, padding:14, zIndex:50, maxHeight:'80vh', overflowY:'auto',
      }}>
        <div className="section-label" style={{marginBottom:10}}>🎀 Washi Tape</div>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {WASHI_PATTERNS.map(p => (
            <button key={p.id} onClick={() => addWashi(p)} style={{
              padding:'10px 14px', borderRadius:10, border:`1px solid ${p.color}40`,
              background:p.bg, cursor:'pointer', display:'flex', alignItems:'center',
              gap:10, fontSize:'0.85rem', fontFamily:'Nunito', transition:'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <span style={{fontSize:'1.1rem'}}>{p.pattern.slice(0,4)}</span>
              <span style={{color:p.color, fontWeight:700}}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{position:'fixed', right:8, top:70, bottom:8, display:'flex', gap:8, zIndex:50}}>
      {/* Category tabs */}
      <div className="glass" data-scroll style={{
        width:52, borderRadius:16, padding:'8px 6px', display:'flex',
        flexDirection:'column', gap:4, alignItems:'center', overflowY:'auto',
      }}>
        {STICKER_CATEGORIES.map(cat => (
          <button key={cat.id} className={`tool-btn ${stickerCategory===cat.id?'active':''}`}
            onClick={() => setStickerCategory(cat.id)} title={cat.label} style={{fontSize:'1.25rem'}}>
            {cat.icon}
          </button>
        ))}
      </div>

      {/* Sticker grid */}
      <div className="glass anim-fade" data-scroll style={{
        width:186, borderRadius:16, padding:'10px 8px', overflowY:'auto',
        display:'flex', flexDirection:'column', gap:6,
      }}>
        <div className="section-label">{currentCategory.label}</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
          {currentCategory.stickers.map(s => (
            <button key={s.id} onClick={() => addSticker(s.emoji)} title={s.label}
              style={{
                aspectRatio:'1', borderRadius:10, border:'1px solid transparent',
                background:'transparent', cursor:'pointer', fontSize:'1.65rem',
                display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--surface-hover)'; e.currentTarget.style.transform='scale(1.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='scale(1)' }}>
              {s.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
