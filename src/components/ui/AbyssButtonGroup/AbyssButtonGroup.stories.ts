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

export const Default: Story = {
  name: 'Domyślna grupa',
  parameters: {
    docs: {
      description: {
        story:
          'Podstawowa grupa przycisków z 2px odstępem, w której tylko wewnętrzne narożniki są prostowane.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Pierwszy" />
  <AbyssButton label="Drugi" />
  <AbyssButton label="Trzeci" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="Pierwszy" />
        <AbyssButton label="Drugi" />
        <AbyssButton label="Trzeci" />
      </AbyssButtonGroup>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons).toHaveLength(3);

    const [firstButton, middleButton, lastButton] = buttons;
    for (const button of buttons) {
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }

    const firstStyle = getComputedStyle(firstButton!);
    const middleStyle = getComputedStyle(middleButton!);
    const lastStyle = getComputedStyle(lastButton!);

    await expect(firstStyle.borderRadius).toBe('8px 2px 2px 8px');
    await expect(middleStyle.borderRadius).toBe('2px');
    await expect(lastStyle.borderRadius).toBe('2px 8px 8px 2px');
  },
};

export const WithIcons: Story = {
  name: 'Z ikonami',
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków z ikonami.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Wstecz" icon="sym_r_arrow_back" />
  <AbyssButton label="Dalej" icon-right="sym_r_arrow_forward" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="Wstecz" icon="sym_r_arrow_back" />
        <AbyssButton label="Dalej" icon-right="sym_r_arrow_forward" />
      </AbyssButtonGroup>
    `,
  }),
};

export const IconOnly: Story = {
  name: 'Tylko ikony',
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków zawierających tylko ikony.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton icon="sym_r_format_bold" />
  <AbyssButton icon="sym_r_format_italic" />
  <AbyssButton icon="sym_r_format_underlined" />
  <AbyssButton icon="sym_r_format_strikethrough" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton icon="sym_r_format_bold" />
        <AbyssButton icon="sym_r_format_italic" />
        <AbyssButton icon="sym_r_format_underlined" />
        <AbyssButton icon="sym_r_format_strikethrough" />
      </AbyssButtonGroup>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    for (const button of buttons) {
      await expect(button).toHaveClass('icon-only');
    }
  },
};

export const ManyButtons: Story = {
  name: 'Wiele przycisków',
  parameters: {
    docs: {
      description: {
        story: 'Grupa z większą liczbą przycisków.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="1" />
  <AbyssButton label="2" />
  <AbyssButton label="3" />
  <AbyssButton label="4" />
  <AbyssButton label="5" />
  <AbyssButton label="6" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="1" />
        <AbyssButton label="2" />
        <AbyssButton label="3" />
        <AbyssButton label="4" />
        <AbyssButton label="5" />
        <AbyssButton label="6" />
      </AbyssButtonGroup>
    `,
  }),
};

export const WithDisabled: Story = {
  name: 'Z nieaktywnym przyciskiem',
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków z jednym nieaktywnym przyciskiem.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Aktywny" />
  <AbyssButton label="Nieaktywny" :disable="true" />
  <AbyssButton label="Aktywny" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="Aktywny" />
        <AbyssButton label="Nieaktywny" :disable="true" />
        <AbyssButton label="Aktywny" />
      </AbyssButtonGroup>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons[0]).toBeEnabled();
    await expect(buttons[1]).toBeDisabled();
    await expect(buttons[2]).toBeEnabled();
  },
};

export const SmallSize: Story = {
  name: 'Mały rozmiar',
  parameters: {
    docs: {
      description: {
        story: 'Grupa przycisków w małym rozmiarze.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Mały 1" size="small" />
  <AbyssButton label="Mały 2" size="small" />
  <AbyssButton label="Mały 3" size="small" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="Mały 1" size="small" />
        <AbyssButton label="Mały 2" size="small" />
        <AbyssButton label="Mały 3" size="small" />
      </AbyssButtonGroup>
    `,
  }),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    for (const button of buttons) {
      await expect(button).toHaveClass('size-small');
    }
  },
};

export const SingleButton: Story = {
  name: 'Pojedynczy przycisk',
  parameters: {
    docs: {
      description: {
        story:
          'Grupa z jednym przyciskiem - zachowuje oryginalne zaokrąglenie narożników.',
      },
      source: {
        code: `<AbyssButtonGroup>
  <AbyssButton label="Pojedynczy" />
</AbyssButtonGroup>`,
      },
    },
  },
  render: () => ({
    components: { AbyssButtonGroup, AbyssButton },
    template: `
      <AbyssButtonGroup>
        <AbyssButton label="Pojedynczy" />
      </AbyssButtonGroup>
    `,
  }),
};
