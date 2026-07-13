const CACHE_NOME = "meu-cantinho-v1";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./app.jsx",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes.filter((n) => n !== CACHE_NOME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  // não mexe em chamadas para CDNs externas (react, tailwind, fontes)
  if (evento.request.url.startsWith(self.location.origin)) {
    evento.respondWith(
      caches.match(evento.request).then((resposta) => resposta || fetch(evento.request))
    );
  }
});
