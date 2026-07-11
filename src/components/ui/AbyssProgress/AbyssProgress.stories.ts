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
          'Pasek postępu Abyss. Obsługuje tryb określony (`value` 0–1) oraz nieokreślony (`indeterminate`). Domyślny wygląd wystarcza w większości przypadków — modyfikuj wyłącznie udokumentowane propsy (`glow`, `value`, `indeterminate`).',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Wartość postępu od 0 do 1',
      table: { defaultValue: { summary: '0' } },
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
    color: {
      control: 'color',
      description:
        'Kolor paska postępu. Stosuj w komponentach złożonych (np. wskaźnik w edytorze). W standardowych formularzach/kartach używaj domyślnego wyglądu.',
      table: { defaultValue: { summary: 'white' } },
    },
    trackColor: {
      control: 'color',
      description:
        'Kolor tła tracka. Tylko dla specjalistycznych komponentów złożonych — nie w formularzach/kartach.',
    },
    borderColor: {
      control: 'color',
      description:
        'Kolor obramowania tracka. Tylko dla specjalistycznych komponentów złożonych — nie w formularzach/kartach.',
    },
    style: {
      control: 'object',
      description:
        'Dodatkowe style CSS. Dozwolone w komponentach złożonych. Nie stosuj w standardowych formularzach i kartach.',
    },
    class: {
      control: 'text',
      description:
        'Dodatkowe klasy CSS. Dozwolone w komponentach złożonych. Nie stosuj w standardowych formularzach i kartach.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssProgress>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: { story: 'Podstawowy pasek postępu z wartością 65%.' },
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
          'Tryb `indeterminate` — animacja bez ustalonej wartości, np. podczas ładowania.',
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
          'Wariant z `glow={false}` — kompaktowy wskaźnik postępu, np. w edytorze notatek.',
      },
    },
  },
  args: {
    value: 0.42,
    glow: false,
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
