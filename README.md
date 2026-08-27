# finance-dashboard

Personal finance **Overview** MVP modeled on the Figma “Desktop - Home” layout: Next.js App Router, Tailwind v4, TypeScript, and mock data in [`data/finance.json`](data/finance.json).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **Overview** (`/`) renders balance cards, pots summary, latest transactions, budgets (donut), and recurring bill stats. **Transactions** (`/transactions`) lists every row from the mock data with search, category, sort, and pagination. Other sidebar pages (Budgets, Pots, Recurring Bills) are placeholders.

## Scripts

- `npm run dev` — dev server (webpack; use `npm run dev:turbo` for Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — Vitest

Typography: **Public Sans** via `next/font`.
