# Mei by Mithra System Docs

## What this is

This repository is a portfolio-cum-operations website for `Mithra Krishnamoorthy`, with `Mei by Mithra` as the coaching/therapy service layer.

The public site does three jobs:

- Presents Mithra as a portfolio-grade brand
- Converts visitors into bookings and intake submissions
- Runs the service workflow through admin-only operations

## Stack

- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS
- Prisma ORM
- PostgreSQL on Supabase
- Supabase Auth for admin login
- Resend for transactional email
- Calendly for booking

## Routes

- `/` landing page
- `/book` Calendly booking embed
- `/intake` intake form
- `/feedback/[token]` feedback form
- `/store` digital playbooks storefront
- `/products` redirect alias for the store
- `/admin/*` protected admin dashboard

## Seeded admin

The repo seeds one admin account:

- Email: `meibymithra@gmail.com`
- Password: supplied through `ADMIN_SEED_PASSWORD`
- Recovery email: `meibymithra.recovery@gmail.com`

The seed script:

- Creates or updates the Supabase Auth user
- Stores the `AdminUser` row in PostgreSQL
- Stores a password hash and recovery email in `AdminUser`

Run it with:

```bash
npm run prisma:seed
```

Required env vars for auth sync:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SEED_PASSWORD`

## Environment variables

Required:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SITE_URL`

Booking:

- `CALENDLY_EVENT_TYPE_URL`
- `NEXT_PUBLIC_CALENDLY_URL`
- `CALENDLY_WEBHOOK_SECRET`

Payments:

- `RAZORPAY_PAYMENT_LINK`
- `STRIPE_PAYMENT_LINK`

## Operational flow

1. Visitor books on Calendly.
2. Calendly webhook creates or updates a client and booking.
3. Webhook payload is logged in the Calendly operations table.
4. Intake email is sent automatically.
5. Client submits intake.
6. Admin creates invoice and sends payment link.
7. Session completes.
8. Feedback email is sent.
9. Admin approves feedback and publishes testimonial if allowed.

## Admin workflow

- Login with Supabase Auth at `/admin/login`
- The user must also exist in the `AdminUser` table
- Manage clients, bookings, invoices, feedback, CMS, templates, and analytics from `/admin/*`
- Store content and product controls live at `/admin/store`
- Calendly logs and upcoming booking tracking live at `/admin/calendly`

## Deployment notes

- Deploy on Vercel.
- Connect Supabase PostgreSQL and Supabase Auth.
- Set all env vars in Vercel before production traffic.
- Run Prisma migrations on deploy:

```bash
npm run prisma:deploy
```

## Frontend design system

- Palette: cream, rust, sage, sand, coral, beige, brown
- Typography: Bantayog for headings, Playpen Sans for body
- Layout direction: airy, editorial, premium, trust-first
- Public copy: calm, concise, and conversion-oriented

## Future extension points

- Customer portal
- WhatsApp automation
- Subscription plans
- AI-assisted intake analysis
- AI session summaries
