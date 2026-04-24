export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";

export default async function InvoicesPage() {
  const [clients, invoices] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Invoices" title="Invoice system" description="Create invoices, track payment status, and send payment-link emails." />
      <Card>
        <CardContent className="space-y-4">
          <InvoiceCreateForm clients={clients} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Client</TH>
                <TH>Sessions</TH>
                <TH>Amount</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {invoices.map((invoice) => (
                <TR key={invoice.id}>
                  <TD>{invoice.client.fullName}</TD>
                  <TD>{invoice.sessionCount}</TD>
                  <TD>
                    {invoice.currency} {Number(invoice.amount)}
                  </TD>
                  <TD>{invoice.status}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
