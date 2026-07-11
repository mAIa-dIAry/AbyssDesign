import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';

import AbyssCode from '@/components/ui/AbyssCode/AbyssCode.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const sampleData = {
  name: 'Maia',
  version: 1,
  active: true,
  description: 'Aplikacja desktopowa',
};

const meta: Meta<typeof AbyssCode> = {
  title: 'UI/AbyssCode',
  component: AbyssCode,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Kolorowany podgląd kodu JSON. Tryb `json` renderuje sformatowany tekst z tokenami składni; ' +
          'tryb `abyss-json` pokazuje drzewo kluczy i wartości jak w AbyssDebug. ' +
          'Motyw kolorystyczny (`colorTheme`) wzorowany na popularnych schematach edytorów — domyślnie `one-dark`.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'Dane JSON (obiekt, tablica) lub gotowy string JSON',
    },
    language: {
      control: 'radio',
      options: ['json', 'abyss-json'],
      description: 'Wariant renderowania JSON',
      table: { defaultValue: { summary: 'json' } },
    },
    colorTheme: {
      control: 'radio',
      options: ['one-dark', 'github-dark', 'monokai'],
      description: 'Motyw kolorystyczny składni',
      table: { defaultValue: { summary: 'one-dark' } },
    },
    scrollable: {
      control: 'boolean',
      description:
        'Wewnętrzny scroll bloku kodu. W AbyssDialog ustaw false — przewija body dialogu.',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    value: sampleData,
    language: 'json',
    colorTheme: 'one-dark',
  },
};

export default meta;
type Story = StoryObj<typeof AbyssCode>;

export const Json: Story = {
  name: 'JSON (tekst)',
  parameters: {
    docs: {
      description: {
        story: 'Sformatowany JSON z kolorowaniem tokenów składni.',
      },
      source: {
        code: `<AbyssCode :value="data" language="json" />`,
      },
    },
  },
  args: {
    value: sampleData,
    language: 'json',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/"name"/)).toBeVisible();
    await expect(canvas.getByText(/Maia/)).toBeVisible();
  },
};

export const AbyssJson: Story = {
  name: 'Abyss JSON (drzewo)',
  parameters: {
    docs: {
      description: {
        story:
          'Wizualizacja drzewa JSON — klucze obiektów, indeksy tablic i wartości z kolorami typów.',
      },
      source: {
        code: `<AbyssCode :value="data" language="abyss-json" />`,
      },
    },
  },
  args: {
    value: sampleData,
    language: 'abyss-json',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('name:')).toBeVisible();
    await expect(canvas.getByText('"Maia"')).toBeVisible();
  },
};

export const NestedObject: Story = {
  name: 'Zagnieżdżony obiekt',
  args: {
    language: 'abyss-json',
    value: {
      user: {
        name: 'Jan Kowalski',
        age: 32,
        active: true,
      },
      settings: {
        theme: 'dark',
        language: 'pl-PL',
        notifications: false,
      },
    },
  },
};

export const ColorThemes: Story = {
  name: 'Motywy kolorystyczne',
  render: () => ({
    components: { AbyssCode },
    setup() {
      const data = {
        title: 'Lista zadań',
        count: 3,
        items: ['Zrobić kawę', 'Napisać kod'],
      };

      return { data };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 360px;">
        <AbyssCode :value="data" language="json" color-theme="one-dark" />
        <AbyssCode :value="data" language="json" color-theme="github-dark" />
        <AbyssCode :value="data" language="json" color-theme="monokai" />
      </div>
    `,
  }),
};

export const Reactive: Story = {
  name: 'Dane reaktywne',
  render: () => ({
    components: { AbyssCode, AbyssButton },
    setup() {
      const counter = ref(0);
      const data = ref({
        counter: counter.value,
        doubled: counter.value * 2,
        label: 'kliknij przycisk',
      });

      function increment() {
        counter.value++;
        data.value = {
          counter: counter.value,
          doubled: counter.value * 2,
          label: counter.value % 2 === 0 ? 'parzysta' : 'nieparzysta',
        };
      }

      return { data, increment };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px;">
        <AbyssButton label="Zwiększ licznik" icon="sym_r_add" @click="increment" />
        <AbyssCode :value="data" language="abyss-json" />
      </div>
    `,
  }),
};
