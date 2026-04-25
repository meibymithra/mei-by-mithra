import { CalendlyEmbed } from "@/components/site/calendly-embed";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export default function BookPage() {
  const calendlyUrl = process.env.CALENDLY_EVENT_TYPE_URL ?? process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_.95fr] lg:items-end">
          <SectionHeading
            eyebrow="Booking"
            title="Choose a time that fits your day"
            description="Pick a slot in your timezone, book through Calendly, and you'll receive the next-step email with intake and session details."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="surface">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Availability</p>
                <p className="text-sm leading-7">Mon-Sat 7:30 PM - 8:30 PM IST</p>
                <p className="text-sm leading-7">Sunday 8:30 AM - 8:30 PM IST</p>
              </CardContent>
            </Card>
            <Card className="surface">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">For Indians abroad</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Calendly should render in the visitor's local timezone while preserving Mithra's fixed India-based
                  availability.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <CalendlyEmbed calendlyUrl={calendlyUrl} />
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
