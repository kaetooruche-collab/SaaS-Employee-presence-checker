# Changelog

## 2026-10-16 — v0.4 (MVP database schema)

- Added `12-database-schema-mvp.md` and Decision D6: concrete Postgres-flavored schema translating doc 11
  (companies, departments, employees, employee_statuses, status_history, leave_entries, otp_codes,
  employee_extra_department_access), with `company_id` denormalized everywhere for isolation-by-construction,
  configurable staleness thresholds, and documented (not yet implemented) scheduled jobs for auto-degrade,
  day-boundary reset, leave sync, and history purge.
- This is the last planning artifact before code per the founder's own framing; it does not itself
  authorize production coding.

## 2026-10-16 — v0.3 (MVP product definition locked)

- Added `11-product-definition-mvp.md` and Decision D5: locked the six-status model, department-scoped
  visibility with Admin overrides, 30-day rolling history (no permanent attendance archive), explicit
  exclusions (no integrations/GPS/mobile app/localization/multi-level hierarchy), acceptance criteria, and a
  recommended phone+OTP auth default pending SMS/WhatsApp confirmation.
- This is the product-definition input for a future Gate 4 decision; it does not itself authorize coding.

## 2026-10-16 — v0.2 (founder redirect)

- Founder redirected the engagement: no TRNC business registry/database exists to size the market or to
  census which businesses run Zoho/Microsoft, so that research is not pursued further (Decision D4 in
  `01-decision-log.md`). `06-competitor-analysis.md` and `07-market-analysis-northern-cyprus.md` are frozen
  as background, not blocking anything further.
- New primary deliverable: `10-practical-launch-risks.md` — practical problems to expect at launch, led by
  privacy/data-compliance (the founder's explicit priority), covering employee-monitoring/notice
  obligations, the one remaining legal-verification step (TRNC Law 89/2007 via real counsel), trust/adoption
  failure modes, commercial-durability risk, and cheap-now/expensive-later technical decisions.
- No change to the no-code-before-approval rule (Gate 4) — this redirect changes what research happens, not
  whether code gets written without authorization.

## 2026-10-16 — v0.1 (Gate 0 first output)

- Initial creation of the full persistent documentation structure (`README.md` index plus 9 documents).
- First-pass research completed on: TRNC legal/jurisdictional status (GDPR non-applicability, candidate
  local law), direct and bundled/free competitors (Envoy, Robin/adjacent, Deputy/When I Work, Microsoft
  Teams presence, Zoho People), and TRNC employment/business statistics.
- Key correction logged: GDPR does not apply to Northern Cyprus by territory; TRNC's own Law 89/2007 is the
  current best hypothesis for controlling law, pending counsel verification (see `05-legal-register.md`,
  `01-decision-log.md` D2).
- No product requirements, UX, architecture, database design, integration spec, threat model, test strategy,
  commercial model, GTM plan, ops runbook, or roadmap produced yet — intentionally deferred per
  `00-project-charter.md` approval-gate structure.
- No code written. None should be until Gate 4.
