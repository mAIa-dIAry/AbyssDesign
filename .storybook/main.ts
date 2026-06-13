import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createStorybookMainConfig,
  STORYBOOK_ADDONS_WITH_VITEST,
} from '@maia/abyss-design/storybook/create-main-config';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const appSrc = path.resolve(storybookDir, '../src');

export default createStorybookMainConfig({
  storybookDir,
  appSrc,
  aliasMap: {
    '@': appSrc,
    src: appSrc,
  },
  scss: {
    additionalData: `
      @use "helpers/variables.scss" as *;
      @use "helpers/mixins.scss" as *;
      @use "helpers/functions.scss" as *;
    `,
    loadPaths: [path.join(appSrc, 'scss')],
  },
  addons: STORYBOOK_ADDONS_WITH_VITEST,
});
