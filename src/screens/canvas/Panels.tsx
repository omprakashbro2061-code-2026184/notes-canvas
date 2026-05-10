import { fabric } from 'fabric'
import { useStore } from '../../store/useStore'
import { PEN_COLORS, FONTS, NOTE_STYLES, WASHI_PATTERNS } from '../../data/index'

// ── Shared bottom sheet wrapper ──────────────────────────────────────────────
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overlay" style={{ alignItems: 'flex-end', zIndex: 75 }}
      onClick={() => useStore.getState().closePanel()}>
      <div className="glass bottom-panel anim-slide"
        style={{ width: '100%', maxWidth: 500 }}
        onClick={e => e.stopPropagation()}>
        <div className="panel-handle" />
        {children}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ── Color row ────────────────────────────────────────────────────────────────
function ColorRow({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="scroll-x" style={{ display: 'flex', gap: 6, paddingBottom: 4 }}>
      {PEN_COLORS.map(c => (
        <div key={c} className={`swatch ${value === c ? 'on' : ''}`}
          style={{ background: c, boxShadow: value === c ? `0 0 8px ${c}` : undefined, flexShrink: 0 }}
          onClick={() => onChange(c)} />
      ))}
      <label style={{ flexShrink: 0 }}>
        <div className="swatch" style={{
          background: `conic-gradient(red,yellow,lime,cyan,blue,magenta,red)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} />
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }} />
      </label>
    </div>
  )
}

// ── PEN PANEL ────────────────────────────────────────────────────────────────
export function PenPanel() {
  const { penColor, setPenColor, penSize, setPenSize, penOpacity, setPenOpacity } = useStore()
  return (
    <Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="sec-lbl">Color</div>
        <ColorRow value={penColor} onChange={setPenColor} />

        {/* Preview */}
        <div style={{
          height: Math.max(8, Math.min(penSize, 32)),
          borderRadius: 100, background: penColor, opacity: penOpacity,
          boxShadow: `0 0 12px ${penColor}`,
          transition: 'all 0.2s',
        }} />

        <div className="sec-lbl">Size — {penSize}px</div>
        <input type="range" className="slider" min={1} max={60} value={penSize}
          onChange={e => setPenSize(+e.target.value)} />

        <div className="sec-lbl">Opacity — {Math.round(penOpacity * 100)}%</div>
        <input type="range" className="slider" min={0.05} max={1} step={0.05} value={penOpacity}
          onChange={e => setPenOpacity(+e.target.value)} />
      </div>
    </Panel>
  )
}

// ── TEXT PANEL ───────────────────────────────────────────────────────────────
export function TextPanel() {
  const { textFormat, updateText } = useStore()

  const applyToSelected = (updates: Partial<typeof textFormat>) => {
    updateText(updates)
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) return
    const map: Record<string, unknown> = {}
    if ('bold'          in updates) map.fontWeight  = updates.bold ? 'bold' : 'normal'
    if ('italic'        in updates) map.fontStyle   = updates.italic ? 'italic' : 'normal'
    if ('underline'     in updates) map.underline   = updates.underline
    if ('strikethrough' in updates) map.linethrough = updates.strikethrough
    if ('fontSize'      in updates) map.fontSize    = updates.fontSize
    if ('fontFamily'    in updates) map.fontFamily  = updates.fontFamily
    if ('color'         in updates) map.fill        = updates.color
    if ('align'         in updates) map.textAlign   = updates.align
    obj.set(map as Partial<fabric.Object>)
    fc.renderAll()
  }

  const Btn = ({ active, onClick, children, style = {} }: {
    active?: boolean; onClick: () => void; children: React.ReactNode; style?: React.CSSProperties
  }) => (
    <button onClick={onClick} style={{
      width: 40, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
      background: active ? 'rgba(167,139,250,0.2)' : 'var(--surface)',
      color: active ? 'var(--accent)' : 'var(--text2)',
      fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>{children}</button>
  )

  return (
    <Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Font selector */}
        <div>
          <div className="sec-lbl" style={{ marginBottom: 6 }}>Font</div>
          <div className="scroll-x" style={{ display: 'flex', gap: 6 }}>
            {FONTS.map(f => (
              <button key={f.value} onClick={() => applyToSelected({ fontFamily: f.value })}
                style={{
                  padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: textFormat.fontFamily === f.value ? 'rgba(167,139,250,0.2)' : 'var(--surface)',
                  color: textFormat.fontFamily === f.value ? 'var(--accent)' : 'var(--text2)',
                  fontFamily: f.value, fontSize: '0.85rem', fontWeight: 600,
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size + format row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => applyToSelected({ fontSize: Math.max(8, textFormat.fontSize - 2) })}
              style={{ width: 30, height: 36, borderRadius: 8, border: 'none', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem', fontWeight: 800 }}>−</button>
            <div style={{ width: 36, textAlign: 'center', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>
              {textFormat.fontSize}
            </div>
            <button onClick={() => applyToSelected({ fontSize: Math.min(200, textFormat.fontSize + 2) })}
              style={{ width: 30, height: 36, borderRadius: 8, border: 'none', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '1rem', fontWeight: 800 }}>+</button>
          </div>

          <div className="div-h" />

          <Btn active={textFormat.bold}          onClick={() => applyToSelected({ bold: !textFormat.bold })}          style={{ fontWeight: 900, fontSize: '1rem' }}>B</Btn>
          <Btn active={textFormat.italic}        onClick={() => applyToSelected({ italic: !textFormat.italic })}        style={{ fontStyle: 'italic' }}>I</Btn>
          <Btn active={textFormat.underline}     onClick={() => applyToSelected({ underline: !textFormat.underline })}     style={{ textDecoration: 'underline' }}>U</Btn>
          <Btn active={textFormat.strikethrough} onClick={() => applyToSelected({ strikethrough: !textFormat.strikethrough })} style={{ textDecoration: 'line-through' }}>S</Btn>

          <div className="div-h" />

          <Btn active={textFormat.align === 'left'}   onClick={() => applyToSelected({ align: 'left' })}>≡</Btn>
          <Btn active={textFormat.align === 'center'} onClick={() => applyToSelected({ align: 'center' })}>☰</Btn>
          <Btn active={textFormat.align === 'right'}  onClick={() => applyToSelected({ align: 'right' })}>≡</Btn>
        </div>

        {/* Color */}
        <div>
          <div className="sec-lbl" style={{ marginBottom: 6 }}>Text Color</div>
          <ColorRow value={textFormat.color} onChange={c => applyToSelected({ color: c })} />
        </div>
      </div>
    </Panel>
  )
}

// ── SHAPE PANEL ──────────────────────────────────────────────────────────────
export function ShapePanel() {
  const { shapeType, setShapeType, penColor, setPenColor, shapeFill, setShapeFill } = useStore()
  const shapes: { id: typeof shapeType; icon: string; label: string }[] = [
    { id: 'rect',      icon: '▭', label: 'Rect'     },
    { id: 'circle',    icon: '○', label: 'Circle'   },
    { id: 'triangle',  icon: '△', label: 'Triangle' },
    { id: 'diamond',   icon: '◇', label: 'Diamond'  },
    { id: 'pentagon',  icon: '⬠', label: 'Pentagon' },
    { id: 'star',      icon: '☆', label: 'Star'     },
    { id: 'arrow',     icon: '→', label: 'Arrow'    },
  ]
  return (
    <Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="sec-lbl" style={{ marginBottom: 8 }}>Shape</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {shapes.map(s => (
              <button key={s.id} onClick={() => setShapeType(s.id)}
                style={{
                  padding: '10px 4px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: shapeType === s.id ? 'rgba(167,139,250,0.2)' : 'var(--surface)',
                  color: shapeType === s.id ? 'var(--accent)' : 'var(--text2)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  fontSize: '1.3rem', fontFamily: 'Nunito',
                }}>
                {s.icon}
                <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="sec-lbl" style={{ marginBottom: 6 }}>Stroke Color</div>
          <ColorRow value={penColor} onChange={setPenColor} />
        </div>

        <div>
          <div className="sec-lbl" style={{ marginBottom: 6 }}>Fill</div>
          <div className="scroll-x" style={{ display: 'flex', gap: 6 }}>
            <div onClick={() => setShapeFill('transparent')}
              style={{
                width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
                background: 'transparent', border: `2px solid ${shapeFill === 'transparent' ? '#fff' : 'var(--border2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text2)',
              }}>∅</div>
            {PEN_COLORS.map(c => (
              <div key={c} className={`swatch ${shapeFill === c ? 'on' : ''}`}
                style={{ background: c, flexShrink: 0 }}
                onClick={() => setShapeFill(c)} />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

// ── NOTE PANEL ───────────────────────────────────────────────────────────────
export function NotePanel() {
  const { noteStyle, setNoteStyle } = useStore()
  return (
    <Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="sec-lbl">Note Style — tap canvas to place</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {NOTE_STYLES.map(n => (
            <button key={n.name} onClick={() => setNoteStyle(n)}
              style={{
                padding: '10px 6px', borderRadius: 12, cursor: 'pointer',
                background: n.bg,
                border: `2px solid ${noteStyle.bg === n.bg ? n.border : 'transparent'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                boxShadow: noteStyle.bg === n.bg ? `0 0 14px ${n.border}50` : 'none',
                transition: 'all 0.15s',
                position: 'relative', overflow: 'hidden',
              }}>
              {/* Folded corner indicator */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 12, height: 12,
                background: n.border, opacity: 0.5,
                clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: n.text }}>{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ── WASHI PANEL ──────────────────────────────────────────────────────────────
export function WashiPanel() {
  const { showToast } = useStore()

  const addWashi = (p: typeof WASHI_PATTERNS[0]) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const cx = fc.getWidth() / 2, cy = fc.getHeight() / 2
    const tape = new fabric.Rect({ width: 240, height: 32, fill: p.bg, rx: 4, ry: 4 })
    const txt = new fabric.Text((p.symbol + '  ').repeat(12), {
      fontSize: 13, fill: p.color, top: 7, left: 6, fontFamily: 'Nunito',
    })
    const grp = new fabric.Group([tape, txt], {
      left: cx - 120, top: cy - 16, data: { type: 'washi' },
    })
    fc.add(grp); fc.setActiveObject(grp); fc.renderAll()
    showToast('Washi tape added!')
    useStore.getState().closePanel()
  }

  return (
    <Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="sec-lbl">Washi Tape</div>
        {WASHI_PATTERNS.map(p => (
          <button key={p.id} onClick={() => addWashi(p)}
            style={{
              padding: '12px 16px', borderRadius: 12, border: `1px solid ${p.color}40`,
              background: p.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'Nunito', transition: 'transform 0.15s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            <span style={{ fontSize: '1.2rem' }}>{p.symbol.repeat(3)}</span>
            <span style={{ fontWeight: 700, color: p.color, fontSize: '0.88rem' }}>{p.name}</span>
          </button>
        ))}
      </div>
    </Panel>
  )
}
