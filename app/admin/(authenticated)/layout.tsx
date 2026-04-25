import Link from "next/link";
import { brand } from "@/lib/constants";
import { requireAdmin } from "@/server/auth";
import { Separator } from "@/components/ui/separator";

export const dynamic = 'force-dynamic';

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/store", label: "Store" },
  { href: "/admin/calendly", label: "Scheduling" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/email-templates", label: "Email templates" },
  { href: "/admin/analytics", label: "Analytics" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-border bg-card/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{brand.name}</p>
          <h1 className="mt-2 text-xl font-semibold">{brand.name} Admin</h1>
          <Separator className="my-4" />
          <nav className="space-y-2 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-2xl px-3 py-2 hover:bg-muted">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
