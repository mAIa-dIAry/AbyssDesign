import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssCard> = {
  title: 'UI/AbyssCard',
  component: AbyssCard,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent karty (AbyssCard) służy do wyświetlania zawartości w kontenerze z opcjonalnym nagłówkiem i stopką. ' +
          'Oferuje elastyczność poprzez sloty dla nagłówka (header, header-prepend, header-append), głównej treści (content) oraz stopki (footer, footer-prepend, footer-append).',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Tytuł wyświetlany w nagłówku karty',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssCard>;

export const Default: Story = {
  name: 'Domyślny',
  args: {
    title: 'Przykładowa karta',
  },
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #content>
          <div>
            Treść karty
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Podstawowa karta z tytułem i treścią. Separator pojawia się automatycznie między nagłówkiem a contentem.',
      },
      source: {
        code: `<AbyssCard title="Przykładowa karta">
  <template #content>
    <div>
      Treść karty
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Przykładowa karta');
    await expect(title).toBeVisible();
    const content = canvas.getByText('Treść karty');
    await expect(content).toBeVisible();
  },
};

export const WithoutTitle: Story = {
  name: 'Bez tytułu',
  args: {},
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #content>
          <div>
            Karta bez nagłówka - wyświetla tylko treść bez separatora.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta bez tytułu i nagłówka - wyświetla tylko zawartość slotu content.',
      },
      source: {
        code: `<AbyssCard>
  <template #content>
    <div>
      Karta bez nagłówka - wyświetla tylko treść bez separatora.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const content = canvas.getByText(
      'Karta bez nagłówka - wyświetla tylko treść bez separatora.',
    );
    await expect(content).toBeVisible();
    const header = canvasElement.querySelector('.abyss-card-header');
    await expect(header).toBeNull();
  },
};
