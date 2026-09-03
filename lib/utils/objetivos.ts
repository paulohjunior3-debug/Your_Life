import type { Objetivo } from "@/lib/supabase/types";

export const OBJETIVOS: { value: Objetivo; label: string }[] = [
  { value: "hipertrofia", label: "Hipertrofia / ganho de massa" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "definicao", label: "Definição muscular" },
  { value: "manutencao", label: "Manutenção" },
  { value: "forca", label: "Ganho de força" },
  { value: "condicionamento", label: "Condicionamento físico" },
];

export function nomeObjetivo(objetivo: Objetivo | null | undefined): string {
  if (objetivo === "ganho") return "Ganho de massa";
  if (objetivo === "perda") return "Perda de peso";
  return OBJETIVOS.find((o) => o.value === objetivo)?.label ?? "—";
}
