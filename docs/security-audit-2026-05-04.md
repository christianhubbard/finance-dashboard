# Weekly Security Audit - Finance Dashboard

Date: 2026-05-04
Branch: `cursor/finance-dashboard-security-audit-8c9b`
Scope: Next.js finance dashboard source, static financial dataset, routing surface, dependency manifest, and security-relevant repository configuration.

## Executive summary

The current application is a self-contained finance dashboard MVP that renders mock financial records from `data/finance.json`. There are no API routes, middleware, backend services, database connections, authentication providers, authorization checks, or audit logging controls in this repository.

For a demo that only ships synthetic data, the primary risk is low operational security maturity rather than immediate customer-data exposure. For any deployment containing real customer or account data, the same architecture would create critical security gaps because financial records are bundled into the public application and are accessible without identity, authorization, encryption controls, or audit trails.

Critical gaps flagged:

1. Public client-deliverable financial data with no record-level protection if `data/finance.json` ever contains real records.
2. No access control or user permission model for finance views.
3. No audit logging for financial data access or administrative activity.

## Methodology

- Reviewed data loading path:
  - `lib/data.ts` imports `@/data/finance.json` and returns it directly.
  - `app/page.tsx` renders balances, pots, transactions, budgets, and recurring bills from that static object.
- Reviewed data schema:
  - `lib/types.ts` models balances, transactions, recurring bills, budgets, and savings pots.
- Reviewed static dataset:
  - `data/finance.json` contains names, transaction categories, transaction dates, amounts, balances, budgets, and recurring bill details.
- Reviewed routing and server surface:
  - Searched for `route.ts`, `middleware.ts`, `proxy.ts`, API handlers, cookie/session usage, authorization headers, and `NextResponse`.
  - No API, middleware, proxy, auth, or session handlers were found.
- Reviewed dependency manifest:
  - `package.json` pins `next` and `eslint-config-next` to `16.2.4`, with React `19.2.4` and lucide-react `^1.14.0`.
  - A live `npm audit --json` check could not run because `npm` was not available on the execution PATH in this audit environment.

## Findings

| ID | Area | Risk | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- | --- |
| SEC-001 | Data encryption and exposure | Critical if real data; Low for mock-only data | Financial records are stored in static JSON and imported into the app bundle without application-layer encryption, secrets isolation, or server-only access boundaries. | `data/finance.json` contains names, balances, transaction amounts, and recurring bill data. `lib/data.ts` imports the JSON directly. | Keep this dataset synthetic. Before using real financial records, move data to a server-side data store with encryption at rest, strict key management, TLS-only transport, and server-only access paths. Do not import real financial records into client-deliverable code. |
| SEC-002 | Access control and permissions | Critical if real data; Medium for production-readiness | No authentication, session management, role checks, or per-user data scoping exists. Any visitor can access the dashboard routes. | No auth/session/cookie/authorization code found. Sidebar links expose finance sections without guards. | Add an identity provider, protected routes, server-side authorization checks, least-privilege roles, and per-user/tenant data filtering before handling real accounts. |
| SEC-003 | Audit log completeness and integrity | High | No audit logging exists for financial record reads, exports, route access, authentication events, permission changes, or administrative actions. | No audit/logging module, append-only store, API middleware, or event sink found. | Implement append-only, tamper-evident audit logs for sensitive reads and writes. Include actor, action, resource, timestamp, request metadata, outcome, and correlation ID. Protect logs from modification and set retention aligned to policy. |
| SEC-004 | API security and authentication | Medium | The app currently has no API surface, which limits API attack exposure, but it also means there are no reusable API security controls ready for future data access. | No `app/**/route.ts`, middleware, proxy, or server actions found. | If APIs are added, require authentication, authorization, input validation, rate limiting, CSRF protections where cookie-authenticated mutations exist, safe error handling, and structured audit events. |
| SEC-005 | Financial data handling compliance | High if real data | The repository has no documented financial data classification, retention, masking, consent, privacy, incident response, or compliance controls. | README documents mock data only and does not define data handling requirements. | Document data classification and handling standards before production use. Map controls to applicable obligations such as GLBA Safeguards Rule, PCI DSS if cardholder data is introduced, SOC 2 security controls, privacy laws, and internal retention/deletion policies. |
| SEC-006 | Security headers and browser hardening | Medium | No explicit Next.js security headers are configured. The default config does not define CSP, frame protections, referrer policy, permissions policy, or HSTS. | `next.config.ts` is empty aside from the default config object. | Add security headers appropriate for deployment: Content-Security-Policy, `X-Frame-Options` or CSP `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, and HSTS on HTTPS production domains. |
| SEC-007 | Dependency vulnerability verification | Medium | Dependency versions are declared and locked, but the automated vulnerability audit could not be completed in this environment because Node/npm was unavailable on PATH. | `npm audit --json` failed with `npm: command not found`. | Ensure CI runs `npm ci`, `npm audit --audit-level=high`, lint, and build on every pull request. Fix the agent/runtime Node setup so weekly audits include vulnerability database results. |
| SEC-008 | Supply chain integrity | Low | `package-lock.json` is present and includes registry integrity metadata, which is good. There is no visible dependency-review or lockfile integrity enforcement in this repository. | `package-lock.json` exists and dependencies are minimal. | Keep the lockfile committed, use `npm ci` in CI, enable dependency review/Dependabot or equivalent, and require review for lockfile changes. |

## Control assessment by requested category

### 1. Data encryption status for sensitive financial records

Current status:

- No encryption is implemented at the application layer.
- No database or object storage encryption configuration exists because there is no external storage.
- Static records are stored as plaintext JSON in the repository.
- When built, imported JSON can be included in server/client artifacts depending on component boundaries and bundling behavior.

Risk level:

- Low if records remain synthetic mock data.
- Critical if records are real customer financial data.

Required remediation before real data:

- Store financial records in a managed datastore with encryption at rest.
- Use TLS-only transport.
- Keep records server-side and fetch them only after successful authorization.
- Use field-level encryption or tokenization for high-sensitivity fields where appropriate.
- Restrict production access to encryption keys through managed KMS/IAM policies.
- Prevent real financial datasets from being committed to Git.

### 2. Access control restrictions and user permissions

Current status:

- No login or identity provider exists.
- No route guards exist.
- No role-based access control exists.
- No per-user or per-tenant filtering exists.

Risk level:

- Critical for real financial data.

Required remediation:

- Add authentication for every finance route.
- Gate access in a server-side boundary before data retrieval.
- Model permissions explicitly, for example `viewer`, `account_owner`, `support_readonly`, and `admin`.
- Verify object ownership on every sensitive record access.
- Add tests or automated checks for unauthorized access paths when auth is introduced.

### 3. Audit log completeness and integrity

Current status:

- No audit trail exists.
- No immutable event store exists.
- No integrity checks or retention policy exist.

Risk level:

- High.

Required remediation:

- Emit audit events for sign-in, sign-out, failed auth, sensitive data reads, exports, permission changes, and admin actions.
- Use append-only storage with write-once or tamper-evident controls.
- Include actor ID, resource ID, action, timestamp, IP/user agent or request context, success/failure, and correlation ID.
- Monitor audit stream failures as security-relevant incidents.
- Define retention and legal hold requirements.

### 4. API security and authentication mechanisms

Current status:

- No API endpoints are present.
- No authentication or authorization mechanism is present.
- No rate limiting, CSRF protection, request validation, or error-handling policy exists for future APIs.

Risk level:

- Medium now due to missing readiness controls.
- High or Critical if APIs are added around real financial records without the controls above.

Required remediation:

- Require authenticated server-side APIs for real data.
- Validate request input with typed schemas.
- Enforce rate limits and abuse controls.
- Use CSRF protection for cookie-authenticated state-changing requests.
- Return minimal error details.
- Log every sensitive API access to the audit trail.

### 5. Compliance with financial data handling standards

Current status:

- No compliance control mapping is documented.
- No data classification is documented.
- No privacy, retention, deletion, incident response, or access review process is documented in the repository.

Risk level:

- High if the application is intended for production finance workflows.

Required remediation:

- Classify all data fields by sensitivity.
- Define retention and deletion rules.
- Document encryption, access review, incident response, backup, and audit requirements.
- Map obligations to applicable standards before real data is introduced:
  - GLBA Safeguards Rule for covered financial institutions.
  - PCI DSS if payment cardholder data is added.
  - SOC 2 security controls if customer trust reporting is needed.
  - Applicable privacy laws for personal data.
- Add security acceptance criteria to future finance-data features.

## Positive observations

- The project is small and has a minimal dependency surface.
- No secrets or environment files were found in the reviewed source.
- No API endpoints were found, reducing current remote attack surface.
- The app appears intentionally designed around mock data, and README explicitly describes `data/finance.json` as mock data.
- TypeScript types define the shape of finance records, which can support future validation work.

## Recommended remediation roadmap

1. Immediate guardrail: add a repository policy note that `data/finance.json` must remain mock-only and must never contain real customer financial records.
2. Add production security headers in `next.config.ts`.
3. Restore/fix Node/npm availability in CI and automation, then require dependency audit, lint, and build checks.
4. If real user data is planned, design the server-side data access layer before adding features:
   - authenticated identity,
   - authorization and tenant scoping,
   - encrypted datastore,
   - audit logging,
   - request validation,
   - monitoring and alerting.
5. Create compliance documentation covering classification, retention, deletion, access review, incident response, and third-party/vendor controls.

## Critical security gap register

| Gap | Criticality | Trigger condition | Required blocker before production |
| --- | --- | --- | --- |
| Static plaintext finance records in repository/application bundle | Critical | Any real customer, bank, account, transaction, or billing data is added to `data/finance.json` | Move real records to encrypted server-side storage and prevent bundle exposure. |
| No authentication or authorization | Critical | Any non-public finance data is displayed | Require authenticated, authorized access for all finance routes and data reads. |
| No audit log | Critical for regulated workflows | Any regulated financial workflow or customer-data access goes live | Implement tamper-evident audit logging and retention before launch. |

## Verification notes

- Source review completed.
- Route/API search completed; no API route files found.
- `npm audit --json` attempted but could not run because `npm` was unavailable on PATH.
- Lint/build were not executed for the same Node/npm environment reason.

