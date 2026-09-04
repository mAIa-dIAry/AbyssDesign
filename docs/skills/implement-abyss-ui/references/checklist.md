# Checklist — implementacja UI (Abyss)

## Formularze i standardowe karty

- [ ] Użyto `AbyssForm` (nie natywny `<form>`, nie pola luzem) / `AbyssCard` / `AbyssDialog` zamiast własnych kontenerów
- [ ] Brak `class`, `style` i nadpisań SCSS na prymitywach Abyss
- [ ] `AbyssInput` / `AbyssSelect` **nie** owinięte dodatkowym `AbyssGrid`
- [ ] Przyciski akcji w `AbyssGrid` z `INPUT_COLUMN_SIZE` i `INPUT_GRID_MAX_COLUMNS`
- [ ] Zmiana hasła w `AbyssDialog`, nie inline w karcie (wyjątek: login)
- [ ] Pole na pełną szerokość przez `full-width` (etykieta zostaje), nie przez usunięcie `label`
- [ ] Data/czas w formularzu przez `AbyssInput` z `type="date"` / `"time"` / `"datetime-local"`; samodzielny `AbyssDate` / `AbyssTime` tylko w popupie / toolbarze

## AbyssCard

- [ ] Tytuł + ikona tematyczna w `#header-prepend`
- [ ] Akcje kontekstowe w `#header-append` jako `AbyssButton flat` z `size="medium"` i `aria-label` (karta/dialog: promień `12px`; tabela: `6px`)
- [ ] Footer tylko gdy uzasadniony (np. niezapisane zmiany)

## AbyssButton

- [ ] W headerze/stopce karty i dialogu: wszystkie przyciski `flat`
- [ ] W `#content` karty: `AbyssButton` `size="big"` bez `flat` i bez `embedded`
- [ ] `flat` tylko na liście: Card header/footer, Dialog, Input prepend/append, NavHeader actions, wnętrze Switcher, komórka `AbyssTable`
- [ ] Akcja operacyjna w chrome/dialogu: `flat` + `gradient` + klucz semantyczny; w `#content` karty: `gradient` bez `flat`
- [ ] Anulowanie bez gradientu
- [ ] Brak własnych tablic kolorów w `gradient-colors`
- [ ] `theme` tylko dla globalnego CTA aplikacji
- [ ] Jedna główna akcja operacyjna na blok decyzyjny
- [ ] `AbyssButtonGroup` zamiast ręcznego grupowania przycisków

## AbyssDialog

- [ ] Potwierdzenia i skupione akcje — nie inline na stronie
- [ ] Przy istotnej decyzji: jawne anulowanie, nie tylko ikona zamknięcia
- [ ] Niepusty `title` — jest też `aria-label` powierzchni dialogu
- [ ] Brak własnej etykiety zamknięcia — domyślna pochodzi z `ui.dialog.close`

## AbyssTable

- [ ] Akcja w komórce: `AbyssButton` `flat` `size="small"` (tekst rekordu albo ikona z `aria-label`)
- [ ] Trigger menu akcji: `flat` `size="small"` `more_vert` + `AbyssDropdown`
- [ ] Szczegóły rekordu w `AbyssDialog` albo na osobnej trasie — nie dopięte pod tabelą

## Komponent złożony aplikacji

- [ ] Custom SCSS zamknięty w jednym pliku komponentu (scoped + BEM)
- [ ] Strony formularzowe nie dziedziczą klas z komponentu złożonego

## Ogólne

- [ ] Brak bezpośredniego Quasara tam, gdzie istnieje odpowiednik Abyss — wyłącznie tabela „Quasar dozwolony”
- [ ] Wiersz **BRAK** (spinner, list-row, badge statusu) nie zastąpiony Quasarem
- [ ] Propsy zgodne ze story / autodocs komponentu
- [ ] Brak martwego kodu i nieużywanych importów
- [ ] Przełącznik gradientów: `AbyssGrid` `content-rows` `pack` `column-size="64px"`, bez `max-columns`
