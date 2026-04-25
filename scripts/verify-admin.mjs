import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const ADMIN_EMAIL = "meibymithra@gmail.com";

function parseEnvFile(path) {
  if (!fs.existsSync(path)) return;

  const content = fs.readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;

    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadLocalEnv() {
  parseEnvFile(".env");
  parseEnvFile(".env.local");
}

async function verifySupabaseUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return {
      ok: false,
      reason: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    };
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    return {
      ok: false,
      reason: error.message
    };
  }

  const user = data.users.find((item) => item.email?.toLowerCase() === ADMIN_EMAIL);
  if (!user) {
    return {
      ok: false,
      reason: `Supabase Auth user not found for ${ADMIN_EMAIL}`
    };
  }

  return {
    ok: true,
    id: user.id,
    email: user.email
  };
}

async function verifyAdminRow(expectedSupabaseUserId) {
  const prisma = new PrismaClient();

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: ADMIN_EMAIL },
      select: {
        email: true,
        active: true,
        supabaseUserId: true
      }
    });

    if (!admin) {
      return {
        ok: false,
        reason: `AdminUser row not found for ${ADMIN_EMAIL}`
      };
    }

    if (!admin.active) {
      return {
        ok: false,
        reason: `AdminUser row for ${ADMIN_EMAIL} is inactive`
      };
    }

    if (admin.supabaseUserId !== expectedSupabaseUserId) {
      return {
        ok: false,
        reason: `AdminUser.supabaseUserId does not match Supabase user (${admin.supabaseUserId ?? "missing"} vs ${expectedSupabaseUserId})`
      };
    }

    return {
      ok: true,
      email: admin.email,
      active: admin.active,
      supabaseUserId: admin.supabaseUserId
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  loadLocalEnv();

  const supabase = await verifySupabaseUser();
  if (!supabase.ok) {
    console.error(supabase.reason);
    process.exitCode = 1;
    return;
  }

  const admin = await verifyAdminRow(supabase.id);
  if (!admin.ok) {
    console.error(admin.reason);
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        email: admin.email,
        active: admin.active,
        supabaseUserId: admin.supabaseUserId
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
