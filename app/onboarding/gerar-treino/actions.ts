"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DiaSemana } from "@/lib/supabase/types";
import { nomeDia } from "@/lib/utils/dias-semana";
import { montarPlano, parametrosTreino } from "@/lib/utils/treino-gerador";

export async function gerarTreinoAutomatico(dias: DiaSemana[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!dias || dias.length === 0) {
    redirect(
      `/onboarding/gerar-treino?erro=${encodeURIComponent(
        "Selecione pelo menos 1 dia"
      )}`
    );
  }

  const [{ data: profile }, { data: exercicios }] = await Promise.all([
    supabase
      .from("profiles")
      .select("objetivo, biotipo")
      .eq("id", user.id)
      .single(),
    supabase.from("exercises").select("id, grupo_muscular"),
  ]);

  const objetivo = profile?.objetivo ?? "hipertrofia";
  const biotipo = profile?.biotipo ?? null;
  const plano = montarPlano(dias, objetivo, biotipo, exercicios ?? []);
  const { repMin, repMax } = parametrosTreino(objetivo, biotipo);

  for (const diaPlano of plano) {
    if (diaPlano.exercicios.length === 0) continue;

    const { data: template, error: templateError } = await supabase
      .from("workout_templates")
      .upsert(
        {
          nome: nomeDia(diaPlano.dia),
          criado_por: user.id,
          dia_semana: diaPlano.dia,
        },
        { onConflict: "criado_por,dia_semana" }
      )
      .select("id")
      .single();

    if (templateError || !template) {
      redirect(
        `/onboarding/gerar-treino?erro=${encodeURIComponent(
          templateError?.message ?? "Erro ao gerar treino"
        )}`
      );
    }

    await supabase
      .from("template_exercises")
      .delete()
      .eq("template_id", template.id);

    const rows = diaPlano.exercicios.map((item, index) => ({
      template_id: template.id,
      exercise_id: item.exercise_id,
      series: item.series,
      rep_min: repMin,
      rep_max: repMax,
      ordem: index,
    }));

    const { error: insertError } = await supabase
      .from("template_exercises")
      .insert(rows);

    if (insertError) {
      redirect(
        `/onboarding/gerar-treino?erro=${encodeURIComponent(
          insertError.message
        )}`
      );
    }
  }

  revalidatePath("/treino");
  redirect("/treino");
}
