import { NextResponse } from "next/server";
import { intakeSchema } from "@/lib/validators";
import { prisma } from "@/server/db";
import { rateLimit, getClientIp, sanitizeText } from "@/server/security";
import { getAdminEmails } from "@/server/recipients";
import { sendTransactionalEmail } from "@/server/services/email";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`intake:${ip}`, 6, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" }, { status: 400 });
  }

  const input = parsed.data;
  const bookingToken = sanitizeText(input.token || "");
  if (!bookingToken) {
    return NextResponse.json({ error: "A valid booking token is required." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { intakeToken: bookingToken }
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (input.bookingId && input.bookingId !== booking.id) {
    return NextResponse.json({ error: "Booking token does not match the selected booking." }, { status: 400 });
  }

  const emailClient = await prisma.client.findUnique({
    where: { email: input.email }
  });
  const phoneClient = emailClient
    ? null
    : await prisma.client.findUnique({
        where: { phone: input.phone }
      });
  const existingClient = emailClient ?? phoneClient;
  const phoneOwner = await prisma.client.findUnique({
    where: { phone: input.phone }
  });
  const emailOwner = await prisma.client.findUnique({
    where: { email: input.email }
  });

  const client = existingClient
    ? await prisma.client.update({
        where: { id: existingClient.id },
        data: {
          fullName: sanitizeText(input.fullName),
          ...(phoneOwner && phoneOwner.id !== existingClient.id ? {} : { phone: sanitizeText(input.phone) }),
          ...(emailOwner && emailOwner.id !== existingClient.id ? {} : { email: sanitizeText(input.email) }),
          age: input.age,
          emergencyName: sanitizeText(input.emergencyContactName),
          emergencyPhone: sanitizeText(input.emergencyContactPhone),
          concernSummary: sanitizeText(input.concern).slice(0, 250),
          goals: input.goals,
          priorExperience: input.priorExperience === "yes"
        }
      })
    : await prisma.client.create({
        data: {
          fullName: sanitizeText(input.fullName),
          email: sanitizeText(input.email),
          phone: sanitizeText(input.phone),
          age: input.age,
          emergencyName: sanitizeText(input.emergencyContactName),
          emergencyPhone: sanitizeText(input.emergencyContactPhone),
          concernSummary: sanitizeText(input.concern).slice(0, 250),
          goals: input.goals,
          priorExperience: input.priorExperience === "yes"
        }
      });

  const goalsNote =
    sanitizeText(
      [
        input.goalsNote || "",
        `Support format: ${input.sessionType}`,
        input.sessionType === "package" ? `Requested package sessions: ${input.packageSessions}` : "",
        input.timezone ? `Timezone: ${input.timezone}` : ""
      ]
        .filter(Boolean)
        .join("\n")
    ) || null;

  const intake = await prisma.$transaction(async (tx) => {
    const savedIntake = await tx.intakeForm.upsert({
      where: { bookingId: booking.id },
      update: {
        clientId: client.id,
        fullName: sanitizeText(input.fullName),
        age: input.age,
        phone: sanitizeText(input.phone),
        email: sanitizeText(input.email),
        emergencyContactName: sanitizeText(input.emergencyContactName),
        emergencyContactPhone: sanitizeText(input.emergencyContactPhone),
        concern: sanitizeText(input.concern),
        goals: input.goals,
        goalsNote,
        priorExperience: input.priorExperience === "yes",
        priorExperienceDetails: sanitizeText(input.priorExperienceDetails || "") || null,
        confidentialityAccepted: input.confidentialityAccepted,
        termsAccepted: input.termsAccepted
      },
      create: {
        bookingId: booking.id,
        clientId: client.id,
        fullName: sanitizeText(input.fullName),
        age: input.age,
        phone: sanitizeText(input.phone),
        email: sanitizeText(input.email),
        emergencyContactName: sanitizeText(input.emergencyContactName),
        emergencyContactPhone: sanitizeText(input.emergencyContactPhone),
        concern: sanitizeText(input.concern),
        goals: input.goals,
        goalsNote,
        priorExperience: input.priorExperience === "yes",
        priorExperienceDetails: sanitizeText(input.priorExperienceDetails || "") || null,
        confidentialityAccepted: input.confidentialityAccepted,
        termsAccepted: input.termsAccepted
      }
    });

    await tx.booking.update({
      where: { id: booking.id },
      data: {
        clientId: client.id,
        status: "BOOKED",
        sessionType: input.sessionType,
        timezone: sanitizeText(input.timezone) || booking.timezone
      }
    });

    return savedIntake;
  });

  const admins = await getAdminEmails();
  if (admins.length) {
    await sendTransactionalEmail({
      to: admins,
      subject: `New intake submitted: ${client.fullName}`,
      html: `<p>New intake has been submitted for <strong>${client.fullName}</strong>.</p><p>Support format: <strong>${sanitizeText(
        input.sessionType
      )}</strong>${input.sessionType === "package" ? ` (${sanitizeText(input.packageSessions)} sessions requested)` : ""}</p><p>Concern: ${sanitizeText(
        input.concern
      )}</p>`,
      templateKey: "custom",
      metadata: { intakeId: intake.id, clientId: client.id }
    });
  }

  return NextResponse.json({ message: "Intake submitted successfully." });
}
