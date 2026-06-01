# @agent-smith/feat-fs

## Summary
A filesystem plugin that provides secure file operations (read, write, list directories) for the Agent Smith CLI, along with pre-configured AI agent templates for filesystem interaction.

## Dependencies
- `utils.js` — core helper functions (parsePath, lsdir, isPathDirectoryOrFile)
- External: `fs` / `fs/promises` (Node.js built-in filesystem module for file I/O)
- External: `path` (Node.js built-in path resolution)

## Used By
- Agent Smith CLI framework — consumes exported actions for filesystem operations
- AI agent configurations — provides tool definitions for agent inference

## Entry Point
- `dist/main.js` — re-exports `lsdir`, `readFile`, and `writeToFile` as the public API

## Key Files
| File | Purpose |
|------|---------|
| `dist/main.js` | Main entry point that exports core filesystem functions |
| `dist/utils.js` | Core utilities: path parsing, directory listing, path validation |
| `dist/actions/readfile.js` | File read action with path authorization security checks |
| `dist/actions/writetofile.js` | File write action with directory existence validation |
| `dist/actions/lsdir.js` | Directory listing action with authorized path enforcement |
| `dist/agents/fs-read-agent.yml` | Read-only agent config using MCP filesystem server |
| `dist/agents/fs-light-agent.yml` | Lightweight read/write agent with custom inference params |
| `dist/agents/fs-light-routing-agent.yml` | Routing agent for filesystem tool orchestration |

## Architecture
- Each filesystem operation (read, write, list) is encapsulated in its own action module with standardized `action(args, options)` interface
- Path authorization layer validates requested paths against allowed directories (`options.variables.path`) before executing any operation, preventing unauthorized file access
- Agent YAML configurations define tool availability, inference parameters (temperature, top_p), and system prompts for AI-driven filesystem interaction
- Dual execution modes: direct function exports for programmatic use, and MCP/agent-based execution for AI agent workflows

## Related
- See `@agent-smith/core` — main CLI framework that consumes this plugin's actions
- See other `system/*` plugins — shared plugin architecture pattern in agent-smith-plugins
