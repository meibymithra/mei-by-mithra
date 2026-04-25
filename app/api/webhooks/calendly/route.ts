import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/server/db";
import { sendTransactionalEmail, sendTemplateEmail } from "@/server/services/email";
import { getAdminEmails } from "@/server/recipients";
import { hashValue } from "@/server/security";

function findQuestionAnswer(resource: any, patterns: string[]) {
  const answers = resource?.questions_and_answers;
  if (!Array.isArray(answers)) return "";

  const match = answers.find((item: any) =>
    patterns.some((pattern) => item?.question?.toLowerCase?.().includes(pattern))
  );

  return typeof match?.answer === "string" ? match.answer.trim() : "";
}

function extractInvitee(payload: any) {
  const resource = payload?.payload ?? payload?.data ?? payload?.event ?? payload;
  const eventUri = resource?.event?.uri ?? resource?.event ?? payload?.event_uri ?? payload?.eventUri;
  const inviteeEmail =
    resource?.invitee?.email ||
    resource?.email ||
    findQuestionAnswer(resource, ["email"]) ||
    "";
  const inviteeName =
    resource?.invitee?.name ||
    resource?.name ||
    findQuestionAnswer(resource, ["name"]) ||
    "";
  const inviteeUri = resource?.invitee?.uri ?? resource?.uri ?? payload?.uri ?? payload?.event_uuid ?? null;
  const eventTime = resource?.event?.start_time ?? resource?.start_time ?? resource?.created_at ?? null;
  const phone =
    resource?.invitee?.phone_number ||
    findQuestionAnswer(resource, ["phone", "mobile", "whatsapp", "contact"]);
  const timezone = resource?.invitee?.timezone ?? resource?.timezone ?? null;
  return { eventUri, inviteeEmail, inviteeName, inviteeUri, eventTime, timezone, phone, resource };
}

function normalizeEventType(value: unknown) {
  const input = String(value ?? "").toLowerCase();
  if (input.includes("cancel")) return "invitee.canceled";
  if (input.includes("create")) return "invitee.created";
  return input || "invitee.created";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const headerSecret = request.headers.get("x-calendly-webhook-secret");
  if (process.env.CALENDLY_WEBHOOK_SECRET && headerSecret !== process.env.CALENDLY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventUri, inviteeEmail, inviteeName, inviteeUri, eventTime, timezone, phone, resource } = extractInvitee(payload);
  const eventType = normalizeEventType(resource?.event_type ?? resource?.action ?? payload?.event_type ?? payload?.event);
  const eventKey = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        eventUri,
        inviteeUri,
        inviteeEmail,
        inviteeName,
        eventType,
        eventTime
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

  if (eventType === "invitee.canceled") {
    await prisma.booking.updateMany({
      where: { calendlyEventUri: eventUri },
      data: {
        status: "CANCELLED",
        rescheduleNote: "Cancelled in Calendly"
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
      subject: `Calendly booking received: ${booking.client.fullName}`,
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
