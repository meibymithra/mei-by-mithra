import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = {
  name: "Mithra Krishnamoorthy",
  email: "meibymithra@gmail.com",
  password: process.env.ADMIN_SEED_PASSWORD,
  recoveryEmail: process.env.ADMIN_RECOVERY_EMAIL || "meibymithra.recovery@gmail.com"
};

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

async function syncSupabaseUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn("Skipping Supabase Auth seed. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to sync the admin auth user.");
    return { supabaseUserId: "local-admin-supabase-user" };
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const existing = usersData.users.find((user) => user.email?.toLowerCase() === seed.email.toLowerCase());

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: seed.password,
      email_confirm: true,
      user_metadata: {
        full_name: seed.name,
        recovery_email: seed.recoveryEmail
      }
    });
    if (error) throw error;
    return { supabaseUserId: data.user.id };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: seed.email,
    password: seed.password,
    email_confirm: true,
    user_metadata: {
      full_name: seed.name,
      recovery_email: seed.recoveryEmail
    }
  });
  if (error) throw error;
  return { supabaseUserId: data.user.id };
}

async function main() {
  if (!seed.password) {
    throw new Error("ADMIN_SEED_PASSWORD is required to seed the admin account.");
  }

  const { supabaseUserId } = await syncSupabaseUser();
  const passwordHash = hashPassword(seed.password);

  await prisma.adminUser.upsert({
    where: { email: seed.email },
    update: {
      name: seed.name,
      recoveryEmail: seed.recoveryEmail,
      passwordHash,
      supabaseUserId,
      active: true,
      role: "ADMIN"
    },
    create: {
      name: seed.name,
      email: seed.email,
      recoveryEmail: seed.recoveryEmail,
      passwordHash,
      supabaseUserId,
      active: true,
      role: "ADMIN"
    }
  });

  await prisma.product.upsert({
    where: { slug: "teachers-playbook" },
    update: {
      name: "Teachers Playbook",
      description: "Practical classroom and student-support guidance for educators.",
      price: 1299,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "teachers-playbook",
      name: "Teachers Playbook",
      description: "Practical classroom and student-support guidance for educators.",
      price: 1299,
      currency: "INR",
      provider: "MANUAL"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "intakeRequest" },
    update: {
      subject: "Complete your Mei by Mithra intake form",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your booking is confirmed. Please complete the intake form before your session.</p><p><a href=\"{{intakeUrl}}\">Open Intake Form</a></p></div>"
    },
    create: {
      key: "intakeRequest",
      subject: "Complete your Mei by Mithra intake form",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your booking is confirmed. Please complete the intake form before your session.</p><p><a href=\"{{intakeUrl}}\">Open Intake Form</a></p></div>"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "invoice" },
    update: {
      subject: "Your Mei by Mithra invoice",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your invoice for <strong>{{amount}}</strong> is ready.</p><p><a href=\"{{paymentLink}}\">Pay Now</a></p></div>"
    },
    create: {
      key: "invoice",
      subject: "Your Mei by Mithra invoice",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your invoice for <strong>{{amount}}</strong> is ready.</p><p><a href=\"{{paymentLink}}\">Pay Now</a></p></div>"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "feedbackRequest" },
    update: {
      subject: "How was your session with Mei by Mithra?",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Please rate your session and share any feedback.</p><p><a href=\"{{feedbackUrl}}\">Open Feedback Form</a></p></div>"
    },
    create: {
      key: "feedbackRequest",
      subject: "How was your session with Mei by Mithra?",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Please rate your session and share any feedback.</p><p><a href=\"{{feedbackUrl}}\">Open Feedback Form</a></p></div>"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "productDelivery" },
    update: {
      subject: "Your {{productName}} download is ready",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your purchase has been confirmed. Download <strong>{{productName}}</strong> here.</p><p><a href=\"{{downloadUrl}}\">Download File</a></p></div>"
    },
    create: {
      key: "productDelivery",
      subject: "Your {{productName}} download is ready",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your purchase has been confirmed. Download <strong>{{productName}}</strong> here.</p><p><a href=\"{{downloadUrl}}\">Download File</a></p></div>"
    }
  });

  await prisma.product.upsert({
    where: { slug: "parents-playbook" },
    update: {
      name: "Parents Playbook",
      description: "Clear, usable support for home routines, boundaries, and communication.",
      price: 1499,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "parents-playbook",
      name: "Parents Playbook",
      description: "Clear, usable support for home routines, boundaries, and communication.",
      price: 1499,
      currency: "INR",
      provider: "MANUAL"
    }
  });

  await prisma.product.upsert({
    where: { slug: "kids-playbook" },
    update: {
      name: "Kids Playbook",
      description: "Simple tools and printable routines built for children and caregivers.",
      price: 999,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "kids-playbook",
      name: "Kids Playbook",
      description: "Simple tools and printable routines built for children and caregivers.",
      price: 999,
      currency: "INR",
      provider: "MANUAL"
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "hero" },
    update: {
      title: "Hero",
      content: {
        headline: "Mithra Krishnamoorthy with Mei by Mithra as the operating layer",
        description: "Portfolio-first and operations-ready."
      }
    },
    create: {
      key: "hero",
      title: "Hero",
      content: {
        headline: "Mithra Krishnamoorthy with Mei by Mithra as the operating layer",
        description: "Portfolio-first and operations-ready."
      }
    }
  });

  console.log("Seed complete for", seed.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
