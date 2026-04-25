import { z } from "zod";
import { packageOptions, goalOptions, sessionTypes } from "@/lib/constants";

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number")
  .max(20, "Phone number is too long");

export const intakeSchema = z.object({
  bookingId: z.string().uuid().optional().nullable(),
  token: z.string().optional().or(z.literal("")),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  age: z.coerce.number().int().min(5).max(120),
  phone: phoneSchema,
  email: z.string().trim().email(),
  emergencyContactName: z.string().trim().min(2).max(120),
  emergencyContactPhone: phoneSchema,
  concern: z.string().trim().min(15, "Describe the concern in a few words").max(3000),
  goals: z.array(z.enum(goalOptions)).min(1, "Choose at least one goal"),
  goalsNote: z.string().trim().max(1000).optional().or(z.literal("")),
  sessionType: z.enum(sessionTypes.map((item) => item.value) as [string, ...string[]]),
  packageSessions: z.enum(packageOptions.map((item) => item.value) as [string, ...string[]]).default("1"),
  timezone: z.string().trim().max(120).optional().or(z.literal("")),
  priorExperience: z.enum(["yes", "no"]),
  priorExperienceDetails: z.string().trim().max(2000).optional().or(z.literal("")),
  confidentialityAccepted: z.literal(true, {
    errorMap: () => ({ message: "Confidentiality acceptance is required" })
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Terms acceptance is required" })
  })
});

export const feedbackSchema = z.object({
  token: z.string().min(8),
  rating: z.coerce.number().int().min(1).max(5),
  experienceType: z.enum(["session", "package", "playbook", "workshop"]),
  whatHelped: z.string().trim().min(10).max(1200),
  whatCouldImprove: z.string().trim().max(1200).optional().or(z.literal("")),
  testimonialSnippet: z.string().trim().max(600).optional().or(z.literal("")),
  consentToTestimonial: z.boolean(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Terms acceptance is required" })
  })
});

export const adminInvoiceSchema = z.object({
  clientId: z.string().uuid(),
  sessionCount: z.coerce.number().int().min(1).max(50),
  amount: z.coerce.number().min(1).max(1000000),
  currency: z.enum(["INR", "USD"]).default("INR"),
  paymentLink: z.string().trim().url().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal(""))
});

export const noteSchema = z.object({
  note: z.string().trim().max(5000)
});

export const templateSchema = z.object({
  key: z.string().trim().min(2).max(100),
  subject: z.string().trim().min(2).max(200),
  body: z.string().trim().min(10).max(20000)
});

export const siteContentSchema = z.object({
  key: z.string().trim().min(2).max(100),
  title: z.string().trim().min(2).max(200),
  content: z.string().trim().min(2).max(40000)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
