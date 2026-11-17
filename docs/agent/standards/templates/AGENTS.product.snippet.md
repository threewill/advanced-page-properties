# Product-specific context (this repository)

> In **this public product**, standards are a curated copy under `docs/agent/standards/` (see that folder’s README), not a git submodule. The submodule wording below is the upstream template for private repos.

ThreeWill engineering standards live in the **git submodule** at `.cursor/rules/` ([threewill-engineering-standards](https://github.com/threewill/threewill-engineering-standards)). That submodule is **shared across products**—do not use it for rules that apply only to this app.

Use **this file** (`AGENTS.md` at the repository root) for:

- Domain vocabulary (e.g. inventory, parking, cases vs patients).
- Product-specific integrations, list names, or environment notes.
- Team conventions that are **not** candidates for the global standards repo.
- **Submodule hygiene** (below)—must live here so agents can still act when `.cursor/rules/` is missing.

Keep SPFx / ThreeWill UI baselines in the submodule; keep **what makes this product unique** here.

## Engineering standards submodule (agent hygiene)

If `.cursor/rules/` is missing, empty, or not a submodule: tell the user shared standards are required and offer `git submodule update --init --recursive` (or `git submodule add … .cursor/rules` if never registered). Do not invent local copies of shared rules.

Occasionally (session start for substantive work, after pull, or when asked about standards)—not every trivial turn—check whether the pinned submodule SHA is behind `origin/master` on `threewill-engineering-standards`. If behind, tell the user and ask before `git submodule update --remote --merge .cursor/rules` and committing the pointer on a branch/PR.
