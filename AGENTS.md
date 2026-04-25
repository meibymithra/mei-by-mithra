# AGENTS.md

## Project identity

This repository powers the brand website for `Mithra Krishnamoorthy` under the customer-facing brand `Mei by Mithra`.

This is not just a portfolio.

The public site must simultaneously:

- Position Mithra as a credible, distinctive personal brand
- Convert visitors into bookings and intake submissions
- Sell digital playbooks and resources
- Support an admin-operated workflow for bookings, invoices, feedback, testimonials, and CMS edits

## Product priorities

1. Brand clarity before generic wellness tropes
2. Calm, premium, editorial presentation aligned to the brand guideline
3. Friction-light conversion from discovery to booking or store purchase
4. Operational correctness for intake, feedback, invoicing, and admin moderation
5. Preserve the admin surface, but do not leak admin concepts into the public brand experience

## Brand rules

- Use the documented palette:
  - Rust `#B72E09`
  - Cream `#F5EEDC`
  - Sage `#84A18F`
  - Brown `#896C68`
  - Sand `#F4DDA7`
  - Coral `#ED8D75`
  - Beige `#EAC9AA`
- Use `Bantayog` for headings and `Playpen Sans` for supporting/body copy
- Keep the tone grounded, warm, human, and editorial
- Avoid default SaaS, therapy-template, or startup aesthetics

## Business rules

- Booking is handled through Calendly
- Availability is fixed:
  - Mon-Sat `7:30 PM - 8:30 PM` IST
  - Sun `8:30 AM - 8:30 PM` IST
- Calendly should remain usable for Indians living abroad by rendering in the viewer's local timezone
- First-time intake is sent automatically by email after booking
- Intake should cover:
  - Name
  - Age
  - Mobile number
  - Email
  - Emergency contact
  - Concern/context
  - Goals
  - Confidentiality acceptance
  - Terms acceptance
  - Single session vs package preference
- Sessions are pre-booked
- Clients may request bulk sessions/packages
- Payment is invoice-driven and may use direct payment links or manual invoice handling
- Feedback should be short, open-ended, and moderation-safe
- Testimonials are never auto-published

## Repo expectations

- Update docs when the workflow changes
- Preserve unrelated local changes
- Prefer design and UX changes that strengthen the brand site, not just the admin panel
- Keep build and type safety intact

## Important files

- `app/page.tsx`: homepage and public brand narrative
- `app/store/page.tsx`: storefront
- `app/book/page.tsx`: Calendly booking experience
- `app/intake/page.tsx`: intake experience
- `app/feedback/[token]/page.tsx`: post-session feedback
- `app/terms/page.tsx`: public expectations and terms
- `app/api/webhooks/calendly/route.ts`: booking automation
- `app/api/intake/route.ts`: intake submission
- `app/api/feedback/route.ts`: feedback capture
- `app/api/admin/invoices/route.ts`: invoice creation
- `docs/SYSTEM.md`: operational source of truth
- `docs/BRAND.md`: visual and messaging source of truth
