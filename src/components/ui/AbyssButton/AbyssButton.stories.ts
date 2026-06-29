import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, fn } from 'storybook/test';
import { ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';
import {
  SEMANTIC_GRADIENTS,
  type GradientColorsInput,
} from '@/defines/semantic-gradients';

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
  gradientColors?: GradientColorsInput;
  onClick?: ReturnType<typeof fn>;
};

const meta: Meta<AbyssButtonStoryArgs> = {
  title: 'UI/AbyssButton',
  component: AbyssButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Przycisk Abyss z wariantami rozmiaru, stanu (`current`, `toggled`, `loading`) oraz kolorem semantycznym przez `gradient` + `gradientColors`.\n\n' +
          '**Kolory semantyczne** — ustawiane przez `gradient` i `gradientColors`:\n' +
          '- `theme` — najistotniejsze funkcje globalne aplikacji (np. dodanie notatki, aktualizacja subskrypcji). To nie jest domyślna pierwsza akcja w bloku, lecz główna akcja na skalę całej aplikacji.\n' +
          '- `success` — akceptacja i potwierdzenie.\n' +
          '- `info` — zapis i edycja.\n' +
          '- `warning` — akcje wymagające uwagi (np. zmiana hasła). Ma priorytet nad `info` przy zapisie lub potwierdzeniu czegoś istotnego.\n' +
          '- `danger` — operacje nieodwracalne (np. usunięcie danych).\n' +
          '- `hint` — akcje informacyjne lub prowadzące do pobocznego procesu.\n\n' +
          'Kolory `success`, `info`, `warning`, `danger` i `hint` są kontekstowe — w dialogu z potwierdzeniem i anulowaniem przycisk operacyjny dostaje kolor zależny od wykonywanej akcji. Nie używaj wariantu gradientowego, jeśli akcja jest jedyna na liście.\n\n' +
          '**`flat`** — wyłącznie w nagłówku i stopce `AbyssCard` oraz w `AbyssDialog`. Nie stosuj go nigdzie indziej.\n\n' +
          'Pełna matryca decyzyjna: `docs/architecture/abyss-design.md`.',
      },
    },
  },
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
        'Płaski styl bez cienia i unoszenia. Dozwolony wyłącznie w nagłówku/stopce `AbyssCard` i w `AbyssDialog`. Można łączyć z `gradient`.',
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
        'Włącza gradientowe tło. Używaj dla kontekstowej akcji operacyjnej (`gradientColors`) lub globalnego CTA (`theme`). Nie stosuj, gdy akcja jest jedyna na liście.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    gradientColors: {
      control: 'object',
      description:
        'Kolor semantyczny akcji: `theme` (globalne CTA), `success` (potwierdzenie), `info` (zapis/edycja), `warning` (uwaga, istotne zmiany), `danger` (nieodwracalne), `hint` (informacja/poboczny proces). Tablica CSS nadpisuje kolory motywu.',
      table: {
        type: { summary: 'string[] | SemanticGradientKey' },
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

type ButtonSize = (typeof BUTTON_SIZES)[number];

const sizesLayoutStyle =
  'display: flex; flex-direction: column; gap: 12px; align-items: flex-start;';

const fullWidthLayoutStyle =
  'display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 360px;';

type SizeVariantConfig = {
  getLabel?: (size: ButtonSize) => string;
  props?: Record<string, unknown>;
};

function toKebabCase(value: string): string {
  return value.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function formatVueProp(key: string, value: unknown): string {
  const attr = toKebabCase(key);

  if (value === true) {
    return attr;
  }

  if (typeof value === 'string') {
    return `${attr}="${value}"`;
  }

  if (typeof value === 'number') {
    return `:${attr}="${value}"`;
  }

  if (Array.isArray(value)) {
    const items = value.map((item) =>
      typeof item === 'string' ? `'${item}'` : String(item),
    );
    return `:${attr}="[${items.join(', ')}]"`;
  }

  return `:${attr}="${JSON.stringify(value)}"`;
}

function sizeVariantsSourceCode(options: SizeVariantConfig): string {
  const getLabel =
    options.getLabel ?? ((size: ButtonSize) => `Przycisk ${size}`);
  const props = options.props ?? {};

  return BUTTON_SIZES.map((size) => {
    const propLines = Object.entries(props).map(
      ([key, value]) => `  ${formatVueProp(key, value)}`,
    );

    return [
      '<AbyssButton',
      `  label="${getLabel(size)}"`,
      `  size="${size}"`,
      ...propLines,
      '/>',
    ].join('\n');
  }).join('\n\n');
}

type GradientColorOption = {
  id: string;
  label: string;
  gradientColors: GradientColorsInput;
};

const CUSTOM_GRADIENT_COLORS = ['#FF7194', '#028096'] as const;

const GRADIENT_COLOR_OPTIONS: GradientColorOption[] = [
  ...SEMANTIC_GRADIENTS.map((gradient) => ({
    id: gradient.key,
    label: gradient.label,
    gradientColors: gradient.key,
  })),
  {
    id: 'custom',
    label: 'Własne kolory',
    gradientColors: [...CUSTOM_GRADIENT_COLORS],
  },
];

function gradientColorOptionSourceCode(
  option: GradientColorOption,
  flat = false,
): string {
  const lines = [
    '<AbyssButton',
    `  label="${option.label}"`,
    '  size="big"',
    '  gradient',
  ];

  if (flat) {
    lines.push('  flat');
  }

  lines.push(
    `  ${formatVueProp('gradientColors', option.gradientColors)}`,
    '/>',
  );

  return lines.join('\n');
}

function gradientColorOptionsSourceCode(flat = false): string {
  return GRADIENT_COLOR_OPTIONS.map((option) =>
    gradientColorOptionSourceCode(option, flat),
  ).join('\n\n');
}

function renderGradientColorOptionsStory(flat = false) {
  return () => ({
    components: { AbyssButton },
    setup() {
      return {
        options: GRADIENT_COLOR_OPTIONS,
        layoutStyle: sizesLayoutStyle,
        flat,
      };
    },
    template: `
      <div :style="layoutStyle">
        <AbyssButton
          v-for="option in options"
          :key="option.id"
          :label="option.label"
          size="big"
          gradient
          :flat="flat"
          :gradient-colors="option.gradientColors"
          :data-testid="'gradient-colors-' + option.id"
        />
      </div>
    `,
  });
}

async function playGradientColorOptions(
  canvas: { getAllByRole: (role: string) => HTMLElement[]; getByTestId: (id: string) => HTMLElement },
  flat = false,
) {
  const buttons = canvas.getAllByRole('button');

  await expect(buttons).toHaveLength(GRADIENT_COLOR_OPTIONS.length);

  for (const button of buttons) {
    await expect(button).toHaveClass('gradient');
    await expect(button).toHaveClass('size-big');

    if (flat) {
      await expect(button).toHaveClass('flat');
    }
  }

  await expect(canvas.getByTestId('gradient-colors-theme')).toBeInTheDocument();
  await expect(canvas.getByTestId('gradient-colors-info')).toBeInTheDocument();
  await expect(canvas.getByTestId('gradient-colors-custom')).toBeInTheDocument();
}

function renderSizeVariants(options: {
  wrapperStyle?: string;
  getLabel?: (size: ButtonSize) => string;
  props?: Record<string, unknown> | ((size: ButtonSize) => Record<string, unknown>);
}) {
  return (args?: AbyssButtonStoryArgs) => ({
    components: { AbyssButton },
    setup() {
      const getLabel =
        options.getLabel ?? ((size: ButtonSize) => `Przycisk ${size}`);
      const getProps =
        typeof options.props === 'function'
          ? options.props
          : () => options.props ?? {};

      return {
        sizes: BUTTON_SIZES,
        wrapperStyle: options.wrapperStyle ?? sizesLayoutStyle,
        getLabel,
        getProps,
        onClick: args?.onClick,
      };
    },
    template: `
      <div :style="wrapperStyle">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          v-bind="getProps(size)"
          :label="getLabel(size)"
          :size="size"
          @click="onClick"
        />
      </div>
    `,
  });
}

export const Default: Story = {
  name: 'Rozmiary',
  parameters: {
    docs: {
      description: {
        story: 'Przycisk tekstowy we wszystkich rozmiarach: small, medium i big.',
      },
      source: {
        code: sizeVariantsSourceCode({}),
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
          'Przycisk w stanie "current" we wszystkich rozmiarach — reprezentuje aktualnie wybrany element lub aktywną opcję.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Wybrany ${size}`,
          props: {
            icon: 'sym_r_check',
            current: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Wybrany ${size}`,
    props: {
      icon: 'sym_r_check',
      current: true,
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('current');
    }
  },
};

export const Disabled: Story = {
  name: 'Nieaktywny',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w stanie nieaktywnym we wszystkich rozmiarach — nie można z nim wchodzić w interakcję.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Nieaktywny ${size}`,
          props: {
            icon: 'sym_r_block',
            disable: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Nieaktywny ${size}`,
    props: {
      icon: 'sym_r_block',
      disable: true,
    },
  }),
  play: async ({ args, canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toBeDisabled();
    }

    await userEvent.click(buttons[0]!);
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
      source: {
        code: `<AbyssButton icon="sym_r_favorite" size="small" />

<AbyssButton icon="sym_r_favorite" size="medium" />

<AbyssButton icon="sym_r_favorite" size="big" />`,
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
      source: {
        code: sizeVariantsSourceCode({
          props: {
            icon: 'sym_r_check_box',
          },
        }),
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
      source: {
        code: sizeVariantsSourceCode({
          props: {
            iconRight: 'sym_r_arrow_forward',
          },
        }),
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
      source: {
        code: sizeVariantsSourceCode({
          props: {
            icon: 'sym_r_arrow_back',
            iconRight: 'sym_r_arrow_forward',
          },
        }),
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
        story:
          'Przycisk rozciągnięty na pełną szerokość kontenera we wszystkich rozmiarach.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Pełna szerokość ${size}`,
          props: {
            icon: 'sym_r_arrow_forward',
            fullWidth: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    wrapperStyle: fullWidthLayoutStyle,
    getLabel: (size) => `Pełna szerokość ${size}`,
    props: {
      icon: 'sym_r_arrow_forward',
      fullWidth: true,
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('full-width');
    }
  },
};

export const LoadingWithPercentage: Story = {
  name: 'Ładowanie z postępem',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w stanie ładowania z paskiem postępu we wszystkich rozmiarach.',
      },
      source: {
        code: `<AbyssButton
  label="Zapisz small"
  size="small"
  loading
  :percentage="65"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>

<AbyssButton
  label="Zapisz medium"
  size="medium"
  loading
  :percentage="65"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>

<AbyssButton
  label="Zapisz big"
  size="big"
  loading
  :percentage="65"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>`,
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
          :label="'Zapisz ' + size"
          :size="size"
          loading
          :percentage="65"
        >
          <template v-slot:loading>
            <q-spinner-gears class="on-left" />
            Przetwarzanie...
          </template>
        </AbyssButton>
      </div>
    `,
  }),
  play: async ({ args, canvas, userEvent }) => {
    const progressBars = canvas.getAllByRole('progressbar');

    await expect(progressBars).toHaveLength(3);
    await userEvent.click(progressBars[0]!);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Flat: Story = {
  name: 'Płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w płaskim stylu — dozwolony wyłącznie w nagłówku/stopce `AbyssCard` i w `AbyssDialog`. Transparentne tło, bez cienia i ruchu unoszenia.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Płaski ${size}`,
          props: {
            icon: 'sym_r_arrow_forward',
            flat: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Płaski ${size}`,
    props: {
      icon: 'sym_r_arrow_forward',
      flat: true,
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('flat');
    }
  },
};

export const Embedded: Story = {
  name: 'Wtopiony',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk wtopiony w tło we wszystkich rozmiarach — transparentny, z cieniem i unoszeniem podczas interakcji.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Wtopiony ${size}`,
          props: {
            icon: 'sym_r_arrow_forward',
            embedded: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Wtopiony ${size}`,
    props: {
      icon: 'sym_r_arrow_forward',
      embedded: true,
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('embedded');
    }
  },
};

export const Toggled: Story = {
  name: 'Przełączony',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk w trybie przełączonym we wszystkich rozmiarach — ciemniejsze tło sygnalizuje aktywny stan.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Aktywny ${size}`,
          props: {
            icon: 'sym_r_format_bold',
            toggled: true,
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Aktywny ${size}`,
    props: {
      icon: 'sym_r_format_bold',
      toggled: true,
    },
  }),
  play: async ({ args, canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('toggled');
      await expect(button).toBeEnabled();
    }

    await userEvent.click(buttons[0]!);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Gradient: Story = {
  name: 'Gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Przycisk z gradientowym tłem we wszystkich rozmiarach. Można podać tablicę kolorów albo nazwę semantycznego gradientu.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Gradient ${size}`,
          props: {
            iconRight: 'sym_r_note_stack_add',
            gradient: true,
            gradientColors: 'theme',
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Gradient ${size}`,
    props: {
      iconRight: 'sym_r_note_stack_add',
      gradient: true,
      gradientColors: 'theme',
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('gradient');
    }
  },
};

export const FlatGradient: Story = {
  name: 'Gradient płaski',
  parameters: {
    docs: {
      description: {
        story:
          'Gradient w wariancie płaskim — bez cienia i unoszenia, z delikatnym borderem na hover i focus.',
      },
      source: {
        code: sizeVariantsSourceCode({
          getLabel: (size) => `Gradient płaski ${size}`,
          props: {
            iconRight: 'sym_r_note_stack_add',
            gradient: true,
            flat: true,
            gradientColors: 'theme',
          },
        }),
      },
    },
  },
  render: renderSizeVariants({
    getLabel: (size) => `Gradient płaski ${size}`,
    props: {
      iconRight: 'sym_r_note_stack_add',
      gradient: true,
      flat: true,
      gradientColors: 'theme',
    },
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      await expect(button).toHaveClass('gradient');
      await expect(button).toHaveClass('flat');
    }
  },
};

const semanticUsageLayoutStyle =
  'display: flex; flex-direction: column; gap: 24px; align-items: flex-start; width: 100%; max-width: 520px;';

const semanticUsageRowStyle =
  'display: flex; flex-direction: column; gap: 8px; width: 100%;';

const semanticUsageActionsStyle =
  'display: flex; gap: 12px; justify-content: flex-end; width: 100%;';

export const SemanticColorUsage: Story = {
  name: 'Zastosowanie kolorów semantycznych',
  parameters: {
    docs: {
      description: {
        story:
          'Przykłady doboru `gradientColors` w kontekście oraz reguła: bez gradientu, gdy akcja jest jedyna na liście. `flat` pokazany wyłącznie jako akcja pomocnicza w parze decyzyjnej (jak w dialogu).',
      },
      source: {
        code: `<!-- Globalne CTA aplikacji -->
<AbyssButton
  label="Dodaj notatkę"
  icon-right="sym_r_note_stack_add"
  gradient
  gradient-colors="theme"
/>

<!-- Dialog: zapis -->
<AbyssButtonGroup>
  <AbyssButton label="Anuluj" flat size="medium" />
  <AbyssButton
    label="Zapisz"
    icon="sym_r_save"
    gradient
    gradient-colors="info"
    size="medium"
  />
</AbyssButtonGroup>

<!-- Dialog: istotna zmiana — warning ma priorytet nad info -->
<AbyssButtonGroup>
  <AbyssButton label="Anuluj" flat size="medium" />
  <AbyssButton
    label="Zmień hasło"
    icon="sym_r_lock"
    gradient
    gradient-colors="warning"
    size="medium"
  />
</AbyssButtonGroup>

<!-- Dialog: operacja nieodwracalna -->
<AbyssButtonGroup>
  <AbyssButton label="Anuluj" flat size="medium" />
  <AbyssButton
    label="Usuń"
    icon="sym_r_delete"
    gradient
    gradient-colors="danger"
    size="medium"
  />
</AbyssButtonGroup>

<!-- Jedyna akcja na liście — bez gradientu -->
<AbyssButton label="Zapisz ustawienia" icon="sym_r_save" />`,
      },
    },
  },
  render: () => ({
    components: { AbyssButton, AbyssButtonGroup },
    template: `
      <div style="${semanticUsageLayoutStyle}">
        <div style="${semanticUsageRowStyle}">
          <strong>Globalne CTA — theme</strong>
          <AbyssButton
            label="Dodaj notatkę"
            icon-right="sym_r_note_stack_add"
            gradient
            gradient-colors="theme"
          />
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Dialog — zapis (info)</strong>
          <div style="${semanticUsageActionsStyle}">
            <AbyssButtonGroup>
              <AbyssButton label="Anuluj" flat size="medium" />
              <AbyssButton
                label="Zapisz"
                icon="sym_r_save"
                gradient
                gradient-colors="info"
                size="medium"
              />
            </AbyssButtonGroup>
          </div>
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Dialog — istotna zmiana (warning)</strong>
          <div style="${semanticUsageActionsStyle}">
            <AbyssButtonGroup>
              <AbyssButton label="Anuluj" flat size="medium" />
              <AbyssButton
                label="Zmień hasło"
                icon="sym_r_lock"
                gradient
                gradient-colors="warning"
                size="medium"
              />
            </AbyssButtonGroup>
          </div>
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Dialog — potwierdzenie (success)</strong>
          <div style="${semanticUsageActionsStyle}">
            <AbyssButtonGroup>
              <AbyssButton label="Anuluj" flat size="medium" />
              <AbyssButton
                label="Potwierdź"
                icon="sym_r_check"
                gradient
                gradient-colors="success"
                size="medium"
              />
            </AbyssButtonGroup>
          </div>
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Dialog — operacja nieodwracalna (danger)</strong>
          <div style="${semanticUsageActionsStyle}">
            <AbyssButtonGroup>
              <AbyssButton label="Anuluj" flat size="medium" />
              <AbyssButton
                label="Usuń"
                icon="sym_r_delete"
                gradient
                gradient-colors="danger"
                size="medium"
              />
            </AbyssButtonGroup>
          </div>
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Poboczny proces (hint)</strong>
          <AbyssButton
            label="Dowiedz się więcej"
            icon-right="sym_r_help"
            gradient
            gradient-colors="hint"
            flat
          />
        </div>

        <div style="${semanticUsageRowStyle}">
          <strong>Jedyna akcja na liście — bez gradientu</strong>
          <AbyssButton label="Zapisz ustawienia" icon="sym_r_save" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Dodaj notatkę' })).toHaveClass(
      'gradient',
    );
    await expect(canvas.getByRole('button', { name: 'Zapisz' })).toHaveClass(
      'gradient',
    );
    await expect(
      canvas.getByRole('button', { name: 'Zapisz ustawienia' }),
    ).not.toHaveClass('gradient');
  },
};

export const SemanticGradientColors: Story = {
  name: 'Opcje gradientColors',
  parameters: {
    docs: {
      description: {
        story: `Wszystkie warianty prop \`gradientColors\`: \`${SEMANTIC_GRADIENTS.map((g) => g.key).join('`, `')}\` oraz własna tablica kolorów CSS. Zobacz story „Zastosowanie kolorów semantycznych” i opisy w \`semantic-gradients.ts\`.`,
      },
      source: {
        code: gradientColorOptionsSourceCode(),
      },
    },
  },
  render: renderGradientColorOptionsStory(),
  play: async ({ canvas }) => playGradientColorOptions(canvas),
};

export const FlatSemanticGradientColors: Story = {
  name: 'Opcje gradientColors (płaski)',
  parameters: {
    docs: {
      description: {
        story: `Płaski wariant (\`flat\`) dla wszystkich opcji \`gradientColors\`: semantyczne klucze (\`${SEMANTIC_GRADIENTS.map((g) => g.key).join('`, `')}\`, w tym \`theme\`) oraz własna tablica kolorów CSS.`,
      },
      source: {
        code: gradientColorOptionsSourceCode(true),
      },
    },
  },
  render: renderGradientColorOptionsStory(true),
  play: async ({ canvas }) => playGradientColorOptions(canvas, true),
};

export const InteractiveLoading: Story = {
  name: 'Interaktywne ładowanie',
  parameters: {
    docs: {
      description: {
        story:
          'Kliknięcie uruchamia symulowane ładowanie (3 s) we wszystkich rozmiarach.',
      },
      source: {
        code: `<AbyssButton
  label="Zapisz small"
  icon="sym_r_save"
  size="small"
  :loading="loading"
  @click="handleClick"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>

<AbyssButton
  label="Zapisz medium"
  icon="sym_r_save"
  size="medium"
  :loading="loading"
  @click="handleClick"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>

<AbyssButton
  label="Zapisz big"
  icon="sym_r_save"
  size="big"
  :loading="loading"
  @click="handleClick"
>
  <template #loading>
    <q-spinner-gears class="on-left" />
    Przetwarzanie...
  </template>
</AbyssButton>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      const loading = ref<Record<ButtonSize, boolean>>({
        small: false,
        medium: false,
        big: false,
      });

      async function handleClick(size: ButtonSize) {
        if (loading.value[size]) return;
        loading.value = { ...loading.value, [size]: true };
        await new Promise((resolve) => setTimeout(resolve, 3000));
        loading.value = { ...loading.value, [size]: false };
      }

      return { sizes: BUTTON_SIZES, loading, handleClick };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <AbyssButton
          v-for="size in sizes"
          :key="size"
          :label="'Zapisz ' + size"
          icon="sym_r_save"
          :size="size"
          :loading="loading[size]"
          @click="handleClick(size)"
        >
          <template v-slot:loading>
            <q-spinner-gears class="on-left" />
            Przetwarzanie...
          </template>
        </AbyssButton>
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(3);
    await expect(buttons[0]).toBeEnabled();

    await userEvent.click(buttons[0]!);

    const progressBars = canvas.getAllByRole('progressbar');
    await expect(progressBars.length).toBeGreaterThan(0);
  },
};
