export type AbyssCodeColorTheme = 'one-dark' | 'github-dark' | 'monokai';

export type AbyssCodeToken =
  | 'objectKey'
  | 'arrayIndex'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'punctuation';

export interface AbyssCodeThemeTokens {
  objectKey: string;
  arrayIndex: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  punctuation: string;
  background: string;
}

export const DEFAULT_ABYSS_CODE_COLOR_THEME: AbyssCodeColorTheme = 'one-dark';

/** Palety inspirowane popularnymi motywami edytorów (One Dark Pro, GitHub Dark, Monokai). */
export const ABYSS_CODE_THEMES: Record<
  AbyssCodeColorTheme,
  AbyssCodeThemeTokens
> = {
  'one-dark': {
    objectKey: '#ffffff',
    arrayIndex: '#e5c07b',
    string: '#98c379',
    number: '#61afef',
    boolean: '#c678dd',
    null: '#5c6370',
    punctuation: '#abb2bf',
    background: '#222222',
  },
  'github-dark': {
    objectKey: '#79c0ff',
    arrayIndex: '#ffa657',
    string: '#a5d6ff',
    number: '#79c0ff',
    boolean: '#ff7b72',
    null: '#8b949e',
    punctuation: '#c9d1d9',
    background: '#0d1117',
  },
  monokai: {
    objectKey: '#f8f8f2',
    arrayIndex: '#fd971f',
    string: '#e6db74',
    number: '#ae81ff',
    boolean: '#ae81ff',
    null: '#75715e',
    punctuation: '#f8f8f2',
    background: '#272822',
  },
};

export function resolveAbyssCodeThemeTokens(
  theme: AbyssCodeColorTheme,
): AbyssCodeThemeTokens {
  return ABYSS_CODE_THEMES[theme] ?? ABYSS_CODE_THEMES[DEFAULT_ABYSS_CODE_COLOR_THEME];
}

export function abyssCodeThemeStyle(
  theme: AbyssCodeColorTheme,
): Record<string, string> {
  const tokens = resolveAbyssCodeThemeTokens(theme);

  return {
    '--abyss-code-bg': tokens.background,
    '--abyss-code-object-key': tokens.objectKey,
    '--abyss-code-array-index': tokens.arrayIndex,
    '--abyss-code-string': tokens.string,
    '--abyss-code-number': tokens.number,
    '--abyss-code-boolean': tokens.boolean,
    '--abyss-code-null': tokens.null,
    '--abyss-code-punctuation': tokens.punctuation,
  };
}
