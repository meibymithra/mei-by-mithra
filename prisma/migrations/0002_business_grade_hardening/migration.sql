-- Performance indexes for foreign keys flagged by advisors
CREATE INDEX "Client_createdByAdminId_idx" ON "Client"("createdByAdminId");
CREATE INDEX "Invoice_bookingId_idx" ON "Invoice"("bookingId");
CREATE INDEX "Invoice_adminId_idx" ON "Invoice"("adminId");
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX "Feedback_bookingId_idx" ON "Feedback"("bookingId");
CREATE INDEX "Testimonial_clientId_idx" ON "Testimonial"("clientId");

-- Explicit policies for exposed-schema tables.
-- Prisma and service-role/server-side access remain unchanged, while direct client API access is now intentional.
CREATE POLICY "deny_admin_user_api_access"
ON "AdminUser"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_client_api_access"
ON "Client"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_intake_api_access"
ON "IntakeForm"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_booking_api_access"
ON "Booking"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_invoice_api_access"
ON "Invoice"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_payment_api_access"
ON "Payment"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_feedback_api_access"
ON "Feedback"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_email_log_api_access"
ON "EmailLog"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_email_template_api_access"
ON "EmailTemplate"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_calendly_log_api_access"
ON "CalendlyWebhookLog"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_prisma_migrations_api_access"
ON "_prisma_migrations"
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "public_can_read_active_products"
ON "Product"
FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "deny_product_mutations_from_client_api"
ON "Product"
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "deny_product_updates_from_client_api"
ON "Product"
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_product_deletes_from_client_api"
ON "Product"
FOR DELETE
TO anon, authenticated
USING (false);

CREATE POLICY "public_can_read_published_testimonials"
ON "Testimonial"
FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "deny_testimonial_mutations_from_client_api"
ON "Testimonial"
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "deny_testimonial_updates_from_client_api"
ON "Testimonial"
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_testimonial_deletes_from_client_api"
ON "Testimonial"
FOR DELETE
TO anon, authenticated
USING (false);

CREATE POLICY "public_can_read_site_content"
ON "SiteContent"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "deny_site_content_mutations_from_client_api"
ON "SiteContent"
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "deny_site_content_updates_from_client_api"
ON "SiteContent"
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_site_content_deletes_from_client_api"
ON "SiteContent"
FOR DELETE
TO anon, authenticated
USING (false);
