export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { BookingStatusEditor } from "@/components/admin/booking-status-editor";
import { CalendarCheck, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  const statusCounts = {
    all: bookings.length,
    upcoming: (bookings as any[]).filter(b => b.status === "BOOKED" || b.status === "upcoming").length,
    completed: (bookings as any[]).filter(b => b.status === "COMPLETED" || b.status === "completed").length,
    cancelled: (bookings as any[]).filter(b => b.status === "CANCELLED" || b.status === "cancelled").length,
  };

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
    BOOKED: { icon: Clock, color: "text-sage bg-sage/10", label: "Booked" },
    COMPLETED: { icon: CheckCircle, color: "text-primary bg-primary/10", label: "Completed" },
    CANCELLED: { icon: XCircle, color: "text-destructive bg-destructive/10", label: "Cancelled" },
    PENDING: { icon: Clock, color: "text-coral bg-coral/10", label: "Pending" },
    upcoming: { icon: Clock, color: "text-sage bg-sage/10", label: "Booked" },
    completed: { icon: CheckCircle, color: "text-primary bg-primary/10", label: "Completed" },
    cancelled: { icon: XCircle, color: "text-destructive bg-destructive/10", label: "Cancelled" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading eyebrow="Bookings" title="Booking management" description="Tag session status, reschedule notes, and keep booking records aligned with Cal.com." />
        <Badge variant="secondary" className="w-fit">{statusCounts.all} total</Badge>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-muted p-3">
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts.all}</p>
              <p className="text-xs text-muted-foreground">Total bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/30 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-sage/10 p-3">
              <Clock className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts.upcoming}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-destructive/10 p-3">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts.cancelled}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">All bookings</p>
            </div>
            <Badge variant="outline">{bookings.length} shown</Badge>
          </div>
        </CardHeader>
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
              {bookings.map((booking: any) => {
                const config = statusConfig[booking.status] || statusConfig.COMPLETED || statusConfig.completed;
                const StatusIcon = config.icon;
                return (
                  <TR key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <TD>
                      <div className="space-y-1">
                        <p className="font-medium">{booking.client.fullName}</p>
                        <p className="text-xs text-muted-foreground">{booking.client.email}</p>
                      </div>
                    </TD>
                    <TD className="text-sm">
                      {booking.scheduledAt ? (
                        <div className="space-y-1">
                          <p>{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(booking.scheduledAt).toLocaleTimeString()}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not set</span>
                      )}
                    </TD>
                    <TD>
<Badge 
                      variant={booking.status === "BOOKED" || booking.status === "upcoming" ? "secondary" : booking.status === "COMPLETED" || booking.status === "completed" ? "default" : "outline"}
                      className={`${config.color} border-0`}
                    >
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                    </TD>
                    <TD className="min-w-[260px]">
                      <BookingStatusEditor bookingId={booking.id} initialStatus={booking.status} initialNote={booking.rescheduleNote ?? ""} />
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
