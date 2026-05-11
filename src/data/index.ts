export const NOTE_STYLES = [
  { bg:'#fef9c3', border:'#fbbf24', text:'#1a1a2e', name:'Yellow' },
  { bg:'#fce7f3', border:'#f472b6', text:'#1a1a2e', name:'Pink'   },
  { bg:'#d1fae5', border:'#34d399', text:'#1a1a2e', name:'Mint'   },
  { bg:'#dbeafe', border:'#60a5fa', text:'#1a1a2e', name:'Blue'   },
  { bg:'#ede9fe', border:'#a78bfa', text:'#1a1a2e', name:'Purple' },
  { bg:'#ffedd5', border:'#fb923c', text:'#1a1a2e', name:'Orange' },
  { bg:'#1a1a1a', border:'#a78bfa', text:'#ffffff', name:'Dark'   },
  { bg:'#0f172a', border:'#38bdf8', text:'#e2e8f0', name:'Navy'   },
]

export const PEN_COLORS = [
  '#ffffff','#a78bfa','#f472b6','#34d399','#60a5fa',
  '#fbbf24','#f87171','#2dd4bf','#c084fc','#fb923c',
  '#000000','#1e293b','#dc2626','#16a34a','#2563eb',
  '#9333ea','#db2777','#0891b2','#d97706','#65a30d',
]

export const FONTS = [
  { label:'Nunito',           value:'Nunito'           },
  { label:'Caveat',           value:'Caveat'           },
  { label:'Patrick Hand',     value:'Patrick Hand'     },
  { label:'Permanent Marker', value:'Permanent Marker' },
  { label:'Arial',            value:'Arial'            },
  { label:'Georgia',          value:'Georgia'          },
  { label:'Courier New',      value:'Courier New'      },
]

export const WASHI_PATTERNS = [
  { id:'w1', name:'Cherry Blossom', symbol:'🌸', color:'#ffb7c5', bg:'#fff0f5' },
  { id:'w2', name:'Gold Stars',     symbol:'★',  color:'#ffd700', bg:'#fffde7' },
  { id:'w3', name:'Neon Dots',      symbol:'●',  color:'#a78bfa', bg:'#2a1a4a' },
  { id:'w4', name:'Mint Stripes',   symbol:'|',  color:'#34d399', bg:'#ecfdf5' },
  { id:'w5', name:'Pink Hearts',    symbol:'♥',  color:'#f472b6', bg:'#fce7f3' },
  { id:'w6', name:'Blue Waves',     symbol:'~',  color:'#60a5fa', bg:'#eff6ff' },
]

// Kawaii sticker packs — emoji rendered large (no svg loading issues)
export const STICKER_PACKS = [
  {
    id:'kawaii', name:'Kawaii', icon:'🐱',
    items:[
      {id:'k1',  e:'🐱', name:'Cat'},
      {id:'k2',  e:'🐶', name:'Dog'},
      {id:'k3',  e:'🐼', name:'Panda'},
      {id:'k4',  e:'🐨', name:'Koala'},
      {id:'k5',  e:'🦊', name:'Fox'},
      {id:'k6',  e:'🐸', name:'Frog'},
      {id:'k7',  e:'🐧', name:'Penguin'},
      {id:'k8',  e:'🦄', name:'Unicorn'},
      {id:'k9',  e:'🐰', name:'Bunny'},
      {id:'k10', e:'🐻', name:'Bear'},
      {id:'k11', e:'🦋', name:'Butterfly'},
      {id:'k12', e:'🐝', name:'Bee'},
    ]
  },
  {
    id:'food', name:'Boba & Food', icon:'🧋',
    items:[
      {id:'f1',  e:'🧋', name:'Boba'},
      {id:'f2',  e:'🍦', name:'Icecream'},
      {id:'f3',  e:'🧁', name:'Cupcake'},
      {id:'f4',  e:'🍩', name:'Donut'},
      {id:'f5',  e:'🍰', name:'Cake'},
      {id:'f6',  e:'🍓', name:'Strawberry'},
      {id:'f7',  e:'🍑', name:'Peach'},
      {id:'f8',  e:'🍒', name:'Cherry'},
      {id:'f9',  e:'🍜', name:'Ramen'},
      {id:'f10', e:'🍕', name:'Pizza'},
      {id:'f11', e:'🍣', name:'Sushi'},
      {id:'f12', e:'🍭', name:'Lollipop'},
    ]
  },
  {
    id:'nature', name:'Nature', icon:'🌸',
    items:[
      {id:'n1',  e:'🌸', name:'Blossom'},
      {id:'n2',  e:'🌺', name:'Hibiscus'},
      {id:'n3',  e:'🌻', name:'Sunflower'},
      {id:'n4',  e:'🌹', name:'Rose'},
      {id:'n5',  e:'🌈', name:'Rainbow'},
      {id:'n6',  e:'⭐', name:'Star'},
      {id:'n7',  e:'🌙', name:'Moon'},
      {id:'n8',  e:'☀️', name:'Sun'},
      {id:'n9',  e:'❄️', name:'Snow'},
      {id:'n10', e:'🌊', name:'Wave'},
      {id:'n11', e:'🍀', name:'Clover'},
      {id:'n12', e:'🌿', name:'Leaf'},
    ]
  },
  {
    id:'vibes', name:'Vibes', icon:'✨',
    items:[
      {id:'v1',  e:'✨', name:'Sparkle'},
      {id:'v2',  e:'💫', name:'Dizzy'},
      {id:'v3',  e:'🔥', name:'Fire'},
      {id:'v4',  e:'💎', name:'Diamond'},
      {id:'v5',  e:'👑', name:'Crown'},
      {id:'v6',  e:'🎀', name:'Bow'},
      {id:'v7',  e:'💝', name:'Heart'},
      {id:'v8',  e:'🌟', name:'Glow'},
      {id:'v9',  e:'⚡', name:'Lightning'},
      {id:'v10', e:'💥', name:'Boom'},
      {id:'v11', e:'🎵', name:'Music'},
      {id:'v12', e:'🎨', name:'Art'},
    ]
  },
  {
    id:'accessories', name:'Fashion', icon:'👒',
    items:[
      {id:'a1',  e:'👒', name:'Hat'},
      {id:'a2',  e:'👗', name:'Dress'},
      {id:'a3',  e:'👟', name:'Shoes'},
      {id:'a4',  e:'👜', name:'Bag'},
      {id:'a5',  e:'💄', name:'Lipstick'},
      {id:'a6',  e:'💍', name:'Ring'},
      {id:'a7',  e:'🕶️', name:'Sunglasses'},
      {id:'a8',  e:'🧣', name:'Scarf'},
      {id:'a9',  e:'💅', name:'Nails'},
      {id:'a10', e:'📿', name:'Necklace'},
      {id:'a11', e:'🎭', name:'Mask'},
      {id:'a12', e:'🧸', name:'Teddy'},
    ]
  },
  {
    id:'objects', name:'Objects', icon:'📷',
    items:[
      {id:'o1',  e:'📷', name:'Camera'},
      {id:'o2',  e:'🎮', name:'Gamepad'},
      {id:'o3',  e:'🎸', name:'Guitar'},
      {id:'o4',  e:'📚', name:'Books'},
      {id:'o5',  e:'✏️', name:'Pencil'},
      {id:'o6',  e:'💡', name:'Idea'},
      {id:'o7',  e:'🔮', name:'Crystal'},
      {id:'o8',  e:'🪄', name:'Wand'},
      {id:'o9',  e:'🧩', name:'Puzzle'},
      {id:'o10', e:'🏆', name:'Trophy'},
      {id:'o11', e:'🎯', name:'Target'},
      {id:'o12', e:'📌', name:'Pin'},
    ]
  },
]

export const THEMES = [
  { id:'amoled',    label:'AMOLED Black',  desc:'Pure #000 — best for OLED', icon:'◼' },
  { id:'dark',      label:'Dark Gray',      desc:'Soft dark background',       icon:'◩' },
  { id:'pastel',    label:'Pastel Dream',   desc:'Soft pink & cream tones',    icon:'🌸' },
  { id:'cyberpunk', label:'Cyberpunk',      desc:'Neon cyan on pure black',    icon:'⚡' },
]
