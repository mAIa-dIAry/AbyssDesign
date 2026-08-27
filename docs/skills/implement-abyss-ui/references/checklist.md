# Checklist — implementacja UI (Abyss)

## Formularze i standardowe karty

- [ ] Użyto `AbyssForm` (nie natywny `<form>`, nie pola luzem) / `AbyssCard` / `AbyssDialog` zamiast własnych kontenerów
- [ ] Brak `class`, `style` i nadpisań SCSS na prymitywach Abyss
- [ ] `AbyssInput` / `AbyssSelect` **nie** owinięte dodatkowym `AbyssGrid`
- [ ] Przyciski akcji w `AbyssGrid` z `INPUT_COLUMN_SIZE` i `INPUT_GRID_MAX_COLUMNS`
- [ ] Zmiana hasła w `AbyssDialog`, nie inline w karcie (wyjątek: login)
- [ ] Data/czas w formularzu przez `AbyssInput` z `type="date"` / `"time"` / `"datetime-local"`; samodzielny `AbyssDate` / `AbyssTime` tylko w popupie / toolbarze

## AbyssCard

- [ ] Tytuł + ikona tematyczna w `#header-prepend`
- [ ] Akcje kontekstowe w `#header-append` jako `AbyssButton flat`
- [ ] Footer tylko gdy uzasadniony (np. niezapisane zmiany)

## AbyssButton

- [ ] W headerze/stopce karty i dialogu: wszystkie przyciski `flat`
- [ ] `flat` tylko na liście: Card header/footer, Dialog, Input prepend/append, NavHeader actions, wnętrze Switcher
- [ ] Akcja operacyjna: `flat` + `gradient` + klucz semantyczny `gradient-colors`
- [ ] Anulowanie bez gradientu
- [ ] Brak własnych tablic kolorów w `gradient-colors`
- [ ] `theme` tylko dla globalnego CTA aplikacji
- [ ] Jedna główna akcja operacyjna na blok decyzyjny
- [ ] `AbyssButtonGroup` zamiast ręcznego grupowania przycisków

## AbyssDialog

- [ ] Potwierdzenia i skupione akcje — nie inline na stronie
- [ ] Przy istotnej decyzji: jawne anulowanie, nie tylko ikona zamknięcia

## Komponent złożony aplikacji

- [ ] Custom SCSS zamknięty w jednym pliku komponentu (scoped + BEM)
- [ ] Strony formularzowe nie dziedziczą klas z komponentu złożonego

## Ogólne

- [ ] Brak bezpośredniego Quasara tam, gdzie istnieje odpowiednik Abyss — wyłącznie tabela „Quasar dozwolony”
- [ ] Wiersz **BRAK** (spinner, list-row, badge statusu) nie zastąpiony Quasarem
- [ ] Propsy zgodne ze story / autodocs komponentu
- [ ] Brak martwego kodu i nieużywanych importów
