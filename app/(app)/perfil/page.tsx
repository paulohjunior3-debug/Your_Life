import { getUserAndProfile } from "@/lib/supabase/get-profile";
import { signOut } from "@/lib/actions/sign-out";
import { pesoInicialTravado } from "@/lib/utils/peso-inicial";
import { PerfilEditor } from "./perfil-editor";
import { AvatarUpload } from "./avatar-upload";

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
        <AvatarUpload
          avatarUrl={profile?.avatar_url ?? null}
          nome={profile?.nome ?? "Perfil"}
        />
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

      <PerfilEditor profile={profile} travado={travado} />

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
