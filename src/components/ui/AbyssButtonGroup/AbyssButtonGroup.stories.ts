import type { Meta, StoryObj } from '@storybook/vue3';
import { expect } from 'storybook/test';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssButtonGroup> = {
  title: 'UI/AbyssButtonGroup',
  component: AbyssButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent grupujący przyciski AbyssButton w jedną spójną całość. Prostuje wyłącznie wewnętrzne narożniki przycisków, pozostawiając zewnętrzne zaokrąglenia bez nadpisywania. **Uwaga:** Komponent przeznaczony wyłącznie dla komponentów AbyssButton.',
      },
    },
  },
  argTypes: {
    class: {
      control: 'text',
      description: 'Dodatkowe klasy CSS dla grupy przycisków',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
  decorators: [withAbyssBackground],
};

export default meta;
type Story = StoryObj<typeof AbyssButtonGroup>;

const BUTTON_SIZES = ['small', 'medium', 'big'] as const;

const sizesLayoutStyle =
  'display: flex; flex-direction: column; gap: 12px; align-items: flex-start;';

const GRADIENT_COLORS = ['#FF7194', '#028096'];

export const TextOnly: Story = {
  name: 'Sam tekst',
  parameters: {
    docs: {
      description: {
        story:
          'Grupa przycisków z samym tekstem we wszystkich rozmiarach — wewnętrzne narożniki są prostowane.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Pierwszy" size="big" />
  <AbyssButton label="Drugi" size="big" />
  <AbyssButton label="Trzeci" size="big" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <div v-for="size in sizes" :key="size">
          <div style="margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6);">
            {{ 'Grupa ' + size }}
          </div>
          <AbyssButtonGroup>
            <AbyssButton label="Pierwszy" :size="size" />
            <AbyssButton label="Drugi" :size="size" />
            <AbyssButton label="Trzeci" :size="size" />
          </AbyssButtonGroup>
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(9);

    const groups = BUTTON_SIZES.map((size) =>
      buttons.filter((button) => button.classList.contains(`size-${size}`)),
    );

    for (const groupButtons of groups) {
      await expect(groupButtons).toHaveLength(3);
      for (const button of groupButtons) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }

    const [firstButton, middleButton, lastButton] = groups[2]!;
    const firstStyle = getComputedStyle(firstButton!);
    const middleStyle = getComputedStyle(middleButton!);
    const lastStyle = getComputedStyle(lastButton!);

    await expect(firstStyle.borderRadius).toBe('8px 4px 4px 8px');
    await expect(middleStyle.borderRadius).toBe('4px');
    await expect(lastStyle.borderRadius).toBe('4px 8px 8px 4px');
  },
};

export const IconOnly: Story = {
  name: 'Tylko ikony',
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków z samymi ikonami we wszystkich rozmiarach.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton icon="sym_r_format_bold" size="big" />
  <AbyssButton icon="sym_r_format_italic" size="big" />
  <AbyssButton icon="sym_r_format_underlined" size="big" />
  <AbyssButton icon="sym_r_format_strikethrough" size="big" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <div v-for="size in sizes" :key="size">
          <div style="margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6);">
            {{ 'Grupa ' + size }}
          </div>
          <AbyssButtonGroup>
            <AbyssButton icon="sym_r_format_bold" :size="size" />
            <AbyssButton icon="sym_r_format_italic" :size="size" />
            <AbyssButton icon="sym_r_format_underlined" :size="size" />
            <AbyssButton icon="sym_r_format_strikethrough" :size="size" />
          </AbyssButtonGroup>
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(12);
    for (const button of buttons) {
      await expect(button).toHaveClass('icon-only');
    }
  },
};

export const MixedStates: Story = {
  name: 'Zróżnicowane stany',
  parameters: {
    docs: {
      description: {
        story:
          'Grupa z trzema wariantami we wszystkich rozmiarach: zwykły, nieaktywny i gradient.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Aktywny" size="big" />
  <AbyssButton label="Nieaktywny" size="big" :disable="true" />
  <AbyssButton
    label="Gradient"
    size="big"
    gradient
    icon-right="sym_r_note_stack_add"
    :gradient-colors="['#FF7194', '#028096']"
  />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES, gradientColors: GRADIENT_COLORS };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <div v-for="size in sizes" :key="size">
          <div style="margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6);">
            {{ 'Grupa ' + size }}
          </div>
          <AbyssButtonGroup>
            <AbyssButton label="Aktywny" :size="size" />
            <AbyssButton label="Nieaktywny" :size="size" disable />
            <AbyssButton
              label="Gradient"
              :size="size"
              gradient
              icon-right="sym_r_note_stack_add"
              :gradient-colors="gradientColors"
            />
          </AbyssButtonGroup>
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(9);

    for (let index = 0; index < 3; index += 1) {
      const groupStart = index * 3;
      await expect(buttons[groupStart]).toBeEnabled();
      await expect(buttons[groupStart + 1]).toBeDisabled();
      await expect(buttons[groupStart + 2]).toBeEnabled();
      await expect(buttons[groupStart + 2]).toHaveClass('gradient');
    }
  },
};

export const MixedStatesFlat: Story = {
  name: 'Zróżnicowane stany (flat)',
  parameters: {
    docs: {
      description: {
        story:
          'Grupa z trzema wariantami flat we wszystkich rozmiarach: zwykły, nieaktywny i gradient flat.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Aktywny" size="big" flat />
  <AbyssButton label="Nieaktywny" size="big" flat :disable="true" />
  <AbyssButton
    label="Gradient"
    size="big"
    flat
    gradient
    icon-right="sym_r_note_stack_add"
    :gradient-colors="['#FF7194', '#028096']"
  />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    setup() {
      return { sizes: BUTTON_SIZES, gradientColors: GRADIENT_COLORS };
    },
    template: `
      <div style="${sizesLayoutStyle}">
        <div v-for="size in sizes" :key="size">
          <div style="margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6);">
            {{ 'Grupa ' + size }}
          </div>
          <AbyssButtonGroup>
            <AbyssButton label="Aktywny" :size="size" flat />
            <AbyssButton label="Nieaktywny" :size="size" flat disable />
            <AbyssButton
              label="Gradient"
              :size="size"
              flat
              gradient
              icon-right="sym_r_note_stack_add"
              :gradient-colors="gradientColors"
            />
          </AbyssButtonGroup>
        </div>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');

    await expect(buttons).toHaveLength(9);

    for (let index = 0; index < 3; index += 1) {
      const groupStart = index * 3;
      await expect(buttons[groupStart]).toBeEnabled();
      await expect(buttons[groupStart]).toHaveClass('flat');
      await expect(buttons[groupStart + 1]).toBeDisabled();
      await expect(buttons[groupStart + 1]).toHaveClass('flat');
      await expect(buttons[groupStart + 2]).toBeEnabled();
      await expect(buttons[groupStart + 2]).toHaveClass('flat');
      await expect(buttons[groupStart + 2]).toHaveClass('gradient');
    }
  },
};
