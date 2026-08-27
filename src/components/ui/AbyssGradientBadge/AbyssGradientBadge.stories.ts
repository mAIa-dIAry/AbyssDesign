import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssGradientBadge from '@/components/ui/AbyssGradientBadge/AbyssGradientBadge.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssGradientBadge> = {
  title: 'UI/AbyssGradientBadge',
  component: AbyssGradientBadge,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Badge subskrypcji z gradientowym tłem. Warianty: `gold`, `sakura`, `garden`. **Nie** badge statusu semantycznego w tabeli (`success` / `warning` / `danger` — ten prymityw to BRAK; nie zastępuj `q-badge`).',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Tekst wyświetlany w badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      control: 'select',
      options: ['gold', 'sakura', 'garden'],
      description: 'Wariant kolorystyczny badge',
      table: {
        type: { summary: "'gold' | 'sakura' | 'garden'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssGradientBadge>;

export const PremiumPlus: Story = {
  name: 'Premium Plus (gold)',
  args: {
    label: 'Premium Plus',
    variant: 'gold',
  },
  parameters: {
    docs: {
      description: {
        story: 'Wariant gold przeznaczony dla planu Premium Plus.',
      },
    },
  },
};

export const Premium: Story = {
  name: 'Premium (sakura)',
  args: {
    label: 'Premium',
    variant: 'sakura',
  },
  parameters: {
    docs: {
      description: {
        story: 'Wariant sakura przeznaczony dla planu Premium.',
      },
    },
  },
};

export const Free: Story = {
  name: 'FREE (garden)',
  args: {
    label: 'FREE',
    variant: 'garden',
  },
  parameters: {
    docs: {
      description: {
        story: 'Wariant garden przeznaczony dla planu FREE.',
      },
    },
  },
};

export const AllVariants: Story = {
  name: 'Wszystkie warianty',
  render: () => ({
    components: { AbyssGradientBadge },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <AbyssGradientBadge variant="gold" label="Premium Plus" />
        <AbyssGradientBadge variant="sakura" label="Premium" />
        <AbyssGradientBadge variant="garden" label="FREE" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Porównanie wszystkich dostępnych wariantów kolorystycznych.',
      },
    },
  },
};

export const VariantWatch: Story = {
  name: 'Zmiana wariantu (watch)',
  render: () => ({
    components: { AbyssGradientBadge, AbyssButton },
    setup() {
      const variant = ref<'gold' | 'sakura' | 'garden'>('gold');
      function toggle() {
        variant.value = variant.value === 'gold' ? 'sakura' : 'gold';
      }
      return { variant, toggle };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <AbyssGradientBadge :variant="variant" label="Badge" data-testid="badge" />
        <AbyssButton label="Zmień wariant" @click="toggle" />
      </div>
    `,
  }),
  play: async ({ canvasElement, canvas, userEvent }) => {
    const badge = canvasElement.querySelector(
      '[data-testid="badge"]',
    ) as HTMLElement;
    const styleBefore = badge.getAttribute('style');
    const btn = canvas.getByRole('button');
    await userEvent.click(btn);
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = badge.getAttribute('style');
    await expect(styleAfter).not.toBe(styleBefore);
  },
};
