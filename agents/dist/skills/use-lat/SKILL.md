---
name: use-lat
description: use when a project has a lat.md/ knowledge graph — to ground tasks via lat search/locate, update the graph after changes, and validate with lat check
---
# Using Lat (Knowledge Graph)

Lat is a project's structured knowledge graph: cross-linked Markdown in `lat.md/` describing **what** the project does and **why** (architecture, design decisions, behavior, contracts, tests), anchored to source code via links and `// @lat:` refs.

**Project-specific details first**: which `lat.md/*.md` files exist and local workflow notes live in `lat.md/help.md` — read it when starting on a new project. The set of files varies per project; never assume one from another.

**Generated files are off-limits**: `lat.md/lat.md` and any generated `lat-md` `SKILL.md` are owned by the lat tooling. Never create, edit, or copy them — they may be replaced by a later `/workspace/lat init`.

## When to Use This Skill

- Before changing behavior, architecture, or tests: ground the task in design intent.
- After changes: update `lat.md/` and validate with `/workspace/lat check`.
- Navigating the graph: find sections, references, and related content.

## Pre-Work Workflow (before any code change)

1. Run `/workspace/lat search "<task description>"` — semantic search for sections relevant to your task.
2. Read the returned sections (`/workspace/lat section <id>`, or open the file directly) to understand design intent before writing code.
3. If `/workspace/lat search` fails because no API key is configured, explain that semantic search requires a key via `LAT_LLM_KEY` (direct value), `LAT_LLM_KEY_FILE` (path to key file), or `LAT_LLM_KEY_HELPER` (command that prints the key). Supported prefixes: `sk-...` (OpenAI) or `vck_...` (Vercel). If the user doesn't want to set one up, fall back to `/workspace/lat locate "<section name>"`.

## Post-Task Checklist (REQUIRED — do not skip)

After EVERY task, before responding to the user:

- [ ] If you added or changed meaningful implemented functionality, architecture, tests, or behavior → update the relevant `lat.md/` file. Keep it a focused snapshot of the current implemented state, not a journal/changelog. Plans may be drafted in `lat.md/` alongside implementation, with the intent that by commit time they describe what was implemented. Otherwise keep proposals, hypothetical designs, and future work outside `lat.md/` unless the user explicitly requests them there.
- [ ] Run `/workspace/lat check` — all validations must pass.

Do not consider your task done until both are complete.

## Commands

| Command | Purpose |
|---------|---------|
| `/workspace/lat search "<query>"` | Semantic search across sections (embeddings; requires `LAT_LLM_KEY`) |
| `/workspace/lat locate "<name>"` | Find sections by id/name — exact, substring, fuzzy; no key needed |
| `/workspace/lat section <id>` | Show a section with its content, outgoing refs, and incoming refs |
| `/workspace/lat refs <id>` | Find what references a section |
| `/workspace/lat check` | Full validation of links and code references |
| `/workspace/lat expand "<text>"` | Expand `[[refs]]` in text to lat.md section locations (for agent prompts) |
| `/workspace/lat reindex` | Rebuild the embedding index |
| `/workspace/lat --help` | When in doubt about commands or options |

## Syntax Primer

- **Section ids**: `lat.md/path/to/file#Heading#SubHeading`. Short form uses the bare file name when unique (`search#RAG Replay Tests`).
- **Wiki links**: `[[target]]` or `[[target|alias]]` — cross-references between sections. Can also target repository paths or source code: `[[schema.sql]]`, `[[src/components]]`, `[[src/foo.ts#myFunction]]`.
- **Source code links**: reference functions, classes, constants, and methods in supported source files with the full path: `[[src/config.ts#getConfigDir]]`, `[[src/server.ts#App#listen]]` (class method), `[[lib/utils.py#parse_args]]`, `[[src/lib.rs#Greeter#greet]]` (Rust impl method), `[[src/app.go#Greeter#Greet]]` (Go method), `[[src/app.h#Greeter]]` (C struct). When prose names an implementation symbol or a behavior governed by one, link the symbol instead of using a bare code span or copying its literal value.
- **Code refs**: `// @lat: [[section-id]]` (JS/TS/Rust/Go/C/PHP) or `# @lat: [[section-id]]` (Python/PHP) — ties source code to concepts.

## Test Specs

Key tests can be described as sections in `lat.md/` files. Add frontmatter to require every leaf section to be referenced by test code:

```markdown
---
lat:
  require-code-mention: true
---
# Tests

Authentication and authorization test specifications.

## User login

Verify credential validation and error handling for the login endpoint.

### Rejects expired tokens
Tokens past their expiry timestamp are rejected with 401, even if otherwise valid.
```

Use lat to search the codebase.