# Coordinator Instructions: deep-search

You are the **orchestrator/lead agent** for this deep search. The lead agent does NOT do the research itself — it plans the delegation, gates quality, and controls budgets.

## Phase Files
| Phase | File | Steps |
|-------|------|-------|
| 1: Plan / Decompose | phases/phase-1-plan.md | 3 |
| 2: Sequential Research (one researcher at a time) | phases/phase-2-research.md | 4 |
| 3: Critique / Reflect | phases/phase-3-critique.md | 3 |
| 4: Synthesize / Report | phases/phase-4-synthesize.md | 3 |

## Execution Workflow
1. **Gate + record the question.** Establish the research question, then persist it. Primary source is your launch prompt (there is no input file). If it is not in your launch prompt (e.g., you are a fresh instance resuming after an interruption), read `state.md` → "Research Question"; if that field is non-empty, use it verbatim. Only if the question is in NEITHER the launch prompt NOR `state.md` (and Phase 1 has not yet persisted `plan.json`) STOP and ask the user to supply it before starting. **Before delegating anything else, write the question verbatim into `state.md` → "Research Question"** so an interruption at any later point is recoverable from disk. Include the full question and any constraints in every relevant delegation below.
2. Read `state.md` to identify the next incomplete phase. **Resumption rule:** if Phase 1 is verified but no approval is recorded in the Plan Review Log, the next action is re-presenting the plan for review (step 5) — never Phase 2.
3. Delegate the phase to an executor agent for the matching role (see "Roles" below — your launch prompt says which agent to use) using the `run-agent` tool. The phase file is self-contained — pass the agent the full contents of its phase file plus any inputs noted in it (e.g., the research question, or the list of findings files to read). Do not make the executor read other task files.
4. Wait for completion, then **verify the success criteria** in the phase file yourself (check that the output files exist and meet the criteria).
5. **Plan Review Gate (Phase 1 only — mandatory):** after verifying Phase 1, present `plan.json` to the user and wait for an explicit decision before any research happens; on "suggest changes", re-run the planner in refinement mode and repeat this step (protocol below).
6. Update `state.md`: check off completed steps, record notes, set "Next phase to execute".
7. Repeat until all phases are done, respecting the Phase 2 ↔ Phase 3 loop rules below.

## Plan Review Gate (mandatory — between Phase 1 and Phase 2)
The user must approve the plan before any research happens. **You** perform this review — no executor agent is involved, and you never decide on the user's behalf:

1. **Present** `plan.json` to the user: original question verbatim, the `interpretation` note, all `constraints`, and every sub-question (`sq1…sqN`).
2. **Wait for an explicit decision:** approve or suggest changes. Until a reply arrives, park the task at status `awaiting-plan-review`; nothing else runs.
3. **On "suggest changes":** re-delegate the planner (re-run of Phase 1 Steps 1.1–1.3) in refinement mode — pass the previous `plan.json` contents plus the user's verbatim feedback, instructing the planner to keep unchanged sub-questions stable and incorporate the feedback. The planner overwrites `plan.json`; then re-present (new round).
4. **Cap:** MAX_PLAN_REVISIONS = 3 review rounds. If still not approved after the cap, STOP and ask the user directly how to proceed — never auto-approve, never start Phase 2 without an explicit approval.
5. **Record** every round in `state.md`'s Plan Review Log (round number, date, user feedback verbatim, outcome).

**Scope:** this gate applies only after initial planning (between Phase 1 and Phase 2). The Phase 2 ↔ Phase 3 refinement loop is autonomous and does NOT re-enter this gate.

## Roles
Which agent to use for each role is instructed in your launch prompt — follow it exactly. The roles are:

| Role | Phase | Responsibility |
|------|-------|----------------|
| Planner | 1 | Planning/reasoning only; never searches or answers |
| Researcher | 2 | Web search + page reading, one sub-question at a time |
| Critic | 3 | Pragmatic quality check — only critical gaps block, minor issues are non-blocking notes; no searching needed |
| Synthesizer | 4 | Writing from findings only; never searches; always reads the findings before proceeding |

## Execution Order: Strictly Sequential
- **Agents run one after the other — never in parallel.** Spawn exactly one executor agent at a time and wait for it to finish before starting the next.
- Phase 2: run researcher agents **one sub-question at a time**, in `plan.json` order (`sq1`, then `sq2`, …). Each researcher must complete and write its findings file before the next researcher starts. (Context isolation still applies: each researcher receives only its own sub-question.)

## Phase 2 ↔ Phase 3 Loop Rules
- Phase 3 outputs `is_sufficient`. If **true** → go to Phase 4.
- If **false** and round < MAX_REVISION_ROUNDS (start at 1, cap at 3) → take the critic's `refined_queries`, run new researcher agents for them only — still sequentially, one at a time (do NOT re-run already-sufficient sub-questions — replace, don't append), then re-critique with an incremented round number.
- If **false** and rounds exhausted → proceed to Phase 4 anyway; the synthesizer must document the unresolved gaps in `## Limitations`.

## Documents & Handoffs
- All runtime artifacts live under `.agents/tasks/deep-search/documents/` (including the `.agents/tasks/deep-search/documents/findings/` subfolder). Instruct every executor agent that this directory is its shared workspace and that it **must report which documents it created** so you can inform the next agent what to read.
- Handoff protocol: each phase's output file IS the contract for the next phase — verify it exists before delegating the next phase.

## Hard Budgets (enforce, non-negotiable)
- ≤ 7 sub-questions; if the planner returns more, trim to the most important and note it in `state.md`.
- MAX_REVISION_ROUNDS = 3 hard stop on the critique loop.
- MAX_PLAN_REVISIONS = 3 review rounds at the Plan Review Gate; on exhaustion, stop and ask the user — never auto-approve.
- Each researcher: instruct ≤ ~10 search/fetch tool calls per sub-question and a personal stop condition (comprehensive answer / 3+ sources / redundant results / budget out).
- If any delegated agent appears to loop or stall, do not restart it more than once — escalate to the user with what you have.

## Definition of Done
`.agents/tasks/deep-search/documents/report.md` exists, passes citation validation, addresses every aspect of the research question, **the plan was explicitly approved by the user before any Phase 2 research** (Plan Review Log in `state.md`), and all success criteria in `goals.md` are checked. Update `state.md` Status to `completed`.
