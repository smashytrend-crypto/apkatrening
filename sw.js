// Działanie bez internetu i szybki start.
// Aplikacja otwiera się od razu z pamięci telefonu (nie czeka na zasięg),
// a w tle pobiera nowszą wersję — będzie widoczna przy następnym uruchomieniu.
// Ten plik dotyczy wyłącznie plików aplikacji; dane treningowe są w innym miejscu i nie są tu ruszane.
const PAMIEC = "dziennik-0818195c14";
const PLIKI = ["./", "index.html", "app.0818195c14.js", "fonts.css", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "apple-touch-icon.png", "favicon-32.png", "dane.enc.json",
  "fonts/cinzel-latin-63551c.woff2", "fonts/cinzel-latin-ext-53a6c3.woff2",
  "fonts/manrope-latin-cf48e3.woff2", "fonts/manrope-latin-ext-b4290e.woff2"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(PAMIEC).then((c) => c.addAll(PLIKI)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((k) => Promise.all(k.filter((n) => n !== PAMIEC).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(PAMIEC).then(async (c) => {
      const zapisany = await c.match(req, { ignoreSearch: true });
      const zSieci = fetch(req)
        .then((r) => { if (r.ok) c.put(req, r.clone()); return r; })
        .catch(() => null);
      if (zapisany) { e.waitUntil(zSieci); return zapisany; }
      const r = await zSieci;
      if (r) return r;
      if (req.mode === "navigate") return (await c.match("index.html")) || Response.error();
      return Response.error();
    }),
  );
});
