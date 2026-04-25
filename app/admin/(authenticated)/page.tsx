export const dynamic = "force-dynamic";

import type { Booking, CalendlyWebhookLog, Client } from "@prisma/client";
import { hasDatabaseConfig } from "@/lib/config";
import { requireAdmin } from "@/server/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";

export default async function AdminHomePage() {
  await requireAdmin();

  if (!hasDatabaseConfig()) {
    return (
      <div className="space-y-6">
        <SectionHeading eyebrow="Dashboard" title="Database connection missing" description="Set `DATABASE_URL` and `DIRECT_URL` in Vercel to load admin data." />
        <Card>
          <CardContent className="p-5 text-sm leading-7 text-muted-foreground">
            The admin shell is working, but the database connection is not configured. Add the Supabase Postgres URLs in Vercel, then reload this page.
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
    take: 5
  });
  const [productCount, calendlyCounts] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.calendlyWebhookLog.groupBy({
      by: ["status"],
      _count: { _all: true }
    })
  ]);
  const bookingRows: Array<Booking & { client: Client }> = recentBookings;
  const calendlyStatusCounts: Array<Pick<CalendlyWebhookLog, "status"> & { _count: { _all: number } }> = calendlyCounts;

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Dashboard" title="Operational overview" description="Track bookings, revenue, feedback, and testimonial approvals." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Clients", value: metrics.clients },
          { label: "Bookings", value: metrics.bookings },
          { label: "Revenue", value: metrics.revenue },
          { label: "Feedback", value: metrics.feedback },
          { label: "Testimonials", value: metrics.testimonials }
        ].map((item: { label: string; value: number }) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active products</p>
            <p className="mt-2 text-3xl font-semibold">{productCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {calendlyStatusCounts.map((item) => (
          <Card key={item.status}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Scheduling {item.status}</p>
              <p className="mt-2 text-3xl font-semibold">{item._count._all}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-border px-5 py-4">
            <p className="font-semibold">Recent bookings</p>
          </div>
          <div className="divide-y divide-border">
            {bookingRows.map((booking: Booking & { client: Client }) => (
              <div key={booking.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{booking.client.fullName}</p>
                  <p className="text-sm text-muted-foreground">{booking.client.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{booking.status}</Badge>
                  <Badge variant="outline">{booking.sessionType}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
