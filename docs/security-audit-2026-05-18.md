# Weekly Security Audit Report - Finance Dashboard

Audit date: 2026-05-18  
Scope: Next.js finance dashboard in `/workspace` on branch `cursor/finance-dashboard-security-audit-e18b`  
Audit type: Static application review, dependency audit, and control-gap assessment for financial data handling

## Executive summary

The application is a self-contained Next.js 16 dashboard that reads financial records from `data/finance.json` and renders them on the public Overview page. No API route handlers, proxy/middleware, authentication layer, role model, audit-log subsystem, or persistence layer were found.

Two critical security gaps are present if this dashboard handles real financial records:

1. Sensitive financial records are accessible without authentication or authorization.
2. Sensitive financial records are stored in plaintext source-controlled JSON without application-level encryption or secret-managed key handling.

The dependency audit also found high-severity advisories in the installed `next@16.2.4` package. A non-major upgrade to `next@16.2.6` is available according to `npm audit`.

## Risk summary

| Risk level | Count | Findings |
| --- | ---: | --- |
| Critical | 2 | Public unauthenticated data exposure; plaintext source-controlled sensitive financial data |
| High | 3 | Vulnerable Next.js dependency; no audit log trail; no financial compliance control baseline |
| Medium | 3 | Missing security headers/CSP; ungoverned Sentry session replay for financial UI; no rate limiting or abuse controls if APIs are added |
| Low | 2 | No hardcoded secrets found; no unsafe HTML sinks found |

## Critical security gaps

### CRIT-01: Public unauthenticated access to financial dashboard data

**Risk level:** Critical  
**Affected areas:** `app/page.tsx`, `lib/data.ts`, `data/finance.json`, all dashboard routes  
**Requirement areas:** Access control restrictions and user permissions; compliance with financial data handling standards

**Evidence**

- `app/page.tsx` calls `getFinanceData()` and renders balances, transactions, budgets, pots, and recurring bills.
- `lib/data.ts` imports `@/data/finance.json` directly and returns it without a user, tenant, role, session, or policy check.
- No `app/**/route.ts` files, `proxy.ts`, or `middleware.ts` files were found.
- Repository search found no authentication/session/role/permission enforcement code or auth dependency in `package.json`.

**Impact**

Any visitor who can reach the deployed app can view balances, income, expenses, transaction counterparties, categories, recurring bills, and budget data. If the data represents a real person or customer, this is a direct financial privacy breach and likely violates basic least-privilege and customer-data protection requirements.

**Recommendations**

1. Add an authentication provider and protect all finance routes before rendering data.
2. Introduce authorization checks for user ownership and role-based access before returning or displaying financial records.
3. Deny access by default for all dashboard routes; explicitly allow only authenticated users with a valid finance-data entitlement.
4. Add tests that verify unauthenticated requests are redirected or rejected and that users cannot access another user's records.
5. Do not deploy real financial records until this control is in place.

### CRIT-02: Plaintext sensitive financial records in source-controlled JSON

**Risk level:** Critical  
**Affected areas:** `data/finance.json`, `lib/data.ts`  
**Requirement areas:** Data encryption status for sensitive financial records; compliance with financial data handling standards

**Evidence**

- `data/finance.json` stores balances, income, expenses, savings goals, transaction names, categories, dates, amounts, rent, utilities, and other recurring bill information in plaintext.
- The JSON file is imported directly by application code and is part of the repository working tree.
- No encryption, decryption, key management, envelope encryption, KMS integration, or database-level encryption boundary was found.

**Impact**

Anyone with repository access, build artifact access, or deployed-page access can read the records. Plaintext storage also makes accidental leakage through logs, screenshots, browser rendering, and telemetry more likely. If real data is used, this fails expected financial-data confidentiality controls.

**Recommendations**

1. Keep real financial records out of source control.
2. Move sensitive records to a managed data store with encryption at rest, access-controlled service credentials, and audited access.
3. Use field-level encryption or tokenization for sensitive identifiers and any high-risk personal financial data.
4. Manage encryption keys through a dedicated secret/KMS provider with rotation and access logging.
5. Replace committed sample data with synthetic fixtures that cannot identify real users.

## Detailed findings

### HIGH-01: Installed Next.js version has high-severity advisories

**Risk level:** High  
**Affected areas:** `package.json`, `package-lock.json`, `node_modules/next`  
**Requirement areas:** API security and authentication mechanisms; compliance/security maintenance

**Evidence**

`npm audit --json` reported:

- `next` severity: high
- Affected installed version: `next@16.2.4`
- Fix available: `next@16.2.6`
- High-severity advisories include denial of service, SSRF, and middleware/proxy bypass issues:
  - GHSA-8h8q-6873-q5fj
  - GHSA-26hh-7cqf-hhc6
  - GHSA-mg66-mrh9-m8jx
  - GHSA-c4j6-fc7j-m34r
  - GHSA-492v-c6pp-mqqv
  - GHSA-267c-6grr-h53f
  - GHSA-36qx-fr4f-26g5
- Transitive `postcss` advisory is also reported through `next`.

**Impact**

Some advisories are conditional on features this app does not currently use, such as proxy/middleware or WebSocket upgrades. However, the installed framework version remains vulnerable and may become exploitable as the app evolves or if framework internals are reachable through default behavior.

**Recommendations**

1. Upgrade `next` and `eslint-config-next` from `16.2.4` to at least `16.2.6`.
2. Re-run `npm audit`, `npm run lint`, `npm test`, and `npm run build` after the upgrade.
3. Add dependency-audit automation to fail builds on high or critical production vulnerabilities.

### HIGH-02: No audit-log completeness or integrity control

**Risk level:** High  
**Affected areas:** Application-wide  
**Requirement areas:** Audit log completeness and integrity; compliance with financial data handling standards

**Evidence**

- No audit-log writer, event schema, append-only storage, log signing, retention policy, or log review mechanism was found.
- Sentry is configured for error telemetry in `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts`, and `instrumentation.ts`, but Sentry events are not a complete financial access audit trail.
- No code records user identity, data-access events, authorization decisions, exports, administrative changes, or failed access attempts.

**Impact**

The application cannot prove who accessed financial records, when access occurred, whether access was authorized, or whether records were changed. This creates detection, forensics, non-repudiation, and compliance gaps.

**Recommendations**

1. Define an audit event schema covering login, logout, data read, data export, data write, permission change, and failed authorization events.
2. Include actor ID, tenant/user ownership, action, target record type, timestamp, request ID, source IP or trusted proxy metadata, outcome, and reason.
3. Store audit logs in append-only or tamper-evident storage with retention and restricted access.
4. Add integrity controls such as hash chaining, signed batches, or write-once storage for high-risk events.
5. Monitor audit gaps and alert on suspicious access patterns.

### HIGH-03: No documented financial data compliance baseline

**Risk level:** High  
**Affected areas:** Application-wide, README/process documentation  
**Requirement areas:** Compliance with financial data handling standards

**Evidence**

- No data classification policy, retention policy, privacy notice, access review process, data subject handling, or incident-response runbook was found in the repository.
- No controls were found for least privilege, encryption key management, audit retention, secure SDLC gates, or periodic access reviews.
- The app currently uses mock data according to `README.md`, but the implementation would not be safe if the same pattern were used for production financial records.

**Impact**

Without a control baseline, teams may accidentally treat source-controlled fixture patterns as acceptable for production financial data. This can create gaps against GLBA Safeguards-style expectations, SOC 2 security criteria, privacy laws that apply to personal data, and internal financial-data handling standards. PCI DSS is not directly triggered by the current data shape because no payment card numbers or cardholder authentication data were found, but that would change if card data is introduced.

**Recommendations**

1. Document approved data classes for this app: synthetic fixture, personal financial data, regulated financial data, and prohibited data.
2. Define minimum controls for each class, including auth, encryption, retention, telemetry restrictions, access reviews, and incident handling.
3. Add a security checklist to pull requests before real financial data or new API endpoints are added.
4. Prohibit committing production or customer financial data to the repository.

### MED-01: Missing baseline HTTP security headers

**Risk level:** Medium  
**Affected areas:** `next.config.ts`  
**Requirement areas:** API security and authentication mechanisms; compliance/security hardening

**Evidence**

- `next.config.ts` wraps an empty `nextConfig` object with Sentry configuration.
- Repository search found no `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, or `X-Content-Type-Options` headers.
- Next.js 16 docs confirm custom headers can be configured with the `headers` key in `next.config`.

**Impact**

Missing browser security headers increases exposure to clickjacking, content injection blast radius, MIME sniffing, overly broad referrer leakage, and unneeded browser features. This is especially relevant for pages displaying financial records.

**Recommendations**

1. Add a strict Content Security Policy and adjust for required Next.js/Sentry assets.
2. Add `Strict-Transport-Security` at the hosting edge after HTTPS is confirmed for all environments.
3. Add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`.
4. Use `frame-ancestors 'none'` in CSP or `X-Frame-Options: DENY` to reduce clickjacking risk.
5. Add a verification step that checks response headers in production or preview deployments.

### MED-02: Sentry session replay needs explicit financial-data privacy controls

**Risk level:** Medium  
**Affected areas:** `instrumentation-client.ts`, Sentry project configuration  
**Requirement areas:** Data encryption status; audit/compliance; third-party data sharing

**Evidence**

- `instrumentation-client.ts` enables `Sentry.replayIntegration()` with `replaysSessionSampleRate: 0.1` and `replaysOnErrorSampleRate: 1.0`.
- The dashboard renders financial amounts and transaction names in the browser.
- No explicit masking, blocking, allowlist, or data-scrubbing configuration was found in code for financial UI elements.

**Impact**

Session replay can become a third-party copy of sensitive UI state if default or project-level privacy settings are changed, misunderstood, or insufficient for future UI additions. Error-triggered replay at 100% can capture user flows around failures.

**Recommendations**

1. Explicitly configure replay privacy options in code and in the Sentry project to mask financial text and block sensitive containers.
2. Disable replay for pages containing real financial records unless a documented privacy review approves it.
3. Add `data-sentry-mask` or equivalent controls to financial amount, transaction, and customer-name regions if replay remains enabled.
4. Review Sentry retention, access controls, data processing terms, and scrubber rules before production use.

### MED-03: No API abuse controls are present for future API expansion

**Risk level:** Medium  
**Affected areas:** Future `app/**/route.ts` endpoints, current architecture  
**Requirement areas:** API security and authentication mechanisms

**Evidence**

- No API route handlers are present today.
- No rate limiting, CSRF strategy, CORS policy, request validation layer, or authorization middleware/proxy was found.

**Impact**

Current API attack surface is limited because no application API endpoints exist. If finance APIs are added without a shared security layer, they may expose sensitive records to enumeration, cross-user access, request forgery, or abuse.

**Recommendations**

1. Create a shared API security pattern before adding endpoints.
2. Require authentication, authorization, schema validation, structured error handling, rate limiting, and audit logging for every finance API.
3. Keep CORS closed by default and allow only explicit trusted origins if cross-origin access is needed.
4. Add endpoint tests for unauthenticated, unauthorized, malformed, and cross-tenant requests.

## Positive observations

- No hardcoded secrets, private keys, passwords, or API keys were found in the repository search. Sentry tokens and DSNs are read from environment variables.
- `.env*` files and `*.pem` files are ignored in `.gitignore`.
- No `dangerouslySetInnerHTML`, `eval`, `new Function`, `innerHTML`, or similar unsafe DOM sinks were found.
- There are no API route handlers today, which limits server-side API exposure in the current MVP.
- Sentry server config only includes local variables during development via `includeLocalVariables: process.env.NODE_ENV === "development"`.

## Control checklist

| Control area | Status | Notes |
| --- | --- | --- |
| Sensitive data encryption at rest | Fail | Financial JSON is plaintext in source control. |
| Sensitive data encryption in transit | Partial/Unknown | Next/Vercel deployments normally use HTTPS, but no repository-level enforcement or HSTS config was found. |
| Field-level encryption/tokenization | Fail | No encryption boundary exists. |
| Authentication | Fail | No auth provider, session, or route protection found. |
| Authorization/user permissions | Fail | No roles, ownership checks, tenant checks, or permissions model found. |
| Audit log completeness | Fail | No financial access audit trail exists. |
| Audit log integrity | Fail | No append-only, tamper-evident, signed, or retained audit store exists. |
| API authentication | Not applicable/At risk | No APIs exist today; no shared controls exist for future APIs. |
| Dependency vulnerability management | Fail | `npm audit` reports high-severity Next.js advisories with a fix available. |
| Browser security headers | Fail | No CSP/HSTS/frame/referrer/permissions/nosniff headers found. |
| Secret handling | Pass | No hardcoded secrets found; env files ignored. |
| XSS sink review | Pass | No unsafe HTML/eval sinks found in app code. |

## Recommended remediation order

1. **Block production use with real financial data until CRIT-01 and CRIT-02 are remediated.**
2. Add authentication and route protection for all dashboard pages.
3. Move real financial records out of source control into an encrypted, access-controlled data store.
4. Add authorization checks based on user ownership, role, and least privilege.
5. Implement tamper-evident audit logging for all financial data access and authorization outcomes.
6. Upgrade Next.js to a patched version and add automated dependency-audit enforcement.
7. Add baseline security headers and verify them in deployed environments.
8. Review and explicitly harden Sentry replay/privacy settings for financial UI data.
9. Document financial data classes, retention requirements, allowed telemetry, and incident-response procedures.

## Verification performed

Commands and searches run during this audit:

- `npm audit --json`
- `git status --short`
- Repository file discovery for `app/**/route.ts`, `middleware.ts`, and `proxy.ts`
- Repository searches for auth/session/permission code, secrets, unsafe DOM sinks, security headers, crypto/encryption, logging, and audit terms
- Manual review of:
  - `package.json`
  - `next.config.ts`
  - `README.md`
  - `app/page.tsx`
  - `app/layout.tsx`
  - `lib/data.ts`
  - `lib/types.ts`
  - `data/finance.json`
  - Sentry config files
  - dashboard and shell components

## Residual risk and assumptions

- The report assumes the displayed financial data should be treated as sensitive. If all data remains permanently synthetic and non-identifying, CRIT-01 and CRIT-02 reduce materially in business impact, but the current implementation is still not an acceptable pattern for real financial records.
- Hosting configuration, Vercel project settings, organization access controls, Sentry project settings, CI configuration, and repository permissions were not independently verified from external consoles.
- No dynamic penetration test was performed because the requested audit could be completed from repository review and dependency analysis.
