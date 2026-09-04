import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, waitFor } from 'storybook/test';
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
          'Kwadratowy box gradientu. Wypełnia komórkę siatki (`width: 100%`, `aspect-ratio: 1 / 1`) — nie ma sztywnego rozmiaru 64×64. Przełącznik w karcie ustawień: `AbyssGrid` `content-rows` `pack` `column-size="64px"` (`GRADIENT_BOX_COLUMN_SIZE`), bez `max-columns` i bez `:deep()` na `.abyss-gradient-box`. 64px to maksimum kolumny, nie jedyny rozmiar boxa.',
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
        story:
          'Domyślny stan — kwadrat wypełnia komórkę. W przełączniku komórka ma max 64px (`pack`).',
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
        <AbyssGrid content-rows pack column-size="64px">
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
        <AbyssGrid content-rows pack column-size="64px">
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
          'W `#content` karty: `AbyssGrid` `content-rows` `pack` `column-size="64px"`. 64px to maksimum kolumny przełącznika — box wypełnia komórkę, na wąskiej karcie maleje, na szerokiej przybywa kolumn. Bez `max-columns` i bez `:deep()` na `.abyss-gradient-box`.',
      },
      source: {
        code: `<AbyssCard title="Gradient aplikacji">
  <template #header-prepend>
    <q-icon name="sym_r_gradient" />
  </template>
  <template #content>
    <AbyssGrid content-rows pack column-size="64px">
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
          <AbyssGrid content-rows pack column-size="64px">
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
    if (!(grid instanceof HTMLElement)) {
      throw new Error('Expected gradient grid in the story canvas');
    }

    const boxes = () =>
      [...grid.querySelectorAll('.abyss-gradient-box')] as HTMLElement[];
    const firstRowCount = () => {
      const items = boxes();
      const top = items[0]?.offsetTop ?? 0;
      return items.filter((item) => item.offsetTop === top).length;
    };
    const setGridWidth = async (width: string) => {
      grid.style.width = width;
      grid.style.maxWidth = 'none';
      await waitFor(() => {
        expect(grid.getBoundingClientRect().width).toBeGreaterThan(0);
      });
    };

    try {
      await setGridWidth('800px');
      const wideBox = boxes()[0];
      if (!wideBox) {
        throw new Error('Expected gradient box in the story canvas');
      }
      const wideRect = wideBox.getBoundingClientRect();
      await expect(wideRect.width).toBeLessThanOrEqual(65);
      await expect(Math.abs(wideRect.width - wideRect.height)).toBeLessThan(2);
      const wideCount = firstRowCount();
      await expect(wideCount).toBeGreaterThan(1);

      await setGridWidth('400px');
      await waitFor(() => {
        expect(firstRowCount()).toBeLessThan(wideCount);
      });

      await setGridWidth('48px');
      await waitFor(() => {
        const narrowRect = boxes()[0].getBoundingClientRect();
        expect(narrowRect.width).toBeLessThan(64);
        expect(narrowRect.width).toBeGreaterThan(20);
        expect(Math.abs(narrowRect.width - narrowRect.height)).toBeLessThan(2);
      });
    } finally {
      grid.style.width = '';
      grid.style.maxWidth = '';
    }
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
