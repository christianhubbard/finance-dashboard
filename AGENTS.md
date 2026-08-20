<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a self-contained Next.js 16 finance dashboard. All app data is static JSON in `data/finance.json`; there is no database. A `@sentry/nextjs` integration is present but disabled by default — it is aliased to a noop unless `ENABLE_SENTRY`/`NEXT_PUBLIC_ENABLE_SENTRY` is set or `NODE_ENV=production` — so no external services or environment variables are needed for normal development.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` (or `npm ci` for a clean, lockfile-exact install) |
| Dev server | `npm run dev` (webpack, port 3000) |
| Test | `npm test` (Vitest) |
| Lint | `npm run lint` (ESLint flat config) |
| Build | `npm run build` |

### Notes

- Node.js 22 LTS is required. Cloud Agents get it from the base image; locally it can be managed via nvm (`nvm install 22 --default`, then `npm install`).
- `npm run dev` uses the webpack bundler and is ready in ~250ms. `npm run build` and `npm run dev:turbo` use Turbopack instead, and `npm run dev:sentry` runs the dev server with Sentry enabled. No `.env` file is needed for standard dev.
- Only the Overview page (`/`) has real content; other sidebar pages (Transactions, Budgets, Pots, Recurring Bills) are placeholders.
- Automated tests run with Vitest: `npm test` (or `npm run test:watch`). Specs live in `tests/` and cover `lib/` helpers and key components. Use `npm run lint` for static checks.
