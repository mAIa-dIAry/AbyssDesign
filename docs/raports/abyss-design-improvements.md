# Abyss Design — improvements

Rejestr niejednoznaczności, braków i pułapek wykrytych podczas używania
Abyss Design w aplikacji. Dokument nie zastępuje kanonu
`docs/architecture/abyss-design.md` z repozytorium AbyssDesign. Jest listą
propozycji do przeniesienia do dokumentacji i stories systemu.

## Jak dopisywać wpisy

Każdy wpis powinien zawierać:

- kontekst i potrzebę UI,
- reguły lub źródła, które prowadzą do niejednoznaczności,
- błędną interpretację, którą łatwo zastosować,
- oczekiwany wzorzec,
- proponowane miejsce poprawki w dokumentacji AbyssDesign,
- status przeniesienia zmiany do kanonu.

Statusy:

- `OPEN` — pułapka jest opisana tylko tutaj,
- `UPSTREAM` — zgłoszona lub poprawiana w AbyssDesign,
- `DONE` — kanon i odpowiednie story zostały poprawione.

Aktualny pakiet aplikacji: `@maiadiary/abyss-design@0.2.6`.

---

## ADI-001 — Przyciski w komórkach `AbyssTable`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.5`

### Kontekst

Kolumna tabeli zawiera:

- tekstową akcję otwierającą szczegóły rekordu, np. tytuł planu lub nazwę
  stacku,
- ikonowy trigger menu akcji rekordu, np. `more_vert`.

```vue
<q-td :props="cellProps">
  <AbyssButton
    :label="row.title"
    flat
    size="small"
    @click="open(row)"
  />
</q-td>

<q-td :props="cellProps">
  <AbyssButton
    flat
    icon="sym_r_more_vert"
    :aria-label="t('actions.menu')"
  >
    <AbyssDropdown><!-- akcje --></AbyssDropdown>
  </AbyssButton>
</q-td>
```

### Pułapka

Ogólna lista dozwolonych miejsc dla `AbyssButton flat` wymienia nagłówek i
stopkę `AbyssCard`, `AbyssDialog`, sloty `AbyssInput`, akcje
`AbyssNavHeader` oraz wnętrze `AbyssSwitcher`. Nie wymienia komórki
`AbyssTable`.

Jednocześnie wzorzec tabeli wymaga, aby tekstowa akcja lub ikonowy trigger menu
w komórce nie wyglądały jak standardowy, wypełniony przycisk. Bez `flat`
rekord dostaje wizualną powierzchnię przycisku, która konkuruje z tabelą i
zaburza układ wiersza.

Łatwy, ale błędny wniosek: usunąć `flat`, ponieważ tabela nie występuje na
ogólnej liście wyjątków.

### Oczekiwany wzorzec

Akcja osadzona w komórce `AbyssTable` używa:

- `AbyssButton`,
- `flat`,
- rozmiaru dopasowanego do gęstości tabeli, zwykle `size="small"`,
- czytelnej etykiety tekstowej albo ikony z `aria-label`,
- bez `gradient`, jeśli akcja jedynie otwiera szczegóły.

Trigger menu akcji używa ikony `more_vert`; pełne etykiety akcji pozostają
wewnątrz `AbyssDropdown`.

Nie dotyczy to uczynienia całego wiersza klikalnym ani budowania wiersza listy
z przycisku.

### Proponowana poprawka w AbyssDesign

1. Dodać komórkę `AbyssTable` do listy dozwolonych miejsc dla `flat`.
2. Rozróżnić w kanonie:
   - tekstową akcję **wewnątrz komórki tabeli**,
   - klikalny **cały wiersz/list-row**, dla którego nadal brakuje prymitywu.
3. Dodać do story `AbyssTable` przykłady:
   - kolumny z tekstową akcją `flat`,
   - kolumny akcji z ikonowym triggerem `flat` i `AbyssDropdown`.
4. Dodać przypadek do checklisty audytu, aby automatyczna kontrola nie usuwała
   `flat` z akcji tabelarycznych.

### Zastosowana poprawka

Kanon 0.2.5 dodaje komórkę `AbyssTable` do listy miejsc `flat` (`size="small"`)
i rozróżnia akcję w komórce od klikalnego całego wiersza. Aplikacja już używa
tego wzorca w tabelach planów i stacków.

### Miejsce wykrycia

- `src/components/shared/PlansTablePanel/PlansTablePanel.vue`
- `src/components/shared/StacksTablePanel/StacksTablePanel.vue`
- `src/components/shared/StackActionsMenu/StackActionsMenu.vue`

---

## ADI-002 — Szczegóły rekordu nigdy jako append do bieżącej strony

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.5`  
**Ważność:** `CRITICAL` — podatność UX

### Kontekst

Użytkownik klika rekord, kartę tablicy, wiersz tabeli lub inną reprezentację
obiektu, aby zobaczyć jego szczegóły.

### Podatność UX

Nie wolno po kliknięciu dopinać szczegółów poniżej istniejącej zawartości
strony:

```vue
<!-- Antywzorzec -->
<Records @open="selectedId = $event" />
<RecordDetails v-if="selectedId" :id="selectedId" />
```

Taki append:

- zmienia strukturę i wysokość strony bez wyraźnej zmiany kontekstu,
- przesuwa źródło kliknięcia i pozostałą zawartość,
- może otworzyć szczegóły poza aktualnym viewportem,
- nie daje jednoznacznego mechanizmu zamknięcia ani powrotu,
- utrudnia obsługę historii, przycisku Wstecz i deep linków,
- na małych ekranach rozdziela źródło akcji i jej rezultat dużą odległością,
- może pozostawić stary wybór widoczny po odświeżeniu danych nadrzędnych.

### Reguła bez wyjątków

Content pojawiający się po kliknięciu rekordu musi zostać pokazany:

1. w `AbyssDialog` — gdy jest to krótkie, skupione zadanie lub podgląd bez
   potrzeby własnego adresu URL, albo
2. na osobnej stronie/trase — gdy szczegóły są rozbudowane, wymagają historii,
   deep linku lub dalszej nawigacji.

Nigdy nie renderować go jako append, prepend ani rozwijany blok w istniejącym
contencie strony. Rozwijanie technicznych danych w obrębie komponentu, które
jest jawnie udokumentowaną funkcją danego komponentu (np. kontrolowane
`row-expand` tabeli), nie jest przejściem do szczegółów rekordu i nie może
zawierać pełnego widoku szczegółowego.

### Decyzja: modal czy osobna strona

Użyj `AbyssDialog`, gdy:

- użytkownik ma wykonać jedną skupioną akcję,
- kontekst strony nadrzędnej powinien pozostać widoczny,
- szczegóły nie wymagają trwałego URL.

Użyj osobnej strony, gdy:

- widok ma wiele sekcji lub własną nawigację,
- powinien obsługiwać odświeżenie i bezpośredni link,
- użytkownik może przechodzić dalej do kolejnych zasobów.

### Proponowana poprawka w AbyssDesign

1. Dodać tę regułę do sekcji nawigacji i kompozycji widoków.
2. Dodać do mapy „Potrzeba → jeden komponent” pozycję:
   „szczegóły po kliknięciu rekordu” → `AbyssDialog` albo osobna trasa według
   kryteriów powyżej.
3. Dodać antyprzykład appendowanych szczegółów do sekcji Do / Don't.
4. Dodać kontrolę do checklisty audytu UI.

### Miejsce wykrycia

- `src/pages/PlanBoardPage.vue`
- `src/components/shared/PlanBoardPanel/PlanBoardPanel.vue`
- `src/components/shared/TaskThreadPanel/TaskThreadPanel.vue`

### Zastosowana poprawka

- tablica planu jest sekcją `AbyssCard`,
- akcja odświeżania znajduje się w `#header-append` jako
  `AbyssButton flat`,
- kliknięcie karty zadania otwiera `TaskThreadPanel` w `AbyssDialog`,
- szczegóły nie są już dopinane pod tablicą.

Kanon 0.2.5 wpisuje tę regułę do mapy „Potrzeba → jeden komponent”: szczegóły
rekordu po kliknięciu to `AbyssDialog` albo osobna trasa, nigdy blok dopięty
pod listą.

---

## ADI-003 — Ikonowa akcja nagłówka: `size="medium"`, promień należy do pojemnika

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.6`  
**Ważność:** `HIGH` — błąd layoutu po niepotrzebnej zmianie kanonu

### Kontekst

Nagłówek `AbyssCard` lub `AbyssTable as-card` zawiera kontekstową akcję
odświeżenia. Zgodnie ze story `AbyssCard` powinna to być płaska akcja ikonowa:

```vue
<AbyssButton
  flat
  size="medium"
  icon="sym_r_refresh"
  aria-label="Odśwież"
/>
```

Przycisk nie powinien mieć widocznego labela. Dostępna nazwa akcji pochodzi z
`aria-label`.

### Co było potrzebne

Ikonowe akcje w `#header-append` zawsze używają `size="medium"`. Rozmiar
`small` jest w headerze nieprawidłowy: zmniejsza obszar interakcji i przestaje
odpowiadać pozostałym akcjom nagłówkowym.

To jedyna wspólna reguła karty i tabeli: ten sam rozmiar, ikona, `flat`,
`aria-label`.

### Niepotrzebna zmiana w 0.2.5

Changelog 0.2.5 zrównał też **promień** ikonowych akcji nagłówków
`AbyssCard`, `AbyssTable` i `AbyssDialog` ze skalą `size="medium"` (`6px`)
i usunął nadpisanie `--border-radius: 12px` w karcie i dialogu.

Ta część zmiany była niepotrzebna i psuje layout karty.

Tabela ma wyższy header niż karta: w top barze tabeli oprócz tytułu mieszczą
się wyszukiwarka i akcje, więc narożnik jest wyższy. Karta ma niski header
(`min-height: 48px`) i ten sam przycisk `size="medium"` dosunięty ujemnym
marginem do krawędzi. Przy różnej wysokości narożnika **border-radius
przycisku musi być różny** — inaczej krzywizna nie składa się z obrysem
pojemnika.

Dlatego tabela może używać promienia ze skali `size="medium"` (`6px`), a karta
nie. Karta ma `border-radius: 16px`; poprzednie `12px` na przycisku nagłówka
było dopasowaniem do niższego narożnika karty, nie błędem do „naprawienia”
wzorem tabeli.

Promień `6px` w karcie nie jest współśrodkowy z narożnikiem pojemnika:
powstaje ciasna, obca krzywizna i nierówna szczelina między obrysem przycisku
a obrysem karty.

Nie zrównywać promienia przycisku karty z przyciskiem tabeli. Promień akcji
narożnej wynika z wysokości headera i chrome'u pojemnika (`AbyssCard` /
`AbyssDialog` vs `AbyssTable`), nie z tokenu `size` przycisku.

### Zastosowana poprawka

Kanon 0.2.6 przywraca `--border-radius: 12px` na akcjach nagłówka
`AbyssCard` / `AbyssDialog`. `AbyssTable` zostaje przy `6px` ze skali
`size="medium"`. Aplikacja nadal nie nadpisuje promienia lokalnym CSS.

Nadal obowiązuje:

- `AbyssButton flat`,
- tylko `icon`,
- `aria-label` zamiast widocznego labela,
- obowiązkowo `size="medium"`.

Geometryczna różnica (wyższy header tabeli vs niski header karty) zostaje
w kanonie jako uzasadnienie dwóch promieni, nie jako otwarta regresja.

### Proponowana poprawka w AbyssDesign

1. Cofnąć zrównywanie `--border-radius` nagłówka karty i dialogu ze skalą
   `size="medium"`.
2. Przywrócić większy promień akcji w `#header-append` karty / dialogu, tak
   aby krzywizna była współśrodkowa z narożnikiem pojemnika.
3. Zostawić `size="medium"` jako jedyny rozmiar akcji nagłówka.
4. Poprawić stories i checklistę audytu: nie pisać, że karta i tabela mają
   „ten sam wygląd” w zakresie promienia. Jawnie: header tabeli jest wyższy,
   więc promień przycisku nagłówka musi być inny niż w karcie.
5. Dodać test wizualny narożnika karty (rest / hover / focus).

### Miejsce wykrycia

- `src/components/shared/PlanBoardPanel/PlanBoardPanel.vue`

---

## ADI-004 — `AbyssInput` wymaga propsa `full-width`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.5`  
**Ważność:** `HIGH` — brak w API komponentu

### Problem

`AbyssInput` z widocznym `label` zawsze korzysta z wewnętrznego układu
kolumnowego: etykieta znajduje się po lewej, a pole po prawej. Nie istnieje
prop pozwalający zachować etykietę i jednocześnie wyrenderować pole na pełną
szerokość kontenera.

Usunięcie `label` powoduje przejście pola na szerokość `100%`, ale nie jest
poprawnym rozwiązaniem, ponieważ usuwa dostępną i widoczną nazwę pola.
Lokalne nadpisywanie wewnętrznego grida również nie powinno być wymagane od
aplikacji konsumującej design system.

### Wymagany props

`AbyssInput` powinien udostępnić boolean `full-width`:

```vue
<AbyssInput
  v-model="form.answer"
  type="textarea"
  label="Twoja odpowiedź"
  full-width
/>
```

W tym wariancie:

- etykieta pozostaje widoczna,
- etykieta znajduje się nad polem,
- pole zajmuje całą szerokość kontenera,
- obsługa hintów, błędów, licznika i slotów pozostaje bez zmian,
- zachowanie działa dla wszystkich typów inputu, w szczególności `textarea`.

### Proponowana poprawka w AbyssDesign

1. Dodać `fullWidth?: boolean` do `AbyssInputProps`.
2. Dodać klasę modyfikującą wewnętrzny `AbyssGrid` na układ jednokolumnowy.
3. Udokumentować wariant w story `AbyssInput`.
4. Dodać testy dla labela, textarea, error message, hint i responsywności.

### Zastosowana poprawka

`AbyssInput` (i `AbyssSelect`) mają `full-width`. Pole odpowiedzi w
`TaskThreadPanel` używa tego propsa i zachowuje etykietę nad textarea.

### Miejsce wykrycia

- `src/components/shared/TaskThreadPanel/TaskThreadPanel.vue`

---

## ADI-005 — Zahardkodowane polskie etykiety zamykania w `AbyssDialog` i `AbyssNotify`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.5`  
**Ważność:** `MEDIUM` — błąd i18n / dostępności

### Problem

Abyss ma własną warstwę tłumaczeń pod kluczem `ui.*`, z której komponenty
korzystają przez `useI18n()` — na przykład `AbyssInput` używa
`t('ui.input.copy')`, a `AbyssTable` kluczy `ui.table.*`. Mimo tego dwa
komponenty zaszywają polski tekst w domyślnych wartościach propsów:

- `AbyssDialog` → `closeButtonAriaLabel: 'Zamknij dialog'`,
- `AbyssNotify` → `closeLabel: 'Zamknij'`.

W aplikacji z aktywnym `en-US` przycisk zamknięcia dostaje polską nazwę
dostępną, mimo że reszta interfejsu jest angielska. Czytnik ekranu odczytuje
wtedy etykietę w innym języku niż język strony.

### Skutek dla aplikacji konsumującej

Każde użycie `close-button` oraz każdy toast wymaga ręcznego podania etykiety,
inaczej wycieka polski tekst. To odwraca zależność: aplikacja musi tłumaczyć
element wewnętrzny design systemu, który ma już do tego własny mechanizm.

### Proponowana poprawka w AbyssDesign

1. Dodać klucze `ui.dialog.close` i `ui.notify.close` do warstwy `ui.*`.
2. Zmienić domyślne wartości na `t('ui.dialog.close')` i `t('ui.notify.close')`,
   zachowując propsy jako nadpisanie.
3. Wyłapać pozostałe zahardkodowane ciągi w komponentach `ui/`.
4. Dodać test sprawdzający brak literałów językowych w domyślnych propsach.

### Zastosowana poprawka

Domyślne etykiety pochodzą z `ui.dialog.close` i `ui.notify.close`. Aplikacja
dostarcza te klucze w `en-US` i `pl-PL`, host toastów to `AbyssNotifyHost`,
a modal zadania nie nadpisuje już `close-button-aria-label`.

### Miejsce wykrycia

- `src/pages/PlanBoardPage.vue`
- `src/layouts/MainLayout.vue`
- `src/layouts/AuthLayout.vue`
- `src/pages/ErrorNotFound.vue`

---

## ADI-006 — Tarball 0.2.5 nie publikuje `src/utils`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.6`  
**Ważność:** `HIGH` — błąd pakietu npm

### Problem

Od 0.2.5 komponenty SFC importują narzędzia względną ścieżką
(`../../../utils/debounce`, `pinCode`, `markdownToHtml`, `desktopShortcut`),
zamiast aliasu `@/utils/*`. Pole `files` w `package.json` pakietu zawiera
`src/components`, ale nie `src/utils`. `dist/utils/debounce.js` też nie jest
publikowane — jest tylko `.d.ts`.

Konsument nie może skompilować `AbyssForm` bez ręcznego uzupełnienia tych
plików.

### Zastosowana poprawka

Tarball 0.2.6 publikuje `src/utils` oraz `dist/utils/debounce.js`. Obejście
`tools/materialize-abyss-src-utils.mjs` i shim `src/utils/abyssDebounce.ts`
zostały usunięte — nie wolno ich przywracać, bo nadpisałyby opublikowane
źródła.

### Proponowana poprawka w AbyssDesign

1. Dodać `src/utils` do `files` albo przywrócić importy `@/utils/*`.
2. Publikować `dist/utils/debounce.js`, nie tylko deklarację.
3. Dodać test paczki sprawdzający, że każdy względny import SFC istnieje
   w tarballu.

---

## ADI-007 — `AbyssGradientBox` nie może mieć sztywnego `64px`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.7`  
**Ważność:** `HIGH` — błąd layoutu/API komponentu

### Problem

`AbyssGradientBox` miał zahardkodowane `width: 64px` i `height: 64px`. Box ma
wypełniać komórkę (`width: 100%`, `aspect-ratio: 1 / 1`) i móc **maleć** przy
wąskiej karcie. `64px` to **maksymalny** rozmiar kolumny przełącznika
gradientów, nie jedyny rozmiar boxa i nie domyślne `360px` siatki widgetów.

W karcie ustawień rząd ma zmieścić tyle kafelków, ile wejdzie przy kolumnie
≤ 64px. Puste miejsce po prawej przy `max-columns="8"` brało się z limitu
ośmiu kolumn, nie z tego, że kafelki miały rosnąć do szerokości karty.

### Pułapka 0.2.6

Story „Przełącznik gradientów” każe **nie** ustawiać `column-size="64px"`
i zostawia domyślne `360px` (`WIDGET_COLUMN_SIZE`). Box wypełnia komórkę, więc
powstają dwa ogromne kwadraty. Test `boxRect.width > 64` utrwala ten błąd.

`column-size` w `AbyssGrid` jest minimum w `minmax(..., 1fr)`, nie maksimum —
`1fr` i tak trochę rozciąga tor. Na przełączniku i tak trzeba podać
`column-size="64px"`; bez tego obowiązuje 360px.

### Oczekiwany wzorzec

W `#content` karty:

```vue
<AbyssGrid content-rows pack column-size="64px">
  <AbyssGradientBox
    v-for="preset in GRADIENT_PRESETS"
    :key="preset.label"
    :colors="preset.colors"
    :active="selected === preset.label"
    @click="select(preset.label)"
  />
</AbyssGrid>
```

- bez `:max-columns="8"` (limit zostawiał dziurę zamiast dokładanych kolumn),
- bez `:deep()` na `.abyss-gradient-box`,
- box kwadratowy, nie większy niż kolumna 64px (docelowo twardy max w siatce).

### Stan aplikacji

Zakładka wyglądu używa `column-size="64px"` i `content-rows`, bez
`max-columns`.

### Proponowana poprawka w AbyssDesign

1. Story i autodocs: `column-size="64px"` jest wymagane; 64px to max kolumny
   przełącznika, nie zakaz.
2. Nie używać domyślnego `360px` w przykładzie karty ustawień.
3. `AbyssGrid`: `column-size` jako maksimum toru w tym wzorcu (albo osobny
   prop), zamiast `minmax(min, 1fr)` które rozciąga ponad 64px.
4. Test: szerokość boxa ≤ 64px przy szerokiej karcie; przy wąskiej maleje;
   liczba kolumn rośnie z szerokością, bez `max-columns="8"`.

### Zastosowana poprawka

`AbyssGrid` ma prop `pack`: `column-size` jest maksimum toru
(`minmax(0, min(100%, var(--column-size)))`), bez `1fr`. Formularze zostają
przy dotychczasowym `minmax(..., 1fr)` i `max-columns`. Przełącznik:
`content-rows pack column-size="64px"` (`GRADIENT_BOX_COLUMN_SIZE`), bez
`max-columns`. Story i test: box ≤ 64px na szerokiej karcie, maleje na
wąskiej, liczba kolumn rośnie z szerokością.

### Miejsce wykrycia

- `src/components/shared/SettingsAppearanceTab/SettingsAppearanceTab.vue`

---

## ADI-008 — W formularzu w `#content` karty tylko standardowy `AbyssButton` `size="big"`

**Status:** `DONE` — `@maiadiary/abyss-design@0.2.6`  
**Ważność:** `HIGH` — luka i sprzeczność w kanonie

### Problem

Formularz w slocie `#content` karty (`AbyssForm` wewnątrz `AbyssCard`) nie
może używać przycisków `flat` ani `embedded`. Dozwolony jest wyłącznie
**standardowy** `AbyssButton` (bez `flat`, bez `embedded`) o rozmiarze
**`big`**.

`flat` i `embedded` zostają zarezerwowane dla chrome'u karty: `#header-append`
i stopka. Nie przenoszą się na akcje leżące w treści, pod polami.

### Pułapka

Kanon i skill mówią jednocześnie dwie rzeczy:

- lista miejsc `flat` wymienia header i stopkę `AbyssCard`, nie content,
- skrót `AbyssButton` każe w karcie/dialogu stawiać **każdy** przycisk jako
  `flat`.

Drugi punkt jest błędny dla formularza w contencie. Łatwy wniosek: submit
„Zapisz token” / „Zaloguj” / „Wyślij” dostaje `flat` albo `embedded`, bo
„wszystko w karcie jest płaskie”. To spłaszcza CTA do wyglądu akcji
nagłówka i gubi hierarchię.

`embedded` w tym samym miejscu jest tym bardziej niedozwolony: to wariant
akcji pobocznej w chrome, nie głównej akcji formularza.

### Oczekiwany wzorzec

```vue
<AbyssCard title="Poświadczenia">
  <template #header-prepend>
    <q-icon name="sym_r_key" />
  </template>
  <template #content>
    <AbyssForm :model-value="form" @submit-form="save">
      <AbyssInput v-model="form.token" label="Token" />
      <AbyssGrid
        align="right"
        :column-size="INPUT_COLUMN_SIZE"
        :max-columns="INPUT_GRID_MAX_COLUMNS"
      >
        <AbyssButton
          type="submit"
          size="big"
          :label="t('common.save')"
        />
      </AbyssGrid>
    </AbyssForm>
  </template>
</AbyssCard>
```

W `#content` formularza:

- `size="big"` — jedyny dozwolony rozmiar,
- bez `flat`,
- bez `embedded`,
- `gradient` / `gradient-colors` tylko gdy akcja ma znaczenie semantyczne
  (operacyjna), nadal bez `flat`.

Nadal `flat` (zwykle `size="medium"`):

- `#header-append` karty,
- stopka karty,
- stopka / akcje `AbyssDialog`.

### Zastosowana poprawka

Kanon 0.2.6: submit formularza w `#content` karty to standardowy
`AbyssButton` `size="big"` — bez `flat`, bez `embedded`. `gradient` bez
`flat` zostaje dla akcji operacyjnych. `flat` zostaje w headerze/stopce
karty oraz w dialogu.

Aplikacja: `LoginForm` i zapisy w `CredentialsTab` bez `flat`. Logout w
`SettingsAccountTab` i CTA dashboardu zostają `flat` (stopka karty). Submit
w `TaskThreadPanel` zostaje `flat` (dialog).

### Proponowana poprawka w AbyssDesign

1. Rozdzielić w kanonie przyciski **chrome'u karty** (`flat`) od przycisków
   **formularza w `#content`** (standard, `size="big"`).
2. Usunąć zdanie „w karcie/dialogu każdy przycisk jest `flat`” albo ograniczyć
   je do headera, stopki i dialogu.
3. Dodać `embedded` do zakazu w `#content` formularza.
4. Uzupełnić story `AbyssForm` / `AbyssCard`: submit pod polami bez `flat`,
   `size="big"`.
5. Dodać pozycję do checklisty audytu, żeby `flat` na submitcie w contencie
   karty był naruszeniem.

### Miejsce wykrycia

- `src/components/shared/CredentialsTab/CredentialsTab.vue`
- `src/components/shared/LoginForm/LoginForm.vue`
- `src/components/shared/TaskThreadPanel/TaskThreadPanel.vue`
- `src/components/shared/SettingsAccountTab/SettingsAccountTab.vue`

