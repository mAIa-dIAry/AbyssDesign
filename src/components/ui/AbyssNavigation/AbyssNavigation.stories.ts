import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import AbyssNavigation from '@/components/ui/AbyssNavigation/AbyssNavigation.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssNavigation> = {
  title: 'UI/AbyssNavigation',
  component: AbyssNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent nawigacji opakowujący AbyssButton. Styluje przyciski jako boxy z ikoną na górze i etykietą na dole. Obsługuje układ pionowy (desktop) i poziomy (mobile). Automatycznie oznacza aktywny przycisk na podstawie propu `currentRoute` dopasowanego do propu `route` na AbyssButton.',
      },
    },
  },
  argTypes: {
    device: {
      control: 'select',
      options: ['desktop', 'mobile'],
      description:
        'Orientacja nawigacji – pionowa (desktop) lub pozioma (mobile)',
      table: {
        defaultValue: { summary: 'desktop' },
      },
    },
    currentRoute: {
      control: 'text',
      description:
        'Nazwa aktualnej trasy (route name). Przycisk z pasującym `route` otrzymuje styl aktywny.',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    screenRadius: {
      control: 'text',
      description:
        'Zaokrąglenie dolnych narożników nawigacji (tylko mobile) – lewy dla pierwszego przycisku, prawy dla ostatniego.',
      table: {
        defaultValue: { summary: '""' },
      },
    },
  },
  decorators: [withAbyssBackground],
};

export default meta;
type Story = StoryObj<typeof AbyssNavigation>;

const navItems = [
  { label: 'Start', icon: 'sym_r_home', route: 'index' },
  { label: 'Kalendarz', icon: 'sym_r_calendar_month', route: 'calendar' },
  { label: 'Zadania', icon: 'sym_r_task_alt', route: 'tasks' },
  { label: 'Ustawienia', icon: 'sym_r_settings', route: 'settings' },
];

export const Desktop: Story = {
  name: 'Desktop (pionowy)',
  parameters: {
    docs: {
      description: {
        story:
          'Pionowy układ nawigacji dla widoku desktopowego. Aktywna trasa jest podświetlona.',
      },
      source: {
        code: `<script setup lang="ts">
const currentRoute = 'calendar';
</script>

<template>
  <AbyssNavigation device="desktop" :current-route="currentRoute">
    <AbyssButton label="Start" icon="sym_r_home" route="index" embedded />
    <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" embedded />
    <AbyssButton label="Zadania" icon="sym_r_task_alt" route="tasks" embedded />
    <AbyssButton label="Ustawienia" icon="sym_r_settings" route="settings" embedded />
  </AbyssNavigation>
</template>`,
      },
    },
  },
  args: {
    device: 'desktop',
    currentRoute: 'calendar',
  },
  render: (args) => ({
    components: { AbyssNavigation, AbyssButton },
    setup: () => {
      const currentRoute = ref(args.currentRoute ?? 'calendar');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssNavigation v-bind="args" :current-route="currentRoute" style="width: 76px">
        <AbyssButton
          v-for="item in navItems"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          @click="currentRoute = item.route"
        />
      </AbyssNavigation>
    `,
  }),
};

export const Flat: Story = {
  name: 'Flat (bez tła)',
  parameters: {
    docs: {
      description: {
        story:
          'Nawigacja z przyciskami w trybie flat – bez cienia i tła. Aktywny przycisk nadal wyróżnia styl current.',
      },
      source: {
        code: `<template>
  <AbyssNavigation device="desktop" current-route="calendar">
    <AbyssButton label="Start" icon="sym_r_home" route="index" embedded />
    <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" embedded />
    <AbyssButton label="Zadania" icon="sym_r_task_alt" route="tasks" embedded />
    <AbyssButton label="Ustawienia" icon="sym_r_settings" route="settings" embedded />
  </AbyssNavigation>
</template>`,
      },
    },
  },
  args: {
    device: 'desktop',
    currentRoute: 'calendar',
  },
  render: (args) => ({
    components: { AbyssNavigation, AbyssButton },
    setup: () => {
      const currentRoute = ref(args.currentRoute ?? 'calendar');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssNavigation v-bind="args" :current-route="currentRoute" style="width: 76px">
        <AbyssButton
          v-for="item in navItems"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          embedded
          @click="currentRoute = item.route"
        />
      </AbyssNavigation>
    `,
  }),
};

export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    docs: {
      description: {
        story:
          'Poziomy układ nawigacji dla widoku mobilnego z przyciskami w trybie flat – bez cienia i tła.',
      },
      source: {
        code: `<template>
  <AbyssNavigation device="mobile" current-route="index">
    <AbyssButton label="Start" icon="sym_r_home" route="index" embedded />
    <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" embedded />
    <AbyssButton label="Zadania" icon="sym_r_task_alt" route="tasks" embedded />
    <AbyssButton label="Ustawienia" icon="sym_r_settings" route="settings" embedded />
  </AbyssNavigation>
</template>`,
      },
    },
  },
  args: {
    device: 'mobile',
    currentRoute: 'index',
  },
  render: (args) => ({
    components: { AbyssNavigation, AbyssButton },
    setup: () => {
      const currentRoute = ref(args.currentRoute ?? 'index');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssNavigation v-bind="args" :current-route="currentRoute" style="width: 320px">
        <AbyssButton
          v-for="item in navItems"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          embedded
          @click="currentRoute = item.route"
        />
      </AbyssNavigation>
    `,
  }),
};

export const MobileBorderRadius: Story = {
  name: 'Mobile z zaokrągleniem',
  parameters: {
    docs: {
      description: {
        story:
          'Mobilna nawigacja z zaokrąglonymi dolnymi narożnikami – przydatne gdy nawigacja jest osadzona w karcie lub kontenerze.',
      },
      source: {
        code: `<template>
  <AbyssNavigation device="mobile" current-route="index" screen-radius="16px">
    <AbyssButton label="Start" icon="sym_r_home" route="index" embedded />
    <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" embedded />
    <AbyssButton label="Zadania" icon="sym_r_task_alt" route="tasks" embedded />
    <AbyssButton label="Ustawienia" icon="sym_r_settings" route="settings" embedded />
  </AbyssNavigation>
</template>`,
      },
    },
  },
  args: {
    device: 'mobile',
    currentRoute: 'index',
    screenRadius: '20px',
  },
  render: (args) => ({
    components: { AbyssNavigation, AbyssButton },
    setup: () => {
      const currentRoute = ref(args.currentRoute ?? 'index');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssNavigation v-bind="args" :current-route="currentRoute" style="width: 320px">
        <AbyssButton
          v-for="item in navItems"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          embedded
          @click="currentRoute = item.route"
        />
      </AbyssNavigation>
    `,
  }),
};
