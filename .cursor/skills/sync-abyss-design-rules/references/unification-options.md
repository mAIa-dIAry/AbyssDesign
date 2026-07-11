# Szablon opcji zunifikowania

Gdy nowa lub zaktualizowana reguła koliduje z inną częścią dokumentacji, przedstaw użytkownikowi poniższy format. **Nie wybieraj opcji bez zgody użytkownika.**

---

## Konflikt: [krótki tytuł]

**Reguła z bieżącej zmiany:**
> [Sformułowanie reguły wynikającej z implementacji]

**Sprzeczne miejsca:**

| Plik / sekcja | Obecna treść | Problem |
| ------------- | ------------ | ------- |
| `docs/architecture/abyss-design.md` → [sekcja] | [cytat lub streszczenie] | [w czym sprzeczność] |
| `src/stories/AbyssDesign.mdx` → [sekcja] | … | … |

### Opcja A — [nazwa, np. „Implementacja jako kanon”]

- **Kanoniczne źródło:** implementacja + `abyss-design.md`
- **Zmiany:** zaktualizować MDX i/lub stories; usunąć starą regułę z [plik]
- **Plusy:** …
- **Minusy:** …

### Opcja B — [nazwa, np. „Przywrócić starą regułę w kodzie”]

- **Kanoniczne źródło:** dotychczasowa dokumentacja
- **Zmiany:** cofnąć lub dostosować implementację; docs bez zmian
- **Plusy:** …
- **Minusy:** …

### Opcja C — [nazwa, np. „Reguła kontekstowa”]

- **Kanoniczne źródło:** obie wersje jako wyjątki kontekstowe (np. formularz vs komponent złożony)
- **Zmiany:** doprecyzować tabelę kontekstów w `abyss-design.md`; zsynchronizować MDX
- **Plusy:** …
- **Minusy:** …

**Rekomendacja agenta (opcjonalnie):** [A/B/C] — [jedno zdanie uzasadnienia, bez wymuszania decyzji]

---

## Po decyzji użytkownika

1. Wprowadź zmiany we **wszystkich** plikach wymienionych w tabeli konfliktu.
2. Ponownie uruchom Krok 5 (kontrola spójności).
3. W podsumowaniu wypisz, którą opcję wybrano i co zostało zunifikowane.
