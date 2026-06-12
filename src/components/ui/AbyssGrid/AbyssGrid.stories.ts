import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssGrid> = {
  title: 'UI/AbyssGrid',
  component: AbyssGrid,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Uniwersalny wrapper siatki dla treści Abyss. Używa responsywnego układu jak lista peerów w panelu synchronizacji: kolumny mają minimalną szerokość z propsa `columnSize`, a poniżej dostępnej szerokości układ schodzi do jednej kolumny bez overflow.',
      },
    },
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Wyrównanie początku auto-układanej siatki.',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    maxColumns: {
      control: { type: 'number', min: 0, step: 1 },
      description:
        'Maksymalna liczba kolumn przez podniesienie minimalnej szerokości tracka siatki. `0` wyłącza limit.',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    columnSize: {
      control: 'text',
      description: 'Minimalna szerokość kolumny.',
      table: {
        defaultValue: { summary: '360px' },
      },
    },
    columnGap: {
      control: 'text',
      description: 'Odstęp między kolumnami.',
      table: {
        defaultValue: { summary: '16px' },
      },
    },
    rowGap: {
      control: 'text',
      description: 'Odstęp między wierszami.',
      table: {
        defaultValue: { summary: '8px' },
      },
    },
    rowSize: {
      control: 'text',
      description: 'Minimalna wysokość automatycznie tworzonych wierszy.',
      table: {
        defaultValue: { summary: '0px' },
      },
    },
    class: {
      control: 'text',
      description: 'Dodatkowe klasy CSS dla wrappera.',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssGrid>;

const demoItems = [
  'Telefon przy kasie',
  'Tablet magazynowy',
  'Laptop operatora',
  'Panel ścienny',
];

export const Default: Story = {
  name: 'Domyślny grid',
  args: {
    align: 'left',
    maxColumns: 0,
    columnSize: '360px',
    columnGap: '8px',
    rowGap: '8px',
    rowSize: '0px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Podstawowy przykład z kartami treści. Komponent układa elementy w responsywną siatkę i utrzymuje wygląd zgodny z panelem peerów.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid },
    setup() {
      return { args, demoItems };
    },
    template: `
      <AbyssGrid v-bind="args">
        <article
          v-for="item in demoItems"
          :key="item"
          class="abyss-grid-story-card"
        >
          <span class="abyss-grid-story-card__eyebrow">Urządzenie</span>
          <strong class="abyss-grid-story-card__title">{{ item }}</strong>
          <span class="abyss-grid-story-card__meta">Gotowe do synchronizacji</span>
        </article>
      </AbyssGrid>
    `,
  }),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('.abyss-grid-story-card');
    await expect(cards).toHaveLength(4);

    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const computedStyle = getComputedStyle(grid as HTMLElement);
    await expect(computedStyle.display).toBe('grid');
    await expect(computedStyle.columnGap).toBe('8px');
    await expect(computedStyle.rowGap).toBe('8px');
  },
};

export const NarrowContainer: Story = {
  name: 'Wąski kontener',
  args: {
    align: 'left',
    maxColumns: 0,
    columnSize: '360px',
    columnGap: '8px',
    rowGap: '8px',
    rowSize: '88px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Przykład w ograniczonej szerokości. Gdy kontener jest węższy od `columnSize`, siatka przechodzi do jednej kolumny.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid },
    setup() {
      return { args, demoItems: demoItems.slice(0, 3) };
    },
    template: `
      <div style="max-width: 320px; width: 100%;">
        <AbyssGrid v-bind="args">
          <article
            v-for="item in demoItems"
            :key="item"
            class="abyss-grid-story-card"
          >
            <span class="abyss-grid-story-card__eyebrow">Tryb offline</span>
            <strong class="abyss-grid-story-card__title">{{ item }}</strong>
            <span class="abyss-grid-story-card__meta">Oczekuje na sieć lokalną</span>
          </article>
        </AbyssGrid>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const templateColumns = getComputedStyle(
      grid as HTMLElement,
    ).gridTemplateColumns;
    await expect(templateColumns.split(' ').filter(Boolean)).toHaveLength(1);
  },
};

export const CustomSpacing: Story = {
  name: 'Własne odstępy i rzędy',
  args: {
    align: 'left',
    maxColumns: 0,
    columnSize: '280px',
    columnGap: '16px',
    rowGap: '20px',
    rowSize: '96px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wariant pokazujący konfigurację gęstości siatki przez propsy `columnGap`, `rowGap` i `rowSize`.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid },
    setup() {
      return { args, demoItems };
    },
    template: `
      <AbyssGrid v-bind="args">
        <article
          v-for="item in demoItems"
          :key="item"
          class="abyss-grid-story-card"
        >
          <span class="abyss-grid-story-card__eyebrow">Custom</span>
          <strong class="abyss-grid-story-card__title">{{ item }}</strong>
          <span class="abyss-grid-story-card__meta">Większe odstępy i wyższy wiersz</span>
        </article>
      </AbyssGrid>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const computedStyle = getComputedStyle(grid as HTMLElement);
    await expect(computedStyle.columnGap).toBe('16px');
    await expect(computedStyle.rowGap).toBe('20px');
    await expect(computedStyle.gridAutoRows).toBe('minmax(96px, auto)');
  },
};

export const RightAligned: Story = {
  name: 'Wyrównanie do prawej',
  args: {
    align: 'right',
    maxColumns: 0,
    columnSize: '220px',
    columnGap: '12px',
    rowGap: '12px',
    rowSize: '0px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wariant, w którym auto-placement siatki startuje od prawej strony kontenera. Przydatne dla rzędów akcji, które mają zaczynać się od prawej krawędzi.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid },
    setup() {
      return { args, demoItems: demoItems.slice(0, 3) };
    },
    template: `
      <div style="max-width: 760px; width: 100%;">
        <AbyssGrid v-bind="args">
          <article
            v-for="item in demoItems"
            :key="item"
            class="abyss-grid-story-card"
          >
            <span class="abyss-grid-story-card__eyebrow">Akcja</span>
            <strong class="abyss-grid-story-card__title">{{ item }}</strong>
            <span class="abyss-grid-story-card__meta">Start od prawej krawędzi</span>
          </article>
        </AbyssGrid>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const computedStyle = getComputedStyle(grid as HTMLElement);
    await expect(computedStyle.direction).toBe('rtl');

    const firstCard = canvasElement.querySelector('.abyss-grid-story-card');
    await expect(firstCard).not.toBeNull();
    await expect(getComputedStyle(firstCard as HTMLElement).direction).toBe(
      'ltr',
    );
  },
};

export const MaxColumns: Story = {
  name: 'Limit kolumn',
  args: {
    align: 'right',
    maxColumns: 2,
    columnSize: '180px',
    columnGap: '12px',
    rowGap: '12px',
    rowSize: '0px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wariant ograniczający siatkę do maksymalnie dwóch kolumn bez zawężania wrappera. Limit jest wymuszany samą definicją tracków gridu.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid },
    setup() {
      return { args, demoItems };
    },
    template: `
      <div style="max-width: 960px; width: 100%;">
        <AbyssGrid v-bind="args">
          <article
            v-for="item in demoItems"
            :key="item"
            class="abyss-grid-story-card"
          >
            <span class="abyss-grid-story-card__eyebrow">Limit</span>
            <strong class="abyss-grid-story-card__title">{{ item }}</strong>
            <span class="abyss-grid-story-card__meta">Maksymalnie 2 kolumny</span>
          </article>
        </AbyssGrid>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const computedStyle = getComputedStyle(grid as HTMLElement);
    await expect(
      computedStyle.gridTemplateColumns.split(' ').filter(Boolean),
    ).toHaveLength(2);
    await expect(computedStyle.direction).toBe('rtl');
  },
};
