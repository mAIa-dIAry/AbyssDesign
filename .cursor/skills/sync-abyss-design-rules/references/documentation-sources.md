# Mapa źródeł dokumentacji Abyss Design

## Kanoniczne (edytuj w AbyssDesign)

| Plik | Rola | Co aktualizować |
| ---- | ---- | ---------------- |
| `docs/architecture/abyss-design.md` | Standard używania systemu — reguły kompozycji, Do/Don't, matryce | Zasady nadrzędne, wzorce kompozycji, tabele komponentów, sekcje per komponent (np. AbyssTable) |
| `src/stories/AbyssDesign.mdx` | Landing Storybook — mapa rodzin komponentów, skrócone reguły | Tylko gdy landing powiela regułę zmienioną w standardzie; unikaj duplikowania pełnego API |
| `.cursor/rules/storybook.mdc` | Reguły Cursor dla plików `*.stories.ts` | Konwencje `docs.source.code`, opisy `class`/`style`, kolory semantyczne w stories |
| `src/components/ui/Abyss*/Abyss*.stories.ts` | API i przykłady per komponent | `parameters.docs.description`, `argTypes`, opisy poszczególnych story |

## Pośrednie (nie edytuj — tylko sprawdź spójność)

| Plik | Rola |
| ---- | ---- |
| `MaiaApp/.cursor/skills/implement-abyss-ui/SKILL.md` | Skill konsumenta — linkuje do `AbyssDesign/docs/architecture/abyss-design.md` |
| `AdminWeb/.cursor/skills/implement-abyss-ui/SKILL.md` | Jak wyżej |
| `MaiaApp/docs/architecture/abyss-design.md` | Wskaźnik do kanonu w AbyssDesign |
| `README.md` (AbyssDesign) | Link do standardu — rzadko wymaga aktualizacji |

## Hierarchia przy konflikcie

1. **Implementacja komponentu** (`.vue`, props) — źródło prawdy dla zachowania API
2. **`abyss-design.md`** — źródło prawdy dla reguł użycia i kompozycji
3. **Stories** — źródło prawdy dla dokumentacji API w Storybooku
4. **`AbyssDesign.mdx`** — skrót orientacyjny; nie może sprzeczać się z (1) i (2)

## Słowa kluczowe do przeszukiwania (Krok 5)

Przy każdej regule wyszukaj w repo AbyssDesign:

- nazwę komponentu (`AbyssTable`, `AbyssGrid`, …)
- nazwę propu (`as-card`, `expandable`, `gradient-colors`, …)
- frazy Do/Don't powiązane z tematem (np. `flat`, `AbyssInfo`, `Notify`)

Przeszukaj też `AbyssDesign.mdx` i `.cursor/rules/storybook.mdc` pod tymi samymi terminami.
