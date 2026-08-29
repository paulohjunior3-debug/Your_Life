// Fila local (localStorage) de atualizações de série que não conseguiram
// ser salvas no servidor (sem internet, geralmente na academia). Cada
// pendência é reaplicada assim que a conexão volta.
const CHAVE = "your-life:fila-offline";

export type PendenciaSerie = {
  id: string; // sessionSetId, usado pra deduplicar (a mais recente vence)
  carga_kg: number | null;
  reps: number | null;
  concluida: boolean;
  timestamp: number;
};

function lerFila(): PendenciaSerie[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as PendenciaSerie[]) : [];
  } catch {
    return [];
  }
}

function salvarFila(fila: PendenciaSerie[]) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(fila));
  } catch {
    // localStorage indisponível (modo privado etc.) — a pendência se perde,
    // mas não travamos a UI por causa disso.
  }
}

export function enfileirar(pendencia: Omit<PendenciaSerie, "timestamp">) {
  const fila = lerFila().filter((p) => p.id !== pendencia.id);
  fila.push({ ...pendencia, timestamp: Date.now() });
  salvarFila(fila);
}

export function obterFila(): PendenciaSerie[] {
  return lerFila();
}

export function removerDaFila(id: string) {
  salvarFila(lerFila().filter((p) => p.id !== id));
}

export function tamanhoDaFila(): number {
  return lerFila().length;
}
