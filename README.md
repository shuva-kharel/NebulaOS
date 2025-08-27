# 🌌 NebulaOS

A complete browser-based operating system — blending retro hacker vibes with modern web technology, all inside a safe sandbox.

Experiment, learn, and play without risk to your real machine — a desktop environment in your browser tab.

## 🚀 Core Concept

- **🖥️ Browser-Based OS** — full desktop environment running entirely in your browser
- **🎨 Retro-Futuristic Design** — 90s hacker aesthetic fused with glass morphism
- **🔒 Safe Sandbox** — experiment without touching your real system
- **📚 Educational Tool** — practice terminal commands and development safely

## 🖥️ Desktop Environment

- **📂 Window Manager** — draggable, resizable windows with minimize/close
- **🪟 Taskbar** — launcher + running window management
- **🖱️ Desktop Icons** — double-click to launch apps
- **🎭 Theme System** — light/dark + retro-futurism toggle
- **✨ Animations** — smooth transitions & micro-interactions

## 📱 Built-in Applications

### 🖥️ Terminal
- Bash-like interface with commands: `ls`, `cd`, `cat`, `mkdir`, `touch`, `rm`, `echo`, `pwd`, `js`
- Virtual file system with persistent storage
- Execute JavaScript with `js` command

### 💻 Code Editor
- Monaco Editor (VS Code engine)
- Syntax highlighting for multiple languages
- File system integration
- Live code execution with output panel

### 🌐 Browser
- Load external sites (Google, YouTube, etc.)
- Render local HTML files from virtual FS
- Navigation: back, forward, refresh, home

### 📝 Notepad
- Rich text + markdown support
- Live markdown preview (split-pane)
- File system integration

### 🎵 Music Player
- Upload/play local audio files
- Full playback controls
- Playlist management

### 🖼️ Image Viewer
- PNG, JPG, and more supported
- Zoom, rotate, brightness, contrast
- Smooth transformations

## 🎮 Fun Features

### 💀 Chaos Mode (Easter Egg)
- Triggered with `rm -rf /`
- Fake meltdown animation + glitch effects
- Harmless prank — shows sandbox safety
- Unlocks "Chaos Survivor" badge

### 🏆 Achievement System
- Track command usage
- Unlock milestones:
  - 🗂️ Explorer – first `ls`
  - 🐱 Cat Master – `cat` 10 times
  - 📝 File Creator – first `touch`
  - 📂 Directory Master – 5 directories
  - ☠️ Chaos Survivor – meltdown

## 🎨 Visual Design

- **🪟 Glass Morphism** — translucent windows + backdrop blur
- **🌌 Aurora & Obsidian themes**
- **📺 Retro Scanlines** — optional CRT overlay
- **🌈 Glow Effects** — neon-like highlights
- **🎞️ Smooth Animations** — hover, transitions, loading

## 🛠️ Technical Architecture

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Window Management**: React draggable/resizable system
- **File System**: localStorage-based persistence
- **Themes**: CSS custom properties with saved preferences

## 💾 Data Persistence

- **📂 Files saved between sessions**
- **🎭 User preferences stored (themes, positions)**
- **🏆 Achievement progress tracked**
- **📱 App state persistence**

## 🌟 Why It's Special

- **🌍 Zero Installation** — runs in any modern browser
- **🔒 Completely Safe** — no access to your real files
- **🎮 Highly Interactive** — feels like a real desktop OS
- **🧑‍🏫 Educational** — great for teaching terminal basics
- **🎨 Nostalgic + Modern** — 90s hacker vibes with glassy UI

## ⚙️ Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/shuva-kharel/NebulaOS
cd NebulaOS

# Install dependencies
npm install

# Run the development server
npm run dev
```

# Open in browser
http://localhost:3000

## 👩‍💻 Built With

- **Frontend**: React.js (Vite + TypeScript)
- **Styling**: TailwindCSS
- **Editor**: Monaco Editor
- **State**: Context API
- **Animations**: Framer Motion
- **Persistence**: localStorage

## 🧠 Inspiration

NebulaOS is inspired by retro hacker culture and the dream of running a whole OS inside a browser tab. It's both educational and fun, proving how far web tech can go.

## ✍️ Made with 

caffeine ☕ by [Shuva_Kharel](https://github.com/shuva-khare)
