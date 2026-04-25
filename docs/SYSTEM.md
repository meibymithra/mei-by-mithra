# Mei by Mithra System Docs

## What this repo is

This repository is the brand website and operations layer for `Mithra Krishnamoorthy`.

Publicly, it acts as:

- a brand website
- a portfolio for Mithra's work
- a booking surface
- an intake surface
- a digital storefront for playbooks

Operationally, it acts as:

- a client intake system
- a booking tracker
- an invoice trigger point
- a feedback and testimonial moderation system
- a small CMS/store admin

## Core product model

The public site and admin are one product, but they serve different audiences.

### Public

- Homepage: brand-first editorial narrative and core conversion routing
- About: profile, philosophy, and brand background
- Portfolio: work experience, qualifications, and institutional credibility
- Practice: services, process, and operating model
- Book: Calendly booking flow
- Intake: booking-linked structured intake
- Store: digital resource storefront
- Product pages: product details and payment intent
- Feedback: tokenized post-session feedback
- Terms: public expectations for booking, intake, packages, and testimonial moderation

### Admin

- Dashboard
- Clients
- Bookings
- Invoices
- Feedback moderation
- CMS
- Store management
- Email templates
- Calendly logs

## Business rules captured in the app

### Brand

- Customer-facing brand name: `Mei by Mithra`
- Person behind the brand: `Mithra Krishnamoorthy`
- Visual system follows the documented earth-tone palette and Bantayog/Playpen Sans typography

### Booking

- Booking is handled in Calendly
- Availability is fixed to:
  - Mon-Sat `7:30 PM - 8:30 PM` IST
  - Sun `8:30 AM - 8:30 PM` IST
- The booking surface is meant to work for Indians living abroad by allowing Calendly to render in the visitor's timezone

### Intake

- Intake is linked to a booking token
- Intake covers:
  - name
  - age
  - mobile number
  - email
  - emergency contact
  - concern
  - goals
  - prior support context
  - single session vs package preference
  - requested package size
  - timezone
  - confidentiality acceptance
  - terms acceptance
- Intake is the first automatic email triggered after a Calendly booking

### Sessions and packages

- Sessions are pre-booked
- Clients can indicate package intent
- Invoices support multiple sessions per client using `sessionCount`
- Admin can use invoice creation for bulk-session or package handling

### Payments

- Payment is invoice-driven
- Payment links can be direct or manual
- Store products can also fall back to manual invoice handling

### Feedback and testimonials

- Feedback is tokenized and post-session
- Feedback uses short, open-ended responses
- Feedback can optionally propose a short testimonial line
- Testimonials are always moderation-controlled and never auto-published

## Route map

- `/`: brand homepage
- `/about`: profile page
- `/portfolio`: work experience and credentials page
- `/practice`: service and process page
- `/store`: public storefront
- `/products/[slug]`: individual playbook page
- `/book`: Calendly booking
- `/intake`: structured intake
- `/feedback/[token]`: feedback page
- `/terms`: public terms
- `/admin/*`: protected admin surface

## Data model highlights

### Client

Stores core contact info, notes, tags, and relationships to bookings, invoices, intake forms, feedback, and testimonials.

### Booking

Stores Calendly linkage, scheduled time, status, intake token, feedback token, and session type.

### IntakeForm

Stores the booking-linked intake payload.

### Invoice

Stores session count, amount, currency, payment link, notes, and status.

### Feedback

Stores rating, open-ended feedback text, and testimonial consent.

### Testimonial

Stores moderated, publishable quote content.

### Product

Stores product metadata, pricing, payment link, and delivery URL.

## Operational flows

### Booking to intake

1. Visitor books through Calendly
2. Calendly webhook is received
3. Webhook log is written
4. Client record is created or updated
5. Booking record is created or updated
6. Intake email is sent automatically

### Intake to service

1. Client opens intake email
2. Client submits the tokenized intake form
3. Booking is updated with session type
4. Admin is notified
5. Admin prepares the next service step and invoice

### Invoice flow

1. Admin creates invoice from `/admin/invoices`
2. Session count can represent single or bulk bookings
3. Payment link email can be sent
4. Manual invoice fallback remains available

### Feedback flow

1. Admin marks a booking completed
2. Feedback request email is sent automatically
3. Client submits short feedback with open-ended fields
4. Admin reviews the submission
5. If appropriate, admin approves and publishes a testimonial

## Key implementation files

- `app/page.tsx`
- `app/store/page.tsx`
- `app/about/page.tsx`
- `app/practice/page.tsx`
- `app/book/page.tsx`
- `app/intake/page.tsx`
- `app/feedback/[token]/page.tsx`
- `app/terms/page.tsx`
- `app/api/webhooks/calendly/route.ts`
- `app/api/intake/route.ts`
- `app/api/feedback/route.ts`
- `app/api/admin/invoices/route.ts`
- `components/forms/intake-form.tsx`
- `components/forms/feedback-form.tsx`
- `emails/templates.tsx`
- `lib/constants.ts`
- `lib/validators.ts`

## Known design and product stance

- The public website must foreground Mithra and the brand, not admin mechanics
- Homepage should remain concise, editorial, and route visitors into dedicated pages
- Portfolio depth should live on its own page instead of dominating the homepage
- The store must feel like part of the brand ecosystem, not a disconnected catalogue
- The website should remain strong on mobile
- Motion should be memorable but should not compromise legibility or trust
