import { useState } from 'react'
import { fabric } from 'fabric'
import { useStore, Tool, ShapeType } from '../store/useStore'
import { NOTE_COLORS, PEN_COLORS } from '../data/stickers'

const TOOL_LIST: ({ id: Tool; icon: string; label: string; panel?: string } | 'divider')[] = [
  { id:'select',      icon:'↖',  label:'Select'       },
  'divider',
  { id:'pen',         icon:'✏',  label:'Pen',       panel:'pen'       },
  { id:'marker',      icon:'🖊',  label:'Marker',    panel:'pen'       },
  { id:'highlighter', icon:'⬛',  label:'Highlighter',panel:'pen'      },
  { id:'eraser',      icon:'⬜',  label:'Eraser'       },
  'divider',
  { id:'text',        icon:'T',   label:'Text',      panel:'text'      },
  { id:'sticky',      icon:'📝',  label:'Sticky',    panel:'sticky'    },
  'divider',
  { id:'shape',       icon:'◇',   label:'Shape',     panel:'shape'     },
  { id:'connector',   icon:'↔',   label:'Connector', panel:'connector' },
  'divider',
  { id:'sticker',     icon:'⭐',  label:'Stickers'    },
  { id:'washi',       icon:'🎀',  label:'Washi Tape'  },
]

const SHAPES: { type: ShapeType; icon: string; label: string }[] = [
  { type:'rect',     icon:'▭', label:'Rectangle' },
  { type:'circle',   icon:'○', label:'Circle'    },
  { type:'triangle', icon:'△', label:'Triangle'  },
  { type:'diamond',  icon:'◇', label:'Diamond'   },
  { type:'pentagon', icon:'⬠', label:'Pentagon'  },
  { type:'star',     icon:'☆', label:'Star'      },
]

export default function Toolbar() {
  const {
    tool, setTool,
    penColor, setPenColor, penSize, setPenSize, penOpacity, setPenOpacity,
    noteColor, setNoteColor,
    shapeType, setShapeType,
    connectorType, setConnectorType,
    undo: storeUndo, redo: storeRedo,
    showToast,
  } = useStore()

  const [openPanel, setOpenPanel] = useState<string | null>(null)

  const handleToolClick = (t: { id: Tool; label: string; panel?: string }) => {
    setTool(t.id)
    setOpenPanel(openPanel === (t.panel ?? null) ? null : (t.panel ?? null))
  }

  const handleUndo = () => {
    const json = storeUndo()
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (json && fc) fc.loadFromJSON(json, () => fc.renderAll())
  }

  const handleRedo = () => {
    const json = storeRedo()
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (json && fc) fc.loadFromJSON(json, () => fc.renderAll())
  }

  const handleDeleteSelected = () => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    fc.getActiveObjects().forEach(o => fc.remove(o))
    fc.discardActiveObject()
    fc.renderAll()
  }

  const handleClearAll = () => {
    if (!confirm('Clear the entire canvas? This cannot be undone.')) return
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    fc.clear()
    fc.renderAll()
    localStorage.removeItem('notes_canvas_data')
    showToast('Canvas cleared 🗑️')
  }

  return (
    <>
      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      <div className="glass" style={{
        position:'fixed', left:8, top:'50%', transform:'translateY(-50%)',
        width:56, borderRadius:18, padding:'8px 6px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:2,
        zIndex:50, maxHeight:'92vh', overflowY:'auto',
      }}>
        {TOOL_LIST.map((item, i) => {
          if (item === 'divider') return (
            <div key={`d${i}`} style={{ width:'80%', height:1, background:'rgba(255,255,255,0.08)', margin:'3px 0' }} />
          )
          const active = tool === item.id
          return (
            <button key={item.id}
              className={`tool-btn ${active ? 'active' : ''}`}
              onClick={() => handleToolClick(item)}
              title={item.label}
              style={{ fontSize: item.id==='text' ? '1rem' : undefined, fontWeight: item.id==='text' ? 800 : undefined }}>
              {item.icon}
            </button>
          )
        })}

        <div style={{ width:'80%', height:1, background:'rgba(255,255,255,0.08)', margin:'3px 0' }} />

        <button className="tool-btn" title="Undo (Ctrl+Z)"         onClick={handleUndo}          style={{ fontSize:'0.9rem' }}>↩</button>
        <button className="tool-btn" title="Redo (Ctrl+Shift+Z)"   onClick={handleRedo}          style={{ fontSize:'0.9rem' }}>↪</button>
        <button className="tool-btn" title="Delete selected"        onClick={handleDeleteSelected} style={{ color:'#f87171' }}>✕</button>
        <button className="tool-btn" title="Clear canvas"           onClick={handleClearAll}       style={{ fontSize:'0.82rem', color:'#f87171' }}>🗑</button>
      </div>

      {/* ── Pen / Marker / Highlighter panel ─────────────────────────────── */}
      {openPanel === 'pen' && (
        <div className="glass popup-panel anim-fade" style={{ left:72, top:'50%', transform:'translateY(-50%)' }}>
          <div className="section-label">Color</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {PEN_COLORS.map(c => (
              <div key={c} className={`swatch ${penColor===c?'active':''}`}
                style={{ background:c, boxShadow: penColor===c ? `0 0 8px ${c}` : undefined }}
                onClick={() => setPenColor(c)} />
            ))}
          </div>
          <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)}
            style={{ width:'100%', height:32, border:'none', borderRadius:8, cursor:'pointer', background:'transparent' }} />

          <div className="section-label">Brush Size — {penSize}px</div>
          <input type="range" className="slider" min={1} max={40} value={penSize} onChange={e => setPenSize(+e.target.value)} />

          <div className="section-label">Opacity — {Math.round(penOpacity * 100)}%</div>
          <input type="range" className="slider" min={0.05} max={1} step={0.05} value={penOpacity} onChange={e => setPenOpacity(+e.target.value)} />

          {/* Preview stroke */}
          <div style={{
            height:24, borderRadius:100,
            background: penColor,
            opacity: penOpacity,
            boxShadow: `0 0 8px ${penColor}`,
          }} />
        </div>
      )}

      {/* ── Sticky note panel ─────────────────────────────────────────────── */}
      {openPanel === 'sticky' && (
        <div className="glass popup-panel anim-fade" style={{ left:72, top:'50%', transform:'translateY(-50%)' }}>
          <div className="section-label">Note Color</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {NOTE_COLORS.map(n => (
              <div key={n.id} onClick={() => setNoteColor(n.color)}
                style={{
                  width:40, height:40, borderRadius:10, background:n.color,
                  border:`2.5px solid ${noteColor===n.color ? n.border : 'transparent'}`,
                  cursor:'pointer', transition:'all 0.15s',
                  boxShadow: noteColor===n.color ? `0 0 14px ${n.shadow}` : undefined,
                  position:'relative',
                }}>
                {/* Folded corner indicator */}
                <div style={{
                  position:'absolute', bottom:0, right:0,
                  width:10, height:10,
                  background: n.border,
                  opacity: 0.6,
                  clipPath:'polygon(100% 0, 100% 100%, 0 100%)',
                  borderRadius:'0 0 6px 0',
                }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', lineHeight:1.5, marginTop:4 }}>
            Click anywhere on the canvas to place a sticky note
          </p>
        </div>
      )}

      {/* ── Shape panel ───────────────────────────────────────────────────── */}
      {openPanel === 'shape' && (
        <div className="glass popup-panel anim-fade" style={{ left:72, top:'50%', transform:'translateY(-50%)' }}>
          <div className="section-label">Shape Type</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {SHAPES.map(s => (
              <button key={s.type} onClick={() => setShapeType(s.type)}
                style={{
                  padding:'10px 6px', borderRadius:10, cursor:'pointer',
                  border:`1px solid ${shapeType===s.type ? 'var(--accent)' : 'var(--border)'}`,
                  background: shapeType===s.type ? 'rgba(167,139,250,0.15)' : 'transparent',
                  color: shapeType===s.type ? 'var(--accent)' : 'var(--text-muted)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                  fontSize:'1.3rem', fontFamily:'Nunito',
                }}>
                {s.icon}
                <span style={{ fontSize:'0.62rem' }}>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="section-label">Stroke Color</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {PEN_COLORS.slice(0,10).map(c => (
              <div key={c} className={`swatch ${penColor===c?'active':''}`}
                style={{ background:c, width:22, height:22, boxShadow: penColor===c?`0 0 6px ${c}`:undefined }}
                onClick={() => setPenColor(c)} />
            ))}
          </div>
          <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', lineHeight:1.5 }}>
            Click canvas to place shape
          </p>
        </div>
      )}

      {/* ── Connector panel ───────────────────────────────────────────────── */}
      {openPanel === 'connector' && (
        <div className="glass popup-panel anim-fade" style={{ left:72, top:'50%', transform:'translateY(-50%)' }}>
          <div className="section-label">Connector Style</div>
          {(['straight','curved','right-angle'] as const).map(ct => (
            <button key={ct} onClick={() => setConnectorType(ct)}
              style={{
                width:'100%', padding:'9px 14px', borderRadius:10, cursor:'pointer',
                border:`1px solid ${connectorType===ct ? 'var(--accent)' : 'var(--border)'}`,
                background: connectorType===ct ? 'rgba(167,139,250,0.15)' : 'transparent',
                color: connectorType===ct ? 'var(--accent)' : 'var(--text-muted)',
                textAlign:'left', fontSize:'0.85rem', fontFamily:'Nunito',
              }}>
              {ct === 'straight'    ? '→ Straight'
               : ct === 'curved'   ? '⌒ Curved'
               :                     '⌐ Right-angle'}
            </button>
          ))}

          <div className="section-label">Color</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {PEN_COLORS.slice(0,8).map(c => (
              <div key={c} className={`swatch ${penColor===c?'active':''}`}
                style={{ background:c, width:22, height:22 }}
                onClick={() => setPenColor(c)} />
            ))}
          </div>
          <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', lineHeight:1.5 }}>
            Click &amp; drag on canvas to draw connector
          </p>
        </div>
      )}

      {/* ── Text panel ────────────────────────────────────────────────────── */}
      {openPanel === 'text' && (
        <div className="glass popup-panel anim-fade" style={{ left:72, top:'50%', transform:'translateY(-50%)' }}>
          <div className="section-label">Text Tool Active</div>
          <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
            Click anywhere on the canvas to add a text box. Use the formatting bar at the top to style it.
          </p>
          <div style={{
            padding:'10px 12px', borderRadius:10,
            background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.2)',
            fontSize:'0.78rem', color:'var(--accent)', lineHeight:1.6,
          }}>
            💡 Double-click any text on canvas to edit it
          </div>
        </div>
      )}
    </>
  )
}
