# @agent-smith/autodoc

## Summary
Auto documentation plugin for Agent Smith CLI that provides a task to answer user questions using the terminal client's comprehensive documentation.

## Dependencies
- `@agent-smith/cli` — core CLI runtime and utilities

## Used By
- Terminal users — accessing documentation via natural language queries

## Entry Point
- `dist/tasks/autodoc.yml` — YAML task definition that loads documentation fragments and uses Qwen35B to answer questions about Agent Smith

## Key Files
| File | Purpose |
|------|---------|
| `dist/tasks/autodoc.yml` | Task definition: loads documentation, sets system prompt, configures model (qwen35b, 32k ctx) for documentation Q&A |
| `dist/fragments/documentation.md` | Merged markdown documentation covering install, overview, config, tasks, actions, workflows, commands, and agents |
| `dist/fragments/documentation.xml` | Repomix-packed XML version of the same documentation for AI consumption |

## Architecture
- Single YAML task that uses `{file:../fragments/documentation.md}` fragment to embed full terminal client docs into the prompt
- System prompt instructs the model (qwen35b) to act as Agent Smith documentation assistant and reference online docs at `https://synw.github.io/agent-smith/terminal_client/`
- Documentation is pre-packaged from 10 source markdown files covering all terminal client features

