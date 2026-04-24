import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/server/db";
import { sendTransactionalEmail, sendTemplateEmail } from "@/server/services/email";
import { getAdminEmails } from "@/server/recipients";

function extractInvitee(payload: any) {
  const resource = payload?.payload ?? payload?.data ?? payload?.event ?? payload;
  const eventUri = resource?.event?.uri ?? resource?.event ?? payload?.event_uri ?? payload?.eventUri;
  const inviteeEmail =
    resource?.invitee?.email ||
    resource?.email ||
    resource?.questions_and_answers?.find?.((item: any) => item.question?.toLowerCase?.().includes("email"))?.answer ||
    "";
  const inviteeName =
    resource?.invitee?.name ||
    resource?.name ||
    resource?.questions_and_answers?.find?.((item: any) => item.question?.toLowerCase?.().includes("name"))?.answer ||
    "";
  const inviteeUri = resource?.invitee?.uri ?? resource?.uri ?? payload?.uri ?? payload?.event_uuid ?? null;
  const eventTime = resource?.event?.start_time ?? resource?.start_time ?? resource?.created_at ?? null;
  return { eventUri, inviteeEmail, inviteeName, inviteeUri, eventTime, resource };
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const headerSecret = request.headers.get("x-calendly-webhook-secret");
  if (process.env.CALENDLY_WEBHOOK_SECRET && headerSecret !== process.env.CALENDLY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventUri, inviteeEmail, inviteeName, inviteeUri, eventTime, resource } = extractInvitee(payload);
  const eventType = String(resource?.event_type ?? resource?.action ?? payload?.event_type ?? payload?.event ?? "invitee.created");
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

  const client = await prisma.client.upsert({
    where: { email: inviteeEmail },
    update: {
      fullName: inviteeName || inviteeEmail
    },
    create: {
      fullName: inviteeName || inviteeEmail,
      email: inviteeEmail,
      phone:
        resource?.questions_and_answers?.find?.((item: any) => item.question?.toLowerCase?.().includes("phone"))?.answer ||
        (typeof inviteeUri === "string" ? inviteeUri : undefined) ||
        inviteeEmail
    }
  });

  const booking = await prisma.booking.upsert({
    where: { calendlyEventUri: eventUri },
    update: {
      scheduledAt: eventTime ? new Date(eventTime) : undefined,
      calendlyInviteUri: inviteeUri ? String(inviteeUri) : undefined,
      status: "BOOKED"
    },
    create: {
      clientId: client.id,
      calendlyEventUri: eventUri,
      calendlyInviteUri: inviteeUri ? String(inviteeUri) : undefined,
      scheduledAt: eventTime ? new Date(eventTime) : null,
      timezone: resource?.invitee?.timezone ?? resource?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: "BOOKED",
      intakeToken: crypto.randomUUID(),
      feedbackToken: crypto.randomUUID(),
      sessionType: "single"
    },
    include: { client: true }
  });

  const intakeUrl = `${process.env.SITE_URL || "http://localhost:3000"}/intake?token=${booking.intakeToken}`;
  await sendTemplateEmail("intakeRequest", {
    to: client.email,
    name: client.fullName,
    intakeUrl
  });

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
