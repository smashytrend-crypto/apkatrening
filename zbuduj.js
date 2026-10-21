// Budowanie wersji, którą otwiera telefon.
//   npm install && node zbuduj.js
// Czyta czytelne źródło z folderu zrodlo/, kompresuje kod aplikacji do osobnego pliku app.<wersja>.js
// (telefon zapamiętuje go w skompilowanej postaci, więc kolejne uruchomienia są szybsze)
// i tworzy index.html oraz sw.js w głównym folderze.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");

const KAT = __dirname;
const zrodlo = fs.readFileSync(path.join(KAT, "zrodlo", "index.html"), "utf8");

// Ostatni znacznik <script> stojący na początku linii to kod aplikacji
// (wcześniejszy to mały mostek zapisu danych; "<script>" wewnątrz kodu Reacta to zwykły tekst).
const start = zrodlo.lastIndexOf("\n<script>\n") + 1;
const koniec = zrodlo.indexOf("</script>", start);
if (start < 1 || koniec < 0) throw new Error("Nie znaleziono kodu aplikacji w zrodlo/index.html");
const kod = zrodlo.slice(start + "<script>".length, koniec);

const { code } = esbuild.transformSync(kod, { minify: true, charset: "utf8", target: "es2020", legalComments: "eof" });
const wersja = crypto.createHash("sha256").update(code).digest("hex").slice(0, 10);
const plikApp = `app.${wersja}.js`;

for (const n of fs.readdirSync(KAT)) if (/^app\.[0-9a-f]{10}\.js$/.test(n) && n !== plikApp) fs.unlinkSync(path.join(KAT, n));
fs.writeFileSync(path.join(KAT, plikApp), code);
fs.writeFileSync(
  path.join(KAT, "index.html"),
  zrodlo.slice(0, start) + `<script src="${plikApp}"></script>` + zrodlo.slice(koniec + "</script>".length),
);
fs.writeFileSync(
  path.join(KAT, "sw.js"),
  fs.readFileSync(path.join(KAT, "zrodlo", "sw.js"), "utf8").replace("__WERSJA__", wersja).replace("__APP__", plikApp),
);
console.log(`Zbudowano: ${plikApp} (${Math.round(code.length / 1024)} KB, źródło ${Math.round(kod.length / 1024)} KB)`);
