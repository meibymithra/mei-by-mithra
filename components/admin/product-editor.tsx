"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function ProductEditor({
  productId,
  initialSlug,
  initialName,
  initialDescription,
  initialPrice,
  initialCurrency,
  initialDownloadUrl,
  initialPaymentLink,
  initialProvider,
  initialActive
}: {
  productId: string;
  initialSlug?: string;
  initialName: string;
  initialDescription: string;
  initialPrice: string;
  initialCurrency: string;
  initialDownloadUrl: string | null;
  initialPaymentLink: string | null;
  initialProvider: string;
  initialActive?: boolean;
}) {
  const [slug] = useState(initialSlug ?? "");
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [price, setPrice] = useState(initialPrice);
  const [currency, setCurrency] = useState(initialCurrency);
  const [downloadUrl, setDownloadUrl] = useState(initialDownloadUrl ?? "");
  const [paymentLink, setPaymentLink] = useState(initialPaymentLink ?? "");
  const [provider, setProvider] = useState(initialProvider);
  const [active, setActive] = useState(initialActive ?? true);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
      <Input value={slug} disabled placeholder="Slug" />
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <div className="grid gap-3 md:grid-cols-2">
        <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" />
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </Select>
      </div>
      <Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="Download URL" />
      <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="Payment link" />
      <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="MANUAL">Manual</option>
        <option value="RAZORPAY">Razorpay</option>
        <option value="STRIPE">Stripe</option>
      </Select>
      <label className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              name,
              description,
              price: Number(price),
              currency,
              downloadUrl,
              paymentLink,
              provider,
              active
            })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Save product
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
