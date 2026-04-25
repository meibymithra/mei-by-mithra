import Link from "next/link";
import { BookOpen, CalendarDays, CircleDollarSign, Users } from "lucide-react";
import { getPublicFaqs, getSiteSection } from "@/server/content";
import { practicePageFallback } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { BrandScene } from "@/components/site/brand-scene";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PracticeCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  services?: { title: string; description: string }[];
  process?: string[];
};

const supportNotes = [
  {
    title: "Pre-booked sessions",
    text: "Sessions begin with booking first and intake second, so the public journey stays structured and calm.",
    icon: CalendarDays
  },
  {
    title: "Package support",
    text: "Clients may indicate interest in multiple sessions and session bundles can be invoiced accordingly.",
    icon: Users
  },
  {
    title: "Invoice-led payment",
    text: "The system supports payment links and manual invoicing rather than hard-coded checkout assumptions.",
    icon: CircleDollarSign
  },
  {
    title: "Store as support layer",
    text: "Playbooks exist for clients who need practical resources before, after, or instead of direct sessions.",
    icon: BookOpen
  }
];

export default async function PracticePage() {
  const [section, faqs] = await Promise.all([
    getSiteSection("practicePage", practicePageFallback),
    getPublicFaqs()
  ]);

  const content = section as PracticeCopy;

  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title ?? practicePageFallback.title}
            description={content.description ?? practicePageFallback.description}
          />
        </Reveal>

        <section className="grid gap-4 lg:grid-cols-3">
          {(content.services ?? practicePageFallback.services).map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <Card className="surface h-full">
                <CardContent className="space-y-4 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Service 0{index + 1}</p>
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-5 p-6">
                <SectionHeading
                  eyebrow="Process"
                  title="How the practice operates"
                  description="A transparent view of the workflow from booking through follow-up, so you understand each step."
                />
                <div className="space-y-3">
                  {(content.process ?? practicePageFallback.process).map((item, index) => (
                    <div key={item} className="flex gap-4 rounded-3xl border border-border bg-background p-4">
                      <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                      <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-4">
              <BrandScene variant="practice" />
              {supportNotes.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="surface">
                    <CardContent className="space-y-3 p-6">
                      <Icon className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-4 p-6">
                <SectionHeading
                  eyebrow="FAQ"
                  title="Practice questions"
                  description="Answers to questions about booking, packages, sessions, and how the practice actually works."
                />
                <div className="space-y-3">
                  {faqs.map((item: any) => (
                    <div key={item.question} className="rounded-3xl border border-border bg-background p-4">
                      <p className="font-medium">{item.question}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.12}>
            <Card className="surface overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="space-y-4 p-6">
                <SectionHeading
                  eyebrow="Ready"
                  title="Proceed to booking or start with a resource"
                  description="Choose your next step: reserve time with Mei, or explore a playbook to start now."
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary">
                    <Link href="/book">Book a Session</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/store">Browse Playbooks</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
