import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { setStatus, SELF_SETTABLE_STATUSES } from "../services/status";
import { page, formatAgo, STATUS_LABELS, escapeHtml } from "../views/layout";

export const statusRouter = Router();

function nav(employee: { role: string }): string {
  const links = [`<a href="/">My status</a>`, `<a href="/roster">Roster</a>`];
  if (employee.role === "admin") links.push(`<a href="/admin">Admin</a>`);
  links.push(`<form method="post" action="/logout" style="display:inline"><button type="submit" style="background:none;color:#555;padding:0;font-size:0.9rem;cursor:pointer;">Log out</button></form>`);
  return `<nav>${links.join("")}</nav>`;
}

// Doc 11 acceptance criterion 1: an employee can change their own status in
// <=2 taps from a single link, no password. This page is that link's
// destination — one tap to land here (already authenticated via session),
// one tap on a status button to change it.
statusRouter.get("/", requireAuth, async (req, res) => {
  const employee = req.employee!;
  const current = await db.employeeStatus.findUnique({ where: { employeeId: employee.id } });

  const statusBadge = current
    ? `<span class="badge badge-${current.status}">${STATUS_LABELS[current.status]}</span> <span class="stale">updated ${formatAgo(current.confirmedAt)}</span>`
    : `<span class="badge badge-unconfirmed">${STATUS_LABELS.unconfirmed}</span>`;

  const buttons = SELF_SETTABLE_STATUSES.map(
    (s) => `<form method="post" action="/status" style="flex:1 1 auto">
      <input type="hidden" name="status" value="${s}">
      <button type="submit" style="width:100%">${STATUS_LABELS[s]}</button>
    </form>`
  ).join("");

  res.send(
    page(
      "My status",
      `${nav(employee)}
      <div class="card">
        <h1>Hi, ${escapeHtml(employee.name)}</h1>
        <p>${statusBadge}</p>
      </div>
      <div class="card">
        <p>Set your status now:</p>
        <div class="status-grid">${buttons}</div>
      </div>`
    )
  );
});

statusRouter.post("/status", requireAuth, async (req, res) => {
  const employee = req.employee!;
  const requested = String(req.body.status || "");

  if (!SELF_SETTABLE_STATUSES.includes(requested as any)) {
    return res.status(400).send("Not a status you can set on yourself.");
  }

  await setStatus({
    targetEmployeeId: employee.id,
    status: requested as any,
    source: "self",
    setByEmployeeId: employee.id,
  });

  res.redirect("/");
});
