import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, fn, waitFor } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssDialog from '@/components/ui/AbyssDialog/AbyssDialog.vue';
import AbyssSwitcher from '@/components/ui/AbyssSwitcher/AbyssSwitcher.vue';
import type { GradientColorsInput } from '@/defines/semantic-gradients';
import { withAbyssBackgroundDialogScope } from '@/stories/StoryDialogScopeDecorator';

type AbyssDialogStoryAction = {
  id: string;
  label?: string;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  size?: 'small' | 'medium' | 'big';
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  flat?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: GradientColorsInput;
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
    flat: true,
    size: 'medium',
  },
  {
    id: 'confirm',
    label: 'Usuń',
    icon: 'sym_r_delete',
    flat: true,
    gradient: true,
    gradientColors: 'danger',
    size: 'medium',
  },
];

const meta: Meta<AbyssDialogStoryArgs> = {
  title: 'UI/AbyssDialog',
  component: AbyssDialog,
  tags: ['autodocs'],
  decorators: [withAbyssBackgroundDialogScope],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog Abyss oparty o q-dialog. Nagłówek i stopka używają tej samej konwencji slotów co AbyssCard: ' +
          'header-prepend, header, header-append, slot `navigation` (taby poza scrollowym body) ' +
          'oraz footer-prepend, footer, footer-append. ' +
          'Props title, icon, closeButton i actions pozostają wspierane jako domyślna zawartość slotów.\n\n' +
          '**Scroll:** jedynym pionowym kontenerem przewijania jest `abyss-dialog__body`. ' +
          'Slot `navigation` (taby) jest poza body. Treść w body nie może mieć własnych pionowych scrollbarów.\n\n' +
          '**Przyciski w stopce** — zgodnie z konwencją AbyssButton:\n' +
          '- każdy przycisk w stopce dialogu jest `flat`;\n' +
          '- anulowanie: samo `flat`, bez gradientu;\n' +
          '- akcja operacyjna: `flat` + `gradient` + `gradientColors` (`danger` dla usunięcia, `info` dla zapisu/ponowienia, `success` dla potwierdzenia, `warning` dla istotnych zmian);\n' +
          '- pojedyncza akcja w dialogu bez pary decyzyjnej — `flat` bez gradientu.',
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
      description:
        'Tekst wyświetlany w nagłówku dialogu. Jest też nazwą dostępną powierzchni (`aria-label` na `role="dialog"`).',
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
      description: 'Pokazuje przycisk zamknięcia w header-append.',
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
      description:
        'Nadpisuje nazwę dostępną przycisku zamknięcia. Domyślnie komponent bierze ją z warstwy i18n Abyss (`ui.dialog.close`) — aplikacja nie musi tłumaczyć elementu wewnętrznego design systemu.',
      table: {
        defaultValue: { summary: "t('ui.dialog.close')" },
        type: { summary: 'string' },
      },
    },
    actions: {
      control: 'object',
      description:
        'Lista akcji renderowanych w footer-append jako grupa AbyssButton.',
      table: {
        defaultValue: { summary: '[]' },
        type: { summary: 'AbyssDialogAction[]' },
      },
    },
    class: {
      control: 'text',
      description:
        'Dodatkowe klasy CSS panelu dialogu. Dozwolone w komponentach złożonych. Nie stosuj w standardowych dialogach formularzowych.',
      table: {
        defaultValue: { summary: '""' },
        type: { summary: 'string | object | array' },
      },
    },
    style: {
      control: 'object',
      description:
        'Dodatkowe style CSS panelu dialogu. Dozwolone w komponentach złożonych. Nie stosuj w standardowych dialogach formularzowych.',
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
    modelValue: true,
    title: 'Usuń notatkę',
    icon: 'sym_r_warning',
    closeButton: true,
    closeButtonIcon: 'sym_r_close',
    closeButtonAriaLabel: '',
    actions: baseActions,
    class: '',
    style: '',
    onAction: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const openDialogTriggerStyle =
  'display: flex; align-items: center; justify-content: center; min-height: 120px;';

export const Default: Story = {
  name: 'Domyślny',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog potwierdzenia usunięcia: Anuluj (`flat`) oraz Usuń (`flat` + `gradient` + `danger`).',
      },
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(true);

const actions = [
  { id: 'cancel', label: 'Anuluj', flat: true, size: 'medium' },
  {
    id: 'confirm',
    label: 'Usuń',
    icon: 'sym_r_delete',
    flat: true,
    gradient: true,
    gradientColors: 'danger',
    size: 'medium',
  },
];
</script>

<template>
  <AbyssButton v-if="!isOpen" label="Otwórz dialog" @click="isOpen = true" />

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
  render: () => ({
    components: { AbyssDialog, AbyssButton, AbyssButtonGroup },
    setup() {
      const isOpen = ref(true);

      return { isOpen };
    },
    template: `
      <div>
        <div v-if="!isOpen" style="${openDialogTriggerStyle}">
          <AbyssButton label="Otwórz dialog" @click="isOpen = true" />
        </div>

        <AbyssDialog
        v-model="isOpen"
        title="Usuń notatkę"
        icon="sym_r_warning"
        close-button
      >
        <p>Czy na pewno chcesz usunąć wybraną notatkę?</p>

        <template #footer-append>
          <AbyssButtonGroup>
            <AbyssButton
              label="Anuluj"
              flat
              size="medium"
              @click="isOpen = false"
            />
            <AbyssButton
              label="Usuń"
              icon="sym_r_delete"
              flat
              gradient
              gradient-colors="danger"
              size="medium"
              @click="isOpen = false"
            />
          </AbyssButtonGroup>
        </template>
      </AbyssDialog>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await waitFor(async () => {
      await expect(canvas.getByText('Usuń notatkę')).toBeVisible();
      await expect(
        canvas.getByText('Czy na pewno chcesz usunąć wybraną notatkę?'),
      ).toBeVisible();
      await expect(canvas.getByRole('button', { name: 'Anuluj' })).toBeVisible();
      const deleteButton = canvas.getByRole('button', { name: 'Usuń' });
      await expect(deleteButton).toBeVisible();
      await expect(deleteButton).toHaveClass('flat');
      await expect(deleteButton).toHaveClass('gradient');
    });
  },
};

export const WithFooterPrepend: Story = {
  name: 'Z tekstem informacyjnym w stopce',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog z tekstem informacyjnym w slocie footer-prepend po lewej stronie stopki.',
      },
      source: {
        code: `<AbyssButton v-if="!isOpen" label="Otwórz dialog" @click="isOpen = true" />

<AbyssDialog v-model="isOpen" title="Usuń notatkę" icon="sym_r_warning" close-button>
  <p>Czy na pewno chcesz usunąć wybraną notatkę?</p>

  <template #footer-prepend>
    Tej operacji nie można cofnąć.
  </template>
  <template #footer-append>
    <AbyssButtonGroup>
      <AbyssButton label="Anuluj" flat size="medium" @click="isOpen = false" />
      <AbyssButton
        label="Usuń"
        icon="sym_r_delete"
        flat
        gradient
        gradient-colors="danger"
        size="medium"
        @click="isOpen = false"
      />
    </AbyssButtonGroup>
  </template>
</AbyssDialog>`,
      },
    },
  },
  render: () => ({
    components: { AbyssDialog, AbyssButton, AbyssButtonGroup },
    setup() {
      const isOpen = ref(true);

      return { isOpen };
    },
    template: `
      <div>
        <div v-if="!isOpen" style="${openDialogTriggerStyle}">
          <AbyssButton label="Otwórz dialog" @click="isOpen = true" />
        </div>

        <AbyssDialog
          v-model="isOpen"
          title="Usuń notatkę"
          icon="sym_r_warning"
          close-button
        >
          <p>Czy na pewno chcesz usunąć wybraną notatkę?</p>

          <template #footer-prepend>
            Tej operacji nie można cofnąć.
          </template>
          <template #footer-append>
            <AbyssButtonGroup>
              <AbyssButton
                label="Anuluj"
                flat
                size="medium"
                @click="isOpen = false"
              />
              <AbyssButton
                label="Usuń"
                icon="sym_r_delete"
                flat
                gradient
                gradient-colors="danger"
                size="medium"
                @click="isOpen = false"
              />
            </AbyssButtonGroup>
          </template>
        </AbyssDialog>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    await waitFor(async () => {
      await expect(canvas.getByText('Usuń notatkę')).toBeVisible();
      await expect(
        canvas.getByText('Tej operacji nie można cofnąć.'),
      ).toBeVisible();
      await expect(canvas.getByRole('button', { name: 'Anuluj' })).toBeVisible();
      const deleteButton = canvas.getByRole('button', { name: 'Usuń' });
      await expect(deleteButton).toBeVisible();
      await expect(deleteButton).toHaveClass('flat');
      await expect(deleteButton).toHaveClass('gradient');
    });
  },
};

export const WithNavigationTabs: Story = {
  name: 'Z nawigacją (taby)',
  parameters: {
    docs: {
      description: {
        story:
          'Slot `navigation` trzyma taby poza przewijanym body — nagłówek i przełącznik pozostają widoczne przy długiej treści.',
      },
      source: {
        code: `<AbyssDialog v-model="isOpen" title="Wynik zadania" icon="sym_r_output" close-button>
  <template #navigation>
    <AbyssSwitcher v-model="activeTab" :options="tabOptions" />
  </template>

  <section v-for="section in sections" :key="section.id">
    <strong>{{ section.title }}</strong>
    <p>{{ section.text }}</p>
  </section>
</AbyssDialog>`,
      },
    },
  },
  render: () => ({
    components: { AbyssDialog, AbyssButton, AbyssSwitcher },
    setup() {
      const isOpen = ref(true);
      const activeTab = ref('summary');
      const tabOptions = [
        { name: 'summary', label: 'Podsumowanie', icon: 'sym_r_summarize' },
        { name: 'details', label: 'Szczegóły', icon: 'sym_r_list' },
      ];
      const sections = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Sekcja ${index + 1}`,
        text: 'Treść panelu przewijana niezależnie od nawigacji tabsów nad body.',
      }));

      return { isOpen, activeTab, tabOptions, sections };
    },
    template: `
      <div>
        <div v-if="!isOpen" style="${openDialogTriggerStyle}">
          <AbyssButton label="Otwórz dialog" @click="isOpen = true" />
        </div>

        <AbyssDialog
          v-model="isOpen"
          title="Wynik zadania"
          icon="sym_r_output"
          close-button
        >
          <template #navigation>
            <AbyssSwitcher v-model="activeTab" :options="tabOptions" />
          </template>

          <section v-for="section in sections" :key="section.id">
            <strong>{{ section.title }}</strong>
            <p style="margin: 8px 0 0;">{{ section.text }}</p>
          </section>
        </AbyssDialog>
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement }) => {
    await waitFor(async () => {
      await expect(canvas.getByText('Wynik zadania')).toBeVisible();
      await expect(canvas.getByRole('radio', { name: /Podsumowanie/i })).toBeVisible();
      await expect(canvas.getByText('Sekcja 1')).toBeVisible();
    });

    const navigation = canvasElement.querySelector('.abyss-dialog__navigation');
    const body = canvasElement.querySelector('.abyss-dialog__body');

    await expect(navigation).toBeTruthy();
    await expect(body).toBeTruthy();
    await expect(navigation?.contains(body ?? null)).toBe(false);
  },
};

export const ScrollableContent: Story = {
  name: 'Z przewijanym body',
  args: {
    modelValue: true,
    title: 'Szczegóły synchronizacji',
    icon: 'sym_r_sync',
    closeButton: true,
    actions: [
      {
        id: 'close',
        label: 'Zamknij',
        flat: true,
        size: 'medium',
      },
      {
        id: 'retry',
        label: 'Ponów',
        icon: 'sym_r_refresh',
        flat: true,
        gradient: true,
        gradientColors: 'info',
        size: 'medium',
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
          'Dialog z dłuższą treścią. Body ma własny scroll, więc stopka i nagłówek pozostają czytelne nawet przy większej ilości contentu. Akcja Ponów używa `flat` + `gradient` + `info`.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssDialog, AbyssButton },
    setup() {
      const isOpen = ref(true);
      const paragraphs = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        title: `Sekcja ${index + 1}`,
        text: 'Synchronizacja utrzymuje stan sesji, kolejki wysyłki i potwierdzenia urządzenia w jednym, przewijanym kontenerze dialogu.',
      }));

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
      <div>
        <div v-if="!isOpen" style="${openDialogTriggerStyle}">
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
        <section v-for="paragraph in paragraphs" :key="paragraph.id">
          <strong>{{ paragraph.title }}</strong>
          <p style="margin: 8px 0 0;">{{ paragraph.text }}</p>
        </section>
      </AbyssDialog>
      </div>
    `,
  }),
  play: async ({ args, canvas, userEvent }) => {
    await waitFor(async () => {
      await expect(canvas.getByText('Szczegóły synchronizacji')).toBeVisible();
      await expect(canvas.getByText('Sekcja 1')).toBeVisible();
      await expect(canvas.getByText('Sekcja 12')).toBeVisible();
    });

    await userEvent.click(canvas.getByRole('button', { name: /zamknij/i }));

    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(
        canvas.queryByText('Szczegóły synchronizacji'),
      ).not.toBeInTheDocument();
      await expect(
        canvas.getByRole('button', { name: /otwórz dialog/i }),
      ).toBeVisible();
    });
  },
};

export const WithoutBody: Story = {
  name: 'Bez body',
  args: {
    modelValue: true,
    title: 'Szybka akcja',
    icon: 'sym_r_bolt',
    closeButton: true,
    actions: [
      {
        id: 'dismiss',
        label: 'Rozumiem',
        flat: true,
        size: 'medium',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Jeżeli domyślny slot nie zawiera treści, komponent pomija render body i zostawia tylko nagłówek ze stopką rozdzielone separatorem.',
      },
    },
  },
  render: (args) => ({
    components: { AbyssDialog, AbyssButton },
    setup() {
      const isOpen = ref(true);

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
      <div>
        <div v-if="!isOpen" style="${openDialogTriggerStyle}">
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
      />
      </div>
    `,
  }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await waitFor(async () => {
      await expect(canvas.getByText('Szybka akcja')).toBeVisible();
    });
    await expect(
      canvasElement.querySelector('.abyss-dialog__body'),
    ).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: /rozumiem/i }));

    await expect(args.onAction).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(canvas.queryByText('Szybka akcja')).not.toBeInTheDocument();
      await expect(
        canvas.getByRole('button', { name: /otwórz dialog/i }),
      ).toBeVisible();
    });
  },
};
