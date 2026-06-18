---
name: create-task-solo
description: use this to create a new task with proper structure for single-agent (solo) execution
---

# Create Task Instructions (Single Agent)

## Task Directory Structure

Tasks are located in `.agents/tasks/[task-name]/`. Structure:

```
[task-name]/
├── goals.md              # Goals and success criteria
├── plan.md               # Full execution plan with all phases
├── state.md              # Progress tracking
└── notes.md              # Optional: additional context/notes
```

## Creating Task Files

### 1. `goals.md` — Goals & Success Criteria

```md
# Goals and Success Criteria: [task-name]

## Primary Goal
[Clear statement of what the task achieves]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Files Modified
- `path/to/file` — description of changes

## Exclusions
[What is NOT included in this task]
```

### 2. `plan.md` — Full Execution Plan

Contains all phases inline with step-by-step instructions. The agent retains context between phases, so steps can be concise.

```md
# Task Plan: [task-name]

## Phase 1: [Phase Name]
**Goal:** [What this phase achieves]

### Step 1.1: [Step Name]
- **File:** `path/to/file`
- **Action:** [Detailed instructions on what to do]
- **Verify:** [Verifiable success criteria]

### Step 1.2: [Step Name]
- **File:** `path/to/file`
- **Action:** [Detailed instructions]
- **Verify:** [Verifiable success criteria]

## Phase 2: [Phase Name]
**Goal:** [What this phase achieves]

### Step 2.1: [Step Name]
- **File:** `path/to/file`
- **Action:** [Detailed instructions]
- **Verify:** [Verifiable success criteria]
```

**Plan rules:**
- Each phase has a clear goal
- Each step specifies the file to modify, the action to take, and how to verify success
- Success criteria must be verifiable (e.g., "test passes", "file contains X", "code compiles")
- Steps should be atomic — one clear action per step

### 3. `state.md` — Progress Tracking

```md
# Task State: [task-name]

## Status: [planned | in-progress | completed]

## Phases
- [ ] Phase 1: [name]
  - [ ] Step 1.1
  - [ ] Step 1.2
- [ ] Phase 2: [name]
  - [ ] Step 2.1

## Notes
- Next: Phase X, Step Y
```

### 4. `notes.md` — Optional Context

Use this file for any additional context, references, or information the agent should keep in mind while executing the task.

---

## Task Execution Workflow (Single Agent)

When executing a task created with this skill, follow this workflow:

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

---

## Task Creation Workflow

When creating a new task:

1. **Analyze Request:** Understand what the user wants to accomplish
2. **Define Goals:** Write `goals.md` with clear success criteria
3. **Create Plan:** Write `plan.md` breaking work into phases and steps
4. **Initialize State:** Write `state.md` with all items unchecked, status `planned`
5. **Report to User:** Show the created task structure before execution
6. **Wait for Confirmation:** Only execute if user approves the plan

---

## Choosing Execution Mode

Use the `task-mode` skill to decide between single-agent (`create-task-solo`) and multi-agent (`create-task-team`) execution before creating a task. The `task-mode` skill provides a checklist and decision framework based on context isolation needs vs unified context requirements.
