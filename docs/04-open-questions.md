# Open Questions — Ranked

Ranked by how much they block the next approval gate (Gate 1: problem validation, competitive intel, market
evidence, legal due diligence substantially complete).

## Tier 1 — Blocking Gate 1, answer first

1. **Is there a real, frequent, costly presence problem at target businesses that existing tools
   (Microsoft Teams, Zoho People, or whatever each business already runs) do not already solve?** This is
   the make-or-break question. Current competitive evidence (`06-competitor-analysis.md`) leans toward
   "mostly already solved for anyone on Teams or Zoho," which would be a strong signal to revise or stop.
   Requires real interviews, not desk research.
2. **How many businesses in Northern Cyprus actually fit the 30–150-employee, multi-department profile, and
   who are they, by name?** No business-count data exists yet (`07-market-analysis-northern-cyprus.md`).
   Without this, TAM/SAM/SOM cannot be built honestly.
3. **What is the actual, counsel-verified legal regime (TRNC Law 89/2007 specifics, enforcement reality,
   Turkey-KVKK cooperation agreement effect, employment-law constraints on monitoring employee
   location/status)?** Currently resting on one non-legal secondary source (`05-legal-register.md` Finding
   3). Needs primary text + local counsel before any compliance claim is made to a customer.
4. **What software do target businesses already run** (Microsoft 365? Zoho? a Turkish HRIS? nothing
   centralized at all?) — this determines both the realistic differentiation story and the integration
   scope (requirement 9 of the Master Prompt).

## Tier 2 — Needed for product definition (Gate 2), not yet blocking

5. Does "physical presence" (in the building) vs. "digital activity" (logged into a laptop) matter enough
   to target buyers to justify a separate product from Teams/Zoho? (Ties to A7/A9 in `02-assumptions.md`.)
6. What do blue-collar/non-desk employees' statuses look like in practice, and does the target business
   population even have a meaningful share of non-desk staff (hotels, clinics, construction — all plausible
   TRNC sectors per the Master Prompt's own suggested segments)?
7. Local language/support expectations (Turkish/English/Greek) — not yet researched.
8. Typical TRNC SaaS buying motion: self-serve card payment vs. local invoicing/reseller/support expectation.

## Tier 3 — Needed eventually, explicitly deferred

9. Architecture, database schema, specific integration API scopes — deferred by design until product scope
   and legal constraints are settled (Master Prompt's own execution order).
10. Detailed TAM/SAM/SOM modeling, CAC/churn/payback modeling — deferred until Tier 1 Q2 (business counts)
    is answered; modeling on top of an unknown denominator would be fabrication.
11. UX journey maps, screen-level specs — deferred until product scope (Deliverable C) exists.

## How this list should be used

Do not start Deliverable C (exact product requirements) until Tier 1 questions 1 and 4 have real answers.
Do not start Deliverable F (commercial model) until Tier 1 question 2 has a real answer. Do not represent any
compliance posture to a prospective customer or investor until Tier 1 question 3 is counsel-verified.
