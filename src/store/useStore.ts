import { create } from 'zustand'

export type Screen = 'home' | 'canvas' | 'settings'
export type Tool = 'select'|'pen'|'marker'|'highlighter'|'eraser'|'text'|'sticky'|'shape'|'sticker'|'washi'|'connector'
export type ShapeType = 'rect'|'circle'|'triangle'|'diamond'|'pentagon'|'star'|'arrow'
export type Theme = 'amoled'|'dark'|'pastel'|'cyberpunk'
export type BgTexture = 'none'|'dots'|'grid'|'lines'

export interface CanvasFile {
  id: string; name: string; thumbnail: string; data: string
  createdAt: number; updatedAt: number
}
export interface TextFormat {
  fontFamily:string; fontSize:number; bold:boolean; italic:boolean
  underline:boolean; strikethrough:boolean; color:string; align:'left'|'center'|'right'
}
export interface NoteStyle { bg:string; border:string; text:string }

const FILES_KEY='mc_files_v2'
function loadFiles():CanvasFile[]{ try{return JSON.parse(localStorage.getItem(FILES_KEY)||'[]')}catch{return[]} }
function saveFiles(f:CanvasFile[]){ localStorage.setItem(FILES_KEY,JSON.stringify(f)) }

interface Store {
  screen:Screen; setScreen:(s:Screen)=>void
  tool:Tool; setTool:(t:Tool)=>void
  activePanel:string|null; togglePanel:(p:string)=>void; closePanel:()=>void
  activeCanvasId:string|null
  openCanvas:(id:string)=>void; closeCanvas:()=>void
  files:CanvasFile[]
  upsertFile:(id:string,name:string,data:string,thumb:string)=>void
  deleteFile:(id:string)=>void
  newCanvas:()=>string
  penColor:string; setPenColor:(c:string)=>void
  penSize:number; setPenSize:(n:number)=>void
  penOpacity:number; setPenOpacity:(n:number)=>void
  noteStyle:NoteStyle; setNoteStyle:(s:NoteStyle)=>void
  shapeType:ShapeType; setShapeType:(s:ShapeType)=>void
  shapeFill:string; setShapeFill:(c:string)=>void
  textFormat:TextFormat; updateText:(f:Partial<TextFormat>)=>void
  stickerTab:string; setStickerTab:(t:string)=>void
  stickerCategory:string; setStickerCategory:(s:string)=>void
  theme:Theme; setTheme:(t:Theme)=>void
  bgTexture:BgTexture; setBgTexture:(t:BgTexture)=>void
  history:string[]; histIdx:number
  pushHist:(json:string)=>void; undo:()=>string|null; redo:()=>string|null
  toast:string; showToast:(msg:string)=>void
}

export const useStore = create<Store>((set,get)=>({
  screen:'home', setScreen:screen=>set({screen}),
  tool:'pen', setTool:tool=>set({tool}),
  activePanel:null,
  togglePanel:p=>set(s=>({activePanel:s.activePanel===p?null:p})),
  closePanel:()=>set({activePanel:null}),
  activeCanvasId:null,
  openCanvas:id=>set({activeCanvasId:id,screen:'canvas',history:[],histIdx:-1,tool:'pen',activePanel:null}),
  closeCanvas:()=>set({screen:'home',activeCanvasId:null}),
  files:loadFiles(),
  upsertFile:(id,name,data,thumb)=>{
    const prev=get().files; const idx=prev.findIndex(f=>f.id===id)
    const entry:CanvasFile={id,name,data,thumbnail:thumb,
      createdAt:idx>=0?prev[idx].createdAt:Date.now(),updatedAt:Date.now()}
    const next=idx>=0?prev.map(f=>f.id===id?entry:f):[...prev,entry]
    saveFiles(next); set({files:next})
  },
  deleteFile:id=>{const next=get().files.filter(f=>f.id!==id);saveFiles(next);set({files:next})},
  newCanvas:()=>`cv_${Date.now()}`,
  penColor:'#a78bfa', setPenColor:penColor=>set({penColor}),
  penSize:5, setPenSize:penSize=>set({penSize}),
  penOpacity:1, setPenOpacity:penOpacity=>set({penOpacity}),
  noteStyle:{bg:'#fef9c3',border:'#fbbf24',text:'#1a1a2e'}, setNoteStyle:noteStyle=>set({noteStyle}),
  shapeType:'rect', setShapeType:shapeType=>set({shapeType}),
  shapeFill:'transparent', setShapeFill:shapeFill=>set({shapeFill}),
  textFormat:{fontFamily:'Nunito',fontSize:22,bold:false,italic:false,
    underline:false,strikethrough:false,color:'#ffffff',align:'left'},
  updateText:f=>set(s=>({textFormat:{...s.textFormat,...f}})),
  stickerTab:'kawaii', setStickerTab:stickerTab=>set({stickerTab}),
  stickerCategory:'kawaii', setStickerCategory:stickerCategory=>set({stickerCategory}),
  theme:'amoled',
  setTheme:theme=>{ document.body.className=theme==='amoled'?'':`theme-${theme}`; set({theme}) },
  bgTexture:'none', setBgTexture:bgTexture=>set({bgTexture}),
  history:[],histIdx:-1,
  pushHist:json=>{
    const {history,histIdx}=get()
    const next=[...history.slice(0,histIdx+1),json]
    if(next.length>40) next.shift()
    set({history:next,histIdx:next.length-1})
  },
  undo:()=>{
    const {history,histIdx}=get()
    if(histIdx<=0) return null
    const i=histIdx-1; set({histIdx:i}); return history[i]
  },
  redo:()=>{
    const {history,histIdx}=get()
    if(histIdx>=history.length-1) return null
    const i=histIdx+1; set({histIdx:i}); return history[i]
  },
  toast:'', showToast:toast=>{set({toast});setTimeout(()=>set({toast:''}),2500)},
}))
