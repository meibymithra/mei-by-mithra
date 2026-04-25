import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SiteShell>
      <main className="container-wide flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">404</p>
        <h1 className="font-heading text-4xl font-semibold sm:text-5xl">This page doesn't exist.</h1>
        <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          The public site is organized into dedicated brand pages for About, Practice, Store, Booking, and Intake.
          Use one of the main routes below to continue.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">Open About</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </SiteShell>
  );
}
