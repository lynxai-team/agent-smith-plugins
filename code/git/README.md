[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-git)](https://www.npmjs.com/package/@agent-smith/feat-git)

# @agent-smith/feat-git — AI-Powered Git Commit Management

Smart git commit message generation powered by language models. Part of the [Agent Smith toolkit](https://github.com/lynxai-team/agent-smith).

## Features

- 🤖 **AI-Generated Commit Messages** — Automatically generates meaningful commit messages from your changes
- 🎯 **Smart Context Awareness** — Analyzes staged/unstaged modifications to understand what you're committing
- ✏️ **Custom First Line** — Provide a custom first line while letting AI generate the body
- 💬 **Additional Instructions** — Give the model extra context or constraints for message generation
- 📦 **Package-Aware** — Include package names in generated commit messages
- 🔄 **Interactive Confirmation** — Review and confirm generated messages before committing
- ⚙️ **Model Flexibility** — Use any supported language model with customizable templates
- 🔧 **File-Specific Commits** — Target specific files or directories for focused commits

## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the feat-git plugin
- [Git Plugin](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/docsite/public/doc/plugins/code/1.git.md) — Complete plugin documentation and usage guide

### For Humans
- [Git Plugin](https://lynxai-team.github.io/agent-smith/plugins/code/git) — Usage guide and configuration

## Installation

```bash
npm i -g @agent-smith/feat-git
```

### Configuration

Add the plugin to your `config.yml` file:

```yml
plugins:
  - "@agent-smith/feat-git"
```

Then run the configuration command to update the CLI:

```bash
lm conf
```

## Quick Start

Generate a commit message for all staged changes:

```bash
lm commit
```

The model will analyze your changes and generate a commit message, then prompt you to confirm.

## Usage

### Basic Commit

In a git repository with uncommitted or staged modifications:

```bash
lm commit
```

### File-Specific Commit

Target specific files or directories:

```bash
lm commit src
```

### Custom First Line

Provide your own first line while AI generates the body:

```bash
lm commit --msg "Custom first line"
```

### Additional Instructions

Give the model extra context or constraints:

```bash
lm commit --instructions "Omit the version number change"
```

### Package-Aware Messages

Include a package name in the generated first line:

```bash
lm commit --pkg "git plugin"
```

## Model Configuration

### Using a Specific Model

The default model is `qwencoder 30b a3b`. To use another model:

```bash
lm commit -m mymodel
```

### Model with Template

Specify both model and template:

```bash
lm commit -m "gemma3:4b-it-q8_0" -t "gemma"
```

### Automatic Template Detection

Omit the template name and it will be guessed based on the model:

```bash
lm commit -m "deepseek-coder-v2:16b-lite-instruct-q8_0"
```

In this example, the Deepseek v2 template will be automatically detected.

**Format:** `-m modelname -t templatename`

## Command Reference

| Command | Description |
|---------|-------------|
| `lm commit` | Generate and confirm a commit message for all staged changes |
| `lm commit <path>` | Generate commit message for specific files/directories |
| `lm commit --msg "<line>"` | Use custom first line for the commit message |
| `lm commit --instructions "<text>"` | Provide additional instructions to the model |
| `lm commit --pkg "<name>"` | Include package name in generated first line |
| `lm commit -m <model>` | Use a specific language model |
| `lm commit -m <model> -t <template>` | Use model with specific template |

## Important Notes

- 📌 Requires an active git repository with modifications
- 🔒 The command prompts for confirmation before executing the commit
- 🤖 A language model must be available and configured in Agent Smith
- ⚠️ Unstaged changes must be staged first or passed as arguments
- 🔧 Ensure the plugin is properly configured via `lm conf` before use

## License

MIT
