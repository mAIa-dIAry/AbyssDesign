import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';

import AbyssTile from '@/components/ui/AbyssTile/AbyssTile.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

type AbyssTileStoryArgs = {
  title?: string;
  monospace?: boolean;
  content?: string;
};

const STORY_TILE_GRID_STYLE =
  'width: 100%; max-width: 720px; min-width: 280px;';

const meta: Meta<AbyssTileStoryArgs> = {
  title: 'UI/AbyssTile',
  component: AbyssTile,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Kafelek z etykietą i treścią w slocie domyślnym.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Etykieta kafelka',
    },
    monospace: {
      control: 'boolean',
      description: 'Monospace dla wartości (np. identyfikator sieci)',
    },
    content: {
      control: 'text',
      description: 'Treść demonstracyjna w slocie',
    },
  },
  args: {
    title: 'Status',
    content: 'Połączono',
    monospace: false,
  },
};

export default meta;

type Story = StoryObj<AbyssTileStoryArgs>;

const renderTileInGrid = (args: AbyssTileStoryArgs) => ({
  components: { AbyssTile, AbyssGrid },
  setup: () => ({ args, storyGridStyle: STORY_TILE_GRID_STYLE }),
  template: `
    <div :style="storyGridStyle">
      <AbyssGrid column-size="200px" :max-columns="3">
        <AbyssTile :title="args.title" :monospace="args.monospace">
          {{ args.content }}
        </AbyssTile>
      </AbyssGrid>
    </div>
  `,
});

export const Default: Story = {
  name: 'Domyślny',
  render: renderTileInGrid,
  parameters: {
    docs: {
      source: {
        code: '<AbyssTile title="Status">Połączono</AbyssTile>',
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Status')).toBeVisible();
    await expect(canvas.getByText('Połączono')).toBeVisible();
  },
};

export const Monospace: Story = {
  name: 'Monospace',
  render: renderTileInGrid,
  args: {
    title: 'Identyfikator sieci',
    content: 'a1b2-c3d4-e5f6',
    monospace: true,
  },
  parameters: {
    docs: {
      source: {
        code: '<AbyssTile title="Identyfikator sieci" monospace>a1b2-c3d4-e5f6</AbyssTile>',
      },
    },
  },
};

export const WithoutTitle: Story = {
  name: 'Bez etykiety',
  args: {
    title: '',
    content: 'Treść bez nagłówka kafelka.',
  },
  parameters: {
    docs: {
      source: {
        code: '<AbyssTile>Treść bez nagłówka kafelka.</AbyssTile>',
      },
    },
  },
  render: (args) => ({
    components: { AbyssTile },
    setup: () => ({ args, storyGridStyle: STORY_TILE_GRID_STYLE }),
    template: `
      <div :style="storyGridStyle">
        <AbyssTile>{{ args.content }}</AbyssTile>
      </div>
    `,
  }),
};

export const SummaryRow: Story = {
  name: 'Rząd podsumowania',
  parameters: {
    docs: {
      description: {
        story: 'Trzy kafelki w jednym rzędzie — jak w panelu stanu sieci.',
      },
      source: {
        code: `<AbyssGrid :max-columns="3" column-size="minmax(0, 1fr)">
  <AbyssTile title="Status">Połączono</AbyssTile>
  <AbyssTile title="Sieć" monospace>net-42</AbyssTile>
  <AbyssTile title="Urządzenia">3</AbyssTile>
</AbyssGrid>`,
      },
    },
  },
  render: () => ({
    components: { AbyssTile, AbyssGrid },
    setup: () => ({ storyGridStyle: STORY_TILE_GRID_STYLE }),
    template: `
      <div :style="storyGridStyle">
        <AbyssGrid :max-columns="3" column-size="minmax(0, 1fr)">
          <AbyssTile title="Status">Połączono</AbyssTile>
          <AbyssTile title="Sieć" monospace>net-a1b2-c3d4</AbyssTile>
          <AbyssTile title="Urządzenia">3</AbyssTile>
        </AbyssGrid>
      </div>
    `,
  }),
};
