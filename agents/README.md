# @agent-smith/feat-agents

[![npm](https://img.shields.io/npm/v/@agent-smith/feat-agents)](https://www.npmjs.com/package/@agent-smith/feat-agents)

**Multi-agent coordination system for the Agent Smith toolkit** — 16 specialized AI agents, 4 workflows, and 15+ reusable skills for task management and project automation.

This package is part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) project, a TypeScript toolkit for running and managing AI agents.

---

## 📖 Documentation

### For AI Agents
- [Codebase Summary](../.agents/documentation/codebase-summary.md) — Architecture, agent definitions, skills, and patterns for the agents plugin
- [Project Navigation](../../.agents/documentation/project-nav.md) — Map of all Agent Smith repositories and plugins

### For Humans
- [Plugin Overview](https://lynxai-team.github.io/agent-smith/plugins/) — Complete plugin documentation
- [GitHub Repository](https://github.com/lynxai-team/agent-smith-plugins) — Source code and contributions

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Coordinator Agent** | Central `agent-smith` agent that decomposes tasks, plans workflows, and delegates to specialized agents via tool calls |
| 🔍 **Specialized Agents** | 16 pre-configured agents for search, code, documentation, SQL queries, assistance, and help scenarios |
| ⚡ **Workflow Orchestration** | 4 YAML-defined workflows for config info, database queries, Q&A sessions, and vision tasks |
| 📋 **Task Management Skills** | 15+ reusable skills for task creation, execution (solo/team), documentation updates, and project management |
| 🧩 **Context Fragments** | Workspace context helpers that provide agents with project structure awareness |
| 🔗 **Agent Delegation** | Coordinator can call specialized agents sequentially using the `run-agent` tool |
| 🎯 **Model Flexibility** | Supports all compatible LLM models with configurable inference parameters |

---

## 📦 Installation

```bash
# Install via npm (as part of agent-smith-plugins)
npm i -g @agent-smith/feat-agents
```

### Configuration

Add the plugin to your `config.yml`:

```yaml
plugins:
  - "@agent-smith/feat-agents"
```

Then update your client configuration:

```bash
lm conf ~/.agent-smith/features/config.yml
```

---

## 🚀 Quick Start

Launch the main coordinator agent:

```bash
lm run-agent agent-smith "Create documentation for my project"
```

The coordinator will automatically decompose your request and delegate to specialized agents as needed.

---

## 📋 Agents Reference

### Core Agents

| Agent | Description |
|-------|-------------|
| `agent-smith` | **Main coordinator** — Orchestrates team of agents, decomposes tasks, delegates work |
| `agent-smith-assistant` | Default assistant agent — Fork of coordinator for general task execution |
| `agent-smith-light` | Lightweight agent for simpler tasks with reduced context |
| `infer` | Raw inference agent for direct LLM queries without orchestration |

### Specialized Agents

| Agent | Description |
|-------|-------------|
| `agent-smith-search` | Web search and webpage reading agent — uses ddsearch, read-webpage tools |
| `agent-smith-code` | Code management agent for programming tasks |
| `agent-smith-doc` | Documentation management agent for project docs |
| `agent-smith-sql` | Database query agent — generates SQL from natural language questions |
| `agent-smith-help` | Help agent with full capabilities |
| `agent-smith-help-light` | Lightweight help agent |
| `agent-smith-help-assistant` | Delegated work assistant for help scenarios |
| `agent-smith-state` | Project state management — checks context and documentation completeness |
| `agent-smith-project` | Project management agent |
| `agent-smith-colab` | Collaborative agent (experimental) |
| `agent-smith-doc-colab` | Documentation collaboration agent |
| `collaborator` | Worker collaborator agent for role-based tasks |

---

## 🔄 Workflows

The plugin includes 4 workflow definitions for multi-step operations:

| Workflow | Purpose |
|----------|---------|
| `agent-smith-config-info.yml` | Configuration information retrieval workflows |
| `agent-smith-db.yml` | Database query orchestration with SQL agent |
| `q.yml` | Q&A workflow — adapts pre-query then runs inference agent |
| `vision.yml` | Vision tasks workflow for image/video analysis |

Workflows are YAML-defined pipelines that chain actions with AI agents, enabling complex multi-step operations.

---

## 🛠️ Skills Reference

The plugin provides 15+ reusable skills for AI coding agents:

### Task Creation
| Skill | Description |
|-------|-------------|
| `create-task` | Entry point — analyzes request, chooses execution mode, creates task |
| `create-task-solo` | Single-agent task creation |
| `create-task-team` | Multi-agent team task creation |
| `use-tasks` | Task usage and management skill |

### Task Execution
| Skill | Description |
|-------|-------------|
| `execute-task` | Task execution (uses phase-specific skills) |
| `execute-task-solo` | Single-agent task execution |
| `execute-task-team` | Multi-agent team task execution |
| `execute-task-phase` | Phase-specific execution logic |
| `task-mode` | Decision skill — evaluates task complexity to choose solo vs team mode |

### Documentation
| Skill | Description |
|-------|-------------|
| `create-readme` | Create comprehensive README files for packages/plugins/repositories |
| `document-package` | Create or update package documentation in the docsite |
| `create-project-docs` | Generate project documentation structure |
| `update-codebase-summary` | Create or update codebase summary documentation |
| `update-project-nav` | Update the project navigation map |
| `update-doc-map` | Update the documentation map |

---

## 📁 Structure

```
agents/
├── package.json                    # Plugin metadata (@agent-smith/feat-agents)
└── dist/
    ├── agents/                     # 16 agent YAML definitions
    │   ├── agent-smith.yml         # Main coordinator agent
    │   ├── agent-smith-assistant.yml
    │   ├── agent-smith-search.yml
    │   ├── agent-smith-sql.yml
    │   └── ...
    ├── workflows/                  # 4 workflow definitions
    │   ├── agent-smith-config-info.yml
    │   ├── agent-smith-db.yml
    │   ├── q.yml
    │   └── vision.yml
    ├── skills/                     # 15+ skill modules
    │   ├── create-readme/SKILL.md
    │   ├── create-task/SKILL.md
    │   ├── document-package/SKILL.md
    │   └── ...
    └── fragments/                  # Context helper files
        ├── workspace.md            # Workspace context info
        └── ctx-helper-files.md     # Context file references
```

---

## 🔧 Architecture

### Agent Coordination Pattern
The `agent-smith` coordinator agent follows a specific workflow:
1. **Analyze** the user request
2. **Decompose** into subtasks if necessary
3. **Plan** the work sequence
4. **Delegate** to specialized agents via `run-agent` tool (one at a time)
5. **Synthesize** results from agent responses

### Available Tools
Agents have access to these tools:
- `readfile` — Read file contents
- `edit-search-replace` — Search and replace in files
- `shell` — Execute shell commands
- `python` — Execute Python code
- `run-agent` — Call other agents for delegated work
- `load-skill` — Load skill modules for specific tasks
- `notify-user` — Send notifications to the user
- `ddsearch` — Web search (via DuckDuckGo)
- `read-webpage` — Read and extract webpage content

### Context Fragments
Agents can include project context using file references:
```yaml
template:
    system: |-
      {file:../fragments/workspace.md}
      {file:../fragments/ctx-helper-files.md}
```

---

## ⚙️ Configuration

### Model Parameters
Agents support configurable inference parameters:

```yaml
inferParams:
    min_p: 0
    top_k: 20
    top_p: 0.85
    temperature: 0.6
    repetition_penalty: 1
    presence_penalty: 1.5
chat_template_kwargs:
    enable_thinking: true
    preserve_thinking: true
```

### Variables
Agents can require runtime variables:

```yaml
variables:
    required:
        workspace:
            description: The local directory path where to operate
```

---

## 🔗 Related Packages

| Package | Description |
|---------|-------------|
| [`@agent-smith/core`](https://github.com/lynxai-team/agent-smith) | Core framework — workflow engine, agent runtime, tool integration |
| [`@agent-smith/cli`](https://github.com/lynxai-team/agent-smith) | Terminal client that consumes plugins |
| [`@agent-smith/feat-git`](https://www.npmjs.com/package/@agent-smith/feat-git) | Git operations with AI-powered commit messages |
| [`@agent-smith/feat-sqlite`](https://www.npmjs.com/package/@agent-smith/feat-sqlite) | SQLite database operations |
| [`@agent-smith/feat-search`](https://www.npmjs.com/package/@agent-smith/feat-search) | Web search and crawling tools (used by search agent) |

---

## 📝 Important Notes

- **No external dependencies** — Agents, workflows, and skills are loaded by the core framework
- **YAML-based configuration** — All agent definitions use YAML for easy customization
- **Sequential delegation** — The coordinator calls one agent at a time for task completion
- **Model flexibility** — Supports all compatible LLM models with configurable inference parameters
- **Workspace context** — Agents operate within a specified workspace directory

---

## 📄 License

MIT
