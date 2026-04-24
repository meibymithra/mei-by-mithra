import { CalendlyEmbed } from "@/components/site/calendly-embed";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";

export default function BookPage() {
  const calendlyUrl = process.env.CALENDLY_EVENT_TYPE_URL ?? process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10">
        <SectionHeading
          eyebrow="Booking"
          title="Choose a time that fits your day"
          description="Pick a slot in your timezone, book through Calendly, and you’ll receive the next-step email with intake and session details."
        />
        <CalendlyEmbed calendlyUrl={calendlyUrl} />
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
