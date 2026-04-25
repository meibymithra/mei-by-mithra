import { IntakeForm } from "@/components/forms/intake-form";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export default async function IntakePage({
  searchParams
}: {
  searchParams?: Promise<{ bookingId?: string; token?: string }>;
}) {
  const params = (await searchParams) ?? {};
  return (
    <SiteShell>
      <main className="container-wide grid gap-8 py-10 pb-24 lg:grid-cols-[.9fr_1.1fr] md:pb-10">
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Intake"
            title="Share the context before your session"
            description="This form helps tailor the conversation to you. It is required after booking and is stored securely for review."
          />
          <div className="grid gap-4">
            <Card className="surface">
              <CardContent className="space-y-2 p-5 text-sm leading-7 text-muted-foreground">
                <p className="font-medium text-foreground">What this covers</p>
                <p>Basic details, emergency contact, confidentiality, booking context, and whether the client wants a single session or a multi-session package.</p>
              </CardContent>
            </Card>
            <Card className="surface">
              <CardContent className="space-y-2 p-5 text-sm leading-7 text-muted-foreground">
                <p className="font-medium text-foreground">Why it matters</p>
                <p>Your answers reduce back-and-forth, support pre-booked sessions, and help admin prepare invoice or package follow-up where needed.</p>
              </CardContent>
            </Card>
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
