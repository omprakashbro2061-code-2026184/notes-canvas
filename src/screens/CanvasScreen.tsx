import { useEffect, useRef, useCallback, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from '../store/useStore'
import { NOTE_STYLES } from '../data/index'
import Toolbar from './canvas/Toolbar'
import TopBar from './canvas/TopBar'
import StickerPanel from './canvas/StickerPanel'
import { TextPanel, PenPanel, ShapePanel, NotePanel, WashiPanel } from './canvas/Panels'

function makeStickyNote(x:number,y:number,style:{bg:string;border:string;text:string}):fabric.Group {
  const W=190,H=170,F=20
  const bg   = new fabric.Path(`M0,0 L${W-F},0 L${W},${F} L${W},${H} L0,${H} Z`,
    { fill:style.bg, stroke:style.border, strokeWidth:1.5,
      shadow:new fabric.Shadow({color:'rgba(0,0,0,0.3)',blur:20,offsetX:3,offsetY:7}) })
  const fold = new fabric.Path(`M${W-F},0 L${W},${F} L${W-F},${F} Z`,
    { fill:style.border, opacity:0.5 })
  const tb   = new fabric.Textbox('Tap twice to type', {
    left:10, top:14, width:W-26, fontSize:15, fontFamily:'Caveat',
    fill:style.text, editable:true, splitByGrapheme:false, lineHeight:1.45,
  })
  return new fabric.Group([bg,fold,tb], {
    left:x-W/2, top:y-H/2, subTargetCheck:true, data:{type:'sticky'},
  })
}

function pentPts(r:number):{x:number;y:number}[] {
  return Array.from({length:5},(_,i)=>{
    const a=(Math.PI*2*i)/5-Math.PI/2
    return {x:r+r*Math.cos(a),y:r+r*Math.sin(a)}
  })
}
function starPts(r:number,r2:number):{x:number;y:number}[] {
  return Array.from({length:10},(_,i)=>{
    const a=(Math.PI*i)/5-Math.PI/2
    const rad=i%2===0?r:r2
    return {x:r+rad*Math.cos(a),y:r+rad*Math.sin(a)}
  })
}

const SAVE_PFX = 'mc_cv_'

export default function CanvasScreen() {
  const cvRef  = useRef<HTMLCanvasElement>(null)
  const fcRef  = useRef<fabric.Canvas|null>(null)
  const dpRef  = useRef<fabric.Path|null>(null)
  const isDown = useRef(false)
  const clRef  = useRef<fabric.Line|null>(null)
  const [ready, setReady] = useState(false)

  const {
    activeCanvasId, closeCanvas, bgTexture,
    tool, noteStyle, penColor, penSize, penOpacity,
    shapeType, shapeFill, textFormat,
    pushHist, undo:storeUndo, redo:storeRedo,
    showToast, upsertFile, files, activePanel, closePanel,
  } = useStore()

  const tRef    = useRef(tool)
  const pcRef   = useRef(penColor)
  const psRef   = useRef(penSize)
  const poRef   = useRef(penOpacity)
  const nsRef   = useRef(noteStyle)
  const stRef   = useRef(shapeType)
  const sfRef   = useRef(shapeFill)
  const tfRef   = useRef(textFormat)
  const bgRef   = useRef(bgTexture)

  useEffect(()=>{tRef.current=tool},[tool])
  useEffect(()=>{pcRef.current=penColor},[penColor])
  useEffect(()=>{psRef.current=penSize},[penSize])
  useEffect(()=>{poRef.current=penOpacity},[penOpacity])
  useEffect(()=>{nsRef.current=noteStyle},[noteStyle])
  useEffect(()=>{stRef.current=shapeType},[shapeType])
  useEffect(()=>{sfRef.current=shapeFill},[shapeFill])
  useEffect(()=>{tfRef.current=textFormat},[textFormat])

  const doSave = useCallback(()=>{
    const fc=fcRef.current; if(!fc||!activeCanvasId) return
    const data=JSON.stringify(fc.toJSON(['data','selectable','editable']))
    localStorage.setItem(SAVE_PFX+activeCanvasId,data)
    pushHist(data)
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

  const drawBg = useCallback((fc:fabric.Canvas,tex:string)=>{
    bgRef.current=tex as any
    const w=fc.getWidth(),h=fc.getHeight()
    if(tex==='none'){fc.setBackgroundColor('transparent',fc.renderAll.bind(fc));return}
    const bc=document.createElement('canvas')
    bc.width=w; bc.height=h
    const ctx=bc.getContext('2d')!
    ctx.clearRect(0,0,w,h)
    if(tex==='dots'){
      ctx.fillStyle='rgba(255,255,255,0.12)'
      for(let x=24;x<w;x+=28) for(let y=24;y<h;y+=28){
        ctx.beginPath();ctx.arc(x,y,1.3,0,Math.PI*2);ctx.fill()
      }
    } else if(tex==='grid'){
      ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1
      for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
      for(let y=0;y<h;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    } else if(tex==='lines'){
      ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1
      for(let y=38;y<h;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    }
    fc.setBackgroundImage(bc.toDataURL(),fc.renderAll.bind(fc))
  },[])

  // Init canvas
  useEffect(()=>{
    if(!cvRef.current||!activeCanvasId) return
    const wrap=document.getElementById('cv-wrap')!
    const W=wrap.clientWidth,H=wrap.clientHeight
    const fc=new fabric.Canvas(cvRef.current,{
      width:W,height:H,backgroundColor:'transparent',
      preserveObjectStacking:true,stopContextMenu:true,
      selectionColor:'rgba(167,139,250,0.10)',
      selectionBorderColor:'rgba(167,139,250,0.6)',
      selectionLineWidth:1.5,
    })
    fcRef.current=fc
    ;(window as any).__fc=fc
    ;(window as any).fabric=fabric

    const saved=localStorage.getItem(SAVE_PFX+activeCanvasId)
    if(saved&&saved!=='{}'){
      try{fc.loadFromJSON(saved,()=>{fc.renderAll();setReady(true)})}
      catch{setReady(true)}
    } else setReady(true)
    drawBg(fc,bgRef.current)

    fc.on('object:modified',doSave)
    fc.on('object:added',doSave)
    fc.on('object:removed',doSave)

    // Double-tap sticky note → enter text editing
    fc.on('mouse:dblclick',(e:fabric.IEvent)=>{
      const tgt=fc.findTarget(e.e as MouseEvent,false)
      if(!tgt) return
      if((tgt as any).data?.type==='sticky'){
        const grp=tgt as fabric.Group
        const items=grp.getObjects()
        const tb=items.find(o=>o instanceof fabric.Textbox) as fabric.Textbox|undefined
        if(tb){
          grp.set({selectable:false})
          fc.setActiveObject(tb); tb.enterEditing(); fc.renderAll()
        }
      }
    })

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
      if((e.metaKey||e.ctrlKey)&&e.key==='d'){
        e.preventDefault()
        const obj=fc.getActiveObject(); if(!obj) return
        obj.clone((c:any)=>{
          c.set({left:(obj.left||0)+24,top:(obj.top||0)+24})
          fc.add(c);fc.setActiveObject(c);fc.renderAll()
        })
      }
    }
    window.addEventListener('keydown',onKey)

    const onResize=()=>{
      const w=document.getElementById('cv-wrap'); if(!w) return
      fc.setWidth(w.clientWidth);fc.setHeight(w.clientHeight)
      drawBg(fc,bgRef.current);fc.renderAll()
    }
    window.addEventListener('resize',onResize)

    return()=>{
      saveThumbnail();fc.dispose()
      window.removeEventListener('keydown',onKey)
      window.removeEventListener('resize',onResize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeCanvasId])

  // Drawing mouse handlers
  useEffect(()=>{
    const fc=fcRef.current; if(!fc||!ready) return
    const getPos=(e:fabric.IEvent)=>{ const p=fc.getPointer(e.e as MouseEvent); return{x:p.x,y:p.y} }

    const onDown=(e:fabric.IEvent)=>{
      const t=tRef.current; const pos=getPos(e)
      closePanel()

      if(t==='select') return

      if(['pen','marker','highlighter'].includes(t)){
        isDown.current=true
        const size=t==='marker'?psRef.current*2.5:psRef.current
        const op=t==='highlighter'?0.38:poRef.current
        const p=new fabric.Path(`M${pos.x} ${pos.y} L${pos.x+0.1} ${pos.y+0.1}`,{
          stroke:pcRef.current,strokeWidth:size,fill:'',opacity:op,
          strokeLineCap:'round',strokeLineJoin:'round',
          selectable:false,evented:false,data:{type:'draw'},
        })
        fc.add(p);dpRef.current=p; return
      }

      if(t==='eraser'){isDown.current=true; return}

      if(t==='text'){
        const tf=tfRef.current
        const tb=new fabric.Textbox('',{
          left:pos.x,top:pos.y,width:220,
          fontSize:tf.fontSize,fontFamily:tf.fontFamily,
          fontWeight:tf.bold?'bold':'normal',
          fontStyle:tf.italic?'italic':'normal',
          underline:tf.underline,linethrough:tf.strikethrough,
          fill:tf.color,textAlign:tf.align,editable:true,data:{type:'text'},
        })
        fc.add(tb);fc.setActiveObject(tb);tb.enterEditing();doSave(); return
      }

      if(t==='sticky'){
        const note=makeStickyNote(pos.x,pos.y,nsRef.current)
        fc.add(note);fc.setActiveObject(note);doSave(); return
      }

      if(t==='shape'){
        const s=stRef.current
        const stroke=pcRef.current
        const fill=sfRef.current==='transparent'?'':sfRef.current
        let obj:fabric.Object
        if(s==='rect') obj=new fabric.Rect({left:pos.x,top:pos.y,width:130,height:90,fill,stroke,strokeWidth:3,rx:6,ry:6})
        else if(s==='circle') obj=new fabric.Ellipse({left:pos.x,top:pos.y,rx:65,ry:45,fill,stroke,strokeWidth:3})
        else if(s==='triangle') obj=new fabric.Triangle({left:pos.x,top:pos.y,width:110,height:100,fill,stroke,strokeWidth:3})
        else if(s==='diamond') obj=new fabric.Path('M70,0 L140,70 L70,140 L0,70 Z',{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else if(s==='pentagon') obj=new fabric.Polygon(pentPts(60),{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else if(s==='star') obj=new fabric.Polygon(starPts(60,28),{left:pos.x,top:pos.y,fill,stroke,strokeWidth:3})
        else obj=new fabric.Path('M10,50 L90,50 M75,35 L90,50 L75,65',{left:pos.x,top:pos.y,stroke,strokeWidth:3,fill:'',strokeLineCap:'round'})
        obj.set({data:{type:'shape'}})
        fc.add(obj);fc.setActiveObject(obj);doSave(); return
      }

      if(t==='connector'){
        const line=new fabric.Line([pos.x,pos.y,pos.x,pos.y],{
          stroke:pcRef.current,strokeWidth:2.5,
          selectable:false,evented:false,data:{type:'connector'},
        })
        fc.add(line);clRef.current=line;isDown.current=true
      }
    }

    const onMove=(e:fabric.IEvent)=>{
      if(!isDown.current) return
      const t=tRef.current; const pos=getPos(e)
      if(['pen','marker','highlighter'].includes(t)&&dpRef.current){
        const pathData=(dpRef.current as any).path as any[]
        pathData.push(['L',pos.x,pos.y])
        dpRef.current.set({path:pathData} as any)
        fc.renderAll(); return
      }
      if(t==='eraser'){
        const obj=fc.findTarget(e.e as MouseEvent,false)
        if(obj&&(obj as any).data?.type!=='sticky'){fc.remove(obj);fc.renderAll()}
        return
      }
      if(t==='connector'&&clRef.current){
        clRef.current.set({x2:pos.x,y2:pos.y} as any);fc.renderAll()
      }
    }

    const onUp=()=>{
      if(!isDown.current) return
      isDown.current=false
      const t=tRef.current
      if(['pen','marker','highlighter'].includes(t)&&dpRef.current){
        dpRef.current.set({selectable:true,evented:true});dpRef.current=null
      }
      if(t==='connector'&&clRef.current){
        clRef.current.set({selectable:true,evented:true});clRef.current=null
      }
      doSave()
    }

    fc.on('mouse:down',onDown)
    fc.on('mouse:move',onMove)
    fc.on('mouse:up',onUp)
    fc.selection=tool==='select'
    fc.forEachObject((o:any)=>{o.selectable=tool==='select'})

    return()=>{
      fc.off('mouse:down',onDown)
      fc.off('mouse:move',onMove)
      fc.off('mouse:up',onUp)
    }
  },[tool,ready,doSave,closePanel])

  useEffect(()=>{
    const fc=fcRef.current; if(!fc) return
    drawBg(fc,bgTexture)
  },[bgTexture,drawBg])

  const handleBack=()=>{saveThumbnail();closeCanvas()}
  const handleUndo=()=>{ const json=storeUndo(); const fc=fcRef.current; if(json&&fc) fc.loadFromJSON(json,()=>fc.renderAll()) }
  const handleRedo=()=>{ const json=storeRedo(); const fc=fcRef.current; if(json&&fc) fc.loadFromJSON(json,()=>fc.renderAll()) }

  return (
    <div style={{width:'100vw',height:'100vh',background:'var(--bg)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:`radial-gradient(ellipse at 15% 15%,rgba(167,139,250,0.04) 0%,transparent 55%),
                    radial-gradient(ellipse at 85% 85%,rgba(244,114,182,0.03) 0%,transparent 55%)`}} />

      <div id="cv-wrap" style={{position:'absolute',inset:0}}>
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
