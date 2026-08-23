# Changelog

## [Unreleased]

### Nowości

- `AbyssTemplateLogin` — szablon strony logowania z wyśrodkowanym kontenerem o stałej `max-width` (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH`); slot wymaga `AbyssCard` (przykład: formularz logowania)
- `AbyssAppLock` / `AbyssNumericKeypad`: klawiatura na szerokość treści karty (bez cap `280px`); `AbyssPinInput`: kropki wyśrodkowane ze stałym `gap`

## [0.1.2] - 2026-08-19

Kolejka `AbyssNotify` w overlayu szablonu: akordeon, auto-close, licznik powtórzeń i `overflow: auto` dopiero gdy toasty przekraczają wysokość obszaru treści.

### Nowości

- Overlay `AbyssTemplateRoot` (`#abyss-template-overlay`) jako kotwica kolejki toastów w prawym górnym rogu obszaru treści
- `AbyssNotify`: opcjonalny `description` (akordeon 0,2 s), `count` (≥ 2) i `autoClose` z circular progress wokół X

### Zmiany

- Wejście toasta z góry i zejście w dół (0,2 s); ostatni toast w kolejce przy zejściu nie zwija wysokości slotu
- `overflow: auto` na hoście kolejki to przełącznik po ciszy 0,2 s — bez zdejmowania `auto` przy każdym nowym toaście; próg to `max-height` rodzica (`100%` wrappera treści)

### Poprawki

- Publikacja npm w CI przez secret `NPM_TOKEN`

### Techniczne

- `.env.example` z instrukcją tokenów GitHub i npm
- Typecheck: callback `ref` toasta i type guard hosta kolejki

## [0.1.1] - 2026-08-13

Publiczny release z automatyczną publikacją na npm przez GitHub Release.

### Nowości

- `yarn release` tworzy tag i GitHub Release (ten sam wzorzec co MaiaApp)
- Workflow `release.yml` publikuje `@maiadiary/abyss-design` na npm przez Trusted Publisher (OIDC)

### Poprawki

- `ignoreDeprecations` ustawione na `5.0`, żeby `yarn build` przechodził na TypeScript 5.9

### Techniczne

- Skill `release-abyss-design`, `CHANGELOG.md` i skrypty `tools/release.mjs` / `tools/changelog.mjs`

## [0.1.0] - 2026-08-13

Pierwsza publiczna wersja `@maiadiary/abyss-design` na npm.

- Komponenty UI, szablony layoutu, SCSS i Storybook jako pakiet Quasar / Vue 3
- Publikacja pod organizacją `maiadiary`, licencja MIT
