# Microsoft Learn MCP usage

Team-shared guidance for grounding answers about **Microsoft products and platforms** in **official Microsoft Learn** content via MCP.

## Team stance: recommendation, not forced install

Engineering standards **cannot reliably “force”** MCP installation across machines: Cursor MCP configuration is **local or org-managed** (for example `%USERPROFILE%\.cursor\mcp.json` on desktop, or cloud agent MCP settings), and repos should not assume a specific server name or transport.

**Standard:**

- **Strong recommendation**: every developer who routinely answers Microsoft-platform questions should enable the Microsoft Learn MCP when their environment allows it.
- **Always-on agent rule**: the shared Cursor rule `mcp-microsoft-learn.mdc` requires agents to **use Learn results when the MCP is present** and to **say when it is missing**.

That split keeps standards honest (no false “compliance” with an uninstallable requirement) while still making official docs the default when tooling exists.

## Principles

- **Search for breadth**, **fetch for depth**, **code sample search** for copy-pasteable official examples.
- **Cite Learn**: include page title and URL when you rely on Learn content.
- **Combine sources**: merge Learn with product-repo rules, code, and other MCPs (for example Work IQ for tenant-specific mail) without contradicting official limits or support statements from Learn.

## Tool workflow (typical server)

Exact server id varies by workspace; tools are commonly:

| Tool | Use when |
|------|----------|
| `microsoft_docs_search` | You need quick official hits and URLs |
| `microsoft_code_sample_search` | You need official code samples |
| `microsoft_docs_fetch` | Search is insufficient; you need the full doc page |

Always read each tool’s **schema/descriptor** in the local `mcps/` folder before invoking it.

## Local-only configuration reminder

MCP connectivity is configured outside this repository. Do **not** commit secrets, tokens, or personal `mcp.json` contents into product repos.

## Adoption (product repos)

Optional: add a short pointer in the product repo root `AGENTS.md` so humans know the expectation. Start from [`../../templates/AGENTS.microsoft-learn.snippet.md`](../../templates/AGENTS.microsoft-learn.snippet.md).
