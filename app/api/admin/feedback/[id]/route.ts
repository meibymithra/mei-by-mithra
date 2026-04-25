import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { feedbackModerationSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = feedbackModerationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback moderation payload" }, { status: 400 });

  const { publishStatus, quote, name } = parsed.data;

  const feedback = await prisma.feedback.update({
    where: { id },
    data: { publishStatus }
  });
  const client = await prisma.client.findUnique({ where: { id: feedback.clientId } });

  if (publishStatus === "APPROVED" && feedback.consentToTestimonial) {
    await prisma.testimonial.upsert({
      where: { feedbackId: feedback.id },
      update: {
        name: name || client?.fullName || "Client",
        quote: quote || feedback.feedback,
        rating: feedback.rating,
        published: true
      },
      create: {
        clientId: feedback.clientId,
        feedbackId: feedback.id,
        name: name || client?.fullName || "Client",
        quote: quote || feedback.feedback,
        rating: feedback.rating,
        published: true
      }
    });
  } else {
    await prisma.testimonial.deleteMany({
      where: { feedbackId: feedback.id }
    });
  }

  return NextResponse.json({ feedback });
}
