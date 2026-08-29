import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { signOut } from "@/lib/actions/sign-out";
import { pesoInicialTravado } from "@/lib/utils/peso-inicial";
import { updateProfile } from "./actions";
import { User } from "lucide-react";

const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent disabled:opacity-50";
const labelClass = "text-sm text-foreground-secondary";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const { user, profile } = await getUserAndProfile();
  const { erro, sucesso } = await searchParams;

  const travado = pesoInicialTravado(profile?.criado_em);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary">
          <User size={28} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          {profile?.nome ?? "Perfil"}
        </h1>
        <p className="text-sm text-foreground-secondary">{user?.email}</p>
      </div>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="rounded-lg border border-status-complete/40 bg-status-complete/10 px-3 py-2 text-sm text-status-complete">
          Perfil atualizado.
        </p>
      )}

      <form action={updateProfile} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className={labelClass}>
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            defaultValue={profile?.nome ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="idade" className={labelClass}>
            Idade
          </label>
          <input
            id="idade"
            name="idade"
            type="number"
            min={0}
            defaultValue={profile?.idade ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="telefone" className={labelClass}>
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={profile?.telefone ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="academia" className={labelClass}>
            Academia
          </label>
          <input
            id="academia"
            name="academia"
            type="text"
            defaultValue={profile?.academia ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="instrutor" className={labelClass}>
            Instrutor
          </label>
          <input
            id="instrutor"
            name="instrutor"
            type="text"
            defaultValue={profile?.instrutor ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="altura_cm" className={labelClass}>
            Altura (cm)
          </label>
          <input
            id="altura_cm"
            name="altura_cm"
            type="number"
            min={0}
            defaultValue={profile?.altura_cm ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="peso_inicial_kg" className={labelClass}>
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
            className={inputClass}
          />
          {travado ? (
            <p className="text-xs text-foreground-secondary">
              Só pode ser editado nas primeiras 48h após o cadastro.
            </p>
          ) : (
            <p className="text-xs text-foreground-secondary">
              Editável só nas primeiras 48h após o cadastro — depois disso
              trava, pra não bagunçar o gráfico de evolução.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="objetivo" className={labelClass}>
            Objetivo
          </label>
          <select
            id="objetivo"
            name="objetivo"
            defaultValue={profile?.objetivo ?? ""}
            className={inputClass}
          >
            <option value="">Não definido</option>
            <option value="ganho">Ganho de massa</option>
            <option value="perda">Perda de peso</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-1 py-1">
          <span className={labelClass}>Data de início</span>
          <span className="text-sm text-foreground">
            {profile?.data_inicio ?? "—"}
          </span>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Salvar
        </button>
      </form>

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 font-medium text-status-missed transition-colors hover:bg-status-missed/20"
        >
          Sair
        </button>
      </form>
    </div>
  );
}
