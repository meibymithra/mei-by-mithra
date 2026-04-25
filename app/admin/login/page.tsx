import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { hasSupabaseConfig } from "@/lib/config";
import { Lock, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const configReady = hasSupabaseConfig();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="surface overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">Admin Access</p>
                <p className="text-xs text-muted-foreground">Secure login required</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <SectionHeading
              eyebrow="Admin only"
              title="Sign in"
              description="Use the seeded Supabase admin account email and password."
            />
            {!configReady ? (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                <p className="text-sm leading-relaxed text-destructive">
                  Admin login is not fully configured yet. Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel, then reload.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-sage/30 bg-sage/5 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The admin password is created by the seed flow, not by runtime env loading alone. Run `npm run prisma:seed` after setting `ADMIN_SEED_PASSWORD`.
                </p>
              </div>
            )}
            <AdminLoginForm disabled={!configReady} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
