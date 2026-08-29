"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function redefinirSenha(formData: FormData) {
  const senha = String(formData.get("senha") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (senha.length < 6) {
    redirect(
      `/redefinir-senha?erro=${encodeURIComponent(
        "A senha precisa ter pelo menos 6 caracteres"
      )}`
    );
  }

  if (senha !== confirmar) {
    redirect(
      `/redefinir-senha?erro=${encodeURIComponent("As senhas não coincidem")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    redirect(`/redefinir-senha?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/inicio");
}
