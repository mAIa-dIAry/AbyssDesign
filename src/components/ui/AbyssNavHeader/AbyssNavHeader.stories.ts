import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn, userEvent, within } from 'storybook/test';
import AbyssNavHeader from './AbyssNavHeader.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssPanel from '@/components/ui/AbyssPanel/AbyssPanel.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssNavHeader> = {
  title: 'UI/AbyssNavHeader',
  component: AbyssNavHeader,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Sticky nagłówek nawigacyjny w jednej linii: przycisk wstecz (40 px, zawsze widoczny), pionowy separator (4×16 px) i tytuł z ikoną (24 px). ' +
          'Panel ma padding 8 px, `border-radius: 12px` oraz cienie `$shadow-card` i `$shadow-frame-medium` jak `AbyssCard`. ' +
          'Przyciski w slocie `actions` używaj `AbyssButton` z `size="medium"`, `flat`, `embedded` — ten sam styl co wstecz.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Tytuł bieżącej strony.',
      table: { defaultValue: { summary: '""' } },
    },
    icon: {
      control: 'text',
      description: 'Ikona Material Symbols obok tytułu (24 px).',
      table: { defaultValue: { summary: '""' } },
    },
    backDisabled: {
      control: 'boolean',
      description:
        'Wyłącza akcję wstecz — przycisk pozostaje widoczny, ale nieaktywny.',
      table: { defaultValue: { summary: 'false' } },
    },
    backIcon: {
      control: 'text',
      description: 'Ikona przycisku wstecz.',
      table: { defaultValue: { summary: 'sym_r_arrow_back' } },
    },
    backLabel: {
      control: 'text',
      description: 'Etykieta ARIA przycisku wstecz.',
      table: { defaultValue: { summary: 'Wstecz' } },
    },
    sticky: {
      control: 'boolean',
      description: 'Włącza `position: sticky` i efekt szkła na tle.',
      table: { defaultValue: { summary: 'true' } },
    },
    stickyTop: {
      control: 'text',
      description:
        'Odstęp od górnej krawędzi kontenera — ustawia `margin-top` i `top` w trybie sticky.',
      table: { defaultValue: { summary: '12px' } },
    },
  },
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny',
  args: {
    title: 'Szczegóły analizy',
    icon: 'sym_r_description',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Układ: przycisk wstecz, pionowy separator i tytuł z ikoną w jednej linii (odstęp 8 px).',
      },
      source: {
        code: `<AbyssNavHeader
  title="Szczegóły analizy"
  icon="sym_r_description"
  @back="handleBack"
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('.abyss-nav-header');
    await expect(header).toBeTruthy();
    await expect(header?.classList.contains('abyss-nav-header--sticky')).toBe(
      true,
    );

    const divider = canvasElement.querySelector('.abyss-nav-header__divider');
    await expect(divider).toBeTruthy();

    const title = canvasElement.querySelector('.abyss-nav-header__title-text');
    await expect(title?.textContent).toContain('Szczegóły analizy');
  },
};

export const WithActions: Story = {
  name: 'Z akcjami',
  args: {
    title: 'Lista analiz',
    icon: 'sym_r_insights',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Slot `actions` — `AbyssButton` w tym samym stylu co wstecz: `size="medium"`, `flat`, `embedded`, ikona 40×40 px.',
      },
      source: {
        code: `<AbyssNavHeader
  title="Lista analiz"
  icon="sym_r_insights"
  @back="handleBack"
>
  <template #actions>
    <AbyssButton
      icon="sym_r_refresh"
      aria-label="Odśwież"
      size="medium"
      flat
      embedded
    />
  </template>
</AbyssNavHeader>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssNavHeader, AbyssButton },
    setup() {
      return { args };
    },
    template: `
      <AbyssNavHeader v-bind="args">
        <template #actions>
          <AbyssButton
            icon="sym_r_refresh"
            aria-label="Odśwież"
            size="medium"
            flat
            embedded
          />
        </template>
      </AbyssNavHeader>
    `,
  }),
};

export const StickyScroll: Story = {
  name: 'Sticky na liście',
  parameters: {
    docs: {
      description: {
        story:
          'Nagłówek pozostaje na górze podczas przewijania listy. Kontener scrolla używa klasy `story-scroll-container`.',
      },
      source: {
        code: `<div class="story-scroll-container" style="height: 420px; border-radius: 16px;">
  <AbyssNavHeader
    title="Lista analiz"
    icon="sym_r_insights"
    @back="handleBack"
  />
  <!-- elementy listy -->
</div>`,
      },
    },
  },
  render: () => ({
    components: { AbyssNavHeader, AbyssPanel },
    setup() {
      const items = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        label: `Analiza dnia ${12 - index} lipca 2026`,
      }));

      return { items };
    },
    template: `
      <div
        class="story-scroll-container"
        style="
          height: 420px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.16);
        "
      >
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 0 12px 12px;">
          <AbyssNavHeader
            title="Lista analiz"
            icon="sym_r_insights"
          />
          <AbyssPanel
            v-for="item in items"
            :key="item.id"
            :title="item.label"
          >
            <p style="margin: 0; color: rgba(255, 255, 255, 0.72);">
              Przykładowa treść wpisu listy — przewiń w dół, aby zobaczyć sticky header.
            </p>
          </AbyssPanel>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const scrollContainer = canvasElement.querySelector('.story-scroll-container');
    await expect(scrollContainer).toBeTruthy();

    (scrollContainer as HTMLElement).scrollTop = 240;
    await expect((scrollContainer as HTMLElement).scrollTop).toBeGreaterThan(0);

    const header = canvasElement.querySelector('.abyss-nav-header');
    await expect(header).toBeTruthy();
  },
};

export const Interactive: Story = {
  name: 'Interaktywny',
  args: {
    title: 'Szczegóły analizy',
    icon: 'sym_r_description',
  },
  parameters: {
    docs: {
      description: {
        story: 'Kliknięcie przycisku wstecz emituje zdarzenie `back`.',
      },
      source: {
        code: `<AbyssNavHeader
  title="Szczegóły analizy"
  icon="sym_r_description"
  @back="handleBack"
/>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssNavHeader },
    setup() {
      const lastAction = ref('');

      function handleBack() {
        args.onBack?.();
        lastAction.value = 'back';
      }

      return { args, lastAction, handleBack };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <AbyssNavHeader
          v-bind="args"
          @back="handleBack"
        />
        <p
          data-testid="action-output"
          style="margin: 0; color: rgba(255, 255, 255, 0.72);"
        >
          {{ lastAction || 'Kliknij przycisk wstecz' }}
        </p>
      </div>
    `,
  }),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const backButton = canvas.getByRole('button', { name: /Wstecz/i });

    await userEvent.click(backButton);

    await expect(args.onBack).toHaveBeenCalled();

    const output = canvas.getByTestId('action-output');
    await expect(output).toHaveTextContent('back');
  },
};

export const BackDisabled: Story = {
  name: 'Wstecz wyłączone',
  args: {
    title: 'Lista analiz',
    icon: 'sym_r_insights',
    backDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gdy nawigacja wstecz jest niedostępna, ustaw `backDisabled` — przycisk pozostaje w układzie, ale jest nieaktywny.',
      },
      source: {
        code: `<AbyssNavHeader
  title="Lista analiz"
  icon="sym_r_insights"
  back-disabled
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const backButton = canvas.getByRole('button', { name: /Wstecz/i });

    await expect(backButton).toBeDisabled();
  },
};
