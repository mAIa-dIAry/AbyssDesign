import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, userEvent, within } from 'storybook/test';
import AbyssInfo from '@/components/ui/AbyssInfo/AbyssInfo.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import AbyssToggle from '@/components/ui/AbyssToggle/AbyssToggle.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssInfo> = {
  title: 'UI/AbyssInfo',
  component: AbyssInfo,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent informacyjny AbyssInfo służy do wyświetlania komunikatów kontekstowych: ' +
          'informacji, ostrzeżeń, błędów, potwierdzeń i hintów. ' +
          'Posiada **wymaganą** ikonę, **wymaganą** treść w domyślnym slocie oraz opcjonalny tytuł. ' +
          'Tło używa semantycznego gradientu (`info`, `warning`, `danger`, `success`, `hint`); ' +
          'lewa kolumna z ikoną pokazuje gradient bez overlay, prawy panel ma półprzezroczysty overlay z białym tytułem i treścią.\n\n' +
          '> Użycie bez ikony lub bez treści w slocie jest niedozwolone. ' +
          'Jeśli komunikat nie wymaga calloutu z ikoną, używaj zwykłego tekstu zamiast `AbyssInfo`.\n\n' +
          '### Zalecane ikony i etykiety\n\n' +
          '> Ikony poniżej należą do zestawu Material Symbols, ale **nie posiadają wariantu `sym_r_`** — ' +
          'należy używać ich bez prefixu.\n\n' +
          '| `type`    | `icon`         | Opcjonalna etykieta (`title`)      |\n' +
          '|-----------|----------------|------------------------------------|\n' +
          "| `info`    | `info`         | `t('common.labels.info')`          |\n" +
          "| `warning` | `warning`      | `t('common.labels.warning')`       |\n" +
          "| `danger`  | `error`        | `t('common.labels.error')`         |\n" +
          "| `success` | `check_circle` | `t('common.labels.success')`       |\n" +
          "| `hint`    | `lightbulb`    | *(opcjonalnie)*                    |\n\n" +
          '```html\n' +
          '<AbyssInfo type="info"    icon="info"         :title="t(\'common.labels.info\')">\n' +
          '<AbyssInfo type="warning" icon="warning"      :title="t(\'common.labels.warning\')">\n' +
          '<AbyssInfo type="danger"  icon="error"        :title="t(\'common.labels.error\')">\n' +
          '<AbyssInfo type="success" icon="check_circle" :title="t(\'common.labels.success\')">\n' +
          '```',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'warning', 'danger', 'success', 'hint'],
      description: 'Typ komunikatu determinujący semantyczny gradient tła',
      table: {
        defaultValue: { summary: 'info' },
        type: {
          summary: "'info' | 'warning' | 'danger' | 'success' | 'hint'",
        },
      },
    },
    title: {
      control: 'text',
      description:
        'Opcjonalny tytuł wyświetlany pogrubioną białą czcionką w panelu z overlay',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    icon: {
      control: 'text',
      description: 'Wymagana nazwa ikony Material Symbols Rounded (np. info)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssInfo>;

export const Default: Story = {
  name: 'Domyślny (info)',
  args: {
    type: 'info',
    title: 'Informacja',
    icon: 'info',
  },
  render: (args) => ({
    components: { AbyssInfo },
    setup() {
      return { args };
    },
    template: `
      <AbyssInfo v-bind="args">
        To jest przykładowy komunikat informacyjny. Może zawierać dłuższy tekst.
      </AbyssInfo>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Podstawowy komunikat informacyjny z tytułem, ikoną i treścią.',
      },
      source: {
        code: `<AbyssInfo type="info" title="Informacja" icon="info">
  <!-- treść komunikatu -->
</AbyssInfo>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Informacja');
    await expect(title).toBeVisible();

    const content = canvas.getByText(/przykładowy komunikat/);
    await expect(content).toBeVisible();
  },
};

export const AllTypes: Story = {
  name: 'Wszystkie typy',
  render: () => ({
    components: { AbyssInfo },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 360px;">
        <AbyssInfo type="info" title="Informacja" icon="info">
          Standardowy komunikat informacyjny.
        </AbyssInfo>
        <AbyssInfo type="success" title="Sukces" icon="check_circle">
          Operacja zakończyła się pomyślnie.
        </AbyssInfo>
        <AbyssInfo type="warning" title="Ostrzeżenie" icon="warning">
          Sprawdź dane przed kontynuowaniem.
        </AbyssInfo>
        <AbyssInfo type="danger" title="Błąd" icon="error">
          Wystąpił błąd — operacja nie powiodła się.
        </AbyssInfo>
        <AbyssInfo type="hint" title="Hint" icon="lightbulb">
          Dodatkowa informacja lub wskazówka bez kontekstu ważności.
        </AbyssInfo>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Porównanie wszystkich dostępnych typów komunikatów.',
      },
      source: {
        code: `<AbyssInfo type="info" title="Informacja" icon="info">
  <!-- treść -->
</AbyssInfo>

<AbyssInfo type="success" title="Sukces" icon="check_circle">
  <!-- treść -->
</AbyssInfo>

<AbyssInfo type="warning" title="Ostrzeżenie" icon="warning">
  <!-- treść -->
</AbyssInfo>

<AbyssInfo type="danger" title="Błąd" icon="error">
  <!-- treść -->
</AbyssInfo>

<AbyssInfo type="hint" title="Hint" icon="lightbulb">
  <!-- treść -->
</AbyssInfo>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const successTitle = canvas.getByText('Sukces');
    await expect(successTitle).toBeVisible();

    const dangerTitle = canvas.getByText('Błąd');
    await expect(dangerTitle).toBeVisible();
  },
};

export const WithoutTitle: Story = {
  name: 'Bez tytułu',
  args: {
    type: 'hint',
    icon: 'lightbulb',
  },
  render: (args) => ({
    components: { AbyssInfo },
    setup() {
      return { args };
    },
    template: `
      <AbyssInfo v-bind="args">
        Krótki komunikat bez osobnego tytułu — treść w slocie wystarczy.
      </AbyssInfo>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Tytuł jest opcjonalny. Wymagane pozostają ikona i treść w domyślnym slocie.',
      },
      source: {
        code: `<AbyssInfo type="hint" icon="lightbulb">
  Krótki komunikat bez osobnego tytułu.
</AbyssInfo>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const content = canvas.getByText(/Krótki komunikat/);
    await expect(content).toBeVisible();
  },
};

export const InFormContext: Story = {
  name: 'W kontekście formularza',
  render: () => ({
    components: { AbyssCard, AbyssInput, AbyssToggle, AbyssInfo },
    setup() {
      const name = ref('');
      const password = ref('');
      const notifications = ref(false);

      const nameError = ref(false);
      const nameErrorMsg = ref('');

      function validate() {
        if (name.value.trim().length < 3) {
          nameError.value = true;
          nameErrorMsg.value = 'Nazwa musi mieć co najmniej 3 znaki.';
        } else {
          nameError.value = false;
          nameErrorMsg.value = '';
        }
      }

      return {
        name,
        password,
        notifications,
        nameError,
        nameErrorMsg,
        validate,
      };
    },
    template: `
      <AbyssCard title="Ustawienia konta" style="width: 360px;">
        <template #content>
          <div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
            <AbyssInput
              v-model="name"
              label="Nazwa użytkownika"
              placeholder="Wpisz nazwę…"
              :error="nameError"
              :error-message="nameErrorMsg"
              @blur="validate"
            />
            <AbyssInput
              v-model="password"
              label="Hasło"
              type="password"
              placeholder="Minimum 8 znaków"
            />
            <AbyssToggle
              v-model="notifications"
              label="Powiadomienia e-mail"
            />
            <AbyssInfo
              v-if="notifications"
              type="info"
              icon="info"
              title="Powiadomienia włączone"
            >
              Będziesz otrzymywać e-maile o aktywności na koncie.
            </AbyssInfo>
            <AbyssInfo
              v-if="nameError"
              type="danger"
              icon="error"
              title="Nieprawidłowa nazwa"
            >
              {{ nameErrorMsg }}
            </AbyssInfo>
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'AbyssInfo jako komunikat kontekstowy wewnątrz formularza — pojawia się reaktywnie po włączeniu przełącznika lub błędzie walidacji.',
      },
      source: {
        code: `<script setup>
import { ref } from 'vue';

const name = ref('');
const password = ref('');
const notifications = ref(false);
const nameError = ref(false);
const nameErrorMsg = ref('');

function validate() {
  if (name.value.trim().length < 3) {
    nameError.value = true;
    nameErrorMsg.value = 'Nazwa musi mieć co najmniej 3 znaki.';
  } else {
    nameError.value = false;
    nameErrorMsg.value = '';
  }
}
</script>

<template>
  <AbyssCard title="Ustawienia konta">
    <template #content>
      <AbyssInput v-model="name" label="Nazwa użytkownika" :error="nameError" :error-message="nameErrorMsg" @blur="validate" />
      <AbyssInput v-model="password" label="Hasło" type="password" />
      <AbyssToggle v-model="notifications" label="Powiadomienia e-mail" />

      <AbyssInfo v-if="notifications" type="info" icon="info" title="Powiadomienia włączone">
        Będziesz otrzymywać e-maile o aktywności na koncie.
      </AbyssInfo>
      <AbyssInfo v-if="nameError" type="danger" icon="error" title="Nieprawidłowa nazwa">
        {{ nameErrorMsg }}
      </AbyssInfo>
    </template>
  </AbyssCard>
</template>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Toggle włącza powiadomienia → pojawia się AbyssInfo
    const toggle = canvasElement.querySelector('.q-toggle__inner');
    await userEvent.click(toggle!);
    const infoTitle = await canvas.findByText('Powiadomienia włączone');
    await expect(infoTitle).toBeVisible();

    // Wpisanie zbyt krótkiej nazwy i blur → pojawia się komunikat danger
    const nameInput = canvas.getByPlaceholderText('Wpisz nazwę…');
    await userEvent.type(nameInput, 'ab');
    await userEvent.tab();
    const errorTitle = await canvas.findByText('Nieprawidłowa nazwa');
    await expect(errorTitle).toBeVisible();
  },
};
