import { useStore, Tool } from '../../store/useStore'

const TOOLS: { id:Tool; icon:string; label:string; panel?:string }[] = [
  { id:'select',      icon:'↖',  label:'Select'    },
  { id:'pen',         icon:'✏',  label:'Pen',       panel:'pen'     },
  { id:'marker',      icon:'▌',  label:'Marker',    panel:'pen'     },
  { id:'highlighter', icon:'▓',  label:'Hi-lite',   panel:'pen'     },
  { id:'eraser',      icon:'◻',  label:'Erase'      },
  { id:'text',        icon:'T',  label:'Text',       panel:'text'    },
  { id:'sticky',      icon:'📌', label:'Note',       panel:'sticky'  },
  { id:'shape',       icon:'◇',  label:'Shape',      panel:'shape'   },
  { id:'connector',   icon:'↔',  label:'Line'        },
  { id:'sticker',     icon:'🐱', label:'Sticker',    panel:'sticker' },
  { id:'washi',       icon:'〰', label:'Tape',       panel:'washi'   },
]

export default function Toolbar() {
  const { tool, setTool, activePanel, togglePanel, closePanel } = useStore()

  const handleClick = (t: typeof TOOLS[number]) => {
    setTool(t.id)
    if (t.panel) togglePanel(t.panel)
    else closePanel()
  }

  return (
    <div className="glass" style={{
      position:'fixed', left:8, top:'50%', transform:'translateY(-50%)',
      width:58, borderRadius:20, padding:'8px 5px',
      display:'flex', flexDirection:'column', alignItems:'center', gap:2,
      zIndex:60, maxHeight:'calc(100vh - 120px)', overflowY:'auto',
    }}>
      {TOOLS.map((t, i) => {
        const isActive   = tool === t.id
        const panelOpen  = t.panel && activePanel === t.panel
        const showDiv    = [1,5,7,9].includes(i)
        return (
          <div key={t.id} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            {showDiv && (
              <div style={{ width:36, height:1, background:'var(--border)', margin:'3px 0' }} />
            )}
            <button
              className={`tool-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleClick(t)}
              style={{
                background: panelOpen ? 'rgba(167,139,250,0.18)' : undefined,
                borderColor: panelOpen ? 'rgba(167,139,250,0.5)' : undefined,
              }}>
              <span style={{
                fontSize: t.id==='text' ? '1.1rem' : '1.2rem',
                fontWeight: t.id==='text' ? 900 : undefined,
              }}>{t.icon}</span>
              <span className="lbl">{t.label}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
