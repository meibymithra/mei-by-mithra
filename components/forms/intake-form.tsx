"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { intakeSchema } from "@/lib/validators";
import { goalOptions, packageOptions, sessionTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";

type IntakeValues = {
  bookingId?: string | null;
  token?: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  concern: string;
  goals: (typeof goalOptions)[number][];
  goalsNote: string;
  sessionType: "single" | "package";
  packageSessions: "1" | "3" | "5" | "8";
  timezone: string;
  priorExperience: "yes" | "no";
  priorExperienceDetails: string;
  confidentialityAccepted: boolean;
  termsAccepted: boolean;
};

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
      sessionType: "single" as const,
      packageSessions: "1" as const,
      timezone: "",
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
  const sessionType = form.watch("sessionType");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    form.setValue("timezone", timezone, { shouldDirty: false });
  }, [form]);

  return (
    <form
      className="space-y-6"
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
        form.reset(
          {
            ...defaultValues,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
          } as never
        );
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={form.formState.errors.fullName?.message as string | undefined}>
          <Input {...form.register("fullName")} placeholder="Your full name" />
        </Field>
        <Field label="Age" error={form.formState.errors.age?.message as string | undefined}>
          <Input type="number" {...form.register("age")} placeholder="Age" />
        </Field>
        <Field label="Mobile number" error={form.formState.errors.phone?.message as string | undefined}>
          <Input {...form.register("phone")} placeholder="Primary mobile number" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message as string | undefined}>
          <Input type="email" {...form.register("email")} placeholder="Email address" />
        </Field>
        <Field label="Emergency contact name" error={form.formState.errors.emergencyContactName?.message as string | undefined}>
          <Input {...form.register("emergencyContactName")} placeholder="Emergency contact name" />
        </Field>
        <Field label="Emergency contact number" error={form.formState.errors.emergencyContactPhone?.message as string | undefined}>
          <Input {...form.register("emergencyContactPhone")} placeholder="Emergency contact mobile number" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_.8fr_.8fr]">
        <Field label="Preferred support format" error={form.formState.errors.sessionType?.message as string | undefined}>
          <Select {...form.register("sessionType")}>
            {sessionTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Sessions are pre-booked. Packages are useful when you want ongoing support.
          </p>
        </Field>
        <Field label="Requested package size" error={form.formState.errors.packageSessions?.message as string | undefined}>
          <Select {...form.register("packageSessions")} disabled={sessionType !== "package"}>
            {packageOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Current timezone" error={form.formState.errors.timezone?.message as string | undefined}>
          <Input {...form.register("timezone")} placeholder="For Indians living abroad" />
        </Field>
      </div>

      <Field label="What brings you here?" error={form.formState.errors.concern?.message as string | undefined}>
        <Textarea {...form.register("concern")} placeholder="Briefly describe what you need help with and what feels most urgent right now." />
      </Field>

      <Field label="Goals for support" error={form.formState.errors.goals?.message as string | undefined}>
        <div className="grid gap-2 sm:grid-cols-2">
          {goalOptions.map((goal) => {
            const checked = goals?.includes(goal);
            return (
              <label
                key={goal}
                className="flex items-center gap-3 rounded-[1.25rem] border border-border bg-background px-4 py-3 text-sm"
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
        <Textarea
          className="mt-3"
          {...form.register("goalsNote")}
          placeholder="Add context if you are booking for a package, school, family, or a specific support need."
        />
      </Field>

      <Field label="Have you taken support before?" error={form.formState.errors.priorExperience?.message as string | undefined}>
        <Select {...form.register("priorExperience")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
        <Textarea
          className="mt-3"
          {...form.register("priorExperienceDetails")}
          placeholder="If yes, share what kind of support or sessions you have already tried."
        />
      </Field>

      <div className="grid gap-3 rounded-[1.75rem] border border-border bg-muted/30 p-4">
        <label className="flex items-start gap-3 text-sm">
          <Checkbox {...form.register("confidentialityAccepted")} />
          <span>I understand that my details are confidential and used only for service delivery and safeguarding.</span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <Checkbox {...form.register("termsAccepted")} />
          <span>I accept the booking process, session terms, and follow-up emails.</span>
        </label>
        <p className="text-xs leading-6 text-muted-foreground">
          This intake does not replace emergency support. If there is immediate risk, contact local emergency services.
        </p>
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
