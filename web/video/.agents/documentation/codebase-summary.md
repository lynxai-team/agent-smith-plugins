# feat-video

## Summary
Video features plugin for Agent Smith CLI that provides YouTube video transcription and AI chat capabilities over video transcripts.

## Dependencies
- `youtube_transcript_api` — Fetches and formats YouTube video transcripts

## Used By
- None yet — standalone plugin awaiting integration

## Entry Point
- `dist/workflows/ytv.yml` — Orchestrates transcript extraction followed by chat task execution

## Key Files
| File | Purpose |
|------|---------|
| `dist/workflows/ytv.yml` | Workflow definition that chains yt-transcript-chain action with yt-chat task |
| `dist/actions/yt-transcript.py` | Extracts YouTube video transcript from a video ID and outputs formatted text |
| `dist/actions/yt-transcript-chain.py` | Extracts transcript and packages it with user instructions for AI chat consumption |
| `dist/tasks/yt-chat.yml` | Task definition for chatting with a YouTube video transcript using specified model parameters |

## Architecture
- Workflow-driven design: `ytv.yml` chains an action (transcript extraction) with a task (AI chat interaction).
- Two action variants: standalone transcript extraction (`yt-transcript.py`) and chat-ready packaged output (`yt-transcript-chain.py`).
- Uses the `youtube_transcript_api` library to fetch transcripts, defaulting to English with optional language support.
- Chat task leverages configurable model parameters (temperature, max tokens) via YAML task definition.

## Related
- See `@agent-smith` core CLI — consumes this plugin's workflows and actions for video-related features
