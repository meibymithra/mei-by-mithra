# Supabase Operations

## Linked project

- Project ref: `vznfshbclyjkvaxnnsnz`
- Project URL: `https://vznfshbclyjkvaxnnsnz.supabase.co`
- `supabase init` completed
- `supabase link` completed

## What Supabase is used for

- PostgreSQL database
- Supabase Auth for the admin login
- Service role access for admin seeding and auth sync

## What is not using Supabase migrations

This repo uses Prisma as the schema source of truth.

- Prisma schema: `prisma/schema.prisma`
- Prisma migration history: `prisma/migrations/*`

Do not maintain a second schema source in Supabase SQL unless you intentionally want a separate database migration path.

## Database connection pattern

- `DATABASE_URL` should use the Supabase pooler connection for runtime
- `DIRECT_URL` should use the direct database connection for migrations and schema changes

Example:

```bash
DATABASE_URL="postgresql://postgres.vznfshbclyjkvaxnnsnz:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vznfshbclyjkvaxnnsnz:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

## Useful commands

```bash
npx supabase status
npx supabase link --project-ref vznfshbclyjkvaxnnsnz --password "YOUR_DATABASE_PASSWORD" --yes
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run prisma:verify-admin
```

## Seed flow

To create or refresh the seeded admin:

- Set `ADMIN_SEED_PASSWORD`
- Set `ADMIN_RECOVERY_EMAIL` if you want to override the default recovery email
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present
- Run `npm run prisma:seed`
- Confirm with `npm run prisma:verify-admin`

Production deploys also run the seed automatically through the build pipeline, so these values need to exist in the deployment environment.

## Notes

- The `supabase/.temp` directory is local CLI metadata and should stay untracked.
- The linked project metadata is stored locally so the Supabase CLI knows which project to target.
