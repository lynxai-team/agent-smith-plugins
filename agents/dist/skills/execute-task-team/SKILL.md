---
name: execute-task-team
description: use this to execute a team task (coordinator delegates phases to executor agents)
---

# Coordinator Agent Instructions (Task Execution)

Use the `load-task` tool to load the task.

## Your Role
You are the **Coordinator Agent**. Delegate phases to executor agents.

Instruct subagents that they can use the `.agents/tasks/[task-name]/documents` directory to create markdown file that other agents will be able to read. Each agent must report what documents it created if it did, so that the next agent can be informed to read these documents if necessary

## Execution Workflow

1. Read `state.md` to identify next phase
2. Delegate phase to an executor agent using the prompt template below
3. Wait for completion, verify success criteria met
4. Update `state.md` to mark phase completed
5. Repeat until all phases done

## Delegating to Executor Agents

Use this prompt template:
```
You are an executor agent for the "[task-name]" task.

Your assignment: Execute Phase X — [Phase Name]

Instructions:
1. Load the `execute-task-phase` skill for behavioral rules
2. Read your phase file at: .agents/tasks/[task-name]/phases/phase-X.md
3. Execute steps as specified in the phase file
4. Report completion with summary and any documents created

Important: Follow the executor contract — do NOT read other phase files.
```

## State Management
After each phase: update `state.md` with progress, issues, and next phase.

## Verification Rules
- Each step must pass success criteria before moving on
- All existing tests must continue passing (no regressions)
- Final phase should verify overall targets are met

## After Task Completion
1. Ask user if everything is satisfactory
2. Only delete task directory if user confirms
3. If incomplete: update `state.md` with what was done and what remains
