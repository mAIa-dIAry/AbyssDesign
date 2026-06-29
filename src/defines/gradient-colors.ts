import { type CssColor } from '@/types/color';

/** Para kolorów CSS tworząca gradient liniowy. */
export type GradientColorPair = readonly [CssColor, CssColor];

/** Domyślny gradient motywu aplikacji (store / theme). */
export const THEME_GRADIENT_COLORS: GradientColorPair = [
  'hsl(5, 100%, 78%)' as CssColor,
  'hsl(205, 80%, 44%)' as CssColor,
];

/** Domyślne kolory gradientu — alias {@link THEME_GRADIENT_COLORS}. */
export const DEFAULT_GRADIENT_COLORS: CssColor[] = [...THEME_GRADIENT_COLORS];

export const INFO_GRADIENT_COLORS: GradientColorPair = [
  'hsl(195, 88%, 68%)' as CssColor,
  'hsl(257, 83.90%, 61.00%)' as CssColor,
];

export const WARNING_GRADIENT_COLORS: GradientColorPair = [
  'hsl(52, 100%, 62%)' as CssColor,
  'hsl(21, 100%, 42.00%)' as CssColor,
];

export const SUCCESS_GRADIENT_COLORS: GradientColorPair = [
  'hsl(82, 89.70%, 58.00%)' as CssColor,
  'hsl(159, 78.20%, 34.10%)' as CssColor,
];

export const DANGER_GRADIENT_COLORS: GradientColorPair = [
  'hsl(18, 90%, 54%)' as CssColor,
  'hsl(340, 84%, 38%)' as CssColor,
];

export const HINT_GRADIENT_COLORS: GradientColorPair = [
  'hsl(291, 87.40%, 72.00%)' as CssColor,
  'hsl(257, 70.20%, 51.40%)' as CssColor,
];

export type SemanticGradientColorKey =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'hint'
  | 'theme';

/** Mapa kolorów semantycznych gradientów — jedno źródło prawdy dla wartości HSL. */
export const SEMANTIC_GRADIENT_COLOR_MAP: Record<
  SemanticGradientColorKey,
  GradientColorPair
> = {
  info: INFO_GRADIENT_COLORS,
  warning: WARNING_GRADIENT_COLORS,
  success: SUCCESS_GRADIENT_COLORS,
  danger: DANGER_GRADIENT_COLORS,
  hint: HINT_GRADIENT_COLORS,
  theme: THEME_GRADIENT_COLORS,
};
