"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TemplateEditor({
  templateKey,
  initialSubject,
  initialBody
}: {
  templateKey: string;
  initialSubject: string;
  initialBody: string;
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-40" placeholder="HTML body" />
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch("/api/admin/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: templateKey, subject, body })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Save template
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
