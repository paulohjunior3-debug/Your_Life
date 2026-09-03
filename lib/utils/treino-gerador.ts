import type { Biotipo, DiaSemana, Objetivo } from "@/lib/supabase/types";

const PUSH = ["Peito", "Ombros", "Tríceps"];
const PULL = ["Costas", "Bíceps", "Antebraço"];
const LEGS = ["Quadríceps", "Posterior", "Panturrilha"];

const SPLITS: Record<number, string[][]> = {
  1: [["Peito", "Costas", "Quadríceps", "Ombros", "Bíceps", "Tríceps"]],
  2: [
    ["Peito", "Costas", "Ombros", "Bíceps", "Tríceps"],
    ["Quadríceps", "Posterior", "Panturrilha", "Glúteos"],
  ],
  3: [PUSH, PULL, LEGS],
  4: [
    ["Peito", "Tríceps"],
    ["Costas", "Bíceps"],
    ["Quadríceps", "Posterior", "Panturrilha", "Glúteos"],
    ["Ombros", "Abdômen"],
  ],
  5: [
    ["Peito"],
    ["Costas"],
    ["Quadríceps", "Posterior", "Panturrilha", "Glúteos"],
    ["Ombros"],
    ["Bíceps", "Tríceps", "Abdômen"],
  ],
  6: [PUSH, PULL, LEGS, PUSH, PULL, LEGS],
};

const GRUPOS_ACESSORIOS = new Set([
  "Panturrilha",
  "Antebraço",
  "Abdômen",
  "Adutores/Abdutores",
  "Trapézio",
]);

/** Grupos musculares de cada dia, na ordem dos dias selecionados. */
export function splitParaDias(numDias: number): string[][] {
  const base = SPLITS[Math.min(Math.max(numDias, 1), 6)];
  return Array.from({ length: numDias }, (_, i) => base[i % base.length]);
}

function quantidadeExercicios(grupo: string, gruposNoDia: number): number {
  if (GRUPOS_ACESSORIOS.has(grupo)) return 1;
  return gruposNoDia <= 3 ? 2 : 1;
}

const PARAMS_POR_OBJETIVO: Record<
  Objetivo,
  { series: number; repMin: number; repMax: number }
> = {
  hipertrofia: { series: 4, repMin: 8, repMax: 12 },
  ganho: { series: 4, repMin: 8, repMax: 12 },
  emagrecimento: { series: 3, repMin: 12, repMax: 15 },
  perda: { series: 3, repMin: 12, repMax: 15 },
  definicao: { series: 3, repMin: 12, repMax: 15 },
  manutencao: { series: 3, repMin: 10, repMax: 12 },
  forca: { series: 5, repMin: 4, repMax: 6 },
  condicionamento: { series: 3, repMin: 15, repMax: 20 },
};

/**
 * Ajuste leve por biotipo (só personalização de volume, sem qualquer
 * pretensão diagnóstica): ecto tolera mais séries, endo um pouco menos.
 */
function seriesPorBiotipo(base: number, biotipo: Biotipo | null): number {
  const delta = biotipo === "ectomorfo" ? 1 : biotipo === "endomorfo" ? -1 : 0;
  return Math.min(6, Math.max(2, base + delta));
}

/** Séries/reps sugeridas pro objetivo + biotipo, pra usar ao gravar as
 * template_exercises geradas (rep_min/rep_max não variam por exercício,
 * só por objetivo). */
export function parametrosTreino(
  objetivo: Objetivo,
  biotipo: Biotipo | null
): { series: number; repMin: number; repMax: number } {
  const base = PARAMS_POR_OBJETIVO[objetivo] ?? PARAMS_POR_OBJETIVO.hipertrofia;
  return {
    series: seriesPorBiotipo(base.series, biotipo),
    repMin: base.repMin,
    repMax: base.repMax,
  };
}

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export type ExercicioCatalogo = { id: string; grupo_muscular: string | null };

export type PlanoDia = {
  dia: DiaSemana;
  exercicios: { exercise_id: string; series: number }[];
};

/**
 * Monta o plano semanal completo: pra cada dia selecionado, escolhe os
 * grupos musculares do split e sorteia exercícios de cada grupo dentro do
 * catálogo disponível. Grupos sem nenhum exercício cadastrado são pulados
 * (não quebra a geração, só fica com um dia mais curto).
 */
export function montarPlano(
  dias: DiaSemana[],
  objetivo: Objetivo,
  biotipo: Biotipo | null,
  catalogo: ExercicioCatalogo[]
): PlanoDia[] {
  const porGrupo = new Map<string, string[]>();
  for (const ex of catalogo) {
    if (!ex.grupo_muscular) continue;
    const lista = porGrupo.get(ex.grupo_muscular) ?? [];
    lista.push(ex.id);
    porGrupo.set(ex.grupo_muscular, lista);
  }

  const { series } = parametrosTreino(objetivo, biotipo);

  const gruposPorDia = splitParaDias(dias.length);

  return dias.map((dia, i) => {
    const grupos = gruposPorDia[i];
    const exercicios: { exercise_id: string; series: number }[] = [];

    for (const grupo of grupos) {
      const disponiveis = porGrupo.get(grupo);
      if (!disponiveis || disponiveis.length === 0) continue;
      const qtd = Math.min(
        quantidadeExercicios(grupo, grupos.length),
        disponiveis.length
      );
      const escolhidos = embaralhar(disponiveis).slice(0, qtd);
      for (const exercise_id of escolhidos) {
        exercicios.push({ exercise_id, series });
      }
    }

    return { dia, exercicios };
  });
}
