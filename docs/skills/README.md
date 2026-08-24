# Skille LLM (HTTP)

Kanoniczne Agent Skills dla aplikacji z `@maiadiary/abyss-design`. Ten sam format `SKILL.md` działa w Cursorze, Claude Code, GitHub Copilot, Codex i innych agentach zgodnych z [agentskills.io](https://agentskills.io).

Pakiet npm jest w `node_modules` (gitignore) — agent **nie** ma do niego dostępu. Instalacja wyłącznie przez HTTPS:

https://github.com/mAIa-dIAry/AbyssDesign

## Katalog

| Skill | Kiedy |
| ----- | ----- |
| [`install-abyss-skills`](install-abyss-skills/SKILL.md) | instalacja / odświeżenie kopii przez HTTP |
| [`implement-abyss-ui`](implement-abyss-ui/SKILL.md) | dodawanie i zmiana UI |
| [`audit-abyss-compliance`](audit-abyss-compliance/SKILL.md) | audyt i poprawki zgodności |

Instalator zapisuje skille do `.agents/skills/`, `.claude/skills/` i `.cursor/skills/`.

## Wklejka dla LLM

Jedna wiadomość — wklej w czacie agenta **w repozytorium aplikacji**:

```
Pobierz https://raw.githubusercontent.com/mAIa-dIAry/AbyssDesign/main/docs/skills/install-abyss-skills/SKILL.md i zainstaluj skille Abyss Design w tej aplikacji (tylko HTTP z https://github.com/mAIa-dIAry/AbyssDesign, bez node_modules).
```
