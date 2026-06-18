---
name: task-mode
description: use this to decide between solo (create-task-solo) or team (create-task-team) task execution mode
---

# Task Mode Selection

This skill helps you choose the right execution mode before creating a task. Use it to determine whether to use `create-task-solo` (single agent) or `create-task-team` (coordinator-executor with multiple agents).

## Quick Decision Checklist

Evaluate the task against these criteria:

### Solo Mode (`create-task-solo`) Indicators
Check each that applies:
- [ ] Task involves reading/analyzing lots of data to produce output
- [ ] Phases are tightly coupled with shared state
- [ ] Task complexity fits in one agent's context window
- [ ] Quick iteration/refinement is needed
- [ ] Same expertise required throughout all phases

### Team Mode (`create-task-team`) Indicators
Check each that applies:
- [ ] Different phases require different expertise/domains
- [ ] Phases are independent or parallelizable
- [ ] Context isolation would improve output quality
- [ ] Task is too large/complex for one agent's context
- [ ] Long-running task that benefits from checkpointing between phases

## Decision Rule

| Score | Decision |
|-------|----------|
| 3+ solo indicators | Use **`create-task-solo`** (single agent) |
| 3+ team indicators | Use **`create-task-team`** (multi-agent) |
| Tie | Default to **`create-task-solo`** (simpler, less overhead) |

## Key Principle: Context Isolation vs Unified Context

### When Unified Context Wins (`create-task-solo`)
> "Read all docs and create a summary" — The agent needs to hold all the data in context to produce coherent output. Splitting this across agents would lose the unified view.

**Use `create-task-solo` when:** The task benefits from having all information available in one context window. Reading → Processing → Output flows work best with a single agent.

### When Context Isolation Wins (`create-task-team`)
> "Create module with tests, docs, and integration" — Each phase needs focused expertise. Isolating context prevents interference between phases and lets each agent specialize.

**Use `create-task-team` when:** Different phases benefit from separate, focused contexts. Multi-agent execution prevents context pollution and allows specialization.

## Decision Flow

```
Task Analysis
 │
 ├─→ Need to read/analyze lots of data → produce output?
 │    └─ YES → create-task-solo (unified context)
 │
 ├─→ Phases tightly coupled with shared state?
 │    └─ YES → create-task-solo (keep context together)
 │
 ├─→ Different phases need different expertise?
 │    └─ YES → create-task-team (context isolation helps)
 │
 ├─→ Task too complex for one context window?
 │    └─ YES → create-task-team (split across agents)
 │
 ├─→ Phases independent/parallelizable?
 │    └─ YES → create-task-team (leverage isolation)
 │
 └─→ Default → create-task-solo (simpler, less overhead)
```

## Examples

### Use `create-task-solo` (Single Agent):
- "Read all documentation files and create a summary"
- "Analyze codebase metrics and generate a report"
- "Refactor function X across the project"
- "Add feature Y to existing module"
- "Update configuration based on new requirements"
- "Generate documentation from code comments"

### Use `create-task-team` (Multi-Agent):
- "Create new module with tests, docs, and integration"
- "Migrate database schema, update queries, update API"
- "Implement feature requiring frontend + backend + tests"
- "Large refactoring across multiple unrelated modules"
- "Build new service with API, CLI, and documentation"
- "Add authentication: update backend, frontend, and tests"

## Output Format

When using this skill, output your decision as:

```
Task Mode Decision: [create-task-solo | create-task-team]
Reasoning: [Brief explanation based on checklist]
Next Step: Use the `create-task-solo` or `create-task-team` skill to create the task
```
