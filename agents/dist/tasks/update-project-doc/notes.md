# Notes: update-project-doc

## Context
This task was created from the `create-project-docs` skill. It standardizes the process of creating AI agent navigation documentation for any project.

## Source Skill
- Original skill: `/workspace/agent-smith-plugins/agents/dist/skills/create-project-docs/SKILL.md`

## Key Rules to Remember
- **No redundancy**: Each piece of information lives in exactly one file
- **codebase-summary.md core format**: 7 sections (Summary, Dependencies, Used By, Entry Point, Key Files, Architecture, Related) — do not change order or rename
- **Information-dense**: Keep files short. Use tables, bullets, one-line descriptions
- **project-nav.md is canonical**: Single source of truth for project overview, architecture, snippets, quick references
- **decision-tree.md first**: Always the first file agents should read to find the right doc
- **Language-agnostic**: Adapt examples and conventions to the project's language

## Multi-Repo vs Single-Repo
- **Single-repo projects**: All 5 files (AGENTS.md, decision-tree.md, project-overview.md, project-nav.md, codebase-summary.md) live at the project root
- **Multi-repo projects**: 
  - Workspace root: AGENTS.md, decision-tree.md, project-overview.md, project-nav.md
  - Each repo: its own AGENTS.md (localized context) and codebase-summary.md
  - Per-repo AGENTS.md structure: Mission, Structure (key dirs), Conventions (repo-specific), Quick Start, Documentation (links to local docs + root AGENTS.md)

## Related Skills (to load during execution)
| Skill | When to Use |
|-------|-------------|
| `smart-explore` | Phase 1 — explore project with exclusion patterns to avoid reading noise (node_modules, etc.) |
| `update-codebase-summary` | Phase 5 — create/update each module's codebase-summary.md |
| `update-project-nav` | Phase 6 — create/update project-nav.md |

## Optional Sections (include only when they add value)
- decision-tree.md: "I need to work on a specific package" for monorepos
- project-overview.md: "Runtime Packages" table for monorepos
- codebase-summary.md: "Documentation" section — project root only
- project-nav.md: Server, Plugins, UI, Apps sections
