"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Dumbbell } from "lucide-react";
import type { Database, DiaSemana } from "@/lib/supabase/types";
import { DIAS_SEMANA, nomeDia } from "@/lib/utils/dias-semana";
import { salvarFichaTreino } from "./actions";

type Exercise = Pick<
  Database["public"]["Tables"]["exercises"]["Row"],
  "id" | "nome" | "grupo_muscular" | "gif_url"
>;

type Fase = "dias" | "musculo" | "exercicios" | "resumo";

type ExercicioPlano = { exercicio_id: string; series: number };

type Plano = Partial<Record<DiaSemana, ExercicioPlano[]>>;

const cardBase =
  "rounded-xl border border-border bg-card p-3 transition-colors";

export function MontarTreinoWizard({ exercises }: { exercises: Exercise[] }) {
  const [fase, setFase] = useState<Fase>("dias");
  const [diasSelecionados, setDiasSelecionados] = useState<DiaSemana[]>([]);
  const [diaIndex, setDiaIndex] = useState(0);
  const [gruposSelecionados, setGruposSelecionados] = useState<string[]>([]);
  const [exerciciosTemp, setExerciciosTemp] = useState<string[]>([]);
  const [buscaExercicio, setBuscaExercicio] = useState("");
  const [plano, setPlano] = useState<Plano>({});
  const [editandoDoResumo, setEditandoDoResumo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const grupos = useMemo(() => {
    const set = new Set<string>();
    for (const ex of exercises) {
      if (ex.grupo_muscular) set.add(ex.grupo_muscular);
    }
    return Array.from(set).sort();
  }, [exercises]);

  const exerciciosPorGrupoSelecionado = useMemo(() => {
    const termo = buscaExercicio.trim().toLowerCase();
    const map = new Map<string, Exercise[]>();
    for (const grupo of gruposSelecionados) {
      const lista = exercises.filter(
        (ex) =>
          ex.grupo_muscular === grupo &&
          (termo === "" || ex.nome.toLowerCase().includes(termo))
      );
      if (lista.length > 0) map.set(grupo, lista);
    }
    return map;
  }, [exercises, gruposSelecionados, buscaExercicio]);

  const diaAtual = diasSelecionados[diaIndex];

  function alternarDia(dia: DiaSemana) {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  }

  function iniciarMontagem() {
    const ordenados = DIAS_SEMANA.map((d) => d.id).filter((d) =>
      diasSelecionados.includes(d)
    );
    setDiasSelecionados(ordenados);
    setDiaIndex(0);
    setFase("musculo");
  }

  function alternarGrupo(grupo: string) {
    setGruposSelecionados((prev) =>
      prev.includes(grupo) ? prev.filter((g) => g !== grupo) : [...prev, grupo]
    );
  }

  function confirmarGrupos() {
    setExerciciosTemp([]);
    setBuscaExercicio("");
    setFase("exercicios");
  }

  function alternarExercicio(id: string) {
    setExerciciosTemp((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  function proximoDia() {
    if (editandoDoResumo) {
      setEditandoDoResumo(false);
      setFase("resumo");
      return;
    }
    if (diaIndex + 1 < diasSelecionados.length) {
      setDiaIndex((i) => i + 1);
      setGruposSelecionados([]);
      setFase("musculo");
    } else {
      setFase("resumo");
    }
  }

  function confirmarExercicios() {
    setPlano((prev) => ({
      ...prev,
      [diaAtual]: [
        ...(prev[diaAtual] ?? []),
        ...exerciciosTemp.map((id) => ({ exercicio_id: id, series: 3 })),
      ],
    }));
    proximoDia();
  }

  function editarDia(dia: DiaSemana) {
    setPlano((prev) => ({ ...prev, [dia]: [] }));
    setDiaIndex(diasSelecionados.indexOf(dia));
    setGruposSelecionados([]);
    setEditandoDoResumo(true);
    setFase("musculo");
  }

  function ajustarSeries(dia: DiaSemana, exercicioId: string, delta: number) {
    setPlano((prev) => ({
      ...prev,
      [dia]: (prev[dia] ?? []).map((item) =>
        item.exercicio_id === exercicioId
          ? { ...item, series: Math.max(1, Math.min(10, item.series + delta)) }
          : item
      ),
    }));
  }

  async function concluir() {
    setEnviando(true);
    setErroEnvio(null);
    try {
      await salvarFichaTreino(plano);
    } catch (err) {
      // redirect() lança um erro especial do Next que não deve ser tratado
      // como falha — só re-lançamos falhas de verdade.
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        String((err as { digest?: unknown }).digest).startsWith(
          "NEXT_REDIRECT"
        )
      ) {
        throw err;
      }
      setErroEnvio("Não foi possível salvar a ficha. Tenta de novo.");
      setEnviando(false);
    }
  }

  if (fase === "dias") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-foreground-secondary">
          Escolhe os dias que você vai treinar nessa ficha.
        </p>

        <div className="grid grid-cols-4 gap-2">
          {DIAS_SEMANA.map((dia) => {
            const selecionado = diasSelecionados.includes(dia.id);
            return (
              <button
                key={dia.id}
                type="button"
                onClick={() => alternarDia(dia.id)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-sm font-medium transition-colors ${
                  selecionado
                    ? "border-accent bg-accent text-background"
                    : "border-border bg-card text-foreground hover:bg-surface"
                }`}
              >
                {selecionado && <Check size={16} />}
                {dia.curto}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={diasSelecionados.length === 0}
          onClick={iniciarMontagem}
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          Continuar
        </button>
      </div>
    );
  }

  if (fase === "musculo") {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            if (editandoDoResumo) {
              setEditandoDoResumo(false);
              setFase("resumo");
            } else {
              setFase("dias");
            }
          }}
          className="flex w-fit items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
        >
          <ChevronLeft size={16} />
          {editandoDoResumo ? "Voltar ao resumo" : "Escolher dias de novo"}
        </button>

        <div>
          <p className="text-xs text-foreground-secondary">
            Dia {diaIndex + 1} de {diasSelecionados.length}
          </p>
          <h2 className="text-lg font-semibold text-foreground">
            {nomeDia(diaAtual)}
          </h2>
        </div>

        <p className="text-sm text-foreground-secondary">
          Quais grupos musculares você vai treinar nesse dia?
        </p>

        <div className="flex flex-col gap-2">
          {grupos.map((grupo) => {
            const selecionado = gruposSelecionados.includes(grupo);
            return (
              <button
                key={grupo}
                type="button"
                onClick={() => alternarGrupo(grupo)}
                className={`${cardBase} flex items-center justify-between text-left ${
                  selecionado ? "border-accent" : "hover:bg-surface"
                }`}
              >
                <span className="text-foreground">{grupo}</span>
                {selecionado && <Check size={18} className="text-accent" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={gruposSelecionados.length === 0}
          onClick={confirmarGrupos}
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          Continuar
        </button>
      </div>
    );
  }

  if (fase === "exercicios") {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setFase("musculo")}
          className="flex w-fit items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
        >
          <ChevronLeft size={16} />
          Trocar grupos musculares
        </button>

        <div>
          <p className="text-xs text-foreground-secondary">
            {nomeDia(diaAtual)}
          </p>
          <h2 className="text-lg font-semibold text-foreground">
            Escolhe os exercícios
          </h2>
        </div>

        <input
          type="text"
          placeholder="Buscar exercício..."
          value={buscaExercicio}
          onChange={(e) => setBuscaExercicio(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
        />

        {buscaExercicio.trim() !== "" &&
          exerciciosPorGrupoSelecionado.size === 0 && (
            <p className="text-center text-sm text-foreground-secondary">
              Nenhum exercício encontrado.
            </p>
          )}

        {Array.from(exerciciosPorGrupoSelecionado.entries()).map(
          ([grupo, lista]) => (
            <div key={grupo} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-foreground-secondary">
                {grupo}
              </h3>
              <div className="flex flex-col gap-2">
                {lista.map((ex) => {
                  const selecionado = exerciciosTemp.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => alternarExercicio(ex.id)}
                      className={`${cardBase} flex items-center gap-3 text-left ${
                        selecionado ? "border-accent" : "hover:bg-surface"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-foreground-secondary">
                        {ex.gif_url ? (
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
                      <span className="flex-1 text-foreground">{ex.nome}</span>
                      {selecionado && (
                        <Check size={18} className="text-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}

        <button
          type="button"
          disabled={exerciciosTemp.length === 0}
          onClick={confirmarExercicios}
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          {editandoDoResumo
            ? `Salvar (${exerciciosTemp.length})`
            : diaIndex + 1 < diasSelecionados.length
              ? `Confirmar e ir pro próximo dia (${exerciciosTemp.length})`
              : `Confirmar (${exerciciosTemp.length})`}
        </button>
      </div>
    );
  }

  // fase === "resumo"
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">
        Confira sua ficha
      </h2>

      {erroEnvio && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erroEnvio}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {diasSelecionados.map((dia) => {
          const itens = plano[dia] ?? [];
          return (
            <div key={dia} className={cardBase}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{nomeDia(dia)}</p>
                <button
                  type="button"
                  onClick={() => editarDia(dia)}
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Editar
                </button>
              </div>
              {itens.length === 0 ? (
                <p className="text-sm text-foreground-secondary">
                  Nenhum exercício adicionado.
                </p>
              ) : (
                <ul className="mt-2 flex flex-col gap-2">
                  {itens.map((item) => {
                    const nome =
                      exercises.find((e) => e.id === item.exercicio_id)
                        ?.nome ?? item.exercicio_id;
                    return (
                      <li
                        key={item.exercicio_id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="flex-1 text-sm text-foreground">
                          {nome}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              ajustarSeries(dia, item.exercicio_id, -1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-surface"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm text-foreground">
                            {item.series}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              ajustarSeries(dia, item.exercicio_id, 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-surface"
                          >
                            +
                          </button>
                          <span className="text-xs text-foreground-secondary">
                            séries
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={enviando}
        onClick={concluir}
        className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
      >
        {enviando ? "Salvando..." : "Concluir"}
      </button>

      <Link
        href="/treino"
        className="text-center text-sm text-foreground-secondary hover:text-foreground"
      >
        Cancelar
      </Link>
    </div>
  );
}
