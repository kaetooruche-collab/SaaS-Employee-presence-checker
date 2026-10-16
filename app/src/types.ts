import type { Company, Department, Employee } from "@prisma/client";

export type AuthenticatedEmployee = Employee & {
  department: Department;
  company: Company;
};

declare global {
  namespace Express {
    interface Request {
      employee?: AuthenticatedEmployee;
    }
  }
}

// cookie-session's own types declare CookieSessionObject with a
// [propertyName: string]: any index signature inside this ambient
// namespace — augmenting it here just gives our two keys real types
// instead of falling back to `any` everywhere they're used.
declare namespace CookieSessionInterfaces {
  interface CookieSessionObject {
    employeeId?: string;
    pendingOtpEmployeeId?: string;
  }
}
