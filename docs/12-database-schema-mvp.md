# Database Schema — MVP

Direct translation of `11-product-definition-mvp.md` into concrete tables. Postgres-flavored SQL, chosen
only because it's the clearest way to express this concretely with native enums, UUIDs, and row-level
security — not a locked technology decision; if you build on something else, the shapes below still apply.

Every table carries `company_id` directly, even where it's technically derivable through a join (e.g.
`status_history.company_id` could be reached via `employee_id -> department_id -> company_id`). This is a
deliberate denormalization: it lets every table enforce tenant isolation by a single, simple Postgres
row-level-security policy instead of relying on every query getting the join right — "isolation by
construction, not by convention," per section 4 of `10-practical-launch-risks.md`.

```sql
-- Enums -----------------------------------------------------------------

CREATE TYPE role_enum AS ENUM ('employee', 'manager', 'admin');

CREATE TYPE status_enum AS ENUM (
  'present', 'away', 'remote', 'off_site', 'on_leave', 'unconfirmed'
);

-- Who/what actually produced a status value, for audit and for telling
-- a self-report apart from a manager override or a system auto-degrade.
CREATE TYPE status_source_enum AS ENUM (
  'self', 'manager_override', 'admin_override', 'system_auto_degrade', 'leave_sync'
);

CREATE TYPE auth_channel_enum AS ENUM ('sms', 'whatsapp');

-- Tenant ------------------------------------------------------------------

CREATE TABLE companies (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  timezone                TEXT NOT NULL,              -- IANA tz, e.g. 'Asia/Famagusta' / 'Europe/Istanbul'
  day_boundary_time       TIME NOT NULL DEFAULT '00:00', -- when non-leave statuses reset to unconfirmed
  presence_stale_minutes  INT  NOT NULL DEFAULT 120,   -- Present/Away staleness threshold (doc 11 default: 2h)
  remote_stale_minutes    INT  NOT NULL DEFAULT 480,   -- Remote/Off-site staleness threshold (doc 11 default: 8h)
  auth_channel            auth_channel_enum NOT NULL DEFAULT 'sms', -- open item in doc 11, confirm before launch
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Org structure: Company -> Department -> Employee, flat, one department per employee (doc 11) --

CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, name)
);

CREATE TABLE employees (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id               UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id            UUID NOT NULL REFERENCES departments(id),
  name                     TEXT NOT NULL,
  phone_number             TEXT NOT NULL,              -- used for OTP login, doc 11 "no passwords"
  role                     role_enum NOT NULL DEFAULT 'employee',
  sees_all_departments     BOOLEAN NOT NULL DEFAULT false, -- named Admin override, doc 11 visibility section
  deactivated_at           TIMESTAMPTZ,                 -- offboarding; never hard-delete, history references this row
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, phone_number)
);

CREATE INDEX ON employees (department_id);

-- Narrower visibility grants than "sees_all_departments" -- e.g. a reception
-- role that needs two specific departments, not the whole company. Every row
-- here is exactly the list doc 11 says an Admin must be able to see and audit.
CREATE TABLE employee_extra_department_access (
  employee_id    UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  department_id  UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  granted_by     UUID NOT NULL REFERENCES employees(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (employee_id, department_id)
);

-- Current status: one row per employee, upserted in place ----------------
-- This is the live value the roster view reads. It is NOT the history --
-- see status_history below for the append-only, 30-day-purged log.

CREATE TABLE employee_statuses (
  employee_id      UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  company_id       UUID NOT NULL REFERENCES companies(id),  -- denormalized, see note above
  status           status_enum NOT NULL DEFAULT 'unconfirmed',
  note             VARCHAR(40),                              -- doc 11: optional, capped, no mandatory text
  set_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  source           status_source_enum NOT NULL DEFAULT 'system_auto_degrade',
  set_by_employee_id UUID REFERENCES employees(id)           -- null for system-generated transitions
);

-- Status history: append-only, rolling 30 days, then purged (doc 11: this
-- product is deliberately NOT a permanent attendance/disciplinary archive).

CREATE TABLE status_history (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id        UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id         UUID NOT NULL REFERENCES companies(id),
  status             status_enum NOT NULL,
  note               VARCHAR(40),
  source             status_source_enum NOT NULL,
  set_by_employee_id UUID REFERENCES employees(id),
  set_at             TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()        -- purge job deletes WHERE created_at < now() - interval '30 days'
);

CREATE INDEX ON status_history (employee_id, created_at);
CREATE INDEX ON status_history (company_id, created_at);  -- for the purge job to scan efficiently per tenant

-- Leave: date range only, no reason/category field — doc 11 explicitly
-- excludes storing medical/leave-reason detail; do not add one casually.

CREATE TABLE leave_entries (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id            UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id             UUID NOT NULL REFERENCES companies(id),
  start_date             DATE NOT NULL,
  end_date               DATE NOT NULL,
  approved_by_employee_id UUID NOT NULL REFERENCES employees(id), -- must be an admin; enforce in application layer
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX ON leave_entries (employee_id, start_date, end_date);

-- OTP codes: short-lived, not held past expiry/use. Hash the code, never
-- store it in plaintext, even though it's a 10-minute-lived value.

CREATE TABLE otp_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON otp_codes (employee_id, expires_at);
```

## What the schema alone doesn't capture — three scheduled jobs, not tables

1. **Staleness auto-degrade.** A recurring job (e.g. every 5 minutes) that, per company, finds
   `employee_statuses` rows where `status IN ('present','away')` and `confirmed_at` is older than
   `presence_stale_minutes`, or `status IN ('remote','off_site')` older than `remote_stale_minutes`, and
   flips them to `unconfirmed` with `source = 'system_auto_degrade'`, writing the transition to
   `status_history`. This is what acceptance criterion 3 in doc 11 tests.
2. **Day-boundary reset.** A recurring job that, per company's `timezone` and `day_boundary_time`, resets
   every non-`on_leave` status to `unconfirmed` at the start of each local workday — so nobody sees
   yesterday's "Present" presented as today's, per doc 11's staleness section.
3. **Leave sync.** A daily job (or an on-write trigger when a `leave_entries` row is inserted) that sets
   `employee_statuses.status = 'on_leave'` for every employee whose today falls within an active leave
   range, with `source = 'leave_sync'`, and reverts to `unconfirmed` the day after `end_date` — this is what
   makes leave require zero employee action, per doc 11.
4. **History purge.** A daily job deleting `status_history` rows older than 30 days, per company (the
   `company_id` index above exists specifically so this job can run efficiently per tenant rather than as
   one giant table scan).

None of these are tables; they're the implementation-level behavior the schema is designed to support. Listed
here so they don't get silently forgotten between this document and actual code.

## Explicit non-decisions, left for implementation

- Exact RLS policy syntax / middleware equivalent for tenant isolation — the schema's `company_id`
  denormalization is what makes this straightforward, but the actual policy/middleware code is a build-time
  decision, not a schema one.
- Whether `otp_codes` cleanup is a scheduled job or rely on `expires_at` plus lazy deletion on next lookup —
  either works; not worth deciding here.
- Phone number format/validation and international dialing-code handling — deferred to the SMS/WhatsApp
  vendor decision already flagged as open in doc 11.

## Traceability back to doc 11

| Schema element | Doc 11 decision it implements |
|---|---|
| `status_enum` values | The six-status model |
| `companies.presence_stale_minutes` / `remote_stale_minutes` | The 2h / 8h staleness thresholds (made configurable per company rather than hardcoded, since doc 11 already flagged these as defaults, not universal constants) |
| `employees.sees_all_departments`, `employee_extra_department_access` | Named Admin visibility overrides, auditable as a list |
| `status_history` with 30-day purge job | "Deliberately not enough to become a permanent attendance/disciplinary record" |
| `leave_entries` with no reason/category column | "No reason/medical/category field stored in this system" |
| `otp_codes` hashed, short-lived | Phone+OTP auth default; ordinary security hygiene for a transient secret |
| `departments` flat under `companies`, one `department_id` per employee | Flat org model, no multi-level hierarchy (explicit MVP exclusion) |
