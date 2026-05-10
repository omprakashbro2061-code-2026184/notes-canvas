export interface Sticker {
  id: string
  emoji: string
  label: string
}

export interface StickerCategory {
  id: string
  icon: string
  label: string
  stickers: Sticker[]
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'sports',
    icon: '⚽',
    label: 'Sports',
    stickers: [
      { id: 's1', emoji: '⚽', label: 'Soccer' },
      { id: 's2', emoji: '🏀', label: 'Basketball' },
      { id: 's3', emoji: '🏈', label: 'Football' },
      { id: 's4', emoji: '⚾', label: 'Baseball' },
      { id: 's5', emoji: '🎾', label: 'Tennis' },
      { id: 's6', emoji: '🏐', label: 'Volleyball' },
      { id: 's7', emoji: '🏓', label: 'Ping Pong' },
      { id: 's8', emoji: '🥊', label: 'Boxing' },
      { id: 's9', emoji: '🏊', label: 'Swimming' },
      { id: 's10', emoji: '🚴', label: 'Cycling' },
      { id: 's11', emoji: '🤸', label: 'Gymnastics' },
      { id: 's12', emoji: '⛷️', label: 'Skiing' },
      { id: 's13', emoji: '🏆', label: 'Trophy' },
      { id: 's14', emoji: '🥇', label: 'Gold Medal' },
      { id: 's15', emoji: '🎯', label: 'Target' },
      { id: 's16', emoji: '🏋️', label: 'Weightlifting' },
    ]
  },
  {
    id: 'food',
    icon: '🍣',
    label: 'Kawaii Food',
    stickers: [
      { id: 'f1', emoji: '🍕', label: 'Pizza' },
      { id: 'f2', emoji: '🍣', label: 'Sushi' },
      { id: 'f3', emoji: '🍩', label: 'Donut' },
      { id: 'f4', emoji: '🧁', label: 'Cupcake' },
      { id: 'f5', emoji: '🍰', label: 'Cake' },
      { id: 'f6', emoji: '🍦', label: 'Icecream' },
      { id: 'f7', emoji: '🍓', label: 'Strawberry' },
      { id: 'f8', emoji: '🍜', label: 'Ramen' },
      { id: 'f9', emoji: '🥞', label: 'Pancakes' },
      { id: 'f10', emoji: '🧇', label: 'Waffle' },
      { id: 'f11', emoji: '🍔', label: 'Burger' },
      { id: 'f12', emoji: '🌮', label: 'Taco' },
      { id: 'f13', emoji: '☕', label: 'Coffee' },
      { id: 'f14', emoji: '🧋', label: 'Boba' },
      { id: 'f15', emoji: '🍭', label: 'Lollipop' },
      { id: 'f16', emoji: '🍫', label: 'Chocolate' },
    ]
  },
  {
    id: 'fashion',
    icon: '👗',
    label: 'Fashion',
    stickers: [
      { id: 'fa1', emoji: '👗', label: 'Dress' },
      { id: 'fa2', emoji: '👠', label: 'Heels' },
      { id: 'fa3', emoji: '👜', label: 'Bag' },
      { id: 'fa4', emoji: '💄', label: 'Lipstick' },
      { id: 'fa5', emoji: '💅', label: 'Nails' },
      { id: 'fa6', emoji: '👒', label: 'Hat' },
      { id: 'fa7', emoji: '🕶️', label: 'Sunglasses' },
      { id: 'fa8', emoji: '💍', label: 'Ring' },
      { id: 'fa9', emoji: '📿', label: 'Necklace' },
      { id: 'fa10', emoji: '🧣', label: 'Scarf' },
      { id: 'fa11', emoji: '🧤', label: 'Gloves' },
      { id: 'fa12', emoji: '👟', label: 'Sneakers' },
      { id: 'fa13', emoji: '🎀', label: 'Bow' },
      { id: 'fa14', emoji: '✨', label: 'Sparkle' },
      { id: 'fa15', emoji: '🌸', label: 'Flower' },
      { id: 'fa16', emoji: '🦋', label: 'Butterfly' },
    ]
  },
  {
    id: 'vibes',
    icon: '🌙',
    label: 'Vibes',
    stickers: [
      { id: 'v1', emoji: '🌙', label: 'Moon' },
      { id: 'v2', emoji: '⭐', label: 'Star' },
      { id: 'v3', emoji: '🌈', label: 'Rainbow' },
      { id: 'v4', emoji: '☁️', label: 'Cloud' },
      { id: 'v5', emoji: '🔥', label: 'Fire' },
      { id: 'v6', emoji: '💫', label: 'Dizzy' },
      { id: 'v7', emoji: '💥', label: 'Boom' },
      { id: 'v8', emoji: '🎵', label: 'Music' },
      { id: 'v9', emoji: '💎', label: 'Diamond' },
      { id: 'v10', emoji: '🌺', label: 'Hibiscus' },
      { id: 'v11', emoji: '🦄', label: 'Unicorn' },
      { id: 'v12', emoji: '🐉', label: 'Dragon' },
      { id: 'v13', emoji: '🌊', label: 'Wave' },
      { id: 'v14', emoji: '⚡', label: 'Lightning' },
      { id: 'v15', emoji: '🎆', label: 'Fireworks' },
      { id: 'v16', emoji: '🍀', label: 'Clover' },
    ]
  },
  {
    id: 'study',
    icon: '📚',
    label: 'Study',
    stickers: [
      { id: 'st1', emoji: '📚', label: 'Books' },
      { id: 'st2', emoji: '✏️', label: 'Pencil' },
      { id: 'st3', emoji: '📐', label: 'Ruler' },
      { id: 'st4', emoji: '🔬', label: 'Microscope' },
      { id: 'st5', emoji: '💡', label: 'Idea' },
      { id: 'st6', emoji: '🧠', label: 'Brain' },
      { id: 'st7', emoji: '📊', label: 'Chart' },
      { id: 'st8', emoji: '🖥️', label: 'Computer' },
      { id: 'st9', emoji: '⏰', label: 'Clock' },
      { id: 'st10', emoji: '📝', label: 'Notes' },
      { id: 'st11', emoji: '🎓', label: 'Graduate' },
      { id: 'st12', emoji: '🔭', label: 'Telescope' },
      { id: 'st13', emoji: '🧪', label: 'Test Tube' },
      { id: 'st14', emoji: '📌', label: 'Pin' },
      { id: 'st15', emoji: '🗂️', label: 'Folders' },
      { id: 'st16', emoji: '☑️', label: 'Checkbox' },
    ]
  }
]

export const WASHI_PATTERNS = [
  { id: 'w1', label: 'Floral', pattern: '🌸🌺🌸🌺', color: '#ffb7c5', bg: '#fff0f5' },
  { id: 'w2', label: 'Stars', pattern: '⭐✨⭐✨', color: '#ffd700', bg: '#fffde7' },
  { id: 'w3', label: 'Stripes', pattern: '▎▎▎▎', color: '#84fab0', bg: '#e8fff4' },
  { id: 'w4', label: 'Dots', pattern: '●○●○', color: '#a78bfa', bg: '#f0ebff' },
  { id: 'w5', label: 'Checks', pattern: '▪▫▪▫', color: '#60a5fa', bg: '#ebf4ff' },
  { id: 'w6', label: 'Waves', pattern: '〜〜〜', color: '#f472b6', bg: '#fce7f3' },
]

export const NOTE_COLORS = [
  { id: 'yellow', color: '#fef9c3', border: '#fde047', shadow: 'rgba(253,224,71,0.3)' },
  { id: 'pink', color: '#fce7f3', border: '#f9a8d4', shadow: 'rgba(249,168,212,0.3)' },
  { id: 'mint', color: '#d1fae5', border: '#6ee7b7', shadow: 'rgba(110,231,183,0.3)' },
  { id: 'blue', color: '#dbeafe', border: '#93c5fd', shadow: 'rgba(147,197,253,0.3)' },
  { id: 'purple', color: '#ede9fe', border: '#c4b5fd', shadow: 'rgba(196,181,253,0.3)' },
  { id: 'peach', color: '#ffedd5', border: '#fdba74', shadow: 'rgba(253,186,116,0.3)' },
]

export const RAINBOW_COLORS = [
  '#ff0000', '#ff6600', '#ffcc00', '#33cc33',
  '#0099ff', '#6633cc', '#ff33cc', '#ff6699'
]

export const PEN_COLORS = [
  '#ffffff', '#a78bfa', '#f472b6', '#34d399', '#60a5fa',
  '#fbbf24', '#f87171', '#2dd4bf', '#000000', '#1a1a2e',
  '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#dda0dd',
]

export const FONTS = [
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Caveat', value: 'Caveat' },
  { label: 'Patrick Hand', value: 'Patrick Hand' },
  { label: 'Permanent Marker', value: 'Permanent Marker' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
]

export const THEMES = [
  { id: 'dark', label: '🌙 Dark', description: 'Default dark mode' },
  { id: 'pastel', label: '🌸 Pastel Dream', description: 'Soft pinks & creams' },
  { id: 'cyberpunk', label: '⚡ Cyberpunk', description: 'Neon on black' },
  { id: 'vintage', label: '📜 Vintage', description: 'Warm aged tones' },
]
