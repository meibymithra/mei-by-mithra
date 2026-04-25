import Link from "next/link";
import { ArrowRight, Award, BriefcaseBusiness, Download, GraduationCap, Landmark, Sparkles } from "lucide-react";
import { getSiteSection } from "@/server/content";
import { contact, portfolioPageFallback } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { BrandScene } from "@/components/site/brand-scene";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PortfolioCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  summary?: string;
  experience?: {
    role: string;
    period: string;
    organisation: string;
    location: string;
    points: string[];
  }[];
  education?: string[];
  certifications?: string[];
  leadership?: string[];
};

const proofCards = [
  {
    title: "Practice + education",
    description: "A portfolio that combines one-to-one support work with classroom, college, and community facilitation.",
    icon: BriefcaseBusiness
  },
  {
    title: "Formal grounding",
    description: "Academic training and continuing learning in counselling, facilitation, and emotionally safe communication.",
    icon: GraduationCap
  },
  {
    title: "Institution-ready presence",
    description: "Suitable for individual clients as well as schools, colleges, and collaborative partnerships.",
    icon: Landmark
  }
];

export default async function PortfolioPage() {
  const content = (await getSiteSection("portfolioPage", portfolioPageFallback)) as PortfolioCopy;

  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <Reveal>
            <div className="space-y-6">
              <SectionHeading
                eyebrow={content.eyebrow ?? portfolioPageFallback.eyebrow}
                title={content.title ?? portfolioPageFallback.title}
                description={content.description ?? portfolioPageFallback.description}
              />
              <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
                {content.summary ?? portfolioPageFallback.summary}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/book">Book a Session</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={contact.resumeUrl} target="_blank">
                    <Download className="h-4 w-4" />
                    Download Resume
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <BrandScene variant="about" />
          </Reveal>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {proofCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <Card className="surface h-full">
                  <CardContent className="space-y-4 p-6">
                    <Icon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-5 p-6">
                <SectionHeading
                  eyebrow="Experience"
                  title="Selected roles"
                  description="This page carries the professional depth so the homepage can stay focused on brand, trust, and conversion."
                />
                <div className="space-y-4">
                  {(content.experience ?? portfolioPageFallback.experience).map((item) => (
                    <div key={`${item.role}-${item.period}`} className="rounded-[1.75rem] border border-border bg-background p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{item.role}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.organisation} - {item.location}
                          </p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-primary">{item.period}</p>
                      </div>
                      <div className="mt-4 grid gap-3">
                        {item.points.map((point) => (
                          <div key={point} className="rounded-2xl border border-border/80 bg-card/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-4">
              <Card className="surface">
                <CardContent className="space-y-4 p-6">
                  <SectionHeading
                    eyebrow="Education"
                    title="Academic background"
                    description="Formal study supporting counselling, facilitation, and care-centered communication."
                  />
                  <div className="space-y-3">
                    {(content.education ?? portfolioPageFallback.education).map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="surface">
                <CardContent className="space-y-4 p-6">
                  <SectionHeading
                    eyebrow="Training"
                    title="Selected certifications"
                    description="Continuing learning that strengthens both direct practice and educational facilitation."
                  />
                  <div className="space-y-3">
                    {(content.certifications ?? portfolioPageFallback.certifications).map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="surface">
                <CardContent className="space-y-4 p-6">
                  <Award className="h-5 w-5 text-primary" />
                  <SectionHeading
                    eyebrow="Leadership"
                    title="Student and editorial roles"
                    description="Selected leadership experiences that reflect initiative, voice, and communication responsibility."
                  />
                  <div className="space-y-3">
                    {(content.leadership ?? portfolioPageFallback.leadership).map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </section>

        <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <Card className="surface overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="space-y-4 p-6">
                <Sparkles className="h-5 w-5" />
                <SectionHeading
                  eyebrow="Brand fit"
                  title="Portfolio depth without losing the warmth of the public experience"
                  description="The portfolio is here for due diligence, institutional review, and trust. The rest of the site can stay grounded, calm, and people-first."
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary">
                    <Link href="/about">Read the brand story</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/practice">
                      View Practice
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
