"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { concluirTour } from "./tour-actions";

// Não abre automaticamente em cima do wizard de montar treino -- ele já
// ocupa a tela inteira sozinho. Assim que o usuário sair de lá (com o
// tour ainda pendente), o efeito abaixo abre normalmente.
const ROTAS_SEM_AUTO_ABERTURA = ["/treino/montar"];

type Passo = {
  tourId: string | null;
  titulo: string;
  texto: string;
};

const PASSOS: Passo[] = [
  {
    tourId: null,
    titulo: "Bem-vindo ao Your Life!",
    texto:
      "Vamos mostrar rapidamente como funciona cada área do app. Leva menos de 1 minuto.",
  },
  {
    tourId: "inicio",
    titulo: "Início",
    texto:
      "Aqui você vê um resumo do seu dia: o treino de hoje, seu peso atual e a corrida da semana rolando ao vivo.",
  },
  {
    tourId: "rank",
    titulo: "Rank",
    texto:
      "Aqui fica o ranking completo da corrida semanal. Ative sua participação e acompanhe a colocação de todo o grupo.",
  },
  {
    tourId: "treino",
    titulo: "Treino",
    texto:
      "Aqui você monta sua ficha, vê os exercícios com GIF demonstrativo e registra suas séries durante o treino.",
  },
  {
    tourId: "progresso",
    titulo: "Progresso",
    texto:
      "Aqui você registra seu peso, acompanha os gráficos de evolução e pode lançar uma bioimpedância completa.",
  },
  {
    tourId: "perfil",
    titulo: "Perfil",
    texto: "Aqui ficam seus dados, sua foto e as configurações da conta.",
  },
  {
    tourId: null,
    titulo: "Tudo pronto!",
    texto: "Agora você já conhece as principais áreas do app. Bons treinos!",
  },
];

export function TourGuiado({ tourConcluido }: { tourConcluido: boolean }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [passo, setPasso] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Sincroniza com o estado do perfil (vindo do servidor) e com a rota
    // atual -- precisa reagir a mudança de pathname (sair do wizard com o
    // tour ainda pendente), não dá pra derivar isso só no render porque
    // `aberto` também é fechado interativamente (Pular/Concluir).
    if (!tourConcluido && !ROTAS_SEM_AUTO_ABERTURA.includes(pathname)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAberto(true);
    }
  }, [tourConcluido, pathname]);

  useEffect(() => {
    function reabrir() {
      setPasso(0);
      setAberto(true);
    }
    window.addEventListener("reabrir-tour", reabrir);
    return () => window.removeEventListener("reabrir-tour", reabrir);
  }, []);

  const tourId = PASSOS[passo]?.tourId;

  const atualizarRect = useCallback(() => {
    if (!tourId) {
      setRect(null);
      return;
    }
    const el = document.getElementById(`tour-nav-${tourId}`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [tourId]);

  useEffect(() => {
    if (!aberto) return;
    // Mede a posição do item de menu destacado nesse passo -- precisa
    // rodar de novo a cada mudança de passo/resize, não dá pra calcular
    // isso durante o render (depende do DOM já montado).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    atualizarRect();
    window.addEventListener("resize", atualizarRect);
    return () => window.removeEventListener("resize", atualizarRect);
  }, [aberto, atualizarRect]);

  const finalizar = useCallback(() => {
    setSalvando(true);
    concluirTour().finally(() => {
      setSalvando(false);
      setAberto(false);
    });
  }, []);

  const avancar = useCallback(() => {
    setPasso((p) => {
      if (p === PASSOS.length - 1) {
        finalizar();
        return p;
      }
      return p + 1;
    });
  }, [finalizar]);

  const voltar = useCallback(() => {
    setPasso((p) => Math.max(0, p - 1));
  }, []);

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") finalizar();
      if (e.key === "ArrowRight") avancar();
      if (e.key === "ArrowLeft") voltar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, finalizar, avancar, voltar]);

  if (!aberto) return null;

  const atual = PASSOS[passo];
  const primeiro = passo === 0;
  const ultimo = passo === PASSOS.length - 1;
  const comHighlight = Boolean(atual.tourId) && rect != null;

  return (
    <div className="fixed inset-0 z-[60]">
      {comHighlight ? (
        <div
          className="fixed rounded-2xl transition-all duration-200"
          style={{
            top: rect!.top - 8,
            left: rect!.left - 8,
            width: rect!.width + 16,
            height: rect!.height + 16,
            boxShadow: "0 0 0 9999px rgba(15, 17, 21, 0.85)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-background/90" />
      )}

      <div
        className={
          comHighlight
            ? "fixed inset-x-4"
            : "absolute inset-0 flex items-center justify-center p-4"
        }
        style={
          comHighlight
            ? { bottom: window.innerHeight - rect!.top + 12 }
            : undefined
        }
      >
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-accent/40 bg-card p-4 shadow-lg">
          {!primeiro && !ultimo && (
            <div className="flex items-center justify-center gap-1.5">
              {PASSOS.slice(1, -1).map((_, i) => (
                <span
                  key={i}
                  className={
                    i === passo - 1
                      ? "h-2 w-2 rounded-full bg-accent"
                      : "h-1.5 w-1.5 rounded-full bg-border"
                  }
                />
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground">
            {atual.titulo}
          </h3>
          <p className="text-sm text-foreground-secondary">{atual.texto}</p>

          <div className="mt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={finalizar}
              disabled={salvando}
              className="text-xs font-medium text-foreground-secondary hover:text-foreground disabled:opacity-40"
            >
              Pular tour
            </button>
            <div className="flex gap-2">
              {!primeiro && (
                <button
                  type="button"
                  onClick={voltar}
                  disabled={salvando}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-40"
                >
                  Anterior
                </button>
              )}
              <button
                type="button"
                onClick={avancar}
                disabled={salvando}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
              >
                {primeiro
                  ? "Começar"
                  : ultimo
                    ? salvando
                      ? "Salvando..."
                      : "Concluir"
                    : "Próximo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
