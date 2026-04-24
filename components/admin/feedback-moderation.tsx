"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function FeedbackModeration({
  feedbackId,
  initialStatus,
  initialQuote,
  initialName
}: {
  feedbackId: string;
  initialStatus: string;
  initialQuote: string;
  initialName: string;
}) {
  const [publishStatus, setPublishStatus] = useState(initialStatus);
  const [quote, setQuote] = useState(initialQuote);
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Select value={publishStatus} onChange={(e) => setPublishStatus(e.target.value)}>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </Select>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Published name" />
      <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Published quote" />
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publishStatus, quote, name })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Save feedback
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
