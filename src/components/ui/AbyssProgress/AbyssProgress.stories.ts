import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssProgress from '@/components/ui/AbyssProgress/AbyssProgress.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssProgress> = {
  title: 'UI/AbyssProgress',
  component: AbyssProgress,
  decorators: [withAbyssBackground],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Własny komponent paska postępu. Obsługuje tryb określony (value 0–1) oraz nieokreślony (indeterminate) z animacją CSS.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Wartość postępu od 0 do 1',
      table: { defaultValue: { summary: '0' } },
    },
    color: {
      control: 'color',
      description: 'Kolor paska postępu (CSS color)',
      table: { defaultValue: { summary: 'white' } },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Tryb nieokreślony – animacja bez ustalonej wartości',
      table: { defaultValue: { summary: 'false' } },
    },
    glow: {
      control: 'boolean',
      description: 'Czy pasek ma emitować poświatę',
      table: { defaultValue: { summary: 'true' } },
    },
    trackColor: {
      control: 'color',
      description: 'Kolor tła tracka (CSS color)',
    },
    borderColor: {
      control: 'color',
      description: 'Kolor obramowania tracka (CSS color)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssProgress>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: { story: 'Podstawowy pasek postępu z wartością 60%.' },
    },
  },
  args: {
    value: 0.65,
    indeterminate: false,
  },
  render: (args) => ({
    components: { AbyssProgress },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 320px;">
        <AbyssProgress v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector('.abyss-progress');
    await expect(progress).toBeInTheDocument();
    const bar = canvasElement.querySelector('.abyss-progress__bar');
    await expect(bar).toHaveAttribute('style', expect.stringContaining('65%'));
  },
};

export const Indeterminate: Story = {
  name: 'Nieokreślony',
  parameters: {
    docs: {
      description: {
        story:
          'Tryb indeterminate – animacja bez ustalonej wartości, np. podczas ładowania.',
      },
    },
  },
  render: () => ({
    components: { AbyssProgress },
    template: `
      <div style="width: 320px;">
        <AbyssProgress :indeterminate="true" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector('.abyss-progress');
    await expect(progress).toHaveClass('abyss-progress--indeterminate');
  },
};

export const NoGlow: Story = {
  name: 'Bez poświaty',
  parameters: {
    docs: {
      description: {
        story:
          'Wariant bez efektu glow. Używany m.in. w liczniku postępu edytora notatek.',
      },
    },
  },
  args: {
    value: 0.42,
    glow: false,
    color: 'rgba(255, 255, 255, 0.2)',
    trackColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  render: (args) => ({
    components: { AbyssProgress },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 64px;">
        <AbyssProgress v-bind="args" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector('.abyss-progress');

    await expect(progress).toHaveClass('abyss-progress--no-glow');
  },
};

export const CustomColor: Story = {
  name: 'Własny kolor',
  parameters: {
    docs: {
      description: {
        story:
          'Pasek postępu z niestandardowym kolorem przekazanym przez prop color.',
      },
    },
  },
  render: () => ({
    components: { AbyssProgress },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <AbyssProgress :value="0.6" color="hsl(187, 72%, 57%)" />
        <AbyssProgress :value="0.6" color="hsl(134, 70%, 43%)" />
        <AbyssProgress :value="0.6" color="hsl(45, 100%, 50%)" />
        <AbyssProgress :value="0.6" color="hsl(0, 78%, 56%)" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll('.abyss-progress');
    await expect(bars[0]).toHaveStyle({
      '--progress-color': 'hsl(187, 72%, 57%)',
    });
  },
};
