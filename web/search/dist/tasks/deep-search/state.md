# Task State: deep-search

## Status: planned

## Research Question (canonical resume copy)
- Written verbatim by the coordinator **before Phase 1** so a fresh coordinator can resume even if its launch prompt lacks the question.
- **Question:** _(filled in at run start — empty until the first run begins)_

## Phase Files
| Phase | File | Steps |
|-------|------|-------|
| 1: Plan / Decompose | phases/phase-1-plan.md | 3 |
| 2: Sequential Research (one researcher at a time) | phases/phase-2-research.md | 4 |
| 3: Critique / Reflect (loop, max 2–3 rounds) | phases/phase-3-critique.md | 3 |
| 4: Synthesize / Report | phases/phase-4-synthesize.md | 3 |

## Progress
### Phase 1: Plan / Decompose
- [ ] Step 1.1: Receive research question from orchestrator launch prompt
- [ ] Step 1.2: Decompose into non-overlapping sub-questions (planner role)
- [ ] Step 1.3: Persist plan to `.agents/tasks/deep-search/documents/plan.json`
- [ ] Step 1.4 (Coordinator): Present plan to user for review — Plan Review Gate (round N)
- [ ] Step 1.5 (Coordinator): Record decision — approve → Phase 2; suggest changes → re-run planner in refinement mode

### Phase 2: Sequential Research
- [ ] Step 2.1: Run researcher agents ONE AT A TIME (sequential, no parallelism)
- [ ] Step 2.2: Two-stage retrieval (snippets → full pages as needed)
- [ ] Step 2.3: Write cited findings to `.agents/tasks/deep-search/documents/findings/sqX.md`
- [ ] Step 2.4: Verify all sub-questions have a findings file

### Phase 3: Critique / Reflect
- [ ] Step 3.1: Pragmatic critic evaluates answer quality (only critical gaps block; minor issues non-blocking)
- [ ] Step 3.2: If insufficient → refined queries back to Phase 2 (round ≤ 2–3)
- [ ] Step 3.3: If sufficient → mark research complete

### Phase 4: Synthesize / Report
- [ ] Step 4.1: Write final report from findings only (`.agents/tasks/deep-search/documents/report.md`)
- [ ] Step 4.2: Citation validation pass (every `[n]` resolvable, no invented sources)
- [ ] Step 4.3: Verify against original question; finalize

## Budgets & Rails
- Sub-questions: max 7 (planner cap)
- Reflection rounds (`MAX_REVISION_ROUNDS`): 2–3 hard stop
- Plan review rounds (`MAX_PLAN_REVISIONS`): 3 hard stop at the Plan Review Gate (never auto-approve on exhaustion)
- Per-researcher searches: ≤ ~10 tool calls per sub-question, hard stop
- **Execution model: strictly sequential — agents run one after the other, never in parallel**
- No unbounded loops — every loop above has a defined termination condition

## Plan Review Log
One row per review round at the Plan Review Gate (between Phase 1 and Phase 2). Feedback is recorded verbatim.

| Round | Date | User feedback (verbatim) | Outcome |
|-------|------|--------------------------|---------|

## Notes
- The research question is supplied to the orchestrator via its launch prompt (no input file). The coordinator records it verbatim in `state.md` → "Research Question" **before Phase 1** (canonical resume copy); Phase 1 then records it verbatim in `.agents/tasks/deep-search/documents/plan.json`. On resume, a fresh coordinator uses the `state.md` copy if its launch prompt lacks the question.
- All runtime artifacts are written under `.agents/tasks/deep-search/documents/` only.
- Allowed statuses: `planned`, `awaiting-plan-review` (parked at the Plan Review Gate), `in-progress`, `completed`.
- Next phase to execute: Phase 1 (once the orchestrator has received the research question)
