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
          'Komponent karty (AbyssCard) służy do wyświetlania zawartości w kontenerze z nagłówkiem i treścią.\n\n' +
          '**Nagłówek** — sloty `header-prepend`, `header`, `header-append`:\n' +
          '- Przy tytule **zawsze** umieszczaj w `header-prepend` ikonę odpowiadającą tematowi karty (`q-icon`).\n' +
          '- Kontekstowe akcje typowe dla danej karty (np. odświeżenie danych, ustawienia widoku) umieszczaj w `header-append` jako płaskie przyciski ikonowe (`AbyssButton` + `flat` + `size="medium"` + `aria-label`, bez widocznego labela). Promień bierze się ze skali przycisku — karta go nie nadpisuje.\n' +
          '- W nagłówku i stopce karty **każdy** przycisk jest `flat`. Akcja operacyjna z kolorem semantycznym łączy `flat` + `gradient` + `gradientColors`.\n\n' +
          '**Stopka** — sloty `footer-prepend`, `footer`, `footer-append`:\n' +
          '- Zarezerwowana wyłącznie na specyficzne sytuacje (np. niezapisane zmiany w trakcie edycji). **Nie stosuj footera w standardowym układzie karty.** Akcje zapisu i potwierdzenia należą do treści, dialogu albo osobnego flow — nie do stopki karty.\n\n' +
          'Pełna matryca: `docs/architecture/abyss-design.md`.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Tytuł wyświetlany w nagłówku karty. Wymaga towarzyszącej ikony w slocie header-prepend.',
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
        <template #header-prepend>
          <q-icon name="sym_r_article" />
        </template>
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
          'Standardowa karta z tytułem, ikoną w header-prepend i treścią. Separator pojawia się automatycznie między nagłówkiem a contentem.',
      },
      source: {
        code: `<AbyssCard title="Przykładowa karta">
  <template #header-prepend>
    <q-icon name="sym_r_article" />
  </template>
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
            Karta bez nagłówka — wyświetla tylko treść bez separatora.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Wyjątek bez nagłówka — tylko zawartość slotu content. Nie stosuj tego wzorca, gdy sekcja ma nazwę; wtedy tytuł wymaga ikony w header-prepend.',
      },
      source: {
        code: `<AbyssCard>
  <template #content>
    <div>
      Karta bez nagłówka — wyświetla tylko treść bez separatora.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const content = canvas.getByText(
      'Karta bez nagłówka — wyświetla tylko treść bez separatora.',
    );
    await expect(content).toBeVisible();
    const header = canvasElement.querySelector('.abyss-card-header');
    await expect(header).toBeNull();
  },
};

export const WithHeaderActions: Story = {
  name: 'Z akcjami kontekstowymi w nagłówku',
  args: {
    title: 'Lista zadań',
  },
  render: (args) => ({
    components: { AbyssCard, AbyssButton, AbyssButtonGroup },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <q-icon name="sym_r_checklist" />
        </template>
        <template #header-append>
          <AbyssButtonGroup>
            <AbyssButton
              icon="sym_r_refresh"
              flat
              size="medium"
              aria-label="Odśwież dane"
            />
            <AbyssButton
              icon="sym_r_filter_list"
              flat
              size="medium"
              aria-label="Filtruj"
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
            Zawartość karty. Akcje kontekstowe (odświeżenie, filtr, menu) są w header-append jako ikony.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Standardowy nagłówek karty: ikona tematu w header-prepend, kontekstowe akcje (odświeżenie, filtr, menu) w header-append jako płaskie przyciski ikonowe.',
      },
      source: {
        code: `<AbyssCard title="Lista zadań">
  <template #header-prepend>
    <q-icon name="sym_r_checklist" />
  </template>
  <template #header-append>
    <AbyssButtonGroup>
      <AbyssButton
        icon="sym_r_refresh"
        flat
        size="medium"
        aria-label="Odśwież dane"
      />
      <AbyssButton
        icon="sym_r_filter_list"
        flat
        size="medium"
        aria-label="Filtruj"
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
      Zawartość karty.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Lista zadań');
    await expect(title).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Odśwież dane' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Filtruj' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Więcej opcji' }),
    ).toBeVisible();
  },
};

export const WithFooterSlots: Story = {
  name: 'Wyjątek — stopka przy niezapisanych zmianach',
  args: {
    title: 'Edycja profilu',
  },
  render: (args) => ({
    components: { AbyssCard, AbyssButton, AbyssButtonGroup },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <q-icon name="sym_r_person" />
        </template>
        <template #content>
          <div>
            Formularz edycji profilu. Stopka pojawia się tylko w specyficznych sytuacjach — tutaj przy niezapisanych zmianach.
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
              gradient
              gradient-colors="info"
              size="medium"
            />
            <AbyssButton
              label="Zastosuj"
              icon="sym_r_check"
              flat
              gradient
              gradient-colors="success"
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
          'Wyjątek od standardowego układu. Footer jest zarezerwowany na specyficzne sytuacje — np. informacja o niezapisanych zmianach z akcjami zapisu (`flat` + `gradient` + `info`) i zastosowania (`flat` + `gradient` + `success`).',
      },
      source: {
        code: `<AbyssCard title="Edycja profilu">
  <template #header-prepend>
    <q-icon name="sym_r_person" />
  </template>
  <template #content>
    <div>
      Formularz edycji profilu.
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
    const title = canvas.getByText('Edycja profilu');
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
