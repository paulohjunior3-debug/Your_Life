"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { DiaSemana } from "@/lib/supabase/types";
import { DIAS_SEMANA } from "@/lib/utils/dias-semana";
import { gerarTreinoAutomatico } from "./actions";

export function DiaPicker() {
  const [dias, setDias] = useState<DiaSemana[]>([]);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function alternar(dia: DiaSemana) {
    setDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  }

  function confirmar() {
    if (dias.length === 0) return;
    setErro(null);
    startTransition(async () => {
      try {
        await gerarTreinoAutomatico(dias);
      } catch (err) {
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
        setErro("Não deu pra gerar o treino agora. Tenta de novo.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="grid grid-cols-4 gap-2">
        {DIAS_SEMANA.map((dia) => {
          const selecionado = dias.includes(dia.id);
          return (
            <button
              key={dia.id}
              type="button"
              onClick={() => alternar(dia.id)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-sm font-medium transition-colors ${
                selecionado
                  ? "border-accent bg-accent text-background"
                  : "border-border bg-surface text-foreground hover:bg-card"
              }`}
            >
              {selecionado && <Check size={16} />}
              {dia.curto}
            </button>
          );
        })}
      </div>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <button
        type="button"
        disabled={dias.length === 0 || pending}
        onClick={confirmar}
        className="rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
      >
        {pending
          ? "Gerando treino..."
          : `Gerar treino (${dias.length} dia${dias.length === 1 ? "" : "s"})`}
      </button>
    </div>
  );
}
