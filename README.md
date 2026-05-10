# 🎨 Notes Canvas

A fully offline, feature-rich note-taking canvas app — runs as an Android APK.

**Features:** Sticky notes · Pen/Marker/Highlighter · Text formatting · Shapes · Stickers · Washi tape · Dark/Pastel/Cyberpunk/Vintage themes · Canvas textures · Auto-save

---

## ⚡ Get the APK in 5 Steps (No Android Studio needed)

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `notes-canvas`
3. Set it to **Public** (required for free GitHub Actions minutes)
4. **Do NOT** check "Add README" (we have one)
5. Click **Create repository**

### Step 2 — Upload this folder to GitHub

**Option A: GitHub Desktop** (easiest)
1. Open GitHub Desktop
2. File → Add Local Repository → select this `notes-app` folder
3. Commit all files → Push to origin

**Option B: Command line**
```bash
cd notes-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/notes-canvas.git
git push -u origin main
```

### Step 3 — Watch the build run

1. Go to your repo on GitHub
2. Click the **Actions** tab
3. You'll see "Build Android APK" running — it takes about 8-12 minutes the first time

### Step 4 — Download your APK

**Option A — From Actions artifacts:**
1. Click the finished workflow run
2. Scroll down to **Artifacts**
3. Download `NotesCanvas-YYYYMMDD-HHMM`

**Option B — From Releases (auto-created):**
1. Click **Releases** on the right side of the repo
2. Download the `.apk` file from the latest release

### Step 5 — Install on Android

1. Transfer the APK to your phone (email, Google Drive, USB, etc.)
2. On your phone: **Settings → Security → Install unknown apps** → enable for your file manager
3. Open the APK file → Install
4. Done! The app works fully offline.

---

## 🛠 Run Locally in Browser (for development)

```bash
npm install
npm run dev
```
Open http://localhost:5173

---

## 📱 All Features

| Feature | Details |
|---|---|
| **Drawing** | Pen, Marker, Highlighter with color + size + opacity control |
| **Eraser** | Pink block eraser |
| **Sticky Notes** | 6 colors, folded corner, editable text |
| **Text** | 7 fonts, size, Bold/Italic/Underline/Strikethrough, alignment, rainbow colors |
| **Shapes** | Rectangle, Circle, Triangle, Diamond, Pentagon, Star |
| **Connectors** | Straight, Curved, Right-angle lines |
| **Stickers** | 80 stickers across 5 categories: Sports, Kawaii Food, Fashion, Vibes, Study |
| **Washi Tape** | 6 decorative tape patterns |
| **Themes** | Dark, Pastel Dream, Cyberpunk, Vintage |
| **Textures** | Plain, Dot Grid, Graph Paper, Parchment |
| **Layers** | Bring to front, Send to back |
| **Export** | PNG export, JSON save/load |
| **Auto-save** | Saves to device storage automatically |
| **Undo/Redo** | 50-step history |

---

## 🏗 Architecture

```
notes-app/
├── src/
│   ├── App.tsx                 ← Root layout, assembles all panels
│   ├── index.css               ← Design system (glassmorphism, dark theme)
│   ├── components/
│   │   ├── Canvas.tsx          ← Fabric.js canvas engine (drawing, shapes, objects)
│   │   ├── Toolbar.tsx         ← Left tool sidebar + sub-panels
│   │   ├── TextToolbar.tsx     ← Top formatting bar (fonts, B/I/U, colors, layers)
│   │   ├── StickerPanel.tsx    ← Right sticker & washi tape panel
│   │   └── SettingsPanel.tsx   ← Theme, texture, export, clear
│   ├── store/
│   │   └── useStore.ts         ← Zustand global state
│   └── data/
│       └── stickers.ts         ← All sticker/color/font/theme data
├── .github/
│   └── workflows/
│       └── build-apk.yml       ← GitHub Actions: React → Capacitor → APK
├── capacitor.config.ts         ← App ID, name, webDir
├── vite.config.ts
└── package.json
```

---

## 🔄 Update the APK

Every time you push to `main`, GitHub automatically builds a new APK. Just:
```bash
git add .
git commit -m "Update"
git push
```
Then download the new APK from Actions → Artifacts.

---

## 🔑 Build a Signed APK (for Google Play)

The default build is a debug APK. For production/Play Store:

1. Generate a keystore: `keytool -genkey -v -keystore my-release.jks -keyAlg RSA -keysize 2048 -validity 10000 -alias my-key`
2. Add secrets to GitHub: `KEYSTORE_FILE`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`
3. Modify the workflow to use `assembleRelease` with signing config

---

**Built with:** React + Vite + Fabric.js + Capacitor + Zustand
