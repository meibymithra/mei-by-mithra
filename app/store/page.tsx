import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, Users } from "lucide-react";
import { getPublicProducts, getSiteSection } from "@/server/content";
import { playbookFaqs, productProfiles } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type StoreCopy = {
  eyebrow?: string;
  title?: string;
  description?: string;
  note?: string;
};

const purchaseSteps = [
  {
    title: "Choose the right playbook",
    text: "Each resource is framed around a real use case, not a generic product label.",
    icon: BookOpen
  },
  {
    title: "Pay by link or invoice",
    text: "Products can use direct payment links or a manual invoice workflow when needed.",
    icon: CreditCard
  },
  {
    title: "Use it independently or alongside support",
    text: "The store works as a stand-alone entry point or as follow-through after a session.",
    icon: Users
  }
];

export default async function StorePage() {
  const products = await getPublicProducts();
  const content = (await getSiteSection("store", {
    eyebrow: "Digital resources",
    title: "Practical playbooks for home, classroom, and growth",
    description:
      "Clear, usable guides for teachers, parents, and young people. Purchase by payment link or request a manual invoice if needed.",
    note: "All listings can be edited from the admin dashboard."
  })) as StoreCopy;

  return (
    <SiteShell ctaHref="/book">
      <main className="container-wide space-y-8 py-10 pb-24 md:pb-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_.9fr] lg:items-end">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title ?? "Practical playbooks"}
            description={content.description}
          />
          <div className="rounded-[2rem] border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {content.note}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {purchaseSteps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="surface">
                <CardContent className="space-y-4 p-6">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {products.map((product: any) => {
            const profile = productProfiles[product.slug as keyof typeof productProfiles];
            return (
              <Card key={product.slug} className="surface flex flex-col">
                <CardContent className="flex h-full flex-col space-y-4 p-6">
                  <div className="space-y-3">
                    <Badge variant="outline">{profile?.audience ?? product.slug}</Badge>
                    <h3 className="text-2xl font-semibold">{product.name}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{product.description}</p>
                  </div>
                  {profile ? (
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {profile.includes.map((item) => (
                        <li key={item} className="rounded-2xl border border-border bg-background px-4 py-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                    <p className="text-lg font-semibold">{formatCurrency(Number(product.price), product.currency ?? "INR")}</p>
                    <Button asChild>
                      <Link href={`/products/${product.slug}`}>
                        View details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Playbook FAQ"
            title="Questions people ask before buying"
            description="Each resource is designed around a specific use case, so the FAQs are grouped by audience."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {playbookFaqs.map((item) => (
              <Card key={item.type} className="surface">
                <CardContent className="space-y-3 p-6">
                  <Badge variant="outline">{item.type}</Badge>
                  <h3 className="text-xl font-semibold">{item.question}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
