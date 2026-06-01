# Agent Smith Plugins

Plugins for the [Agent Smith](https://github.com/synw/agent-smith) terminal client. This repository contains a collection of feature extensions organized into four categories: **Documentation**, **Code Management**, **System Utilities**, and **Web Capabilities**.

### Documentation for Humans

- **Full Documentation**: [https://synw.github.io/agent-smith/plugins](https://synw.github.io/agent-smith/plugins) — Complete plugin documentation for users
- **Core Framework**: [Agent Smith](https://github.com/synw/agent-smith) — Runtime, CLI, and core packages

### Documentation for AI Agents

- [AGENTS.md](./AGENTS.md): entrypoint for navigation
- [.agents/documentation/codebase-summary.md](./.agents/documentation/codebase-summary.md): codebase navigation

## Plugins Overview

### 📝 Documentation

| Plugin | Description | Documentation |
|--------|-------------|---------------|
| **autodoc** | AI-powered documentation Q&A system. Loads pre-packaged documentation fragments and answers questions using the qwen35b model with 32k context window. | [doc](https://synw.github.io/agent-smith/plugins/autodoc) |

### 💻 Code Management

| Plugin | Description | Documentation |
|--------|-------------|---------------|
| **git** | Git operations with AI-powered commit message generation. Supports diff analysis, commit workflows, and package-specific commits through 9 specialized agents. | [doc](https://synw.github.io/agent-smith/plugins/code/git) |
| **sqlite** | SQLite database operations including schema extraction, read-only queries, and confirmed read/write execution. Features workflow orchestration with AI agent support. | [doc](https://synw.github.io/agent-smith/plugins/code/sqlite) |

### ⚙️ System Utilities

| Plugin | Description | Documentation |
|--------|-------------|---------------|
| **fs** | Filesystem operations (read, write, list directories) with path authorization security checks. Provides read-only and read/write agent configurations for safe file interaction. | [doc](https://synw.github.io/agent-smith/plugins/filesystem) |
| **shell** | Sandboxed command execution in Docker containers using SimpleBox (general shell) and CodeBox (Python). Includes security evaluation, complexity routing, and script generation tasks. | [doc](https://synw.github.io/agent-smith/plugins/shell) |

### 🌐 Web Capabilities

| Plugin | Description | Documentation |
|--------|-------------|---------------|
| **search** | Multi-backend web search with support for DuckDuckGo, smolagents, crawl4ai (with JS rendering), and Wikipedia. Includes browser automation via Playwright and inference augmentation agents. | [doc](https://synw.github.io/agent-smith/plugins/search) |
| **video** | YouTube video transcript extraction and AI chat interaction over video content. Supports configurable model parameters for transcript-based conversations. | [doc](https://synw.github.io/agent-smith/plugins/video) |

---

## Architecture Highlights

- **Plugin-based extensibility**: Each plugin is an independent package that registers commands, actions, agents, or tasks with the Agent Smith CLI framework via YAML definitions.

- **Workflow orchestration**: Plugins use YAML-defined workflows to chain actions (shell/DB/search operations) with AI agents (LLM-based generation), enabling multi-step pipelines.

- **Security-first design**: 
  - System plugins enforce path authorization (`fs` plugin)
  - Sandboxed execution via Docker containers (`shell` plugin)
  - Read-only modes and user confirmation prompts for write operations (`sqlite` plugin)

- **Multi-backend support**: Search plugin provides redundant search backends (DuckDuckGo, smolagents, crawl4ai, Wikipedia) with agent-driven orchestration.

## Dependencies

All plugins depend on:
- `@agent-smith/core` — Workflow execution engine, agent runtime, framework integration
- `@agent-smith/cli` — CLI runtime and utilities (used by autodoc, git, sqlite, fs, shell)

## Related Repositories

- [`@agent-smith/core`](https://github.com/synw/agent-smith) — Core framework providing workflow engine, agent runtime, and tool integration
- [`@agent-smith/cli`](https://github.com/synw/agent-smith) — Terminal client that consumes these plugins
