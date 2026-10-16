-- CreateEnum
CREATE TYPE "Role" AS ENUM ('employee', 'manager', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('present', 'away', 'remote', 'off_site', 'on_leave', 'unconfirmed');

-- CreateEnum
CREATE TYPE "StatusSource" AS ENUM ('self', 'manager_override', 'admin_override', 'system_auto_degrade', 'leave_sync');

-- CreateEnum
CREATE TYPE "AuthChannel" AS ENUM ('sms', 'whatsapp');

-- CreateTable
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

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "employee_extra_department_access" (
    "employee_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "granted_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_extra_department_access_pkey" PRIMARY KEY ("employee_id","department_id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_company_id_name_key" ON "departments"("company_id", "name");

-- CreateIndex
CREATE INDEX "employees_department_id_idx" ON "employees"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_company_id_phone_number_key" ON "employees"("company_id", "phone_number");

-- CreateIndex
CREATE INDEX "status_history_employee_id_created_at_idx" ON "status_history"("employee_id", "created_at");

-- CreateIndex
CREATE INDEX "status_history_company_id_created_at_idx" ON "status_history"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "leave_entries_employee_id_start_date_end_date_idx" ON "leave_entries"("employee_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "otp_codes_employee_id_expires_at_idx" ON "otp_codes"("employee_id", "expires_at");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_extra_department_access" ADD CONSTRAINT "employee_extra_department_access_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_statuses" ADD CONSTRAINT "employee_statuses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_statuses" ADD CONSTRAINT "employee_statuses_set_by_employee_id_fkey" FOREIGN KEY ("set_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_set_by_employee_id_fkey" FOREIGN KEY ("set_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_approved_by_employee_id_fkey" FOREIGN KEY ("approved_by_employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Manual addition (Prisma schema language has no native CHECK support):
-- docs/12-database-schema-mvp.md specifies end_date >= start_date on leave_entries.
ALTER TABLE "leave_entries" ADD CONSTRAINT "leave_entries_end_date_check" CHECK ("end_date" >= "start_date");
