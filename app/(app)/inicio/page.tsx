import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { PistaCorrida } from "./pista-corrida";
import {
  getDataHojeBrasil,
  getDiaSemanaDeData,
  getFimSemanaBrasil,
  getInicioMesBrasil,
  getInicioSemanaBrasil,
} from "@/lib/utils/data-brasil";

export default async function InicioPage() {
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();

  const dataHoje = getDataHojeBrasil();
  const inicioSemana = getInicioSemanaBrasil();
  const fimSemana = getFimSemanaBrasil();
  const inicioMes = getInicioMesBrasil();

  const [
    { data: ranking },
    { count: treinosNaSemana },
    { data: templatesDoUsuario },
    { count: treinosNoMes },
  ] = await Promise.all([
    supabase.rpc("ranking_semana_atual"),
    supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user?.id ?? "")
      .eq("status", "completo")
      .gte("data", inicioSemana)
      .lte("data", fimSemana),
    supabase
      .from("workout_templates")
      .select("dia_semana")
      .eq("criado_por", user?.id ?? "")
      .not("dia_semana", "is", null),
    supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user?.id ?? "")
      .eq("status", "completo")
      .gte("data", inicioMes)
      .lte("data", dataHoje),
  ]);

  const diasDeTreino = new Set(
    (templatesDoUsuario ?? []).map((t) => t.dia_semana)
  );
  let diasEsperadosNoMes = 0;
  for (let d = inicioMes; d <= dataHoje; ) {
    if (diasDeTreino.has(getDiaSemanaDeData(d))) diasEsperadosNoMes++;
    const proximo = new Date(d + "T00:00:00Z");
    proximo.setUTCDate(proximo.getUTCDate() + 1);
    d = proximo.toISOString().slice(0, 10);
  }

  const metrics = [
    { label: "Peso atual", value: "—" },
    { label: "Variação", value: "—" },
    { label: "Treinos na semana", value: String(treinosNaSemana ?? 0) },
    {
      label: "Streak",
      value: `${treinosNoMes ?? 0} de ${diasEsperadosNoMes} treinos este mês`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground-secondary">Bem-vindo de volta,</p>
        <h1 className="text-xl font-semibold text-foreground">
          {profile?.nome ?? "atleta"}
        </h1>
      </div>

      <Link
        href="/rank"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
        style={{ maxHeight: 200 }}
      >
        <p className="text-xs font-medium text-foreground-secondary">
          Corrida desta semana
        </p>
        {ranking && ranking.length > 0 ? (
          <PistaCorrida pilotos={ranking} userIdAtual={user?.id ?? ""} />
        ) : (
          <p className="text-center text-sm text-foreground-secondary">
            Ninguém correndo essa semana ainda. Ative o opt-in na aba Rank.
          </p>
        )}
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-border bg-card p-3"
          >
            <p className="text-xs text-foreground-secondary">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
