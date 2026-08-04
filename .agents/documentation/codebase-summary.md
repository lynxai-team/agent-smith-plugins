# @agent-smith/plugins

## Summary
Agent Smith plugins repository providing feature extensions for the Agent Smith CLI, organized into four categories: AI agents (agents), code management (git, sqlite), system utilities (fs, shell), and web capabilities (search, video).

## Dependencies
- `@agent-smith/core` — workflow engine, agent runtime (used by git, shell plugins)
- `commander` — CLI command definition (git plugin)
- `@inquirer/select`, `@inquirer/prompts` — interactive CLI prompts (git, sqlite plugins)
- `better-sqlite3` — SQLite database driver (sqlite plugin)
- `@boxlite-ai/boxlite` — Docker containerized execution via SimpleBox/CodeBox (shell plugin)
- `cheerio`, `isomorphic-dompurify`, `turndown` — HTML parsing and sanitization (search plugin)
- Runtime (Python): `ddgs`, `smolagents`, `crawl4ai`, `playwright` — web search, crawling, browser automation (search plugin)
- Runtime (Python): `youtube_transcript_api` — YouTube transcript extraction (video plugin)
- Node.js built-ins: `fs`, `fs/promises`, `path` — filesystem I/O (fs plugin)

## Used By
- `@agent-smith/cli` — consumes all plugins to provide feature extensions via terminal commands

## Entry Point
- `agents/dist/agents/*.yml` — 16 agent definitions: coordinator, assistant, search, code, doc, sql, help variants (qwen35b/qwen4b models)
- `agents/dist/workflows/*.yml` — 4 workflow definitions: config info, DB queries, Q&A, vision tasks
- `agents/dist/skills/*/SKILL.md` — 15 skill modules for task creation, execution, documentation, and project management
- `agents/dist/fragments/*.md` — Context helper fragments: workspace info and context file references
- `code/git/dist/cmds/commit.js` — Git commit command with AI-powered message generation
- `code/sqlite/dist/actions/db-execute-read-query.js`, `db-ask-execute-query.js` — Read-only and confirmed read/write SQL query execution
- `system/fs/dist/main.js` — Re-exports lsdir, readFile, writeToFile with path authorization
- `system/shell/dist/actions/{shell,rshell,python}.js` — Sandboxed command execution via SimpleBox/CodeBox Docker containers
- `web/search/dist/actions/{ddsearch,smsearch,openpage,open_webpage,wikipedia}.py` — Web search and content extraction tools
- `web/video/dist/actions/yt-transcript.py` — YouTube transcript extraction

## Key Files
| File | Purpose |
|------|---------|
| **agents** | |
| `dist/agents/agent-smith.yml` | Main coordinator agent: orchestrates team of agents, delegates tasks via tool calls |
| `dist/agents/*.yml` (16 files) | Specialized agents: assistant, search, code, doc, sql, help variants, collaborator, infer, state, project |
| `dist/workflows/*.yml` (4 files) | Workflows: config-info, db, q (Q&A), vision |
| `dist/skills/*/SKILL.md` (15 files) | Skills: create-task, execute-task, document-package, update-codebase-summary, smart-explore, etc. |
| `dist/fragments/workspace.md`, `ctx-helper-files.md` | Context helper fragments for agent workspace awareness |
| **code/git** | |
| `dist/cmds/commit.js` | Git commit command handler with AI-generated messages and user action selection |
| `dist/actions/git_diff.js` | Executes git diff returning combined unstaged/staged changes |
| `dist/workflows/*.yml` (4 files) | Workflows: git_commit, git_commit_details, git_commit_pkg, checkdiff |
| `dist/agents/*.yml` (6 files) | Agents: commit_msg, commit_analyze_msg, commit_details, commit_from_plan, commit_msg_pkg, analyze_diff |
| **code/sqlite** | |
| `dist/adaptaters/db-getschema.js` | Extracts database schema as SQL CREATE TABLE statements |
| `dist/actions/db-execute-read-query.js`, `db-ask-execute-query.js` | Read-only and confirmed read/write SQL query execution |
| `dist/workflows/*.yml` (4 files) | Workflows: sqlite, sqliteread, sqlquery, sqlreadquery |
| `dist/agents/*.yml` (3 files) | Agents: runsqliteagent, runsqlitereadagent, db-create-query |
| **system/fs** | |
| `dist/main.js` | Re-exports lsdir, readFile, writeToFile from actions |
| `dist/utils.js` | Path parsing, directory listing, workspace mapping, and path authorization |
| `dist/actions/{readfile,writetofile,lsdir,edit-search-replace,dirfiles}.js` | File operations with path authorization security checks |
| `dist/agents/fs-workspace-agent.yml` | Workspace-aware filesystem agent with read/write capabilities |
| **system/shell** | |
| `dist/actions/shell.js` | General shell execution via SimpleBox Docker container (node-alpine-git image) |
| `dist/actions/rshell.js`, `python.js` | Read-write shell and Python execution in sandboxed containers |
| `dist/agents/shellagent.yml` | Shell agent config: qwen4b model with shell tool, workspace variable |
| **web/search** | |
| `dist/actions/ddsearch.py` — DuckDuckGo text search |
| `dist/actions/smsearch.py` — smolagents WebSearchTool integration |
| `dist/actions/openpage.py` — Async crawl4ai crawler with JS rendering |
| `dist/actions/open_webpage.py`, `wikipedia.py` — Simple webpage extraction and Wikipedia lookup |
| `dist/actions/read-webpage.js`, `webpage.js` — Node.js webpage reading utilities |
| `dist/agents/{searchweb,browse,infers}.yml` — Multi-step search, Playwright browser automation, inference augmentation |
| **web/video** | |
| `dist/workflows/ytv.yml` — Orchestrates transcript extraction with chat task execution |
| `dist/actions/yt-transcript.py`, `yt-transcript-chain.py` — YouTube transcript extraction and chat-ready packaging |
| `dist/tasks/yt-chat.yml` — AI chat interaction over video transcripts with configurable model params |

## Architecture
- **Plugin-based extensibility**: Each plugin is an independent npm package registering commands, actions, agents, or tasks with the Agent Smith CLI framework via YAML definitions and JS/TS/Python action files.
- **Agent coordination**: The `agents` plugin provides a coordinator agent (agent-smith.yml) that decomposes tasks and delegates to specialized agents (search, code, doc, sql, help) via tool calls; 15 reusable skills provide knowledge for AI coding agents.
- **Workflow orchestration**: Plugins use YAML-defined workflows to chain actions (shell/DB/search operations) with AI agents (LLM-based generation), enabling multi-step pipelines.
- **Security-first design**: fs plugin enforces path authorization (workspace mapping + authorized path prefix checks); shell plugin uses Docker containers via SimpleBox for sandboxed execution; sqlite plugin requires user confirmation for write operations.
- **Multi-backend search**: Search plugin provides redundant backends (DuckDuckGo, smolagents, crawl4ai, Wikipedia) with both Python and Node.js implementations, orchestrated by agent YAML definitions.

## Related
- See `@agent-smith/core` — Core framework providing workflow engine, agent runtime, and tool integration
- See `@agent-smith/cli` — Terminal client consuming these plugins for feature commands
- See `agents` ↔ `code/git`, `code/sqlite` — Agents delegate code tasks (git ops, DB queries) to these plugins' actions and workflows
- See `agent-smith-plugins/code/git` ↔ `agent-smith-plugins/code/sqlite` — Companion code management plugins with similar YAML workflow patterns
- See `agent-smith-plugins/system/fs` ↔ `agent-smith-plugins/system/shell` — System utility plugins following shared security and agent configuration patterns
- See `agent-smith-plugins/web/search` — Web capabilities plugin providing search, crawling, and browser automation tools; used by agents plugin's search agent
