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
    description: 'Błękit → granat — komunikaty informacyjne.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.info],
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Żółty → pomarańczowy — ostrzeżenia i stany wymagające uwagi.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.warning],
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Limonka → turkus — potwierdzenia i pozytywne wyniki.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.success],
  },
  {
    key: 'danger',
    label: 'Danger',
    description: 'Ciemny pomarańcz → czerwień — błędy i destrukcyjne akcje.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.danger],
  },
  {
    key: 'hint',
    label: 'Hint',
    description: 'Róż → purpura — podpowiedzi i stany pomocnicze.',
    colors: [...SEMANTIC_GRADIENT_COLOR_MAP.hint],
  },
  {
    key: 'theme',
    label: 'Theme',
    description: 'Domyślny gradient motywu aplikacji.',
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
