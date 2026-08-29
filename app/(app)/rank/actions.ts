"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function alternarParticipacao(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const novoAtivo = formData.get("ativo") !== "true";

  await supabase.from("race_optins").upsert(
    {
      user_id: user.id,
      ativo: novoAtivo,
      ativo_desde: novoAtivo ? new Date().toISOString() : null,
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/rank");
}
