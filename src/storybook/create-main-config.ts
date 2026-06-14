import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/vue3-vite';
import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const abyssDesignRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const PEER_DEPENDENCY_PACKAGES = [
  '@quasar/extras',
  '@fontsource/roboto-mono',
  'quasar',
] as const;

function resolvePeerDependencyRoot(
  appRoot: string,
  packageName: string,
): string | undefined {
  try {
    const require = createRequire(path.join(appRoot, 'package.json'));
    return path.dirname(require.resolve(`${packageName}/package.json`));
  } catch {
    return undefined;
  }
}

function resolvePeerDependencyAliases(
  appRoot: string,
): Record<string, string> {
  return Object.fromEntries(
    PEER_DEPENDENCY_PACKAGES.flatMap((packageName) => {
      const root = resolvePeerDependencyRoot(appRoot, packageName);
      return root ? [[packageName, root]] : [];
    }),
  );
}

function configureAbyssDesignVite(config: UserConfig, storybookDir: string): void {
  const appRoot = path.resolve(storybookDir, '..');

  config.server ??= {};
  config.server.fs ??= {};
  config.server.fs.allow = [
    ...(config.server.fs.allow ?? []),
    appRoot,
    abyssDesignRoot,
  ];
}

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
      const appRoot = path.resolve(storybookDir, '..');

      configureAbyssDesignVite(config, storybookDir);

      config.resolve ??= {};
      config.resolve.alias = {
        ...(typeof config.resolve.alias === 'object' &&
        !Array.isArray(config.resolve.alias)
          ? config.resolve.alias
          : {}),
        ...resolvePeerDependencyAliases(appRoot),
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
