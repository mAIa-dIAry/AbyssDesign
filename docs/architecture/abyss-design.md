# Standard Abyss Design

## Spis treści

- [Status i zakres](#status-i-zakres)
- [Zasady nadrzędne](#zasady-nadrzędne)
- [Formularze i karty vs komponenty złożone](#formularze-i-karty-vs-komponenty-złożone)
- [Powierzchnie i warstwy](#powierzchnie-i-warstwy)
- [Layout strony](#layout-strony)
- [Feedback po akcjach użytkownika](#feedback-po-akcjach-użytkownika)
- [Matryca AbyssButton](#matryca-abyssbutton)
- [Wzorce kompozycji](#wzorce-kompozycji)
- [Do / Don't](#do--dont)
- [Referencyjne implementacje](#referencyjne-implementacje)
- [Powiązane pliki](#powiązane-pliki)

---

## Status i zakres

Ten dokument jest kanonicznym standardem **używania** Abyss Design w projekcie Maia. Opisuje, które komponenty wybierać i jak ustawiać ich propsy zgodnie z konwencją systemu.

Najważniejsze zasady interpretacji:

- interfejs budujesz z komponentów `src/components/ui` i ich udokumentowanych propsów, slotów oraz zdarzeń,
- Storybook dokumentuje API każdego komponentu — ten plik opisuje reguły łączenia komponentów w ekrany,
- **zakres tego dokumentu to głównie formularze, standardowe karty i dialogi** — tam obowiązują restrykcyjne reguły bez custom styli,
- komponenty wyższego rzędu w aplikacji (np. edytor notatek) mogą używać `class` i `style` na prymitywach Abyss — patrz sekcja [Formularze i karty vs komponenty złożone](#formularze-i-karty-vs-komponenty-złożone),
- jeżeli aktualny kod odbiega od tego dokumentu, traktuj to jako świadomy dług techniczny, a nie nową normę.

---

## Zasady nadrzędne

1. **Abyss jest warstwą pierwszego wyboru.** Jeśli istnieje komponent w [src/components/ui](../../src/components/ui), używaj go zamiast składać interfejs bezpośrednio z Quasara.
2. **Formularze i standardowe karty — tylko propsy.** W `AbyssCard`, `AbyssForm`, `AbyssDialog` (ustawienia, auth, potwierdzenia) nie dodawaj własnych klas, stylów inline ani nadpisań SCSS na prymitywach Abyss. Układ kontroluj propsami (`full-width`, `AbyssGrid`, sloty karty itd.).
3. **Komponenty złożone mogą stylować prymitywy.** Przy budowie domenowych komponentów wyższego rzędu (np. edytor, pasek narzędzi archiwum) dozwolone jest przekazywanie `class` i `style` do `AbyssInput`, `AbyssButton` itd. — o ile logika layoutu pozostaje w komponencie nadrzędnym, a nie rozproszona po widokach formularzowych.
4. **Warstwy tymczasowe to `AbyssDialog`.** Decyzje, potwierdzenia i skupione wprowadzanie danych realizuj dialogiem — nie buduj własnych overlayów.
5. **Scroll w dialogu — tylko body.** W `AbyssDialog` jedynym pionowym kontenerem przewijania jest `abyss-dialog__body`. Taby i nawigacja idą do slotu `navigation` (poza body). Treść w body nie może mieć własnych pionowych scrollbarów — używaj `AbyssTable` bez `height`, `AbyssCode` z `scrollable={false}`, `AbyssMarkdown` w trybie osadzonym bez wewnętrznych paneli ze scrollem.
6. **Jedna czytelna hierarchia akcji na blok.** Użytkownik ma od razu widzieć akcję główną, wspierającą i informacyjną. Realizuj to kombinacją `gradient`, `gradientColors`, `flat`, `embedded` i `full-width` na `AbyssButton`.
7. **Operacje destrukcyjne:** `AbyssButton` z `gradient` + `gradient-colors="danger"` oraz kontekst ryzyka przez `AbyssInfo`, ikonografię i copy w `AbyssCard`.
8. **Formularze:** pola (`AbyssInput`, `AbyssSelect`, `AbyssToggle` itd.) mają wewnętrzny układ — nie owijaj ich dodatkowym `AbyssGrid`. Przyciski akcji pod polami układaj w `AbyssGrid` ze stałymi `INPUT_COLUMN_SIZE` i `INPUT_GRID_MAX_COLUMNS` (patrz `AbyssForm` w Storybooku).
9. **Daty i czas:** wyłącznie `AbyssDate`, `AbyssTime` albo `AbyssInput` z `type="date"`, `type="time"`, `type="datetime-local"`.
10. **Feedback po akcjach:** powodzenie lub niepowodzenie operacji (zapis, usunięcie, ponowienie itd.) komunikuj **Quasar Notify** (`$q.notify` / `Notify.create`), nie `AbyssInfo`. `AbyssInfo` służy wyłącznie do **statycznych** komunikatów kontekstowych osadzonych w układzie strony.

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
| `AbyssTitle`       | hierarchia nagłówków           | `level` (`h1`–`h6`), `size` (`lg`, `md`, `sm`)                                          |
| `AbyssInfo`        | statyczny komunikat kontekstowy | `type`, `title`, `icon` — pusty stan, ostrzeżenie przed akcją, trwała wskazówka; **nie** feedback po akcji |
| `AbyssButtonGroup` | zestaw równorzędnych akcji     | `vertical` (lista pionowa, domyślnie 100% szerokości); dzieci: wyłącznie `AbyssButton` |
| `AbyssGrid`        | responsywna siatka             | `column-size`, `max-columns`, `column-gap`, `row-gap`, `align`, `content-rows`          |
| `AbyssForm`        | wrapper formularza             | `v-model`, `sync`, `@update-form`, `@submit-form`                                       |
| `AbyssPanel`       | panel z opcjonalnym nagłówkiem | `title`, `flush`, slot `title`                                                          |
| `AbyssNavHeader`   | sticky nagłówek nawigacyjny    | `title`, `icon`, `backDisabled`, `backIcon`, `backLabel`, `sticky`, `stickyTop`, slot `actions` (`AbyssButton` `size="medium"` `flat` `embedded`); bez marginesów — inset u góry z `AbyssScrollView`; przycisk wstecz zawsze widoczny |
| `AbyssContent`     | typografia gotowego HTML       | `html`, `mode` (`html-note` \| `html-changelog`), `size`, `tone`                        |
| `AbyssMarkdown`    | podgląd Markdown + kod źródłowy | `source`, `v-model` (`preview` \| `code`), `content-mode`, `embedded`                  |
| `AbyssCode`        | kolorowany kod (JSON)          | `value`, `language` (`json` \| `abyss-json`), `colorTheme` (domyślnie `one-dark`)       |
| `AbyssDebug`       | karta debugowania danych       | `data` — cienki wrapper nad `AbyssCode language="abyss-json"`                           |
| `AbyssTemplate`    | szkielet aplikacji (nav, content) | `device`, `orientation`, `screenRadius`; slot `content` bez scrollu i paddingu        |
| `AbyssScrollView`  | przewijany obszar strony       | `device`, `padded`, opcjonalny reload; padding boczny i dolny per `device` (góra: strona) |
| `AbyssSidebarNav`  | układ sidebar + detail (nawigacja zakładek) | własny scroll paneli z mixin scrollbara na `desktop`/`web`; nie wymaga `AbyssScrollView` na poziomie strony |

---

## Layout strony

Podział odpowiedzialności między komponentami layoutu:

| Komponent | Scroll | Padding treści |
| --------- | ------ | -------------- |
| `AbyssTemplate` → slot `content` | **Nie** — `overflow: hidden` | **Nie** |
| `AbyssScrollView` | **Tak** — viewport przewija treść | **Tak** — góra, boki i dół per `device`; góra = boki |
| `AbyssSidebarNav` | **Tak** — wewnętrznie w sidebarze i panelu treści (`desktop`/`web`: mixin scrollbara) | Własne insety paneli |
| Edytor / full-bleed | Własny layout 100% wysokości | W komponencie domenowym |

### Presety paddingów `AbyssScrollView`

- **góra:** taki sam jak boczny — bez wyjątków, gdy `padded` jest włączone
- **desktop / web:** góra, boki i dół `24px`
- **mobile:** góra i boki `8px`, dół `24px`
- Nadpisanie: propsy `paddingTop`, `paddingInline`, `paddingBottom` (px)

### `AbyssNavHeader`

- **Bez marginesów** — odstęp od górnej krawędzi zapewnia `AbyssScrollView` (padding treści).
- Tekst tytułu: **18 px**; ikona obok tytułu: **24 px**.
- `stickyTop` ustawia `top` w trybie sticky. Domyślnie `var(--abyss-scroll-view-content-padding-top, 0)` — po przewinięciu nagłówek zachowuje odstęp od górnej krawędzi równy górnemu paddingowi `AbyssScrollView`.

### Odświeżanie list (reload)

- Domyślnie wyłączone: `disabledTop` i `disabledBottom` są `true`.
- Włącz tylko tam, gdzie potrzebne (np. archiwum — dół listy, lista analiz — góra).
- Odstępy loaderów: `indicatorPaddingTop`, `indicatorPaddingBottom`.
- Wysokość scrolla przy włączonym loaderze: `100%` viewportu + zmierzona wysokość sekcji loadera (góra i/lub dół). `__body` ma naturalną wysokość treści — nie rozciąga się flexem do viewportu.

### Wzorzec strony ze scrollem

```vue
<div class="page-example">
  <div class="page-example__toolbar">
    <!-- opcjonalny stały toolbar (np. wyszukiwarka); inset u góry ekranu nadal może wymagać własnego safe-area -->
  </div>
  <div class="page-example__content">
    <AbyssScrollView :device="device" class="page-example__scroll">
      <AbyssNavHeader title="..." icon="..." @back="..." />
      <!-- przewijalna treść -->
    </AbyssScrollView>
  </div>
</div>
```

Strona: `height: 100%`, `min-height: 0`, flex column. Kontener content i `AbyssScrollView`: `flex: 1`, `min-height: 0`.

---

### Hierarchia `AbyssTitle`

| `level` | Rola                       | Typowe miejsce                              |
| ------- | -------------------------- | ------------------------------------------- |
| `h1`    | tytuł strony informacyjnej | polityka prywatności, regulamin, pomoc      |
| `h2`    | tytuł powierzchni          | karta, dialog                               |
| `h3`    | podtytuł pierwszego poziomu| sekcja w karcie lub dialogu                 |
| `h4`–`h6` | nagłówki pomocnicze      | wyodrębnienie podsekcji                     |

| `size` | Rola                         |
| ------ | ---------------------------- |
| `lg`   | tytuł strony lub hero-sekcji |
| `md`   | standardowy tytuł sekcji     |
| `sm`   | podsekcja, mikro-nagłówek    |

### Reguły `AbyssCard`

- Karta z tytułem **zawsze** ma ikonę w `header-prepend` odpowiadającą tematowi sekcji.
- Akcje kontekstowe (odświeżenie, filtr) w `header-append` jako `AbyssButton` z `flat` i ewentualnie `size="small"`.
- Stopka (`footer`, `footer-prepend`, `footer-append`) tylko w specyficznych sytuacjach (np. niezapisane zmiany) — nie w standardowym układzie.
- `AbyssInfo` stosuj tylko, gdy komunikat ma tytuł lub status semantyczny **i jest częścią stałego układu ekranu** (np. pusty stan tabeli, ostrzeżenie przed usunięciem konta).
- Nie używaj `AbyssInfo` do pokazywania wyniku akcji użytkownika (sukces/błąd po API) — do tego służy Quasar Notify.

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

Po wykonaniu akcji przez użytkownika (zapis formularza, usunięcie rekordu, ponowienie zadania, błąd sieci) informacja zwrotna musi być **toastem Quasar**, nie komponentem `AbyssInfo`.

| Sytuacja | Mechanizm | Przykład |
| -------- | --------- | -------- |
| Akcja zakończyła się sukcesem | `$q.notify({ type: 'positive', message })` | „Zadanie zostało usunięte.” |
| Akcja zakończyła się błędem | `$q.notify({ type: 'negative', message })` | „Nie udało się usunąć zadania.” |
| Trwały komunikat na stronie (pusty stan, ostrzeżenie przed destrukcją) | `AbyssInfo` | „Brak zadań w kolejce.” |
| Błąd walidacji w formularzu | `AbyssInput` (`error`, `errorMessage`) lub `AbyssInfo` w dialogu | pole z błędnym hasłem |

Reguły:

- **Nie** przełączaj widoczności `AbyssInfo` reaktywnie po `@success` / `@click` / odpowiedzi API — to antywzorzec; użytkownik traci kontekst, a layout „skacze”.
- Notify jest **efemeryczny** i nie zajmuje miejsca w układzie — pasuje do potwierdzenia operacji.
- `AbyssInfo` pozostaje w miejscu, gdzie komunikat ma być **zawsze widoczny**, dopóki zmieni się stan ekranu (np. pojawią się dane, użytkownik zamknie dialog).

Przykład notify po sukcesie:

```ts
import { useQuasar } from 'quasar'

const $q = useQuasar()

function notifySuccess(message: string): void {
  $q.notify({ type: 'positive', message })
}

function notifyError(message: string): void {
  $q.notify({ type: 'negative', message })
}
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

Zamiast tego: `$q.notify({ type: 'positive', message: actionMessage })` i brak reaktywnego `AbyssInfo` na stronie.

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
- W nagłówku i stopce `AbyssCard` oraz w `AbyssDialog` **wszystkie** przyciski używają `flat`. Akcja operacyjna łączy `flat` + `gradient` + `gradient-colors`.

### Warianty semantyczne

| Wariant    | Kiedy używać                                                                 | Nie używaj gdy                                                         |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| domyślny   | jedyna akcja na liście albo akcja pomocnicza bez gradientu                   | główna akcja operacyjna w parze decyzyjnej                            |
| `flat`     | każdy przycisk w nagłówku/stopce karty i dialogu; ikony w `#prepend`/`#append` `AbyssInput` | poza kartą, dialogiem i slotami `AbyssInput`                         |
| `current`  | aktualnie aktywny kontekst (nawigacja, wybrany rekord)                       | stan przełączalny toggle; tymczasowy filtr                             |
| `toggled`  | włączony stan nadal klikalny (toolbar, filtry)                               | nawigacja, aktywny route                                               |
| `gradient` | akcja operacyjna ze znaczeniem semantycznym                                   | bez `flat` w headerze/stopce karty i dialogu                         |

### Modyfikatory układu

| Prop           | Kiedy używać                                              |
| -------------- | --------------------------------------------------------- |
| `full-width`   | samodzielna akcja blokowa w pionowym stacku (dialog, formularz) |
| `size="small"` | akcja pomocnicza, toolbar, nagłówek karty                 |
| `icon-only`    | znaczenie oczywiste z kontekstu (zamknięcie, znane ikony) |
| `loading`      | akcja trwa — blokada ponownego kliknięcia                 |
| `percentage`   | postęp ma wartość informacyjną dla użytkownika            |
| `embedded`     | akcja poboczna bez przyciągania uwagi (np. reset hasła)   |

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

- `AbyssButtonGroup` z `AbyssButton` (`size="small"`, opcjonalnie `icon-only`).
- Dla listy akcji w kolumnie (np. menu kontekstowe, wybór opcji) użyj `vertical` — przyciski układają się pionowo z pełną szerokością kontenera i wysokością dopasowaną do treści.
- Aktywny stan narzędzia: `toggled`, nie `current`.
- Grupuj tylko semantycznie równorzędne akcje.

### 5. Sekcje na stronie

- Każda sekcja w osobnej `AbyssCard` (lub `AbyssGrid` z kafelkami `AbyssTile` dla list równorzędnych elementów).
- Nie buduj własnych kontenerów sekcji — używaj komponentów powierzchni.

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
- Traktuj `flat` jako obowiązkowy wariant każdego przycisku w nagłówku/stopce `AbyssCard` i w `AbyssDialog`; akcje operacyjne łącz z `gradient`.
- Używaj wyłącznie kluczy semantycznych w `gradient-colors`.
- Traktuj `current` jako aktualny kontekst, a `toggled` jako aktywny, nadal klikalny stan.
- Buduj ryzyko przez `AbyssInfo` + `gradient-colors="danger"` na przycisku operacyjnym.
- Potwierdzaj powodzenie lub niepowodzenie akcji użytkownika przez Quasar Notify (`type: 'positive'` / `'negative'`).
- Używaj `AbyssInfo` wyłącznie do statycznych komunikatów kontekstowych (pusty stan, ostrzeżenie, trwała wskazówka).
- Używaj `AbyssDate` / `AbyssTime` (lub `AbyssInput` z odpowiednim `type`) jako jedynego sposobu wyboru daty i czasu.
- Używaj `AbyssInput` z `type="copy"` dla wartości tylko do odczytu z kopiowaniem do schowka — pole jest `readonly`, przycisk jest wbudowany w `#append`, klik/focus zaznacza całą treść, a feedback po kopiowaniu realizuje wbudowany Quasar Notify.
- Ustawiaj i zmieniaj hasło wyłącznie w dedykowanym `AbyssDialog`.
- Używaj `AbyssMarkdown` dla generycznego podglądu Markdown; logikę changelogu trzymaj w komponencie aplikacji (`ChangeLog`).
- Używaj `AbyssScrollView` dla przewijanych widoków strony — nie polegaj na scrollu slotu `content` w `AbyssTemplate`.
- Ustawiaj `device` na `AbyssScrollView` zgodnie z kontekstem aplikacji (`mobile` / `desktop` / `web`).

### Don't

- Nie dodawaj własnych klas CSS, stylów inline ani nadpisań SCSS na prymitywach Abyss **w formularzach i standardowych kartach** — tam wystarczają propsy.
- Nie używaj `flat` poza nagłówkiem/stopką `AbyssCard`, `AbyssDialog` i slotami `#prepend` / `#append` w `AbyssInput`.
- Nie używaj footera `AbyssCard` w standardowym układzie.
- Nie używaj `gradient`, gdy akcja jest jedyna na liście poza kartą/dialogiem.
- Nie używaj `theme` dla lokalnej głównej akcji w bloku.
- Nie przekazuj własnych tablic kolorów do `gradient-colors`.
- Nie używaj `current` do aktywnych filtrów wielokrotnego wyboru — użyj `toggled`.
- Nie używaj `icon-only` dla akcji o niejasnej lub nieodwracalnej konsekwencji.
- Nie buduj pseudo-grup przycisków ręcznie — użyj `AbyssButtonGroup`.
- Nie owijaj `AbyssInput` ani `AbyssSelect` w dodatkowy `AbyssGrid`.
- Nie duplikuj pola `readonly` i osobnego przycisku „Kopiuj” — użyj `AbyssInput` z `type="copy"`.
- Nie używaj natywnych selektorów daty/czasu systemowych.
- Nie używaj `AbyssInfo` z `v-if` / `v-show` do pokazywania sukcesu lub błędu po akcji użytkownika — użyj Quasar Notify.
- Nie dodawaj zagnieżdżonych pionowych scrollbarów w treści `AbyssDialog` — przewijaj wyłącznie body dialogu.
- Nie dodawaj paddingu ani `overflow: auto` na wrapperze contentu `AbyssTemplate` — to odpowiedzialność `AbyssScrollView` lub `AbyssSidebarNav`.
- Nie uzależniaj scrollu strony od ujemnych marginesów kompensujących padding szablonu.

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
- `AbyssScrollView` — [`src/components/ui/AbyssScrollView/AbyssScrollView.stories.ts`](../../src/components/ui/AbyssScrollView/AbyssScrollView.stories.ts)
- `AbyssDebug` — [`src/components/ui/AbyssDebug/AbyssDebug.stories.ts`](../../src/components/ui/AbyssDebug/AbyssDebug.stories.ts)

Przykłady użycia w ekranach aplikacji Maia znajdują się w repozytorium `maia-app`.

---

## Powiązane pliki

- [`src/stories/AbyssDesign.mdx`](../../src/stories/AbyssDesign.mdx) — landing page w Storybooku.
- [`docs/architecture/abyss-design.md`](./abyss-design.md) — ten dokument.
