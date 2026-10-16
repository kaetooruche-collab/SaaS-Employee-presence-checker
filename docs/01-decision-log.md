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

## 2026-10-16 — Founder redirect: drop market-sizing research, focus on practical launch risk

**Decision D4:** Stop pursuing TRNC business-count/size-distribution data and a competitor census as
blocking research. Reframe the deliverable the founder actually wants as a practical, launch-oriented risk
assessment, led by privacy/data compliance, not a market-sizing study.

- Rationale, in the founder's own terms: TRNC is not a properly digitized place — there is no database or
  registry that would give a defensible count of businesses, or of how many run Zoho vs. Microsoft vs.
  nothing. Chasing that number further would produce a confident-looking but fabricated-feeling figure,
  which violates the "never invent facts" rule worse than just admitting the data doesn't exist. The
  founder's actual go-to-market is relationship-based/word-of-mouth (direct pitch to his own workplace and
  outward from there), not a data-driven segmentation campaign — so a market-sizing deliverable would not
  change what he does next.
- This also reframes demand validation: the founder is not asking "should I build this" pending market
  research — he has decided he would build this now. What he wants from this engagement is **the angles
  he'd miss building it alone**: privacy/legal/compliance first, and other practical launch risks (trust,
  pricing durability, operational, technical-debt-now-vs-later) second. Competitive feature-comparison and
  market-sizing are explicitly deprioritized, not because they're wrong, but because he's told us they're
  not what he needs from this process.
- This does **not** cancel Gate 4 (no production code without explicit authorization) or the legal-register
  caveats in `05-legal-register.md` — those stand. It changes what research happens between now and a build
  decision, not the no-code-before-approval rule itself.
- Rejected alternative: continuing to push on TRNC business counts / Zoho-vs-Teams prevalence research.
  Rejected per the founder's explicit statement that no such data source exists to find.
- Carried forward as an acknowledged, permanent limitation rather than a to-do: `07-market-analysis-northern-cyprus.md`
  and `06-competitor-analysis.md` are frozen at their first-pass state and will not be chased further unless
  the founder asks again.

## 2026-10-16 — MVP product definition locked

**Decision D5:** Locked the minimal product definition in `11-product-definition-mvp.md`: six-status model
(Present/Away/Remote/Off-site/On leave/Unconfirmed), department-scoped visibility by default with named
Admin overrides, 30-day rolling status history only (no permanent attendance archive), no integrations/GPS/
mobile app/localization/multi-level org hierarchy at MVP, and phone-number-plus-OTP auth as a recommended
default pending confirmation of SMS vs. WhatsApp reachability in TRNC.

- Rationale: per the founder's own framing (section 4 of `10-practical-launch-risks.md`), data model,
  visibility rules, and retention are cheap to decide now and expensive to retrofit once real customer data
  exists. This gate stops short of screen-level UX, schema/ER diagrams, and auth vendor choice — those are
  the next layer, directly buildable from this document, but not decided here.
- The 30-day rolling history / no-disciplinary-archive choice directly closes the "status data used as
  termination evidence" risk flagged in the launch-risk doc, by construction rather than by policy alone.
- Open item carried forward, not blocking: confirm SMS vs. WhatsApp Business API reachability for TRNC
  numbers before finalizing auth implementation.
- This decision does not authorize production coding (Gate 4 unchanged) — it is the product-definition
  input Gate 4 will eventually need.

## Pending decisions (not yet made, need human input)

- Whether to proceed to Gate 1 research (interviews, primary legal sources, TRNC business-count research)
  before or in parallel with any further desk research — see `04-open-questions.md`.
- Whether the founder has existing relationships/access to real TRNC businesses for interviews, which would
  change the fastest path to resolving Tier 1 question 1 (the single most important question).
- Whether the founder wants to engage TRNC legal counsel now or defer that cost until the problem-validation
  question is resolved (counsel is arguably wasted spend if R1 in `08-risk-register.md` turns out to be
  fatal).
