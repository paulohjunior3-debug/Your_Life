import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getDataHojeBrasil, formatarDataBr } from "@/lib/utils/data-brasil";
import { registrarBioimpedancia, excluirBioimpedancia } from "./actions";

const CAMPOS: {
  name: string;
  label: string;
  sufixo: string;
  step: string;
}[] = [
  { name: "peso_kg", label: "Peso", sufixo: "kg", step: "0.1" },
  {
    name: "percentual_gordura",
    label: "Gordura corporal",
    sufixo: "%",
    step: "0.1",
  },
  { name: "massa_magra_kg", label: "Massa magra", sufixo: "kg", step: "0.1" },
  {
    name: "massa_muscular_kg",
    label: "Massa muscular",
    sufixo: "kg",
    step: "0.1",
  },
  {
    name: "agua_corporal_pct",
    label: "Água corporal",
    sufixo: "%",
    step: "0.1",
  },
  { name: "massa_ossea_kg", label: "Massa óssea", sufixo: "kg", step: "0.1" },
  {
    name: "gordura_visceral",
    label: "Gordura visceral",
    sufixo: "",
    step: "1",
  },
  {
    name: "taxa_metabolica_basal",
    label: "Taxa metabólica basal",
    sufixo: "kcal",
    step: "1",
  },
  {
    name: "idade_metabolica",
    label: "Idade metabólica",
    sufixo: "anos",
    step: "1",
  },
];

export default async function BioimpedanciaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const { user } = await getUserAndProfile();
  const { erro, sucesso } = await searchParams;
  const supabase = await createClient();

  const { data: registros } = await supabase
    .from("bioimpedancia_logs")
    .select(
      "id, data, peso_kg, percentual_gordura, massa_magra_kg, massa_muscular_kg, agua_corporal_pct, massa_ossea_kg, gordura_visceral, taxa_metabolica_basal, idade_metabolica"
    )
    .eq("user_id", user?.id ?? "")
    .order("data", { ascending: false });

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/acompanhamento"
        className="flex w-fit items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
      >
        <ChevronLeft size={16} />
        Acompanhamento
      </Link>

      <h1 className="text-xl font-semibold text-foreground">Bioimpedância</h1>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">Nova medição</p>
        <p className="text-xs text-foreground-secondary">
          Preenche o que você tiver em mãos -- só o peso é obrigatório, o
          resto fica em branco se você não tiver o dado.
        </p>

        {erro && (
          <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
            {erro}
          </p>
        )}
        {sucesso && (
          <p className="rounded-lg border border-status-complete/40 bg-status-complete/10 px-3 py-2 text-sm text-status-complete">
            Medição registrada.
          </p>
        )}

        <form action={registrarBioimpedancia} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="data" className="text-xs text-foreground-secondary">
              Data
            </label>
            <input
              id="data"
              type="date"
              name="data"
              defaultValue={getDataHojeBrasil()}
              required
              className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CAMPOS.map((campo, i) => (
              <div key={campo.name} className="flex flex-col gap-1">
                <label
                  htmlFor={campo.name}
                  className="text-xs text-foreground-secondary"
                >
                  {campo.label}
                  {campo.sufixo ? ` (${campo.sufixo})` : ""}
                </label>
                <input
                  id={campo.name}
                  type="number"
                  name={campo.name}
                  step={campo.step}
                  min={0}
                  required={i === 0}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-1 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Salvar medição
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          Histórico ({(registros ?? []).length})
        </p>

        {(registros ?? []).length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-4 text-center text-sm text-foreground-secondary">
            Nenhuma medição registrada ainda.
          </p>
        ) : (
          (registros ?? []).map((registro) => {
            const detalhes = CAMPOS.slice(1).filter(
              (campo) =>
                registro[campo.name as keyof typeof registro] != null
            );
            return (
              <div
                key={registro.id}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">
                    {formatarDataBr(registro.data)}
                  </p>
                  <div className="flex items-center gap-3">
                    {registro.peso_kg != null && (
                      <p className="text-sm text-foreground-secondary">
                        {registro.peso_kg} kg
                      </p>
                    )}
                    <form action={excluirBioimpedancia}>
                      <input type="hidden" name="id" value={registro.id} />
                      <button
                        type="submit"
                        aria-label="Excluir medição"
                        className="text-foreground-secondary transition-colors hover:text-status-missed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>
                {detalhes.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {detalhes.map((campo) => (
                      <p
                        key={campo.name}
                        className="text-xs text-foreground-secondary"
                      >
                        {campo.label}:{" "}
                        <span className="text-foreground">
                          {String(
                            registro[campo.name as keyof typeof registro]
                          )}
                          {campo.sufixo ? ` ${campo.sufixo}` : ""}
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
