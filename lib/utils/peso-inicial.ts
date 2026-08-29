const JANELA_EDICAO_MS = 48 * 60 * 60 * 1000;

export function pesoInicialTravado(criadoEm: string | null | undefined) {
  if (!criadoEm) return false;
  return Date.now() - new Date(criadoEm).getTime() > JANELA_EDICAO_MS;
}
