import Link from "next/link";
import { cadastrar } from "./actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      {erro && (
        <p className="rounded-lg border border-status-missed/40 bg-status-missed/10 px-3 py-2 text-sm text-status-missed">
          {erro}
        </p>
      )}

      <form action={cadastrar} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className="text-sm text-foreground-secondary">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

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

        <div className="flex flex-col gap-1">
          <label htmlFor="senha" className="text-sm text-foreground-secondary">
            Senha
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

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Criar conta
        </button>
      </form>

      <p className="text-center text-sm text-foreground-secondary">
        Já tem conta?{" "}
        <Link href="/login" className="text-accent hover:text-accent-hover">
          Entrar
        </Link>
      </p>
    </div>
  );
}
