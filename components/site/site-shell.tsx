import Link from "next/link";
import Image from "next/image";
import { brand, owner } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function SiteShell({
  children,
  ctaHref = "/book"
}: {
  children: React.ReactNode;
  ctaHref?: string;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/logomark.png" alt={`${brand.name} logo`} width={28} height={28} />
            <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">{owner.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/store" className="hidden text-sm font-medium sm:inline-flex">
              Playbooks
            </Link>
            <Button asChild>
              <Link href={ctaHref}>Book a Session</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-border/70 bg-card/70">
        <div className="container-wide flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{owner.summary}</p>
          <p>{brand.name}</p>
        </div>
      </footer>
    </div>
  );
}
