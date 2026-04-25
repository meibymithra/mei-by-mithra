import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { getPublicFaqs, getPublicTestimonials, getSiteSection } from "@/server/content";
import { brand, homeHeroFallback } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { HeroVisual } from "@/components/site/hero-visual";
import { BrandScene } from "@/components/site/brand-scene";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type HomeHeroCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const pathwayCards = [
  {
    title: "About Mithra",
    text: "Professional background, qualifications, and the thinking behind the brand.",
    href: "/about",
    icon: GraduationCap
  },
  {
    title: "Practice",
    text: "Services, process, and the structure behind bookings, intake, and packages.",
    href: "/practice",
    icon: BriefcaseBusiness
  },
  {
    title: "Store",
    text: "Digital playbooks for teachers, parents, children, and guided support use cases.",
    href: "/store",
    icon: BookOpen
  }
];

export default async function HomePage() {
  const [hero, testimonials, faqs] = await Promise.all([
    getSiteSection("homeHero", homeHeroFallback),
    getPublicTestimonials(),
    getPublicFaqs()
  ]);

  const content = hero as HomeHeroCopy;

  return (
    <SiteShell>
      <main className="overflow-hidden pb-24 md:pb-0">
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-hero-radial" />
          <div className="container-wide grid gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
            <Reveal>
              <div className="space-y-7">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-background/70 backdrop-blur">
                    {brand.name}
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground">Professional brand website</Badge>
                </div>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{content.eyebrow}</p>
                  <h1 className="font-heading max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                    {content.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {content.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href={content.primaryCtaHref ?? homeHeroFallback.primaryCtaHref}>
                      {content.primaryCtaLabel ?? homeHeroFallback.primaryCtaLabel}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={content.secondaryCtaHref ?? homeHeroFallback.secondaryCtaHref}>
                      {content.secondaryCtaLabel ?? homeHeroFallback.secondaryCtaLabel}
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Brand-led public website",
                    "Intake-first service workflow",
                    "Invoice and playbook sales support"
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-background/80 p-4 text-sm leading-6">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        <section className="container-wide py-8">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-3">
              {pathwayCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="surface">
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">0{index + 1}</span>
                      </div>
                      <h2 className="text-2xl font-semibold">{item.title}</h2>
                      <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                      <Button asChild variant="ghost" className="justify-start px-0">
                        <Link href={item.href}>
                          Open page
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-5 p-6">
                <SectionHeading
                  eyebrow="Positioning"
                  title="A calmer, more credible public experience"
                  description="The website is structured to communicate authority, care, and clarity without defaulting to generic wellness language."
                />
                <div className="space-y-4">
                  {[
                    "Dedicated brand pages instead of overloading the homepage",
                    "Public messaging aligned to Mithra's actual background and work",
                    "Store, booking, intake, and feedback treated as one service ecosystem"
                  ].map((item) => (
                    <div key={item} className="flex gap-3 rounded-3xl border border-border bg-background p-4">
                      <ShieldCheck className="mt-1 h-4 w-4 text-primary" />
                      <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <BrandScene variant="home" />
              <Card className="surface">
                <CardContent className="space-y-5 p-6">
                  <SectionHeading
                    eyebrow="Brand tone"
                    title="Professional, composed, and human"
                    description="The visual and content system is designed to feel editorial and premium while remaining approachable enough for sensitive service journeys."
                  />
                  <div className="grid gap-3">
                    {["Rights", "Respect", "Responsibility", "Educate"].map((item) => (
                      <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm font-medium">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-4 p-6">
                <SectionHeading
                  eyebrow="Testimonials"
                  title="Client trust remains approval-led"
                  description="Only approved testimonials appear publicly. The feedback flow stays separate from testimonial publication."
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
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="surface">
              <CardContent className="space-y-4 p-6">
                <SectionHeading
                  eyebrow="FAQ"
                  title="Important questions answered early"
                  description="The homepage keeps this short. Deeper practice and store information now live on dedicated pages."
                />
                <div className="space-y-3">
                  {faqs.slice(0, 3).map((item: any) => (
                    <div key={item.question} className="rounded-3xl border border-border bg-background p-4">
                      <p className="font-medium">{item.question}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>

        <section className="container-wide py-8">
          <Reveal>
            <Card className="surface overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em]">Next step</p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Review the practice, explore the store, or begin with a booking.
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/practice">View Practice</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/book">Book a Session</Link>
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
