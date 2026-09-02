import type { Meta, StoryObj } from '@storybook/vue3';
import { expect, fn, waitFor } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import { createNotifyDemoQueue } from '@/components/ui/AbyssNotify/AbyssNotify.demo';
import AbyssNotifyHost, {
  type AbyssNotifyHostItem,
} from '@/components/ui/AbyssNotifyHost/AbyssNotifyHost.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const sampleItems: AbyssNotifyHostItem[] = [
  {
    instanceId: 1,
    type: 'success',
    message: 'Notatka została zapisana.',
    visible: true,
  },
];

const meta: Meta<typeof AbyssNotifyHost> = {
  title: 'UI/AbyssNotifyHost',
  component: AbyssNotifyHost,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Host kolejki `AbyssNotify`. W aplikacji montuj go w slocie `#overlay` `AbyssTemplateRoot` i podawaj kolejkę z helpera `notify()`. ' +
          'Strony nie montują `AbyssNotify` ani `Teleport`. Poza szablonem ustaw `standalone` (klasa `abyss-notify-queue`). ' +
          'Widoczność steruj `@update:visible`; instancję zdejmij w `@after-leave`.',
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description: 'Kolejka toastów z helpera `notify()` aplikacji',
      table: { defaultValue: { summary: '[]' } },
    },
    closeLabel: {
      control: 'text',
      description: 'Etykieta aria przycisku zamknięcia na każdym toaście',
      table: { defaultValue: { summary: 'Zamknij' } },
    },
    standalone: {
      control: 'boolean',
      description:
        'Poza `AbyssTemplateRoot` dodaje klasę `abyss-notify-queue`. W slocie `#overlay` zostaw `false`',
      table: { defaultValue: { summary: 'false' } },
    },
    class: {
      control: 'text',
      description:
        'Dozwolone przy budowie komponentów złożonych; niedozwolone w wzorcach formularzy i standardowych kart',
      table: { defaultValue: { summary: '""' } },
    },
    style: {
      control: 'object',
      description:
        'Dozwolone przy budowie komponentów złożonych; niedozwolone w wzorcach formularzy i standardowych kart',
      table: { defaultValue: { summary: '""' } },
    },
  },
  args: {
    closeLabel: 'Zamknij',
    standalone: true,
    'onUpdate:visible': fn(),
    'onAfter-leave': fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story:
          'Jedna instancja w trybie `standalone` — kolejka poza szablonem Root.',
      },
      source: {
        code: `<AbyssNotifyHost
  standalone
  :items="queue"
  close-label="Zamknij"
  @update:visible="setVisible"
  @after-leave="remove"
/>`,
      },
    },
  },
  args: {
    items: sampleItems,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Notatka została zapisana.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Zamknij' })).toBeVisible();
  },
};

export const Interactive: Story = {
  name: 'Kolejka',
  parameters: {
    docs: {
      description: {
        story:
          'Przyciski dokładają toasty do hosta. Ten sam szablon pod rząd podbija `count`. Zamknięcie zdejmuje instancję w `@after-leave`.',
      },
      source: {
        code: `<script setup>
const { queue, enqueue, setVisible, remove, templates } = createNotifyDemoQueue()
</script>

<template>
  <AbyssButtonGroup vertical>
    <AbyssButton
      v-for="template in templates"
      :key="template.id"
      :label="template.label"
      @click="enqueue(template)"
    />
  </AbyssButtonGroup>
  <AbyssNotifyHost
    standalone
    :items="queue"
    @update:visible="setVisible"
    @after-leave="remove"
  />
</template>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssNotifyHost, AbyssButton, AbyssButtonGroup },
    setup() {
      return { args, ...createNotifyDemoQueue() };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start; width: min(100%, 720px);">
        <div style="flex: 0 0 180px;">
          <AbyssButtonGroup vertical>
            <AbyssButton
              v-for="template in templates"
              :key="template.id"
              :label="template.label"
              @click="enqueue(template)"
            />
          </AbyssButtonGroup>
        </div>
        <AbyssNotifyHost
          standalone
          :items="queue"
          :close-label="args.closeLabel"
          style="flex: 1; min-width: 0;"
          @update:visible="setVisible"
          @after-leave="remove"
        />
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
    await waitFor(() => {
      expect(canvas.getByText('Notatka została zapisana.')).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Zamknij' }));
    await waitFor(() => {
      expect(canvas.queryByText('Notatka została zapisana.')).toBeNull();
    });
  },
};
