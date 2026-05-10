export const NOTE_STYLES = [
  { bg: '#fef9c3', border: '#fbbf24', text: '#1a1a2e', name: 'Yellow' },
  { bg: '#fce7f3', border: '#f472b6', text: '#1a1a2e', name: 'Pink' },
  { bg: '#d1fae5', border: '#34d399', text: '#1a1a2e', name: 'Mint' },
  { bg: '#dbeafe', border: '#60a5fa', text: '#1a1a2e', name: 'Blue' },
  { bg: '#ede9fe', border: '#a78bfa', text: '#1a1a2e', name: 'Purple' },
  { bg: '#ffedd5', border: '#fb923c', text: '#1a1a2e', name: 'Orange' },
  { bg: '#1a1a1a', border: '#a78bfa', text: '#ffffff', name: 'Dark' },
  { bg: '#0f172a', border: '#38bdf8', text: '#e2e8f0', name: 'Navy' },
]

export const PEN_COLORS = [
  '#ffffff', '#a78bfa', '#f472b6', '#34d399', '#60a5fa',
  '#fbbf24', '#f87171', '#2dd4bf', '#c084fc', '#fb923c',
  '#000000', '#1e293b', '#dc2626', '#16a34a', '#2563eb',
  '#9333ea', '#db2777', '#0891b2', '#d97706', '#65a30d',
]

export const FONTS = [
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Caveat', value: 'Caveat' },
  { label: 'Patrick Hand', value: 'Patrick Hand' },
  { label: 'Permanent Marker', value: 'Permanent Marker' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Times New Roman', value: 'Times New Roman' },
]

export const WASHI_PATTERNS = [
  { id: 'w1', name: 'Cherry Blossom', symbol: '🌸', color: '#ffb7c5', bg: '#fff0f5' },
  { id: 'w2', name: 'Gold Stars',     symbol: '★',  color: '#ffd700', bg: '#fffde7' },
  { id: 'w3', name: 'Neon Dots',      symbol: '●',  color: '#a78bfa', bg: '#1a1033' },
  { id: 'w4', name: 'Mint Stripes',   symbol: '|',  color: '#34d399', bg: '#ecfdf5' },
  { id: 'w5', name: 'Pink Checks',    symbol: '✦',  color: '#f472b6', bg: '#fce7f3' },
  { id: 'w6', name: 'Blue Waves',     symbol: '~',  color: '#60a5fa', bg: '#eff6ff' },
]

// SVG Clip Art stickers - proper icons not just emojis
export const CLIPART_CATEGORIES = [
  {
    id: 'stars',
    name: 'Stars & Shapes',
    icon: '✦',
    items: [
      { id: 'c1',  svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/></svg>', name: 'Star' },
      { id: 'c2',  svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/></svg>', name: 'Diamond' },
      { id: 'c3',  svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#f472b6" stroke="#db2777" stroke-width="2"/></svg>', name: 'Circle' },
      { id: 'c4',  svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#34d399" stroke="#059669" stroke-width="2"/></svg>', name: 'Triangle' },
      { id: 'c5',  svg: '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="12" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/></svg>', name: 'Square' },
      { id: 'c6',  svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 100,27 100,73 50,95 0,73 0,27" fill="#fb923c" stroke="#ea580c" stroke-width="2"/></svg>', name: 'Hexagon' },
      { id: 'c7',  svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="#fbbf24" stroke-width="4"/></svg>', name: 'Star Outline' },
      { id: 'c8',  svg: '<svg viewBox="0 0 100 100"><path d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z" fill="none" stroke="#a78bfa" stroke-width="4"/></svg>', name: 'Circle Outline' },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    items: [
      { id: 'n1', svg: '<svg viewBox="0 0 100 100"><path d="M50 90 C50 90 20 70 20 45 C20 28 33 15 50 15 C67 15 80 28 80 45 C80 70 50 90 50 90Z" fill="#34d399" stroke="#059669" stroke-width="2"/><line x1="50" y1="90" x2="50" y2="50" stroke="#059669" stroke-width="2"/></svg>', name: 'Leaf' },
      { id: 'n2', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="40" r="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><line x1="50" y1="15" x2="50" y2="5" stroke="#f59e0b" stroke-width="3"/><line x1="75" y1="40" x2="85" y2="40" stroke="#f59e0b" stroke-width="3"/><line x1="25" y1="40" x2="15" y2="40" stroke="#f59e0b" stroke-width="3"/><circle cx="50" cy="40" r="12" fill="#fff7ed"/></svg>', name: 'Sun' },
      { id: 'n3', svg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="35" ry="20" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/><ellipse cx="35" cy="50" rx="22" ry="18" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/><ellipse cx="65" cy="48" rx="25" ry="20" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/></svg>', name: 'Cloud' },
      { id: 'n4', svg: '<svg viewBox="0 0 100 100"><path d="M50 15 C50 15 65 30 65 50 C65 65 55 75 50 85 C45 75 35 65 35 50 C35 30 50 15 50 15Z" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/></svg>', name: 'Rain Drop' },
      { id: 'n5', svg: '<svg viewBox="0 0 100 100"><path d="M50,90 L50,50 M50,50 C50,50 30,40 25,20 M50,50 C50,50 70,40 75,20 M50,60 C50,60 35,55 30,40 M50,60 C50,60 65,55 70,40" stroke="#059669" stroke-width="4" fill="none" stroke-linecap="round"/></svg>', name: 'Tree' },
      { id: 'n6', svg: '<svg viewBox="0 0 100 100"><polygon points="50,5 55,38 90,38 62,57 73,90 50,70 27,90 38,57 10,38 45,38" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><polygon points="50,25 53,38 65,38 55,46 59,59 50,52 41,59 45,46 35,38 47,38" fill="#fff7ed"/></svg>', name: 'Gold Star' },
      { id: 'n7', svg: '<svg viewBox="0 0 100 100"><path d="M20,80 Q35,40 50,20 Q65,40 80,80" stroke="#059669" stroke-width="3" fill="none"/><ellipse cx="50" cy="18" rx="12" ry="8" fill="#34d399" stroke="#059669" stroke-width="2"/><ellipse cx="35" cy="45" rx="10" ry="7" fill="#34d399" stroke="#059669" stroke-width="2" transform="rotate(-20,35,45)"/><ellipse cx="65" cy="45" rx="10" ry="7" fill="#34d399" stroke="#059669" stroke-width="2" transform="rotate(20,65,45)"/></svg>', name: 'Plant' },
      { id: 'n8', svg: '<svg viewBox="0 0 100 100"><path d="M30,70 C30,70 50,30 70,70" fill="#f472b6" stroke="#db2777" stroke-width="2"/><circle cx="50" cy="35" r="15" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><line x1="50" y1="70" x2="50" y2="90" stroke="#059669" stroke-width="3"/></svg>', name: 'Flower' },
    ]
  },
  {
    id: 'ui',
    name: 'UI Icons',
    icon: '💡',
    items: [
      { id: 'u1', svg: '<svg viewBox="0 0 100 100"><path d="M50,15 C34,15 22,27 22,43 C22,54 28,63 38,68 L38,78 L62,78 L62,68 C72,63 78,54 78,43 C78,27 66,15 50,15Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><rect x="38" y="78" width="24" height="8" rx="2" fill="#d1d5db"/><rect x="40" y="86" width="20" height="6" rx="3" fill="#9ca3af"/></svg>', name: 'Lightbulb' },
      { id: 'u2', svg: '<svg viewBox="0 0 100 100"><rect x="15" y="20" width="70" height="55" rx="6" fill="none" stroke="#60a5fa" stroke-width="4"/><line x1="15" y1="35" x2="85" y2="35" stroke="#60a5fa" stroke-width="3"/><circle cx="25" cy="27" r="4" fill="#f87171"/><circle cx="38" cy="27" r="4" fill="#fbbf24"/><circle cx="51" cy="27" r="4" fill="#34d399"/></svg>', name: 'Browser' },
      { id: 'u3', svg: '<svg viewBox="0 0 100 100"><rect x="20" y="15" width="60" height="70" rx="6" fill="none" stroke="#a78bfa" stroke-width="4"/><line x1="30" y1="35" x2="70" y2="35" stroke="#a78bfa" stroke-width="3"/><line x1="30" y1="50" x2="70" y2="50" stroke="#a78bfa" stroke-width="3"/><line x1="30" y1="65" x2="55" y2="65" stroke="#a78bfa" stroke-width="3"/></svg>', name: 'Document' },
      { id: 'u4', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="#34d399" stroke-width="4"/><polyline points="35,50 47,62 68,38" stroke="#34d399" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', name: 'Check Circle' },
      { id: 'u5', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="#f87171" stroke-width="4"/><line x1="35" y1="35" x2="65" y2="65" stroke="#f87171" stroke-width="5" stroke-linecap="round"/><line x1="65" y1="35" x2="35" y2="65" stroke="#f87171" stroke-width="5" stroke-linecap="round"/></svg>', name: 'X Circle' },
      { id: 'u6', svg: '<svg viewBox="0 0 100 100"><path d="M50,20 L50,55 M50,65 L50,75" stroke="#fbbf24" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" stroke-width="4"/></svg>', name: 'Warning' },
      { id: 'u7', svg: '<svg viewBox="0 0 100 100"><circle cx="42" cy="42" r="26" fill="none" stroke="#60a5fa" stroke-width="4"/><line x1="60" y1="60" x2="82" y2="82" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/></svg>', name: 'Search' },
      { id: 'u8', svg: '<svg viewBox="0 0 100 100"><path d="M20,30 L50,15 L80,30 L80,65 L50,85 L20,65 Z" fill="none" stroke="#a78bfa" stroke-width="4"/><line x1="50" y1="15" x2="50" y2="85" stroke="#a78bfa" stroke-width="2"/><line x1="20" y1="47" x2="80" y2="47" stroke="#a78bfa" stroke-width="2"/></svg>', name: 'Cube' },
    ]
  },
  {
    id: 'badges',
    name: 'Badges',
    icon: '🏅',
    items: [
      { id: 'b1', svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 63,37 93,37 70,57 79,85 50,68 21,85 30,57 7,37 37,37" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><text x="50" y="55" font-size="12" text-anchor="middle" fill="#1a1a2e" font-weight="bold">TOP</text></svg>', name: 'Top Badge' },
      { id: 'b2', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="45" r="30" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/><rect x="40" y="72" width="8" height="18" fill="#f87171"/><rect x="52" y="72" width="8" height="18" fill="#f87171"/><text x="50" y="50" font-size="14" text-anchor="middle" fill="#1a1a2e" font-weight="bold">1</text></svg>', name: 'Medal' },
      { id: 'b3', svg: '<svg viewBox="0 0 100 100"><path d="M50,15 C50,15 20,30 20,55 C20,70 33,82 50,85 C67,82 80,70 80,55 C80,30 50,15 50,15Z" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/><text x="50" y="58" font-size="11" text-anchor="middle" fill="white" font-weight="bold">PRO</text></svg>', name: 'Shield' },
      { id: 'b4', svg: '<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="10" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/><text x="50" y="57" font-size="24" text-anchor="middle" fill="white">✓</text></svg>', name: 'Done' },
      { id: 'b5', svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 93,37 77,85 23,85 7,37" fill="#34d399" stroke="#059669" stroke-width="2"/><text x="50" y="57" font-size="11" text-anchor="middle" fill="white" font-weight="bold">NEW</text></svg>', name: 'New Badge' },
      { id: 'b6', svg: '<svg viewBox="0 0 100 100"><rect x="15" y="30" width="70" height="45" rx="8" fill="#f472b6" stroke="#db2777" stroke-width="2"/><rect x="40" y="15" width="20" height="20" rx="4" fill="#f472b6" stroke="#db2777" stroke-width="2"/><line x1="50" y1="35" x2="50" y2="50" stroke="white" stroke-width="3"/><circle cx="50" cy="58" r="4" fill="white"/></svg>', name: 'Tag' },
      { id: 'b7', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" stroke-width="5"/><circle cx="50" cy="50" r="28" fill="none" stroke="#fbbf24" stroke-width="3"/><text x="50" y="56" font-size="16" text-anchor="middle" fill="#fbbf24" font-weight="bold">★</text></svg>', name: 'Ring Star' },
      { id: 'b8', svg: '<svg viewBox="0 0 100 100"><path d="M50,10 L55,40 L85,40 L62,58 L71,88 L50,72 L29,88 L38,58 L15,40 L45,40Z" fill="none" stroke="#a78bfa" stroke-width="3"/></svg>', name: 'Star Ring' },
    ]
  },
  {
    id: 'arrows',
    name: 'Arrows',
    icon: '→',
    items: [
      { id: 'ar1', svg: '<svg viewBox="0 0 100 100"><line x1="15" y1="50" x2="75" y2="50" stroke="#60a5fa" stroke-width="5" stroke-linecap="round"/><polyline points="60,32 80,50 60,68" stroke="#60a5fa" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', name: 'Right Arrow' },
      { id: 'ar2', svg: '<svg viewBox="0 0 100 100"><line x1="85" y1="50" x2="25" y2="50" stroke="#f472b6" stroke-width="5" stroke-linecap="round"/><polyline points="40,32 20,50 40,68" stroke="#f472b6" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', name: 'Left Arrow' },
      { id: 'ar3', svg: '<svg viewBox="0 0 100 100"><path d="M50,80 C50,80 20,60 20,35 C20,20 33,10 50,10 C67,10 80,20 80,35 C80,60 50,80 50,80Z" fill="#34d399" stroke="#059669" stroke-width="2"/><polyline points="38,50 50,80 62,50" stroke="white" stroke-width="3" fill="none"/></svg>', name: 'Down Blob' },
      { id: 'ar4', svg: '<svg viewBox="0 0 100 100"><path d="M20,50 Q50,10 80,50 Q50,90 20,50Z" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/></svg>', name: 'Wave Arrow' },
      { id: 'ar5', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" stroke-width="4"/><polyline points="38,42 50,30 62,42" stroke="#fbbf24" stroke-width="4" fill="none" stroke-linecap="round"/><line x1="50" y1="30" x2="50" y2="70" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/></svg>', name: 'Up Circle' },
      { id: 'ar6', svg: '<svg viewBox="0 0 100 100"><line x1="20" y1="30" x2="80" y2="30" stroke="#f87171" stroke-width="4"/><line x1="20" y1="50" x2="80" y2="50" stroke="#f87171" stroke-width="4"/><line x1="20" y1="70" x2="80" y2="70" stroke="#f87171" stroke-width="4"/><polyline points="60,18 80,30 60,42" stroke="#f87171" stroke-width="4" fill="none"/></svg>', name: 'Lines Arrow' },
      { id: 'ar7', svg: '<svg viewBox="0 0 100 100"><path d="M30,70 Q50,20 70,70" stroke="#60a5fa" stroke-width="5" fill="none" stroke-linecap="round"/><polyline points="55,58 70,70 58,80" stroke="#60a5fa" stroke-width="4" fill="none" stroke-linecap="round"/></svg>', name: 'Curve Arrow' },
      { id: 'ar8', svg: '<svg viewBox="0 0 100 100"><line x1="50" y1="15" x2="50" y2="85" stroke="#34d399" stroke-width="5" stroke-linecap="round"/><line x1="15" y1="50" x2="85" y2="50" stroke="#34d399" stroke-width="5" stroke-linecap="round"/><polyline points="38,30 50,15 62,30" stroke="#34d399" stroke-width="4" fill="none"/><polyline points="70,38 85,50 70,62" stroke="#34d399" stroke-width="4" fill="none"/></svg>', name: 'Cross Arrow' },
    ]
  },
]

export const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys',
    icon: '😊',
    items: ['😀','😂','😍','🥰','😎','🤩','😏','😒','😢','😭','😡','🤯','🥳','😴','🤔','😮','🤗','😇','🥺','😜']
  },
  {
    id: 'gestures',
    name: 'Gestures',
    icon: '👋',
    items: ['👋','🤝','👍','👎','✌️','🤞','🤟','🤙','👏','🙌','🤜','🤛','✊','👊','🖐️','☝️','🤚','💪','🦾','🫶']
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐶',
    items: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🦄','🐉','🦋']
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍕',
    items: ['🍕','🍔','🌮','🍣','🍜','🧁','🍩','🍦','🍓','🍉','🥑','🍟','🌯','🥞','🧇','🍫','🍭','🍺','☕','🧋']
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: '💯',
    items: ['💯','❤️','🔥','✨','⭐','💫','🌈','💎','🎯','🎪','🎨','🎭','🎪','💥','🌊','❄️','🌙','☀️','⚡','🎵']
  },
]

export const THEMES = [
  { id: 'amoled',    label: 'AMOLED Black',  desc: 'Pure #000 — best for OLED', icon: '◼' },
  { id: 'dark',      label: 'Dark Gray',      desc: 'Soft dark background',       icon: '◩' },
  { id: 'pastel',    label: 'Pastel Dream',   desc: 'Soft pink & cream tones',    icon: '🌸' },
  { id: 'cyberpunk', label: 'Cyberpunk',      desc: 'Neon cyan on pure black',    icon: '⚡' },
]
