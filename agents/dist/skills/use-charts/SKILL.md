---
name: use-charts
description: use when asked to produce or display a Mermaid diagram or a Chart.js chart configuration. Emits Mermaid diagrams as fenced mermaid code blocks and Chart.js configs as valid JSON inside a <chart> tag (no backticks). Triggered by requests like "make a flowchart", "show this data as a chart".
---

# Output Diagrams

Emit diagrams in the two supported formats: Mermaid (fenced code block) and Chart.js (JSON inside `<chart>`).

## Workflow

1. **Identify the diagram type** from the request:
   - *Mermaid* — a structural/relational diagram (flowchart, sequence, class, state, Gantt, ER, pie, etc.).
   - *Chart.js* — data visualization (bar, line, pie, doughnut, radar, scatter).

2. **For Mermaid** — wrap the full diagram source in a fenced code block tagged `mermaid`, with nothing else outside it. The block starts on a line that is exactly three backticks followed by the word `mermaid`, and closes with a line of three backticks. Example body:
   ```
   flowchart TD
       A[Start] --> B{Done?}
       B -- Yes --> C[End]
       B -- No --> A
   ```

3. **For Chart.js** — build a valid JSON configuration object and wrap it ONLY in `<chart>…</chart>` tags, with no backticks and no prose:
   - Top-level `type` (bar/line/pie/doughnut/radar/scatter), `data` (labels + datasets), optional `options`.
   - Emit raw valid JSON — no comments, no trailing commas, double-quoted keys/strings.

## Gotchas

- **Chart.js output is valid JSON only inside `<chart>`** — never use backticks for it and never add explanatory text around the tag.
- **Mermaid always uses a fenced `mermaid` block** — do not put Mermaid source inside `<chart>`.
- Keep each output self-contained: emit just the diagram, then stop (a one-line follow-up offer is fine).
