import { redefinirSenha } from "./actions";

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-secondary">
        Escolhe uma senha nova pra sua conta.
      </p>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <form action={redefinirSenha} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="senha" className="text-sm text-foreground-secondary">
            Nova senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={6}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmar"
            className="text-sm text-foreground-secondary"
          >
            Confirmar senha
          </label>
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            required
            minLength={6}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
