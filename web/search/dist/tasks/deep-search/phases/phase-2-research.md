# Phase 2: Sequential Research (one researcher at a time)

## Context
- **Task ID:** deep-search
- **Current state:** `.agents/tasks/deep-search/documents/plan.json` exists with sub-questions `sq1…sqN`. In revision rounds, the coordinator may instead provide a list of **refined queries** from the critic — in that case research ONLY those.
- **Target:** A cited findings file per sub-question (or refined query) in `.agents/tasks/deep-search/documents/findings/`, each grounded in live web sources.

### Files to Read / Write
| File | Purpose |
|------|---------|
| `.agents/tasks/deep-search/documents/plan.json` | READ: the assigned sub-question(s) + constraints |
| `.agents/tasks/deep-search/documents/findings/sqX.md` | WRITE: one findings file per sub-question (or `refined-N.md` for revision queries) |

> **Execution order: strictly sequential.** The coordinator runs one researcher agent at a time — in `plan.json` order (`sq1`, then `sq2`, …) — and waits for each findings file before starting the next. No agents run in parallel. Context isolation still applies: each researcher is an isolated "intelligent filter" that receives only its own sub-question, the role prompt below, and retrieval tools. Researchers do NOT share execution state and must not see other sub-questions' work.

---

## Phase Goal
For each assigned sub-question: run focused web research (two-stage retrieval), then write a concise, fully cited synthesis — or explicitly declare "Insufficient sources."

---

### Step 2.1: Receive Assignment & Search
**Execution Plan:** Each researcher applies this role exactly:

```text
You are a focused web researcher. You have two tools:
 - `web_search(query)` — search the web; returns hits with url/title/snippet/score.
 - `web_fetch(url)` — fetch full text from a URL.
Workflow you MUST follow:
 1. Call `web_search` once with a focused query for the assigned sub-question.
 2. Inspect the snippets. Pick the top 3–5 most promising URLs (prefer authoritative,
    recent, on-topic sources; avoid duplicates and low-quality content farms).
 3. Call `web_fetch` on each picked URL (two-stage: only fetch pages whose snippet was
    not already enough — this is a cost optimization, skip fetches you don't need).
 4. After fetches return, write a concise findings synthesis (200-400 words) for the sub-question.
Citation rules in the synthesis:
 - Inline-mark every factual claim with the URL in square brackets, e.g.
   "X grew 12% in 2024 [https://example.com/report]".
 - Do NOT invent facts. If sources disagree, say so explicitly.
 - If the search returned nothing useful, say "Insufficient sources." and stop.
Stay strictly on the assigned sub-question.
```

If a search returns nothing useful for your query, reformulate once (different terms, narrower/broader scope) — but do not drift off the assigned sub-question:
```text
The search for '{query}' returned nothing useful for the question '{question}'.
Rewrite the search query to use different terms or a narrower/broader scope.
```

**Stop conditions (any one ends your research):** you can answer comprehensively; OR you have 3+ relevant sources; OR your last 2 searches returned similar/redundant information; OR you have made ~10 search/fetch calls (hard budget).
**Success Criteria:**
- [ ] At least one web search was performed for the sub-question
- [ ] Retrieval was two-stage (snippets inspected before any full-page fetch)
- [ ] A stop condition was met (recorded implicitly in the findings file)

### Step 2.2: Write Cited Findings
**File:** `.agents/tasks/deep-search/documents/findings/sqX.md` (or `.agents/tasks/deep-search/documents/findings/refined-N.md` for revision-round queries)
**Execution Plan:** Write the synthesis with this structure:
```md
# Findings: sqX — <sub-question text>

## Synthesis
<200–400 words, every factual claim inline-cited as [https://url]>

## Sources consulted
- https://url1 (why it was used)
- https://url2 (...)
```
Rules: dedupe URLs against nothing you fetched twice; if sources disagree, state the contradiction explicitly with both citations; if nothing useful was found, the file must contain exactly the marker `Insufficient sources.` plus the queries tried.
**Success Criteria:**
- [ ] File exists at the correct path
- [ ] 200–400 word synthesis (or the "Insufficient sources." marker)
- [ ] Every factual claim has an inline URL citation

### Step 2.3: (Coordinator) Verify Fan-out Completeness
**Execution Plan:** The coordinator checks that every entry in `plan.json` (or every refined query this round) has a findings file. Missing → re-delegate that sub-question once with a note about the gap.
**Success Criteria:**
- [ ] `.agents/tasks/deep-search/documents/findings/` contains one file per assigned sub-question/refined-query

### Step 2.4: Report Handoff
**Execution Plan:** Each researcher reports to the coordinator: which findings file it created, how many sources consulted, and whether any contradictions were noted. The coordinator records this in `state.md` Notes and uses it to brief Phase 3.
**Success Criteria:**
- [ ] Coordinator knows exactly which documents exist for the critic to read

---

## Done When
Every assigned sub-question/refined-query has a findings file (synthesis or "Insufficient sources.") and the coordinator has the full list of created documents.
