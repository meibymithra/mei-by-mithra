import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { brand, owner, schedule, sessionTypes } from "@/lib/constants";
import { getPublicFaqs, getPublicTestimonials } from "@/server/content";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { HeroVisual } from "@/components/site/hero-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  "Rights-forward, respect-led, responsibility-based",
  "Portfolio presentation with operational rigor",
  "Mobile-first booking and admin-managed delivery"
];

export default async function HomePage() {
  const testimonials = await getPublicTestimonials();
  const faqs = await getPublicFaqs();

  return (
    <SiteShell>
      <main className="overflow-hidden">
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-hero-radial" />
          <div className="container-wide grid gap-10 py-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-16">
            <div className="space-y-7">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/70 backdrop-blur">
                  Portfolio-cum-operations website
                </Badge>
                <Badge className="bg-primary text-primary-foreground">Confidential by design</Badge>
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                  {owner.role}
                </p>
                <h1
                  className="font-heading max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
                >
                  {owner.name}
                  <span className="block text-primary">with the operations layer behind the scenes.</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  A premium public presence for {brand.name}, built to feel like an editorial portfolio
                  and run like a real service business: booking, intake, invoicing, feedback, and content are
                  all handled through admin-controlled workflows.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/book">Book a Session</Link>
                </Button>
              <Button asChild variant="outline" size="lg">
                  <Link href="/store">View Playbooks</Link>
              </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {principles.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-3xl border border-border bg-background/80 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <HeroVisual />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Users, label: "Audience", value: "Parents, teachers, individuals" },
                  { icon: BriefcaseBusiness, label: "Ops model", value: "Admin-managed, no client login" },
                  { icon: BadgeCheck, label: "Trust signals", value: "Confidentiality, terms, review" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.label} className="surface">
                      <CardContent className="space-y-3 p-4">
                        <Icon className="h-5 w-5 text-primary" />
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium leading-6">{item.value}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide py-6">
          <div className="grid gap-4 rounded-[2rem] border border-border bg-card/80 p-4 sm:grid-cols-3">
            {[
              { label: "Booking window", value: schedule.weekdays },
              { label: "Sunday availability", value: schedule.sunday },
              { label: "Service surface", value: "Landing, booking, intake, feedback, playbooks" }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-background px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm font-semibold leading-6">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-wide space-y-8 py-8">
          <SectionHeading
            eyebrow="Services"
            title="Designed like a portfolio, operated like a service system"
            description="The public experience is calm and premium. The backend is structured for invoice-based delivery, admin approval, and content control."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "1:1 Sessions",
                desc: "Focused support with structured intake and clear next steps.",
                icon: Sparkles
              },
              {
                title: "Bulk Packages",
                desc: "Track credits, invoices, and session status from the admin dashboard.",
                icon: Star
              },
              {
                title: "Playbooks",
                desc: "Digital resources for teachers, parents, and kids with manual or link-based payment."
              }
            ].map((service) => {
              const Icon = service.icon ?? ArrowRight;
              return (
                <Card key={service.title} className="surface">
                  <CardContent className="space-y-4 p-6">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{service.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {sessionTypes.map((item, index) => (
              <Card key={item.value} className={index === 1 ? "surface bg-primary text-primary-foreground" : "surface"}>
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`text-sm leading-7 ${index === 1 ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                    {item.priceHint}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[1.05fr_.95fr]">
          <Card className="surface">
            <CardContent className="space-y-5 p-6">
              <SectionHeading
                eyebrow="Experience"
                title="The site should feel like a finished brand, not a template"
                description="Visual rhythm, elevated typography, and a careful use of the brand palette keep the interface grounded and memorable."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Warm cream backgrounds with rust-red accents",
                  "Editorial spacing and calm motion",
                  "No clutter, no dashboard feel on the public side",
                  "Trust-first language and confidentiality cues"
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardContent className="space-y-5 p-6">
              <SectionHeading
                eyebrow="Process"
                title="Three-step flow"
                description="A user should move from curiosity to booking in a minimal number of taps."
              />
              <div className="space-y-4">
                {[
                  { step: "01", title: "Book", text: "Open Calendly and choose a slot in local timezone." },
                  { step: "02", title: "Complete intake", text: "Submit the structured form from the automatic email or redirect." },
                  { step: "03", title: "Receive service", text: "Admin sends invoice, feedback link, and follow-up emails." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-3xl border border-border bg-background p-4">
                    <div className="text-sm font-semibold text-primary">{item.step}</div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[.9fr_1.1fr]">
          <Card className="surface">
            <CardContent className="space-y-4 p-6">
              <SectionHeading
                eyebrow="Testimonials"
                title="Dynamic proof"
                description="Approved testimonials are rendered from the database and can be edited before publishing."
              />
              <div className="space-y-4">
                {testimonials.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="rounded-3xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-primary">{item.rating}/5</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.quote}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="surface">
            <CardContent className="space-y-4 p-6">
              <SectionHeading
                eyebrow="FAQ"
                title="Questions answered before booking"
                description="Keep the first interaction clean: clarity now, fewer emails later."
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
        </section>

        <section className="container-wide py-8">
          <Card className="surface overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em]">Ready to present and operate</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {owner.name} with a system that behaves like a real business.
                </h2>
              </div>
              <Button asChild variant="secondary" size="lg">
                <Link href="/book">Book a Session</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
