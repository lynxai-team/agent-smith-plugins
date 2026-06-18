---
name: create-project-docs
description: use when asked to create or update helper documentation so AI agents can navigate a project
---

Create or update the documentation files that help AI agents navigate a codebase. Works for single-repo or multi-repo projects.

## Files to Create/Update

| File | Scope | Purpose |
|------|-------|---------|
| `AGENTS.md` | Project root | Index with reading order + links to other docs |
| `.agents/documentation/codebase-summary.md` | Every repo/module | Standardized technical summary (7 sections) |
| `.agents/documentation/project-nav.md` | Project root only | Comprehensive navigation map |

> **Single-repo projects**: All 3 files live at the project root.
> **Multi-repo projects**: `AGENTS.md` and `project-nav.md` at workspace root; each repo gets its own `AGENTS.md` and `codebase-summary.md`.

## Workflow

Execute steps in order:

### 1. Explore the Project

Walk the directory tree. Identify repos, packages/modules, entry points, dependencies, and key files. Read manifest or config files to understand structure and language.

### 2. Create AGENTS.md (Project Root)

```markdown
# <Project Name>

## Reading Order for AI Agents

1. **Start here** → This file is your index
2. **Comprehensive reference** → `.agents/documentation/project-nav.md` — Full project map
3. **Technical summary** → `.agents/documentation/codebase-summary.md` — Dependencies, entry points, key files
4. **Per-repo navigation** → Each repo has its own `AGENTS.md` and `.agents/documentation/codebase-summary.md`

---

This is a <language> project for <purpose>. It contains these repositories:

- `<repo-name>` — <one-line description>
- ...

Documentation:

- `.agents/documentation/codebase-summary.md`: top-level codebase summary
- `.agents/documentation/project-nav.md`: navigation map
- `<repo>/.agents/documentation/codebase-summary.md`: per-repo summaries
```

### 3. Create codebase-summary.md (Every Repo/Module)

Use exactly these 7 sections in this order:

```markdown
# <module-name>

## Summary
One sentence: what the module does.

## Dependencies
- `<internal-dep>` — what it provides
- External: `<library>` (<purpose>)

## Used By
- `<consumer>` — why it uses this module

## Entry Point
- `<path>` — one-line description

## Key Files
| File | Purpose |
|------|---------|
| `<path>` | One-line: what the file does |

## Architecture
- 2–4 bullets on design patterns and data flow.

## Related
- See `<module>` — how they work together

## Documentation
| Resource | Path |
|----------|------|
| Full docsite | `<path>` |
```

**Rules**: Information-dense, short. No project description (that's in project-nav.md). No architecture patterns duplicated from project-nav.md.

### 4. Create project-nav.md (Project Root Only)

Comprehensive map with these sections:

1. **Project Overview** — What it does, repos/modules table, core capabilities
2. **Architecture Principles** — Table: Principle | Detail | Key Files
3. **Dependency Graph** — ASCII art showing module dependencies + prose explanation
4. **Packages/Modules** — Per-module: Purpose, Key files, Key types/classes
5. **Server** (if applicable) — Routes, key files, patterns
6. **Plugins** (if applicable) — Categories, plugins table, key files
7. **UI** (if applicable) — Components, services, themes, extensions
8. **Apps** (if applicable) — Extensions, dependencies
9. **Code Snippets** — Language-appropriate examples showing typical usage
10. **Navigation Quick Reference** — Task → Path table for common development tasks
11. **Documentation Links** — All doc resources with paths
12. **Key Conventions & Patterns** — Naming, file structure, tool formats, etc.

Add header note: `> **Primary reference** — Comprehensive navigation map for the project.`

### 5. Cross-Reference and Verify

- `AGENTS.md` → links to project-nav.md and codebase-summary.md
- `codebase-summary.md` → Related section points to project-nav.md for overview
- `project-nav.md` → no external cross-references needed (it's the primary source)
- No duplicated content across files: project description, architecture patterns, quick-reference tables, and code snippets live ONLY in project-nav.md

## Rules

- **No redundancy**: Each piece of information lives in exactly one file
- **codebase-summary.md preserves format**: The 7-section structure is standardized — do not change it
- **Information-dense**: Keep files short. Use tables, bullets, one-line descriptions
- **project-nav.md is canonical**: Single source of truth for project overview, architecture, snippets, and quick references
- **Language-agnostic**: Adapt examples and conventions to the project's language and ecosystem
