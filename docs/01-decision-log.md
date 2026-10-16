# Decision Log

Every material decision, with date, rationale, and rejected alternatives. Read this first in any new session.

## 2026-10-16 — Project start

**Context:** Repository had zero commits and no prior documentation. This is the first session on this
engagement; there is no earlier decision log to reconcile against or contradict.

**Decision D1:** Treat this engagement as staged, with explicit human approval gates, per the Master Prompt's
own execution order (`00-project-charter.md`). The first output will be problem/competitor/legal framing and
open questions — not a product definition, not an architecture, not code.
- Rationale: explicit instruction in the Master Prompt ("The first output should establish the problem,
  competitors, unknowns, and the most important decisions. It should not be a complete codebase... Do not
  start production coding before research, product definition, architecture, risk analysis, and approval
  gates are complete.")
- Rejected alternative: attempting all 18 investigation areas and 10 deliverables exhaustively in one pass.
  Rejected because (a) the Master Prompt explicitly stages this, (b) several deliverables (PRD, UX,
  architecture, DB design, threat model, test strategy) are not meaningfully producible before Tier 1 open
  questions are answered — producing them now would mean inventing facts or building on an unvalidated
  premise, both explicitly forbidden.

**Decision D2:** Correct the Master Prompt's own framing on GDPR applicability rather than executing it
as literally stated.
- Rationale: the Master Prompt instructs "assess jurisdiction-specific applicability of GDPR... Do not
  assume a law applies merely because it is listed." Research in this session found that GDPR does not
  apply to Northern Cyprus by territory (EU acquis suspended under Protocol 10) — the Master Prompt's own
  anti-assumption rule, applied rigorously, requires surfacing this rather than producing a GDPR compliance
  section as if it were a given. See `05-legal-register.md` Finding 1.
- This is flagged as a correction for the human to review, not silently adopted as final — the underlying
  source quality for the *replacement* legal theory (TRNC Law 89/2007) is itself weak (single non-legal
  source) and needs counsel verification before being treated as settled.

**Decision D3:** Did not attempt to produce TAM/SAM/SOM numbers in this pass.
- Rationale: no TRNC business-count or size-distribution data was found (`07-market-analysis-northern-cyprus.md`).
  Producing a numeric market-sizing estimate without this would violate the "never invent facts" and
  "distinguish verified facts from estimates" rules. Logged as Tier 1 open question #2 instead.

## Pending decisions (not yet made, need human input)

- Whether to proceed to Gate 1 research (interviews, primary legal sources, TRNC business-count research)
  before or in parallel with any further desk research — see `04-open-questions.md`.
- Whether the founder has existing relationships/access to real TRNC businesses for interviews, which would
  change the fastest path to resolving Tier 1 question 1 (the single most important question).
- Whether the founder wants to engage TRNC legal counsel now or defer that cost until the problem-validation
  question is resolved (counsel is arguably wasted spend if R1 in `08-risk-register.md` turns out to be
  fatal).
