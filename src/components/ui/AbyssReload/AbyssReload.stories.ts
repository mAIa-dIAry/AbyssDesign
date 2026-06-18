import type { Meta, StoryObj } from "@storybook/vue3";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import AbyssReload from "@/components/ui/AbyssReload/AbyssReload.vue";
import { withAbyssBackground } from "@/stories/AbyssBackgroundDecorator";

const RELOAD_SIMULATION_MS = 1500;

type AbyssReloadStoryArgs = {
  loadingTop?: boolean;
  loadingBottom?: boolean;
  disabledTop?: boolean;
  disabledBottom?: boolean;
  activationThreshold?: number;
  size?: "default" | "large";
};

const demoItems = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  label: `Element listy ${index + 1}`,
}));

function useReloadHandlers() {
  const loadingTop = ref(false);
  const loadingBottom = ref(false);

  async function handleRefreshTop() {
    loadingTop.value = true;
    await new Promise((resolve) => setTimeout(resolve, RELOAD_SIMULATION_MS));
    loadingTop.value = false;
  }

  async function handleRefreshBottom() {
    loadingBottom.value = true;
    await new Promise((resolve) => setTimeout(resolve, RELOAD_SIMULATION_MS));
    loadingBottom.value = false;
  }

  return {
    loadingTop,
    loadingBottom,
    handleRefreshTop,
    handleRefreshBottom,
    reloadSimulationMs: RELOAD_SIMULATION_MS,
  };
}

const meta: Meta<AbyssReloadStoryArgs> = {
  title: "UI/AbyssReload",
  component: AbyssReload,
  tags: ["autodocs"],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          "Przewijany kontener z odświeżaniem od góry i od dołu. Loadery są stałymi elementami listy — " +
          "gdy loader znajdzie się w odległości `activationThreshold` (domyślnie 8 px) od krawędzi viewport, " +
          "emitowane jest zdarzenie `refresh-top` / `refresh-bottom` (sprawdzane natychmiast na `scroll`), " +
          "a rodzic ustawia `loadingTop` / `loadingBottom` (fade ikony → spinner). Cofnięcie częściowo widocznego loadera " +
          "następuje na `scrollend` (desktop) lub `touchend` (mobile). Po zakończeniu ładowania " +
          "scroll płynnie chowa loader poza viewport.",
      },
    },
  },
  argTypes: {
    loadingTop: {
      control: "boolean",
      description: "Stan ładowania wskaźnika u góry",
      table: { defaultValue: { summary: "false" } },
    },
    loadingBottom: {
      control: "boolean",
      description: "Stan ładowania wskaźnika u dołu",
      table: { defaultValue: { summary: "false" } },
    },
    disabledTop: {
      control: "boolean",
      description: "Wyłącza odświeżanie od góry",
      table: { defaultValue: { summary: "false" } },
    },
    disabledBottom: {
      control: "boolean",
      description: "Wyłącza odświeżanie od dołu",
      table: { defaultValue: { summary: "false" } },
    },
    activationThreshold: {
      control: { type: "number", min: 0, max: 32, step: 1 },
      description:
        "Próg scrollTop (px) od górnej/dolnej krawędzi, przy której następuje aktywacja odświeżenia",
      table: { defaultValue: { summary: "8" } },
    },
    size: {
      control: "select",
      options: ["default", "large"],
      description: "Rozmiar wskaźnika odświeżania",
      table: { defaultValue: { summary: "default" } },
    },
  },
};

export default meta;
type Story = StoryObj<AbyssReloadStoryArgs>;

export const Default: Story = {
  name: "Domyślny",
  args: {
    disabledTop: false,
    disabledBottom: false,
  },
  render: (args) => ({
    components: { AbyssReload },
    setup() {
      const handlers = useReloadHandlers();
      const reloadRef = ref<InstanceType<typeof AbyssReload> | null>(null);
      const scrollFromBottom = ref<number | null>(null);
      const bottomActivated = ref(false);

      function updateBottomScrollState(): void {
        const viewport = reloadRef.value?.viewportEl;

        if (!viewport) {
          return;
        }

        const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
        scrollFromBottom.value = maxScrollTop - viewport.scrollTop;
        bottomActivated.value =
          reloadRef.value?.isBottomLoaderActivated() ?? false;
      }

      function scrollToBottomAnchor(): void {
        const viewport = reloadRef.value?.viewportEl;
        const bottomLoader = reloadRef.value?.bottomLoaderEl;

        if (!viewport) {
          return;
        }

        const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
        const hideScrollTop = Math.max(
          0,
          maxScrollTop - (bottomLoader?.offsetHeight ?? 56),
        );

        viewport.scrollTop = hideScrollTop;
        updateBottomScrollState();
      }

      onMounted(() => {
        void nextTick(() => {
          scrollToBottomAnchor();

          const viewport = reloadRef.value?.viewportEl;

          if (!viewport) {
            return;
          }

          viewport.addEventListener("scroll", updateBottomScrollState, {
            passive: true,
          });
        });
      });

      onUnmounted(() => {
        reloadRef.value?.viewportEl?.removeEventListener(
          "scroll",
          updateBottomScrollState,
        );
      });

      return {
        args,
        demoItems,
        reloadRef,
        scrollFromBottom,
        bottomActivated,
        ...handlers,
      };
    },
    template: `
      <div style="height: 420px; width: min(100%, 480px);">
        <p style="margin: 0 0 8px; opacity: 0.72; font-size: 13px;">
          Start od dołu listy — przewiń w górę lub w dół do loadera (próg 8 px). Symulacja: {{ reloadSimulationMs / 1000 }}s.
        </p>
        <p
          v-if="scrollFromBottom !== null"
          style="margin: 0 0 8px; opacity: 0.55; font-size: 12px; font-family: monospace;"
        >
          Od dołu: {{ scrollFromBottom }}px
          <span v-if="bottomActivated">— loader aktywny</span>
        </p>
        <AbyssReload
          ref="reloadRef"
          :loading-top="loadingTop"
          :loading-bottom="loadingBottom"
          :disabled-top="args.disabledTop"
          :disabled-bottom="args.disabledBottom"
          :activation-threshold="args.activationThreshold ?? 8"
          :size="args.size"
          @refresh-top="handleRefreshTop"
          @refresh-bottom="handleRefreshBottom"
        >
          <div
            v-for="item in demoItems"
            :key="item.id"
            style="padding: 16px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
          >
            {{ item.label }}
          </div>
        </AbyssReload>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Lista startuje przewinięta do dołu (loader dolny poza viewport). " +
          "Wskaźnik „Od dołu” pokazuje dystans scrollTop od dolnej krawędzi — aktywacja przy ≤8 px. " +
          "Po wywołaniu odświeżenia ikona zanika na rzecz spinnera przez 1,5 sekundy.",
      },
      source: {
        code: `
<script setup lang="ts">
import { ref } from 'vue';

const loadingTop = ref(false);
const loadingBottom = ref(false);

async function handleRefreshTop() {
  loadingTop.value = true;
  await fetchOlderItems();
  loadingTop.value = false;
}

async function handleRefreshBottom() {
  loadingBottom.value = true;
  await fetchLatestItems();
  loadingBottom.value = false;
}
</script>

<template>
  <AbyssReload
    :loading-top="loadingTop"
    :loading-bottom="loadingBottom"
    @refresh-top="handleRefreshTop"
    @refresh-bottom="handleRefreshBottom"
  >
    <!-- przewijalna zawartość -->
  </AbyssReload>
</template>`,
      },
    },
  },
};

export const EmptyList: Story = {
  name: "Pusta lista",
  render: () => ({
    components: { AbyssReload },
    setup: useReloadHandlers,
    template: `
      <div style="height: 360px; width: min(100%, 420px);">
        <p style="margin: 0 0 8px; opacity: 0.72; font-size: 13px;">
          Treść ma min-height 100% viewportu + wysokość loaderów — odświeżanie działa nawet bez elementów.
        </p>
        <AbyssReload
          :loading-top="loadingTop"
          :loading-bottom="loadingBottom"
          @refresh-top="handleRefreshTop"
          @refresh-bottom="handleRefreshBottom"
        >
          <p style="margin: auto; text-align: center; opacity: 0.45;">
            Brak elementów
          </p>
        </AbyssReload>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Gdy slot jest pusty, obszar treści rozciąga się do pełnej wysokości kontenera, " +
          "dzięki czemu można przewinąć do obu loaderów.",
      },
      source: {
        code: `
<AbyssReload
  :loading-top="loadingTop"
  :loading-bottom="loadingBottom"
  @refresh-top="handleRefreshTop"
  @refresh-bottom="handleRefreshBottom"
>
  <p>Brak elementów</p>
</AbyssReload>`,
      },
    },
  },
};

export const LoadingStates: Story = {
  name: "Stany ładowania",
  render: () => ({
    components: { AbyssReload },
    setup: () => ({ demoItems: demoItems.slice(0, 8) }),
    template: `
      <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); width: min(100%, 960px);">
        <div style="height: 320px;">
          <p style="margin: 0 0 8px; opacity: 0.72;">Ładowanie u góry</p>
          <AbyssReload loading-top>
            <div
              v-for="item in demoItems"
              :key="'top-' + item.id"
              style="padding: 12px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
            >
              {{ item.label }}
            </div>
          </AbyssReload>
        </div>

        <div style="height: 320px;">
          <p style="margin: 0 0 8px; opacity: 0.72;">Ładowanie u dołu</p>
          <AbyssReload loading-bottom>
            <div
              v-for="item in demoItems"
              :key="'bottom-' + item.id"
              style="padding: 12px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
            >
              {{ item.label }}
            </div>
          </AbyssReload>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Podczas ładowania statyczna ikona zanika, a spinner pojawia się z fade. Scroll pozostaje aktywny.",
      },
      source: {
        code: `
<AbyssReload loading-top>
  <!-- zawartość -->
</AbyssReload>`,
      },
    },
  },
};

export const OnlyTop: Story = {
  name: "Tylko od góry",
  args: {
    disabledBottom: true,
  },
  render: (args) => ({
    components: { AbyssReload },
    setup() {
      const handlers = useReloadHandlers();
      return { args, demoItems, ...handlers };
    },
    template: `
      <div style="height: 360px; width: min(100%, 420px);">
        <AbyssReload
          :loading-top="loadingTop"
          disabled-bottom
          @refresh-top="handleRefreshTop"
        >
          <div
            v-for="item in demoItems"
            :key="item.id"
            style="padding: 14px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
          >
            {{ item.label }}
          </div>
        </AbyssReload>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Wariant z wyłączonym odświeżaniem od dołu.",
      },
      source: {
        code: `
<AbyssReload
  :loading-top="loadingTop"
  disabled-bottom
  @refresh-top="handleRefreshTop"
>
  <!-- zawartość -->
</AbyssReload>`,
      },
    },
  },
};
