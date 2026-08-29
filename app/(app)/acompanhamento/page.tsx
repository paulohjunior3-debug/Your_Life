import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getInicioSemanaDeData } from "@/lib/utils/data-brasil";
import { PesoChart } from "./peso-chart";
import { VolumeChart } from "./volume-chart";
import { registrarPeso } from "./actions";

function formatarDataCurta(iso: string) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

export default async function AcompanhamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const { user, profile } = await getUserAndProfile();
  const { erro, sucesso } = await searchParams;
  const supabase = await createClient();

  const [{ data: pesos }, { data: sessoes }] = await Promise.all([
    supabase
      .from("body_logs")
      .select("semana, peso_kg")
      .eq("user_id", user?.id ?? "")
      .order("semana"),
    supabase
      .from("sessions")
      .select("data, session_sets(carga_kg, reps, concluida)")
      .eq("user_id", user?.id ?? "")
      .order("data"),
  ]);

  const dadosFixos = [
    { label: "Data de início", value: profile?.data_inicio ?? "—" },
    {
      label: "Peso inicial",
      value: profile?.peso_inicial_kg ? `${profile.peso_inicial_kg} kg` : "—",
    },
    { label: "Altura", value: profile?.altura_cm ? `${profile.altura_cm} cm` : "—" },
    { label: "Idade", value: profile?.idade ?? "—" },
  ];

  const dadosPeso = (pesos ?? []).map((p) => ({
    label: formatarDataCurta(p.semana),
    peso: Number(p.peso_kg),
  }));

  const volumePorSemana = new Map<string, number>();
  type SessaoComSets = {
    data: string;
    session_sets: { carga_kg: number | null; reps: number | null; concluida: boolean }[];
  };
  for (const sessao of (sessoes ?? []) as unknown as SessaoComSets[]) {
    const semana = getInicioSemanaDeData(sessao.data);
    const volumeSessao = sessao.session_sets.reduce((soma, s) => {
      if (!s.concluida || s.carga_kg == null || s.reps == null) return soma;
      return soma + s.carga_kg * s.reps;
    }, 0);
    volumePorSemana.set(
      semana,
      (volumePorSemana.get(semana) ?? 0) + volumeSessao
    );
  }
  const dadosVolume = Array.from(volumePorSemana.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([semana, volume]) => ({
      label: formatarDataCurta(semana),
      volume: Math.round(volume),
    }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">Acompanhamento</h1>

      <div className="grid grid-cols-2 gap-3">
        {dadosFixos.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-3"
          >
            <p className="text-xs text-foreground-secondary">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">
          Registro de peso desta semana
        </p>
        <p className="text-xs text-status-partial">
          Pese-se com a mesma roupa e o mesmo tênis da semana anterior —
          variação de vestuário pode mudar a leitura em até 1,5 kg.
        </p>

        {erro && (
          <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
            {erro}
          </p>
        )}
        {sucesso && (
          <p className="rounded-lg border border-status-complete/40 bg-status-complete/10 px-3 py-2 text-sm text-status-complete">
            Peso registrado.
          </p>
        )}

        <form action={registrarPeso} className="flex gap-2">
          <input
            type="number"
            name="peso_kg"
            step="0.1"
            min={0}
            placeholder="Peso (kg)"
            required
            defaultValue={dadosPeso.at(-1)?.peso ?? ""}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Salvar
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 text-sm font-medium text-foreground">
          Evolução do peso corporal
        </p>
        <PesoChart dados={dadosPeso} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 text-sm font-medium text-foreground">
          Evolução do volume de treino
        </p>
        <VolumeChart dados={dadosVolume} />
      </div>
    </div>
  );
}
