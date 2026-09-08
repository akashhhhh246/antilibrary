# Anti-Library (The Unfinished Content Tracker)

> **Core Philosophy**: Most productivity and media apps celebrate what you finish; Anti-Library manages what you abandon, stall, or drop halfway through, reducing mental clutter without guilt.

---

## 🏛️ Project Architecture

The project is cleanly decoupled into dedicated directories:

```
├── backend/                       # Node.js + Express REST API with TypeScript
│   ├── src/
│   │   ├── index.ts              # REST Endpoints (CRUD, Sunday reckoning, stats, import/export)
│   │   ├── storage.ts            # JSON file-backed persistence & metrics engine
│   │   └── types.ts              # Shared TypeScript schema & category types
│   ├── data/
│   │   └── items.json            # Persistent data store (auto-seeded on first run)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Brand header, view switch, sound toggle, hero trigger
│   │   │   ├── ShelfOfLimbo.tsx          # Main shelf view with filter tabs & search
│   │   │   ├── ItemCard.tsx              # Editorial card with lingering days & actions
│   │   │   ├── QuickAddModal.tsx         # Fast (<10s) mental clutter ingestion drawer
│   │   │   ├── SundayReckoningModal.tsx  # Hero "Face the Past" dramatic face-off
│   │   │   ├── RevivalTimerModal.tsx     # 20-minute visual focus circular countdown
│   │   │   ├── DeclareDeadModal.tsx      # Eulogy writer with funeral bell & closure
│   │   │   ├── EulogyRoom.tsx            # Dead archive with guilt reclaimed metric
│   │   │   ├── SettingsModal.tsx         # JSON Backup export/import & starter pack
│   │   │   └── CategoryIcon.tsx          # Dynamic category icons & color tokens
│   │   ├── utils/
│   │   │   ├── api.ts                    # Backend REST API client
│   │   │   ├── audio.ts                  # Pure Web Audio API sound synthesizer
│   │   │   └── storage.ts                # Offline-first LocalStorage fallback & stats
│   │   ├── App.tsx                       # Main application state coordinator
│   │   ├── types.ts                      # Frontend TypeScript interfaces
│   │   └── index.css                     # Tailwind CSS + custom dark editorial theme
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── package.json                   # Root convenience scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Server (Port 5000)
```bash
cd backend
npm install
npm run dev
```
The Express API will be live at `http://localhost:5000`.

### 2. Start the Frontend Application (Port 5173)
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

> [!TIP]
> **Offline Resilience**: If the backend is not running, the frontend gracefully falls back to browser `LocalStorage` automatically. You will see an indicator in the footer confirming either `🟢 Backend Connected (:5000)` or `⚡ Offline Local Storage`.

---

## 🎯 Core Features & User Experience

1. **The Shelf of Limbo (Main Grid)**
   - Visual card deck showing title, location dropped (e.g., *"Page 218, Footnote 74"*), abandon reason, and days lingering in limbo.
   - Filter tabs: *All, Books, Shows & Movies, Games, Side Projects, Courses, Active Revivals*.
   - Instant search & sort by longest lingering, newest, title, or revival counts.

2. **Dump the Mental Clutter (< 10s Fast Ingestion)**
   - Quick drawer to get stalled media out of your head immediately.
   - Category selector with visual icons.
   - One-tap preset reason tags: *"Lost the plot"*, *"Life got busy"*, *"Too boring / pacing dragged"*, *"Shiny object syndrome"*, or custom honest text.

3. **The Sunday Reckoning ("Face the Past")**
   - Click the dramatic **"Face the Past"** button.
   - The app shuffles and pulls one stalled ghost from your limbo queue.
   - It asks: **"Will you give this 20 minutes today, or officially declare it dead?"**
   - **Three Actionable Paths**:
     1. **Start 20-Min Revival**: Integrated visual circular focus countdown timer with fast-forward testing, sound fanfare, and confetti.
     2. **Declare Officially Dead**: Prompts a 1-sentence witty or heartfelt epitaph, rings a deep resonant funeral bell chime, and archives it forever.
     3. **Draw Another / Snooze**: Put back on the shelf for later.

4. **The Eulogy Room (Dead Archive)**
   - Tombstone-inspired memorial cards honoring what you let go of.
   - Prominent celebratory metric: **"~X hours of mental guilt reclaimed"** across your laid-to-rest items.
   - Option to resurrect an item back to limbo if inspiration strikes again.

5. **Audio Synthesis & Micro-Interactions**
   - Custom Web Audio API sound synthesizer with zero external sound file dependencies:
     - Resonant church bell toll for declared dead closures.
     - Upbeat melodic chime for revival sessions.
     - Tactile subtle clicks for navigation.
     - Mute toggle available anytime in the header.

6. **Data Portability**
   - Export your entire library as formatted `.json`.
   - Restore or import backup `.json` files.
   - Load or reset to the curated starter pack (*Infinite Jest*, *Elden Ring*, *Rust parser*, etc.).
