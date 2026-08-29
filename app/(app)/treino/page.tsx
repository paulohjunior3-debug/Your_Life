import Link from "next/link";
import { Dumbbell, Pencil, Play, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { DiaSemana } from "@/lib/supabase/types";
import { nomeDia, ordemDia } from "@/lib/utils/dias-semana";
import { getDataHojeBrasil, getDiaSemanaHojeBrasil } from "@/lib/utils/data-brasil";
import { iniciarTreino } from "./actions";

type TemplateComExercicios = {
  id: string;
  nome: string;
  dia_semana: DiaSemana | null;
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
      "id, nome, dia_semana, template_exercises(id, series, rep_min, rep_max, ordem, exercises(id, nome, grupo_muscular, gif_url))"
    )
    .eq("criado_por", user?.id ?? "")
    .not("dia_semana", "is", null);

  const templates = (data ?? []) as unknown as TemplateComExercicios[];
  templates.sort((a, b) => ordemDia(a.dia_semana) - ordemDia(b.dia_semana));

  const temFicha = templates.length > 0;

  const diaHoje = getDiaSemanaHojeBrasil();
  const dataHoje = getDataHojeBrasil();
  const templateHoje = templates.find((t) => t.dia_semana === diaHoje);

  const { data: sessaoHoje } = templateHoje
    ? await supabase
        .from("sessions")
        .select("status")
        .eq("template_id", templateHoje.id)
        .eq("data", dataHoje)
        .maybeSingle()
    : { data: null };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Treino</h1>
        <Link
          href="/treino/montar"
          className="flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          {temFicha ? <Pencil size={16} /> : <Plus size={16} />}
          {temFicha ? "Editar treino" : "Montar treino"}
        </Link>
      </div>

      {templateHoje && (
        <form
          action={iniciarTreino}
          className="flex flex-col gap-2 rounded-2xl border border-accent/40 bg-card p-4"
        >
          <input type="hidden" name="template_id" value={templateHoje.id} />
          <input type="hidden" name="data" value={dataHoje} />
          <p className="text-xs text-foreground-secondary">
            Hoje é {nomeDia(diaHoje)}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {templateHoje.nome}
          </p>
          <button
            type="submit"
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
          >
            <Play size={16} />
            {sessaoHoje
              ? sessaoHoje.status === "completo"
                ? "Ver treino de hoje"
                : "Continuar treino de hoje"
              : "Iniciar treino de hoje"}
          </button>
        </form>
      )}

      {!temFicha ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-foreground-secondary">
          Nenhuma ficha montada ainda. Toca em &quot;Montar treino&quot; pra
          escolher os dias e os exercícios que seu personal passou.
        </div>
      ) : (
        templates.map((template) => (
          <div key={template.id} className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground-secondary">
              {template.dia_semana ? nomeDia(template.dia_semana) : template.nome}
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
