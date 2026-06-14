import type { Preview } from '@storybook/vue3-vite';

import 'quasar/dist/quasar.css';
import '@maia/abyss-design/styles/fonts';
import '@maia/abyss-design/styles/icons';

import { setup } from '@storybook/vue3-vite';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import * as QuasarComponents from 'quasar';
import { createI18n, type I18nOptions } from 'vue-i18n';

export interface CreateStorybookPreviewOptions {
  i18nMessages: I18nOptions['messages'];
  locale?: string;
  usePinia?: boolean;
}

export function createStorybookPreview(
  options: CreateStorybookPreviewOptions,
): Preview {
  const i18n = createI18n({
    locale: options.locale ?? 'pl-PL',
    legacy: false,
    messages: options.i18nMessages,
  });

  setup((app) => {
    app.use(Quasar, {
      components: QuasarComponents,
    });
    app.use(i18n);

    if (options.usePinia) {
      app.use(createPinia());
    }
  });

  return {
    parameters: {
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
    },
  };
}
