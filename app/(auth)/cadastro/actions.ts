"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cadastrar(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");

  if (!nome) {
    redirect(`/cadastro?erro=${encodeURIComponent("Informe seu nome")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome },
    },
  });

  if (error) {
    redirect(`/cadastro?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/inicio");
}
