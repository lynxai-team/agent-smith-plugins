---
name: create-task-team
description: use this to create a new task with proper structure for multi-agent (team) execution with coordinator-executor delegation
---

# Create Task Instructions (Coordinator Agent)

## Task Directory Structure

Tasks are located in `.agents/tasks/[task-name]/`. Structure:

```
[task-name]/
├── goals.md                      # Goals and success criteria
├── plan.md                       # Full execution plan (reference)
├── state.md                      # Progress tracking
├── coordinator-instructions.md   # Your orchestration instructions
└── phases/
    ├── phase-1.md
    └── phase-2.md
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
Contains the complete plan with all phases and steps. Used as reference only.

### 3. `phases/phase-X.md` — Individual Phase Files

Each phase file must contain **context** (so executor can work independently) and **step-by-step instructions**:

```md
# Phase X: [Phase Name]

## Context
- **Task ID:** [task-name]
- **Current state:** [metrics/status]
- **Target:** [what we're aiming for]

### Files to Modify
| File | Purpose |
|------|---------|
| `path/to/file` | What changes here |

---

## Phase Goal
[What this phase achieves]

---

### Step X.1: [Step Name]
**File:** `path/to/file`
**Execution Plan:** [Detailed instructions]
**Success Criteria:**
- [ ] Criterion 1 (verifiable)
```

**Phase file rules:**
- Include full context — executor agents should NOT read other files
- Each step has explicit execution plan AND success criteria
- Success criteria must be verifiable (e.g., "test passes", "file contains X")

### 4. `coordinator-instructions.md` — Your Orchestration Guide
```md
# Coordinator Instructions: [task-name]

## Phase Files
| Phase | File | Steps |
|-------|------|-------|
| 1: [name] | phases/phase-1.md | N |

## Execution Workflow
1. Read `state.md` to identify next phase
2. Delegate phase to executor agent
3. Wait for completion, verify success criteria
4. Update `state.md` to mark phase completed
5. Repeat until all phases done
```

The coordinator must instruct subagents that they can use the `.agents/tasks/[task-name]/documents` directory to create markdown file that other agents will be able to read. Each agent must report what documents it created if it did, so that the next agent can be informed to read these documents if necessary

### 5. `state.md` — Progress Tracking
```md
# Task State: [task-name]

## Status: [planned | in-progress | completed]

## Phase Files
| Phase | File | Steps |
|-------|------|-------|
| 1: [name] | phases/phase-1.md | N |

## Progress
### Phase X: [name]
- [ ] Step X.1: [description]
- [x] Step X.2: [description] ✓

## Notes
- Next phase to execute: Phase X
```
