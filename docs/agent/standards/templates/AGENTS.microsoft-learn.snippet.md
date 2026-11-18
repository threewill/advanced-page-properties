## Agent context (Microsoft Learn MCP)

This repo expects agents to **ground Microsoft product and platform answers in Microsoft Learn** when the **Microsoft Learn MCP** is enabled in the Cursor environment.

### Read this first

- **Team guidance**: `.cursor/rules/docs/mcp/microsoft-learn.md`

### Expectation

- If the MCP is available: use it (search → code samples or full fetch as needed) and **merge** those results with other repo or MCP context.
- If the MCP is not available: say so explicitly; do not imply Learn-backed retrieval ran.

### Configure locally

Enable the Microsoft Learn MCP in your Cursor MCP settings (desktop `mcp.json` or cloud agent MCP configuration). Engineering standards **recommend** this MCP for Microsoft-heavy work; they do not install it automatically from the git repo.
