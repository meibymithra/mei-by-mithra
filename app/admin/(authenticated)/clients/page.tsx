export const dynamic = 'force-dynamic';

import type { Booking, Client, IntakeForm, Invoice } from "@prisma/client";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientNoteEditor } from "@/components/admin/client-note-editor";
import { Users, Mail, Phone, Calendar, FileText, ChevronDown, ExternalLink } from "lucide-react";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      intakeForms: { orderBy: { submittedAt: "desc" }, take: 1 },
      bookings: { orderBy: { createdAt: "desc" }, take: 5 },
      invoices: true
    },
    orderBy: { updatedAt: "desc" }
  });
  const clientRows: Array<
    Client & {
      intakeForms: IntakeForm[];
      bookings: Booking[];
      invoices: Invoice[];
    }
  > = clients;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading eyebrow="Clients" title="Client management" description="View intake data, status, bookings, notes, and tags." />
        <Badge variant="secondary" className="w-fit">{clientRows.length} total</Badge>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientRows.length}</p>
              <p className="text-xs text-muted-foreground">Total clients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-secondary/10 p-3">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientRows.reduce((sum, c) => sum + c.bookings.length, 0)}</p>
              <p className="text-xs text-muted-foreground">Total sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/20 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-sage/10 p-3">
              <FileText className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientRows.filter(c => c.intakeForms.length > 0).length}</p>
              <p className="text-xs text-muted-foreground">Intake submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-coral/20 bg-coral/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-coral/10 p-3">
              <Badge className="bg-coral/20 text-coral">Active</Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">{clientRows.filter(c => c.bookings.some((b: any) => b.status === "BOOKED" || b.status === "upcoming")).length}</p>
              <p className="text-xs text-muted-foreground">With upcoming</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">All clients</p>
            <Badge variant="outline">{clientRows.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {clientRows.map((client) => (
              <details key={client.id} className="group">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {client.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{client.fullName}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 sm:flex">
                      <Badge variant="outline" className="text-xs">
                        {client.bookings.length} bookings
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {client.invoices.reduce((sum, inv) => sum + inv.sessionCount, 0)} sessions
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[open=true]:rotate-180" />
                  </div>
                </summary>
                <div className="border-t border-border bg-muted/20 px-5 py-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Tags</p>
                        <Badge variant="outline">{client.tags.length || "None"}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {client.tags.length > 0 ? (
                          client.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No tags assigned</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Notes</p>
                      <ClientNoteEditor clientId={client.id} initialNote={client.notes} />
                    </div>
                  </div>
                  {client.intakeForms.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Intake form</p>
                      </div>
                      <pre className="max-h-48 overflow-auto rounded-xl bg-background p-3 text-xs">
                        {JSON.stringify(client.intakeForms[0] ?? {}, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
