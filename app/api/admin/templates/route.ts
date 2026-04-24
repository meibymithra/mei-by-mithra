import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { templateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid template" }, { status: 400 });

  const template = await prisma.emailTemplate.upsert({
    where: { key: parsed.data.key },
    update: {
      subject: parsed.data.subject,
      body: parsed.data.body
    },
    create: parsed.data
  });

  return NextResponse.json({ template });
}
