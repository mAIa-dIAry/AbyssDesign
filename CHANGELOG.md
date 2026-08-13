# Changelog

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
