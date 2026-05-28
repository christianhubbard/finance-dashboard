---
name: sentry-to-jira
description: "Create FIN Jira bugs from Sentry automation triggers. ALWAYS load when automation_trigger_info includes sentry_* fields, or when asked to file Sentry errors in Jira. Requires Atlassian MCP (OAuth). Also load jira-fin-board."
---

# Sentry → Jira (FIN)

## Prerequisites

1. **Atlassian MCP** must be authenticated (`mcp_get_tools` for server `Atlassian` must not show `needsAuth`).
2. If `needsAuth`, stop and tell the automation owner to connect Jira in **Cursor → Settings → MCP → Atlassian** (OAuth), then re-run the automation.
3. Load **jira-fin-board** — all issues use project key `FIN`.

## When this runs

Cursor Automations pass Sentry context in `automation_trigger_info`, for example:

- `sentry_short_id` — e.g. `FINANCE-DASHBOARD-J`
- `sentry_title` — error title
- `sentry_issue_url` — link to the issue
- `sentry_issue_id`, `sentry_project_slug`, `sentry_status`, `sentry_action` (`created`, etc.)

Only create a Jira issue when `sentry_action` is `created` (or when the user explicitly asks). For other actions, comment on an existing linked ticket if one exists.

## Workflow

### 1. Resolve cloud ID

Call `getAccessibleAtlassianResources` (or equivalent Atlassian MCP tool) and use the `cloudId` for the user's site.

### 2. Check for duplicates

Search FIN before creating:

```jql
project = FIN AND type = Bug AND (summary ~ "SENTRY_SHORT_ID" OR description ~ "SENTRY_ISSUE_ID") ORDER BY created DESC
```

Also search by error keywords from `sentry_title` (error type + main message fragment).

- **Duplicate found:** add a comment to the existing FIN issue with the new Sentry link and timestamp; do not create another ticket.
- **No duplicate:** create a new Bug.

### 3. Create the Bug

```
createJiraIssue(
  cloudId = "<from step 1>",
  projectKey = "FIN",
  issueTypeName = "Bug",
  summary = "[SENTRY_SHORT_ID] TITLE",
  description = "<see template below>"
)
```

**Summary pattern:** `[FINANCE-DASHBOARD-X] ReferenceError: useEffect is not defined`

**Description template:**

```markdown
## Sentry issue

| Field | Value |
|-------|-------|
| Short ID | {sentry_short_id} |
| Title | {sentry_title} |
| Issue ID | {sentry_issue_id} |
| Project | {sentry_project_slug} |
| Status | {sentry_status} |
| Link | {sentry_issue_url} |

## Error

{Paste sentry_title and any stack trace from Sentry if available}

## Context

- **Application:** finance-dashboard (Next.js)
- **Source:** Sentry automation (`sentry_action`: {sentry_action})

---
*Created via Sentry → Jira automation*
```

### 4. Confirm

Report the new **FIN-###** key and Jira browse URL. If duplicate, report the existing key and that a comment was added.

## Do not

- Use any project other than `FIN` for this repo.
- Skip duplicate search.
- Block on fixing the underlying bug unless the automation prompt also asks for a code fix.
