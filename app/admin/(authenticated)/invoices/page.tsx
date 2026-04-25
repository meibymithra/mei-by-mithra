export const dynamic = 'force-dynamic';

import type { Client, Invoice } from "@prisma/client";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";
import { FileText, DollarSign, Clock, CheckCircle, Send, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function InvoicesPage() {
  const [clients, invoices] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" }
    })
  ]);
  const invoiceRows: Array<Invoice & { client: Client }> = invoices;

  const totalRevenue = invoiceRows.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const pendingInvoices = (invoiceRows as any[]).filter(inv => inv.status === "PENDING" || inv.status === "pending").length;
  const paidInvoices = (invoiceRows as any[]).filter(inv => inv.status === "PAID" || inv.status === "paid").length;

  const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
    PENDING: { icon: Clock, color: "text-coral bg-coral/10", label: "Pending" },
    pending: { icon: Clock, color: "text-coral bg-coral/10", label: "Pending" },
    PAID: { icon: CheckCircle, color: "text-sage bg-sage/10", label: "Paid" },
    paid: { icon: CheckCircle, color: "text-sage bg-sage/10", label: "Paid" },
    cancelled: { icon: Clock, color: "text-muted-foreground bg-muted", label: "Cancelled" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading eyebrow="Invoices" title="Invoice system" description="Create invoices, track payment status, and send payment-link emails." />
        <Badge variant="secondary" className="w-fit">{invoiceRows.length} invoices</Badge>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-coral/30 bg-coral/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-coral/10 p-3">
              <Clock className="h-5 w-5 text-coral" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingInvoices}</p>
              <p className="text-xs text-muted-foreground">Pending payments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/30 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-sage/10 p-3">
              <CheckCircle className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold">{paidInvoices}</p>
              <p className="text-xs text-muted-foreground">Completed payments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Create invoice</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <InvoiceCreateForm clients={clients} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">All invoices</p>
            </div>
            <Badge variant="outline">{invoiceRows.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {invoiceRows.map((invoice: Invoice & { client: Client }) => {
              const config = statusConfig[invoice.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div key={invoice.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {invoice.client.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{invoice.client.fullName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.client.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-right">
                      <p className="text-lg font-semibold">{formatCurrency(Number(invoice.amount), invoice.currency)}</p>
                      <p className="text-xs text-muted-foreground">{invoice.sessionCount} sessions</p>
                    </div>
                    <Badge variant={(invoice as any).status === "PAID" || (invoice as any).status === "paid" ? "secondary" : (invoice as any).status === "PENDING" || (invoice as any).status === "pending" ? "outline" : "destructive"} className={config.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
