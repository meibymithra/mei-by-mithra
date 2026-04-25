import crypto from "crypto";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

parseEnvFile(".env");
parseEnvFile(".env.local");

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
      description: "A classroom-ready guide for educators who want clearer routines, stronger boundaries, and calmer student support.",
      price: 1299,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "teachers-playbook",
      name: "Teachers Playbook",
      description: "A classroom-ready guide for educators who want clearer routines, stronger boundaries, and calmer student support.",
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
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your booking is confirmed. Please complete the intake form before your session.</p><p>This is part of the pre-booking workflow and helps tailor support in advance.</p><p><a href=\"{{intakeUrl}}\">Open Intake Form</a></p></div>"
    },
    create: {
      key: "intakeRequest",
      subject: "Complete your Mei by Mithra intake form",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your booking is confirmed. Please complete the intake form before your session.</p><p>This is part of the pre-booking workflow and helps tailor support in advance.</p><p><a href=\"{{intakeUrl}}\">Open Intake Form</a></p></div>"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "invoice" },
    update: {
      subject: "Your Mei by Mithra invoice",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your invoice for <strong>{{amount}}</strong> is ready.</p><p>If the payment link does not work for your region, reply for a manual invoice alternative.</p><p><a href=\"{{paymentLink}}\">Pay Now</a></p></div>"
    },
    create: {
      key: "invoice",
      subject: "Your Mei by Mithra invoice",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Your invoice for <strong>{{amount}}</strong> is ready.</p><p>If the payment link does not work for your region, reply for a manual invoice alternative.</p><p><a href=\"{{paymentLink}}\">Pay Now</a></p></div>"
    }
  });

  await prisma.emailTemplate.upsert({
    where: { key: "feedbackRequest" },
    update: {
      subject: "How was your session with Mei by Mithra?",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Please rate your session and share short, open-ended feedback.</p><p>If you consent, part of your response may later be considered for a testimonial after moderation.</p><p><a href=\"{{feedbackUrl}}\">Open Feedback Form</a></p></div>"
    },
    create: {
      key: "feedbackRequest",
      subject: "How was your session with Mei by Mithra?",
      body:
        "<div style=\"font-family:Arial,sans-serif;line-height:1.7\"><p>Hi {{name}},</p><p>Please rate your session and share short, open-ended feedback.</p><p>If you consent, part of your response may later be considered for a testimonial after moderation.</p><p><a href=\"{{feedbackUrl}}\">Open Feedback Form</a></p></div>"
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
      description: "A practical home guide for boundaries, communication, repair, and calmer conflict.",
      price: 1499,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "parents-playbook",
      name: "Parents Playbook",
      description: "A practical home guide for boundaries, communication, repair, and calmer conflict.",
      price: 1499,
      currency: "INR",
      provider: "MANUAL"
    }
  });

  await prisma.product.upsert({
    where: { slug: "kids-playbook" },
    update: {
      name: "Kids Playbook",
      description: "Simple routines, co-regulation tools, and printable supports for children and caregivers.",
      price: 999,
      currency: "INR",
      provider: "MANUAL",
      active: true
    },
    create: {
      slug: "kids-playbook",
      name: "Kids Playbook",
      description: "Simple routines, co-regulation tools, and printable supports for children and caregivers.",
      price: 999,
      currency: "INR",
      provider: "MANUAL"
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "homeHero" },
    update: {
      title: "Homepage Hero",
      content: {
        eyebrow: "Mithra Krishnamoorthy",
        title: "Counselling, sexuality education, and practical guidance delivered with clarity and care.",
        description:
          "Mei by Mithra brings together one-to-one support, facilitation, and digital resources for people, families, educators, and institutions who want grounded, usable guidance.",
        primaryCtaLabel: "Book a Session",
        primaryCtaHref: "/book",
        secondaryCtaLabel: "Explore Resources",
        secondaryCtaHref: "/store"
      }
    },
    create: {
      key: "homeHero",
      title: "Homepage Hero",
      content: {
        eyebrow: "Mithra Krishnamoorthy",
        title: "Counselling, sexuality education, and practical guidance delivered with clarity and care.",
        description:
          "Mei by Mithra brings together one-to-one support, facilitation, and digital resources for people, families, educators, and institutions who want grounded, usable guidance.",
        primaryCtaLabel: "Book a Session",
        primaryCtaHref: "/book",
        secondaryCtaLabel: "Explore Resources",
        secondaryCtaHref: "/store"
      }
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "aboutPage" },
    update: {
      title: "About Page",
      content: {
        eyebrow: "About",
        title: "Mithra Krishnamoorthy",
        description:
          "Mithra Krishnamoorthy works across counselling psychology, sexuality education, facilitation, and practical support design. Her approach combines academic grounding with direct, emotionally safe communication.",
        highlights: [
          "MSc in Counselling Psychology from Madras School of Social Work",
          "BSc in Psychology from PSG College of Arts & Science",
          "Freelance sex educator collaborating with schools, colleges, and communities",
          "Practice informed by DBT, Transactional Analysis, mindfulness, and positive psychology"
        ],
        narrative:
          "Mei by Mithra is built as a public-facing practice brand: warm enough for sensitive work, structured enough for institutions, and clear enough for people who need to decide whether support is the right fit."
      }
    },
    create: {
      key: "aboutPage",
      title: "About Page",
      content: {
        eyebrow: "About",
        title: "Mithra Krishnamoorthy",
        description:
          "Mithra Krishnamoorthy works across counselling psychology, sexuality education, facilitation, and practical support design. Her approach combines academic grounding with direct, emotionally safe communication.",
        highlights: [
          "MSc in Counselling Psychology from Madras School of Social Work",
          "BSc in Psychology from PSG College of Arts & Science",
          "Freelance sex educator collaborating with schools, colleges, and communities",
          "Practice informed by DBT, Transactional Analysis, mindfulness, and positive psychology"
        ],
        narrative:
          "Mei by Mithra is built as a public-facing practice brand: warm enough for sensitive work, structured enough for institutions, and clear enough for people who need to decide whether support is the right fit."
      }
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "practicePage" },
    update: {
      title: "Practice Page",
      content: {
        eyebrow: "Practice",
        title: "Support designed for real life, not abstract wellbeing language",
        description:
          "The practice combines one-to-one sessions, educational facilitation, and practical resources. Each offering is designed to be clear, usable, and appropriate to the client's context.",
        services: [
          {
            title: "One-to-one counselling support",
            description: "Structured conversations for emotional regulation, relationships, boundaries, stress, and life transitions."
          },
          {
            title: "Sexuality education and facilitation",
            description: "Evidence-based sessions for adolescents, young adults, schools, colleges, and community contexts."
          },
          {
            title: "Workshops, programmes, and guided resources",
            description: "Support for institutions and families through workshops, playbooks, and structured follow-through."
          }
        ],
        process: [
          "Choose a session slot through Calendly using fixed India-based availability rendered in your local timezone.",
          "Receive the intake form automatically after booking so the first conversation begins with context.",
          "Proceed as a single session or indicate package preference if ongoing support is needed.",
          "Receive an invoice or payment link, followed by session or resource delivery as appropriate."
        ]
      }
    },
    create: {
      key: "practicePage",
      title: "Practice Page",
      content: {
        eyebrow: "Practice",
        title: "Support designed for real life, not abstract wellbeing language",
        description:
          "The practice combines one-to-one sessions, educational facilitation, and practical resources. Each offering is designed to be clear, usable, and appropriate to the client's context.",
        services: [
          {
            title: "One-to-one counselling support",
            description: "Structured conversations for emotional regulation, relationships, boundaries, stress, and life transitions."
          },
          {
            title: "Sexuality education and facilitation",
            description: "Evidence-based sessions for adolescents, young adults, schools, colleges, and community contexts."
          },
          {
            title: "Workshops, programmes, and guided resources",
            description: "Support for institutions and families through workshops, playbooks, and structured follow-through."
          }
        ],
        process: [
          "Choose a session slot through Calendly using fixed India-based availability rendered in your local timezone.",
          "Receive the intake form automatically after booking so the first conversation begins with context.",
          "Proceed as a single session or indicate package preference if ongoing support is needed.",
          "Receive an invoice or payment link, followed by session or resource delivery as appropriate."
        ]
      }
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "faqs" },
    update: {
      title: "FAQs",
      content: [
        {
          question: "How does booking work?",
          answer: "Book through Calendly, complete the intake form from the follow-up email, and then receive the next payment or preparation step."
        },
        {
          question: "Is this confidential?",
          answer: "Yes. Intake covers confidentiality and terms acceptance, and the workflow is designed for private, moderation-safe handling."
        },
        {
          question: "Can I request more than one session?",
          answer: "Yes. You can indicate package preference in intake, and multiple sessions can be handled through the invoice workflow."
        }
      ]
    },
    create: {
      key: "faqs",
      title: "FAQs",
      content: [
        {
          question: "How does booking work?",
          answer: "Book through Calendly, complete the intake form from the follow-up email, and then receive the next payment or preparation step."
        },
        {
          question: "Is this confidential?",
          answer: "Yes. Intake covers confidentiality and terms acceptance, and the workflow is designed for private, moderation-safe handling."
        },
        {
          question: "Can I request more than one session?",
          answer: "Yes. You can indicate package preference in intake, and multiple sessions can be handled through the invoice workflow."
        }
      ]
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "store" },
    update: {
      title: "Store",
      content: {
        eyebrow: "Digital resources",
        title: "Practical playbooks for home, classroom, and guided follow-through",
        description:
          "Clear guides for teachers, parents, and young people. Purchase directly or request a manual invoice.",
        note: "Each playbook is positioned around a real use case so buyers can tell quickly whether it fits."
      }
    },
    create: {
      key: "store",
      title: "Store",
      content: {
        eyebrow: "Digital resources",
        title: "Practical playbooks for home, classroom, and guided follow-through",
        description:
          "Clear guides for teachers, parents, and young people. Purchase directly or request a manual invoice.",
        note: "Each playbook is positioned around a real use case so buyers can tell quickly whether it fits."
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
