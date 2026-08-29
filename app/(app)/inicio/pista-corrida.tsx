import { Crown, Flag, Plane } from "lucide-react";

type Piloto = {
  user_id: string;
  nome: string;
  pontos: number;
};

export function PistaCorrida({
  pilotos,
  userIdAtual,
}: {
  pilotos: Piloto[];
  userIdAtual: string;
}) {
  const maxPontos = Math.max(1, ...pilotos.map((p) => Math.max(0, p.pontos)));
  const visiveis = pilotos.slice(0, 6);

  return (
    <div className="flex flex-col gap-2.5 overflow-hidden">
      {visiveis.map((piloto, i) => {
        const pct = Math.min(
          68,
          Math.max(6, (Math.max(0, piloto.pontos) / maxPontos) * 100)
        );
        const souEu = piloto.user_id === userIdAtual;
        const lider = i === 0 && piloto.pontos > 0;
        const primeiroNome = piloto.nome.split(" ")[0];

        return (
          <div key={piloto.user_id} className="relative h-6">
            {/* pista pontilhada */}
            <div
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--border) 0 6px, transparent 6px 12px)",
              }}
            />
            {/* bandeira de chegada */}
            <Flag
              size={12}
              className="absolute top-1/2 text-foreground-secondary/50"
              style={{ left: "94%", transform: "translate(-50%, -50%)" }}
            />

            <div
              className="absolute top-0 flex h-6 items-center opacity-0"
              style={{
                left: `${pct}%`,
                transform: "translate(-50%, 0)",
                animation: `entrar-pista 0.5s ease-out ${i * 0.08}s forwards`,
              }}
            >
              <div
                className="relative flex items-center gap-1"
                style={{
                  animation: `flutuar 2.2s ease-in-out ${0.5 + i * 0.15}s infinite`,
                }}
              >
                {/* rastro atrás do avião */}
                <span
                  className="absolute top-1/2 h-[3px] w-5 -translate-y-1/2 rounded-full opacity-70"
                  style={{
                    right: "100%",
                    background: souEu
                      ? "linear-gradient(to left, var(--accent), transparent)"
                      : "linear-gradient(to left, var(--foreground-secondary), transparent)",
                  }}
                />

                {lider && <Crown size={11} className="text-podium-gold" />}

                <Plane
                  size={17}
                  className={`shrink-0 rotate-90 ${
                    souEu ? "text-accent" : "text-foreground-secondary"
                  }`}
                  style={{
                    animation: souEu
                      ? "brilho-eu 1.6s ease-in-out infinite"
                      : lider
                        ? "brilho-lider 1.6s ease-in-out infinite"
                        : undefined,
                  }}
                />

                <span
                  className={`whitespace-nowrap text-[10px] ${
                    souEu
                      ? "font-semibold text-accent"
                      : lider
                        ? "font-medium text-podium-gold"
                        : "text-foreground-secondary"
                  }`}
                >
                  {primeiroNome}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
