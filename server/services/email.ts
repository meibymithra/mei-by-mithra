import { Resend } from "resend";
import { prisma } from "@/server/db";
import { emailTemplates } from "@/emails/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  templateKey?: string;
  metadata?: Record<string, unknown>;
};

function renderTemplate(source: string, params: Record<string, string | number | boolean | null | undefined>) {
  return source.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export async function sendTransactionalEmail(args: SendEmailArgs) {
  const to = Array.isArray(args.to) ? args.to : [args.to];
  const from = process.env.RESEND_FROM_EMAIL || "Mei by Mithra <hello@meibymithra.com>";
  const mocked = !resend;
  const result = resend
    ? await resend.emails.send({
        from,
        to,
        subject: args.subject,
        html: args.html
      })
    : { id: `mock-${Date.now()}` };
  const providerMessageId =
    "id" in result ? result.id : (result as { data?: { id?: string } }).data?.id ?? `mock-${Date.now()}`;

  await prisma.emailLog.create({
    data: {
      to: to.join(", "),
      subject: args.subject,
      templateKey: args.templateKey ?? "custom",
      providerMessageId,
      status: mocked ? "MOCKED" : "SENT",
      metadata: (args.metadata ?? {}) as any
    }
  });

  return result;
}

export async function sendTemplateEmail(
  templateKey: keyof typeof emailTemplates,
  params: Record<string, string | number | boolean | null | undefined>
) {
  const dbTemplate = await prisma.emailTemplate.findUnique({
    where: { key: String(templateKey) }
  });

  const template = dbTemplate
    ? {
        subject: renderTemplate(dbTemplate.subject, params),
        html: renderTemplate(dbTemplate.body, params),
        to: params.to as string | string[] | undefined,
        metadata: undefined
      }
    : emailTemplates[templateKey](params as never);

  return sendTransactionalEmail({
    to: template.to ?? (params.to as string),
    subject: template.subject,
    html: template.html,
    templateKey: String(templateKey),
    metadata: template.metadata
  });
}
