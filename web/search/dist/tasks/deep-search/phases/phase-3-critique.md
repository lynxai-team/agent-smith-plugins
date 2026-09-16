# Phase 3: Critique / Reflect (Pragmatic Quality Gate)

## Context
- **Task ID:** deep-search
- **Current state:** Findings files exist in `.agents/tasks/deep-search/documents/findings/` for all sub-questions (or refined queries of the current round). This is reflection round N (coordinator passes N; starts at 1, hard cap MAX_REVISION_ROUNDS = 3).
- **Target:** A pragmatic, results-oriented verdict on whether the research suffices to write the final report (only critical gaps block), plus at most 2 targeted refined queries if not.

### Files to Read / Write
| File | Purpose |
|------|---------|
| `.agents/tasks/deep-search/documents/plan.json` | READ: the original question verbatim (the only thing being judged) + the planned sub-questions |
| `.agents/tasks/deep-search/documents/findings/*.md` | READ: all findings produced so far |
| `.agents/tasks/deep-search/documents/critique-round-N.json` | WRITE: critic output for this round |

> **Isolation rule:** the critic does NOT search and does NOT call/use other agents. It judges only what is in the files above. This keeps the quality gate from being skipped or softened by new retrieval.

---

## Phase Goal
Act as a **pragmatic, results-oriented quality gate**. The goal is to ship a good final report, not to exhaust every possible doubt. Decide `is_sufficient` — leaning toward **true** — and only block (false) for the **most critical gaps**: those that would make the final report impossible to write honestly or would put an unsourced headline claim into it. If false, produce at most 2 refined queries closing exactly those critical gaps.

---

### Step 3.1: Evaluate with the Role Prompt
**Execution Plan:** Apply this critic role exactly:

```text
You are a pragmatic research quality gate, oriented toward results. You will receive: the original
user question, the planned sub-questions, and the findings produced by the researchers. Evaluate
whether the final report can be written now:
 - critical_gaps (BLOCKING): only these — a required aspect of the question with NO usable
   evidence at all, a headline claim in the future Summary that is unsourced or contradicted by
   another source, or a sub-question skipped entirely.
 - minor_issues (NON-BLOCKING): single-source support on secondary facts, thin or partial answers
   that can be honestly hedged in Limitations, unresolved non-material discrepancies. List them so
   the synthesizer can qualify/hedge them — they do NOT block the verdict.
 - contradictions: material factual disagreements across sources that would change a headline claim
   (cite both URLs).
 - is_sufficient: true unless at least one critical_gap exists. When in doubt, vote sufficient and
   push the concern into minor_issues.
If is_sufficient is false, propose AT MOST 2 refined_queries — specific, targeted web-search queries
that close only the critical gaps. Otherwise leave refined_queries empty.
Return only structured output matching the requested schema.
```

Apply the **headline-claim rule (the only blocking sourcing bar):** any claim the final Summary will lean on needs at least one credible, cited source; a headline claim resting on no source or contradicted by another source is a critical gap. Everything else (secondary facts, partial coverage) is judged as minor unless it is entirely missing.
**Success Criteria:**
- [ ] Every findings file was actually read and considered
- [ ] Verdict is results-oriented: only critical gaps block; secondary weaknesses are recorded in `minor_issues` (non-blocking), never used to fail an otherwise usable research set

### Step 3.2: Write the Verdict
**File:** `.agents/tasks/deep-search/documents/critique-round-N.json` (N = current round, e.g., `critique-round-1.json`)
**Execution Plan:** Write valid JSON matching this schema:
```json
{
  "round": 1,
  "is_sufficient": false,
  "critical_gaps": ["<sub-question id + what is left unusable for the final report and why>"],
  "minor_issues": ["<non-blocking: e.g. single-source secondary fact, thin partial answer — to be hedged in Limitations>"],
  "contradictions": ["<material disagreement on a headline claim + both URLs>"],
  "refined_queries": [
    { "id": "refined-1", "query": "<specific targeted web-search query>", "closes_gap": "sq2" }
  ]
}
```
If `is_sufficient` is true, `critical_gaps`, `contradictions` and `refined_queries` must be empty lists (`minor_issues` may still carry notes for the synthesizer). **Replace, don't append:** refined queries (max 2) target only critical gaps — do not re-request sub-questions that already passed.
**Success Criteria:**
- [ ] File exists and is valid JSON matching the schema
- [ ] `is_sufficient: true` ⇒ `refined_queries: []`; when false, ≤ 2 refined queries, one per critical gap

### Step 3.3: (Coordinator) Loop Control
**Execution Plan:** Coordinator reads the verdict:
- `is_sufficient: true` → mark Phase 3 done, proceed to Phase 4.
- `is_sufficient: false` and round < 3 → delegate **only** the `refined_queries` to new researcher agents (Phase 2 workflow, files `.agents/tasks/deep-search/documents/findings/refined-N.md`), then re-run this phase with round+1.
- `is_sufficient: false` and round = 3 (budget exhausted) → record in `state.md` Notes that the budget was exhausted, proceed to Phase 4; unresolved gaps must surface in the report's Limitations.
**Success Criteria:**
- [ ] Exactly one path taken per round; loop can never exceed round 3

---

## Done When
A verdict file exists for this round AND either `is_sufficient: true` or the revision budget is exhausted (recorded). The coordinator knows whether to fan out again or proceed to synthesis.
