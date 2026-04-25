# Mei by Mithra

Production-oriented brand website and operations platform for `Mithra Krishnamoorthy`.

This repository supports:

- a professional public brand website
- dedicated About and Practice pages
- a digital store for playbooks
- Calendly booking
- automatic intake follow-up
- invoice-based service flow
- feedback and testimonial moderation
- an admin CMS and store backend

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + PostgreSQL on Supabase
- Supabase Auth
- Resend
- Calendly webhook integration

## Local setup

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env.local`

3. Fill in runtime values:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SITE_URL`
- `ADMIN_EMAILS`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_RECOVERY_EMAIL`
- `CALENDLY_EVENT_TYPE_URL` or `NEXT_PUBLIC_CALENDLY_URL`
- `CALENDLY_WEBHOOK_SECRET`
- `RAZORPAY_PAYMENT_LINK`
- `STRIPE_PAYMENT_LINK`

4. Seed the admin account

```bash
npm run prisma:seed
```

5. Run the app

```bash
npm run dev
```

## Admin credentials model

The seeded admin email is fixed:

- `meibymithra@gmail.com`

The password is never committed to source control and must be supplied through:

- `ADMIN_SEED_PASSWORD`

The recovery email is controlled by:

- `ADMIN_RECOVERY_EMAIL`

## Public routes

- `/`
- `/about`
- `/practice`
- `/store`
- `/products/[slug]`
- `/book`
- `/intake`
- `/feedback/[token]`
- `/terms`

## Admin routes

- `/admin/login`
- `/admin`
- `/admin/cms`
- `/admin/store`
- `/admin/clients`
- `/admin/bookings`
- `/admin/invoices`
- `/admin/feedback`
- `/admin/calendly`

## Docs

- [docs/SYSTEM.md](C:/Users/Sudhakar%20-%20PC/Desktop/Mithra/docs/SYSTEM.md)
- [docs/BRAND.md](C:/Users/Sudhakar%20-%20PC/Desktop/Mithra/docs/BRAND.md)
- [docs/CMS.md](C:/Users/Sudhakar%20-%20PC/Desktop/Mithra/docs/CMS.md)
- [docs/DEPLOYMENT.md](C:/Users/Sudhakar%20-%20PC/Desktop/Mithra/docs/DEPLOYMENT.md)
- [docs/SUPABASE.md](C:/Users/Sudhakar%20-%20PC/Desktop/Mithra/docs/SUPABASE.md)

## Notes

- Local development can still run with the mock Prisma layer if `DATABASE_URL` is absent.
- Production requires a real database and proper Supabase configuration.
- Public content is split into dedicated pages and managed through the CMS plus seed fallbacks.
