# Product Definition — MVP

Minimal, decided scope for a first buildable version. These are decisions, not options — where a real
open question remains, it's marked as a default you can override, not left hanging.

## Status model

Six statuses, each with a `set_at` timestamp and a `confirmed_at` timestamp (same as `set_at` until
re-confirmed or auto-degraded):

| Status | Meaning | Who sets it |
|---|---|---|
| Present | On-site, at work, available now | Employee (default at start of day) |
| Away | On-site but temporarily not at desk (meeting, break) — expected back soon | Employee |
| Remote | Working today from elsewhere, still reachable — pre-planned, not "I forgot to come in" | Employee |
| Off-site | Out of the building for work reasons (client visit, errand) — expected back same day | Employee |
| On leave | Approved absence, not working today | Admin, from an approved leave entry — employee does not need to set this themselves |
| Unconfirmed | No status, or status older than its staleness threshold | System only — never user-chosen |

No free-form status text beyond an optional note capped at ~40 characters (e.g. "back at 3pm"), attached to
any status. No reason/category field for leave beyond the date range — see Data minimization below for why.

## Staleness / freshness rule

Every status shown always carries "updated X ago," not just the label. Auto-degrade rules:

- **Present / Away**: degrades to Unconfirmed after **2 hours** without reconfirmation. These are the
  fastest-changing statuses and the ones where stale data causes the most real-world friction (someone
  looking for a person who left).
- **Remote / Off-site**: degrades to Unconfirmed after **8 hours** (covers a full workday without requiring
  a mid-day check-in — these statuses already imply "not expecting to see me in the building today").
- **On leave**: does **not** degrade during the approved date range — it's dated, not a self-report, so
  staleness doesn't apply to it the same way.
- At the start of each workday (configurable per company, default 00:00 local time), every non-leave status
  resets to **Unconfirmed**, not carried over from the day before. Nobody should ever see yesterday's
  "Present" presented as if it were today's.

## Roles and visibility

Three roles only for MVP — no separate "executive read-only" role; fold that need into Admin if it comes up.

| Role | Can set status for | Can see |
|---|---|---|
| Employee | Self only | Own department's roster only |
| Manager | Self + can set/correct on behalf of direct reports | Own department's roster only |
| Admin | Anyone (override) | All departments; manages leave entries, user accounts, and per-user visibility overrides |

**Default visibility is department-scoped**, not company-wide. An Admin can grant a specific user
cross-department or company-wide *read* access as an explicit override (e.g. a reception/front-desk role
that legitimately needs to see everyone to direct visitors) — this is a named exception, not the default, and
every such grant should be visible to the Admin as a list, not something that silently accumulates.

Org model: **Company → Department → Employee**, flat. One company is one isolated tenant. Each employee
belongs to exactly one department. No multi-level sub-department hierarchy at MVP — explicitly excluded
below.

## Data minimization — what actually gets stored

- Employee: name, department, role, one contact channel for login (see Auth below). Nothing else.
- Status: the enum value, `set_at`, `confirmed_at`, optional short note. No GPS or any location coordinate.
  No device fingerprinting beyond ordinary login-security logs.
- Status **history**: kept for a **rolling 30 days**, then purged automatically. This is enough to debug
  "why did this look wrong" and to support the freshness feature, and deliberately not enough to become a
  permanent attendance/disciplinary record — directly addressing the risk flagged in
  `10-practical-launch-risks.md` section 1 (status data getting used as termination evidence). If a customer
  asks for longer retention for attendance/payroll purposes, that's a different product (an attendance
  system) and should be refused or explicitly scoped as a separate, clearly-labeled feature later, not
  silently added.
- Leave entries: date range + who approved it. No reason/medical/category field stored in this system —
  that's HR data this product has no reason to hold, and holding it only increases what a breach would
  expose for no product benefit.

## Manual input, by design, not by fallback

There are no integrations at MVP (no Zoho, Microsoft/Teams, calendar, or badge-system connections — see
exclusions). So manual self-report isn't a "fallback," it's the only mechanism, which makes minimizing
friction the actual design priority:

- Default assumption at day start is **Present** — employees act only to change their status, not to confirm
  it. Confirming "yes I'm still here" is never required and should never be asked for.
- Changing status should be reachable in one or two taps from a single link, no in-app navigation.
- Leave doesn't require the employee to do anything — Admin enters the date range once and the system shows
  "On leave" automatically for those days.

## Auth (recommended default, override if you know better for your market)

**Phone number + one-time code** (SMS or WhatsApp), no passwords. Reasoning: matches the low-digital-fluency
context from `10-practical-launch-risks.md` — a password is one more thing to forget or write on a sticky
note, and a phone number is an identifier people already have memorized. Open question for you: whether an
SMS gateway or WhatsApp Business API is more reliably reachable for TRNC phone numbers — flagging this as a
decision to confirm, not blocking the rest of this definition.

## Explicit exclusions (so scope doesn't creep while building)

- No integrations (Zoho, Microsoft/Teams, calendar, badge/access-control) at MVP.
- No GPS or location tracking of any kind.
- No permanent attendance/disciplinary archive — 30-day rolling history only.
- No analytics/reporting dashboards beyond the live roster view.
- No native mobile app — one responsive web page, link-based.
- No multi-language localization at MVP — pick the one language your own workplace uses; expand later.
- No multi-level department hierarchy — flat, one department per employee.
- No separate executive/read-only role.

## Acceptance criteria for "MVP works"

1. An employee can change their own status in ≤2 taps from a single link, with no password to remember.
2. A manager sees their department's roster with current status and "updated X ago" for each person,
   loading in a few seconds.
3. A status older than its threshold shows as Unconfirmed automatically — verified by letting a test status
   sit past the threshold and checking it flips without manual intervention.
4. A user in Department A cannot see Department B's roster under any default configuration — verified
   directly, not assumed.
5. An Admin-entered leave date range shows the employee as "On leave" for that range with no action from the
   employee, and automatically reverts to Unconfirmed the day after the range ends.
6. The data model contains nothing beyond what's listed in Data minimization — verified by reviewing the
   actual schema against this list before first customer data goes in.

## What this deliberately does not cover yet

Screen-level UX, the specific database schema/ER diagram, and the auth implementation details (SMS vs.
WhatsApp vendor choice) are the next layer down — buildable directly from this document, but not decided
here. This document is the thing that was cheap to decide now (per `10-practical-launch-risks.md` section 4)
and is now locked so building doesn't have to re-decide it halfway through.
