---
name: execute-task-solo
description: use this to execute a solo task (single agent executes all phases)
---

# Execute Task (Solo Mode)

This skill describes how to execute a task created with `create-task-solo`. A single agent executes all phases sequentially.

## Task Location

Use the `load-task` tool to load the task.
Tasks are located in `.agents/tasks/[task-name]/` directory.

## Task Structure

```
[task-name]/
├── goals.md              # Goals and success criteria
├── plan.md               # Full execution plan with all phases
├── state.md              # Progress tracking
└── notes.md              # Optional: additional context/notes
```

## Execution Workflow

### 1. Start/Resume Task
1. Read `state.md` to determine current progress
2. Identify the next step to execute
3. If status is `completed`, notify user and exit

### 2. Execute Steps
For each step:
1. Read the step instructions from `plan.md`
2. Perform the action (edit files, run commands, etc.)
3. Verify success criteria
4. If verification fails, fix issues and re-verify
5. Once verified, mark step as complete in `state.md`

### 3. Update State
After completing each phase:
1. Mark all steps in that phase as `[x]` with `✓`
2. Mark the phase as `[x]`
3. Update "Next" note to point to the next phase/step
4. If all phases complete, set status to `completed`

### 4. Completion
1. When all phases are done, notify user
2. Ask user to verify the results
3. Only delete the task directory if user confirms everything is correct

## State Management

If the task is interrupted before completion, update `state.md` to indicate:
- What was done
- What remains to do
- Current status (`in-progress`)

## Important Rules

- Always execute steps one by one — never skip ahead
- Verify success criteria after each step before proceeding
- Update `state.md` after each completed step
- Do not verify previously completed steps (check `state.md` first)
- Ask user for confirmation before deleting task directory
