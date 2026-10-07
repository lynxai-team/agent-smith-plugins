---
name: update-project-nav
description: use when asked to update the project navigation map documentation
---
# Update Project Nav

Workflow to update the project navigation map file (`.agents/documentation/project-nav.md`). This is the canonical deep reference for AI agents to understand, navigate, and modify the entire project.

## Ownership in this file (single source of truth — never repeated elsewhere)

- **Key Conventions & Patterns** — the only conventions list in the project
- **Code Snippets** — the only snippets in the project
- **Documentation Links** — the only external links (npm / GitHub / live site) in the project
- **Deep maps** — dependency graph, per-module key files/types, server routes, UI listing

**Not in this file**: mission (`AGENTS.md`), repo table (`AGENTS.md`), ~1-page overview prose (`project-overview.md`), task→path quick reference (`decision-tree.md`).

## Workflow

1. **Read existing file** — Load `.agents/documentation/project-nav.md` from the project root. Note the current sections and content.

2. **Detect changes** — Walk the directory tree, identify what has changed since the last update:
   - New/removed repos or packages
   - New/modified modules or components
   - UI/frontend changes (if applicable)
   - New documentation files
   - Architecture changes (new patterns, dependencies)

3. **Update sections** — Go through each section and update as needed. Preserve the existing format and style.

### Section Update Rules

#### 1. Project Overview
- Keep concise: one-line description plus a module table if present
- Do not restate the repo table from `AGENTS.md` or the overview prose from `project-overview.md`

#### 2. Architecture Principles
- Add new principles when architectural patterns emerge
- Remove obsolete principles
- Update "Key Files" column if file locations change
- Maintain the 3-column table: `| Principle | Detail | Key Files |`

#### 3. Dependency Graph
- Regenerate ASCII art if dependency relationships change
- Update the prose explanation below the graph
- Keep the visual format consistent (boxes, arrows, labels)

#### 4. Packages/Modules
- Add new packages/modules with: Purpose, Key files, Key types/classes
- Update existing packages if API changes
- Remove deprecated packages
- Format: `### <module-name> — <short description>` followed by bullet points

#### 5. Server/API (if applicable)
- Update route/endpoint tables with new/changed routes
- Add new handler files
- Update patterns if async flow changes

#### 6. Plugins/Extensions (if applicable)
- Add new plugins/extensions to the table
- Update categories if reorganized
- Keep format: `| Plugin | Category | Purpose | Key File(s) |`

#### 7. UI/Frontend (if applicable)
- Update component/service tables
- Add new themes, apps, or extensions
- Note any architectural changes (framework version updates)

#### 8. Apps/Extensions (if applicable)
- Document new apps added to the project
- Update existing app descriptions if functionality changes

#### 9. Code Snippets
- Add new patterns for new APIs or features
- Update existing snippets if API signatures change
- Keep language-appropriate examples

#### 10. Documentation Links
- Add new documentation resources
- Remove links to deleted docs
- Verify all paths still exist

#### 11. Key Conventions & Patterns
- Add new conventions discovered in the codebase
- Update existing conventions if they change
- Bullets or `| Convention | Detail |` table

> **No "Navigation Quick Reference" section in this file** — the task→path map lives only in `decision-tree.md`. When files move or new common tasks appear, update `decision-tree.md` § Common Tasks instead.

4. **Cross-reference check** — Ensure no content duplication:
   - Conventions, snippets, dependency graph, module maps, and external links live ONLY in `project-nav.md`
   - Per-module technical details (entry points, key files, dependencies) live in `codebase-summary.md`
   - Task→path quick reference lives ONLY in `decision-tree.md`
   - Mission and repo table live in `AGENTS.md`; overview prose lives in `project-overview.md`

5. **Write the updated file** — Preserve the header note: `> Purpose: Single-reference map for AI coding agents to understand, navigate, and modify the <Project Name> codebase.`

## Rules

- **Information-dense**: Use tables, bullets, one-line descriptions
- **No redundancy**: Each piece of information lives in exactly one file (see ownership list above)
- **Preserve format**: Do not change section structure or table formats
- **Canonical deep reference**: `project-nav.md` is the single source of truth for conventions, snippets, maps, and external links
- **Repo-relative paths**: no `</workspace/.../>` angle brackets
- **Language-agnostic**: Adapt to the project's language and ecosystem
- **Include only applicable sections**: Server, Plugins, UI, and Apps sections are optional — include only if the project has them
