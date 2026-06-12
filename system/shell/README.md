# @agent-smith/feat-shell

[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-shell)](https://www.npmjs.com/package/@agent-smith/feat-shell)

**Sandboxed shell command execution and AI-powered shell command generation for the Agent Smith toolkit.**

Part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) CLI framework — secure, containerized command execution with AI assistance.

## Features

- 🛡️ **Sandboxed Execution** — All commands run in isolated Docker containers with network disabled
- 🔒 **Read-Only Mode** — Safe file inspection with `rshell` using readonly workspace mounts
- 🐍 **Python Isolation** — Execute Python code in dedicated `python:slim` containers with pip support
- 🤖 **AI Command Generation** — Smart command generation with security validation and confidence scoring
- ♻️ **Container Reuse** — Efficient container lifecycle management with graceful shutdown
- 🔗 **Workspace Integration** — Host workspace mounted at `/workspace` inside containers

## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the @agent-smith/feat-shell plugin
- [Shell Plugin Documentation](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/9.shell.md) — Complete plugin reference with tools, agents, and security guarantees

### For Humans
- [Shell Plugin](https://lynxai-team.github.io/agent-smith/plugins/shell) — Overview and usage guide for the shell plugin

## Installation

```bash
npm i -g @agent-smith/feat-shell
```

Add the plugin to your `config.yml` file:

```yaml
plugins:
  - "@agent-smith/feat-shell"
```

Then run the configuration command:

```bash
lm conf
```

## Quick Start

### Execute a Shell Command

Use the <kbd>shell</kbd> tool to run commands in a sandboxed Alpine Linux container:

```yaml
description: Run a shell command
toolsList:
  - shell
```

### Safe File Inspection

Use the <kbd>rshell</kbd> tool for read-only operations — perfect for listing files or inspecting content without risk of modification:

```yaml
description: List files safely
toolsList:
  - rshell
```

### Run Python Code

Use the <kbd>python</kbd> tool to execute Python scripts with optional package installation:

```yaml
description: Execute Python code
toolsList:
  - python
```

## Usage Patterns

### Shell Execution Tools

| Tool | Description | Container | Workspace Mount |
|------|-------------|-----------|-----------------|
| `shell` | Execute arbitrary shell commands | Alpine Linux (`timbru31/node-alpine-git`) | Read-write at `/workspace` |
| `rshell` | Execute read-only shell commands | Alpine Linux (`timbru31/node-alpine-git`) | Read-only at `/workspace` |
| `python` | Execute Python code with pip support | Python slim (`python:slim`) | Read-write at `/workspace` |

### AI-Powered Shell Agents

#### Shell Agent (`shellagent`)

A general-purpose shell agent using the qwen4b model with access to the `shell` tool for executing commands in isolated containers.

```yaml
description: A shell agent
model: qwen4b
toolsList:
  - shellagent  # This tool is a subagent
```

#### Shell Command Agent (`shellcmd`)

An AI-powered shell command generation agent that evaluates correctness and security before outputting commands. Uses multiple tools:

- `doc-shell-cmd` — Retrieve documentation for shell commands
- `dump-manpage` — Fetch man page documentation
- `check-shellcmd` — Evaluate command security and correctness with confidence scores

```yaml
description: Shell command generator
model: qwen4b
toolsList:
  - shellcmd  # AI-powered command generation with validation
```

### Security Configuration

All shell commands run in isolated Docker containers with the following security guarantees:

- **Network Disabled** — Containers have no external network connectivity by default
- **Volume Mounting** — Host workspace is mounted at `/workspace` inside containers
- **Read-Only Mode** — `rshell` mounts the workspace in readonly mode for safe inspection
- **Container Reuse** — Containers are reused for efficiency with graceful shutdown on exit

## API Reference

### Shell Tools

#### `shell` — Execute Shell Commands

```typescript
// Tool definition
{
  name: "shell",
  description: "Execute shell commands",
  arguments: {
    command: {
      description: "The shell command to execute",
      required: true,
      type: "string"
    }
  }
}
```

#### `rshell` — Execute Read-Only Shell Commands

```typescript
// Tool definition
{
  name: "rshell",
  description: "Execute read only shell commands",
  arguments: {
    command: {
      description: "The shell command to execute (read only operations)",
      required: true,
      type: "string"
    }
  }
}
```

#### `python` — Execute Python Code

```typescript
// Tool definition
{
  name: "python",
  description: "Execute some Python code using the python command",
  arguments: {
    packages: {
      description: "A list of packages to be install (optional): example: requests,numpy",
      type: "string"
    },
    code: {
      description: "The code to execute",
      required: true,
      type: "string"
    }
  }
}
```

### Shell Agent Configuration

#### `shellagent` — General Shell Agent

```yaml
# dist/agents/shellagent.yml
description: A shell agent
model: qwen4b
toolsList:
  - shellagent
```

#### `shellcmd` — Command Generation Agent

```yaml
# dist/agents/shellcmd.yml
description: Shell command generation agent
toolsList:
  - shellcmd
```

### Task Definitions

| Task | File | Purpose |
|------|------|---------|
| `check-shellcmd` | `dist/tasks/check-shellcmd.yml` | Security and correctness evaluation for generated commands |
| `route-shellcmd` | `dist/tasks/route-shellcmd.yml` | Complexity assessment — single command vs script decision |
| `write-shellcmd` | `dist/tasks/write-shellcmd.yml` | Direct shell command generation task |
| `write-shellscript` | `dist/tasks/write-shellscript.yml` | Bash script generation with security checks |

## Important Notes

- 🔒 **Security First** — All commands execute in isolated Docker containers; no direct host access
- 🌐 **No Network** — Containers have network disabled by default to prevent external connectivity
- 📁 **Workspace Path** — Tools require `path` or `workspace` variable to be set for volume mounting
- ♻️ **Container Lifecycle** — Containers are reused via `reuseExisting: true` and stop gracefully on SIGINT
- 🐳 **Docker Required** — Ensure Docker is installed and running before using shell tools
- ⚠️ **Error Handling** — Command errors return exit codes and stderr output for debugging

## Related Packages

- [`@agent-smith/core`](https://www.npmjs.com/package/@agent-smith/core) — Core Agent Smith framework providing agent orchestration and tool integration
- [`@boxlite-ai/boxlite`](https://www.npmjs.com/package/@boxlite-ai/boxlite) — Containerized execution environments (SimpleBox, CodeBox)

## License

MIT
