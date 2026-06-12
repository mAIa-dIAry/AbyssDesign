import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from 'storybook/test';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import { withAbyssBackground } from '@/stories/AbyssBackgroundDecorator';

const meta: Meta<typeof AbyssCard> = {
  title: 'UI/AbyssCard',
  component: AbyssCard,
  tags: ['autodocs'],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          'Komponent karty (AbyssCard) służy do wyświetlania zawartości w kontenerze z opcjonalnym nagłówkiem. ' +
          'Oferuje elastyczność poprzez sloty dla nagłówka (header, header-prepend, header-append), głównej treści (content) oraz stopki (footer).',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Tytuł wyświetlany w nagłówku karty',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssCard>;

export const Default: Story = {
  name: 'Domyślny',
  args: {
    title: 'Przykładowa karta',
  },
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #content>
          <div>
            Treść karty
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Podstawowa karta z tytułem i treścią. Separator pojawia się automatycznie między nagłówkiem a contentem.',
      },
      source: {
        code: `<AbyssCard title="Przykładowa karta">
  <template #content>
    <div>
      Treść karty
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Przykładowa karta');
    await expect(title).toBeVisible();
    const content = canvas.getByText('Treść karty');
    await expect(content).toBeVisible();
  },
};

export const WithoutTitle: Story = {
  name: 'Bez tytułu',
  args: {},
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #content>
          <div>
            Karta bez nagłówka - wyświetla tylko treść bez separatora.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta bez tytułu i nagłówka - wyświetla tylko zawartość slotu content.',
      },
      source: {
        code: `<AbyssCard>
  <template #content>
    <div>
      Karta bez nagłówka - wyświetla tylko treść bez separatora.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas, canvasElement }) => {
    const content = canvas.getByText(
      'Karta bez nagłówka - wyświetla tylko treść bez separatora.',
    );
    await expect(content).toBeVisible();
    const header = canvasElement.querySelector('.abyss-card-header');
    await expect(header).toBeNull();
  },
};

export const QuickSetup: Story = {
  name: 'Szybka konfiguracja',
  args: {
    title: 'Szybka karta',
  },
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <div>
          Prosta karta z tytułem i treścią, idealna do szybkiego użycia.
        </div>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Szybka konfiguracja karty z tytułem i treścią. Idealna do sytuacji, gdy potrzebujesz prostego kontenera z nagłówkiem.',
      },
      source: {
        code: `<AbyssCard title="Szybka karta">
  <div>
    Prosta karta z tytułem i treścią, idealna do szybkiego użycia.
  </div>
</AbyssCard>`,
      },
    },
  },
};

export const WithHeaderSlots: Story = {
  name: 'Z dodatkowymi slotami nagłówka',
  args: {
    title: 'Tytuł karty',
  },
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <q-icon name="sym_r_description" />
        </template>
        <template #header-append>
          <q-badge color="primary" text-color="white" label="Nowy" />
        </template>
        <template #content>
          <div>
            Zawartość karty z dodatkowymi elementami w nagłówku.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta z wykorzystaniem slotów header-prepend i header-append do dodania ikon lub innych elementów przed i po tytule.',
      },
      source: {
        code: `<AbyssCard title="Tytuł karty">
  <template #header-prepend>
    <q-icon name="sym_r_description" />
  </template>
  <template #header-append>
    <q-badge color="primary" text-color="white" label="Nowy" />
  </template>
  <template #content>
    <div>
      Zawartość karty z dodatkowymi elementami w nagłówku.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText('Tytuł karty');
    await expect(title).toBeVisible();
    const badge = canvas.getByText('Nowy');
    await expect(badge).toBeVisible();
  },
};

export const CustomHeader: Story = {
  name: 'Z własnym nagłówkiem',
  args: {},
  render: (args) => ({
    components: { AbyssCard },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px;">
            <q-icon name="sym_r_palette" size="sm" />
            <strong>Własny nagłówek</strong>
            <span style="font-size: 12px; opacity: 0.6;">(customowy)</span>
          </div>
        </template>
        <template #content>
          <div>
            Zawartość karty z całkowicie niestandardowym nagłówkiem.
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta z całkowicie customowym nagłówkiem przez slot header. Zastępuje domyślny tytuł z props.',
      },
      source: {
        code: `<AbyssCard>
  <template #header>
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px;">
      <q-icon name="sym_r_palette" size="sm" />
      <strong>Własny nagłówek</strong>
      <span style="font-size: 12px; opacity: 0.6;">(customowy)</span>
    </div>
  </template>
  <template #content>
    <div>
      Zawartość karty z całkowicie niestandardowym nagłówkiem.
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
  play: async ({ canvas }) => {
    const customTitle = canvas.getByText('Własny nagłówek');
    await expect(customTitle).toBeVisible();
    const content = canvas.getByText(
      'Zawartość karty z całkowicie niestandardowym nagłówkiem.',
    );
    await expect(content).toBeVisible();
  },
};

export const ComplexContent: Story = {
  name: 'Ze złożoną zawartością',
  args: {
    title: 'Ustawienia aplikacji',
  },
  render: (args) => ({
    components: { AbyssCard, AbyssInput, AbyssButton },
    setup() {
      const username = ref('użytkownik123');
      const email = ref('uzytkownik@example.com');
      const notifications = ref(true);

      return { args, username, email, notifications };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <q-icon name="sym_r_settings" />
        </template>
        <template #content>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <AbyssInput
              v-model="username"
              label="Nazwa użytkownika"
              placeholder="Wprowadź nazwę użytkownika"
            />

            <AbyssInput
              v-model="email"
              label="Email"
              type="email"
              placeholder="twoj@email.com"
            />

            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="flex: 1;">Powiadomienia</span>
              <AbyssButton
                :icon="notifications ? 'sym_r_notifications_active' : 'sym_r_notifications_off'"
                :label="notifications ? 'Włączone' : 'Wyłączone'"
                @click="notifications = !notifications"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <AbyssButton
              label="Anuluj"
              icon="sym_r_close"
            />
            <AbyssButton
              label="Zapisz zmiany"
              icon="sym_r_save"
            />
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Przykład karty z bardziej złożoną zawartością wykorzystującą komponenty AbyssInput i AbyssButton oraz nowy slot footer do akcji formularza.',
      },
      source: {
        code: `<AbyssCard title="Ustawienia aplikacji">
  <template #header-prepend>
    <q-icon name="sym_r_settings" />
  </template>
  <template #content>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <AbyssInput
        v-model="username"
        label="Nazwa użytkownika"
        placeholder="Wprowadź nazwę użytkownika"
      />

      <AbyssInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="twoj@email.com"
      />

      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="flex: 1;">Powiadomienia</span>
        <AbyssButton
          :icon="notifications ? 'sym_r_notifications_active' : 'sym_r_notifications_off'"
          :label="notifications ? 'Włączone' : 'Wyłączone'"
          @click="notifications = !notifications"
        />
      </div>
    </div>
  </template>

  <template #footer>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <AbyssButton label="Anuluj" icon="sym_r_close" />
      <AbyssButton label="Zapisz zmiany" icon="sym_r_save" />
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
};

export const OnlyHeaderSlots: Story = {
  name: 'Tylko sloty nagłówka',
  args: {},
  render: (args) => ({
    components: { AbyssCard, AbyssButton },
    setup() {
      return { args };
    },
    template: `
      <AbyssCard v-bind="args">
        <template #header-prepend>
          <AbyssButton icon="sym_r_arrow_back" embedded size="small" style="margin-left: -10px;" />
        </template>
        <template #header-append>
          <AbyssButton icon="sym_r_arrow_forward" embedded size="small" style="margin-right: -10px;" />
        </template>
        <template #content>
          <div>
            Karta z nagłówkiem utworzonym tylko ze slotów prepend i append (bez tytułu).
          </div>
        </template>
      </AbyssCard>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Karta z nagłówkiem utworzonym wyłącznie ze slotów header-prepend i header-append, bez użycia props title.',
      },
      source: {
        code: `<AbyssCard>
  <template #header-prepend>
    <AbyssButton icon="sym_r_arrow_back" embedded size="small" style="margin-left: -10px;" />
  </template>
  <template #header-append>
    <AbyssButton icon="sym_r_arrow_forward" embedded size="small" style="margin-right: -10px;" />
  </template>
  <template #content>
    <div>
      Karta z nagłówkiem utworzonym tylko ze slotów prepend i append (bez tytułu).
    </div>
  </template>
</AbyssCard>`,
      },
    },
  },
};
