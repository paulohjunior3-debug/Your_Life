import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { adicionarExercicio } from "./actions";

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent";
const labelClass = "text-sm text-foreground-secondary";

export default async function ConfigurarExercicioPage({
  params,
  searchParams,
}: {
  params: Promise<{ exerciseId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { exerciseId } = await params;
  const { erro } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: exercise }, { data: templates }] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, nome, grupo_muscular, gif_url")
      .eq("id", exerciseId)
      .single(),
    supabase
      .from("workout_templates")
      .select("id, nome")
      .eq("criado_por", user?.id ?? "")
      .order("nome"),
  ]);

  if (!exercise) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-sm text-foreground-secondary">
          Exercício não encontrado.
        </p>
        <Link
          href="/treino/adicionar"
          className="text-center text-accent hover:text-accent-hover"
        >
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface text-foreground-secondary">
          {exercise.gif_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exercise.gif_url}
              alt={exercise.nome}
              className="h-full w-full object-cover"
            />
          ) : (
            <Dumbbell size={24} />
          )}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {exercise.nome}
          </h1>
          {exercise.grupo_muscular && (
            <p className="text-sm text-foreground-secondary">
              {exercise.grupo_muscular}
            </p>
          )}
        </div>
      </div>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <form action={adicionarExercicio} className="flex flex-col gap-3">
        <input type="hidden" name="exercise_id" value={exercise.id} />

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="series" className={labelClass}>
              Séries
            </label>
            <input
              id="series"
              name="series"
              type="number"
              min={1}
              required
              defaultValue={3}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rep_min" className={labelClass}>
              Rep. min
            </label>
            <input
              id="rep_min"
              name="rep_min"
              type="number"
              min={1}
              required
              defaultValue={8}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rep_max" className={labelClass}>
              Rep. max
            </label>
            <input
              id="rep_max"
              name="rep_max"
              type="number"
              min={1}
              required
              defaultValue={12}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="template_id" className={labelClass}>
            Adicionar ao treino (dia)
          </label>
          <select
            id="template_id"
            name="template_id"
            defaultValue=""
            className={inputClass}
          >
            <option value="">Selecione um treino existente</option>
            {(templates ?? []).map((template) => (
              <option key={template.id} value={template.id}>
                {template.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="novo_treino_nome" className={labelClass}>
            Ou criar um treino novo
          </label>
          <input
            id="novo_treino_nome"
            name="novo_treino_nome"
            type="text"
            placeholder='Ex.: "Membro Superior", "Segunda-feira"'
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
