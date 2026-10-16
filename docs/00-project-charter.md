# Project Charter

## Mandate

Act as an independent, adversarial product/engineering due-diligence team. Determine whether this product
should exist, define the exact product to build if it should, investigate material failure modes, and
produce an evidence-backed implementation plan. Challenge the founder's assumptions rather than validate
them. If the product is weak, say so and recommend changing or stopping it.

## Product hypothesis (provisional, not a decision)

A lightweight, company-wide workplace presence and availability layer, initially targeting multi-department
businesses in Northern Cyprus. Authorized users see employees' recorded statuses: present, temporarily away,
remote, off-site, on approved leave, or unconfirmed. The system should minimize manual effort, show status
freshness/uncertainty, and integrate with existing workplace software rather than replacing it where
practical. Initial customer hypothesis: businesses with ~30–150 employees. **This is a hypothesis to be
falsified, not a brief to be executed.**

## Scope of this engagement

Research → legal/privacy/security assessment → architecture options → red-team review → staged roadmap with
approval gates. Production coding is explicitly out of scope until each of those gates is passed and a human
has approved moving forward. See `01-decision-log.md` for gate status.

## Non-goals (for now)

- No code, no repository scaffolding for an application, no chosen tech stack commitment.
- No claim of a validated market until primary demand evidence exists (see `04-open-questions.md`).
- No assumption that GDPR is the controlling privacy law — see `05-legal-register.md`; this was wrong on
  first inspection and had to be corrected.

## Known constraints going in

- This repository started with zero commits and no prior project documentation — there is no earlier
  decision log or research to reconcile against. This document set is the first version, not a continuation.
- "Northern Cyprus" (Turkish Republic of Northern Cyprus / TRNC) is recognized as a state only by Turkey; the
  Republic of Cyprus (EU member, internationally recognized) claims the whole island but does not exercise
  effective control there. This has concrete legal and statistical consequences — official EU and Republic
  of Cyprus statistics and laws generally do not apply to or describe the TRNC-administered area, and the
  Master Prompt itself warns against substituting Republic of Cyprus statistics for TRNC ones. Treat every
  Cyprus-labeled statistic with suspicion until its scope is confirmed.

## Approval gates (per Master Prompt's execution order)

1. **Gate 0 (this document set):** Facts, highest-risk assumptions, first research questions established.
   → Awaiting human review.
2. **Gate 1:** Problem validation, competitive intelligence, Northern Cyprus market evidence, legal due
   diligence substantially complete.
3. **Gate 2:** Exact product scope, UX, architecture direction chosen and documented; red-team review done.
4. **Gate 3:** Roadmap with staged implementation and acceptance criteria approved.
5. **Gate 4:** Explicit human authorization to begin production coding.

No gate is to be skipped or self-approved.
