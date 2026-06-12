import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssPinInput from '@/components/ui/AbyssPinInput/AbyssPinInput.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta = {
  title: 'UI/AbyssPinInput',
  component: AbyssPinInput,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Wizualizacja postępu wprowadzania kodu PIN jako wypełnianych kropek.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Aktualnie wprowadzony kod PIN.',
      table: { defaultValue: { summary: "''" } },
    },
    pinLength: {
      control: { type: 'number', min: 4, max: 8, step: 1 },
      description: 'Docelowa długość kodu PIN.',
      table: { defaultValue: { summary: '4' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Komunikat błędu pod kropkami.',
      table: { defaultValue: { summary: "''" } },
    },
    tabindex: {
      control: { type: 'number', min: -1, max: 0, step: 1 },
      description: 'Kolejność fokusu klawiatury dla kontenera kropek.',
      table: { defaultValue: { summary: '0' } },
    },
    disable: {
      control: 'boolean',
      description: 'Wyłącza fokusowanie komponentu.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
} satisfies Meta<typeof AbyssPinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Pusty PIN',
  args: {
    modelValue: '',
    pinLength: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stan początkowy przed wprowadzeniem cyfr.',
      },
      source: {
        code: '<AbyssPinInput v-model="pin" :pin-length="4" />',
      },
    },
  },
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status', { name: 'Wprowadzony kod PIN' });
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute('tabindex', '0');
  },
};

export const PartialEntry: Story = {
  name: 'Częściowo wypełniony',
  args: {
    modelValue: '12',
    pinLength: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dwa z czterech pól PIN zostały wypełnione — trzecia kropka jest aktywna i większa.',
      },
      source: {
        code: '<AbyssPinInput model-value="12" :pin-length="4" />',
      },
    },
  },
  play: async ({ canvas }) => {
    const dots = canvas
      .getByRole('status')
      .querySelectorAll('.abyss-pin-input__dot');
    await expect(dots[2]).toHaveClass('abyss-pin-input__dot--active');
  },
};

export const WithError: Story = {
  name: 'Błąd walidacji',
  render: () => ({
    components: { AbyssPinInput },
    setup() {
      const pin = ref('');

      return { pin };
    },
    template: `
      <AbyssPinInput
        v-model="pin"
        :pin-length="4"
        error-message="Nieprawidłowy kod PIN. Spróbuj ponownie."
      />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Komunikat błędu pod polem PIN.',
      },
      source: {
        code: `<AbyssPinInput
  v-model="pin"
  :pin-length="4"
  error-message="Nieprawidłowy kod PIN. Spróbuj ponownie."
/>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Nieprawidłowy kod PIN');
  },
};
