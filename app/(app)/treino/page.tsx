import { createClient } from "@/lib/supabase/server";

export default async function TreinoPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("workout_templates")
    .select("id, nome")
    .order("nome");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">Treino</h1>

      {!templates || templates.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-foreground-secondary">
          Nenhum treino cadastrado ainda. Peça para um admin cadastrar um
          template pelo Supabase Studio.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {templates.map((template) => (
            <li
              key={template.id}
              className="rounded-xl border border-border bg-card p-4 text-foreground"
            >
              {template.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
