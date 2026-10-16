import { db } from "../db";
import { setStatus } from "./status";

// Four scheduled behaviors documented in docs/12-database-schema-mvp.md as
// "what the schema alone doesn't capture." Run as in-process intervals —
// Decision D7 in docs/01-decision-log.md: a solo founder doesn't need a
// separate worker service for an MVP at this scale yet.

function localDateString(timezone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function localTimeHHMM(timezone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

// Doc 11: "Present/Away degrades after 2h, Remote/Off-site after 8h without
// reconfirmation." Thresholds are per-company config, not hardcoded.
export async function degradeStaleStatuses() {
  const companies = await db.company.findMany();
  const now = new Date();

  for (const company of companies) {
    const fastStale = new Date(now.getTime() - company.presenceStaleMinutes * 60 * 1000);
    const slowStale = new Date(now.getTime() - company.remoteStaleMinutes * 60 * 1000);

    const toDegrade = await db.employeeStatus.findMany({
      where: {
        companyId: company.id,
        OR: [
          { status: { in: ["present", "away"] }, confirmedAt: { lt: fastStale } },
          { status: { in: ["remote", "off_site"] }, confirmedAt: { lt: slowStale } },
        ],
      },
      select: { employeeId: true },
    });

    for (const { employeeId } of toDegrade) {
      await setStatus({ targetEmployeeId: employeeId, status: "unconfirmed", source: "system_auto_degrade" });
    }
  }
}

// Doc 11: "At the start of each workday... every non-leave status resets to
// Unconfirmed." Runs every tick but only acts in the minute that matches
// the company's configured boundary, so it fires once per company per day.
export async function resetAtDayBoundary() {
  const companies = await db.company.findMany();
  const now = new Date();

  for (const company of companies) {
    if (localTimeHHMM(company.timezone, now) !== company.dayBoundaryTime) continue;

    const toReset = await db.employeeStatus.findMany({
      where: { companyId: company.id, status: { notIn: ["on_leave", "unconfirmed"] } },
      select: { employeeId: true },
    });

    for (const { employeeId } of toReset) {
      await setStatus({ targetEmployeeId: employeeId, status: "unconfirmed", source: "system_auto_degrade" });
    }
  }
}

// Doc 11: leave requires zero employee action. Sets On leave for the dated
// range and reverts the day after end_date — only for statuses this same
// job put into on_leave, since on_leave is never reachable any other way
// in this implementation (see services/status.ts SELF_SETTABLE_STATUSES).
export async function syncLeaveStatuses() {
  const companies = await db.company.findMany();

  for (const company of companies) {
    const today = localDateString(company.timezone, new Date());

    const activeLeave = await db.leaveEntry.findMany({
      where: { companyId: company.id, startDate: { lte: new Date(today) }, endDate: { gte: new Date(today) } },
      select: { employeeId: true },
    });
    const onLeaveToday = new Set(activeLeave.map((l) => l.employeeId));

    const currentlyOnLeave = await db.employeeStatus.findMany({
      where: { companyId: company.id, status: "on_leave" },
      select: { employeeId: true },
    });

    for (const employeeId of onLeaveToday) {
      const already = currentlyOnLeave.some((c) => c.employeeId === employeeId);
      if (!already) {
        await setStatus({ targetEmployeeId: employeeId, status: "on_leave", source: "leave_sync" });
      }
    }

    for (const { employeeId } of currentlyOnLeave) {
      if (!onLeaveToday.has(employeeId)) {
        await setStatus({ targetEmployeeId: employeeId, status: "unconfirmed", source: "leave_sync" });
      }
    }
  }
}

// Doc 11/12: 30-day rolling history, deliberately not a permanent
// attendance/disciplinary archive.
export async function purgeOldHistory() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await db.statusHistory.deleteMany({ where: { createdAt: { lt: cutoff } } });
}

export function startScheduledJobs() {
  const tick = async () => {
    try {
      await degradeStaleStatuses();
      await resetAtDayBoundary();
      await syncLeaveStatuses();
    } catch (err) {
      console.error("[jobs] tick failed:", err);
    }
  };

  // Every minute for the time-sensitive jobs; this is an MVP in-process
  // scheduler, not a durable job queue — see docs/12 "explicit non-decisions."
  setInterval(tick, 60 * 1000);
  tick();

  setInterval(() => {
    purgeOldHistory().catch((err) => console.error("[jobs] purge failed:", err));
  }, 24 * 60 * 60 * 1000);
}
