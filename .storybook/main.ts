import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // DODAJ

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/vue3-vite',
  viteFinal(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    if (
      typeof config.resolve.alias === 'object' &&
      !Array.isArray(config.resolve.alias)
    ) {
      (config.resolve.alias as Record<string, string>)['@'] = path.resolve(
        process.cwd(),
        'src',
      );
      (config.resolve.alias as Record<string, string>)['src'] = path.resolve(
        process.cwd(),
        'src',
      );
      (config.resolve.alias as Record<string, string>)['.storybook'] =
        path.resolve(process.cwd(), '.storybook');
    }

    config.css ??= {};
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.scss = {
      loadPaths: [path.resolve(process.cwd(), 'src/scss')],
      additionalData: `
        @use "helpers/variables.scss" as *;
        @use "helpers/mixins.scss" as *;
        @use "helpers/functions.scss" as *;
      `,
    };

    config.plugins = config.plugins || [];
    config.plugins.push(vue());

    return config;
  },
};
export default config;
