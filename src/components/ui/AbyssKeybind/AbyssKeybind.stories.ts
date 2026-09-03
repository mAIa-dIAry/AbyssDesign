import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, waitFor } from 'storybook/test';
import AbyssKeybind from '@/components/ui/AbyssKeybind/AbyssKeybind.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssKeybind> = {
  title: 'UI/AbyssKeybind',
  component: AbyssKeybind,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pole do przechwytywania kombinacji klawiszy oparte na q-select. Renderuje kolejne części skrótu jako chipy i pozwala czyścić lub nadpisywać kombinację bez ręcznego wpisywania tekstu.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description:
        'Aktualna kombinacja klawiszy w formacie Electron accelerator.',
      table: { defaultValue: { summary: '""' } },
    },
    label: {
      control: 'text',
      description: 'Etykieta wyświetlana obok pola.',
      table: { defaultValue: { summary: '""' } },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder widoczny, gdy nie ma ustawionej kombinacji. Pusty prop bierze tekst z `ui.keybind.placeholder`.',
      table: { defaultValue: { summary: 'ui.keybind.placeholder' } },
    },
    hint: {
      control: 'text',
      description:
        'Podpowiedź wyświetlana pod polem poza trybem przechwytywania.',
      table: { defaultValue: { summary: '""' } },
    },
    capturingHint: {
      control: 'text',
      description:
        'Podpowiedź wyświetlana, gdy pole ma fokus i czeka na kombinację.',
      table: { defaultValue: { summary: '""' } },
    },
    disable: {
      control: 'boolean',
      description: 'Wyłącza interakcję z polem.',
      table: { defaultValue: { summary: 'false' } },
    },
    readonly: {
      control: 'boolean',
      description: 'Blokuje przechwytywanie, ale pozostawia widok skrótu.',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Włącza stan błędu pola.',
      table: { defaultValue: { summary: 'false' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Komunikat widoczny w stanie błędu.',
      table: { defaultValue: { summary: '""' } },
    },
    loading: {
      control: 'boolean',
      description: 'Pokazuje stan ładowania podczas zapisu skrótu.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Przechwytywanie skrótu',
  parameters: {
    docs: {
      description: {
        story:
          'Po kliknięciu pole przechwytuje kombinację klawiszy i natychmiast renderuje ją jako chipy.',
      },
      source: {
        code: `
<script setup lang="ts">
import { ref } from 'vue';

const shortcut = ref('');
</script>

<template>
  <AbyssKeybind
    v-model="shortcut"
    label="Skrót globalny"
    hint="Kliknij i naciśnij kombinację z co najmniej jednym modyfikatorem."
    capturing-hint="Naciśnij kombinację klawiszy. Escape anuluje przechwytywanie."
  />
</template>`,
      },
    },
  },
  args: {
    modelValue: '',
    label: 'Skrót globalny',
    hint: 'Kliknij i naciśnij kombinację z co najmniej jednym modyfikatorem.',
    capturingHint:
      'Naciśnij kombinację klawiszy. Escape anuluje przechwytywanie.',
  },
  render: (args) => ({
    components: { AbyssKeybind },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AbyssKeybind v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await expect(combobox).toBeVisible();
    await userEvent.click(combobox);
    await waitFor(async () => {
      await expect(combobox).toHaveFocus();
    });
    await userEvent.keyboard('{Control>}{Alt>}n{/Alt}{/Control}');

    await waitFor(async () => {
      await expect(
        canvasElement.querySelectorAll('.abyss-keybind__chip'),
      ).toHaveLength(3);
    });

    const chips = canvasElement.querySelectorAll('.abyss-keybind__chip');
    await expect(chips[0]?.textContent?.trim()).toBe('Ctrl');
    await expect(chips[1]?.textContent?.trim()).toBe('Alt');
    await expect(chips[2]?.textContent?.trim()).toBe('N');
  },
};

export const WithExistingShortcut: Story = {
  name: 'Istniejąca kombinacja',
  parameters: {
    docs: {
      description: {
        story:
          'Komponent potrafi wyrenderować wcześniej zapisany skrót jako serię chipów bez przycisków usuwania.',
      },
      source: {
        code: `<AbyssKeybind model-value="Ctrl+Shift+F12" label="Aktualny skrót" hint="Chipy pokazują kolejne części kombinacji." />`,
      },
    },
  },
  args: {
    modelValue: 'Ctrl+Shift+F12',
    label: 'Aktualny skrót',
    hint: 'Chipy pokazują kolejne części kombinacji.',
  },
  render: (args) => ({
    components: { AbyssKeybind },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AbyssKeybind v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvasElement }) => {
    const chips = canvasElement.querySelectorAll('.abyss-keybind__chip');
    await expect(chips).toHaveLength(3);
    await expect(
      canvasElement.querySelector('.q-chip__icon--remove'),
    ).toBeNull();
  },
};

export const ClearShortcut: Story = {
  name: 'Czyszczenie skrótu',
  parameters: {
    docs: {
      description: {
        story:
          'Backspace lub Delete bez modyfikatorów czyści aktualną kombinację i usuwa chipy z widoku.',
      },
      source: {
        code: `
<script setup lang="ts">
import { ref } from 'vue';

const shortcut = ref('Ctrl+Alt+N');
</script>

<template>
  <AbyssKeybind v-model="shortcut" label="Skrót globalny" />
</template>`,
      },
    },
  },
  args: {
    modelValue: 'Ctrl+Alt+N',
    label: 'Skrót globalny',
    hint: 'Backspace usuwa bieżącą kombinację.',
  },
  render: (args) => ({
    components: { AbyssKeybind },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AbyssKeybind v-bind="args" v-model="value" />`,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const combobox = canvas.getByRole('combobox');
    await userEvent.click(combobox);
    await waitFor(async () => {
      await expect(combobox).toHaveFocus();
    });
    await userEvent.keyboard('{Backspace}');

    await waitFor(async () => {
      await expect(
        canvasElement.querySelectorAll('.abyss-keybind__chip'),
      ).toHaveLength(0);
    });
  },
};

export const Disabled: Story = {
  name: 'Wyłączony',
  parameters: {
    docs: {
      description: {
        story:
          'W trybie disabled komponent zachowuje widok skrótu, ale nie reaguje na nowe wejście klawiatury.',
      },
      source: {
        code: `<AbyssKeybind model-value="Ctrl+Alt+N" label="Wyłączony skrót" :disable="true" hint="Pole nie reaguje na wprowadzanie, gdy jest wyłączone." />`,
      },
    },
  },
  args: {
    modelValue: 'Ctrl+Alt+N',
    label: 'Wyłączony skrót',
    disable: true,
    hint: 'Pole nie reaguje na wprowadzanie, gdy jest wyłączone.',
  },
  render: (args) => ({
    components: { AbyssKeybind },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<AbyssKeybind v-bind="args" v-model="value" />`,
  }),
};
