import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/server/db";
import { sendTransactionalEmail, sendTemplateEmail } from "@/server/services/email";
import { getAdminEmails } from "@/server/recipients";
import { hashValue } from "@/server/security";

function verifyCalSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(digest, "hex"));
  } catch {
    return false;
  }
}

function getResponseValue(responses: any, keys: string[]) {
  if (!responses || typeof responses !== "object") return "";

  for (const [responseKey, responseValue] of Object.entries(responses)) {
    const normalizedKey = responseKey.toLowerCase();
    if (!keys.some((key) => normalizedKey.includes(key))) continue;

    const value =
      typeof responseValue === "object" && responseValue !== null && "value" in responseValue
        ? (responseValue as { value?: unknown }).value
        : responseValue;

    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function extractCalBooking(payload: any) {
  const resource = payload?.payload ?? payload;
  const attendee = Array.isArray(resource?.attendees) ? resource.attendees[0] : null;
  const responses = resource?.responses ?? {};
  const eventUid = resource?.uid ? String(resource.uid) : "";
  const bookingId = resource?.bookingId ?? resource?.id ?? null;
  const eventUri = eventUid || (bookingId ? `cal-booking:${bookingId}` : "");
  const inviteeEmail = attendee?.email ?? getResponseValue(responses, ["email"]);
  const inviteeName = attendee?.name ?? getResponseValue(responses, ["name"]);
  const phone = attendee?.phoneNumber ?? getResponseValue(responses, ["phone", "mobile", "whatsapp", "contact"]);
  const timezone = attendee?.timeZone ?? resource?.user?.timeZone ?? null;
  const eventTime = resource?.startTime ?? null;

  return {
    eventUri,
    bookingId,
    inviteeEmail,
    inviteeName,
    inviteeUri: bookingId ? String(bookingId) : null,
    eventTime,
    timezone,
    phone,
    resource
  };
}

function normalizeTriggerEvent(value: unknown) {
  const input = String(value ?? "").toUpperCase();
  return input || "BOOKING_CREATED";
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  let payload: any = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const webhookSecret = process.env.CAL_WEBHOOK_SECRET ?? process.env.CALENDLY_WEBHOOK_SECRET;

  if (
    webhookSecret &&
    !verifyCalSignature(rawBody, request.headers.get("x-cal-signature-256"), webhookSecret)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventUri, inviteeEmail, inviteeName, inviteeUri, eventTime, timezone, phone, resource } =
    extractCalBooking(payload);
  const eventType = normalizeTriggerEvent(payload?.triggerEvent);
  const eventKey = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        eventUri,
        inviteeUri,
        inviteeEmail,
        inviteeName,
        eventType,
        eventTime,
        updatedAt: resource?.updatedAt ?? null
      })
    )
    .digest("hex");

  const existingLog = await prisma.calendlyWebhookLog.findUnique({ where: { eventKey } });
  if (existingLog) {
    await prisma.calendlyWebhookLog.update({
      where: { id: existingLog.id },
      data: {
        status: "DUPLICATE",
        payload
      }
    });
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await prisma.calendlyWebhookLog.create({
    data: {
      eventKey,
      eventType,
      eventUri: eventUri ?? undefined,
      inviteeUri: inviteeUri ?? undefined,
      inviteeEmail: inviteeEmail || undefined,
      inviteeName: inviteeName || undefined,
      scheduledAt: eventTime ? new Date(eventTime) : null,
      status: "RECEIVED",
      payload
    }
  });

  if (!eventUri || !inviteeEmail) {
    await prisma.calendlyWebhookLog.update({
      where: { eventKey },
      data: {
        status: "FAILED",
        notes: "Missing event URI or invitee email"
      }
    });
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (eventType === "BOOKING_CANCELLED") {
    await prisma.booking.updateMany({
      where: { calendlyEventUri: eventUri },
      data: {
        status: "CANCELLED",
        rescheduleNote: "Cancelled in Cal.com"
      }
    });

    await prisma.calendlyWebhookLog.update({
      where: { eventKey },
      data: { status: "PROCESSED", notes: "Cancellation synced" }
    });

    return NextResponse.json({ ok: true, cancelled: true });
  }

  const fallbackPhone = phone || `pending-${hashValue(inviteeEmail).slice(0, 12)}`;
  const existingBooking = await prisma.booking.findUnique({
    where: { calendlyEventUri: eventUri }
  });

  const phoneOwner = phone
    ? await prisma.client.findUnique({
        where: { phone }
      })
    : null;

  const client = await prisma.client.upsert({
    where: { email: inviteeEmail },
    update: {
      fullName: inviteeName || inviteeEmail,
      ...(phone && (!phoneOwner || phoneOwner.email === inviteeEmail) ? { phone } : {})
    },
    create: {
      fullName: inviteeName || inviteeEmail,
      email: inviteeEmail,
      phone: fallbackPhone
    }
  });

  const booking = await prisma.booking.upsert({
    where: { calendlyEventUri: eventUri },
    update: {
      clientId: client.id,
      scheduledAt: eventTime ? new Date(eventTime) : undefined,
      calendlyInviteUri: inviteeUri ? String(inviteeUri) : undefined,
      timezone: timezone ?? undefined,
      status: "BOOKED"
    },
    create: {
      clientId: client.id,
      calendlyEventUri: eventUri,
      calendlyInviteUri: inviteeUri ? String(inviteeUri) : undefined,
      scheduledAt: eventTime ? new Date(eventTime) : null,
      timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: "BOOKED",
      intakeToken: crypto.randomUUID(),
      feedbackToken: crypto.randomUUID(),
      sessionType: "single"
    },
    include: { client: true }
  });

  if (!existingBooking) {
    const intakeUrl = `${process.env.SITE_URL || "http://localhost:3000"}/intake?token=${booking.intakeToken}`;
    await sendTemplateEmail("intakeRequest", {
      to: client.email,
      name: client.fullName,
      intakeUrl
    });
  }

  const admins = await getAdminEmails();
  if (admins.length) {
    await sendTransactionalEmail({
      to: admins,
      subject: `Booking received from Cal.com: ${booking.client.fullName}`,
      html: `<p>New booking for <strong>${client.fullName}</strong>.</p>`,
      templateKey: "custom",
      metadata: { bookingId: booking.id }
    });
  }

  await prisma.calendlyWebhookLog.update({
    where: { eventKey },
    data: { status: "PROCESSED" }
  });

  return NextResponse.json({ ok: true });
}
