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

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy przycisk z tekstem w rozmiarze big (domyślnym).',
      },
    },
  },
  args: {
    label: 'Testowy przycisk',
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /testowy przycisk/i });

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).not.toHaveClass('size-small');
    await expect(button).not.toHaveClass('size-medium');
    await expect(button).toHaveClass('size-big');
    await expect(button).not.toHaveClass('full-width');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
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
          'Przycisk zawierający tylko ikonę bez tekstu. Automatycznie dostosowuje padding.',
      },
    },
  },
  args: {
    label: '',
    icon: 'sym_r_favorite',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('icon-only');
  },
};

export const WithIcon: Story = {
  name: 'Z ikoną',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z ikoną i tekstem - ikona dodaje wizualny kontekst do akcji.',
      },
    },
  },
  args: {
    label: 'Przycisk z ikoną',
    icon: 'sym_r_check_box',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /przycisk z ikoną/i });
    await expect(button).toBeVisible();
    const iconLeft = button.querySelector('.on-left');
    await expect(iconLeft).toBeInTheDocument();
  },
};

export const WithIconRight: Story = {
  name: 'Z ikoną po prawej',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z ikoną umieszczoną po prawej stronie tekstu.',
      },
    },
  },
  args: {
    label: 'Ikona po prawej',
    iconRight: 'sym_r_arrow_forward',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /ikona po prawej/i });
    await expect(button).toBeVisible();
    const iconRight = button.querySelector('.on-right');
    await expect(iconRight).toBeInTheDocument();
  },
};

export const WithBothIcons: Story = {
  name: 'Z ikonami po obu stronach',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk z ikonami po lewej i prawej stronie tekstu.',
      },
    },
  },
  args: {
    label: 'Obie strony',
    icon: 'sym_r_arrow_back',
    iconRight: 'sym_r_arrow_forward',
  },
};

export const MediumSize: Story = {
  name: 'Średni rozmiar',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w rozmiarze medium — wysokość 40px, jak `AbyssSelect` w trybie small.',
      },
    },
  },
  args: {
    icon: 'sym_r_refresh',
    size: 'medium',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('size-medium');
    await expect(button).toHaveClass('icon-only');
  },
};

export const SmallSize: Story = {
  name: 'Mały rozmiar',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w małym rozmiarze - zmniejszony padding, ikona i tekst.',
      },
    },
  },
  args: {
    label: 'Mały przycisk',
    icon: 'sym_r_star',
    size: 'small',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /mały przycisk/i });

    await expect(button).toBeVisible();
    await expect(button).toHaveClass('size-small');
  },
};

export const SmallIconOnly: Story = {
  name: 'Mały z ikoną',
  parameters: {
    docs: {
      description: {
        story:
          'Mały przycisk zawierający tylko ikonę - idealny do kompaktowych interfejsów.',
      },
    },
  },
  args: {
    icon: 'sym_r_settings',
    size: 'small',
  },
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
