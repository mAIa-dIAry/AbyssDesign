import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import AbyssTile from '@/components/ui/AbyssTile/AbyssTile.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

interface DemoTile {
  id: string;
  title: string;
  content: string;
  monospace?: boolean;
}

const demoTiles: DemoTile[] = [
  { id: 'phone', title: 'Urządzenie', content: 'Telefon przy kasie' },
  { id: 'tablet', title: 'Urządzenie', content: 'Tablet magazynowy' },
  { id: 'laptop', title: 'Urządzenie', content: 'Laptop operatora' },
  { id: 'panel', title: 'Urządzenie', content: 'Panel ścienny' },
];

const meta: Meta<typeof AbyssGrid> = {
  title: 'UI/AbyssGrid',
  component: AbyssGrid,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Uniwersalny wrapper siatki dla treści Abyss. Używa responsywnego układu jak lista peerów w panelu synchronizacji: kolumny mają minimalną szerokość z propsa `columnSize`, a poniżej dostępnej szerokości układ schodzi do jednej kolumny bez overflow. Elementy siatki prezentuj przez `AbyssTile`.\n\n' +
          'W formularzach: `AbyssInput` i `AbyssSelect` używają wewnętrznego `AbyssGrid` z `INPUT_COLUMN_SIZE` i `INPUT_GRID_MAX_COLUMNS`. Przyciski akcji pod polami — ten sam zestaw stałych (szczegóły w dokumentacji `AbyssForm`). Nie owijaj pól ręcznie w dodatkowy `AbyssGrid`.',
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
      description:
        'Dodatkowe klasy CSS wrappera. Dozwolone w komponentach złożonych. Nie stosuj w standardowych formularzach i kartach.',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssGrid>;

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
          'Podstawowy przykład z kafelkami `AbyssTile`. Komponent układa elementy w responsywną siatkę i utrzymuje wygląd zgodny z panelem peerów.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid, AbyssTile },
    setup() {
      return { args, demoTiles };
    },
    template: `
      <AbyssGrid v-bind="args">
        <AbyssTile
          v-for="tile in demoTiles"
          :key="tile.id"
          :title="tile.title"
          :monospace="tile.monospace"
        >
          {{ tile.content }}
        </AbyssTile>
      </AbyssGrid>
    `,
  }),
  play: async ({ canvasElement }) => {
    const tiles = canvasElement.querySelectorAll('.abyss-tile');
    await expect(tiles).toHaveLength(4);

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
    components: { AbyssGrid, AbyssTile },
    setup() {
      const tiles = demoTiles.slice(0, 3).map((tile) => ({
        ...tile,
        title: 'Tryb offline',
        content: `${tile.content} · oczekuje na sieć`,
      }));
      return { args, tiles };
    },
    template: `
      <div style="max-width: 320px; width: 100%;">
        <AbyssGrid v-bind="args">
          <AbyssTile
            v-for="tile in tiles"
            :key="tile.id"
            :title="tile.title"
          >
            {{ tile.content }}
          </AbyssTile>
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
  name: 'Większe odstępy (columnGap, rowGap)',
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
          'Konfiguracja gęstości siatki przez propsy `columnGap`, `rowGap` i `rowSize`.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGrid, AbyssTile },
    setup() {
      const tiles = demoTiles.map((tile) => ({
        ...tile,
        title: 'Custom',
        content: `${tile.content} · większe odstępy`,
      }));
      return { args, tiles };
    },
    template: `
      <AbyssGrid v-bind="args">
        <AbyssTile
          v-for="tile in tiles"
          :key="tile.id"
          :title="tile.title"
        >
          {{ tile.content }}
        </AbyssTile>
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
    components: { AbyssGrid, AbyssTile },
    setup() {
      const tiles = demoTiles.slice(0, 3).map((tile) => ({
        ...tile,
        title: 'Akcja',
        content: `${tile.content} · start od prawej`,
      }));
      return { args, tiles };
    },
    template: `
      <div style="max-width: 760px; width: 100%;">
        <AbyssGrid v-bind="args">
          <AbyssTile
            v-for="tile in tiles"
            :key="tile.id"
            :title="tile.title"
          >
            {{ tile.content }}
          </AbyssTile>
        </AbyssGrid>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    await expect(grid).not.toBeNull();

    const computedStyle = getComputedStyle(grid as HTMLElement);
    await expect(computedStyle.direction).toBe('rtl');

    const firstTile = canvasElement.querySelector('.abyss-tile');
    await expect(firstTile).not.toBeNull();
    await expect(getComputedStyle(firstTile as HTMLElement).direction).toBe(
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
    components: { AbyssGrid, AbyssTile },
    setup() {
      const tiles = demoTiles.map((tile) => ({
        ...tile,
        title: 'Limit',
        content: `${tile.content} · max 2 kolumny`,
      }));
      return { args, tiles };
    },
    template: `
      <div style="max-width: 960px; width: 100%;">
        <AbyssGrid v-bind="args">
          <AbyssTile
            v-for="tile in tiles"
            :key="tile.id"
            :title="tile.title"
          >
            {{ tile.content }}
          </AbyssTile>
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
