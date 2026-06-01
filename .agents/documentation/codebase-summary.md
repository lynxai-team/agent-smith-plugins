# @agent-smith/plugins

## Summary
Agent Smith plugins repository providing a collection of feature extensions for the Agent Smith CLI, organized into four categories: documentation (autodoc), code management (git, sqlite), system utilities (fs, shell), and web capabilities (search, video).

## Dependencies
- `@agent-smith/core` — workflow execution engine, agent runtime, framework integration (used by all plugins)
- `@agent-smith/cli` — CLI runtime and utilities (used by autodoc, git, sqlite, fs, shell)
- External: `commander` — CLI command definition and argument handling (git plugin)
- External: `better-sqlite3` — SQLite database driver (sqlite plugin)
- External: `@inquirer/prompts`, `@inquirer/select` — interactive prompts (git, sqlite plugins)
- External: `fs` / `fs/promises`, `path` — Node.js built-in filesystem modules (fs plugin)
- External: `@boxlite-ai/boxlite` — Containerized execution environments for sandboxed command execution (shell plugin)
- External: `ddgs`, `smolagents`, `crawl4ai`, `playwright` — Web search, crawling, and browser automation tools (search plugin)
- External: `youtube_transcript_api` — YouTube video transcript extraction (video plugin)

## Used By
- Agent Smith CLI (`@agent-smith/cli`) — consumes all plugins to provide feature extensions via terminal client commands

## Entry Points
- `autodoc/dist/tasks/autodoc.yml` — Documentation Q&A task using pre-packaged docs with qwen35b model
- `code/git/dist/cmds/commit.js` — Git commit command with AI-powered message generation
- `code/sqlite/dist/adaptaters/db-getschema.js` — SQLite schema extraction; `dist/actions/db-execute-read-query.js` and `db-ask-execute-query.js` for query execution
- `system/fs/dist/main.js` — Core filesystem functions (lsdir, readFile, writeToFile) with path authorization
- `system/shell/src/actions/shell.ts`, `rshell.ts`, `python.ts` — Sandboxed shell command execution in Docker containers
- `web/search/dist/actions/ddsearch.py`, `open_webpage.py`, `openpage.py`, `smsearch.py`, `wikipedia.py` — Web search and content extraction tools
- `web/video/dist/workflows/ytv.yml` — YouTube transcript extraction and chat workflow

## Key Files
| File | Purpose |
|------|---------|
| **autodoc** | |
| `dist/tasks/autodoc.yml` | Documentation Q&A task: loads documentation fragments, configures qwen35b model (32k ctx) |
| `dist/fragments/documentation.md`, `.xml` | Pre-packaged terminal client documentation for AI consumption |
| **code/git** | |
| `dist/cmds/commit.js` | Git commit command handler with AI-generated messages and user action selection |
| `dist/actions/git_diff.js` | Executes git diff commands returning combined unstaged/staged changes |
| `dist/workflows/*.yml` | Four workflows for commit message generation, diff analysis, and package-specific commits |
| `dist/agents/*.yml` | Nine agents handling different commit scenarios (general, package-specific, plan-based) |
| **code/sqlite** | |
| `dist/adaptaters/db-getschema.js` | Extracts database schema as SQL CREATE TABLE statements |
| `dist/actions/db-execute-read-query.js`, `db-ask-execute-query.js` | Read-only and confirmed read/write SQL query execution |
| `dist/workflows/sqlquery.yml`, `sqlreadquery.yml` | Full read/write and read-only workflow definitions |
| `dist/agents/runsqliteagent.yml`, `runsqlitereadagent.yml` | Agent configs for qwen4b model database operations |
| **system/fs** | |
| `dist/main.js` | Re-exports core filesystem functions (lsdir, readFile, writeToFile) |
| `dist/utils.js` | Path parsing, directory listing, and path validation utilities |
| `dist/actions/{readfile,writetofile,lsdir}.js` | File operations with path authorization security checks |
| `dist/agents/fs-{read,light,light-routing}-agent.yml` | Read-only and read/write agent configurations for filesystem interaction |
| **system/shell** | |
| `src/actions/{shell,rshell,python}.ts` | Sandboxed command execution via SimpleBox (rw) and CodeBox (Python) Docker containers |
| `dist/agents/shellagent.yml`, `shellcmd.yml` | Shell operation agents with qwen4b model and security validation workflows |
| `dist/tasks/{check-shellcmd,route-shellcmd,write-shellcmd,write-shellscript}.yml` | Security evaluation, complexity routing, and command/script generation tasks |
| **web/search** | |
| `dist/actions/ddsearch.py`, `smsearch.py` — DuckDuckGo and smolagents search implementations |
| `dist/actions/openpage.py` — Advanced async crawler via crawl4ai with JS rendering support |
| `dist/actions/open_webpage.py`, `wikipedia.py` — Simple webpage extraction and Wikipedia lookup |
| `dist/agents/{searchweb,browse,infers}.yml` — Multi-step search, Playwright browser automation, and inference augmentation agents |
| **web/video** | |
| `dist/workflows/ytv.yml` — Orchestrates transcript extraction with chat task execution |
| `dist/actions/{yt-transcript,yt-transcript-chain}.py` — YouTube transcript extraction and chat-ready packaging |
| `dist/tasks/yt-chat.yml` — AI chat interaction over video transcripts with configurable model params |

## Architecture
- **Plugin-based extensibility**: Each plugin is an independent package that registers commands, actions, agents, or tasks with the Agent Smith CLI framework via YAML definitions.
- **Workflow orchestration**: Plugins use YAML-defined workflows to chain actions (shell/DB/search operations) with AI agents (LLM-based generation), enabling multi-step pipelines.
- **Security-first design**: System plugins enforce path authorization (fs plugin) and sandboxed execution via Docker containers (shell plugin); read-only modes and user confirmation prompts for write operations (sqlite plugin).
- **Multi-backend support**: Search plugin provides redundant search backends (DuckDuckGo, smolagents, crawl4ai, Wikipedia) with agent-driven orchestration; shell plugin supports general shell and Python execution in isolated environments.

## Related
- See `@agent-smith/core` — Core framework providing workflow engine, agent runtime, and tool integration used by all plugins
- See `@agent-smith/cli` — Terminal client that consumes these plugins to provide feature commands
- See `agent-smith-plugins/code/git` ↔ `agent-smith-plugins/code/sqlite` — Companion code management plugins with similar YAML workflow patterns
- See `agent-smith-plugins/system/fs` ↔ `agent-smith-plugins/system/shell` — System utility plugins following shared security and agent configuration patterns
- See `agent-smith-plugins/web/search` — Web capabilities plugin providing search, crawling, and browser automation tools
