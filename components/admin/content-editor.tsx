"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContentEditor({
  contentKey,
  title,
  initialTitle,
  initialContent
}: {
  contentKey: string;
  title: string;
  initialTitle: string;
  initialContent: string;
}) {
  const [recordTitle, setRecordTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
      <p className="font-medium">{title}</p>
      <Input value={recordTitle} onChange={(e) => setRecordTitle(e.target.value)} />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40" />
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: contentKey, title: recordTitle, content })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Save content
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
