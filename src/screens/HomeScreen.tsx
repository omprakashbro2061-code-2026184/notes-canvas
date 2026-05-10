import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function HomeScreen() {
  const { files, newCanvas, openCanvas, deleteFile, upsertFile, showToast } = useStore()
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameVal, setRenameVal] = useState('')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)

  const handleNew = () => {
    const id = newCanvas()
    upsertFile(id, `Canvas ${files.length + 1}`, '{}', '')
    openCanvas(id)
  }

  const handleOpen = (id: string) => openCanvas(id)

  const handleRename = (id: string, current: string) => {
    setRenaming(id)
    setRenameVal(current)
  }

  const confirmRename = (id: string) => {
    const f = files.find(f => f.id === id)
    if (!f) return
    useStore.getState().upsertFile(id, renameVal || f.name, f.data, f.thumbnail)
    setRenaming(null)
    showToast('Renamed ✓')
  }

  const handleDelete = (id: string) => {
    deleteFile(id)
    setConfirmDel(null)
    showToast('Deleted')
  }

  const sorted = [...files].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div style={{
      width:'100vw', height:'100vh', background:'var(--bg)',
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding:'52px 20px 16px',
        background:'var(--bg)',
        borderBottom:'1px solid var(--border)',
        flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{
              fontSize:'1.7rem', fontWeight:800, letterSpacing:'-0.03em',
              color:'var(--text)', lineHeight:1.1,
            }}>
              My<span style={{ color:'var(--accent)' }}>Canvas</span>
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--text2)', marginTop:2 }}>
              {files.length} canvas{files.length !== 1 ? 'es' : ''} · offline · private
            </div>
          </div>

          {/* Settings btn */}
          <button
            onClick={() => useStore.getState().setScreen('settings')}
            style={{
              width:42, height:42, borderRadius:12,
              background:'var(--surface)', border:'1px solid var(--border)',
              color:'var(--text2)', fontSize:'1.2rem', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
          >⚙</button>
        </div>
      </div>

      {/* ── File list ── */}
      <div className="scroll-y" style={{ flex:1, padding:'16px 16px 100px' }}>
        {sorted.length === 0 ? (
          <div style={{
            textAlign:'center', paddingTop:'25vh',
            display:'flex', flexDirection:'column', alignItems:'center', gap:12,
          }}>
            <div style={{ fontSize:'3rem', opacity:0.2 }}>🎨</div>
            <div style={{ color:'var(--text2)', fontSize:'0.95rem' }}>No canvases yet</div>
            <div style={{ color:'var(--text3)', fontSize:'0.82rem' }}>Tap the button below to start</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {sorted.map(file => (
              <div key={file.id} className="card anim-up" style={{ position:'relative' }}>
                {/* Thumbnail / preview area */}
                <div
                  onClick={() => handleOpen(file.id)}
                  style={{
                    height:90, background:'var(--bg3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor:'pointer', overflow:'hidden', position:'relative',
                  }}
                >
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ fontSize:'2rem', opacity:0.15 }}>🎨</div>
                  )}
                  {/* Open overlay */}
                  <div style={{
                    position:'absolute', inset:0, background:'rgba(0,0,0,0)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    opacity:0, transition:'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <div style={{
                      background:'rgba(0,0,0,0.6)', color:'white',
                      padding:'6px 14px', borderRadius:100, fontSize:'0.82rem', fontWeight:600,
                    }}>Open</div>
                  </div>
                </div>

                {/* Info row */}
                <div style={{
                  padding:'10px 14px',
                  display:'flex', alignItems:'center', gap:10,
                }}>
                  {renaming === file.id ? (
                    <input
                      className="input"
                      value={renameVal}
                      autoFocus
                      onChange={e => setRenameVal(e.target.value)}
                      onBlur={() => confirmRename(file.id)}
                      onKeyDown={e => e.key === 'Enter' && confirmRename(file.id)}
                      style={{ flex:1, padding:'6px 10px', fontSize:'0.9rem' }}
                    />
                  ) : (
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{
                        fontWeight:700, fontSize:'0.92rem', color:'var(--text)',
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize:'0.7rem', color:'var(--text3)', marginTop:1 }}>
                        {new Date(file.updatedAt).toLocaleDateString(undefined,{ month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display:'flex', gap:4 }}>
                    <button onClick={() => handleOpen(file.id)}
                      style={{ padding:'6px 12px', borderRadius:8, background:'var(--accent)', color:'white',
                        border:'none', cursor:'pointer', fontSize:'0.78rem', fontWeight:700, fontFamily:'Nunito' }}>
                      Open
                    </button>
                    <button onClick={() => handleRename(file.id, file.name)}
                      style={{ width:32, height:32, borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)',
                        color:'var(--text2)', cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      ✎
                    </button>
                    <button onClick={() => setConfirmDel(file.id)}
                      style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
                        color:'#f87171', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
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
        position:'fixed', bottom:0, left:0, right:0,
        padding:'16px 20px', paddingBottom:'calc(16px + env(safe-area-inset-bottom, 0px))',
        background:'linear-gradient(to top, var(--bg) 60%, transparent)',
      }}>
        <button className="btn btn-primary" onClick={handleNew}
          style={{ width:'100%', padding:'16px', fontSize:'1rem', borderRadius:14,
            boxShadow:'0 0 30px rgba(167,139,250,0.4)' }}>
          + New Canvas
        </button>
      </div>

      {/* ── Delete confirm modal ── */}
      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="glass anim-slide" onClick={e => e.stopPropagation()}
            style={{ width:'100%', maxWidth:440, borderRadius:'20px 20px 0 0', padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontWeight:800, fontSize:'1.05rem' }}>Delete canvas?</div>
            <div style={{ color:'var(--text2)', fontSize:'0.88rem' }}>This cannot be undone.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex:1 }} onClick={() => handleDelete(confirmDel)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
