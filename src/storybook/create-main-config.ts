import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';

export const DEFAULT_STORYBOOK_ADDONS = [
  '@chromatic-com/storybook',
  '@storybook/addon-a11y',
  '@storybook/addon-docs',
] as const;

export const STORYBOOK_ADDONS_WITH_VITEST = [
  ...DEFAULT_STORYBOOK_ADDONS,
  '@storybook/addon-vitest',
] as const;

export interface CreateStorybookMainConfigOptions {
  storybookDir: string;
  appSrc: string;
  aliasMap: Record<string, string>;
  scss: {
    additionalData: string;
    loadPaths?: string[];
  };
  addons?: readonly string[];
}

export function createStorybookMainConfig(
  options: CreateStorybookMainConfigOptions,
): StorybookConfig {
  const {
    storybookDir,
    appSrc,
    aliasMap,
    scss,
    addons = DEFAULT_STORYBOOK_ADDONS,
  } = options;

  return {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [...addons],
    framework: '@storybook/vue3-vite',
    viteFinal(config) {
      config.resolve ??= {};
      config.resolve.alias = {
        ...(typeof config.resolve.alias === 'object' &&
        !Array.isArray(config.resolve.alias)
          ? config.resolve.alias
          : {}),
        ...aliasMap,
        src: appSrc,
        '.storybook': storybookDir,
      };

      config.css ??= {};
      config.css.preprocessorOptions ??= {};
      config.css.preprocessorOptions.scss = {
        ...(scss.loadPaths ? { loadPaths: scss.loadPaths } : {}),
        additionalData: scss.additionalData,
      };

      config.plugins = config.plugins || [];
      config.plugins.push(vue());

      return config;
    },
  };
}
