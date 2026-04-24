# Mei by Mithra

Portfolio-cum-operations website for Mithra Krishnamoorthy, with Mei by Mithra as the coaching/therapy service layer.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL on Supabase
- Supabase Auth
- Vercel-hosted frontend, API routes, and server actions
- Resend for transactional email
- Calendly booking embed + webhook endpoint

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in:

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

3. Seed the admin account:

```bash
npm run prisma:seed
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run the app:

```bash
npm run dev
```

## Database

- Prisma schema: `prisma/schema.prisma`
- Initial migration: `prisma/migrations/0001_init/migration.sql`

## Admin auth

- Supabase Auth handles email/password sign-in.
- The seeded admin email is fixed and the password is provided via `ADMIN_SEED_PASSWORD`.
- The signed-in user must also exist in the `AdminUser` table to unlock `/admin/*`.

## Main surfaces

- [`/`](app/page.tsx): portfolio-style homepage for Mithra Krishnamoorthy
- [`/store`](app/store/page.tsx): canonical storefront for playbooks
- [`/book`](app/book/page.tsx): Calendly embed
- [`/intake`](app/intake/page.tsx): structured intake
- [`/admin/store`](app/admin/store/page.tsx): store and product controls
- [`/admin/calendly`](app/admin/calendly/page.tsx): webhook and booking tracking

## Deployment

- Deploy the whole app to Vercel. It hosts the frontend and backend routes.
- Use Supabase for PostgreSQL and Auth.
- Follow [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the exact Vercel env checklist.
- See [`docs/SUPABASE.md`](docs/SUPABASE.md) for the linked project and Prisma/Supabase workflow.
- Set all runtime environment variables in Vercel before production traffic.

## Notes

- Local development can fall back to a no-op mock when `DATABASE_URL` is absent.
- Production requires a real `DATABASE_URL`; the app now fails fast if it is missing.
- Seed and operational details live in [`docs/SYSTEM.md`](docs/SYSTEM.md).
