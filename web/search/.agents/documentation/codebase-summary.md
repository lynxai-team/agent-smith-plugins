# search

## Summary
A web search plugin that provides multiple search and browsing tools for Agent Smith agents, enabling web queries, Wikipedia lookups, webpage content extraction, and browser automation.

## Dependencies
- `ddgs` — DuckDuckGo search API client
- `smolagents` — Default tools for web search and Wikipedia lookup
- `crawl4ai` — Async web crawler for extracting page content as markdown
- `playwright` — Browser automation via MCP protocol (browse agent)
- External: `@agent-smith/core` — Agent Smith framework integration

## Used By
- `browse.yml` agent — Playwright-based browsing workflow
- `searchweb.yml` agent — Multi-step search and content extraction workflow
- `infers.yml` agent — Raw inference with search tool augmentation

## Entry Point
- `dist/actions/ddsearch.py` — DuckDuckGo web search via DDGS
- `dist/actions/open_webpage.py` — Webpage fetching via smolagents
- `dist/actions/openpage.py` — Advanced async webpage crawling via crawl4ai
- `dist/actions/smsearch.py` — Generic web search via smolagents
- `dist/actions/wikipedia.py` — Wikipedia topic lookup via smolagents
- `dist/agents/searchweb.yml` — Multi-step search agent configuration
- `dist/agents/browse.yml` — Playwright browser automation agent
- `dist/agents/infers.yml` — Raw inference with search augmentation

## Key Files
| File | Purpose |
|------|---------|
| `package.json` | NPM package manifest for @agent-smith/feat-search plugin |
| `dist/actions/ddsearch.py` | DuckDuckGo search implementation with time-limit filtering |
| `dist/actions/open_webpage.py` | Simple webpage content extraction using smolagents |
| `dist/actions/openpage.py` | Advanced async crawler with configurable options (delay, word threshold, excluded tags) |
| `dist/actions/smsearch.py` | Generic web search wrapper around smolagents WebSearchTool |
| `dist/actions/wikipedia.py` | Wikipedia lookup tool with custom user-agent |
| `dist/agents/searchweb.yml` | Agent config: multi-step workflow (search → crawl → answer) |
| `dist/agents/browse.yml` | Agent config: Playwright MCP-based browser automation |
| `dist/agents/infers.yml` | Agent config: inference with search tool augmentation |

## Architecture
- **Modular tool design**: Each Python file is a standalone CLI tool that accepts arguments and outputs structured results (markdown or plain text) for agent consumption.
- **Multiple search backends**: Supports DuckDuckGo (`ddsearch.py`), smolagents (`smsearch.py`, `open_webpage.py`), crawl4ai (`openpage.py`), and Wikipedia — providing redundancy and complementary capabilities.
- **Agent-driven workflows**: YAML configs define multi-step agent pipelines (e.g., searchweb.yml orchestrates search → crawl → synthesis) with configurable inference parameters (temperature, top_k, etc.).
- **Async-first crawling**: `openpage.py` uses async crawl4ai for robust JavaScript-rendered page extraction with configurable delays and content filtering.

## Related
- See `@agent-smith/core` — Core agent framework that consumes these tools
- See `web/browse` plugin — Complementary browser automation capabilities
