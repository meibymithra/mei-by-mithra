export const brand = {
  name: "Mei by Mithra",
  slug: "meibymithra",
  ownerName: "Mithra Krishnamoorthy",
  portfolioLabel: "Portfolio + Support Practice",
  tagline: "Calm, confidential support for parenting, teaching, relationships, and personal growth.",
  primary: "#B72E09",
  cream: "#F5EEDC",
  sage: "#84A18F"
} as const;

export const owner = {
  name: "Mithra Krishnamoorthy",
  role: "Counsellor, sex educator, and purpose coach",
  summary:
    "Mithra works at the intersection of counselling psychology, sexuality education, and practical support for everyday life."
} as const;

export const contact = {
  email: "meibymithra@gmail.com",
  location: "Chennai and Coimbatore, India",
  resumeUrl: "/showcase/archive/Mithra_Krishnamoorthy_Mithra_AK_Resume_.pdf"
} as const;

export const homeHeroFallback = {
  eyebrow: "Mithra Krishnamoorthy",
  title: "A professional brand website for counselling, sexuality education, and practical support.",
  description:
    "Mei by Mithra presents Mithra Krishnamoorthy's practice, portfolio, and digital resources through a calm, premium experience designed for individuals, parents, educators, and institutions.",
  primaryCtaLabel: "Book a Session",
  primaryCtaHref: "/book",
  secondaryCtaLabel: "Explore the Store",
  secondaryCtaHref: "/store"
} as const;

export const aboutPageFallback = {
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
} as const;

export const practicePageFallback = {
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
} as const;

export const schedule = {
  weekdays: "Mon-Sat, 7:30 PM - 8:30 PM",
  sunday: "Sunday, 8:30 AM - 8:30 PM"
} as const;

export const goalOptions = [
  "Emotional regulation",
  "Parenting support",
  "Teaching support",
  "Relationship clarity",
  "Stress and burnout",
  "Behaviour concerns",
  "Sexuality and body literacy",
  "Other"
] as const;

export const sessionTypes = [
  { label: "1:1 Session", value: "single", priceHint: "For a focused conversation with clear next steps." },
  { label: "Package", value: "package", priceHint: "For ongoing support with structured session credits." }
] as const;

export const packageOptions = [
  { label: "1 session", value: "1" },
  { label: "3 sessions", value: "3" },
  { label: "5 sessions", value: "5" },
  { label: "8 sessions", value: "8" }
] as const;

export const productDefaults = [
  {
    slug: "teachers-playbook",
    name: "Teachers Playbook",
    description: "Practical classroom support for educators who want clearer routines, boundaries, and student care.",
    price: 1299
  },
  {
    slug: "parents-playbook",
    name: "Parents Playbook",
    description: "Clear, usable support for home routines, boundaries, communication, and calmer conflict.",
    price: 1499
  },
  {
    slug: "kids-playbook",
    name: "Kids Playbook",
    description: "Simple tools and printable routines built for children and caregivers at home.",
    price: 999
  }
] as const;

export const productProfiles = {
  "teachers-playbook": {
    audience: "Educators, facilitators, and school teams",
    includes: [
      "Classroom boundary and routine tools",
      "Guidance for handling emotional or behavioural concerns",
      "Practical language prompts for difficult conversations"
    ]
  },
  "parents-playbook": {
    audience: "Parents and caregivers looking for calmer structure at home",
    includes: [
      "Simple routines and boundary-setting frameworks",
      "Communication prompts for emotionally charged moments",
      "Usable tools for consistency, repair, and follow-through"
    ]
  },
  "kids-playbook": {
    audience: "Children and caregivers using co-regulation tools together",
    includes: [
      "Printable routines and reflection tools",
      "Age-sensitive activities for emotional literacy",
      "Supportive exercises that work at home or after sessions"
    ]
  }
} as const;

export const faqDefaults = [
  {
    question: "How does booking work?",
    answer:
      "Book through Calendly, complete intake from the automatic email, and receive the invoice link after review."
  },
  {
    question: "Do you offer confidentiality?",
    answer:
      "Yes. Intake includes confidentiality and terms acceptance, and all submissions are stored securely in the database."
  },
  {
    question: "Can I book a package?",
    answer:
      "Yes. You can choose a single session or ask for a bulk package, and credits are tracked on the client record."
  }
] as const;

export const playbookFaqs = [
  {
    type: "Teachers",
    question: "What does the Teachers Playbook actually help with?",
    answer: "It focuses on classroom routines, behaviour support, emotional safety, and language educators can use in difficult situations."
  },
  {
    type: "Parents",
    question: "Is the Parents Playbook practical or theory-heavy?",
    answer: "It is built for practical use at home: calmer routines, boundary-setting, communication, and conflict repair."
  },
  {
    type: "Kids",
    question: "How is the Kids Playbook meant to be used?",
    answer: "With children and caregivers together. It includes simple exercises, emotional literacy prompts, and printable supports."
  }
] as const;
