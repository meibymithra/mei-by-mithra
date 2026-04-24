"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CalendlyLogEditor({
  logId,
  initialStatus,
  initialNotes
}: {
  logId: string;
  initialStatus: string;
  initialNotes: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="RECEIVED">Received</option>
        <option value="PROCESSED">Processed</option>
        <option value="DUPLICATE">Duplicate</option>
        <option value="FAILED">Failed</option>
      </Select>
      <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Admin note" />
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch(`/api/admin/calendly/${logId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, notes })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Save log
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
