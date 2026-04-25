export const dynamic = "force-dynamic";

import type { Booking, CalendlyWebhookLog, Client } from "@prisma/client";
import { hasDatabaseConfig } from "@/lib/config";
import { requireAdmin } from "@/server/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { Users, CalendarCheck, DollarSign, MessageSquare, Star, Package, Clock, CheckCircle } from "lucide-react";

export default async function AdminHomePage() {
  await requireAdmin();

  if (!hasDatabaseConfig()) {
    return (
      <div className="space-y-6">
        <SectionHeading eyebrow="Dashboard" title="Database connection missing" description="Set `DATABASE_URL` and `DIRECT_URL` in Vercel to load admin data." />
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed text-destructive">
              The admin shell is working, but the database connection is not configured. Add the Supabase Postgres URLs in Vercel, then reload this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { getAdminMetrics } = await import("@/server/metrics");
  const metrics = await getAdminMetrics();
  const { prisma } = await import("@/server/db");
  const recentBookings = await prisma.booking.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 8
  });
  const [productCount, calendlyCounts, pendingBookings, recentFeedback] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.calendlyWebhookLog.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),
    prisma.booking.count({ where: { status: "BOOKED" } }),
    prisma.feedback.count({ where: { publishStatus: "PENDING" } })
  ]);
  const bookingRows: Array<Booking & { client: Client }> = recentBookings;
  const calendlyStatusCounts: Array<Pick<CalendlyWebhookLog, "status"> & { _count: { _all: number } }> = calendlyCounts;

  const metricsData = [
    { label: "Total Clients", value: metrics.clients, icon: Users, color: "text-primary" },
    { label: "All Bookings", value: metrics.bookings, icon: CalendarCheck, color: "text-secondary" },
    { label: "Revenue", value: metrics.revenue, icon: DollarSign, color: "text-rust" },
    { label: "Pending Feedback", value: metrics.feedback, icon: MessageSquare, color: "text-coral" },
    { label: "Approved Testimonials", value: metrics.testimonials, icon: Star, color: "text-sand" },
    { label: "Active Products", value: productCount, icon: Package, color: "text-sage" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Dashboard" title="Operational overview" description="Track bookings, revenue, feedback, and testimonial approvals." />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricsData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{item.value}</p>
                  </div>
                  <div className={`rounded-xl bg-current/10 p-3 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-sage/30 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-sage/20 p-3">
              <Clock className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingBookings}</p>
              <p className="text-sm text-muted-foreground">Upcoming sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-coral/30 bg-coral/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-coral/20 p-3">
              <MessageSquare className="h-5 w-5 text-coral" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentFeedback}</p>
              <p className="text-sm text-muted-foreground">Pending reviews</p>
            </div>
          </CardContent>
        </Card>
        {calendlyStatusCounts.map((item) => (
          <Card key={item.status} className="border-border/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-primary/10 p-3">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item._count._all}</p>
                <p className="text-sm text-muted-foreground capitalize">{item.status} events</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Recent bookings</p>
            <Badge variant="outline">{bookingRows.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {bookingRows.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No bookings found yet.
              </div>
            ) : (
              bookingRows.map((booking: Booking & { client: Client }) => (
                <div key={booking.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium">{booking.client.fullName}</p>
                    <p className="text-xs text-muted-foreground">{booking.client.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={(booking as any).status === "BOOKED" ? "secondary" : (booking as any).status === "COMPLETED" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {booking.sessionType}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
