import { getUserAndProfile } from "@/lib/supabase/get-profile";

export default async function InicioPage() {
  const { profile } = await getUserAndProfile();

  const metrics = [
    { label: "Peso atual", value: "—" },
    { label: "Variação", value: "—" },
    { label: "Treinos na semana", value: "—" },
    { label: "Streak", value: "0 de 0 treinos este mês" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-foreground-secondary">Bem-vindo de volta,</p>
        <h1 className="text-xl font-semibold text-foreground">
          {profile?.nome ?? "atleta"}
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-center text-sm text-foreground-secondary">
        Mapa da corrida chega na v1
      </div>

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
