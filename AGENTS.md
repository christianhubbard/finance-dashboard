<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a self-contained Next.js 16 finance dashboard with no external services or databases — all data is static JSON in `data/finance.json`.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Turbopack, port 3000) |
| Lint | `npm run lint` (ESLint flat config) |
| Build | `npm run build` |

### Notes

- Node.js 22 LTS is used (managed via nvm). The update script handles `nvm install 22 --default` and `npm install`.
- The dev server uses Turbopack and starts very quickly (~250ms). No environment variables or `.env` files are needed.
- Overview (`/`) and Transactions (`/transactions`) have real content. Other sidebar pages (Budgets, Pots, Recurring Bills) are placeholders.
- Quality checks: `npm run lint` and `npm test` (Vitest).
