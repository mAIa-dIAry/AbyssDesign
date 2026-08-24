---
name: implement-abyss-ui
description: >
  Implements or modifies application UI with Abyss Design System components, props, and
  documented composition patterns. Use when adding or changing any UI in MaiaApp, AdminWeb,
  or other apps consuming @maiadiary/abyss-design; when the user mentions Abyss, forms, cards,
  dialogs, buttons, layout, or design-system compliance.
argument-hint: '[ekran/sekcja] – [co dodać lub zmienić]'
disable-model-invocation: false
---

# Implementacja UI z Abyss Design

## Cel

Dodać lub zmienić element interfejsu w aplikacji konsumującej Abyss Design, **bez omijania systemu** — wyłącznie gotowe komponenty `Abyss*` i ich propsy/sloty, zgodnie z kanoniczną dokumentacją.

**Nie tworzy nowych komponentów design systemu** — do tego użyj skillu `make-component` w repozytorium AbyssDesign.

## Kiedy używać

- Nowa strona, sekcja, formularz, karta, dialog, toolbar, lista akcji.
- Modyfikacja istniejącego widoku korzystającego z Quasara lub surowego HTML — zamiana na Abyss.
- Review implementacji pod kątem zgodności z Abyss.

## Źródła prawdy (czytaj przed kodowaniem)

1. **Standard systemowy:** `AbyssDesign/docs/architecture/abyss-design.md`
2. **API komponentu:** `AbyssDesign/src/components/ui/Abyss<Nazwa>/Abyss<Nazwa>.stories.ts` (Storybook / autodocs)
3. **Wzorce formularza:** story `AbyssForm` → „Podstawy układu”
4. **Landing:** `AbyssDesign/src/stories/AbyssDesign.mdx`

W aplikacji importuj komponenty przez alias projektu (np. `@/components/ui/AbyssButton/AbyssButton.vue`).

## Krok 1 — Klasyfikuj kontekst

| Kontekst                                            | Przykłady                                   | Custom `class` / `style` na prymitywach Abyss                                        |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Formularz / standardowa karta / dialog ustawień** | ustawienia konta, auth, potwierdzenie hasła | **Zabronione** — tylko propsy i sloty                                                |
| **Komponent złożony aplikacji**                     | edytor notatek, dedykowany toolbar archiwum | **Dozwolone** — stylowanie w jednym pliku komponentu nadrzędnego (scoped SCSS + BEM) |

Jeśli widok to formularz/karta, **nie** przenoś stylowania z komponentu złożonego na stronę ustawień.

## Krok 2 — Dobierz komponenty

Priorytet: **Abyss przed Quasarem**. Quasar (`q-icon`, `q-popup-proxy`, `q-chip`) tylko tam, gdzie story Abyss to dokumentuje (np. ikona w `header-prepend`, popup daty z `class="abyss-date-menu"`).

| Potrzeba                      | Komponent                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Sekcja / ustawienia           | `AbyssCard` + ikona w `#header-prepend`                                               |
| Decyzja / modal               | `AbyssDialog`                                                                         |
| Formularz                     | `AbyssForm` + pola (`AbyssInput`, `AbyssSelect`, `AbyssToggle`…)                      |
| Siatka pól / przycisków akcji | `AbyssGrid` ze stałymi formularza                                                     |
| Akcja                         | `AbyssButton` (matryca wariantów poniżej)                                             |
| Toolbar segmentów             | `AbyssButtonGroup`                                                                    |
| Komunikat ryzyka              | `AbyssInfo`                                                                           |
| Feedback po akcji             | `notify()` z `@/stores/notify.store` (kolejka `AbyssNotify` w overlayu szablonu)      |
| Data / czas                   | `AbyssDate`, `AbyssTime` lub `AbyssInput` z `type="date"` / `time` / `datetime-local` |

Przed wyborem sprawdź w `AbyssDesign/src/components/ui/`, czy istnieje gotowy komponent — nie duplikuj w aplikacji.

## Krok 3 — Stałe formularza

Import ze stałych siatki (ścieżka w pakiecie):

```ts
import {
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
  ABYSS_INPUT_ROW_GAP,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
```

Reguły układu:

- **Nie owijaj** `AbyssInput` / `AbyssSelect` w dodatkowy `AbyssGrid` — mają wewnętrzną siatkę.
- Przyciski akcji pod polami: `AbyssGrid` z `align="right"`, `:column-size="INPUT_COLUMN_SIZE"`, `:max-columns="INPUT_GRID_MAX_COLUMNS"`.
- Przyciski główne: `size="big"`, często `full-width`.
- Pola (`AbyssInput` / `AbyssSelect`): `size="small"` \| `"big"` (domyślnie `big`) — ta sama nazwa co przycisk.
- Hasło: zmiana/ustawienie **tylko** w `AbyssDialog`; w karcie wyłącznie trigger (wyjątek: pole hasła przy logowaniu).

| `size` | Typy | Wysokość | Font | Ikona | Padding (y / x) | Radius |
| ------ | ---- | -------- | ---- | ----- | --------------- | ------ |
| `small` | Button, Input, Select, InputLabel | 32px | 12px | 16px | 8 / 12 | 6px |
| `medium` | tylko Button | 40px | 12px | 16px | 12 / 16 | 6px |
| `big` | Button, Input, Select, InputLabel | 48px | 16px | 24px | 12 / 16 | 8px |

## Krok 4 — `AbyssButton` (skrót)

### `gradient-colors` — tylko klucze semantyczne

`theme` | `success` | `info` | `warning` | `danger` | `hint`

- `theme` — globalne CTA aplikacji, nie lokalna akcja w karcie.
- W karcie/dialogu: każdy przycisk **`flat`**; akcja operacyjna dodatkowo `gradient` + `gradient-colors`.
- Anulowanie: samo `flat`, bez gradientu.
- Nie używaj własnych tablic kolorów.

### Warianty

| Prop         | Kiedy                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| `flat`       | header/stopka `AbyssCard`, stopka `AbyssDialog`, `#prepend`/`#append` w `AbyssInput` |
| `gradient`   | akcja operacyjna ze znaczeniem (z `flat` w karcie/dialogu)                           |
| `embedded`   | akcja poboczna (np. reset hasła)                                                     |
| `current`    | aktywny route / wybrany kontekst nawigacji                                           |
| `toggled`    | aktywny filtr / narzędzie w toolbarze                                                |
| `full-width` | samotna akcja w pionowym stacku formularza/dialogu                                   |

## Krok 5 — Implementacja

1. Otwórz story docelowe komponenty — skopiuj **propsy i strukturę slotów** z wzorca, nie z pamięci.
2. Zaimplementuj minimalny diff — bez refactoru niezwiązanego kodu.
3. W formularzach/kartach: **zero** `class` / `style` / SCSS na `AbyssCard`, `AbyssInput`, `AbyssButton` itd.
4. W komponencie złożonym: custom SCSS tylko w pliku tego komponentu; prymitywy Abyss mogą dostać `class`/`style`.
5. Ikony: Material Symbols Rounded przez `q-icon`; prefiks `sym_r_` tylko gdy ikona ma wariant Rounded.

## Krok 6 — Walidacja przed zakończeniem

Użyj [references/checklist.md](references/checklist.md).

Szybki test:

- [ ] Każda `AbyssCard` z tytułem ma ikonę w `#header-prepend`
- [ ] Formularz bez dodatkowego `AbyssGrid` wokół pól
- [ ] Przyciski w kartach/dialogach: `flat` (+ `gradient` tylko na akcji operacyjnej)
- [ ] Brak natywnych pickerów daty/czasu systemowych
- [ ] Brak custom klas na prymitywach w formularzach/kartach

## Przykłady decyzji

**Ustawienia konta (formularz)** → `AbyssCard` + `AbyssForm` + pola + `AbyssGrid` z przyciskami; bez SCSS na Abyss.

**Usuń konto (destrukcyjne)** → `AbyssCard` + `AbyssInfo type="danger"` + `AbyssButton flat gradient gradient-colors="danger" full-width`.

**Edytor notatek (złożony)** → własny komponent aplikacji; wewnątrz `AbyssInput`/`AbyssButton` z klasami BEM dozwolone.

**Brak komponentu Abyss** → zatrzymaj się; zaproponuj `make-component` w AbyssDesign zamiast obejścia Quasarem na stronie.

## Powiązane skille

| Skill                     | Kiedy                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `install-abyss-skills`    | pierwsza instalacja / odświeżenie kopii (HTTP → `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`) |
| `make-component`          | nowy prymityw w `AbyssDesign/src/components/ui/`                                       |
| `sync-abyss-design-rules` | po każdej modyfikacji w repozytorium AbyssDesign — synchronizacja docs z implementacją |
| `make-plan`               | większa funkcja wymagająca pakietu planu                                               |
