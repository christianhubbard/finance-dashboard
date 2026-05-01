<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- **Stack**: Next.js 16.2.4 (App Router + Turbopack), React 19, Tailwind CSS v4, TypeScript 5, static mock data from `data/finance.json`.
- **Node**: v22 via nvm at `/home/ubuntu/.nvm`. Source nvm before running any npm/node commands: `export NVM_DIR="/home/ubuntu/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`
- **No external services** — no database, no Docker, no env vars needed.
- **No test framework** — there is no `test` script or testing library installed.
- **Scripts** — see `package.json`: `npm run dev` (Turbopack dev server on :3000), `npm run build`, `npm run lint` (ESLint flat config).
- **Dev server**: `npm run dev` starts on port 3000. Hot reload via Turbopack works out of the box.
- **Routes**: `/` (Overview — the main dashboard), `/transactions`, `/budgets`, `/pots`, `/recurring-bills` (placeholder pages except Overview).
