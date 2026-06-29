import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
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

export const WithHeaderSlots: Story = {
  name: 'Z dodatkowymi slotami nagłówka',
  args: {
    title: 'Tytuł karty',
  },
  render: (args) => ({
    components: { AbyssCard, AbyssButton, AbyssButtonGroup },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <q-icon name="sym_r_description" />
        </template>
        <template #header-append>
          <AbyssButtonGroup>
            <AbyssButton
              icon="sym_r_refresh"
              flat
              size="medium"
              aria-label="Ponów"
            />
            <AbyssButton
              icon="sym_r_settings"
              flat
              size="medium"
              aria-label="Ustawienia"
            />
            <AbyssButton
              icon="sym_r_more_vert"
              flat
              size="medium"
              aria-label="Więcej opcji"
            />
          </AbyssButtonGroup>
        </template>
        <template #content>
          <div>
            Zawartość karty z dodatkowymi elementami w nagłówku.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta z wykorzystaniem slotów header-prepend i header-append do dodania ikon lub innych elementów przed i po tytule.',
      },
      source: {
        code: `<AbyssCard title="Tytuł karty">
  <template #header-prepend>
    <q-icon name="sym_r_description" />
  </template>
  <template #header-append>
    <AbyssButtonGroup>
      <AbyssButton
        icon="sym_r_refresh"
        flat
        size="medium"
        aria-label="Ponów"
      />
      <AbyssButton
        icon="sym_r_settings"
        flat
        size="medium"
        aria-label="Ustawienia"
      />
      <AbyssButton
        icon="sym_r_more_vert"
        flat
        size="medium"
        aria-label="Więcej opcji"
      />
    </AbyssButtonGroup>
  </template>
  <template #content>
    <div>
      Zawartość karty z dodatkowymi elementami w nagłówku.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Tytuł karty');
    await expect(title).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Ponów' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Ustawienia' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Więcej opcji' }),
    ).toBeVisible();
  },
};

export const WithFooterSlots: Story = {
  name: 'Z dodatkowymi slotami stopki',
  args: {
    title: 'Tytuł karty',
  },
  render: (args) => ({
    components: { AbyssCard, AbyssButton, AbyssButtonGroup },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #content>
          <div>
            Zawartość karty z dodatkowymi elementami w stopce.
          </div>
        </template>
        <template #footer-prepend>
          Masz niezapisane zmiany
        </template>
        <template #footer-append>
          <AbyssButtonGroup>
            <AbyssButton
              label="Zapisz"
              icon="sym_r_save"
              flat
              size="medium"
            />
            <AbyssButton
              label="Zastosuj"
              icon="sym_r_check"
              flat
              size="medium"
            />
          </AbyssButtonGroup>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta z tekstem informacyjnym w footer-prepend oraz akcjami w footer-append.',
      },
      source: {
        code: `<AbyssCard title="Tytuł karty">
  <template #content>
    <div>
      Zawartość karty z dodatkowymi elementami w stopce.
    </div>
  </template>
  <template #footer-prepend>
    Masz niezapisane zmiany
  </template>
  <template #footer-append>
    <AbyssButtonGroup>
      <AbyssButton
        label="Zapisz"
        icon="sym_r_save"
        flat
        size="medium"
      />
      <AbyssButton
        label="Zastosuj"
        icon="sym_r_check"
        flat
        size="medium"
      />
    </AbyssButtonGroup>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Tytuł karty');
    await expect(title).toBeVisible();
    await expect(
      canvas.getByText('Masz niezapisane zmiany'),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Zapisz' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Zastosuj' }),
    ).toBeVisible();
  },
};
