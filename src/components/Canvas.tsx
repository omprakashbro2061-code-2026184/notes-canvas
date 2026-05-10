import { useEffect, useRef, useCallback } from 'react'
import { fabric } from 'fabric'
import { useStore, BgTexture } from '../store/useStore'
import { NOTE_COLORS } from '../data/stickers'

const SAVE_KEY = 'notes_canvas_data'

function makeStickyNote(x: number, y: number, color: string, border: string, shadow: string): fabric.Group {
  const w = 180, h = 160, fold = 18
  const bg = new fabric.Path(`M 0 0 L ${w-fold} 0 L ${w} ${fold} L ${w} ${h} L 0 ${h} Z`, {
    fill: color, stroke: border, strokeWidth: 1.5,
    shadow: new fabric.Shadow({ color: shadow, blur: 16, offsetX: 3, offsetY: 6 }),
  })
  const foldTri = new fabric.Path(`M ${w-fold} 0 L ${w} ${fold} L ${w-fold} ${fold} Z`, { fill: border, opacity: 0.5 })
  const label = new fabric.Textbox('Click to edit...', {
    left: 10, top: 12, width: w-28, fontSize: 14, fontFamily: 'Caveat',
    fill: '#1a1a2e', editable: true, splitByGrapheme: false, lineHeight: 1.4,
  })
  return new fabric.Group([bg, foldTri, label], {
    left: x, top: y, selectable: true, hasControls: true, subTargetCheck: true,
    data: { type: 'sticky', noteColor: color },
  })
}

function pentagon(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
  })
  return `M ${pts.join(' L ')} Z`
}

function star(cx: number, cy: number, r: number, r2: number): string {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI * i) / 5 - Math.PI / 2
    const rad = i % 2 === 0 ? r : r2
    return `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`
  })
  return `M ${pts.join(' L ')} Z`
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const connectorStartRef = useRef<{ x: number; y: number } | null>(null)
  const connectorLineRef = useRef<fabric.Object | null>(null)

  const { tool, shapeType, connectorType, penColor, penSize, penOpacity,
    noteColor, textFormat, bgTexture, pushHistory, undo: storeUndo, redo: storeRedo, showToast } = useStore()

  const toolRef = useRef(tool)
  const penColorRef = useRef(penColor)
  const penSizeRef = useRef(penSize)
  const penOpacityRef = useRef(penOpacity)
  const noteColorRef = useRef(noteColor)
  const textFormatRef = useRef(textFormat)
  const shapeTypeRef = useRef(shapeType)
  const connectorTypeRef = useRef(connectorType)
  const bgTextureRef = useRef<BgTexture>(bgTexture)

  useEffect(() => { toolRef.current = tool }, [tool])
  useEffect(() => { penColorRef.current = penColor }, [penColor])
  useEffect(() => { penSizeRef.current = penSize }, [penSize])
  useEffect(() => { penOpacityRef.current = penOpacity }, [penOpacity])
  useEffect(() => { noteColorRef.current = noteColor }, [noteColor])
  useEffect(() => { textFormatRef.current = textFormat }, [textFormat])
  useEffect(() => { shapeTypeRef.current = shapeType }, [shapeType])
  useEffect(() => { connectorTypeRef.current = connectorType }, [connectorType])

  const saveCanvas = useCallback(() => {
    if (!fabricRef.current) return
    const json = JSON.stringify(fabricRef.current.toJSON(['data', 'selectable', 'editable']))
    localStorage.setItem(SAVE_KEY, json)
    pushHistory(json)
  }, [pushHistory])

  const applyBgTexture = useCallback((fc: fabric.Canvas, texture: BgTexture) => {
    bgTextureRef.current = texture
    const w = fc.getWidth(), h = fc.getHeight()
    if (texture === 'none') { fc.setBackgroundColor('transparent', fc.renderAll.bind(fc)); return }
    const bgCanvas = document.createElement('canvas')
    bgCanvas.width = w; bgCanvas.height = h
    const ctx = bgCanvas.getContext('2d')!
    if (texture === 'dots') {
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      for (let x = 20; x < w; x += 24) for (let y = 20; y < h; y += 24) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill()
      }
    } else if (texture === 'grid') {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1
      for (let x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
      for (let y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }
    } else if (texture === 'parchment') {
      const grad = ctx.createLinearGradient(0,0,w,h)
      grad.addColorStop(0,'rgba(210,180,140,0.12)'); grad.addColorStop(1,'rgba(210,180,140,0.12)')
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h)
    }
    fc.setBackgroundImage(bgCanvas.toDataURL(), fc.renderAll.bind(fc))
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    const wrapper = document.getElementById('canvas-wrapper')!
    const fc = new fabric.Canvas(canvasRef.current, {
      width: wrapper.clientWidth, height: wrapper.clientHeight,
      backgroundColor: 'transparent', selection: true,
      preserveObjectStacking: true, stopContextMenu: true,
    })
    fabricRef.current = fc
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) fc.loadFromJSON(saved, () => { fc.renderAll(); showToast('Canvas restored ✨') })
    fc.on('object:modified', saveCanvas)
    fc.on('object:added', saveCanvas)
    fc.on('object:removed', saveCanvas)

    const handleKey = (e: KeyboardEvent) => {
      if (!fc) return
      const isInput = ['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)
      if (isInput) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        fc.getActiveObjects().forEach(o => fc.remove(o))
        fc.discardActiveObject(); fc.renderAll(); saveCanvas()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        const json = e.shiftKey ? storeRedo() : storeUndo()
        if (json) fc.loadFromJSON(json, () => fc.renderAll())
      }
    }
    window.addEventListener('keydown', handleKey)
    const handleResize = () => {
      const w = document.getElementById('canvas-wrapper')
      if (!w) return
      fc.setWidth(w.clientWidth); fc.setHeight(w.clientHeight)
      applyBgTexture(fc, bgTextureRef.current); fc.renderAll()
    }
    window.addEventListener('resize', handleResize)
    return () => { fc.dispose(); window.removeEventListener('keydown', handleKey); window.removeEventListener('resize', handleResize) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fc = fabricRef.current; if (!fc) return
    const getPos = (e: fabric.IEvent) => { const p = fc.getPointer(e.e as MouseEvent); return { x: p.x, y: p.y } }

    const handleMouseDown = (e: fabric.IEvent) => {
      const t = toolRef.current; const pos = getPos(e)
      if (t === 'select') return
      if (['pen','marker','highlighter'].includes(t)) {
        isDrawingRef.current = true; lastPosRef.current = pos
        const opacity = t === 'highlighter' ? 0.4 : penOpacityRef.current
        const strokeWidth = t === 'marker' ? penSizeRef.current * 3 : penSizeRef.current
        const path = new fabric.Path(`M ${pos.x} ${pos.y} L ${pos.x} ${pos.y}`, {
          stroke: penColorRef.current, strokeWidth, fill: '', opacity,
          strokeLineCap: 'round', strokeLineJoin: 'round',
          selectable: false, evented: false, data: { type: 'drawing' },
        })
        fc.add(path); (fc as any).__drawingPath = path; return
      }
      if (t === 'eraser') { isDrawingRef.current = true; return }
      if (t === 'text') {
        const tf = textFormatRef.current
        const tb = new fabric.Textbox('Type here...', {
          left: pos.x, top: pos.y, width: 200,
          fontSize: tf.fontSize, fontFamily: tf.fontFamily,
          fontWeight: tf.bold ? 'bold' : 'normal',
          fontStyle: tf.italic ? 'italic' : 'normal',
          underline: tf.underline, linethrough: tf.strikethrough,
          fill: tf.color, textAlign: tf.align, editable: true, data: { type: 'text' },
        })
        fc.add(tb); fc.setActiveObject(tb); tb.enterEditing(); saveCanvas(); return
      }
      if (t === 'sticky') {
        const nc = noteColorRef.current
        const noteInfo = NOTE_COLORS.find(n => n.color === nc) || NOTE_COLORS[0]
        const note = makeStickyNote(pos.x - 90, pos.y - 80, noteInfo.color, noteInfo.border, noteInfo.shadow)
        fc.add(note); fc.setActiveObject(note); saveCanvas(); return
      }
      if (t === 'shape') {
        const st = shapeTypeRef.current; const stroke = penColorRef.current
        let obj: fabric.Object
        if (st === 'rect') obj = new fabric.Rect({ left: pos.x, top: pos.y, width: 120, height: 80, fill: '', stroke, strokeWidth: 2 })
        else if (st === 'circle') obj = new fabric.Ellipse({ left: pos.x, top: pos.y, rx: 60, ry: 40, fill: '', stroke, strokeWidth: 2 })
        else if (st === 'triangle') obj = new fabric.Triangle({ left: pos.x, top: pos.y, width: 100, height: 90, fill: '', stroke, strokeWidth: 2 })
        else if (st === 'diamond') obj = new fabric.Path('M 60 0 L 120 60 L 60 120 L 0 60 Z', { left: pos.x, top: pos.y, fill: '', stroke, strokeWidth: 2 })
        else if (st === 'pentagon') obj = new fabric.Path(pentagon(60,60,60), { left: pos.x, top: pos.y, fill: '', stroke, strokeWidth: 2 })
        else obj = new fabric.Path(star(60,60,60,28), { left: pos.x, top: pos.y, fill: '', stroke, strokeWidth: 2 })
        obj.set({ data: { type: 'shape' } }); fc.add(obj); fc.setActiveObject(obj); saveCanvas(); return
      }
      if (t === 'connector') {
        connectorStartRef.current = pos
        const line = new fabric.Line([pos.x, pos.y, pos.x, pos.y], {
          stroke: penColorRef.current, strokeWidth: 2, selectable: false, evented: false,
          strokeDashArray: connectorTypeRef.current === 'curved' ? [8, 4] : undefined,
          data: { type: 'connector' },
        })
        fc.add(line); connectorLineRef.current = line; isDrawingRef.current = true
      }
    }

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawingRef.current) return
      const t = toolRef.current; const pos = getPos(e)
      if (['pen','marker','highlighter'].includes(t)) {
        const path = (fc as any).__drawingPath as fabric.Path | undefined
        if (!path || !lastPosRef.current) return
        const pathData = (path as any).path as any[]
        pathData.push(['L', pos.x, pos.y])
        path.set({ path: pathData } as any)
        lastPosRef.current = pos; fc.renderAll(); return
      }
      if (t === 'eraser') {
        const obj = fc.findTarget(e.e as MouseEvent, false)
        if (obj && (obj as any).data?.type !== 'sticky') { fc.remove(obj); fc.renderAll() }
        return
      }
      if (t === 'connector' && connectorLineRef.current) {
        (connectorLineRef.current as fabric.Line).set({ x2: pos.x, y2: pos.y }); fc.renderAll()
      }
    }

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false; lastPosRef.current = null
      const t = toolRef.current
      if (['pen','marker','highlighter'].includes(t)) {
        const path = (fc as any).__drawingPath as fabric.Path | undefined
        if (path) { path.set({ selectable: true, evented: true }); delete (fc as any).__drawingPath }
      }
      if (t === 'connector' && connectorLineRef.current) {
        connectorLineRef.current.set({ selectable: true, evented: true })
        connectorLineRef.current = null; connectorStartRef.current = null
      }
      saveCanvas()
    }

    fc.on('mouse:down', handleMouseDown)
    fc.on('mouse:move', handleMouseMove)
    fc.on('mouse:up', handleMouseUp)
    fc.selection = tool === 'select'
    fc.forEachObject(o => { o.selectable = tool === 'select' || tool === 'eraser' })
    return () => { fc.off('mouse:down', handleMouseDown); fc.off('mouse:move', handleMouseMove); fc.off('mouse:up', handleMouseUp) }
  }, [tool, saveCanvas])

  useEffect(() => {
    const fc = fabricRef.current; if (!fc) return
    applyBgTexture(fc, bgTexture)
  }, [bgTexture, applyBgTexture])

  useEffect(() => { (window as any).__fabricCanvas = fabricRef.current }, [])

  return (
    <div id="canvas-wrapper" style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
