# @agent-smith/feat-sqlite

## Summary
A plugin that provides SQLite database integration for Agent Smith, enabling AI agents to read and write data through natural language queries with schema awareness.

## Dependencies
- `@agent-smith/core` — workflow execution engine, agent runtime
- External: `better-sqlite3` (SQLite database driver)
- External: `@inquirer/prompts` (interactive confirmation prompts)

## Used By
- Agent Smith CLI — provides SQLite database tools and agents for data operations

## Entry Point
- `dist/adaptaters/db-getschema.js` — extracts and returns the SQLite database schema as SQL CREATE TABLE statements
- `dist/actions/db-execute-read-query.js` — executes read-only SQL queries against the database
- `dist/actions/db-ask-execute-query.js` — executes read/write SQL queries with user confirmation

## Key Files
| File | Purpose |
|------|---------|
| `dist/adaptaters/db-getschema.js` | Extracts database schema (tables, columns, indexes) as SQL statements |
| `dist/actions/db-execute-read-query.js` | Executes read-only SQL queries with readonly flag |
| `dist/actions/db-ask-execute-query.js` | Executes SQL queries after user confirmation prompt |
| `dist/utils.js` | Shared query execution utility with transaction support |
| `dist/workflows/sqlquery.yml` | Full read/write workflow: schema → query creation → execution |
| `dist/workflows/sqlreadquery.yml` | Read-only workflow: schema → query creation → execute read |
| `dist/agents/runsqliteagent.yml` | Agent config for full read/write database operations |
| `dist/agents/runsqlitereadagent.yml` | Agent config for read-only database queries |
| `dist/tasks/db-create-query.yml` | Task that converts natural language questions to SQL queries using schema context |

## Architecture
- The plugin uses a three-step workflow pattern: adaptater extracts schema, task generates SQL from natural language, action executes the query.
- Read operations use read-only database connections for safety; write operations require user confirmation via inquirer prompts.
- Query execution is wrapped in transactions via `better-sqlite3`'s transaction API for atomicity.
- AI agents (qwen4b model) are configured to decompose complex questions into multiple queries using the schema context.

## Related
- See `@agent-smith/feat-git` — similar plugin pattern for version control operations
