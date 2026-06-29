import {
  DEFAULT_GRADIENT_COLORS,
  SEMANTIC_GRADIENT_COLOR_MAP,
  type SemanticGradientColorKey,
} from '@/defines/gradient-colors';
import { type CssColor } from '@/types/color';

export type SemanticGradientKey = SemanticGradientColorKey;

export interface SemanticGradient {
  key: SemanticGradientKey;
  label: string;
  description: string;
  colors: [CssColor, CssColor];
}

/** Stałe gradienty semantyczne używane w UI (przyciski, akcenty, dokumentacja). */
export const SEMANTIC_GRADIENTS: SemanticGradient[] = [
  {
    key: 'info',
    label: 'Info',
    description:
      'Zapis i edycja — kontekstowa akcja operacyjna w dialogu lub formularzu.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.info],
  },
  {
    key: 'warning',
    label: 'Warning',
    description:
      'Akcje wymagające uwagi (np. zmiana hasła). Ma priorytet nad info przy zapisie lub potwierdzeniu czegoś istotnego.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.warning],
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Akceptacja i potwierdzenie — kontekstowa akcja operacyjna.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.success],
  },
  {
    key: 'danger',
    label: 'Danger',
    description:
      'Operacje nieodwracalne (np. usunięcie danych) — kontekstowa akcja operacyjna.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.danger],
  },
  {
    key: 'hint',
    label: 'Hint',
    description:
      'Akcje informacyjne lub prowadzące do pobocznego procesu.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.hint],
  },
  {
    key: 'theme',
    label: 'Theme',
    description:
      'Najistotniejsze funkcje globalne aplikacji (np. dodanie notatki, aktualizacja subskrypcji). Nie jest to domyślna pierwsza akcja w bloku.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.theme],
  },
];

export function findSemanticGradient(
  key: SemanticGradientKey,
): SemanticGradient | undefined {
  return SEMANTIC_GRADIENTS.find((gradient) => gradient.key === key);
}

const SEMANTIC_GRADIENT_KEY_SET = new Set<string>(
  SEMANTIC_GRADIENTS.map((gradient) => gradient.key),
);

export function isSemanticGradientKey(
  value: string,
): value is SemanticGradientKey {
  return SEMANTIC_GRADIENT_KEY_SET.has(value);
}

/** Tablica kolorów CSS albo nazwa semantycznego gradientu (np. `info`, `danger`). */
export type GradientColorsInput = string[] | SemanticGradientKey;

/**
 * Rozwiązuje `gradientColors` / `colors` do tablicy kolorów CSS.
 * Akceptuje tablicę kolorów lub klucz z {@link SEMANTIC_GRADIENTS}.
 */
export function resolveGradientColors(
  input?: GradientColorsInput,
): CssColor[] {
  if (input === undefined) {
    return [...DEFAULT_GRADIENT_COLORS];
  }

  if (typeof input === 'string') {
    const colors = SEMANTIC_GRADIENT_COLOR_MAP[input];

    if (!colors) {
      throw new Error(
        `resolveGradientColors: unknown semantic gradient "${input}"`,
      );
    }

    return [...colors];
  }

  return input as CssColor[];
}
