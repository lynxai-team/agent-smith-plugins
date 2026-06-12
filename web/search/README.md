# @agent-smith/feat-search

**Powerful web search and browsing tools for AI agents — search the web, Wikipedia, and extract page content with ease.**

Part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) toolkit for managing AI agents.

[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-search)](https://www.npmjs.com/package/@agent-smith/feat-search)

## Features

- 🔍 **Multiple Search Backends** — DuckDuckGo, smolagents, and generic web search with redundancy
- 📚 **Wikipedia Lookup** — Direct Wikipedia topic search via smolagents
- 🌐 **Webpage Extraction** — Extract content from any webpage as markdown (smolagents, crawl4ai & TypeScript)
- 🤖 **Pre-built Agents** — Ready-to-use `searchweb`, `browse`, and `infers` agent configurations
- ⚡ **Async Crawling** — Advanced async crawling with configurable delays, word thresholds, and tag filtering
- 🎯 **Browser Automation** — Playwright-based browsing via MCP protocol for JavaScript-rendered pages
- 🔧 **Modular Design** — Each tool is a standalone CLI script (Python/TypeScript) for flexible agent orchestration

## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the search plugin
- [Plugin Overview](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/1.overview.md) — Plugin system overview and creation guide
- [Search Plugin Docs](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/8.search.md) — Complete search plugin documentation

### For Humans
- [Plugin Overview](https://lynxai-team.github.io/agent-smith/plugins/) — Plugin system overview and creation guide
- [Search Plugin](https://lynxai-team.github.io/agent-smith/plugins/search) — Complete search plugin documentation

## Installation

Install the plugin globally:

```bash
npm i -g @agent-smith/feat-search
```

### Python Dependencies

The search plugin requires these Python packages. Install them before use:

```bash
pip install duckduckgo_search smolagents crawl4ai playwright
```

> **Note:** Playwright browsers need to be installed separately after installation:
> ```bash
> playwright install
> ```

## Configuration

Add the plugin to your `config.yml` file:

```yaml
plugins:
  - "@agent-smith/feat-search"
```

Then update your CLI configuration:

```bash
lm conf
```

## Quick Start

### Basic Web Search

Use the search tools directly from your agent prompt:

```yaml
description: A web search agent
prompt: |-
    {prompt}
model: qwen4b
inferParams:
    min_p: 0
    top_k: 20
    top_p: 0.95
    temperature: 0.4
toolsList:
  - searchweb  # Uses the searchweb subagent
```

The `searchweb` agent will automatically:
1. Search the web for relevant information
2. Crawl and extract content from promising URLs
3. Synthesize and return comprehensive results

## Usage Patterns

### Available Search Tools

| Tool | Description | Backend |
|------|-------------|---------|
| `smsearch` | Generic web search | smolagents WebSearchTool |
| `ddsearch` | DuckDuckGo search | ddgs (DuckDuckGo Search) |
| `wikipedia` | Wikipedia topic lookup | smolagents |

### Available Page Reading Tools

| Tool | Description | Backend |
|------|-------------|---------|
| `open_webpage` | Simple webpage content extraction | smolagents |
| `openpage` | Advanced async crawling with options | crawl4ai |
| `read-webpage` | TypeScript-based webpage reader | cheerio + turndown |

### Pre-built Agents

#### `searchweb` Agent

Multi-step search and content extraction workflow:

```yaml
# dist/agents/searchweb.yml
description: Web search agent
prompt: |-
    {prompt}
model: qwen4b
inferParams:
    min_p: 0
    top_k: 20
    top_p: 0.95
    temperature: 0.4
toolsList:
  - searchweb
```

**Workflow:** Search → Crawl → Answer

#### `browse` Agent

Playwright-based browser automation:

```yaml
# dist/agents/browse.yml
description: Browser automation agent
toolsList:
  - browse  # Playwright MCP server
```

**Use case:** JavaScript-rendered pages, interactive websites, form filling.

#### `infers` Agent

Raw inference with search augmentation:

```yaml
# dist/agents/infers.yml
description: Inference with search
toolsList:
  - searchweb  # Subagent for web search
```

**Use case:** Augmenting any agent's responses with live web data.

### Advanced Usage: Direct Tool Calls

You can call individual tools directly from agent prompts:

```yaml
# Using DuckDuckGo search directly
toolsList:
  - ddsearch
  - openpage

# Using smolagents search
toolsList:
  - smsearch
  - open_webpage
  - wikipedia

# Using TypeScript-based reader
toolsList:
  - read-webpage
```

## API Reference

### Search Actions

| Action File | Command | Description |
|-------------|---------|-------------|
| `dist/actions/ddsearch.py` | `ddsearch <query>` | DuckDuckGo web search with time-limit filtering |
| `dist/actions/smsearch.py` | `smsearch <query>` | Generic web search via smolagents |
| `dist/actions/wikipedia.py` | `wikipedia <topic>` | Wikipedia topic lookup |

### Page Reading Actions

| Action File | Command | Description |
|-------------|---------|-------------|
| `dist/actions/open_webpage.py` | `open_webpage <url>` | Simple webpage content extraction via smolagents |
| `dist/actions/openpage.py` | `openpage <url> [options]` | Advanced async crawling with configurable options |
| `dist/actions/read-webpage.js` | `read-webpage <url>` | TypeScript-based webpage reader (cheerio + turndown) |

### openpage.py Options

The `openpage.py` action supports these configurable parameters:

- `--delay`: Delay before extracting content (for JavaScript rendering)
- `--word-threshold`: Minimum word count to include page
- `--excluded-tags`: HTML tags to exclude from extraction

### Agent Configurations

| Agent File | Purpose | Key Features |
|------------|---------|--------------|
| `dist/agents/searchweb.yml` | Multi-step search workflow | Search → Crawl → Synthesize |
| `dist/agents/browse.yml` | Browser automation | Playwright MCP integration |
| `dist/agents/infers.yml` | Search-augmented inference | Subagent architecture |

## Important Notes

- 🐍 **Python Required**: Most search actions are Python scripts. Ensure Python 3.8+ is installed.
- ⚛️ **TypeScript Support**: `read-webpage.js` uses TypeScript with cheerio and turndown for HTML-to-markdown conversion.
- 🌐 **Network Access**: Agents need internet access to use search tools.
- ⚠️ **Rate Limits**: Be mindful of rate limits on search providers (DuckDuckGo, Wikipedia).
- 🔒 **Security**: Webpage extraction uses crawl4ai which can execute JavaScript — be cautious with untrusted URLs.
- 📦 **Dependencies**: The `playwright` package requires separate browser installation (`playwright install`).

## Related Packages

- [`@agent-smith/core`](https://www.npmjs.com/package/@agent-smith/core) — Core Agent Smith framework
- [Browse plugin](https://github.com/synw/agent-smith-plugins) — Complementary browser automation

## License

MIT
