import Link from "next/link";
import { login, loginComGoogle } from "./actions";

export default async function LoginPage({
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

      <form action={login} className="flex flex-col gap-3">
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
            className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Entrar
        </button>
      </form>

      <div className="flex items-center gap-2 text-xs text-foreground-secondary">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={loginComGoogle}>
        <button
          type="submit"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-card"
        >
          Entrar com Google
        </button>
      </form>

      <p className="text-center text-sm text-foreground-secondary">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-accent hover:text-accent-hover">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
