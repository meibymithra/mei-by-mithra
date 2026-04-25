export const dynamic = 'force-dynamic';

import type { Product } from "@prisma/client";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContentEditor } from "@/components/admin/content-editor";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function CmsPage() {
  const [faqs, homeHero, aboutPage, practicePage, products] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "faqs" } }),
    prisma.siteContent.findUnique({ where: { key: "homeHero" } }),
    prisma.siteContent.findUnique({ where: { key: "aboutPage" } }),
    prisma.siteContent.findUnique({ where: { key: "practicePage" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="CMS"
        title="Content management"
        description="Edit homepage, About page, Practice page, FAQs, and playbook listings from the admin dashboard."
      />
      <div className="grid gap-4">
        <ContentEditor
          contentKey="homeHero"
          title="Homepage hero"
          initialTitle={homeHero?.title ?? "Homepage Hero"}
          initialContent={JSON.stringify(
            homeHero?.content ?? {
              eyebrow: "Mithra Krishnamoorthy",
              title: "A professional brand website for counselling, sexuality education, and practical support.",
              description:
                "Mei by Mithra presents Mithra Krishnamoorthy's practice, portfolio, and digital resources through a calm, premium experience designed for individuals, parents, educators, and institutions.",
              primaryCtaLabel: "Book a Session",
              primaryCtaHref: "/book",
              secondaryCtaLabel: "Explore the Store",
              secondaryCtaHref: "/store"
            },
            null,
            2
          )}
        />
        <ContentEditor
          contentKey="aboutPage"
          title="About page"
          initialTitle={aboutPage?.title ?? "About Page"}
          initialContent={JSON.stringify(
            aboutPage?.content ?? {
              eyebrow: "About",
              title: "Mithra Krishnamoorthy",
              description:
                "Mithra Krishnamoorthy works across counselling psychology, sexuality education, facilitation, and practical support design. Her work combines academic grounding with human-centered clarity.",
              highlights: [],
              narrative: ""
            },
            null,
            2
          )}
        />
        <ContentEditor
          contentKey="practicePage"
          title="Practice page"
          initialTitle={practicePage?.title ?? "Practice Page"}
          initialContent={JSON.stringify(
            practicePage?.content ?? {
              eyebrow: "Practice",
              title: "Practice areas and service design",
              description:
                "The practice combines one-to-one support, educational facilitation, and digital resources. Each offering is meant to be useful, direct, and appropriate to the client's context.",
              services: [],
              process: []
            },
            null,
            2
          )}
        />
        <ContentEditor
          contentKey="faqs"
          title="FAQs"
          initialTitle={faqs?.title ?? "FAQs"}
          initialContent={JSON.stringify(faqs?.content ?? [], null, 2)}
        />
      </div>
      <Card>
        <CardContent className="space-y-3">
          <p className="font-medium">Playbooks</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {products.map((product: Product) => (
              <ProductEditor
                key={product.id}
                productId={product.id}
                initialName={product.name}
                initialDescription={product.description}
                initialPrice={String(product.price)}
                initialCurrency={product.currency}
                initialDownloadUrl={product.downloadUrl}
                initialPaymentLink={product.paymentLink}
                initialProvider={product.provider}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
