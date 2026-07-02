import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import {
  ABYSS_INPUT_ROW_GAP,
  INPUT_COLUMN_SIZE,
  INPUT_GRID_MAX_COLUMNS,
} from '@/components/ui/AbyssGrid/AbyssGrid.constants';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import AbyssInputLabel from '@/components/ui/AbyssInputLabel/AbyssInputLabel.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssInputLabel> = {
  title: 'UI/AbyssInputLabel',
  component: AbyssInputLabel,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  argTypes: {
    label: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['normal', 'small'],
      table: { defaultValue: { summary: 'normal' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssInputLabel>;

export const Default: Story = {
  name: 'Domyślna etykieta',
  args: {
    label: 'E-mail',
  },
  render: (args) => ({
    components: { AbyssInputLabel },
    setup() {
      return { args };
    },
    template: `<AbyssInputLabel v-bind="args" />`,
  }),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('.abyss-input-label');
    await expect(label).not.toBeNull();
    await expect(label).toHaveTextContent('E-mail');
  },
};

export const InFormGrid: Story = {
  name: 'W siatce formularza',
  parameters: {
    docs: {
      description: {
        story:
          'Etykieta jako pierwszy element `AbyssGrid` z parametrami pól formularza — ten sam układ co wewnątrz `AbyssInput`, ale obok dowolnej kontrolki (np. przycisku).',
      },
    },
  },
  render: () => ({
    components: { AbyssGrid, AbyssInputLabel, AbyssInput },
    setup() {
      return {
        INPUT_COLUMN_SIZE,
        INPUT_GRID_MAX_COLUMNS,
        ABYSS_INPUT_ROW_GAP,
        email: '',
      };
    },
    template: `
      <AbyssGrid
        :column-size="INPUT_COLUMN_SIZE"
        :max-columns="INPUT_GRID_MAX_COLUMNS"
        :rowGap="ABYSS_INPUT_ROW_GAP"
        content-rows
      >
        <AbyssInputLabel label="E-mail" />
        <AbyssInput v-model="email" type="email" placeholder="np. jan@example.com" />
      </AbyssGrid>
    `,
  }),
  play: async ({ canvasElement }) => {
    const labels = canvasElement.querySelectorAll('.abyss-input-label');
    await expect(labels).toHaveLength(1);
    await expect(labels[0]).toHaveTextContent('E-mail');
  },
};
