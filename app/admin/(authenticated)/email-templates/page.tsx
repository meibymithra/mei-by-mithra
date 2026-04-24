export const dynamic = 'force-dynamic';

import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { TemplateEditor } from "@/components/admin/template-editor";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany();
  const byKey = Object.fromEntries(templates.map((template) => [template.key, template]));

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Email" title="Email templates" description="Edit intake, invoice, and feedback request templates." />
      <div className="grid gap-4">
        <TemplateEditor
          templateKey="intakeRequest"
          initialSubject={byKey.intakeRequest?.subject ?? "Complete your Mei by Mithra intake form"}
          initialBody={byKey.intakeRequest?.body ?? "<p>Intake email</p>"}
        />
        <TemplateEditor
          templateKey="invoice"
          initialSubject={byKey.invoice?.subject ?? "Your Mei by Mithra invoice"}
          initialBody={byKey.invoice?.body ?? "<p>Invoice email</p>"}
        />
        <TemplateEditor
          templateKey="feedbackRequest"
          initialSubject={byKey.feedbackRequest?.subject ?? "How was your session?"}
          initialBody={byKey.feedbackRequest?.body ?? "<p>Feedback email</p>"}
        />
      </div>
    </div>
  );
}
