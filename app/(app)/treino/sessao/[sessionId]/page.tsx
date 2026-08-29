import Link from "next/link";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SerieRow } from "./serie-row";
import { finalizarSessao } from "./actions";

type SessionSetRow = {
  id: string;
  exercise_id: string;
  serie_num: number;
  carga_kg: number | null;
  reps: number | null;
  concluida: boolean;
  exercises: {
    id: string;
    nome: string;
    gif_url: string | null;
    grupo_muscular: string | null;
  } | null;
};

export default async function SessaoPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: sessaoData } = await supabase
    .from("sessions")
    .select("id, data, status, template_id, workout_templates(nome)")
    .eq("id", sessionId)
    .single();

  const sessao = sessaoData as unknown as {
    id: string;
    data: string;
    status: string;
    template_id: string | null;
    workout_templates: { nome: string } | null;
  } | null;

  if (!sessao) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-sm text-foreground-secondary">
          Treino não encontrado.
        </p>
        <Link
          href="/treino"
          className="text-center text-accent hover:text-accent-hover"
        >
          Voltar
        </Link>
      </div>
    );
  }

  const [{ data: sets }, { data: templateExercises }, { data: sessaoAnterior }] =
    await Promise.all([
      supabase
        .from("session_sets")
        .select(
          "id, exercise_id, serie_num, carga_kg, reps, concluida, exercises(id, nome, gif_url, grupo_muscular)"
        )
        .eq("session_id", sessionId)
        .order("serie_num"),
      supabase
        .from("template_exercises")
        .select("exercise_id, ordem, rep_min, rep_max")
        .eq("template_id", sessao.template_id ?? ""),
      sessao.template_id
        ? supabase
            .from("sessions")
            .select("session_sets(exercise_id, serie_num, carga_kg, reps)")
            .eq("template_id", sessao.template_id)
            .lt("data", sessao.data)
            .order("data", { ascending: false })
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const ordemPorExercicio = new Map(
    (templateExercises ?? []).map((te) => [te.exercise_id, te.ordem])
  );
  const repRangePorExercicio = new Map(
    (templateExercises ?? []).map((te) => [
      te.exercise_id,
      { rep_min: te.rep_min, rep_max: te.rep_max },
    ])
  );

  const referencia = new Map<
    string,
    { carga_kg: number | null; reps: number | null }
  >();
  const anterior = sessaoAnterior as unknown as {
    session_sets: {
      exercise_id: string;
      serie_num: number;
      carga_kg: number | null;
      reps: number | null;
    }[];
  } | null;
  const setsAnteriores = anterior?.session_sets ?? [];
  for (const s of setsAnteriores) {
    referencia.set(`${s.exercise_id}:${s.serie_num}`, {
      carga_kg: s.carga_kg,
      reps: s.reps,
    });
  }

  const setsOrdenados = ((sets ?? []) as unknown as SessionSetRow[]).sort(
    (a, b) => {
      const ordemA = ordemPorExercicio.get(a.exercise_id) ?? 0;
      const ordemB = ordemPorExercicio.get(b.exercise_id) ?? 0;
      return ordemA - ordemB || a.serie_num - b.serie_num;
    }
  );

  const porExercicio = new Map<string, SessionSetRow[]>();
  for (const s of setsOrdenados) {
    const lista = porExercicio.get(s.exercise_id) ?? [];
    lista.push(s);
    porExercicio.set(s.exercise_id, lista);
  }

  const template = sessao.workout_templates;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/treino"
        className="flex w-fit items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
      >
        <ChevronLeft size={16} />
        Treino
      </Link>

      <h1 className="text-xl font-semibold text-foreground">
        {template?.nome ?? "Treino"}
      </h1>

      <div className="flex flex-col gap-4">
        {Array.from(porExercicio.entries()).map(([exerciseId, setsDoExercicio]) => {
          const exercicio = setsDoExercicio[0].exercises;
          const repRange = repRangePorExercicio.get(exerciseId);
          return (
            <div
              key={exerciseId}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-foreground-secondary">
                  {exercicio?.gif_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={exercicio.gif_url}
                      alt={exercicio.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Dumbbell size={20} />
                  )}
                </div>
                <div>
                  <p className="text-foreground">{exercicio?.nome}</p>
                  {repRange && (
                    <p className="text-xs text-foreground-secondary">
                      Alvo: {repRange.rep_min}-{repRange.rep_max} reps
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {setsDoExercicio.map((s) => (
                  <SerieRow
                    key={s.id}
                    sessionSetId={s.id}
                    serieNum={s.serie_num}
                    cargaInicial={s.carga_kg}
                    repsInicial={s.reps}
                    concluidaInicial={s.concluida}
                    referencia={
                      referencia.get(`${s.exercise_id}:${s.serie_num}`) ?? null
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <form action={finalizarSessao}>
        <input type="hidden" name="session_id" value={sessao.id} />
        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Concluir treino
        </button>
      </form>
    </div>
  );
}
