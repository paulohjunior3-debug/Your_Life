"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDataHojeBrasil, getInicioSemanaBrasil } from "@/lib/utils/data-brasil";

export async function registrarPeso(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const pesoStr = String(formData.get("peso_kg") ?? "").replace(",", ".");
  const peso = Number(pesoStr);

  if (!pesoStr || Number.isNaN(peso) || peso <= 0) {
    redirect(
      `/acompanhamento?erro=${encodeURIComponent("Informe um peso válido")}`
    );
  }

  const { error } = await supabase.from("body_logs").upsert(
    {
      user_id: user.id,
      data: getDataHojeBrasil(),
      semana: getInicioSemanaBrasil(),
      peso_kg: peso,
    },
    { onConflict: "user_id,semana" }
  );

  if (error) {
    redirect(`/acompanhamento?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/acompanhamento");
  revalidatePath("/inicio");
  redirect("/acompanhamento?sucesso=1");
}
