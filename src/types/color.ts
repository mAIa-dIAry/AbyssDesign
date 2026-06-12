/**
 * Branded type reprezentujący walidowany kolor CSS.
 * Zapewnia, że wartość przeszła walidację przed użyciem.
 */
export type CssColor = string & { readonly __brand: 'CssColor' };

/**
 * Wyrażenie regularne dopasowujące obsługiwane formaty kolorów CSS:
 * - hex: #rgb, #rrggbb, #rrggbbaa
 * - rgb / rgba
 * - hsl / hsla
 * - named colors (np. "red", "transparent")
 */
const CSS_COLOR_REGEX =
  /^(#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgb\(.+\)|rgba\(.+\)|hsl\(.+\)|hsla\(.+\)|[a-zA-Z]+)$/;

/**
 * Sprawdza, czy podana wartość jest poprawnym kolorem CSS.
 */
export function isCssColor(value: string): value is CssColor {
  return CSS_COLOR_REGEX.test(value.trim());
}

/**
 * Konwertuje ciąg znaków do typu CssColor po walidacji.
 * @throws {Error} gdy wartość nie jest poprawnym kolorem CSS
 */
export function toCssColor(value: string): CssColor {
  if (!isCssColor(value)) {
    throw new Error(`Invalid CSS color: "${value}"`);
  }
  return value;
}

/**
 * Konwertuje tablicę ciągów znaków do tablicy CssColor po walidacji.
 * @throws {Error} gdy którakolwiek wartość nie jest poprawnym kolorem CSS
 */
export function toCssColors(values: string[]): CssColor[] {
  return values.map(toCssColor);
}

export interface GradientPreset {
  label: string;
  colors: [CssColor, CssColor];
}
