# finance-dashboard

Personal finance **Overview** MVP modeled on the Figma “Desktop - Home” layout: Next.js App Router, Tailwind v4, TypeScript, and mock data in [`data/finance.json`](data/finance.json).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sidebar links route to placeholder pages except **Overview** (`/`), which renders balance cards, pots summary, latest transactions, budgets (donut), and recurring bill stats.

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint

Typography: **Public Sans** via `next/font`.
