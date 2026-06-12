import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import { expect, fn, waitFor, within } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssDialog from '@/components/ui/AbyssDialog/AbyssDialog.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

type AbyssDialogStoryAction = {
  id: string;
  label?: string;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  size?: 'normal' | 'small';
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
  closeOnClick?: boolean;
};

type AbyssDialogStoryArgs = {
  modelValue?: boolean;
  title?: string;
  icon?: string;
  closeButton?: boolean;
  closeButtonIcon?: string;
  closeButtonAriaLabel?: string;
  actions?: AbyssDialogStoryAction[];
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
  onAction: ReturnType<typeof fn>;
  onClose: ReturnType<typeof fn>;
};

const baseActions: AbyssDialogStoryAction[] = [
  {
    id: 'cancel',
    label: 'Anuluj',
    embedded: true,
  },
  {
    id: 'confirm',
    label: 'Usuń',
    icon: 'sym_r_delete',
    gradient: true,
  },
];

const meta: Meta<AbyssDialogStoryArgs> = {
  title: 'UI/AbyssDialog',
  component: AbyssDialog,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Minimalny dialog Abyss oparty o q-dialog. Renderuje nagłówek sterowany propsami, opcjonalne przewijane body z domyślnego slotu oraz stopkę z listą akcji renderowanych jako grupa AbyssButton.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Steruje widocznością dialogu.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    title: {
      control: 'text',
      description: 'Tekst wyświetlany w nagłówku dialogu.',
      table: {
        defaultValue: { summary: '""' },
        type: { summary: 'string' },
      },
    },
    icon: {
      control: 'text',
      description: 'Opcjonalna ikona wyświetlana przed tytułem.',
      table: {
        defaultValue: { summary: '""' },
        type: { summary: 'string' },
      },
    },
    closeButton: {
      control: 'boolean',
      description: 'Pokazuje przycisk zamknięcia w nagłówku.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    closeButtonIcon: {
      control: 'text',
      description: 'Ikona używana przez przycisk zamknięcia.',
      table: {
        defaultValue: { summary: 'sym_r_close' },
        type: { summary: 'string' },
      },
    },
    closeButtonAriaLabel: {
      control: 'text',
      description: 'Etykieta dostępności przycisku zamknięcia.',
      table: {
        defaultValue: { summary: 'Zamknij dialog' },
        type: { summary: 'string' },
      },
    },
    actions: {
      control: 'object',
      description:
        'Lista akcji renderowanych w stopce jako grupa przycisków AbyssButton.',
      table: {
        defaultValue: { summary: '[]' },
        type: { summary: 'AbyssDialogAction[]' },
      },
    },
    class: {
      control: 'text',
      description: 'Dodatkowe klasy CSS dla panelu dialogu.',
      table: {
        defaultValue: { summary: '""' },
        type: { summary: 'string | object | array' },
      },
    },
    style: {
      control: 'object',
      description: 'Dodatkowe style CSS dla panelu dialogu.',
      table: {
        defaultValue: { summary: '""' },
        type: { summary: 'string | object' },
      },
    },
    onAction: {
      table: { disable: true },
    },
    onClose: {
      table: { disable: true },
    },
  },
  args: {
    modelValue: false,
    title: 'Usuń notatkę',
    icon: 'sym_r_warning',
    closeButton: true,
    closeButtonIcon: 'sym_r_close',
    closeButtonAriaLabel: 'Zamknij dialog',
    actions: baseActions,
    class: '',
    style: '',
    onAction: fn(),
    onClose: fn(),
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
          'Podstawowy dialog z nagłówkiem, przewijanym body i dwiema akcjami w stopce. Story odwzorowuje typowy przykład z dokumentacji q-dialog: otwarcie z przycisku i zamknięcie akcją.',
      },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const actions = [
  { id: 'cancel', label: 'Anuluj', embedded: true },
  { id: 'confirm', label: 'Usuń', icon: 'sym_r_delete', gradient: true },
];
</script>

<template>
  <AbyssButton label="Otwórz dialog" @click="isOpen = true" />

  <AbyssDialog
    v-model="isOpen"
    title="Usuń notatkę"
    icon="sym_r_warning"
    :close-button="true"
    :actions="actions"
  >
    <p>Czy na pewno chcesz usunąć wybraną notatkę?</p>
  </AbyssDialog>
</template>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton, AbyssDialog },
    setup() {
      const isOpen = ref(args.modelValue ?? false);

      watch(
        () => args.modelValue,
        (value) => {
          isOpen.value = value ?? false;
        },
      );

      function handleAction(action: AbyssDialogStoryAction) {
        void args.onAction(action);
      }

      function handleClose() {
        void args.onClose();
      }

      return {
        args,
        isOpen,
        handleAction,
        handleClose,
      };
    },
    template: `
      <div style="min-height: 120px; display: flex; align-items: center; justify-content: center;">
        <AbyssButton label="Otwórz dialog" @click="isOpen = true" />
      </div>

      <AbyssDialog
        v-model="isOpen"
        :title="args.title"
        :icon="args.icon"
        :close-button="args.closeButton"
        :close-button-icon="args.closeButtonIcon"
        :close-button-aria-label="args.closeButtonAriaLabel"
        :actions="args.actions"
        :class="args.class"
        :style="args.style"
        @action="handleAction"
        @close="handleClose"
      >
        <p>Czy na pewno chcesz usunąć wybraną notatkę?</p>
      </AbyssDialog>
    `,
  }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /otwórz dialog/i });
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(trigger);

    await waitFor(async () => {
      await expect(page.getByText('Usuń notatkę')).toBeVisible();
      await expect(
        page.getByText('Czy na pewno chcesz usunąć wybraną notatkę?'),
      ).toBeVisible();
    });

    await userEvent.click(page.getByRole('button', { name: /anuluj/i }));

    await expect(args.onAction).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(page.queryByText('Usuń notatkę')).not.toBeInTheDocument();
    });
  },
};

export const ScrollableContent: Story = {
  name: 'Z przewijanym body',
  args: {
    title: 'Szczegóły synchronizacji',
    icon: 'sym_r_sync',
    actions: [
      {
        id: 'close',
        label: 'Zamknij',
      },
      {
        id: 'retry',
        label: 'Ponów',
        icon: 'sym_r_refresh',
        gradient: true,
        closeOnClick: false,
      },
    ],
    style: {
      width: '560px',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dialog z dłuższą treścią. Body ma własny scroll, więc stopka i nagłówek pozostają czytelne nawet przy większej ilości contentu.',
      },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const actions = [
  { id: 'close', label: 'Zamknij' },
  { id: 'retry', label: 'Ponów', icon: 'sym_r_refresh', gradient: true, closeOnClick: false },
];
</script>

<template>
  <AbyssButton label="Pokaż szczegóły" @click="isOpen = true" />

  <AbyssDialog
    v-model="isOpen"
    title="Szczegóły synchronizacji"
    icon="sym_r_sync"
    :close-button="true"
    :actions="actions"
    :style="{ width: '560px' }"
  >
    <!-- długa treść dialogu -->
  </AbyssDialog>
</template>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton, AbyssDialog },
    setup() {
      const isOpen = ref(args.modelValue ?? false);
      const paragraphs = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        title: `Sekcja ${index + 1}`,
        text: 'Synchronizacja utrzymuje stan sesji, kolejki wysyłki i potwierdzenia urządzenia w jednym, przewijanym kontenerze dialogu.',
      }));

      watch(
        () => args.modelValue,
        (value) => {
          isOpen.value = value ?? false;
        },
      );

      function handleAction(action: AbyssDialogStoryAction) {
        void args.onAction(action);
      }

      function handleClose() {
        void args.onClose();
      }

      return {
        args,
        isOpen,
        paragraphs,
        handleAction,
        handleClose,
      };
    },
    template: `
      <div style="min-height: 120px; display: flex; align-items: center; justify-content: center;">
        <AbyssButton label="Pokaż szczegóły" @click="isOpen = true" />
      </div>

      <AbyssDialog
        v-model="isOpen"
        :title="args.title"
        :icon="args.icon"
        :close-button="args.closeButton"
        :close-button-icon="args.closeButtonIcon"
        :close-button-aria-label="args.closeButtonAriaLabel"
        :actions="args.actions"
        :class="args.class"
        :style="args.style"
        @action="handleAction"
        @close="handleClose"
      >
        <section v-for="paragraph in paragraphs" :key="paragraph.id">
          <strong>{{ paragraph.title }}</strong>
          <p style="margin: 8px 0 0;">{{ paragraph.text }}</p>
        </section>
      </AbyssDialog>
    `,
  }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /pokaż szczegóły/i });
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(trigger);

    await waitFor(async () => {
      await expect(page.getByText('Szczegóły synchronizacji')).toBeVisible();
      await expect(page.getByText('Sekcja 1')).toBeVisible();
      await expect(page.getByText('Sekcja 12')).toBeVisible();
    });

    await userEvent.click(page.getByRole('button', { name: /zamknij/i }));

    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(
        page.queryByText('Szczegóły synchronizacji'),
      ).not.toBeInTheDocument();
    });
  },
};

export const WithoutBody: Story = {
  name: 'Bez body',
  args: {
    title: 'Szybka akcja',
    icon: 'sym_r_bolt',
    actions: [
      {
        id: 'dismiss',
        label: 'Rozumiem',
        gradient: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Jeżeli domyślny slot nie zawiera treści, komponent pomija render body i zostawia tylko nagłówek ze stopką rozdzielone separatorem.',
      },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const actions = [{ id: 'dismiss', label: 'Rozumiem', gradient: true }];
</script>

<template>
  <AbyssButton label="Pokaż szybki dialog" @click="isOpen = true" />

  <AbyssDialog
    v-model="isOpen"
    title="Szybka akcja"
    icon="sym_r_bolt"
    :close-button="true"
    :actions="actions"
  />
</template>`,
      },
    },
  },
  render: (args) => ({
    components: { AbyssButton, AbyssDialog },
    setup() {
      const isOpen = ref(args.modelValue ?? false);

      watch(
        () => args.modelValue,
        (value) => {
          isOpen.value = value ?? false;
        },
      );

      function handleAction(action: AbyssDialogStoryAction) {
        void args.onAction(action);
      }

      function handleClose() {
        void args.onClose();
      }

      return {
        args,
        isOpen,
        handleAction,
        handleClose,
      };
    },
    template: `
      <div style="min-height: 120px; display: flex; align-items: center; justify-content: center;">
        <AbyssButton label="Pokaż szybki dialog" @click="isOpen = true" />
      </div>

      <AbyssDialog
        v-model="isOpen"
        :title="args.title"
        :icon="args.icon"
        :close-button="args.closeButton"
        :close-button-icon="args.closeButtonIcon"
        :close-button-aria-label="args.closeButtonAriaLabel"
        :actions="args.actions"
        :class="args.class"
        :style="args.style"
        @action="handleAction"
        @close="handleClose"
      />
    `,
  }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: /pokaż szybki dialog/i,
    });
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(trigger);

    await waitFor(async () => {
      await expect(page.getByText('Szybka akcja')).toBeVisible();
    });
    await expect(
      canvasElement.ownerDocument.body.querySelector('.abyss-dialog__body'),
    ).toBeNull();

    await userEvent.click(page.getByRole('button', { name: /rozumiem/i }));

    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(page.queryByText('Szybka akcja')).not.toBeInTheDocument();
    });
  },
};
