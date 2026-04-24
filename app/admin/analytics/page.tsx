import { prisma } from "@/server/db";
import { getAdminMetrics } from "@/server/metrics";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const metrics = await getAdminMetrics();
  const bookings = await prisma.booking.findMany({
    select: { scheduledAt: true },
    where: { scheduledAt: { not: null } }
  });

  const slotMap = new Map<string, number>();
  for (const booking of bookings) {
    if (!booking.scheduledAt) continue;
    const date = new Date(booking.scheduledAt);
    const key = `${date.getDay()}-${date.getHours()}`;
    slotMap.set(key, (slotMap.get(key) ?? 0) + 1);
  }

  const popularSlots = Array.from(slotMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Analytics" title="Operational analytics" description="Track bookings, revenue, conversion, and popular time slots." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Bookings</p><p className="mt-2 text-3xl font-semibold">{metrics.bookings}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Revenue</p><p className="mt-2 text-3xl font-semibold">{metrics.revenue}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Clients</p><p className="mt-2 text-3xl font-semibold">{metrics.clients}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Published testimonials</p><p className="mt-2 text-3xl font-semibold">{metrics.testimonials}</p></CardContent></Card>
      </div>
      <Card>
        <CardContent className="space-y-3 p-5">
          <p className="font-semibold">Popular slots</p>
          {popularSlots.length ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {popularSlots.map(([slot, count]) => (
                <li key={slot}>
                  {slot}: {count}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No booked slots yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
