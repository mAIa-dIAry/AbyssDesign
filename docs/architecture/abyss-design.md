# Standard Abyss Design

## Spis treści

- [Status i zakres](#status-i-zakres)
- [Zasady nadrzędne](#zasady-nadrzędne)
- [Potrzeba → jeden komponent](#potrzeba--jeden-komponent) (w tym [Quasar dozwolony](#quasar-dozwolony))
- [Formularze i karty vs komponenty złożone](#formularze-i-karty-vs-komponenty-złożone)
- [Powierzchnie i warstwy](#powierzchnie-i-warstwy) (w tym [Warstwy nachodzące na treść](#warstwy-nachodzące-na-treść))
- [Layout strony](#layout-strony) (w tym [Tytuły stron i zakładek](#tytuły-stron-i-zakładek))
- [Feedback po akcjach użytkownika](#feedback-po-akcjach-użytkownika)
- [Matryca AbyssButton](#matryca-abyssbutton) (w tym [Skala `size`](#skala-size))
- [Wzorce kompozycji](#wzorce-kompozycji)
- [Do / Don't](#do--dont)
- [Referencyjne implementacje](#referencyjne-implementacje)
- [Skille dla LLM](#skille-dla-llm)
- [Powiązane pliki](#powiązane-pliki)

---

## Status i zakres

Ten dokument jest kanonicznym standardem **używania** Abyss Design w projekcie Maia. Opisuje, które komponenty wybierać i jak ustawiać ich propsy zgodnie z konwencją systemu.

Najważniejsze zasady interpretacji:

- interfejs budujesz z komponentów `src/components/ui` (prymitywy) i `src/components/templates` (layout) oraz ich udokumentowanych propsów, slotów oraz zdarzeń,
- Storybook dokumentuje API każdego komponentu — ten plik opisuje reguły łączenia komponentów w ekrany,
- **zakres tego dokumentu to pełny zestaw publicznych komponentów Abyss** — mapa wyboru jest tabelą [Potrzeba → jeden komponent](#potrzeba--jeden-komponent); każda potrzeba UI ma dokładnie jeden przepisany komponent,
- w formularzach, standardowych kartach i dialogach obowiązują restrykcyjne reguły bez custom styli,
- komponenty wyższego rzędu w aplikacji (np. edytor notatek) mogą używać `class` i `style` na prymitywach Abyss — patrz sekcja [Formularze i karty vs komponenty złożone](#formularze-i-karty-vs-komponenty-złożone),
- jeżeli aktualny kod odbiega od tego dokumentu, traktuj to jako świadomy dług techniczny, a nie nową normę (m.in. `q-spinner` / `q-badge` / wiersz listy z `flat` — wiersze **BRAK** w tabeli poniżej).

---

## Zasady nadrzędne

1. **Abyss jest warstwą pierwszego wyboru.** Jeśli istnieje komponent w [src/components/ui](../../src/components/ui), używaj go zamiast składać interfejs bezpośrednio z Quasara. Jedyny wyjątek Quasar to tabela [Quasar dozwolony](#quasar-dozwolony).
2. **Formularze i standardowe karty — tylko propsy.** W `AbyssCard`, `AbyssForm`, `AbyssDialog` (ustawienia, auth, potwierdzenia) nie dodawaj własnych klas, stylów inline ani nadpisań SCSS na prymitywach Abyss. Układ kontroluj propsami (`full-width`, `AbyssGrid`, sloty karty itd.).
3. **Komponenty złożone mogą stylować prymitywy.** Przy budowie domenowych komponentów wyższego rzędu (np. edytor, pasek narzędzi archiwum) dozwolone jest przekazywanie `class` i `style` do `AbyssInput`, `AbyssButton` itd. — o ile logika layoutu pozostaje w komponencie nadrzędnym, a nie rozproszona po widokach formularzowych.
4. **Warstwy tymczasowe to `AbyssDialog`.** Decyzje, potwierdzenia i skupione wprowadzanie danych realizuj dialogiem — nie buduj własnych overlayów decyzji. Pełnoekranowy auth to `AbyssTemplateLogin`, nie dialog.
5. **Scroll w dialogu — tylko body.** W `AbyssDialog` jedynym pionowym kontenerem przewijania jest `abyss-dialog__body`. Taby i nawigacja idą do slotu `navigation` (poza body). Treść w body nie może mieć własnych pionowych scrollbarów — używaj `AbyssTable` bez `height`, `AbyssCode` z `scrollable={false}`, `AbyssMarkdown` w trybie osadzonym bez wewnętrznych paneli ze scrollem.
6. **Jedna czytelna hierarchia akcji na blok.** Użytkownik ma od razu widzieć akcję główną, wspierającą i informacyjną. Realizuj to kombinacją `gradient`, `gradientColors`, `flat`, `embedded` i `full-width` na `AbyssButton`.
7. **Operacje destrukcyjne:** `AbyssButton` z `gradient` + `gradient-colors="danger"` oraz kontekst ryzyka przez `AbyssInfo`, ikonografię i copy w `AbyssCard`.
8. **Formularze:** zawsze owijaj pola w `AbyssForm`. Pola (`AbyssInput`, `AbyssSelect`, `AbyssToggle` itd.) mają wewnętrzny układ — nie owijaj ich dodatkowym `AbyssGrid`. Przyciski akcji pod polami układaj w `AbyssGrid` ze stałymi `INPUT_COLUMN_SIZE` i `INPUT_GRID_MAX_COLUMNS` (patrz `AbyssForm` w Storybooku). Nie używaj natywnego `<form>`.
9. **Daty i czas:** w formularzu wyłącznie `AbyssInput` z `type="date"`, `type="time"` lub `type="datetime-local"`. Samodzielny `AbyssDate` / `AbyssTime` tylko w popupie lub toolbarze (wzorzec archiwum). Nie używaj natywnych pickerów systemowych.
10. **Feedback po akcjach:** powodzenie lub niepowodzenie operacji (zapis, usunięcie, ponowienie itd.) komunikuj helperem kolejki `notify()` w aplikacji; host `AbyssNotify` żyje w overlayu `AbyssTemplateRoot`. Nie `AbyssInfo` i nie surowy `$q.notify`. `AbyssInfo` służy wyłącznie do **statycznych** komunikatów kontekstowych osadzonych w układzie strony.
11. **Główne podstrony bez tytułu strony.** Nie powielaj etykiety aktywnej zakładki nawigacji (`AbyssNavigation`) nagłówkiem w treści (np. Dashboard → zakaz `AbyssTitle` „Dashboard”). Tytuł sekcji to wyłącznie `title` na `AbyssCard`. `AbyssTitle` tylko na stronach informacyjnych i prawnych poza nawigacją — patrz [Tytuły stron i zakładek](#tytuły-stron-i-zakładek).
12. **Warstwa nachodząca na treść z przezroczystym tłem ma `backdrop-filter`.** Każdy element, który może wizualnie nakładać się na inną treść i nie jest powierzchnią gradientową (`AbyssBackground`, `AbyssGradientBox`, `AbyssButton` z `gradient`), musi mieć `-webkit-backdrop-filter` i `backdrop-filter` — kanon to `blur(20px)`. Dotyczy dialogów, pickerów daty/czasu, menu, sticky nagłówków i własnych overlayów w komponentach złożonych (np. przycisk dyktowania nad polem edytora). Szczegóły: [Warstwy nachodzące na treść](#warstwy-nachodzące-na-treść).

---

## Potrzeba → jeden komponent

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

---

## Formularze i karty vs komponenty złożone

| Kontekst | Custom `class` / `style` / SCSS | Co stosować |
| -------- | ------------------------------- | ----------- |
| Formularze (`AbyssForm`), standardowe karty ustawień, dialogi auth/hasło | **Zabronione** na prymitywach Abyss | wyłącznie propsy i sloty komponentów |
| Komponenty złożone aplikacji (edytor, dedykowany toolbar, widok domenowy) | **Dozwolone** na prymitywach Abyss wewnątrz komponentu nadrzędnego | `class` / `style` + propsy; stylowanie zamknięte w jednym pliku komponentu |
| Storybook — wzorce formularza/karty | **Zabronione** w przykładach `docs.source.code` | tylko propsy Abyss |
| Storybook — API komponentu | **Dokumentuj** props `class` i `style` | opis kiedy są właściwe (komponenty złożone) |

Przykład dozwolonego użycia: komponent `NoteEditor` w MaiaApp opakowuje `AbyssInput` / `AbyssButton` własnymi klasami BEM w scoped SCSS — to nie jest formularz ustawień ani standardowa karta.

Przykład niedozwolonego użycia: karta „Konto” w ustawieniach z `class="settings-card--custom"` na `AbyssCard` lub `AbyssInput` zamiast `AbyssInfo` + propsów przycisku.

---

## Powierzchnie i warstwy

### Podstawowe komponenty

| Komponent          | Rola                           | Kluczowe propsy / sloty                                                                 |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------- |
| `AbyssCard`        | kontener sekcji                | `title`, sloty `header-prepend`, `header-append`, `content`, `footer` (rzadko)           |
| `AbyssDialog`      | warstwa tymczasowa nad treścią | `model-value`, sloty `header`, `navigation` (taby poza scrollowym body), domyślny content, `actions`; przyciski w stopce zawsze `flat`   |
| `AbyssTitle`       | tytuł strony informacyjnej / prawnej poza nawigacją | tylko `type` (`h1`–`h6`), `icon`, `label` — **brak** `level` i `size`; nie jako tytuł karty |
| `AbyssInfo`        | statyczny komunikat kontekstowy | `type`, `title`, `icon` — pusty stan, ostrzeżenie przed akcją, trwała wskazówka; **nie** feedback po akcji |
| `AbyssNotify`      | toast po akcji użytkownika     | `type`, `message`, `description` (opcjonalny, domyślnie zwinięty), `count` (badge powtórzeń od 2, na prawo od tytułu), `autoClose` (ms, circular progress wokół X), `icon`, `closeable`, `v-model`, `@after-leave` — sukces/błąd operacji; **nie** stały komunikat w układzie strony |
| `AbyssButtonGroup` | zestaw akcji (toolbar, w tym pionowy) | `vertical` (lista pionowa, domyślnie 100% szerokości); dzieci: wyłącznie `AbyssButton`; nie 2–5 widoków w miejscu (to `AbyssSwitcher`) |
| `AbyssSwitcher`    | 2–5 równorzędnych widoków w miejscu | `v-model`, `options` (`name`, `label`, opcjonalnie `icon`); wewnętrznie `AbyssButton flat` |
| `AbyssDropdown`    | menu akcji wiersza tabeli      | dziecko aktywatora; pozycje: `AbyssButton` `flat` `full-width`                          |
| `AbyssGrid`        | responsywna siatka             | `column-size`, `max-columns`, `column-gap`, `row-gap`, `align`, `content-rows`          |
| `AbyssForm`        | obowiązkowy wrapper formularza | `v-model`, `sync`, `@update-form`, `@submit-form` — nie natywny `<form>`, nie pola luzem |
| `AbyssAppLock`     | panel PIN odblokowania         | `message`, `errorMessage`, klawiatura, opcjonalna biometria; pełny ekran w `AbyssCard` wewnątrz `AbyssTemplateLogin`; klawiatura na pełną szerokość treści karty; kropki PIN wyśrodkowane ze stałym `gap` (bez `space-between`); ustawianie PIN w `AbyssDialog` `abyss-dialog--compact` |
| `AbyssPanel`       | powierzchnia bez chrome karty  | `title`, `flush`, slot `title` — changelog / markdown; nie sekcja z nagłówkiem+ikoną (to `AbyssCard`) |
| `AbyssTile`        | kafelek w siatce               | wyłącznie jako dziecko `AbyssGrid`; nie zamiast `AbyssCard`                             |
| `AbyssChart`       | ciągła seria czasowa           | `data`, `labels` — nie koszyki / udział (to `AbyssHistogram`)                           |
| `AbyssHistogram`   | koszyki / udział               | `data`, `labels` — nie seria ciągła (to `AbyssChart`)                                   |
| `AbyssSlider`      | suwak — jedna wartość          | jeden kciuk; nie przedział (to `AbyssRange`)                                            |
| `AbyssRange`       | zakres — dwa kciuki            | `{ min, max }`; nie pojedyncza wartość (to `AbyssSlider`)                               |
| `AbyssNavigation`  | nawigacja główna aplikacji     | dzieci: `AbyssButton` `embedded`; aktywny route: `current`                              |
| `AbyssProgress`    | pasek postępu                  | nie spinner w miejscu (**BRAK**)                                                        |
| `AbyssGradientBadge` | badge subskrypcji            | warianty `gold` / `sakura` / `garden` — **nie** status semantyczny tabeli (**BRAK**)    |
| `AbyssNavHeader`   | sticky nagłówek nawigacyjny    | `title`, `icon`, `backDisabled`, `backIcon`, `backLabel`, `sticky`, `backdrop`, `stickyTop`, slot `actions` (`AbyssButton` `size="medium"` `flat` `embedded`); bez marginesów — inset u góry z `AbyssTemplateMain`; przycisk wstecz zawsze widoczny |
| `AbyssContent`     | typografia gotowego HTML       | `html`, `mode` (`html-note` \| `html-changelog`), `size`, `tone`                        |
| `AbyssMarkdown`    | podgląd Markdown + kod źródłowy | `source`, `v-model` (`preview` \| `code`), `content-mode`, `embedded`                  |
| `AbyssCode`        | kolorowany kod (JSON)          | `value`, `language` (`json` \| `abyss-json`), `colorTheme` (domyślnie `one-dark`)       |
| `AbyssDebug`       | karta debugowania DS           | `data` — cienki wrapper nad `AbyssCode language="abyss-json"`; nie renderer JSON na stronie produktowej |
| `AbyssTemplateRoot`    | szkielet aplikacji (nav + host treści) | `device`, `orientation`, `screenRadius`, `overlayId`; w aplikacji slot `#content` = `router-view` (strona trasy montuje Main/Sidebar/Login); nie karty/formularze bezpośrednio; puste sloty `navigation-start` i `navigation-end` ukrywają sidebar (`<aside>`), inner shadow contentu (inset 8px) chowa się za viewportem po prawej i na dole (bez nawigacji także po lewej); slot `content` bez scrollu i paddingu; slot `overlay` w `overflow-wrapper` (prawy górny róg, `padding: 12px 8px`, `max-height: 100%`, `overflow: auto` tylko gdy zmierzona wysokość przekracza limit) + host `#abyss-template-overlay` na kolejkę `AbyssNotify` (implementacja hosta, nie wzorzec strony) |
| `AbyssTemplateMain`  | przewijany obszar strony       | `device`, `safeArea`, opcjonalny reload; slot `top-bar` (poza scrollowym viewportem); padding treści w SCSS per `device` |
| `AbyssTemplateSidebar`  | układ sidebar + detail (nawigacja zakładek) | własny scroll paneli z mixin scrollbara na urządzeniach z myszką; nie wymaga `AbyssTemplateMain` na poziomie strony |
| `AbyssTemplateLogin`  | widok auth (logowanie)         | `device`; wewnętrzny kontener o stałej `max-width` (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH`); **wymaga `AbyssCard`** w slocie (tytuł + ikona w `#header-prepend`); przykładowa treść karty to formularz logowania (`AbyssForm`); viewport centruje treść w pionie i przewija, gdy formularz jest wyższy; padding per `device` (+ safe-area na mobile) |

### Warstwy nachodzące na treść

Element, który swoją warstwą może nachodzić na inną treść (modal, picker, menu, sticky pasek, pływający przycisk nad polem), a jego tło jest przezroczyste lub półprzezroczyste, **musi** mieć rozmycie tła:

```scss
-webkit-backdrop-filter: blur(20px);
backdrop-filter: blur(20px);
```

| Powierzchnia | `backdrop-filter` |
| ------------ | ----------------- |
| `AbyssDialog`, `AbyssDate`, `AbyssTime`, menu (`abyss-menu-shell`), sticky `AbyssNavHeader` z `backdrop`, sticky nagłówek `AbyssTable`, własne overlaye w komponentach złożonych | **Wymagany** — `blur(20px)` |
| `AbyssBackground`, `AbyssGradientBox`, `AbyssButton` z `gradient`, `AbyssNotify` | **Nie** — to nieprzezroczysta powierzchnia gradientowa |

Nie stosuj tej reguły do kart i paneli w normalnym przepływie dokumentu, które nic nie przesłaniają. Wyjątek: `AbyssNavHeader` w slocie `top-bar` `AbyssTemplateMain` ma `backdrop={false}`, bo nie unosi się nad treścią.

---

## Layout strony

Podział odpowiedzialności między komponentami layoutu:

Komponenty layoutu znajdują się w [`src/components/templates`](../../src/components/templates). **Zakaz importu** shadow-wrapperów `AbyssTemplate`, `AbyssScrollView`, `AbyssSidebarNav` — nawet jeśli glob pakietu je nadal wystawia. Kanoniczne nazwy: `AbyssTemplateRoot`, `AbyssTemplateMain`, `AbyssTemplateSidebar`, `AbyssTemplateLogin`.

| Komponent | Scroll | Padding treści |
| --------- | ------ | -------------- |
| `AbyssTemplateRoot` → slot `content` | **Nie** — `overflow: hidden` | **Nie** — w aplikacji dziecko to `router-view`; strona trasy montuje szablon |
| `AbyssTemplateMain` | **Tak** — viewport przewija treść | **Tak** — góra, boki i dół per `device`; opcjonalnie `safeArea` (mobile) |
| `AbyssTemplateSidebar` | **Tak** — wewnętrznie w sidebarze i panelu treści (mixin scrollbara na urządzeniach z myszką) | Własne insety paneli |
| `AbyssTemplateLogin` | **Tak** — viewport przewija i centruje kontener (`margin-block: auto`) | **Tak** — desktop/web `24px`, mobile `8px` + `env(safe-area-inset-*)` |
| Inny szablon strony (np. edytor, full-bleed) | W szablonie | W szablonie — **nie** bezpośrednio w Root |

### Kompozycja `AbyssTemplateRoot`

W aplikacji:

1. Layout (`MainLayout`) montuje `AbyssTemplateRoot`.
2. Slot `#content` layoutu zawiera `router-view` (ew. wrapper `div` bez paddingu i scrollu). Wyjątek: pełnoekranowy lock PIN zamienia `#content` na `AbyssTemplateLogin` + `AbyssCard` + `AbyssAppLock`.
3. Każda trasa montuje we własnej stronie **dokładnie jeden** szablon: `AbyssTemplateMain` (strony merytoryczne), `AbyssTemplateSidebar` (ustawienia / zakładki) albo `AbyssTemplateLogin` (pełnoekranowy auth).

**Zakaz:** karty, formularze, listy ani inny content strony bezpośrednio w `#content` (omijając szablon strony). Root jest szkieletem (nav, chrome, overlay) — treść strony żyje w szablonie na trasie.

**Zakaz:** `AbyssTemplateMain` jako pełnoekranowy login — to `AbyssTemplateLogin`.

Login **nad** działającą aplikacją (modal reauth / logowanie bez opuszczania sesji) to wyłącznie `AbyssDialog` + `AbyssForm`, nie `AbyssTemplateLogin`.

W Storybooku izolowane demo może zagnieździć szablon strony w `#content` Root — to nie jest wzorzec aplikacji.

```vue
<!-- DO — layout aplikacji: Root + router-view -->
<AbyssTemplateRoot :device="device">
  <template #content>
    <div class="main-layout__route">
      <router-view />
    </div>
  </template>
</AbyssTemplateRoot>

<!-- DO — strona merytoryczna (trasa) -->
<AbyssTemplateMain :device="device" safe-area safe-area-in-template>
  <AbyssCard title="Aktywny plan">…</AbyssCard>
</AbyssTemplateMain>

<!-- DO — ustawienia (trasa) -->
<AbyssTemplateSidebar :device="device" :tabs="tabs">…</AbyssTemplateSidebar>

<!-- DO — pełnoekranowy login (trasa) -->
<AbyssTemplateLogin :device="device">
  <AbyssCard title="Logowanie">
    <template #header-prepend>
      <q-icon name="sym_r_login" size="20px" />
    </template>
    <template #content>
      <AbyssForm v-model="form" :sync="false" @submit-form="handleLogin">
        <AbyssInput v-model="form.email" type="email" label="E-mail" />
        <AbyssInput v-model="form.password" type="password" label="Hasło" />
        <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
          <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
        </AbyssGrid>
      </AbyssForm>
    </template>
  </AbyssCard>
</AbyssTemplateLogin>

<!-- DON'T — content bezpośrednio w Root -->
<AbyssTemplateRoot :device="device">
  <template #content>
    <AbyssCard title="Aktywny plan">…</AbyssCard>
  </template>
</AbyssTemplateRoot>
```

### Presety paddingów `AbyssTemplateMain` (SCSS — bez propsów nadpisujących)

- **desktop / web:** boki `24px`; góra i dół treści `0` — pionowy odstęp w spacerach viewportu (`24px`).
- **mobile:** góra i boki `8px`, dół `24px`; spacery viewportu `12px`.
- **`safeArea` (mobile):** góra i dół treści `0` — inset w spacerze; boki `8px` (lub `max` z safe-area gdy poza szablonem)
- **Loadery odświeżania (mobile portrait, bez `safeArea`):** padding wskaźnika `24px` u góry/dołu

### `safeArea` (mobile)

- **`safeArea`:** włącza zewnętrzną ramkę `__frame` ze spacerami (`__safe-top`, opcjonalnie `__safe-bottom` / `__safe-right`); **viewport scrolla bez zmian**. `__safe-top` jest zawsze nad slotem `top-bar` (gdy `safeArea` na mobile).
- Górny spacer: **`max(0, env(safe-area-inset-top) − 12px)`** — 12px to wysokość maski gradientowej u góry viewportu; przy **`safeAreaInTemplate`** pełny **`env(safe-area-inset-top)`** (bez odejmowania 12px).
- **`padding-top` / `padding-bottom` treści w trybie `safeArea` wynoszą `0`** — inset jest w spacerze.
- Maski gradientowe **12px** u góry i dołu viewportu (`mask-image`).
- **`safeAreaInTemplate` (domyślnie `true`):** bez offsetu nawigacji — szablon rezerwuje miejsce przez grid.
- **`safeAreaInTemplate={false}`:** portrait — dolny spacer `72px + safe-area-bottom`; landscape — prawy spacer `80px + safe-area-right`.
- **`orientation`:** `'portrait' | 'landscape'` — wybór strony offsetu nawigacji gdy `safeAreaInTemplate` jest `false`.
- Desktop / web: `safeArea` ignorowane — brak spacerów i masek.

```vue
<AbyssTemplateMain
  :device="device"
  safe-area
  safe-area-in-template
  :orientation="simpleOrientation"
  class="page-example__scroll"
>
  <!-- przewijalna treść -->
</AbyssTemplateMain>
```

### Presety `AbyssTemplateLogin`

- **desktop / web:** padding viewportu `24px`.
- **mobile:** padding viewportu `8px`, nie mniejszy niż `env(safe-area-inset-*)`.
- Wewnętrzny `__container`: `width: 100%`, `max-width` = `ABYSS_TEMPLATE_LOGIN_MAX_WIDTH` (`360px`), `margin-block: auto` — centruje krótki formularz, a przy przepełnieniu pozwala przewinąć od góry.
- **Wymagany `AbyssCard`** w slocie domyślnym: `title` oraz ikona w `#header-prepend`; treść karty to `AbyssForm` (login / rejestracja) albo `AbyssAppLock` (odblokowanie PIN). Nie wkładaj paneli ani pól bezpośrednio do szablonu. Nie używaj `AbyssTemplateMain` jako ekranu auth.
- Zazwyczaj w Root **bez** slotów nawigacji. Nie owijaj w `AbyssTemplateMain`.

### Slot `top-bar` (`AbyssTemplateMain`)

- Stały pasek u góry strony **poza** przewijalnym viewportem — wzorzec jak toolbar archiwum (`page-archive__toolbar`).
- Górny inset safe-area rezerwuje `__safe-top`; `__top-bar` ma `padding-top` **12px** (mobile) / **24px** (desktop / web) oraz padding boczny per `device`.
- Kolejność w scrollowalnej treści: **spacer** (zawsze) → **loader górny** (opcjonalnie) → **spacer** (gdy loader górny) → **treść** (`min-height`: `100% − 2×spacer`) → **spacer** (gdy loader dolny) → **loader dolny** (opcjonalnie) → **spacer** (zawsze). W pozycji spoczynkowej scroll ukrywa strefę loadera — widoczny jest spacer za loaderem (góra) i spacer końcowy (dół).
- `AbyssNavHeader` w `top-bar`: `sticky={false}`, `backdrop={false}`.
- **Desktop / web** z aktywnym slotem `top-bar`: górna maska gradientowa viewportu (`12px`, bez dolnego fade); spacery viewportu pozostają `24px`.

### Wzorzec strony ze scrollem

```vue
<div class="page-example">
  <div class="page-example__content">
    <AbyssTemplateMain
      :device="device"
      safe-area
      safe-area-in-template
      :orientation="simpleOrientation"
      class="page-example__scroll"
    >
      <template #top-bar>
        <!-- opcjonalny stały toolbar (np. wyszukiwarka archiwum) -->
      </template>
      <!-- przewijalna treść -->
    </AbyssTemplateMain>
  </div>
</div>
```

Strona: `height: 100%`, `min-height: 0`, flex column. Kontener content i `AbyssTemplateMain`: `flex: 1`, `min-height: 0`.

### Tytuły stron i zakładek

Kontekst aktywnego widoku niesie **nawigacja** (`AbyssNavigation` + `AbyssButton` z `route` / `current`), a w ustawieniach — zakładki `AbyssTemplateSidebar`. Treść głównej podstrony **nie powtarza** tej etykiety.

**Zakaz**

- `AbyssTitle` (ani inny nagłówek) na poziomie głównej podstrony powielający nazwę zakładki / pozycji menu, np. „Dashboard”, „Archiwum”, „Ustawienia”, „Analiza”.
- Hero / page heading / `h1` otwierający treść głównej trasy nawigacyjnej.

**Dozwolone**

- Tytuł sekcji — wyłącznie `AbyssCard` z `title` (i ikoną w `header-prepend`).
- `AbyssNavHeader` w `#top-bar` tylko gdy jest to toolbar kontekstowy (np. detal z wstecz), a nie duplikat etykiety głównej zakładki.
- Pełnoekranowe strony **informacyjne poza nawigacją główną** (polityka prywatności, regulamin, pomoc) — tam `AbyssTitle` (`type`, `icon`, `label`) jako tytuł dokumentu.

Nie używaj `AbyssTitle` wewnątrz karty, dialogu ani panelu — tytuł tych powierzchni to `AbyssCard title` albo nagłówek `AbyssDialog`.

```vue
<!-- DON'T — główna podstrona z tytułem zakładki -->
<AbyssTemplateMain :device="device" safe-area safe-area-in-template>
  <AbyssTitle type="h1" label="Dashboard" />
  <AbyssCard title="Aktywny plan">…</AbyssCard>
</AbyssTemplateMain>

<!-- DO — treść od razu w kartach; kontekst = nawigacja -->
<AbyssTemplateMain :device="device" safe-area safe-area-in-template>
  <AbyssCard title="Aktywny plan">…</AbyssCard>
  <AbyssCard title="Podsumowanie planów">…</AbyssCard>
</AbyssTemplateMain>
```

### Mixin `scrollbar` (`src/scss/helpers/mixins.scss`)

- Stosuj `@include scrollbar` bez warunków na `device` ani `Platform.is.mobile`.
- Widoczny scrollbar tylko na urządzeniach z myszką: `@media (hover: hover) and (pointer: fine)`.
- Na pozostałych urządzeniach scrollbar jest ukryty, przewijanie dotykowe pozostaje bez zmian.
- Mixin ustawia też `--scrollbar-width` (`0px` / `6px`) — używaj w maskach i layoutach zależnych od szerokości scrollbara.

### `AbyssNavHeader`

- **Bez marginesów** — odstęp od górnej krawędzi zapewnia `AbyssTemplateMain` (padding treści).
- Tekst tytułu: **18 px**; ikona obok tytułu: **24 px**.
- `stickyTop` ustawia `top` w trybie sticky. Domyślnie `var(--abyss-scroll-view-content-padding-top, 0)` — po przewinięciu nagłówek zachowuje odstęp od górnej krawędzi równy górnemu paddingowi `AbyssTemplateMain`.

### Odświeżanie list (reload)

- Domyślnie wyłączone: `disabledTop` i `disabledBottom` są `true`.
- Włącz tylko tam, gdzie potrzebne (np. archiwum — dół listy, lista analiz — góra).
- Przy włączonym odświeżaniu od góry startowy `scrollTop` ustawia się na wysokość górnego loadera — chroni to przed przypadkową aktywacją `refresh-top` przy wejściu na stronę.
- Wysokość scrolla przy włączonym loaderze: `100%` viewportu + zmierzona wysokość sekcji loadera (góra i/lub dół). `__body` wypełnia obszar między loaderami (`flex: 1 1 auto`, `min-height: calc(100% - inset góra - inset dół)`), dzięki czemu pusty stan może być wyśrodkowany pionowo, a dolny loader pozostaje poza widocznym obszarem treści do momentu przewinięcia.

---

### Hierarchia `AbyssTitle`

Na **głównych podstronach** (trasy z `AbyssNavigation` / zakładki sidebara) nie umieszczaj samodzielnego `AbyssTitle` nad treścią — patrz [Tytuły stron i zakładek](#tytuły-stron-i-zakładek). Poniższa hierarchia dotyczy wyłącznie stron informacyjnych i prawnych poza nawigacją główną. Publiczne API to `type`, `icon`, `label` — **nie ma** propsów `level` ani `size`.

| `type` | Rola | Typowe miejsce |
| ------ | ---- | -------------- |
| `h1` | tytuł dokumentu informacyjnego | polityka prywatności, regulamin, pomoc (poza głównymi zakładkami) |
| `h2` | nagłówek pierwszego poziomu w dokumencie | sekcja na stronie prawnej |
| `h3`–`h6` | nagłówki pomocnicze | wyodrębnienie podsekcji dokumentu |

### Reguły `AbyssCard`

- Karta z tytułem **zawsze** ma ikonę w `header-prepend` odpowiadającą tematowi sekcji.
- Akcje kontekstowe (odświeżenie, filtr) w `header-append` jako `AbyssButton` z `flat` i ewentualnie `size="small"`.
- Stopka (`footer`, `footer-prepend`, `footer-append`) tylko w specyficznych sytuacjach (np. niezapisane zmiany) — nie w standardowym układzie.
- `AbyssInfo` stosuj tylko, gdy komunikat ma tytuł lub status semantyczny **i jest częścią stałego układu ekranu** (np. pusty stan tabeli, ostrzeżenie przed usunięciem konta).
- Nie używaj `AbyssInfo` do pokazywania wyniku akcji użytkownika (sukces/błąd po API) — do tego służy helper kolejki `notify()`.

### AbyssInfo — typy i gradienty

Prop `type` determinuje semantyczny gradient tła. **Nie mieszaj typu z ikoną ani etykietą** — `type="info"` z ikoną `info` i tytułem „Informacja” to niebieski gradient; `type="hint"` z ikoną `lightbulb` to fioletowy gradient podpowiedzi.

| `type`    | Gradient   | Kiedy używać                                                                 | Ikona          |
| --------- | ---------- | ---------------------------------------------------------------------------- | -------------- |
| `info`    | niebieski  | istotna informacja kontekstowa (kontekst dialogu, opis operacji, dane o obiekcie) | `info`         |
| `hint`    | fioletowy  | podpowiedź, pusty stan, wskazówka pomocnicza                                 | `lightbulb`    |
| `warning` | żółty      | ostrzeżenie przed akcją wymagającą uwagi                                     | `warning`      |
| `danger`  | czerwony   | ryzyko, operacja nieodwracalna                                               | `error`        |
| `success` | zielony    | trwały komunikat o pozytywnym stanie ekranu (nie feedback po akcji)          | `check_circle` |

Przykład informacji kontekstowej w dialogu:

```html
<AbyssInfo type="info" icon="info" :title="t('common.labels.info')">
  Urządzenia powiązane z kontem {{ email }}.
</AbyssInfo>
```

Przykład podpowiedzi / pustego stanu:

```html
<AbyssInfo type="hint" icon="lightbulb" :title="t('routes.workers.emptyJobsTitle')">
  {{ t('routes.workers.emptyJobs') }}
</AbyssInfo>
```

---

## Feedback po akcjach użytkownika

Po wykonaniu akcji przez użytkownika (zapis formularza, usunięcie rekordu, ponowienie zadania, błąd sieci) informacja zwrotna musi iść przez **helper kolejki `notify()` w aplikacji**. Host `AbyssNotify` żyje w overlayu `AbyssTemplateRoot` — to implementacja hosta, nie wzorzec strony. Nie `AbyssInfo` i nie surowy `$q.notify` / `Notify.create`. Ścieżka importu helpera jest lokalna dla aplikacji (nie hard-coded `notify.store`).

| Sytuacja | Mechanizm | Przykład |
| -------- | --------- | -------- |
| Akcja zakończyła się sukcesem | `notify({ type: 'success', … })` | „Zadanie zostało usunięte.” |
| Akcja zakończyła się błędem | `notify({ type: 'danger', … })` | „Nie udało się usunąć zadania.” |
| Ostrzeżenie po akcji (np. pominięta synchronizacja) | `notify({ type: 'warning', … })` | „Synchronizacja wymaga logowania.” |
| Trwały komunikat na stronie (pusty stan, ostrzeżenie przed destrukcją) | `AbyssInfo` | „Brak zadań w kolejce.” |
| Błąd walidacji w formularzu | `AbyssInput` (`error`, `errorMessage`) lub `AbyssInfo` w dialogu | pole z błędnym hasłem |

Reguły:

- **Nie** przełączaj widoczności `AbyssInfo` reaktywnie po `@success` / `@click` / odpowiedzi API — to antywzorzec; użytkownik traci kontekst, a layout „skacze”.
- `AbyssNotify` jest **efemeryczny** — znika po zamknięciu (X) albo po `v-model="false"`; wejście (z góry) i zejście (w dół) trwają 0,2 s. Wysokość slotu (toast + 8px odstęp jako `::after`) zwija się razem z animacją, `overflow: visible` — toast wystaje ze slotu (`translateY`). **Ostatni** toast w kolejce przy zejściu nie zwija `grid-template-rows` — zostaje pełna wysokość, tylko zsuwa się i gaśnie. Host kolejki ma `padding: 12px 8px` i **stałą szerokość** `min(100%, 420px + 16px)`, żeby toast nie rósł z treścią — tytuł dostaje ellipsis. `overflow: auto` na hoście to **przełącznik po ciszy 0,2 s** (czas animacji): dodawanie albo usuwanie toastów, akordeon i `window.resize` tylko resetują timer — stan `auto`/`visible` nie zmienia się w trakcie serii. Po ciszy JS mierzy sumę wysokości i ustawia `auto` albo `visible`. Widoczność steruj `v-model` (jak w `AbyssTemplateRoot`), nie demontażem z `v-for` w `@close`. Nowo zamontowany toast też wchodzi (`appear`). W kolejce instancję zdejmij dopiero w `@after-leave`.
- Overlay `AbyssNotify` (`rgba(black, 0.5)`, zaokrąglony, 1px od krawędzi toasta) obejmuje lewą ikonę i treść; przycisk zamknięcia (40×46px, ripple od press) zostaje poza overlayem, na gradiencie. Tytuł ma ellipsis. `description` jest opcjonalny i domyślnie zwinięty; przy niepustym opisie po prawej tytułu jest chevron. Kliknięcie paska tytułu (ripple od press) otwiera akordeon (0,2 s) na opisie i na tytule — od jednego wiersza z ellipsisem do pełnego zawinięcia, ze stałym odstępem pierwszego wiersza od góry. Opcjonalny `count` (≥ 2) pokazuje badge z liczbą powtórzeń tego samego toasta, na prawo od tytułu, przed chevronem; przy zmianie liczby badge puszcza rozszerzający się, zanikający ripple (0,4 s). Opcjonalny `autoClose` (ms) zamyka toast sam; wokół X widać circular progress; hover i `:focus-within` wstrzymują timer i dają pierścieniowi opacity 0,5, zmiana `count` resetuje go. Ikony (lewa, chevron, X) siedzą w kontenerach 46px wyrównanych do góry. Tekst i ikony są zawsze białe.
- W aplikacji strony wywołują helper kolejki `notify()` — nie montują `AbyssNotify` i nie robią `Teleport` ze strony. Host kolejki w `AbyssTemplateRoot` (`#abyss-template-overlay` albo slot `#overlay`) to implementacja hosta: kotwica w prawym górnym rogu obszaru treści; nie wstawiaj toasta w przewijaną treść strony. Host overlay ma `gap: 0` — odstęp między toastami (8px) pochodzi z `::after` na shellu, nie z flex `gap`. Nie ustawiaj `top`/`right` 16px — inset to `padding: 12px 8px`, szerokość `min(100%, 420px + 16px)`, `max-height: 100%`. `overflow: auto` to przełącznik po ciszy 0,2 s (czas animacji): JS mierzy sumę wysokości i ustawia `auto` albo `visible`, bez zdejmowania `auto` w trakcie dodawania. Toasty: `width: 100%`, `min-width: 0` (ellipsis tytułu), `flex-shrink: 0` w pionie. Poza szablonem owiń `v-for` klasą `abyss-notify-queue`.
- `AbyssInfo` pozostaje w miejscu, gdzie komunikat ma być **zawsze widoczny**, dopóki zmieni się stan ekranu (np. pojawią się dane, użytkownik zamknie dialog).

Przykład ze strony (helper kolejki):

```ts
notify({ type: 'success', message: 'Zadanie zostało usunięte.' })
```

Implementacja hosta w overlayu Root (nie kopiuj na stronę):

```html
<Teleport defer to="#abyss-template-overlay">
  <AbyssNotify
    v-model="savedVisible"
    type="success"
    message="Zadanie zostało usunięte."
  />
</Teleport>
```

Przykład dozwolonego `AbyssInfo` (statyczny):

```html
<AbyssInfo type="hint" icon="lightbulb" :title="t('routes.workers.emptyJobsTitle')">
  {{ t('routes.workers.emptyJobs') }}
</AbyssInfo>
```

Przykład niedozwolonego użycia (dynamiczny feedback):

```html
<!-- ❌ Nie: AbyssInfo pojawiający się po akcji -->
<AbyssInfo v-if="actionMessage" type="success" icon="check_circle" :title="t('common.labels.success')">
  {{ actionMessage }}
</AbyssInfo>
```

Zamiast tego: `notify()` z helpera kolejki w aplikacji i brak reaktywnego `AbyssInfo` na stronie.

---

## Matryca AbyssButton

### Kolory semantyczne (`gradient` + `gradient-colors`)

Używaj wyłącznie kluczy semantycznych — nie przekazuj własnych tablic kolorów.

| Klucz     | Kiedy używać                                              | Przykłady                                      | Nie używaj gdy                                      |
| --------- | --------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `theme`   | najistotniejsza funkcja globalna w całej aplikacji        | dodanie notatki, aktualizacja subskrypcji      | akcja jest tylko główna w jednym bloku lub dialogu  |
| `success` | akceptacja lub potwierdzenie                              | zatwierdzenie wyboru, potwierdzenie zgody      | zapis, edycja, operacja destrukcyjna                |
| `info`    | zapis i edycja                                            | zapisz zmiany, edytuj profil                   | operacja wymaga podwyższonej uwagi                  |
| `warning` | akcje wymagające uwagi                                    | zmiana hasła, istotna zmiana                   | zwykły zapis bez podwyższonego ryzyka               |
| `danger`  | operacje nieodwracalne                                    | usunięcie danych, trwałe usunięcie konta       | akcja odwracalna lub tylko informacyjna             |
| `hint`    | akcje informacyjne lub prowadzące do pobocznego procesu  | dowiedz się więcej, otwórz szczegóły           | główna decyzja, zapis, potwierdzenie, destrukcja    |

Reguły:

- `theme` jest zarezerwowany dla najważniejszych funkcji na skalę całej aplikacji.
- Kolory `success`, `info`, `warning`, `danger` i `hint` są kontekstowe — w dialogu z potwierdzeniem i anulowaniem przycisk operacyjny dostaje kolor zależny od wykonywanej akcji.
- `warning` ma priorytet nad `info`, gdy chodzi o zapis lub potwierdzenie czegoś istotnego.
- Nie używaj `gradient`, jeśli akcja jest jedyna na liście poza kartą/dialogiem.
- W nagłówku i stopce `AbyssCard` oraz w `AbyssDialog` **wszystkie** przyciski używają `flat`. Akcja operacyjna łączy `flat` + `gradient` + `gradient-colors`. Ta sama lista miejsc `flat`: header/stopka karty, dialog, sloty Input, akcje `AbyssNavHeader`, wnętrze `AbyssSwitcher`.

### Warianty semantyczne

| Wariant    | Kiedy używać                                                                 | Nie używaj gdy                                                         |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| domyślny   | jedyna akcja na liście albo akcja pomocnicza bez gradientu                   | główna akcja operacyjna w parze decyzyjnej                            |
| `flat`     | header/stopka `AbyssCard`, `AbyssDialog`, `#prepend`/`#append` `AbyssInput`, akcje `AbyssNavHeader`, wnętrze `AbyssSwitcher` | poza tą listą (w tym wiersz listy — **BRAK** prymitywu) |
| `current`  | aktualnie aktywny kontekst (nawigacja, wybrany rekord)                       | stan przełączalny toggle; tymczasowy filtr                             |
| `toggled`  | włączony stan nadal klikalny (toolbar, filtry)                               | nawigacja, aktywny route                                               |
| `gradient` | akcja operacyjna ze znaczeniem semantycznym                                   | bez `flat` w headerze/stopce karty i dialogu                         |

### Modyfikatory układu

| Prop           | Kiedy używać                                              |
| -------------- | --------------------------------------------------------- |
| `full-width`   | samodzielna akcja blokowa w pionowym stacku (dialog, formularz) |
| `size="small"` | akcja pomocnicza, toolbar, nagłówek karty, kompaktowe pole |
| `size="medium"` | header/stopka karty i dialogu, `AbyssNavHeader` — tylko `AbyssButton` |
| `size="big"`   | domyślny rozmiar przycisku i pola formularza |
| `icon-only`    | znaczenie oczywiste z kontekstu (zamknięcie, znane ikony) |
| `loading`      | akcja trwa — blokada ponownego kliknięcia                 |
| `percentage`   | postęp ma wartość informacyjną dla użytkownika            |
| `embedded`     | akcja poboczna bez przyciągania uwagi (np. reset hasła)   |

### Skala `size`

Wspólne nazwy: `small` i `big`. `AbyssButton` ma dodatkowo `medium`. Domyślnie wszędzie `big`.

| `size` | Typy | Wysokość | Font | Ikona | Padding (y / x) | Radius |
| ------ | ---- | -------- | ---- | ----- | --------------- | ------ |
| `small` | `AbyssButton`, `AbyssInput`, `AbyssSelect`, `AbyssInputLabel` | **32px** | 12px | 16px | 8px / 12px | 6px |
| `medium` | tylko `AbyssButton` | **40px** | 12px | 16px | 12px / 16px | 6px |
| `big` | `AbyssButton`, `AbyssInput`, `AbyssSelect`, `AbyssInputLabel` | **48px** | 16px | 24px | 12px / 16px | 8px |

Przyciski wbudowane w `AbyssInput` (hasło, lupa, kopiuj, data): przy `size="small"` pola dostają `AbyssButton` `small` (32px); przy `size="big"` pola — `AbyssButton` `medium` (40px).

---

## Wzorce kompozycji

### 1. Karta ustawień lub formularza

```html
<AbyssCard title="Konto">
  <template #header-prepend>
    <q-icon name="sym_r_person" size="20px" />
  </template>
  <template #content>
    <AbyssForm v-model="form" @update-form="store.apply">
      <AbyssInput v-model="form.displayName" label="Nazwa wyświetlana" />
      <AbyssToggle v-model="form.notifications" label="Powiadomienia" full-width />
      <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
        <AbyssButton size="big" label="Zapisz" full-width />
      </AbyssGrid>
    </AbyssForm>
  </template>
</AbyssCard>
```

- Pola bez dodatkowego `AbyssGrid` — wewnętrzna siatka jest w `AbyssInput` / `AbyssSelect`.
- Przyciski akcji w `AbyssGrid` z `INPUT_COLUMN_SIZE`, `INPUT_GRID_MAX_COLUMNS`, `size="big"`, `full-width`.
- Zmiana hasła: trigger w karcie → dedykowany `AbyssDialog` z polami hasła (wyjątek: logowanie).

### 2. Blok destrukcyjny

```html
<AbyssCard title="Usuń konto">
  <template #header-prepend>
    <q-icon name="sym_r_delete_forever" size="20px" />
  </template>
  <template #content>
    <AbyssInfo type="danger" icon="warning" title="Ostrzeżenie">
      Operacja jest nieodwracalna.
    </AbyssInfo>
    <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
      <AbyssButton flat gradient gradient-colors="danger" label="Usuń konto" full-width />
    </AbyssGrid>
  </template>
</AbyssCard>
```

### 3. Dialog potwierdzenia

- `AbyssDialog` z treścią w domyślnym slocie (body).
- **Scroll:** wyłącznie `abyss-dialog__body` przewija treść w pionie. Nie ustawiaj `max-height` / `overflow: auto` na wrapperach w body, nie używaj `AbyssTable` z propem `height`, `AbyssCode` z domyślnym `scrollable` ani textarea z własnym scrollem.
- **Nawigacja / taby:** slot `#navigation` między nagłówkiem a body — poza obszarem scrolla.
- Stopka: wszystkie przyciski `flat`; akcja operacyjna dodatkowo `gradient` + `gradient-colors`; anulowanie bez gradientu.
- Przy istotnej lub nieodwracalnej decyzji — jawna akcja anulowania, nie tylko ikona zamknięcia.

Przykład dialogu z tabami i treścią bez zagnieżdżonego scrolla:

```html
<AbyssDialog v-model="open" title="Wynik zadania" icon="sym_r_output">
  <template #navigation>
    <AbyssSwitcher v-model="tab" :options="tabOptions" />
  </template>

  <AbyssTable
    v-if="tab === 'table'"
    :rows="rows"
    :columns="columns"
    row-key="id"
    hide-search
    :height="0"
    :rows-per-page-options="[0]"
  />

  <AbyssMarkdown
    v-else-if="tab === 'markdown'"
    :source="markdownSource"
    model-value="preview"
    embedded
    :show-view-switcher="false"
  />

  <AbyssCode
    v-else
    :value="payload"
    language="abyss-json"
    :scrollable="false"
  />
</AbyssDialog>
```

### 4. Toolbar lub segment

- Zestaw **akcji** (toolbar, w tym pionowy): `AbyssButtonGroup` z `AbyssButton` (`size="small"`, opcjonalnie `icon-only`).
- Dla listy akcji w kolumnie (np. menu kontekstowe, wybór opcji) użyj `vertical` — przyciski układają się pionowo z pełną szerokością kontenera i wysokością dopasowaną do treści.
- Aktywny stan narzędzia: `toggled`, nie `current`.
- Grupuj tylko semantycznie równorzędne akcje.
- **2–5 równorzędnych widoków w miejscu** (taby dialogu, przełącznik wykresu): `AbyssSwitcher`, nie `AbyssButtonGroup`.

### 5. Sekcje na stronie

- Sekcja z nagłówkiem i ikoną: `AbyssCard`.
- Powierzchnia bez chrome karty (changelog, markdown): `AbyssPanel`.
- Kafelek w siatce równorzędnych elementów: `AbyssTile` w `AbyssGrid`.
- Nie buduj własnych kontenerów sekcji.

### 6. Markdown i kod

| Komponent | Kiedy używać | Nie używać gdy |
| --------- | ------------ | -------------- |
| `AbyssMarkdown` | generyczny podgląd Markdown z przełącznikiem preview/code | logika domenowa (fetch changelogu, zwijanie) — to warstwa aplikacji |
| `AbyssContent` | render gotowego HTML (notatka, changelog po sanityzacji) | potrzebujesz przełącznika kod źródłowy / podgląd |
| `AbyssCode` | JSON z kolorowaniem składni (`json` lub drzewo `abyss-json`) | pełny edytor kodu wielojęzycznego — na razie tylko JSON |
| `AbyssDebug` | szybki podgląd obiektu w karcie debug | generyczny renderer kodu poza kontekstem debug — użyj `AbyssCode` |

- `AbyssMarkdown` parsuje Markdown w komponencie (`marked` jako peer dependency) i sanityzuje HTML przed `AbyssContent`.
- Prop `embedded` na `AbyssMarkdown` pomija `AbyssPanel` — stosuj w złożonych komponentach aplikacji (np. `ChangeLog` w MaiaApp), które same zarządzają panelem i zwijaniem.
- `AbyssCode` — domyślny motyw `one-dark` (paleta One Dark Pro); alternatywy: `github-dark`, `monokai`. W dialogu: `scrollable={false}`.

### 7. Tabela danych (`AbyssTable`)

`AbyssTable` ma dwa tryby prezentacji kontenera:

| Tryb | Prop | Kiedy używać |
| ---- | ---- | ------------ |
| **Osadzony** (domyślny) | brak `as-card` | tabela klucz–wartość w dialogu, panelu szczegółów, wewnątrz karty |
| **Karta** | `as-card` | główna tabela strony (użytkownicy, kolejka zadań, archiwum) |

#### Tryb osadzony (bez `as-card`)

- **Bez zaokrągleń** — kontener nie ma `border-radius`.
- **Bez tła kontenera** — brak tła panelu i cienia karty.
- **Nagłówek kolumn** — pełne tło wiersza nagłówka (`thead`) jak w standardowej tabeli.
- **Tło tylko komórek parametrów w `tbody`** — pierwsza kolumna wierszy danych ma tło `--table-param-background`; komórki wartości i wiersze rozwinięcia są przezroczyste.
- **Bez rozwijania wierszy** — kolumna +/- nie jest renderowana, dopóki nie ustawisz `expandable` lub nie użyjesz slotu `row-expand`.
- **Wyrównanie do krawędzi kontenera** — w `AbyssCard` (slot `content`) i `AbyssDialog` (body) osadzona tabela dostaje ujemne marginesy poziome równe paddingowi kontenera, żeby krawędzie tabeli zrównały się z krawędziami karty lub modala. Skrajne kolumny dostają padding poziomy równy `--card-padding` / `--dialog-padding`. Nie dotyczy trybu `as-card`.

Typowy układ tabeli parametrów w `AbyssDialog`:

```html
<AbyssTable
  :rows="rows"
  :columns="columns"
  row-key="id"
  hide-search
  :rows-per-page-options="[0]"
/>
```

Kolumny: pierwsza z etykietą parametru (`param`), druga z wartością (`value`). Paginacja i wyszukiwarka zwykle wyłączone (`hide-search`, `rows-per-page-options="[0]"`).

#### Tryb karta (`as-card`)

- Tło, zaokrąglenie 16px i cień jak w `AbyssCard`.
- Tło wierszy danych na wszystkich kolumnach.
- Tytuł w `#top-left` z opcjonalną ikoną (`title-icon`); akcje kontekstowe w `#header-append`.

#### Rozwijane wiersze

Domyślnie **wyłączone**. Włącz tylko gdy wiersz ma dodatkową treść poza komórkami:

```html
<AbyssTable expandable as-card :rows="rows" :columns="columns" row-key="id">
  <template #row-expand="bodyProps">
    {{ bodyProps.row.details }}
  </template>
</AbyssTable>
```

Prop `expandable` lub obecność slotu `row-expand` aktywuje kolumnę +/- i wiersz rozwinięcia.

#### Kolumna akcji

- Nagłówek kolumny może mieć etykietę (np. „Akcje”).
- W wierszach: trigger menu **tylko z ikoną** (`sym_r_more_vert`), bez `:label` — dostępność przez `aria-label`.
- Menu rozwijane (`AbyssDropdown`) zachowuje pełne etykiety poszczególnych akcji.

```html
<AbyssButton
  flat
  size="medium"
  icon="sym_r_more_vert"
  class="icon-button"
  :aria-label="t('routes.workers.actions.menu')"
>
  <AbyssDropdown anchor="bottom right" self="top right">
    <!-- akcje z :label -->
  </AbyssDropdown>
</AbyssButton>
```

---

## Do / Don't

### Do

- Używaj ikony w `header-prepend` przy każdym tytule `AbyssCard`.
- Umieszczaj kontekstowe akcje karty w `header-append` jako `AbyssButton flat`.
- Traktuj `flat` jako obowiązkowy wariant w: headerze/stopce `AbyssCard`, `AbyssDialog`, slotach `#prepend`/`#append` `AbyssInput`, akcjach `AbyssNavHeader`, wnętrzu `AbyssSwitcher`; akcje operacyjne w karcie/dialogu łącz z `gradient`.
- Używaj wyłącznie kluczy semantycznych w `gradient-colors`.
- Traktuj `current` jako aktualny kontekst, a `toggled` jako aktywny, nadal klikalny stan.
- Buduj ryzyko przez `AbyssInfo` + `gradient-colors="danger"` na przycisku operacyjnym.
- Potwierdzaj powodzenie lub niepowodzenie akcji użytkownika helperem kolejki `notify()` w aplikacji (host `AbyssNotify` w overlayu Root).
- Overlay `AbyssNotify` obejmuje lewą ikonę i treść (`rgba(black, 0.5)`, zaokrąglenia, 1px od krawędzi); X zostaje na gradiencie. Tytuł z ellipsis; `description` opcjonalny i zwinięty — chevron oraz akordeon tytułu i opisu (0,2 s). Opcjonalny `count` (≥ 2) to badge powtórzeń na prawo od tytułu; zmiana liczby puszcza rozszerzający się ripple (0,4 s). Opcjonalny `autoClose` (ms) zamyka toast z circular progress wokół X; hover i `:focus-within` wstrzymują timer i ściszają pierścień do opacity 0,5. Tekst i ikony zawsze białe. Wejście/zejście: `v-model`; w kolejce zdejmuj instancję w `@after-leave`.
- Montuj host `AbyssNotify` wyłącznie w overlayu `AbyssTemplateRoot` (`#abyss-template-overlay` albo slot `#overlay`) — implementacja hosta, nie wzorzec strony. Ze strony wołaj `notify()`. Host overlay ma `padding: 12px 8px`, `max-height: 100%` i `overflow: auto` wyłącznie gdy zmierzona wysokość kolejki przekracza `max-height`; odstęp kolejki (8px) to `::after` na shellu toasta. Poza szablonem klasa `abyss-notify-queue`.
- Używaj `AbyssInfo` wyłącznie do statycznych komunikatów kontekstowych (pusty stan, ostrzeżenie, trwała wskazówka).
- W formularzu używaj `AbyssInput` z `type="date"`, `"time"` lub `"datetime-local"`; samodzielny `AbyssDate` / `AbyssTime` tylko w popupie lub toolbarze.
- Owijaj pola formularza w `AbyssForm`.
- Używaj `AbyssInput` z `type="copy"` dla wartości tylko do odczytu z kopiowaniem do schowka — pole jest `readonly`, przycisk jest wbudowany w `#append`, klik/focus zaznacza całą treść, a feedback po kopiowaniu realizuje wbudowany Quasar Notify.
- Ustawiaj i zmieniaj hasło wyłącznie w dedykowanym `AbyssDialog`.
- Używaj `AbyssMarkdown` dla generycznego podglądu Markdown; logikę changelogu trzymaj w komponencie aplikacji (`ChangeLog`).
- Używaj `AbyssTemplateMain` dla przewijanych widoków strony — nie polegaj na scrollu slotu `content` w `AbyssTemplateRoot`.
- W layoucie w slocie `#content` `AbyssTemplateRoot` umieszczaj `router-view`; strona trasy montuje `AbyssTemplateMain`, `AbyssTemplateSidebar` albo `AbyssTemplateLogin`.
- Gdy strona nie ma nawigacji, zostaw sloty `navigation-start` i `navigation-end` puste — `AbyssTemplateRoot` ukryje sidebar; inner shadow contentu chowa się 8px za viewportem (prawo i dół, bez nawigacji także lewa).
- Ustawiaj `device` na `AbyssTemplateMain` / `AbyssTemplateLogin` zgodnie z kontekstem aplikacji (`mobile` / `desktop` / `web`).
- Używaj `AbyssTemplateLogin` wyłącznie na pełnoekranowy login / rejestrację / lock PIN — stała szerokość kontenera (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH`), centrowanie w pionie, własny scroll. Slot **wymaga `AbyssCard`** (tytuł + ikona w `#header-prepend`); treść karty: `AbyssForm` albo `AbyssAppLock`. Login nad aplikacją: `AbyssDialog`.
- Ustawiaj i zmieniaj PIN w `AbyssDialog` z `abyss-dialog--compact` — nie w `AbyssTemplateLogin`.
- Na głównych podstronach zaczynaj treść od kart / paneli / kafelków zgodnie z tabelą wyboru; tytuł sekcji dawaj tylko przez `AbyssCard` `title`.
- Na warstwie nachodzącej na treść z przezroczystym tłem ustawiaj `-webkit-backdrop-filter` i `backdrop-filter: blur(20px)` — dialog, picker daty/czasu, menu, sticky nagłówek, pływający przycisk.

### Don't

- Nie dodawaj własnych klas CSS, stylów inline ani nadpisań SCSS na prymitywach Abyss **w formularzach i standardowych kartach** — tam wystarczają propsy.
- Nie używaj `flat` poza headerem/stopką `AbyssCard`, `AbyssDialog`, slotami `#prepend` / `#append` w `AbyssInput`, akcjami `AbyssNavHeader` i wnętrzem `AbyssSwitcher`.
- Nie używaj footera `AbyssCard` w standardowym układzie.
- Nie używaj `gradient`, gdy akcja jest jedyna na liście poza kartą/dialogiem.
- Nie używaj `theme` dla lokalnej głównej akcji w bloku.
- Nie przekazuj własnych tablic kolorów do `gradient-colors`.
- Nie używaj `current` do aktywnych filtrów wielokrotnego wyboru — użyj `toggled`.
- Nie używaj `icon-only` dla akcji o niejasnej lub nieodwracalnej konsekwencji.
- Nie buduj pseudo-grup przycisków ręcznie — użyj `AbyssButtonGroup`. Nie używaj `AbyssButtonGroup` na 2–5 widoków w miejscu — to `AbyssSwitcher`.
- Nie owijaj `AbyssInput` ani `AbyssSelect` w dodatkowy `AbyssGrid`.
- Nie zostawiaj pól formularza poza `AbyssForm` i nie używaj natywnego `<form>`.
- Nie duplikuj pola `readonly` i osobnego przycisku „Kopiuj” — użyj `AbyssInput` z `type="copy"`.
- Nie używaj natywnych selektorów daty/czasu systemowych. Nie wstawiaj samodzielnego `AbyssDate` / `AbyssTime` w formularzu.
- Nie używaj `AbyssInfo` z `v-if` / `v-show` do pokazywania sukcesu lub błędu po akcji użytkownika — użyj `notify()`.
- Nie wywołuj `$q.notify` / `Notify.create` w nowym UI — użyj `notify()` (wyjątek: wbudowany feedback `AbyssInput` `type="copy"`).
- Nie montuj `AbyssNotify` ani `Teleport` ze strony — wołaj `notify()`; host kolejki zostaje w overlayu Root.
- Nie zdejmuj `AbyssNotify` z `v-for` w `@close` — animacja zejścia się nie zagra. Zostaw instancję do `@after-leave`.
- Nie dodawaj zagnieżdżonych pionowych scrollbarów w treści `AbyssDialog` — przewijaj wyłącznie body dialogu.
- Nie dodawaj paddingu ani `overflow: auto` na wrapperze contentu `AbyssTemplateRoot` — to odpowiedzialność `AbyssTemplateMain`, `AbyssTemplateSidebar` albo `AbyssTemplateLogin`.
- Nie wkładaj kart, formularzy ani innego contentu strony bezpośrednio do `#content` `AbyssTemplateRoot` — w layoucie `router-view`, na trasie szablon (`AbyssTemplateMain` / `AbyssTemplateSidebar` / `AbyssTemplateLogin`).
- Nie importuj `AbyssTemplate`, `AbyssScrollView` ani `AbyssSidebarNav`.
- Nie owijaj `AbyssTemplateLogin` w `AbyssTemplateMain` — Login sam zapewnia scroll, padding i ograniczenie szerokości.
- Nie używaj `AbyssTemplateMain` jako pełnoekranowego auth.
- Nie wkładaj `AbyssAppLock` ani formularza bezpośrednio do `AbyssTemplateLogin` — wymagany jest `AbyssCard`.
- Nie dobieraj `AbyssPinInput` / `AbyssNumericKeypad` poza `AbyssAppLock`.
- Nie rozciągaj kropek `AbyssPinInput` przez `justify-content: space-between` — rząd jest wyśrodkowany ze stałym `gap`.
- Nie ustawiaj własnej `max-width` na treści logowania — szerokość jest stałą szablonu (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH`).
- Nie pokazuj pełnoekranowego odblokowania (`AbyssAppLock`) w `AbyssDialog` — użyj `AbyssTemplateLogin` + `AbyssCard` (layout może wstawić Login w `#content` zamiast `router-view`).
- Nie zostawiaj pustego panelu nawigacji w `AbyssTemplateRoot` — puste sloty `navigation-start` i `navigation-end` ukrywają sidebar; inner shadow contentu ma chować się 8px za viewportem (prawo i dół).
- Nie uzależniaj scrollu strony od ujemnych marginesów kompensujących padding szablonu.
- Nie umieszczaj na głównej podstronie `AbyssTitle` (ani innego nagłówka) powielającego etykietę aktywnej zakładki nawigacji — kontekst niesie nawigacja; tytuł sekcji to wyłącznie `AbyssCard` `title`.
- Nie używaj `AbyssTitle` wewnątrz karty, dialogu ani panelu.
- Nie buduj przezroczystego overlayu (dialog, picker, menu, pływający przycisk nad treścią) bez `backdrop-filter: blur(20px)` — wyjątek: powierzchnie gradientowe (`AbyssBackground`, `AbyssGradientBox`, `AbyssButton` z `gradient`).
- Nie używaj Quasara spoza tabeli [Quasar dozwolony](#quasar-dozwolony) — w tym `q-spinner`, `q-badge`, `q-btn`.

---

## Referencyjne implementacje

- `AbyssButton` — [`src/components/ui/AbyssButton/AbyssButton.stories.ts`](../../src/components/ui/AbyssButton/AbyssButton.stories.ts)
- `AbyssCard` — [`src/components/ui/AbyssCard/AbyssCard.stories.ts`](../../src/components/ui/AbyssCard/AbyssCard.stories.ts)
- `AbyssDialog` — [`src/components/ui/AbyssDialog/AbyssDialog.stories.ts`](../../src/components/ui/AbyssDialog/AbyssDialog.stories.ts)
- `AbyssForm` — [`src/components/ui/AbyssForm/AbyssForm.stories.ts`](../../src/components/ui/AbyssForm/AbyssForm.stories.ts)
- `AbyssGrid` — [`src/components/ui/AbyssGrid/AbyssGrid.stories.ts`](../../src/components/ui/AbyssGrid/AbyssGrid.stories.ts)
- `AbyssTable` — [`src/components/ui/AbyssTable/AbyssTable.stories.ts`](../../src/components/ui/AbyssTable/AbyssTable.stories.ts)
- `AbyssMarkdown` — [`src/components/ui/AbyssMarkdown/AbyssMarkdown.stories.ts`](../../src/components/ui/AbyssMarkdown/AbyssMarkdown.stories.ts)
- `AbyssCode` — [`src/components/ui/AbyssCode/AbyssCode.stories.ts`](../../src/components/ui/AbyssCode/AbyssCode.stories.ts)
- `AbyssTemplateRoot` — [`src/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.stories.ts`](../../src/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.stories.ts)
- `AbyssTemplateMain` — [`src/components/templates/AbyssTemplateMain/AbyssTemplateMain.stories.ts`](../../src/components/templates/AbyssTemplateMain/AbyssTemplateMain.stories.ts)
- `AbyssAppLock` — [`src/components/ui/AbyssAppLock/AbyssAppLock.stories.ts`](../../src/components/ui/AbyssAppLock/AbyssAppLock.stories.ts)
- `AbyssTemplateLogin` — [`src/components/templates/AbyssTemplateLogin/AbyssTemplateLogin.stories.ts`](../../src/components/templates/AbyssTemplateLogin/AbyssTemplateLogin.stories.ts)
- `AbyssDebug` — [`src/components/ui/AbyssDebug/AbyssDebug.stories.ts`](../../src/components/ui/AbyssDebug/AbyssDebug.stories.ts)

Przykłady użycia w ekranach aplikacji Maia znajdują się w repozytorium `maia-app`.

---

## Skille dla LLM

Kanon: https://github.com/mAIa-dIAry/AbyssDesign (`docs/skills/`). W aplikacji wklej w czacie agenta (Cursor, Claude Code, GitHub Copilot i inne):

```
Pobierz https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills/install-abyss-skills/SKILL.md i zainstaluj skille Abyss Design w tej aplikacji (tylko HTTP z https://github.com/mAIa-dIAry/AbyssDesign, bez node_modules).
```

| Skill | Zastosowanie |
| ----- | ------------ |
| [`install-abyss-skills`](../skills/install-abyss-skills/SKILL.md) | instalacja HTTP do `.agents/skills/`, `.claude/skills/`, `.cursor/skills/` |
| [`implement-abyss-ui`](../skills/implement-abyss-ui/SKILL.md) | implementacja i zmiana UI |
| [`audit-abyss-compliance`](../skills/audit-abyss-compliance/SKILL.md) | audyt zgodności |

---

## Powiązane pliki

- [`src/stories/AbyssDesign.mdx`](../../src/stories/AbyssDesign.mdx) — landing page w Storybooku.
- [`docs/architecture/abyss-design.md`](./abyss-design.md) — ten dokument.
- [`docs/skills/README.md`](../skills/README.md) — skille agenta do skopiowania do aplikacji konsumujących.
