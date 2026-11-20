/* Service worker – Biblioteca CAEX 794 AC. Funciona sin conexión tras la primera visita. */
const VERSION = "caex794-v3";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-48.png", "./icons/icon-1024.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // Se guarda cada archivo por separado: si uno falla, los demás igual quedan.
    await Promise.all(CORE.map(u => c.add(new Request(u, {cache: "reload"})).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Páginas: primero caché (rápido y offline), y se actualiza en segundo plano.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const cached = (await c.match("./index.html")) || (await c.match("./"));
      const net = fetch(req).then(r => { if (r.ok) c.put("./index.html", r.clone()); return r; }).catch(() => null);
      return cached || (await net) || new Response("Sin conexión", {status: 503});
    })());
    return;
  }

  // Tipografías de Google: se guardan al verlas por primera vez.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const cached = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => cached);
      return cached || net;
    })());
    return;
  }

  // Resto de archivos propios: caché primero, red como respaldo.
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const cached = await c.match(req);
      if (cached) return cached;
      try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
      catch (_) { return new Response("", {status: 504}); }
    })());
  }
});
