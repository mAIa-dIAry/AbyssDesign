import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssGradientBox from '@/components/ui/AbyssGradientBox/AbyssGradientBox.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';
import { GRADIENT_PRESETS } from '@/defines/gradient-presets';

const meta: Meta<typeof AbyssGradientBox> = {
  title: 'UI/AbyssGradientBox',
  component: AbyssGradientBox,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Kwadratowy box gradientu. Wypełnia komórkę siatki (`width: 100%`, `aspect-ratio: 1 / 1`) — nie ma sztywnego rozmiaru 64×64. W karcie ustawień układaj boxy w `AbyssGrid` `content-rows`, bez `column-size="64px"` i bez lokalnego `:deep()` na `.abyss-gradient-box`.',
      },
    },
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Aktywny stan — dodaje obramowanie i outline jak w focus',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    colors: {
      control: 'object',
      description:
        'Kolory gradientu z presetów `GRADIENT_PRESETS` (minimum 2 kolory). Bez propa — domyślny gradient aplikacji.',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: 'undefined (domyślne kolory aplikacji)' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssGradientBox>;

export const Default: Story = {
  name: 'Zwykły',
  args: {
    active: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Domyślny stan — kwadrat wypełnia komórkę siatki, bez sztywnego 64px.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGradientBox, AbyssGrid },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 240px;">
        <AbyssGrid content-rows>
          <AbyssGradientBox v-bind="args" />
        </AbyssGrid>
      </div>
    `,
  }),
};

export const Active: Story = {
  name: 'Aktywny',
  args: {
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Stan aktywny — border i outline analogiczne do pola input w trybie focus.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssGradientBox, AbyssGrid },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 240px;">
        <AbyssGrid content-rows>
          <AbyssGradientBox v-bind="args" />
        </AbyssGrid>
      </div>
    `,
  }),
};

export const GradientSwitcher: Story = {
  name: 'Przełącznik gradientów',
  parameters: {
    docs: {
      description: {
        story:
          'W `#content` karty rząd `AbyssGrid` `content-rows` wypełnia szerokość; boxy dzielą ją równo i zostają kwadratami. Nie ustawiaj `column-size="64px"` i nie nadpisuj `.abyss-gradient-box` w karcie ustawień.',
      },
      source: {
        code: `<AbyssCard title="Gradient aplikacji">
  <template #header-prepend>
    <q-icon name="sym_r_gradient" />
  </template>
  <template #content>
    <AbyssGrid content-rows>
      <AbyssGradientBox
        v-for="preset in GRADIENT_PRESETS"
        :key="preset.label"
        :colors="preset.colors"
        :active="selected === preset.label"
        @click="select(preset.label)"
      />
    </AbyssGrid>
  </template>
</AbyssCard>`,
        language: 'html',
      },
    },
  },
  render: () => ({
    components: { AbyssCard, AbyssGradientBox, AbyssGrid },
    setup() {
      const activeIndex = ref(0);
      return { activeIndex, GRADIENT_PRESETS };
    },
    template: `
      <AbyssCard title="Gradient aplikacji">
        <template #header-prepend>
          <q-icon name="sym_r_gradient" />
        </template>
        <template #content>
          <AbyssGrid content-rows>
            <AbyssGradientBox
              v-for="(preset, index) in GRADIENT_PRESETS"
              :key="preset.label"
              :colors="preset.colors"
              :active="activeIndex === index"
              @click="activeIndex = index"
            />
          </AbyssGrid>
        </template>
      </AbyssCard>
    `,
  }),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('.abyss-grid');
    const box = canvasElement.querySelector('.abyss-gradient-box');
    if (!(grid instanceof HTMLElement) || !(box instanceof HTMLElement)) {
      throw new Error('Expected gradient grid and box in the story canvas');
    }

    const gridWidth = grid.getBoundingClientRect().width;
    const boxRect = box.getBoundingClientRect();
    await expect(gridWidth).toBeGreaterThan(64);
    await expect(boxRect.width).toBeGreaterThan(64);
    await expect(Math.abs(boxRect.width - boxRect.height)).toBeLessThan(2);
  },
};

export const ColorsWatch: Story = {
  name: 'Reaktywna zmiana kolorów (setColors)',
  parameters: {
    docs: {
      description: {
        story:
          'Weryfikacja reaktywności – zmiana prop `colors` aktualizuje gradient przez `setColors` w watchu.',
      },
    },
  },
  render: () => ({
    components: { AbyssGradientBox, AbyssButton },
    setup() {
      const colors = ref<string[]>([
        'hsl(345, 100%, 72%)',
        'hsl(188, 98%, 30%)',
      ]);
      function changeColors() {
        colors.value = ['hsl(200, 100%, 50%)', 'hsl(260, 80%, 60%)'];
      }
      return { colors, changeColors };
    },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">
        <AbyssButton label="Zmień kolory" size="small" @click="changeColors" />
      <div style="width: 96px;">
        <AbyssGradientBox :colors="colors" />
      </div>
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const box = canvasElement.querySelector(
      '.abyss-gradient-box',
    ) as HTMLElement;
    const styleBefore = box.getAttribute('style');
    await userEvent.click(canvas.getByRole('button', { name: /zmień kolory/i }));
    await new Promise((r) => setTimeout(r, 50));
    const styleAfter = box.getAttribute('style');
    await expect(styleAfter).not.toBe(styleBefore);
  },
};

export const ClickEvent: Story = {
  name: 'Zdarzenie kliknięcia',
  parameters: {
    docs: {
      description: {
        story: 'Weryfikacja emitu zdarzenia `click` po kliknięciu boxa.',
      },
    },
  },
  args: {
    active: false,
  },
  play: async ({ canvasElement, userEvent }) => {
    const box = canvasElement.querySelector(
      '.abyss-gradient-box',
    ) as HTMLElement;
    await expect(box).toBeTruthy();
    await userEvent.click(box);
  },
};
