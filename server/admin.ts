import { getCurrentAdmin } from "@/server/auth";

export async function assertAdmin() {
  const session = await getCurrentAdmin();
  if (!session) {
    return null;
  }
  return session.admin;
}
