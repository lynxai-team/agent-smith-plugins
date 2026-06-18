---
name: use-tasks
description: reference guide for the task skills ecosystem — explains how tasks work and which skill to use
---

# Task Skills Reference Guide

This skill provides an overview of the task system. Use it to understand which skill to load for your specific need.

## Task Skills Ecosystem

### Creation Skills
| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `create-task` | **Entry point** — Analyzes request, chooses mode, delegates | User asks to create a new task |
| `task-mode` | **Mode selector** — Checklist to decide solo vs team | Need to determine execution mode |
| `create-task-solo` | Creates task for single-agent execution | Task needs unified context (reading/analyzing data) |
| `create-task-team` | Creates task for multi-agent execution | Task has independent phases needing different expertise |

### Execution Skills
| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `execute-task-solo` | Execute a solo task (single agent runs all phases) | Running a task created with `create-task-solo` |
| `execute-task-team` | Execute a team task (coordinator delegates to executors) | Coordinator running a task created with `create-task-team` |
| `execute-task-phase` | Behavioral contract for executor agents | Executor agent running an assigned phase |

## Workflows

**Solo Task Workflow:**
```
create-task → task-mode → create-task-solo → execute-task-solo
```

**Team Task Workflow:**
```
create-task → task-mode → create-task-team → execute-task-team → execute-task-phase (executors)
```

## Task Location

Tasks are stored in:
- `.agents/tasks/[task-name]/` — Main project tasks
- `[project-name].agents/tasks/[task-name]/` — Project-specific tasks

## Task Directory Structure

### Solo Task
```
[task-name]/
├── goals.md              # Goals and success criteria
├── plan.md               # Full execution plan with all phases
├── state.md              # Progress tracking
└── notes.md              # Optional: additional context/notes
```

### Team Task
```
[task-name]/
├── goals.md                      # Goals and success criteria
├── plan.md                       # Full execution plan (reference)
├── state.md                      # Progress tracking
├── coordinator-instructions.md   # Orchestration instructions
└── phases/
    ├── phase-1.md                # Individual phase files
    └── phase-2.md
```

## Quick Reference: Which Skill to Load?

| Your Goal | Load This Skill |
|-----------|-----------------|
| Create a new task | `create-task` |
| Decide solo vs team mode | `task-mode` |
| Execute a solo task | `execute-task-solo` |
| Execute a team task (as coordinator) | `execute-task-team` |
| Execute an assigned phase (as executor) | `execute-task-phase` |
| Understand task structure | This skill (`use-tasks`) |

## Task Lifecycle

### 1. Create a Task
- Check if `.agents/tasks/[task-name]/` exists; create if not
- Task files should contain: name/description, goals, phase-by-phase plan with execution steps and success criteria, status tracking
- Report to user before executing

### 2. Execute a Task
- Read `state.md` to check progress
- Execute phases one by one (never skip ahead)
- Verify success criteria after each step
- Update `state.md` after each completed phase

### 3. After Completion
- Ask user if everything is satisfactory
- Only delete task directory if user confirms
- If incomplete: update `state.md` with what was done and what remains

## Important Rules

- Always execute steps one by one — never skip ahead
- Verify success criteria after each step before proceeding
- Update `state.md` after each completed step
- Do not re-verify previously completed steps (check `state.md` first)
- Ask user for confirmation before deleting task directory
