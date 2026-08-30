---
name: create-or-update-readme
description: use when asked to create or update a README (readme, README.md) for a repository, package, or plugin - analyzes the codebase and writes a concise, structured readme; optionally incorporates user-provided doc links for AI agents and/or humans
---

# Create or Update README

Create or update a comprehensive, accurate `README.md` for a repository, package, or plugin — including an optional Documentation section built from user-provided or in-repo doc links.

## Input

Before starting, establish:

1. **Target**: the repository / package / plugin to document. Ask if not specified.
2. **Documentation links** (OPTIONAL): the user may provide documentation links, typically in two flavors:
   - *For AI Agents*: raw/source markdown file URLs (e.g., `https://raw.githubusercontent.com/...`) or local relative paths
   - *For Humans*: published docsite URLs
   If not provided, do **not** ask — discover what exists in the repository (Phase 2) and fall back to omitting the Documentation section.

## Workflow: README Creation / Update

### Phase 1: Discovery

1. Locate the target directory in the workspace (ask the user if ambiguous).
2. Read generic context files **if they exist** (never hardcode a specific project's layout):
   - `AGENTS.md` or `.agents/documentation/` inside the target repo — project conventions and navigation
   - `.agents/documentation/codebase-summary.md` for the target package/module
3. Detect the ecosystem by reading manifest files at the target root:
   - `package.json` → JavaScript/TypeScript, npm (note `name`, `version`, `description`, `license`, scripts, entry points)
   - `pyproject.toml` / `setup.py` / `poetry.lock` → Python, pip (`name`, `version`, `[project]` metadata)
   - `Cargo.toml` → Rust, cargo
   - `go.mod` → Go
   - `Gemfile` / `*.gemspec` → Ruby, gem
   - `composer.json` → PHP, composer
   - `pom.xml` / `build.gradle` → JVM, maven/gradle
   - `CMakeLists.txt`, `setup.sh`, `Dockerfile` → other build tooling
4. Note the package's position, dependencies, and purpose from the context files.

### Phase 2: Deep Dive

1. Use the `smart-explore` skill (if available) to walk the target directory tree; otherwise use `find` with `-maxdepth` starting shallow, excluding `.git`, `node_modules`, build artifacts, etc.
2. Read key source files: entry points, public exports (`index.ts` / `__init__.py` / `lib.rs` / `main.go` …), public API definitions.
3. Extract usage patterns from tests (`*.test.*`, `test_*.py`, `*_test.go`) and examples dirs — these are the most reliable source of runnable code examples.
4. Discover in-repo documentation that can serve as links if the user provided none:
   - `docs/`, `doc/`, `docsite/` directories, `CONTRIBUTING.md`, `.agents/documentation/*.md`

### Phase 3: Mode Decision — Create or Update

Check for an existing `README.md` at the target root:

- **Create mode** (no README): follow Phase 4 structure fully.
- **Update mode** (README exists): read it first. Preserve its overall structure, tone, and sections that are still accurate. Then:
  - Verify all code examples and API signatures against the current source; fix what drifted
  - Add newly exported APIs / features missing from the README
  - Remove or mark deprecated items no longer present in source
  - Do **not** rewrite the whole file unless the user explicitly asks

### Phase 4: Synthesis & Writing

#### Structure (adapt to what applies — skip sections that are N/A)

- **Badge(s)** (only for published packages): e.g. npm:
  ```
  [![pub package](https://img.shields.io/npm/v/{package-name})](https://www.npmjs.com/package/{package-name})
  ```
  Other ecosystems: shields.io badges for version/license/downloads where a registry exists (crates.io, PyPI, Go proxy). Omit if the package is private or unpublished.
- **Title & Tagline**: name + one-sentence description. One line of context on what project/org it belongs to (from repo metadata) if applicable.
- **Features**: bullet list of key capabilities (use emojis for visual hierarchy)
- **Documentation**: see "Documentation Section" below — only include when there are valid links
- **Installation**: install command in a code block matching the detected package manager
- **Quick Start**: minimal working example (import/instantiate/do one thing) — complete and runnable
- **Usage**: detailed patterns with code examples (main operations, options/flags, error handling)
- **Complete Example**: full working example demonstrating all major operations end-to-end
- **API Reference**: entry point signature + parameters table + key types/interfaces + method summary table (generated from source, not guessed)
- **Important Notes**: environment constraints (browser vs node, OS requirements), limitations, related packages/modules in the same repo
- **License**: from manifest or `LICENSE` file

#### Documentation Section — optional input driven

Include this section **only** when documentation links exist. Structure it with two subsections: "For AI Agents" and "For Humans". Include only the subsection(s) for which you actually have links.

```markdown
## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for {package-name} (if present in repo)
- [Doc1](<raw markdown URL or relative path>) — Description
- [Doc2](<raw markdown URL or relative path>) — Description

### For Humans
- [Doc1](https://docs.example.com/packages/{package-name}/) — Description
- [Doc2](https://docs.example.com/packages/{package-name}/topic) — Description
```

Rules:
1. **Links come from the user first.** If the user provided documentation links, use them exactly as given (with brief descriptions after `—`). Group raw/source-markdown links under "For AI Agents" and published-site URLs under "For Humans"; if the user gave only one flavor, include only that subsection (or a flat list).
2. **User did not provide links:** use in-repo docs discovered in Phase 2 with relative paths (e.g., `docs/2.usage.md`). Never invent or guess remote docsite URLs — omit the section instead.
3. **For AI Agents links**: prefer raw markdown source (raw.githubusercontent.com, raw GitLab blob URLs, or repo-relative paths) so agents can read them directly; always start with a local codebase-summary/context file if one exists in the repo.
4. Include a brief description after each link (after `—`).

#### Key Principles

- **Information Density**: every section must convey unique value; no repetition between Quick Start and Usage
- **Code Examples**: complete, runnable, use proper language syntax for the detected ecosystem; verify against source when unsure
- **Accuracy over completeness**: an API table entry missing is better than a wrong one — check source files
- **Error Handling**: document error cases explicitly (thrown errors, exit codes) with examples
- **Environment Constraints**: state platform/runtime constraints early (e.g., "Node 18+", "Linux only")
- **Visual Hierarchy**: emojis for feature bullets, clear section headers, tables for API reference

### Phase 5: Output Validation

Before finalizing, verify:

- [ ] All code blocks are syntactically valid for the project's language and complete enough to run
- [ ] API signatures match the actual implementation (check source files)
- [ ] Install command uses the correct package name from the manifest
- [ ] Badge/package name matches the registry name exactly (e.g., scoped `@org/pkg`)
- [ ] Documentation section (if present) only contains links that actually exist — user-provided or discovered in-repo; none fabricated
- [ ] In update mode: existing sections preserved, nothing accurate was removed
- [ ] No internal paths, TODOs, or implementation details leak into public documentation

## Gotchas

- Never invent or guess remote docsite URLs — if no documentation links exist (user-provided or discovered in-repo), omit the Documentation section entirely rather than fabricating links.
- In update mode, do **not** rewrite the whole file unless the user explicitly asks — preserve existing structure and tone; only fix drift, add missing APIs, remove deprecated items.
- Do not block on optional input: if the user did not provide documentation links, do not ask — discover in-repo docs (Phase 2) or omit the section.
- Verify every API signature, install command, and badge/package name against the actual source/manifest (including scoped names like `@org/pkg`) — a missing entry is better than a wrong one.
- Code examples must be complete and runnable: take them from tests/examples or verify against source — never write an example from memory of the API.

## Completion

Notify the user when the task is completed, reporting:
1. **Mode**: created new README or updated existing one (and what changed)
2. **Documentation section**: included with user-provided links / in-repo discovered links / omitted (no docs found)
3. Any assumptions made (e.g., ecosystem detected from manifest files)
