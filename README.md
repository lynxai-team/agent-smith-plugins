# Agent Smith Plugins

Plugins for the [Agent Smith](https://github.com/lynxai-team/agent-smith) terminal client. This repository contains a collection of feature extensions organized into four categories: **AI Agents**, **Code Management**, **System Utilities**, and **Web Capabilities**.

### Documentation for Humans

- **Full Documentation**: [https://lynxai-team.github.io/agent-smith/plugins](https://lynxai-team.github.io/agent-smith/plugins) — Complete plugin documentation for users
- **Core Framework**: [Agent Smith](https://github.com/lynxai-team/agent-smith) — Runtime, CLI, and core packages

### Documentation for AI Agents

- [AGENTS.md](./AGENTS.md): entrypoint for navigation
- [.agents/documentation/codebase-summary.md](./.agents/documentation/codebase-summary.md): codebase navigation

## Plugins Overview

### 🤖 AI Agents

| Plugin | Version | Description | Documentation |
|--------|---------|-------------|---------------|
| **agents** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-agents)](https://www.npmjs.com/package/@agent-smith/feat-agents) | Multi-agent coordination system with 16 specialized agents (coordinator, search, code, doc, sql, help variants), 4 workflows, and 15+ skills for task management. Provides context helper fragments and collaborative agent orchestration. | [doc](https://lynxai-team.github.io/agent-smith/plugins/agents) |

### 💻 Code Management

| Plugin | Version | Description | Documentation |
|--------|---------|-------------|---------------|
| **git** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-git)](https://www.npmjs.com/package/@agent-smith/feat-git) | Git operations with AI-powered commit message generation. Supports diff analysis, commit workflows, and package-specific commits through 9 specialized agents. | [doc](https://lynxai-team.github.io/agent-smith/plugins/code/git) |
| **sqlite** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-sqlite)](https://www.npmjs.com/package/@agent-smith/feat-sqlite) | SQLite database operations including schema extraction, read-only queries, and confirmed read/write execution. Features workflow orchestration with AI agent support. | [doc](https://lynxai-team.github.io/agent-smith/plugins/code/sqlite) |

### ⚙️ System Utilities

| Plugin | Version | Description | Documentation |
|--------|---------|-------------|---------------|
| **fs** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-fs)](https://www.npmjs.com/package/@agent-smith/feat-fs) | Filesystem operations (read, write, list directories) with path authorization security checks. Provides read-only and read/write agent configurations for safe file interaction. | [doc](https://lynxai-team.github.io/agent-smith/plugins/filesystem) |
| **shell** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-shell)](https://www.npmjs.com/package/@agent-smith/feat-shell) | Sandboxed command execution in Docker containers using SimpleBox (general shell) and CodeBox (Python). Includes security evaluation, complexity routing, and script generation tasks. | [doc](https://lynxai-team.github.io/agent-smith/plugins/shell) |

### 🌐 Web Capabilities

| Plugin | Version | Description | Documentation |
|--------|---------|-------------|---------------|
| **search** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-search)](https://www.npmjs.com/package/@agent-smith/feat-search) | Multi-backend web search with support for DuckDuckGo, smolagents, crawl4ai (with JS rendering), and Wikipedia. Includes browser automation via Playwright and inference augmentation agents. | [doc](https://lynxai-team.github.io/agent-smith/plugins/search) |
| **video** | [![npm](https://img.shields.io/npm/v/@agent-smith/feat-video)](https://www.npmjs.com/package/@agent-smith/feat-video) | YouTube video transcript extraction and AI chat interaction over video content. Supports configurable model parameters for transcript-based conversations. | [doc](https://lynxai-team.github.io/agent-smith/plugins/video) |

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

Plugins have varying dependencies based on their functionality:
- **git**: Uses `@agent-smith/cli`, `commander`, `@inquirer/prompts`, `@inquirer/select`
- **sqlite**: Uses `@agent-smith/cli`, `better-sqlite3`, `@inquirer/prompts`, `@inquirer/select`
- **fs**: Uses Node.js built-in modules (`fs`, `path`)
- **shell**: Uses `@boxlite-ai/boxlite` for Docker containerized execution
- **search**: Uses `ddgs`, `smolagents`, `crawl4ai`, `playwright`, `youtube_transcript_api`
- **video**: Uses `youtube_transcript_api`
- **agents**: No external dependencies — agents, workflows, and skills are loaded by the core framework

## Related Repositories

- [`@agent-smith/core`](https://github.com/lynxai-team/agent-smith) — Core framework providing workflow engine, agent runtime, and tool integration
- [`@agent-smith/cli`](https://github.com/lynxai-team/agent-smith) — Terminal client that consumes these plugins
