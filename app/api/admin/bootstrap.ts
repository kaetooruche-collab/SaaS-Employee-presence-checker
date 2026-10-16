import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

// TEMPORARY, ONE-TIME-USE endpoint. Vercel's Neon integration creates
// DATABASE_URL/DATABASE_URL_UNPOOLED as "sensitive" env vars, which cannot
// be revealed to anyone (not the API, not the dashboard owner) after
// creation -- by design, not a bug. That means the migration and first
// admin/company/department have to be created from inside a running
// function, where the real value is injected at request time, since
// nobody can read it out and run `prisma migrate deploy` externally.
// Delete this file and the BOOTSTRAP_SECRET env var immediately after a
// successful run -- see docs/01-decision-log.md for the follow-up entry
// removing it.

const MIGRATION_SQL = `
CREATE TYPE "Role" AS ENUM ('employee', 'manager', 'admin');
CREATE TYPE "Status" AS ENUM ('present', 'away', 'remote', 'off_site', 'on_leave', 'unconfirmed');
CREATE TYPE "StatusSource" AS ENUM ('self', 'manager_override', 'admin_override', 'system_auto_degrade', 'leave_sync');
CREATE TYPE "AuthChannel" AS ENUM ('sms', 'whatsapp');

CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "day_boundary_time" TEXT NOT NULL DEFAULT '00:00',
    "presence_stale_minutes" INTEGER NOT NULL DEFAULT 120,
    "remote_stale_minutes" INTEGER NOT NULL DEFAULT 480,
    "auth_channel" "AuthChannel" NOT NULL DEFAULT 'sms',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'employee',
    "sees_all_departments" BOOLEAN NOT NULL DEFAULT false,
    "deactivated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_extra_department_access" (
    "employee_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "granted_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employee_extra_department_access_pkey" PRIMARY KEY ("employee_id","department_id")
);

CREATE TABLE "employee_statuses" (
    "employee_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'unconfirmed',
    "note" VARCHAR(40),
    "set_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "StatusSource" NOT NULL DEFAULT 'system_auto_degrade',
    "set_by_employee_id" UUID,
    CONSTRAINT "employee_statuses_pkey" PRIMARY KEY ("employee_id")
);

CREATE TABLE "status_history" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "status" "Status" NOT NULL,
    "note" VARCHAR(40),
    "source" "StatusSource" NOT NULL,
    "set_by_employee_id" UUID,
    "set_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "leave_entries" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "approved_by_employee_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leave_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "departments_company_id_name_key" ON "departments"("company_id", "name");
CREATE INDEX "employees_department_id_idx" ON "employees"("department_id");
CREATE UNIQUE INDEX "employees_company_id_phone_number_key" ON "employees"("company_id", "phone_number");
CREATE INDEX "status_history_employee_id_created_at_idx" ON "status_history"("employee_id", "created_at");
CREATE INDEX "status_history_company_id_created_at_idx" ON "status_history"("company_id", "created_at");
CREATE INDEX "leave_entries_employee_id_start_date_end_date_idx" ON "leave_entries"("employee_id", "start_date", "end_date");
CREATE INDEX "otp_codes_employee_id_expires_at_idx" ON "otp_codes"("employee_id", "expires_at");

ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_statuses" ADD CONSTRAINT "employee_statuses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_statuses" ADD CONSTRAINT "employee_statuses_set_by_employee_id_fkey" FOREIGN KEY ("set_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_set_by_employee_id_fkey" FOREIGN KEY ("set_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_approved_by_employee_id_fkey" FOREIGN KEY ("approved_by_employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_end_date_check" CHECK ("end_date" >= "start_date");
`;

const db = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.BOOTSTRAP_SECRET;
  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const log: string[] = [];

  try {
    const existing = await db.$queryRawUnsafe<{ to_regclass: string | null }[]>(
      `SELECT to_regclass('public.companies') as to_regclass`
    );
    const schemaExists = existing[0]?.to_regclass !== null;

    if (schemaExists) {
      log.push("Schema already exists, skipping migration.");
    } else {
      const statements = MIGRATION_SQL.split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const statement of statements) {
        await db.$executeRawUnsafe(statement);
      }
      log.push(`Applied schema: ${statements.length} statements.`);
    }

    const companyCount = await db.company.count();
    if (companyCount > 0) {
      log.push(`${companyCount} company(ies) already exist, skipping seed.`);
      return res.status(200).json({ ok: true, log });
    }

    const companyName = String(req.query.companyName || "My Company");
    const timezone = String(req.query.timezone || "Europe/Istanbul");
    const adminName = String(req.query.adminName || "");
    const adminPhone = String(req.query.adminPhone || "");

    if (!adminName || !adminPhone) {
      log.push("Schema ready, but no company exists yet. Call again with ?adminName=...&adminPhone=... to create the first company/admin.");
      return res.status(200).json({ ok: true, log });
    }

    const company = await db.company.create({ data: { name: companyName, timezone } });
    const department = await db.department.create({ data: { companyId: company.id, name: "General" } });
    const admin = await db.employee.create({
      data: { companyId: company.id, departmentId: department.id, name: adminName, phoneNumber: adminPhone, role: "admin" },
    });

    log.push(`Created company "${company.name}", department "${department.name}", admin "${admin.name}" (${admin.phoneNumber}).`);
    return res.status(200).json({ ok: true, log });
  } catch (err) {
    log.push(`Error: ${err instanceof Error ? err.message : String(err)}`);
    return res.status(500).json({ ok: false, log });
  }
}
