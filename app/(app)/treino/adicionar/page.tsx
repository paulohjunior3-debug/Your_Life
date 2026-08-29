import { createClient } from "@/lib/supabase/server";
import { ExerciseBrowser } from "./exercise-browser";

export default async function AdicionarExercicioPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, nome, grupo_muscular, gif_url")
    .order("grupo_muscular")
    .order("nome");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">
        Adicionar exercício
      </h1>
      <ExerciseBrowser exercises={exercises ?? []} />
    </div>
  );
}
