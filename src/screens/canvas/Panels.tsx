import { fabric } from 'fabric'
import { useStore } from '../../store/useStore'
import { PEN_COLORS, FONTS, NOTE_STYLES, WASHI_PATTERNS } from '../../data/index'

// ── Shared bottom sheet ─────────────────────────────────────────────────────
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ position:'fixed', inset:0, zIndex:74 }}
        onClick={() => useStore.getState().closePanel()} />
      <div className="glass anim-slide" onClick={(e: any) => e.stopPropagation()}
        style={{
          position:'fixed', bottom:0, left:0, right:0,
          borderRadius:'20px 20px 0 0', zIndex:75,
          display:'flex', flexDirection:'column',
          paddingBottom:'env(safe-area-inset-bottom,0px)',
        }}>
        <div style={{ padding:'10px 16px 4px', flexShrink:0 }}>
          <div className="panel-handle" />
          <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text)', marginBottom:4 }}>
            {title}
          </div>
        </div>
        <div className="scroll-y" style={{ padding:'4px 16px 16px', maxHeight:'55vh' }}>
          {children}
        </div>
      </div>
    </>
  )
}

// ── Color row ────────────────────────────────────────────────────────────────
function ColorRow({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="scroll-x" style={{ display:'flex', gap:6, paddingBottom:4 }}>
      {PEN_COLORS.map(c => (
        <div key={c} className={`swatch ${value===c?'on':''}`}
          style={{ background:c, boxShadow:value===c?`0 0 10px ${c}`:undefined, flexShrink:0 }}
          onClick={() => onChange(c)} />
      ))}
      <label style={{ flexShrink:0, cursor:'pointer' }}>
        <div className="swatch"
          style={{ background:'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)',
            flexShrink:0, position:'relative' }} />
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position:'absolute', opacity:0, width:0, height:0 }} />
      </label>
    </div>
  )
}

// ── PEN PANEL ────────────────────────────────────────────────────────────────
export function PenPanel() {
  const { penColor, setPenColor, penSize, setPenSize, penOpacity, setPenOpacity, tool } = useStore()
  const toolName = tool === 'pen' ? 'Pen' : tool === 'marker' ? 'Marker' : 'Highlighter'
  return (
    <Panel title={`${toolName} Settings`}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Color</div>
          <ColorRow value={penColor} onChange={setPenColor} />
        </div>
        <div style={{
          height: Math.max(6, Math.min(penSize, 28)), borderRadius:100,
          background: penColor, opacity: penOpacity,
          boxShadow:`0 0 14px ${penColor}`, transition:'all 0.2s',
        }} />
        <div>
          <div className="sec-lbl" style={{ marginBottom:6 }}>Size — {penSize}px</div>
          <input type="range" className="slider" min={1} max={60} value={penSize}
            onChange={e => setPenSize(+e.target.value)} />
        </div>
        <div>
          <div className="sec-lbl" style={{ marginBottom:6 }}>
            Opacity — {Math.round(penOpacity*100)}%
          </div>
          <input type="range" className="slider" min={0.05} max={1} step={0.05}
            value={penOpacity} onChange={e => setPenOpacity(+e.target.value)} />
        </div>
      </div>
    </Panel>
  )
}

// ── TEXT PANEL ───────────────────────────────────────────────────────────────
export function TextPanel() {
  const { textFormat, updateText } = useStore()

  const apply = (updates: Partial<typeof textFormat>) => {
    updateText(updates)
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) return
    const map: Record<string,unknown> = {}
    if ('bold'          in updates) map.fontWeight  = updates.bold ? 'bold' : 'normal'
    if ('italic'        in updates) map.fontStyle   = updates.italic ? 'italic' : 'normal'
    if ('underline'     in updates) map.underline   = updates.underline
    if ('strikethrough' in updates) map.linethrough = updates.strikethrough
    if ('fontSize'      in updates) map.fontSize    = updates.fontSize
    if ('fontFamily'    in updates) map.fontFamily  = updates.fontFamily
    if ('color'         in updates) map.fill        = updates.color
    if ('align'         in updates) map.textAlign   = updates.align
    obj.set(map as any); fc.renderAll()
    // save
    const id = useStore.getState().activeCanvasId
    if (id) localStorage.setItem('mc_cv_'+id, JSON.stringify(fc.toJSON(['data'])))
  }

  const FBtn = ({ active, onClick, children, style={} }: any) => (
    <button onClick={onClick} style={{
      minWidth:38, height:38, borderRadius:8, border:'none', cursor:'pointer',
      background: active ? 'rgba(167,139,250,0.22)' : 'var(--surface)',
      color: active ? 'var(--accent)' : 'var(--text2)',
      fontFamily:'Nunito', fontWeight:700, fontSize:'0.9rem',
      display:'flex', alignItems:'center', justifyContent:'center',
      transition:'all 0.15s', ...style,
    }}>{children}</button>
  )

  return (
    <Panel title="Text Format">
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

        {/* Font */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Font</div>
          <div className="scroll-x" style={{ display:'flex', gap:6 }}>
            {FONTS.map(f => (
              <button key={f.value}
                onClick={() => apply({ fontFamily: f.value })}
                style={{
                  padding:'7px 13px', borderRadius:8, border:'none', cursor:'pointer',
                  flexShrink:0, fontFamily:f.value, fontSize:'0.88rem', fontWeight:600,
                  background: textFormat.fontFamily===f.value ? 'rgba(167,139,250,0.22)' : 'var(--surface)',
                  color: textFormat.fontFamily===f.value ? 'var(--accent)' : 'var(--text2)',
                  whiteSpace:'nowrap',
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Size — {textFormat.fontSize}px</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => apply({ fontSize: Math.max(8, textFormat.fontSize-2) })}
              style={{ width:38, height:38, borderRadius:8, border:'none',
                background:'var(--surface)', color:'var(--text)', cursor:'pointer',
                fontSize:'1.2rem', fontWeight:800, fontFamily:'Nunito' }}>−</button>
            <input type="range" className="slider" style={{ flex:1 }}
              min={8} max={120} value={textFormat.fontSize}
              onChange={e => apply({ fontSize:+e.target.value })} />
            <button onClick={() => apply({ fontSize: Math.min(120, textFormat.fontSize+2) })}
              style={{ width:38, height:38, borderRadius:8, border:'none',
                background:'var(--surface)', color:'var(--text)', cursor:'pointer',
                fontSize:'1.2rem', fontWeight:800, fontFamily:'Nunito' }}>+</button>
          </div>
        </div>

        {/* B I U S */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Style</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <FBtn active={textFormat.bold}
              onClick={() => apply({ bold:!textFormat.bold })}
              style={{ fontWeight:900, fontSize:'1rem' }}>B</FBtn>
            <FBtn active={textFormat.italic}
              onClick={() => apply({ italic:!textFormat.italic })}
              style={{ fontStyle:'italic' }}>I</FBtn>
            <FBtn active={textFormat.underline}
              onClick={() => apply({ underline:!textFormat.underline })}
              style={{ textDecoration:'underline' }}>U</FBtn>
            <FBtn active={textFormat.strikethrough}
              onClick={() => apply({ strikethrough:!textFormat.strikethrough })}
              style={{ textDecoration:'line-through' }}>S</FBtn>
            <div style={{ width:1, background:'var(--border)', margin:'0 2px' }} />
            <FBtn active={textFormat.align==='left'}
              onClick={() => apply({ align:'left' })}>≡</FBtn>
            <FBtn active={textFormat.align==='center'}
              onClick={() => apply({ align:'center' })}>☰</FBtn>
            <FBtn active={textFormat.align==='right'}
              onClick={() => apply({ align:'right' })}>≡</FBtn>
          </div>
        </div>

        {/* Color */}
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Color</div>
          <ColorRow value={textFormat.color} onChange={c => apply({ color:c })} />
        </div>

      </div>
    </Panel>
  )
}

// ── SHAPE PANEL ──────────────────────────────────────────────────────────────
export function ShapePanel() {
  const { shapeType, setShapeType, penColor, setPenColor, shapeFill, setShapeFill } = useStore()
  const shapes = [
    { id:'rect',     icon:'▭', label:'Rect'     },
    { id:'circle',   icon:'○', label:'Circle'   },
    { id:'triangle', icon:'△', label:'Triangle' },
    { id:'diamond',  icon:'◇', label:'Diamond'  },
    { id:'pentagon', icon:'⬠', label:'Pentagon' },
    { id:'star',     icon:'☆', label:'Star'     },
    { id:'arrow',    icon:'→', label:'Arrow'    },
  ]
  return (
    <Panel title="Shape">
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Type</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
            {shapes.map(s => (
              <button key={s.id} onClick={() => setShapeType(s.id as any)}
                style={{
                  padding:'10px 4px', borderRadius:10, cursor:'pointer', border:'none',
                  background: shapeType===s.id ? 'rgba(167,139,250,0.2)' : 'var(--surface)',
                  color: shapeType===s.id ? 'var(--accent)' : 'var(--text2)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                  fontSize:'1.3rem', fontFamily:'Nunito',
                }}>
                {s.icon}
                <span style={{ fontSize:'0.6rem', fontWeight:700 }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Stroke</div>
          <ColorRow value={penColor} onChange={setPenColor} />
        </div>
        <div>
          <div className="sec-lbl" style={{ marginBottom:8 }}>Fill</div>
          <div className="scroll-x" style={{ display:'flex', gap:6 }}>
            <div onClick={() => setShapeFill('transparent')}
              style={{
                width:28, height:28, borderRadius:'50%', cursor:'pointer', flexShrink:0,
                background:'transparent', fontSize:'0.65rem', color:'var(--text2)',
                border:`2px solid ${shapeFill==='transparent'?'#fff':'var(--border2)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>∅</div>
            {PEN_COLORS.map(c => (
              <div key={c} className={`swatch ${shapeFill===c?'on':''}`}
                style={{ background:c, flexShrink:0 }}
                onClick={() => setShapeFill(c)} />
            ))}
          </div>
        </div>
        <p style={{ fontSize:'0.75rem', color:'var(--text3)' }}>
          Tap canvas to place shape
        </p>
      </div>
    </Panel>
  )
}

// ── NOTE PANEL ───────────────────────────────────────────────────────────────
export function NotePanel() {
  const { noteStyle, setNoteStyle } = useStore()
  return (
    <Panel title="Sticky Note Style">
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <p style={{ fontSize:'0.78rem', color:'var(--text2)' }}>
          Choose a style then tap the canvas to place. Double-tap a note to type inside it.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {NOTE_STYLES.map(n => (
            <button key={n.name} onClick={() => setNoteStyle(n)}
              style={{
                padding:'12px 6px', borderRadius:12, cursor:'pointer',
                background: n.bg,
                border:`2.5px solid ${noteStyle.bg===n.bg ? n.border : 'transparent'}`,
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                boxShadow: noteStyle.bg===n.bg ? `0 0 16px ${n.border}60` : 'none',
                transition:'all 0.15s', position:'relative', overflow:'hidden',
              }}>
              <div style={{
                position:'absolute', top:0, right:0, width:14, height:14,
                background: n.border, opacity:0.5,
                clipPath:'polygon(100% 0, 100% 100%, 0 0)',
              }} />
              <span style={{ fontSize:'0.72rem', fontWeight:800, color:n.text }}>{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── WASHI PANEL ──────────────────────────────────────────────────────────────
export function WashiPanel() {
  const { showToast, closePanel } = useStore()
  const addWashi = (p: typeof WASHI_PATTERNS[0]) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const cx = fc.getWidth()/2, cy = fc.getHeight()/2
    const tape = new fabric.Rect({ width:250, height:32, fill:p.bg, rx:4, ry:4 })
    const txt  = new fabric.Text((p.symbol+'  ').repeat(14), {
      fontSize:13, fill:p.color, top:7, left:6, fontFamily:'Nunito',
    })
    const grp = new fabric.Group([tape,txt], {
      left:cx-125, top:cy-16, data:{type:'washi'},
    })
    fc.add(grp); fc.setActiveObject(grp); fc.renderAll()
    showToast(p.name+' tape added!'); closePanel()
  }
  return (
    <Panel title="Washi Tape">
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {WASHI_PATTERNS.map(p => (
          <button key={p.id} onClick={() => addWashi(p)}
            style={{
              padding:'13px 16px', borderRadius:12,
              border:`1px solid ${p.color}40`, background:p.bg,
              cursor:'pointer', display:'flex', alignItems:'center', gap:12,
              fontFamily:'Nunito', transition:'transform 0.12s',
            }}
            onPointerDown={(e:any) => e.currentTarget.style.transform='scale(0.97)'}
            onPointerUp={(e:any)   => e.currentTarget.style.transform='scale(1)'}>
            <span style={{ fontSize:'1.2rem' }}>{p.symbol.repeat(4)}</span>
            <span style={{ fontWeight:700, color:p.color, fontSize:'0.9rem' }}>{p.name}</span>
          </button>
        ))}
      </div>
    </Panel>
  )
}
