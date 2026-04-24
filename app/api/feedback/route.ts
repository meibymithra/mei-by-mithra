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

  const { token, rating, feedback, consentToTestimonial } = parsed.data;
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
      feedback: sanitizeText(feedback),
      consentToTestimonial
    }
  });

  const admins = await getAdminEmails();
  if (admins.length) {
    await sendTransactionalEmail({
      to: admins,
      subject: `New feedback received from ${booking.client.fullName}`,
      html: `<p>Rating: ${rating}/5</p><p>${sanitizeText(feedback)}</p>`,
      templateKey: "custom",
      metadata: { feedbackId: record.id, bookingId: booking.id }
    });
  }

  return NextResponse.json({ message: "Feedback submitted." });
}
