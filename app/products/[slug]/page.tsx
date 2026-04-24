import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { productDefaults } from "@/lib/constants";
import { SiteShell } from "@/components/site/site-shell";
import { Footer } from "@/components/site/footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { brand } from "@/lib/constants";

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

  if (!product) notFound();

  return (
    <SiteShell>
      <main className="container-wide py-10">
        <Card className="surface max-w-3xl">
          <CardContent className="space-y-6 p-6">
            <SectionHeading eyebrow="Playbook" title={product.name} description={product.description} />
            <p className="text-xl font-semibold">{formatCurrency(Number(product.price), product.currency ?? "INR")}</p>
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
              Admin can confirm payment and send the download link via email after verification. If online payment is not available, contact {brand.name} support for a manual link.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <StickyCta />
    </SiteShell>
  );
}
