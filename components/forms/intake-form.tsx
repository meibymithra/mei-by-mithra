"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { intakeSchema } from "@/lib/validators";
import { goalOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";

type IntakeValues = typeof intakeSchema._output;

export function IntakeForm({
  bookingId,
  token
}: {
  bookingId?: string;
  token?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      bookingId: bookingId ?? null,
      token: token ?? "",
      fullName: "",
      age: 0,
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      concern: "",
      goals: [] as IntakeValues["goals"],
      goalsNote: "",
      priorExperience: "no" as const,
      priorExperienceDetails: "",
      confidentialityAccepted: false,
      termsAccepted: false
    }),
    [bookingId, token]
  );

  const form = useForm<IntakeValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: defaultValues as never
  });

  const goals = form.watch("goals");

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => {
        setLoading(true);
        setMessage(null);
        const response = await fetch("/api/intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        const data = (await response.json()) as { message?: string; error?: string };
        setLoading(false);
        if (!response.ok) {
          setMessage(data.error ?? "Unable to submit intake form");
          return;
        }
        setMessage(data.message ?? "Submitted successfully.");
        form.reset(defaultValues as never);
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={form.formState.errors.fullName?.message as string | undefined}>
          <Input {...form.register("fullName")} placeholder="Your full name" />
        </Field>
        <Field label="Age" error={form.formState.errors.age?.message as string | undefined}>
          <Input type="number" {...form.register("age")} placeholder="Age" />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message as string | undefined}>
          <Input {...form.register("phone")} placeholder="Mobile number" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message as string | undefined}>
          <Input type="email" {...form.register("email")} placeholder="Email address" />
        </Field>
        <Field label="Emergency contact name" error={form.formState.errors.emergencyContactName?.message as string | undefined}>
          <Input {...form.register("emergencyContactName")} placeholder="Name" />
        </Field>
        <Field label="Emergency contact phone" error={form.formState.errors.emergencyContactPhone?.message as string | undefined}>
          <Input {...form.register("emergencyContactPhone")} placeholder="Phone" />
        </Field>
      </div>

      <Field label="Basic concern" error={form.formState.errors.concern?.message as string | undefined}>
        <Textarea {...form.register("concern")} placeholder="Briefly describe what you need help with" />
      </Field>

      <Field label="Goals" error={form.formState.errors.goals?.message as string | undefined}>
        <div className="grid gap-2 sm:grid-cols-2">
          {goalOptions.map((goal) => {
            const checked = goals?.includes(goal);
            return (
              <label
                key={goal}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              >
                <Checkbox
                  checked={checked}
                  onChange={(event) => {
                    const current = new Set(form.getValues("goals"));
                    if (event.target.checked) current.add(goal);
                    else current.delete(goal);
                    form.setValue("goals", Array.from(current) as never, { shouldValidate: true });
                  }}
                />
                {goal}
              </label>
            );
          })}
        </div>
        <Textarea className="mt-3" {...form.register("goalsNote")} placeholder="Optional notes about your goals" />
      </Field>

      <Field label="Prior experience" error={form.formState.errors.priorExperience?.message as string | undefined}>
        <Select {...form.register("priorExperience")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
        <Textarea className="mt-3" {...form.register("priorExperienceDetails")} placeholder="If yes, share what you tried before" />
      </Field>

      <div className="grid gap-3 rounded-3xl border border-border bg-muted/30 p-4">
        <label className="flex items-start gap-3 text-sm">
          <Checkbox {...form.register("confidentialityAccepted")} />
          <span>I understand that my details are confidential and used only for service delivery.</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <Checkbox {...form.register("termsAccepted")} />
          <span>I accept the terms of service and administrative email workflow.</span>
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Intake"}
      </Button>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
