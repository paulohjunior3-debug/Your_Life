import { Plane } from "lucide-react";

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
    <div className="flex flex-col gap-2 overflow-hidden">
      {visiveis.map((piloto, i) => {
        const pct = Math.min(
          92,
          Math.max(6, (Math.max(0, piloto.pontos) / maxPontos) * 100)
        );
        const souEu = piloto.user_id === userIdAtual;
        const primeiroNome = piloto.nome.split(" ")[0];

        return (
          <div key={piloto.user_id} className="relative h-6">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            <div
              className="absolute top-1/2"
              style={{
                left: `${pct}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="flex items-center gap-1"
                style={{
                  animation: `flutuar 1.8s ease-in-out ${i * 0.18}s infinite`,
                }}
              >
                <Plane
                  size={16}
                  className={`rotate-90 shrink-0 ${
                    souEu ? "text-accent" : "text-foreground-secondary"
                  }`}
                />
                <span
                  className={`whitespace-nowrap text-[10px] ${
                    souEu
                      ? "font-semibold text-accent"
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
