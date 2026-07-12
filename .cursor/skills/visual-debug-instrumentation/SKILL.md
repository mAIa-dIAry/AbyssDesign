---
name: visual-debug-instrumentation
description: Dodaje i usuwa tymczasowe ramki outline w stylach SCSS/CSS do debugowania layoutu. Używaj gdy użytkownik prosi o instrumentację wizualną, ramki debug, outline debug, VISUAL DEBUG, sprawdzenie granic elementów lub usunięcie takiej instrumentacji.
argument-hint: '[plik lub selektor] — dodaj lub usuń ramki VISUAL DEBUG'
user-invocable: true
disable-model-invocation: false
---

# Instrumentacja wizualna (VISUAL DEBUG)

Tymczasowe ramki `outline` w stylach — bez wpływu na layout (`outline` nie zajmuje miejsca w box modelu).

## Kiedy używać

- Użytkownik prosi o dodanie/usunięcie instrumentacji wizualnej, ramek debug lub outline debug.
- Debugowanie layoutu, overflow, safe-area, flex/grid — trzeba zobaczyć granice elementów.
- Po zakończeniu debugowania — usuń całą instrumentację przed commitem.

## Stała paleta 8 kolorów

Kolory przypisuj **kolejno** do kolejnych debugowanych elementów (1. element → kolor 1, 2. → kolor 2, … po 8. wracaj do 1.). Nie używaj dwóch różnych kolorów dla tego samego logicznego elementu; rodzeństwo na tym samym poziomie może mieć ten sam kolor.

| # | Kolor | Wartość |
|---|-------|---------|
| 1 | Czerwony | `rgb(255, 0, 0)` |
| 2 | Pomarańczowy | `rgb(255, 140, 0)` |
| 3 | Żółty | `rgb(255, 255, 0)` |
| 4 | Zielony | `rgb(0, 255, 0)` |
| 5 | Cyjan | `rgb(0, 255, 255)` |
| 6 | Niebieski | `rgb(0, 120, 255)` |
| 7 | Magenta | `rgb(255, 0, 255)` |
| 8 | Biały | `rgb(255, 255, 255)` |

Nie zamieniaj kolorów z palety na inne — zestaw jest stały i maksymalnie rozróżnialny wizualnie.

## Głębokość zagnieżdżenia i offset

`outline-offset` maleje o **2 px** na każdy poziom zagnieżdżenia w drzewie DOM (względem najbliższego przodka z instrumentacją lub względem korzenia debugowanego poddrzewa):

| Głębokość | Offset |
|-----------|--------|
| 1 | `-2px` |
| 2 | `-4px` |
| 3 | `-6px` |
| 4 | `-8px` |
| 5 | `-10px` |
| … | `-{głębokość × 2}px` |

Wzór: `outline-offset: -{depth * 2}px`

## Dodawanie instrumentacji

W bloku stylów danego selektora dodaj **dwie kolejne linie** (zachowaj wcięcie kontekstu):

```scss
outline: 1px solid rgb(0, 255, 255) !important; // VISUAL DEBUG
outline-offset: -2px !important; // VISUAL DEBUG
```

Dla głębokości > 1 dopisz głębokość w komentarzu offsetu:

```scss
outline: 1px solid rgb(0, 255, 255) !important; // VISUAL DEBUG
outline-offset: -4px !important; // VISUAL DEBUG — depth 2
```

### Zasady

1. Zawsze `outline: 1px solid … !important` i `outline-offset: … !important`.
2. Kolor z palety (tabela powyżej), format `rgb(r, g, b)` — bez skrótów nazw kolorów (`red`, `cyan` itd.).
3. Komentarz `// VISUAL DEBUG` na obu liniach; przy offset ≠ -2px dodaj `— depth N` w drugiej linii.
4. Nie dodawaj `border` — tylko `outline`.
5. Nie zmieniaj innych właściwości stylu poza tymi dwiema liniami.

### Przykład (wzorzec z AbyssTemplateMain)

```scss
&__safe-top {
  flex-shrink: 0;
  width: 100%;
  height: max(0px, env(safe-area-inset-top, 0px) - var(--abyss-scroll-view-safe-area-mask-size, 12px));
  outline: 1px solid rgb(0, 255, 255) !important; // VISUAL DEBUG
  outline-offset: -2px !important; // VISUAL DEBUG
}
```

Zagnieżdżony element (depth 3):

```scss
&__safe-right {
  flex-shrink: 0;
  outline: 1px solid rgb(0, 255, 255) !important; // VISUAL DEBUG
  outline-offset: -6px !important; // VISUAL DEBUG — depth 3
}
```

## Usuwanie instrumentacji

1. Wyszukaj w zakresie plików/folderu wskazanego przez użytkownika: `VISUAL DEBUG`.
2. Usuń **wszystkie** linie zawierające `// VISUAL DEBUG` (zarówno `outline`, jak i `outline-offset`).
3. Nie zostawiaj osieroconych komentarzy ani pustych linii po usunięciu.
4. Po usunięciu potwierdź brak trafień: `rg "VISUAL DEBUG"` w edytowanym zakresie.

## Procedura agenta

### Dodawanie

1. Ustal plik(i) i selektory do oznaczenia.
2. Oceń głębokość zagnieżdżenia każdego elementu w drzewie DOM.
3. Przypisz kolory z palety (kolejno, bez duplikatów wizualnych na sąsiednich niezwiązanych elementach).
4. Wstaw dwie linie outline na końcu bloku stylów selektora (przed zamknięciem `}`).
5. Podsumuj: które elementy, kolory, głębokości.

### Usuwanie

1. `rg "VISUAL DEBUG"` w podanym zakresie.
2. Usuń wszystkie linie instrumentacji.
3. Zweryfikuj brak pozostałości.

## Przykłady wywołania

- `/visual-debug-instrumentation AbyssTemplateMain.vue — dodaj ramki do safe-area`
- `/visual-debug-instrumentation src/pages/ — usuń VISUAL DEBUG`
- `dodaj instrumentację wizualną do &__scroll-body` → użyj tego skilla
- `usuń ramki debug z tego pliku` → użyj tego skilla
