import { Status, StatusSource } from "@prisma/client";
import { db } from "../db";

// Single write path for every status change, self-reported, manager/admin
// override, or system-generated (auto-degrade, leave sync). Always updates
// the live row AND appends to status_history — see
// docs/12-database-schema-mvp.md, there is deliberately no other way to
// change a status that skips the history log.
export async function setStatus(params: {
  targetEmployeeId: string;
  status: Status;
  note?: string | null;
  source: StatusSource;
  setByEmployeeId?: string | null;
}) {
  const target = await db.employee.findUniqueOrThrow({
    where: { id: params.targetEmployeeId },
    select: { companyId: true },
  });

  const setAt = new Date();
  const note = params.note?.slice(0, 40) || null;

  await db.$transaction([
    db.employeeStatus.upsert({
      where: { employeeId: params.targetEmployeeId },
      create: {
        employeeId: params.targetEmployeeId,
        companyId: target.companyId,
        status: params.status,
        note,
        setAt,
        confirmedAt: setAt,
        source: params.source,
        setByEmployeeId: params.setByEmployeeId ?? null,
      },
      update: {
        status: params.status,
        note,
        setAt,
        confirmedAt: setAt,
        source: params.source,
        setByEmployeeId: params.setByEmployeeId ?? null,
      },
    }),
    db.statusHistory.create({
      data: {
        employeeId: params.targetEmployeeId,
        companyId: target.companyId,
        status: params.status,
        note,
        source: params.source,
        setByEmployeeId: params.setByEmployeeId ?? null,
        setAt,
      },
    }),
  ]);
}

// Statuses an employee can set on themselves directly. On_leave is set only
// via an approved leave entry (leave sync); unconfirmed is system-only — see
// docs/11-product-definition-mvp.md status model table.
export const SELF_SETTABLE_STATUSES: Status[] = ["present", "away", "remote", "off_site"];
