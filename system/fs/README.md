# @agent-smith/feat-fs

[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-fs)](https://www.npmjs.com/package/@agent-smith/feat-fs)

**Filesystem features for Agent Smith CLI** — Manage files and directories with language models. Part of the [Agent Smith toolkit](https://github.com/lynxai-team/agent-smith).

## ✨ Features

- 📂 **Directory Operations** — List files and folders with `lsdir` and read all files content with `dirfiles`
- 📄 **File Reading** — Read file contents securely with `readfile`
- ✍️ **File Writing** — Write content to files safely with `writetofile` and directory validation
- 🔍 **File Editing** — Search and replace strings in files with `edit-search-replace`
- 🤖 **AI Agents** — Pre-configured `fs-workspace-agent` for autonomous file operations
- 🔒 **Path Authorization** — Built-in security layer that validates all file paths against allowed directories
- ⚡ **Lightweight Agent** — Optimized agent configuration with configurable inference parameters

## 📖 Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the @agent-smith/feat-fs plugin
- [Filesystem Plugin](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/6.filesystem.md) — Complete plugin documentation with actions, tools, and agent examples

### For Humans
- [Filesystem Plugin](https://lynxai-team.github.io/agent-smith/plugins/filesystem) — Plugin overview, actions, and usage guide

## 📦 Installation

```bash
npm i -g @agent-smith/feat-fs
```

Add the plugin to your `config.yml` file:

```yaml
plugins:
  - "@agent-smith/feat-fs"
```

Then run the configuration command:

```bash
lm conf
```

## 🚀 Quick Start

### Using the CLI with an AI Agent

Create a simple filesystem agent configuration:

```yaml
description: A filesystem agent
model: qwen4b
toolsList:
  - fs-workspace-agent  # lightweight filesystem agent
```

Run the agent:

```bash
lm exampleagent "explain me what the code project in the current directory is doing" --mcp filesystem:.
```

### Programmatic Usage

```typescript
import { lsdir, readFile, writeToFile } from "@agent-smith/feat-fs";

// List directory contents
const result = await lsdir("./src");
console.log(result.files); // Array of file paths
console.log(result.dirs);  // Array of directory paths

// Read a file
const content = await readFile("./README.md");
console.log(content);

// Write to a file
writeToFile("./output.txt", "Hello, Agent Smith!", true);
```

## 📝 Usage Patterns

### Directory Operations

**List files and directories:**
```typescript
import { lsdir } from "@agent-smith/feat-fs";

// List both files and directories
const result = await lsdir("./project");
// Returns: { files: string[], dirs: string[] }

// List only files
const files = await lsdir("./project", { files: true });

// List only directories
const dirs = await lsdir("./project", { dirs: true });

// Debug mode
await lsdir("./project", { debug: true });
```

### File Operations

**Read a file:**
```typescript
import { readFile } from "@agent-smith/feat-fs";

try {
  const content = await readFile("./config.json");
  console.log(content);
} catch (error) {
  console.error(`Failed to read file: ${error.message}`);
}
```

**Write to a file:**
```typescript
import { writeToFile } from "@agent-smith/feat-fs";

try {
  // Writes content to file, creates directory structure if needed
  const result = await writeToFile(
    "./output/data.txt",
    "File content here",
    true  // verbose mode
  );
  console.log(result); // "Ok: file ./output/data.txt written"
} catch (error) {
  console.error(`Write failed: ${error.message}`);
}
```

**Edit a file with search and replace:**
```typescript
// The edit-search-replace tool is available as an action
// It searches for old_content and replaces it with new_content in the specified file
```

### Security & Path Authorization

All file operations include built-in path authorization. The plugin validates requested paths against allowed directories configured via `options.variables.path`:

```typescript
// Authorized paths configuration
const options = {
  variables: {
    path: "/workspace/project,/workspace/src",  // Comma-separated authorized paths
    workspace: "/workspace/project"
  }
};

// Operations outside authorized paths will be rejected
await lsdir("/workspace/project/src", options);  // ✅ Allowed
await readFile("/etc/passwd", options);           // ❌ Unauthorized
```

## 🤖 Agent Configurations

### fs-workspace-agent

A lightweight read, write and explore filesystem agent:

```yaml
description: Filesystem lightweight read, write and explore agent
category: "system/filesystem"
model: qwen4b
prompt: "{prompt}"
template:
    system: |-
        You are an AI filesystem assistant. You are equiped with tools to operate on the filesystem.
inferParams:
    top_k: 20
    top_p: 0.7
    min_p: 0
    temperature: 0.2
variables:
  required:
    workspace:
      description: The local directory path where to operate
toolsList:
    - lsdir
    - dirfiles?
    - readfile?
    - edit-search-replace?
    - writetofile?
```

**Available tools:**
| Tool | Description |
|------|-------------|
| `lsdir` | List files and folders in a directory |
| `dirfiles` | Read all files content in a directory (excludes hidden files) |
| `readfile` | Read a file's content |
| `writetofile` | Write content to a file |
| `edit-search-replace` | Search and replace strings in a file |

## 📚 API Reference

### Core Functions

#### `lsdir(dirPath: string | string[], options?: object): Promise<object>`

List files and folders in a directory.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `dirPath` | `string` or `string[]` | The path of the directory to read |
| `options.files` | `boolean` | If true, return only files |
| `options.dirs` | `boolean` | If true, return only directories |
| `options.debug` | `boolean` | Enable debug logging |

**Returns:** `Promise<{ files: string[], dirs: string[] }>` or filtered arrays if `files` or `dirs` options are set.

**Example:**
```typescript
const result = await lsdir("./src");
// { files: ['./src/main.ts', './src/utils.ts'], dirs: ['./src/components'] }
```

#### `readFile(filePath: string): Promise<string>`

Read a file's content with error handling.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | The path of the file to read |

**Returns:** `Promise<string>` — The file content as a UTF-8 string.

**Example:**
```typescript
const content = await readFile("./README.md");
```

#### `writeToFile(filePath: string, content: string, isVerbose?: boolean): void`

Write content to a file with directory validation.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | The path of the file to write |
| `content` | `string` | The content to write |
| `isVerbose` | `boolean` | If true, log confirmation message |

**Example:**
```typescript
writeToFile("./output.txt", "Hello!", true);
```

### Entry Point Exports

The main module (`dist/main.js`) exports three core functions:

```typescript
import { lsdir, readFile, writeToFile } from "@agent-smith/feat-fs";
```

## ⚠️ Important Notes

- **Node.js Only** — This plugin requires Node.js and uses built-in `fs` and `path` modules. It is not compatible with browsers.
- **Path Authorization** — All actions validate requested paths against authorized directories configured via `options.variables.path`. Operations on unauthorized paths will be rejected.
- **Directory Creation** — The `writetofile` action requires the target directory to already exist. Create directories before writing files.
- **Agent Configuration** — When using agents, always specify authorized paths in the `variables.workspace` configuration to ensure secure file operations.

## 🔗 Related Packages

- [@agent-smith/core](https://www.npmjs.com/package/@agent-smith/core) — Main CLI framework that consumes this plugin's actions

## 📄 License

MIT
