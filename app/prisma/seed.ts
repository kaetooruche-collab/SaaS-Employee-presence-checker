// Bootstrap script: creates one company, one department, and one admin
// employee. There is no self-signup in this product (doc 11: Admin creates
// accounts) — something has to create the very first Admin, and this is it.
// Run once per new company deployment, not on every start.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const companyName = process.env.SEED_COMPANY_NAME || "Demo Company";
  const timezone = process.env.SEED_TIMEZONE || "Europe/Istanbul";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin";
  const adminPhone = process.env.SEED_ADMIN_PHONE || "+905000000000";

  const company = await db.company.create({
    data: { name: companyName, timezone },
  });

  const department = await db.department.create({
    data: { companyId: company.id, name: "General" },
  });

  const admin = await db.employee.create({
    data: {
      companyId: company.id,
      departmentId: department.id,
      name: adminName,
      phoneNumber: adminPhone,
      role: "admin",
    },
  });

  console.log(`Created company "${company.name}" (${company.id})`);
  console.log(`Created department "${department.name}" (${department.id})`);
  console.log(`Created admin "${admin.name}" with phone ${admin.phoneNumber} — use this number to log in.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
