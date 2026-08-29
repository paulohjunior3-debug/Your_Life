"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function iniciarTreino(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const templateId = String(formData.get("template_id"));
  const data = String(formData.get("data"));

  const { data: sessao, error } = await supabase
    .from("sessions")
    .upsert(
      { user_id: user.id, template_id: templateId, data },
      { onConflict: "user_id,template_id,data" }
    )
    .select("id")
    .single();

  if (error || !sessao) {
    redirect(
      `/treino?erro=${encodeURIComponent(
        error?.message ?? "Erro ao iniciar treino"
      )}`
    );
  }

  // Sincroniza as séries da sessão com o estado atual da ficha — cobre
  // tanto a primeira vez (cria tudo do zero) quanto reabrir depois de
  // editar a ficha (adiciona séries novas, remove as que saíram do
  // treino), sem apagar carga/reps já preenchidos nas séries que
  // continuam existindo.
  const [{ data: templateExercises }, { data: existingSets }] =
    await Promise.all([
      supabase
        .from("template_exercises")
        .select("exercise_id, series, ordem")
        .eq("template_id", templateId)
        .order("ordem"),
      supabase
        .from("session_sets")
        .select("id, exercise_id, serie_num")
        .eq("session_id", sessao.id),
    ]);

  const existentes = new Map(
    (existingSets ?? []).map((s) => [`${s.exercise_id}:${s.serie_num}`, s.id])
  );

  const chavesDesejadas = new Set<string>();
  const paraInserir: {
    session_id: string;
    exercise_id: string;
    serie_num: number;
    concluida: boolean;
  }[] = [];

  for (const te of templateExercises ?? []) {
    for (let i = 1; i <= te.series; i++) {
      const chave = `${te.exercise_id}:${i}`;
      chavesDesejadas.add(chave);
      if (!existentes.has(chave)) {
        paraInserir.push({
          session_id: sessao.id,
          exercise_id: te.exercise_id,
          serie_num: i,
          concluida: false,
        });
      }
    }
  }

  if (paraInserir.length > 0) {
    await supabase.from("session_sets").insert(paraInserir);
  }

  const idsParaRemover = (existingSets ?? [])
    .filter((s) => !chavesDesejadas.has(`${s.exercise_id}:${s.serie_num}`))
    .map((s) => s.id);

  if (idsParaRemover.length > 0) {
    await supabase.from("session_sets").delete().in("id", idsParaRemover);
  }

  redirect(`/treino/sessao/${sessao.id}`);
}
