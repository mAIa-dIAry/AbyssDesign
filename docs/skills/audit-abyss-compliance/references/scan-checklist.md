# Checklist skanowania — zgodność z Abyss Design

Używaj tego pliku w **Kroku 3** audytu. Każdy punkt mapuje na sekcję `AbyssDesign/docs/architecture/abyss-design.md`.

Legenda kontekstu: **F** = formularz/karta/dialog, **Z** = komponent złożony, **S** = story AbyssDesign.

---

## 1. Wybór komponentów

| #   | Sprawdź                                                    | F   | Z   | S   | Wyszukiwanie / sygnał                                                         |
| --- | ---------------------------------------------------------- | --- | --- | --- | ----------------------------------------------------------------------------- |
| 1.1 | Quasar zamiast Abyss tam, gdzie istnieje odpowiednik; Quasar spoza tabeli „Quasar dozwolony” | ✓   | ○   | ○   | `q-btn`, `q-card`, `q-input`, `q-dialog`, `q-table`, `q-spinner`, `q-badge`, natywny `<form>` |
| 1.2 | Własny kontener sekcji zamiast przepisanego: `AbyssCard` (nagłówek+ikona), `AbyssPanel` (bez chrome), `AbyssTile` w `AbyssGrid` (kafelek) | ✓   | ○   | ○   | `<div class="*section*">` jako główny kontener ustawień |
| 1.3 | Własne overlaye zamiast `AbyssDialog`                      | ✓   | ○   | ○   | `q-dialog` bez `AbyssDialog`, fixed overlay                                   |
| 1.4 | `<pre>` / własny renderer zamiast `AbyssCode`              | ✓   | ✓   | ○   | `<pre>`, `JSON.stringify` w template                                          |
| 1.5 | Własny Markdown renderer zamiast `AbyssMarkdown`           | ○   | ✓   | ○   | `marked`, `v-html` na surowym MD (poza `AbyssContent`)                        |
| 1.6 | Pola formularza poza `AbyssForm` / natywny `<form>`        | ✓   | ○   | ○   | `<form`, brak `AbyssForm` wokół pól                                           |
| 1.7 | Import shadow-wrappera szablonu                            | ✓   | ✓   | ○   | `AbyssTemplate`, `AbyssScrollView`, `AbyssSidebarNav`                         |
| 1.8 | `AbyssTitle` jako tytuł sekcji (karta / dialog / panel)    | ✓   | ○   | ○   | `AbyssTitle` wewnątrz karty; `level` / `size` na Title                        |
| 1.9 | Pełnoekranowy auth przez `AbyssTemplateMain`               | ✓   | ○   | ○   | `LoginPage` + Main zamiast `AbyssTemplateLogin`                               |

○ = sprawdź gdy dotyczy; ✓ = zawsze w tym kontekście.

---

## 2. Stylowanie prymitywów Abyss

| #   | Sprawdź                                                            | F   | Z                    | S                      |
| --- | ------------------------------------------------------------------ | --- | -------------------- | ---------------------- |
| 2.1 | `class` / `style` na `AbyssCard`, `AbyssInput`, `AbyssButton` itd. | ✗   | ✓ w pliku nadrzędnym | ✗ w `docs.source.code` |
| 2.2 | SCSS / `:deep()` nadpisujące klasy Abyss w widoku formularzowym    | ✗   | —                    | —                      |
| 2.3 | Strony formularzowe dziedziczą klasy z komponentu złożonego        | ✗   | —                    | —                      |

W **F**: każde `class=` / `style=` na tagu `Abyss*` to naruszenie (🔴).

---

## 3. AbyssCard

| #   | Reguła                                                        | Severity |
| --- | ------------------------------------------------------------- | -------- |
| 3.1 | Karta z `title` bez `#header-prepend` z ikoną                 | 🟡       |
| 3.2 | Akcje kontekstowe poza `#header-append`                       | 🟡       |
| 3.3 | Przyciski w `header-append` bez `flat`                        | 🔴       |
| 3.4 | Footer w standardowym układzie ustawień                       | 🟡       |
| 3.5 | `AbyssInfo` jako dynamiczny feedback po akcji (`v-if` po API) | 🔴       |

---

## 4. AbyssButton

| #    | Reguła                                                                 | Severity |
| ---- | ---------------------------------------------------------------------- | -------- |
| 4.1  | Przycisk w `AbyssCard` / `AbyssDialog` bez `flat`                      | 🔴       |
| 4.2  | Akcja operacyjna w karcie/dialogu: brak `gradient` + `gradient-colors` | 🟡       |
| 4.3  | Anulowanie z `gradient`                                                | 🟡       |
| 4.4  | `gradient-colors` jako tablica kolorów zamiast klucza semantycznego    | 🔴       |
| 4.5  | `theme` na lokalnej akcji w bloku (nie globalne CTA)                   | 🟡       |
| 4.6  | `flat` poza listą: header/stopka Card, Dialog, Input prepend/append, NavHeader actions, wnętrze Switcher | 🟡       |
| 4.7  | `current` na filtrach wielokrotnego wyboru (powinno być `toggled`)     | 🟡       |
| 4.8  | Ręczne grupowanie przycisków zamiast `AbyssButtonGroup`                | 🟡       |
| 4.9  | `gradient` gdy akcja jedyna na liście poza kartą/dialogiem             | 🟡       |
| 4.10 | `icon-only` przy akcji nieodwracalnej/niejasnej                        | 🟡       |

Dozwolone klucze `gradient-colors`: `theme`, `success`, `info`, `warning`, `danger`, `hint`.

---

## 5. Formularze i siatka

| #   | Reguła                                                                            | Severity |
| --- | --------------------------------------------------------------------------------- | -------- |
| 5.1 | `AbyssInput` / `AbyssSelect` owinięte dodatkowym `AbyssGrid`                      | 🔴       |
| 5.2 | Przyciski akcji poza `AbyssGrid` z `INPUT_COLUMN_SIZE` + `INPUT_GRID_MAX_COLUMNS` | 🟡       |
| 5.3 | Brak importu stałych siatki z `AbyssGrid.constants`                               | 🟢       |
| 5.4 | Zmiana hasła inline w karcie (poza loginem)                                       | 🔴       |
| 5.5 | Natywny picker daty/czasu (systemowy `<input type="date">` bez `AbyssInput`) — `AbyssInput type="date"` w formularzu jest kanoniczny | 🔴       |
| 5.6 | Samodzielny `AbyssDate` / `AbyssTime` w formularzu ustawień (powinien być `AbyssInput` z `type`) | 🟡       |

---

## 6. AbyssDialog

| #   | Reguła                                                                        | Severity |
| --- | ----------------------------------------------------------------------------- | -------- |
| 6.1 | Taby w body zamiast slotu `#navigation`                                       | 🟡       |
| 6.2 | Zagnieżdżony pionowy scroll w body (`overflow-y`, `max-height` na wrapperach) | 🔴       |
| 6.3 | `AbyssTable` z `height` w dialogu                                             | 🟡       |
| 6.4 | `AbyssCode` bez `:scrollable="false"` w dialogu                               | 🟡       |
| 6.5 | Istotna decyzja bez jawnego anulowania (tylko X)                              | 🟡       |
| 6.6 | Przyciski w stopce bez `flat`                                                 | 🔴       |

---

## 7. AbyssTable

| #   | Reguła                                                   | Severity |
| --- | -------------------------------------------------------- | -------- |
| 7.1 | Tabela klucz–wartość w dialogu z `as-card`               | 🟡       |
| 7.2 | `expandable` / slot `row-expand` bez potrzeby rozwijania | 🟢       |
| 7.3 | Główna tabela strony bez `as-card`                       | 🟡       |

---

## 8. Feedback i komunikaty

| #   | Reguła                                                                    | Severity |
| --- | ------------------------------------------------------------------------- | -------- |
| 8.1 | Sukces/błąd po akcji przez `AbyssInfo` zamiast helpera `notify()` / `AbyssNotifyHost` | 🔴       |
| 8.2 | Brak notify po operacji zapisu/usunięcia gdy UX tego wymaga               | 🟡       |
| 8.3 | Operacja destrukcyjna bez `AbyssInfo` + `gradient-colors="danger"`        | 🟡       |

---

## 9. Storybook (tylko zakres AbyssDesign)

| #   | Reguła                                                                  | Severity |
| --- | ----------------------------------------------------------------------- | -------- |
| 9.1 | Custom `class` w `parameters.docs.source.code` wzorców formularza/karty | 🔴       |
| 9.2 | Opis propsa sprzeczny z `abyss-design.md`                               | 🟡       |

---

## 10. Ogólne

| #    | Reguła                                                           | Severity |
| ---- | ---------------------------------------------------------------- | -------- |
| 10.1 | Martwe importy / nieużywane zmienne po refaktorze                | 🟢       |
| 10.2 | Propsy niezgodne ze story (nieistniejący prop, zła wartość enum) | 🔴       |
| 10.3 | Ikony bez poprawnej konwencji Material Symbols                   | 🟢       |
