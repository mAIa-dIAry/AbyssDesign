import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import AbyssDebug from '@/components/ui/AbyssDebug/AbyssDebug.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssDebug> = {
  title: 'UI/AbyssDebug',
  component: AbyssDebug,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent debugowania (AbyssDebug) wyświetla przekazane dane w czasie rzeczywistym ' +
          'z kolorowaniem składni: klucze obiektów (biały), wartości tekstowe (zielony), ' +
          'wartości liczbowe (niebieski), indeksy tablic (żółty).',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Dane do wyświetlenia',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssDebug>;

export const Default: Story = {
  name: 'Podstawowy obiekt',
  args: {
    data: {
      name: 'Maia',
      version: 1,
      active: true,
      description: 'Aplikacja desktopowa',
    },
  },
};

export const NestedObject: Story = {
  name: 'Zagnieżdżony obiekt',
  args: {
    data: {
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

export const WithArray: Story = {
  name: 'Z tablicą',
  args: {
    data: {
      title: 'Lista zadań',
      count: 3,
      items: ['Zrobić kawę', 'Napisać kod', 'Zrobić review'],
    },
  },
};

export const Complex: Story = {
  name: 'Złożona struktura',
  args: {
    data: {
      id: 42,
      label: 'Projekt Alpha',
      tags: ['frontend', 'vue', 'typescript'],
      meta: {
        created: '2026-03-10',
        priority: 1,
        archived: false,
        owner: null,
      },
      scores: [98, 87, 91],
    },
  },
};

export const Reactive: Story = {
  name: 'Dane reaktywne',
  render: () => ({
    components: { AbyssDebug, AbyssButton },
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
        <AbyssDebug :data="data" />
      </div>
    `,
  }),
};
