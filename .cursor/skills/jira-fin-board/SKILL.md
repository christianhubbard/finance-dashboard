---
name: jira-fin-board
description: "FIN/finance-dashboard Jira defaults — ALWAYS load this skill when working in this repo and the user mentions Jira at all (board, backlog, sprint, epic, story, ticket, issue key, FIN board, FIN project, create/query/triage/comment on issues). Unless they name another project explicitly, every Jira board/project reference means project key FIN only — never infer a different board or ask which project. Applies to Atlassian MCP and skills (triage-issue, spec-to-backlog, capture-tasks-from-meeting-notes, generate-status-report, search-company-knowledge): force FIN and project = FIN in JQL."
---

# Jira conventions for finance-dashboard

## The only board to use

This codebase always uses the **FIN** Jira board (project key `FIN`) in the user's connected Jira account. Never create, search, or move issues on any other board from this repo.

## Rules

1. When creating any Jira issue (bug, task, story, epic, sub-task), set the project key to `FIN`. Do not prompt the user to choose a board — it's always FIN.
2. When searching Jira (JQL or MCP search tools), scope queries to `project = FIN` unless the user explicitly asks otherwise.
3. When other Atlassian skills (e.g. `triage-issue`, `spec-to-backlog`) ask which project to target, answer `FIN` automatically without re-asking the user.
4. If a user references an issue key without a prefix (e.g. "ticket 123"), assume `FIN-123`.
5. If the user explicitly names a different project, follow their instruction for that turn but do not change the default for subsequent turns.

## Quick reference

| Action | Default |
|--------|---------|
| Project key | `FIN` |
| JQL scope | `project = FIN` |
| Issue key prefix | `FIN-` |

## Example MCP calls

Creating an issue:

```json
{ "projectKey": "FIN", "issueType": "Task", "summary": "..." }
```

Searching:

```jql
project = FIN AND status != Done ORDER BY updated DESC
```
