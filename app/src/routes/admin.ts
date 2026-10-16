import { Router } from "express";
import { db } from "../db";
import { requireRole } from "../middleware/auth";
import { page, escapeHtml } from "../views/layout";

export const adminRouter = Router();
adminRouter.use("/admin", requireRole("admin"));

function adminNav(): string {
  return `<nav><a href="/">My status</a><a href="/roster">Roster</a><a href="/admin">Admin</a>
    <a href="/admin/departments">Departments</a><a href="/admin/employees">Employees</a><a href="/admin/leave">Leave</a></nav>`;
}

adminRouter.get("/admin", (req, res) => {
  res.send(page("Admin", `${adminNav()}<div class="card"><h1>Admin</h1><p>Manage departments, employees, and leave entries.</p></div>`));
});

// --- Departments ---------------------------------------------------------

adminRouter.get("/admin/departments", async (req, res) => {
  const admin = req.employee!;
  const departments = await db.department.findMany({ where: { companyId: admin.companyId }, orderBy: { name: "asc" } });

  const rows = departments.map((d) => `<div class="status-row">${escapeHtml(d.name)}</div>`).join("");

  res.send(
    page(
      "Departments",
      `${adminNav()}
      <div class="card"><h1>Departments</h1>${rows || "<p>None yet.</p>"}</div>
      <div class="card">
        <h1>Add a department</h1>
        <form method="post" action="/admin/departments">
          <input type="text" name="name" placeholder="Department name" required>
          <p></p><input type="submit" value="Add">
        </form>
      </div>`
    )
  );
});

adminRouter.post("/admin/departments", async (req, res) => {
  const admin = req.employee!;
  const name = String(req.body.name || "").trim();
  if (name) {
    await db.department.create({ data: { companyId: admin.companyId, name } });
  }
  res.redirect("/admin/departments");
});

// --- Employees -------------------------------------------------------------

adminRouter.get("/admin/employees", async (req, res) => {
  const admin = req.employee!;
  const [employees, departments] = await Promise.all([
    db.employee.findMany({ where: { companyId: admin.companyId, deactivatedAt: null }, include: { department: true }, orderBy: { name: "asc" } }),
    db.department.findMany({ where: { companyId: admin.companyId }, orderBy: { name: "asc" } }),
  ]);

  const rows = employees
    .map(
      (e) =>
        `<div class="status-row"><div><strong>${escapeHtml(e.name)}</strong> — ${escapeHtml(e.department.name)} — ${e.role}<br><span class="stale">${escapeHtml(e.phoneNumber)}</span></div></div>`
    )
    .join("");

  const deptOptions = departments.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("");

  res.send(
    page(
      "Employees",
      `${adminNav()}
      <div class="card"><h1>Employees</h1>${rows || "<p>None yet.</p>"}</div>
      <div class="card">
        <h1>Add an employee</h1>
        ${departments.length === 0 ? '<p>Add a department first.</p>' : `
        <form method="post" action="/admin/employees">
          <input type="text" name="name" placeholder="Full name" required>
          <p></p>
          <input type="tel" name="phoneNumber" placeholder="Phone number (used to log in)" required>
          <p></p>
          <select name="departmentId" required>${deptOptions}</select>
          <p></p>
          <select name="role">
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <p></p>
          <input type="submit" value="Add">
        </form>`}
      </div>`
    )
  );
});

adminRouter.post("/admin/employees", async (req, res) => {
  const admin = req.employee!;
  const name = String(req.body.name || "").trim();
  const phoneNumber = String(req.body.phoneNumber || "").trim();
  const departmentId = String(req.body.departmentId || "");
  const role = String(req.body.role || "employee");

  if (name && phoneNumber && departmentId) {
    await db.employee.create({
      data: { companyId: admin.companyId, name, phoneNumber, departmentId, role: role as any },
    });
  }
  res.redirect("/admin/employees");
});

// --- Leave -----------------------------------------------------------------
// No reason/category field, by design — docs/11 and /12 both exclude it.
// The scheduled leave-sync job (checked every minute) is what actually
// turns this into an "On leave" status; this route only records the grant.

adminRouter.get("/admin/leave", async (req, res) => {
  const admin = req.employee!;
  const [entries, employees] = await Promise.all([
    db.leaveEntry.findMany({
      where: { companyId: admin.companyId },
      include: { employee: true },
      orderBy: { startDate: "desc" },
      take: 50,
    }),
    db.employee.findMany({ where: { companyId: admin.companyId, deactivatedAt: null }, orderBy: { name: "asc" } }),
  ]);

  const rows = entries
    .map(
      (l) =>
        `<div class="status-row">${escapeHtml(l.employee.name)}: ${l.startDate.toISOString().slice(0, 10)} to ${l.endDate.toISOString().slice(0, 10)}</div>`
    )
    .join("");

  const empOptions = employees.map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join("");

  res.send(
    page(
      "Leave",
      `${adminNav()}
      <div class="card"><h1>Approved leave</h1>${rows || "<p>None yet.</p>"}</div>
      <div class="card">
        <h1>Add leave</h1>
        ${employees.length === 0 ? "<p>Add an employee first.</p>" : `
        <form method="post" action="/admin/leave">
          <select name="employeeId" required>${empOptions}</select>
          <p>Start date</p><input type="date" name="startDate" required>
          <p>End date</p><input type="date" name="endDate" required>
          <p></p><input type="submit" value="Add">
        </form>`}
      </div>`
    )
  );
});

adminRouter.post("/admin/leave", async (req, res) => {
  const admin = req.employee!;
  const employeeId = String(req.body.employeeId || "");
  const startDate = String(req.body.startDate || "");
  const endDate = String(req.body.endDate || "");

  if (employeeId && startDate && endDate && endDate >= startDate) {
    await db.leaveEntry.create({
      data: {
        companyId: admin.companyId,
        employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        approvedByEmployeeId: admin.id,
      },
    });
  }
  res.redirect("/admin/leave");
});
