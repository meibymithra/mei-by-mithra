import Link from "next/link";
import { brand } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/80">
      <div className="container-wide grid gap-6 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="font-semibold text-foreground">{brand.name}</p>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Calm, confidential support for parenting, teaching, relationships, and personal growth.
          </p>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="font-medium text-foreground">Pages</p>
          <Link className="block" href="/book">Book</Link>
          <Link className="block" href="/intake">Intake</Link>
          <Link className="block" href="/store">Store</Link>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="font-medium text-foreground">Admin</p>
          <Link className="block" href="/admin">Dashboard</Link>
          <Link className="block" href="/admin/login">Login</Link>
        </div>
      </div>
    </footer>
  );
}
