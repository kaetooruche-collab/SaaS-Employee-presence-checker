# Changelog

## 2026-10-16 — v0.6 (Vercel + WhatsApp)

- Decision D9: restructured for Vercel deployment (`src/app.ts` + `api/index.ts` + `vercel.json` rewrites)
  and converted the four scheduled jobs into Vercel Cron-triggered endpoints under `api/cron/*`, guarded by
  a `CRON_SECRET` bearer check. Fixed `resetAtDayBoundary` to use a 5-minute tolerance window instead of an
  exact-minute match, matching the new cron cadence; added unit tests for the new window math.
- Implemented a real WhatsApp Cloud API OTP sender (`whatsAppOtpSender`), selectable via `OTP_CHANNEL`;
  console stub remains the dev default. Real delivery still needs the founder's own Meta Business Manager
  setup and an approved Authentication-category template — not something buildable from here.
- Added Prisma `directUrl` for a future pooled Postgres connection (e.g. Neon).
- `/app/NOTES.md` updated with Vercel deployment steps and what env vars/accounts are still needed.
- Decision D10: first deploy attempt was rejected outright (`cron_jobs_limits_reached` — Hobby plan only
  allows daily Cron Jobs). Founder chose an external cron pinger (cron-job.org, confirmed to support custom
  headers free) over upgrading to Pro or loosening the staleness design. `vercel.json` now only schedules
  the daily history-purge job through Vercel itself.
- Created and deployed the Vercel project (`presence-app` under `kayz3`, linked to this repo/branch).
  Production build succeeded; adjusted Vercel Authentication so the production URL is publicly reachable
  (previews stay gated). Set `SESSION_SECRET`/`CRON_SECRET`/`OTP_CHANNEL` as real project env vars. Confirmed
  via Vercel's runtime-error tooling that the current 500 on every route is exactly the expected
  missing-database issue, not a deploy/routing problem — a real Postgres instance and the cron-job.org setup
  are the two things standing between this and an actually usable deployment.

## 2026-10-16 — v0.5 (MVP built and verified)

- Built the working MVP in `/app` per Decision D8: Node/TypeScript/Express/Prisma, server-rendered pages,
  phone+OTP auth (console-stubbed delivery), the full status/roster/admin/leave flows, and the four
  scheduled jobs from doc 12.
- Verified end-to-end against a real local Postgres instance: department-scoped visibility, server-side
  authorization on overrides, staleness auto-degrade, and leave-sync were all exercised live via actual
  HTTP requests and direct DB inspection, not just read as code and trusted.
- Added 7 automated tests (6 pure authorization-logic tests, 1 DB-backed integration test for the
  status-write path); all passing.
- `/app/NOTES.md` lists what's stubbed (OTP delivery vendor, OTP rate-limiting) and what's genuinely not
  built yet (RLS-based isolation, employee deactivation UI, visibility-override UI, production deployment).

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
