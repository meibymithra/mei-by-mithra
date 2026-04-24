import { prisma } from "@/server/db";
import { faqDefaults, productDefaults } from "@/lib/constants";

export async function getPublicTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 12
  });

  return testimonials.length
    ? testimonials
    : [
        { id: "1", name: "Parent", quote: "The conversation felt calm, thoughtful, and immediately usable.", rating: 5, featured: true },
        { id: "2", name: "Educator", quote: "The guidance was specific, respectful, and easy to act on.", rating: 5, featured: false }
      ];
}

export async function getPublicFaqs() {
  const record = await prisma.siteContent.findUnique({ where: { key: "faqs" } });
  if (!record) return faqDefaults;
  return (record.content as unknown as typeof faqDefaults) ?? faqDefaults;
}

export async function getPublicProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" }
  });
  return products.length ? products : productDefaults;
}

export async function getSiteSection(key: string, fallback: Record<string, unknown>) {
  const record = await prisma.siteContent.findUnique({ where: { key } });
  if (!record) return fallback;
  return (record.content as unknown as typeof fallback) ?? fallback;
}
