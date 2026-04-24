import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { BookingStatusEditor } from "@/components/admin/booking-status-editor";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Bookings" title="Booking management" description="Tag session status, reschedule notes, and keep booking records aligned with Calendly." />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Client</TH>
                <TH>Scheduled</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {bookings.map((booking: any) => (
                <TR key={booking.id}>
                  <TD>
                    <p className="font-medium">{booking.client.fullName}</p>
                    <p className="text-xs text-muted-foreground">{booking.client.email}</p>
                  </TD>
                  <TD>{booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "Not set"}</TD>
                  <TD>{booking.status}</TD>
                  <TD className="min-w-[260px]">
                    <BookingStatusEditor bookingId={booking.id} initialStatus={booking.status} initialNote={booking.rescheduleNote ?? ""} />
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
