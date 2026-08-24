# Wzorce napraw — audyt Abyss Design

Mapowanie typowych naruszeń na poprawki. Przed każdą zmianą sprawdź story komponentu w AbyssDesign.

---

## Zamiana Quasar → Abyss

| Było                               | Powinno być                         |
| ---------------------------------- | ----------------------------------- |
| `q-btn` w formularzu/karcie        | `AbyssButton` z właściwymi propsami |
| `q-card` jako sekcja ustawień      | `AbyssCard` + sloty                 |
| `q-input` / `q-select`             | `AbyssInput` / `AbyssSelect`        |
| `q-dialog` (decyzja/potwierdzenie) | `AbyssDialog`                       |
| `q-table` (główna tabela strony)   | `AbyssTable as-card`                |
| `<pre>{{ json }}</pre>`            | `AbyssCode`                         |

Quasar **zostaw** tam, gdzie story Abyss to dokumentuje: `q-icon` w `#header-prepend`, `q-popup-proxy` daty z `class="abyss-date-menu"`.

---

## AbyssCard

**Brak ikony w headerze:**

```html
<template #header-prepend>
  <q-icon name="sym_r_person" size="20px" />
</template>
```

**Akcja w headerze:**

```html
<template #header-append>
  <AbyssButton flat size="small" icon="refresh" label="Odśwież" />
</template>
```

**Dynamiczny AbyssInfo po akcji → Notify:**

```ts
import { notify } from '@/stores/notify.store';

notify({ type: 'success', message: t('...') });
```

---

## AbyssButton w karcie / dialogu

**Przycisk operacyjny (zapis, usunięcie):**

```html
<AbyssButton
  flat
  gradient
  gradient-colors="info"
  label="Zapisz"
  size="big"
  full-width
/>
```

**Anulowanie:**

```html
<AbyssButton flat label="Anuluj" />
```

**Destrukcyjny:**

```html
<AbyssButton flat gradient gradient-colors="danger" label="Usuń" full-width />
```

**Usuń `flat` poza kartą/dialogiem** — tylko gdy naruszenie dotyczyło niewłaściwego użycia `flat` na liście głównej.

---

## Formularze

**Przyciski pod polami:**

```html
<AbyssGrid
  align="right"
  :column-size="INPUT_COLUMN_SIZE"
  :max-columns="INPUT_GRID_MAX_COLUMNS"
>
  <AbyssButton size="big" label="Zapisz" full-width />
</AbyssGrid>
```

```ts
import {
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
```

**Usuń owijający AbyssGrid wokół pojedynczego pola** — zostaw samo `AbyssInput` / `AbyssSelect`.

**Hasło inline w karcie** → trigger + `AbyssDialog` z polami hasła.

---

## AbyssDialog

**Taby:**

```html
<template #navigation>
  <AbyssSwitcher v-model="tab" :options="tabOptions" />
</template>
```

**Scroll w body:**

- usuń `max-height` / `overflow-y: auto` z wrapperów w treści dialogu
- `AbyssTable`: usuń `height` lub ustaw `:height="0"`
- `AbyssCode`: `:scrollable="false"`

---

## AbyssTable

| Kontekst                | Poprawka                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Parametry w dialogu     | bez `as-card`, `hide-search`, `:rows-per-page-options="[0]"` |
| Główna lista na stronie | dodaj `as-card`, tytuł w `#top-left`                         |

---

## Stylowanie

| Naruszenie                                          | Poprawka                                                |
| --------------------------------------------------- | ------------------------------------------------------- |
| `class` na `AbyssInput` w formularzu                | usuń klasę; użyj propsów (`full-width`, `error`, sloty) |
| SCSS `:deep(.abyss-*)` w stronie ustawień           | usuń; popraw kompozycję propsami                        |
| Stylowanie w komponencie złożonym rozlané na stronę | przenieś do pliku komponentu złożonego                  |

---

## Brak komponentu Abyss

**Nie** implementuj obejścia Quasarem na stronie formularzowej.

Zatrzymaj się i zgłoś:

> Brak `Abyss<Nazwa>` dla [potrzeba]. Uruchom `make-component` w AbyssDesign.

---

## Kolejność refaktoru w pliku

1. Struktura kontenerów (`AbyssCard`, `AbyssForm`, `AbyssDialog`)
2. Pola i siatka
3. Przyciski i warianty
4. Feedback (Notify vs AbyssInfo)
5. Usunięcie martwego kodu i importów
