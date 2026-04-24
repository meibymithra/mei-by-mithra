import { prisma } from "@/server/db";

export async function getAdminMetrics() {
  const [clients, bookings, invoices, feedback, testimonials] = await Promise.all([
    prisma.client.count(),
    prisma.booking.count(),
    prisma.invoice.findMany({ select: { amount: true, status: true } }),
    prisma.feedback.count(),
    prisma.testimonial.count({ where: { published: true } })
  ]);

  const revenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((total, invoice) => total + Number(invoice.amount), 0);

  return {
    clients,
    bookings,
    feedback,
    testimonials,
    revenue
  };
}
