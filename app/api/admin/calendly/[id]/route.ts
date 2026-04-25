import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { calendlyLogUpdateSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = calendlyLogUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid Calendly log update" }, { status: 400 });

  const { status, notes } = parsed.data;

  const log = await prisma.calendlyWebhookLog.update({
    where: { id },
    data: {
      status,
      notes: notes ?? undefined
    }
  });

  return NextResponse.json({ log });
}
