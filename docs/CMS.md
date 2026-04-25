# CMS Notes

## What the CMS is responsible for

The admin CMS is intentionally narrow. It is meant to manage the primary public copy blocks, not to become a full page-builder.

## Current editable content keys

- `homeHero`
- `aboutPage`
- `practicePage`
- `faqs`
- `store`

## Where these render

- `homeHero` -> `/`
- `aboutPage` -> `/about`
- `practicePage` -> `/practice`
- `faqs` -> homepage and practice page FAQ surfaces
- `store` -> `/store`

## Product listings

Product records are managed separately from page copy and are edited through the store admin pages.

## Operational intent

The CMS should support:

- copy refinement without code changes
- professional messaging updates
- changes to service language
- changes to homepage CTA language
- updates to About and Practice page narrative

It should not be used to:

- store secrets
- manage admin credentials
- replace product pricing logic
- replace booking configuration

## Admin credentials

The seeded admin email is fixed in the seed script:

- `meibymithra@gmail.com`

The seeded password is not committed to the repo and must be supplied through:

- `ADMIN_SEED_PASSWORD`

The recovery email is configured through:

- `ADMIN_RECOVERY_EMAIL`

## Recommendation

Use the CMS for messaging and structure changes.

Use environment variables and seed scripts for admin setup.

Use Prisma/admin product tools for commerce records.
