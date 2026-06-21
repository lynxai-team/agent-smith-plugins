---
name: update-project-nav
description: use when asked to update the project navigation map documentation
---

This skill describes the workflow to update the project navigation map file (`.agents/documentation/project-nav.md`). This is the canonical reference for AI agents to understand and navigate the entire project.

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
- Update the repos/modules table if components are added/removed/renamed
- Update the purpose descriptions if functionality changes
- Keep the table format: `| Repo | Path | Purpose |`

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

#### 10. Navigation Quick Reference
- Add new task→path mappings
- Update paths if files moved
- Keep the `| Task | Go To |` table format

#### 11. Documentation Links
- Add new documentation resources
- Remove links to deleted docs
- Verify all paths still exist

#### 12. Key Conventions & Patterns
- Add new conventions discovered in the codebase
- Update existing conventions if they change
- Keep the `| Convention | Detail |` table format

4. **Cross-reference check** — Ensure no content duplication:
   - Project description, architecture patterns, quick references, and code snippets live ONLY in `project-nav.md`
   - Per-module technical details (entry points, key files, dependencies) live in `codebase-summary.md`
   - No redundancy between files

5. **Write the updated file** — Preserve the header note: `> **Purpose**: Single-reference map for AI coding agents to understand, navigate, and modify the <Project Name> codebase.`

## Rules

- **Information-dense**: Use tables, bullets, one-line descriptions
- **No redundancy**: Each piece of information lives in exactly one file
- **Preserve format**: Do not change section structure or table formats
- **Canonical source**: `project-nav.md` is the single source of truth for project overview, architecture, and navigation
- **Language-agnostic**: Adapt to the project's language and ecosystem
- **Include only applicable sections**: Server, Plugins, UI, and Apps sections are optional — include only if the project has them
