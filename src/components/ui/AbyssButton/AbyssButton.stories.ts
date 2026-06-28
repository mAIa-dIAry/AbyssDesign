import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, fn } from 'storybook/test';
import { ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

type AbyssButtonStoryArgs = {
  label?: string;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  current?: boolean;
  size?: 'small' | 'medium' | 'big';
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  flat?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
  onClick?: ReturnType<typeof fn>;
};

const meta: Meta<AbyssButtonStoryArgs> = {
  title: 'UI/AbyssButton',
  component: AbyssButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Tekst wyświetlany na przycisku',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    icon: {
      control: 'text',
      description: 'Ikona wyświetlana na przycisku',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    iconRight: {
      control: 'text',
      description: 'Ikona wyświetlana po prawej stronie przycisku',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Czy przycisk ma zajmować pełną szerokość kontenera',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'big'],
      description: 'Rozmiar przycisku',
      table: {
        defaultValue: { summary: 'big' },
      },
    },
    style: {
      control: 'object',
      description: 'Dodatkowe style CSS dla przycisku',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    disable: {
      control: 'boolean',
      description: 'Czy przycisk jest nieaktywny',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Czy przycisk jest w stanie ładowania',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    percentage: {
      control: 'number',
      description:
        'Procent ukończenia ładowania, wyświetlany gdy przycisk jest w stanie ładowania',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    current: {
      control: 'boolean',
      description: 'Czy przycisk reprezentuje aktualnie wybrany element',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    embedded: {
      control: 'boolean',
      description:
        'Czy przycisk ma mieć transparentny styl osadzony w tle, ale z zachowaniem standardowego cienia i unoszenia podczas interakcji.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    flat: {
      control: 'boolean',
      description:
        'Czy przycisk ma mieć płaski styl bez cienia i bez ruchu unoszenia, z delikatnym borderem na hover i focus.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    toggled: {
      control: 'boolean',
      description:
        'Tryb przełączony - ciemniejsze tło sygnalizujące aktywny stan (np. aktywne formatowanie). W odróżnieniu od `current` przycisk pozostaje interaktywny.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    gradient: {
      control: 'boolean',
      description:
        'Czy przycisk ma mieć gradientowe tło oparte na kolorach motywu',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    gradientColors: {
      control: 'object',
      description:
        'Kolory gradientu dla przycisku gradient jako tablica (nadpisują kolory motywu). Obsługiwane formaty: HSL, HSLA, HEX, RGB, RGBA.',
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  decorators: [withAbyssBackground],
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BUTTON_SIZES = ['small', 'medium', 'big'] as const;

const sizesLayoutStyle =
  'display: flex; flex-direction: column; gap: 12px; align-items: flex-start;';

export const Default: Story = {
  name: 'Rozmiary',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk tekstowy we wszystkich rozmiarach: small, medium i big.',
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          :label="'Przycisk ' + size"
          :size="size"
        />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    await expect(buttons[0]).toHaveClass('size-small');
    await expect(buttons[1]).toHaveClass('size-medium');
    await expect(buttons[2]).toHaveClass('size-big');

    await userEvent.click(buttons[2]!);
  },
};

export const Current: Story = {
  name: 'Aktualnie wybrany',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w stanie "current" - reprezentuje aktualnie wybrany element lub aktywną opcję.',
      },
    },
  },
  args: {
    label: 'Wybrany element',
    icon: 'sym_r_check',
    current: true,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /wybrany element/i });

    await expect(button).toBeEnabled();
    await expect(button).toHaveClass('current');
  },
};

export const Disabled: Story = {
  name: 'Nieaktywny',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w stanie nieaktywnym - nie można z nim wchodzić w interakcję.',
      },
    },
  },
  args: {
    label: 'Nieaktywny przycisk',
    icon: 'sym_r_block',
    disable: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /nieaktywny przycisk/i });

    await expect(button).toBeDisabled();

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const IconOnly: Story = {
  name: 'Tylko ikona',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk zawierający tylko ikonę bez tekstu we wszystkich rozmiarach. Automatycznie dostosowuje padding.',
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          icon="sym_r_favorite"
          :size="size"
        />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('icon-only');
    }
  },
};

export const WithIcon: Story = {
  name: 'Z ikoną',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z ikoną po lewej i tekstem we wszystkich rozmiarach.',
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          :label="'Przycisk ' + size"
          icon="sym_r_check_box"
          :size="size"
        />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button.querySelector('.on-left')).toBeInTheDocument();
    }
  },
};

export const WithIconRight: Story = {
  name: 'Z ikoną po prawej',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z ikoną po prawej stronie tekstu we wszystkich rozmiarach.',
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          :label="'Przycisk ' + size"
          icon-right="sym_r_arrow_forward"
          :size="size"
        />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button.querySelector('.on-right')).toBeInTheDocument();
    }
  },
};

export const WithBothIcons: Story = {
  name: 'Z ikonami po obu stronach',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z ikonami po lewej i prawej stronie tekstu we wszystkich rozmiarach.',
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          :label="'Przycisk ' + size"
          icon="sym_r_arrow_back"
          icon-right="sym_r_arrow_forward"
          :size="size"
        />
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  name: 'Pełna szerokość',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk rozciągnięty na pełną szerokość kontenera.',
      },
    },
  },
  args: {
    label: 'Przycisk pełnej szerokości',
    icon: 'sym_r_arrow_forward',
    fullWidth: true,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', {
      name: /przycisk pełnej szerokości/i,
    });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('full-width');
  },
};

export const LoadingWithPercentage: Story = {
  name: 'Ładowanie z postępem',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w stanie ładowania z paskiem postępu pokazującym procent ukończenia i niestandardowym spinnerem.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton },
    setup() {
      return { args };
    },
    template: `
      <AbyssButton v-bind="args">
        <template v-slot:loading>
          <q-spinner-gears class="on-left" />
          Przetwarzanie...
        </template>
      </AbyssButton>
    `,
  }),
  args: {
    label: 'Zapisz',
    loading: true,
    percentage: 65,
  },
  play: async ({ args, canvas, userEvent }) => {
    const progressBar = canvas.getByRole('progressbar');
    await expect(progressBar).toBeVisible();
    await userEvent.click(progressBar);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Flat: Story = {
  name: 'Płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w płaskim stylu z transparentnym tłem, bez cienia i bez ruchu unoszenia. Na hover i focus dostaje delikatny border zamiast cienia.',
      },
    },
  },
  args: {
    label: 'Płaski przycisk',
    icon: 'sym_r_arrow_forward',
    flat: true,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /płaski przycisk/i });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('flat');
  },
};

export const Embedded: Story = {
  name: 'Wtopiony',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk wtopiony w tło: transparentny, bez stałego wypełnienia, ale zachowujący standardowy cień i unoszenie podczas interakcji.',
      },
    },
  },
  args: {
    label: 'Wtopiony przycisk',
    icon: 'sym_r_arrow_forward',
    embedded: true,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /wtopiony przycisk/i });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('embedded');
  },
};

export const Toggled: Story = {
  name: 'Przełączony',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w trybie przełączonym - ciemniejsze tło sygnalizuje aktywny stan (np. aktywne formatowanie w pasku narzędzi). W odróżnieniu od `current` przycisk pozostaje w pełni interaktywny i można go ponownie kliknąć aby wyłączyć stan.',
      },
    },
  },
  args: {
    label: 'Aktywny',
    icon: 'sym_r_format_bold',
    toggled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /aktywny/i });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('toggled');
    await expect(button).toBeEnabled();

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Gradient: Story = {
  name: 'Gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z gradientowym tłem opartym na kolorach motywu. Modyfikator gradient odpowiada wyłącznie za gradient, a układ specyficzny dla OpenEditorButton jest stylowany w samym komponencie współdzielonym.',
      },
    },
  },
  args: {
    label: 'Gradientowy przycisk',
    iconRight: 'sym_r_note_stack_add',
    gradient: true,
    gradientColors: ['#FF7194', '#028096'],
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', {
      name: /gradientowy przycisk/i,
    });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('gradient');
  },
};

export const InteractiveLoading: Story = {
  name: 'Interaktywne ładowanie',
  parameters: {
    docs: {
      description: {
        story:
          'Kliknięcie w przycisk uruchamia symulowane ładowanie trwające 3 sekundy, po czym przycisk wraca do stanu normalnego.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton },
    setup() {
      const loading = ref(false);

      async function handleClick() {
        if (loading.value) return;
        loading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        loading.value = false;
      }

      return { args, loading, handleClick };
    },
    template: `
      <AbyssButton v-bind="args" :loading="loading" @click="handleClick">
        <template v-slot:loading>
          <q-spinner-gears class="on-left" />
          Przetwarzanie...
        </template>
      </AbyssButton>
    `,
  }),
  args: {
    label: 'Zapisz',
    icon: 'sym_r_save',
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /zapisz/i });

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await userEvent.click(button);

    const progressBar = canvas.getByRole('progressbar');
    await expect(progressBar).toBeVisible();
  },
};
