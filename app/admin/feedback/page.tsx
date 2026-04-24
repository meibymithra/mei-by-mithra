import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { FeedbackModeration } from "@/components/admin/feedback-moderation";

export default async function FeedbackPage() {
  const feedback = await prisma.feedback.findMany({
    include: { client: true },
    orderBy: { submittedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Feedback" title="Feedback moderation" description="Approve, reject, and edit testimonials before they go live." />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <THead>
              <TR>
                <TH>Client</TH>
                <TH>Rating</TH>
                <TH>Comment</TH>
                <TH>Moderation</TH>
              </TR>
            </THead>
            <TBody>
              {feedback.map((item) => (
                <TR key={item.id}>
                  <TD>{item.client.fullName}</TD>
                  <TD>{item.rating}/5</TD>
                  <TD className="max-w-xl">{item.feedback}</TD>
                  <TD className="min-w-[280px]">
                    <FeedbackModeration
                      feedbackId={item.id}
                      initialStatus={item.publishStatus}
                      initialQuote={item.feedback}
                      initialName={item.client.fullName}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
