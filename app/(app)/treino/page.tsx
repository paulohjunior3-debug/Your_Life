import Link from "next/link";
import { Dumbbell, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type TemplateComExercicios = {
  id: string;
  nome: string;
  template_exercises: {
    id: string;
    series: number;
    rep_min: number;
    rep_max: number;
    ordem: number;
    exercises: {
      id: string;
      nome: string;
      grupo_muscular: string | null;
      gif_url: string | null;
    } | null;
  }[];
};

export default async function TreinoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("workout_templates")
    .select(
      "id, nome, template_exercises(id, series, rep_min, rep_max, ordem, exercises(id, nome, grupo_muscular, gif_url))"
    )
    .eq("criado_por", user?.id ?? "")
    .order("nome");

  const templates = (data ?? []) as unknown as TemplateComExercicios[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Treino</h1>
        <Link
          href="/treino/adicionar"
          className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          <Plus size={16} />
          Exercício
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-foreground-secondary">
          Nenhum treino montado ainda. Toca em &quot;Exercício&quot; pra
          começar a adicionar os exercícios que seu personal passou.
        </div>
      ) : (
        templates.map((template) => (
          <div key={template.id} className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground-secondary">
              {template.nome}
            </h2>
            <div className="flex flex-col gap-2">
              {[...template.template_exercises]
                .sort((a, b) => a.ordem - b.ordem)
                .map((te) => (
                  <div
                    key={te.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-foreground-secondary">
                      {te.exercises?.gif_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={te.exercises.gif_url}
                          alt={te.exercises.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Dumbbell size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{te.exercises?.nome}</p>
                      <p className="text-xs text-foreground-secondary">
                        {te.series}x{te.rep_min}
                        {te.rep_min !== te.rep_max ? `-${te.rep_max}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
