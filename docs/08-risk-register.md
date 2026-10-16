# Risk Register — First Pass

Prioritized by (likelihood × impact on whether this business should exist at all). This is not yet the full
technical/security/reliability risk register required later (requirement 10/11 of the Master Prompt, STRIDE
etc.) — those need an actual architecture to analyze, which does not exist yet. This first pass covers
existential/commercial/legal risk only, consistent with the Gate 0/Gate 1 stage.

| # | Risk | Category | Current evidence | Severity if true | Mitigation / what would resolve it |
|---|---|---|---|---|---|
| R1 | The problem is already adequately solved by software the target buyer already owns (Teams, Zoho) for most of the ICP | Demand / competitive | Moderate-to-strong circumstantial evidence, see `06-competitor-analysis.md` | **Fatal to the hypothesis as scoped** — would mean "stop or radically narrow" | Real interviews probing specifically "why doesn't your existing tool already do this"; if answer is "it does," narrow to the genuine gap (non-Teams/non-Zoho businesses, or cross-system aggregation) or stop |
| R2 | No one has validated that the pain is frequent/costly enough that anyone would pay for a new tool, even if a gap exists | Demand | No evidence yet either way — founder's framing only | High | Interviews with falsifiable go/no-go thresholds (Master Prompt requirement 1) before further investment |
| R3 | TRNC business-count/size-distribution data may not exist in usable public form at all, making SAM/SOM permanently speculative | Market sizing | Confirmed gap so far, not yet exhausted (TRNC State Planning Office / KTTO primary sources not yet tried) | Medium — would force a bottom-up, interview-based sizing instead of top-down stats | Try primary TRNC government/chamber-of-commerce sources before concluding the data doesn't exist |
| R4 | Local data-protection law (Law 89/2007) turns out to impose real, non-trivial compliance burden once verified by counsel (current single-source read says low enforcement risk, but that source has a sales incentive to say so) | Legal | Weak, single biased source | Medium | Counsel verification before any compliance claim; see `05-legal-register.md` |
| R5 | A customer's own EU exposure (EU-resident remote staff, or future EU sales) pulls GDPR Article 3(2) into scope despite no TRNC-territorial trigger | Legal | Plausible but not yet evidenced for any real customer | Medium, contingent | Ask explicitly in discovery/sales process whether any customer has EU-resident staff before onboarding; revisit if integration scope ever adds EU customers |
| R6 | Pricing ceiling implied by adjacent categories (~$2.50–$10/user/month) may be too low to support a sustainable business at realistic TRNC customer counts, given small market size | Commercial | Estimate only, anchored on different category/geography | Medium-High | Needs real willingness-to-pay data from target interviews, not category-anchoring |
| R7 | Multi-department permissioning/UX complexity (A8) may be assumed, not real — smaller single-department tools might suffice for most target businesses | Product | Opinion, unvalidated | Low-Medium | Validate against real org charts in interviews |
| R8 | "Freshness/uncertainty" display (A9) may be a feature nobody cares about, consuming design/engineering effort for no buyer value | Product | No evidence either way | Low-Medium | Direct interview probe |

## What this register deliberately does not yet cover

STRIDE/privacy threat modeling, tenant isolation, account takeover, insider misuse, backup/DR, API abuse,
fraudulent status updates, incident response — all required by the Master Prompt (requirement 10) but
properly done only once an architecture exists. Doing them now, against no architecture, would produce
generic boilerplate security theater rather than real analysis — explicitly avoided per the "no invented
facts" rule. This section will be rebuilt once Gate 2 (architecture direction) is reached.
