import { Trophy, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProximosParticipantes } from "@/components/proximos-participantes";
import { alternarParticipacao } from "./actions";

const CORES_PODIO = [
  { borda: "border-podium-gold", texto: "text-podium-gold", label: "1º" },
  { borda: "border-podium-silver", texto: "text-podium-silver", label: "2º" },
  { borda: "border-podium-bronze", texto: "text-podium-bronze", label: "3º" },
];

export default async function RankPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: optin }, { data: ranking }, { data: proximaSemana }] =
    await Promise.all([
      supabase
        .from("race_optins")
        .select("ativo")
        .eq("user_id", user?.id ?? "")
        .maybeSingle(),
      supabase.rpc("ranking_semana_atual"),
      supabase.rpc("participantes_proxima_semana"),
    ]);

  const participando = optin?.ativo ?? false;
  const lista = ranking ?? [];
  const podio = lista.slice(0, 3);
  const resto = lista.slice(3);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">Rank</h1>

      <form
        action={alternarParticipacao}
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
      >
        <input type="hidden" name="ativo" value={String(participando)} />
        <div>
          <p className="text-foreground">Quero participar da corrida</p>
          <p className="text-xs text-foreground-secondary">
            {participando
              ? "Ativo — se você desativar, sai a partir de agora."
              : "Ativando agora, você entra a partir da próxima semana."}
          </p>
        </div>
        <button
          type="submit"
          className={`flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
            participando ? "border-accent bg-accent" : "border-border bg-surface"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-background transition-transform ${
              participando ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </form>

      <ProximosParticipantes participantes={proximaSemana ?? []} />

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-foreground-secondary">
          Ninguém na corrida desta semana ainda. Ative o toggle acima pra
          entrar a partir da próxima segunda-feira.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {podio.map((entrada, i) => {
              const cor = CORES_PODIO[i];
              return (
                <div
                  key={entrada.user_id}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 ${cor.borda} bg-card p-3`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-surface ${cor.texto}`}
                  >
                    {entrada.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entrada.avatar_url}
                        alt={entrada.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {entrada.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-semibold ${cor.texto}`}>
                    {cor.label}
                  </p>
                  <p className="truncate text-center text-sm text-foreground">
                    {entrada.nome}
                  </p>
                  <p className="text-xs text-foreground-secondary">
                    {entrada.pontos} pts
                  </p>
                </div>
              );
            })}
          </div>

          {resto.length > 0 && (
            <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
              {resto.map((entrada, i) => (
                <div
                  key={entrada.user_id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span className="w-6 text-sm text-foreground-secondary">
                    {i + 4}º
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface text-foreground-secondary">
                    {entrada.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entrada.avatar_url}
                        alt={entrada.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="flex-1 text-foreground">
                    {entrada.nome}
                  </span>
                  <span className="text-sm text-foreground-secondary">
                    {entrada.pontos} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-xs text-foreground-secondary">
        <Trophy size={16} className="shrink-0 text-status-info" />
        <p>
          Pontuação da semana (segunda a domingo): 10 pts por treino
          concluído + variação % do volume de treino em relação à semana
          anterior.
        </p>
      </div>
    </div>
  );
}
