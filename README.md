# Balance Ledger (Next.js)

A trading journal app to record daily balances (OHLC).

## Key changes (from the original HTML version)

- Migrated to **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- Replaced icons with **lucide-react**
- Removed the top-right menu (list/export/add). All three actions are accessible via the bottom bar (List / Export / Add). The top bar only shows balance.
- Replaced the custom SVG chart logic with **lightweight-charts** (TradingView open-source). Supports mouse-wheel/pinch zoom, drag panning, right-side price axis, crosshair, etc.
- Data is stored in the browser's `localStorage`. Backups can be exported as JSON.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the app.

## Build

```bash
npm run build
npm run start
```

## Directory structure

```
app/
  layout.tsx        Root layout
  page.tsx          Main screen (state management)
  globals.css       Global styles
components/
  TopBar.tsx        Top: balance display
  StatsStrip.tsx    Statistics strip
  AssetChart.tsx    TradingView-style chart (lightweight-charts)
  BottomBar.tsx     Bottom action bar (List / Export / Add)
  EntrySheet.tsx    Slide-over for adding entries
  LogSheet.tsx      Slide-over for entries list
lib/
  types.ts          Type definitions
  storage.ts        localStorage persistence
  format.ts         Number formatter
```

## Storage

This code uses `localStorage` so it runs as a real Next.js app in the browser. If you want multi-device sync or server-side storage, replace `lib/storage.ts` with an API-backed implementation.
