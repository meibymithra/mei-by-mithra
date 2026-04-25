import { CalendlyEmbed } from "@/components/site/calendly-embed";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { schedule } from "@/lib/constants";

export default function BookPage() {
  const calendlyUrl =
    process.env.CAL_BOOKING_URL ??
    process.env.NEXT_PUBLIC_CAL_BOOKING_URL ??
    process.env.CALENDLY_EVENT_TYPE_URL ??
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "";

  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_.95fr] lg:items-end">
          <SectionHeading
            eyebrow="Booking"
            title="Choose a time that works"
            description="Pick a slot in your timezone and complete your booking. The intake form arrives by email automatically."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="surface">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Availability</p>
                <p className="text-sm leading-7">{schedule.weekdays}</p>
                <p className="text-sm leading-7">{schedule.sunday}</p>
              </CardContent>
            </Card>
            <Card className="surface">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timezone handling</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Cal.com should render in the visitor's local timezone while preserving Mithra's fixed India-based
                  availability.
                </p>
              </CardContent>
            </Card>
            <Card className="surface">
              <CardContent className="space-y-2 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">After booking</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  The intake form arrives by email, followed by invoicing or package details as needed.
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
