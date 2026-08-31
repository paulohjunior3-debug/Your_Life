import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getDataHojeBrasil, formatarDataBr } from "@/lib/utils/data-brasil";
import { BodySilhouette } from "@/components/body-silhouette";
import { ComposicaoChart } from "./composicao-chart";
import { registrarBioimpedancia, excluirBioimpedancia } from "./actions";

type Campo = {
  name: string;
  label: string;
  sufixo: string;
  step: string;
  grupo: "composicao" | "medidas";
};

const CAMPOS_COMPOSICAO: Campo[] = [
  { name: "peso_kg", label: "Peso", sufixo: "kg", step: "0.1", grupo: "composicao" },
  {
    name: "percentual_gordura",
    label: "Gordura corporal",
    sufixo: "%",
    step: "0.1",
    grupo: "composicao",
  },
  {
    name: "massa_magra_kg",
    label: "Massa magra",
    sufixo: "kg",
    step: "0.1",
    grupo: "composicao",
  },
  {
    name: "massa_muscular_kg",
    label: "Massa muscular",
    sufixo: "kg",
    step: "0.1",
    grupo: "composicao",
  },
  {
    name: "agua_corporal_pct",
    label: "Água corporal",
    sufixo: "%",
    step: "0.1",
    grupo: "composicao",
  },
  {
    name: "massa_ossea_kg",
    label: "Massa óssea",
    sufixo: "kg",
    step: "0.1",
    grupo: "composicao",
  },
  {
    name: "gordura_visceral",
    label: "Gordura visceral",
    sufixo: "",
    step: "1",
    grupo: "composicao",
  },
  {
    name: "taxa_metabolica_basal",
    label: "Taxa metabólica basal",
    sufixo: "kcal",
    step: "1",
    grupo: "composicao",
  },
  {
    name: "idade_metabolica",
    label: "Idade metabólica",
    sufixo: "anos",
    step: "1",
    grupo: "composicao",
  },
];

const CAMPOS_MEDIDAS: Campo[] = [
  { name: "pescoco_cm", label: "Pescoço", sufixo: "cm", step: "0.5", grupo: "medidas" },
  { name: "peito_cm", label: "Peito", sufixo: "cm", step: "0.5", grupo: "medidas" },
  { name: "cintura_cm", label: "Cintura", sufixo: "cm", step: "0.5", grupo: "medidas" },
  { name: "abdomen_cm", label: "Abdômen", sufixo: "cm", step: "0.5", grupo: "medidas" },
  { name: "quadril_cm", label: "Quadril/glúteo", sufixo: "cm", step: "0.5", grupo: "medidas" },
  {
    name: "coxa_direita_cm",
    label: "Coxa direita",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "coxa_esquerda_cm",
    label: "Coxa esquerda",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "panturrilha_direita_cm",
    label: "Panturrilha direita",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "panturrilha_esquerda_cm",
    label: "Panturrilha esquerda",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "braco_contraido_direito_cm",
    label: "Braço direito contraído",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "braco_contraido_esquerdo_cm",
    label: "Braço esquerdo contraído",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "braco_relaxado_direito_cm",
    label: "Braço direito relaxado",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
  {
    name: "braco_relaxado_esquerdo_cm",
    label: "Braço esquerdo relaxado",
    sufixo: "cm",
    step: "0.5",
    grupo: "medidas",
  },
];

const CAMPOS: Campo[] = [...CAMPOS_COMPOSICAO, ...CAMPOS_MEDIDAS];

export default async function BioimpedanciaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const { user, profile } = await getUserAndProfile();
  const { erro, sucesso } = await searchParams;
  const supabase = await createClient();

  const { data: registros } = await supabase
    .from("bioimpedancia_logs")
    .select(
      "id, data, peso_kg, percentual_gordura, massa_magra_kg, massa_muscular_kg, agua_corporal_pct, massa_ossea_kg, gordura_visceral, taxa_metabolica_basal, idade_metabolica, pescoco_cm, peito_cm, cintura_cm, abdomen_cm, quadril_cm, coxa_direita_cm, coxa_esquerda_cm, panturrilha_direita_cm, panturrilha_esquerda_cm, braco_contraido_direito_cm, braco_contraido_esquerdo_cm, braco_relaxado_direito_cm, braco_relaxado_esquerdo_cm"
    )
    .eq("user_id", user?.id ?? "")
    .order("data", { ascending: false });

  const gordurasRegistradas = (registros ?? [])
    .map((r) => r.percentual_gordura)
    .filter((v): v is number => v != null);
  const mediaGordura =
    gordurasRegistradas.length > 0
      ? gordurasRegistradas.reduce((a, b) => a + b, 0) /
        gordurasRegistradas.length
      : null;

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

      {mediaGordura != null && (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4">
          <BodySilhouette
            sexo={profile?.sexo}
            className="h-32 w-auto shrink-0 text-foreground-secondary"
          />
          <div className="flex-1">
            <p className="mb-1 text-center text-xs text-foreground-secondary">
              Média de {gordurasRegistradas.length} medição(ões)
            </p>
            <ComposicaoChart percentualGordura={mediaGordura} />
            <div className="mt-1 flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-foreground-secondary">
                <span className="h-2 w-2 rounded-full bg-status-partial" />
                Gordura {mediaGordura.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5 text-foreground-secondary">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Massa magra {(100 - mediaGordura).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

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

          <p className="text-xs font-medium text-foreground-secondary">
            Composição corporal
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CAMPOS_COMPOSICAO.map((campo, i) => (
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

          <p className="mt-1 text-xs font-medium text-foreground-secondary">
            Medidas (circunferência)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CAMPOS_MEDIDAS.map((campo) => (
              <div key={campo.name} className="flex flex-col gap-1">
                <label
                  htmlFor={campo.name}
                  className="text-xs text-foreground-secondary"
                >
                  {campo.label} ({campo.sufixo})
                </label>
                <input
                  id={campo.name}
                  type="number"
                  name={campo.name}
                  step={campo.step}
                  min={0}
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
