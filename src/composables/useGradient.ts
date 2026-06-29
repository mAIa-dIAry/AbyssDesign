import {
  type ComputedRef,
  type DeepReadonly,
  type Ref,
  computed,
  readonly,
  ref,
} from 'vue';
import { DEFAULT_GRADIENT_COLORS } from '@/defines/gradient-colors';
import { type CssColor, isCssColor } from '@/types/color';

export { DEFAULT_GRADIENT_COLORS } from '@/defines/gradient-colors';

/** Kierunek gradientu */
export type GradientDirection =
  | 'to right'
  | 'to left'
  | 'to bottom'
  | 'to top'
  | `${number}deg`;

export interface GradientState {
  /** Aktualnie ustawione kolory */
  colors: readonly CssColor[];
  /** Wygenerowany string CSS gradientu */
  gradientCss: string;
}

export interface UseGradientReturn {
  /** Reaktywne kolory gradientu (readonly) */
  colors: DeepReadonly<Ref<CssColor[]>>;
  /** Wygenerowany string CSS gradientu */
  gradientCss: ComputedRef<string>;
  /** Obiekt stylu gotowy do bindowania przez :style */
  gradientStyle: ComputedRef<{ background: string }>;
  /** Aktualny stan snapshotu (użyteczny w testach i Storybook) */
  snapshot: ComputedRef<GradientState>;
  /** Ustawia nowe kolory gradientu z walidacją */
  setColors: (newColors: string[]) => void;
}

/**
 * Composable zarządzający stanem gradientu tła.
 *
 * @param initialColors - Początkowe kolory (muszą być poprawnymi kolorami CSS)
 * @param direction - Kierunek gradientu (domyślnie 135deg)
 *
 * @example
 * ```ts
 * const { gradientStyle, setColors } = useGradient(['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']);
 * ```
 */
export function useGradient(
  initialColors: string[] = DEFAULT_GRADIENT_COLORS,
  direction: GradientDirection = '135deg',
): UseGradientReturn {
  const validatedInitial = initialColors.map((c) => {
    if (!isCssColor(c)) {
      throw new Error(`useGradient: invalid CSS color "${c}"`);
    }
    return c;
  });

  const colors = ref<CssColor[]>(validatedInitial);

  const gradientCss = computed<string>(
    () => `linear-gradient(${direction}, ${colors.value.join(', ')})`,
  );

  const gradientStyle = computed(() => ({
    background: gradientCss.value,
  }));

  const snapshot = computed<GradientState>(() => ({
    colors: [...colors.value],
    gradientCss: gradientCss.value,
  }));

  function setColors(newColors: string[]): void {
    if (newColors.length < 2) {
      throw new Error('useGradient: gradient wymaga co najmniej 2 kolorów');
    }
    colors.value = newColors.map((c) => {
      if (!isCssColor(c)) {
        throw new Error(`useGradient: invalid CSS color "${c}"`);
      }
      return c;
    });
  }

  return {
    colors: readonly(colors),
    gradientCss,
    gradientStyle,
    snapshot,
    setColors,
  };
}
