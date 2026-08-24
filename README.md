# @maiadiary/abyss-design

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
    "@maiadiary/abyss-design": "link:../AbyssDesign"
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

## Skille dla LLM

Kanon: https://github.com/mAIa-dIAry/AbyssDesign (`docs/skills/`). Pakiet w `node_modules` jest poza zasięgiem agenta — instalacja tylko przez HTTP. Działa z Cursor, Claude Code, GitHub Copilot i innymi agentami `SKILL.md`.

Wklej w czacie agenta **w repozytorium aplikacji**:

```
Pobierz https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills/install-abyss-skills/SKILL.md i zainstaluj skille Abyss Design w tej aplikacji (tylko HTTP z https://github.com/mAIa-dIAry/AbyssDesign, bez node_modules).
```

Agent zapisze `install-abyss-skills`, `implement-abyss-ui` i `audit-abyss-compliance` w `.agents/skills/`, `.claude/skills/` i `.cursor/skills/`.

## Integracja z Quasar

### 1. Aliasy Vite i TypeScript

Konsumenci używają helpera `tools/abyss-design.mjs` (wzór w `maia-app` / `admin-web`):

- `@/components/ui/*` → prymitywy UI
- `@/components/templates/*` → szablony layoutu (Root, Main, Sidebar, Login)
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
import { injectGradientPresetsPlugin } from '@maiadiary/abyss-design/vite/inject-gradient-presets';

viteConf.plugins.push(injectGradientPresetsPlugin());
```

W `index.html` konsumenta wymagane placeholdery: `__PRELOADER_DEFAULT_GRADIENT__`, `__PRELOADER_DEFAULT_GRADIENT_TAIL__`, `__PRELOADER_GRADIENT_PRESETS__`.

### 4. Fonty

```ts
// src/boot/fonts.ts
import '@maiadiary/abyss-design/styles/fonts';
```

### 5. i18n

```ts
import { abyssI18nMessages } from '@maiadiary/abyss-design';

// Scal z messages aplikacji (pl-PL):
// { ...appMessages['pl-PL'], ...abyssI18nMessages['pl-PL'] }
```

Klucze wymagane przez komponenty: `ui.datePicker.*`, `common.navigation.back`.

### 6. Klawiatura mobilna (Capacitor)

Domyślnie pakiet dostarcza web stub (`useKeyboardState`). W aplikacji mobilnej nadpisz alias Vite na lokalną implementację Capacitor lub użyj:

```ts
import { installKeyboardState } from '@maiadiary/abyss-design';

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
} from '@maiadiary/abyss-design';

import AbyssButton from '@maiadiary/abyss-design/components/AbyssButton/AbyssButton.vue';
```

## Skrypty

| Skrypt | Opis |
|--------|------|
| `yarn build` | Bundling TS utils + deklaracje typów |
| `yarn typecheck` | Sprawdzenie typów |
| `yarn lint` | ESLint |
| `yarn storybook` | Dev Storybook |
| `yarn build-storybook` | Build statyczny Storybook |
| `yarn changelog:preview` | Podgląd notatek z `CHANGELOG.md` |
| `yarn release:check-github` | Test tokenu GitHub |
| `yarn release` | Tag `vX.Y.Z` + GitHub Release (npm publikuje Actions) |
| `yarn release:dry-run` | Podgląd release bez API GitHub |

## CI / CD

- **`ci.yml`** — lint, typecheck, build, build-storybook (PR + push do `main`)
- **`deploy-storybook.yml`** — publikacja Storybook na GitHub Pages
- **`release.yml`** — publikacja npm przy GitHub Release (secret `NPM_TOKEN`)

## Publikacja npm

Pakiet: [`@maiadiary/abyss-design`](https://www.npmjs.com/package/@maiadiary/abyss-design).

Lokalny development nadal może używać `link:../AbyssDesign`. Po publikacji konsumenci instalują z npm:

```bash
yarn add @maiadiary/abyss-design
```

### Autopublish (jak MaiaApp)

Lokalnie `yarn release` tworzy tag i GitHub Release. Workflow `release.yml` publikuje pakiet na npm (secret `NPM_TOKEN`).

Jednorazowo:

1. [npm → Access Tokens](https://www.npmjs.com/settings/~/tokens) → Generate new token (granular):
   - Permission: **Read and write**
   - Packages / org: `maiadiary` albo `@maiadiary/abyss-design`
   - Bypass 2FA / Automation (żeby CI nie pytało o OTP)
2. GitHub → [AbyssDesign → Settings → Secrets → Actions](https://github.com/mAIa-dIAry/AbyssDesign/settings/secrets/actions) → New repository secret:
   - Name: `NPM_TOKEN`
   - Value: token z npm

Token GitHub (`GITHUB_TOKEN`) w `.env` / `.env.local` — lokalny `yarn release`. Fine-grained PAT: Contents Read and write na `mAIa-dIAry/AbyssDesign`.

Kolejna wersja:

1. Podnieś `version` w `package.json`.
2. Dodaj sekcję `## [X.Y.Z] - RRRR-MM-DD` na górze `CHANGELOG.md`.
3. Zacommituj (working tree musi być czyste).
4. `yarn release`

Ręcznie (awaryjnie):

```bash
yarn build
npm publish --access public
```

## Struktura

```
src/
├── components/ui/        # prymitywy Abyss
├── components/templates/ # szablony layoutu (Root, Main, Sidebar, Login)
├── composables/       # useGradient, useKeyboardState
├── scss/              # helpers, setup, app.scss
├── i18n/              # minimalne komunikaty DS
├── stories/           # Storybook landing + dekoratory
└── vite/              # inject-gradient-presets plugin
```

## Licencja

MIT — zobacz [LICENSE](LICENSE).
