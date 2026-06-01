# @agent-smith/feat-git

## Summary
Git integration plugin for Agent Smith CLI that provides AI-powered commit message generation and diff analysis.

## Dependencies
- `@agent-smith/cli` — CLI utilities, command argument parsing, shared options
- `@agent-smith/core` — workflow execution, state management, utils (git diff execution)
- `@inquirer/select` — interactive selection prompts for user actions
- External: `commander` — CLI command definition and argument handling

## Used By
- Agent Smith CLI — provides git-related commands to the terminal client

## Entry Point
- `dist/cmds/commit.js` — exports the `commit` command that orchestrates commit message generation workflows

## Key Files
| File | Purpose |
|------|---------|
| `dist/cmds/commit.js` | Main CLI command handler for git commit with AI-generated messages and user action selection |
| `dist/actions/git_diff.js` | Action that executes git diff commands and returns combined unstaged/staged changes |
| `dist/workflows/git_commit.yml` | Workflow to generate a commit message from git diff |
| `dist/workflows/checkdiff.yml` | Workflow to analyze a git diff for commit structuring suggestions |
| `dist/workflows/git_commit_details.yml` | Workflow to generate commit details with user-provided first line |
| `dist/workflows/git_commit_pkg.yml` | Workflow to generate package-specific commit messages |
| `dist/agents/commit_msg.yml` | Agent that creates commit messages from git diff output |
| `dist/agents/analyze_diff.yml` | Agent that analyzes diffs and suggests commit groupings |
| `dist/agents/commit_details.yml` | Agent that generates commit details given a first line and diff |
| `dist/agents/commit_msg_pkg.yml` | Agent that creates package-scoped commit messages |
| `dist/agents/commit_analyze_msg.yml` | Agent that creates commit messages from analyzed diff plans |
| `dist/agents/commit_from_plan.yml` | Agent that generates commit messages based on an implementation plan |
| `dist/fragments/commit_msg.md` | Template fragment with commit message writing instructions |
| `dist/fragments/commit_msg_firstline.md` | Template fragment for first-line-based commit generation |
| `dist/fragments/commit_msg_pkg.md` | Template fragment for package-specific commit messages |

## Architecture
- Command-driven architecture: the `commit` command uses Commander.js to define CLI interface and delegates workflow execution to @agent-smith/core
- Workflow orchestration: YAML-defined workflows chain actions (git_diff) with AI agents (LLM-based message generation)
- Modular agent design: separate agents handle different commit scenarios (general, package-specific, plan-based, detail-oriented)
- User interaction flow: generates commit message via LLM, presents options via inquirer select prompt (commit/copy/file/cancel)

## Related
- See `@agent-smith/feat-sqlite` — companion plugin for database features in the same code directory
- See `@agent-smith/core` — core workflow execution engine and utilities used by this plugin
