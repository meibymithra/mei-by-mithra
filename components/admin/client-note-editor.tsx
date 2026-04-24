"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ClientNoteEditor({ clientId, initialNote }: { clientId: string; initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={async () => {
            const response = await fetch(`/api/admin/clients/${clientId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ note })
            });
            const data = await response.json();
            setMessage(response.ok ? "Saved" : data.error ?? "Failed");
          }}
        >
          Save note
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    </div>
  );
}
