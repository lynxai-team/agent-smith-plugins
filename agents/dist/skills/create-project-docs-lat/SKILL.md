---
name: create-project-docs
description: use when asked to create or update helper documentation so AI agents can navigate a project
---
# Create Agent Documentation

Create or update the documentation files that help AI agents navigate a codebase. Works for single-repo or multi-repo projects.

## Core Principles

1. **Single source of truth** — every piece of information lives in exactly one file; other files get a one-line pointer, never a copy.
2. **Progressive disclosure** — agents read the decision tree first, then only what it points to. Never mandate reading all docs.
3. **Information-dense** — tables, bullets, one-line descriptions. Keep files short.
4. **Two layers of knowledge** — `.agents/` docs are *navigation* (task → doc/file). A `lat.md/` knowledge graph (when present) is *grounding*: design intent, contracts, behavior, and tests, anchored to source code. Agent docs point at the graph; they never restate its content.

## Content Ownership Map (single source of truth)

| Information | Lives ONLY in | Pointers allowed in |
|---|---|---|
| Mission (one line) | `AGENTS.md` §Mission | — |
| Repo/module table | `AGENTS.md` §Repositories | — |
| Conventions & patterns | `project-nav.md` §Key Conventions & Patterns | `AGENTS.md`, `decision-tree.md` (one-line pointer only) |
| Task → doc/file map (quick reference) | `decision-tree.md` §Common Tasks | — |
| Architecture prose (~1 page context) | `project-overview.md` §Key Architecture Patterns | — |
| Code snippets | `project-nav.md` §Code Snippets | — |
| Deep maps: dependency graph, per-module key files/types, server routes, UI listing | `project-nav.md` | — |
| External links (npm / GitHub / live site) | `project-nav.md` §Documentation Links | — |
| Machine-readable module summary (entry, key files, deps) | `<module>/.agents/documentation/codebase-summary.md` | — |
| Design intent: "what/why" of architecture, contracts, behavior, tests (only if the project uses lat) | `lat.md/` knowledge graph | `AGENTS.md`, `decision-tree.md`, `project-nav.md`, `codebase-summary.md` (one-line pointers only) |
| Lat usage entry point (only if present) | `lat.md/help.md` | `AGENTS.md` § Code Search (pointer only) |

> **Generated lat files are off-limits** — `lat.md/lat.md` and any generated `lat-md` `SKILL.md` are owned by the lat tooling (see `use-lat` skill).

## Files to Create/Update

| File | Scope | Purpose |
|------|-------|---------|
| `AGENTS.md` | Project root | Router: mission, repo table, reading order, doc map, conventions pointer |
| `<repo>/AGENTS.md` | Each repo (multi-repo only) | Localized context for agents working in that repo |
| `.agents/documentation/decision-tree.md` | Project root only | Navigation core: intent → right doc/file/task map |
| `.agents/documentation/project-overview.md` | Project root only | Concise pure-context overview (~1 page, no snippets, no task table) |
| `.agents/documentation/codebase-summary.md` | Every repo/module | Standardized 7-section machine-readable summary |
| `.agents/documentation/project-nav.md` | Project root only | Canonical deep reference: conventions, snippets, maps, external links |
| `lat.md/` | Project root (only if the project uses lat) | Knowledge graph: design intent, contracts, behavior, test specs. Created by `lat init`; maintained per its own workflow — see `lat.md/help.md` |

> **Single-repo projects**: All files live at the project root; there is ONE `codebase-summary.md` (root module). Do not claim per-module summaries that do not exist.
> **Multi-repo projects**: Root docs at workspace root; each repo gets its own `AGENTS.md` and `codebase-summary.md`.
> **Lat is optional**: integrate lat into the docs only when a `lat.md/` directory exists in the project. If it does not, no lat pointer or section appears anywhere. The set of `lat.md/*.md` files varies per project — never hardcode another project's file names.

## Workflow

Execute steps in order:

### 1. Explore the Project

**First load the `smart-explore` skill** and follow it to explore the codebase. Then: walk the directory tree; identify repos, packages/modules, entry points, dependencies, and key files; read manifest or config files to understand structure and language; identify key conventions and patterns used by the project. Note which referenced paths actually exist (verified in step 8).

**Check for lat**: if a `lat.md/` directory exists at the project root, the project uses lat. Read `lat.md/help.md` (the agent entry point) to learn this project's graph files; load the `use-lat` skill for the full command reference and workflow; verify the CLI works (`lat --help`, `lat check`). If no `lat.md/` exists, skip all lat integration below.

### 2. Create AGENTS.md (Project Root) — Router Only

Use this exact structure:

```markdown
# <Project Name>

## Mission
<One-line mission statement describing what the project does and its core capabilities.>

## Repositories

| Repo | Path | Purpose |
|------|------|---------|
| `<repo-name>` | `repo-path/` | <One-line description> |

## Quick Start for AI Agents

1. Read `.agents/documentation/decision-tree.md` — the router: it tells you exactly which doc or source file your task needs.
2. Most tasks end here: go straight to the listed source files. Do not load every doc.
3. (If project uses lat) Before changing behavior, architecture, or tests, ground the task in design intent: run `lat search "<task>"` and read the returned sections (see § Code Search).
4. Load additional docs only when needed:
   - `.agents/documentation/project-overview.md` — only for conceptual context
   - `.agents/documentation/project-nav.md` — only for deep reference (routes, conventions, snippets)
5. (Multi-repo only) Navigate to the relevant repo and read its `.agents/documentation/codebase-summary.md`.

## Conventions

→ See `.agents/documentation/project-nav.md` § Key Conventions & Patterns (single source of truth).

<!-- OPTIONAL: include only if the project uses lat -->
## Code Search (lat)

`lat` searches the project knowledge graph in `lat.md/`: cross-linked markdown describing design intent, contracts, behavior, and tests, anchored to source code via `// @lat:` refs. Project-specific files: see `lat.md/help.md`. Commands, syntax, and full workflow: load the `use-lat` skill.

Post-task (required): if you added or changed meaningful behavior, architecture, or tests → update the relevant `lat.md/` file, then run `lat check` until all validations pass. Do not edit generated lat files (`lat.md/lat.md`, a generated `lat-md` SKILL.md) — they are owned by the lat tooling.

## Documentation

- `decision-tree.md` — Router: task → doc/file map
- `project-overview.md` — Concise context (~1 page)
- `project-nav.md` — Canonical deep reference (conventions, snippets, maps)
- `codebase-summary.md` — Machine-readable summary of this module
- (multi-repo) `<repo>/.agents/documentation/codebase-summary.md` — Per-repo summaries
- (if project uses lat) `lat.md/` — Knowledge graph (design intent, contracts, tests); discover via `lat search`, details in `lat.md/help.md`
```

**Rules for AGENTS.md**:
- **Mission**: One concise sentence capturing the project's purpose and capabilities.
- **Repositories table**: All repos with repo-relative paths (no `</workspace/.../>` angle-bracket style) and one-line purpose.
- **Quick Start**: Always list `decision-tree.md` FIRST; then progressive disclosure — never mandate a fixed chain of all docs. The per-module summary step appears only in multi-repo projects, and only if that file actually exists.
- **Conventions section**: Pointer only — the full conventions list lives in `project-nav.md`.
- **Documentation**: One line per doc with its role.
- **Code Search (lat)**: Include only when `lat.md/` exists; keep it short, point to `lat.md/help.md` for project-specific details and the `use-lat` skill for the full workflow — never enumerate this project's lat files here.

### 3. Create Per-Repo AGENTS.md (Multi-Repo Projects Only)

For multi-repo projects, create an `AGENTS.md` in each repository so agents navigating directly to a repo have localized context:

```markdown
# <Repo Name>

## Mission
<One-line mission statement for this specific repo.>

## Structure

| Directory | Purpose |
|-----------|---------|
| `<dir>` | <One-line description> |

## Conventions

- **<Convention>**: <Brief description> (repo-specific patterns; subset of or additions to root conventions)

## Quick Start for AI Agents

1. Read `.agents/documentation/codebase-summary.md` for technical summary
2. Explore key files listed in codebase-summary.md
3. <Build/run instructions specific to this repo>
4. (If project uses lat) Ground behavior/architecture/test changes with `lat search "<task>"` — see root `AGENTS.md` § Code Search (lat).

## Documentation

- `.agents/documentation/codebase-summary.md` — Technical summary of this repo
- `../../AGENTS.md` — Project-wide context and conventions (workspace root)
```

**Rules for per-repo AGENTS.md**:
- **Self-contained**: Useful for agents working directly in that repo.
- **Structure table**: Key directories with one-line purposes.
- **Conventions**: Repo-specific conventions (subset of or additions to root conventions).
- **Quick Start**: Always reference the local codebase-summary.md first; lat pointer only when `lat.md/` exists at project root.
- **Documentation**: Always link back to root `../../AGENTS.md`.
- **Skip for single-repo**: Only create when there are multiple repos.

### 4. Create decision-tree.md (Project Root Only) — Navigation Core

Quick guide helping agents find the right documentation or file based on their task:

```markdown
# Documentation Decision Tree

> Quick guide: What to read based on your task.
> For most tasks this file alone is enough — follow the path and open the source file directly.
> (If project uses lat) Two layers: `.agents/` docs are navigation; `lat.md/` is grounding (design intent, contracts, tests).

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map & deep reference → `.agents/documentation/project-nav.md`
- Structured technical summary → `.agents/documentation/codebase-summary.md`

<!-- OPTIONAL: include only if the project uses lat -->
## I need design grounding before changing code

Ground each task in actual architecture and intent before writing code: run `lat search "<task>"` and read the returned sections. Full commands, key fallbacks, and workflow: load the `use-lat` skill.

Knowledge graph — list THIS project's actual `lat.md/` files (read the file inventory from `lat.md/help.md` or the generated instruction file), one row per file:

| Need | File |
|------|-------|
| <what this file covers> | `lat.md/<file>.md` |
| ... | ... |

## I need to work on a specific repo/package/module

| Module | Go To |
|--------|-------|
| `<module>` | <key files> (multi-repo: + `<repo>/.agents/documentation/codebase-summary.md`) |
| ... |

<!-- OPTIONAL: For monorepos with sub-packages, add this section -->
## I need to work on a specific package

- `<package-name>` → `<repo>/packages/<package>/.agents/documentation/codebase-summary.md`
- ...

(If project uses lat) For behavior changes, ground first with `lat search` (§ design grounding above), then open the file.

## I need detailed documentation

- `<topic>` → `<path-to-docs>`
- ...

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| <Task description> | `<path>` |
| (if project uses lat) Add or change a test | <test files> — one `// @lat:` ref per spec section (see `use-lat` skill); update the relevant `lat.md/` file |

<!-- OPTIONAL: include only if the project uses lat -->
## Post-task checklist (REQUIRED)

After EVERY task, before responding:

- [ ] If you added or changed meaningful functionality, architecture, tests, or behavior → update the relevant `lat.md/` file (snapshot of implemented state, not a changelog).
- [ ] Run `lat check` — all validations must pass.

Do not consider your task done until both are complete. Full checklist: `use-lat` skill.

→ Conventions & patterns: `.agents/documentation/project-nav.md` § Key Conventions & Patterns.
```

**Rules for decision-tree.md**:
- Organize by task type (understand project, work on specific area, detailed docs).
- The "Common Tasks" table is the **only** task → path map in the project — do not repeat it anywhere else.
- Module rows point to key source files (and per-module codebase-summary when multi-repo) — never to documents that do not exist.
- **No Conventions section** — end with a pointer line to `project-nav.md`.
- **Lat sections**: include only when `lat.md/` exists; the knowledge-graph table must enumerate this project's actual files (from `lat.md/help.md` / the generated instruction file) — never copy file names from another project.
- **Optional**: For monorepos with sub-packages, add the "I need to work on a specific package" section.

### 5. Create project-overview.md (Project Root Only) — Context Only

Concise ~1 page overview with these sections:

```markdown
# <Project Name> — Project Overview

> **Role**: Concise "what is this" for context loading (~1 page overview).
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-nav.md` for deep reference (conventions, snippets, maps).

---

## What is <Project Name>?

<One paragraph describing the project, its purpose, and core capabilities.>

---

## Core Capabilities

- **<Capability 1>** — <Brief description>
- ...

---

## Key Architecture Patterns

- **<Pattern>**: <Brief prose>
- ...

<!-- OPTIONAL: For monorepos with internal packages, add this section -->
## Runtime Packages (`<repo>/packages/`)

| Package | Purpose |
|---------|---------|
| `<package>` | <One-line purpose> |
```

**Rules for project-overview.md**:
- Keep to ~1 page; pure context.
- **No code snippets** — they live only in `project-nav.md`.
- **No quick-reference task table** — it lives only in `decision-tree.md`.
- **No repo/module table** — it lives only in `AGENTS.md`.
- **No conventions bullets and no external-links table** — both live only in `project-nav.md`.
- Header notes reference decision-tree.md and project-nav.md.
- **Optional**: "Runtime Packages" table for monorepos with internal packages.

### 6. Create codebase-summary.md (Every Repo/Module)

Load and follow the `update-codebase-summary` skill for each repo/module. It defines the standardized 7-section format (Summary, Dependencies, Used By, Entry Point, Key Files, Architecture, Related).

**De-duplication constraints on top of the standard format**:
- **Summary**: One line only — do not re-list capabilities already in `AGENTS.md` / `project-overview.md`.
- **Architecture**: Terse machine-readable bullets or a pointer to `project-nav.md` § Key Conventions & Patterns — no prose paragraphs. If the project uses lat, design rationale lives in `lat.md/` — keep this section file-level only.
- **Related**: Pointers to sibling modules and root docs only. If the project uses lat, add one line: "Semantic search over design intent → `lat search` (knowledge graph in `lat.md/`)". Pointers only — no content from the graph.
- **No "Documentation" section in any version** — the internal doc map lives in `AGENTS.md`; external links live only in `project-nav.md` § Documentation Links.

### 7. Create project-nav.md (Project Root Only) — Canonical Deep Reference

Load and follow the `update-project-nav` skill. It defines all required sections (Project Overview, Architecture Principles, Dependency Graph, Packages/Modules, Code Snippets, Documentation Links, Key Conventions & Patterns) and optional sections (Server, Plugins, UI, Apps, project-specific).

> **Tip**: Number sections sequentially based on which ones you include. Skip numbers for omitted optional sections.

> **Note**: Include the header note: `> Purpose: Single-reference map for AI coding agents to understand, navigate, and modify the <Project Name> codebase.`

**Ownership inside this doc (no other file may repeat these)**:
- **Key Conventions & Patterns** — the only conventions list in the project.
- **Code Snippets** — the only snippets in the project.
- **Documentation Links** — the only external links (npm / GitHub / live site) in the project.
- **Packages/Modules** — per-module key files/types detail (additive; do not restate the root repo table from `AGENTS.md`).
- **No "Navigation Quick Reference" section** — the task → path map lives only in `decision-tree.md`.

> **Lat note**: If the project uses lat, design rationale ("why") is canonical in the knowledge graph — do not restate it in § Architecture Principles. Keep that section to a terse file-level summary and point to `lat.md/` (find sections via `lat search`). Without lat, write the full prose there.

### 8. Cross-Reference and Verify

Cross-references:
- Root `AGENTS.md` → links to decision-tree.md, project-overview.md, project-nav.md, codebase-summary.md, and per-repo AGENTS.md files (multi-repo)
- Per-repo `AGENTS.md` → links to local codebase-summary.md; links back to root `../../AGENTS.md` for project-wide context
- `decision-tree.md` → references all doc files; ends with a conventions pointer to project-nav.md
- `project-overview.md` → header notes reference decision-tree.md and project-nav.md
- `codebase-summary.md` → Related section points to related modules
- `project-nav.md` → no external cross-references needed (it is the primary source)
- If the project uses lat: `AGENTS.md`, `decision-tree.md`, `project-nav.md`, and `codebase-summary.md` each contain at most one-line pointers into `lat.md/` (plus the Code Search / post-task blocks in AGENTS.md and decision-tree); `lat.md/help.md` is the project entry point, the `use-lat` skill holds the general workflow.

**Verification checklist (run before finishing)**:
1. **Path existence**: every file path referenced in any doc exists on disk.
2. **No duplication**: grep for signature strings (snippet code, convention bullets, task-table rows) — each must appear in exactly one doc.
3. **Consistent notation**: all paths repo-relative; no `</workspace/.../>` angle brackets.
4. **No dead instructions**: Quick Start / decision-tree never point to documents that do not exist (e.g., per-module summaries in single-repo projects).
5. **No duplication with the knowledge graph** (if lat is present): `.agents/` docs contain only pointers into `lat.md/`, never copies of its sections; generated lat files (`lat.md/lat.md`, any generated SKILL.md) are untouched.
6. **Lat consistency** (if lat is present): the decision-tree's knowledge-graph table matches this project's actual `lat.md/` files, and `lat check` passes after any doc/graph change.

## Rules

- **No redundancy**: each piece of information lives in exactly one file (see ownership map); other files get pointers, not copies.
- **Two layers**: navigation (`.agents/`) vs grounding (`lat.md/`, when present). Agent docs never restate knowledge-graph content — one-line pointers only.
- **Progressive disclosure**: agents read the decision tree first and then only what it points to — never mandate reading all docs.
- **decision-tree.md first**: always the first file agents should read to find the right doc or file.
- **codebase-summary.md core format**: the 7-section structure (Summary, Dependencies, Used By, Entry Point, Key Files, Architecture, Related) is standardized — do not change the order or rename sections.
- **project-nav.md is canonical**: single home for conventions, snippets, deep maps, and external links.
- **Information-dense**: keep files short; use tables, bullets, one-line descriptions.
- **Language-agnostic**: adapt examples and conventions to the project's language and ecosystem.
- **Adapt optional sections**: include optional sections (sub-packages in decision-tree, Runtime Packages in project-overview, conditional sections in project-nav, lat sections when `lat.md/` exists) only when they add value for the specific project.

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `smart-explore` | **Mandatory first load** — used in **step 1** to explore the codebase before creating any docs |
| `update-codebase-summary` | Used in **step 6** to create/update each module's `.agents/documentation/codebase-summary.md` |
| `update-project-nav` | Used in **step 7** to create/update the project root `.agents/documentation/project-nav.md` |
| `document-package` | Create/update documentation for a package in the project docsite |
| `update-doc-map` | Regenerate the documentation map (runs a script) |
| `use-lat` | Load when working with a `lat.md/` knowledge graph — grounding tasks via `lat search`, updating graph files, validating with `lat check`. Load on demand; only for projects that have `lat.md/` |

> **Tip**: Steps 6 and 7 load these specialized skills during initial creation. Use them again for ongoing targeted updates after code changes. Lat usage details come from `lat.md/help.md` (project-specific) and the `use-lat` skill (general workflow) — load the skill only when a project has a `lat.md/` graph.
