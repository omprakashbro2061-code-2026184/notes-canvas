import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function HomeScreen() {
  const { files, newCanvas, openCanvas, deleteFile, upsertFile, showToast } = useStore()
  const [renaming, setRenaming]   = useState<string|null>(null)
  const [renameVal, setRenameVal] = useState('')
  const [confirmDel, setConfirmDel] = useState<string|null>(null)

  const handleNew = () => {
    const id = newCanvas()
    upsertFile(id, `Canvas ${files.length+1}`, '{}', '')
    openCanvas(id)
  }

  const confirmRename = (id:string) => {
    const f = files.find(f=>f.id===id)
    if(!f) return
    upsertFile(id, renameVal.trim()||f.name, f.data, f.thumbnail)
    setRenaming(null)
    showToast('Renamed ✓')
  }

  const sorted = [...files].sort((a,b)=>b.updatedAt-a.updatedAt)

  return (
    <div style={{width:'100vw',height:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',overflow:'hidden'}}>

      {/* ── Header ── */}
      <div style={{
        padding:'48px 20px 16px',
        background:'var(--bg)',
        borderBottom:'1px solid var(--border)',
        flexShrink:0,
      }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            {/* Logo */}
            <div style={{
              width:44,height:44,borderRadius:14,
              background:'linear-gradient(135deg,#a78bfa,#f472b6)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'1.4rem',boxShadow:'0 4px 16px rgba(167,139,250,0.4)',
            }}>🎨</div>
            <div>
              <div style={{fontSize:'1.5rem',fontWeight:900,letterSpacing:'-0.04em',color:'var(--text)',lineHeight:1}}>
                My<span style={{color:'var(--accent)'}}>Canvas</span>
              </div>
              <div style={{fontSize:'0.72rem',color:'var(--text2)',marginTop:2}}>
                {files.length} saved · offline · private
              </div>
            </div>
          </div>
          <button onClick={()=>useStore.getState().setScreen('settings')}
            style={{width:40,height:40,borderRadius:12,background:'var(--surface)',
              border:'1px solid var(--border)',color:'var(--text2)',fontSize:'1.1rem',
              cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            ⚙
          </button>
        </div>
      </div>

      {/* ── File list ── */}
      <div className="scroll-y" style={{flex:1,padding:'14px 16px 110px'}}>
        {sorted.length===0 ? (
          <div style={{textAlign:'center',paddingTop:'22vh',display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{
              width:80,height:80,borderRadius:24,
              background:'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(244,114,182,0.15))',
              border:'1px solid var(--border)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',
            }}>🎨</div>
            <div style={{fontWeight:800,fontSize:'1.1rem',color:'var(--text)'}}>Start creating</div>
            <div style={{color:'var(--text2)',fontSize:'0.85rem',maxWidth:220,lineHeight:1.6}}>
              Tap the button below to create your first canvas
            </div>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {sorted.map((file,i) => (
              <div key={file.id} className="card anim-up"
                style={{animationDelay:`${i*0.04}s`,position:'relative',overflow:'hidden'}}>

                {/* Thumbnail */}
                <div onClick={()=>openCanvas(file.id)}
                  style={{height:100,background:'var(--bg3)',cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative'}}>
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  ) : (
                    <div style={{
                      width:'100%',height:'100%',
                      background:'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(244,114,182,0.08))',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:'2rem',opacity:0.3,
                    }}>🎨</div>
                  )}
                  {/* Open pill */}
                  <div style={{
                    position:'absolute',bottom:8,right:8,
                    background:'rgba(0,0,0,0.7)',color:'white',
                    padding:'4px 12px',borderRadius:100,fontSize:'0.75rem',fontWeight:700,
                    backdropFilter:'blur(8px)',
                  }}>Open →</div>
                </div>

                {/* Info */}
                <div style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
                  {renaming===file.id ? (
                    <input className="input" autoFocus
                      value={renameVal}
                      onChange={e=>setRenameVal(e.target.value)}
                      onBlur={()=>confirmRename(file.id)}
                      onKeyDown={e=>{if(e.key==='Enter') confirmRename(file.id)}}
                      style={{flex:1,padding:'6px 10px',fontSize:'0.9rem'}} />
                  ) : (
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:'0.92rem',color:'var(--text)',
                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {file.name}
                      </div>
                      <div style={{fontSize:'0.7rem',color:'var(--text3)',marginTop:1}}>
                        {new Date(file.updatedAt).toLocaleDateString(undefined,
                          {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                      </div>
                    </div>
                  )}

                  <div style={{display:'flex',gap:4,flexShrink:0}}>
                    <button onClick={()=>openCanvas(file.id)}
                      style={{padding:'7px 14px',borderRadius:8,background:'var(--accent)',
                        color:'white',border:'none',cursor:'pointer',
                        fontSize:'0.78rem',fontWeight:700,fontFamily:'Nunito'}}>
                      Open
                    </button>
                    <button onClick={()=>{setRenaming(file.id);setRenameVal(file.name)}}
                      style={{width:32,height:32,borderRadius:8,background:'var(--surface)',
                        border:'1px solid var(--border)',color:'var(--text2)',
                        cursor:'pointer',fontSize:'0.9rem',
                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                      ✎
                    </button>
                    <button onClick={()=>setConfirmDel(file.id)}
                      style={{width:32,height:32,borderRadius:8,
                        background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',
                        color:'#f87171',cursor:'pointer',fontSize:'0.85rem',
                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── New Canvas FAB ── */}
      <div style={{
        position:'fixed',bottom:0,left:0,right:0,
        padding:'16px 20px',
        paddingBottom:'calc(16px + env(safe-area-inset-bottom,0px))',
        background:'linear-gradient(to top,var(--bg) 70%,transparent)',
      }}>
        <button onClick={handleNew}
          style={{
            width:'100%',padding:'17px',borderRadius:16,border:'none',
            background:'linear-gradient(135deg,#a78bfa,#f472b6)',
            color:'white',fontSize:'1rem',fontWeight:800,fontFamily:'Nunito',
            cursor:'pointer',
            boxShadow:'0 4px 24px rgba(167,139,250,0.45)',
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          }}>
          <span style={{fontSize:'1.2rem'}}>+</span> New Canvas
        </button>
      </div>

      {/* ── Delete confirm ── */}
      {confirmDel && (
        <div className="overlay" onClick={()=>setConfirmDel(null)}>
          <div className="glass anim-slide" onClick={(e:any)=>e.stopPropagation()}
            style={{width:'100%',maxWidth:480,borderRadius:'20px 20px 0 0',
              padding:24,display:'flex',flexDirection:'column',gap:16}}>
            <div style={{fontWeight:800,fontSize:'1.05rem'}}>Delete canvas?</div>
            <div style={{color:'var(--text2)',fontSize:'0.88rem'}}>This cannot be undone.</div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setConfirmDel(null)}
                style={{flex:1,padding:13,borderRadius:12,border:'1px solid var(--border)',
                  background:'var(--surface)',color:'var(--text)',cursor:'pointer',
                  fontFamily:'Nunito',fontWeight:700,fontSize:'0.9rem'}}>Cancel</button>
              <button onClick={()=>{deleteFile(confirmDel);setConfirmDel(null);showToast('Deleted')}}
                style={{flex:1,padding:13,borderRadius:12,border:'1px solid rgba(239,68,68,0.3)',
                  background:'rgba(239,68,68,0.12)',color:'#f87171',cursor:'pointer',
                  fontFamily:'Nunito',fontWeight:700,fontSize:'0.9rem'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
