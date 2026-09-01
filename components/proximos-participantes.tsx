import { User } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Participante =
  Database["public"]["Functions"]["participantes_proxima_semana"]["Returns"][number];

export function ProximosParticipantes({
  participantes,
}: {
  participantes: Participante[];
}) {
  if (participantes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-foreground-secondary">
        Confirmados pra semana que vem
      </p>
      <div className="flex flex-wrap gap-2">
        {participantes.map((p) => (
          <div
            key={p.user_id}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1 pr-3"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface text-foreground-secondary">
              {p.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.avatar_url}
                  alt={p.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={12} />
              )}
            </div>
            <span className="text-xs text-foreground">{p.nome}</span>
            {!p.ja_pontuando && (
              <span className="rounded-full bg-status-info/15 px-1.5 py-0.5 text-[10px] font-medium text-status-info">
                novo
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
