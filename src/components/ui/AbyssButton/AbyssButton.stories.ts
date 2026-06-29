import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, fn } from 'storybook/test';
import { ref } from 'vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
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
        'Kolory gradientu jako tablica CSS albo nazwa semantycznego gradientu: `info`, `warning`, `success`, `danger`, `hint`, `theme`. Tablica nadpisuje kolory motywu. Obsługiwane formaty kolorów: HSL, HSLA, HEX, RGB, RGBA.',
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

function gradientColorOptionSourceCode(option: GradientColorOption): string {
  return [
    '<AbyssButton',
    `  label="${option.label}"`,
    '  size="big"',
    '  gradient',
    `  ${formatVueProp('gradientColors', option.gradientColors)}`,
    '/>',
  ].join('\n');
}

function gradientColorOptionsSourceCode(): string {
  return GRADIENT_COLOR_OPTIONS.map(gradientColorOptionSourceCode).join('\n\n');
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
          'Przycisk w płaskim stylu we wszystkich rozmiarach — transparentne tło, bez cienia i ruchu unoszenia.',
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

export const SemanticGradientColors: Story = {
  name: 'Opcje gradientColors',
  parameters: {
    docs: {
      description: {
        story: `Wszystkie warianty prop \`gradientColors\`: semantyczne klucze (\`${SEMANTIC_GRADIENTS.map((g) => g.key).join('`, `')}\`, w tym \`theme\` jako gradient ze store) oraz własna tablica kolorów CSS.`,
      },
      source: {
        code: gradientColorOptionsSourceCode(),
      },
    },
  },
  render: () => ({
    components: { AbyssButton },
    setup() {
      return {
        options: GRADIENT_COLOR_OPTIONS,
        layoutStyle: sizesLayoutStyle,
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
          :gradient-colors="option.gradientColors"
          :data-testid="'gradient-colors-' + option.id"
        />
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(GRADIENT_COLOR_OPTIONS.length);

    for (const button of buttons) {
      await expect(button).toHaveClass('gradient');
      await expect(button).toHaveClass('size-big');
    }

    await expect(canvas.getByTestId('gradient-colors-theme')).toBeInTheDocument();
    await expect(canvas.getByTestId('gradient-colors-info')).toBeInTheDocument();
    await expect(canvas.getByTestId('gradient-colors-custom')).toBeInTheDocument();
  },
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
