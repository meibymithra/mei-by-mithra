import Link from "next/link";
import Image from "next/image";
import { brand, owner } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { BrandAtmosphere } from "@/components/site/brand-atmosphere";

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
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logomark.png" alt={`${brand.name} logo`} width={28} height={28} />
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-primary">{owner.name}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{brand.name}</span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/portfolio" className="transition-colors hover:text-foreground">
                Portfolio
              </Link>
              <Link href="/practice" className="transition-colors hover:text-foreground">
                Practice
              </Link>
              <Link href="/store" className="transition-colors hover:text-foreground">
                Store
              </Link>
              <Link href="/book" className="transition-colors hover:text-foreground">
                Book
              </Link>
            </nav>
            <Link href="/portfolio" className="hidden text-sm font-medium sm:inline-flex lg:hidden">
              Portfolio
            </Link>
            <Button asChild>
              <Link href={ctaHref}>Book a Session</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
