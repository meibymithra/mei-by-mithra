import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(132,161,143,0.2),transparent_28%),linear-gradient(180deg,rgba(245,238,220,1),rgba(245,238,220,0.9))]">
      <div className="container-wide flex min-h-screen items-center justify-center py-10">
        <Card className="surface w-full max-w-md">
          <CardContent className="space-y-6 p-6">
            <SectionHeading
              eyebrow="Admin only"
              title="Sign in"
              description="Use your Supabase Auth email and password. Access is further restricted by the AdminUser table."
            />
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
