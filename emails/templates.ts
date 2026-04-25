import { brand } from "@/lib/constants";

type TemplatePayload = {
  subject: string;
  html: string;
  to: string | string[];
  metadata?: Record<string, unknown>;
};

function shell(title: string, body: string) {
  return `
  <div style="background:#f5eedc;padding:24px;font-family:Arial,sans-serif;color:#2b211d">
    <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:1px solid #e8dcc3;border-radius:20px;padding:24px">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#b72e09">${brand.name}</div>
      <h1 style="font-size:28px;line-height:1.2;margin:12px 0 20px">${title}</h1>
      <div style="font-size:16px;line-height:1.7;color:#4f4138">${body}</div>
    </div>
  </div>`;
}

export const emailTemplates = {
  intakeRequest: ({ name, intakeUrl, to }: { name: string; intakeUrl: string; to: string }): TemplatePayload => ({
    to,
    subject: "Complete your Mei by Mithra intake form",
    html: shell(
      "Complete your intake",
      `<p>Hi ${name},</p><p>Your booking is confirmed. Please complete the intake form before your session.</p><p>This process is designed for pre-booked sessions, including international clients viewing availability in their local timezone.</p><p><a href="${intakeUrl}" style="display:inline-block;background:#b72e09;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Open Intake Form</a></p>`
    )
  }),
  invoice: ({
    name,
    amount,
    paymentLink,
    to
  }: {
    name: string;
    amount: string;
    paymentLink: string;
    to: string;
  }): TemplatePayload => ({
    to,
    subject: "Your Mei by Mithra invoice",
    html: shell(
      "Invoice ready",
      `<p>Hi ${name},</p><p>Your invoice for <strong>${amount}</strong> is ready.</p><p>You can pay using the link below. If this does not work for your region, reply to request a manual invoice alternative.</p><p><a href="${paymentLink}" style="display:inline-block;background:#84a18f;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Pay Now</a></p>`
    )
  }),
  feedbackRequest: ({ name, feedbackUrl, to }: { name: string; feedbackUrl: string; to: string }): TemplatePayload => ({
    to,
    subject: "How was your session with Mei by Mithra?",
    html: shell(
      "Share feedback",
      `<p>Hi ${name},</p><p>Please share a short rating and open-ended feedback about your experience.</p><p>If you consent, a short portion may later be considered for a testimonial after moderation.</p><p><a href="${feedbackUrl}" style="display:inline-block;background:#b72e09;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Open Feedback Form</a></p>`
    )
  }),
  productDelivery: ({
    name,
    productName,
    downloadUrl,
    to
  }: {
    name: string;
    productName: string;
    downloadUrl: string;
    to: string;
  }): TemplatePayload => ({
    to,
    subject: `Your ${productName} download is ready`,
    html: shell(
      "Download ready",
      `<p>Hi ${name},</p><p>Your purchase has been confirmed. Download <strong>${productName}</strong> here.</p><p><a href="${downloadUrl}" style="display:inline-block;background:#896c68;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Download File</a></p>`
    )
  }),
  adminAlert: ({ subject, message, to }: { subject: string; message: string; to: string }): TemplatePayload => ({
    to,
    subject,
    html: shell(subject, `<p>${message}</p>`)
  })
} as const;
