---
name: create-project-docs
description: use when asked to create or update helper documentation so AI agents can navigate a project
---

Create or update the documentation files that help AI agents navigate a codebase. Works for single-repo or multi-repo projects.

## Files to Create/Update

| File | Scope | Purpose |
|------|-------|---------|
| `AGENTS.md` | Project root | Index with mission, conventions, quick start, and doc links |
| `<repo>/AGENTS.md` | Each repo (multi-repo only) | Localized context for agents working in that repo |
| `.agents/documentation/decision-tree.md` | Project root only | Quick guide: find the right doc for your task |
| `.agents/documentation/project-overview.md` | Project root only | Concise project overview (~1 page) |
| `.agents/documentation/codebase-summary.md` | Every repo/module | Standardized technical summary (7 core + optional sections) |
| `.agents/documentation/project-nav.md` | Project root only | Comprehensive navigation map |

> **Single-repo projects**: All 5 files live at the project root.
> **Multi-repo projects**: `AGENTS.md`, `decision-tree.md`, `project-overview.md`, and `project-nav.md` at workspace root; each repo gets its own `AGENTS.md` and `codebase-summary.md`.

## Workflow

Execute steps in order:

### 1. Explore the Project

Walk the directory tree. Identify repos, packages/modules, entry points, dependencies, and key files. Read manifest or config files to understand structure and language. Identify key conventions and patterns used by the project.

### 2. Create AGENTS.md (Project Root)

Use this exact structure:

```markdown
# <Project Name>

## Mission
<One-line mission statement describing what the project does and its core capabilities.>

## Repositories

| Repo | Path | Purpose |
|------|------|---------|
| `<repo-name>` | `</workspace/repo-path/>` | <One-line description> |

## Conventions (for AI Agents)

- **<Convention name>**: <Brief description of the pattern>
- ...

## Quick Start for AI Agents

1. Read `.agents/documentation/decision-tree.md` to find the right doc for your task
2. Read `.agents/documentation/project-overview.md` for high-level context
3. Read `.agents/documentation/project-nav.md` for detailed navigation and dependency graph
4. Navigate to the relevant repo/package and read its `.agents/documentation/codebase-summary.md`

## Documentation

- `.agents/documentation/decision-tree.md` — Quick guide: find the right doc for your task
- `.agents/documentation/codebase-summary.md` — Top-level codebase summary (structured, machine-readable)
- `.agents/documentation/project-overview.md` — Concise project overview (~1 page)
- `.agents/documentation/project-nav.md` — Detailed navigation map with dependency graph
- `<repo>/.agents/documentation/codebase-summary.md` — <Repo> summary
- ...

Each package or library directory has `.agents/documentation/codebase-summary.md`. Use them to navigate in the codebase easily.
```

**Rules for AGENTS.md**:
- **Mission**: One concise sentence capturing the project's purpose and capabilities
- **Repositories table**: Include all repos with path and one-line purpose
- **Conventions**: List 3-5 key patterns AI agents need to know (tool formats, file structures, state management, etc.)
- **Quick Start**: Always list `decision-tree.md` FIRST, then `project-overview.md`, then `project-nav.md`, then per-repo summaries
- **Documentation**: List all doc files with brief descriptions

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

- **<Convention>**: <Brief description> (repo-specific patterns)

## Quick Start for AI Agents

1. Read `.agents/documentation/codebase-summary.md` for technical summary
2. Explore key files listed in codebase-summary.md
3. <Build/run instructions specific to this repo>

## Documentation

- `.agents/documentation/codebase-summary.md` — Technical summary of this repo
- `../../AGENTS.md` — Project-wide context and conventions (workspace root)
```

**Rules for per-repo AGENTS.md**:
- **Self-contained**: Should be useful for agents working directly in that repo
- **Structure table**: List key directories with one-line purposes
- **Conventions**: Include repo-specific conventions (subset of or additions to root conventions)
- **Quick Start**: Always reference the local codebase-summary.md first
- **Documentation**: Always link back to root `../../AGENTS.md` for project-wide context
- **Skip for single-repo**: Only create when there are multiple repos

### 4. Create decision-tree.md (Project Root Only)

Quick guide helping agents find the right documentation based on their task:

```markdown
# Documentation Decision Tree

> Quick guide: What to read based on your task

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map → `.agents/documentation/project-nav.md`
- Structured summary → `.agents/documentation/codebase-summary.md`

## I need to work on a specific repo/package

- `<repo>` → `<repo>/.agents/documentation/codebase-summary.md`
- ...

<!-- OPTIONAL: For monorepos with sub-packages, add this section -->
## I need to work on a specific package

- `<package-name>` → `<repo>/packages/<package>/.agents/documentation/codebase-summary.md`
- ...

## I need detailed documentation

- `<topic>` → `<path-to-docs>`
- ...

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| <Task description> | `<path>` |

## Conventions

- <Convention> — <Brief description>

→ See `AGENTS.md` for full conventions summary.
```

**Rules for decision-tree.md**:
- Organize by task type (understand project, work on specific area, detailed docs)
- Include a "Common Tasks" table mapping tasks to paths
- End with reference to AGENTS.md for full conventions
- **Optional**: For monorepos with sub-packages, add a "I need to work on a specific package" section listing individual packages

### 5. Create project-overview.md (Project Root Only)

Concise ~1 page overview with these sections:

```markdown
# <Project Name> — Project Overview

> **Role**: Concise "what is this" for context loading (~1 page overview).
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-nav.md` for detailed navigation and task references.

---

## What is <Project Name>?

<One paragraph describing the project, its purpose, and core capabilities.>

---

## Core Capabilities

- **<Capability 1>** — <Brief description>
- **<Capability 2>** — <Brief description>
- ...

---

## Repository Structure

| Repo | Path | Purpose |
|------|------|---------|
| `<repo>` | `<path>` | <Purpose> |

---

<!-- OPTIONAL: For monorepos with internal packages, add this section after Repository Structure -->
## Runtime Packages (`<repo>/packages/`)

| Package | Purpose |
|---------|---------|
| `<package>` | <One-line purpose> |

---

## Key Architecture Patterns

- **<Pattern>**: <Brief description>
- ...

---

## Quick Reference: Common Tasks

| Task | Go To |
|------|-------|
| <Task> | `<path>` |

---

## Code Snippets

### <Snippet Title>
```<language>
# Example code showing typical usage
```

---

## Documentation Links

| Resource | Path |
|----------|------|
| <Resource name> | `<path>` |

**Rules for project-overview.md**:
- Keep to ~1 page
- Include header notes referencing decision-tree.md and project-nav.md
- Include code snippets showing typical usage patterns
- End with documentation links table
- **Optional**: For monorepos with internal packages, add a "Runtime Packages" table after Repository Structure

### 6. Create codebase-summary.md (Every Repo/Module)

Load and follow the `update-codebase-summary` skill for each repo/module. This specialized skill defines the standardized 7-section format (Summary, Dependencies, Used By, Entry Point, Key Files, Architecture, Related).

> **Note**: Include the optional "Documentation" section ONLY in the project root `codebase-summary.md` — lists all doc resources with paths. Omit from per-repo/module summaries.

### 7. Create project-nav.md (Project Root Only)

Load and follow the `update-project-nav` skill. This specialized skill defines all required sections (Project Overview, Architecture Principles, Dependency Graph, Packages/Modules, Code Snippets, Navigation Quick Reference, Documentation Links, Key Conventions & Patterns) and optional sections (Server, Plugins, UI, Apps, project-specific).

> **Tip**: Number sections sequentially based on which ones you include. Skip numbers for omitted optional sections.

> **Note**: Include the header note: `> Purpose: Single-reference map for AI coding agents to understand, navigate, and modify the <Project Name> codebase.`

### 8. Cross-Reference and Verify

- Root `AGENTS.md` → links to decision-tree.md, project-overview.md, project-nav.md, codebase-summary.md, and per-repo AGENTS.md files
- Per-repo `AGENTS.md` → links to local codebase-summary.md; links back to root `../../AGENTS.md` for project-wide context
- `decision-tree.md` → references all doc files; ends with link to root AGENTS.md for conventions
- `project-overview.md` → header notes reference decision-tree.md and project-nav.md
- `codebase-summary.md` → Related section points to related modules
- `project-nav.md` → no external cross-references needed (it's the primary source)

**No duplicated content across files**:
- Project description, architecture patterns, code snippets, and quick-reference tables live ONLY in `project-nav.md` and `project-overview.md`
- Per-module technical details (entry points, key files, dependencies) live in `codebase-summary.md`
- Conventions summary lives in root `AGENTS.md`; decision-tree.md references it
- Per-repo context (structure, repo-specific conventions) lives in per-repo `AGENTS.md`

## Rules

- **No redundancy**: Each piece of information lives in exactly one file
- **codebase-summary.md core format**: The 7-section structure (Summary, Dependencies, Used By, Entry Point, Key Files, Architecture, Related) is standardized — do not change the order or rename sections. Optional "Documentation" section may be added at the end for the project root only.
- **Information-dense**: Keep files short. Use tables, bullets, one-line descriptions
- **project-nav.md is canonical**: Single source of truth for project overview, architecture, snippets, and quick references
- **decision-tree.md first**: Always the first file agents should read to find the right doc
- **Language-agnostic**: Adapt examples and conventions to the project's language and ecosystem
- **Adapt optional sections**: Include optional sections (sub-packages in decision-tree, Runtime Packages in project-overview, Documentation in codebase-summary, conditional sections in project-nav) only when they add value for the specific project

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `update-codebase-summary` | Used in **step 6** to create/update each module's `.agents/documentation/codebase-summary.md` |
| `update-project-nav` | Used in **step 7** to create/update the project root `.agents/documentation/project-nav.md` |
| `document-package` | Create/update documentation for a package in the project docsite |
| `update-doc-map` | Regenerate the documentation map (runs a script) |

> **Tip**: Steps 6 and 7 load these specialized skills during initial creation. Use them again for ongoing targeted updates after code changes.
