import { test } from "node:test";
import assert from "node:assert/strict";
import { canActOnEmployee } from "./visibility";
import type { AuthenticatedEmployee } from "../types";

// Pure-logic tests for the authorization rule doc 11 depends on. The live
// end-to-end check (a forged cross-department override request actually
// gets rejected by the running server) was run manually during build and
// returned 403 — this test pins the underlying rule so it can't regress
// silently.

function emp(overrides: Partial<AuthenticatedEmployee>): AuthenticatedEmployee {
  return {
    id: "e1",
    companyId: "c1",
    departmentId: "d1",
    role: "employee",
    ...overrides,
  } as AuthenticatedEmployee;
}

test("an employee can always act on themselves", () => {
  const self = emp({ id: "e1" });
  assert.equal(canActOnEmployee(self, self), true);
});

test("a manager can act on someone in their own department", () => {
  const manager = emp({ id: "m1", role: "manager", departmentId: "d1" });
  const report = { id: "e2", companyId: "c1", departmentId: "d1" };
  assert.equal(canActOnEmployee(manager, report), true);
});

test("a manager cannot act on someone in a different department", () => {
  const manager = emp({ id: "m1", role: "manager", departmentId: "d1" });
  const other = { id: "e2", companyId: "c1", departmentId: "d2" };
  assert.equal(canActOnEmployee(manager, other), false);
});

test("an admin can act on anyone in their own company, any department", () => {
  const admin = emp({ id: "a1", role: "admin", departmentId: "d1" });
  const other = { id: "e2", companyId: "c1", departmentId: "d9" };
  assert.equal(canActOnEmployee(admin, other), true);
});

test("an admin cannot act on someone in a different company, even with matching role logic", () => {
  const admin = emp({ id: "a1", role: "admin", companyId: "c1" });
  const otherCompany = { id: "e2", companyId: "c2", departmentId: "d1" };
  assert.equal(canActOnEmployee(admin, otherCompany), false);
});

test("a plain employee cannot act on a coworker in the same department", () => {
  const employee = emp({ id: "e1", role: "employee", departmentId: "d1" });
  const coworker = { id: "e2", companyId: "c1", departmentId: "d1" };
  assert.equal(canActOnEmployee(employee, coworker), false);
});
