import { IntakeForm } from "@/components/forms/intake-form";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";

export default async function IntakePage({
  searchParams
}: {
  searchParams?: Promise<{ bookingId?: string; token?: string }>;
}) {
  const params = (await searchParams) ?? {};
  return (
    <SiteShell>
      <main className="container-wide grid gap-8 py-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Intake"
            title="Share the context before your session"
            description="This form is required after booking or through the email link. It is stored in PostgreSQL and routed to admin email."
          />
          <div className="rounded-3xl border border-border bg-card p-6 text-sm leading-7 text-muted-foreground">
            Your answers help structure the session and reduce back-and-forth.
          </div>
        </div>
        <div className="surface rounded-3xl p-6">
          <IntakeForm bookingId={params.bookingId} token={params.token} />
        </div>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
