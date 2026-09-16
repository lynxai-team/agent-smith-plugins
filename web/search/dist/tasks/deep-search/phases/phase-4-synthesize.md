# Phase 4: Synthesize / Report (Synthesizer + Citation Validation)

## Context
- **Task ID:** deep-search
- **Current state:** Research is closed — either the critic voted `is_sufficient: true` or the revision budget (3 rounds) was exhausted. All evidence lives in `.agents/tasks/deep-search/documents/findings/*.md`; verdict history in `.agents/tasks/deep-search/documents/critique-round-*.json`.
- **Target:** The final deliverable: a cited, analyst-quality report at `.agents/tasks/deep-search/documents/report.md`.

### Files to Read / Write
| File | Purpose |
|------|---------|
| `.agents/tasks/deep-search/documents/plan.json` | READ: the original question verbatim (audience/depth constraints are additionally provided by the coordinator in your delegation prompt) |
| `.agents/tasks/deep-search/documents/findings/*.md` | READ: ALL findings (the only evidence allowed) |
| `.agents/tasks/deep-search/documents/critique-round-*.json` | READ: unresolved gaps/contradictions to carry into Limitations |
| `.agents/tasks/deep-search/documents/report.md` | WRITE: the final report (deliverable) |

> **Hard rule:** the synthesizer **never searches** and all reads the `.agents/tasks/deep-search/documents/sqX.md` files before analyzing. It writes from the provided findings and sources only. If a fact is not in the findings files, it does not go in the report.

---

## Phase Goal
Consolidate all findings into one coherent cited report: deduplicate evidence, unify citation numbering, reconcile what can be reconciled, and honestly document what cannot.

---

### Step 4.1: Write the Report
**File:** `.agents/tasks/deep-search/documents/report.md`
**Execution Plan:** Apply this synthesizer role exactly:

```text
You are a senior research analyst. Write a comprehensive answer to the user's question using ONLY
the provided findings and sources. Use Markdown. Cite every factual claim inline using `[n]` markers
that map to the numbered Sources section at the end. Number sources in the order of first citation.
Honesty rules:
 - If the research could not resolve a contradiction, state so in Limitations.
 - Never invent sources. Only use sources from the provided list.
 - Never cite a fact that is not actually supported by the sources you have.
Required output structure (exactly):
 # {Title — rephrase the question as a noun-phrase title}
 ## Summary   A 2–3 sentence direct answer to the user's question.
 ## Findings  Prose organized by sub-question. Use `[n]` inline citations.
 ## Limitations  What you could not resolve, or known caveats. If none, write "None significant."
 ## Sources  1. [Title](URL) 2. [Title](URL) ...
```

Consolidation rules: dedupe sources across findings files (one URL = one numbered entry); merge contradicting evidence into the most defensible statement with both sides cited; carry every unresolved gap/contradiction from the final critique file into `## Limitations`; respect the audience/depth constraints provided by the coordinator in your delegation prompt.
**Success Criteria:**
- [ ] Report exists at `.agents/tasks/deep-search/documents/report.md` with the exact required section structure
- [ ] Every factual claim carries an inline `[n]` citation
- [ ] No source appears in `## Sources` that is not present in any findings file

### Step 4.2: Citation Validation Pass (separate, mechanical)
**File:** `.agents/tasks/deep-search/documents/report.md` (verify only; fix numbering if broken)
**Execution Plan:** Run a dedicated validation pass (do not trust the writing pass):
1. Collect every `[n]` used in Summary/Findings.
2. Verify each `n` exists in `## Sources` and that numbering is in order of first citation.
3. Verify each `## Sources` entry URL appears in at least one findings file (no invented sources).
4. Fix any broken mapping by editing the report; if a claim has no valid source, remove or qualify the claim — never patch it with an invented citation.
**Success Criteria:**
- [ ] Every `[n]` resolves to a Sources entry
- [ ] Every Sources entry is traceable to a findings file
- [ ] Numbering follows order of first citation

### Step 4.3: Verify Against the Original Question & Finalize
**Execution Plan:** Re-read the original question from `.agents/tasks/deep-search/documents/plan.json` and confirm every aspect of the question is addressed (or explicitly listed in Limitations). Report to the coordinator: final deliverable path, source count, any remaining limitations, and a one-paragraph executive answer. Coordinator updates `state.md` Status to `completed`.
**Success Criteria:**
- [ ] Every facet of the original question is covered or documented as a limitation
- [ ] `state.md` reflects completion; user has been shown the report location

---

## Done When
`.agents/tasks/deep-search/documents/report.md` passes citation validation, covers the full question (gaps honestly documented in Limitations), and the coordinator has marked the task completed.
