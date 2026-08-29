import type { DiaSemana } from "@/lib/supabase/types";

const TIMEZONE = "America/Sao_Paulo";

const WEEKDAY_PARA_DIA_SEMANA: Record<string, DiaSemana> = {
  Monday: "segunda",
  Tuesday: "terca",
  Wednesday: "quarta",
  Thursday: "quinta",
  Friday: "sexta",
  Saturday: "sabado",
  Sunday: "domingo",
};

// Calcula "hoje" no fuso de Brasília em vez de usar `new Date()` cru — o
// servidor roda em UTC, e um cálculo ingênuo erraria o dia perto da
// virada da meia-noite (ver ESPECIFICACAO.md seção 7).
export function getDataHojeBrasil(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getDiaSemanaHojeBrasil(): DiaSemana {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
  }).format(new Date());
  return WEEKDAY_PARA_DIA_SEMANA[weekday];
}

const DIA_SEMANA_POR_INDICE: DiaSemana[] = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

function addDias(dataIso: string, dias: number): string {
  const d = new Date(dataIso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function getDiaSemanaDeData(dataIso: string): DiaSemana {
  const d = new Date(dataIso + "T00:00:00Z");
  return DIA_SEMANA_POR_INDICE[d.getUTCDay()];
}

// Segunda-feira da semana de uma data qualquer, como "yyyy-mm-dd".
export function getInicioSemanaDeData(dataIso: string): string {
  const indice = DIA_SEMANA_POR_INDICE.indexOf(getDiaSemanaDeData(dataIso));
  const diffParaSegunda = indice === 0 ? -6 : 1 - indice;
  return addDias(dataIso, diffParaSegunda);
}

// Segunda-feira da semana atual (fuso Brasília), como "yyyy-mm-dd".
export function getInicioSemanaBrasil(): string {
  return getInicioSemanaDeData(getDataHojeBrasil());
}

export function getFimSemanaBrasil(): string {
  return addDias(getInicioSemanaBrasil(), 6);
}

// Primeiro dia do mês atual (fuso Brasília), como "yyyy-mm-dd".
export function getInicioMesBrasil(): string {
  return getDataHojeBrasil().slice(0, 8) + "01";
}
