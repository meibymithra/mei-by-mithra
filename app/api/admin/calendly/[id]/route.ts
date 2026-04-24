import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = body.status as "RECEIVED" | "PROCESSED" | "DUPLICATE" | "FAILED" | undefined;
  const notes = typeof body.notes === "string" ? body.notes : undefined;

  const log = await prisma.calendlyWebhookLog.update({
    where: { id },
    data: {
      status,
      notes
    }
  });

  return NextResponse.json({ log });
}
