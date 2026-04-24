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
          title="Choose a time that fits your schedule"
          description="Calendly is embedded directly here. Booking triggers the backend webhook so intake and admin workflows can follow automatically."
        />
        <CalendlyEmbed calendlyUrl={calendlyUrl} />
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
