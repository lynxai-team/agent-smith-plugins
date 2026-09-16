# Goals and Success Criteria: deep-search

## Primary Goal
Execute a full **deep search / deep research** cycle: autonomously plan, run sequential web
research (one researcher agent at a time), critique for gaps, and synthesize a
**cited, analyst-quality report** answering the research question given to the
orchestrator as its launch prompt.

## Success Criteria
- [ ] The research question is provided to the orchestrator via its prompt at task start; it is recorded verbatim in `.agents/tasks/deep-search/documents/plan.json` by Phase 1.
- [ ] Plan decomposes the question into 3–7 non-overlapping, web-searchable sub-questions with slug IDs (`sq1`, `sq2`, …), persisted to `.agents/tasks/deep-search/documents/plan.json`.
- [ ] The plan is explicitly approved by the user at the Plan Review Gate before any Phase 2 research starts; every review round and the user's verbatim feedback are recorded in `state.md` (never auto-approved).
- [ ] Every sub-question has a findings file in `.agents/tasks/deep-search/documents/findings/` containing 200–400 words of synthesis **or** an explicit "Insufficient sources." note.
- [ ] Every factual claim in findings and the final report carries an inline URL citation; no invented facts or sources.
- [ ] Research agents ran strictly sequentially (one at a time, each completing before the next started).
- [ ] Critique phase ran as a pragmatic, results-oriented gate — only critical gaps block (`minor_issues` are non-blocking notes for the synthesizer); `is_sufficient: true` achieved within `MAX_REVISION_ROUNDS = 2–3` (or budget explicitly exhausted and recorded).
- [ ] Final report at `.agents/tasks/deep-search/documents/report.md` follows the exact required structure (`# Title`, `## Summary`, `## Findings`, `## Limitations`, `## Sources`) with `[n]` inline citations mapping to numbered sources in order of first citation.
- [ ] Citation validation pass confirms every `[n]` maps to an entry in the Sources list and every cited source was actually consulted.
- [ ] All budgets respected: per-researcher search-call caps, max 2–3 reflection rounds, no unbounded loops.

## Files Modified (all runtime artifacts live under `.agents/tasks/deep-search/documents/`)
- `.agents/tasks/deep-search/documents/plan.json` — planner output (sub-questions)
- `.agents/tasks/deep-search/documents/findings/sqX.md` — per-sub-question findings with citations
- `.agents/tasks/deep-search/documents/critique-round-N.json` — critic outputs per round
- `.agents/tasks/deep-search/documents/report.md` — final cited report (deliverable)
- `.agents/tasks/deep-search/state.md` — progress tracking (updated by coordinator)

## Exclusions
- No code changes to any repository. This task is pure research + reporting.
- No answering from model training data only — every claim must be web-grounded with citations.
- No single-shot "search once and write" — the reflect/iterate loop is mandatory.
