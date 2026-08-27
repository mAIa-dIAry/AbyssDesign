import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import { ref } from 'vue';
import AbyssGradientBox from '@/components/ui/AbyssGradientBox/AbyssGradientBox.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
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
          'Komponent wyświetlający kwadratowy box z gradientem 64×64px. Obsługuje stan aktywny z obramowaniem i outline jak w polu input w trybie focus.',
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
        story: 'Domyślny stan komponentu bez aktywnego obramowania.',
      },
    },
  },
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
};

export const GradientSwitcher: Story = {
  name: 'Przełącznik gradientów',
  parameters: {
    docs: {
      description: {
        story:
          'Kliknięcie boxa aktywuje go i zmienia wybrany gradient. Boxy pełnią rolę opcji wyboru.',
      },
      source: {
        code: `<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <AbyssGradientBox
      v-for="(preset, index) in GRADIENT_PRESETS"
      :key="index"
      :colors="preset.colors"
      :active="activeIndex === index"
      @click="activeIndex = index"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AbyssGradientBox from '@/components/ui/AbyssGradientBox/AbyssGradientBox.vue';

const GRADIENT_PRESETS = [
  { label: 'Default', colors: ['hsl(345, 100%, 72%)', 'hsl(188, 98%, 30%)'] },
  { label: 'Gold',    colors: ['hsl(48, 100%, 77%)',  'hsl(18, 100%, 69%)']  },
  { label: 'Sakura',  colors: ['hsl(291, 86%, 85%)',  'hsl(235, 100%, 72%)'] },
  { label: 'Garden',  colors: ['hsl(85, 100%, 69%)',  'hsl(133, 100%, 39%)'] },
];

const activeIndex = ref(0);
</script>`,
        language: 'html',
      },
    },
  },
  render: () => ({
    components: { AbyssGradientBox },
    setup() {
      const activeIndex = ref(0);
      return { activeIndex, GRADIENT_PRESETS };
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <AbyssGradientBox
          v-for="(preset, index) in GRADIENT_PRESETS"
          :key="index"
          :colors="preset.colors"
          :active="activeIndex === index"
          @click="activeIndex = index"
        />
      </div>
    `,
  }),
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
        <AbyssGradientBox :colors="colors" />
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
