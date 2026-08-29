"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/site-url";

export async function solicitarRecuperacao(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/redefinir-senha`,
    });
  }

  // Sempre mostra sucesso, mesmo se o e-mail não existir — evita revelar
  // pra quem tentar quais e-mails estão cadastrados no app.
  redirect("/esqueci-senha?sucesso=1");
}
