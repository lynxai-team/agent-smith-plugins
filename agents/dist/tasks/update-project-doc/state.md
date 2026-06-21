# Task State: update-project-doc

## Status: planned

## Phases
- [ ] Phase 1: Explore the Project
  - [ ] Step 1.0: Load smart-explore Skill
  - [ ] Step 1.1: Walk Directory Tree (with exclusions)
  - [ ] Step 1.2: Read Manifest Files
  - [ ] Step 1.3: Identify Conventions
- [ ] Phase 2: Create AGENTS.md (Project Root)
  - [ ] Step 2.1: Write AGENTS.md Structure
  - [ ] Step 2.2: Validate AGENTS.md
- [ ] Phase 3: Create Per-Repo AGENTS.md (Multi-Repo Projects Only)
  - [ ] Step 3.1: Write Per-Repo AGENTS.md
  - [ ] Step 3.2: Validate Per-Repo AGENTS.md
- [ ] Phase 4: Create decision-tree.md (Project Root Only)
  - [ ] Step 4.1: Write decision-tree.md
  - [ ] Step 4.2: Validate decision-tree.md
- [ ] Phase 5: Create project-overview.md (Project Root Only)
  - [ ] Step 5.1: Write project-overview.md
  - [ ] Step 5.2: Validate project-overview.md
- [ ] Phase 6: Create codebase-summary.md (Every Repo/Module)
  - [ ] Step 6.1: Load update-codebase-summary Skill
  - [ ] Step 6.2: Create codebase-summary.md for Each Repo
  - [ ] Step 6.3: Validate All codebase-summary.md Files
- [ ] Phase 7: Create project-nav.md (Project Root Only)
  - [ ] Step 7.1: Load update-project-nav Skill
  - [ ] Step 7.2: Create project-nav.md
  - [ ] Step 7.3: Validate project-nav.md
- [ ] Phase 8: Cross-Reference and Verify
  - [ ] Step 8.1: Verify Cross-References
  - [ ] Step 8.2: Check for Duplicated Content
  - [ ] Step 8.3: Final Review

## Notes
- Read `notes.md` for additional context, rules, and related skills
- Next: Phase 1, Step 1.1
- This task creates documentation to help AI agents navigate a codebase
- Execute phases in order — each phase depends on the previous one
- Load `update-codebase-summary` skill during Phase 5
- Load `update-project-nav` skill during Phase 6
