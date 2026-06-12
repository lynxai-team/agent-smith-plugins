# @agent-smith/autodoc

[![pub package](https://img.shields.io/npm/v/@agent-smith/autodoc)](https://www.npmjs.com/package/@agent-smith/autodoc)

**Auto documentation features for the Agent Smith CLI** — An AI-powered documentation Q&A agent that answers questions about the Agent Smith terminal client using pre-packaged documentation fragments.

Part of the [Agent Smith toolkit](https://github.com/lynxai-team/agent-smith).

## Features

- 📚 **Pre-packaged Documentation** — Includes comprehensive terminal client documentation fragments (Markdown and XML formats)
- 🤖 **AI-Powered Q&A** — Uses qwen35b model with 32k context window for intelligent documentation queries
- 🔧 **YAML-Based Task Definition** — Declarative task configuration with prompt templates and inference parameters
- 📦 **Plugin Architecture** — Integrates seamlessly with `@agent-smith/cli` as an npm plugin
- 🎯 **Context-Aware Responses** — Configurable top_k, top_p, min_p, and temperature parameters for precise answers

## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the @agent-smith/autodoc plugin
- [Autodoc Task](https://raw.githubusercontent.com/lynxai-team/agent-smith-plugins/refs/heads/main/autodoc/dist/tasks/autodoc.yml) — Documentation Q&A task definition with qwen35b model configuration
- [Documentation Fragments](https://raw.githubusercontent.com/lynxai-team/agent-smith-plugins/refs/heads/main/autodoc/dist/fragments/documentation.md) — Pre-packaged terminal client documentation for AI consumption

### For Humans
- [Plugins Overview](https://lynxai-team.github.io/agent-smith/plugins/) — Overview of Agent Smith plugin system
- [Create a Plugin](https://lynxai-team.github.io/agent-smith/plugins/create-plugin) — Guide to creating custom plugins

## Installation

Install the plugin globally via npm:

```bash
npm i -g @agent-smith/autodoc
```

Or add it as a dependency in your project:

```bash
npm install @agent-smith/autodoc
```

### Prerequisites

- Node.js 18+ (ESM modules supported)
- `@agent-smith/cli` ^0.0.53 (installed automatically as a dependency)
- Access to an LLM backend (qwen35b recommended for optimal results)

## Quick Start

### 1. Install and Configure

```bash
# Install the plugin
npm i -g @agent-smith/autodoc

# Add to your config.yml
plugins:
  - "@agent-smith/autodoc"

# Update client configuration
lm conf ~/lm/features/config.yml
```

### 2. Use the Documentation Agent

Run documentation queries through the Agent Smith CLI:

```bash
# Ask a question about Agent Smith
lm autodoc "How do I configure ollama backend?"

# Query about tasks and workflows
lm autodoc "What is the difference between actions and workflows?"
```

## Usage Patterns

### Task Definition

The autodoc plugin defines a task in `dist/tasks/autodoc.yml`:

```yaml
tool:
    description: Agent Smith documentation agent
    arguments:
        prompt: 
            description: "Documentation assistant for the Agent Smith AI agents terminal client"

prompt: |
    Here is the documentation for the Agent Smith terminal client:
    
    {file:../fragments/documentation.md}
    
    --- End of documentation ---
    
    Your goal is to answer the user's question using the documentation.
    Important: the links in the documentation are relative: use this prefix "https://synw.github.io/agent-smith/terminal_client/" for the online documentation links you provide to the user.
    
    User question: {prompt}

ctx: 32768
model: qwen35b

template:
    afterSystem: |
        You are Agent Smith documentation assistant. Agent Smith is a terminal client to operate AI agents.
        
inferParams:
    top_k: 20
    top_p: 0.95
    min_p: 0
    temperature: 0.4
```

### Configuration Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `model` | `qwen35b` | LLM model to use for documentation Q&A |
| `ctx` | `32768` | Context window size (tokens) |
| `top_k` | `20` | Sampling parameter: top-k tokens considered |
| `top_p` | `0.95` | Nucleus sampling threshold |
| `min_p` | `0` | Minimum probability threshold |
| `temperature` | `0.4` | Response randomness (lower = more deterministic) |

### Documentation Fragments

The plugin includes pre-packaged documentation in two formats:

- **Markdown** (`documentation.md`) — Human-readable, ~36KB of comprehensive terminal client docs
- **XML** (`documentation.xml`) — Machine-readable format for AI processing, ~38KB packed repository representation

These fragments cover:
- Installation and configuration
- Tasks, Actions, Workflows, and Commands overview
- Agent definitions (tool calls, MCP servers, sub-agents)
- Backend settings (llamacpp, ollama, openrouter, etc.)

## API Reference

### Task Structure

The autodoc plugin exposes a single task definition:

```
dist/tasks/autodoc.yml
```

#### Task Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The documentation question to answer |
| `model` | string | No | LLM model (default: qwen35b) |
| `ctx` | number | No | Context window size (default: 32768) |

#### Inference Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `top_k` | number | 20 | Number of top tokens to consider |
| `top_p` | number | 0.95 | Cumulative probability threshold |
| `min_p` | number | 0 | Minimum token probability |
| `temperature` | number | 0.4 | Sampling temperature |

### Directory Structure

```
autodoc/
├── package.json                    # Plugin metadata
├── dist/
│   ├── tasks/
│   │   └── autodoc.yml            # Q&A task definition
│   └── fragments/
│       ├── documentation.md       # Markdown documentation (~36KB)
│       └── documentation.xml      # XML documentation (~38KB)
└── README.md                      # This file
```

## Important Notes

- 📌 **Model Requirement**: The task is configured for `qwen35b` with a 32k context window. Ensure your backend supports this model.
- 🔗 **Documentation Links**: When providing answers, the agent will prefix documentation links with `https://synw.github.io/agent-smith/terminal_client/`
- 📦 **Private Package**: This is a private package (`"private": true`) and is intended for use within the Agent Smith ecosystem.
- 🔌 **Plugin Registration**: Register in your `config.yml` under `plugins:` section, not `features:`
- 📚 **Documentation Scope**: The bundled documentation covers the terminal client; for core library documentation, see related packages

## License

MIT
