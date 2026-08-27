import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssNumericKeypad from '@/components/ui/AbyssNumericKeypad/AbyssNumericKeypad.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta = {
  title: 'UI/AbyssNumericKeypad',
  component: AbyssNumericKeypad,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Wewnętrzny prymityw `AbyssAppLock` — klawiatura numeryczna z cyframi 0–9 i przyciskiem cofania. **Nie dobieraj z mapy „Potrzeba → jeden komponent”**; nie używaj poza `AbyssAppLock`. Wypełnia szerokość rodzica (w `AbyssAppLock` — szerokość treści karty / body dialogu).',
      },
    },
  },
  argTypes: {
    disable: {
      control: 'boolean',
      description: 'Wyłącza wszystkie klawisze.',
      table: { defaultValue: { summary: 'false' } },
    },
    canBackspace: {
      control: 'boolean',
      description: 'Czy przycisk cofania jest aktywny.',
      table: { defaultValue: { summary: 'true' } },
    },
    chaos: {
      control: 'boolean',
      description:
        'Losuje początkowy układ klawiszy i dodaje przycisk ponownego losowania.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
} satisfies Meta<typeof AbyssNumericKeypad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślna',
  args: {
    canBackspace: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standardowa klawiatura numeryczna.',
      },
      source: {
        code: `<AbyssNumericKeypad
  @digit="handleDigit"
  @backspace="handleBackspace"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssNumericKeypad },
    setup() {
      return { args };
    },
    template: `
      <div style="width: min(100%, 328px);">
        <AbyssNumericKeypad v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const keypad = canvas.getByRole('group', { name: 'Klawiatura numeryczna' });
    await expect(keypad).toBeVisible();

    const buttons = canvas.getAllByRole('button');
    const digitFive = buttons.find((button) => button.textContent === '5');

    await expect(digitFive).toBeVisible();
    await userEvent.click(digitFive!);
  },
};

export const Chaos: Story = {
  name: 'Tryb chaos',
  render: () => ({
    components: { AbyssNumericKeypad },
    setup() {
      const value = ref('');
      const shuffleCount = ref(0);
      const digitOrder = ref('');

      function captureDigitOrder() {
        digitOrder.value = Array.from(
          document.querySelectorAll(
            '.abyss-numeric-keypad__key .q-btn__content',
          ),
        )
          .map((node) => node.textContent?.trim() ?? '')
          .filter((label) => /^\d$/.test(label))
          .join('');
      }

      function handleDigit(digit: string) {
        value.value = `${value.value}${digit}`;
      }

      function handleBackspace() {
        value.value = value.value.slice(0, -1);
      }

      function handleShuffle() {
        shuffleCount.value += 1;
        captureDigitOrder();
      }

      return {
        value,
        shuffleCount,
        digitOrder,
        handleDigit,
        handleBackspace,
        handleShuffle,
      };
    },
    template: `
      <div style="display:flex;flex-direction:column;width:min(100%, 328px);gap:12px;">
        <AbyssNumericKeypad
          chaos
          :can-backspace="value.length > 0"
          @digit="handleDigit"
          @backspace="handleBackspace"
          @shuffle="handleShuffle"
        />
        <p>Wartość: {{ value || '—' }}</p>
        <p>Przetasowania: {{ shuffleCount }}</p>
        <p v-if="digitOrder">Kolejność cyfr: {{ digitOrder }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Układ cyfr jest losowany przy starcie, a przycisk shuffle ponownie tasuje klawisze.',
      },
      source: {
        code: `<AbyssNumericKeypad
  chaos
  :can-backspace="value.length > 0"
  @digit="handleDigit"
  @backspace="handleBackspace"
/>`,
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');
    const shuffleButton = canvas.getByRole('button', {
      name: 'Losuj układ klawiatury',
    });

    await expect(buttons.length).toBe(12);
    await expect(shuffleButton).toBeVisible();

    const initialDigitOrder = buttons
      .map((button) => button.textContent?.trim() ?? '')
      .filter((label) => /^\d$/.test(label))
      .join('');

    await userEvent.click(shuffleButton);
    await expect(canvas.getByText('Przetasowania: 1')).toBeVisible();
    await expect(canvas.getByText('Wartość: —')).toBeVisible();

    const reshuffledDigitOrder = canvas
      .getAllByRole('button')
      .map((button) => button.textContent?.trim() ?? '')
      .filter((label) => /^\d$/.test(label))
      .join('');

    await expect(reshuffledDigitOrder).not.toBe(initialDigitOrder);
  },
};

export const Interactive: Story = {
  name: 'Wpisywanie cyfr',
  render: () => ({
    components: { AbyssNumericKeypad },
    setup() {
      const value = ref('');

      function handleDigit(digit: string) {
        value.value = `${value.value}${digit}`;
      }

      function handleBackspace() {
        value.value = value.value.slice(0, -1);
      }

      return { value, handleDigit, handleBackspace };
    },
    template: `
      <div style="display:flex;flex-direction:column;width:min(100%, 328px);gap:12px;">
        <AbyssNumericKeypad
          :can-backspace="value.length > 0"
          @digit="handleDigit"
          @backspace="handleBackspace"
        />
        <p>Wartość: {{ value || '—' }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Klawiatura emitująca cyfry i cofanie do rodzica.',
      },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');

function handleDigit(digit: string) {
  value.value = \`\${value.value}\${digit}\`;
}

function handleBackspace() {
  value.value = value.value.slice(0, -1);
}
</script>

<template>
  <AbyssNumericKeypad
    :can-backspace="value.length > 0"
    @digit="handleDigit"
    @backspace="handleBackspace"
  />
</template>`,
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');
    const digitThree = buttons.find((button) => button.textContent === '3');

    await userEvent.click(digitThree!);
    await expect(canvas.getByText('Wartość: 3')).toBeVisible();
  },
};
