import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { Role } from "@prisma/client";

// Loads the logged-in employee (fresh from the DB on every request, so a
// deactivation or role change takes effect immediately) and attaches it to
// req.employee. Every tenant-scoped query downstream reads companyId from
// here rather than trusting anything client-supplied.
export async function attachEmployee(req: Request, _res: Response, next: NextFunction) {
  const employeeId = req.session?.employeeId;
  if (!employeeId) return next();

  const employee = await db.employee.findFirst({
    where: { id: employeeId, deactivatedAt: null },
    include: { department: true, company: true },
  });

  if (employee) {
    req.employee = employee;
  } else {
    // Session points at a deactivated/missing employee — drop it rather
    // than silently treating the request as logged out.
    req.session = null;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.employee) return res.redirect("/login");
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.employee) return res.redirect("/login");
    if (!roles.includes(req.employee.role)) {
      return res.status(403).send("Not allowed.");
    }
    next();
  };
}
