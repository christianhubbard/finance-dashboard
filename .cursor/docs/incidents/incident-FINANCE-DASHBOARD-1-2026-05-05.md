## Summary

The latest unresolved Sentry issue is a development-only demo error triggered from the sidebar on the Overview route. It has 15 events, 0 users impacted, and maps directly to the `Trigger Sentry Error` button in `components/shell/Sidebar.tsx`.

## Sentry

- Issue: [FINANCE-DASHBOARD-1](https://cursor-field-eng.sentry.io/issues/FINANCE-DASHBOARD-1)
- Title: `Error: Finance Dashboard Sentry demo error`
- Status: unresolved / new
- Environment: development
- Release: `a549cccfe9d9e3698d3e53a0b0eb7465900f00b2`
- Event count: 15
- Users impacted: 0
- First seen: 2026-05-05T15:30:33.570Z (about 56 minutes before investigation)
- Last seen: 2026-05-05T15:33:43.000Z (about 53 minutes before investigation)
- Transaction / route: `/`
- Level: error
- Replay: https://cursor-field-eng.sentry.io/explore/replays/86e98cb5069e41f98675c673e2140e6f/
- Search results: https://cursor-field-eng.sentry.io/issues/?project=finance-dashboard&query=is%3Aunresolved

## Stack trace

```text
Error: Finance Dashboard Sentry demo error

app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:12985:64 (dispatchDiscreteEvent)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:13003:37 (dispatchEvent)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10432:9 (dispatchEventForPluginEventSystem)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:2254:44 (batchedUpdates$1)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10634:13
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10356:41 (processDispatchQueue)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:966:74 (runWithFiberInDEV)
app:///_next/static/chunks/node_modules_next_dist_compiled_react-dom_058-ah~._.js:10330:13 (executeDispatch)
app:///_next/static/chunks/components_shell_Sidebar_tsx_0ukuon0._.js:186:35 (onClick)
```

## Files involved

- `components/shell/Sidebar.tsx` - first-party frame maps to the sidebar's demo error button.
- Unmapped bundled frames: React DOM / Next.js Turbopack chunks under `node_modules_next_dist_compiled_react-dom_...`.

## Recent changes (72h)

- `77f5d66` - 2026-05-04 16:15:28 -0400 - `UI Tweaks`; touched `components/shell/Sidebar.tsx` with 25 insertions and 26 deletions.

## Root cause hypothesis

Confirmed: the error is intentionally thrown by the sidebar's `Trigger Sentry Error` control:

```tsx
onClick={() => {
  throw new Error("Finance Dashboard Sentry demo error");
}}
```

The Sentry tags show `environment: development` and `url: http://localhost:3001/`, so the observed events came from a local development session rather than production traffic. The recent `UI Tweaks` commit likely introduced or retained the demo controls in the sidebar, but the underlying behavior is explicit test instrumentation rather than an unexpected application crash.

## Recommended fix approach

Because this is development-only demo instrumentation with no impacted users, remove the button that throws the uncaught exception or gate it behind an explicit development-only debug flag. Keep non-throwing Sentry verification available only if needed, preferably via `Sentry.captureException` so it does not crash the UI.

## Severity

**P3** - internal, non-critical. The issue is in development, has 0 users impacted, and is caused by a manually triggered demo control.

## Update

2026-05-05T16:26:00Z - Removed the sidebar button that threw the uncaught `Finance Dashboard Sentry demo error`. Kept the non-crashing `Sentry.captureException` demo control. Verification: `npm run lint` passed.
