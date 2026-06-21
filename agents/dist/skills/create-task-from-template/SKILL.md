---
name: create-task-from-template
description: create an executable task by instantiating a task template with project-specific values
---

# Create Task from Template

This skill creates an executable task by instantiating a reusable task template. Templates live in `.agents/task-templates/` and contain placeholder variables that get replaced with actual values.

## Workflow

### Step 1: Identify the Template

1. Determine which template to use based on the task type
2. Available templates are in `.agents/task-templates/`
3. Load the template's `template.md` to understand required variables

**Available Templates:**

| Template | Purpose |
|----------|---------|
| `maintain-agent-docs` | Create/update agent navigation documentation (AGENTS.md, codebase-summary.md, project-nav.md, etc.) |

### Step 2: Load the Template

1. Read `template.md` to get metadata and required variables
2. Read all template files (`goals.md`, `plan.md`, `state.md`)
3. Identify all placeholder variables (format: `{variable-name}`)

### Step 3: Gather Variable Values

For each required variable:
- **Infer from context** if possible (e.g., project name from AGENTS.md)
- **Ask the user** if the value cannot be determined
- Use these common sources:
  - `AGENTS.md` — project name, repos, conventions
  - `.agents/documentation/project-nav.md` — repo paths, architecture
  - User's task description — specific scope and goals

### Step 4: Instantiate the Task

1. Create directory: `.agents/tasks/[task-name]/`
2. For each template file:
   - Read the template content
   - Replace all `{variable-name}` placeholders with actual values
   - Write the instantiated file to the task directory
3. Generate a unique task name (e.g., `maintain-agent-docs-[date]` or user-specified name)

### Step 5: Verify and Report

1. Verify all placeholders were replaced (no remaining `{...}` patterns)
2. Check that the instantiated task is coherent
3. Report to user with summary

## Output Format

After instantiation:

```
Task Created from Template: [template-name]
Task Name: [generated-task-name]
Location: .agents/tasks/[task-name]/

Variables Used:
- {variable1}: value1
- {variable2}: value2

Files Created:
- goals.md
- plan.md
- state.md
- [additional files if template includes them]

Next Step: Review the task and execute with `execute-task-solo` or `execute-task-team`
```

## Placeholder Conventions

- All placeholders use `{variable-name}` format
- Common variables:
  - `{project-name}` — Project name
  - `{repo-path}` — Path to repository
  - `{module-name}` — Module/package name
  - `{task-scope}` — Specific scope of this task instance
  - `{changed-files}` — Files that changed (for update tasks)
  - `{target-path}` — Where output should be placed

## Example: Instantiating maintain-agent-docs Template

**User Request:** "Update documentation for agent-smith-plugins after adding a new plugin"

**Process:**
1. Load `maintain-agent-docs` template
2. Read `template.md` → requires: `{project-name}`, `{repo-path}`, `{changed-files}`
3. Infer values:
   - `{project-name}` = "Agent Smith" (from AGENTS.md)
   - `{repo-path}` = "/workspace/agent-smith-plugins/"
   - `{changed-files}` = User specifies: "new video plugin added"
4. Instantiate task at `.agents/tasks/maintain-agent-docs-video-plugin/`
5. All placeholders replaced, task is ready for execution

## Rules

- **Never skip variable gathering** — All required variables must have values
- **Preserve template structure** — The instantiated task follows the same file layout
- **Task name uniqueness** — Each instantiation gets a unique name
- **Template is read-only** — Never modify the original template files
- **Verify completeness** — Check no placeholders remain after instantiation
