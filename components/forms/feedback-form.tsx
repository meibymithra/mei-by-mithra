"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type FeedbackValues = {
  token: string;
  rating: number;
  experienceType: "session" | "package" | "playbook" | "workshop";
  whatHelped: string;
  whatCouldImprove: string;
  testimonialSnippet: string;
  consentToTestimonial: boolean;
  termsAccepted: boolean;
};

export function FeedbackForm({ token }: { token: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      token,
      rating: 5,
      experienceType: "session",
      whatHelped: "",
      whatCouldImprove: "",
      testimonialSnippet: "",
      consentToTestimonial: false,
      termsAccepted: false
    }
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

       <div className="space-y-3">
         <div className="flex items-center gap-2">
           <Label className="text-sm font-medium text-foreground">Rating</Label>
         </div>
         <div className="flex flex-wrap gap-3">
           {[1, 2, 3, 4, 5].map((rating) => (
             <button
               key={rating}
               type="button"
               onClick={() => form.setValue("rating", rating, { shouldValidate: true })}
               className={`h-12 w-12 rounded-xl border border-transparent bg-transparent text-sm font-medium transition-all duration-200 ${
                 form.watch("rating") === rating ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50"
               }`}
             >
               {rating}
             </button>
           ))}
         </div>
       </div>

      <div className="space-y-2">
        <Label>What are you giving feedback on?</Label>
        <Select {...form.register("experienceType")}>
          <option value="session">A session</option>
          <option value="package">A package of sessions</option>
          <option value="playbook">A playbook or resource</option>
          <option value="workshop">A workshop or facilitation session</option>
        </Select>
      </div>

       <div className="space-y-3">
         <div className="flex items-center gap-2">
           <Label className="text-sm font-medium text-foreground">Rating</Label>
         </div>
         <div className="flex flex-wrap gap-3">
           {[1, 2, 3, 4, 5].map((rating) => (
             <button
               key={rating}
               type="button"
               onClick={() => form.setValue("rating", rating, { shouldValidate: true })}
               className={`h-12 w-12 rounded-xl border border-transparent bg-transparent text-sm font-medium transition-all duration-200 ${
                 form.watch("rating") === rating ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50"
               }`}
             >
               {rating}
             </button>
           ))}
         </div>
       </div>

      <div className="space-y-2">
        <Label>What could be improved?</Label>
        <Textarea {...form.register("whatCouldImprove")} placeholder="Optional. Share anything that could be handled better next time." />
      </div>

      <div className="space-y-2">
        <Label>Short line we may use as a testimonial</Label>
        <Textarea
          {...form.register("testimonialSnippet")}
          placeholder="Optional. Keep this short if you want to suggest a publishable line."
        />
      </div>

       <div className="space-y-3">
         <label className="flex items-start gap-3 rounded-[1.75rem] border border-border bg-background/80 px-4 py-3 text-sm">
           <Checkbox {...form.register("consentToTestimonial")} />
           <span>I consent to this being considered for a testimonial after moderation and approval.</span>
         </label>

         <label className="flex items-start gap-3 rounded-[1.75rem] border border-border bg-background/80 px-4 py-3 text-sm">
           <Checkbox {...form.register("termsAccepted")} />
           <span>I understand feedback may be reviewed, edited for length, and published only if it aligns with the website terms.</span>
         </label>
       </div>

      <Button type="submit" className="w-full">
        Submit Feedback
      </Button>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
