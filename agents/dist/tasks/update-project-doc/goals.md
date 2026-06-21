# Goals and Success Criteria: update-project-doc

## Primary Goal
Create or update AI agent navigation documentation for a project. Generate standardized doc files that help AI agents understand, navigate, and work within the codebase.

## Success Criteria
- [ ] AGENTS.md created at project root with mission, conventions, quick start, and doc links
- [ ] AGENTS.md created in each repo (multi-repo projects) with localized context
- [ ] decision-tree.md created at project root with task-to-doc mapping
- [ ] project-overview.md created at project root (~1 page overview)
- [ ] codebase-summary.md created for every repo/module with 7-section format
- [ ] project-nav.md created at project root with comprehensive navigation map
- [ ] All files cross-reference each other correctly
- [ ] No duplicated content across files — each piece of info lives in exactly one file

## Files Modified
- `AGENTS.md` — Project root index with mission, conventions, quick start
- `<repo>/AGENTS.md` — Per-repo index with localized context (multi-repo only)
- `.agents/documentation/decision-tree.md` — Quick guide for agents to find the right doc
- `.agents/documentation/project-overview.md` — Concise project overview (~1 page)
- `.agents/documentation/codebase-summary.md` — Technical summary per repo/module
- `.agents/documentation/project-nav.md` — Comprehensive navigation map

## Exclusions
- Does not create package-level documentation for docsite (use `document-package` skill)
- Does not regenerate the documentation map script (use `update-doc-map` skill)
- Not for adding new features or modifying code
