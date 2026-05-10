import { fabric } from 'fabric'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { FONTS, RAINBOW_COLORS } from '../data/stickers'

export default function TextToolbar() {
  const { textFormat, updateTextFormat } = useStore()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)

  const apply = (updates: Partial<typeof textFormat>) => {
    updateTextFormat(updates)
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) return

    const map: Record<string, unknown> = {}
    if (updates.bold !== undefined)          map.fontWeight  = updates.bold ? 'bold' : 'normal'
    if (updates.italic !== undefined)        map.fontStyle   = updates.italic ? 'italic' : 'normal'
    if (updates.underline !== undefined)     map.underline   = updates.underline
    if (updates.strikethrough !== undefined) map.linethrough = updates.strikethrough
    if (updates.fontSize !== undefined)      map.fontSize    = updates.fontSize
    if (updates.fontFamily !== undefined)    map.fontFamily  = updates.fontFamily
    if (updates.color !== undefined)         map.fill        = updates.color
    if (updates.align !== undefined)         map.textAlign   = updates.align

    obj.set(map as Partial<fabric.Object>)
    fc.renderAll()
    localStorage.setItem('notes_canvas_data', JSON.stringify(fc.toJSON(['data'])))
  }

  const layerAction = (action: 'front' | 'back' | 'forward' | 'backward') => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) return
    if (action === 'front')    fc.bringToFront(obj)
    if (action === 'back')     fc.sendToBack(obj)
    if (action === 'forward')  fc.bringForward(obj)
    if (action === 'backward') fc.sendBackwards(obj)
    fc.renderAll()
  }

  const duplicate = () => {
    const fc = (window as any).__fabricCanvas as fabric.Canvas | null
    if (!fc) return
    const obj = fc.getActiveObject()
    if (!obj) return
    obj.clone((cloned: fabric.Object) => {
      cloned.set({ left: (obj.left || 0) + 24, top: (obj.top || 0) + 24 })
      fc.add(cloned)
      fc.setActiveObject(cloned)
      fc.renderAll()
    })
  }

  const Divider = () => (
    <div style={{ width:1, height:24, background:'var(--border)', flexShrink:0 }} />
  )

  const Btn = ({ active, onClick, title, children, style = {} }: {
    active?: boolean; onClick: () => void; title?: string;
    children: React.ReactNode; style?: React.CSSProperties
  }) => (
    <button className={`tool-btn ${active ? 'active' : ''}`}
      onClick={onClick} title={title}
      style={{ width:34, height:34, fontSize:'0.88rem', flexShrink:0, ...style }}>
      {children}
    </button>
  )

  return (
    <div className="glass" style={{
      position:'fixed', top:8, left:'50%', transform:'translateX(-50%)',
      height:52, borderRadius:14, display:'flex', alignItems:'center',
      gap:3, padding:'0 10px', zIndex:50,
      maxWidth:'calc(100vw - 160px)', overflowX:'auto',
    }}>

      {/* Font selector */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <button onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false) }}
          style={{
            background:'transparent', border:'1px solid var(--border)', borderRadius:8,
            color:'var(--text)', padding:'5px 10px', cursor:'pointer',
            fontFamily:textFormat.fontFamily, fontSize:'0.82rem', minWidth:110, textAlign:'left',
            whiteSpace:'nowrap',
          }}>
          {textFormat.fontFamily} ▾
        </button>
        {showFontPicker && (
          <div className="glass anim-fade" style={{
            position:'absolute', top:'110%', left:0, marginTop:4,
            borderRadius:12, padding:8, zIndex:200, minWidth:170,
          }}>
            {FONTS.map(f => (
              <button key={f.value} onClick={() => { apply({ fontFamily:f.value }); setShowFontPicker(false) }}
                style={{
                  display:'block', width:'100%', padding:'9px 12px',
                  background: textFormat.fontFamily===f.value ? 'rgba(167,139,250,0.15)' : 'transparent',
                  border:'none', borderRadius:8, cursor:'pointer',
                  fontFamily:f.value, fontSize:'0.95rem',
                  color: textFormat.fontFamily===f.value ? 'var(--accent)' : 'var(--text)',
                  textAlign:'left',
                }}>
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font size */}
      <div style={{ display:'flex', alignItems:'center', gap:1, flexShrink:0 }}>
        <button onClick={() => apply({ fontSize: Math.max(8, textFormat.fontSize - 2) })}
          style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:'0 5px', fontSize:'1rem' }}>
          −
        </button>
        <span style={{ fontSize:'0.8rem', color:'var(--text)', minWidth:26, textAlign:'center' }}>
          {textFormat.fontSize}
        </span>
        <button onClick={() => apply({ fontSize: Math.min(200, textFormat.fontSize + 2) })}
          style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:'0 5px', fontSize:'1rem' }}>
          +
        </button>
      </div>

      <Divider />

      {/* B I U S */}
      <Btn active={textFormat.bold}          onClick={() => apply({ bold:          !textFormat.bold })}          title="Bold"          style={{ fontWeight:800 }}>B</Btn>
      <Btn active={textFormat.italic}        onClick={() => apply({ italic:        !textFormat.italic })}        title="Italic"        style={{ fontStyle:'italic' }}>I</Btn>
      <Btn active={textFormat.underline}     onClick={() => apply({ underline:     !textFormat.underline })}     title="Underline"     style={{ textDecoration:'underline' }}>U</Btn>
      <Btn active={textFormat.strikethrough} onClick={() => apply({ strikethrough: !textFormat.strikethrough })} title="Strikethrough" style={{ textDecoration:'line-through' }}>S</Btn>

      <Divider />

      {/* Align */}
      <Btn active={textFormat.align==='left'}   onClick={() => apply({ align:'left' })}   title="Align left"    style={{ fontSize:'0.8rem' }}>≡</Btn>
      <Btn active={textFormat.align==='center'} onClick={() => apply({ align:'center' })} title="Align center"  style={{ fontSize:'0.8rem' }}>☰</Btn>
      <Btn active={textFormat.align==='right'}  onClick={() => apply({ align:'right' })}  title="Align right"   style={{ fontSize:'0.8rem' }}>≡</Btn>

      <Divider />

      {/* Color picker */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <button onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false) }}
          title="Text color"
          style={{
            width:30, height:30, borderRadius:8,
            background:textFormat.color, border:'2px solid var(--border-bright)',
            cursor:'pointer', flexShrink:0,
          }} />
        {showColorPicker && (
          <div className="glass anim-fade" style={{
            position:'absolute', top:'110%', left:'50%', transform:'translateX(-50%)',
            marginTop:6, borderRadius:14, padding:14, zIndex:200, width:210,
          }}>
            <div className="section-label" style={{marginBottom:8}}>Rainbow Palette</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
              {RAINBOW_COLORS.map(c => (
                <div key={c} className="swatch"
                  style={{ background:c, width:22, height:22, boxShadow:`0 0 8px ${c}` }}
                  onClick={() => { apply({ color:c }); setShowColorPicker(false) }} />
              ))}
            </div>
            <div className="section-label" style={{marginBottom:8}}>Quick Colors</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
              {['#ffffff','#000000','#ff6b6b','#4ecdc4','#ffe66d','#a8e6cf','#dda0dd','#f0e68c'].map(c => (
                <div key={c} className="swatch"
                  style={{ background:c, width:22, height:22 }}
                  onClick={() => { apply({ color:c }); setShowColorPicker(false) }} />
              ))}
            </div>
            <div className="section-label" style={{marginBottom:6}}>Custom</div>
            <input type="color" value={textFormat.color}
              onChange={e => apply({ color:e.target.value })}
              style={{ width:'100%', height:36, border:'none', borderRadius:8, cursor:'pointer' }} />
          </div>
        )}
      </div>

      <Divider />

      {/* Layer controls */}
      <Btn onClick={() => layerAction('front')}   title="Bring to front"  style={{ fontSize:'1rem' }}>↑</Btn>
      <Btn onClick={() => layerAction('back')}    title="Send to back"    style={{ fontSize:'1rem' }}>↓</Btn>
      <Btn onClick={duplicate}                    title="Duplicate (⧉)"  style={{ fontSize:'0.85rem' }}>⧉</Btn>

      {/* Delete selected */}
      <Btn onClick={() => {
        const fc = (window as any).__fabricCanvas as fabric.Canvas | null
        if (!fc) return
        fc.getActiveObjects().forEach(o => fc.remove(o))
        fc.discardActiveObject()
        fc.renderAll()
        localStorage.setItem('notes_canvas_data', JSON.stringify(fc.toJSON(['data'])))
      }} title="Delete selected" style={{ color:'#f87171' }}>✕</Btn>
    </div>
  )
}
