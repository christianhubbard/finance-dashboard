---
name: sentry-to-jira-fin
description: "Create FIN Jira bugs when Sentry issues are created for finance-dashboard. Load on Cursor Automations with Sentry triggers (sentry_issue_id, sentry_short_id, sentry_title) or when asked to file Sentry errors in Jira. Always uses project FIN via jira-fin-board. Requires authenticated Atlassian MCP."
---

# Sentry → Jira (FIN)

## When to run

Run this skill when:

- A **Cursor Automation** passes `triggerContext` with `sentry_issue_id`, `sentry_short_id`, or `sentry_title`, or
- The user asks to create a Jira ticket from a Sentry issue for the finance dashboard.

Always pair with **`jira-fin-board`**: project key **`FIN`**, JQL scope `project = FIN`.

## Prerequisites

1. **Atlassian MCP** connected in Cursor (OAuth or Rovo MCP API token). If `mcp_get_tools` reports `serverStatus: needsAuth`, stop and note that the site admin must complete Atlassian authorization; the agent cannot create issues until MCP is authenticated.
2. Resolve **`cloudId`** once per run with `getAccessibleAtlassianResources` (pick the site that hosts project `FIN`).

## Workflow (automation — do not wait for user confirmation)

Cloud automations have no interactive user. Execute immediately:

### 1. Parse Sentry context

From `triggerContext` (or user message), read:

| Field | Use |
|-------|-----|
| `sentry_short_id` | Label in summary (e.g. `FINANCE-DASHBOARD-J`) |
| `sentry_title` | Error title / summary body |
| `sentry_issue_url` | Link in description |
| `sentry_issue_id` | Optional metadata |
| `sentry_project_slug` | Component context (`finance-dashboard`) |
| `sentry_status` / `sentry_substatus` | Description |
| `sentry_action` | e.g. `created` — only create on `created` unless user says otherwise |

### 2. Duplicate check (FIN only)

Run at least one JQL search via `searchJiraIssuesUsingJql`:

```jql
project = FIN AND (summary ~ "sentry_short_id" OR description ~ "sentry_issue_url") ORDER BY created DESC
```

If a match links the same Sentry URL or short id, **add a comment** with `addCommentToJiraIssue` instead of creating a duplicate.

### 3. Create bug

```
getJiraProjectIssueTypesMetadata(cloudId, projectIdOrKey="FIN")
createJiraIssue(
  cloudId,
  projectKey="FIN",
  issueTypeName="Bug",
  summary="[finance-dashboard] {sentry_title}",
  description="..."
)
```

**Summary pattern:** `[finance-dashboard] {sentry_title}` (prefix helps board scanning).

**Description template:**

```markdown
## Sentry issue

| Field | Value |
|-------|-------|
| Short ID | {sentry_short_id} |
| Issue ID | {sentry_issue_id} |
| Project | {sentry_project_slug} |
| Status | {sentry_status} ({sentry_substatus}) |
| Trigger | {sentry_action} |

**Link:** {sentry_issue_url}

## Error

{sentry_title}

## Notes

Created automatically from Sentry → Jira automation for finance-dashboard.
```

### 4. Report outcome

On success, return the new issue key (e.g. `FIN-42`) and browse URL.

On `needsAuth`, state clearly that **Atlassian MCP must be authenticated** in Cursor (Settings → MCP → Atlassian) for this automation to create tickets.

## Example (current trigger)

- **Sentry:** `FINANCE-DASHBOARD-J` — `ReferenceError: useEffect is not defined`
- **URL:** https://cursor-field-eng.sentry.io/issues/7511862280/
- **Expected FIN summary:** `[finance-dashboard] ReferenceError: useEffect is not defined`
