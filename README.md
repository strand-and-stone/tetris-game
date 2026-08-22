# Edge Stack

18+ late-night Tetris by **Strand & Stone**. Clear lines. Don't bust.

**Live:** https://tetris-game-gamma-one.vercel.app

## Features

- Classic 10×20 Tetris with 7-bag randomizer
- Score, level, lines, next piece, ghost piece, pause
- Keyboard, on-screen buttons, and swipe gestures
- Mobile layout keeps the full well visible (no clipped bottom rows)
- Persistent high-score leaderboard (Neon Postgres)
- SEO metadata, Open Graph / Twitter cards, `robots.txt`, `sitemap.xml`

## Develop

```bash
npm install
cp .env.example .env.local   # set DATABASE_URL
npm run dev
```

## Deploy on Vercel

Import this repository in Vercel. Set `DATABASE_URL` (Neon Postgres) for Production and Preview.
