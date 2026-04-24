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
