export const brand = {
  name: "Mei by Mithra",
  slug: "meibymithra",
  ownerName: "Mithra Krishnamoorthy",
  portfolioLabel: "Portfolio + Operations",
  tagline: "Structured support for parenting, teaching, and personal growth.",
  primary: "#B72E09",
  cream: "#F5EEDC",
  sage: "#84A18F"
} as const;

export const owner = {
  name: "Mithra Krishnamoorthy",
  role: "Coach, therapist, and systems-led operator",
  summary:
    "A portfolio-cum-operations presence that pairs human-centered coaching with a premium, admin-led service system."
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
  "Other"
] as const;

export const sessionTypes = [
  { label: "1:1 Session", value: "single", priceHint: "For a focused intervention session." },
  { label: "Package", value: "package", priceHint: "For ongoing support with session credits." }
] as const;

export const productDefaults = [
  {
    slug: "teachers-playbook",
    name: "Teachers Playbook",
    description: "Practical classroom and student-support guidance for educators.",
    price: 1299
  },
  {
    slug: "parents-playbook",
    name: "Parents Playbook",
    description: "Clear, usable support for home routines, boundaries, and communication.",
    price: 1499
  },
  {
    slug: "kids-playbook",
    name: "Kids Playbook",
    description: "Simple tools and printable routines built for children and caregivers.",
    price: 999
  }
] as const;

export const faqDefaults = [
  {
    question: "How does booking work?",
    answer:
      "Book through Calendly, complete intake from the automatic email, and receive the invoice link after admin review."
  },
  {
    question: "Do you offer confidentiality?",
    answer:
      "Yes. Intake includes confidentiality and terms acceptance, and all submissions are stored securely in the database."
  },
  {
    question: "Can I book a package?",
    answer:
      "Yes. The admin can create single-session or bulk invoices and track session credits against the client record."
  }
] as const;
