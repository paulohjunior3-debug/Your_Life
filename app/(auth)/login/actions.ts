"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/site-url";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    redirect(`/login?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/inicio");
}

export async function loginComGoogle() {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?erro=${encodeURIComponent(error?.message ?? "Falha ao iniciar login com Google")}`);
  }

  redirect(data.url);
}
