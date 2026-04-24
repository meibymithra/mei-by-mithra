"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FeedbackValues = typeof feedbackSchema._output;

export function FeedbackForm({ token }: { token: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { token, rating: 5, feedback: "", consentToTestimonial: false }
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        const data = (await response.json()) as { message?: string; error?: string };
        if (!response.ok) {
          setMessage(data.error ?? "Unable to submit feedback");
          return;
        }
        setMessage(data.message ?? "Feedback submitted.");
      })}
    >
      <input type="hidden" {...form.register("token")} />
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => form.setValue("rating", rating, { shouldValidate: true })}
              className={`h-11 w-11 rounded-full border text-sm font-semibold ${
                form.watch("rating") === rating ? "border-primary bg-primary text-primary-foreground" : "bg-background"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Open feedback</Label>
        <Textarea {...form.register("feedback")} placeholder="Tell us what stood out or what could improve" />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm">
        <Checkbox {...form.register("consentToTestimonial")} />
        <span>Can we publish this as a testimonial if approved by admin?</span>
      </label>

      <Button type="submit" className="w-full">
        Submit Feedback
      </Button>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
