import Link from "next/link";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { CalendlyLogEditor } from "@/components/admin/calendly-log-editor";

export default async function AdminCalendlyPage({
  searchParams
}: {
  searchParams?: Promise<{ logPage?: string; bookingPage?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const logPage = Math.max(1, Number(params.logPage ?? "1") || 1);
  const bookingPage = Math.max(1, Number(params.bookingPage ?? "1") || 1);
  const logTake = 20;
  const bookingTake = 10;
  const logSkip = (logPage - 1) * logTake;
  const bookingSkip = (bookingPage - 1) * bookingTake;

  const [logs, upcomingBookings, logCount, bookingCount] = await Promise.all([
    prisma.calendlyWebhookLog.findMany({
      orderBy: { createdAt: "desc" },
      take: logTake,
      skip: logSkip
    }),
    prisma.booking.findMany({
      include: { client: true },
      where: {
        scheduledAt: {
          not: null
        }
      },
      orderBy: { scheduledAt: "asc" },
      take: bookingTake,
      skip: bookingSkip
    }),
    prisma.calendlyWebhookLog.count(),
    prisma.booking.count({
      where: {
        scheduledAt: {
          not: null
        }
      }
    })
  ]);

  const received = logs.filter((log) => log.status === "RECEIVED").length;
  const processed = logs.filter((log) => log.status === "PROCESSED").length;
  const duplicates = logs.filter((log) => log.status === "DUPLICATE").length;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Calendly"
        title="Calendly operations"
        description="Track webhook traffic, upcoming sessions, and booking processing state."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Received</p><p className="mt-2 text-3xl font-semibold">{received}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Processed</p><p className="mt-2 text-3xl font-semibold">{processed}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Duplicates</p><p className="mt-2 text-3xl font-semibold">{duplicates}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Client</TH>
                <TH>Scheduled</TH>
                <TH>Status</TH>
                <TH>Timezone</TH>
              </TR>
            </THead>
            <TBody>
              {upcomingBookings.map((booking) => (
                <TR key={booking.id}>
                  <TD>
                    <p className="font-medium">{booking.client.fullName}</p>
                    <p className="text-xs text-muted-foreground">{booking.client.email}</p>
                  </TD>
                  <TD>{booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "Not set"}</TD>
                  <TD>{booking.status}</TD>
                  <TD>{booking.timezone ?? "Unknown"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
            <span>
              Showing {Math.min(bookingSkip + 1, bookingCount)}-{Math.min(bookingSkip + upcomingBookings.length, bookingCount)} of {bookingCount}
            </span>
            <div className="flex gap-2">
              {bookingPage > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/calendly?logPage=${logPage}&bookingPage=${bookingPage - 1}`}>Previous</Link>
                </Button>
              ) : null}
              {bookingSkip + upcomingBookings.length < bookingCount ? (
                <Button asChild size="sm">
                  <Link href={`/admin/calendly?logPage=${logPage}&bookingPage=${bookingPage + 1}`}>Next</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Event</TH>
                <TH>Invitee</TH>
                <TH>Time</TH>
                <TH>Manage</TH>
              </TR>
            </THead>
            <TBody>
              {logs.map((log) => (
                <TR key={log.id}>
                  <TD>
                    <p className="font-medium">{log.eventType}</p>
                    <p className="text-xs text-muted-foreground">{log.eventUri ?? "No event uri"}</p>
                  </TD>
                  <TD>
                    <p>{log.inviteeName ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{log.inviteeEmail ?? ""}</p>
                  </TD>
                  <TD>{new Date(log.createdAt).toLocaleString()}</TD>
                  <TD className="min-w-[240px]">
                    <CalendlyLogEditor logId={log.id} initialStatus={log.status} initialNotes={log.notes} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
            <span>
              Showing {Math.min(logSkip + 1, logCount)}-{Math.min(logSkip + logs.length, logCount)} of {logCount}
            </span>
            <div className="flex gap-2">
              {logPage > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/calendly?logPage=${logPage - 1}&bookingPage=${bookingPage}`}>Previous</Link>
                </Button>
              ) : null}
              {logSkip + logs.length < logCount ? (
                <Button asChild size="sm">
                  <Link href={`/admin/calendly?logPage=${logPage + 1}&bookingPage=${bookingPage}`}>Next</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
