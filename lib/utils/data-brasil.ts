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
