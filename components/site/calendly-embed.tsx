"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

function isCalBookingUrl(url?: string) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return /cal\.com|calendly\.com/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

function isWebhookLikeUrl(url?: string) {
  return typeof url === "string" && /\/webhook|\/webhooks|\/api\/webhooks|\/api\/webhooks\/calendly|\bcalendly\/route\b/i.test(url);
}

export function CalendlyEmbed({ calendlyUrl }: { calendlyUrl?: string }) {
  const [timezone, setTimezone] = useState("your local timezone");
  const hasBookingUrl = Boolean(calendlyUrl);
  const isValidBookingUrl = isCalBookingUrl(calendlyUrl);
  const isWebhookUrl = isWebhookLikeUrl(calendlyUrl);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "your local timezone");
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-0">
        <div className="border-b border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Availability is shown in <strong className="text-foreground">{timezone}</strong>. Mithra's base availability is Mon-Sat 7:30 PM - 8:30 PM IST and Sunday 8:30 AM - 8:30 PM IST.
        </div>
        {hasBookingUrl && isValidBookingUrl ? (
          <div className="min-h-[720px]">
            <iframe
              title="Cal.com booking"
              src={calendlyUrl}
              className="h-[780px] w-full"
            />
          </div>
        ) : hasBookingUrl ? (
          <div className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">
              The configured booking URL does not appear to be a Cal.com scheduling page.
            </p>
            <p className="text-sm">
              {isWebhookUrl
                ? "It looks like the URL points to a webhook or internal endpoint. Update CAL_BOOKING_URL / NEXT_PUBLIC_CAL_BOOKING_URL to the Cal.com event type booking page instead."
                : "Please verify that CAL_BOOKING_URL or NEXT_PUBLIC_CAL_BOOKING_URL points to the Cal.com booking page for your availability."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">
              Booking is temporarily unavailable on this page because the Cal.com booking URL has not been configured yet.
            </p>
            <p className="text-sm">
              Once connected, this flow will handle booking, intake email, and follow-up steps automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
