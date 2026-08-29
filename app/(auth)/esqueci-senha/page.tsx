import Link from "next/link";
import { solicitarRecuperacao } from "./actions";

export default async function EsqueciSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const { erro, sucesso } = await searchParams;

  if (sucesso) {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg border border-status-complete/40 bg-status-complete/10 px-3 py-2 text-sm text-status-complete">
          Se esse e-mail estiver cadastrado, mandamos um link pra você criar
          uma senha nova. Confere sua caixa de entrada (e o spam).
        </p>
        <p className="text-center text-sm text-foreground-secondary">
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Voltar pro login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-secondary">
        Informa seu e-mail que a gente manda um link pra você criar uma senha
        nova.
      </p>

      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <form action={solicitarRecuperacao} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-foreground-secondary">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Enviar link
        </button>
      </form>

      <p className="text-center text-sm text-foreground-secondary">
        <Link href="/login" className="text-accent hover:text-accent-hover">
          Voltar pro login
        </Link>
      </p>
    </div>
  );
}
