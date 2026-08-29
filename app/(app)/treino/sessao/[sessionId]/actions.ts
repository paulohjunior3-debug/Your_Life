"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StatusSessao } from "@/lib/supabase/types";

export async function atualizarSerie(
  sessionSetId: string,
  update: Partial<{
    carga_kg: number | null;
    reps: number | null;
    concluida: boolean;
  }>
) {
  const supabase = await createClient();
  await supabase.from("session_sets").update(update).eq("id", sessionSetId);
}

export async function finalizarSessao(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const supabase = await createClient();

  const { data: sets } = await supabase
    .from("session_sets")
    .select("concluida")
    .eq("session_id", sessionId);

  const total = sets?.length ?? 0;
  const feitas = sets?.filter((s) => s.concluida).length ?? 0;

  const status: StatusSessao =
    total > 0 && feitas === total
      ? "completo"
      : feitas > 0
        ? "parcial"
        : "nao_realizado";

  await supabase.from("sessions").update({ status }).eq("id", sessionId);

  revalidatePath("/treino");
  revalidatePath("/inicio");
  redirect("/treino");
}
