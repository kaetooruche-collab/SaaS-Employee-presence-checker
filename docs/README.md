# Workplace Presence SaaS — Project Documentation

This is the persistent, authoritative documentation set for the workplace presence/availability SaaS
investigation, maintained under the Master Prompt mandate: determine whether this product should exist,
define the exact product to build, investigate failure modes, and produce an evidence-backed implementation
plan before any production code is written.

**Status as of this version: Stage 0 — Problem framing and first-pass research. No product has been
defined. No architecture has been chosen. No code exists or should exist yet.**

## Reading order for a new session

1. `01-decision-log.md` — decisions made so far and their rationale (currently: none finalized)
2. `04-open-questions.md` — ranked unresolved questions, read this before doing new research so you don't
   duplicate work
3. `02-assumptions.md` — what we are provisionally treating as true, and how confident we are
4. `00-project-charter.md` — mandate, scope, constraints
5. The rest, as needed for the topic at hand

## Document index

| File | Purpose | Status |
|---|---|---|
| `00-project-charter.md` | Mandate, hypothesis, scope, non-goals, approval gates | Drafted |
| `01-decision-log.md` | Every material decision, with date, rationale, rejected alternatives | Started |
| `02-assumptions.md` | Explicit assumptions, confidence level, falsification plan | Started |
| `03-research-log.md` | Every research question asked, sources consulted, dates, limitations | Started |
| `04-open-questions.md` | Ranked unresolved questions blocking the next gate | Started |
| `05-legal-register.md` | Jurisdiction, applicable law, local-counsel questions | Started — first pass |
| `06-competitor-analysis.md` | Direct/indirect competitors, pricing, bundled capability | Started — first pass |
| `07-market-analysis-northern-cyprus.md` | TRNC market sizing evidence and its limits | Started — first pass |
| `08-risk-register.md` | Prioritized risks across demand, legal, technical, commercial | Started — first pass |
| `09-changelog.md` | Chronological log of what changed in these docs and why | Started |
| PRD, UX spec, architecture, DB design, integration spec, data governance, threat model, test strategy, commercial model, GTM plan, ops runbook, roadmap | Product/engineering deliverables | **Not started — blocked on research and approval gate per Master Prompt. Do not start.** |

## Rules this project follows (from the Master Prompt, restated for operational use)

- Separate verified facts, hypotheses, estimates, opinions, and unknowns at all times. Every claim in these
  docs is tagged with one of these five labels.
- Cite primary sources for legal, technical, API, and pricing claims; record the date accessed and known
  limitations of the source.
- Never invent facts. If evidence is unavailable, say so and log it as an open question rather than filling
  the gap with a plausible-sounding guess.
- Do not start production coding before research, product definition, architecture, risk analysis, and
  explicit human approval of each gate are complete.
- Read this documentation set at the start of every new session. If something here contradicts new evidence
  or a new decision, update the authoritative document and record the change in `09-changelog.md` and
  `01-decision-log.md` — do not silently resolve the contradiction, flag it for the human.
