# Changelog

## [0.2.4] - 2026-09-02

Toast na mobile nie nachodzi na pasek systemowy.

### Poprawki

- Overlay `#overlay` w `AbyssTemplateRoot` dodaje `env(safe-area-inset-top)` do `padding-top`, żeby kolejka toastów nie nachodziła na pasek systemowy na mobile.

## [0.2.3] - 2026-09-02

Host kolejki toastów jest komponentem Abyss: `AbyssNotifyHost` w slocie `#overlay` Root.

### Nowości

- `AbyssNotifyHost` — host kolejki toastów w slocie `#overlay` `AbyssTemplateRoot` (`items`, `closeLabel`, `standalone`). Aplikacje nie trzymają `AppNotifyHost` w `shared` i nie robią `Teleport` ze strony.

### Poprawki

- Overflow kolejki toastów szuka hosta (`abyss-template__overlay` / `abyss-notify-queue`) w przodkach — `display: contents` na `AbyssNotifyHost` nie łamie pomiaru wysokości.

## [0.2.2] - 2026-09-02

Poprawka scrolla w `AbyssTemplateMain`: restore po bottom-loaderze nie walczy z użytkownikiem.

### Poprawki

- `restoreScrollAfterBottomLoading` nic nie robi, gdy viewport nie jest już w strefie dolnego loadera.
- W cooldownie restore działa tylko przy scrollu w dół; scroll w górę anuluje programowy skok zamiast przyciągać z powrotem do dołu.

## [0.2.1] - 2026-08-27

Jedna mapa wyboru UI: każda potrzeba ma dokładnie jeden przepisany komponent.

### Zmiany

- Kanon `docs/architecture/abyss-design.md`: tabela **Potrzeba → jeden komponent** (w tym wiersze **BRAK** i **Quasar dozwolony**). Skill `implement-abyss-ui` Krok 2 jest kopią 1:1; landing Storybook linkuje tabelę zamiast drugiej listy nazw.
- Formularz zawsze w `AbyssForm`; pełnoekranowy auth to `AbyssTemplateLogin`; tytuł sekcji wyłącznie `title` na `AbyssCard`; data w formularzu wyłącznie `AbyssInput` `type="date|time|datetime-local"`.

### Techniczne

- Stories i checklisty audytu zsynchronizowane z tabelą (m.in. `flat`, Card / Panel / Tile, Chart vs Histogram, shadow-wrappery).
- Raport diagnostyczny: `docs/raports/2026-08-26-abyss-jedna-potrzeba-jedno-rozwiazanie.md`

## [0.2.0] - 2026-08-24

Wspólna nazwa `size` dla pól i przycisków: `normal` zastąpione przez `big`.

### Nowości

- `AbyssTemplateLogin` — szablon strony logowania z wyśrodkowanym kontenerem o stałej `max-width` (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH`); slot wymaga `AbyssCard` (przykład: formularz logowania)
- `AbyssAppLock` / `AbyssNumericKeypad`: klawiatura na szerokość treści karty (bez cap `280px`); `AbyssPinInput`: kropki wyśrodkowane ze stałym `gap`

### Zmiany

- `AbyssInput`, `AbyssSelect`, `AbyssInputLabel`: prop `size` to `'small' | 'big'` (domyślnie `big`). Wartość `normal` usunięta — to ten sam token co `AbyssButton` `big`.

### Techniczne

- Skille LLM (`docs/skills/`): `install-abyss-skills`, `implement-abyss-ui`, `audit-abyss-compliance` — instalacja HTTP do `.agents/skills/`, `.claude/skills/` i `.cursor/skills/` (Cursor, Claude Code, GitHub Copilot)

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
