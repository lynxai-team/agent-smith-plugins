---
name: create-task
description: entry point for creating tasks - analyzes request, chooses execution mode, creates task
---

# Create Task (Entry Point)

This is the entry point skill for creating new tasks. It orchestrates the full workflow: analyze → decide mode → create task.

## Workflow

### Step 1: Analyze Request
1. Read and understand the user's task request
2. Identify scope, complexity, and requirements
3. Note any special constraints or dependencies

### Step 2: Choose Execution Mode
1. Load the `task-mode` skill
2. Evaluate the task against the decision checklist
3. Determine whether to use `create-task-solo` (single agent) or `create-task-team` (multi-agent)
4. Report your decision with reasoning

### Step 3: Create Task
1. Based on the mode decision, load either `create-task-solo` or `create-task-team` skill
2. Execute that skill to create the task files
3. Show the created structure to the user

## Output Format

After analysis and mode selection:

```
Task Analysis: [Brief summary of what needs to be done]
Mode Decision: [create-task-solo | create-task-team]
Reasoning: [Why this mode was chosen]
Next Step: Creating task using [create-task-solo | create-task-team] skill...
```

After task creation:

```
Task Created: [.agents/tasks/task-name/]
Files Created:
- goals.md
- plan.md
- state.md
- [additional files based on mode]
```

## Important Notes

- Always use `task-mode` skill before creating a task
- Never skip the mode selection step
- Report decision to user before proceeding
- The `create-task-solo` and `create-task-team` skills handle their own confirmation workflows
