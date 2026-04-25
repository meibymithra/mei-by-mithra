import { FeedbackForm } from "@/components/forms/feedback-form";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <SiteShell>
      <main className="container-wide grid gap-8 py-10 pb-24 lg:grid-cols-[.9fr_1.1fr] md:pb-10">
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Feedback"
            title="Tell us what the experience was like"
            description="This is a short feedback form with open-ended questions. Testimonials are never auto-published and are only considered after moderation."
          />
          <div className="rounded-[1.75rem] border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            By submitting, you confirm the feedback is truthful, suitable for moderation, and subject to the site's
            testimonial terms.
          </div>
        </div>
        <div className="surface rounded-3xl p-6">
          <FeedbackForm token={token} />
        </div>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
