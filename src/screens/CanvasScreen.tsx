import { useEffect, useRef, useCallback, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from '../store/useStore'
import { NOTE_STYLES } from '../data/index'
import Toolbar from './canvas/Toolbar'
import TopBar from './canvas/TopBar'
import StickerPanel from './canvas/StickerPanel'
import TextPanel from './canvas/TextPanel'
import PenPanel from './canvas/PenPanel'
import ShapePanel from './canvas/ShapePanel'
import NotePanel from './canvas/NotePanel'
import WashiPanel from './canvas/WashiPanel'

function makeStickyNote(
  x: number, y: number, style: { bg: string; border: string; text: string }
): fabric.Group {
  const W = 190, H = 170, FOLD = 20
  const bg = new fabric.Path(
    `M0,0 L${W - FOLD},0 L${W},${FOLD} L${W},${H} L0,${H} Z`,
    { fill: style.bg, stroke: style.border, strokeWidth: 1.5,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 18, offsetX: 3, offsetY: 6 }) }
  )
  const fold = new fabric.Path(
    `M${W - FOLD},0 L${W},${FOLD} L${W - FOLD},${FOLD} Z`,
    { fill: style.border, opacity: 0.55 }
  )
  const tb = new fabric.Textbox('Tap to edit', {
    left: 10, top: 14, width: W - 26,
    fontSize: 15, fontFamily: 'Caveat', fill: style.text,
    editable: true, splitByGrapheme: false, lineHeight: 1.45,
  })
  return new fabric.Group([bg, fold, tb], {
    left: x - W / 2, top: y - H / 2,
    subTargetCheck: true, data: { type: 'sticky' },
  })
}

function pentPath(r: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return `${r + r * Math.cos(a)},${r + r * Math.sin(a)}`
  }).join(' ')
}

function starPath(r: number, r2: number): string {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI * i) / 5 - Math.PI / 2
    const rad = i % 2 === 0 ? r : r2
    return `${r + rad * Math.cos(a)},${r + rad * Math.sin(a)}`
  }).join(' ')
}

const SAVE_PFX = 'mc_cv_'

export default function CanvasScreen() {
  const cvRef = useRef<HTMLCanvasElement>(null)
  const fcRef = useRef<fabric.Canvas | null>(null)
  const drawingPath = useRef<fabric.Path | null>(null)
  const isDown = useRef(false)
  const connStart = useRef<{ x: number; y: number } | null>(null)
  const connLine = useRef<fabric.Line | null>(null)
  const [ready, setReady] = useState(false)

  const {
    activeCanvasId, closeCanvas, bgTexture,
    tool, noteStyle, penColor, penSize, penOpacity,
    shapeType, shapeFill, textFormat,
    pushHist, undo: storeUndo, redo: storeRedo,
    showToast, upsertFile, files, activePanel,
  } = useStore()

  const toolRef = useRef(tool)
  const penColorRef = useRef(penColor)
  const penSizeRef = useRef(penSize)
  const penOpRef = useRef(penOpacity)
  const noteRef = useRef(noteStyle)
  const shapeRef = useRef(shapeType)
  const shapeFillRef = useRef(shapeFill)
  const textRef = useRef(textFormat)
  const bgRef = useRef(bgTexture)

  useEffect(() => { toolRef.current = tool }, [tool])
  useEffect(() => { penColorRef.current = penColor }, [penColor])
  useEffect(() => { penSizeRef.current = penSize }, [penSize])
  useEffect(() => { penOpRef.current = penOpacity }, [penOpacity])
  useEffect(() => { noteRef.current = noteStyle }, [noteStyle])
  useEffect(() => { shapeRef.current = shapeType }, [shapeType])
  useEffect(() => { shapeFillRef.current = shapeFill }, [shapeFill])
  useEffect(() => { textRef.current = textFormat }, [textFormat])

  const saveThumbnail = useCallback(() => {
    const fc = fcRef.current
    if (!fc || !activeCanvasId) return
    try {
      const thumb = fc.toDataURL({ format: 'jpeg', quality: 0.3, multiplier: 0.25 })
      const data = JSON.stringify(fc.toJSON(['data', 'selectable', 'editable']))
      localStorage.setItem(SAVE_PFX + activeCanvasId, data)
      const file = files.find(f => f.id === activeCanvasId)
      upsertFile(activeCanvasId, file?.name || 'Canvas', data, thumb)
    } catch { /* ignore */ }
  }, [activeCanvasId, files, upsertFile])

  const save = useCallback(() => {
    const fc = fcRef.current
    if (!fc || !activeCanvasId) return
    const data = JSON.stringify(fc.toJSON(['data', 'selectable', 'editable']))
    localStorage.setItem(SAVE_PFX + activeCanvasId, data)
    pushHist(data)
  }, [activeCanvasId, pushHist])

  const drawBg = useCallback((fc: fabric.Canvas, tex: string) => {
    bgRef.current = tex as any
    const w = fc.getWidth(), h = fc.getHeight()
    const bc = document.createElement('canvas')
    bc.width = w; bc.height = h
    const ctx = bc.getContext('2d')!
    ctx.clearRect(0, 0, w, h)
    if (tex === 'dots') {
      ctx.fillStyle = 'rgba(255,255,255,0.13)'
      for (let x = 22; x < w; x += 26) for (let y = 22; y < h; y += 26) {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill()
      }
    } else if (tex === 'grid') {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1
      for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    } else if (tex === 'lines') {
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1
      for (let y = 40; y < h; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    }
    if (tex === 'none') { fc.setBackgroundColor('transparent', fc.renderAll.bind(fc)); return }
    fc.setBackgroundImage(bc.toDataURL(), fc.renderAll.bind(fc))
  }, [])

  // Init canvas
  useEffect(() => {
    if (!cvRef.current || !activeCanvasId) return
    const wrap = document.getElementById('cv-wrap')!
    const W = wrap.clientWidth, H = wrap.clientHeight

    const fc = new fabric.Canvas(cvRef.current, {
      width: W, height: H, backgroundColor: 'transparent',
      preserveObjectStacking: true, stopContextMenu: true,
      selectionColor: 'rgba(167,139,250,0.12)',
      selectionBorderColor: 'rgba(167,139,250,0.6)',
      selectionLineWidth: 1.5,
    })
    fcRef.current = fc
    ;(window as any).__fc = fc

    // Load saved data
    const saved = localStorage.getItem(SAVE_PFX + activeCanvasId)
    if (saved && saved !== '{}') {
      try { fc.loadFromJSON(saved, () => { fc.renderAll(); setReady(true) }) }
      catch { setReady(true) }
    } else { setReady(true) }

    drawBg(fc, bgRef.current)

    // Auto-save on changes
    const onChange = () => save()
    fc.on('object:modified', onChange)
    fc.on('object:added', onChange)
    fc.on('object:removed', onChange)

    // Double-click to edit sticky note text
    fc.on('mouse:dblclick', (e: fabric.IEvent) => {
      const target = fc.findTarget(e.e as MouseEvent, false)
      if (!target) return
      if ((target as any).data?.type === 'sticky') {
        const grp = target as fabric.Group
        const items = grp.getObjects()
        const tb = items.find(o => o instanceof fabric.Textbox) as fabric.Textbox | undefined
        if (tb) {
          grp.set('selectable', false)
          fc.setActiveObject(tb)
          tb.enterEditing()
          fc.renderAll()
        }
      }
    })

    // Keyboard shortcuts
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        fc.getActiveObjects().forEach(o => fc.remove(o))
        fc.discardActiveObject(); fc.renderAll(); save()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        const json = e.shiftKey ? storeRedo() : storeUndo()
        if (json) fc.loadFromJSON(json, () => fc.renderAll())
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        const obj = fc.getActiveObject()
        if (!obj) return
        obj.clone((c: fabric.Object) => {
          c.set({ left: (obj.left || 0) + 24, top: (obj.top || 0) + 24 })
          fc.add(c); fc.setActiveObject(c); fc.renderAll()
        })
      }
    }
    window.addEventListener('keydown', onKey)

    const onResize = () => {
      const wrap = document.getElementById('cv-wrap')
      if (!wrap) return
      fc.setWidth(wrap.clientWidth); fc.setHeight(wrap.clientHeight)
      drawBg(fc, bgRef.current); fc.renderAll()
    }
    window.addEventListener('resize', onResize)

    return () => {
      saveThumbnail()
      fc.dispose()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCanvasId])

  // Mouse handlers
  useEffect(() => {
    const fc = fcRef.current; if (!fc || !ready) return

    const getPos = (e: fabric.IEvent) => {
      const p = fc.getPointer(e.e as MouseEvent)
      return { x: p.x, y: p.y }
    }

    const onDown = (e: fabric.IEvent) => {
      const t = toolRef.current
      const pos = getPos(e)
      useStore.getState().closePanel()

      if (t === 'select') return

      if (['pen', 'marker', 'highlighter'].includes(t)) {
        isDown.current = true
        const size = t === 'marker' ? penSizeRef.current * 2.5 : penSizeRef.current
        const op = t === 'highlighter' ? 0.38 : penOpRef.current
        const col = penColorRef.current
        const p = new fabric.Path(`M ${pos.x} ${pos.y} L ${pos.x + 0.1} ${pos.y + 0.1}`, {
          stroke: col, strokeWidth: size, fill: '', opacity: op,
          strokeLineCap: 'round', strokeLineJoin: 'round',
          selectable: false, evented: false, data: { type: 'draw' },
        })
        fc.add(p); drawingPath.current = p; return
      }

      if (t === 'eraser') { isDown.current = true; return }

      if (t === 'text') {
        const tf = textRef.current
        const tb = new fabric.Textbox('', {
          left: pos.x, top: pos.y, width: 220,
          fontSize: tf.fontSize, fontFamily: tf.fontFamily,
          fontWeight: tf.bold ? 'bold' : 'normal',
          fontStyle: tf.italic ? 'italic' : 'normal',
          underline: tf.underline, linethrough: tf.strikethrough,
          fill: tf.color, textAlign: tf.align,
          editable: true, data: { type: 'text' },
        })
        fc.add(tb); fc.setActiveObject(tb); tb.enterEditing()
        save(); return
      }

      if (t === 'sticky') {
        const note = makeStickyNote(pos.x, pos.y, noteRef.current)
        fc.add(note); fc.setActiveObject(note); save(); return
      }

      if (t === 'shape') {
        const s = shapeRef.current
        const stroke = penColorRef.current
        const fill = shapeFillRef.current === 'transparent' ? '' : shapeFillRef.current
        let obj: fabric.Object
        if (s === 'rect') obj = new fabric.Rect({ left: pos.x, top: pos.y, width: 130, height: 90, fill, stroke, strokeWidth: 3, rx: 6, ry: 6 })
        else if (s === 'circle') obj = new fabric.Ellipse({ left: pos.x, top: pos.y, rx: 65, ry: 45, fill, stroke, strokeWidth: 3 })
        else if (s === 'triangle') obj = new fabric.Triangle({ left: pos.x, top: pos.y, width: 110, height: 100, fill, stroke, strokeWidth: 3 })
        else if (s === 'diamond') obj = new fabric.Path('M 70 0 L 140 70 L 70 140 L 0 70 Z', { left: pos.x, top: pos.y, fill, stroke, strokeWidth: 3 })
        else if (s === 'pentagon') obj = new fabric.Polygon(
          pentPath(60).split(' ').map(pt => { const [x, y] = pt.split(','); return { x: +x, y: +y } }),
          { left: pos.x, top: pos.y, fill, stroke, strokeWidth: 3 }
        )
        else if (s === 'star') obj = new fabric.Polygon(
          starPath(60, 28).split(' ').map(pt => { const [x, y] = pt.split(','); return { x: +x, y: +y } }),
          { left: pos.x, top: pos.y, fill, stroke, strokeWidth: 3 }
        )
        else obj = new fabric.Path('M 10 50 L 90 50 M 75 35 L 90 50 L 75 65', {
          left: pos.x, top: pos.y, stroke, strokeWidth: 3, fill: '', strokeLineCap: 'round',
        })
        obj.set({ data: { type: 'shape' } })
        fc.add(obj); fc.setActiveObject(obj); save(); return
      }

      if (t === 'connector') {
        connStart.current = pos
        const line = new fabric.Line([pos.x, pos.y, pos.x, pos.y], {
          stroke: penColorRef.current, strokeWidth: 2.5,
          selectable: false, evented: false, data: { type: 'connector' },
        })
        fc.add(line); connLine.current = line; isDown.current = true
      }
    }

    const onMove = (e: fabric.IEvent) => {
      if (!isDown.current) return
      const t = toolRef.current; const pos = getPos(e)
      if (['pen', 'marker', 'highlighter'].includes(t) && drawingPath.current) {
        const p = drawingPath.current
        const pathData = (p as any).path as any[]
        pathData.push(['L', pos.x, pos.y])
        p.set({ path: pathData } as any)
        fc.renderAll(); return
      }
      if (t === 'eraser') {
        const obj = fc.findTarget(e.e as MouseEvent, false)
        if (obj && (obj as any).data?.type !== 'sticky') { fc.remove(obj); fc.renderAll() }
        return
      }
      if (t === 'connector' && connLine.current) {
        connLine.current.set({ x2: pos.x, y2: pos.y } as any)
        fc.renderAll()
      }
    }

    const onUp = () => {
      if (!isDown.current) return
      isDown.current = false
      const t = toolRef.current
      if (['pen', 'marker', 'highlighter'].includes(t) && drawingPath.current) {
        drawingPath.current.set({ selectable: true, evented: true })
        drawingPath.current = null
      }
      if (t === 'connector' && connLine.current) {
        connLine.current.set({ selectable: true, evented: true })
        connLine.current = null; connStart.current = null
      }
      save()
    }

    fc.on('mouse:down', onDown)
    fc.on('mouse:move', onMove)
    fc.on('mouse:up', onUp)

    const isSel = tool === 'select'
    fc.selection = isSel
    fc.forEachObject(o => { o.selectable = isSel })

    return () => {
      fc.off('mouse:down', onDown)
      fc.off('mouse:move', onMove)
      fc.off('mouse:up', onUp)
    }
  }, [tool, ready, save])

  // BG texture changes
  useEffect(() => {
    const fc = fcRef.current; if (!fc) return
    drawBg(fc, bgTexture)
  }, [bgTexture, drawBg])

  const handleBack = () => { saveThumbnail(); closeCanvas() }

  const handleExport = () => {
    const fc = fcRef.current; if (!fc) return
    const url = fc.toDataURL({ format: 'png', multiplier: 2 })
    const a = document.createElement('a')
    a.href = url; a.download = `mycanvas-${Date.now()}.png`; a.click()
    showToast('Exported as PNG 🎨')
  }

  const handleClear = () => {
    if (!confirm('Clear everything?')) return
    const fc = fcRef.current; if (!fc) return
    fc.clear(); fc.renderAll()
    if (activeCanvasId) localStorage.removeItem(SAVE_PFX + activeCanvasId)
    showToast('Cleared')
  }

  const handleUndo = () => {
    const json = storeUndo(); const fc = fcRef.current
    if (json && fc) fc.loadFromJSON(json, () => fc.renderAll())
  }
  const handleRedo = () => {
    const json = storeRedo(); const fc = fcRef.current
    if (json && fc) fc.loadFromJSON(json, () => fc.renderAll())
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden' }}>

      {/* Background gradient */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse at 15% 15%, rgba(167,139,250,0.04) 0%, transparent 55%),
                    radial-gradient(ellipse at 85% 85%, rgba(244,114,182,0.03) 0%, transparent 55%)`,
      }} />

      {/* Canvas */}
      <div id="cv-wrap" style={{ position:'absolute', inset:0 }}>
        <canvas ref={cvRef} />
      </div>

      {/* Top bar */}
      <TopBar
        onBack={handleBack}
        onExport={handleExport}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Left toolbar */}
      <Toolbar />

      {/* Sub-panels */}
      {activePanel === 'pen'     && <PenPanel />}
      {activePanel === 'text'    && <TextPanel />}
      {activePanel === 'shape'   && <ShapePanel />}
      {activePanel === 'sticky'  && <NotePanel />}
      {activePanel === 'sticker' && <StickerPanel />}
      {activePanel === 'washi'   && <WashiPanel />}
    </div>
  )
}
