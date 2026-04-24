import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description,
      price: Number(body.price),
      currency: body.currency ?? "INR",
      downloadUrl: body.downloadUrl || null,
      paymentLink: body.paymentLink || null,
      provider: body.provider ?? "MANUAL",
      active: body.active ?? true
    }
  });

  return NextResponse.json({ product });
}
