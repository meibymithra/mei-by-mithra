import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { brand, owner, schedule } from "@/lib/constants";
import { getPublicFaqs, getPublicTestimonials } from "@/server/content";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { HeroVisual } from "@/components/site/hero-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const supportAreas = [
  {
    title: "Emotional regulation",
    text: "For moments when stress, overwhelm, or difficult patterns keep repeating.",
    icon: Sparkles
  },
  {
    title: "Parenting support",
    text: "For clearer routines, boundaries, and a steadier home atmosphere.",
    icon: Star
  },
  {
    title: "Relationship clarity",
    text: "For communication, boundaries, and making sense of what you need.",
    icon: BookOpen
  },
  {
    title: "Sexuality and body literacy",
    text: "For respectful, practical guidance that reduces shame and confusion.",
    icon: HeartHandshake
  }
];

const processSteps = [
  {
    step: "01",
    title: "Choose a time",
    text: "Book through Calendly in your local timezone. The available slots are designed to keep the process simple."
  },
  {
    step: "02",
    title: "Complete intake",
    text: "You'll receive a structured form so the session can be tailored to your context before you meet."
  },
  {
    step: "03",
    title: "Receive support",
    text: "After review, the next step is confirmed by email, whether that's a session, package, or playbook."
  }
];

const trustSignals = [
  "MSc in Counselling Psychology",
  "Sex educator with 10+ institutions",
  "Tools drawn from DBT, TA, mindfulness, and positive psychology",
  "Confidential intake and review-led follow-up"
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
                  {brand.name}
                </Badge>
                <Badge className="bg-primary text-primary-foreground">{brand.tagline}</Badge>
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{owner.role}</p>
                <h1 className="font-heading max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Calm, confidential support
                  <span className="block text-primary">for the conversations that shape everyday life.</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {owner.name} brings counselling psychology, sexuality education, and practical facilitation together
                  in one grounded experience for parents, teachers, individuals, and young people seeking clarity.
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
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {trustSignals.map((item) => (
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
                  { icon: Users, label: "Who it serves", value: "Parents, teachers, adults, and young people" },
                  { icon: BadgeCheck, label: "Practice style", value: "Structured, respectful, and culturally aware" },
                  { icon: HeartHandshake, label: "What it feels like", value: "Calm, direct, and easy to act on" }
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
              { label: "Format", value: "1:1 sessions, packages, and digital playbooks" }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-background px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm font-semibold leading-6">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-wide grid gap-8 py-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3">
            <Image
              src="/showcase/portrait-2.jpg"
              alt="Mithra portrait"
              width={1100}
              height={1400}
              className="h-full w-full rounded-[1.5rem] object-cover"
              priority
            />
          </div>
          <div className="space-y-6">
            <SectionHeading
              eyebrow="About Mithra"
              title="A human-first practice with a strong academic base"
              description={owner.summary}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "MSc in Counselling Psychology from Madras School of Social Work",
                "BSc in Psychology from PSG College of Arts & Science",
                "Facilitates comprehensive sexuality education across schools and colleges",
                "Uses Transactional Analysis, mindfulness, DBT, and positive psychology"
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              The tone is calm, direct, and non-judgmental. The format is structured enough to be useful, but personal
              enough to feel human.
            </p>
          </div>
        </section>

        <section className="container-wide space-y-8 py-8">
          <SectionHeading
            eyebrow="Support"
            title="What people usually come here for"
            description="Focused support for the real issues people bring to a first conversation."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {supportAreas.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="surface">
                  <CardContent className="space-y-4 p-6">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{service.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[1.05fr_.95fr]">
          <Card className="surface">
            <CardContent className="space-y-5 p-6">
              <SectionHeading
                eyebrow="How it works"
                title="A simple three-step flow"
                description="Minimal friction, clear next steps, and no unnecessary back-and-forth."
              />
              <div className="space-y-4">
                {processSteps.map((item) => (
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
          <Card className="surface">
            <CardContent className="space-y-5 p-6">
              <SectionHeading
                eyebrow="Why it feels different"
                title="Designed to be calm, clear, and grounded"
                description="The website uses warm earth tones, editorial spacing, and portrait-led storytelling so the brand feels human."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Warm cream backgrounds and rust-red accents",
                  "Soft, readable typography with strong hierarchy",
                  "Confidentiality and terms are visible from the first interaction",
                  "Digital resources are available when a session is not the right fit"
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container-wide grid gap-6 py-8 lg:grid-cols-[.95fr_1.05fr]">
          <Card className="surface">
            <CardContent className="space-y-4 p-6">
              <SectionHeading
                eyebrow="Testimonials"
                title="Real proof, approved before publishing"
                description="Testimonials are pulled from the database and only shown when they have been approved."
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
                description="Clear answers upfront reduce friction and help people know what to expect."
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
                <p className="text-sm uppercase tracking-[0.2em]">Ready when you are</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  Book a session or explore the playbooks if you want to start gently.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/book">Book a Session</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/store">View Playbooks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
