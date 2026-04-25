import Link from "next/link";
import Image from "next/image";
import { brand, owner } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { BrandAtmosphere } from "@/components/site/brand-atmosphere";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/practice", label: "Practice" },
  { href: "/store", label: "Store" },
  { href: "/book", label: "Book" }
] as const;

export function SiteShell({
  children,
  ctaHref = "/book"
}: {
  children: React.ReactNode;
  ctaHref?: string;
}) {
  return (
    <div className="min-h-screen">
      <BrandAtmosphere />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container-wide flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logomark.png" alt={`${brand.name} logo`} width={28} height={28} />
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-primary">{owner.name}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{brand.tagline}</span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/portfolio" className="hidden text-sm font-medium sm:inline-flex lg:hidden">
              Portfolio
            </Link>
            <Button asChild>
              <Link href={ctaHref}>Book a Session</Link>
            </Button>
          </div>
        </div>
        <div className="container-wide pb-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto text-sm text-muted-foreground">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-background/80 px-3 py-2 whitespace-nowrap transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
