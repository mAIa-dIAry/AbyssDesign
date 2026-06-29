import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssTitle> = {
  title: 'UI/AbyssTitle',
  component: AbyssTitle,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Prosty komponent tytułu (AbyssTitle) z trzema rozmiarami i opcjonalną ikoną po lewej stronie. ' +
          'Rozmiar determinuje jednocześnie wielkość czcionki i grubość fontu: ' +
          'lg (20 px / 700), md (18 px / 600), sm (16 px / 500).',
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['lg', 'md', 'sm'],
      description: 'Rozmiar tytułu – determinuje font-size i font-weight.',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: "'lg' | 'md' | 'sm'" },
      },
    },
    icon: {
      control: 'text',
      description:
        'Nazwa ikony Material Symbols wyświetlanej po lewej stronie tytułu (np. `sym_r_home`).',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Treść tytułu. Można też użyć domyślnego slotu.',
      table: {
        type: { summary: 'string' },
      },
    },
    separator: {
      control: 'boolean',
      description:
        'Gdy `true`, po tekście tytułu wyrenderowana zostaje pozioma linia (1 px, opacity 0.35) wypełniająca pozostałą szerokość wiersza.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    colors: {
      control: 'object',
      description:
        'Kolory gradientu nakładanego na tytuł i ikonę (mix-blend-mode: overlay). Domyślnie używane są kolory aplikacji.',
      table: {
        type: { summary: 'string[]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTitle>;

export const Large: Story = {
  name: 'Duży (lg – 20 px / 700)',
  args: {
    size: 'lg',
    label: 'Dziennik emocji',
    icon: 'sym_r_menu_book',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Największy rozmiar – 20 px, font-weight 700. Przeznaczony dla głównych nagłówków widoków.',
      },
      source: {
        code: `<AbyssTitle size="lg" icon="sym_r_menu_book">Dziennik emocji</AbyssTitle>`,
      },
    },
  },
};

export const Medium: Story = {
  name: 'Średni (md – 18 px / 600)',
  args: {
    size: 'md',
    label: 'Ostatnie wpisy',
    icon: 'sym_r_history',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Domyślny rozmiar – 18 px, font-weight 600. Przeznaczony dla nagłówków sekcji.',
      },
      source: {
        code: `<AbyssTitle icon="sym_r_history">Ostatnie wpisy</AbyssTitle>`,
      },
    },
  },
};

export const Small: Story = {
  name: 'Mały (sm – 16 px / 500)',
  args: {
    size: 'sm',
    label: 'Szczegóły wpisu',
    icon: 'sym_r_info',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Najmniejszy rozmiar – 16 px, font-weight 500. Przeznaczony dla nagłówków podsekcji.',
      },
      source: {
        code: `<AbyssTitle size="sm" icon="sym_r_info">Szczegóły wpisu</AbyssTitle>`,
      },
    },
  },
};

export const WithoutIcon: Story = {
  name: 'Bez ikony',
  args: {
    size: 'md',
    label: 'Tytuł bez ikony',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gdy prop `icon` nie jest podany, tytuł renderuje się bez ikony.',
      },
      source: {
        code: `<AbyssTitle>Tytuł bez ikony</AbyssTitle>`,
      },
    },
  },
};

export const WithSeparator: Story = {
  name: 'Z separatorem',
  args: {
    size: 'md',
    label: 'Ostatnie wpisy',
    icon: 'sym_r_history',
    separator: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gdy `separator` jest `true`, po tekście pojawia się cienka pozioma linia (1 px, opacity 0.35) rozciągająca się do końca wiersza.',
      },
      source: {
        code: `<AbyssTitle icon="sym_r_history" separator>Ostatnie wpisy</AbyssTitle>`,
      },
    },
  },
};

export const AllSizes: Story = {
  name: 'Wszystkie rozmiary',
  render: () => ({
    components: { AbyssTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <AbyssTitle size="lg" icon="sym_r_menu_book">Duży tytuł – lg</AbyssTitle>
        <AbyssTitle size="md" icon="sym_r_history">Średni tytuł – md</AbyssTitle>
        <AbyssTitle size="sm" icon="sym_r_info">Mały tytuł – sm</AbyssTitle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Porównanie wszystkich trzech dostępnych rozmiarów.',
      },
      source: {
        code: `
<AbyssTitle size="lg" icon="sym_r_menu_book">Duży tytuł – lg</AbyssTitle>
<AbyssTitle size="md" icon="sym_r_history">Średni tytuł – md</AbyssTitle>
<AbyssTitle size="sm" icon="sym_r_info">Mały tytuł – sm</AbyssTitle>`,
      },
    },
  },
};

export const WithGradient: Story = {
  name: 'Z gradientem',
  args: {
    size: 'md',
    label: 'Dziennik emocji',
    icon: 'sym_r_menu_book',
    colors: ['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gdy prop `colors` zawiera tablicę z co najmniej 2 kolorami CSS, ikona i tekst otrzymują ' +
          'gradient przez `background-clip: text`. Bez `colors` czcionka pozostaje biała.',
      },
      source: {
        code: `<AbyssTitle icon="sym_r_menu_book" :colors="['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']">Dziennik emocji</AbyssTitle>`,
      },
    },
  },
};

export const ColorsWatch: Story = {
  name: 'Reaktywna zmiana kolorów (setColors)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja reaktywności – zmiana prop `colors` aktualizuje gradient przez `setColors` w watchu (z opcją `immediate: true`).',
      },
    },
  },
  render: () => ({
    components: { AbyssTitle, AbyssButton },
    setup() {
      const colors = ref(['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)']);
      function changeColors() {
        colors.value = ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'];
      }
      return { colors, changeColors };
    },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">
        <AbyssButton label="Zmień kolory" size="small" @click="changeColors" />
        <AbyssTitle :colors="colors" label="Tytuł z gradientem" />
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const title = canvasElement.querySelector('.abyss-title') as HTMLElement;
    const styleBefore = title.getAttribute('style');
    await userEvent.click(canvas.getByRole('button', { name: /zmień kolory/i }));
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = title.getAttribute('style');
    await expect(styleAfter).not.toBe(styleBefore);
  },
};
