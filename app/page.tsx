import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Users
} from "lucide-react";
import { getPublicFaqs, getPublicTestimonials, getSiteSection } from "@/server/content";
import { brand, faqDefaults, homeBrandAudiences, homeBrandSignals, homeHeroFallback } from "@/lib/constants";
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
    title: "Meet Mithra",
    text: "Understand Mithra's voice, philosophy, and how the practice is positioned for sensitive, real-world work.",
    href: "/about",
    icon: Sparkles
  },
  {
    title: "Review credentials",
    text: "See work experience, academic grounding, facilitation background, and institutional credibility in one place.",
    href: "/portfolio",
    icon: GraduationCap
  },
  {
    title: "Understand the process",
    text: "See the services, booking model, intake flow, invoicing approach, and how packages are handled.",
    href: "/practice",
    icon: BriefcaseBusiness
  },
  {
    title: "Browse resources",
    text: "Explore digital playbooks for teachers, parents, children, and guided support use cases.",
    href: "/store",
    icon: BookOpen
  }
];

const ecosystemCards = [
  {
    title: "Book with clarity",
    text: "Cal.com handles scheduling in the visitor's local timezone while preserving Mithra's fixed India-based availability.",
    href: "/book",
    icon: CalendarDays
  },
  {
    title: "Begin with context",
    text: "The intake flow arrives after booking so the first conversation starts with useful, respectful context rather than paperwork up front.",
    href: "/terms",
    icon: HeartHandshake
  },
  {
    title: "Continue with support",
    text: "Sessions, packages, invoices, and playbooks sit inside one calm client journey rather than separate disconnected steps.",
    href: "/practice",
    icon: Users
  }
] as const;

export default async function HomePage() {
  const [hero, testimonials, faqs] = await Promise.all([
    getSiteSection("homeHero", homeHeroFallback),
    getPublicTestimonials(),
    getPublicFaqs()
  ]);

  const content = hero as HomeHeroCopy;
  const homepageFaqs = faqs.length ? faqs.slice(0, 3) : faqDefaults;
  const featuredTestimonials = testimonials.slice(0, 2);

  return (
    <SiteShell>
      <main className="overflow-hidden pb-24 md:pb-0">
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-hero-radial" />
          <div className="container-wide grid gap-10 py-12 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-20">
            <Reveal>
              <div className="space-y-7">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-background/70 backdrop-blur">
                    {brand.name}
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground">Counselling and education practice</Badge>
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
                  <Button asChild variant="ghost" size="lg" className="justify-start">
                    <Link href="/portfolio">
                      View Portfolio
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {homeBrandSignals.map((item) => (
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
            <div className="surface grid gap-6 rounded-[2rem] p-6 lg:grid-cols-[.82fr_1.18fr] lg:p-8">
              <div className="space-y-4">
                <SectionHeading
                  eyebrow="Who this is for"
                    title="A brand website built around real people and real contexts"
                  description="Mei by Mithra is not framed as a generic portfolio. It is designed to help visitors quickly understand whether the work fits their life, family, classroom, or institution."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {homeBrandAudiences.map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-border bg-background/80 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="container-wide py-8">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-4">
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
                          Explore
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
                  eyebrow="Brand proposition"
                  title="A public front door that explains the work before asking for trust"
                  description="The homepage is designed to convert without sounding transactional: direct enough to orient visitors, calm enough for sensitive work, and structured enough for serious review."
                />
                <div className="space-y-4">
                  {[
                    "Portrait-led storytelling that establishes Mithra rather than hiding behind generic wellness language",
                    "A dedicated portfolio page for experience, credentials, and institutional due diligence",
                    "Store, booking, intake, invoicing, and follow-through treated as one connected ecosystem"
                  ].map((item) => (
                    <div key={item} className="flex gap-3 rounded-3xl border border-border bg-background p-4">
                      <Sparkles className="mt-1 h-4 w-4 text-primary" />
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
                  eyebrow="Brand pillars"
                  title="Professional, composed, and human"
                  description="The visual and content system stays warm and grounded while avoiding startup polish, therapy-template sameness, or vague self-help language."
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
                  eyebrow="Service ecosystem"
                  title="A smoother path from discovery to actual support"
                  description="The public site introduces the brand, then moves visitors toward the right next step without forcing every detail into the first screen."
                />
                <div className="space-y-4">
                  {ecosystemCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-3xl border border-border bg-background p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <p className="font-medium">{item.title}</p>
                          </div>
                          <Link href={item.href} className="text-sm text-primary underline-offset-4 hover:underline">
                            Open
                          </Link>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                      </div>
                    );
                  })}
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
                  description="The homepage keeps this short. Deeper details still live on the dedicated practice, booking, and store pages."
                />
                <div className="space-y-3">
                  {homepageFaqs.map((item: any) => (
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
            <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
              <Card className="surface">
                <CardContent className="space-y-4 p-6">
                  <SectionHeading
                  eyebrow="Approved testimonials"
                  title="Trust stays moderated and human"
                  description="Testimonials remain review-led and never auto-published, preserving the seriousness and safety of the work."
                />
                  <div className="space-y-3">
                    {featuredTestimonials.length ? (
                      featuredTestimonials.map((item: any) => (
                        <div key={item.id} className="rounded-3xl border border-border bg-background p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-primary">{item.rating}/5</p>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.quote}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                        Public testimonials appear here only after explicit review and approval.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="surface">
                <CardContent className="space-y-4 p-6">
                  <SectionHeading
                  eyebrow="Conversion paths"
                  title="Three clear next steps"
                  description="Different visitors arrive with different needs, so the homepage gives them immediate direction."
                />
                  <div className="grid gap-3">
                    {[
                      "Book a session if you already know you want direct support.",
                      "Browse the store if you want practical resources before or alongside sessions.",
                      "Review the portfolio if you are assessing experience, collaboration fit, or institutional credibility."
                    ].map((item) => (
                      <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </section>

        <section className="container-wide py-8">
          <Reveal>
            <Card className="surface overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em]">Next step</p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Review the work, browse a playbook, or begin with booking.
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/portfolio">View Portfolio</Link>
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
