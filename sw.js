// Działanie bez internetu: pliki aplikacji są trzymane w pamięci telefonu.
// Przy połączeniu pobierana jest najnowsza wersja; bez połączenia działa zapisana.
const PAMIEC = "dziennik-v3";
const PLIKI = ["./", "index.html", "fonts.css", "manifest.webmanifest", "icon-192.png", "icon-512.png",
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
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) { const kopia = r.clone(); caches.open(PAMIEC).then((c) => c.put(e.request, kopia)); }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("index.html"))),
  );
});
