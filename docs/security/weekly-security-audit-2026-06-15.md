# Weekly Security Audit - Finance Dashboard

Audit date: 2026-06-15  
Repository branch: `cursor/finance-dashboard-security-audit-0b6e`  
Scope: Next.js finance dashboard application, static finance dataset, dependency audit, build/test/lint health, and security-control review against financial-data handling expectations.

## Executive summary

The current application is a static MVP dashboard backed by mock JSON data (`data/finance.json`) and has no backend services, databases, API route handlers, middleware/proxy layer, or authentication provider. That architecture is acceptable only while all displayed values remain mock or non-sensitive demo data.

If this dashboard is used with real customer financial records, there are critical security gaps: no user authentication, no authorization boundaries, no encrypted data store, no application audit trail, and no documented financial-data governance controls. The dependency audit also reports a high-severity vulnerable `next@16.2.4` package and moderate transitive vulnerabilities.

No evidence of direct XSS primitives such as `dangerouslySetInnerHTML`, `eval`, or custom HTML injection was found in application code. React renders the static values through normal JSX escaping.

## Audit evidence

### Repository and code inspection

- Sensitive-looking dashboard records are sourced directly from `data/finance.json`.
  - Balances: current, income, and expenses.
  - Transactions: names, categories, dates, amounts, and recurring flags.
  - Budgets, pots, and recurring bill records.
- `lib/data.ts` imports the JSON dataset directly and returns it to the overview page.
- `app/page.tsx` renders the dataset into overview components.
- Searches found no `route.ts` API handlers, no middleware/proxy files, no auth/session/cookie usage, and no database client.
- `components/shell/Sidebar.tsx` uses `localStorage` only for a non-sensitive sidebar-collapsed preference.
- `sentry.server.config.ts`, `sentry.edge.config.ts`, and `instrumentation-client.ts` configure Sentry only when production or Sentry enablement flags are set.

### Build artifact verification

After running `npm run build`, searching `.next` showed transaction names and financial values in generated static/RSC output, including `Emma Richardson` in `.next/server/app/index.rsc` and static app output. This confirms the current architecture publishes rendered finance records to any user who can fetch the page.

### Automated checks run

```text
npm audit --audit-level=low
```

Result: failed with 3 vulnerabilities.

- High: `next@16.2.4`
  - Multiple GitHub advisories including Server Component DoS, cache poisoning, middleware/proxy bypass, XSS, SSRF, and image optimization DoS advisories.
  - npm reports the fix path as `npm audit fix --force`, installing `next@16.2.9` outside the current exact package spec.
- Moderate: `postcss <8.5.10`, via `next`.
- Moderate: `brace-expansion 5.0.2 - 5.0.5`, via transitive dependencies.

```text
npm run lint
npm test
npm run build
```

Result: passed.

- ESLint: passed.
- Vitest: 8 files passed, 29 tests passed.
- Next production build: passed, all app routes prerendered as static content.

## Findings

| ID | Area | Risk | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- | --- |
| F-001 | Access control and user permissions | Critical if real data is used | No authentication or authorization controls protect the dashboard. All routes are static and publicly renderable. | No auth dependencies, no middleware/proxy, no session/cookie checks, and static routes for `/`, `/transactions`, `/budgets`, `/pots`, and `/recurring-bills`. | Before using real records, add an authentication provider, protect all finance routes at the request boundary, and enforce per-user/tenant authorization in server-side data access. Add tests proving unauthenticated requests are redirected/denied and cross-user data access fails. |
| F-002 | Data encryption for sensitive records | Critical if real data is used | Financial records are stored as plaintext JSON in the repository and are emitted into static build artifacts. There is no encrypted storage layer or key-management boundary. | `data/finance.json` contains balances, names, transaction dates, amounts, budgets, and bill details. `.next` output includes rendered record values after build. | Keep mock data non-sensitive. For production, move records to a managed datastore with encryption at rest, use TLS in transit, keep secrets out of source control, and restrict decryption/data access to authenticated server-side code. |
| F-003 | Audit log completeness and integrity | High | No application audit log exists for finance-data access, navigation, attempted access, data exports, or administrative actions. Sentry captures errors only when enabled and is not a tamper-evident audit trail. | No audit-log module, no logging sink, no route handlers, no event schema, and Sentry configs only initialize under production/Sentry flags. | Define an immutable audit event schema for login, logout, denied access, finance-record read/export/update/delete, admin changes, and security setting changes. Send events to append-only storage with retention, integrity controls, and alerting for suspicious access patterns. |
| F-004 | API security and authentication mechanisms | High for future APIs; currently no API surface | No custom API endpoints are present, so API-specific risks such as broken object-level authorization are not currently exposed. However, the app has no authentication foundation for future API additions. | No `app/**/route.ts` files found. No middleware/proxy or auth checks found. | Treat any future finance API as authenticated-by-default. Require server-side authorization, schema validation, rate limits, CSRF protection for state-changing browser actions, structured error handling, and tests for unauthenticated and unauthorized calls. |
| F-005 | Dependency vulnerabilities | High | `npm audit` reports a high-severity vulnerable Next.js version and moderate transitive vulnerabilities. | `npm audit --audit-level=low` failed for `next@16.2.4`, `postcss`, and `brace-expansion`. | Upgrade Next.js to a patched version compatible with the app, update related lockfiles, rerun `npm audit`, lint, tests, and build. Avoid leaving framework security advisories unresolved on an internet-facing dashboard. |
| F-006 | Security headers and browser hardening | Medium | No explicit Content Security Policy, HSTS, frame-ancestors, referrer policy, or permissions policy is configured in `next.config.ts`. | `next.config.ts` only configures Sentry aliasing/wrapping and does not define security headers. | Add deployment-level or Next-level security headers. Prioritize CSP, `Strict-Transport-Security`, `X-Frame-Options` or CSP `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`, and `Permissions-Policy`. Validate with an automated header check in CI or deployment smoke tests. |
| F-007 | Financial data handling compliance | High if real data is used | There is no documented data classification, retention policy, consent/privacy notice, access review process, incident response procedure, or vendor/telemetry data handling policy for financial records. | README identifies the data as mock. No compliance/security documentation was found beyond `.gitignore` excluding `.env*` and `*.pem`. | Document financial-data classification and handling standards before onboarding real records. Align controls with applicable obligations such as GLBA/FTC Safeguards, SOC 2 security/privacy controls, internal least-privilege reviews, retention/deletion requirements, and PCI DSS only if cardholder data is introduced. |
| F-008 | Telemetry and error monitoring privacy | Medium | Sentry Replay/error monitoring can be enabled, but there is no explicit application-level sensitive-data redaction policy in the Sentry configuration. | `instrumentation-client.ts` enables `Sentry.replayIntegration()` with sample rates when Sentry is enabled. Server/edge configs do not define `beforeSend` redaction. | Verify Sentry default masking against the rendered finance UI and add explicit `beforeSend`/Replay masking or allow/deny rules for financial amounts, names, account identifiers, URLs, and request metadata. Document telemetry retention and access controls. |
| F-009 | Lockfile/package-manager hygiene | Low | Both `package-lock.json` and `pnpm-lock.yaml` are present while project scripts and setup use npm. Mixed lockfiles can cause inconsistent dependency resolution and audit results. | `package.json` scripts use npm; `package-lock.json` and `pnpm-lock.yaml` both exist. | Choose one package manager for CI and local setup. If npm is canonical, remove or stop updating `pnpm-lock.yaml`; if pnpm is canonical, update setup docs and audit commands accordingly. |

## Critical security gaps to flag

The following are critical blockers for any production use with real sensitive financial records:

1. No authentication or route protection.
2. No per-user or per-tenant authorization model.
3. Plaintext financial records in source-controlled JSON and static build output.
4. No immutable audit trail for financial-data access or security events.

## Remediation roadmap

### Immediate

1. Keep `data/finance.json` strictly mock-only and document that it must not contain real customer data.
2. Upgrade `next` to a patched version and resolve all `npm audit` findings.
3. Select the canonical package manager and remove lockfile drift.
4. Add baseline security headers.

### Before adding real users or real financial records

1. Add authentication and route protection for every finance route.
2. Introduce a server-side data layer backed by encrypted storage.
3. Enforce user/tenant ownership checks in every server-side data access path.
4. Implement immutable audit logging for access and administrative events.
5. Add automated tests for unauthenticated access, unauthorized access, and audit-event emission.
6. Define data classification, retention, deletion, telemetry redaction, and incident response procedures.

### Ongoing weekly checks

1. Run `npm audit --audit-level=low`.
2. Run `npm run lint`, `npm test`, and `npm run build`.
3. Search for new API routes/middleware and verify auth coverage.
4. Search for sensitive records committed to source (`data/`, fixtures, screenshots, logs).
5. Review Sentry/telemetry settings for PII or financial-data leakage.

## Current risk posture

- Mock-only static MVP: Medium overall risk, driven mainly by dependency advisories and missing browser hardening.
- Production finance dashboard with real financial records: Critical overall risk until authentication, authorization, encrypted storage, audit logging, and financial-data governance controls are implemented.
