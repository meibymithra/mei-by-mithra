import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { siteContentSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = siteContentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid content" }, { status: 400 });

  let content: Prisma.InputJsonValue;
  try {
    content = JSON.parse(parsed.data.content) as Prisma.InputJsonValue;
  } catch {
    return NextResponse.json({ error: "Content must be valid JSON" }, { status: 400 });
  }

  const record = await prisma.siteContent.upsert({
    where: { key: parsed.data.key },
    update: {
      title: parsed.data.title,
      content
    },
    create: {
      key: parsed.data.key,
      title: parsed.data.title,
      content
    }
  });

  return NextResponse.json({ record });
}
