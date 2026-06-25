import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssAppLock from '@/components/ui/AbyssAppLock/AbyssAppLock.vue';
import AbyssDialog from '@/components/ui/AbyssDialog/AbyssDialog.vue';
import { withAbyssBackgroundDialogScope } from '@/stories/StoryDialogScopeDecorator';

const meta = {
  title: 'UI/AbyssAppLock',
  component: AbyssAppLock,
  tags: ['autodocs'],
  decorators: [withAbyssBackgroundDialogScope],
  parameters: {
    docs: {
      description: {
        component:
          'Panel odblokowania aplikacji z klawiaturą numeryczną do wprowadzania kodu PIN.',
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
        title="Aplikacja zablokowana"
        icon="sym_r_shield_lock"
        class="abyss-dialog--compact"
        persistent
      >
        <AbyssAppLock v-bind="args" @complete="handleComplete" />
        <p v-if="lastPin">Wprowadzono: {{ lastPin }}</p>
      </AbyssDialog>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy widok odblokowania z klawiaturą numeryczną.',
      },
      source: {
        code: `<AbyssAppLock
  message="Wprowadź kod PIN, aby kontynuować."
  @complete="handlePinComplete"
/>`,
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const keypad = canvas.getByRole('group', { name: 'Klawiatura numeryczna' });
    await expect(keypad).toBeVisible();

    const buttons = canvas.getAllByRole('button');
    const digitOne = buttons.find((button) => button.textContent === '1');

    await expect(digitOne).toBeVisible();
    await userEvent.click(digitOne!);
  },
};
