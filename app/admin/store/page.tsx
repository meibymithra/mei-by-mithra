export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContentEditor } from "@/components/admin/content-editor";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function AdminStorePage() {
  const [store, products] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "store" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Store"
        title="Store management"
        description="Edit the storefront copy and every product listing from the admin dashboard."
      />
      <ContentEditor
        contentKey="store"
        title="Store copy"
        initialTitle={store?.title ?? "Store"}
        initialContent={JSON.stringify(
          store?.content ?? {
            eyebrow: "Digital store",
            title: "Playbooks and resources",
            description: "Admin-managed digital products.",
            note: "Store content is editable from the admin dashboard."
          },
          null,
          2
        )}
      />
      <Card>
        <CardContent className="space-y-4">
          <p className="font-medium">Create product</p>
          <ProductCreateForm />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <p className="font-medium">Products</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {products.map((product) => (
              <ProductEditor
                key={product.id}
                productId={product.id}
                initialSlug={product.slug}
                initialName={product.name}
                initialDescription={product.description}
                initialPrice={String(product.price)}
                initialCurrency={product.currency}
                initialDownloadUrl={product.downloadUrl}
                initialPaymentLink={product.paymentLink}
                initialProvider={product.provider}
                initialActive={product.active}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
