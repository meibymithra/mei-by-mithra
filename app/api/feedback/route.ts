import { NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/validators";
import { prisma } from "@/server/db";
import { rateLimit, getClientIp, sanitizeText } from "@/server/security";
import { getAdminEmails } from "@/server/recipients";
import { sendTransactionalEmail } from "@/server/services/email";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`feedback:${ip}`, 8, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await request.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback submission" }, { status: 400 });
  }

  const { token, rating, experienceType, whatHelped, whatCouldImprove, testimonialSnippet, consentToTestimonial } = parsed.data;
  const booking = await prisma.booking.findUnique({
    where: { feedbackToken: token },
    include: { client: true }
  });

  if (!booking) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  const existingFeedback = await prisma.feedback.findUnique({
    where: { token }
  });
  if (existingFeedback) {
    return NextResponse.json({ message: "Feedback already submitted." });
  }

  const record = await prisma.feedback.create({
    data: {
      clientId: booking.clientId,
      bookingId: booking.id,
      token,
      rating,
      feedback: sanitizeText(
        [
          `Type: ${experienceType}`,
          `What helped: ${whatHelped}`,
          whatCouldImprove ? `What could improve: ${whatCouldImprove}` : "",
          testimonialSnippet ? `Suggested testimonial: ${testimonialSnippet}` : ""
        ]
          .filter(Boolean)
          .join("\n\n")
      ),
      consentToTestimonial
    }
  });

  const admins = await getAdminEmails();
  if (admins.length) {
    await sendTransactionalEmail({
      to: admins,
      subject: `New feedback received from ${booking.client.fullName}`,
      html: `<p>Rating: ${rating}/5</p><p><strong>Type:</strong> ${sanitizeText(experienceType)}</p><p><strong>What helped:</strong> ${sanitizeText(
        whatHelped
      )}</p>${whatCouldImprove ? `<p><strong>What could improve:</strong> ${sanitizeText(whatCouldImprove)}</p>` : ""}`,
      templateKey: "custom",
      metadata: { feedbackId: record.id, bookingId: booking.id }
    });
  }

  return NextResponse.json({ message: "Feedback submitted." });
}
