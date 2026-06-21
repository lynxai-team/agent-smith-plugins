# Task Plan: update-project-doc

## Phase 1: Explore the Project
**Goal:** Understand the project structure, identify repos/packages, entry points, dependencies, and key conventions.

### Step 1.0: Load smart-explore Skill
- **File:** N/A
- **Action:** Load the `smart-explore` skill to get standardized exploration workflow with exclusion patterns
- **Verify:** Skill loaded successfully

### Step 1.05: Check Recent Changes
- **For each repository in the project**, cd into its directory and run git commands (each repo has its own `.git`):
  - `cd /path/to/repo && git log --oneline -10` to see recent commits
  - `git diff HEAD~10` to identify code changes in that repo
- Repeat for every repo (e.g., `agent-smith`, `agent-smith-plugins`, `agent-smith-ui`, etc.)
- Focus exploration on modified files identified in the diffs
- **Verify:**
  - [ ] Git commands run in each repo directory separately
  - [ ] Recent commits reviewed for all repos
  - [ ] Changed files cataloged per repo
  - [ ] New/modified types, interfaces, or features identified

### Step 1.1: Walk Directory Tree (with exclusions)
- **File:** N/A (exploration)
- **Action:** Follow the `smart-explore` skill: detect project type, read `.gitignore`, walk directory tree with default exclusions (node_modules, .git, dist, build, vendor, __pycache__, etc.)
- **Verify:** List of all repos/packages with their paths and purposes documented; no noise directories in results

### Step 1.2: Read Manifest Files
- **File:** N/A (exploration)
- **Action:** For each repo/package discovered, read its manifest file (package.json, pyproject.toml, Cargo.toml, etc.) to understand dependencies and structure
- **Verify:** All packages identified with their manifest files read

### Step 1.3: Identify Conventions
- **File:** N/A (exploration)
- **Action:** Identify key conventions and patterns used by the project (tool formats, file structures, state management, coordinator patterns, etc.)
- **Verify:** 3-5 key conventions identified and documented for reference

---

## Phase 2: Create AGENTS.md (Project Root)
**Goal:** Create the root index file with mission, conventions, quick start, and doc links.

### Step 2.1: Write AGENTS.md Structure
- **File:** `AGENTS.md` at project root
- **Action:** Create AGENTS.md with exact structure:
  - `# <Project Name>` header
  - `## Mission` — One-line mission statement
  - `## Repositories` — Table with repo name, path, purpose
  - `## Conventions (for AI Agents)` — 3-5 key patterns
  - `## Quick Start for AI Agents` — Always: decision-tree → project-overview → project-nav → codebase-summary
  - `## Documentation` — List all doc files with descriptions
- **Verify:** File exists at project root with all required sections; mission is one concise sentence; conventions list 3-5 patterns

### Step 2.2: Validate AGENTS.md
- **File:** `AGENTS.md`
- **Action:** Review that all repos are listed, conventions are clear for AI agents, quick start references decision-tree.md first
- **Verify:** All sections present and complete; cross-references point to correct files

---

## Phase 3: Create Per-Repo AGENTS.md (Multi-Repo Projects Only)
**Goal:** Create an AGENTS.md file in each repository so agents navigating directly to a repo have localized context.

### Step 3.1: Write Per-Repo AGENTS.md
- **File:** `<repo>/AGENTS.md` for each repo (skip for single-repo projects)
- **Action:** For each repo, create AGENTS.md with structure:
  - `# <Repo Name>` header
  - `## Mission` — One-line mission statement for this specific repo
  - `## Structure` — Table of key directories and their purposes
  - `## Conventions` — Repo-specific conventions (subset of or additions to root conventions)
  - `## Quick Start` — Steps: read codebase-summary.md → explore key files → run/build
  - `## Documentation` — Links to this repo's docs: `.agents/documentation/codebase-summary.md`, and link back to root `../../AGENTS.md` for project-wide context
- **Verify:** Each repo has its own AGENTS.md; all sections present; links to root AGENTS.md exist

### Step 3.2: Validate Per-Repo AGENTS.md
- **File:** All `<repo>/AGENTS.md` files
- **Action:** Ensure each file is self-contained for agents working in that repo; cross-references to root docs are correct; no duplicated content from root AGENTS.md
- **Verify:** All repos covered; content is repo-specific; links valid

---

## Phase 4: Create decision-tree.md (Project Root Only)
**Goal:** Create a quick guide helping agents find the right documentation based on their task.

### Step 4.1: Write decision-tree.md
- **File:** `.agents/documentation/decision-tree.md` at project root
- **Action:** Create with structure:
  - `# Documentation Decision Tree` header with intro note
  - `## I need to understand the project` — Links to overview, nav, summary
  - `## I need to work on a specific repo/package` — Per-repo paths
  - Optional: `## I need to work on a specific package` for monorepos
  - `## I need detailed documentation` — Topic-to-path mapping
  - `## Common Tasks (Quick Reference)` — Table of tasks → paths
  - `## Conventions` — Brief reference linking to AGENTS.md
- **Verify:** File exists with all sections; ends with link to AGENTS.md for full conventions

### Step 4.2: Validate decision-tree.md
- **File:** `.agents/documentation/decision-tree.md`
- **Action:** Ensure all doc files are referenced; Common Tasks table is populated; references AGENTS.md at end
- **Verify:** All paths correct; no broken references

---

## Phase 5: Create project-overview.md (Project Root Only)
**Goal:** Create a concise ~1 page overview of the project.

### Step 5.1: Write project-overview.md
- **File:** `.agents/documentation/project-overview.md` at project root
- **Action:** Create with structure:
  - Header with `> Role:` note and `> See also:` references to decision-tree.md and project-nav.md
  - `## What is <Project Name>?` — One paragraph description
  - `## Core Capabilities` — Bullet list of capabilities
  - `## Repository Structure` — Table of repos
  - Optional: `## Runtime Packages` for monorepos
  - `## Key Architecture Patterns` — Bullet list
  - `## Quick Reference: Common Tasks` — Task-to-path table
  - `## Code Snippets` — Typical usage examples
  - `## Documentation Links` — Resource table
- **Verify:** File is ~1 page; all sections present; header notes reference decision-tree.md and project-nav.md

### Step 5.2: Validate project-overview.md
- **File:** `.agents/documentation/project-overview.md`
- **Action:** Ensure content is concise; code snippets show typical usage; no duplicated content from other files
- **Verify:** File fits ~1 page; cross-references correct; no redundancy with project-nav.md

---

## Phase 6: Create codebase-summary.md (Every Repo/Module)
**Goal:** Create standardized technical summaries for each repo/module using the `update-codebase-summary` skill.

### Step 6.1: Load update-codebase-summary Skill
- **File:** N/A
- **Action:** Load the `update-codebase-summary` skill to get the standardized 7-section format
- **Verify:** Skill loaded successfully

### Step 6.2: Create codebase-summary.md for Each Repo
- **File:** `<repo>/.agents/documentation/codebase-summary.md` for each repo/module
- **Action:** For each repo/module, create codebase-summary.md with 7 core sections:
  1. Summary
  2. Dependencies
  3. Used By
  4. Entry Point
  5. Key Files
  6. Architecture
  7. Related
- **Note:** Include optional "Documentation" section ONLY in the project root codebase-summary.md — omit from per-repo summaries
- **Verify:** Each repo has a codebase-summary.md with all 7 sections; no Documentation section in per-repo files

### Step 6.3: Validate All codebase-summary.md Files
- **File:** All `.agents/documentation/codebase-summary.md` files
- **Action:** Verify each file follows the standardized format; Related section points to correct modules
- **Verify:** All repos covered; sections in correct order; no renamed sections

---

## Phase 7: Create project-nav.md (Project Root Only)
**Goal:** Create comprehensive navigation map using the `update-project-nav` skill.

### Step 7.1: Load update-project-nav Skill
- **File:** N/A
- **Action:** Load the `update-project-nav` skill to get required and optional sections
- **Verify:** Skill loaded successfully

### Step 7.2: Create project-nav.md
- **File:** `.agents/documentation/project-nav.md` at project root
- **Action:** Create with required sections:
  - Header note: `> Purpose: Single-reference map for AI coding agents...`
  - `## Project Overview`
  - `## Architecture Principles`
  - `## Dependency Graph`
  - `## Packages/Modules`
  - `## Code Snippets`
  - `## Navigation Quick Reference`
  - `## Documentation Links`
  - `## Key Conventions & Patterns`
  - Optional sections (Server, Plugins, UI, Apps) — include only if applicable; number sequentially skipping omitted ones
- **Verify:** File exists with all required sections; header note present; sections numbered correctly

### Step 7.3: Validate project-nav.md
- **File:** `.agents/documentation/project-nav.md`
- **Action:** Ensure it's the canonical source for overview, architecture, snippets, quick references; no external cross-references needed
- **Verify:** All sections complete; optional sections included only when they add value

---

## Phase 8: Cross-Reference and Verify
**Goal:** Ensure all files cross-reference correctly and no content is duplicated.

### Step 8.1: Verify Cross-References
- **File:** All doc files
- **Action:** Check cross-references:
  - Root `AGENTS.md` → links to decision-tree.md, project-overview.md, project-nav.md, codebase-summary.md, and per-repo AGENTS.md files
  - Per-repo `AGENTS.md` → links to local codebase-summary.md; links back to root `../../AGENTS.md` for project-wide context
  - `decision-tree.md` → references all doc files; ends with link to root AGENTS.md
  - `project-overview.md` → header notes reference decision-tree.md and project-nav.md
  - `codebase-summary.md` → Related section points to related modules
  - `project-nav.md` → no external cross-references needed
- **Verify:** All cross-references exist and point to correct files

### Step 8.2: Check for Duplicated Content
- **File:** All doc files
- **Action:** Ensure no redundancy:
  - Project description, architecture patterns, snippets, quick-reference tables → ONLY in project-nav.md and project-overview.md
  - Per-module technical details → ONLY in codebase-summary.md
  - Conventions summary → ONLY in AGENTS.md; decision-tree.md references it
  - Per-repo context → ONLY in per-repo AGENTS.md files
- **Verify:** No duplicated content across files

### Step 8.3: Final Review
- **File:** All doc files
- **Action:** Confirm all success criteria from goals.md are met
- **Verify:** All checkboxes in goals.md can be marked complete
