import { DEFAULT_GRADIENT_COLORS } from '@/composables/useGradient';
import { type CssColor } from '@/types/color';

export type SemanticGradientKey =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'hint'
  | 'theme';

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
    description: 'Błękit → granat — komunikaty informacyjne.',
    colors: ['hsl(195, 88%, 68%)' as CssColor, 'hsl(228, 76%, 32%)' as CssColor],
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Żółty → pomarańczowy — ostrzeżenia i stany wymagające uwagi.',
    colors: ['hsl(52, 100%, 62%)' as CssColor, 'hsl(28, 95%, 48%)' as CssColor],
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Limonka → turkus — potwierdzenia i pozytywne wyniki.',
    colors: ['hsl(88, 90%, 58%)' as CssColor, 'hsl(168, 72%, 38%)' as CssColor],
  },
  {
    key: 'danger',
    label: 'Danger',
    description: 'Ciemny pomarańcz → czerwień — błędy i destrukcyjne akcje.',
    colors: ['hsl(18, 90%, 54%)' as CssColor, 'hsl(340, 84%, 38%)' as CssColor],
  },
  {
    key: 'hint',
    label: 'Hint',
    description: 'Róż → purpura — podpowiedzi i stany pomocnicze.',
    colors: ['hsl(330, 88%, 72%)' as CssColor, 'hsl(285, 80%, 40%)' as CssColor],
  },
  {
    key: 'theme',
    label: 'Theme',
    description: 'Domyślny gradient motywu aplikacji.',
    colors: [
      DEFAULT_GRADIENT_COLORS[0]!,
      DEFAULT_GRADIENT_COLORS[1]!,
    ] as [CssColor, CssColor],
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
    const gradient = findSemanticGradient(input);

    if (!gradient) {
      throw new Error(
        `resolveGradientColors: unknown semantic gradient "${input}"`,
      );
    }

    return [...gradient.colors];
  }

  return input as CssColor[];
}
