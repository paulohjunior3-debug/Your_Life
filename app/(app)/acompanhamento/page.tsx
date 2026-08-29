import { getUserAndProfile } from "@/lib/supabase/get-profile";

export default async function AcompanhamentoPage() {
  const { profile } = await getUserAndProfile();

  const dados = [
    { label: "Data de início", value: profile?.data_inicio ?? "—" },
    {
      label: "Peso inicial",
      value: profile?.peso_inicial_kg ? `${profile.peso_inicial_kg} kg` : "—",
    },
    { label: "Altura", value: profile?.altura_cm ? `${profile.altura_cm} cm` : "—" },
    { label: "Idade", value: profile?.idade ?? "—" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">Acompanhamento</h1>

      <div className="grid grid-cols-2 gap-3">
        {dados.map((item) => (
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

      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-foreground-secondary">
        Registro semanal de peso e gráficos de evolução chegam na v1.
      </div>
    </div>
  );
}
