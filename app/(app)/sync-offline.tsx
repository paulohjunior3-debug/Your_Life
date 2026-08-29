"use client";

import { useEffect, useState } from "react";
import { CloudUpload } from "lucide-react";
import { atualizarSerie } from "./treino/sessao/[sessionId]/actions";
import { obterFila, removerDaFila, tamanhoDaFila } from "@/lib/utils/offline-queue";

export function SyncOffline() {
  const [sincronizando, setSincronizando] = useState(false);
  const [pendencias, setPendencias] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function sincronizar() {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;

      const fila = obterFila();
      if (fila.length === 0) {
        if (!cancelado) setPendencias(0);
        return;
      }

      if (!cancelado) setSincronizando(true);

      for (const pendencia of fila) {
        try {
          await atualizarSerie(pendencia.id, {
            carga_kg: pendencia.carga_kg,
            reps: pendencia.reps,
            concluida: pendencia.concluida,
          });
          removerDaFila(pendencia.id);
        } catch {
          // continua tentando os outros; essa fica na fila pra próxima vez
        }
      }

      if (!cancelado) {
        setSincronizando(false);
        setPendencias(tamanhoDaFila());
      }
    }

    sincronizar();

    window.addEventListener("online", sincronizar);
    return () => {
      cancelado = true;
      window.removeEventListener("online", sincronizar);
    };
  }, []);

  if (pendencias === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-center gap-2 bg-status-partial px-3 py-1.5 text-xs font-medium text-background">
      <CloudUpload size={14} className={sincronizando ? "animate-pulse" : ""} />
      {sincronizando
        ? "Sincronizando séries salvas offline..."
        : `${pendencias} série(s) aguardando conexão pra sincronizar`}
    </div>
  );
}
