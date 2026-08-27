# Zasada „jedna potrzeba = jedno rozwiązanie” — docs vs użycie

## Kontekst

### Overview

- **Cel analizy:** sprawdzić, czy Abyss Design spełnia swój jedyny cel systemowy: dla każdej potrzeby UI wskazać **dokładnie jeden** komponent i **jednoznacznie** opisać, kiedy go używać (i kiedy nie). Źródłem prawdy o potrzebach jest rzeczywiste użycie w dwóch aplikacjach konsumujących, a nie Storybook.
- **Typ raportu:** diagnostyka aspektu projektu (pokrycie zasady w dokumentacji i zestawie komponentów).
- **Zakres:**
  - inwentarz publicznych komponentów `AbyssDesign/src/components/` (`ui/` + `templates/`);
  - kanon `docs/architecture/abyss-design.md`, skille `docs/skills/`, landing Storybook `src/stories/AbyssDesign.mdx`;
  - kopie skilli w `MaiaApp/.cursor/skills/` i `AdminWeb/.cursor/skills/`;
  - użycie produktowe w `MaiaApp/src` i `AdminWeb/src` (strony, layouty, komponenty współdzielone). Pominięto `node_modules`, `dist`, `storybook-static`, pliki `*.stories.*` / `*.spec.*` / `*.test.*`.
- **Środowisko:** workspace Maia, gałąź `main` we wszystkich trzech repozytoriach; AbyssDesign `@ 89c2ef9`; pakiet `@maiadiary/abyss-design` linkowany lokalnie. Aplikacje importują komponenty aliasem `@/components/ui|templates/...` (mapa Vite z `tools/abyss-design.mjs`), nie baryłką `exports` pakietu.
- **Ograniczenia:** zliczanie tagów `<AbyssX` nie obejmuje użycia wyłącznie typów TypeScript. Wiersz `AbyssTemplate` w surowym grepie prefiksuje `AbyssTemplateRoot/Main/Sidebar/Login` — w macierzy shadow-wrapper `AbyssTemplate` jest ręcznie zweryfikowany jako **0**. Raport nie ocenia wizualnej jakości UI ani nie proponuje implementacji komponentów (poza jednolinijkową notą, gdy brak prymitywu tłumaczy obejście Quasarem).

### Scenariusz badania

1. Zbudowano listę publicznych SFC (katalog = nazwa komponentu + plik `Abyss*.vue`).
2. Zliczono tagi i importy w plikach produktowych obu aplikacji.
3. Porównano inwentarz z tabelą „Podstawowe komponenty” w `abyss-design.md`, rodzinami na landingu Storybook i tabelą „Dobierz komponenty” w skillu `implement-abyss-ui`.
4. Szukano miejsc, gdzie dokumentacja podaje **więcej niż jedną** legalną drogę albo **zero** dróg, a aplikacje i tak musiały rozwiązać potrzebę.

## Dane techniczne

### Fakty

- Publicznych komponentów folderowych jest **48** (44 `ui` + 4 `templates`). Dodatkowo 6 SFC zagnieżdżonych (niepubliczne nazwy folderów), m.in. `AbyssTemplateMainIndicator.vue` (używany w MaiaApp) i poddrzewo `AbyssCode*`.
- Trzy pozycje `ui/` to **shadow-wrappery** kanonicznych szablonów: `AbyssTemplate` → `AbyssTemplateRoot`, `AbyssScrollView` → `AbyssTemplateMain`, `AbyssSidebarNav` → `AbyssTemplateSidebar`. Kanon to potwierdza (`abyss-design.md`, sekcja Layout strony, ok. linia 114) i każe importować nazwy z `templates/`.
- `src/index.ts` pakietu **nie eksportuje** komponentów Vue. Konsumenci ładują SFC przez alias Vite albo glob `exports` (`./components/*`, `./templates/*`) — glob nadal wystawia shadow-wrappery i wszystkie prymitywy, w tym te złożone wyłącznie wewnątrz `AbyssAppLock`.
- Kanon sam ogranicza swój zakres: *„zakres tego dokumentu to głównie formularze, standardowe karty i dialogi”* (`abyss-design.md`, Status i zakres). To jest jedyny dokument opisujący **reguły łączenia** — Storybook ma dokumentować API.
- Tabela „Dobierz komponenty” w `docs/skills/implement-abyss-ui/SKILL.md` (Krok 2) wymienia **9 potrzeb**. Nie ma w niej szablonów layoutu, tabeli, dropdownu, switchera, wykresów, panelu, tytułu, loadera, badge, listy wierszy.
- Landing `AbyssDesign.mdx` nazywa siebie *„mapą komponentów, a nie drugim źródłem prawdy”*, ale wymienia rodziny **bez** `when not to use` i pomija m.in. `AbyssPanel`, `AbyssNavHeader`, `AbyssSwitcher`, `AbyssDropdown`, `AbyssHistogram`, `AbyssMarkdown`, `AbyssContent`, `AbyssCode`, `AbyssGrid`.
- Kopie skilli w MaiaApp i AdminWeb są **identyczne ze sobą** i **różnią się od kanonu**: usunięta tabela skali `size`; `notify()` bez ścieżki `@/stores/notify.store`; dopisek o checkout AbyssDesign w workspace; brak `install-abyss-skills` w powiązanych skillach. Checklisty `checklist.md` i `scan-checklist.md` są identyczne z kanonem.
- `AbyssForm` ma **0** tagów i **0** importów w obu aplikacjach. Wszystkie formularze produktowe używają natywnego `<form>` albo w ogóle nie owijają pól (ustawienia).
- `AbyssTitle` ma **0** użyć produktowych w obu aplikacjach.
- AdminWeb ma dedykowaną stronę logowania (`LoginPage.vue`) i **nie** używa `AbyssTemplateLogin` — kanoniczny szablon auth.

### Inwentarz vs dokumentacja vs użycie

Kolumny **A** / **L** / **S**: komponent wymieniony w tabeli podstawowej architektury / w rodzinach landingu / w tabeli Krok 2 skilla. **M** / **W**: liczba plików produktowych z tagiem lub importem (MaiaApp / AdminWeb).

| Komponent | Rodzaj | A | L | S | MaiaApp | AdminWeb | Uwaga |
| --------- | ------ | - | - | - | ------- | -------- | ----- |
| `AbyssTemplateRoot` | template | tak | tak | nie | 3 | 3 | szkielet |
| `AbyssTemplateMain` | template | tak | tak | nie | 6 | 3 | |
| `AbyssTemplateSidebar` | template | tak | tak | nie | 1 | 2 | |
| `AbyssTemplateLogin` | template | tak | tak | nie | 1 | **0** | AdminWeb ma login, inny szablon |
| `AbyssTemplate` | shadow | wzmianka | nie | nie | 0 | 0 | alias Root |
| `AbyssScrollView` | shadow | wzmianka | nie | nie | 0 | 0 | alias Main |
| `AbyssSidebarNav` | shadow | wzmianka | nie | nie | 0 | 0 | alias Sidebar |
| `AbyssCard` | ui | tak | tak | tak | 9 | 6 | |
| `AbyssPanel` | ui | tak | **nie** | nie | 1 | 0 | tylko `ChangeLog` |
| `AbyssDialog` | ui | tak | tak | tak | 6 | 12 | |
| `AbyssTitle` | ui | tak | tak | nie | **0** | **0** | API w kanonie niezgodne z SFC |
| `AbyssForm` | ui | tak | tak | **tak (obowiązkowy)** | **0** | **0** | story zezwala pominąć |
| `AbyssButton` | ui | matryca | tak | tak | 15 | 11 | |
| `AbyssButtonGroup` | ui | tak | tak | tak | 3 | 0 | |
| `AbyssSwitcher` | ui | tylko przykład dialogu | **nie** | **nie** | 1 | 2 | |
| `AbyssDropdown` | ui | tylko kolumna akcji tabeli | **nie** | **nie** | 0 | 3 | |
| `AbyssNavigation` | ui | wzmianka | tak | nie | 1 | 1 | |
| `AbyssNavHeader` | ui | tak | **nie** | nie | 2 | 0 | |
| `AbyssGrid` | ui | tak | **nie** | tak | 10 | 7 | |
| `AbyssInput` | ui | wzmianka | tak | tak | 4 | 8 | |
| `AbyssInputLabel` | ui | skala size | nie | nie | 1 | 1 | wiersz „Zmień hasło” |
| `AbyssSelect` | ui | wzmianka | tak | tak | 3 | 1 | |
| `AbyssToggle` | ui | wzmianka | tak | tak | 3 | 0 | |
| `AbyssDate` | ui | zasada 9 | tak | tak | 1 | 0 | także wewnątrz Input |
| `AbyssTime` | ui | zasada 9 | tak | tak | 1 | 0 | |
| `AbyssSlider` | ui | **nie** | tak | nie | 2 | 0 | |
| `AbyssRange` | ui | **nie** | tak | nie | **0** | **0** | |
| `AbyssAppLock` | ui | tak | tak | nie | 2 | 0 | składa Pin+Keypad |
| `AbyssPinInput` | ui | Don't | nie | nie | 0 | 0 | tylko wewnątrz AppLock |
| `AbyssNumericKeypad` | ui | **nie** | nie | nie | 0 | 0 | tylko wewnątrz AppLock |
| `AbyssInfo` | ui | tak | tak | tak | 11 | 17 | |
| `AbyssNotify` | ui | tak | tak | `notify()` | 2 | 2 | host kolejki |
| `AbyssProgress` | ui | **nie** | tak | nie | 1 | 1 | pasek, nie spinner |
| `AbyssGradientBadge` | ui | **nie** | tak | nie | **0** | **0** | |
| `AbyssGradientBox` | ui | backdrop | tak | nie | 1 | 1 | presety gradientu |
| `AbyssBackground` | ui | backdrop | tak | nie | 2 | 2 | |
| `AbyssSeparator` | ui | **nie** | tak | nie | 1 | 0 | |
| `AbyssContent` | ui | tak | **nie** | nie | 3 | 0 | |
| `AbyssMarkdown` | ui | tak | **nie** | nie | 2 | 1 | |
| `AbyssCode` | ui | tak | **nie** | nie | 0 | 2 | |
| `AbyssDebug` | ui | tak | **nie** | nie | **0** | **0** | wrapper Card+Code |
| `AbyssTable` | ui | wzorzec 7 | tak | nie | 0 | 4 | |
| `AbyssTile` | ui | wzorzec 5 | tak | nie | 1 | 4 | |
| `AbyssChart` | ui | **nie** | tak | nie | 1 | 2 | area |
| `AbyssHistogram` | ui | **nie** | **nie** | nie | 1 | 1 | bar |
| `AbyssTimeline` | ui | **nie** | tak | nie | 1 | 0 | |
| `AbyssTimelineItem` | ui | **nie** | tak | nie | 1 | 0 | |
| `AbyssKeybind` | ui | **nie** | tak | nie | 1 | 0 | |

**Nieużywane w obu aplikacjach (10):** `AbyssForm`, `AbyssTitle`, `AbyssDebug`, `AbyssGradientBadge`, `AbyssRange`, `AbyssPinInput`, `AbyssNumericKeypad`, `AbyssTemplate`, `AbyssScrollView`, `AbyssSidebarNav`.

**Tylko MaiaApp (14):** `AbyssAppLock`, `AbyssButtonGroup`, `AbyssContent`, `AbyssDate`, `AbyssKeybind`, `AbyssNavHeader`, `AbyssPanel`, `AbyssSeparator`, `AbyssSlider`, `AbyssTemplateLogin`, `AbyssTime`, `AbyssTimeline`, `AbyssTimelineItem`, `AbyssToggle`.

**Tylko AdminWeb (3):** `AbyssCode`, `AbyssDropdown`, `AbyssTable`.

### Porównania / metryki

| Obszar | Obserwacja | Źródło |
| ------ | ---------- | ------ |
| Pliki produktowe przeskanowane | MaiaApp **162**, AdminWeb **94** | `src/**/*.vue,*.ts` bez stories/spec |
| Komponentów w tabeli podstawowej kanonu | **19** z 48 | `abyss-design.md` „Podstawowe komponenty” |
| Potrzeb w skillu Krok 2 | **9** | `implement-abyss-ui/SKILL.md` |
| `AbyssForm` w produktach | **0 / 0** | tagi |
| Natywny `<form>` | MaiaApp: `AuthLoginModal`, `AuthRegisterModal`; AdminWeb: `LoginPage`, `ReauthLoginModal` | tagi |
| Logowanie AdminWeb | `AbyssTemplateRoot` + **`AbyssTemplateMain`** + custom `page-auth` + `<form>` | `AdminWeb/src/pages/LoginPage.vue` |
| Logowanie MaiaApp | **`AbyssDialog`** + `<form>` (nie `AbyssTemplateLogin`) | `AuthLoginModal.vue` |
| Odblokowanie PIN MaiaApp | `AbyssTemplateLogin` + `AbyssCard` + `AbyssAppLock` | `MainLayout.vue` |
| Slot `#content` Root | obie aplikacje wkładają **`router-view` w `div`**, nie szablon strony | `MaiaApp`/`AdminWeb` `layouts/MainLayout.vue` |
| `class` na `AbyssCard` w ustawieniach | wielokrotnie `class="settings-card"` | m.in. `SettingsAccountTab.vue` (obie aplikacje) |
| Quasar `q-spinner` / `q-spinner-dots` | MaiaApp 8+3 tagi / AdminWeb 7 tagów | brak `AbyssSpinner` |
| Quasar `q-badge` | AdminWeb 4 pliki / 5 tagów | `AbyssGradientBadge` nieużywany |
| Quasar `q-btn` | obie aplikacje, `ErrorNotFound.vue` | surowy szablon Quasar |
| `AbyssInput type="date"` vs `AbyssDate` | ustawienia: Input; archiwum: Date w popupie | `SettingsAccountTab.vue`, `ArchiveSearchInput.vue` |
| Skill konsumenta vs kanon | 3 pliki DIFFERS, 2 IDENTICAL (na aplikację) | SHA256 |

### Fragmenty kanonu (cytaty do pytań 1–2)

**Dwa legalne wrappery formularza (story vs skill):**

> Pola (`AbyssInput`, `AbyssSelect` itd.) w `AbyssForm` **lub bezpośrednio w treści karty**
>
> — `AbyssForm.stories.ts`, opis komponentu

> Formularz → `AbyssForm` + pola
>
> — `implement-abyss-ui/SKILL.md`, Krok 2

**Karta albo panel, karta albo kafelek, tytuł karty albo AbyssTitle:**

> Własne kontenery sekcji zamiast `AbyssCard` / `AbyssPanel`
>
> — `audit-abyss-compliance/references/scan-checklist.md`, pkt 1.2

> Każda sekcja w osobnej `AbyssCard` (lub `AbyssGrid` z kafelkami `AbyssTile` …)
>
> — `abyss-design.md`, Wzorce kompozycji pkt 5

> Tytuły **wyłącznie na kartach** — `AbyssCard` z `title` … **albo** `AbyssTitle` **wewnątrz** karty / dialogu / panelu.
>
> — `abyss-design.md`, Tytuły stron i zakładek

**Data: trzy wejścia, jedna implementacja pod spodem:**

> Daty i czas: wyłącznie `AbyssDate`, `AbyssTime` **albo** `AbyssInput` z `type="date"`, `type="time"`, `type="datetime-local"`.
>
> — `abyss-design.md`, zasada 9

> Zawsze uruchamiaj dokładnie `AbyssDate` — bezpośrednio **lub** przez `AbyssInput` z `type="date"` …
>
> — `AbyssDate.stories.ts`

**API tytułu: kanon vs SFC vs przykład DON'T:**

| Źródło | Propsy |
| ------ | ------ |
| Tabela podstawowa `abyss-design.md` | `level` (`h1`–`h6`), `size` (`lg`, `md`, `sm`) |
| Hierarchia `AbyssTitle` w tym samym pliku | kolumny `level` i `size` |
| Przykład DON'T w tym samym pliku | `<AbyssTitle type="h1" label="Dashboard" />` |
| `AbyssTitle.vue` / stories | tylko `type`, `icon`, `label` — **brak** `level` i `size` |

**Gdzie wolno `flat` (trzy różne zbiory):**

| Źródło | Dozwolone miejsca |
| ------ | ----------------- |
| Don't `abyss-design.md` | header/stopka `AbyssCard`, `AbyssDialog`, sloty Input |
| Landing `AbyssDesign.mdx` | „tylko w nagłówku/stopce karty i dialogu” (bez Input) |
| Wiersz `AbyssNavHeader` w kanonie | `AbyssButton size="medium" flat embedded` |
| `AnalysisListPage.vue` | `AbyssButton flat embedded` jako **wiersz listy** poza kartą |

**Notify: dwa API:**

> komunikuj **`AbyssNotify`**, nie … surowym `$q.notify`. Przykład: `<Teleport> <AbyssNotify v-model=…>`
>
> — `abyss-design.md`

> Feedback po akcji → `notify()` z `@/stores/notify.store`
>
> — kanoniczny `implement-abyss-ui/SKILL.md`

Kopia konsumencka zmienia to na „`notify()` aplikacji”; AdminWeb ma plik `stores/notify.ts`, nie `notify.store.ts`.

### Interpretacja

- Kanon jest **gęsty i precyzyjny** tam, gdzie dotyczy karty ustawień, dialogu hasła i matrycy przycisku — i **dziurawy albo dwuznaczny** wszędzie indziej. Aplikacje wypełniają dziury Quasarem, natywnym `<form>` i `class` na `AbyssCard`.
- Skill Krok 2 jest jedyną „ściągą decyzji” dla agenta implementującego UI. Jej kompletność determinuje, czy agent znajdzie jeden komponent, czy zgadnie. Dziś zgaduje.
- Nieużycie `AbyssForm` nie jest przypadkiem obu produktów niezależnie: story **legalizuje** pominięcie wrappera, a skill **nakazuje** wrapper. Agent i człowiek mogą wybrać obie drogi i obie obronić cytatem.
- Nieużycie `AbyssTitle` wynika z zakazu tytułu strony **oraz** z konkurencji `AbyssCard title`. Pozostaje nisza stron prawnych, której żadna z dwóch aplikacji nie ma — ale kanon wciąż oferuje Title jako alternatywę **wewnątrz** karty.
- `AbyssTemplateLogin` nie jest niszowym szablonem „na przyszłość”: AdminWeb **ma** pełnoekranowy auth i rozwiązał go `AbyssTemplateMain` + własny markup. To złamanie zasady w docs (szablon jest wskazany) **i** w konsumencie (docs nie przebiły się przez skill, który szablonów nie wymienia).

## Wnioski i kroki

### Root Cause

Dokumentacja łączenia (`abyss-design.md` + skill Krok 2 + landing) **nie jest kompletną, rozłączną mapą potrzeb → jeden komponent**. Kanon deklaruje wąski zakres (formularze/karty/dialogi), jednocześnie wystawia 48 publicznych SFC; skill i landing pokrywają rozłączne podzbiory; w pokrytym obszarze kanon wielokrotnie używa „albo”. Konsumenci i agenci wybierają pierwszą pasującą ścieżkę albo Quasar.

### 1. Złamana zasada „jedna potrzeba = jedno rozwiązanie”

| ID | Potrzeba | Konkurencyjne rozwiązania | Dowód |
| -- | -------- | ------------------------- | ----- |
| P1 | Wrapper formularza | `AbyssForm` **albo** pola luzem w karcie **albo** natywny `<form>` | skill Krok 2 vs `AbyssForm.stories.ts` vs 0 użyć + 4 natywne `<form>` |
| P2 | Ekran logowania / auth | `AbyssTemplateLogin`+`AbyssCard`+`AbyssForm` **albo** `AbyssDialog`+`<form>` **albo** `AbyssTemplateMain`+custom panel | kanon przykłady vs `AuthLoginModal.vue` vs `AdminWeb/LoginPage.vue` |
| P3 | Kontener sekcji | `AbyssCard` **albo** `AbyssPanel` **albo** `AbyssGrid`+`AbyssTile` | scan-checklist 1.2; wzorzec 5; `ChangeLog` = Panel, ustawienia = Card |
| P4 | Tytuł sekcji | `AbyssCard title` **albo** `AbyssTitle` w karcie | „Tytuły stron i zakładek”; Title 0/0 |
| P5 | Data w formularzu | `AbyssInput type="date"` **albo** samodzielny `AbyssDate` | zasada 9; Settings vs ArchiveSearch |
| P6 | Czas / datetime | `AbyssTime` **albo** `AbyssInput type="time\|datetime-local"` | zasada 9; AdminWeb `ScheduleJobModal` używa `datetime-local` |
| P7 | Wybór 1 z N w UI | `AbyssSwitcher` **albo** `AbyssButtonGroup` + `toggled`/`current` **albo** `AbyssSelect` | Switcher poza tabelą podstawową i landingiem; Group w skillu jako „toolbar” |
| P8 | Host treści Root | tylko szablon-dziecko **albo** `div`+`router-view` (fakt obu layoutów) | kanon „Zakaz: karty… bezpośrednio w `#content`” vs oba `MainLayout.vue` |
| P9 | Feedback po akcji | bezpośredni `AbyssNotify`+Teleport **albo** `notify()` store | kanon vs skill; dwie różne ścieżki store (`notify.store.ts` / `notify.ts`) |
| P10 | `flat` na przycisku | Don't vs NavHeader vs landing vs lista analiz | cytaty w Dane; `AnalysisListPage.vue` linie 36–38 |
| P11 | Status / badge | `AbyssGradientBadge` (landing) **albo** `q-badge` (AdminWeb, 5 tagów) **albo** nic (brak w skillu) | GradientBadge 0/0 |
| P12 | Loader w miejscu | `AbyssProgress` (pasek) **albo** `q-spinner` (15 łącznie tagów) **albo** `AbyssTemplateMainIndicator` | brak wpisu w skillu |
| P13 | Nazwa szablonu strony | kanoniczne `AbyssTemplate*` **albo** publiczne shadow `AbyssTemplate` / `AbyssScrollView` / `AbyssSidebarNav` | `package.json` exports glob; kanon linia 114 |
| P14 | JSON na ekranie | `AbyssCode` **albo** `AbyssDebug` (Card+Code) | kanon wzorzec 6 — rozróżnienie jest, ale Debug nie ma ścieżki konsumenckiej |

Quasar / custom markup zamiast Abyss (brak rozwiązania **albo** docs nie wskazują istniejącego):

| Potrzeba | Co zrobiły aplikacje | Czy Abyss ma odpowiednik |
| -------- | -------------------- | ------------------------ |
| Spinner ładowania widgetu / Suspense | `q-spinner`, `q-spinner-dots` (obie) | **nie** (Progress to pasek; Indicator tylko w TemplateMain) |
| Badge statusu w tabeli | `q-badge` (AdminWeb: Jobs, Workers, Orfeusz widget, ScheduleJob) | `AbyssGradientBadge` istnieje, ale warianty `gold/sakura/garden` ≠ status semantyki; **brak** `when to use` |
| 404 | `q-btn` + klasy Quasar (obie) | `AbyssButton` + szablon strony — docs nie wskazują strony błędu |
| Chip tokenu daty | `q-chip` (MaiaApp `ArchiveSearchInput`) | story Input **dokumentuje** q-chip — to wyjątek, nie AbyssChip |
| Wiersz listy (dzień analizy) | `ul/li` + `AbyssButton flat embedded` | **brak** list-row; Don't zabrania `flat` poza kartą |
| Login AdminWeb (centrowany auth) | `AbyssTemplateMain` + `div.page-auth` | **jest** `AbyssTemplateLogin` — docs nie trafiły do skilla |
| Formularz | natywny `<form>` | **jest** `AbyssForm` |
| Opcja selecta z badge | slot `q-item`/`q-badge` w `ScheduleJobModal` | `AbyssSelect` nie ma udokumentowanego slotu opcji jako jedynej drogi |
| Komórki tabeli | sloty `q-td`/`q-tr` (AdminWeb) | to API `AbyssTable` (Quasar wewnątrz) — OK jeśli docs to nazywają wyjątkiem; skill 1.1 flaguje `q-table`, nie sloty |

Potrzeby opisane w docs, **bez** osobnego komponentu albo bez jednoznacznego wskazania:

- strona informacyjna poza nawigacją (`AbyssTitle` h1) — komponent jest, aplikacji nie mają trasy;
- „własny overlay w komponencie złożonym” z `backdrop-filter` — zezwolenie na **nie-AbyssDialog** overlay (zasada 4 mówi „warstwy tymczasowe to AbyssDialog”, zasada 12 zezwala na własne overlaye).

### 2. Podatność na błędną interpretację

| ID | Passus | Dlaczego agent wybierze źle |
| -- | ------ | --------------------------- |
| A1 | Status i zakres: dokument „głównie formularze, karty, dialogi” | agent uzna, że reszta UI jest dowolna (Quasar / class) |
| A2 | Formularz vs komponent złożony — granica na przykładach (`NoteEditor`, `ChangeLog`), bez testu decyzyjnego | `ActivityWidget` i karty ustawień z `class="settings-card"` lądują w złym wiadrze |
| A3 | `AbyssTitle`: `level`/`size` w kanonie, `type` w kodzie i w DON'T | implementacja `size="lg"` nie zadziała; checklista skillu tego nie łapie |
| A4 | Skill Krok 2 bez szablonów, tabeli, dropdownu, switchera, wykresu | agent nie wie, że `AbyssTemplateLogin` / `AbyssTable` / `AbyssDropdown` istnieją |
| A5 | Landing wymienia `AbyssRange` obok `AbyssSlider` bez „Range = dwa kciuki” | ryzyko użycia Range zamiast Slider albo odwrotnie; Range i tak 0/0 |
| A6 | `Chart` vs `Histogram`: stories opisują format danych, nie potrzebę („trend w czasie” vs „udział w koszykach”) | `ActivityWidget` sam ustalił: month=Chart, week/day=Histogram — to **fakt użycia**, nie kanon |
| A7 | `current` vs `toggled` vs Switcher | matryca Button jest dobra; Switcher nie jest w matrycy, a wewnętrznie renderuje `AbyssButton flat` |
| A8 | `notify()` w skillu vs Teleport w kanonie vs wyjątek `AbyssInput type="copy"` → Quasar Notify | trzy kanały feedbacku |
| A9 | Don't: „nie używaj `flat` poza…” vs NavHeader i listy | agent albo złamie Don't, albo nie zbuduje wiersza listy |
| A10 | Kopie skilli bez tabeli `size`; `medium` tylko na Button | dryf tokenów rozmiaru między kanonem a agentem w aplikacji |
| A11 | scan-checklist 5.5: „natywny picker (`type="date"` bez Abyss)” vs Input `type="date"` **jest** Abyss | fałszywy alarm albo odwrotnie |
| A12 | Przy sprzeczności docs vs story: audit skill mówi „story + abyss-design.md; przy wątpliwości zapytaj” | **nie wskazuje zwycięzcy** — to anty-zasada „jedno rozwiązanie” |

### 3. Komponenty, które nigdy nie mają szansy być użyte

**Uzasadnione (nisza albo celowo wewnętrzne), mimo 0/0 w obu aplikacjach:**

| Komponent | Uzasadnienie |
| --------- | ------------ |
| `AbyssPinInput`, `AbyssNumericKeypad` | złożone wyłącznie w `AbyssAppLock.vue`; MaiaApp używa AppLock. AdminWeb nie ma PIN. **Publiczne stories sugerują jednak użycie bezpośrednie.** |
| `AbyssDebug` | kanon: tylko karta debug; aplikacje nie mają ekranu debug DS. Cienki wrapper `AbyssCard`+`AbyssCode` — da się zastąpić przepisem, bez osobnego SFC. |
| `AbyssRange` | dwa kciuki; żadna aplikacja nie ma filtra przedziału liczbowego. Landing go reklamuje bez `when`. |
| Shadow `AbyssTemplate`, `AbyssScrollView`, `AbyssSidebarNav` | kanon każe ich **nie** importować. 0 użyć = sukces, o ile przestaną być publicznym API. |

**Nieużywane i bez realnej ścieżki konsumenckiej albo docs ich nie wskazują:**

| Komponent | Problem |
| --------- | ------- |
| `AbyssForm` | **jest** ścieżka (wszystkie formularze), docs i skill ją wskazują, a użycie = 0, bo story mówi „albo bezpośrednio”. To nie nisza — to porażka preskrypcji. |
| `AbyssTitle` | ścieżka „strona prawna” nie istnieje w produktach; ścieżka „tytuł w karcie” jest zduplikowana przez `AbyssCard title`. W praktyce martwy. |
| `AbyssGradientBadge` | landing go listuje; AdminWeb potrzebuje badge statusu i bierze `q-badge`. Warianty badge nie mapują się na `success/warning/danger`. Brak `when NOT`. |
| `AbyssTemplateLogin` (w AdminWeb) | nie 0/0 globalnie, ale **niewykorzystany tam, gdzie kanon go wymaga**. To ważniejszy sygnał niż 0 w aplikacji bez auth page. |

### 4. Komponenty używane na różne sposoby

| Komponent | MaiaApp | AdminWeb | Docs |
| --------- | ------- | -------- | ---- |
| `AbyssTemplateMain` | strony merytoryczne + (AdminWeb) **także login** | dashboard/users + login | kanon: Main = start/archiwum/analiza; Login = auth |
| `AbyssDialog` | auth, hasło, PIN, import danych | kolejka jobów, użytkownicy, reauth | kanon: decyzje/potwierdzenia; MaiaApp rozszerza na **cały login** |
| `AbyssCard` | ustawienia z `class="settings-card"`; widgety z klasą BEM | to samo na koncie/wyglądzie; widgety | formularz: zakaz `class`; złożone: dozwolone — widgety OK, **ustawienia nie** |
| `AbyssInfo` | puste stany + **`v-if` błąd logowania** w modalu auth | to samo na Login/Reauth + puste tabele | kanon: zakaz reaktywnego Info po akcji; walidacja w dialogu jest wyjątkiem — **błąd API logowania** jest na granicy |
| `AbyssButton` | nav `embedded`; lista analiz `flat+embedded`; CTA w kartach | nav `embedded`; akcje tabeli + Dropdown | matryca nie rozstrzyga wiersza listy |
| `AbyssSwitcher` | przełącznik widoku wykresu w karcie | taby w `JobResultModal` (`#navigation`) **oraz** ten sam widget | kanon pokazuje tylko taby dialogu |
| `AbyssMarkdown` | detal analizy; ChangeLog (`embedded`) | podgląd wyniku joba w dialogu | wzorzec 6 jest względnie rozłączny z Content/Code |
| `AbyssTable` | — | `as-card` na stronach; bez `as-card` w dialogu wyniku | wzorzec 7 jest jednym z nielicznych **dobrych** rozróżnień trybów |
| Root `#content` | `TemplateLogin` **albo** `div.main-layout__route` | zawsze `div.main-layout__content` | kanon nie opisuje wzorca router-outlet |

`AbyssTable as-card` vs osadzony **nie** jest złamaniem zasady — to jeden komponent, dwa tryby z jawnym `when`. Wzorzec do skopiowania na Card/Panel, Date/Input, Form/brak Form.

### Rekomendacje naprawcze (tylko dokumentacja)

Jedna tabela preskryptywna „potrzeba → dokładnie jeden komponent” w `abyss-design.md`, powtórzona 1:1 jako Krok 2 skilla. Landing ma linkować tę tabelę, nie dublować list nazw.

| Priorytet | Działanie | Oczekiwany efekt |
| --------- | --------- | ---------------- |
| **P1** | Rozstrzygnąć wrapper formularza: **zawsze `AbyssForm`** (usunąć „lub bezpośrednio w karcie” ze story i uzupełnić checklistę) **albo** zdegradować `AbyssForm` do opcjonalnego helpera i wyjąć go ze skilla Krok 2. Nie zostawiać obu. | Koniec dualizmu Form vs `<form>` |
| **P1** | Rozstrzygnąć auth: pełny ekran = tylko `AbyssTemplateLogin`+`AbyssCard`; login **nad** działającą aplikacją = tylko `AbyssDialog`. Wpisać to w Krok 2. Jednolinijkowo: AdminWeb `LoginPage` jest długiem względem kanonu. | Jeden szablon auth |
| **P1** | Uzupełnić Krok 2 o brakujące potrzeby z faktu użycia: szablon strony (Main/Sidebar/Login/Root), tabela, dropdown akcji wiersza, switcher (1 z N w miejscu), wykres (Chart vs Histogram), lista wierszy (albo zakaz `flat` z wyjątkiem, albo nowy prymityw), loader, badge statusu | Agent przestaje zgadywać |
| **P1** | Naprawić API `AbyssTitle` w kanonie: tylko `type`/`icon`/`label`; usunąć `level` i `size`. Rozstrzygnąć: tytuł sekcji = **wyłącznie** `AbyssCard title` (Title tylko strony prawne) **albo** odwrotnie. | Koniec martwego Title-w-karcie |
| **P1** | Jedna lista miejsc `flat` (Card header/footer, Dialog, Input prepend/append, NavHeader actions, wnętrze Switcher). Zsynchronizować Don't, landing, skill, NavHeader. | Koniec sprzecznych Don't |
| **P2** | Data/czas: **w formularzu tylko `AbyssInput type=…`**; samodzielny `AbyssDate`/`AbyssTime` tylko w popupie/toolbarze (jak archiwum). Jedno zdanie `when NOT`. | Koniec zasady 9 jako „albo” |
| **P2** | Card vs Panel vs Tile: Card = sekcja z nagłówkiem+ikoną; Panel = powierzchnia bez chrome karty (changelog/markdown); Tile = kafelek w siatce. Usunąć „Card / Panel” z pkt 1.2 checklisty. | Jedna powierzchnia na potrzebę |
| **P2** | Switcher vs ButtonGroup vs Select: Switcher = 2–5 równorzędnych widoków w miejscu; ButtonGroup = akcje (toolbar, w tym `vertical`); Select = wiele opcji / formularz. Dodać Switcher i Dropdown do tabeli podstawowej **i** landingu. | Koniec zgadywania tabów |
| **P2** | Chart vs Histogram: wpisać regułę z `ActivityWidget` (seria czasowa ciągła → Chart; koszyki/udział → Histogram). Histogram na landing. | Jedna rodzina wykresów, dwa typy z `when` |
| **P2** | Notify: kanon ma opisywać **wyłącznie** `notify()` aplikacji + host `AbyssNotify` w overlayu Root; przykład Teleport zostawić jako implementację hosta, nie wzorzec strony. Ścieżka importu: „helper kolejki w aplikacji”, nie `notify.store`. | Jeden kanał toastów |
| **P2** | Slot `#content` Root: albo **nakazać** wzorzec `router-view` (strona sama wkłada Main/Sidebar/Login), albo uznać obecne layouty za dług. Dziś kanon i kod są w sprzeczności. | Jedna kompozycja aplikacji |
| **P2** | Shadow-wrappery: w skillu i landingu **zakaz importu** starych nazw; rozważyć usunięcie z publicznego globu w osobnym tasku (to już zmiana API, nie docs). | Jedna nazwa szablonu |
| **P3** | `AbyssPinInput` / `NumericKeypad`: oznaczyć w stories i kanonie jako **wewnętrzne** `AbyssAppLock`, nie dobierać z Krok 2. | Brak fałszywej ścieżki |
| **P3** | `AbyssDebug` / `AbyssGradientBadge` / `AbyssRange`: albo dopisać jedyne `when` (debug DS; badge subskrypcji gold/sakura/garden — **nie** status tabeli; range = dwa kciuki), albo nie listować na landingu. | Mapa bez martwych kafelków |
| **P3** | Przywrócić tabelę `size` w kopiach skilli konsumenta **albo** trzymać ją tylko w kanonie i linkować — nie wycinać jednostronnie. | Ten sam token `small/medium/big` |
| **P3** | Wyjątki Quasar (`q-icon`, `q-popup-proxy`, `q-chip` w search, sloty `q-td` tabeli) zebrać w **jednej** tabeli „Quasar dozwolony”. Wszystko spoza niej = naruszenie. Dziś `q-spinner` i `q-badge` są w szarej strefie. | Audyt 1.1 przestaje być uznaniowy |
| **P3** | Nota (nie implementować w tym raporcie): brakuje prymitywu **spinnera** i **wiersza listy**; badge statusu semantycznego. `make-component` tylko jeśli kanon ma powiedzieć „użyj X” a X nie istnieje. | Docs nie obiecują komponentu, którego nie ma |

Nie rekomenduje się w tym raporcie zmian SFC ani commitów w aplikacjach.

### Next Steps

1. W `abyss-design.md` dodać na górze (po zasadach nadrzędnych) rozłączną tabelę **potrzeba → jeden komponent → kiedy nie**. To jedyna zmiana, która naprawia root cause.
2. Skopiować tę tabelę do `implement-abyss-ui` Krok 2; wyrównać landing do linku, nie do drugiej listy.
3. Osobny follow-up produktowy (nie ten raport): AdminWeb `LoginPage` → `AbyssTemplateLogin`; ustawienia — zdjąć `class="settings-card"` albo przepisać kanon; 404 i spinnery po decyzji z P3.

### Follow-upy poza zakresem

- Audyt zgodności UI (skill `audit-abyss-compliance`) na kartach ustawień i `LoginPage` — to dług implementacyjny, nie dokumentacyjny.
- Czy shadow-wrappery i `AbyssDebug` zostają w publicznym API (zmiana pakietu).
