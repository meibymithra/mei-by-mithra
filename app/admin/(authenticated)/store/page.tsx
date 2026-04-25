export const dynamic = 'force-dynamic';

import type { Product } from "@prisma/client";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentEditor } from "@/components/admin/content-editor";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { ProductEditor } from "@/components/admin/product-editor";
import { Store, Package, Eye, EyeOff, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminStorePage() {
  const [store, products] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "store" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  const activeProducts = products.filter((p: Product) => p.active);
  const inactiveProducts = products.filter((p: Product) => !p.active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading
          eyebrow="Store"
          title="Store management"
          description="Edit the storefront copy and every product listing from the admin dashboard."
        />
        <Badge variant="secondary" className="w-fit">{products.length} products</Badge>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-xs text-muted-foreground">Total products</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/30 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-sage/10 p-3">
              <Eye className="h-5 w-5 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProducts.length}</p>
              <p className="text-xs text-muted-foreground">Active (visible)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted-foreground/30 bg-muted/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-muted p-3">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inactiveProducts.length}</p>
              <p className="text-xs text-muted-foreground">Inactive (hidden)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Store className="h-4 w-4 text-muted-foreground" />
            Storefront copy
          </p>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Create product</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ProductCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Products</p>
            </div>
            <Badge variant="outline">{products.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {products.map((product: Product) => (
              <div key={product.id} className={`rounded-xl border p-4 transition-all ${product.active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"}`}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge variant={product.active ? "secondary" : "outline"} className="text-xs">
                        {product.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(Number(product.price), product.currency ?? "INR")}
                  </p>
                </div>
                <ProductEditor
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
