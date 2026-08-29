"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { atualizarSerie } from "./actions";

export function SerieRow({
  sessionSetId,
  serieNum,
  cargaInicial,
  repsInicial,
  concluidaInicial,
  referencia,
}: {
  sessionSetId: string;
  serieNum: number;
  cargaInicial: number | null;
  repsInicial: number | null;
  concluidaInicial: boolean;
  referencia: { carga_kg: number | null; reps: number | null } | null;
}) {
  const [carga, setCarga] = useState(cargaInicial?.toString() ?? "");
  const [reps, setReps] = useState(repsInicial?.toString() ?? "");
  const [concluida, setConcluida] = useState(concluidaInicial);
  const [, startTransition] = useTransition();

  function salvarCampos(novaCarga: string, novosReps: string) {
    startTransition(() => {
      atualizarSerie(sessionSetId, {
        carga_kg: novaCarga === "" ? null : Number(novaCarga),
        reps: novosReps === "" ? null : Number(novosReps),
      });
    });
  }

  function alternarConcluida() {
    const novo = !concluida;
    setConcluida(novo);
    startTransition(() => {
      atualizarSerie(sessionSetId, { concluida: novo });
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2">
      <span className="w-5 text-center text-xs text-foreground-secondary">
        {serieNum}
      </span>

      <input
        type="number"
        inputMode="decimal"
        step="0.5"
        placeholder={
          referencia?.carga_kg != null ? `${referencia.carga_kg}kg` : "kg"
        }
        value={carga}
        onChange={(e) => setCarga(e.target.value)}
        onBlur={() => salvarCampos(carga, reps)}
        className="w-16 rounded-md border border-border bg-card px-2 py-1 text-center text-foreground outline-none focus:border-accent"
      />

      <span className="text-foreground-secondary">×</span>

      <input
        type="number"
        inputMode="numeric"
        placeholder={referencia?.reps != null ? `${referencia.reps}` : "reps"}
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={() => salvarCampos(carga, reps)}
        className="w-14 rounded-md border border-border bg-card px-2 py-1 text-center text-foreground outline-none focus:border-accent"
      />

      <button
        type="button"
        onClick={alternarConcluida}
        className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
          concluida
            ? "border-status-complete bg-status-complete/20 text-status-complete"
            : "border-border text-foreground-secondary"
        }`}
      >
        <Check size={14} />
      </button>
    </div>
  );
}
