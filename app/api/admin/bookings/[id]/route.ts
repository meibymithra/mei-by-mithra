import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { sendTemplateEmail } from "@/server/services/email";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = body.status as "BOOKED" | "COMPLETED" | "CANCELLED" | "PENDING" | undefined;

  const existing = await prisma.booking.findUnique({
    where: { id },
    include: { client: true }
  });
  if (!existing) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(typeof body.rescheduleNote === "string" ? { rescheduleNote: body.rescheduleNote } : {})
    }
  });

  if (status === "COMPLETED" && existing.status !== "COMPLETED") {
    await sendTemplateEmail("feedbackRequest", {
      to: existing.client.email,
      name: existing.client.fullName,
      feedbackUrl: `${process.env.SITE_URL || "http://localhost:3000"}/feedback/${existing.feedbackToken}`
    });
  }

  return NextResponse.json({ booking });
}
