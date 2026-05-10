import { create } from 'zustand'

export type Tool =
  | 'select' | 'pen' | 'marker' | 'highlighter' | 'eraser'
  | 'text' | 'sticky' | 'shape' | 'sticker' | 'washi' | 'connector'

export type ShapeType = 'rect' | 'circle' | 'triangle' | 'diamond' | 'pentagon' | 'star'
export type ConnectorType = 'straight' | 'curved' | 'right-angle'
export type TextAlign = 'left' | 'center' | 'right'
export type Theme = 'dark' | 'pastel' | 'cyberpunk' | 'vintage'
export type BgTexture = 'none' | 'dots' | 'grid' | 'parchment'

export interface TextFormat {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  color: string
  align: TextAlign
  rainbow: boolean
}

interface AppState {
  tool: Tool
  shapeType: ShapeType
  connectorType: ConnectorType
  penColor: string
  penSize: number
  penOpacity: number
  noteColor: string
  textFormat: TextFormat
  theme: Theme
  bgTexture: BgTexture
  stickerCategory: string
  openPanel: string | null
  canvasHistory: string[]
  historyIndex: number
  toastMsg: string

  setTool: (t: Tool) => void
  setShapeType: (s: ShapeType) => void
  setConnectorType: (c: ConnectorType) => void
  setPenColor: (c: string) => void
  setPenSize: (n: number) => void
  setPenOpacity: (n: number) => void
  setNoteColor: (c: string) => void
  updateTextFormat: (f: Partial<TextFormat>) => void
  setTheme: (t: Theme) => void
  setBgTexture: (t: BgTexture) => void
  setStickerCategory: (s: string) => void
  setOpenPanel: (p: string | null) => void
  pushHistory: (json: string) => void
  undo: () => string | null
  redo: () => string | null
  showToast: (msg: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  tool: 'select',
  shapeType: 'rect',
  connectorType: 'straight',
  penColor: '#a78bfa',
  penSize: 4,
  penOpacity: 1,
  noteColor: '#fef9c3',
  textFormat: {
    fontFamily: 'Nunito',
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    color: '#1a1a2e',
    align: 'left',
    rainbow: false,
  },
  theme: 'dark',
  bgTexture: 'none',
  stickerCategory: 'sports',
  openPanel: null,
  canvasHistory: [],
  historyIndex: -1,
  toastMsg: '',

  setTool: (tool) => set({ tool }),
  setShapeType: (shapeType) => set({ shapeType }),
  setConnectorType: (connectorType) => set({ connectorType }),
  setPenColor: (penColor) => set({ penColor }),
  setPenSize: (penSize) => set({ penSize }),
  setPenOpacity: (penOpacity) => set({ penOpacity }),
  setNoteColor: (noteColor) => set({ noteColor }),
  updateTextFormat: (f) =>
    set((s) => ({ textFormat: { ...s.textFormat, ...f } })),
  setTheme: (theme) => {
    document.body.className = theme === 'dark' ? '' : `theme-${theme}`
    set({ theme })
  },
  setBgTexture: (bgTexture) => set({ bgTexture }),
  setStickerCategory: (stickerCategory) => set({ stickerCategory }),
  setOpenPanel: (openPanel) =>
    set((s) => ({ openPanel: s.openPanel === openPanel ? null : openPanel })),

  pushHistory: (json) => {
    const { canvasHistory, historyIndex } = get()
    const newHistory = canvasHistory.slice(0, historyIndex + 1)
    newHistory.push(json)
    if (newHistory.length > 50) newHistory.shift()
    set({ canvasHistory: newHistory, historyIndex: newHistory.length - 1 })
  },
  undo: () => {
    const { canvasHistory, historyIndex } = get()
    if (historyIndex <= 0) return null
    const newIndex = historyIndex - 1
    set({ historyIndex: newIndex })
    return canvasHistory[newIndex]
  },
  redo: () => {
    const { canvasHistory, historyIndex } = get()
    if (historyIndex >= canvasHistory.length - 1) return null
    const newIndex = historyIndex + 1
    set({ historyIndex: newIndex })
    return canvasHistory[newIndex]
  },
  showToast: (toastMsg) => {
    set({ toastMsg })
    setTimeout(() => set({ toastMsg: '' }), 2000)
  },
}))
