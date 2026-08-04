# @agent-smith/feat-shell

[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-shell)](https://www.npmjs.com/package/@agent-smith/feat-shell)

**Sandboxed shell command execution and AI-powered shell command generation for the Agent Smith toolkit.**

Part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) CLI framework — secure, containerized command execution with AI assistance.

## Features

- 🛡️ **Sandboxed Execution** — All commands run in isolated Docker containers preventing host system access
- 🔒 **Read-Only Mode** — Safe file inspection with `rshell` using readonly workspace mounts
- 🐍 **Python Isolation** — Execute Python code in dedicated `python:slim` containers with pip support
- 🦾 **Go Execution** — Run Go commands in isolated `cimg/go:1.25-node` containers
- 🤖 **AI Command Generation** — Shell agent with qwen4b model for intelligent command execution
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

```typescript
const result = await agent.run("List all files in /workspace", {
  toolsList: ["shell"],
  variables: { workspace: "/path/to/project" }
});
```

### Safe File Inspection (Read-Only)

Use the <kbd>rshell</kbd> tool for read-only operations — perfect for listing files or inspecting content without risk of modification:

```typescript
const result = await agent.run("Check file permissions", {
  toolsList: ["rshell"],
  variables: { workspace: "/path/to/project" }
});
```

### Run Python Code

Use the <kbd>python</kbd> tool to execute Python scripts with optional package installation:

```typescript
const result = await agent.run("Analyze data", {
  toolsList: ["python"],
  variables: { workspace: "/path/to/project" },
  packages: "pandas,numpy",
  code: `import pandas as pd\ndf = pd.read_csv('/workspace/data.csv')\nprint(df.head())`
});
```

## Usage

### Shell Execution Tools

| Tool | Description | Container Image | Workspace Mount |
|------|-------------|-----------------|-----------------|
| `shell` | Execute arbitrary shell commands | `timbru31/node-alpine-git` | Read-write at `/workspace` |
| `rshell` | Execute read-only shell commands | `timbru31/node-alpine-git` | Read-only at `/workspace` |
| `python` | Execute Python code with pip support | `python:slim` | Read-write at `/workspace` |
| `goshell` | Execute Go commands | `cimg/go:1.25-node` | Read-write at `/workspace` |

### Shell Tools — Detailed Usage

#### `shell` — Execute Shell Commands

Runs arbitrary shell commands in an Alpine Linux container with Node.js and Git pre-installed:

```typescript
import { Agent, Lm } from "@agent-smith/agent";

const lm = new Lm({ serverUrl: "http://localhost:8080/v1" });
const agent = new Agent({
  lm,
  onToken: (t) => process.stdout.write(t),
});

const result = await agent.run("Find all TypeScript files in the project", {
  toolsList: ["shell"],
  variables: { workspace: "/workspace/my-project" },
  model: "qwen4b",
  params: { temperature: 0.3, max_tokens: 1024 }
});
```

The tool requires a `workspace` or `path` variable to mount the host directory into the container.

#### `rshell` — Execute Read-Only Shell Commands

Identical to `shell` but mounts the workspace volume in **read-only** mode, preventing any file modifications:

```typescript
const result = await agent.run("List directory contents and check permissions", {
  toolsList: ["rshell"],
  variables: { workspace: "/workspace/my-project" },
  model: "qwen4b",
  params: { temperature: 0.3, max_tokens: 1024 }
});
```

Use `rshell` when you need to inspect files or run diagnostic commands without risk of accidental changes.

#### `python` — Execute Python Code

Runs Python code in a dedicated `python:slim` container with optional pip package installation:

```typescript
const result = await agent.run("Process data with pandas", {
  toolsList: ["python"],
  variables: { workspace: "/workspace/my-project" },
  packages: "pandas,requests",
  code: `
import pandas as pd
df = pd.read_csv('/workspace/data.csv')
print(f"Rows: {len(df)}, Columns: {len(df.columns)}")
print(df.describe())
`,
  model: "qwen4b",
  params: { temperature: 0.3, max_tokens: 2048 }
});
```

**Parameters:**
- `code` (required) — The Python code to execute
- `packages` (optional) — Comma-separated list of pip packages to install before running the code

#### `goshell` — Execute Go Commands

Runs shell commands in a Go development container with Go 1.25 and Node.js:

```typescript
const result = await agent.run("Build the Go project", {
  toolsList: ["goshell"],
  variables: { workspace: "/workspace/my-go-project" },
  model: "qwen4b",
  params: { temperature: 0.3, max_tokens: 1024 }
});
```

### AI Shell Agent

The plugin provides a pre-configured shell agent (`shellagent`) using the qwen4b model:

```yaml
description: Shell agent
category: system/shell
model: qwen4b
inferParams:
  min_p: 0
  top_k: 40
  top_p: 0.95
  temperature: 0.7
ctx: 32768
variables:
  required:
    workspace:
      description: The local directory path where to operate
toolsList:
  - shell
```

Usage in an agent workflow:

```typescript
const result = await agent.run("Explore the project structure and report findings", {
  toolsList: ["shellagent"],
  variables: { workspace: "/workspace/my-project" },
  model: "qwen4b",
  params: { temperature: 0.5, max_tokens: 4096 }
});
```

The shell agent intelligently decides which commands to run and can chain multiple operations together.

### Debug Mode

Enable debug output to see container lifecycle events:

```typescript
const result = await agent.run("List files", {
  toolsList: ["shell"],
  variables: { workspace: "/workspace/my-project" },
  debug: true  // prints container open/close events
});
```

### Error Handling

All tools return structured output with exit codes, stdout, and stderr:

```typescript
try {
  const result = await agent.run("Run a command", {
    toolsList: ["shell"],
    variables: { workspace: "/workspace/my-project" }
  });
  // Result format:
  // [Exit code]: 0
  // [Stdout]: ...
  // [Stderr]: ...
} catch (err) {
  console.error("Shell execution failed:", err.message);
}
```

Common error cases:
- **Missing workspace**: Returns `[Error]: shell tool missing path or workspace parameter`
- **Timeout**: Commands running longer than 60 seconds are killed automatically
- **Container errors**: Exit code and error message are included in the result output

## Complete Example

```typescript
import { Agent, Lm } from "@agent-smith/agent";

async function exploreProject(workspace: string) {
  const lm = new Lm({ serverUrl: "http://localhost:8080/v1" });
  const agent = new Agent({
    lm,
    onToken: (t) => process.stdout.write(t),
    onError: (err) => { throw new Error(err.message); },
  });

  // Use the shell agent to explore the project structure
  const result = await agent.run(
    "Explore the project: list top-level files, check for package.json, " +
    "and report the project type and dependencies",
    {
      toolsList: ["shellagent"],
      variables: { workspace },
      model: "qwen4b",
      params: { stream: true, temperature: 0.4, top_k: 20, max_tokens: 4096 },
    }
  );

  return result;
}

// Usage
exploreProject("/workspace/my-project").then(console.log).catch(console.error);
```

## API Reference

### Tool Definitions

#### `shell` — Execute Shell Commands

```typescript
{
  name: "shell",
  description: "Execute shell commands",
  arguments: {
    command: {
      description: "The shell command to execute",
      required: true,
      type: "string"
    }
  },
  parallelCalls: false
}
```

#### `rshell` — Execute Read-Only Shell Commands

```typescript
{
  name: "rshell",
  description: "Execute read only shell commands",
  arguments: {
    command: {
      description: "The shell command to execute (read-only operations)",
      required: true,
      type: "string"
    }
  },
  parallelCalls: false
}
```

#### `python` — Execute Python Code

```typescript
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

### Return Value Format

All shell tools return a structured string:

```
[Exit code]: <number>
[Stdout]: <output lines>
[Stderr]: <error lines>
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `variables.workspace` | `string` | Host directory path to mount into the container (required) |
| `variables.path` | `string` | Alternative to `workspace` — same purpose |
| `debug` | `boolean` | Enable debug logging for container lifecycle events |
| `packages` | `string` | Comma-separated pip packages to install (python tool only) |
| `code` | `string` | Python code to execute (python tool only) |
| `command` | `string` | Shell command to execute (shell/rshell/goshell tools) |

## Important Notes

- 🐳 **Docker Required** — All tools require Docker to be installed and running on the host system
- 🔒 **Security Isolation** — Commands execute in isolated Docker containers; no direct host system access
- 🌐 **No Network by Default** — Containers have network disabled to prevent external connectivity
- 📁 **Workspace Variable Required** — The `workspace` or `path` variable must be provided for volume mounting
- ⏱️ **60-Second Timeout** — Commands exceeding 60 seconds are automatically terminated
- ♻️ **Container Lifecycle** — Containers use `autoRemove: true` and stop gracefully on SIGINT
- 🔧 **Dependency**: Requires `@boxlite-ai/boxlite` for containerized execution (SimpleBox / CodeBox)

## Related Packages

- [`@agent-smith/core`](https://www.npmjs.com/package/@agent-smith/core) — Core Agent Smith framework providing agent orchestration and tool integration
- [`@agent-smith/agent`](https://www.npmjs.com/package/@agent-smith/agent) — Agent inference loop and LLM client
- [`@boxlite-ai/boxlite`](https://www.npmjs.com/package/@boxlite-ai/boxlite) — Containerized execution environments (SimpleBox, CodeBox)

## License

MIT
