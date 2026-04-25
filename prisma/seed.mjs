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
    where: { key: "homeHero" },
    update: {
      title: "Homepage Hero",
      content: {
        eyebrow: "Mithra Krishnamoorthy",
        title: "A professional brand website for counselling, sexuality education, and practical support.",
        description:
          "Mei by Mithra presents Mithra Krishnamoorthy's practice, portfolio, and digital resources through a calm, premium experience designed for individuals, parents, educators, and institutions.",
        primaryCtaLabel: "Book a Session",
        primaryCtaHref: "/book",
        secondaryCtaLabel: "Explore the Store",
        secondaryCtaHref: "/store"
      }
    },
    create: {
      key: "homeHero",
      title: "Homepage Hero",
      content: {
        eyebrow: "Mithra Krishnamoorthy",
        title: "A professional brand website for counselling, sexuality education, and practical support.",
        description:
          "Mei by Mithra presents Mithra Krishnamoorthy's practice, portfolio, and digital resources through a calm, premium experience designed for individuals, parents, educators, and institutions.",
        primaryCtaLabel: "Book a Session",
        primaryCtaHref: "/book",
        secondaryCtaLabel: "Explore the Store",
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
          "Mithra Krishnamoorthy works across counselling psychology, sexuality education, facilitation, and practical support design. Her work combines academic grounding with human-centered clarity.",
        highlights: [
          "MSc in Counselling Psychology from Madras School of Social Work",
          "BSc in Psychology from PSG College of Arts & Science",
          "Freelance sex educator collaborating with schools, colleges, and communities",
          "Practice informed by DBT, Transactional Analysis, mindfulness, and positive psychology"
        ],
        narrative:
          "The brand is designed to feel thoughtful, responsible, and emotionally intelligent. It reflects Mithra's work with individuals, families, and institutions while creating a clear pathway into booking, intake, and resources."
      }
    },
    create: {
      key: "aboutPage",
      title: "About Page",
      content: {
        eyebrow: "About",
        title: "Mithra Krishnamoorthy",
        description:
          "Mithra Krishnamoorthy works across counselling psychology, sexuality education, facilitation, and practical support design. Her work combines academic grounding with human-centered clarity.",
        highlights: [
          "MSc in Counselling Psychology from Madras School of Social Work",
          "BSc in Psychology from PSG College of Arts & Science",
          "Freelance sex educator collaborating with schools, colleges, and communities",
          "Practice informed by DBT, Transactional Analysis, mindfulness, and positive psychology"
        ],
        narrative:
          "The brand is designed to feel thoughtful, responsible, and emotionally intelligent. It reflects Mithra's work with individuals, families, and institutions while creating a clear pathway into booking, intake, and resources."
      }
    }
  });

  await prisma.siteContent.upsert({
    where: { key: "practicePage" },
    update: {
      title: "Practice Page",
      content: {
        eyebrow: "Practice",
        title: "Practice areas and service design",
        description:
          "The practice combines one-to-one support, educational facilitation, and digital resources. Each offering is meant to be useful, direct, and appropriate to the client's context.",
        services: [
          {
            title: "Counselling support",
            description: "Structured one-to-one sessions for emotional regulation, relationships, boundaries, stress, and life transitions."
          },
          {
            title: "Sexuality education",
            description: "Evidence-based educational work for adolescents, young adults, schools, colleges, and communities."
          },
          {
            title: "Workshops and facilitation",
            description: "Learning experiences and guided conversations designed for groups, institutions, and developmental contexts."
          }
        ],
        process: [
          "Clients book through Calendly using fixed India-based availability.",
          "The first intake form is sent automatically after booking.",
          "Support may proceed as a single session or as a multi-session package depending on need.",
          "Invoices and follow-up are handled through the admin workflow."
        ]
      }
    },
    create: {
      key: "practicePage",
      title: "Practice Page",
      content: {
        eyebrow: "Practice",
        title: "Practice areas and service design",
        description:
          "The practice combines one-to-one support, educational facilitation, and digital resources. Each offering is meant to be useful, direct, and appropriate to the client's context.",
        services: [
          {
            title: "Counselling support",
            description: "Structured one-to-one sessions for emotional regulation, relationships, boundaries, stress, and life transitions."
          },
          {
            title: "Sexuality education",
            description: "Evidence-based educational work for adolescents, young adults, schools, colleges, and communities."
          },
          {
            title: "Workshops and facilitation",
            description: "Learning experiences and guided conversations designed for groups, institutions, and developmental contexts."
          }
        ],
        process: [
          "Clients book through Calendly using fixed India-based availability.",
          "The first intake form is sent automatically after booking.",
          "Support may proceed as a single session or as a multi-session package depending on need.",
          "Invoices and follow-up are handled through the admin workflow."
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
          answer: "Book a slot, complete the intake form, and wait for the next-step email."
        },
        {
          question: "Is this confidential?",
          answer: "Yes. The intake and follow-up process is designed to be private and secure."
        },
        {
          question: "Can I buy a playbook instead of booking?",
          answer: "Yes. The store offers practical resources for teachers, parents, and children."
        }
      ]
    },
    create: {
      key: "faqs",
      title: "FAQs",
      content: [
        {
          question: "How does booking work?",
          answer: "Book a slot, complete the intake form, and wait for the next-step email."
        },
        {
          question: "Is this confidential?",
          answer: "Yes. The intake and follow-up process is designed to be private and secure."
        },
        {
          question: "Can I buy a playbook instead of booking?",
          answer: "Yes. The store offers practical resources for teachers, parents, and children."
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
        title: "Practical playbooks for daily life",
        description:
          "Clear guides for teachers, parents, and young people. Purchase directly or request a manual invoice.",
        note: "These listings can be edited from the admin dashboard."
      }
    },
    create: {
      key: "store",
      title: "Store",
      content: {
        eyebrow: "Digital resources",
        title: "Practical playbooks for daily life",
        description:
          "Clear guides for teachers, parents, and young people. Purchase directly or request a manual invoice.",
        note: "These listings can be edited from the admin dashboard."
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
