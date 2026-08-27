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

Kanoniczna mapa: `AbyssDesign/docs/architecture/abyss-design.md` → **Potrzeba → jeden komponent**. Poniższa tabela jest kopią 1:1.

Dla każdej potrzeby UI kanon wskazuje **dokładnie jeden** komponent albo **jedną** kompozycję. Kolumna „Komponent” nie zawiera ścieżek do wyboru. Wiersze **BRAK** oznaczają brakujący prymityw: nie zastępuj go Quasarem ani improwizacją — zgłoś `make-component` w AbyssDesign.

`AbyssPinInput` i `AbyssNumericKeypad` są wewnętrzne względem `AbyssAppLock` — nie dobieraj ich z tej tabeli.

Nie importuj shadow-wrapperów `AbyssTemplate`, `AbyssScrollView`, `AbyssSidebarNav`. Kanoniczne nazwy: `AbyssTemplateRoot`, `AbyssTemplateMain`, `AbyssTemplateSidebar`, `AbyssTemplateLogin`.

| Potrzeba | Komponent | Kiedy nie |
| -------- | --------- | --------- |
| Szkielet aplikacji (nav, chrome, overlay toastów) | `AbyssTemplateRoot` | Nie importuj `AbyssTemplate`. |
| Host routingu w layoucie | `router-view` w `#content` Root; strona trasy montuje szablon | Nie wkładaj kart, formularzy ani list bezpośrednio do `#content`. Wyjątek lock PIN: layout może wstawić `AbyssTemplateLogin` zamiast `router-view`. W Storybooku izolowane demo może zagnieździć szablon w Root. |
| Przewijana strona merytoryczna | `AbyssTemplateMain` | Nie na pełnoekranowy auth. Nie importuj `AbyssScrollView`. |
| Ustawienia / nawigacja zakładek | `AbyssTemplateSidebar` | Nie importuj `AbyssSidebarNav`. Nie owijaj dodatkowo w `AbyssTemplateMain`. |
| Pełnoekranowy login / rejestracja | `AbyssTemplateLogin` + `AbyssCard` + `AbyssForm` | Nie `AbyssTemplateMain` ani custom panel auth. Nie `AbyssDialog` (to login nad aplikacją). |
| Pełnoekranowe odblokowanie PIN | `AbyssTemplateLogin` + `AbyssCard` + `AbyssAppLock` | Nie `AbyssDialog` na pełny lock. Ustawianie PIN: `AbyssDialog` `abyss-dialog--compact`, nie Login. Nie dobieraj `AbyssPinInput` / `AbyssNumericKeypad`. |
| Login / reauth nad działającą aplikacją | `AbyssDialog` + `AbyssForm` | Nie `AbyssTemplateLogin`. Nie natywny `<form>`. |
| Decyzja, potwierdzenie, skupione wprowadzanie (hasło, PIN set) | `AbyssDialog` | Nie własny overlay decyzji. Nie pełnoekranowy auth. |
| Sekcja z nagłówkiem i ikoną | `AbyssCard` | Nie `AbyssPanel` (brak chrome karty). Nie `AbyssTile`. Nie własny `div` sekcji. |
| Powierzchnia bez chrome karty (changelog, markdown) | `AbyssPanel` | Nie `AbyssCard`. Nie `AbyssTile`. |
| Kafelek w siatce równorzędnych elementów | `AbyssTile` w `AbyssGrid` | Nie `AbyssCard` na komórkę siatki. Nie `AbyssPanel`. |
| Tytuł sekcji | `title` na `AbyssCard` | Nie `AbyssTitle` w karcie, dialogu ani panelu. |
| Tytuł strony informacyjnej / prawnej poza nawigacją | `AbyssTitle` (`type`, `icon`, `label`) | Nie na głównej podstronie z nawigacją. Nie jako tytuł karty. Brak propsów `level` i `size`. |
| Wrapper formularza | `AbyssForm` | Nie natywny `<form>`. Nie pola luzem w karcie. |
| Pole tekstowe, hasło, e-mail, liczba, copy, search | `AbyssInput` | Data i czas w formularzu: `type="date"`, `"time"` lub `"datetime-local"`, nie samodzielny `AbyssDate` / `AbyssTime`. |
| Data lub czas w formularzu | `AbyssInput` (`type="date"`, `"time"` lub `"datetime-local"`) | Nie samodzielny `AbyssDate` / `AbyssTime`. Nie natywny picker systemowy. |
| Data w popupie / toolbarze (archiwum) | `AbyssDate` | Nie w formularzu ustawień (to `AbyssInput`). Nie natywny `<input type="date">`. |
| Czas w popupie / toolbarze | `AbyssTime` | Nie w formularzu. Nie natywny picker. |
| Wybór z wielu opcji (pole formularza) | `AbyssSelect` | Nie `AbyssSwitcher` (2–5 widoków). Nie `AbyssButtonGroup`. |
| 2–5 równorzędnych widoków w miejscu | `AbyssSwitcher` | Nie `AbyssButtonGroup`. Nie `AbyssSelect`. Nie taby z `AbyssButton` `toggled` / `current`. |
| Zestaw akcji (toolbar, w tym pionowy) | `AbyssButtonGroup` | Nie `AbyssSwitcher`. Dzieci: wyłącznie `AbyssButton`. |
| Pojedyncza akcja | `AbyssButton` | `flat` tylko w miejscach z listy `flat` (poniżej). Nie `q-btn`. |
| Przełącznik włącz / wyłącz | `AbyssToggle` | Nie `AbyssButton` `toggled` jako jedyny przełącznik ustawienia. |
| Suwak — jedna wartość | `AbyssSlider` | Nie `AbyssRange` (dwa kciuki). |
| Zakres liczbowy — dwa kciuki | `AbyssRange` | Nie `AbyssSlider`. Nie para inputów min/max, gdy potrzeba dwóch kciuków. |
| Etykieta wiersza bez kontrolki (np. Zmień hasło) | `AbyssInputLabel` + `AbyssButton` w `AbyssGrid` | Nie `AbyssInput` `readonly` jako etykieta. |
| Siatka przycisków akcji / kafelków | `AbyssGrid` | Nie owijaj pojedynczego `AbyssInput` / `AbyssSelect` dodatkowym Gridem. |
| Nawigacja główna aplikacji | `AbyssNavigation` + `AbyssButton` (`embedded`; `current` na aktywnym route) | Nie `AbyssSwitcher`. Nie `AbyssButtonGroup` jako nav główna. |
| Sticky nagłówek kontekstowy (detal, wstecz) | `AbyssNavHeader` | Nie duplikat etykiety głównej zakładki. Przyciski w `#actions`: `size="medium"` `flat` `embedded`. |
| Menu akcji wiersza tabeli | `AbyssDropdown` | Nie lista przycisków poza Dropdown. Trigger: `icon-only` `more_vert`. |
| Tabela danych | `AbyssTable` (`as-card` na stronie; bez `as-card` w dialogu / panelu) | Nie `q-table`. Dwa tryby to jeden komponent — kontekst ustawia prop, nie drugi kontener. |
| Ciągła seria czasowa | `AbyssChart` | Nie `AbyssHistogram` (koszyki / udział). |
| Koszyki / udział | `AbyssHistogram` | Nie `AbyssChart` (seria ciągła). |
| Oś czasu zdarzeń | `AbyssTimeline` + `AbyssTimelineItem` | Nie lista kart jako timeline. |
| Podgląd Markdown z przełącznikiem preview / code | `AbyssMarkdown` | Nie własny `marked` / `v-html`. Logika changelogu zostaje w warstwie aplikacji. |
| Gotowy HTML (notatka, changelog po sanityzacji) | `AbyssContent` | Nie gdy potrzebujesz przełącznika kod / podgląd (to `AbyssMarkdown`). |
| JSON / kolorowany kod | `AbyssCode` | Nie `AbyssDebug` poza kartą debug DS. Nie `<pre>`. |
| Karta debug design systemu | `AbyssDebug` | Nie jako renderer JSON na stronie produktowej (to `AbyssCode`). |
| Statyczny komunikat kontekstowy | `AbyssInfo` | Nie feedback po akcji (to `notify()`). |
| Feedback po akcji (toast) | helper kolejki `notify()` w aplikacji; host `AbyssNotify` w overlayu Root | Nie `Teleport` `AbyssNotify` ze strony. Nie `$q.notify`. Nie reaktywny `AbyssInfo`. Nie hard-coded `notify.store`. |
| Pasek postępu | `AbyssProgress` | Nie spinner w miejscu (**BRAK**). Nie `AbyssTemplateMainIndicator` poza szablonem Main. |
| Spinner / loader w miejscu (Suspense, widget) | **BRAK** | Nie `q-spinner` / `q-spinner-dots`. Nie `AbyssProgress` jako spinner. Zgłoś `make-component`. |
| Badge statusu semantycznego (`success` / `warning` / `danger`) | **BRAK** | Nie `q-badge`. Nie `AbyssGradientBadge` (to subskrypcja gold / sakura / garden). Zgłoś `make-component`. |
| Badge subskrypcji gold / sakura / garden | `AbyssGradientBadge` | Nie status wiersza tabeli. Nie `q-badge`. |
| Wiersz listy (klikalny rekord, dzień analizy) | **BRAK** | Nie `AbyssButton flat` poza dozwolonymi miejscami `flat`. Nie `ul` / `li` + `flat`. Zgłoś `make-component`. |
| Tło gradientowe aplikacji | `AbyssBackground` | Nie `AbyssGradientBox` jako tło całego layoutu. |
| Preset gradientu (box) | `AbyssGradientBox` | Nie `AbyssBackground` wewnątrz karty. |
| Separator wizualny | `AbyssSeparator` | Nie `hr` / własny border jako separator systemowy. |
| Skrót klawiszowy | `AbyssKeybind` | — |
| Strona 404 / błąd | `AbyssTemplateMain` + `AbyssButton` | Nie `q-btn` i surowy szablon Quasar `ErrorNotFound`. |

**`flat` na `AbyssButton` — jedna lista miejsc:** header i stopka `AbyssCard`, `AbyssDialog`, sloty `#prepend` / `#append` w `AbyssInput`, akcje `AbyssNavHeader`, wnętrze `AbyssSwitcher`. Wszędzie indziej `flat` jest naruszeniem (w tym wiersz listy — patrz **BRAK** powyżej).

### Quasar dozwolony

Wszystko spoza tej tabeli jest naruszeniem — w tym `q-spinner`, `q-badge`, `q-btn`, `q-card`, `q-input`, `q-dialog`, `q-table` i natywny `<form>`.

| Quasar | Jedyne dozwolone użycie |
| ------ | ----------------------- |
| `q-icon` | ikona w slotach Abyss (`#header-prepend`, `AbyssTitle`, prop `icon` przycisku itd.) |
| `q-popup-proxy` | popup `AbyssDate` / `AbyssTime` z `class="abyss-date-menu"` / `"abyss-time-menu"` i `:breakpoint="0"` |
| `q-chip` | token daty w search (wzorzec `AbyssInput` typu `search`) |
| `q-td` / `q-tr` | sloty komórek i wierszy `AbyssTable` |

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
- Pola formularza **zawsze** w `AbyssForm` — nie natywny `<form>`, nie pola luzem w karcie.
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
- Pełna lista miejsc `flat`: Krok 2 (header/stopka Card, Dialog, Input prepend/append, NavHeader actions, wnętrze Switcher).
- Anulowanie: samo `flat`, bez gradientu.
- Nie używaj własnych tablic kolorów.

### Warianty

| Prop         | Kiedy                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| `flat`       | header/stopka `AbyssCard`, `AbyssDialog`, `#prepend`/`#append` `AbyssInput`, akcje `AbyssNavHeader`, wnętrze `AbyssSwitcher` |
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
- [ ] Formularz w `AbyssForm` (nie natywny `<form>`, nie pola luzem)
- [ ] Formularz bez dodatkowego `AbyssGrid` wokół pól
- [ ] Przyciski w kartach/dialogach: `flat` (+ `gradient` tylko na akcji operacyjnej)
- [ ] `flat` tylko na liście miejsc z Kroku 2
- [ ] Data/czas w formularzu: `AbyssInput` z `type="date"` / `"time"` / `"datetime-local"`
- [ ] Brak natywnych pickerów daty/czasu systemowych
- [ ] Brak custom klas na prymitywach w formularzach/kartach
- [ ] Brak Quasara spoza tabeli „Quasar dozwolony”
- [ ] Wiersz **BRAK** (spinner, list-row, badge statusu) nie zastąpiony Quasarem

## Przykłady decyzji

**Ustawienia konta (formularz)** → `AbyssCard` + `AbyssForm` + pola + `AbyssGrid` z przyciskami; bez SCSS na Abyss.

**Usuń konto (destrukcyjne)** → `AbyssCard` + `AbyssInfo type="danger"` + `AbyssButton flat gradient gradient-colors="danger" full-width`.

**Edytor notatek (złożony)** → własny komponent aplikacji; wewnątrz `AbyssInput`/`AbyssButton` z klasami BEM dozwolone.

**Brak komponentu Abyss** (w tym wiersz **BRAK** w Kroku 2) → zatrzymaj się; zaproponuj `make-component` w AbyssDesign zamiast obejścia Quasarem na stronie.

Kopie tego skilla w MaiaApp / AdminWeb są nieaktualne do ponownej instalacji (`install-abyss-skills`) — kanon i tabela `size` żyją w `AbyssDesign/docs/skills/`.

## Powiązane skille

| Skill                     | Kiedy                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `install-abyss-skills`    | pierwsza instalacja / odświeżenie kopii (HTTP → `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`) |
| `make-component`          | nowy prymityw w `AbyssDesign/src/components/ui/`                                       |
| `sync-abyss-design-rules` | po każdej modyfikacji w repozytorium AbyssDesign — synchronizacja docs z implementacją |
| `make-plan`               | większa funkcja wymagająca pakietu planu                                               |
