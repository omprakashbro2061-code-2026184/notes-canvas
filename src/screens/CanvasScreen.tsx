import { useEffect, useRef, useCallback, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from '../store/useStore'
import { NOTE_STYLES } from '../data/index'
import Toolbar from './canvas/Toolbar'
import TopBar from './canvas/TopBar'
import StickerPanel from './canvas/StickerPanel'
import { TextPanel, PenPanel, ShapePanel, NotePanel, WashiPanel } from './canvas/Panels'

const SAVE_PFX = 'mc_cv_'

function makeStickyNote(x:number,y:number,s:{bg:string;border:string;text:string}):fabric.Group {
  const W=190,H=170,F=20
  const bg=new fabric.Path(`M0,0 L${W-F},0 L${W},${F} L${W},${H} L0,${H} Z`,
    {fill:s.bg,stroke:s.border,strokeWidth:1.5,
      shadow:new fabric.Shadow({color:'rgba(0,0,0,0.3)',blur:20,offsetX:3,offsetY:7})})
  const fold=new fabric.Path(`M${W-F},0 L${W},${F} L${W-F},${F} Z`,{fill:s.border,opacity:0.5})
  const tb=new fabric.Textbox('Tap twice to type here',{
    left:10,top:14,width:W-26,fontSize:15,fontFamily:'Caveat',
    fill:s.text,editable:true,splitByGrapheme:false,lineHeight:1.45,
  })
  return new fabric.Group([bg,fold,tb],{
    left:x-W/2,top:y-H/2,subTargetCheck:true,data:{type:'sticky'},
  })
}

function pentPts(r:number):{x:number;y:number}[]{
  return Array.from({length:5},(_,i)=>{
    const a=(Math.PI*2*i)/5-Math.PI/2
    return {x:r+r*Math.cos(a),y:r+r*Math.sin(a)}
  })
}
function starPts(r:number,r2:number):{x:number;y:number}[]{
  return Array.from({length:10},(_,i)=>{
    const a=(Math.PI*i)/5-Math.PI/2
    const rad=i%2===0?r:r2
    return {x:r+rad*Math.cos(a),y:r+rad*Math.sin(a)}
  })
}

export default function CanvasScreen() {
  const cvRef   = useRef<HTMLCanvasElement>(null)
  const fcRef   = useRef<fabric.Canvas|null>(null)
  const dpRef   = useRef<fabric.Path|null>(null)
  const isDown  = useRef(false)
  const clRef   = useRef<fabric.Line|null>(null)
  const tapTimer= useRef<ReturnType<typeof setTimeout>|null>(null)
  const lastTap = useRef(0)
  const [ready, setReady] = useState(false)

  const {
    activeCanvasId,closeCanvas,bgTexture,
    tool,noteStyle,penColor,penSize,penOpacity,
    shapeType,shapeFill,textFormat,
    pushHist,undo:storeUndo,redo:storeRedo,
    showToast,upsertFile,files,activePanel,closePanel,
  } = useStore()

  const tRef  = useRef(tool)
  const pcRef = useRef(penColor)
  const psRef = useRef(penSize)
  const poRef = useRef(penOpacity)
  const nsRef = useRef(noteStyle)
  const stRef = useRef(shapeType)
  const sfRef = useRef(shapeFill)
  const tfRef = useRef(textFormat)
  const bgRef = useRef(bgTexture)
  const apRef = useRef(activePanel)

  useEffect(()=>{tRef.current=tool},[tool])
  useEffect(()=>{pcRef.current=penColor},[penColor])
  useEffect(()=>{psRef.current=penSize},[penSize])
  useEffect(()=>{poRef.current=penOpacity},[penOpacity])
  useEffect(()=>{nsRef.current=noteStyle},[noteStyle])
  useEffect(()=>{stRef.current=shapeType},[shapeType])
  useEffect(()=>{sfRef.current=shapeFill},[shapeFill])
  useEffect(()=>{tfRef.current=textFormat},[textFormat])
  useEffect(()=>{apRef.current=activePanel},[activePanel])

  const doSave = useCallback(()=>{
    const fc=fcRef.current; if(!fc||!activeCanvasId) return
    try {
      const data=JSON.stringify(fc.toJSON(['data','selectable','editable']))
      localStorage.setItem(SAVE_PFX+activeCanvasId,data)
      pushHist(data)
    } catch{}
  },[activeCanvasId,pushHist])

  const saveThumbnail = useCallback(()=>{
    const fc=fcRef.current; if(!fc||!activeCanvasId) return
    try {
      const thumb=fc.toDataURL({format:'jpeg',quality:0.3,multiplier:0.25})
      const data=JSON.stringify(fc.toJSON(['data','selectable','editable']))
      const f=files.find(f=>f.id===activeCanvasId)
      upsertFile(activeCanvasId,f?.name||'Canvas',data,thumb)
    } catch{}
  },[activeCanvasId,files,upsertFile])

  const drawBg=useCallback((fc:fabric.Canvas,tex:string)=>{
    bgRef.current=tex as any
    const w=fc.getWidth(),h=fc.getHeight()
    if(tex==='none'){fc.setBackgroundColor('#111111',fc.renderAll.bind(fc));return}
    const bc=document.createElement('canvas'); bc.width=w; bc.height=h
    const ctx=bc.getContext('2d')!; ctx.clearRect(0,0,w,h)
    ctx.fillStyle='#111111'; ctx.fillRect(0,0,w,h)
    if(tex==='dots'){
      ctx.fillStyle='rgba(255,255,255,0.13)'
      for(let x=24;x<w;x+=28) for(let y=24;y<h;y+=28){
        ctx.beginPath();ctx.arc(x,y,1.3,0,Math.PI*2);ctx.fill()
      }
    } else if(tex==='grid'){
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1
      for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
      for(let y=0;y<h;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    } else if(tex==='lines'){
      ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1
      for(let y=38;y<h;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    }
    fc.setBackgroundImage(bc.toDataURL(),fc.renderAll.bind(fc))
  },[])

  // â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(()=>{
    if(!cvRef.current||!activeCanvasId) return
    const wrap=document.getElementById('cv-wrap')!
    const W=wrap.clientWidth, H=wrap.clientHeight

    const fc=new fabric.Canvas(cvRef.current,{
      width:W, height:H,
      backgroundColor:'#111111',
      preserveObjectStacking:true,
      stopContextMenu:true,
      allowTouchScrolling:false,
      selection:true,
    })
    fcRef.current=fc
    ;(window as any).__fc=fc
    ;(window as any).fabric=fabric

    // Load saved
    const saved=localStorage.getItem(SAVE_PFX+activeCanvasId)
    if(saved&&saved.length>5){
      try{fc.loadFromJSON(saved,()=>{fc.renderAll();setReady(true)})}
      catch{setReady(true)}
    } else setReady(true)

    drawBg(fc,bgRef.current)

    // Auto-save triggers
    fc.on('object:modified',doSave)
    fc.on('object:added',   doSave)
    fc.on('object:removed', doSave)
    fc.on('text:changed',   doSave)

    // â”€â”€ Double tap for sticky notes (mobile) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const handleTouchEnd=(e:TouchEvent)=>{
      const now=Date.now()
      const diff=now-lastTap.current
      if(diff<300&&diff>0){
        // Double tap detected
        const touch=e.changedTouches[0]
        const rect=(e.target as HTMLElement).getBoundingClientRect()
        const x=touch.clientX-rect.left
        const y=touch.clientY-rect.top
        const pt=new fabric.Point(x,y)
        const obj=fc.findTarget({clientX:touch.clientX,clientY:touch.clientY} as any,false)
        if(obj&&(obj as any).data?.type==='sticky'){
          const grp=obj as fabric.Group
          const items=grp.getObjects()
          const tb=items.find(o=>o.type==='textbox') as fabric.Textbox|undefined
          if(tb){
            grp.set({selectable:false})
            fc.setActiveObject(tb)
            tb.enterEditing()
            fc.renderAll()
          }
        }
      }
      lastTap.current=now
    }
    (fc as any).upperCanvasEl.addEventListener('touchend',handleTouchEnd,{passive:true})

    // Keyboard
    const onKey=(e:KeyboardEvent)=>{
      const tag=(e.target as HTMLElement).tagName
      if(tag==='INPUT'||tag==='TEXTAREA') return
      if(e.key==='Delete'||e.key==='Backspace'){
        fc.getActiveObjects().forEach((o:any)=>fc.remove(o))
        fc.discardActiveObject();fc.renderAll();doSave()
      }
      if((e.metaKey||e.ctrlKey)&&e.key==='z'){
        const json=e.shiftKey?storeRedo():storeUndo()
        if(json) fc.loadFromJSON(json,()=>fc.renderAll())
      }
    }
    window.addEventListener('keydown',onKey)

    const onResize=()=>{
      const w=document.getElementById('cv-wrap'); if(!w) return
      fc.setWidth(w.clientWidth); fc.setHeight(w.clientHeight)
      drawBg(fc,bgRef.current); fc.renderAll()
    }
    window.addEventListener('resize',onResize)

    return()=>{
      saveThumbnail(); fc.dispose()
      window.removeEventListener('keydown',onKey)
      window.removeEventListener('resize',onResize)
    }
  // eslint-disable-next-line
  },[activeCanvasId])

  // â”€â”€ Drawing tool handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(()=>{
    const fc=fcRef.current; if(!fc||!ready) return

    const getPos=(e:fabric.IEvent)=>{
      const p=fc.getPointer(e.e as MouseEvent|TouchEvent)
      return {x:p.x,y:p.y}
    }

    const onDown=(e:fabric.IEvent)=>{
      const t=tRef.current
      if(t==='select') return

      const pos=getPos(e)

      // â”€â”€ Pen / Marker / Highlighter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='pen'||t==='marker'||t==='highlighter'){
        isDown.current=true
        const size  = t==='marker'   ? psRef.current*2.5 : psRef.current
        const op    = t==='highlighter' ? 0.35 : poRef.current
        const color = pcRef.current
        const p=new fabric.Path(`M ${pos.x} ${pos.y} L ${pos.x+0.1} ${pos.y+0.1}`,{
          stroke:color, strokeWidth:size, fill:'', opacity:op,
          strokeLineCap:'round', strokeLineJoin:'round',
          selectable:false, evented:false, data:{type:'draw'},
        })
        fc.add(p)
        dpRef.current=p
        return
      }

      // â”€â”€ Eraser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='eraser'){
        isDown.current=true
        return
      }

      // â”€â”€ Text â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='text'){
        const tf=tfRef.current
        const tb=new fabric.Textbox('',{
          left:pos.x, top:pos.y, width:220,
          fontSize:tf.fontSize, fontFamily:tf.fontFamily,
          fontWeight:tf.bold?'bold':'normal',
          fontStyle:tf.italic?'italic':'normal',
          underline:tf.underline, linethrough:tf.strikethrough,
          fill:tf.color, textAlign:tf.align,
          editable:true, data:{type:'text'},
        })
        fc.add(tb); fc.setActiveObject(tb); tb.enterEditing()
        fc.renderAll(); doSave()
        return
      }

      // â”€â”€ Sticky note â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='sticky'){
        const note=makeStickyNote(pos.x,pos.y,nsRef.current)
        fc.add(note); fc.setActiveObject(note); fc.renderAll(); doSave()
        return
      }

      // â”€â”€ Shape â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='shape'){
        const s      = stRef.current
        const stroke = pcRef.current
        const fill   = sfRef.current==='transparent'?'':sfRef.current
        let obj:fabric.Object
        if     (s==='rect')     obj=new fabric.Rect({left:pos.x,top:pos.y,width:130,height:90,fill,stroke,strokeWidth:3,rx:6,ry:6})
        else if(s==='circle')   obj=new fabric.Ellipse({left:pos.x,top:pos.y,rx:65,ry:45,fill,stroke,strokeWidth:3})
        else if(s==='triangle') obj=new fabric.Triangle({left:pos.x,top:pos.y,width:110,height:100,fill,stroke,strokeWidth:3})
        else if(s==='diamond')  obj=new fabric.Path('M70,0 L140,70 L70,140 L0,70 Z',{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else if(s==='pentagon') obj=new fabric.Polygon(pentPts(60),{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else if(s==='star')     obj=new fabric.Polygon(starPts(60,28),{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else                    obj=new fabric.Path('M10,50 L90,50 M75,35 L90,50 L75,65',{left:pos.x,top:pos.y,stroke,strokeWidth:3,fill:'',strokeLineCap:'round'})
        obj.set({data:{type:'shape'}})
        fc.add(obj); fc.setActiveObject(obj); fc.renderAll(); doSave()
        return
      }

      // â”€â”€ Connector â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if(t==='connector'){
        const line=new fabric.Line([pos.x,pos.y,pos.x,pos.y],{
          stroke:pcRef.current, strokeWidth:2.5,
          selectable:false, evented:false, data:{type:'connector'},
        })
        fc.add(line); clRef.current=line; isDown.current=true
      }
    }

    const onMove=(e:fabric.IEvent)=>{
      if(!isDown.current) return
      const t=tRef.current
      const pos=getPos(e)

      if((t==='pen'||t==='marker'||t==='highlighter')&&dpRef.current){
        const pathData=(dpRef.current as any).path as any[]
        pathData.push(['L',pos.x,pos.y])
        dpRef.current.set({path:pathData} as any)
        fc.renderAll()
        return
      }

      if(t==='eraser'){
        const obj=fc.findTarget(e.e as MouseEvent,false)
        if(obj&&(obj as any).data?.type!=='sticky'){
          fc.remove(obj); fc.renderAll()
        }
        return
      }

      if(t==='connector'&&clRef.current){
        (clRef.current as any).set({x2:pos.x,y2:pos.y})
        fc.renderAll()
      }
    }

    const onUp=()=>{
      if(!isDown.current) return
      isDown.current=false
      const t=tRef.current
      if((t==='pen'||t==='marker'||t==='highlighter')&&dpRef.current){
        dpRef.current.set({selectable:true,evented:true})
        dpRef.current=null
      }
      if(t==='connector'&&clRef.current){
        clRef.current.set({selectable:true,evented:true})
        clRef.current=null
      }
      doSave()
    }

    fc.on('mouse:down', onDown)
    fc.on('mouse:move', onMove)
    fc.on('mouse:up',   onUp)

    // Update selection mode
    const isSel = tool==='select'
    fc.selection = isSel
    fc.forEachObject((o:any)=>{ o.selectable=isSel; o.evented=isSel||o.data?.type==='text' })

    return()=>{
      fc.off('mouse:down',onDown)
      fc.off('mouse:move',onMove)
      fc.off('mouse:up',  onUp)
    }
  },[tool,ready,doSave])

  // BG texture
  useEffect(()=>{
    const fc=fcRef.current; if(!fc) return
    drawBg(fc,bgTexture)
  },[bgTexture,drawBg])

  const handleBack = ()=>{ saveThumbnail(); closeCanvas() }
  const handleUndo = ()=>{ const j=storeUndo(); const fc=fcRef.current; if(j&&fc) fc.loadFromJSON(j,()=>fc.renderAll()) }
  const handleRedo = ()=>{ const j=storeRedo(); const fc=fcRef.current; if(j&&fc) fc.loadFromJSON(j,()=>fc.renderAll()) }

  return (
    <div style={{width:'100vw',height:'100vh',background:'#111',position:'relative',overflow:'hidden'}}>
      <div id="cv-wrap" style={{position:'absolute',inset:0,top:52}}>
        <canvas ref={cvRef} />
      </div>

      <TopBar onBack={handleBack} onUndo={handleUndo} onRedo={handleRedo} />
      <Toolbar />

      {activePanel==='pen'     && <PenPanel />}
      {activePanel==='text'    && <TextPanel />}
      {activePanel==='shape'   && <ShapePanel />}
      {activePanel==='sticky'  && <NotePanel />}
      {activePanel==='sticker' && <StickerPanel />}
      {activePanel==='washi'   && <WashiPanel />}
    </div>
  )
}

