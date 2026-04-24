import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ClientNoteEditor } from "@/components/admin/client-note-editor";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { intakeForms: { orderBy: { submittedAt: "desc" }, take: 1 }, bookings: { orderBy: { createdAt: "desc" }, take: 3 } },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Clients" title="Client management" description="View intake data, status, bookings, notes, and tags." />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Contact</TH>
                <TH>Intake</TH>
                <TH>Notes</TH>
              </TR>
            </THead>
            <TBody>
              {clients.map((client) => (
                <TR key={client.id}>
                  <TD>
                    <p className="font-medium">{client.fullName}</p>
                    <p className="text-xs text-muted-foreground">{client.tags.join(", ") || "No tags"}</p>
                  </TD>
                  <TD>
                    <p>{client.email}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </TD>
                  <TD>
                    <details>
                      <summary className="cursor-pointer text-primary">View intake</summary>
                      <pre className="mt-2 max-h-48 overflow-auto rounded-2xl bg-muted p-3 text-xs">
                        {JSON.stringify(client.intakeForms[0] ?? {}, null, 2)}
                      </pre>
                    </details>
                  </TD>
                  <TD className="min-w-[280px]">
                    <ClientNoteEditor clientId={client.id} initialNote={client.notes} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
