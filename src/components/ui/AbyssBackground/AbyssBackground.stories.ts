import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import { DEFAULT_GRADIENT_COLORS } from '@/composables/useGradient';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssGradientBox from '@/components/ui/AbyssGradientBox/AbyssGradientBox.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { GRADIENT_PRESETS } from '@/defines/gradient-presets';
import {
  SEMANTIC_GRADIENTS,
  type SemanticGradientKey,
} from '@/defines/semantic-gradients';

function buildSemanticGradientsTable(): string {
  const rows = SEMANTIC_GRADIENTS.map(
    ({ key, colors, description }) =>
      `| \`${key}\` | \`${colors[0]}\` → \`${colors[1]}\` | ${description} |`,
  ).join('\n');

  return `| Klucz | Kolory | Opis |
|---|---|---|
${rows}`;
}

const semanticGradientsStoryDocs = `Stałe gradienty semantyczne z \`SEMANTIC_GRADIENTS\`:

${buildSemanticGradientsTable()}

Definicje kolorów: \`gradient-colors.ts\` w \`@/defines/gradient-colors\`. Metadane semantyczne: \`SEMANTIC_GRADIENTS\` w \`@/defines/semantic-gradients\`. Gradient renderowany pod kątem \`135deg\` (domyślnie przez \`useGradient\`).

\`AbyssBackground\` i \`AbyssButton\` akceptują nazwę semantycznego gradientu jako string (np. \`colors="info"\`, \`gradient-colors="danger"\`) zamiast tablicy kolorów.`;

const meta = {
  title: 'UI/AbyssBackground',
  component: AbyssBackground,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Podstawa kolorystyczna dla całej aplikacji — gradient renderowany jako warstwa tła z animowaną zmianą kolorów.',
      },
    },
  },
  argTypes: {
    colors: {
      control: 'object',
      description:
        'Tablica kolorów gradientu (min. 2) albo nazwa semantycznego gradientu: `info`, `warning`, `success`, `danger`, `hint`, `theme`. Obsługiwane formaty kolorów: HSL, HSLA, HEX, RGB, RGBA, named colors.',
      table: {
        type: { summary: 'string[] | SemanticGradientKey' },
        defaultValue: { summary: JSON.stringify(DEFAULT_GRADIENT_COLORS) },
      },
    },
  },
  decorators: [
    () => ({
      template: '<div class="abyss-bg-decorator-self"><story /></div>',
    }),
  ],
} satisfies Meta<typeof AbyssBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLOR_PRESETS = GRADIENT_PRESETS.slice(0, 4);
const PRESET_BOX_SIZE = 64;
const PRESET_GRID_GAP = 12;
const PRESET_GRID_WIDTH = `${
  COLOR_PRESETS.length * PRESET_BOX_SIZE +
  (COLOR_PRESETS.length - 1) * PRESET_GRID_GAP
}px`;
const PRESET_COLUMN_SIZE = `${PRESET_BOX_SIZE}px`;
const PRESET_COLUMN_GAP = `${PRESET_GRID_GAP}px`;
const PRESET_GRID_STYLE = {
  width: PRESET_GRID_WIDTH,
  inlineSize: PRESET_GRID_WIDTH,
  maxWidth: '100%',
};

const centeredWrapperStyle =
  'box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 24px;';

export const Default: Story = {
  name: 'Domyślny gradient',
  parameters: {
    docs: {
      description: {
        story:
          'Domyślny gradient aplikacji - różowy do turkusowego. Idealny jako tło głównego layoutu aplikacji.',
      },
    },
  },
  args: {
    colors: ['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)'],
  },
  play: async ({ canvasElement }) => {
    const bg = canvasElement.querySelector('.abyss-background');
    const currentLayer = canvasElement.querySelector(
      '.abyss-background__layer--current',
    );
    await expect(bg).toBeInTheDocument();
    await expect(currentLayer).toBeInTheDocument();
    await expect(currentLayer).toHaveAttribute('style');
  },
};

export const ColorsWatch: Story = {
  name: 'Reaktywna zmiana kolorów (setColors)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja reaktywności – wybór presetu gradientu aktualizuje tło przez `setColors` w watchu.',
      },
    },
  },
  args: {
    colors: [...COLOR_PRESETS[0]!.colors],
  },
  render: (args) => ({
    components: { AbyssBackground, AbyssCard, AbyssGrid, AbyssGradientBox },
    setup() {
      const activeIndex = ref(0);
      const colors = ref([...args.colors!]);

      function selectPreset(index: number) {
        activeIndex.value = index;
        colors.value = [...COLOR_PRESETS[index]!.colors];
      }

      return {
        colors,
        activeIndex,
        selectPreset,
        COLOR_PRESETS,
        presetColumnSize: PRESET_COLUMN_SIZE,
        presetColumnGap: PRESET_COLUMN_GAP,
        gridStyle: PRESET_GRID_STYLE,
      };
    },
    template: `
      <AbyssBackground :colors="colors">
        <div
          style="
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 24px;
          "
        >
          <AbyssCard style="width: auto; max-width: 100%;">
            <template #content>
              <AbyssGrid
                :max-columns="4"
                :column-size="presetColumnSize"
                :column-gap="presetColumnGap"
                row-gap="12px"
                :style="gridStyle"
              >
                <AbyssGradientBox
                  v-for="(preset, index) in COLOR_PRESETS"
                  :key="preset.label"
                  :colors="preset.colors"
                  :active="activeIndex === index"
                  :data-testid="'gradient-preset-' + index"
                  @click="selectPreset(index)"
                />
              </AbyssGrid>
            </template>
          </AbyssCard>
        </div>
      </AbyssBackground>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const bg = canvasElement.querySelector('.abyss-background');
    const currentLayer = canvasElement.querySelector(
      '.abyss-background__layer--current',
    );
    const presetBoxes = canvasElement.querySelectorAll('.abyss-gradient-box');

    await expect(bg).toBeInTheDocument();
    await expect(currentLayer).toBeInTheDocument();
    await expect(currentLayer).toHaveAttribute('style');
    await expect(presetBoxes).toHaveLength(4);
    await expect(presetBoxes[0]).toHaveClass('abyss-gradient-box--active');

    const styleBefore = currentLayer?.getAttribute('style');
    await userEvent.click(presetBoxes[1] as HTMLElement);
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = currentLayer?.getAttribute('style');

    await expect(styleAfter).not.toBe(styleBefore);
    await expect(presetBoxes[1]).toHaveClass('abyss-gradient-box--active');
    await expect(
      bg?.querySelector('.abyss-background__layer--fading'),
    ).toBeInTheDocument();
  },
};

export const SemanticGradients: Story = {
  name: 'Gradienty stałe (semantyczne)',
  parameters: {
    docs: {
      description: {
        story: semanticGradientsStoryDocs,
      },
      source: {
        code: `<AbyssBackground colors="theme">
  <AbyssButtonGroup>
    <AbyssButton label="Info" size="big" gradient gradient-colors="info" />
    <AbyssButton label="Warning" size="big" gradient gradient-colors="warning" />
    <AbyssButton label="Success" size="big" gradient gradient-colors="success" />
    <AbyssButton label="Danger" size="big" gradient gradient-colors="danger" />
    <AbyssButton label="Hint" size="big" gradient gradient-colors="hint" />
    <AbyssButton label="Theme" size="big" gradient gradient-colors="theme" />
  </AbyssButtonGroup>
</AbyssBackground>`,
      },
    },
  },
  args: {
    colors: 'theme',
  },
  render: () => ({
    components: {
      AbyssBackground,
      AbyssCard,
      AbyssButtonGroup,
      AbyssButton,
    },
    setup() {
      const activeGradient = ref<SemanticGradientKey>('theme');

      function selectGradient(key: SemanticGradientKey) {
        activeGradient.value = key;
      }

      return {
        activeGradient,
        selectGradient,
        semanticGradients: SEMANTIC_GRADIENTS,
      };
    },
    template: `
      <AbyssBackground :colors="activeGradient">
        <div style="${centeredWrapperStyle}">
          <AbyssCard style="width: auto; max-width: 100%;">
            <template #content>
              <AbyssButtonGroup>
                <AbyssButton
                  v-for="gradient in semanticGradients"
                  :key="gradient.key"
                  :label="gradient.label"
                  size="big"
                  gradient
                  :gradient-colors="gradient.key"
                  :toggled="activeGradient === gradient.key"
                  :data-testid="'semantic-gradient-' + gradient.key"
                  @click="selectGradient(gradient.key)"
                />
              </AbyssButtonGroup>
            </template>
          </AbyssCard>
        </div>
      </AbyssBackground>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const buttons = canvasElement.querySelectorAll('.abyss-button.gradient');
    const currentLayer = canvasElement.querySelector(
      '.abyss-background__layer--current',
    );

    await expect(buttons).toHaveLength(SEMANTIC_GRADIENTS.length);
    await expect(currentLayer).toHaveAttribute('style');

    for (const gradient of SEMANTIC_GRADIENTS) {
      const button = canvasElement.querySelector(
        `[data-testid="semantic-gradient-${gradient.key}"]`,
      );
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('size-big');
    }

    const styleBefore = currentLayer?.getAttribute('style');
    await userEvent.click(
      canvasElement.querySelector(
        '[data-testid="semantic-gradient-info"]',
      ) as HTMLElement,
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    const styleAfter = currentLayer?.getAttribute('style');

    await expect(styleAfter).not.toBe(styleBefore);
    await expect(
      canvasElement.querySelector('[data-testid="semantic-gradient-info"]'),
    ).toHaveClass('toggled');
  },
};
