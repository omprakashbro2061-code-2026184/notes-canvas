import { fabric } from 'fabric'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CLIPART_CATEGORIES, EMOJI_CATEGORIES } from '../../data/index'

function StickerPanel() {
  const { stickerTab, setStickerTab, stickerCategory, setStickerCategory, showToast, closePanel } = useStore()
  const [, setR] = useState(0)

  const addSvg = (svg: string, name: string) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    fabric.loadSVGFromURL(url, (objs: any, opts: any) => {
      const grp = fabric.util.groupSVGElements(objs, opts)
      grp.set({ left: fc.getWidth()/2-40, top: fc.getHeight()/2-40,
        scaleX: 80/((grp as any).width||80), scaleY: 80/((grp as any).height||80),
        data: { type:'sticker', name } } as any)
      fc.add(grp); fc.setActiveObject(grp); fc.renderAll()
      URL.revokeObjectURL(url)
      showToast('Added ' + name)
    })
  }

  const addEmoji = (e: string) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const t = new fabric.Text(e, { left:fc.getWidth()/2-30, top:fc.getHeight()/2-30,
      fontSize:56, selectable:true, data:{type:'emoji'} })
    fc.add(t); fc.setActiveObject(t); fc.renderAll()
    showToast('Added ' + e); setR(n=>n+1)
  }

  const cats  = stickerTab==='clipart' ? CLIPART_CATEGORIES : EMOJI_CATEGORIES
  const cur   = cats.find(c=>c.id===stickerCategory) || cats[0]

  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:74}} onClick={closePanel}/>
      <div className="glass anim-slide" onClick={(e:any)=>e.stopPropagation()}
        style={{position:'fixed',bottom:0,left:0,right:0,borderRadius:'20px 20px 0 0',
          zIndex:75,maxHeight:'72vh',display:'flex',flexDirection:'column'}}>

        <div style={{padding:'10px 16px 0',flexShrink:0}}>
          <div className="panel-handle"/>
        </div>

        <div style={{display:'flex',gap:6,padding:'8px 14px',background:'var(--bg3)',flexShrink:0}}>
          {(['clipart','emoji'] as const).map(tab=>(
            <button key={tab} onClick={()=>{setStickerTab(tab);setStickerCategory(tab==='clipart'?'stars':'smileys')}}
              style={{flex:1,padding:'9px',borderRadius:10,border:'none',cursor:'pointer',fontFamily:'Nunito',fontWeight:700,fontSize:'0.88rem',
                background:stickerTab===tab?'var(--accent)':'var(--surface)',
                color:stickerTab===tab?'#fff':'var(--text2)'}}>
              {tab==='clipart'?'🎨 Clip Art':'😊 Emoji'}
            </button>
          ))}
        </div>

        <div className="scroll-x" style={{display:'flex',gap:6,padding:'8px 14px',flexShrink:0}}>
          {cats.map(cat=>(
            <button key={cat.id} onClick={()=>setStickerCategory(cat.id)}
              style={{padding:'6px 12px',borderRadius:100,border:'none',cursor:'pointer',
                flexShrink:0,fontFamily:'Nunito',fontSize:'0.8rem',fontWeight:600,whiteSpace:'nowrap',
                background:stickerCategory===cat.id?'rgba(167,139,250,0.2)':'var(--surface)',
                color:stickerCategory===cat.id?'var(--accent)':'var(--text2)'}}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="scroll-y" style={{flex:1,padding:'4px 14px 16px'}}>
          {stickerTab==='clipart' ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {(cur as typeof CLIPART_CATEGORIES[0]).items.map((item:any)=>(
                <button key={item.id} onClick={()=>addSvg(item.svg,item.name)}
                  style={{aspectRatio:'1',borderRadius:12,border:'1px solid var(--border)',
                    background:'var(--surface)',cursor:'pointer',padding:8,
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}
                  onPointerDown={(e:any)=>e.currentTarget.style.transform='scale(0.92)'}
                  onPointerUp={(e:any)=>e.currentTarget.style.transform='scale(1)'}>
                  <div style={{width:44,height:44}} dangerouslySetInnerHTML={{__html:item.svg}}/>
                  <span style={{fontSize:'0.58rem',color:'var(--text3)',fontWeight:600,textAlign:'center'}}>{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6}}>
              {(cur as typeof EMOJI_CATEGORIES[0]).items.map((emoji:string)=>(
                <button key={emoji} onClick={()=>addEmoji(emoji)}
                  style={{aspectRatio:'1',borderRadius:10,border:'1px solid transparent',
                    background:'transparent',cursor:'pointer',fontSize:'1.8rem',
                    display:'flex',alignItems:'center',justifyContent:'center'}}
                  onPointerDown={(e:any)=>{e.currentTarget.style.transform='scale(0.88)';e.currentTarget.style.background='var(--surface)'}}
                  onPointerUp={(e:any)=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.background='transparent'}}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StickerPanel
