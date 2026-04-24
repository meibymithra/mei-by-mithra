import { NextResponse } from "next/server";
import { adminInvoiceSchema } from "@/lib/validators";
import { prisma } from "@/server/db";
import { assertAdmin } from "@/server/admin";
import { formatCurrency } from "@/lib/utils";
import { sendTemplateEmail } from "@/server/services/email";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = adminInvoiceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const data = parsed.data;
  const client = await prisma.client.findUnique({ where: { id: data.clientId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const invoice = await prisma.invoice.create({
    data: {
      clientId: client.id,
      adminId: admin.id,
      sessionCount: data.sessionCount,
      amount: data.amount,
      currency: data.currency,
      paymentLink: data.paymentLink || null,
      notes: data.notes || ""
    }
  });

  if (data.paymentLink) {
    await sendTemplateEmail("invoice", {
      to: client.email,
      name: client.fullName,
      amount: formatCurrency(data.amount, data.currency),
      paymentLink: data.paymentLink
    });
  }

  return NextResponse.json({ message: "Invoice created", invoiceId: invoice.id });
}
