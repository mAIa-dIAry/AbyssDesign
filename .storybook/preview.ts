import './preview.scss';

import { createStorybookPreview } from '../src/storybook/create-preview';
import { abyssI18nMessages } from '../src/i18n';

export default createStorybookPreview({
  i18nMessages: abyssI18nMessages,
});
