# Work IQ (Agent365 MCP) usage

This doc captures stable, team-shared guidance for Microsoft Agent365 / Work IQ MCP servers (Mail, Calendar, Teams, OneDrive, SharePoint, Word, etc.).

## Principles

- **Be explicit about the server** you want (mail vs calendar vs teams) when a request could map to multiple.
- **Minimize scope**: use the least-powerful tool that answers the question.
- **Avoid destructive actions** (delete, mass-move, bulk sharing) unless explicitly requested.

## Recommended prompt patterns

- “Use `agent365-mail` to find the thread about …”
- “Use `agent365-calendar` to check my availability next Tuesday …”
- “Use `agent365-teams` to summarize messages in channel …”

## Local-only configuration reminder

MCP connectivity is configured locally (for Cursor Desktop) in `%USERPROFILE%\\.cursor\\mcp.json` and for cloud agents via `cursor.com/agents` MCP settings.
