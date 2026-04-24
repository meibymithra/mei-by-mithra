"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabaseConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginValues = typeof loginSchema._output;

export function AdminLoginForm({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const configReady = hasSupabaseConfig();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (!configReady) {
          setError("Admin login is not configured yet.");
          return;
        }
        setError(null);
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) {
          setError(error.message);
          return;
        }
        router.push("/admin");
        router.refresh();
      })}
    >
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" {...form.register("email")} disabled={disabled || !configReady} />
      </div>
      <div className="space-y-2">
        <Label>Password</Label>
        <Input type="password" {...form.register("password")} disabled={disabled || !configReady} />
      </div>
      <Button className="w-full" type="submit" disabled={disabled || !configReady}>
        Sign in
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
