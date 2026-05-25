# Weekly Security Audit - Finance Dashboard

**Audit date:** 2026-05-25  
**Branch:** `cursor/finance-dashboard-security-audit-0b49`  
**Scope:** Static Next.js 16 finance dashboard, local repository configuration, committed data, application routes, telemetry, and npm dependency advisory status.

## Executive summary

The finance dashboard remains a static, read-only prototype. It has no API routes, no mutation paths, no middleware/proxy, and no authentication provider. The largest risks are therefore control gaps rather than complex application exploits: sensitive financial data is stored as plaintext JSON in the repository and rendered to any visitor of `/`, there is no user identity or authorization boundary, and no audit log exists to prove who accessed financial records.

**Critical security gaps flagged this week:**

1. **No access control or user permission model protects financial records.**
2. **Financial records are stored in plaintext static JSON and exposed through public page rendering.**

No critical npm advisories were reported, but `npm audit --omit=dev --json` found a **high-severity direct `next` advisory group** affecting `next@16.2.4`; the available non-major fix is `next@16.2.6`.

## Evidence reviewed

- `package.json` uses `next@16.2.4`, React 19, and Sentry; no authentication, database, or API security libraries are present.
- `app/page.tsx` loads all finance data with `getFinanceData()` and renders balances, transactions, budgets, pots, and recurring bills.
- `lib/data.ts` imports `data/finance.json` and casts it to `FinanceData` without validation.
- `data/finance.json` contains balances, income, expenses, named transactions, budgets, and recurring bills in plaintext.
- Searches found no `app/**/route.ts`, no `middleware.ts`, and no `proxy.ts`.
- Sentry is initialized in `instrumentation-client.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.
- `next.config.ts` has no configured security headers.
- `npm audit --omit=dev --json` result: 0 critical, 1 high, 2 moderate, 3 total vulnerabilities.

## Risk rating summary

| Risk level | Count | Findings |
| --- | ---: | --- |
| Critical | 2 | FIN-AUD-001, FIN-AUD-002 |
| High | 3 | FIN-AUD-003, FIN-AUD-004, FIN-AUD-005 |
| Medium | 3 | FIN-AUD-006, FIN-AUD-007, FIN-AUD-008 |
| Low | 2 | FIN-AUD-009, FIN-AUD-010 |

## Detailed findings

### FIN-AUD-001 - Missing authentication and authorization

**Risk level:** Critical  
**Area:** Access control restrictions and user permissions  
**Status:** Failing for any deployment containing sensitive or customer financial data

**Evidence:**

- `app/page.tsx` calls `getFinanceData()` and renders the full overview without any user/session check.
- No `middleware.ts` or `proxy.ts` exists to enforce route protection.
- No auth provider, session library, RBAC policy, or permission checks are present in `package.json` or application code.
- Placeholder routes under `/transactions`, `/budgets`, `/pots`, and `/recurring-bills` are also public.

**Impact:**

Anyone who can reach the deployed site can view balances, income, expenses, named transactions, budgets, and recurring bills. If real financial records are used, this is a direct confidentiality failure and a likely compliance blocker.

**Recommendation:**

- Add an authentication provider and require a valid session before rendering any finance route.
- Enforce authorization in a Next.js proxy/middleware layer and again at the data-access boundary.
- Define least-privilege roles such as `viewer`, `analyst`, and `admin`; deny access by default.
- Add route-level tests for unauthenticated, unauthorized, and authorized access once auth exists.

### FIN-AUD-002 - Plaintext financial records in repository and render path

**Risk level:** Critical  
**Area:** Data encryption status for sensitive financial records  
**Status:** Failing for real sensitive data; acceptable only for clearly mock demo data

**Evidence:**

- `data/finance.json` stores balances, income, expenses, named transactions, budgets, and recurring bills as plaintext.
- `lib/data.ts` imports that JSON directly and returns it to the page render tree.
- The data is not under `public/`, so it is not directly downloadable as `/data/finance.json`, but the overview page serializes and displays the records to the browser.

**Impact:**

There is no application-managed encryption at rest, key management, data minimization, or segregation of sensitive records. Committing real financial data would place it in Git history and expose it through any clone, build artifact, or rendered dashboard.

**Recommendation:**

- Keep only synthetic demo data in the repository.
- Move real financial records to an encrypted managed datastore with access policies, backups, and retention controls.
- Use platform/database encryption at rest and TLS in transit; consider field-level encryption for account numbers, customer identifiers, or other regulated fields.
- Remove any real financial data from Git history if it has ever been committed, then rotate affected credentials or identifiers as appropriate.

### FIN-AUD-003 - No complete or tamper-evident audit log

**Risk level:** High  
**Area:** Audit log completeness and integrity  
**Status:** Missing

**Evidence:**

- No application audit logging code or audit log storage was found.
- `instrumentation.ts` exports `Sentry.captureRequestError`, but Sentry captures errors and traces, not business audit events.
- There is no recorded user identity, action, resource, result, source context, or retention policy for finance data access.

**Impact:**

The system cannot answer who viewed financial records, when they were viewed, which records were accessed, or whether access was authorized. This weakens incident response, forensics, and compliance evidence.

**Recommendation:**

- Add structured audit events for authentication, authorization decisions, finance record reads, exports, administrative changes, and failed access attempts.
- Include timestamp, actor ID, session/request ID, source IP or platform request ID, action, resource, decision, and reason.
- Store audit events in append-only or tamper-evident storage with restricted write access, integrity checks, retention, and alerting for suspicious patterns.
- Keep sensitive values out of logs; log record identifiers and metadata instead of full financial payloads.

### FIN-AUD-004 - Sentry Session Replay may capture sensitive financial UI

**Risk level:** High  
**Area:** Financial data handling, monitoring privacy  
**Status:** Needs hardening before production use

**Evidence:**

- `instrumentation-client.ts` enables `Sentry.replayIntegration()`.
- `replaysSessionSampleRate` is set to `0.1`; `replaysOnErrorSampleRate` is set to `1.0`.
- No visible `beforeSend`, masking, route exclusion, or PII scrubbing policy exists in the Sentry config.
- The Sentry environment is hardcoded to `"production"` in client, server, and edge configs.

**Impact:**

Session replay can record rendered balances, transaction names, recurring bills, and user interactions. Without masking and environment separation, sensitive financial UI data may be transferred to third-party telemetry and mixed across environments.

**Recommendation:**

- Disable Session Replay on finance pages unless a reviewed masking policy is in place.
- Configure Sentry privacy controls to mask text and block sensitive DOM regions.
- Add `beforeSend` filtering for financial values, names, account identifiers, and request metadata.
- Source `environment` from deployment configuration instead of hardcoding `"production"`.

### FIN-AUD-005 - High-severity dependency advisories in Next.js

**Risk level:** High  
**Area:** API security and framework supply chain  
**Status:** Failing dependency audit

**Evidence:**

- `package.json` pins `next` to `16.2.4`.
- `npm audit --omit=dev --json` reports a high-severity advisory group for `next` with fix available at `16.2.6`.
- Reported advisory themes include Server Component denial of service, middleware/proxy bypasses, SSRF via WebSocket upgrades, cache poisoning, and XSS-related issues.
- `postcss` moderate advisories are pulled through `next` and are also resolved by updating `next`.

**Impact:**

Some advisories apply to framework capabilities that this app does not currently use, such as middleware/proxy, dynamic routes, WebSocket upgrades, or image optimization. However, the dashboard is built on the affected framework version, and future route or proxy additions could become vulnerable if the dependency remains stale.

**Recommendation:**

- Upgrade `next` and `eslint-config-next` to the patched compatible release, currently `16.2.6` according to npm audit.
- Re-run `npm audit --omit=dev`, `npm run lint`, `npm test`, and `npm run build` after the upgrade.
- Add dependency scanning automation, such as Dependabot or a CI npm audit job, so framework advisories are surfaced before the weekly audit.

### FIN-AUD-006 - Security headers are not configured

**Risk level:** Medium  
**Area:** API security and browser hardening  
**Status:** Missing

**Evidence:**

- `next.config.ts` contains an empty `nextConfig` object wrapped by `withSentryConfig`.
- No `headers()` configuration is present for Content Security Policy, clickjacking protection, HSTS, referrer policy, MIME sniffing protection, or permissions policy.

**Impact:**

The app lacks defense-in-depth against XSS impact, framing/clickjacking, MIME confusion, referrer leakage, and unnecessary browser feature access.

**Recommendation:**

- Add a conservative baseline header policy:
  - `Content-Security-Policy`
  - `Strict-Transport-Security` for HTTPS production deployments
  - `X-Frame-Options` or `frame-ancestors` in CSP
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` disabling unused browser APIs
- Validate Sentry script/connect requirements before finalizing CSP.

### FIN-AUD-007 - No runtime validation for financial data

**Risk level:** Medium  
**Area:** Financial data integrity  
**Status:** Missing

**Evidence:**

- `lib/data.ts` returns `finance as FinanceData`, which is a TypeScript assertion only.
- `data/finance.json` is not validated for required fields, date formats, finite amounts, allowed themes/categories, or recurring bill invariants.
- Tests cover helper sorting and summing behavior, but not schema integrity.

**Impact:**

Malformed or unexpected data can cause incorrect reporting, failed renders, or misleading totals. For regulated financial handling, data quality controls are part of integrity and auditability.

**Recommendation:**

- Add schema validation for `finance.json` at load/build time.
- Validate numeric amounts, ISO date strings, allowed categories/themes, and recurring bill shape.
- Fail closed on invalid data and add tests for representative invalid records.

### FIN-AUD-008 - No API authentication mechanisms because no API exists yet

**Risk level:** Medium  
**Area:** API security and authentication mechanisms  
**Status:** Not applicable today; design gap for future expansion

**Evidence:**

- No `app/**/route.ts` handlers were found.
- No Server Actions or form POST handlers were found.
- There is no CSRF protection, rate limiting, input validation layer, or API authorization policy because there is no API surface.

**Impact:**

The current read-only app avoids API-specific risks, but adding API routes without a security pattern would likely reproduce the existing missing-auth gap.

**Recommendation:**

- Before adding API routes, define a standard handler wrapper for authentication, authorization, validation, rate limiting, structured audit logging, and consistent error responses.
- Require tests for unauthenticated, unauthorized, invalid-input, and success paths for every new endpoint.

### FIN-AUD-009 - Supply-chain governance automation is absent

**Risk level:** Low  
**Area:** Dependency management  
**Status:** Missing

**Evidence:**

- No `.github/workflows/*` files were found.
- No `.github/dependabot.yml` file was found.
- `package-lock.json` is present, which is a positive reproducibility control.

**Impact:**

Known-vulnerable dependencies can remain in place until a manual audit is run.

**Recommendation:**

- Add Dependabot or equivalent dependency update automation.
- Add CI checks for `npm audit --omit=dev`, linting, tests, and build.
- Review and pin security-relevant build settings.

### FIN-AUD-010 - Low current injection risk

**Risk level:** Low  
**Area:** Client rendering and input handling  
**Status:** Passing for current scope

**Evidence:**

- Searches found no `dangerouslySetInnerHTML`, `eval(`, or direct `innerHTML` usage.
- There are no user input forms, search parameters, mutations, or external data fetches.
- React text rendering is used for transaction names, categories, and amounts.

**Impact:**

Current XSS and injection exposure is low because the app does not process user-controlled input.

**Recommendation:**

- Continue avoiding raw HTML rendering.
- Add input validation and output encoding review when interactive filters, imports, uploads, or API-backed records are introduced.

## Compliance assessment

This dashboard should be treated as **not production-ready for regulated financial data** until the critical and high findings are remediated.

| Control area | Current status | Compliance implication |
| --- | --- | --- |
| Data classification and minimization | Mock-like data is committed, but controls do not prevent real data from being committed | Needs a documented synthetic-data-only policy or a secure datastore |
| Encryption at rest | No app-managed encrypted datastore; plaintext JSON in Git | Not suitable for real financial records |
| Encryption in transit | Not verifiable from repo; depends on hosting configuration | Require HTTPS/HSTS in production |
| Identity and access management | No authentication, authorization, or RBAC | Blocks GLBA/SOC 2-style access control expectations |
| Audit logging | No business audit trail | Blocks forensic and compliance evidence requirements |
| Third-party telemetry privacy | Sentry Replay enabled without visible masking/scrubbing | Requires privacy review and data processing controls |
| Secure SDLC | Lockfile exists, tests exist, but no dependency/security CI automation | Needs automated vulnerability monitoring |

## Prioritized remediation plan

1. **Block public access to finance data.** Add authentication and authorization before any real data is deployed.
2. **Remove sensitive data from Git.** Keep repository data synthetic; move real records to encrypted storage.
3. **Upgrade Next.js to a patched release.** Address the high-severity dependency audit finding.
4. **Disable or harden Sentry Replay.** Mask sensitive DOM content and scrub events before export.
5. **Implement audit logging.** Capture complete, immutable access and authorization events.
6. **Add security headers.** Start with CSP, HSTS, frame protections, nosniff, referrer policy, and permissions policy.
7. **Validate financial data schemas.** Enforce data integrity at load/build time.
8. **Add supply-chain automation.** Dependabot and CI checks should run continuously, not only during weekly audits.

## Weekly audit conclusion

No active API exploit path or critical dependency advisory was found in the current static app. However, the app has two critical security control gaps for any real financial deployment: **no access control** and **plaintext financial records in the repository/render path**. These should be treated as release blockers before the dashboard is connected to real users or real financial data.
