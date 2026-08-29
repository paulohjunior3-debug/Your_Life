"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DiaSemana } from "@/lib/supabase/types";
import { nomeDia } from "@/lib/utils/dias-semana";

export async function salvarFichaTreino(
  plano: Partial<Record<DiaSemana, string[]>>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  for (const [dia, exerciseIds] of Object.entries(plano) as [
    DiaSemana,
    string[],
  ][]) {
    if (!exerciseIds || exerciseIds.length === 0) continue;

    const { data: template, error: templateError } = await supabase
      .from("workout_templates")
      .upsert(
        { nome: nomeDia(dia), criado_por: user.id, dia_semana: dia },
        { onConflict: "criado_por,dia_semana" }
      )
      .select("id")
      .single();

    if (templateError || !template) {
      redirect(
        `/treino/montar?erro=${encodeURIComponent(
          templateError?.message ?? "Erro ao salvar treino"
        )}`
      );
    }

    // Substitui os exercícios desse dia (permite reeditar a ficha).
    await supabase
      .from("template_exercises")
      .delete()
      .eq("template_id", template.id);

    const rows = exerciseIds.map((exerciseId, index) => ({
      template_id: template.id,
      exercise_id: exerciseId,
      series: 3,
      rep_min: 8,
      rep_max: 12,
      ordem: index,
    }));

    const { error: insertError } = await supabase
      .from("template_exercises")
      .insert(rows);

    if (insertError) {
      redirect(
        `/treino/montar?erro=${encodeURIComponent(insertError.message)}`
      );
    }
  }

  revalidatePath("/treino");
  redirect("/treino");
}
