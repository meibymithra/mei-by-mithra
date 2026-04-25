import type { AdminUser } from "@prisma/client";
import { prisma } from "@/server/db";

export async function getAdminEmails() {
  if (process.env.ADMIN_EMAILS) {
    return process.env.ADMIN_EMAILS.split(",").map((email) => email.trim()).filter(Boolean);
  }

  const admins = await prisma.adminUser.findMany({
    where: { active: true },
    select: { email: true }
  });

  return admins.map((admin: Pick<AdminUser, "email">) => admin.email);
}
