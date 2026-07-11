---
name: sync-abyss-design-rules
description: >
  Wyekstrahowuje reguły z modyfikacji komponentów Abyss Design, konfrontuje je z dokumentacją
  systemu i aktualizuje ją przy jawnych sprzecznościach. Po zmianie dokumentacji sprawdza spójność
  z innymi częściami designu i proponuje opcje zunifikowania odstających elementów. Uruchamiaj
  przy każdej modyfikacji elementu w repozytorium AbyssDesign (komponent, props, story, SCSS,
  landing Storybooka, reguły Cursor).
argument-hint: '[AbyssNazwa / zakres] – [krótki opis zmiany]'
disable-model-invocation: false
---

# Synchronizacja reguł Abyss Design

## Cel

Po każdej modyfikacji w AbyssDesign doprowadzić **dokumentację do zgodności z aktualną implementacją**, gdy poprawka wynika z realnych potrzeb i stoi w jawnej sprzeczności z dotychczasowymi regułami. Nie tworzy nowych komponentów — do tego służy `make-component`.

## Kiedy uruchamiać

**Obowiązkowo** po każdej zmianie w AbyssDesign dotyczącej:

- komponentu w `src/components/ui/Abyss*/`
- propsów, slotów, zdarzeń lub zachowania komponentu
- stories (`*.stories.ts`) lub landing page (`src/stories/AbyssDesign.mdx`)
- reguł Storybooka (`.cursor/rules/storybook.mdc`)
- standardu systemowego (`docs/architecture/abyss-design.md`)

Uruchamiaj **na końcu** pracy nad zmianą — po zakończeniu implementacji, przed podsumowaniem dla użytkownika.

## Źródła dokumentacji (kolejność ważności)

1. **Kanoniczny standard:** `docs/architecture/abyss-design.md`
2. **Landing Storybook:** `src/stories/AbyssDesign.mdx`
3. **Reguły stories:** `.cursor/rules/storybook.mdc`
4. **API komponentu:** `src/components/ui/Abyss<Nazwa>/Abyss<Nazwa>.stories.ts` (`parameters.docs`, `argTypes`, opisy story)
5. **Powiązane skille konsumentów:** `MaiaApp/.cursor/skills/implement-abyss-ui/SKILL.md`, `AdminWeb/.cursor/skills/implement-abyss-ui/SKILL.md`

Szczegóły mapy dokumentacji: [references/documentation-sources.md](references/documentation-sources.md).

## Procedura

Skopiuj checklistę i odhaczaj postęp:

```
Postęp synchronizacji:
- [ ] Krok 1 — Zakres i diff
- [ ] Krok 2 — Ekstrakcja reguły
- [ ] Krok 3 — Konfrontacja z dokumentacją
- [ ] Krok 4 — Aktualizacja dokumentacji (jeśli potrzebna)
- [ ] Krok 5 — Kontrola spójności między dokumentami
- [ ] Krok 6 — Opcje zunifikowania (jeśli konflikt)
- [ ] Krok 7 — Podsumowanie dla użytkownika
```

### Krok 1 — Zakres i diff

- Ustal **co** zostało zmienione: komponent, props, story, zachowanie wizualne, wzorzec kompozycji.
- Przeczytaj diff lub zmodyfikowane pliki — nie opieraj się na pamięci.

### Krok 2 — Ekstrakcja reguły

Sformułuj **jedną lub więcej reguł** wynikających ze zmiany. Użyj jednego z formatów:

| Format | Przykład |
| ------ | -------- |
| **Do** | „W trybie osadzonym `AbyssTable` nie renderuje kolumny rozwijania bez `expandable`.” |
| **Don't** | „Nie używaj `as-card` dla tabeli klucz–wartość w dialogu.” |
| **Prop / API** | „Prop `content-rows` na `AbyssGrid` kontroluje liczbę wierszy treści siatki.” |
| **Kontekst** | „W stories wzorców formularza `docs.source.code` nie zawiera custom `class`.” |

Reguła musi być **konkretna i weryfikowalna** — unikaj ogólników typu „poprawiono UX”.

Jeśli zmiana jest czysto bugfixem bez nowej reguły użycia → odnotuj „brak nowej reguły” i zakończ po Kroku 3.

### Krok 3 — Konfrontacja z dokumentacją

Dla każdej wyekstrahowanej reguły:

1. Wyszukaj powiązane sekcje w źródłach (Krok 1 listy ważności).
2. Sklasyfikuj wynik:

| Wynik | Działanie |
| ----- | --------- |
| **Zgodność** | Brak zmian w dokumentacji. |
| **Luka** (reguła istotna, brak w docs) | Przejdź do Kroku 4 — dodaj regułę. |
| **Jawna sprzeczność** (docs mówi co innego niż implementacja) | Przejdź do Kroku 4 — zaktualizuj docs na korzyść implementacji. |
| **Niejednoznaczność** | Zapytaj użytkownika, zanim zmienisz standard. |

**Jawna sprzeczność** = dokumentacja zawiera regułę Do/Don't, tabelę lub przykład kodu, który nowa implementacja łamie w sposób zamierzony (nie przypadkowy dług techniczny).

Nie traktuj istniejącego kodu sprzecznego z docs jako nowej normy — chyba że **ta sesja** świadomie go zmienia.

### Krok 4 — Aktualizacja dokumentacji

Aktualizuj **minimalny zestaw plików**:

| Zakres zmiany | Pliki do aktualizacji |
| ------------- | --------------------- |
| Reguła systemowa (kompozycja, Do/Don't, matryca przycisków) | `docs/architecture/abyss-design.md` |
| Reguła widoczna na landingu Storybook | `src/stories/AbyssDesign.mdx` (tylko gdy landing powiela tę regułę) |
| Konwencja stories / `docs.source.code` | `.cursor/rules/storybook.mdc` |
| API lub zachowanie jednego komponentu | opisy w `Abyss<Nazwa>.stories.ts` (`meta`, `argTypes`, `parameters.docs`) |

Zasady edycji:

- Edytuj **tylko** sekcje dotknięte regułą — bez refactoru całego dokumentu.
- Zachowaj ton i strukturę istniejących sekcji (tabele, Do/Don't, przykłady HTML).
- Przy sprzeczności: **implementacja i realna potrzeba wygrywają** nad przestarzałym tekstem.
- Jeśli usuwasz regułę — zastąp ją nową, nie zostawiaj pustej luki bez uzasadnienia.

### Krok 5 — Kontrola spójności

Po każdej edycji dokumentacji przeszukaj **wszystkie źródła** pod kątem:

- sprzecznych Do/Don't
- zdezaktualizowanych przykładów kodu
- duplikatów tej samej reguły sformułowanych inaczej
- starych odniesień do usuniętych propsów lub wzorców

Użyj wyszukiwania po słowach kluczowych reguły (nazwa komponentu, prop, wzorzec).

### Krok 6 — Opcje zunifikowania

Gdy Krok 5 wykryje **konflikt między sekcjami lub plikami** (np. `abyss-design.md` vs `AbyssDesign.mdx` vs story opisują różne zachowanie):

1. **Nie wybieraj samodzielnie** — przedstaw użytkownikowi opcje.
2. Użyj szablonu z [references/unification-options.md](references/unification-options.md).
3. Każda opcja musi mieć: co zostaje kanoniczne, co się zmienia, plusy/minusy.
4. Po decyzji użytkownika — wprowadź zmiany we **wszystkich** dotkniętych plikach w jednym przejściu.

Typowe scenariusze konfliktu:

- landing MDX powiela regułę, która właśnie zmieniła się tylko w `abyss-design.md`
- story dokumentuje prop inaczej niż standard systemowy
- `.cursor/rules/storybook.mdc` vs opis w `implement-abyss-ui`

### Krok 7 — Podsumowanie

Zawsze podaj użytkownikowi:

1. **Wyekstrahowane reguły** (lista)
2. **Wynik konfrontacji** (zgodność / luka / sprzeczność / niejednoznaczność)
3. **Zmienione pliki dokumentacji** (jeśli były)
4. **Wykryte konflikty** i ewentualne opcje zunifikowania oczekujące na decyzję
5. **Brak działań** — gdy zmiana nie wymagała aktualizacji docs

## Granice

- **Nie** zmieniaj implementacji komponentu tylko po to, by dopasować ją do starej dokumentacji — ten skill synchronizuje docs **do** implementacji.
- **Nie** aktualizuj dokumentacji konsumentów (`MaiaApp/docs/...`) — wskazują na kanon w AbyssDesign.
- **Nie** rozszerzaj zakresu na refactor niezwiązanych komponentów.
- Przy sprzeczności wymagającej decyzji produktowej — zatrzymaj się i zapytaj użytkownika (Krok 6).

## Powiązane skille

| Skill | Relacja |
| ----- | ------- |
| `make-component` | Po utworzeniu komponentu — uruchom ten skill |
| `implement-abyss-ui` | Konsumenci czytają zaktualizowany `abyss-design.md` |

## Przykłady wywołania

- Po modyfikacji `AbyssGrid` — automatycznie na końcu sesji
- `/sync-abyss-design-rules AbyssTable – nowy tryb osadzony bez zaokrągleń`
- `/sync-abyss-design-rules AbyssButton stories – zaktualizowana matryca gradient-colors`
