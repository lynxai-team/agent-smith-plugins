# @agent-smith/feat-video

[![pub package](https://img.shields.io/npm/v/@agent-smith/feat-video)](https://www.npmjs.com/package/@agent-smith/feat-video)

**Video features plugin for Agent Smith CLI** — Extract YouTube video transcripts and chat with AI over video content. Part of the [Agent Smith toolkit](https://github.com/lynxai-team/agent-smith).

## Features

- 🎬 **YouTube Transcript Extraction** — Fetch transcripts from any YouTube video by ID
- 🤖 **AI Chat Integration** — Chat with AI agents using video transcripts as context
- 🌍 **Multi-Language Support** — Fetch transcripts in multiple languages (defaults to English)
- ⚙️ **Configurable Models** — Specify model parameters (temperature, max tokens, etc.) for chat responses
- 🔗 **Workflow Chaining** — Seamlessly chain transcript extraction with AI chat tasks
- 📦 **Standalone Plugin** — Easy to install and integrate with Agent Smith CLI

## Documentation

### For AI Agents
- [Codebase Summary](.agents/documentation/codebase-summary.md) — Architecture, key files, and patterns for the feat-video package
- [Workflow Definition](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/plugins/web/video/dist/workflows/ytv.yml) — Workflow that chains transcript extraction with chat task
- [Transcript Action](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/plugins/web/video/dist/actions/yt-transcript.py) — Standalone transcript extraction action
- [Chain Action](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/plugins/web/video/dist/actions/yt-transcript-chain.py) — Transcript with prompt packaging for AI chat
- [Chat Task](https://raw.githubusercontent.com/lynxai-team/agent-smith/refs/heads/main/plugins/web/video/dist/tasks/yt-chat.yml) — Task definition for video transcript chat

### For Humans
- [Getting Started](https://lynxai-team.github.io/agent-smith/plugins/web/video/) — Overview and installation guide
- [Actions Reference](https://lynxai-team.github.io/agent-smith/plugins/web/video/actions) — Available actions and their parameters
- [Tasks Reference](https://lynxai-team.github.io/agent-smith/plugins/web/video/tasks) — Task definitions and configuration

## Installation

Install the plugin via npm:

```bash
npm install @agent-smith/feat-video
```

Or with yarn:

```bash
yarn add @agent-smith/feat-video
```

## Quick Start

### Extract a Video Transcript

```bash
# Extract transcript from a YouTube video
agent-smith action yt-transcript <video_id>

# Example
agent-smith action yt-transcript dQw4w9WgXcQ
```

### Chat with Video Transcript

```bash
# Chain transcript extraction with AI chat
agent-smith workflow ytv -p video_id=<video_id> -p instructions="Summarize this video"

# Example
agent-smith workflow ytv -p video_id=dQw4w9WgXcQ -p instructions="What are the main points discussed?"
```

## Usage Patterns

### 1. Standalone Transcript Extraction

Use the `yt-transcript` action to extract transcripts from any YouTube video:

```bash
agent-smith action yt-transcript <video_id> [language_codes]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `video_id` | string | Yes | YouTube video ID (e.g., `dQw4w9WgXcQ`) |
| `languages` | string | No | Comma-separated language codes (e.g., `en,fr,de`). English is always included as fallback. |

**Example:**
```bash
# Extract English transcript
agent-smith action yt-transcript dQw4w9WgXcQ

# Extract with multiple language preferences
agent-smith action yt-transcript dQw4w9WgXcQ en,fr,de
```

### 2. Chat with Video Transcript

Use the `yt-transcript-chain` action to extract transcripts and package them with instructions for AI consumption:

```bash
agent-smith action yt-transcript-chain <video_id> "<instructions>" [language_codes]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `video_id` | string | Yes | YouTube video ID |
| `instructions` | string | Yes | AI instructions for processing the transcript |
| `languages` | string | No | Comma-separated language codes |

**Example:**
```bash
agent-smith action yt-transcript-chain dQw4w9WgXcQ "Extract key points and create a summary"
```

### 3. Full Workflow Execution

Run the complete `ytv` workflow that chains transcript extraction with AI chat:

```bash
agent-smith workflow ytv -p video_id=<video_id> -p instructions="<your_instructions>"
```

**Default Chat Configuration:**
- **Model:** qwen30b
- **Max Tokens:** 8192
- **Temperature:** 0.6
- **Context Window:** 32768 tokens

**Example:**
```bash
agent-smith workflow ytv \
  -p video_id=dQw4w9WgXcQ \
  -p instructions="Provide a detailed summary of the video content"
```

### 4. Error Handling

```bash
# Handle missing video ID
agent-smith action yt-transcript
# Error: Provide a video id

# Handle missing prompt for chain action
agent-smith action yt-transcript-chain dQw4w9WgXcQ
# Error: Provide a video id and a prompt

# Handle unavailable transcripts
agent-smith action yt-transcript nonexistent_video
# May raise error if transcript not available
```

## API Reference

### Actions

#### `yt-transcript`

Extracts YouTube video transcript from a video ID.

**Input:** `video_id` (string), optional `languages` (comma-separated string)  
**Output:** Formatted transcript text

#### `yt-transcript-chain`

Extracts transcript and packages it with user instructions for AI chat.

**Input:** `video_id` (string), `instructions` (string), optional `languages` (comma-separated string)  
**Output:** JSON object with `prompt` (transcript) and `instructions` fields

### Tasks

#### `yt-chat`

Chat with a YouTube video transcript using configurable model parameters.

```yaml
name: ytv-chat
description: Chat with a Youtube video
ctx: 32768
model:
    name: qwen30b
    temperature: chatml-tools
inferParams:
    max_tokens: 8192
    top_k: 0.0
    top_p: 1
    min_p: 0.05
    temperature: 0.6
```

**Required Variables:** `instructions`  
**Context Window:** 32768 tokens

### Workflows

#### `ytv`

Orchestrates transcript extraction followed by chat task execution.

```yaml
steps:
  - action: yt-transcript-chain
  - task: yt-chat
```

## Important Notes

- 🎯 **Requires YouTube Video ID** — Only works with valid YouTube video IDs
- 🌐 **Transcript Availability** — Not all videos have available transcripts; the API will raise an error if no transcript exists
- 🌍 **Language Fallback** — English (`en`) is always included as a fallback language even if not explicitly specified
- 📚 **Dependency** — Uses `youtube_transcript_api` library for transcript fetching
- 🔒 **Browser Limitation** — This plugin is designed for CLI/Node.js environments, not browsers
- 📦 **Standalone** — Currently a standalone plugin awaiting full integration with Agent Smith core

## Related Packages

- [`@agent-smith/core`](https://www.npmjs.com/package/@agent-smith/core) — Core Agent Smith functionality
- [`@agent-smith/agent`](https://www.npmjs.com/package/@agent-smith/agent) — AI agent management

## License

MIT
