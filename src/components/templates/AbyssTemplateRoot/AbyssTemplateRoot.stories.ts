import type { Meta, StoryObj } from '@storybook/vue3';
import { defineComponent, ref } from 'vue';
import AbyssTemplateRoot from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';
import AbyssNavigation from '@/components/ui/AbyssNavigation/AbyssNavigation.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssTitle from '@/components/ui/AbyssTitle/AbyssTitle.vue';
import AbyssInput from '@/components/ui/AbyssInput/AbyssInput.vue';

const TestContent = defineComponent({
  name: 'TestContent',
  components: { AbyssCard, AbyssTitle, AbyssButton, AbyssInput },
  setup() {
    const name = ref('');
    const email = ref('');
    const search = ref('');
    const note = ref('');
    const date = ref('');
    return { name, email, search, note, date };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <AbyssTitle type="h1" label="Panel użytkownika" icon="sym_r_person" />

      <AbyssCard title="Dane osobowe">
        <template #header-prepend>
          <q-icon name="sym_r_badge" style="font-size: 20px; color: rgba(255,255,255,0.6);" />
        </template>
        <template #content>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <AbyssInput v-model="name" label="Imię i nazwisko" placeholder="Jan Kowalski" />
            <AbyssInput v-model="email" label="Adres e-mail" type="email" placeholder="jan@example.com" />
            <AbyssInput label="Telefon" type="tel" placeholder="+48 123 456 789" />
            <AbyssInput label="Data urodzenia" type="date" />
            <div style="display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px;">
              <AbyssButton label="Anuluj" embedded />
              <AbyssButton label="Zapisz zmiany" icon="sym_r_save" />
            </div>
          </div>
        </template>
      </AbyssCard>

      <AbyssCard title="Powiadomienia">
        <template #header-prepend>
          <q-icon name="sym_r_notifications" style="font-size: 20px; color: rgba(255,255,255,0.6);" />
        </template>
        <template #header-append>
          <AbyssButton icon="sym_r_add" size="small" label="Dodaj" />
        </template>
        <template #content>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
            <AbyssTitle type="h3" label="Aktywne" />
            <AbyssCard v-for="i in 3" :key="i">
              <template #content>
                <div style="padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
                  <q-icon name="sym_r_circle_notifications" style="font-size: 20px; color: #a78bfa;" />
                  <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 500;">Przypomnienie o spotkaniu {{ i }}</div>
                    <div style="font-size: 12px; opacity: 0.5; margin-top: 2px;">Dziś o {{ 8 + i * 2 }}:00</div>
                  </div>
                  <AbyssButton icon="sym_r_close" size="small" embedded />
                </div>
              </template>
            </AbyssCard>
          </div>
        </template>
      </AbyssCard>

      <AbyssCard title="Wyszukiwarka">
        <template #header-prepend>
          <q-icon name="sym_r_search" style="font-size: 20px; color: rgba(255,255,255,0.6);" />
        </template>
        <template #content>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <AbyssInput v-model="search" label="Szukaj" type="search" placeholder="Wpisz frazę..." />
            <AbyssTitle type="h3" label="Ostatnie wyniki" />
            <AbyssCard v-for="j in 4" :key="j">
              <template #content>
                <div style="padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
                  <q-icon name="sym_r_description" style="font-size: 18px; opacity: 0.6;" />
                  <div style="flex: 1; font-size: 14px;">Dokument – wynik wyszukiwania #{{ j }}</div>
                  <AbyssButton icon="sym_r_open_in_new" size="small" embedded />
                </div>
              </template>
            </AbyssCard>
          </div>
        </template>
      </AbyssCard>

      <AbyssCard>
        <template #header>
          <AbyssTitle type="h3" label="Notatki" icon="sym_r_edit_note" />
        </template>
        <template #content>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <AbyssInput v-model="note" label="Nowa notatka" type="textarea" placeholder="Zacznij pisać..." />
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <AbyssButton label="Wyczyść" icon="sym_r_delete" embedded />
              <AbyssButton label="Zapisz notatkę" icon="sym_r_check" />
            </div>
          </div>
        </template>
      </AbyssCard>

      <AbyssCard title="Akcje">
        <template #header-prepend>
          <q-icon name="sym_r_bolt" style="font-size: 20px; color: rgba(255,255,255,0.6);" />
        </template>
        <template #content>
          <div style="padding: 16px; display: flex; flex-wrap: wrap; gap: 10px;">
            <AbyssButton label="Eksportuj dane" icon="sym_r_download" />
            <AbyssButton label="Importuj" icon="sym_r_upload" />
            <AbyssButton label="Synchronizuj" icon="sym_r_sync" />
            <AbyssButton label="Raport" icon="sym_r_bar_chart" />
            <AbyssButton label="Udostępnij" icon="sym_r_share" />
            <AbyssButton label="Archiwizuj" icon="sym_r_archive" embedded />
            <AbyssButton label="Usuń konto" icon="sym_r_delete_forever" embedded />
          </div>
        </template>
      </AbyssCard>
    </div>
  `,
});

const meta: Meta<typeof AbyssTemplateRoot> = {
  title: 'Templates/AbyssTemplateRoot',
  component: AbyssTemplateRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Główny komponent aplikacji definiujący strukturę layoutu. Obsługuje warianty: `desktop` (Electron z paskiem tytułu), `web` (panel webowy bez paska tytułu) oraz `mobile` z poziomą nawigacją na dole ekranu.',
      },
    },
  },
  argTypes: {
    device: {
      control: 'select',
      options: ['desktop', 'web', 'mobile'],
      description: 'Wariant layoutu – desktopowy (Electron), webowy lub mobilny',
      table: {
        type: { summary: "'desktop' | 'web' | 'mobile'" },
      },
    },
    orientation: {
      control: 'select',
      options: ['portrait', 'landscape'],
      description:
        'Orientacja layoutu mobilnego. Props steruje wyłącznie układem mobile; w trybie desktop jest ignorowany.',
      table: {
        type: { summary: "'portrait' | 'landscape'" },
        defaultValue: { summary: "'portrait'" },
      },
    },
    screenRadius: {
      control: 'text',
      description:
        'Promień zaokrąglenia ekranu urządzenia mobilnego. Prop `screenRadius` jest propagowany do zagnieżdżonych komponentów layoutu (w tym `AbyssNavigation`). Wartość można pobrać z Capacitor Safe Area API (patrz story *Mobile*).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    background: {
      description:
        'Tło aplikacji renderowane za wszystkimi warstwami. Dostępny na **obu platformach** (desktop i mobile).',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    'app-bar-start': {
      description:
        'Lewa część paska aplikacji – pełni rolę paska tytułowego (tytuł, logo lub nazwa aplikacji). Dostępny **wyłącznie na desktop** – w trybie mobile pasek aplikacji nie jest renderowany.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    'app-bar-end': {
      description:
        'Prawa część paska aplikacji – służy do umieszczenia kontrolek okna (minimalizuj / maksymalizuj / zamknij) w przypadku gdy nie są używane natywne kontrolki systemu Windows, a także innych globalnych opcji (np. profil użytkownika, powiadomienia). Dostępny **wyłącznie na desktop**.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    'navigation-start': {
      description:
        'Główna nawigacja aplikacji. Na **desktop** renderowana jako pionowy panel boczny po lewej stronie. Na **mobile** renderowana jako poziomy pasek nawigacji na dole ekranu. Dostępny na **obu platformach**.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    'navigation-end': {
      description:
        'Nawigacja pomocnicza wyświetlana w dolnej części bocznego panelu nawigacyjnego. Przeznaczona na dodatkowe akcje lub linki drugorzędne. Dostępna **wyłącznie na desktop** – w trybie mobile ten slot nie jest renderowany.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    content: {
      description:
        'Główny obszar treści aplikacji. Przewijalny, zajmuje pozostałą przestrzeń po odjęciu paska aplikacji i nawigacji. Dostępny na **obu platformach** (desktop i mobile).',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AbyssTemplateRoot>;

const navItems = [
  { label: 'Start', icon: 'sym_r_home', route: 'index' },
  { label: 'Kalendarz', icon: 'sym_r_calendar_month', route: 'calendar' },
  { label: 'Zadania', icon: 'sym_r_task_alt', route: 'tasks' },
  { label: 'Ustawienia', icon: 'sym_r_settings', route: 'settings' },
];

const renderMobileStory: NonNullable<Story['render']> = (args) => ({
  components: {
    AbyssTemplateRoot,
    AbyssNavigation,
    AbyssButton,
    AbyssBackground,
    TestContent,
  },
  setup() {
    const currentRoute = ref('index');
    return { args, navItems, currentRoute };
  },
  template: `
    <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
      <template #background>
        <AbyssBackground style="position: absolute; inset: 0;" />
      </template>
      <template #content>
        <TestContent />
      </template>
      <template #navigation-start>
        <AbyssNavigation device="mobile" :current-route="currentRoute">
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
      </template>
    </AbyssTemplateRoot>
  `,
});

export const Web: Story = {
  name: 'Web',
  args: {
    device: 'web',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssNavigation,
      AbyssButton,
      AbyssBackground,
      TestContent,
    },
    setup() {
      const currentRoute = ref('index');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #navigation-start>
          <AbyssNavigation device="desktop" :current-route="currentRoute">
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
        </template>
        <template #content>
          <TestContent />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout webowy – jak desktop, ale bez paska tytułu. Obszar treści bez zaokrąglenia w lewym górnym rogu i z ujemnym marginesem górnym -8px.',
      },
      source: {
        code: `<AbyssTemplateRoot device="web">
  <template #background>
    <AbyssBackground />
  </template>
  <template #navigation-start>
    <AbyssNavigation device="desktop" current-route="index">
      <AbyssButton label="Start" icon="sym_r_home" route="index" />
    </AbyssNavigation>
  </template>
  <template #content>
    <div>Treść aplikacji</div>
  </template>
</AbyssTemplateRoot>`,
      },
    },
  },
};

export const Desktop: Story = {
  name: 'Desktop',
  args: {
    device: 'desktop',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssNavigation,
      AbyssButton,
      AbyssBackground,
      TestContent,
    },
    setup() {
      const currentRoute = ref('index');
      return { args, navItems, currentRoute };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #app-bar-start>
          <span style="font-weight: bold; padding: 0 16px;">Maia</span>
        </template>
        <template #app-bar-end>
          <span style="padding: 0 16px;">Użytkownik</span>
        </template>
        <template #navigation-start>
          <AbyssNavigation device="desktop" :current-route="currentRoute">
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
        </template>
        <template #content>
          <TestContent />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout desktopowy z paskiem aplikacji, boczną nawigacją i obszarem treści.',
      },
      source: {
        code: `<AbyssTemplateRoot device="desktop">
  <template #background>
    <AbyssBackground />
  </template>
  <template #app-bar-start>
    <span>Maia</span>
  </template>
  <template #app-bar-end>
    <span>Użytkownik</span>
  </template>
  <template #navigation-start>
    <AbyssNavigation device="desktop" current-route="index">
      <AbyssButton label="Start" icon="sym_r_home" route="index" />
      <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" />
    </AbyssNavigation>
  </template>
  <template #content>
    <div>Treść aplikacji</div>
  </template>
</AbyssTemplateRoot>`,
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  args: {
    device: 'mobile',
    orientation: 'portrait',
    screenRadius: '30px',
  },
  render: renderMobileStory,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Layout mobilny w orientacji pionowej z treścią i nawigacją dolną.\n\n' +
          '`screenRadius` określa promień zaokrąglenia ekranu urządzenia. Wartość jest ustawiana raz na `AbyssTemplateRoot` i automatycznie propagowana do zagnieżdżonych komponentów layoutu (w tym `AbyssNavigation`) — **nie trzeba jej osobno przekazywać do `AbyssNavigation`**.\n\n' +
          'Na urządzeniu z Capacitorem wartość pobieramy z własnego pluginu `ScreenRadius`, który na Androidzie wywołuje `Display.getRoundedCorner()` (API 31+):\n\n' +
          '```ts\n' +
          "import { ScreenRadius } from '@/plugins/ScreenRadius';\n" +
          '\n' +
          'const radii = await ScreenRadius.getCornerRadius();\n' +
          'const radius = Math.max(radii.topLeft, radii.topRight, radii.bottomLeft, radii.bottomRight);\n' +
          '\n' +
          '// Plugin zwraca wartość w fizycznych pikselach (px urządzenia).\n' +
          '// WebView operuje na CSS pixels, dlatego dzielimy przez devicePixelRatio:\n' +
          'const cssRadius = Math.round(radius / window.devicePixelRatio);\n' +
          'screenRadius.value = `${cssRadius}px`;\n' +
          '```\n\n' +
          '> **Przykład:** Pixel 8 – natywny radius `108 px`, DPR `2.75` → CSS radius `≈ 39 px`.',
      },
      source: {
        code: `<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Platform } from 'quasar';
import { ScreenRadius } from '@/plugins/ScreenRadius';

const screenRadius = ref('');

onMounted(async () => {
  if (Platform.is.capacitor) {
    const radii = await ScreenRadius.getCornerRadius();
    const radius = Math.max(radii.topLeft, radii.topRight, radii.bottomLeft, radii.bottomRight);
    if (radius > 0) {
      // Plugin zwraca fizyczne piksele – przeliczamy na CSS pixels przez devicePixelRatio
      const cssRadius = Math.round(radius / window.devicePixelRatio);
      screenRadius.value = cssRadius + 'px';
    }
  }
});
</script>

<template>
  <!-- screenRadius ustawiony raz na AbyssTemplateRoot – nie przekazuj go osobno do AbyssNavigation -->
  <AbyssTemplateRoot device="mobile" orientation="portrait" :screen-radius="screenRadius">
    <template #background>
      <AbyssBackground />
    </template>
    <template #content>
      <div>Treść aplikacji</div>
    </template>
    <template #navigation-start>
      <AbyssNavigation device="mobile" current-route="index">
        <AbyssButton label="Start" icon="sym_r_home" route="index" />
        <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" />
      </AbyssNavigation>
    </template>
  </AbyssTemplateRoot>
</template>`,
      },
    },
  },
};

export const MobileLandscape: Story = {
  name: 'Mobile Landscape',
  args: {
    device: 'mobile',
    orientation: 'landscape',
    screenRadius: '30px',
  },
  render: renderMobileStory,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Layout mobilny w orientacji poziomej. Nawigacja przechodzi na prawą krawędź, a obszar treści dopasowuje maskę i padding do układu landscape.',
      },
      source: {
        code: `<AbyssTemplateRoot device="mobile" orientation="landscape" screen-radius="30px">
  <template #background>
    <AbyssBackground />
  </template>
  <template #content>
    <div>Treść aplikacji</div>
  </template>
  <template #navigation-start>
    <AbyssNavigation device="mobile" current-route="index">
      <AbyssButton label="Start" icon="sym_r_home" route="index" />
      <AbyssButton label="Kalendarz" icon="sym_r_calendar_month" route="calendar" />
    </AbyssNavigation>
  </template>
</AbyssTemplateRoot>`,
      },
    },
  },
};

export const EmptyDesktop: Story = {
  name: 'Pusty – Desktop',
  args: {
    device: 'desktop',
  },
  render: (args) => ({
    components: { AbyssTemplateRoot },
    setup() {
      return { args };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>[background]</template>
        <template #app-bar-start>[app-bar-start]</template>
        <template #app-bar-end>[app-bar-end]</template>
        <template #navigation-start>[navigation-start]</template>
        <template #navigation-end>[navigation-end]</template>
        <template #content>[content]</template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Struktura layoutu desktopowego z tekstowymi fallbackami zamiast treści – widoczne są wszystkie dostępne sloty.',
      },
    },
  },
};

export const EmptyMobile: Story = {
  name: 'Pusty – Mobile',
  args: {
    device: 'mobile',
    orientation: 'portrait',
  },
  render: (args) => ({
    components: { AbyssTemplateRoot },
    setup() {
      return { args };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>[background]</template>
        <template #navigation-start>[navigation-start]</template>
        <template #content>[content]</template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Struktura layoutu mobilnego z tekstowymi fallbackami zamiast treści – widoczne są wszystkie dostępne sloty.',
      },
    },
  },
};

export const DesktopNoNavigation: Story = {
  name: 'Desktop – bez nawigacji',
  args: {
    device: 'desktop',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssBackground,
      TestContent,
    },
    setup() {
      return { args };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #app-bar-start>
          <span style="font-weight: bold; padding: 0 16px;">Maia</span>
        </template>
        <template #app-bar-end>
          <span style="padding: 0 16px;">Użytkownik</span>
        </template>
        <template #content>
          <TestContent />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout desktopowy bez żadnego slotu nawigacji – sekcja `<aside>` jest ukryta, grid zajmuje całą szerokość, a cień przylegający do nawigacji znika.',
      },
    },
  },
};

export const MobileNoNavigation: Story = {
  name: 'Mobile – bez nawigacji',
  args: {
    device: 'mobile',
    orientation: 'portrait',
    screenRadius: '30px',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssBackground,
      TestContent,
    },
    setup() {
      return { args };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #content>
          <TestContent />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout mobilny bez żadnego slotu nawigacji – pasek dolny jest ukryty, treść zajmuje cały ekran, maska concave-corners oraz cień przy nawigacji są wyłączone.',
      },
    },
  },
};
