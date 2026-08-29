import { createClient } from "@/lib/supabase/server";
import { MontarTreinoWizard } from "./wizard";

export default async function MontarTreinoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, nome, grupo_muscular, gif_url")
    .order("grupo_muscular")
    .order("nome");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">Montar treino</h1>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <MontarTreinoWizard exercises={exercises ?? []} />
    </div>
  );
}
