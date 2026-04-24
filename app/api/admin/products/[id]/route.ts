import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: typeof body.slug === "string" ? body.slug : undefined,
      name: body.name,
      description: body.description,
      price: Number(body.price),
      currency: body.currency,
      downloadUrl: body.downloadUrl || null,
      paymentLink: body.paymentLink || null,
      provider: body.provider,
      active: typeof body.active === "boolean" ? body.active : undefined
    }
  });

  return NextResponse.json({ product });
}
