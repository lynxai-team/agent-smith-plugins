[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-sqlite)](https://www.npmjs.com/package/@agent-smith/feat-sqlite)

# @agent-smith/feat-sqlite — SQLite Database Integration for AI Agents

A plugin that provides SQLite database integration for Agent Smith, enabling AI agents to read and write data through natural language queries with schema awareness. Part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) toolkit.

## Features

- 🗄️ **Schema-Aware Queries** — Automatic schema introspection for intelligent query generation
- 🔒 **Safe Read Operations** — Readonly database connections for read-only access
- ✍️ **Protected Writes** — Write operations require user confirmation via interactive prompts
- 🔄 **Atomic Transactions** — Query execution wrapped in transactions for data integrity
- 🤖 **AI Agents** — Pre-built agents for full read/write and read-only database interactions
- 🌐 **Natural Language** — Ask questions in plain English and get structured results

## Documentation

### For AI Agents

- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the @agent-smith/feat-sqlite plugin
- [SQLite Plugin](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/code/2.sqlite.md) — Complete plugin documentation with actions, tools, and agents

### For Humans

- [SQLite Plugin](https://lynxai-team.github.io/agent-smith/plugins/code/sqlite) — Full plugin documentation and usage guide

## Installation

```bash
npm i -g @agent-smith/feat-sqlite
```

Add the plugin to your `config.yml` file and run the `conf` command:

```yml
plugins:
  - "@agent-smith/feat-sqlite"
```

```bash
lm conf
```

## Quick Start

Create a minimal agent with SQLite read-only access:

```yaml
description: Sqlite read only agent
model: qwen4b
toolsList:
  - sqlreadquery
variables:
  required:
    dbpath:
      description: The database path
```

## Usage

### Database Operations

The plugin provides two main tools for interacting with SQLite databases:

| Tool | Description | Access Level |
|------|-------------|--------------|
| `sqlquery` | Read data or write in the database. Schema-aware and can read/write everything | Full (read + write) |
| `sqlreadquery` | Read data by asking a question in natural language. Schema-aware read-only access | Read-only |

Both tools require the `dbpath` variable to be set, pointing to your SQLite database file.

### AI Agents

The plugin provides two pre-built agents:

#### Full Read/Write Agent (`runsqliteagent`)

A complete SQLite database assistant that decomposes user questions and delegates tasks to tools.

- Uses `sqlquery` tool for schema-aware read and write operations
- Requires user confirmation for any write operations
- Best for: Database administration, data manipulation, schema changes

#### Read-Only Agent (`runsqlitereadagent`)

A safe SQLite database reader that analyzes questions and executes read queries only.

- Uses `sqlreadquery` tool for schema-aware read-only queries
- No write operations possible — maximum safety
- Best for: Data analysis, reporting, research queries

### Security Model

- **Read operations** use readonly database connections for safety
- **Write operations** require user confirmation via interactive prompts (`@inquirer/prompts`)
- **Query execution** is wrapped in transactions via `better-sqlite3`'s transaction API for atomicity

## API Reference

### Available Tools

#### `sqlquery`

Execute schema-aware SQL queries with full read/write access.

```typescript
// The agent automatically handles:
// 1. Schema introspection
// 2. Query generation from natural language
// 3. Transaction wrapping for writes
// 4. User confirmation prompts for modifications
```

**Parameters:**
- `dbpath` (required): Path to the SQLite database file
- `query`: Natural language description of the operation or SQL query

#### `sqlreadquery`

Execute read-only SQL queries using natural language questions.

```typescript
// The agent automatically handles:
// 1. Schema introspection
// 2. Query generation from natural language
// 3. Readonly connection enforcement
```

**Parameters:**
- `dbpath` (required): Path to the SQLite database file
- `question`: Natural language question about the database

### Agent Configuration

#### Full Agent Example

```yaml
description: Sqlite full access agent
model: qwen4b
toolsList:
  - sqlquery
variables:
  required:
    dbpath:
      description: The database path
```

#### Read-Only Agent Example

```yaml
description: Sqlite read only agent
model: qwen4b
toolsList:
  - sqlreadquery
variables:
  required:
    dbpath:
      description: The database path
```

## Important Notes

- 🔑 The `dbpath` variable is **required** for all operations — always specify the database path
- 📝 Write operations will prompt for user confirmation before executing
- 🔒 Read-only agents cannot perform any write operations, even if requested
- ⚡ All operations are wrapped in transactions for data integrity
- 🌐 Compatible with Node.js environments (uses `better-sqlite3` native module)

## Dependencies

- `better-sqlite3` — Fast SQLite bindings for Node.js
- `@inquirer/prompts` — Interactive prompts for user confirmation

## License

MIT
