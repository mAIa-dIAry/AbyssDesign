import type { Meta, StoryObj } from '@storybook/vue3';
import { reactive, ref } from 'vue';
import { expect, fn } from 'storybook/test';
import AbyssTemplateLogin from '@/components/templates/AbyssTemplateLogin/AbyssTemplateLogin.vue';
import { ABYSS_TEMPLATE_LOGIN_MAX_WIDTH } from '@/components/templates/AbyssTemplateLogin/AbyssTemplateLogin.constants';
import AbyssTemplateRoot from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssForm from '@/components/ui/AbyssForm/AbyssForm.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import {
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';

interface AuthFormModel {
  email: string;
  password: string;
}

const loginSource = `<AbyssTemplateRoot device="web">
  <template #background>
    <AbyssBackground style="position: absolute; inset: 0;" />
  </template>
  <template #content>
    <AbyssTemplateLogin device="web">
      <AbyssCard title="Logowanie">
        <template #header-prepend>
          <q-icon name="sym_r_login" size="20px" />
        </template>
        <template #content>
          <AbyssForm v-model="form" :sync="false" @submit-form="handleLogin">
            <AbyssInput v-model="form.email" type="email" label="E-mail" autocomplete="email" />
            <AbyssInput
              v-model="form.password"
              type="password"
              label="Hasło"
              autocomplete="current-password"
            />
            <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
              <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
            </AbyssGrid>
          </AbyssForm>
        </template>
      </AbyssCard>
    </AbyssTemplateLogin>
  </template>
</AbyssTemplateRoot>`;

const meta: Meta<typeof AbyssTemplateLogin> = {
  title: 'Templates/AbyssTemplateLogin',
  component: AbyssTemplateLogin,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Szablon strony logowania z wyśrodkowanym kontenerem o stałej `max-width` (`ABYSS_TEMPLATE_LOGIN_MAX_WIDTH` = ' +
          ABYSS_TEMPLATE_LOGIN_MAX_WIDTH +
          '). **Wymaga `AbyssCard`** w slocie domyślnym (tytuł + ikona w `#header-prepend`). Treść karty: `AbyssForm` (login / rejestracja) albo `AbyssAppLock` (odblokowanie PIN) — to dwie osobne potrzeby, nie warianty do wyboru na ten sam ekran. W aplikacji montuj ten szablon na trasie (layout ma `router-view` w `#content` Root), zwykle **bez nawigacji**; lock PIN może zastąpić `router-view` w layoucie. Viewport przewija treść i centruje kontener w pionie, gdy jest niższy niż obszar; przy dłuższym formularzu pozwala przewinąć od góry. Padding per `device` (desktop/web `24px`, mobile `8px` + safe-area). Nie owijaj w `AbyssTemplateMain`. Nie używaj `AbyssTemplateMain` jako pełnoekranowego auth (AdminWeb `LoginPage` jest długiem). Login nad działającą aplikacją to `AbyssDialog`.',
      },
    },
  },
  argTypes: {
    device: {
      control: 'select',
      options: ['desktop', 'web', 'mobile'],
      description:
        'Wariant paddingu viewportu — desktop/web `24px`, mobile `8px` oraz `env(safe-area-inset-*)`.',
      table: {
        type: { summary: "'desktop' | 'web' | 'mobile'" },
      },
    },
    class: {
      control: 'text',
      description:
        'Dodatkowa klasa na root. Dozwolone przy budowie komponentów złożonych; niedozwolone w wzorcach formularzy i standardowych kart.',
      table: {
        type: { summary: 'string | object | array' },
        defaultValue: { summary: "''" },
      },
    },
    style: {
      control: 'object',
      description:
        'Inline style na root. Dozwolone przy budowie komponentów złożonych; niedozwolone w wzorcach formularzy i standardowych kart.',
      table: {
        type: { summary: 'string | object' },
        defaultValue: { summary: "''" },
      },
    },
    default: {
      description:
        'Treść strony — **wymagany `AbyssCard`** (tytuł + ikona w `#header-prepend`). W karcie: `AbyssForm` (login / rejestracja) albo `AbyssAppLock` (PIN). Szerokość ogranicza wewnętrzny kontener — nie ustawiaj własnej `max-width` na slocie.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
  },
  args: {
    device: 'web',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const playLoginSubmit: NonNullable<Story['play']> = async ({
  canvas,
  userEvent,
}) => {
  await userEvent.type(canvas.getByLabelText('E-mail'), 'user@example.com');
  await userEvent.type(canvas.getByLabelText('Hasło'), 'secret');
  await userEvent.click(canvas.getByRole('button', { name: 'Zaloguj się' }));
  await expect(canvas.getByTestId('submitted')).toHaveTextContent(
    'user@example.com',
  );
};

const renderLogin =
  (options: {
    overlayId: string;
    includeAppBar?: boolean;
  }): NonNullable<Story['render']> =>
  (args) => ({
    components: {
      AbyssTemplateLogin,
      AbyssTemplateRoot,
      AbyssBackground,
      AbyssCard,
      AbyssForm,
      AbyssInput,
      AbyssButton,
      AbyssGrid,
    },
    setup() {
      const form = reactive<AuthFormModel>({
        email: '',
        password: '',
      });
      const submitted = ref<AuthFormModel | null>(null);
      const onSubmitForm = fn((values: AuthFormModel) => {
        submitted.value = values;
      });

      return {
        args,
        form,
        submitted,
        onSubmitForm,
        overlayId: options.overlayId,
        includeAppBar: options.includeAppBar === true,
        INPUT_COLUMN_SIZE,
        INPUT_GRID_MAX_COLUMNS,
      };
    },
    template: `
      <AbyssTemplateRoot :device="args.device" :overlay-id="overlayId" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template v-if="includeAppBar" #app-bar-start>
          <span style="font-weight: bold; padding: 0 16px;">Maia</span>
        </template>
        <template v-if="includeAppBar" #app-bar-end>
          <span style="padding: 0 16px;">Użytkownik</span>
        </template>
        <template #content>
          <AbyssTemplateLogin :device="args.device">
            <AbyssCard title="Logowanie">
              <template #header-prepend>
                <q-icon name="sym_r_login" size="20px" />
              </template>
              <template #content>
                <AbyssForm v-model="form" :sync="false" @submit-form="onSubmitForm">
                  <AbyssInput
                    v-model="form.email"
                    type="email"
                    label="E-mail"
                    autocomplete="email"
                  />
                  <AbyssInput
                    v-model="form.password"
                    type="password"
                    label="Hasło"
                    autocomplete="current-password"
                  />
                  <AbyssGrid
                    align="right"
                    :column-size="INPUT_COLUMN_SIZE"
                    :max-columns="INPUT_GRID_MAX_COLUMNS"
                  >
                    <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
                  </AbyssGrid>
                </AbyssForm>
                <pre
                  v-if="submitted"
                  style="margin: 12px 0 0; font-size: 12px; white-space: pre-wrap;"
                  data-testid="submitted"
                >{{ JSON.stringify(submitted, null, 2) }}</pre>
              </template>
            </AbyssCard>
          </AbyssTemplateLogin>
        </template>
      </AbyssTemplateRoot>
    `,
  });

export const Default: Story = {
  name: 'Web',
  args: {
    device: 'web',
  },
  render: renderLogin({ overlayId: 'abyss-template-overlay-login-web' }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout webowy bez nawigacji: karta logowania (`AbyssForm`) w `AbyssTemplateLogin`, w `#content` Root.',
      },
      source: {
        code: loginSource,
      },
    },
  },
  play: playLoginSubmit,
};

export const Desktop: Story = {
  name: 'Desktop',
  args: {
    device: 'desktop',
  },
  render: renderLogin({
    overlayId: 'abyss-template-overlay-login-desktop',
    includeAppBar: true,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout desktopowy (pasek tytułu) bez nawigacji. Formularz logowania zostaje wyśrodkowany w kontenerze o stałej szerokości.',
      },
      source: {
        code: loginSource.replaceAll('device="web"', 'device="desktop"'),
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Zaloguj się' }),
    ).toBeVisible();
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  args: {
    device: 'mobile',
  },
  render: renderLogin({ overlayId: 'abyss-template-overlay-login-mobile' }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout mobilny bez nawigacji. Padding viewportu to `8px` plus safe-area; kontener nadal ma stałą `max-width`.',
      },
      source: {
        code: loginSource.replaceAll('device="web"', 'device="mobile"'),
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Zaloguj się' }),
    ).toBeVisible();
  },
};
