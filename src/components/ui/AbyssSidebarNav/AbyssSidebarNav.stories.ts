import type { Meta, StoryObj } from '@storybook/vue3';
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { expect } from 'storybook/test';
import AbyssSidebarNav from '@/components/ui/AbyssSidebarNav/AbyssSidebarNav.vue';
import AbyssTemplate from '@/components/ui/AbyssTemplate/AbyssTemplate.vue';
import AbyssNavigation from '@/components/ui/AbyssNavigation/AbyssNavigation.vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import AbyssButton from '@/components/ui/AbyssButton/AbyssButton.vue';
import AbyssCard from '@/components/ui/AbyssCard/AbyssCard.vue';
import AbyssGrid from '@/components/ui/AbyssGrid/AbyssGrid.vue';
import AbyssInfo from '@/components/ui/AbyssInfo/AbyssInfo.vue';
import AbyssSlider from '@/components/ui/AbyssSlider/AbyssSlider.vue';
import AbyssToggle from '@/components/ui/AbyssToggle/AbyssToggle.vue';
import logoUrl from '@/assets/images/tile-icon-192x-192.png';

const TABS = [
  { id: 'appearance', label: 'Wygląd', icon: 'sym_r_palette' },
  { id: 'security', label: 'Bezpieczeństwo', icon: 'sym_r_shield_lock' },
  { id: 'data', label: 'Dane', icon: 'sym_r_database' },
  {
    id: 'accessibility',
    label: 'Dostępność',
    icon: 'sym_r_accessibility_new',
  },
];

const APPEARANCE_PRESETS = [
  { label: 'Aurora', colors: ['#0f766e', '#2563eb'] as [string, string] },
  { label: 'Ember', colors: ['#c2410c', '#7c3aed'] as [string, string] },
  { label: 'Mist', colors: ['#475569', '#06b6d4'] as [string, string] },
  { label: 'Dawn', colors: ['#db2777', '#f59e0b'] as [string, string] },
];

const ZOOM_MARKER_LABELS = ['90%', '100%', '110%', '125%', '140%'];

const STORY_STAGE_STYLE =
  'display:flex;justify-content:center;align-items:center;min-height:100vh;padding:24px;box-sizing:border-box;';
const DESKTOP_FRAME_STYLE =
  'position:relative;width:1280px;height:800px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.35);';
const DESKTOP_NARROW_FRAME_STYLE =
  'position:relative;width:600px;height:800px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.35);';
const MOBILE_FRAME_STYLE =
  'position:relative;width:100%;max-width:390px;height:min(100vh,844px);overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.35);';
const MOBILE_LANDSCAPE_FRAME_STYLE =
  'position:relative;width:100%;max-width:844px;height:min(100vh,390px);overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.35);';
const MOBILE_STORY_SCROLLBAR_HIDDEN_STYLES = `
  .abyss-sidebar-nav-story--scrollbarless .abyss-template__overflow-wrapper,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__sidebar,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__content,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__pane--list,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__detail-content {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .abyss-sidebar-nav-story--scrollbarless .abyss-template__overflow-wrapper::-webkit-scrollbar,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__sidebar::-webkit-scrollbar,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__content::-webkit-scrollbar,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__pane--list::-webkit-scrollbar,
  .abyss-sidebar-nav-story--scrollbarless .abyss-sidebar-nav__detail-content::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;
const SETTINGS_CONTENT_STORY_STYLES = `
  .abyss-sidebar-nav-story__tab {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .abyss-sidebar-nav-story__card .abyss-card-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .abyss-sidebar-nav-story__description,
  .abyss-sidebar-nav-story__note {
    margin: 0;
    line-height: 1.5;
  }

  .abyss-sidebar-nav-story__description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.72);
  }

  .abyss-sidebar-nav-story__note {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .abyss-sidebar-nav-story__swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    gap: 12px;
  }

  .abyss-sidebar-nav-story__swatch {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .abyss-sidebar-nav-story__swatch-preview {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  }

  .abyss-sidebar-nav-story__swatch-label {
    font-size: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.78);
  }

  .abyss-sidebar-nav-story__keybind {
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    letter-spacing: 0.04em;
  }
`;
const SETTINGS_SOURCE_CODE = `<script setup lang="ts">
const tabs = [
  { id: 'appearance', label: 'Wygląd', icon: 'sym_r_palette' },
  { id: 'security', label: 'Bezpieczeństwo', icon: 'sym_r_shield_lock' },
  { id: 'data', label: 'Dane', icon: 'sym_r_database' },
  { id: 'accessibility', label: 'Dostępność', icon: 'sym_r_accessibility_new' },
];
</script>

<AbyssSidebarNav :tabs="tabs" model-value="appearance">
  <template #appearance>
    <AbyssCard title="Gradient tła">...</AbyssCard>
  </template>

  <template #security>
    <AbyssCard title="Blokada aplikacji">...</AbyssCard>
  </template>

  <template #data>
    <AbyssCard title="Kopia zapasowa">...</AbyssCard>
    <AbyssCard title="Reset danych">...</AbyssCard>
  </template>

  <template #accessibility>
    <AbyssCard title="Skala interfejsu">...</AbyssCard>
    <AbyssCard title="Uruchamianie aplikacji">...</AbyssCard>
  </template>
</AbyssSidebarNav>`;

const AppearanceTabPreview = defineComponent({
  name: 'AbyssSidebarNavStoryAppearanceTabPreview',
  components: {
    AbyssCard,
  },
  setup() {
    function resolveGradientStyle(colors: [string, string]) {
      return {
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      };
    }

    return {
      presets: APPEARANCE_PRESETS,
      resolveGradientStyle,
    };
  },
  template: `
    <div class="abyss-sidebar-nav-story__tab">
      <AbyssCard class="abyss-sidebar-nav-story__card" title="Gradient tła">
        <template #header-prepend>
          <q-icon name="sym_r_palette" size="20px" />
        </template>

        <template #content>
          <p class="abyss-sidebar-nav-story__description">
            Wybierz preset gradientu tła dla aplikacji i utrzymaj spójny kontrast na kartach.
          </p>

          <div class="abyss-sidebar-nav-story__swatches">
            <div
              v-for="preset in presets"
              :key="preset.label"
              class="abyss-sidebar-nav-story__swatch"
            >
              <span
                class="abyss-sidebar-nav-story__swatch-preview"
                :style="resolveGradientStyle(preset.colors)"
              />
              <span class="abyss-sidebar-nav-story__swatch-label">{{ preset.label }}</span>
            </div>
          </div>
        </template>
      </AbyssCard>
    </div>
  `,
});

const SecurityTabPreview = defineComponent({
  name: 'AbyssSidebarNavStorySecurityTabPreview',
  components: {
    AbyssCard,
    AbyssToggle,
  },
  setup() {
    const appLockEnabled = ref(false);

    return {
      appLockEnabled,
    };
  },
  template: `
    <div class="abyss-sidebar-nav-story__tab">
      <AbyssCard
        class="abyss-sidebar-nav-story__card"
        title="Blokada aplikacji"
      >
        <template #header-prepend>
          <q-icon name="sym_r_shield_lock" size="20px" />
        </template>

        <template #content>
          <AbyssToggle
            v-model="appLockEnabled"
            label="Wymagaj biometrii przy otwarciu"
            full-width
          />
        </template>
      </AbyssCard>
    </div>
  `,
});

const DataTabPreview = defineComponent({
  name: 'AbyssSidebarNavStoryDataTabPreview',
  components: {
    AbyssButton,
    AbyssCard,
    AbyssGrid,
    AbyssInfo,
  },
  template: `
    <div class="abyss-sidebar-nav-story__tab">
      <AbyssCard class="abyss-sidebar-nav-story__card" title="Konto">
        <template #header-prepend>
          <q-icon name="sym_r_person" size="20px" />
        </template>

        <template #content>
          <p class="abyss-sidebar-nav-story__description">
            Opcjonalne logowanie synchronizuje notatki z chmurą.
          </p>

          <AbyssGrid column-size="240px">
            <AbyssButton
              icon="sym_r_login"
              label="Zaloguj się"
              full-width
            />
            <AbyssButton
              icon="sym_r_person_add"
              label="Utwórz konto"
              embedded
              full-width
            />
          </AbyssGrid>
        </template>
      </AbyssCard>

      <AbyssCard class="abyss-sidebar-nav-story__card" title="Kopia zapasowa">
        <template #header-prepend>
          <q-icon name="sym_r_database" size="20px" />
        </template>

        <template #content>
          <p class="abyss-sidebar-nav-story__description">
            Eksportuj notatki do pliku JSON albo odtwórz dane z wcześniej zapisanej kopii.
          </p>

          <AbyssGrid column-size="240px">
            <AbyssButton
              icon="sym_r_download"
              label="Eksportuj dane"
              full-width
            />
            <AbyssButton
              icon="sym_r_upload"
              label="Importuj kopię"
              full-width
            />
          </AbyssGrid>
        </template>
      </AbyssCard>

      <AbyssCard class="abyss-sidebar-nav-story__card" title="Reset danych">
        <template #header-prepend>
          <q-icon name="sym_r_delete_forever" size="20px" />
        </template>

        <template #content>
          <AbyssInfo type="danger" icon="warning" title="Uwaga">
            Usunięcie danych wyczyści lokalne notatki i ustawienia na tym urządzeniu.
          </AbyssInfo>

          <AbyssGrid column-size="240px">
            <AbyssButton
              icon="sym_r_delete_forever"
              label="Usuń wszystkie dane"
              full-width
            />
          </AbyssGrid>
        </template>
      </AbyssCard>
    </div>
  `,
});

const AccessibilityTabPreview = defineComponent({
  name: 'AbyssSidebarNavStoryAccessibilityTabPreview',
  components: {
    AbyssCard,
    AbyssInfo,
    AbyssSlider,
    AbyssToggle,
  },
  setup() {
    const zoomOptionIndex = ref(2);
    const shortcutEnabled = ref(true);
    const launchAtStartup = ref(true);
    const launchMinimized = ref(false);

    const zoomLabel = computed(
      () => ZOOM_MARKER_LABELS[zoomOptionIndex.value] ?? ZOOM_MARKER_LABELS[0],
    );
    const launchMinimizedDisabled = computed(() => !launchAtStartup.value);

    return {
      launchAtStartup,
      launchMinimized,
      launchMinimizedDisabled,
      shortcutEnabled,
      zoomLabel,
      zoomMarkerLabels: ZOOM_MARKER_LABELS,
      zoomOptionIndex,
    };
  },
  template: `
    <div class="abyss-sidebar-nav-story__tab">
      <AbyssCard class="abyss-sidebar-nav-story__card" title="Skala interfejsu">
        <template #header-prepend>
          <q-icon name="sym_r_zoom_in_map" size="20px" />
        </template>

        <template #content>
          <AbyssSlider
            v-model="zoomOptionIndex"
            :min="0"
            :max="zoomMarkerLabels.length - 1"
            :step="1"
            :markers="true"
            :marker-labels="zoomMarkerLabels"
            :label="true"
            :label-value="zoomLabel"
            label-always
          />
        </template>
      </AbyssCard>

      <AbyssCard class="abyss-sidebar-nav-story__card" title="Skrót globalny">
        <template #header-prepend>
          <q-icon name="sym_r_window" size="20px" />
        </template>

        <template #content>
          <p class="abyss-sidebar-nav-story__description">
            Włącz skrót do szybkiego tworzenia notatki bez przechodzenia do okna aplikacji.
          </p>

          <AbyssToggle
            v-model="shortcutEnabled"
            label="Włącz skrót globalny"
            full-width
          />

          <div class="abyss-sidebar-nav-story__keybind">Ctrl + Shift + M</div>

          <AbyssInfo type="warning" icon="warning" title="Uwaga">
            Upewnij się, że skrót nie koliduje z globalnymi skrótami innych aplikacji.
          </AbyssInfo>
        </template>
      </AbyssCard>

      <AbyssCard
        class="abyss-sidebar-nav-story__card"
        title="Uruchamianie aplikacji"
      >
        <template #header-prepend>
          <q-icon name="sym_r_rocket_launch" size="20px" />
        </template>

        <template #content>
          <AbyssToggle
            v-model="launchAtStartup"
            label="Uruchamiaj przy starcie systemu"
            full-width
          />

          <AbyssToggle
            v-model="launchMinimized"
            label="Startuj zminimalizowaną"
            :disable="launchMinimizedDisabled"
            full-width
          />
        </template>
      </AbyssCard>
    </div>
  `,
});

const meta: Meta<typeof AbyssSidebarNav> = {
  title: 'UI/AbyssSidebarNav',
  component: AbyssSidebarNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Komponent nawigacji bocznej z zakładkami renderujący listę sekcji i zawartość aktywnej zakładki. Przy szerokim viewportcie pokazuje sidebar oraz panel treści obok siebie, a przy wąskim przełącza się między listą sekcji i widokiem szczegółów. Sidebar oraz panel treści używają mixin scrollbara (widoczny tylko na urządzeniach z myszką). Treść poszczególnych sekcji przekazywana jest przez sloty nazwane tak samo jak `id` elementów z `tabs`, na przykład `appearance` albo `security`. Dodatkowe elementy wewnątrz sidebara można wstawić przez sloty `sidebar-prepend` i `sidebar-append` renderowane odpowiednio przed i po liście zakładek.',
      },
    },
  },
  argTypes: {
    tabs: {
      control: false,
      description:
        'Lista sekcji nawigacji. Każdy obiekt definiuje `id`, etykietę oraz opcjonalną ikonę. Wartość `id` musi odpowiadać nazwie slotu z treścią danej sekcji.',
      table: {
        type: { summary: 'AbyssSidebarNavTab[]' },
      },
    },
    modelValue: {
      control: 'select',
      options: ['', ...TABS.map((tab) => tab.id)],
      description:
        "Id aktywnej sekcji. Wartość `''` pozostawia wybór komponentowi, który wtedy ustawia pierwszą pozycję z listy `tabs` jako aktywną.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    detailOpen: {
      control: 'boolean',
      description:
        'Steruje widocznością widoku szczegółów w wąskim viewportcie. Docelowo stan ten może być mapowany z routera wyżej w drzewie.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    device: {
      control: 'select',
      options: ['desktop', 'web', 'mobile'],
      description:
        'Kontekst urządzenia shellu aplikacji. Mixin scrollbara stosowany jest w układzie desktopowym dla `desktop` i `web`.',
      table: {
        type: { summary: "'desktop' | 'web' | 'mobile'" },
        defaultValue: { summary: "'desktop'" },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AbyssSidebarNav>;

const Wrapper = defineComponent({
  name: 'AbyssSidebarNavStoryWrapper',
  components: {
    AbyssTemplate,
    AbyssNavigation,
    AbyssBackground,
    AbyssSidebarNav,
    AbyssButton,
    AppearanceTabPreview,
    SecurityTabPreview,
    DataTabPreview,
    AccessibilityTabPreview,
  },
  props: {
    shellDevice: {
      type: String as () => 'desktop' | 'mobile' | 'web',
      required: true,
    },
    shellOrientation: {
      type: String as () => 'portrait' | 'landscape',
      default: 'portrait',
    },
    tabs: {
      type: Array as PropType<typeof TABS>,
      default: () => TABS,
    },
    modelValue: {
      type: String,
      default: '',
    },
    detailOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const active = ref(props.modelValue || props.tabs[0]?.id || '');
    const isDetailOpen = ref(props.detailOpen);
    const sidebarAppendPadding = computed(() => {
      if (props.shellDevice !== 'mobile') {
        return '12px 16px 16px';
      }

      return props.shellOrientation === 'landscape'
        ? '12px 8px 12px 8px'
        : '12px 8px 24px 8px';
    });

    watch(
      () => props.modelValue,
      (value) => {
        active.value = value || props.tabs[0]?.id || '';
      },
    );

    watch(
      () => props.tabs,
      (tabs) => {
        if (!tabs.find((tab) => tab.id === active.value)) {
          active.value = tabs[0]?.id || '';
        }
      },
      { deep: true },
    );

    watch(
      () => props.detailOpen,
      (detailOpen) => {
        isDetailOpen.value = detailOpen;
      },
    );

    function handleOpen(): void {
      isDetailOpen.value = true;
    }

    function handleBack(): void {
      isDetailOpen.value = false;
    }

    return {
      active,
      demoStyles: SETTINGS_CONTENT_STORY_STYLES,
      handleBack,
      handleOpen,
      isDetailOpen,
      logoUrl,
      sidebarAppendPadding,
    };
  },
  template: `
    <div style="width:100%;height:100%;">
      <component :is="'style'">{{ demoStyles }}</component>

      <AbyssTemplate
        :device="shellDevice"
        :orientation="shellOrientation"
        style="width:100%;height:100%;"
      >
        <template #background>
          <AbyssBackground
            :colors="['#a78bfa', '#60a5fa']"
            style="position:absolute;inset:0"
          />
        </template>

        <template #navigation-start>
          <AbyssNavigation :device="shellDevice" current-route="settings">
            <AbyssButton label="Start" icon="sym_r_home" route="home" embedded />
            <AbyssButton label="Analizy" icon="sym_r_insights" route="analysis" embedded />
            <AbyssButton label="Archiwum" icon="sym_r_archive" route="archive" embedded />
            <AbyssButton
              label="Ustawienia"
              icon="sym_r_settings"
              route="settings"
              embedded
            />
          </AbyssNavigation>
        </template>

        <template #content>
          <AbyssSidebarNav
            :device="shellDevice"
            :detail-open="isDetailOpen"
            :tabs="tabs"
            v-model="active"
            @back="handleBack"
            @open="handleOpen"
          >
            <template #sidebar-prepend>
              <div style="display:flex;flex-direction:column;align-items:center;padding:24px 16px 12px 16px;">
                <img
                  :src="logoUrl"
                  alt="Maia"
                  style="display:block;width:100%;height:auto;object-fit:contain;max-width:180px;"
                />
                <div style="margin-top:12px;line-height:1;font-size:12px;color:rgba(255,255,255,0.5);text-align:center;">v1.0.0</div>
                <div style="line-height:1;font-size:8px;color:rgba(255,255,255,0.3);text-align:center;">© 2024 Maia Software</div>
              </div>
            </template>

            <template #sidebar-append>
              <div
                v-if="shellDevice === 'mobile'"
                :style="{ padding: sidebarAppendPadding }"
              >
                <AbyssButton label="Zablokuj" icon="sym_r_lock" full-width />
              </div>
            </template>

            <template #appearance>
              <AppearanceTabPreview />
            </template>

            <template #security>
              <SecurityTabPreview />
            </template>

            <template #data>
              <DataTabPreview />
            </template>

            <template #accessibility>
              <AccessibilityTabPreview />
            </template>
          </AbyssSidebarNav>
        </template>
      </AbyssTemplate>
    </div>
  `,
});

export const Desktop: Story = {
  name: 'Desktop',
  parameters: {
    docs: {
      description: {
        story:
          'Desktopowy wariant pokazujący stały sidebar z sekcjami oraz przykładowe karty ustawień wzorowane na aktualnej stronie `SettingsPage`. Story jest renderowane w wrapperze o wymiarach okna aplikacji `1280×800`.',
      },
      source: {
        code: SETTINGS_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    components: { Wrapper },
    setup: () => ({ args, shellDevice: 'desktop' as const }),
    template: `
      <div style="${STORY_STAGE_STYLE}">
        <div style="${DESKTOP_FRAME_STYLE}">
          <Wrapper v-bind="args" :shell-device="shellDevice" />
        </div>
      </div>
    `,
  }),
  args: {
    tabs: TABS,
    modelValue: 'appearance',
  },
};

export const Web: Story = {
  name: 'Web',
  parameters: {
    docs: {
      description: {
        story:
          'Wariant webowy shellu z `device="web"`. Sidebar i panel treści korzystają z mixin scrollbara w układzie desktopowym (widoczny tylko na urządzeniach z myszką).',
      },
      source: {
        code: SETTINGS_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    components: { Wrapper },
    setup: () => ({ args, shellDevice: 'web' as const }),
    template: `
      <div style="${STORY_STAGE_STYLE}">
        <div style="${DESKTOP_FRAME_STYLE}">
          <Wrapper v-bind="args" :shell-device="shellDevice" />
        </div>
      </div>
    `,
  }),
  args: {
    tabs: TABS,
    modelValue: 'appearance',
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
    docs: {
      description: {
        story:
          'Mobilny wariant pokazany w wąskim viewportcie. Lista sekcji zajmuje cały ekran, a wybór pozycji otwiera osobny widok szczegółów z przykładowymi kartami ustawień.',
      },
      source: {
        code: SETTINGS_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    components: { Wrapper },
    setup: () => ({
      args,
      shellDevice: 'mobile' as const,
      shellOrientation: 'portrait' as const,
    }),
    template: `
      <div style="${STORY_STAGE_STYLE}">
        <div style="${MOBILE_FRAME_STYLE}">
          <Wrapper
            v-bind="args"
            :shell-device="shellDevice"
            :shell-orientation="shellOrientation"
          />
        </div>
      </div>
    `,
  }),
  args: {
    tabs: TABS,
    modelValue: 'appearance',
  },
  play: async ({ canvas, userEvent }) => {
    await expect(
      await canvas.findByRole('button', { name: 'Zablokuj' }),
    ).toBeVisible();

    const securityButton = await canvas.findByRole('button', {
      name: 'Bezpieczeństwo',
    });

    await expect(securityButton).toBeVisible();
    await userEvent.click(securityButton);

    await expect(await canvas.findByText('Blokada aplikacji')).toBeVisible();

    const backButton = await canvas.findByRole('button', { name: 'Wstecz' });

    await userEvent.click(backButton);

    await expect(
      await canvas.findByRole('button', { name: 'Bezpieczeństwo' }),
    ).toBeVisible();
  },
};

export const DesktopNarrow: Story = {
  name: 'Desktop Narrow',
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: {
      description: {
        story:
          'Desktopowy shell na wąskim oknie. Komponent nawigacji bocznej przełącza się tu w układ listy i szczegółu, ale zachowuje desktopowy kontekst strony.',
      },
      source: {
        code: SETTINGS_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    components: { Wrapper },
    setup: () => ({
      args,
      shellDevice: 'desktop' as const,
    }),
    template: `
      <div style="${STORY_STAGE_STYLE}">
        <div style="${DESKTOP_NARROW_FRAME_STYLE}">
          <Wrapper v-bind="args" :shell-device="shellDevice" />
        </div>
      </div>
    `,
  }),
  args: {
    tabs: TABS,
    modelValue: 'appearance',
  },
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Zablokuj' }),
    ).not.toBeInTheDocument();

    const securityButton = await canvas.findByRole('button', {
      name: 'Bezpieczeństwo',
    });

    await expect(securityButton).toBeVisible();
    await userEvent.click(securityButton);

    await expect(await canvas.findByText('Blokada aplikacji')).toBeVisible();

    await expect(
      canvas.queryByRole('button', { name: 'Zablokuj' }),
    ).not.toBeInTheDocument();

    const backButton = await canvas.findByRole('button', { name: 'Wstecz' });

    await userEvent.click(backButton);

    await expect(
      await canvas.findByRole('button', { name: 'Bezpieczeństwo' }),
    ).toBeVisible();
  },
};

export const MobileLandscape: Story = {
  name: 'Mobile Landscape',
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: {
      description: {
        story:
          'Kopia wariantu mobilnego z zamienionymi wymiarami wrappera na `844×390`, pokazująca te same przykładowe karty w poziomym układzie urządzenia.',
      },
      source: {
        code: SETTINGS_SOURCE_CODE,
      },
    },
  },
  render: (args) => ({
    components: { Wrapper },
    setup: () => ({
      args,
      shellDevice: 'mobile' as const,
      shellOrientation: 'landscape' as const,
      scrollbarlessStyles: MOBILE_STORY_SCROLLBAR_HIDDEN_STYLES,
    }),
    template: `
      <div class="abyss-sidebar-nav-story--scrollbarless" style="${STORY_STAGE_STYLE}">
        <component :is="'style'">{{ scrollbarlessStyles }}</component>
        <div style="${MOBILE_LANDSCAPE_FRAME_STYLE}">
          <Wrapper
            v-bind="args"
            :shell-device="shellDevice"
            :shell-orientation="shellOrientation"
          />
        </div>
      </div>
    `,
  }),
  args: {
    tabs: TABS,
    modelValue: 'appearance',
  },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('button', { name: 'Bezpieczeństwo' }),
    ).toBeVisible();
    await expect(await canvas.findByText('Gradient tła')).toBeVisible();
  },
};

