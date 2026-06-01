# @agent-smith/feat-shell

## Summary
Shell plugin providing sandboxed shell command execution tools (shell, rshell, python) and AI-powered shell command generation agents with security validation for the Agent Smith CLI.

## Dependencies
- `@boxlite-ai/boxlite` — Containerized execution environments (SimpleBox, CodeBox) for running commands in isolated Docker containers
- `@agent-smith/core` — Core Agent Smith framework integration

## Used By
- Agent Smith CLI — Shell features plugin providing command execution and generation capabilities

## Entry Point
- `src/actions/shell.ts` — Execute arbitrary shell commands in a sandboxed Alpine Linux container
- `src/actions/rshell.ts` — Execute read-only shell commands with mounted volumes in readonly mode
- `src/actions/python.ts` — Execute Python code in an isolated Python slim container with optional package installation

## Key Files
| File | Purpose |
|------|---------|
| `src/actions/shell.ts` | Executes shell commands via SimpleBox container with read-write workspace mount |
| `src/actions/rshell.ts` | Executes read-only shell commands with readonly volume mount for safe inspection |
| `src/actions/python.ts` | Runs Python code in CodeBox with optional package installation support |
| `dist/agents/shellagent.yml` | Shell agent configuration with qwen4b model for general shell operations |
| `dist/agents/shellcmd.yml` | Shell command generation agent with security validation workflow |
| `dist/tasks/check-shellcmd.yml` | Security and correctness evaluation task for generated commands |
| `dist/tasks/route-shellcmd.yml` | Complexity assessment to decide between single command vs script |
| `dist/tasks/write-shellcmd.yml` | Direct shell command generation task |
| `dist/tasks/write-shellscript.yml` | Bash script generation task with security checks |

## Architecture
- Commands are executed in isolated Docker containers using @boxlite-ai/boxlite (SimpleBox for general shell, CodeBox for Python), preventing host system access
- Volume mounting maps the host workspace to `/workspace` inside containers with configurable read-only mode for safety
- Network is disabled by default in containers to prevent external connectivity
- AI agents use a multi-step workflow: documentation lookup → command generation → security validation before execution
- Container reuse is enabled via `reuseExisting: true` for efficiency, with graceful shutdown on SIGINT

## Related
- See `@agent-smith/core` — Core framework providing agent orchestration and tool integration
