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

## 2026-10-16 — MVP database schema drafted

**Decision D6:** Translated `11-product-definition-mvp.md` directly into a concrete schema in
`12-database-schema-mvp.md`: `companies`, `departments`, `employees`, `employee_extra_department_access`,
`employee_statuses` (current, 1 row/employee), `status_history` (append-only, 30-day purge),
`leave_entries` (date range only, no reason field), `otp_codes` (hashed, short-lived).

- Postgres-flavored SQL used for concreteness (native enums, UUIDs, row-level-security fit), not a locked
  technology choice.
- `company_id` is deliberately denormalized onto every table, even where derivable via joins, so tenant
  isolation can be enforced by a simple per-table policy rather than depending on every query getting a join
  right — directly implementing the "isolation by construction, not by convention" point from
  `10-practical-launch-risks.md` section 4.
- Staleness thresholds (2h / 8h) and the auth channel are stored as per-company config columns, not
  hardcoded, since doc 11 already flagged the 8h/2h figures and SMS-vs-WhatsApp choice as defaults to
  confirm, not fixed constants.
- Three scheduled jobs (staleness auto-degrade, day-boundary reset, leave sync) and one maintenance job
  (history purge) are documented as required behavior but intentionally left as implementation, not schema.
- This is still a planning artifact (schema/ER-level design), not production code — Gate 4 (explicit
  authorization to start building) has not been granted and is a separate decision.

## 2026-10-16 — Gate 4: authorization to begin production coding

**Decision D7:** Founder gave explicit authorization ("start") to begin building the MVP described in
`11-product-definition-mvp.md` and `12-database-schema-mvp.md`. This is the Gate 4 approval the charter
required before any code was written — the first three commits in this repository were documentation only.

**Stack choices made to start building (not previously decided, decided now so building can proceed):**
- **Backend:** Node.js + TypeScript + Express. Chosen for a solo founder's maintenance burden over a
  heavier framework, and because it pairs naturally with Prisma for the schema below.
- **Database access:** Prisma, schema defined to match `12-database-schema-mvp.md` table-for-table. Postgres
  16 is available locally in this environment and is used for real migrations/testing, not a mock.
- **Frontend:** server-rendered HTML (no SPA framework, no build step, no native app) — directly implementing
  doc 11's "one responsive web page, link-based access, assume low digital fluency" exclusion/requirement.
- **OTP delivery:** implemented behind a pluggable `OtpSender` interface with a console-logging stub for
  development. **No real SMS/WhatsApp vendor is wired up** — doc 11 left this as an open item (SMS vs.
  WhatsApp Business API reachability for TRNC numbers) and that has not been resolved; wiring a real vendor
  is a pending follow-up, not done in this pass.
- Scheduled jobs (staleness auto-degrade, day-boundary reset, leave sync, history purge) run as in-process
  intervals for MVP simplicity — a solo founder does not need a separate worker service yet; revisit if/when
  reliability requirements change.

## 2026-10-16 — MVP built and verified end-to-end

**Decision D8:** Built the MVP described in `11-product-definition-mvp.md` and `12-database-schema-mvp.md`
in `/app` (Node + TypeScript + Express + Prisma, server-rendered HTML, no SPA framework). Ran it against a
real local Postgres instance, not a mock, and verified by direct HTTP/DB inspection rather than assumption:

- OTP login round-trip works (request code → console-stub delivery → verify → session).
- An employee can set their own status; a backdated status was shown to actually auto-degrade to
  Unconfirmed via the scheduled job, matching acceptance criterion 3 in doc 11.
- **Department-scoped visibility was verified live, not assumed:** a Housekeeping employee's roster view
  genuinely contained no trace of the General department, while an Admin's view contained both — this is
  acceptance criterion 4, confirmed by inspecting actual rendered output, not by reading the code and
  trusting it.
- A direct forged POST request attempting a cross-department status override from a non-manager returned a
  real 403 from the server-side `canActOnEmployee` check — confirming the authorization rule doesn't rely on
  the UI hiding the override form.
- A leave entry covering today was picked up by the scheduled leave-sync job and turned into an "On leave"
  status with zero action from the employee, matching acceptance criterion 5.
- The live schema was reviewed directly against doc 11's data-minimization list and matches exactly — no
  GPS, no leave reason/category field, nothing beyond what was specified.
- 7 automated tests added (pure authorization-logic tests plus one DB-backed integration test for the
  status-write path) and passing; see `/app/NOTES.md` for how to run them.

**What is explicitly not done, logged rather than glossed over** (full detail in `/app/NOTES.md`):
no real SMS/WhatsApp vendor behind the OTP stub (doc 11's open item, still open), no OTP rate-limiting/brute
force protection, tenant isolation enforced in application code rather than via Postgres row-level security
(a real pre-launch task, not yet done), in-process (not durable) scheduled jobs, no admin UI yet for
deactivating employees or granting cross-department visibility overrides (the underlying data model and
enforcement logic both already support both), and no production deployment setup.

- This decision does not claim the product is ready to sell. It closes Gate 4 for the *build* step the
  founder authorized, while the pre-launch items above (and the privacy/counsel step in
  `10-practical-launch-risks.md`) remain open before a real customer's data goes into this system.

## 2026-10-16 — Hosting and OTP delivery: Vercel + WhatsApp

**Decision D9:** Founder chose Vercel for hosting and WhatsApp for OTP delivery. Verified against current
Vercel documentation (via Vercel's own MCP docs search, not memory) before restructuring, rather than
assuming the classic serverless pattern still applied:

- Vercel has first-class support for a plain Express app via a conventional entrypoint — confirmed directly
  from Vercel's docs (`docs/frameworks/backend/express`), both the `app.listen()` form and the
  `export default app` form are documented as working.
- **Scheduled jobs cannot stay as in-process `setInterval` loops once deployed to Vercel** — Vercel Functions
  are not guaranteed to stay alive between requests, so a timer started inside one invocation isn't a
  reliable scheduler. Vercel's documented mechanism for recurring work is Cron Jobs hitting an HTTP
  endpoint. Restructured accordingly:
  - `src/app.ts` — the Express app alone (no `.listen()`, no job scheduler), shared by both entrypoints.
  - `src/server.ts` — local-dev-only entry (`app.listen()` + the original in-process scheduler); never
    deployed to Vercel.
  - `api/index.ts` — the Vercel entrypoint, `vercel.json` rewrites every non-`/api` request to it.
  - `api/cron/{degrade-stale,day-boundary-reset,leave-sync,purge-history}.ts` — one HTTP endpoint per
    scheduled job from `docs/12-database-schema-mvp.md`, each guarded by a `CRON_SECRET` bearer-token check
    (Vercel's documented pattern: it sends this automatically on scheduled invocations once the env var is
    set). Three run every 5 minutes, history purge runs daily at 03:00 UTC.
  - `resetAtDayBoundary` changed from an exact-minute string match to a 5-minute tolerance window
    (`isWithinBoundaryWindow`, now unit-tested) to match the new 5-minute cron cadence — an exact match
    would have missed the boundary almost every day.
- Did **not** assert a specific Vercel Hobby-vs-Pro cron frequency limit, because the documentation pulled
  in this session didn't give one with confidence and plan limits change — the founder should just check
  the dashboard when adding the crons rather than trust a number here that could be stale.
- Added Prisma `directUrl` alongside `url` in the datasource, anticipating a pooled connection string (e.g.
  Neon's `-pooler` endpoint) for runtime queries once this sits behind many short-lived Vercel function
  invocations, with the unpooled URL reserved for migrations. Both point at the same local Postgres for now.
- **WhatsApp OTP delivery implemented against Meta's WhatsApp Cloud API** (`whatsAppOtpSender` in
  `src/services/otp.ts`), selected via `OTP_CHANNEL=whatsapp`; the console stub remains the dev default.
  This requires a pre-approved Meta "Authentication" category template — not something this session can
  create, since it needs the founder's own Meta Business Manager account, phone number registration, and
  Meta's template review. The code is real and ready; the account/template setup is the founder's.
- A Vercel team was found already connected to this session (`KAYZ` / `kayz3`) with one unrelated existing
  project. No Postgres/Neon connector exists yet for that team.
- **What this session will do directly:** create a new Vercel project linked to this GitHub repo (free,
  reversible, no billing implication).
- **What this session will NOT do silently:** provision a Neon/Postgres database or any other marketplace
  integration. `vercel install neon` (or the dashboard equivalent) involves accepting marketplace terms and
  a provider's own billing, which is a decision for the founder to make directly, not something to click
  through on their behalf. Same reasoning for actually creating Meta WhatsApp Business credentials — that
  account is the founder's, not something this session can create.

## 2026-10-16 — Cron frequency: external pinger instead of Vercel Pro

**Decision D10:** The first deployment attempt failed outright: Vercel rejected it with
`cron_jobs_limits_reached` — the team's Hobby plan only allows daily-or-less-frequent Cron Jobs, and three of
the four jobs needed 5-minute cadence. This is the real, current limit (confirmed by Vercel's own API error,
not assumed in advance, consistent with not asserting a specific number back in Decision D9 before it was
verified).

Founder chose to stay on Hobby and use a free external cron-ping service (cron-job.org) to hit
`/api/cron/degrade-stale`, `/api/cron/day-boundary-reset`, and `/api/cron/leave-sync` every 5 minutes with
the `Authorization: Bearer <CRON_SECRET>` header, rather than upgrade to Pro or loosen the staleness
thresholds to fit a daily cadence (which would have broken the 2h/8h design from doc 11). Verified
cron-job.org supports custom headers on its free plan before recommending it (its own FAQ: "our service
supports arbitrary custom headers"), rather than assuming.

`vercel.json`'s `crons` array now only lists `purge-history` (daily, fits Hobby). The other three endpoints
still exist and still check `CRON_SECRET` the same way — only the thing calling them changed. Setting up the
actual cron-job.org account/jobs is the founder's action (an external account this session has no authority
to create), documented step-by-step in `/app/NOTES.md`.

**Deployment result, verified directly, not assumed:** the retry succeeded — build `READY`, live at
`https://presence-app-kayz3.vercel.app`. Also adjusted the project's Vercel Authentication (SSO Protection)
setting from its default (`all_except_custom_domains`, which would have required every visitor to be logged
into this Vercel team) to `preview`-only, so the production URL is reachable by the coworkers this is meant
to be pitched to, not just the team. Fetched `/login` via Vercel's own fetch tool afterward and got a 500
`FUNCTION_INVOCATION_FAILED` — checked runtime logs/errors to confirm this isn't a new problem: no
`DATABASE_URL` is set yet (deliberately, per the billing/account-ownership reasoning above), and every
route touches the database through `attachEmployee`. This confirms the deployment infrastructure itself
(build, routing, the Express app) works; the only blocker is the already-documented missing database and
WhatsApp credentials, both still the founder's to provision.

## 2026-10-16 — Job 1 complete: database live, named, seeded

**Decision D11:** Researched and chose **StatusLit** as the product/company name before using it as real seed
data — not from memory, but checked directly: zero hits in WIPO's Global Brand Database (global trademark
search), `.com` available and unregistered (pristine, no creation date on record), and no existing
product/company found anywhere using it. A close call, **Staffglow** (also clean on domain + trademark),
was rejected after a plain web search surfaced **StaffFlow** — a real UK-registered workforce-management
app (Companies House, G2 reviews) phonetically close enough to risk confusion, which an exact-string
trademark search alone would never have caught. Flagged to the founder that this is a solid automated check,
not a substitute for an attorney or local business-registry search before spending money on branding.

Ran the fixed-up bootstrap endpoint against production: applied the full schema (33 statements) and created
the first company ("StatusLit"), department ("General"), and admin account (the founder's own
+90 533 822 5854 number). Caught and fixed one real bug live (`regclass` needs an explicit `::text` cast for
Prisma's `$queryRawUnsafe` to deserialize it) — logged here rather than silently patched, since it's exactly
the kind of thing worth a trail.

Deleted the bootstrap endpoint immediately after the one successful run, as promised in Decision D9/D10's
follow-up, and overwrote `BOOTSTRAP_SECRET`'s value as defense in depth even though deleting the route is
the actual protection (no code path reads it anymore). Verified both directly: `/login` still returns 200,
`/api/admin/bootstrap` now returns 404.

**Job 1 (database) is done.**

**Job 2 (cron-job.org) is also done** — founder set up all three jobs (degrade-stale, day-boundary-reset,
leave-sync) with the `Authorization: Bearer <CRON_SECRET>` header and a 5-minute schedule, and confirmed
each one's first live run succeeded (966ms, 1.14s, and a third all reporting "Successful"). Combined with
the daily `purge-history` job Vercel's own cron already runs, all four scheduled behaviors from
`docs/12-database-schema-mvp.md` are now actually executing in production, not just coded.

**What this means:** the system described end-to-end in docs 11/12 is now live and self-maintaining —
statuses will actually go stale and reset on schedule, leave entries will actually sync, without anyone
needing to trigger anything by hand. What's left before a real customer pitch: WhatsApp OTP delivery (still
console-logged for now) and the pre-launch items already listed in `app/NOTES.md` (OTP rate-limiting,
Postgres RLS, employee-deactivation UI) — none of which block a first internal dogfood test at the
founder's own workplace, which was always the plan.

## Pending decisions (not yet made, need human input)

- Whether to proceed to Gate 1 research (interviews, primary legal sources, TRNC business-count research)
  before or in parallel with any further desk research — see `04-open-questions.md`.
- Whether the founder has existing relationships/access to real TRNC businesses for interviews, which would
  change the fastest path to resolving Tier 1 question 1 (the single most important question).
- Whether the founder wants to engage TRNC legal counsel now or defer that cost until the problem-validation
  question is resolved (counsel is arguably wasted spend if R1 in `08-risk-register.md` turns out to be
  fatal).
