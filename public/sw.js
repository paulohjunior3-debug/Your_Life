const CACHE_NAME = "your-life-v1";
const APP_SHELL = ["/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => chave !== CACHE_NAME)
            .map((chave) => caches.delete(chave))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Nunca interceptar mutações (server actions, forms) -- deixa falhar
  // naturalmente se estiver offline; a UI trata isso via fila local
  // (ver lib/utils/offline-queue.ts).
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Navegação de página: tenta a rede primeiro, cai pro cache se offline
  // (mostra a última versão vista dessa tela).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return resposta;
        })
        .catch(
          () =>
            caches
              .match(request)
              .then((r) => r || caches.match("/inicio"))
        )
    );
    return;
  }

  // Assets com hash no nome e imagens de exercício: cache-first (não
  // mudam depois de publicados, então não precisa revalidar toda vez).
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/exercicios/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((resposta) => {
            const copia = resposta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
            return resposta;
          })
      )
    );
  }
});
