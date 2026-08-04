# agent-smith-plugins

## Mission
Plugin packages for Agent Smith CLI — shell, filesystem, git, sqlite, web search, video, and AI agent coordination.

## Structure

| Directory | Purpose |
|-----------|---------|
| `agents/` | @agent-smith/feat-agents — Multi-agent coordination (16 agents, 4 workflows, 15+ skills) |
| `system/shell/` | @agent-smith/feat-shell — Sandboxed shell/Python execution via Docker (SimpleBox/CodeBox) |
| `system/fs/` | @agent-smith/feat-fs — Filesystem operations with path authorization |
| `code/git/` | @agent-smith/feat-git — Git operations with AI-powered commit message generation |
| `code/sqlite/` | @agent-smith/feat-sqlite — SQLite database operations (read-only and confirmed read/write) |
| `web/search/` | @agent-smith/feat-search — Multi-backend web search (DuckDuckGo, crawl4ai, Wikipedia) |
| `web/video/` | @agent-smith/feat-video — YouTube transcript extraction and video chat |

## Conventions
- **Independent npm packages**: Each plugin is published as `@agent-smith/feat-*` with ESM-only TypeScript (`"type": "module"`)
- **YAML-driven registration**: Plugins register commands, actions, agents, and tasks via YAML definitions consumed by `@agent-smith/core`
- **`tsc` build**: All plugins build with `rm -rf dist/* && tsc` → `dist/` output with `.d.ts` declarations
- **Security-first**: path authorization (fs), Docker sandboxing (shell), read-only modes + confirmation prompts (sqlite)
- **Multi-backend pattern**: search plugin provides redundant backends (DuckDuckGo, smolagents, crawl4ai, Wikipedia) with agent-driven orchestration

## Quick Start for AI Agents
1. Read `.agents/documentation/codebase-summary.md` for technical summary
2. Explore key files listed in codebase-summary.md
3. Build a plugin: `cd <plugin-dir> && rm -rf dist/* && tsc`

## Documentation
- `.agents/documentation/codebase-summary.md` — Technical summary of this repo
- `../../AGENTS.md` — Project-wide context and conventions (workspace root)