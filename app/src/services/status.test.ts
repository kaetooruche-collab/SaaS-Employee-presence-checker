import { test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../db";
import { setStatus } from "./status";

// Integration test against the real Postgres instance (not a mock) — this
// is the write path every route in the app goes through, so it's worth
// pinning directly: every status change must update the live row AND
// append to history (docs/12-database-schema-mvp.md).

test("setStatus updates the live row and appends to history", async () => {
  const company = await db.company.create({ data: { name: "Test Co", timezone: "UTC" } });
  const department = await db.department.create({ data: { companyId: company.id, name: "Dept" } });
  const employee = await db.employee.create({
    data: { companyId: company.id, departmentId: department.id, name: "Test Employee", phoneNumber: "+1000000000" },
  });

  try {
    await setStatus({ targetEmployeeId: employee.id, status: "present", source: "self", setByEmployeeId: employee.id });

    const live = await db.employeeStatus.findUnique({ where: { employeeId: employee.id } });
    assert.equal(live?.status, "present");
    assert.equal(live?.source, "self");

    await setStatus({ targetEmployeeId: employee.id, status: "remote", source: "self", setByEmployeeId: employee.id });

    const liveAfter = await db.employeeStatus.findUnique({ where: { employeeId: employee.id } });
    assert.equal(liveAfter?.status, "remote");

    const history = await db.statusHistory.findMany({ where: { employeeId: employee.id }, orderBy: { createdAt: "asc" } });
    assert.equal(history.length, 2);
    assert.deepEqual(history.map((h) => h.status), ["present", "remote"]);
  } finally {
    // Clean up — this test must not leave rows behind in a DB other tests
    // or manual QA share.
    await db.company.delete({ where: { id: company.id } });
  }
});
