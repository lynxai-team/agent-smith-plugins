---
name: create-skill
description: use when asked to create a skill from a task just completed in this session - extracts the reusable procedure from the user request and context window content, then writes a new SKILL.md
---

# Create Skill (from a completed task)

Turn the task you just executed into a reusable skill. The source of truth is your **current context window**: the original user request, every step you performed, corrections made along the way, and the final result. Do not re-ask for information already in context; do not invent steps that were not actually performed. If the task execution is NOT in your context (e.g. done in a previous session), ask the user for the missing steps instead of guessing.

## When to create (and when not)

**Worth creating:**
- multi-step procedure with a repeatable sequence of operations
- non-obvious project conventions, paths, flags, or edge cases you had to discover during the task
- a task where corrections were made — those corrections are encoded expertise

**Not worth it:**
- trivial one-step operations ("read file X", "run command Y") — the agent handles these without help
- work specific to this instance with nothing generalizable
- an existing skill already covers it → propose updating that skill instead of creating a new one

## Workflow

1. **Reconstruct the task** — from context: goal, inputs, constraints, final output format.
2. **Extract the procedure** — pull out of the conversation:
   - the ordered steps that worked (tool calls, commands, file operations)
   - every failure and correction → becomes a rule or gotcha
   - project-specific facts: paths, conventions, exact tools/flags, formats
3. **Check for overlap** — list existing skills in the skills directory; if one already covers this procedure, propose updating it instead of creating a new skill.
4. **Name it** — kebab-case, lowercase `a-z0-9-` only, ≤64 chars, no leading/trailing/consecutive hyphens. The folder name MUST equal the `name` field. Derive from the task class (e.g. `create-or-update-readme`), not from this session's specifics.
5. **Write the description** — follow "Writing the description" below; it decides whether the skill ever gets loaded.
6. **Write** `<skills-dir>/<name>/SKILL.md` using the format below.
7. **Verify** — re-read the file: frontmatter valid, name matches folder, description ≤1024 chars, body < 500 lines / ~5k tokens (if available, also run `skills-ref validate ./<name>`). Confirm discovery too: a skill is only found if its folder (containing `SKILL.md`) sits inside a skills directory your agent scans — verify the final path.
8. **Report + iterate** — show the user the created path and a one-line summary; offer to test it by running the skill on a similar task, and fold any corrections into gotchas.

## Writing the description

The description is the ONLY content an agent sees before deciding to load the skill — it carries the entire triggering burden.

- **Imperative phrasing**: "use when …", not "this skill does …"
- **What + when**: what it accomplishes AND the trigger condition, in 1–3 sentences
- **Err on pushy**: list contexts where it applies, including how users might phrase the request without naming the domain; include keywords users actually say
- **Focus on user intent**, not implementation details
- ≤1024 chars (aim < 300)

```yaml
# good — what + when + trigger keywords
description: use when asked to create or update the README for a package - analyzes the codebase and writes a concise, structured readme
# bad — no trigger condition, no keywords
description: helps with readmes
```

## SKILL.md format

```markdown
---
name: <kebab-case-name>
description: use when <trigger condition, imperative>. What it does + when to apply it.
---

# <Title>

One line: what this skill accomplishes.

## Workflow

1. **<Step>** — imperative instruction; exact command / file path where precision matters
...

## Gotchas

- <concrete correction to a mistake an agent would otherwise make>
```

Use only `name` and `description` in frontmatter by default. Add `compatibility` when the task revealed environment requirements (runtime versions, packages, network access); `license`/`metadata` only if the user asks.

**Body guidelines:**
- Numbered, imperative steps in execution order; one default approach per step
- Include a concrete worked example (input → output) when the task produced a specific format — agents pattern-match against structure better than prose
- Keep `Gotchas` in SKILL.md itself (not in references/) so they are read before the agent hits the situation
- < 500 lines / ~5k tokens; move long reference material to `references/` and state *when* to load it

## Extraction rules

- **Generalize** — replace this run's specific values (filenames, IDs, dates) with placeholders (`<project-dir>`, `{name}`); keep the procedure, not the transcript.
- **Add what the agent lacks, omit what it knows** — no generic explanations (how git works, what a PDF is). Keep: project conventions, non-obvious edge cases, exact commands/flags, domain rules. Test each line: "would the agent get this wrong without it?" If no → cut it.
- **Defaults over menus** — one approach per step; mention an alternative only where a real branch exists.
- **Calibrate precision** — prescriptive (exact command, "do not modify") where fragile or order matters; imperative with rationale where multiple approaches work.
- **Gotchas are the highest-value content** — every mistake made and fixed during the task belongs there.
- **One coherent unit of work per skill** — don't merge unrelated tasks into one skill; don't split a single procedure into several.
- **Bundle only what exists** — add `scripts/`, `references/`, `assets/` only if the task produced reusable artifacts; reference them by relative path, one level deep, and state *when* to load each file. Prefer calling an existing tool with a pinned version (e.g. `npx eslint@9`) over bundling a new script; bundle a tested script only when the command is hard to get right on the first try.
- **Scripts must be agentic-friendly** — no interactive prompts, usage documented via `--help`, structured data on stdout (JSON/CSV) with diagnostics on stderr. Before writing or modifying a bundled script, read the full guide: https://agentskills.io/skill-creation/using-scripts.md

## Deeper tuning (read only when needed)

One execute-then-revise pass usually suffices. If not, read the matching guide **before** doing that work:

- **Skill doesn't trigger — or triggers on wrong tasks** → tune the description with eval-driven testing (~20 labeled queries, run repeatedly, measure trigger rate): https://agentskills.io/skill-creation/optimizing-descriptions.md
- **Need to prove the skill improves results** (not just "seemed to work") → with/without-skill baselines, assertions, grading: https://agentskills.io/skill-creation/evaluating-skills.md

## Placement

Write the skill in the active skills directory (where this skill lives, e.g. `agent-smith-plugins/agents/dist/skills/<name>/SKILL.md`) unless the user specifies a location.
