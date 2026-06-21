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

- 🤖 **Coordinator Agent** — Central `agent-smith` agent that decomposes tasks, plans workflows, and delegates to specialized agents via tool calls
- 🔍 **16 Specialized Agents** — Pre-configured agents for search, code, documentation, SQL queries, assistance, help, state tracking, project management, and collaboration
- ⚡ **4 Workflows** — YAML-defined pipelines for config info retrieval, database queries, Q&A sessions, and vision tasks
- 📋 **15+ Reusable Skills** — Task creation/execution (solo/team), documentation updates, codebase summaries, and project management
- 🧩 **Context Fragments** — Workspace context helpers that provide agents with project structure awareness
- 🔗 **Agent Delegation** — Coordinator calls specialized agents sequentially via the `run-agent` tool
- 🎯 **Model Flexibility** — Supports all compatible LLM models (qwen35b, qwen4b, etc.) with configurable inference parameters
- 🛡️ **Security Patterns** — Agents operate within a specified workspace directory with controlled tool access

---

## 📦 Installation

```bash
# Install globally via npm
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
lm conf
```

---

## 🚀 Quick Start

Launch the main coordinator agent:

```bash
lm agent-smith "Create documentation for my project"
```

The coordinator will automatically decompose your request and delegate to specialized agents as needed.

For direct inference (bypassing coordination):

```bash
lm infer "Explain how multi-agent coordination works"
```

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
| `agent-smith-search` | Web search and webpage reading — uses ddsearch, read-webpage tools |
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
| `agent-smith-config-info` | Configuration information retrieval workflows |
| `agent-smith-db` | Database query orchestration with SQL agent |
| `q` | Q&A workflow — adapts pre-query then runs inference agent |
| `vision` | Vision tasks workflow for image/video analysis |

Execute a workflow:

```bash
lm workflow agent-smith-config-info
```

---

## 🛠️ Skills Reference

The plugin provides 15+ reusable skills for AI coding agents, loaded via the `load-skill` tool.

### Task Creation
| Skill | Description |
|-------|-------------|
| `create-task` | Entry point — analyzes request, chooses execution mode, creates task |
| `create-task-solo` | Single-agent task creation |
| `create-task-team` | Multi-agent team task creation |
| `create-task-from-template` | Create tasks from predefined templates |
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

### Exploration
| Skill | Description |
|-------|-------------|
| `smart-explore` | Navigate and explore module directory trees efficiently |

---

## 📋 Tasks Reference

The plugin includes pre-defined tasks — structured work units with goals, plans, and progress tracking for complex multi-step operations. Use the `load-task` tool to load a task into your workspace, then execute it with the appropriate skill.

| Task | Description | Mode | Phases |
|------|-------------|------|--------|
| `update-project-doc` | Create or update AI agent navigation documentation for a project (AGENTS.md, decision-tree.md, codebase-summary.md, project-nav.md, etc.) | Solo | 8 phases: Explore → AGENTS.md → Per-Repo AGENTS.md → decision-tree → project-overview → codebase-summary → project-nav → Cross-Reference |

### Using Tasks

Prompt to execute a task:

```
execute the update-project-doc

%execute-task-solo
```

The `%execute-task-solo` part loads this skill directly in the prompt, so that the agent has all the execution instructions.
Use `%execute-task-team` for multi agents tasks. Note: the agent must have the `load-task` tool. When it uses it the task directory is copied to `.agents/tasks/[task-name]` and it's execution and state will be managed from there.

The agent will execute phases sequentially, verify success criteria after each step, and update `state.md` to track progress.

### Task Structure

Each task contains:
- `goals.md` — Goals and success criteria
- `plan.md` — Step-by-step execution plan with verifiable success criteria
- `state.md` — Progress tracking (updated after each phase)
- `notes.md` — Optional context, rules, and related skills

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
    │   ├── agent-smith-code.yml
    │   ├── agent-smith-doc.yml
    │   ├── agent-smith-sql.yml
    │   ├── agent-smith-help.yml
    │   └── ... (16 total)
    ├── workflows/                  # 4 workflow definitions
    │   ├── agent-smith-config-info.yml
    │   ├── agent-smith-db.yml
    │   ├── q.yml
    │   └── vision.yml
    ├── skills/                     # 15+ skill modules
    │   ├── create-readme/SKILL.md
    │   ├── create-task/SKILL.md
    │   ├── smart-explore/SKILL.md
    │   └── ... (16 total)
    ├── tasks/                      # Pre-defined task definitions
    │   └── update-project-doc/     # Project documentation task
    │       ├── goals.md
    │       ├── plan.md
    │       ├── state.md
    │       └── notes.md
    └── fragments/                  # Context helper files
        ├── workspace.md            # Workspace context info
        └── ctx-helper-files.md     # Context file references
```

---

## 🔧 Architecture

### Agent Coordination Pattern

The `agent-smith` coordinator agent follows a structured workflow:

1. **Analyze** the user request
2. **Decompose** into subtasks if necessary
3. **Plan** the work sequence
4. **Delegate** to specialized agents via `run-agent` tool (one at a time)
5. **Synthesize** results from agent responses

### Available Tools

Agents have access to these tools:

| Tool | Description |
|------|-------------|
| `readfile` | Read file contents |
| `edit-search-replace` | Search and replace in files |
| `shell` | Execute shell commands |
| `python` | Execute Python code |
| `run-agent` | Call other agents for delegated work |
| `load-skill` | Load skill modules for specific tasks |
| `load-task` | Load task definitions for complex operations |
| `notify-user` | Send notifications to the user |

### Context Fragments

Agents can include project context using file references in YAML:

```yaml
template:
    system: |-
      {file:../fragments/workspace.md}
      {file:../fragments/ctx-helper-files.md}
```

### Sample Agent Definition

Each agent is defined as a YAML file:

```yaml
name: infer
description: Run a raw inference query
type: "agent-smith"
prompt: |-
    {prompt}
model: qwen4b
inferParams:
  top_p: 0.95
  top_k: 20
  min_p: 0
  temperature: 0.6
  repeat_penalty: 1
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

### Customizing Agent Behavior

To customize an agent, copy the YAML from `dist/agents/` to your local features directory and modify it. The coordinator uses a system prompt that lists available agents and their purposes:

```yaml
template:
    system: |-
      You are Agent Smith, an AI coordinator agent. Your job is to organise
      the workflow of other agents. Available agents:
      - `agent-smith-assistant`: default assistant
      - `agent-smith-search`: web search and reading
      {file:../fragments/workspace.md}
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
| [`@agent-smith/feat-shell`](https://www.npmjs.com/package/@agent-smith/feat-shell) | Sandboxed shell/Python execution in Docker containers |
| [`@agent-smith/feat-fs`](https://www.npmjs.com/package/@agent-smith/feat-fs) | Filesystem operations with path authorization |

---

## ⚠️ Important Notes

- **No runtime code** — Agents, workflows, and skills are YAML/Markdown files loaded by the `@agent-smith/core` framework at runtime
- **YAML-based configuration** — All agent definitions use YAML for easy customization
- **Sequential delegation** — The coordinator calls one agent at a time for task completion
- **Model flexibility** — Supports all compatible LLM models with configurable inference parameters
- **Workspace context** — Agents operate within a specified workspace directory (required variable)
- **Requires core framework** — This plugin depends on `@agent-smith/core` for execution

---

## 📄 License

MIT
