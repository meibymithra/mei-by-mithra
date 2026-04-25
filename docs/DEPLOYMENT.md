# Vercel Deployment Guide

## What this app needs

This app is deployed as a single Next.js app on Vercel. Vercel runs the frontend, API routes, and server actions. Supabase provides PostgreSQL and Auth.

## Environment variables

Set these in Vercel Project Settings. Use the same names in local `.env.local`.

### Runtime required

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_FROM_EMAIL`
- `SITE_URL`

### Auth and admin

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_RECOVERY_EMAIL`

### Booking and intake

- `CAL_BOOKING_URL`
- `NEXT_PUBLIC_CAL_BOOKING_URL`
- `CAL_WEBHOOK_SECRET`

### Payments

- `RAZORPAY_PAYMENT_LINK`
- `STRIPE_PAYMENT_LINK`

### Optional integrations

- `RESEND_API_KEY`
- `WHATSAPP_API_KEY`
- `WHATSAPP_SENDER`

### Deploy-time seed values

- `ADMIN_SEED_PASSWORD`
- `ADMIN_RECOVERY_EMAIL`

These are required in production because deployment now runs the seed automatically after migrations.

## Admin seed model

The seeded admin email is fixed in the seed script:

- `meibymithra@gmail.com`

Only the password should be provided through environment variables:

- `ADMIN_SEED_PASSWORD`

Do not commit any actual password into the repository, `.env.example`, docs, or CMS.

## Vercel env checklist

### Production

Set these in the Vercel Production scope:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_API_KEY`
- `SITE_URL`
- `ADMIN_EMAILS`
- `CAL_BOOKING_URL`
- `NEXT_PUBLIC_CAL_BOOKING_URL`
- `CAL_WEBHOOK_SECRET`
- `RAZORPAY_PAYMENT_LINK`
- `STRIPE_PAYMENT_LINK`

Optional in production:

- `WHATSAPP_API_KEY`
- `WHATSAPP_SENDER`

Automatic deployment seeding also requires:

- `ADMIN_SEED_PASSWORD`
- `ADMIN_RECOVERY_EMAIL`

### Preview

Use the same keys in the Vercel Preview scope.

- Point `SITE_URL` to the preview domain if you want links inside emails to match preview deployments.
- Keep `DATABASE_URL` pointed at a safe database if previews should not touch production data.
- If you do not want preview emails to send, omit `RESEND_API_KEY`.

### Local

Copy the same keys into `.env.local`.

- Use a local or Supabase database URL in `DATABASE_URL`.
- Keep `ADMIN_SEED_PASSWORD` and `ADMIN_RECOVERY_EMAIL` populated locally if you want to run the same deploy-time seed flow as production.
- Keep `SITE_URL` on `http://localhost:3000`.

## Copy-paste table

Use this as the Vercel checklist. `Required` means the app needs it to function correctly in that scope.

| Variable | Production | Preview | Local | Required | Notes |
| --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | Supabase pooler URL | preview-safe pooler URL | local DB URL | Yes | Prisma runtime database |
| `DIRECT_URL` | Supabase direct URL | preview-safe direct URL | local direct URL | Yes | Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | same or preview project | local env value | Yes | Admin auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | same or preview project | local env value | Yes | Browser auth client |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key | preview-safe service role key | local env value | Yes | Seed/admin sync |
| `RESEND_FROM_EMAIL` | `Mei by Mithra <hello@...>` | same | same | Yes | Sender identity |
| `RESEND_API_KEY` | real Resend key | optional | optional | No | Email sending |
| `SITE_URL` | production domain | preview domain | `http://localhost:3000` | Yes | Absolute email links |
| `ADMIN_EMAILS` | comma-separated admin emails | same | same | No | Admin notification list |
| `CAL_BOOKING_URL` | production Cal.com URL | preview/testing URL | local testing URL | No | Booking embed |
| `NEXT_PUBLIC_CAL_BOOKING_URL` | fallback Cal.com URL | fallback Cal.com URL | fallback URL | No | Booking embed fallback |
| `CAL_WEBHOOK_SECRET` | webhook secret | same or test secret | local secret | No | Cal.com webhook auth |
| `RAZORPAY_PAYMENT_LINK` | live payment link | test link | test link | No | India payments |
| `STRIPE_PAYMENT_LINK` | live payment link | test link | test link | No | International fallback |
| `WHATSAPP_API_KEY` | optional | optional | optional | No | Future integration |
| `WHATSAPP_SENDER` | optional | optional | optional | No | Future integration |
| `ADMIN_SEED_PASSWORD` | deploy-time seed secret | deploy-time seed secret | seed secret | Yes for deploy seed | Creates or updates seeded admin auth |
| `ADMIN_RECOVERY_EMAIL` | deploy-time seed recovery email | deploy-time seed recovery email | seed recovery email | Yes for deploy seed | Stored on admin row |

## Exact Vercel values

Use this as the baseline for Vercel Production and Preview scopes. Replace bracketed values with your secrets.

```bash
DATABASE_URL="postgresql://postgres.vznfshbclyjkvaxnnsnz:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vznfshbclyjkvaxnnsnz:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://vznfshbclyjkvaxnnsnz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[SUPABASE_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SUPABASE_SERVICE_ROLE_KEY]"

RESEND_FROM_EMAIL="Mei by Mithra <hello@meibymithra.com>"
RESEND_API_KEY="[RESEND_API_KEY]"
SITE_URL="https://[YOUR-PRODUCTION-DOMAIN]"

ADMIN_EMAILS="meibymithra@gmail.com"
CAL_BOOKING_URL="[CAL_BOOKING_URL]"
NEXT_PUBLIC_CAL_BOOKING_URL="[NEXT_PUBLIC_CAL_BOOKING_URL]"
CAL_WEBHOOK_SECRET="[CAL_WEBHOOK_SECRET]"

RAZORPAY_PAYMENT_LINK="[RAZORPAY_PAYMENT_LINK]"
STRIPE_PAYMENT_LINK="[STRIPE_PAYMENT_LINK]"

WHATSAPP_API_KEY="[WHATSAPP_API_KEY]"
WHATSAPP_SENDER="[WHATSAPP_SENDER]"
```

Deploy-time seed values:

```bash
ADMIN_SEED_PASSWORD="[ADMIN_SEED_PASSWORD]"
ADMIN_RECOVERY_EMAIL="meibymithra.recovery@gmail.com"
```

## Recommended Vercel setup

1. Create the Supabase project and copy the Postgres connection strings.
2. Add the environment variables above to Vercel.
3. Set `SITE_URL` to the production domain, for example `https://mei-by-mithra.vercel.app` or your custom domain.
4. Deploy the app from the GitHub repo. No separate backend host is required.
5. The production build command runs generate, migrations, seed, and `next build` automatically:

```bash
npm run build
```

During the `next build` step, the script prefers `DIRECT_URL` for build-time database reads when that variable is present. Runtime traffic still uses `DATABASE_URL`.

6. If you want to verify the seeded admin after deployment or locally, run:

```bash
npm run prisma:verify-admin
```

## Email and auth flow

- Supabase Auth handles admin sign-in.
- Prisma stores the matching `AdminUser` row.
- The deployment seed creates or refreshes both records on every deploy using idempotent upserts.
- Resend sends intake, invoice, and feedback emails.
- If `RESEND_API_KEY` is missing, the app still runs locally and records mock email logs.

## What lives where

- Vercel: public site, admin dashboard, API routes, webhook handlers, and server actions.
- Supabase: Postgres database and admin authentication.
- Resend: transactional email.
- Cal.com, Razorpay, Stripe: external integrations called by the app.
- See [`docs/SUPABASE.md`](SUPABASE.md) for the linked project ref and Prisma workflow.

## Cal.com

- `CAL_BOOKING_URL` or `NEXT_PUBLIC_CAL_BOOKING_URL` powers the booking embed.
- `CAL_WEBHOOK_SECRET` should match the value configured in Cal.com webhooks.

## Common failure points

- Missing `DATABASE_URL` in production will now fail fast.
- Missing Supabase env vars will break admin auth.
- Missing `SITE_URL` will make email links fall back to `http://localhost:3000`.
- Missing `ADMIN_SEED_PASSWORD` or `ADMIN_RECOVERY_EMAIL` will block the deployment seed step.
