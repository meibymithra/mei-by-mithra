import Image from "next/image";
import Link from "next/link";
import { Award, Download, GraduationCap, HandHeart, Sparkles } from "lucide-react";
import { getSiteSection } from "@/server/content";
import { aboutPageFallback, contact } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { BrandScene } from "@/components/site/brand-scene";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AboutCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  highlights?: string[];
  narrative?: string;
};

const values = [
  { title: "Professional grounding", text: "A public practice backed by formal training, facilitation experience, and structured care.", icon: GraduationCap },
  { title: "Human sensitivity", text: "The tone remains warm, direct, and suitable for emotionally complex conversations.", icon: HandHeart },
  { title: "Quiet distinction", text: "The work is presented with enough polish to feel premium without becoming performative.", icon: Sparkles }
];

export default async function AboutPage() {
  const content = (await getSiteSection("aboutPage", aboutPageFallback)) as AboutCopy;

  return (
    <SiteShell>
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <section className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3">
              <Image
                src="/showcase/portrait-3.jpg"
                alt="Mithra Krishnamoorthy portrait"
                width={1100}
                height={1400}
                className="h-full w-full rounded-[1.5rem] object-cover"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title ?? aboutPageFallback.title}
                description={content.description ?? aboutPageFallback.description}
              />
              <p className="text-sm leading-8 text-muted-foreground">{content.narrative ?? aboutPageFallback.narrative}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/portfolio">
                    View Portfolio
                  </Link>
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
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <Card className="surface">
              <CardContent className="space-y-4 p-6">
                <SectionHeading
                  eyebrow="Credentials"
                  title="Selected qualifications and experience"
                  description="Lean into the training, roles, and service history that shape Mei’s grounded, thoughtful approach."
                />
                <div className="space-y-3">
                  {(content.highlights ?? aboutPageFallback.highlights).map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-4">
              <BrandScene variant="about" />
              {values.map((item) => {
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
              <Card className="surface">
                <CardContent className="space-y-3 p-6">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Brand intent</h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Mei by Mithra is built to represent a serious practice with a distinctive visual identity. It should
                    feel finished, trustworthy, and appropriate for both private clients and institutional audiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
