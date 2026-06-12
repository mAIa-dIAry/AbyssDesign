import type { Preview } from '@storybook/vue3-vite';

import 'quasar/dist/quasar.css';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/600.css';
import '@fontsource/roboto-mono/700.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import './preview.scss';

import { setup } from '@storybook/vue3-vite';
import { Quasar } from 'quasar';
import * as QuasarComponents from 'quasar';
import { createI18n } from 'vue-i18n';

import { abyssI18nMessages } from '../src/i18n';

const i18n = createI18n({
  locale: 'pl-PL',
  legacy: false,
  messages: abyssI18nMessages,
});

setup((app) => {
  app.use(Quasar, {
    components: QuasarComponents,
  });
  app.use(i18n);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
