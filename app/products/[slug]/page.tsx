import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { contact, productDefaults, productProfiles } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type ProductView = {
  slug: string;
  name: string;
  description: string;
  price: number | string;
  currency?: string;
  paymentLink?: string | null;
  downloadUrl?: string | null;
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = ((await prisma.product.findUnique({ where: { slug } })) ??
    productDefaults.find((entry) => entry.slug === slug)) as ProductView | undefined;
  const profile = productProfiles[slug as keyof typeof productProfiles];

  if (!product) notFound();

  return (
    <SiteShell>
      <main className="container-wide py-10 pb-24 md:pb-10">
        <Card className="surface max-w-4xl">
          <CardContent className="space-y-6 p-6">
            <SectionHeading
              eyebrow="Playbook"
              title={product.name}
              description={`${product.description} This resource is positioned for immediate practical use, not generic inspiration.`}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</p>
                <p className="mt-2 text-xl font-semibold">{formatCurrency(Number(product.price), product.currency ?? "INR")}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Best for</p>
                <p className="mt-2 text-sm leading-6">{profile?.audience ?? "People looking for structured guidance"}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery</p>
                <p className="mt-2 text-sm leading-6">Secure payment followed by download access.</p>
              </div>
            </div>
            {profile ? (
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">What you get</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {profile.includes.map((item) => (
                    <div key={item} className="rounded-3xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              {product.paymentLink ? (
                <Button asChild>
                  <Link href={product.paymentLink} target="_blank">
                    Pay now
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`mailto:meibymithra@gmail.com?subject=${encodeURIComponent(`Request access to ${product.name}`)}`}>
                    Request access
                  </Link>
                </Button>
              )}
              {product.downloadUrl ? (
                <Button asChild variant="outline">
                  <Link href={product.downloadUrl} target="_blank">
                    View download
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/store">Back to store</Link>
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              If online payment is not available, request an invoice by writing to{" "}
              <Link href={`mailto:${contact.email}`} className="underline underline-offset-4">
                {contact.email}
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
