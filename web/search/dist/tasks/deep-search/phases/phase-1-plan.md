# Phase 1: Plan / Decompose (Planner)

## Context
- **Task ID:** deep-search
- **Current state:** The research question is given to you in your delegation prompt by the coordinator (there is no input file). No research has happened yet.
- **Target:** Produce a plan of 3–7 non-overlapping, web-searchable sub-questions that, taken together, fully address the original question — persisted to a file for the researcher fan-out.

### Files to Read / Write
| File | Purpose |
|------|---------|
| — (delegation prompt) | READ: the research question + optional constraints, provided by the coordinator |
| `.agents/tasks/deep-search/documents/plan.json` | WRITE: planner output (the contract for Phase 2) |
| `.agents/tasks/deep-search/state.md` | WRITE (coordinator only, Steps 1.4–1.5): Plan Review Log + approval record |

---

## Phase Goal
Decompose the research question into focused sub-tasks suitable for web research (researchers will run one after the other, in plan order). The planner is **strictly generative: it must NOT answer the question** — only plan. This prevents researchers from being graded against predetermined conclusions.

---

### Step 1.1: Load the Research Question
**Source:** delegation prompt (provided by the coordinator)
**Execution Plan:** Take the primary question and any scope constraints/audience notes from your delegation prompt. If the question is ambiguous, choose the most reasonable interpretation and record it in the plan's `interpretation` field — do not block on clarification unless the coordinator instructed otherwise.
**Success Criteria:**
- [ ] The question is a single, concrete sentence answerable via live web search
- [ ] Any scope constraints (dates, vendors, exclusions) are noted for downstream phases

### Step 1.2: Decompose into Sub-Questions
**Execution Plan:** Apply this planner role exactly:

```text
You are a research planner. Your job is to decompose the user's question into a small set of
specific, non-overlapping sub-questions that, taken together, fully address the original.
Sub-questions must be answerable via web search. Rules:
 - Produce between 1 and 7 sub-questions (use as few as sufficient; prefer 3–5).
 - If the question is trivial, return a single sub-question.
 - Sub-questions must be specific. Avoid vague phrasings like "tell me more".
 - Sub-questions must not overlap. Each should target a distinct facet.
 - IDs must be short slugs: "sq1", "sq2", ...
Return only structured output matching the requested schema.

Do NOT answer the question; only plan. Prefer non-overlapping coverage over exhaustive coverage.
```

Respect any scope constraints from the delegation prompt when shaping sub-questions (e.g., bake a "since 2024" limit into the wording).

**Refinement mode (re-runs only):** if your delegation prompt includes a *previous plan* and *user feedback*, you are refining, not re-planning from scratch: keep sub-questions the user did not object to stable (same IDs and wording where possible) and change only what the feedback requires.
**Success Criteria:**
- [ ] 1–7 sub-questions, each specific and independently web-searchable
- [ ] No overlap: each targets a distinct facet; together they cover the full question
- [ ] IDs are slugs `sq1`, `sq2`, …

### Step 1.3: Persist the Plan
**File:** `.agents/tasks/deep-search/documents/plan.json`
**Execution Plan:** Write the plan as JSON matching this schema:
```json
{
  "question": "<the original question verbatim>",
  "interpretation": "<one-line note on how ambiguous parts were interpreted, or null>",
  "constraints": ["<scope constraints carried from the delegation prompt, empty if none>"],
  "sub_questions": [
    { "id": "sq1", "question": "<specific sub-question>" }
  ]
}
```
Then report to the coordinator: (a) which documents you created (`.agents/tasks/deep-search/documents/plan.json`), (b) the number of sub-questions, (c) the sub-question list.
**Success Criteria:**
- [ ] `.agents/tasks/deep-search/documents/plan.json` exists and is valid JSON matching the schema above
- [ ] Coordinator can see all sub-questions in the agent's report

### Step 1.4 (Coordinator): Present Plan for User Review
**Execution Plan:** After verifying `plan.json` per the coordinator workflow, the **coordinator** — no executor agent is involved in this review — presents the plan to the user: the original question verbatim, the `interpretation` note, all `constraints`, and every sub-question (`sq1…sqN`). Ask the user for a decision: **approve** or **suggest changes**. Record the round number and the user's feedback verbatim in `.agents/tasks/deep-search/state.md` (Plan Review Log).
**Success Criteria:**
- [ ] The user was shown the full plan (question, interpretation, constraints, all sub-questions)
- [ ] A decision (approve / suggest changes) is recorded in `state.md`

### Step 1.5 (Coordinator): Act on the Decision
**Execution Plan:**
- **Approve** → mark Phase 1 complete; proceed to Phase 2.
- **Suggest changes** → re-delegate the planner for a re-run of Steps 1.1–1.3 in **refinement mode**: include the previous `plan.json` contents and the user's verbatim feedback in the delegation prompt, instructing the planner to keep unchanged sub-questions stable and incorporate the feedback. The planner overwrites `plan.json`. Then return to Step 1.4 for a new round.
- Loop cap: **MAX_PLAN_REVISIONS = 3** review rounds. If the plan is still not approved after the cap, STOP and ask the user directly how to proceed — never auto-approve.
**Success Criteria:**
- [ ] Each refinement produced a `plan.json` that visibly incorporates the feedback
- [ ] Phase 2 has NOT started until an explicit approval is recorded in `state.md`

---

## Done When
`.agents/tasks/deep-search/documents/plan.json` exists, is valid, has 1–7 non-overlapping sub-questions, and the coordinator has been told what to expect in Phase 2 (one researcher per `sub_questions[]` entry), **and the plan has been explicitly approved by the user at the Plan Review Gate** (recorded in `.agents/tasks/deep-search/state.md`).
