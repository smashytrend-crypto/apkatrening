# Dziennik Gladiatora — wersja na telefon

Dziennik treningowy działający jako strona, którą można dodać do ekranu głównego telefonu.
Działa bez internetu. Dane zapisują się tylko w telefonie (w tym repozytorium nie ma żadnych danych).

**Dodanie do telefonu:** otwórz stronę → iPhone: Udostępnij → „Do ekranu początkowego”;
Android: menu ⋮ → „Dodaj do ekranu głównego”. Potem otwieraj aplikację z ikony.

**Kopia zapasowa:** Narzędzia → Kopia zapasowa → Zapisz kopię (i wczytanie z pliku).

## Dla programisty

- `zrodlo/index.html` — czytelne źródło aplikacji (tu wprowadza się zmiany), `zrodlo/sw.js` — działanie bez internetu.
- `npm install && node zbuduj.js` — tworzy `index.html`, `sw.js` i skompresowany `app.<wersja>.js`, które otwiera telefon.
- Dane użytkownika są tylko w telefonie (pamięć przeglądarki + kopia w IndexedDB); zmiany w kodzie ich nie dotykają.
