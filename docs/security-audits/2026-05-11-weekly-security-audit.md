# Weekly Security Audit Report - Finance Dashboard

Audit date: 2026-05-11  
Repository branch: `cursor/finance-dashboard-security-audit-9860`  
Scope: Next.js finance dashboard source, static data, security-relevant configuration, dependency audit output, and local git state.

## Executive summary

The finance dashboard is currently a self-contained static demo application. It has no database, API routes, route handlers, server actions, middleware, authentication provider, authorization policy, or application-level audit log. The only financial records observed are static mock records committed in `data/finance.json` and imported by server-rendered page code.

No evidence was found that live customer data is present in this repository. However, if this architecture were used for real financial records, the following would be critical security gaps:

1. Public access to financial dashboard content with no authentication or authorization boundary.
2. Sensitive financial records stored in cleartext source-controlled JSON.
3. No tamper-evident audit trail for access, export, changes, or administrative actions.

Dependency review found one moderate advisory reported by `npm audit`: PostCSS XSS via `next@16.2.4` / `@sentry/nextjs`. There is no safe automatic fix from `npm audit` because the suggested forced remediation would downgrade Next.js to an obsolete major version.

## Audit coverage

Reviewed:

- Application routes and rendering path: `app/page.tsx`, placeholder route pages, `app/layout.tsx`
- Data layer and schemas: `lib/data.ts`, `lib/types.ts`, `data/finance.json`
- Client persistence: `components/shell/Sidebar.tsx`
- Sentry/error telemetry: `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `app/global-error.tsx`
- Next.js/Sentry build configuration: `next.config.ts`
- Dependency manifests: `package.json`, `package-lock.json`
- Repository search for API routes, middleware, server actions, auth, cookies, sessions, and local storage

Commands run:

- `npm audit --audit-level=moderate`
- `git status --short`
- `git diff --stat -- package-lock.json`
- Targeted source searches and file review

## Findings

### F-001: No authentication or authorization boundary for financial dashboard pages

Risk level: Critical for production financial data; Medium for the current mock-only demo.

Evidence:

- `app/page.tsx` renders balances, pots, transactions, budgets, and recurring bill data directly from `getFinanceData()` with no user/session checks.
- Search found no `middleware.ts`, route protection, session handling, cookies, or auth provider integration.
- Sidebar navigation exposes finance-related routes such as `/transactions`, `/budgets`, `/pots`, and `/recurring-bills`.

Impact:

- Any user who can reach the deployed app can view rendered financial overview data.
- There is no per-user isolation, role-based access control, account ownership check, or administrative permission model.
- This does not meet normal financial dashboard expectations for confidentiality or least privilege.

Recommendation:

- Add an authentication provider before using real financial data.
- Protect all finance routes by default and explicitly define public routes.
- Add role/account ownership checks in the data access layer before returning balances, transactions, budgets, or recurring bill records.
- Add automated tests for unauthenticated access, unauthorized account access, and authorized account access.

### F-002: Financial records are stored in cleartext static JSON in source control

Risk level: Critical if records are real or customer-derived; Low for sanitized mock fixture data.

Evidence:

- `lib/data.ts` imports `@/data/finance.json` and returns it as `FinanceData`.
- `data/finance.json` contains balances, income, expenses, transaction counterparties, categories, dates, amounts, budget limits, and recurring bill data.
- No database, encrypted storage layer, key management, or field-level encryption controls are present.

Impact:

- Real financial data committed to git would be copied into repository history, developer machines, CI artifacts, deployments, and backups.
- Source control access would become data access.
- Deleting the current file later would not remove historical exposure from git history.

Recommendation:

- Keep `data/finance.json` limited to synthetic demo data only.
- If real data is needed, move it to an encrypted managed data store with access controls, backup encryption, and least-privilege service credentials.
- Classify sensitive fields and document retention/deletion requirements.
- Add a pre-commit or CI secret/data scanning step to prevent account numbers, customer identifiers, and real transaction exports from entering the repository.

### F-003: No application-level audit trail

Risk level: High.

Evidence:

- Sentry is configured for errors/tracing/replay, but there is no domain audit log for page views, data reads, exports, permission changes, user actions, or administrative events.
- No API routes, server actions, database triggers, append-only event store, or log integrity mechanism were found.

Impact:

- Security investigations cannot answer who viewed which financial records and when.
- Unauthorized access or misuse would be difficult to detect or reconstruct.
- Auditability expectations for financial systems, internal controls, and incident response are not met.

Recommendation:

- Define audit events for login/logout, finance record reads, data exports, permission changes, failed access attempts, and administrative actions.
- Store audit logs in an append-only or tamper-evident location separate from application runtime logs.
- Include actor, subject/account, action, timestamp, request metadata, outcome, and correlation ID.
- Set retention and access policies aligned to the applicable compliance program.

### F-004: No explicit security headers or Content Security Policy in repo configuration

Risk level: Medium.

Evidence:

- `next.config.ts` only wraps the app with Sentry configuration and does not define `headers()`.
- No repo-level Content-Security-Policy, Strict-Transport-Security, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy, or X-Content-Type-Options configuration was found.

Impact:

- The application depends on hosting defaults for browser hardening.
- Missing CSP/frame protections increase blast radius for XSS, clickjacking, data exfiltration, and third-party script misuse.
- HSTS is not enforced from repository-managed configuration.

Recommendation:

- Add explicit security headers appropriate for the deployment target.
- Start with a restrictive CSP and allow only required Next.js, font, image, and Sentry endpoints.
- Enforce HSTS on HTTPS production deployments.
- Validate headers in CI or deployment smoke checks.

### F-005: Sentry Session Replay can capture financial UI context

Risk level: Medium.

Evidence:

- `instrumentation-client.ts` enables `Sentry.replayIntegration()`.
- Replay sampling is enabled with `replaysSessionSampleRate: 0.1` and `replaysOnErrorSampleRate: 1.0`.
- `app/global-error.tsx` captures global client exceptions.

Impact:

- Session Replay may capture user interactions and screen context from a finance UI.
- Even if current data is mock-only, enabling replay on a future real-data deployment without masking policy review could expose sensitive financial information to telemetry systems.

Recommendation:

- Confirm Sentry replay masking, blocking, retention, and access controls before handling real financial data.
- Disable replay for pages containing sensitive financial records unless there is a documented need and approved masking policy.
- Restrict Sentry project access and review whether replay data falls under financial data retention requirements.

### F-006: Dependency audit reports a moderate PostCSS advisory through Next.js

Risk level: Medium.

Evidence:

- `npm audit --audit-level=moderate` reports:
  - `postcss <8.5.10`
  - Advisory: GHSA-qx2v-qp2m-jg93, XSS via unescaped `</style>` in CSS stringify output
  - Dependency path: `next -> postcss`, also through `@sentry/nextjs`
- Installed direct versions include `next@16.2.4`, `react@19.2.4`, and `@sentry/nextjs@^10.51.0`.
- `npm audit fix --force` suggests installing `next@9.3.3`, which is a breaking and unsafe downgrade for this app.

Impact:

- The vulnerable package is transitive through Next.js.
- The practical exploitability depends on whether untrusted CSS is parsed/stringified by vulnerable code paths.
- Leaving moderate advisories unresolved increases supply-chain risk and may violate dependency hygiene policies.

Recommendation:

- Do not run `npm audit fix --force` for this advisory because it suggests an obsolete Next.js downgrade.
- Track the upstream Next.js release that includes a patched PostCSS dependency, then upgrade Next.js and `eslint-config-next` together.
- Re-run `npm audit` after the upgrade and document whether any residual advisory is not exploitable in this app.
- Consider a temporary package-manager override only after confirming compatibility with Next.js 16.

### F-007: Existing package-lock.json working tree changes should be reviewed before merge

Risk level: Low.

Evidence:

- `git status --short` showed `M package-lock.json` before this audit report was created.
- The diff removes multiple optional package `libc` metadata entries and contains no package version updates.

Impact:

- Lockfile-only metadata churn can make supply-chain review noisy.
- If unintended, it may reduce reproducibility signals for optional native packages across glibc and musl environments.

Recommendation:

- Confirm whether the lockfile change was intentionally generated by the package manager version used in CI.
- If not intentional, revert or regenerate the lockfile in the standard Node/npm environment for the project.

## Requested control assessment

### Data encryption status for sensitive financial records

Status: Not production-ready.

- No live data store or encryption-at-rest configuration exists in this repo.
- Static finance data is cleartext JSON.
- Transport encryption is deployment-dependent; no repo-managed HSTS policy was found.

Required remediation before real data:

- Use an encrypted database or storage service.
- Keep encryption keys outside the application repository.
- Enforce HTTPS/HSTS for production.
- Prevent real financial exports from being committed to git.

### Access control restrictions and user permissions

Status: Missing.

- No login, session, route protection, user roles, account permissions, or ownership checks exist.
- All rendered finance data is available to any visitor who can access the app.

Required remediation before real data:

- Add authentication and route protection.
- Implement account-scoped authorization checks.
- Add tests for denied and allowed access paths.

### Audit log completeness and integrity

Status: Missing.

- Sentry captures errors and traces, but that is not a financial audit trail.
- No append-only or tamper-evident audit log was found.

Required remediation before real data:

- Create a structured audit event model.
- Store logs in a write-restricted, tamper-evident sink.
- Define retention, review, and alerting policies.

### API security and authentication mechanisms

Status: No API surface found; page-level security is still missing.

- No `app/**/route.ts`, server actions, or middleware were found.
- Because there are no APIs, API authentication cannot be evaluated as implemented.
- If APIs are added, they must require authentication, authorization, input validation, rate limiting, and structured audit logging.

Required remediation before real data:

- Treat future API routes as private by default.
- Validate request payloads and enforce object-level authorization.
- Avoid returning complete financial datasets unless explicitly required.

### Compliance with financial data handling standards

Status: Not compliant for production financial data.

This codebase does not currently include the controls normally expected for financial data handling programs such as GLBA-style safeguards, SOC 2 control evidence, PCI DSS scoping controls where cardholder data is involved, or internal financial-data governance. Missing controls include:

- Authenticated and authorized access
- Encryption-at-rest evidence
- Audit logging and retention
- Data classification and retention policy
- Incident response telemetry beyond generic error monitoring
- Dependency vulnerability management workflow
- Browser security headers/CSP
- Evidence of periodic access reviews

## Critical security gaps

The following gaps should block any deployment that contains real customer or sensitive financial data:

1. No authentication or authorization boundary around finance pages.
2. Cleartext financial records in source-controlled JSON if the dataset is real.
3. No complete, tamper-evident audit trail for financial data access and administrative actions.

## Remediation roadmap

Priority 0 - before introducing real data:

- Confirm `data/finance.json` is synthetic and document that it must stay synthetic.
- Add a repository data handling policy for finance fixtures.
- Add secret/data scanning in CI.

Priority 1 - access and data protection:

- Add authentication and route protection.
- Add account-scoped authorization checks.
- Move real records to encrypted managed storage if production data is required.
- Add explicit security headers and a CSP.

Priority 2 - auditability and monitoring:

- Implement structured audit logging for user and admin actions.
- Store logs in a tamper-evident sink with retention controls.
- Review Sentry Replay masking/retention or disable replay for finance pages.

Priority 3 - dependency and operational hygiene:

- Track and apply the Next.js release that resolves the PostCSS advisory.
- Add Dependabot or an equivalent dependency review workflow.
- Add a weekly audit checklist that records dependency audit output, route surface changes, auth changes, and telemetry changes.

## Final risk rating

Current mock/demo deployment: Medium overall risk, primarily due to missing browser hardening headers and a moderate dependency advisory.

Production deployment with real financial records: Critical overall risk until authentication, authorization, encrypted storage, and audit logging are implemented.
