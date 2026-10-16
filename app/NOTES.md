# Build notes — what's real, what's stubbed, what's not done yet

This MVP implements every decision in `/docs/11-product-definition-mvp.md` and
`/docs/12-database-schema-mvp.md`. It has been exercised end-to-end against a real Postgres instance (not
mocked): login via OTP, setting your own status, department-scoped roster isolation (verified live — a
Housekeeping employee cannot see the General department's roster, and a direct forged request to override
another department's status gets a real 403, not just a hidden button), leave entries automatically turning
into an "On leave" status with zero employee action, and the staleness auto-degrade job actually flipping a
backdated status to Unconfirmed on its own. See the build session's test output for the actual commands run.

## What's stubbed, not real yet

- **OTP delivery is real code, but needs your own Meta account to actually work.** `src/services/otp.ts`
  has a working WhatsApp Cloud API sender (`whatsAppOtpSender`), selected via `OTP_CHANNEL=whatsapp`. It
  needs `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_OTP_TEMPLATE_NAME` — which means
  a Meta Business Manager account, a registered WhatsApp number, and an **approved Authentication-category
  message template** before any code actually sends anything. None of that can be created from here; it's
  tied to your own Meta account and goes through Meta's own template review. Until it's set up,
  `OTP_CHANNEL` defaults to `console` (logs the code instead of sending it) so the login flow stays testable.
- **OTP brute-force protection.** There's no rate limiting on `/login/request-otp` or `/login/verify-otp`.
  A 6-digit code with no attempt limit is guessable given enough tries. Add rate limiting (e.g. lock out
  after 5 wrong attempts, or throttle requests per phone number) before this goes anywhere near real
  customer phone numbers.
- **Tenant isolation is enforced in application code (every query filters by `companyId`), not by Postgres
  row-level security.** `docs/12` flagged RLS as a real option the schema was designed to support. Right
  now it depends on every query being written correctly, which is the "isolation by convention" doc 10
  explicitly warned against — a real pre-launch task, not just a nice-to-have, once there's a second paying
  customer.
- **Scheduled jobs now run as Vercel Cron Jobs hitting `/api/cron/*`** (see `vercel.json`), not in-process
  intervals, once deployed — in-process `setInterval` only remains for local dev via `npm run dev`
  (`src/server.ts`), since Vercel Functions aren't guaranteed to stay alive between requests. If a cron
  invocation is missed (a platform hiccup), that tick's work just waits for the next one — still not a
  durable job queue with guaranteed execution, just no longer dependent on one process staying up forever.
- **Database connection pooling.** `prisma/schema.prisma` now has a `directUrl` alongside `url`, anticipating
  a pooled connection string (e.g. Neon's `-pooler` endpoint) for runtime queries once many short-lived
  Vercel function invocations are opening connections — this hasn't been tested against a real pooled
  endpoint yet, only against local Postgres where both URLs are identical.

## What's genuinely not built

- No password-reset/account-recovery flow beyond re-requesting an OTP (there's no password, so there's
  nothing to reset — but losing access to your phone number has no recovery path yet).
- No UI for admins to deactivate/edit an employee (the `deactivatedAt` column and the enforcement logic in
  `attachEmployee` both work — a deactivated employee is immediately logged out on their next request — but
  there's no admin screen to actually set it yet).
- No UI for granting the named cross-department visibility override (`employee_extra_department_access`) —
  the data model and the visibility logic both support it; only the admin screen to grant it is missing.
- **No production database yet.** The app is deployed to Vercel (see below), but still needs a real
  Postgres instance — this session created the Vercel project and set what env vars it could, but did not
  provision a database. Adding one (e.g. via `vercel install neon` from your own machine, or the Storage tab
  in the Vercel dashboard) involves accepting a provider's own terms/billing, which is yours to decide, not
  something to click through on your behalf. Once you have `DATABASE_URL`/`DIRECT_DATABASE_URL`, set them
  as Vercel project env vars and run `npm run prisma:deploy` (or `vercel env pull` locally first) to apply
  the migration.
- **No WhatsApp credentials yet** — see the OTP delivery note above. Set `OTP_CHANNEL=whatsapp` and the
  three `WHATSAPP_*` env vars on Vercel once your Meta template is approved; until then it's effectively
  unusable for anyone who isn't watching a server console.

## Deploying to Vercel

A Vercel project ("presence-app" under the `kayz3` team, unless renamed) is linked to this repo's
`claude/upbeat-maxwell-4h1bat` branch for auto-deploy on push. Before the deployed app actually works end to
end, set these as Vercel project environment variables (dashboard → Settings → Environment Variables):

- `DATABASE_URL`, `DIRECT_DATABASE_URL` — from whatever Postgres provider you provision (see above).
- `SESSION_SECRET` — any long random string, different from the local dev placeholder.
- `CRON_SECRET` — any random string; Vercel sends it automatically as a Bearer token to the `/api/cron/*`
  endpoints once this is set, which is what authorizes those scheduled calls.
- `OTP_CHANNEL`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OTP_TEMPLATE_NAME` — once
  your Meta WhatsApp setup is ready; otherwise leave `OTP_CHANNEL` unset/`console` and OTP codes will only
  reach the Vercel function logs, not real phones.

After that, run `npm run seed` once against the production database (via `vercel env pull` locally, or
Vercel's own CLI/dashboard shell) to create the first company, department, and admin — there is no
self-signup by design.

## How to run this locally

```
cp .env.example .env   # point DATABASE_URL at a real Postgres instance
npm install
npm run prisma:migrate
npm run seed            # creates one company, one department, one admin — set SEED_* env vars to customize
npm run dev
npm test                 # runs against whatever DATABASE_URL is configured — do not point this at production
```
