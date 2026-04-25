import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const terms = [
  {
    title: "Pre-booking and intake",
    text: "Sessions are scheduled through pre-booking. After a booking is made, the first intake form is sent automatically by email and should be completed before the session."
  },
  {
    title: "Packages and session credits",
    text: "Clients may request multiple sessions. Package size can be indicated in intake and is confirmed through the invoice or admin workflow."
  },
  {
    title: "Confidentiality",
    text: "Personal information is used only for service delivery, scheduling, safeguarding, and operational follow-up. This site is not an emergency service."
  },
  {
    title: "Feedback and testimonials",
    text: "Feedback can include open-ended responses and a short testimonial suggestion. Publication is always moderated and never automatic."
  },
  {
    title: "Payments",
    text: "Payments can be handled through invoice links or manual invoicing, depending on the service and client context."
  }
];

export default function TermsPage() {
  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <SectionHeading
          eyebrow="Terms"
          title="Service terms and operating notes"
          description="This page sets expectations for bookings, intake, confidentiality, packages, feedback, and invoice-based payment."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {terms.map((item) => (
            <Card key={item.title} className="surface">
              <CardContent className="space-y-3 p-6">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </SiteShell>
  );
}
