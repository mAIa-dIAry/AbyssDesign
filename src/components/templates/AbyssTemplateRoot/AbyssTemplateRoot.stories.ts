import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, waitFor } from 'storybook/test';
import { ABYSS_TEMPLATE_OVERLAY_ID } from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.constants';
import AbyssTemplateRoot from '@/components/templates/AbyssTemplateRoot/AbyssTemplateRoot.vue';
import AbyssTemplateMain from '@/components/templates/AbyssTemplateMain/AbyssTemplateMain.vue';
import AbyssNavigation from '@/components/ui/AbyssNavigation/AbyssNavigation.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssButtonGroup from '@/components/ui/AbyssButtonGroup/AbyssButtonGroup.vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssNotifyHost from '@/components/ui/AbyssNotifyHost/AbyssNotifyHost.vue';
import { createNotifyDemoQueue } from '@/components/ui/AbyssNotify/AbyssNotify.demo';

const meta: Meta<typeof AbyssTemplateRoot> = {
  title: 'Templates/AbyssTemplateRoot',
  component: AbyssTemplateRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Główny komponent aplikacji definiujący strukturę layoutu. Obsługuje warianty: `desktop` (Electron z paskiem tytułu), `web` (panel webowy bez paska tytułu) oraz `mobile` z poziomą nawigacją na dole ekranu. ' +
          'W aplikacji layout wkłada `router-view` w slot `#content`; strona trasy montuje `AbyssTemplateMain`, `AbyssTemplateSidebar` albo `AbyssTemplateLogin`. Nie wkładaj kart, formularzy ani list bezpośrednio do Root. W Storybooku izolowane demo może zagnieździć szablon w `#content`. ' +
          'Nie importuj shadow-wrapperów `AbyssTemplate` / `AbyssScrollView` / `AbyssSidebarNav`. ' +
          'Gdy sloty `navigation-start` i `navigation-end` są puste, `<aside>` nie jest renderowany — treść zajmuje całą szerokość, a inner shadow (inset 8px) chowa się za viewportem po prawej i na dole (bez nawigacji także po lewej). ' +
          'Strony wywołują helper kolejki `notify()`; `AbyssNotifyHost` montuj w slocie `#overlay` (nie `Teleport` ze strony). Overlay ma `gap: 0` (odstęp 8px z `::after` toasta), `padding: calc(12px + env(safe-area-inset-top, 0px)) 8px 12px` i `max-height: 100%`. `overflow: auto` tylko gdy zmierzona wysokość kolejki przekracza limit (debounce 0,2 s = animacja wejścia, zejścia i akordeonu).',
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
        'Główna nawigacja aplikacji. Na **desktop** / **web** renderowana jako pionowy panel boczny po lewej stronie. Na **mobile** renderowana jako poziomy pasek nawigacji na dole ekranu. Pusty slot (albo brak slotu) razem z pustym `navigation-end` ukrywa sidebar.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    'navigation-end': {
      description:
        'Nawigacja pomocnicza wyświetlana w dolnej części bocznego panelu nawigacyjnego. Przeznaczona na dodatkowe akcje lub linki drugorzędne. Dostępna **wyłącznie na desktop/web** – w trybie mobile ten slot nie jest renderowany i nie utrzymuje sidebara. Pusty razem z `navigation-start` ukrywa `<aside>`.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    overlayId: {
      control: 'text',
      description:
        'Identyfikator hosta overlay. W Storybooku Docs podawaj unikalną wartość, bo na stronie jest wiele instancji szablonu',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: `'${ABYSS_TEMPLATE_OVERLAY_ID}'` },
      },
    },
    content: {
      description:
        'Główny obszar treści aplikacji. W aplikacji: `router-view` (strona trasy montuje szablon). Nie wkładaj tu kart, formularzy ani list. W Storybooku demo może zagnieździć `AbyssTemplateMain`, `AbyssTemplateSidebar` albo `AbyssTemplateLogin`. Slot nie ma własnego scrollu ani paddingu. Dostępny na **obu platformach**.',
      table: {
        category: 'slots',
        type: { summary: 'slot' },
      },
    },
    overlay: {
      description:
        'Warstwa nad obszarem treści (`overflow-wrapper`), kotwica w prawym górnym rogu. Montuj tu `AbyssNotifyHost`. Overlay ma `gap: 0` (odstęp kolejki z `::after` toasta), `padding: calc(12px + env(safe-area-inset-top, 0px)) 8px 12px` i `max-height: 100%`; `overflow: auto` tylko gdy zmierzona wysokość przekracza limit (debounce 0,2 s = animacja wejścia, zejścia i akordeonu). Dostępny na **obu platformach**.',
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
    AbyssTemplateMain,
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
        <AbyssTemplateMain
          :device="args.device"
          :orientation="args.orientation"
          :safe-area="args.device === 'mobile'"
        />
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
      AbyssTemplateMain,
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
          <AbyssTemplateMain :device="args.device" />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout webowy – jak desktop, ale bez paska tytułu. Obszar treści bez zaokrąglenia w lewym górnym rogu i z ujemnym marginesem górnym -8px. W `#content` jest `AbyssTemplateMain`.',
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
    <AbyssTemplateMain device="web" />
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
      AbyssTemplateMain,
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
          <AbyssTemplateMain :device="args.device" />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout desktopowy z paskiem aplikacji, boczną nawigacją i `AbyssTemplateMain` w slocie `#content`.',
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
    <AbyssTemplateMain device="desktop" />
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
      <AbyssTemplateMain device="mobile" safe-area />
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
    <AbyssTemplateMain device="mobile" orientation="landscape" safe-area />
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
        <template #content>[AbyssTemplateMain]</template>
        <template #overlay>[overlay]</template>
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
        <template #content>[AbyssTemplateMain]</template>
        <template #overlay>[overlay]</template>
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
      AbyssTemplateMain,
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
          <AbyssTemplateMain :device="args.device" />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout desktopowy bez slotów nawigacji – `<aside>` jest ukryty, treść zajmuje całą szerokość. Inner shadow contentu (inset 8px) chowa się za viewportem po prawej, na dole i po lewej. W `#content` jest `AbyssTemplateMain`.',
      },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getByRole('main')).toBeVisible();
    });
    expect(canvas.queryByRole('navigation')).toBeNull();
    expect(canvas.queryByRole('complementary')).toBeNull();
  },
};

export const WebNoNavigation: Story = {
  name: 'Web – bez nawigacji',
  args: {
    device: 'web',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssBackground,
      AbyssTemplateMain,
    },
    setup() {
      return { args };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #navigation-start></template>
        <template #navigation-end></template>
        <template #content>
          <AbyssTemplateMain :device="args.device" />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout webowy z pustymi slotami `navigation-start` i `navigation-end` — sidebar nie jest renderowany. Inner shadow contentu chowa się 8px za viewportem (prawo, dół i lewa). W `#content` jest `AbyssTemplateMain`.',
      },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getByRole('main')).toBeVisible();
    });
    expect(canvas.queryByRole('navigation')).toBeNull();
    expect(canvas.queryByRole('complementary')).toBeNull();
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
      AbyssTemplateMain,
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
          <AbyssTemplateMain
            :device="args.device"
            :orientation="args.orientation"
            safe-area
          />
        </template>
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Layout mobilny bez slotów nawigacji – pasek dolny jest ukryty, treść zajmuje cały ekran, maska concave-corners oraz cień przy nawigacji są wyłączone. W `#content` jest `AbyssTemplateMain`.',
      },
    },
  },
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getByRole('main')).toBeVisible();
    });
    expect(canvas.queryByRole('navigation')).toBeNull();
    expect(canvas.queryByRole('complementary')).toBeNull();
  },
};

const notifySaveMessage = 'Notatka została zapisana.';

const notifyStorySource = `<script setup>
import { ref } from 'vue';

const queue = ref([]);

function enqueue(template) {
  const newest = queue.value[0];
  if (newest?.id === template.id) {
    newest.count += 1;
    newest.visible = true;
    return;
  }
  queue.value.unshift({ ...template, instanceId: Date.now(), count: 1, visible: true });
}

function setVisible(instanceId, visible) {
  const item = queue.value.find((entry) => entry.instanceId === instanceId);
  if (item) item.visible = visible;
}

function remove(instanceId) {
  queue.value = queue.value.filter((item) => item.instanceId !== instanceId);
}
</script>

<template>
  <AbyssTemplateRoot device="desktop">
    <template #background>
      <AbyssBackground />
    </template>
    <template #navigation-start>
      <AbyssNavigation device="desktop" current-route="index">
        <AbyssButton label="Start" icon="sym_r_home" route="index" />
      </AbyssNavigation>
    </template>
    <template #overlay>
      <AbyssNotifyHost
        :items="queue"
        @update:visible="setVisible"
        @after-leave="remove"
      />
    </template>
    <template #content>
      <AbyssTemplateMain device="desktop">
        <AbyssButtonGroup vertical>
          <AbyssButton
            v-for="template in templates"
            :key="template.id"
            :label="template.label"
            @click="enqueue(template)"
          />
        </AbyssButtonGroup>
      </AbyssTemplateMain>
    </template>
  </AbyssTemplateRoot>
</template>`;

const notifyStoryPlay: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
  await waitFor(() => {
    expect(canvas.getByText(notifySaveMessage)).toBeVisible();
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Zamknij' }));
  await waitFor(() => {
    expect(canvas.queryByText(notifySaveMessage)).toBeNull();
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Zapis' }));
  await waitFor(() => {
    expect(canvas.getByText(notifySaveMessage)).toBeVisible();
  });
};

const notifyQueueContent = `
          <AbyssTemplateMain :device="args.device">
            <AbyssButtonGroup vertical>
              <AbyssButton
                v-for="template in templates"
                :key="template.id"
                :label="template.label"
                @click="enqueue(template)"
              />
            </AbyssButtonGroup>
          </AbyssTemplateMain>
`;

const notifyQueueOverlay = `
        <template #overlay>
          <AbyssNotifyHost
            :items="queue"
            @update:visible="setVisible"
            @after-leave="remove"
          />
        </template>
`;

export const NotifyDesktop: Story = {
  name: 'Notify – Desktop',
  args: {
    device: 'desktop',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssTemplateMain,
      AbyssNavigation,
      AbyssButton,
      AbyssButtonGroup,
      AbyssBackground,
      AbyssNotifyHost,
    },
    setup() {
      const currentRoute = ref('index');
      const overlayId = `abyss-template-overlay-${Math.random().toString(36).slice(2, 10)}`;
      return { args, navItems, currentRoute, overlayId, ...createNotifyDemoQueue() };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" :overlay-id="overlayId" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #app-bar-start>
          <span style="font-weight: bold; padding: 0 16px;">Maia</span>
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
          ${notifyQueueContent}
        </template>
        ${notifyQueueOverlay}
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Zestaw przycisków dokładających toasty do `AbyssNotifyHost` w slocie `#overlay` (prawy górny róg obszaru treści). Overlay ma `padding: calc(12px + env(safe-area-inset-top, 0px)) 8px 12px`; `overflow: auto` tylko gdy zmierzona wysokość przekracza limit (debounce 0,2 s = animacja wejścia, zejścia i akordeonu). Ten sam szablon pod rząd podbija `count`.',
      },
      source: {
        code: notifyStorySource,
      },
    },
  },
  play: notifyStoryPlay,
};

export const NotifyWeb: Story = {
  name: 'Notify – Web',
  args: {
    device: 'web',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssTemplateMain,
      AbyssNavigation,
      AbyssButton,
      AbyssButtonGroup,
      AbyssBackground,
      AbyssNotifyHost,
    },
    setup() {
      const currentRoute = ref('index');
      const overlayId = `abyss-template-overlay-${Math.random().toString(36).slice(2, 10)}`;
      return { args, navItems, currentRoute, overlayId, ...createNotifyDemoQueue() };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" :overlay-id="overlayId" style="height: 100vh;">
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
          ${notifyQueueContent}
        </template>
        ${notifyQueueOverlay}
      </AbyssTemplateRoot>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Ten sam zestaw przycisków i kolejka toastów na web — overlay w prawym górnym rogu `overflow-wrapper`, bez paska tytułu.',
      },
      source: {
        code: notifyStorySource.replace('device="desktop"', 'device="web"'),
      },
    },
  },
  play: notifyStoryPlay,
};

export const NotifyMobile: Story = {
  name: 'Notify – Mobile',
  args: {
    device: 'mobile',
    orientation: 'portrait',
    screenRadius: '30px',
  },
  render: (args) => ({
    components: {
      AbyssTemplateRoot,
      AbyssTemplateMain,
      AbyssNavigation,
      AbyssButton,
      AbyssButtonGroup,
      AbyssBackground,
      AbyssNotifyHost,
    },
    setup() {
      const currentRoute = ref('index');
      const overlayId = `abyss-template-overlay-${Math.random().toString(36).slice(2, 10)}`;
      return { args, navItems, currentRoute, overlayId, ...createNotifyDemoQueue() };
    },
    template: `
      <AbyssTemplateRoot v-bind="args" :overlay-id="overlayId" style="height: 100vh;">
        <template #background>
          <AbyssBackground style="position: absolute; inset: 0;" />
        </template>
        <template #content>
          <AbyssTemplateMain :device="args.device" orientation="portrait" safe-area>
            <AbyssButtonGroup vertical>
              <AbyssButton
                v-for="template in templates"
                :key="template.id"
                :label="template.label"
                @click="enqueue(template)"
              />
            </AbyssButtonGroup>
          </AbyssTemplateMain>
        </template>
        ${notifyQueueOverlay}
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
  }),
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Ten sam zestaw przycisków i kolejka toastów na mobile — overlay w prawym górnym rogu obszaru treści, nad dolną nawigacją.',
      },
      source: {
        code: notifyStorySource.replace('device="desktop"', 'device="mobile"'),
      },
    },
  },
  play: notifyStoryPlay,
};
