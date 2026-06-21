---
name: document-package
description: use when asked to create or update documentation for a package or module in the project docsite
---

This skill describes the workflow to document a package or module for the project's documentation site.

## Workflow

Execute these steps in order:

1. **Locate the package** — Read `.agents/documentation/codebase-summary.md` to find the package path

2. **Read codebase summary** — Read `[package-path]/.agents/documentation/codebase-summary.md`. This provides a quick overview of tools, agents, dependencies, and architecture.

3. **Read source code** — Inspect `src/` directories to identify key exports, capabilities, and usage patterns.

4. **Find next number** — List existing docs in the documentation directory. Use the next available number (e.g., if 1-8 exist, use 9).

5. **Write the doc** at `<docsite-path>/<category>/<N>.<name>.md` using this structure:

```markdown
# <PackageName>

One-line description of what the package does.

## Install

<Installation instructions appropriate for the project's ecosystem>

## Features and Capabilities

### <category>

Available features:

- <kbd>feature-name</kbd> one-line description of what it does

## Usage

<Example code showing typical usage>

## Links

Add navigation links to related documentation.
```

## Rules

- **Keep it short and information-dense** — match the style of existing docs
- Use `<kbd>feature-name</kbd>` for all tools/features
- Use backticks `` ` `` for feature names in prose
- End with navigation links to overview or related packages
- **Language-agnostic**: Adapt installation, examples, and conventions to the project's ecosystem
