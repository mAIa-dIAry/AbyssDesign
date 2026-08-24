---
name: audit-abyss-compliance
description: >
  Skanuje wskazany zakres plików pod kątem zgodności z regułami Abyss Design, raportuje
  naruszenia i wprowadza poprawki według kanonicznej dokumentacji. Używaj przy audycie UI,
  refaktorze widoków, review zgodności z Abyss, gdy użytkownik prosi o sprawdzenie/poprawę
  ekranu, sekcji, komponentu lub folderu względem design systemu.
argument-hint: '[ścieżka/zakres] – [kontekst: formularz/karta/dialog/komponent złożony]'
disable-model-invocation: false
---

# Audyt zgodności z Abyss Design

## Cel

Przeskanować **wskazany zakres pracy**, wykryć naruszenia reguł Abyss Design i **wprowadzić poprawki** zgodnie z dokumentacją — bez omijania systemu, bez tworzenia nowych komponentów designu.

**Nie synchronizuje dokumentacji** — do tego służy `sync-abyss-design-rules` w AbyssDesign.
**Nie implementuje nowego UI od zera** — do tego służy `implement-abyss-ui`.

## Wejście (parametry)

Przy wywołaniu ustal:

| Parametr     | Wymagany                | Przykład                                                                                |
| ------------ | ----------------------- | --------------------------------------------------------------------------------------- |
| **Zakres**   | tak                     | `src/pages/SettingsPage/`, `SettingsAccountTab.vue`, `src/components/shared/ChangeLog/` |
| **Kontekst** | nie (agent klasyfikuje) | formularz, karta ustawień, dialog, komponent złożony                                    |
| **Tryb**     | nie                     | domyślnie: skan + poprawki; `scan-only` — tylko raport bez edycji                       |

Jeśli zakres jest niejednoznaczny — dopytaj przed skanem.

## Źródła prawdy (czytaj przed skanem)

1. **Standard:** `AbyssDesign/docs/architecture/abyss-design.md`
2. **Checklist skanowania:** [references/scan-checklist.md](references/scan-checklist.md)
3. **Wzorce napraw:** [references/fix-patterns.md](references/fix-patterns.md)
4. **API komponentów:** `AbyssDesign/src/components/ui/Abyss<Nazwa>/Abyss<Nazwa>.stories.ts`
5. **Checklist końcowy:** `implement-abyss-ui/references/checklist.md`

## Procedura

Skopiuj checklistę i odhaczaj postęp:

```
Postęp audytu:
- [ ] Krok 1 — Zakres i klasyfikacja kontekstu
- [ ] Krok 2 — Inwentaryzacja plików
- [ ] Krok 3 — Skan naruszeń
- [ ] Krok 4 — Raport (przed poprawkami)
- [ ] Krok 5 — Poprawki
- [ ] Krok 6 — Weryfikacja końcowa
- [ ] Krok 7 — Podsumowanie
```

### Krok 1 — Zakres i klasyfikacja kontekstu

- Rozwiń zakres do plików `.vue`, `.ts` (composables/stores używane przez widok), powiązanych `.scss`.
- Dla każdego pliku określ kontekst:

| Kontekst                                   | Reguły stylowania                                                     | Przykłady ścieżek                     |
| ------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------- |
| **Formularz / standardowa karta / dialog** | restrykcyjne — brak `class`/`style`/SCSS na prymitywach Abyss         | `*Settings*`, `*Auth*`, `*Dialog*`    |
| **Komponent złożony aplikacji**            | dozwolone `class`/`style` na prymitywach **wewnątrz** tego komponentu | edytor, toolbar domenowy, `ChangeLog` |
| **Storybook AbyssDesign**                  | wzorce formularza/karty bez custom klas w `docs.source.code`          | `*.stories.ts` w AbyssDesign          |

Nie stosuj reguł formularza do komponentu złożonego i odwrotnie.

### Krok 2 — Inwentaryzacja

W zakresie wypisz:

- użyte komponenty `Abyss*` i Quasar (`q-*`)
- pliki ze stylami dotykającymi Abyss (scoped SCSS, `:deep()`)
- miejsca z `notify()` / `AbyssNotify`, `AbyssInfo`, dialogami, formularzami

Użyj wyszukiwania po plikach w zakresie — nie opieraj się na pamięci.

### Krok 3 — Skan naruszeń

Przejdź [references/scan-checklist.md](references/scan-checklist.md) sekcja po sekcji.

Dla każdego naruszenia zapisz:

| Pole           | Opis                                          |
| -------------- | --------------------------------------------- |
| **ID**         | krótki identyfikator (np. `BTN-FLAT-MISSING`) |
| **Plik:linia** | lokalizacja                                   |
| **Reguła**     | cytat/sekcja z `abyss-design.md`              |
| **Severity**   | 🔴 krytyczne / 🟡 średnie / 🟢 kosmetyczne    |
| **Kontekst**   | formularz-karta / złożony / story             |

**Severity:**

- 🔴 łamie Do/Don't, błędny feedback, brak wymaganego komponentu Abyss zamiast Quasara w formularzu
- 🟡 nieoptymalna kompozycja, brak ikony w karcie, zły wariant przycisku
- 🟢 drobne odchylenia od wzorca story, martwy import

### Krok 4 — Raport (przed poprawkami)

Przedstaw użytkownikowi tabelaryczne podsumowanie naruszeń. Przy `scan-only` zatrzymaj się tutaj.

Jeśli wykryto **niejednoznaczność kontekstu** (formularz vs komponent złożony) — zapytaj przed poprawkami.

### Krok 5 — Poprawki

Kolejność:

1. 🔴 krytyczne → 🟡 → 🟢
2. Jeden plik na raz — minimalny diff
3. Przed zmianą propsa — otwórz story docelowego komponentu i skopiuj wzorzec

Zasady naprawy:

- Stosuj [references/fix-patterns.md](references/fix-patterns.md)
- Zamieniaj Quasar/HTML na istniejący `Abyss*` — nie twórz obejść
- Brak komponentu Abyss → **zatrzymaj się**, zaproponuj `make-component` w AbyssDesign
- Nie refactoruj kodu poza zakresem audytu
- Usuń martwy kod powstały przy poprawkach

### Krok 6 — Weryfikacja końcowa

- Ponownie przejdź skróconą checklistę z `implement-abyss-ui/references/checklist.md`
- Uruchom linter na zmienionych plikach (`ReadLints`)
- Jeśli istnieją testy dla zakresu — uruchom je

### Krok 7 — Podsumowanie

Podaj:

1. **Zakres** — co skanowano
2. **Naruszenia** — liczba przed/po (🔴/🟡/🟢)
3. **Poprawione pliki** — lista
4. **Pominięte** — z uzasadnieniem (brak komponentu, decyzja użytkownika, `scan-only`)
5. **Follow-up** — opcjonalne (`make-component`, większy refactor)

## Granice

- **Nie** twórz nowych komponentów w `AbyssDesign` — wskaż `make-component`
- **Nie** aktualizuj `abyss-design.md` — to robi `sync-abyss-design-rules`
- **Nie** traktuj istniejącego długu technicznego jako nowej normy — popraw do dokumentacji
- **Nie** rozlewaj stylowania z komponentu złożonego na strony formularzowe
- Przy sprzeczności docs vs story — **story + `abyss-design.md`**; przy wątpliwości zapytaj

## Powiązane skille

| Skill                     | Relacja                          |
| ------------------------- | -------------------------------- |
| `install-abyss-skills`    | instalacja / odświeżenie kopii   |
| `implement-abyss-ui`      | wzorzec implementacji po audycie |
| `make-component`          | gdy brakuje prymitywu Abyss      |
| `sync-abyss-design-rules` | po zmianach w samym AbyssDesign  |

## Przykłady wywołania

- `/audit-abyss-compliance src/pages/SettingsPage/ – karty ustawień`
- `/audit-abyss-compliance SettingsUpdateTab.vue`
- `/audit-abyss-compliance src/components/shared/ChangeLog/ – komponent złożony`
- `/audit-abyss-compliance AdminWeb/src/pages/UsersPage/ – scan-only`
