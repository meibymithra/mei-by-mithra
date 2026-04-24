import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/config";

export async function getSupabaseServerClient() {
  if (!hasSupabaseConfig()) return null;
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        }
      }
    }
  );
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login?missing=config");
  return admin;
}

export async function getCurrentAdmin() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { prisma } = await import("@/server/db");
  const admin = await prisma.adminUser.findUnique({
    where: { supabaseUserId: user.id }
  });

  if (!admin || !admin.active) return null;
  return { user, admin };
}
