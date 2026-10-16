import { db } from "../db";
import { AuthenticatedEmployee } from "../types";

// Implements the visibility rules from docs/11-product-definition-mvp.md:
// department-scoped by default, with Admin-granted overrides that must stay
// auditable. "all" means every department in the employee's own company —
// never across companies, regardless of role.
export async function visibleDepartmentIds(employee: AuthenticatedEmployee): Promise<string[] | "all"> {
  if (employee.role === "admin" || employee.seesAllDepartments) {
    return "all";
  }
  const extra = await db.employeeExtraDepartmentAccess.findMany({
    where: { employeeId: employee.id },
    select: { departmentId: true },
  });
  return [employee.departmentId, ...extra.map((e) => e.departmentId)];
}

// Can `actor` set or correct `target`'s status? Self always can. Managers
// can act on direct reports in their own department. Admins can act on
// anyone in their own company — never cross-company.
export function canActOnEmployee(
  actor: AuthenticatedEmployee,
  target: { id: string; companyId: string; departmentId: string }
): boolean {
  if (actor.companyId !== target.companyId) return false;
  if (actor.id === target.id) return true;
  if (actor.role === "admin") return true;
  if (actor.role === "manager" && actor.departmentId === target.departmentId) return true;
  return false;
}
