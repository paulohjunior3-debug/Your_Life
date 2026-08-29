"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Exercise = Pick<
  Database["public"]["Tables"]["exercises"]["Row"],
  "id" | "nome" | "grupo_muscular" | "gif_url"
>;

export function ExerciseBrowser({ exercises }: { exercises: Exercise[] }) {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return exercises;
    return exercises.filter((ex) => ex.nome.toLowerCase().includes(termo));
  }, [busca, exercises]);

  const grupos = useMemo(() => {
    const map = new Map<string, Exercise[]>();
    for (const ex of filtrados) {
      const grupo = ex.grupo_muscular ?? "Outros";
      if (!map.has(grupo)) map.set(grupo, []);
      map.get(grupo)!.push(ex);
    }
    return Array.from(map.entries());
  }, [filtrados]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar exercício..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
      />

      {grupos.length === 0 && (
        <p className="text-center text-sm text-foreground-secondary">
          Nenhum exercício encontrado.
        </p>
      )}

      {grupos.map(([grupo, lista]) => (
        <div key={grupo} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-foreground-secondary">
            {grupo}
          </h2>
          <div className="flex flex-col gap-2">
            {lista.map((ex) => (
              <Link
                key={ex.id}
                href={`/treino/adicionar/${ex.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-surface"
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
                <span className="text-foreground">{ex.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
