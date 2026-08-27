import type { Meta, StoryObj } from '@storybook/vue3';
import { reactive, ref } from 'vue';
import { expect, fn, userEvent, within } from 'storybook/test';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssForm from '@/components/ui/AbyssForm/AbyssForm.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import { INPUT_COLUMN_SIZE, INPUT_GRID_MAX_COLUMNS } from '@/components/ui/AbyssGrid/AbyssGrid.constants';
import AbyssInfo from '@/components/ui/AbyssInfo/AbyssInfo.vue';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import AbyssToggle from '@/components/ui/AbyssToggle/AbyssToggle.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

interface SettingsFormModel {
  displayName: string;
  email: string;
  notifications: boolean;
}

interface AuthFormModel {
  email: string;
  password: string;
}

const STORY_FRAME_STYLE = 'width: 100%; max-width: 720px;';

const meta = {
  title: 'UI/AbyssForm',
  component: AbyssForm,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper na `q-form` automatyzujący formularze aplikacji Maia. **Formularze nie wysyłają danych na endpoint** — cała obsługa odbywa się po stronie klienta (store, composables, lokalna walidacja).\n\n' +
          '### Zdarzenia\n\n' +
          '| Zdarzenie | Kiedy używać | Opis |\n' +
          '|-----------|--------------|------|\n' +
          '| `@update-form` | ustawienia, preferencje | Reaktywna synchronizacja ze store z debouncem (`sync`, domyślnie `true`). Każda zmiana pól emituje aktualny snapshot `modelValue`. |\n' +
          '| `@submit-form` | logowanie, rejestracja | Emitowane po poprawnej walidacji `q-form` i wysłaniu formularza (`type="submit"`). Bez automatycznego POST — handler aplikacji decyduje o akcji. |\n\n' +
          '### Wzorce zdarzeń\n\n' +
          '- **Ustawienia:** `sync` (domyślnie włączone) + `@update-form` → zapis do store z debouncem. Bez przycisku „Zapisz”.\n' +
          '- **Auth:** `:sync="false"` + `@submit-form` → jednorazowa akcja po submitcie (np. logowanie).\n\n' +
          '### Hasło\n\n' +
          'Ustawianie lub zmiana hasła **zawsze** odbywa się w dedykowanym `AbyssDialog`. W `AbyssCard` wiersz triggera to `AbyssGrid` z `AbyssInputLabel` + przycisk (wzór: story **AbyssInput → Wzorzec: zmiana hasła**). Pola hasła nie umieszczaj inline w karcie — wyjątek: logowanie (pole bieżącego hasła w formularzu auth).\n\n' +
          '### Układ formularza w `AbyssCard`\n\n' +
          'Formularz umieszczaj w `AbyssCard` (nagłówek z ikoną w `header-prepend`). Pola (`AbyssInput`, `AbyssSelect` itd.) **zawsze** w `AbyssForm` — nie natywny `<form>`, nie pola bezpośrednio w treści karty. **Nie owijaj ich ręcznie w `AbyssGrid`**. `AbyssInput` i `AbyssSelect` mają wewnętrzny `AbyssGrid` (etykieta + kontrolka) z tymi samymi parametrami co siatka przycisków.\n\n' +
          '**Bez custom styli:** w formularzach i standardowych kartach nie przekazuj `class` ani `style` na prymitywach Abyss — wyłącznie propsy. Custom stylowanie jest dozwolone w komponentach złożonych aplikacji (np. edytor), nie w widokach ustawień.\n\n' +
          '**Wspólna siatka formularza** — pola i przyciski używają tych samych stałych:\n\n' +
          '```html\n' +
          '<!-- wewnątrz AbyssInput / AbyssSelect (automatycznie) -->\n' +
          '<AbyssGrid :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS" :rowGap="ABYSS_INPUT_ROW_GAP" content-rows>\n' +
          '  <!-- etykieta + kontrolka -->\n' +
          '</AbyssGrid>\n\n' +
          '<!-- wiersz „Zmień hasło” w karcie (bez align="right" — etykieta | przycisk) -->\n' +
          '<AbyssGrid :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS" :rowGap="ABYSS_INPUT_ROW_GAP" content-rows>\n' +
          '  <AbyssInputLabel label="Hasło" />\n' +
          '  <AbyssButton label="Zmień hasło" @click="openChangePasswordDialog" />\n' +
          '</AbyssGrid>\n\n' +
          '<!-- przyciski akcji pod polami -->\n' +
          '<AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">\n' +
          '  <!-- przyciski -->\n' +
          '</AbyssGrid>\n' +
          '```\n\n' +
          'Import stałych: `import { INPUT_COLUMN_SIZE, INPUT_GRID_MAX_COLUMNS, ABYSS_INPUT_ROW_GAP } from \'@/components/ui/AbyssGrid/AbyssGrid.constants\'`.\n\n' +
          '`INPUT_COLUMN_SIZE` + `INPUT_GRID_MAX_COLUMNS` (wartość `2`) definiują **jeden wspólny próg łamania** (ok. 560px kontenera): dwie kolumny (etykieta | pole lub przycisk | przycisk), poniżej jedna kolumna.\n\n' +
          '**Przyciski główne** używają `size="big"` (domyślny rozmiar inputów) i `full-width`, żeby szerokość kolumny pokrywała się z polem.\n\n' +
          '#### Dobór wariantu przycisku\n\n' +
          '| Scenariusz | Wariant | Przykład |\n' +
          '|------------|---------|----------|\n' +
          '| Podstawowa akcja bez akcentu | `size="big"`, bez `gradient` | Zaloguj się, Zmień hasło (otwarcie dialogu) |\n' +
          '| Operacja ryzykowna | `gradient` + `gradient-colors="danger"` | Usuń konto |\n' +
          '| Wylogowanie | `gradient` + `gradient-colors="warning"` | Wyloguj |\n' +
          '| Opcja poboczna, bez przyciągania uwagi | `embedded` | Resetowanie hasła |\n\n' +
          'Pola w slocie binduj przez `v-model` do właściwości `modelValue`. Komponent udostępnia metody walidacji `q-form` przez `defineExpose` (`validate`, `resetValidation`, `submit`).',
      },
    },
  },
  argTypes: {
    sync: {
      control: 'boolean',
      description:
        'Włącza debounced `@update-form` przy każdej zmianie `modelValue`',
      table: { defaultValue: { summary: 'true' } },
    },
    debounce: {
      control: 'number',
      description: 'Opóźnienie debounce dla `@update-form` (ms)',
      table: { defaultValue: { summary: '300' } },
    },
  },
} satisfies Meta<typeof AbyssForm>;

export default meta;
type Story = StoryObj;

export const FormLayoutBasics: Story = {
  name: 'Podstawy układu',
  parameters: {
    docs: {
      description: {
        story:
          'Referencyjny układ: `AbyssCard` + `AbyssForm` + pola (wewnętrzny `AbyssGrid` w `AbyssInput`/`AbyssSelect`) + `AbyssGrid` (`align="right"`, `INPUT_COLUMN_SIZE`, `INPUT_GRID_MAX_COLUMNS`) wyłącznie z przyciskami `size="big"`. Pokazuje dobór wariantów: akcja podstawowa, `embedded`, `warning`, `danger`. Przyciski „Zmień hasło” i „Resetowanie hasła” otwierają dedykowany `AbyssDialog` — pola hasła nie są inline w karcie.',
      },
      source: {
        code: `<AbyssCard title="Konto">
  <template #header-prepend>
    <q-icon name="sym_r_person" size="20px" />
  </template>
  <template #content>
    <AbyssForm v-model="accountForm" @update-form="settingsStore.apply">
      <AbyssInput v-model="accountForm.displayName" label="Nazwa wyświetlana" />
      <AbyssInput v-model="accountForm.email" type="email" label="E-mail" />
      <AbyssToggle v-model="accountForm.notifications" label="Powiadomienia" full-width />
      <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
        <AbyssButton
          size="big"
          gradient
          gradient-colors="warning"
          icon="sym_r_logout"
          label="Wyloguj"
          full-width
          @click="handleLogout"
        />
        <AbyssButton
          size="big"
          icon="sym_r_password"
          label="Zmień hasło"
          full-width
          @click="openPasswordModal"
        />
      </AbyssGrid>
    </AbyssForm>
  </template>
</AbyssCard>

<AbyssCard title="Logowanie">
  <template #content>
    <AbyssForm v-model="authForm" :sync="false" @submit-form="handleLogin">
      <AbyssInput v-model="authForm.email" type="email" label="E-mail" />
      <AbyssInput v-model="authForm.password" type="password" label="Hasło" />
      <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
        <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
        <AbyssButton embedded label="Resetowanie hasła" @click="openForgotPassword" />
      </AbyssGrid>
    </AbyssForm>
  </template>
</AbyssCard>

<AbyssCard title="Usuń konto">
  <template #content>
    <AbyssInfo type="danger" icon="warning" title="Ostrzeżenie">
      Operacja jest nieodwracalna.
    </AbyssInfo>
    <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
      <AbyssButton
        size="big"
        gradient
        gradient-colors="danger"
        icon="sym_r_delete_forever"
        label="Usuń konto"
        full-width
        @click="openDeleteDialog"
      />
    </AbyssGrid>
  </template>
</AbyssCard>`,
      },
    },
  },
  render: () => ({
    components: {
      AbyssCard,
      AbyssForm,
      AbyssInput,
      AbyssToggle,
      AbyssGrid,
      AbyssButton,
      AbyssInfo,
    },
    setup() {
      const accountForm = reactive<SettingsFormModel>({
        displayName: 'Maia',
        email: 'user@example.com',
        notifications: true,
      });
      const authForm = reactive<AuthFormModel>({
        email: '',
        password: '',
      });

      const onUpdateForm = fn();
      const onSubmitForm = fn();
      const onChangePassword = fn();
      const onLogout = fn();
      const onForgotPassword = fn();
      const onDeleteAccount = fn();

      return {
        accountForm,
        authForm,
        INPUT_COLUMN_SIZE,
        INPUT_GRID_MAX_COLUMNS,
        storyFrameStyle: STORY_FRAME_STYLE,
        onUpdateForm,
        onSubmitForm,
        onChangePassword,
        onLogout,
        onForgotPassword,
        onDeleteAccount,
      };
    },
    template: `
      <div
        :style="[storyFrameStyle, { display: 'flex', flexDirection: 'column', gap: '16px' }]"
      >
        <AbyssCard title="Konto">
          <template #header-prepend>
            <q-icon name="sym_r_person" size="20px" />
          </template>
          <template #content>
            <AbyssForm
              v-model="accountForm"
              :debounce="200"
              @update-form="onUpdateForm"
            >
              <AbyssInput
                v-model="accountForm.displayName"
                label="Nazwa wyświetlana"
              />
              <AbyssInput
                v-model="accountForm.email"
                type="email"
                label="E-mail"
                autocomplete="email"
              />
              <AbyssToggle
                v-model="accountForm.notifications"
                label="Powiadomienia e-mail"
                full-width
              />
              <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
                <AbyssButton
                  size="big"
                  gradient
                  gradient-colors="warning"
                  icon="sym_r_logout"
                  label="Wyloguj"
                  full-width
                  data-testid="logout"
                  @click="onLogout"
                />
                <AbyssButton
                  size="big"
                  icon="sym_r_password"
                  label="Zmień hasło"
                  full-width
                  data-testid="change-password"
                  @click="onChangePassword"
                />
              </AbyssGrid>
            </AbyssForm>
          </template>
        </AbyssCard>

        <AbyssCard title="Logowanie">
          <template #header-prepend>
            <q-icon name="sym_r_login" size="20px" />
          </template>
          <template #content>
            <AbyssForm
              v-model="authForm"
              :sync="false"
              @submit-form="onSubmitForm"
            >
              <AbyssInput
                v-model="authForm.email"
                type="email"
                label="E-mail"
                autocomplete="email"
                data-testid="login-email"
              />
              <AbyssInput
                v-model="authForm.password"
                type="password"
                label="Hasło"
                autocomplete="current-password"
                data-testid="login-password"
              />
              <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
                <AbyssButton
                  type="submit"
                  size="big"
                  label="Zaloguj się"
                  full-width
                  data-testid="login-submit"
                />
                <AbyssButton
                  embedded
                  label="Resetowanie hasła"
                  data-testid="forgot-password"
                  @click="onForgotPassword"
                />
              </AbyssGrid>
            </AbyssForm>
          </template>
        </AbyssCard>

        <AbyssCard title="Usuń konto">
          <template #header-prepend>
            <q-icon name="sym_r_delete_forever" size="20px" />
          </template>
          <template #content>
            <AbyssInfo type="danger" icon="warning" title="Ostrzeżenie">
              Operacja jest nieodwracalna. Wszystkie dane zostaną trwale usunięte.
            </AbyssInfo>
            <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
              <AbyssButton
                size="big"
                gradient
                gradient-colors="danger"
                icon="sym_r_delete_forever"
                label="Usuń konto"
                full-width
                data-testid="delete-account"
                @click="onDeleteAccount"
              />
            </AbyssGrid>
          </template>
        </AbyssCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const changePassword = canvas.getByTestId('change-password');
    await expect(changePassword).toBeVisible();
    await expect(changePassword).toHaveClass('size-big');
    await expect(changePassword).not.toHaveClass('gradient');

    const logout = canvas.getByTestId('logout');
    await expect(logout).toHaveClass('gradient');
    await expect(logout).toHaveClass('size-big');

    const forgotPassword = canvas.getByTestId('forgot-password');
    await expect(forgotPassword).toHaveClass('embedded');

    const deleteAccount = canvas.getByTestId('delete-account');
    await expect(deleteAccount).toHaveClass('gradient');

    await userEvent.type(canvas.getByTestId('login-email'), 'demo@maia.app');
    await userEvent.type(canvas.getByTestId('login-password'), 'secret');
    await userEvent.click(canvas.getByTestId('login-submit'));
  },
};

export const SettingsSync: Story = {
  name: 'Synchronizacja ustawień',
  parameters: {
    docs: {
      description: {
        story:
          'Formularz ustawień bez przycisku zapisu — `@update-form` synchronizuje store z debouncem po każdej zmianie pola.',
      },
      source: {
        code: `<AbyssCard title="Preferencje">
  <template #content>
    <AbyssForm v-model="form" @update-form="settingsStore.apply">
      <AbyssInput v-model="form.displayName" label="Nazwa wyświetlana" />
      <AbyssToggle v-model="form.notifications" label="Powiadomienia" full-width />
    </AbyssForm>
  </template>
</AbyssCard>`,
      },
    },
  },
  render: () => ({
    components: { AbyssCard, AbyssForm, AbyssInput, AbyssToggle },
    setup() {
      const form = reactive<Pick<SettingsFormModel, 'displayName' | 'notifications'>>({
        displayName: 'Maia',
        notifications: true,
      });
      const lastUpdate = ref<typeof form | null>(null);
      const onUpdateForm = fn((values: typeof form) => {
        lastUpdate.value = values;
      });

      return { form, lastUpdate, onUpdateForm, storyFrameStyle: STORY_FRAME_STYLE };
    },
    template: `
      <div :style="storyFrameStyle">
        <AbyssCard title="Preferencje">
          <template #header-prepend>
            <q-icon name="sym_r_tune" size="20px" />
          </template>
          <template #content>
            <AbyssForm v-model="form" :debounce="200" @update-form="onUpdateForm">
              <AbyssInput v-model="form.displayName" label="Nazwa wyświetlana" />
              <AbyssToggle
                v-model="form.notifications"
                label="Powiadomienia e-mail"
                full-width
              />
            </AbyssForm>
            <pre
              v-if="lastUpdate"
              style="margin: 12px 0 0; font-size: 12px; white-space: pre-wrap;"
              data-testid="last-update"
            >{{ JSON.stringify(lastUpdate, null, 2) }}</pre>
          </template>
        </AbyssCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Nazwa wyświetlana');

    await userEvent.clear(input);
    await userEvent.type(input, 'Test');

    const updated = await canvas.findByTestId('last-update', undefined, {
      timeout: 800,
    });
    await expect(updated).toHaveTextContent('"displayName": "Test"');
  },
};

export const AuthSubmit: Story = {
  name: 'Logowanie (submit)',
  parameters: {
    docs: {
      description: {
        story:
          'Formularz auth w karcie: `sync` wyłączone, `@submit-form` po submitcie. Przyciski w `AbyssGrid` wyrównanym do prawej.',
      },
      source: {
        code: `<AbyssCard title="Logowanie">
  <template #content>
    <AbyssForm v-model="form" :sync="false" @submit-form="handleLogin">
      <AbyssInput v-model="form.email" type="email" label="E-mail" />
      <AbyssInput v-model="form.password" type="password" label="Hasło" />
      <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
        <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
        <AbyssButton embedded label="Resetowanie hasła" @click="openForgotPassword" />
      </AbyssGrid>
    </AbyssForm>
  </template>
</AbyssCard>`,
      },
    },
  },
  render: () => ({
    components: { AbyssCard, AbyssForm, AbyssInput, AbyssButton, AbyssGrid },
    setup() {
      const form = reactive<AuthFormModel>({
        email: '',
        password: '',
      });
      const submitted = ref<AuthFormModel | null>(null);
      const onSubmitForm = fn((values: AuthFormModel) => {
        submitted.value = values;
      });

      return {
        form,
        submitted,
        onSubmitForm,
        INPUT_COLUMN_SIZE,
        INPUT_GRID_MAX_COLUMNS,
        storyFrameStyle: STORY_FRAME_STYLE,
      };
    },
    template: `
      <div :style="storyFrameStyle">
        <AbyssCard title="Logowanie">
          <template #header-prepend>
            <q-icon name="sym_r_login" size="20px" />
          </template>
          <template #content>
            <AbyssForm v-model="form" :sync="false" @submit-form="onSubmitForm">
              <AbyssInput
                v-model="form.email"
                type="email"
                label="E-mail"
                autocomplete="email"
              />
              <AbyssInput
                v-model="form.password"
                type="password"
                label="Hasło"
                autocomplete="current-password"
              />
              <AbyssGrid align="right" :column-size="INPUT_COLUMN_SIZE" :max-columns="INPUT_GRID_MAX_COLUMNS">
                <AbyssButton type="submit" size="big" label="Zaloguj się" full-width />
              </AbyssGrid>
            </AbyssForm>
            <pre
              v-if="submitted"
              style="margin: 12px 0 0; font-size: 12px; white-space: pre-wrap;"
              data-testid="submitted"
            >{{ JSON.stringify(submitted, null, 2) }}</pre>
          </template>
        </AbyssCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('E-mail'), 'user@example.com');
    await userEvent.type(canvas.getByLabelText('Hasło'), 'secret');
    await userEvent.click(canvas.getByRole('button', { name: 'Zaloguj się' }));

    await expect(canvas.getByTestId('submitted')).toHaveTextContent(
      'user@example.com',
    );
  },
};
