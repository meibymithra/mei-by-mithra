import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/config";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

export async function getSupabaseServerClient() {
  if (!hasSupabaseConfig()) return null;
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
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

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    const { data: refreshData } = await supabase.auth.refreshSession();
    if (!refreshData.session) return null;
    return {
      user: refreshData.user,
      admin: await getAdminFromUser(refreshData.user!.id)
    };
  }

  const admin = await getAdminFromUser(user.id);
  if (!admin || !admin.active) return null;
  return { user, admin };
}

async function getAdminFromUser(supabaseUserId: string) {
  const { prisma } = await import("@/server/db");
  return prisma.adminUser.findUnique({
    where: { supabaseUserId }
  });
}
