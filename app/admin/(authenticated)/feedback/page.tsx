export const dynamic = 'force-dynamic';

import type { Client, Feedback, Testimonial } from "@prisma/client";
import { prisma } from "@/server/db";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackModeration } from "@/components/admin/feedback-moderation";
import { MessageSquare, Star, Clock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default async function FeedbackPage() {
  const feedback = await prisma.feedback.findMany({
    include: { client: true, testimonial: true },
    orderBy: { submittedAt: "desc" }
  });
  const feedbackRows: Array<Feedback & { client: Client; testimonial: Testimonial | null }> = feedback;

  const statusCounts = {
    all: feedbackRows.length,
    pending: (feedbackRows as any[]).filter(f => f.publishStatus === "PENDING" || f.publishStatus === "pending").length,
    approved: (feedbackRows as any[]).filter(f => f.publishStatus === "APPROVED" || f.publishStatus === "approved").length,
    rejected: (feedbackRows as any[]).filter(f => f.publishStatus === "REJECTED" || f.publishStatus === "rejected").length,
  };

  const averageRating = feedbackRows.length > 0
    ? (feedbackRows.reduce((sum, f) => sum + f.rating, 0) / feedbackRows.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading eyebrow="Feedback" title="Feedback moderation" description="Approve, reject, and edit testimonials before they go live." />
        <Badge variant="secondary" className="w-fit">{statusCounts.all} total</Badge>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-muted p-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statusCounts.all}</p>
              <p className="text-xs text-muted-foreground">Total feedback</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-coral/30 bg-coral/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-coral/10 p-3">
                <Clock className="h-5 w-5 text-coral" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-primary/10 p-3">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/30 bg-sage/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-sage/10 p-3">
                <Star className="h-5 w-5 text-sage" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageRating}</p>
                <p className="text-xs text-muted-foreground">Avg rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">All feedback</p>
            </div>
            <Badge variant="outline">{feedbackRows.length} shown</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {feedbackRows.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {item.client.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{item.client.fullName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= item.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                          <Badge 
                            variant={((item as any).publishStatus === "APPROVED" || (item as any).publishStatus === "approved") ? "secondary" : ((item as any).publishStatus === "PENDING" || (item as any).publishStatus === "pending") ? "outline" : "destructive"}
                            className="text-xs"
                          >
                            {item.publishStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.feedback}</p>
                    {item.testimonial && (
                      <div className="flex items-start gap-2 rounded-xl bg-sage/10 p-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />
                        <p className="text-sm italic text-sage">&ldquo;{(item as any).testimonial?.quote || (item as any).testimonial?.content}&rdquo;</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="lg:min-w-[300px]">
                    <FeedbackModeration
                      feedbackId={item.id}
                      initialStatus={item.publishStatus}
                      initialQuote={item.feedback}
                      initialName={item.client.fullName}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
