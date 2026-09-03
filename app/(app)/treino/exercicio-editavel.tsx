"use client";

import { useState } from "react";
import { Check, ChevronLeft, Dumbbell, Pencil, Trash2 } from "lucide-react";
import { atualizarExercicioTreino, removerExercicioTreino } from "./actions";

export type ExercicioCatalogo = {
  id: string;
  nome: string;
  grupo_muscular: string | null;
  gif_url: string | null;
};

export type TemplateExerciseComExercicio = {
  id: string;
  series: number;
  rep_min: number;
  rep_max: number;
  exercises: ExercicioCatalogo | null;
};

export function ExercicioEditavel({
  templateExercise,
  catalogo,
}: {
  templateExercise: TemplateExerciseComExercicio;
  catalogo: ExercicioCatalogo[];
}) {
  const [editando, setEditando] = useState(false);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [erroRemocao, setErroRemocao] = useState<string | null>(null);

  const ex = templateExercise.exercises;

  async function remover() {
    setRemovendo(true);
    const resultado = await removerExercicioTreino(templateExercise.id);
    if (resultado.error) {
      setErroRemocao(resultado.error);
      setRemovendo(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-foreground-secondary">
          {ex?.gif_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ex.gif_url}
              alt={ex.nome}
              className="h-full w-full object-cover"
            />
          ) : (
            <Dumbbell size={20} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-foreground">{ex?.nome ?? "Exercício removido"}</p>
          <p className="text-xs text-foreground-secondary">
            {templateExercise.series}x{templateExercise.rep_min}
            {templateExercise.rep_min !== templateExercise.rep_max
              ? `-${templateExercise.rep_max}`
              : ""}
          </p>
        </div>
        {ex && (
          <button
            type="button"
            onClick={() => setEditando(true)}
            aria-label="Editar exercício"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
          >
            <Pencil size={15} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setConfirmandoRemocao(true);
            setErroRemocao(null);
          }}
          aria-label="Remover exercício"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-status-missed/40 hover:text-status-missed"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {confirmandoRemocao && (
        <div className="flex flex-col gap-2 rounded-xl border border-status-missed/40 bg-status-missed/10 p-3">
          <p className="text-sm text-foreground">
            Remover {ex?.nome ?? "este exercício"} deste treino?
          </p>
          {erroRemocao && (
            <p className="text-xs text-status-missed">{erroRemocao}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmandoRemocao(false)}
              disabled={removendo}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-background disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={remover}
              disabled={removendo}
              className="flex-1 rounded-lg bg-status-missed px-3 py-1.5 text-sm font-medium text-background transition-colors disabled:opacity-40"
            >
              {removendo ? "Removendo..." : "Remover"}
            </button>
          </div>
        </div>
      )}

      {editando && ex && (
        <ModalEdicaoExercicio
          templateExerciseId={templateExercise.id}
          exercicioAtual={ex}
          series={templateExercise.series}
          repMin={templateExercise.rep_min}
          repMax={templateExercise.rep_max}
          catalogo={catalogo}
          onFechar={() => setEditando(false)}
        />
      )}
    </>
  );
}

function ModalEdicaoExercicio({
  templateExerciseId,
  exercicioAtual,
  series: seriesIniciais,
  repMin: repMinInicial,
  repMax: repMaxInicial,
  catalogo,
  onFechar,
}: {
  templateExerciseId: string;
  exercicioAtual: ExercicioCatalogo;
  series: number;
  repMin: number;
  repMax: number;
  catalogo: ExercicioCatalogo[];
  onFechar: () => void;
}) {
  const [fase, setFase] = useState<"form" | "escolher">("form");
  const [exercicio, setExercicio] = useState(exercicioAtual);
  const [series, setSeries] = useState(seriesIniciais);
  const [repMin, setRepMin] = useState(repMinInicial);
  const [repMax, setRepMax] = useState(repMaxInicial);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    if (repMax < repMin) {
      setErro("A repetição máxima não pode ser menor que a mínima");
      return;
    }
    setErro(null);
    setSalvando(true);
    const resultado = await atualizarExercicioTreino(templateExerciseId, {
      exercise_id: exercicio.id,
      series,
      rep_min: repMin,
      rep_max: repMax,
    });
    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
      return;
    }
    onFechar();
  }

  if (fase === "escolher") {
    const termo = busca.trim().toLowerCase();
    const listaFiltrada = catalogo.filter((c) =>
      termo === ""
        ? c.grupo_muscular === exercicio.grupo_muscular
        : c.nome.toLowerCase().includes(termo)
    );
    const porGrupo = new Map<string, ExercicioCatalogo[]>();
    for (const c of listaFiltrada) {
      const g = c.grupo_muscular ?? "Outros";
      if (!porGrupo.has(g)) porGrupo.set(g, []);
      porGrupo.get(g)!.push(c);
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <button
            type="button"
            onClick={() => setFase("form")}
            className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Buscar exercício..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {listaFiltrada.length === 0 && (
            <p className="text-center text-sm text-foreground-secondary">
              Nenhum exercício encontrado.
            </p>
          )}
          {Array.from(porGrupo.entries()).map(([grupo, lista]) => (
            <div key={grupo} className="mb-4 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                {grupo}
              </p>
              {lista.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setExercicio(c);
                    setFase("form");
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    c.id === exercicio.id
                      ? "border-accent"
                      : "border-border hover:bg-surface"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-foreground-secondary">
                    {c.gif_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.gif_url}
                        alt={c.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Dumbbell size={16} />
                    )}
                  </div>
                  <span className="flex-1 text-sm text-foreground">
                    {c.nome}
                  </span>
                  {c.id === exercicio.id && (
                    <Check size={16} className="text-accent" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">
          Editar exercício
        </h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {erro && (
          <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
            {erro}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-secondary">Exercício</span>
          <button
            type="button"
            onClick={() => setFase("escolher")}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card text-foreground-secondary">
              {exercicio.gif_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exercicio.gif_url}
                  alt={exercicio.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Dumbbell size={16} />
              )}
            </div>
            <span className="flex-1 text-foreground">{exercicio.nome}</span>
            <span className="text-xs font-medium text-accent">Trocar</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-secondary">Séries</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSeries((s) => Math.max(1, s - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface"
            >
              −
            </button>
            <span className="w-8 text-center text-lg text-foreground">
              {series}
            </span>
            <button
              type="button"
              onClick={() => setSeries((s) => Math.min(10, s + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="rep_min"
              className="text-sm text-foreground-secondary"
            >
              Repetições mín.
            </label>
            <input
              id="rep_min"
              type="number"
              min={1}
              value={repMin}
              onChange={(e) => setRepMin(Number(e.target.value))}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="rep_max"
              className="text-sm text-foreground-secondary"
            >
              Repetições máx.
            </label>
            <input
              id="rep_max"
              type="number"
              min={1}
              value={repMax}
              onChange={(e) => setRepMax(Number(e.target.value))}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-border bg-card p-4">
        <button
          type="button"
          onClick={onFechar}
          disabled={salvando}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-background disabled:opacity-40"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={salvar}
          disabled={salvando}
          className="flex-1 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
