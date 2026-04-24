import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { noteSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid note" }, { status: 400 });

  const client = await prisma.client.update({
    where: { id },
    data: { notes: parsed.data.note }
  });

  return NextResponse.json({ client });
}
