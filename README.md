# Harbor Stack

Playable Tetris in the browser by **Strand & Stone**.

**Live:** https://tetris-game-gamma-one.vercel.app

## Features

- Classic 10×20 Tetris with 7-bag randomizer
- Score, level, lines, next piece, ghost piece, pause
- Keyboard, on-screen buttons, and swipe gestures
- Persistent high-score leaderboard (Neon Postgres)
- Mobile-first UI with safe-area insets
- SEO metadata, Open Graph / Twitter cards, `robots.txt`, `sitemap.xml`

## Develop

```bash
npm install
cp .env.example .env.local   # set DATABASE_URL
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

Import this repository in Vercel. Set `DATABASE_URL` (Neon Postgres) for Production and Preview. Optional: `NEXT_PUBLIC_SITE_URL` for absolute canonical/sitemap URLs.
