"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function BookingStatusEditor({
  bookingId,
  initialStatus,
  initialNote = ""
}: {
  bookingId: string;
  initialStatus: string;
  initialNote?: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [rescheduleNote, setRescheduleNote] = useState(initialNote);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="PENDING">Pending</option>
        <option value="BOOKED">Booked</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>
      <Input value={rescheduleNote} onChange={(e) => setRescheduleNote(e.target.value)} placeholder="Reschedule note" />
      <Button
        type="button"
        onClick={async () => {
          const response = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, rescheduleNote })
          });
          const data = await response.json();
          setMessage(response.ok ? "Saved" : data.error ?? "Failed");
        }}
      >
        Update booking
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
