# Weekly Security Audit Report - Finance Dashboard

**Audit date:** 2026-06-08  
**Branch:** `cursor/finance-dashboard-security-audit-fd48`  
**Scope:** Next.js finance dashboard source, static finance data, dependency manifest/lockfiles, Sentry configuration, test/lint/security tooling, and route/API exposure.  
**Auditor:** Cursor Cloud automation

## Executive summary

The finance dashboard is currently a static, read-only MVP that renders finance-like mock records from `data/finance.json`. This keeps the runtime attack surface small: no API routes, server actions, database, external data services, or mutation handlers were found. However, if this application is deployed as a real financial-data product, it is missing the core controls required for confidentiality, integrity, auditability, and regulated financial-data handling.

**Critical security gaps flagged:**

1. No authentication or route-level authorization protects the financial overview.
2. Finance-like records are stored in source control and rendered publicly from a bundled JSON import.
3. No application audit log exists for financial data access, permission decisions, or security-relevant events.

Dependency scanning also found one high-severity vulnerable package range affecting the pinned Next.js version.

## Audit method and evidence reviewed

- Reviewed app entry points and routes: `app/page.tsx`, `app/layout.tsx`, placeholder route pages under `app/*/page.tsx`.
- Reviewed data access and schema: `lib/data.ts`, `lib/types.ts`, `data/finance.json`.
- Reviewed client persistence and navigation: `components/shell/Sidebar.tsx`.
- Reviewed observability/error capture: `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `app/global-error.tsx`.
- Reviewed security/config/tooling: `next.config.ts`, `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `.gitignore`, `eslint.config.mjs`.
- Searched for API/security markers: `route.ts`, `middleware`, `proxy`, `use server`, `auth`, `session`, `cookie`, `headers()`, `dangerouslySetInnerHTML`, `eval`, `crypto`, `encrypt`, `audit`, `log`.
- Ran `npm audit --audit-level=low`.

## Findings by requested control area

### 1. Data encryption status for sensitive financial records

| Finding | Risk | Evidence | Recommendation |
| --- | --- | --- | --- |
| Finance-like records are committed as plaintext JSON and imported directly into the app. | **Critical if real data; Medium for mock/demo data** | `lib/data.ts:2-5` imports `@/data/finance.json`; `data/finance.json:2-6` includes balances; `data/finance.json:33-40` includes named transaction records and amounts. | Do not store real financial records in the repo or app bundle. Move real data to a managed datastore with encryption at rest, strict IAM, backups, and per-user scoping. Keep only non-sensitive fixture data in source control. |
| No application-layer encryption, key management, or field-level tokenization was found. | **High** | No crypto/encryption libraries or key-management configuration found; `.gitignore:33-34` excludes `.env*`, but no secret-backed encryption path exists. | For sensitive fields, define data classification and use platform/database encryption at rest plus field-level encryption or tokenization where required. Manage keys through a KMS, rotate keys, and avoid exposing decrypted values outside authorized request paths. |
| Data is rendered into the public page response. | **Critical if real data** | `app/page.tsx:8-27` reads all finance data and passes balance, pots, transactions, budgets, and recurring bills into UI components. | Gate the page behind authentication and authorization before retrieving user-specific records. Ensure server-rendered payloads contain only the authenticated user's permitted data. |

**Current encryption status:** No evidence of encryption controls for financial records in the app layer. Any transport encryption depends on deployment platform HTTPS, not code in this repository.

### 2. Access control restrictions and user permissions

| Finding | Risk | Evidence | Recommendation |
| --- | --- | --- | --- |
| No authentication mechanism is implemented. | **Critical** | `package.json:15-20` has no auth dependency; search found no session/cookie/JWT handling; no middleware/proxy file exists. | Add an authentication provider suitable for the product's compliance requirements. Require authenticated sessions for all finance routes. |
| No authorization or role/permission model exists. | **Critical** | `app/page.tsx:8-27` renders the overview without any permission check; placeholder routes are also publicly routable. | Add server-side authorization checks for each protected route and data request. Define roles/scopes such as account owner, read-only viewer, support/admin, and enforce least privilege. |
| Client-side localStorage is used only for a UI preference, not access control. | **Informational** | `components/shell/Sidebar.tsx:16-17` defines `finance-sidebar-collapsed`; `components/shell/Sidebar.tsx:30-48` reads/writes it. | Keep access-control state server-side or in signed, validated session tokens. Continue avoiding localStorage for secrets, tokens, or permissions. |

**Current access-control status:** All routes are public. No user identity, tenancy, role, permission, or account lifecycle controls are present.

### 3. Audit log completeness and integrity

| Finding | Risk | Evidence | Recommendation |
| --- | --- | --- | --- |
| No application audit log exists for financial data access or security events. | **Critical for regulated financial data** | Search found no audit logging module, persistence layer, or append-only event trail. `instrumentation.ts:22-31` only forwards request errors to Sentry when enabled. | Create structured audit events for authentication, authorization decisions, data reads/exports, administrative actions, permission changes, and security exceptions. Store logs in append-only/tamper-resistant storage with retention controls. |
| Sentry error monitoring is not an audit log and is optional. | **High** | `instrumentation.ts:3-6` gates Sentry by env; `sentry.server.config.ts:3-8` and `sentry.edge.config.ts:3-8` initialize only in production with `SENTRY_DSN`. | Treat Sentry as observability, not compliance logging. Add dedicated audit logging independent of error monitoring. |
| Client session replay may capture financial information if Sentry is enabled. | **Medium** | `instrumentation-client.ts:15-17` enables replay at 10% session sampling and 100% on error. | Disable replay for financial screens or configure privacy masks/scrubbing and sampling approvals. Document what replay captures and exclude sensitive values. |

**Current audit-log status:** Incomplete. There is no audit trail, integrity protection, retention policy, or log review workflow in the repository.

### 4. API security and authentication mechanisms

| Finding | Risk | Evidence | Recommendation |
| --- | --- | --- | --- |
| No API routes or server actions were found. | **Informational positive** | Search found no `app/api/**/route.ts`, no `route.ts`, and no `"use server"` directives. | Maintain this low attack surface until a real backend is needed. When APIs are added, require authentication, authorization, input validation, CSRF protection for browser mutations, rate limiting, and structured audit logs. |
| No explicit security headers are configured. | **High** | `next.config.ts:12-28` defines only Sentry aliasing/webpack behavior; no `headers()` configuration for CSP, HSTS, frame protection, MIME sniffing protection, or referrer policy. | Add defense-in-depth headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options` or CSP `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Validate against Next.js 16 config behavior before rollout. |
| Sentry source upload is widened. | **Medium** | `next.config.ts:30-37` uses `withSentryConfig(..., { widenClientFileUpload: true })`. | Restrict source-map upload to what is required for debugging. Ensure source maps are private and Sentry access is limited. |
| Dependency scan found vulnerable packages. | **High** | `npm audit --audit-level=low` reported `next` high severity advisories affecting the pinned `next@16.2.4`, plus moderate `brace-expansion` and `postcss` advisories. | Upgrade Next.js and affected transitive dependencies after reading the Next.js 16 release/migration notes. Re-run `npm audit`, `npm run lint`, `npm test`, and `npm run build`. Add recurring dependency scanning in CI. |

**Current API security status:** There is no application API to attack today, but there is also no auth/security-header baseline for production.

### 5. Compliance with financial data handling standards

This repository does not currently show the controls expected for a real financial-data application. The following gaps should be treated as blockers before handling production financial records:

| Compliance capability | Status | Risk | Recommendation |
| --- | --- | --- | --- |
| Data classification and minimization | Missing | **High** | Classify balance, transaction, merchant, recurring-bill, and user identity fields. Minimize what is stored, rendered, logged, and sent to third parties. |
| Encryption at rest and in transit | Not evidenced in app | **High** | Use a compliant datastore with encryption at rest and require HTTPS/HSTS in deployment. Add field-level protection for highly sensitive attributes. |
| Access control and least privilege | Missing | **Critical** | Implement authenticated, authorized, per-user data access and administrative separation of duties. |
| Auditability and tamper resistance | Missing | **Critical** | Add immutable audit logs with retention, monitoring, and incident-review procedures. |
| Third-party data sharing controls | Incomplete | **Medium** | Review Sentry replay/error payloads, source maps, and PII scrubbing before enabling in production. Maintain vendor/data-processing documentation. |
| Dependency and vulnerability management | Incomplete | **High** | Add automated dependency scanning, Dependabot/Renovate, and a documented patch SLA for high/critical advisories. |
| Secure SDLC evidence | Partial | **Medium** | ESLint and tests exist, but no SAST/security linting/CI workflow was found. Add CI gates for lint, tests, build, dependency audit, and secret scanning. |

## Dependency audit results

Command run:

```bash
npm audit --audit-level=low
```

Result: **failed with 3 vulnerabilities**.

| Package | Severity | Summary | Suggested remediation |
| --- | --- | --- | --- |
| `next@16.2.4` | **High** | Multiple Next.js advisories reported by npm audit, including Server Components denial of service, Middleware/Proxy bypass/cache poisoning classes, App Router CSP nonce XSS, Image Optimization DoS, WebSocket upgrade SSRF, and cache poisoning advisories. | Upgrade to a patched Next.js version. `npm audit` reports a fix via `npm audit fix --force` that would install `next@16.2.7`; review Next.js 16 docs/release notes before applying. |
| `postcss <8.5.10` via Next.js | **Moderate** | XSS via unescaped `</style>` in CSS stringify output. | Upgrade via the patched Next.js dependency chain. |
| `brace-expansion 5.0.2 - 5.0.5` | **Moderate** | Large numeric range defeats documented `max` DoS protection. | Run `npm audit fix` where compatible; verify lockfile changes and tests. |

## Positive observations

- No committed `.env` files or PEM keys were found; `.gitignore:25` excludes `*.pem` and `.gitignore:33-34` excludes `.env*`.
- No `dangerouslySetInnerHTML` or `eval()` usage was found in application code.
- The app has no forms, mutation handlers, API routes, server actions, database client, or external service calls for financial data.
- TypeScript strict mode is enabled in `tsconfig.json:7`.
- Finance data is not placed under `public/`, so it is not directly served as a static asset. It is still bundled/rendered through the app.

## Prioritized remediation plan

### Immediate blockers before real financial data

1. **Add authentication and route protection.** Protect `/`, `/transactions`, `/budgets`, `/pots`, and `/recurring-bills` with server-side authentication.
2. **Move real financial records out of source control.** Use a compliant datastore and fetch records by authenticated user/account.
3. **Add authorization checks.** Enforce account ownership and least-privilege roles for every data read and future mutation.
4. **Implement audit logging.** Log security-relevant events to append-only storage with integrity controls.
5. **Patch vulnerable dependencies.** Upgrade Next.js and affected transitive dependencies, then re-run audit, lint, tests, and build.

### Near-term hardening

1. Add explicit security headers in Next.js config or deployment configuration.
2. Disable or strictly scrub Sentry Replay on finance screens.
3. Add `beforeSend`/scrubbing rules for Sentry and confirm `sendDefaultPii` remains disabled unless formally approved.
4. Remove `widenClientFileUpload: true` unless the source-map exposure tradeoff is documented and access is tightly restricted.
5. Add CI checks for lint, tests, build, `npm audit`, dependency updates, secret scanning, and SAST/security linting.

### Future controls when APIs or writes are introduced

1. Require input validation and output encoding for every request/response boundary.
2. Add CSRF protection for browser-initiated mutations.
3. Add rate limiting, abuse detection, and account lockout/MFA controls.
4. Add data retention, export, correction, and deletion workflows aligned with the applicable regulatory model.
5. Add incident-response runbooks and periodic access reviews.

## Overall risk rating

**Current demo/mock-data risk:** Medium, primarily from vulnerable dependencies and optional telemetry privacy concerns.  
**Risk if deployed with real financial records as-is:** Critical.

The dashboard should remain a mock-data demo until authentication, authorization, encrypted storage, audit logging, security headers, dependency patching, and financial-data handling procedures are implemented and verified.
