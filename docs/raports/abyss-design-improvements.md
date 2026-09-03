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

---

## ADI-001 — Przyciski w komórkach `AbyssTable`

**Status:** `DONE` — komórka `AbyssTable` jest na liście dozwolonych miejsc dla
`flat`, kanon rozróżnia akcję w komórce od klikalnego wiersza, story
`AbyssTable` → „Akcje w komórkach” pokazuje tekstową akcję i trigger
`more_vert` z `AbyssDropdown`, checklisty audytu chronią `flat` w tabeli.

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

### Miejsce wykrycia

- `src/components/shared/PlansTablePanel/PlansTablePanel.vue`
- `src/components/shared/StacksTablePanel/StacksTablePanel.vue`
- `src/components/shared/StackActionsMenu/StackActionsMenu.vue`

---

## ADI-002 — Szczegóły rekordu nigdy jako append do bieżącej strony

**Status:** `DONE` — zasada nadrzędna 12 w kanonie, sekcja „Szczegóły rekordu”
z kryteriami dialog vs. trasa, antyprzykład w Do / Don't, kontrola w
checklistach audytu, dialog szczegółów w story „Akcje w komórkach”.  
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

---

## ADI-003 — Akcja nagłówka karty nie dziedziczy stylu nagłówka tabeli

**Status:** `DONE` — `AbyssCard` i `AbyssDialog` nie nadpisują już
`--border-radius: 12px` na przyciskach nagłówka, więc akcja bierze natywny
promień ze skali `size="medium"` — tak samo jak w nagłówku `AbyssTable`.
`size="medium"` jest udokumentowany jako jedyny rozmiar akcji nagłówka.  
**Ważność:** `HIGH` — błąd layoutu/API komponentu

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

### Reguła rozmiaru

Ikonowe akcje w `#header-append` komponentów `AbyssCard` oraz
`AbyssTable as-card` zawsze używają `size="medium"`. Rozmiar `small` jest w
headerze nieprawidłowy: zmniejsza obszar interakcji i przestaje odpowiadać
pozostałym akcjom nagłówkowym.

### Błąd layoutu

`AbyssButton` nie udostępnia wariantu pozwalającego zachować w karcie wygląd
ikonowej akcji nagłówka tabeli:

- wariant `small` i `medium` zachowuje promień `6px`,
- stan hover/focus/active pokazuje tło i border o tym promieniu,
- `AbyssCard` nadpisuje `--border-radius` przycisków nagłówka na `12px`,
- publiczne API nie ma propsa pozwalającego wyłączyć nadpisanie karty.

Efekt to mocniej zaokrąglony przycisk w karcie niż ten sam przycisk w nagłówku
tabeli.

### Stan aplikacji

Lokalne obejście zostało wycofane. Style nagłówków `AbyssCard` i `AbyssTable`
pozostają nietknięte, aby nie zmieniać zachowania hover/focus dostarczanego
przez AbyssDesign.

- `AbyssButton flat`,
- tylko `icon`,
- `aria-label` zamiast widocznego labela,
- obowiązkowo `size="medium"`,
- natywny promień przycisku karty,
- bez zmian hover/focus/active dostarczanych przez AbyssButton.

### Proponowana poprawka w AbyssDesign

1. Ujednolicić ikonowe akcje nagłówków `AbyssCard` i `AbyssTable`.
2. Nie nadpisywać promienia przycisku karty wartością `12px`.
3. Użyć wariantu w `AbyssCard` i `AbyssTable` stories dla refresh/filter/menu.
4. Jawnie udokumentować `size="medium"` jako jedyny rozmiar akcji nagłówka.
5. Dodać test wizualny stanów rest, hover, focus, active i loading.

### Miejsce wykrycia

- `src/components/shared/PlanBoardPanel/PlanBoardPanel.vue`
- `src/components/shared/PlansTablePanel/PlansTablePanel.vue`
- `src/components/shared/StacksTablePanel/StacksTablePanel.vue`

---

## ADI-004 — `AbyssInput` wymaga propsa `full-width`

**Status:** `DONE` — `full-width` jest w `AbyssInput` i `AbyssSelect`
(jednokolumnowa siatka, etykieta nad polem), z osobnym story w obu
komponentach i regułą w kanonie.  
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

### Miejsce wykrycia

- `src/components/shared/TaskThreadPanel/TaskThreadPanel.vue`

---

## ADI-005 — Zahardkodowane polskie etykiety zamykania w `AbyssDialog` i `AbyssNotify`

**Status:** `DONE` — domyślne etykiety zamykania pochodzą z `ui.dialog.close`
i `ui.notify.close`; przy okazji przeniesiono do warstwy `ui.*` pozostałe
zaszyte teksty: `ui.keypad.*` (`AbyssNumericKeypad`, `AbyssAppLock`),
`ui.pinInput.ariaLabel`, `ui.keybind.placeholder`,
`ui.appLock.biometricUnlock`. Propsy tekstowe mają teraz pusty default i służą
wyłącznie do nadpisania. `AbyssDialog` dostał też `aria-label` z `title`, bo
Quasar renderował `role="dialog"` bez dostępnej nazwy.  
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

### Miejsce wykrycia

- `node_modules/@maiadiary/abyss-design/src/components/ui/AbyssDialog/AbyssDialog.vue:134`
- `node_modules/@maiadiary/abyss-design/src/components/ui/AbyssNotify/AbyssNotify.vue:196`
- `src/pages/PlanBoardPage.vue` — obejście przez `:close-button-aria-label="t('common.close')"`

