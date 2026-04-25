import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { adminProductSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const data = parsed.data;
  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      downloadUrl: data.downloadUrl || null,
      paymentLink: data.paymentLink || null,
      provider: data.provider,
      active: data.active
    }
  });

  return NextResponse.json({ product });
}
