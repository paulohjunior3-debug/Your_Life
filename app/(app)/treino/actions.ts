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

  const { count } = await supabase
    .from("session_sets")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessao.id);

  if (!count) {
    const { data: templateExercises } = await supabase
      .from("template_exercises")
      .select("exercise_id, series, ordem")
      .eq("template_id", templateId)
      .order("ordem");

    const rows = (templateExercises ?? []).flatMap((te) =>
      Array.from({ length: te.series }, (_, i) => ({
        session_id: sessao.id,
        exercise_id: te.exercise_id,
        serie_num: i + 1,
        concluida: false,
      }))
    );

    if (rows.length > 0) {
      await supabase.from("session_sets").insert(rows);
    }
  }

  redirect(`/treino/sessao/${sessao.id}`);
}
