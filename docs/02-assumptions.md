# Assumptions Register

Each assumption is labeled with a confidence level and, where possible, a falsification plan — what evidence
would prove it wrong.

| # | Assumption | Label | Confidence | Falsification plan |
|---|---|---|---|---|
| A1 | Multi-department businesses with 30–150 employees in Northern Cyprus have a real, frequent, costly problem knowing who is present/available right now | HYPOTHESIS | Low — no direct evidence yet, only the founder's framing | Structured interviews with 10–15 real candidate businesses (see `07-market-analysis-northern-cyprus.md` action 3); ask about frequency, cost, current workaround, willingness to pay |
| A2 | This problem is not already adequately solved by software these businesses already own (Zoho, Microsoft 365/Teams, a local HRIS) | HYPOTHESIS | Low-to-moderate, leaning toward "already solved for Zoho/Teams users" per `06-competitor-analysis.md` | Direct demos/trials with target businesses' existing stack; ask explicitly "why doesn't [existing tool] already do this for you" |
| A3 | GDPR is the primary external privacy law constraint | **FALSIFIED on first research pass** — EU acquis is suspended in Northern Cyprus (Protocol 10); see `05-legal-register.md` Finding 1 | Corrected | n/a — superseded by Finding 3 (TRNC Law 89/2007) as the primary hypothesis-in-progress |
| A4 | A TRNC-specific data protection law (Law 89/2007) is the actual controlling regime, with low real enforcement risk but real-looking paperwork obligations | HYPOTHESIS | Low — single non-legal source so far | Retrieve TRNC Official Gazette text directly; engage TRNC counsel; see `05-legal-register.md` "Required before Deliverable D" |
| A5 | ~30–150 employees is the right ICP size band | HYPOTHESIS, provisional per Master Prompt's own framing | Low | Market sizing research (action 1/3 in market doc) plus interview findings on who actually feels the pain |
| A6 | Buyers will tolerate per-seat SaaS pricing in roughly the same range as Deputy/When I Work (~$2.50–$10/user/month) | ESTIMATE, anchored on adjacent-category pricing, not this category or this geography | Low | Local pricing sensitivity research; TRNC purchasing-power/typical SaaS-spend data (not yet found) |
| A7 | Microsoft Teams presence and Zoho People's attendance features do not already fully satisfy the target buyer | HYPOTHESIS, currently leaning toward **false** for companies already on those platforms | Low-to-moderate, leaning skeptical | Same interviews as A2; specifically probe non-Microsoft/non-Zoho businesses and physical-presence-vs-digital-activity distinction |
| A8 | "Multi-department" implies an org-structure/permissions complexity (department-scoped visibility) that smaller or single-department tools don't handle well | OPINION (the strategist's judgment call), not yet evidenced | Low | Needs to be tested against actual org charts of interview targets |
| A9 | A credible, fast-enough-to-be-useful "freshness/uncertainty" indicator (showing how stale a status is) is a real differentiator customers will value, not a nice-to-have they're indifferent to | HYPOTHESIS, no evidence either way | Unknown | UX research / interview probe: ask whether stale-but-present data has ever caused a real problem (e.g., sent someone to find a person who'd left) |

## How to use this table

Before any product-definition decision (Deliverable C) or architecture decision (Deliverable E), check this
table. If a decision depends on an assumption still marked "Low confidence," either do the research to raise
confidence or explicitly flag the decision as conditional/reversible in `01-decision-log.md`.
