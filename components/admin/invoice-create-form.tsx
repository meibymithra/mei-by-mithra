"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function InvoiceCreateForm({ clients }: { clients: { id: string; fullName: string }[] }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [sessionCount, setSessionCount] = useState("1");
  const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("INR");
  const [paymentLink, setPaymentLink] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.fullName}
          </option>
        ))}
      </Select>
      <Input value={sessionCount} onChange={(e) => setSessionCount(e.target.value)} type="number" placeholder="Session count" />
      <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount" />
      <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
      </Select>
      <Input className="md:col-span-2" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="Razorpay or Stripe payment link" />
      <Input className="md:col-span-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      <Button
        type="button"
        className="md:col-span-2"
        onClick={async () => {
          const response = await fetch("/api/admin/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientId,
              sessionCount: Number(sessionCount),
              amount: Number(amount),
              currency,
              paymentLink,
              notes
            })
          });
          const data = await response.json();
          setMessage(response.ok ? `Created ${data.invoiceId}` : data.error ?? "Failed");
        }}
      >
        Create invoice
      </Button>
      {message ? <p className="md:col-span-2 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
