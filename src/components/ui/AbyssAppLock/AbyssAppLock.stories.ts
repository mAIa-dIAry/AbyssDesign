import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssTemplateLogin from '@/components/templates/AbyssTemplateLogin/AbyssTemplateLogin.vue';
import AbyssTemplateRoot from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';
import AbyssAppLock from '@/components/ui/AbyssAppLock/AbyssAppLock.vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssDialog from '@/components/ui/AbyssDialog/AbyssDialog.vue';
import { withAbyssBackgroundDialogScope } from '@/stories/StoryDialogScopeDecorator';

const meta = {
  title: 'UI/AbyssAppLock',
  component: AbyssAppLock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Panel odblokowania aplikacji z klawiaturą numeryczną do wprowadzania kodu PIN. Pełnoekranowe odblokowanie osadzaj w `AbyssCard` wewnątrz `AbyssTemplateLogin` (slot `#content` Root, bez nawigacji). Klawiatura wypełnia szerokość treści karty; kropki PIN są wyśrodkowane ze stałym `gap`. Ustawianie lub zmiana PIN — w `AbyssDialog` z `abyss-dialog--compact`.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Komunikat nad polem PIN.',
      table: { defaultValue: { summary: "''" } },
    },
    errorMessage: {
      control: 'text',
      description: 'Komunikat błędu po nieudanym odblokowaniu.',
      table: { defaultValue: { summary: "''" } },
    },
    showBiometricUnlock: {
      control: 'boolean',
      description: 'Czy pokazać przycisk odblokowania biometrycznego.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
} satisfies Meta<typeof AbyssAppLock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Odblokowanie PIN',
  args: {
    message: 'Wprowadź kod PIN, aby kontynuować.',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Pełnoekranowe odblokowanie: `AbyssAppLock` w `AbyssCard` w `AbyssTemplateLogin`, w `#content` Root bez nawigacji.',
      },
      source: {
        code: `<AbyssTemplateRoot device="web">
  <template #content>
    <AbyssTemplateLogin device="web">
      <AbyssCard title="Aplikacja zablokowana">
        <template #header-prepend>
          <q-icon name="sym_r_shield_lock" size="20px" />
        </template>
        <template #content>
          <AbyssAppLock
            message="Wprowadź kod PIN, aby kontynuować."
            @complete="handlePinComplete"
          />
        </template>
      </AbyssCard>
    </AbyssTemplateLogin>
  </template>
</AbyssTemplateRoot>`,
      },
    },
  },
  render: (args) => ({
    components: {
      AbyssAppLock,
      AbyssTemplateLogin,
      AbyssTemplateRoot,
      AbyssBackground,
      AbyssCard,
    },
    setup() {
      const lastPin = ref('');

      function handleComplete(pin: string) {
        lastPin.value = pin;
      }

      return { args, lastPin, handleComplete };
    },
    template: `
      <AbyssTemplateRoot
        device="web"
        overlay-id="abyss-template-overlay-app-lock"
        style="height: 100vh;"
      >
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #content>
          <AbyssTemplateLogin device="web">
            <AbyssCard title="Aplikacja zablokowana">
              <template #header-prepend>
                <q-icon name="sym_r_shield_lock" size="20px" />
              </template>
              <template #content>
                <AbyssAppLock v-bind="args" @complete="handleComplete" />
              </template>
            </AbyssCard>
          </AbyssTemplateLogin>
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const keypad = canvas.getByRole('group', { name: 'Klawiatura numeryczna' });
    await expect(keypad).toBeVisible();

    const digitOne = canvas
      .getAllByRole('button')
      .find((button) => button.textContent === '1');

    await expect(digitOne).toBeVisible();
    await userEvent.click(digitOne!);
  },
};

export const PinSetup: Story = {
  name: 'Ustawianie PIN (dialog)',
  args: {
    message: 'Wprowadź nowy kod PIN.',
  },
  decorators: [withAbyssBackgroundDialogScope],
  parameters: {
    docs: {
      description: {
        story:
          'Ustawianie lub zmiana PIN w ustawieniach: `AbyssAppLock` w `AbyssDialog` z `abyss-dialog--compact`. Nie używaj dialogu do pełnoekranowego odblokowania aplikacji.',
      },
      source: {
        code: `<AbyssDialog
  v-model="isOpen"
  title="Ustaw PIN"
  icon="sym_r_pin"
  class="abyss-dialog--compact"
  close-button
>
  <AbyssAppLock
    message="Wprowadź nowy kod PIN."
    @complete="handlePinSetup"
  />
</AbyssDialog>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssAppLock, AbyssDialog },
    setup() {
      const lastPin = ref('');
      const isOpen = ref(true);

      function handleComplete(pin: string) {
        lastPin.value = pin;
      }

      return { args, lastPin, isOpen, handleComplete };
    },
    template: `
      <AbyssDialog
        v-model="isOpen"
        title="Ustaw PIN"
        icon="sym_r_pin"
        class="abyss-dialog--compact"
        persistent
      >
        <AbyssAppLock v-bind="args" @complete="handleComplete" />
      </AbyssDialog>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('group', { name: 'Klawiatura numeryczna' }),
    ).toBeVisible();
  },
};
