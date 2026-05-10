import { useEffect } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import TextToolbar from './components/TextToolbar'
import StickerPanel from './components/StickerPanel'
import SettingsPanel from './components/SettingsPanel'
import { useStore } from './store/useStore'

export default function App() {
  const { toastMsg } = useStore()

  // Prevent default touch behaviors on mobile
  useEffect(() => {
    document.body.addEventListener('touchstart', (e) => {
      if ((e.target as HTMLElement).closest('button, input, select, textarea')) return
      e.preventDefault()
    }, { passive: false })

    document.body.addEventListener('touchmove', (e) => {
      if ((e.target as HTMLElement).closest('.popup-panel, [data-scroll]')) return
      e.preventDefault()
    }, { passive: false })
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg)',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(167,139,250,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(244,114,182,0.06) 0%, transparent 50%),
            var(--bg)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Canvas (behind everything) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas />
      </div>

      {/* Toolbar (left sidebar) */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Toolbar />
      </div>

      {/* Text formatting bar (top center) */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <TextToolbar />
      </div>

      {/* Sticker / Washi panel (right side) */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <StickerPanel />
      </div>

      {/* Settings (top right) */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <SettingsPanel />
      </div>

      {/* Toast notification */}
      {toastMsg && (
        <div className="toast">{toastMsg}</div>
      )}

      {/* App label (bottom left) */}
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          left: 72,
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 5,
          fontFamily: 'Nunito',
        }}
      >
        Notes Canvas · Auto-saved
      </div>
    </div>
  )
}
