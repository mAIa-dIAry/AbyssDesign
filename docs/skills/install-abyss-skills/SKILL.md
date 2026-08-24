---
name: install-abyss-skills
description: >
  Downloads Abyss Design consumer Agent Skills over HTTPS from the public GitHub
  repo mAIa-dIAry/AbyssDesign into this app. Use when setting up or refreshing
  Abyss skills for Cursor, Claude Code, GitHub Copilot, Codex, or any other
  SKILL.md-compatible agent. Never read node_modules or a local AbyssDesign checkout.
argument-hint: '[ścieżka aplikacji – opcjonalnie]'
disable-model-invocation: false
---

# Instalacja skilli Abyss Design

## Cel

Pobrać kanoniczne skille konsumenta **przez HTTPS** z publicznego GitHuba i zapisać je tam, skąd agenci je ładują. Nadpisać istniejące kopie.

Repozytorium: https://github.com/mAIa-dIAry/AbyssDesign  
Gałąź: `main`  
Baza: https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills/

Format to otwarty [Agent Skills](https://agentskills.io) (`SKILL.md`). Działa w Cursorze, Claude Code, GitHub Copilot, Codex i innych agentach, które czytają ten format.

**Zakaz:** `node_modules/@maiadiary/abyss-design` (gitignore), lokalny checkout AbyssDesign, kopiowanie z innej aplikacji.

Nie instaluje skilli maintainerów (`sync-abyss-design-rules`, `release-abyss-design`, `make-component`).

## Gdzie zapisać (wszystkie te katalogi)

Ten sam zestaw plików trafia do **każdego** z poniższych katalogów projektu — różne narzędzia skanują różne ścieżki:

| Katalog | Narzędzia |
| ------- | --------- |
| `.agents/skills/` | GitHub Copilot, Cursor, Codex, VS Code, inne agenty zgodne z agentskills.io |
| `.claude/skills/` | Claude Code (Copilot też to czyta) |
| `.cursor/skills/` | Cursor |

Nie zapisuj tylko do jednego z nich.

## Pliki źródłowe (HTTP)

Relatywna ścieżka względem bazy → ten sam układ w każdym katalogu docelowym:

| Relatywna ścieżka |
| ----------------- |
| `install-abyss-skills/SKILL.md` |
| `implement-abyss-ui/SKILL.md` |
| `implement-abyss-ui/references/checklist.md` |
| `audit-abyss-compliance/SKILL.md` |
| `audit-abyss-compliance/references/scan-checklist.md` |
| `audit-abyss-compliance/references/fix-patterns.md` |

Pełny URL = `https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills/` + ścieżka.

## Procedura

```
Postęp instalacji:
- [ ] Krok 1 — Katalog aplikacji
- [ ] Krok 2 — Pobranie HTTP do trzech katalogów
- [ ] Krok 3 — Weryfikacja
```

### Krok 1 — Katalog aplikacji

Cel: repozytorium **aplikacji** konsumującej pakiet (nie AbyssDesign).

Utwórz brakujące katalogi, w tym `references/` w każdym skillu.

### Krok 2 — Pobranie HTTP

Pobierz każdy plik z tabeli i zapisz go w **trzech** katalogach docelowych. Nadpisz. Tylko HTTPS — bez dysku i bez `node_modules`.

Możesz użyć curl, `Invoke-WebRequest` albo natywnego narzędzia HTTP agenta (fetch). Ważny jest wynik na dysku, nie narzędzie.

PowerShell (z katalogu aplikacji):

```powershell
$base = "https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills"
$dests = @(".agents/skills", ".claude/skills", ".cursor/skills")
$files = @(
  "install-abyss-skills/SKILL.md",
  "implement-abyss-ui/SKILL.md",
  "implement-abyss-ui/references/checklist.md",
  "audit-abyss-compliance/SKILL.md",
  "audit-abyss-compliance/references/scan-checklist.md",
  "audit-abyss-compliance/references/fix-patterns.md"
)
foreach ($dest in $dests) {
  foreach ($f in $files) {
    $out = Join-Path $dest $f
    New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
    Invoke-WebRequest -UseBasicParsing -Uri "$base/$f" -OutFile $out
  }
}
```

Bash:

```bash
BASE="https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills"
dests=".agents/skills .claude/skills .cursor/skills"
files="
install-abyss-skills/SKILL.md
implement-abyss-ui/SKILL.md
implement-abyss-ui/references/checklist.md
audit-abyss-compliance/SKILL.md
audit-abyss-compliance/references/scan-checklist.md
audit-abyss-compliance/references/fix-patterns.md
"
for dest in $dests; do
  for f in $files; do
    mkdir -p "$dest/$(dirname "$f")"
    curl -fsSL "$BASE/$f" -o "$dest/$f"
  done
done
```

Przy HTTP 404/403 zatrzymaj się i podaj URL, który nie zadziałał.

### Krok 3 — Weryfikacja

Dla każdego z trzech katalogów docelowych sprawdź, że istnieje wszystkich sześć plików i że nie są puste (18 plików łącznie).

## Podsumowanie

Podaj bazę URL i listę katalogów, do których zapisano skille. Agent ładuje je przy następnym starcie sesji / po odświeżeniu okna.

## Przykłady wywołania

- `/install-abyss-skills`
- Wklejka z README pakietu (pobranie tego pliku z GitHuba i wykonanie)
