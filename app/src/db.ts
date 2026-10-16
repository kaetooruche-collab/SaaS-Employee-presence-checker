import { PrismaClient } from "@prisma/client";

// Single shared Prisma client. Every query that touches a tenant-scoped
// table must filter by companyId explicitly — see src/middleware/auth.ts
// for how the authenticated employee's companyId is attached to each
// request. Isolation is enforced at the application query layer, not via
// Postgres row-level security yet — docs/12-database-schema-mvp.md flags
// RLS as a real option the schema was designed to support, but wiring it
// up is left as a follow-up (see NOTES.md).
export const db = new PrismaClient();
