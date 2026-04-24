import Link from "next/link";
import { getPublicProducts, getSiteSection } from "@/server/content";
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
      <main className="container-wide space-y-8 py-10">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title ?? "Practical playbooks"}
          description={content.description}
        />
        <div className="rounded-[2rem] border border-border bg-card p-5 text-sm text-muted-foreground">
          {content.note}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product.slug} className="surface">
              <CardContent className="space-y-4 p-6">
                <Badge variant="outline">{product.slug}</Badge>
                <h3 className="text-2xl font-semibold">{product.name}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{product.description}</p>
                <p className="text-lg font-semibold">{formatCurrency(Number(product.price), product.currency ?? "INR")}</p>
                <Button asChild className="w-full">
                  <Link href={`/products/${product.slug}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
