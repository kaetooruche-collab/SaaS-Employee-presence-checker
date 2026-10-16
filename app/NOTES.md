# Build notes — what's real, what's stubbed, what's not done yet

This MVP implements every decision in `/docs/11-product-definition-mvp.md` and
`/docs/12-database-schema-mvp.md`. It has been exercised end-to-end against a real Postgres instance (not
mocked): login via OTP, setting your own status, department-scoped roster isolation (verified live — a
Housekeeping employee cannot see the General department's roster, and a direct forged request to override
another department's status gets a real 403, not just a hidden button), leave entries automatically turning
into an "On leave" status with zero employee action, and the staleness auto-degrade job actually flipping a
backdated status to Unconfirmed on its own. See the build session's test output for the actual commands run.

## What's stubbed, not real yet

- **OTP delivery.** `src/services/otp.ts` logs the code to the console instead of sending an SMS/WhatsApp
  message. No SMS/WhatsApp vendor is wired up — `docs/11` flagged this as an open decision (which channel is
  actually reachable for TRNC numbers) and it's still open. Swapping in a real `OtpSender` implementation is
  the only change needed once that's decided; nothing else depends on the stub.
- **OTP brute-force protection.** There's no rate limiting on `/login/request-otp` or `/login/verify-otp`.
  A 6-digit code with no attempt limit is guessable given enough tries. Add rate limiting (e.g. lock out
  after 5 wrong attempts, or throttle requests per phone number) before this goes anywhere near real
  customer phone numbers.
- **Tenant isolation is enforced in application code (every query filters by `companyId`), not by Postgres
  row-level security.** `docs/12` flagged RLS as a real option the schema was designed to support. Right
  now it depends on every query being written correctly, which is the "isolation by convention" doc 10
  explicitly warned against — a real pre-launch task, not just a nice-to-have, once there's a second paying
  customer.
- **Scheduled jobs run in-process via `setInterval`**, not a durable job queue. If the process restarts
  between ticks, a job just resumes on the next tick — fine for an MVP with one process, not fine if this
  ever needs multiple instances or guaranteed execution.
- **Day-boundary reset** only fires in the exact minute matching a company's `dayBoundaryTime`, checked
  every 60 seconds. If the process is down during that exact minute, that day's reset is skipped entirely,
  not caught up later. Known limitation, not a bug to "fix" blindly — a catch-up mechanism needs a design
  decision, not just a patch.

## What's genuinely not built

- No password-reset/account-recovery flow beyond re-requesting an OTP (there's no password, so there's
  nothing to reset — but losing access to your phone number has no recovery path yet).
- No UI for admins to deactivate/edit an employee (the `deactivatedAt` column and the enforcement logic in
  `attachEmployee` both work — a deactivated employee is immediately logged out on their next request — but
  there's no admin screen to actually set it yet).
- No UI for granting the named cross-department visibility override (`employee_extra_department_access`) —
  the data model and the visibility logic both support it; only the admin screen to grant it is missing.
- No production deployment configuration (process manager, HTTPS termination, environment secrets
  management, backups). This has only been run locally against a local Postgres instance in this
  environment.

## How to run this locally

```
cp .env.example .env   # point DATABASE_URL at a real Postgres instance
npm install
npm run prisma:migrate
npm run seed            # creates one company, one department, one admin — set SEED_* env vars to customize
npm run dev
npm test                 # runs against whatever DATABASE_URL is configured — do not point this at production
```
