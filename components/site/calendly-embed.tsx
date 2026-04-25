"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function CalendlyEmbed({ calendlyUrl }: { calendlyUrl?: string }) {
  const [timezone, setTimezone] = useState("your local timezone");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "your local timezone");
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-0">
        <div className="border-b border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Availability is shown in <strong className="text-foreground">{timezone}</strong>. Mithra's base availability is Mon-Sat 7:30 PM - 8:30 PM IST and Sunday 8:30 AM - 8:30 PM IST.
        </div>
        {calendlyUrl ? (
          <div className="min-h-[720px]">
            <iframe
              title="Calendly booking"
              src={`${calendlyUrl}?hide_gdpr_banner=1&text_color=2b211d&primary_color=b72e09`}
              className="h-[780px] w-full"
            />
          </div>
        ) : (
          <div className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">
              Set `NEXT_PUBLIC_CALENDLY_URL` or `CALENDLY_EVENT_TYPE_URL` to enable the embed.
            </p>
            <p className="text-sm">
              Booking flow is wired for webhook intake automation, admin tagging, and post-booking email handling.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
