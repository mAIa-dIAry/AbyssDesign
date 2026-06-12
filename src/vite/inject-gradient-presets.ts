import type { Plugin } from 'vite';

import {
  DEFAULT_GRADIENT_PRESET,
  GRADIENT_PRESETS,
} from '../defines/gradient-presets';

const GRADIENT_ANGLE = '135deg';

const PLACEHOLDER_PRESETS = '__PRELOADER_GRADIENT_PRESETS__';
const PLACEHOLDER_DEFAULT_GRADIENT = '__PRELOADER_DEFAULT_GRADIENT__';
const PLACEHOLDER_DEFAULT_GRADIENT_TAIL = '__PRELOADER_DEFAULT_GRADIENT_TAIL__';

function colorsToGradient(colors: readonly string[]): string {
  return `linear-gradient(${GRADIENT_ANGLE}, ${colors.join(', ')})`;
}

function toPreloaderPresetsMap(): Record<string, readonly [string, string]> {
  return Object.fromEntries(
    GRADIENT_PRESETS.map((preset) => [preset.label, preset.colors]),
  );
}

function buildReplacements(): Record<string, string> {
  const defaultColors = DEFAULT_GRADIENT_PRESET.colors;
  const defaultTailColor = defaultColors[defaultColors.length - 1] ?? '';

  return {
    [PLACEHOLDER_PRESETS]: JSON.stringify(toPreloaderPresetsMap()),
    [PLACEHOLDER_DEFAULT_GRADIENT]: colorsToGradient(defaultColors),
    [PLACEHOLDER_DEFAULT_GRADIENT_TAIL]: defaultTailColor,
  };
}

/** Wstrzykuje presety gradientu z `gradient-presets.ts` do `index.html` przy buildzie i w dev. */
export function injectGradientPresetsPlugin(): Plugin {
  const replacements = buildReplacements();

  return {
    name: 'maia-inject-gradient-presets',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html;

        for (const [placeholder, value] of Object.entries(replacements)) {
          result = result.replaceAll(placeholder, value);
        }

        return result;
      },
    },
  };
}
