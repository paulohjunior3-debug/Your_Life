import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { pesoInicialTravado } from "@/lib/utils/peso-inicial";
import { salvarOnboarding } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { profile } = await getUserAndProfile();
  const { erro } = await searchParams;

  const travado = pesoInicialTravado(profile?.criado_em);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Só mais um passo, {profile?.nome ?? ""}
        </h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Isso ajuda a montar seu resumo de evolução certinho. Dá pra
          corrigir depois em Perfil, menos o peso inicial (só edita nas
          primeiras 48h).
        </p>
      </div>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <form
        action={salvarOnboarding}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-secondary">
            Sexo biológico
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "masculino", label: "Masculino" },
                { value: "feminino", label: "Feminino" },
              ] as const
            ).map((opcao) => (
              <label
                key={opcao.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-foreground has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-background"
              >
                <input
                  type="radio"
                  name="sexo"
                  value={opcao.value}
                  defaultChecked={profile?.sexo === opcao.value}
                  required
                  className="sr-only"
                />
                {opcao.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="altura_cm" className="text-sm text-foreground-secondary">
            Altura (cm)
          </label>
          <input
            id="altura_cm"
            name="altura_cm"
            type="number"
            min={0}
            defaultValue={profile?.altura_cm ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="peso_inicial_kg"
            className="text-sm text-foreground-secondary"
          >
            Peso inicial (kg)
          </label>
          <input
            id="peso_inicial_kg"
            name="peso_inicial_kg"
            type="number"
            min={0}
            step="0.1"
            disabled={travado}
            defaultValue={profile?.peso_inicial_kg ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent disabled:opacity-50"
          />
          {travado && (
            <p className="text-xs text-foreground-secondary">
              Só pode ser editado nas primeiras 48h após o cadastro.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="objetivo" className="text-sm text-foreground-secondary">
            Objetivo
          </label>
          <select
            id="objetivo"
            name="objetivo"
            defaultValue={profile?.objetivo ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          >
            <option value="">Não definido</option>
            <option value="ganho">Ganho de massa</option>
            <option value="perda">Perda de peso</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Entrar no Your Life
        </button>
      </form>
    </div>
  );
}
