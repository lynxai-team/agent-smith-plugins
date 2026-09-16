# Full Execution Plan: deep-search

Reference plan for executing a deep search.
The core loop is **Plan → Search/Retrieve → Read/Extract → Reflect/Fact-check → (Iterate) → Synthesize → Verify**, organized as an orchestrator–worker system. The coordinator (you) does NOT do the research itself — it delegates, gates quality, and controls budgets.

> **Execution model: strictly sequential.** Agents run one after the other — a researcher
> completes and writes its findings file before the next researcher starts. No parallel spawning.

## Architecture

```
                ┌──────────────── Coordinator (orchestrator) ────────────────┐
                │  owns: state.md, budgets, phase gating                     │
   research question (launch prompt)                                         │
   ─────────► [Phase 1] Planner agent                                        │
              decompose → .agents/tasks/deep-search/documents/plan.json                                │
                                   │                                         │
                                   ▼                                         │
              PLAN REVIEW GATE (coordinator ↔ user — mandatory)             │
              present plan.json; user decides: approve | suggest changes    │
                 suggest changes ──► re-run planner in refinement mode      │
                                     (rounds ≤ MAX_PLAN_REVISIONS), then     │
                                     re-present                              │
                                   │ approved                                │
                                   ▼                                         │
              [Phase 2] Researcher agents × N  (SEQUENTIAL, one at a time)   │
              one at a time; two-stage retrieval → .agents/tasks/deep-search/documents/findings/sqX.md │
                                   │                                         │
                                   ▼                                         │
              [Phase 3] Critic agent (pragmatic — only critical gaps)       │
              critical/minor gaps + verdict   ──┐                          │
                                   │               │ not sufficient          │
                  sufficient       ▼               ▼ refined_queries         │
              [Phase 4] Synthesizer ← back to Phase 2                        │
              cited report → .agents/tasks/deep-search/documents/report.md   (rounds ≤ MAX_REVISION)   │
```

## Phases

### Phase 1 — Plan / Decompose (`phases/phase-1-plan.md`)
- Planner role: strictly generative — decomposes, never answers.
- Input: the research question from the orchestrator's launch prompt (no input file).
- Output: `.agents/tasks/deep-search/documents/plan.json` with 3–7 non-overlapping sub-questions, slug IDs `sq1…sqN`.
- **Plan Review Gate (mandatory, coordinator ↔ user):** after the plan is written and verified, the coordinator presents it to the user; Phase 2 starts only on explicit approval. On "suggest changes" the planner re-runs in refinement mode (previous plan + verbatim feedback), capped at MAX_PLAN_REVISIONS = 3 rounds — never auto-approved.

### Phase 2 — Sequential Research (`phases/phase-2-research.md`)
- One researcher per sub-question, run **one after the other** (never in parallel).
- Two-stage retrieval: snippets first, full-page fetch only when needed.
- Output: `.agents/tasks/deep-search/documents/findings/sqX.md` — 200–400 words, inline URL citations, or "Insufficient sources."

### Phase 3 — Critique / Reflect (`phases/phase-3-critique.md`)
- Pragmatic, results-oriented critic: only **critical gaps** block (a required aspect with no usable evidence, or an unsourced/contradicted headline claim); secondary weaknesses go to non-blocking `minor_issues` (hedged in Limitations).
- Output: `.agents/tasks/deep-search/documents/critique-round-N.json` with `is_sufficient`, `critical_gaps[]`, `minor_issues[]`, `contradictions[]`, `refined_queries[]` (≤2 per round).
- Loop control: if not sufficient and round < MAX_REVISION_ROUNDS → refined queries become new Phase 2 work items (gap-replace, not append), again run sequentially.

### Phase 4 — Synthesize / Report (`phases/phase-4-synthesize.md`)
- Synthesizer writes from findings only; never searches.
- Output: `.agents/tasks/deep-search/documents/report.md` with exact structure + `[n]` citations + numbered Sources.
- Citation validation pass, then verify against original question.

## Budgets & Termination (mandatory)
| Rail | Limit |
|------|-------|
| Sub-questions | 1–7 (cap ~7 to avoid redundant searches) |
| Reflection rounds | MAX_REVISION_ROUNDS = 2–3, hard stop |
| Plan review rounds | MAX_PLAN_REVISIONS = 3, hard stop; on exhaustion → ask the user, never auto-approve |
| Per-researcher tool calls | ≤ ~10 searches/fetches per sub-question |
| Researcher personal stop | comprehensive answer, OR 3+ relevant sources, OR last 2 searches redundant, OR budget exhausted — any one stops it |
| Wall-clock sanity | if a phase seems stuck (no file output after delegation), re-delegate once, then escalate to user |

## Failure modes designed against
- **Hallucination propagation** → planner never answers; synthesizer only uses findings files.
- **Citation fabrication** → separate validation pass in Phase 4; `[n]` IDs must exist in Sources list.
- **Rabbit-hole descent** → researchers scoped strictly to their sub-question; query reformulation allowed, scope drift is not.
- **Echo-chamber retrieval** → dedupe URLs across findings files before synthesis.
- **Overspawning** → exactly one researcher per sub-question, ≤ 7 total, run sequentially (one running at a time).
- **Over-editing in reflection loop** → rounds capped at 2–3; critic "replaces" the aspect list instead of appending.

## Deliverable
`.agents/tasks/deep-search/documents/report.md` — cited, analyst-quality report answering the research question given to the orchestrator. All runtime artifacts live under `.agents/tasks/deep-search/documents/`.
