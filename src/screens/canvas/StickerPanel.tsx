import { fabric } from 'fabric'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CLIPART_CATEGORIES, EMOJI_CATEGORIES } from '../../data/index'

export default function StickerPanel() {
  const { stickerTab, setStickerTab, stickerCategory, setStickerCategory, showToast, closePanel } = useStore()
  const [search, setSearch] = useState('')

  const addSvgSticker = (svg: string, name: string) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    fabric.loadSVGFromURL(url, (objects, options) => {
      const group = fabric.util.groupSVGElements(objects, options)
      group.set({
        left: fc.getWidth() / 2 - 40,
        top: fc.getHeight() / 2 - 40,
        scaleX: 80 / (group.width || 80),
        scaleY: 80 / (group.height || 80),
        data: { type: 'sticker', name },
      })
      fc.add(group)
      fc.setActiveObject(group)
      fc.renderAll()
      URL.revokeObjectURL(url)
      showToast(`Added ${name} ✓`)
    })
  }

  const addEmoji = (emoji: string) => {
    const fc = (window as any).__fc as fabric.Canvas | null
    if (!fc) return
    const txt = new fabric.Text(emoji, {
      left: fc.getWidth() / 2 - 30,
      top: fc.getHeight() / 2 - 30,
      fontSize: 56,
      selectable: true,
      data: { type: 'emoji' },
    })
    fc.add(txt)
    fc.setActiveObject(txt)
    fc.renderAll()
    showToast(`Added ${emoji}`)
  }

  const currentClipart = CLIPART_CATEGORIES.find(c => c.id === stickerCategory) || CLIPART_CATEGORIES[0]
  const currentEmoji   = EMOJI_CATEGORIES.find(c => c.id === stickerCategory)   || EMOJI_CATEGORIES[0]

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 74 }} onClick={closePanel} />

      {/* Panel */}
      <div
        className="glass anim-slide"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          borderRadius: '20px 20px 0 0',
          padding: '0 0 env(safe-area-inset-bottom, 0px)',
          zIndex: 75,
          maxHeight: '72vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div style={{ padding: '10px 16px 0', flexShrink: 0 }}>
          <div className="panel-handle" />
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 6, padding: '8px 14px',
          background: 'var(--bg3)', flexShrink: 0,
        }}>
          {[
            { id: 'clipart', label: '🎨 Clip Art' },
            { id: 'emoji',   label: '😊 Emoji'    },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setStickerTab(tab.id as 'clipart' | 'emoji')
                setStickerCategory(tab.id === 'clipart' ? 'stars' : 'smileys')
              }}
              style={{
                flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: stickerTab === tab.id ? 'var(--accent)' : 'var(--surface)',
                color: stickerTab === tab.id ? '#fff' : 'var(--text2)',
                fontWeight: 700, fontSize: '0.88rem', fontFamily: 'Nunito',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="scroll-x" style={{
          display: 'flex', gap: 6, padding: '8px 14px',
          flexShrink: 0,
        }}>
          {(stickerTab === 'clipart' ? CLIPART_CATEGORIES : EMOJI_CATEGORIES).map(cat => (
            <button
              key={cat.id}
              onClick={() => setStickerCategory(cat.id)}
              style={{
                padding: '6px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
                flexShrink: 0, fontFamily: 'Nunito', fontSize: '0.8rem', fontWeight: 600,
                background: stickerCategory === cat.id ? 'rgba(167,139,250,0.2)' : 'var(--surface)',
                color: stickerCategory === cat.id ? 'var(--accent)' : 'var(--text2)',
                border: `1px solid ${stickerCategory === cat.id ? 'rgba(167,139,250,0.4)' : 'transparent'}`,
                whiteSpace: 'nowrap',
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="scroll-y" style={{
          flex: 1, padding: '4px 14px 16px',
          overflowY: 'auto',
        }}>
          {stickerTab === 'clipart' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {currentClipart.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => addSvgSticker(item.svg, item.name)}
                  title={item.name}
                  style={{
                    aspectRatio: '1', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--surface)', cursor: 'pointer', padding: 8,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 4, transition: 'all 0.15s',
                  }}
                  onPointerDown={e => {
                    e.currentTarget.style.transform = 'scale(0.92)'
                    e.currentTarget.style.background = 'var(--surface2)'
                  }}
                  onPointerUp={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.background = 'var(--surface)'
                  }}
                >
                  <div
                    style={{ width: 44, height: 44 }}
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span style={{
                    fontSize: '0.58rem', color: 'var(--text3)',
                    fontWeight: 600, textAlign: 'center', lineHeight: 1.2,
                  }}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
              {currentEmoji.items.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  style={{
                    aspectRatio: '1', borderRadius: 10, border: '1px solid transparent',
                    background: 'transparent', cursor: 'pointer', fontSize: '1.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.12s',
                  }}
                  onPointerDown={e => {
                    e.currentTarget.style.transform = 'scale(0.88)'
                    e.currentTarget.style.background = 'var(--surface)'
                  }}
                  onPointerUp={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
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
