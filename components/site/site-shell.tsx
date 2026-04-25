"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <BrandAtmosphere />
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="container-wide flex min-h-16 items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">M</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-primary">{owner.name}</span>
              <span className="hidden text-xs text-muted-foreground lg:block">{brand.tagline}</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex lg:gap-5">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button asChild className="hidden sm:inline-flex">
              <Link href={ctaHref}>Book a Session</Link>
            </Button>
            <button
              className="flex items-center justify-center rounded-full border border-border bg-background/80 p-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="container-wide animate-in slide-in-from-top-2 pb-4 md:hidden">
            <nav className="grid gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-border bg-background/90 px-4 py-3 text-sm font-medium transition-colors hover:bg-background"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Book a Session
              </Link>
            </nav>
          </div>
        )}
      </header>
      {children}
    </div>
  );
}