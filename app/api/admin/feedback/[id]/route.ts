import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const publishStatus = (body.publishStatus as "PENDING" | "APPROVED" | "REJECTED" | undefined) ?? "PENDING";
  const quote = typeof body.quote === "string" ? body.quote : undefined;
  const name = typeof body.name === "string" ? body.name : undefined;

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
