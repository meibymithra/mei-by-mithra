import { FeedbackForm } from "@/components/forms/feedback-form";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <SiteShell>
      <main className="container-wide grid gap-8 py-10 lg:grid-cols-[.9fr_1.1fr]">
        <SectionHeading
          eyebrow="Feedback"
          title="Tell us how the session went"
          description="Post-session feedback can be turned into a testimonial only after admin approval."
        />
        <div className="surface rounded-3xl p-6">
          <FeedbackForm token={token} />
        </div>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
