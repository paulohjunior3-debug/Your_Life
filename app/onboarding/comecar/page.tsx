import Link from "next/link";
import { Dumbbell, Pencil } from "lucide-react";

export default function ComecarPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Como você quer começar?
        </h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Dá pra mudar de ideia depois -- você sempre pode editar a ficha em
          Treino.
        </p>
      </div>

      <Link
        href="/onboarding/gerar-treino"
        className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-card p-4 transition-colors hover:bg-surface"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-background">
          <Dumbbell size={22} />
        </div>
        <div>
          <p className="font-medium text-foreground">Receber treino pronto</p>
          <p className="text-xs text-foreground-secondary">
            A gente monta uma ficha pra você com base no seu objetivo,
            biotipo e nos dias que você escolher.
          </p>
        </div>
      </Link>

      <Link
        href="/treino/montar"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-surface"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-foreground-secondary">
          <Pencil size={22} />
        </div>
        <div>
          <p className="font-medium text-foreground">
            Montar meu próprio treino
          </p>
          <p className="text-xs text-foreground-secondary">
            Escolhe você mesmo os dias, grupos musculares e exercícios.
          </p>
        </div>
      </Link>
    </div>
  );
}
