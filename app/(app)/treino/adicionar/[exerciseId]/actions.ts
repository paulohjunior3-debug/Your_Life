"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function adicionarExercicio(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const exerciseId = String(formData.get("exercise_id"));
  const series = Number(formData.get("series"));
  const repMin = Number(formData.get("rep_min"));
  const repMax = Number(formData.get("rep_max"));
  const templateId = String(formData.get("template_id") ?? "");
  const novoTreinoNome = String(formData.get("novo_treino_nome") ?? "").trim();

  if (!novoTreinoNome && !templateId) {
    redirect(
      `/treino/adicionar/${exerciseId}?erro=${encodeURIComponent(
        "Selecione um treino existente ou dê um nome pro novo"
      )}`
    );
  }

  let finalTemplateId = templateId;

  if (novoTreinoNome) {
    const { data: novoTemplate, error: templateError } = await supabase
      .from("workout_templates")
      .insert({ nome: novoTreinoNome, criado_por: user.id })
      .select("id")
      .single();

    if (templateError || !novoTemplate) {
      redirect(
        `/treino/adicionar/${exerciseId}?erro=${encodeURIComponent(
          templateError?.message ?? "Erro ao criar treino"
        )}`
      );
    }

    finalTemplateId = novoTemplate.id;
  }

  const { count } = await supabase
    .from("template_exercises")
    .select("id", { count: "exact", head: true })
    .eq("template_id", finalTemplateId);

  const { error } = await supabase.from("template_exercises").insert({
    template_id: finalTemplateId,
    exercise_id: exerciseId,
    series,
    rep_min: repMin,
    rep_max: repMax,
    ordem: count ?? 0,
  });

  if (error) {
    redirect(
      `/treino/adicionar/${exerciseId}?erro=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/treino");
  redirect("/treino");
}
