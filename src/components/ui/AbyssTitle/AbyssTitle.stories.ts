import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';
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
          'Tytuł strony informacyjnej lub prawnej poza nawigacją główną. Publiczne API: `type` (`h1`–`h6`), `icon`, `label` — **brak** `level` i `size`. Nie używaj jako tytułu sekcji w karcie, dialogu ani panelu (to `AbyssCard` `title`). Nie na głównej podstronie z nawigacją. Domyślnie renderuje `h2`.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description:
        'Poziom nagłówka dokumentu informacyjnego / prawnego (`h1`–`h6`). Nie tytuł karty. Brak osobnego propu `size`.',
      table: {
        defaultValue: { summary: 'h2' },
        type: { summary: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'" },
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
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTitle>;

export const Heading1: Story = {
  name: 'h1 (24 px)',
  args: {
    type: 'h1',
    label: 'Polityka prywatności',
    icon: 'sym_r_policy',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tytuł strony informacyjnej — np. polityka prywatności, regulamin lub inna strona treściowa. 24 px, font-weight 300, kolor pełnej bieli z podkreśleniem.',
      },
      source: {
        code: `<AbyssTitle type="h1" icon="sym_r_policy">Polityka prywatności</AbyssTitle>`,
      },
    },
  },
};

export const Heading2: Story = {
  name: 'h2 (20 px, domyślny)',
  args: {
    label: 'Rozdział dokumentu',
    icon: 'sym_r_article',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Nagłówek pierwszego poziomu na stronie informacyjnej / prawnej poza nawigacją. Domyślny poziom — 20 px, bez `text-transform`. Nie tytuł `AbyssCard` ani `AbyssDialog`.',
      },
      source: {
        code: `<AbyssTitle icon="sym_r_article">Rozdział dokumentu</AbyssTitle>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector('.abyss-title--h2');
    await expect(title).toBeTruthy();
    await expect(title?.tagName.toLowerCase()).toBe('h2');
  },
};

export const Heading3: Story = {
  name: 'h3 (18 px)',
  args: {
    type: 'h3',
    label: 'Szczegóły wpisu',
    icon: 'sym_r_info',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Podtytuł na stronie informacyjnej / prawnej. 18 px, line-height 22 px. Separator po prawej wyrównany pionowo do środka wiersza tytułu. Nie podtytuł w karcie ustawień.',
      },
      source: {
        code: `<AbyssTitle type="h3" icon="sym_r_info">Szczegóły wpisu</AbyssTitle>`,
      },
    },
  },
};

export const Heading4: Story = {
  name: 'h4 (16 px)',
  args: {
    type: 'h4',
    label: 'Metadane',
    icon: 'sym_r_label',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Podtytuł drugiego poziomu na stronie informacyjnej / prawnej. 16 px, uppercase, font-weight 500. Nie nagłówek w karcie ani modalu.',
      },
      source: {
        code: `<AbyssTitle type="h4" icon="sym_r_label">Metadane</AbyssTitle>`,
      },
    },
  },
};

export const Heading5: Story = {
  name: 'h5 (14 px, bloki)',
  args: {
    type: 'h5',
    label: 'Etykieta sekcji',
    icon: 'sym_r_bookmark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Nagłówek specjalny do wyróżnienia konkretnej sekcji. Wariant blokowy — dwa białe prostokąty z czarnym tekstem: osobny blok na ikonę i tytuł. 14 px, font-weight 500, line-height 18 px.',
      },
      source: {
        code: `<AbyssTitle type="h5" icon="sym_r_bookmark">Etykieta sekcji</AbyssTitle>`,
      },
    },
  },
};

export const Heading6: Story = {
  name: 'h6 (12 px, bloki)',
  args: {
    type: 'h6',
    label: 'Etykieta podsekcji',
    icon: 'sym_r_bookmark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mniejszy nagłówek specjalny do wyróżnienia konkretnej sekcji. Wariant blokowy — bloki 20 px, ikona 18 px, gap 5 px, border-radius 5 px. Tekst 12 px, uppercase, font-weight 700, przesunięty o 1 px w dół. Białe tło bloków w 80% kryciu.',
      },
      source: {
        code: `<AbyssTitle type="h6" icon="sym_r_bookmark">Etykieta podsekcji</AbyssTitle>`,
      },
    },
  },
};

export const WithoutIcon: Story = {
  name: 'Bez ikony',
  args: {
    label: 'Tytuł bez ikony',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gdy prop `icon` nie jest podany, tytuł renderuje się bez ikony.',
      },
      source: {
        code: `<AbyssTitle>Tytuł bez ikony</AbyssTitle>`,
      },
    },
  },
};

export const AllTypes: Story = {
  name: 'Wszystkie poziomy',
  render: () => ({
    components: { AbyssTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <AbyssTitle type="h1" icon="sym_r_menu_book">Nagłówek h1</AbyssTitle>
        <AbyssTitle type="h2" icon="sym_r_history">Nagłówek h2</AbyssTitle>
        <AbyssTitle type="h3" icon="sym_r_info">Nagłówek h3</AbyssTitle>
        <AbyssTitle type="h4" icon="sym_r_label">Nagłówek h4</AbyssTitle>
        <AbyssTitle type="h5" icon="sym_r_bookmark">Nagłówek h5</AbyssTitle>
        <AbyssTitle type="h6" icon="sym_r_bookmark">Nagłówek h6</AbyssTitle>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Porównanie wszystkich sześciu poziomów nagłówka — od tytułu strony informacyjnej (`h1`) po nagłówki specjalne (`h5`, `h6`).',
      },
      source: {
        code: `<AbyssTitle type="h1" icon="sym_r_menu_book">Nagłówek h1</AbyssTitle>
<AbyssTitle type="h2" icon="sym_r_history">Nagłówek h2</AbyssTitle>
<AbyssTitle type="h3" icon="sym_r_info">Nagłówek h3</AbyssTitle>
<AbyssTitle type="h4" icon="sym_r_label">Nagłówek h4</AbyssTitle>
<AbyssTitle type="h5" icon="sym_r_bookmark">Nagłówek h5</AbyssTitle>
<AbyssTitle type="h6" icon="sym_r_bookmark">Nagłówek h6</AbyssTitle>`,
      },
    },
  },
};
