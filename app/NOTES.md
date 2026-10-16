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

**Status: deployed and live, but not usable yet — it needs a database.** Project `presence-app` under the
`kayz3` team is linked to this repo's `claude/upbeat-maxwell-4h1bat` branch for auto-deploy on push. The
first production deployment succeeded (build `READY`) at `https://presence-app-kayz3.vercel.app`, and the
project's Vercel Authentication setting was changed so the production URL is publicly reachable (not gated
behind a Vercel team login) — on purpose, since the whole point is pitching this to coworkers who won't have
Vercel accounts. Preview deployments (from other branches/PRs) are still gated, which is fine since those
are for you, not customers.

Hitting the live URL right now returns a 500 (`FUNCTION_INVOCATION_FAILED`) — confirmed via Vercel's own
runtime-error tooling that this is exactly the missing-database issue below, not a deploy or routing
problem. `SESSION_SECRET`, `CRON_SECRET`, and `OTP_CHANNEL=console` are already set as project env vars (generated
fresh, not placeholders). What's still needed before this is a real, usable deployment:

1. **A real Postgres database.** Not provisioned — adding one (`vercel install neon` from your own machine,
   or the Storage tab in the Vercel dashboard) means accepting a provider's own terms/billing, which is
   yours to decide. Once you have it, set `DATABASE_URL` and `DIRECT_DATABASE_URL` as project env vars
   (dashboard → Settings → Environment Variables) and run `npm run prisma:deploy` against it (e.g. via
   `vercel env pull` locally first).
2. **WhatsApp, if you want real OTP delivery instead of the console stub.** Set `OTP_CHANNEL=whatsapp` plus
   `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OTP_TEMPLATE_NAME` once your Meta Business
   Manager setup and approved Authentication template are ready (see above — this needs your own Meta
   account, not something set up from here). Until then, OTP codes land only in Vercel's function logs.
3. **The external cron pinger** (cron-job.org or similar) for the three time-sensitive jobs — see below.
4. Run `npm run seed` once against the production database to create the first company, department, and
   admin — there is no self-signup by design.

## Setting up the external cron pinger (cron-job.org)

Three endpoints need to be hit every 5 minutes for the staleness/day-boundary/leave-sync behavior in doc 11
to actually work (Vercel's own Cron Jobs only allow daily on the Hobby plan — see Decision D10 in
`docs/01-decision-log.md`). `/api/cron/purge-history` is already scheduled through Vercel itself (daily, no
action needed). For the other three, create a free account at cron-job.org (its own FAQ confirms custom
headers are supported on the free plan) and add one job per endpoint:

| URL | Schedule | Header |
|---|---|---|
| `https://presence-app-kayz3.vercel.app/api/cron/degrade-stale` | every 5 minutes | `Authorization: Bearer <CRON_SECRET value>` |
| `https://presence-app-kayz3.vercel.app/api/cron/day-boundary-reset` | every 5 minutes | same |
| `https://presence-app-kayz3.vercel.app/api/cron/leave-sync` | every 5 minutes | same |

Get the actual `CRON_SECRET` value from the Vercel dashboard (Settings → Environment Variables — it was
generated randomly during setup, not written down anywhere else). Each endpoint returns `401` if the header
is missing or wrong, and `200 {"ok":true}` on success — a quick way to confirm a job is configured correctly
before waiting for its first scheduled run.

## How to run this locally

```
cp .env.example .env   # point DATABASE_URL at a real Postgres instance
npm install
npm run prisma:migrate
npm run seed            # creates one company, one department, one admin — set SEED_* env vars to customize
npm run dev
npm test                 # runs against whatever DATABASE_URL is configured — do not point this at production
```
