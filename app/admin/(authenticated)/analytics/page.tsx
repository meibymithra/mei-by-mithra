export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { getAdminMetrics } from "@/server/metrics";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, CalendarCheck, DollarSign, Star, Clock, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AnalyticsPage() {
  const metrics = await getAdminMetrics();
  const [bookings, clients, feedback, products, invoices] = await Promise.all([
    prisma.booking.findMany({
      where: { scheduledAt: { not: null } },
      orderBy: { scheduledAt: "desc" }
    }),
    prisma.client.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.feedback.findMany({ orderBy: { submittedAt: "desc" } }),
    prisma.product.findMany({ where: { active: true } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" } })
  ]);

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const avgRating = feedback.length > 0 
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : "0";

  const completedBookings = (bookings as any[]).filter(b => b.status === "COMPLETED" || b.status === "completed").length;
  const completionRate = bookings.length > 0 
    ? Math.round((completedBookings / bookings.length) * 100) 
    : 0;

  const monthlyBookings = new Map<string, number>();
  bookings.forEach(b => {
    if (b.scheduledAt) {
      const date = new Date(b.scheduledAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyBookings.set(key, (monthlyBookings.get(key) ?? 0) + 1);
    }
  });

  const recentMonths = Array.from(monthlyBookings.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6);

  const maxMonthlyBookings = Math.max(...recentMonths.map(([, count]) => count), 1);

  const analyticsCards = [
    { label: "Total Bookings", value: metrics.bookings, icon: CalendarCheck, color: "text-primary bg-primary/10" },
    { label: "Active Clients", value: metrics.clients, icon: Users, color: "text-sage bg-sage/10" },
    { label: "Total Revenue", value: formatCurrency(metrics.revenue), icon: DollarSign, color: "text-rust bg-rust/10" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-sand bg-sand/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading eyebrow="Analytics" title="Operational analytics" description="Track bookings, revenue, conversion, and popular time slots." />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Booking trends</p>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              {recentMonths.length > 0 ? (
                recentMonths.reverse().map(([month, count]) => {
                  const [year, m] = month.split("-");
                  const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleString("default", { month: "short" });
                  const width = (count / maxMonthlyBookings) * 100;
                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{monthName} {year}</span>
                        <span className="font-medium">{count} bookings</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No booking data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Popular time slots</p>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              {popularSlots.length > 0 ? (
                popularSlots.map(([slot, count], index) => {
                  const [day, hour] = slot.split("-").map(Number);
                  const time = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`;
                  return (
                    <div key={slot} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dayNames[day]}s</span>
                          <span className="text-xs text-muted-foreground">{time}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div 
                            className="h-full rounded-full bg-sage transition-all duration-500"
                            style={{ width: `${(count / popularSlots[0][1]) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No slot data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Completion rate</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{completionRate}%</p>
                <Badge variant={completionRate >= 70 ? "secondary" : "outline"} className="text-xs">
                  {completionRate >= 70 ? "Good" : "Needs attention"}
                </Badge>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{completedBookings} of {bookings.length} bookings completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Feedback score</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{avgRating}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(parseFloat(avgRating)) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Based on {feedback.length} reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Store performance</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{products.length}</p>
                <Badge variant="secondary" className="text-xs">Active products</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{invoices.length} total invoices generated</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
