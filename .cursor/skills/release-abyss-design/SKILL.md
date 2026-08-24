---
name: release-abyss-design
description: >
  Pełna procedura release AbyssDesign: lint, typecheck, commity jakościowe,
  bump wersji, changelog, build biblioteki i publikacja GitHub Release
  (npm publikuje GitHub Actions). Używaj gdy użytkownik prosi o release
  pakietu @maiadiary/abyss-design, nową wersję npm lub `/release-abyss-design`.
argument-hint: '[patch|minor|major] – [krótki opis zmian do changelogu]'
user-invocable: true
disable-model-invocation: true
---

# Release Abyss Design

Procedura release dla repozytorium **AbyssDesign** (`e:\repos\Maia\AbyssDesign`). Wykonuj kroki **po kolei**; nie przechodź dalej, dopóki bieżący krok nie przejdzie.

Katalog roboczy: root AbyssDesign. Package manager: **yarn**.

## Wymagania wstępne

- Node zgodny z `engines` w `package.json`.
- Dla kroków 8–9: `GITHUB_TOKEN` lub `GH_TOKEN` w `.env` / `.env.local` (priorytet pliku nad shellem). Fine-grained PAT: Contents Read and write na `mAIa-dIAry/AbyssDesign`.
- Secret GitHub Actions `NPM_TOKEN` (granular token npm z prawem publish w org `maiadiary`).

Szczegóły changelogu, npm i troubleshooting: [reference.md](reference.md).

---

## Procedura (9 kroków)

Skopiuj checklistę i odznaczaj postęp:

```
Release progress:
- [ ] 1. Lint
- [ ] 2. Poprawki lint + commit (jeśli były)
- [ ] 3. Typecheck
- [ ] 4. Poprawki typecheck + commit (jeśli były)
- [ ] 5. Commit „gotowe do release”
- [ ] 6. Podbicie wersji + changelog + commit
- [ ] 7. Build
- [ ] 8. Release
- [ ] 9. Push gałęzi
```

### 1. Lint

```powershell
cd e:\repos\Maia\AbyssDesign
yarn lint
```

### 2. Popraw jeśli są jakiekolwiek błędy

- Napraw wszystkie błędy ESLint.
- Commit tylko gdy były poprawki:

```powershell
git add -A
git commit -m "$(cat <<'EOF'
fix: resolve lint issues before release

EOF
)"
```

### 3. Typecheck

```powershell
yarn typecheck
```

### 4. Popraw jeśli są jakiekolwiek błędy

- Napraw wszystkie błędy `vue-tsc`.
- Commit tylko gdy były poprawki:

```powershell
git add -A
git commit -m "$(cat <<'EOF'
fix: resolve typecheck issues before release

EOF
)"
```

### 5. Zacommituj jako wersję gotową do release

Gdy po krokach 1–4 working tree ma niezacommitowane zmiany (np. poprawki bez osobnego commita), zacommituj je:

```powershell
git add -A
git status --short
git commit -m "$(cat <<'EOF'
chore: prepare release build

EOF
)"
```

Jeśli drzewo jest już czyste — pomiń commit, ale potwierdź `git status`.

### 6. Podbij wersję i dodaj changelog

1. Ustal nową wersję semver w `package.json` (domyślnie **patch**, chyba że użytkownik wskazał `minor`/`major` albo już podbił `version`).
2. Jeśli `version` jest już nowa, **nie podbijaj drugi raz** — tylko dopisz changelog, gdy go brakuje.
3. Dodaj sekcję na **górze** `CHANGELOG.md` (format w [reference.md](reference.md)).
4. Uruchom podgląd notatek release:

```powershell
yarn changelog:preview
```

5. Commit:

```powershell
git add package.json CHANGELOG.md
git commit -m "$(cat <<'EOF'
chore(release): bump version to X.Y.Z and add changelog

EOF
)"
```

Commit tylko gdy są zmiany w tych plikach.

### 7. Zbuduj

```powershell
yarn build
```

To bundluje bibliotekę (`dist/`) i emituje deklaracje typów. GitHub Actions zbuduje ponownie przed `npm publish`.

### 8. Uruchom release

```powershell
git status --short
```

Working tree **musi być czysty** (release domyślnie odrzuca dirty tree).

Opcjonalna weryfikacja GitHub przed publikacją:

```powershell
yarn release:check-github
```

Publikacja:

```powershell
yarn release
```

To tworzy/aktualizuje tag `vX.Y.Z` i **wypycha tylko tag**. GitHub Release i workflow `release.yml` (npm) idą z tagu. Commity z kroków 5–6 nadal są tylko lokalne — bez kroku 9 `main` na remote zostaje w tyle, a URL-e `raw.githubusercontent.com/.../main/docs/skills/` nie widzą nowej wersji.

Dry-run (bez API GitHub):

```powershell
yarn release:dry-run
```

### 9. Wypchnij gałąź (konieczne)

`yarn release` **nie** wypycha gałęzi. Push na końcu jest obowiązkowy — bez niego commity release nie są na `origin`, a kanoniczne skille HTTP wskazują na `main`.

```powershell
git push origin HEAD
```

Potwierdź, że remote dogonił lokalny HEAD (`git status` pokazuje `Your branch is up to date with 'origin/...'`).

---

## Zasady dla agenta

1. **Nie pomijaj kroków** — każdy gate (lint → typecheck → build) przed `yarn release`, potem **zawsze** krok 9 (`git push`).
2. **Commity tylko gdy są zmiany** — oprócz kroków, gdzie użytkownik jawnie wymaga commita (5–6).
3. **Push gałęzi na końcu jest konieczny.** `yarn release` wypycha tylko tag. Nie kończ procedury, dopóki `git push origin HEAD` nie przejdzie.
4. **Nie aktualizuj git config**.
5. **Nie commituj** `.env` / `.env.local`.
6. Po kroku 9 podaj: wersję, URL GitHub Release, URL pakietu npm (`https://www.npmjs.com/package/@maiadiary/abyss-design`), informację że Actions publikuje npm, oraz że gałąź poszła na remote.
7. Jeśli build, release lub push się wywali — napraw przyczynę, wróć do **pierwszego kroku, który zależy od zmiany** (zwykle od 1, 7 lub 9).

## Przykłady wywołania

- `/release-abyss-design` — pełna procedura patch release
- `/release-abyss-design minor – nowy komponent AbyssTable`
- `/release-abyss-design patch – poprawka ignorowania deprecations w tsconfig`
