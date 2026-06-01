# Weekly Security Audit Report - Finance Dashboard

**Audit date:** 2026-06-01  
**Scope:** Static review of the Next.js finance dashboard repository, with dependency advisory scan via `npm audit --audit-level=low`.  
**Application context:** The project is documented as a self-contained MVP using static mock data in `data/finance.json`, with no external service or database dependency.

## Executive Summary

The dashboard has a small runtime attack surface: no API routes, no server actions, no middleware/proxy file, and only static JSON data rendered through Server Components. That is acceptable for a local/demo MVP, but the current architecture is not suitable for real financial records without substantial security controls.

**Critical security gaps if deployed with real customer financial data:**

1. No authentication or authorization protects the dashboard routes.
2. Financial data is stored as plaintext JSON in the source repository.
3. No audit logging exists for data access, failed access, administrative action, or data change events.
4. Sentry session replay is enabled without explicit financial-data masking controls.

## Risk Summary

| Area | Current status | Risk level | Notes |
| --- | --- | --- | --- |
| Data encryption for sensitive financial records | Plaintext mock data committed in `data/finance.json` | **Critical for real data / Low for mock data** | No encryption at rest, field-level encryption, KMS, or encrypted datastore is configured. |
| Access control and user permissions | No auth, RBAC, route guards, or user model | **Critical for real data / High generally** | Anyone who can reach the app can view rendered financial information. |
| Audit log completeness and integrity | No audit trail or tamper-evident logging | **High** | Sentry error telemetry is present but is not an audit log. |
| API security and authentication | No API routes currently; no auth baseline for future APIs | **Medium now / High if APIs are added** | Current API surface is minimal, but there are no reusable API security controls. |
| Financial data handling compliance | No privacy, retention, DSR, vendor, or access review controls in repo | **High for production financial data** | Not aligned with SOC 2, GLBA-style safeguards, or GDPR-style privacy obligations. |
| Dependency advisories | `npm audit` found Next.js high severity and dependency moderate advisories | **High** | Requires framework/dependency patching and verification. |
| Security headers | No app-level security headers configured in `next.config.ts` | **Medium** | CSP, HSTS, frame restrictions, and referrer policy are absent. |

## Detailed Findings

### 1. Plaintext financial records in source control

- **Risk level:** Critical if real data is used; Low for current mock data.
- **Evidence:**
  - `lib/data.ts` imports `@/data/finance.json` directly and returns it as `FinanceData`.
  - `data/finance.json` contains balances, transaction names, categories, dates, amounts, and recurring bills.
- **Impact:** If real financial records are committed or bundled this way, repository readers, build systems, logs, backups, and deployed HTML can expose sensitive information.
- **Recommendation:**
  - Keep only synthetic fixtures in git.
  - Move production financial records to an encrypted datastore.
  - Use envelope encryption or a managed KMS for high-risk fields.
  - Encrypt backups and restrict operational access to the data store.

### 2. No access control or user permission boundary

- **Risk level:** Critical for real financial data.
- **Evidence:**
  - No `middleware.ts`, `proxy.ts`, auth provider integration, session handling, or RBAC model was found.
  - `app/page.tsx` renders the overview directly from `getFinanceData()`.
  - Placeholder routes under `app/transactions`, `app/budgets`, `app/pots`, and `app/recurring-bills` are also public.
- **Impact:** Any visitor who can reach the deployment can view the financial dashboard content. Search engines, shared preview URLs, or accidental public deployments could expose data.
- **Recommendation:**
  - Add authentication before any non-mock data is introduced.
  - Gate finance routes with middleware/proxy checks.
  - Introduce user and account scoping at the data-access layer.
  - Add RBAC for owner, read-only, support, and administrative roles as needed.

### 3. Missing audit log completeness and integrity controls

- **Risk level:** High.
- **Evidence:**
  - No audit log model, append-only store, event emitter, or SIEM integration was found.
  - Sentry instrumentation exists, but it captures errors/performance data rather than access and security events.
- **Impact:** The application cannot prove who accessed financial data, detect suspicious access, support incident investigations, or satisfy common financial compliance evidence requirements.
- **Recommendation:**
  - Add structured audit events for sign-in, sign-out, failed access, data reads, exports, permission changes, and administrative actions.
  - Write audit events to an append-only destination with retention controls.
  - Include actor ID, resource ID, action, outcome, timestamp, request ID, source IP or device context where appropriate, and integrity metadata.
  - Restrict audit log access and monitor tampering or deletion attempts.

### 4. API security and authentication baseline is absent

- **Risk level:** Medium now; High if API routes are added without security controls.
- **Evidence:**
  - No `app/api/**` routes or server actions were found.
  - No input validation, CORS policy, CSRF protection, rate limiting, or API authentication mechanisms are present.
- **Impact:** The current API exposure is low, but future endpoints could be added without shared guardrails.
- **Recommendation:**
  - Require authentication and authorization on every API endpoint.
  - Validate request bodies and query parameters with a schema validator.
  - Add CSRF protection for cookie-authenticated mutations.
  - Add rate limiting and abuse detection for login, export, and financial-data endpoints.
  - Avoid endpoints that expose raw financial records without field-level authorization and pagination.

### 5. Sentry session replay can capture financial data

- **Risk level:** Critical for real financial data; Medium for mock data.
- **Evidence:**
  - `instrumentation-client.ts` enables `Sentry.replayIntegration()`.
  - `replaysSessionSampleRate` is set to `0.1`.
  - `replaysOnErrorSampleRate` is set to `1.0`.
  - No explicit `maskAllText`, `blockAllMedia`, denylist, or event scrubbing is configured in the client instrumentation.
- **Impact:** Session replay can collect balances, payee names, transaction amounts, and other financial UI content from the DOM and send it to a third-party observability system.
- **Recommendation:**
  - Disable session replay on financial pages, or enable aggressive privacy masking before production.
  - Add `beforeSend` scrubbing for financial fields and user identifiers.
  - Confirm data processing agreements, retention, and access controls for Sentry.
  - Limit source map upload and Sentry project access to least-privilege roles.

### 6. Security headers are not configured

- **Risk level:** Medium.
- **Evidence:**
  - `next.config.ts` only wraps the default config with Sentry and does not define `headers()`.
- **Impact:** The app misses browser-level mitigations for clickjacking, MIME sniffing, referrer leakage, insecure transport downgrade, and script injection blast radius.
- **Recommendation:**
  - Configure at least:
    - `Content-Security-Policy`
    - `Strict-Transport-Security`
    - `X-Frame-Options` or CSP `frame-ancestors`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy`
    - `Permissions-Policy`
  - Keep CSP compatible with Next.js 16 and Sentry requirements.

### 7. Dependency vulnerabilities reported by npm audit

- **Risk level:** High.
- **Evidence:** `npm audit --audit-level=low` reported:
  - `next` high severity advisory group affecting the installed `next@16.2.4`, including denial-of-service, middleware/proxy bypass, cache poisoning, XSS, SSRF, and image optimization advisories.
  - `postcss <8.5.10` moderate severity XSS advisory via Next.js.
  - `brace-expansion` moderate severity denial-of-service advisory in transitive dependencies.
- **Impact:** Even a static dashboard can inherit framework-level exposure through rendering, routing, middleware/proxy behavior, or build/runtime paths.
- **Recommendation:**
  - Upgrade Next.js to a patched release and run the application test/build suite.
  - Run `npm audit fix` for non-breaking transitive fixes, and review any forced framework upgrades before merging.
  - Add dependency advisory scanning to CI.

### 8. Compliance and financial data handling controls are undocumented

- **Risk level:** High for production financial data.
- **Evidence:**
  - No security policy, data classification, privacy notice, retention schedule, deletion workflow, incident response guide, or access review process was found in the repository.
- **Impact:** The project cannot demonstrate controls expected for financial data handling, including SOC 2-style access/audit evidence, GLBA-style safeguards, or GDPR-style data subject request support.
- **Recommendation:**
  - Define data classification and retention policies before introducing real data.
  - Document privacy notices, lawful basis/consent where applicable, and user data deletion/export workflows.
  - Establish vendor review and DPA requirements for telemetry providers.
  - Add incident response and breach notification procedures.

## Positive Observations

- No committed `.env` files were found, and `.gitignore` excludes `.env*`.
- The app has no API routes, server actions, or middleware/proxy file, keeping the current network-facing application surface small.
- Financial fixture data is consumed by Server Components rather than stored in browser `localStorage`.
- The only observed `localStorage` usage stores sidebar collapse state, not financial data.
- TypeScript, ESLint, Vitest, and component tests are present.

## Prioritized Remediation Plan

1. **Block production use with real financial data until auth and encrypted storage exist.**
2. **Patch dependency advisories**, starting with Next.js and PostCSS exposure reported by `npm audit`.
3. **Disable or mask Sentry session replay** for financial UI before sharing deployments outside trusted test environments.
4. **Add route-level authentication and authorization**, then scope all finance data by authenticated user/account.
5. **Replace static financial JSON with an encrypted datastore** and keep only synthetic fixtures in source control.
6. **Implement append-only audit logging** for access, authorization failures, exports, and administrative changes.
7. **Add security headers** with a CSP compatible with the app's runtime requirements.
8. **Document compliance controls** for retention, deletion/export requests, vendor access, incident response, and access reviews.

## Critical Gap Flag

This repository should be treated as **demo-only** until the critical gaps above are remediated. In its current state, it should not process, store, render, or transmit real customer financial data.
