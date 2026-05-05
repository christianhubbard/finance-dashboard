---
name: investigate-incident
description: Investigates production or Sentry-reported errors using the Sentry MCP, maps stack traces to source files, correlates recent git history, classifies severity (P1–P4), and writes a structured triage markdown report under .cursor/docs/incidents/. Attempts fixes and runs tests only for P3/P4; for P1/P2, reports only with no code changes. Use when the user asks to investigate an incident, triage a Sentry issue, or run this workflow by skill name.
disable-model-invocation: true
---

# Investigate incident

## When to use

Apply this workflow when investigating errors from Sentry (or similar) for this repo: pull issue details, map to code, correlate commits, classify severity, write the report, then either fix (P3/P4 only) or stop (P1/P2).

## Prerequisites

- Sentry MCP available (`plugin-sentry-sentry` / Sentry tools in Cursor).
- Repo root as the working directory for `git` and codebase search.
- Before calling any MCP tool, read that tool’s schema in `mcps/plugin-sentry-sentry/tools/*.json` (or equivalent) for exact parameters.

## 1. Resolve scope and fetch Sentry details

1. **Organization / project**
   - If the user gives an issue URL or `org/project`, parse it and use that scope.
   - Otherwise call `find_organizations` (and `find_projects` with `organizationSlug` and optional `query`) to locate the right project. Pass `regionUrl` when the org listing shows one (e.g. `https://us.sentry.io` for sentry.io).

2. **Identify the issue**
   - If the user gives a short id (e.g. `FINANCE-DASHBOARD-1`) or URL, use `get_sentry_resource` with `resourceType: issue` (or `url`).
   - If discovering the latest problem: use `search_issues` with `projectSlugOrId` set, `query` such as `is:unresolved`, and `sort: date` (last seen). Take the top result unless the user specifies another.

3. **Pull full error context**
   - Use `get_sentry_resource` for the issue to capture at minimum:
     - Full stack trace (all frames available).
     - **Users impacted** / user count (and event count if shown).
     - **First seen** and **last seen** timestamps.
     - Environment, release, transaction/route, level, tags, and any linked replay URL.
   - Optionally use `search_issue_events` or `get_replay_details` when replay or per-event detail is needed.

## 2. Map stack trace to repository files

1. Extract frames that reference **application** code (not only `node_modules` or minified-only lines).
2. For Next.js / Turbopack bundles, paths may look like `components_*_Sidebar_tsx_....js`. Map them to real sources by:
   - Grepping the repo for distinctive path segments, component names, or route segments.
   - Matching file basenames (e.g. `Sidebar.tsx`) under `app/`, `components/`, `lib/`, etc.
3. List **files involved** as concrete repo-relative paths. If a frame cannot be mapped, note it as **unmapped (bundle)** and record the frame text.

## 3. Recent changes (last 72 hours)

For each mapped file (and parent dirs only if clearly relevant):

```bash
git log --since="72 hours ago" --oneline -- <path1> [path2 ...]
```

- Summarize commits that touched those paths: hash, subject, date.
- If no commits in 72h, state that explicitly.

## 4. Severity classification

Use exactly these definitions:

- **P1**: user-facing, affecting >1% of users
- **P2**: user-facing, isolated
- **P3**: internal, non-critical
- **P4**: cosmetic/logging

**How to decide**

- Use Sentry **user impact** and **environment** (e.g. `production` vs `development`) plus any deployment/reach context.
- If user % is not available or the issue is new with **0 users**, default to **isolated user-facing → P2** if production‑like; **development / internal tooling → P3** unless clearly user-visible in prod.
- Demo, logging-only, or cosmetic UI glitches with no functional impact → **P4**.
- When uncertain between two levels, choose the **higher** severity (lower P number) and explain the uncertainty in the report.

## 5. Structured triage report (markdown)

Write the report with these sections (use clear `##` headings):

1. **Summary** — one short paragraph.
2. **Sentry** — issue id/link, title, status, environment, release, event count, **users impacted**, first/last seen (UTC and human-readable).
3. **Stack trace** — fenced code block with the full trace Sentry returned.
4. **Files involved** — bullet list of repo paths; note unmapped frames.
5. **Recent changes (72h)** — bullets from `git log` or “none”.
6. **Root cause hypothesis** — evidence-based; distinguish confirmed vs suspected.
7. **Recommended fix approach** — concrete next steps (no patch for P1/P2).
8. **Severity** — **P1 | P2 | P3 | P4** with one-line justification per section 4.

## 6. Save the report

- **Directory**: `.cursor/docs/incidents/` (create with `mkdir -p` if missing).
- **Filename**: `incident-<SENTRY-SHORT-ID>-<YYYY-MM-DD>.md`  
  Example: `incident-FINANCE-DASHBOARD-1-2026-05-05.md`  
  If no short id, use `incident-<slug-from-title>-<YYYY-MM-DD>.md`.

## 7. After the report: fixes and tests

| Severity | Code changes | Verification |
|----------|--------------|--------------|
| **P1 / P2** | **Do not** implement fixes. Stop after the report. | Optional: suggest what tests would run after a human fixes it. |
| **P3 / P4** | **May** implement a minimal, targeted fix aligned with the hypothesis. | Run the project’s checks (e.g. `npm run lint`; run `npm run build` if appropriate). This repo’s primary automated check is lint per `AGENTS.md` — use it unless the user’s project has fuller tests. |

For P3/P4, if a fix is attempted and reverts are safer than a partial fix, revert and document that in the report file (append an **Update** subsection with timestamp).

## Checklist

- [ ] Sentry issue loaded; stack, users, first/last seen captured
- [ ] Stack mapped to repo files (or unmapped noted)
- [ ] `git log --since="72 hours ago"` on those files
- [ ] Severity P1–P4 assigned per definitions above
- [ ] Report written to `.cursor/docs/incidents/`
- [ ] P1/P2: no code changes; P3/P4: fix + lint/build as applicable
