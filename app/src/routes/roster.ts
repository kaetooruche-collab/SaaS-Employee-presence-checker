import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { visibleDepartmentIds, canActOnEmployee } from "../services/visibility";
import { setStatus, SELF_SETTABLE_STATUSES } from "../services/status";
import { page, formatAgo, STATUS_LABELS, escapeHtml } from "../views/layout";

export const rosterRouter = Router();

// Doc 11 acceptance criteria 2 and 4: a manager/employee sees their
// department's roster with status + "updated X ago", and can never see
// another department's roster under the default configuration.
rosterRouter.get("/roster", requireAuth, async (req, res) => {
  const actor = req.employee!;
  const deptScope = await visibleDepartmentIds(actor);

  const departments = await db.department.findMany({
    where: {
      companyId: actor.companyId,
      ...(deptScope === "all" ? {} : { id: { in: deptScope } }),
    },
    include: {
      employees: {
        where: { deactivatedAt: null },
        include: { currentStatus: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const sections = departments
    .map((dept) => {
      const rows = dept.employees
        .map((emp) => {
          const st = emp.currentStatus;
          const badge = st
            ? `<span class="badge badge-${st.status}">${STATUS_LABELS[st.status]}</span> <span class="stale">updated ${formatAgo(st.confirmedAt)}</span>`
            : `<span class="badge badge-unconfirmed">${STATUS_LABELS.unconfirmed}</span>`;

          const canOverride = canActOnEmployee(actor, emp) && emp.id !== actor.id;
          const overrideForm = canOverride
            ? `<form method="post" action="/roster/override-status" style="margin-top:4px;">
                <input type="hidden" name="targetEmployeeId" value="${emp.id}">
                <select name="status">
                  ${SELF_SETTABLE_STATUSES.map((s) => `<option value="${s}">${STATUS_LABELS[s]}</option>`).join("")}
                </select>
                <button type="submit">Set</button>
              </form>`
            : "";

          return `<div class="status-row">
            <div>
              <strong>${escapeHtml(emp.name)}</strong><br>
              ${badge}
              ${overrideForm}
            </div>
          </div>`;
        })
        .join("");

      return `<div class="card"><h1>${escapeHtml(dept.name)}</h1>${rows || "<p>No one in this department yet.</p>"}</div>`;
    })
    .join("");

  res.send(
    page(
      "Roster",
      `<nav><a href="/">My status</a><a href="/roster">Roster</a>${actor.role === "admin" ? '<a href="/admin">Admin</a>' : ""}</nav>
      ${sections || "<p>No departments visible.</p>"}`
    )
  );
});

// Manager/Admin override — "set/correct on behalf of direct reports" from
// doc 11's roles table. canActOnEmployee re-checked server-side; never trust
// that the override form was only shown to someone who's actually allowed.
rosterRouter.post("/roster/override-status", requireAuth, async (req, res) => {
  const actor = req.employee!;
  const targetEmployeeId = String(req.body.targetEmployeeId || "");
  const requested = String(req.body.status || "");

  if (!SELF_SETTABLE_STATUSES.includes(requested as any)) {
    return res.status(400).send("Not a valid status.");
  }

  const target = await db.employee.findUnique({ where: { id: targetEmployeeId } });
  if (!target || !canActOnEmployee(actor, target)) {
    return res.status(403).send("Not allowed to set this person's status.");
  }

  await setStatus({
    targetEmployeeId,
    status: requested as any,
    source: actor.role === "admin" ? "admin_override" : "manager_override",
    setByEmployeeId: actor.id,
  });

  res.redirect("/roster");
});
