export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContentEditor } from "@/components/admin/content-editor";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function CmsPage() {
  const [faqs, hero, services, products] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "faqs" } }),
    prisma.siteContent.findUnique({ where: { key: "hero" } }),
    prisma.siteContent.findUnique({ where: { key: "services" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="CMS" title="Content management" description="Edit FAQs, hero content, service blocks, and playbook listings." />
      <div className="grid gap-4">
        <ContentEditor
          contentKey="hero"
          title="Hero"
          initialTitle={hero?.title ?? "Hero"}
          initialContent={JSON.stringify(hero?.content ?? { heading: "Structured support", description: "Premium coaching workflows." }, null, 2)}
        />
        <ContentEditor
          contentKey="faqs"
          title="FAQs"
          initialTitle={faqs?.title ?? "FAQs"}
          initialContent={JSON.stringify(faqs?.content ?? [], null, 2)}
        />
        <ContentEditor
          contentKey="services"
          title="Services"
          initialTitle={services?.title ?? "Services"}
          initialContent={JSON.stringify(services?.content ?? [], null, 2)}
        />
      </div>
      <Card>
        <CardContent className="space-y-3">
          <p className="font-medium">Playbooks</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {products.map((product) => (
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
