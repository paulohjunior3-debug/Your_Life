import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { signOut } from "@/lib/actions/sign-out";
import { User } from "lucide-react";

export default async function PerfilPage() {
  const { user, profile } = await getUserAndProfile();

  const campos = [
    { label: "Nome", value: profile?.nome },
    { label: "E-mail", value: user?.email },
    { label: "Idade", value: profile?.idade },
    { label: "Telefone", value: profile?.telefone ?? "—" },
    { label: "Academia", value: profile?.academia ?? "—" },
    { label: "Instrutor", value: profile?.instrutor ?? "—" },
    { label: "Data de início", value: profile?.data_inicio },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary">
          <User size={28} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          {profile?.nome ?? "Perfil"}
        </h1>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {campos.map((campo) => (
          <div
            key={campo.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-foreground-secondary">
              {campo.label}
            </span>
            <span className="text-sm text-foreground">
              {campo.value ?? "—"}
            </span>
          </div>
        ))}
      </div>

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
