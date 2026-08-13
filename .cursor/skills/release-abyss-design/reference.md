# Release Abyss Design — reference

## Changelog

Plik: `CHANGELOG.md` w root projektu.

Nagłówek sekcji:

```markdown
## [X.Y.Z] - RRRR-MM-DD
```

Potem akapit podsumowujący i opcjonalnie:

- `### Nowości`
- `### Zmiany`
- `### Poprawki`
- `### Techniczne`

`yarn release` wycina sekcję pasującą do tagu `vX.Y.Z` z changelogu jako release notes.

Podgląd bez publikacji:

```powershell
yarn changelog:preview
```

## Wersjonowanie

| Plik                       | Rola                 |
| -------------------------- | -------------------- |
| `package.json` → `version` | Źródło prawdy semver |

Tag GitHub Release: `v` + `version` (np. `0.1.1` → `v0.1.1`). Musi być identyczny — workflow `release.yml` to sprawdza.

## Build — co robi `yarn build`

1. `vite build` — ESM do `dist/` (composables, i18n, plugin Vite).
2. `vue-tsc --emitDeclarationOnly` — deklaracje typów.

Komponenty Vue i SCSS idą w tarballu jako źródła (`files` w `package.json`), nie przez ten bundel.

CI (`release.yml`) powtarza `yarn build` przed `npm publish`.

## Publikacja npm

Nie publikuj ręcznie (`npm publish`) w ramach tej procedury. Ścieżka:

1. `yarn release` → tag + GitHub Release.
2. `on: release: types: [published]` → `.github/workflows/release.yml`.
3. OIDC (Trusted Publisher) → `npm publish --access public`.

Jednorazowa konfiguracja npmjs: package settings → Trusted Publisher → GitHub Actions:

- Organization or user: `mAIa-dIAry`
- Repository: `AbyssDesign`
- Workflow filename: `release.yml`
- Environment: puste
- Allowed actions: `npm publish`

## Zmienne środowiskowe

- `GITHUB_TOKEN` / `GH_TOKEN` — tworzenie GitHub Release i push tagu.
- `.env` / `.env.local` — ładowane przez `tools/release.mjs` (priorytet pliku nad shellem dla tych kluczy).
- Fine-grained PAT: Contents Read and write na `mAIa-dIAry/AbyssDesign`.
- Przy SSO org: Authorize token dla `mAIa-dIAry`.

Szablon: `.env.example`.

## Typowe błędy

| Objaw | Działanie |
| ----- | --------- |
| `Git working tree is not clean` | Dokończ commity (krok 5–6) lub `git stash` |
| `Missing changelog section` | Dodaj `## [X.Y.Z]` zgodne z `package.json` |
| Brak uprawnień GitHub | `yarn release:check-github`; PAT musi obejmować AbyssDesign |
| Tag `vX.Y.Z` ≠ `package.json` | Workflow npm się wywali — wyrównaj wersję i tag |
| `npm publish` 403 / ENEEDAUTH | Trusted Publisher: org `mAIa-dIAry`, plik `release.yml` |
| Wersja już na npm | Nie odpalaj `yarn release` dla tej samej `version` |

## Skróty (poza pełną procedurą)

| Komenda | Cel |
| ------- | --- |
| `yarn changelog:preview` | Notatki z changelogu dla bieżącej wersji |
| `yarn release:dry-run --allow-dirty` | Podgląd bez czystego drzewa i bez API |
| `yarn release:check-github` | Test tokenu GitHub |
