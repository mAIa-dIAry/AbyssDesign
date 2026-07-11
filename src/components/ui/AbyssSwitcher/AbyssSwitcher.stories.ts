import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import { expect } from 'storybook/test';
import AbyssSwitcher from '@/components/ui/AbyssSwitcher/AbyssSwitcher.vue';
import type { AbyssSwitcherOption } from '@/components/ui/AbyssSwitcher/AbyssSwitcher.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const StoryWrapper = {
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start; flex: 1; max-width: 420px;">
      <slot />
    </div>
  `,
};

const viewModeOptions: AbyssSwitcherOption[] = [
  { name: 'list', label: 'Lista', icon: 'sym_r_view_list' },
  { name: 'grid', label: 'Siatka', icon: 'sym_r_grid_view' },
  { name: 'chart', label: 'Wykres', icon: 'sym_r_bar_chart' },
];

const themeOptions: AbyssSwitcherOption[] = [
  { name: 'light', label: 'Jasny' },
  { name: 'dark', label: 'Ciemny' },
  { name: 'system', label: 'System' },
];

const meta: Meta<typeof AbyssSwitcher> = {
  title: 'UI/AbyssSwitcher',
  component: AbyssSwitcher,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  render: (args) => ({
    components: { AbyssSwitcher },
    setup() {
      const model = ref(args.modelValue);

      watch(
        () => args.modelValue,
        (value) => {
          model.value = value;
        },
      );

      return { args, model };
    },
    template: '<AbyssSwitcher v-bind="args" v-model="model" />',
  }),
  parameters: {
    docs: {
      description: {
        component:
          'Przełącznik wieloopcyjny oparty na własnym UI. Przyjmuje listę opcji (`name`, `label`, opcjonalnie `icon`) i synchronizuje `v-model` z `name` aktywnej opcji.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Name aktywnej opcji',
    },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    options: {
      control: 'object',
      description: 'Lista opcji do wyboru',
    },
    disable: {
      control: 'boolean',
      description: 'Czy komponent jest nieaktywny',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    style: {
      control: 'object',
      description:
        'Dodatkowe style CSS. Dozwolone w komponentach złożonych (np. edytor). Nie stosuj w standardowych formularzach i kartach.',
    },
    class: {
      control: 'text',
      description:
        'Dodatkowe klasy CSS. Dozwolone w komponentach złożonych (np. edytor). Nie stosuj w standardowych formularzach i kartach.',
    },
  },
  args: {
    modelValue: 'dark',
    options: themeOptions,
  },
};

export default meta;
type Story = StoryObj<typeof AbyssSwitcher>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy przełącznik z trzema opcjami bez ikon.',
      },
      source: {
        code: `<script setup>
import { ref } from 'vue';

const theme = ref('dark');
const options = [
  { name: 'light', label: 'Jasny' },
  { name: 'dark', label: 'Ciemny' },
  { name: 'system', label: 'System' },
];
</script>

<template>
  <AbyssSwitcher v-model="theme" :options="options" />
</template>`,
      },
    },
  },
  args: {
    modelValue: 'dark',
    options: themeOptions,
  },
  render: (args) => ({
    components: { AbyssSwitcher, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssSwitcher v-bind="args" v-model="model" />
        <div style="opacity: 0.6; font-size: 14px;">Wartość: {{ model }}</div>
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const listOption = canvas.getByRole('radio', { name: 'Jasny' });
    const darkOption = canvas.getByRole('radio', { name: 'Ciemny' });

    await expect(darkOption).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(listOption);
    await expect(listOption).toHaveAttribute('aria-checked', 'true');
    await expect(darkOption).toHaveAttribute('aria-checked', 'false');
  },
};

export const WithIcons: Story = {
  name: 'Z ikonami',
  parameters: {
    docs: {
      description: {
        story: 'Opcje mogą zawierać opcjonalną ikonę Material Symbols.',
      },
      source: {
        code: `<AbyssSwitcher
  v-model="viewMode"
  :options="[
    { name: 'list', label: 'Lista', icon: 'sym_r_view_list' },
    { name: 'grid', label: 'Siatka', icon: 'sym_r_grid_view' },
    { name: 'chart', label: 'Wykres', icon: 'sym_r_bar_chart' },
  ]"
/>`,
      },
    },
  },
  args: {
    modelValue: 'grid',
    options: viewModeOptions,
  },
  render: (args) => ({
    components: { AbyssSwitcher, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssSwitcher v-bind="args" v-model="model" />
      </StoryWrapper>
    `,
  }),
};

export const TwoOptions: Story = {
  name: 'Dwie opcje',
  parameters: {
    docs: {
      description: {
        story: 'Przełącznik dwustanowy — stylistycznie zbliżony do AbyssToggle.',
      },
      source: {
        code: `<AbyssSwitcher
  v-model="notifications"
  :options="[
    { name: 'off', label: 'Wyłączone' },
    { name: 'on', label: 'Włączone' },
  ]"
/>`,
      },
    },
  },
  args: {
    modelValue: 'off',
    options: [
      { name: 'off', label: 'Wyłączone' },
      { name: 'on', label: 'Włączone' },
    ],
  },
  render: (args) => ({
    components: { AbyssSwitcher, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssSwitcher v-bind="args" v-model="model" />
      </StoryWrapper>
    `,
  }),
};

export const Disabled: Story = {
  name: 'Nieaktywny',
  parameters: {
    docs: {
      description: {
        story: 'Stan `disable` blokuje interakcję i stosuje styl disabled.',
      },
      source: {
        code: `<AbyssSwitcher
  v-model="theme"
  :options="options"
  disable
/>`,
      },
    },
  },
  args: {
    modelValue: 'dark',
    options: themeOptions,
    disable: true,
  },
  render: (args) => ({
    components: { AbyssSwitcher, StoryWrapper },
    setup() {
      const model = ref(args.modelValue);
      return { args, model };
    },
    template: `
      <StoryWrapper>
        <AbyssSwitcher v-bind="args" v-model="model" />
      </StoryWrapper>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    const lightOption = canvas.getByRole('radio', { name: 'Jasny' });
    await expect(lightOption).toBeDisabled();
    await userEvent.click(lightOption);
    await expect(canvas.getByRole('radio', { name: 'Ciemny' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  },
};
