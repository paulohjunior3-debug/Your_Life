import type { DiaSemana } from "@/lib/supabase/types";

export const DIAS_SEMANA: { id: DiaSemana; label: string; curto: string }[] = [
  { id: "segunda", label: "Segunda-feira", curto: "Seg" },
  { id: "terca", label: "Terça-feira", curto: "Ter" },
  { id: "quarta", label: "Quarta-feira", curto: "Qua" },
  { id: "quinta", label: "Quinta-feira", curto: "Qui" },
  { id: "sexta", label: "Sexta-feira", curto: "Sex" },
  { id: "sabado", label: "Sábado", curto: "Sáb" },
  { id: "domingo", label: "Domingo", curto: "Dom" },
];

export function nomeDia(dia: DiaSemana) {
  return DIAS_SEMANA.find((d) => d.id === dia)?.label ?? dia;
}

export function ordemDia(dia: DiaSemana | null) {
  if (!dia) return DIAS_SEMANA.length;
  return DIAS_SEMANA.findIndex((d) => d.id === dia);
}
