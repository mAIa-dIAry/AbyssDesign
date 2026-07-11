# @maia/abyss-design

Abyss Design System — komponenty UI, style SCSS i narzędzia Vite dla aplikacji Quasar / Vue 3 w ekosystemie Maia.

## Wymagania

- Node.js 22+
- Yarn >= 1.21.1
- Peer dependencies: `vue` ^3.5, `quasar` ^2.16, `@quasar/extras` ^1.16, `vue-i18n` ^11
- Opcjonalnie (AbyssChart): `apexcharts`, `vue3-apexcharts`

## Instalacja lokalna (development)

W repozytorium konsumenta (`app`, `admin-web`):

```json
{
  "dependencies": {
    "@maia/abyss-design": "link:../AbyssDesign"
  }
}
```

```bash
cd AbyssDesign && yarn install && yarn build
cd ../app && yarn install
```

## Uruchomienie Storybooka

```bash
yarn storybook          # dev server na porcie 6006
yarn build-storybook    # statyczny build → storybook-static/
```

Po deployu na GitHub Pages dokumentacja komponentów jest dostępna publicznie (workflow `deploy-storybook.yml`).

## Standard systemowy

Kanoniczny dokument używania systemu: [`docs/architecture/abyss-design.md`](docs/architecture/abyss-design.md).

Storybook dokumentuje API komponentów (propsy, sloty, zdarzenia); reguły formularzy, kart i komponentów złożonych — w pliku powyżej.

## Integracja z Quasar

### 1. Aliasy Vite i TypeScript

Konsumenci używają helpera `tools/abyss-design.mjs` (wzór w `maia-app` / `admin-web`):

- `@/components/ui/*` → pakiet
- `@/composables/useGradient`, `@/types/*`, `@/utils/*`, `@/defines/*` → pakiet
- `@/composables/useKeyboardState` → pakiet (web stub) lub lokalna implementacja Capacitor w `app`

### 2. Style SCSS

```ts
// quasar.config.ts
css: [path.join(abyssDesignScss, 'app.scss')],

extendViteConf(viteConf) {
  viteConf.css.preprocessorOptions.scss.additionalData = abyssScssAdditionalData;
}
```

### 3. Plugin gradientów (preloader)

```ts
import { injectGradientPresetsPlugin } from '@maia/abyss-design/vite/inject-gradient-presets';

viteConf.plugins.push(injectGradientPresetsPlugin());
```

W `index.html` konsumenta wymagane placeholdery: `__PRELOADER_DEFAULT_GRADIENT__`, `__PRELOADER_DEFAULT_GRADIENT_TAIL__`, `__PRELOADER_GRADIENT_PRESETS__`.

### 4. Fonty

```ts
// src/boot/fonts.ts
import '@maia/abyss-design/styles/fonts';
```

### 5. i18n

```ts
import { abyssI18nMessages } from '@maia/abyss-design';

// Scal z messages aplikacji (pl-PL):
// { ...appMessages['pl-PL'], ...abyssI18nMessages['pl-PL'] }
```

Klucze wymagane przez komponenty: `ui.datePicker.*`, `common.navigation.back`.

### 6. Klawiatura mobilna (Capacitor)

Domyślnie pakiet dostarcza web stub (`useKeyboardState`). W aplikacji mobilnej nadpisz alias Vite na lokalną implementację Capacitor lub użyj:

```ts
import { installKeyboardState } from '@maia/abyss-design';

installKeyboardState(app, capacitorKeyboardState);
```

## Publiczne API

```ts
import {
  useGradient,
  useKeyboardState,
  installKeyboardState,
  GRADIENT_PRESETS,
  injectGradientPresetsPlugin,
  abyssI18nMessages,
  PIN_LENGTH,
} from '@maia/abyss-design';

import AbyssButton from '@maia/abyss-design/components/AbyssButton/AbyssButton.vue';
```

## Skrypty

| Skrypt | Opis |
|--------|------|
| `yarn build` | Bundling TS utils + deklaracje typów |
| `yarn typecheck` | Sprawdzenie typów |
| `yarn lint` | ESLint |
| `yarn storybook` | Dev Storybook |
| `yarn build-storybook` | Build statyczny Storybook |

## CI / CD

- **`ci.yml`** — lint, typecheck, build, build-storybook (PR + push do `main`)
- **`deploy-storybook.yml`** — publikacja Storybook na GitHub Pages
- **`release.yml.template`** — szablon publikacji npm (do aktywacji po skonfigurowaniu `NPM_TOKEN`)

## Publikacja npm (przyszłość)

Pakiet jest przygotowany pod publikację (`publishConfig.access: public`). Obecnie konsumenci używają `link:../AbyssDesign`.

Po publikacji:

```bash
yarn build
npm publish --access public
```

## Struktura

```
src/
├── components/ui/     # 33 komponenty Abyss
├── composables/       # useGradient, useKeyboardState
├── scss/              # helpers, setup, app.scss
├── i18n/              # minimalne komunikaty DS
├── stories/           # Storybook landing + dekoratory
└── vite/              # inject-gradient-presets plugin
```

## Licencja

UNLICENSED — prywatny pakiet projektu Maia.
