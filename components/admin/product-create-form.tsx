"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function ProductCreateForm() {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("INR");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [provider, setProvider] = useState("MANUAL");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
      <p className="font-medium">Create new product</p>
      <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
      <div className="grid gap-3 md:grid-cols-2">
        <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="price" />
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </Select>
      </div>
      <Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="download url" />
      <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="payment link" />
      <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="MANUAL">Manual</option>
        <option value="RAZORPAY">Razorpay</option>
        <option value="STRIPE">Stripe</option>
      </Select>
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch("/api/admin/products", {
            method: "POST",
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
              active: true
            })
          });
          const data = await response.json();
          setMessage(response.ok ? `Created ${data.product?.slug ?? ""}` : data.error ?? "Failed");
        }}
      >
        Create product
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
