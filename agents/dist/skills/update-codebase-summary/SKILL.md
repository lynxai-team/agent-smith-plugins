---
name: update-codebase-summary
description: use when asked to create or update the codebase summary documentation for a module or package
---
# Update Codebase Summary

Workflow to create or update a codebase summary file (`.agents/documentation/codebase-summary.md`) for any module, package, or repository.

## Workflow

1. **Explore the module** — Walk the directory tree, identify entry points, read manifest files (e.g., `package.json`, `setup.py`, `Cargo.toml`), locate key source files, and understand dependencies.

2. **Check for existing file** — Look for `.agents/documentation/codebase-summary.md` in the module directory. If it exists, update it. If not, create it.

3. **Write the file** using exactly these 7 sections in this order:

### Section Format

```markdown
# <module-name>

## Summary
One sentence: what the module does and why it exists.

## Dependencies
- `<dep-module>` — key types, functions, or services used
- External: `<library>` (<purpose>)

## Used By
- `<consumer-module>` — why it uses this module

## Entry Point
- `<path>` — one-line description of what it exports or provides

## Key Files
| File | Purpose |
|------|---------|
| `<src/path>` | One-line: what the file does conceptually |

## Architecture
- 2–4 terse bullets on main design patterns and data flow (machine-readable, no prose)

## Related
- See `<related-module>` — how they work together (pointer only)
```

## De-Duplication Constraints (ownership map)

- **Summary**: one line only — do not restate the mission or capabilities from `AGENTS.md` / `project-overview.md`.
- **Architecture**: terse bullets only. Full architecture prose and conventions live in `project-nav.md` § Key Conventions & Patterns — point there when more detail is needed; never copy them here.
- **Related**: pointers to sibling modules and root docs only.
- **No "Documentation" section** — the internal doc map lives in `AGENTS.md`; external links live only in `project-nav.md` § Documentation Links.
- **No project description** — that belongs in `project-overview.md`.

## Rules

- **Preserve format**: The 7-section structure is standardized — do not change it.
- **Information-dense**: Keep the file short and condensed; tables, bullets, one-line descriptions.
- **Repo-relative paths**: use repo-relative paths (no `</workspace/.../>` angle brackets).
- **Language-agnostic**: Adapt to the project's language and ecosystem.
