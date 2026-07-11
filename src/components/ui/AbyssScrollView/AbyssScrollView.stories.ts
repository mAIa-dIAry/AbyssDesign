import type { Meta, StoryObj } from "@storybook/vue3";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import AbyssInfo from "@/components/ui/AbyssInfo/AbyssInfo.vue";
import AbyssScrollView from "@/components/ui/AbyssScrollView/AbyssScrollView.vue";
import { withAbyssBackground } from "@/stories/AbyssBackgroundDecorator";

const RELOAD_SIMULATION_MS = 1500;

const RELOAD_STORY_HINT_STYLE =
  "flex-shrink: 0; margin: 0 0 8px; opacity: 0.72; font-size: 13px;";
const RELOAD_STORY_RELOAD_STYLE = "flex: 1 1 auto; min-height: 0;";
const RELOAD_STORY_EMPTY_STATE_STYLE =
  "display: flex; flex: 1 1 auto; flex-direction: column; justify-content: center; align-items: center; min-height: 100%; padding: 16px; box-sizing: border-box;";

function reloadStoryFrameStyle(height: number, width = 480): string {
  return [
    "display: flex",
    "flex-direction: column",
    `height: ${height}px`,
    `width: min(100%, ${width}px)`,
    "overflow: hidden",
    "min-height: 0",
    "box-sizing: border-box",
  ].join("; ");
}

type AbyssScrollViewStoryArgs = {
  device?: "mobile" | "desktop" | "web";
  padded?: boolean;
  loadingTop?: boolean;
  loadingBottom?: boolean;
  disabledTop?: boolean;
  disabledBottom?: boolean;
  activationThreshold?: number;
  size?: "default" | "large";
  loaderGapTop?: number;
  loaderGapBottom?: number;
  indicatorPaddingTop?: number;
  indicatorPaddingBottom?: number;
  minLoadingTime?: number;
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

const meta: Meta<AbyssScrollViewStoryArgs> = {
  title: "UI/AbyssScrollView",
  component: AbyssScrollView,
  tags: ["autodocs"],
  decorators: [withAbyssBackground],
  parameters: {
    docs: {
      description: {
        component:
          "Przewijany kontener strony z domyślnymi paddingami treści (zależnymi od `device`). " +
          "Opcjonalnie obsługuje odświeżanie od góry i od dołu — domyślnie wyłączone (`disabledTop` / `disabledBottom`). " +
          "Loadery są stałymi elementami listy; aktywacja przy progu `activationThreshold` (8 px).",
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
      table: { defaultValue: { summary: "true" } },
    },
    disabledBottom: {
      control: "boolean",
      description: "Wyłącza odświeżanie od dołu",
      table: { defaultValue: { summary: "true" } },
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
    loaderGapTop: {
      control: { type: "number", min: 0, max: 64, step: 4 },
      description: "Odstęp (px) między górnym wskaźnikiem a treścią listy",
      table: { defaultValue: { summary: "0" } },
    },
    loaderGapBottom: {
      control: { type: "number", min: 0, max: 64, step: 4 },
      description: "Odstęp (px) między treścią listy a dolnym wskaźnikiem",
      table: { defaultValue: { summary: "0" } },
    },
    indicatorPaddingTop: {
      control: { type: "number", min: 0, max: 64, step: 4 },
      description:
        "Padding (px) wrappera górnego wskaźnika od zewnętrznej krawędzi listy",
      table: { defaultValue: { summary: "0" } },
    },
    indicatorPaddingBottom: {
      control: { type: "number", min: 0, max: 64, step: 4 },
      description:
        "Padding (px) wrappera dolnego wskaźnika od zewnętrznej krawędzi listy",
      table: { defaultValue: { summary: "0" } },
    },
    minLoadingTime: {
      control: { type: "number", min: 0, max: 5000, step: 100 },
      description:
        "Minimalny czas (ms) utrzymania stanu ładowania po zakończeniu odświeżania",
      table: { defaultValue: { summary: "0" } },
    },
  },
};

export default meta;
type Story = StoryObj<AbyssScrollViewStoryArgs>;

export const Default: Story = {
  name: "Domyślny",
  args: {
    device: "desktop",
    disabledTop: false,
    disabledBottom: false,
  },
  render: (args) => ({
    components: { AbyssScrollView },
    setup() {
      const handlers = useReloadHandlers();
      const reloadRef = ref<InstanceType<typeof AbyssScrollView> | null>(null);
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
      <div :style="'${reloadStoryFrameStyle(420)}'">
        <p :style="'${RELOAD_STORY_HINT_STYLE}'">
          Start od dołu listy — przewiń w górę lub w dół do loadera (próg 8 px). Symulacja: {{ reloadSimulationMs / 1000 }}s.
        </p>
        <p
          v-if="scrollFromBottom !== null"
          style="flex-shrink: 0; margin: 0 0 8px; opacity: 0.55; font-size: 12px; font-family: monospace;"
        >
          Od dołu: {{ scrollFromBottom }}px
          <span v-if="bottomActivated">— loader aktywny</span>
        </p>
        <AbyssScrollView
          ref="reloadRef"
          device="desktop"
          :style="'${RELOAD_STORY_RELOAD_STYLE}'"
          :loading-top="loadingTop"
          :loading-bottom="loadingBottom"
          :disabled-top="args.disabledTop"
          :disabled-bottom="args.disabledBottom"
          :activation-threshold="args.activationThreshold ?? 8"
          :size="args.size"
          :loader-gap-top="args.loaderGapTop ?? 0"
          :loader-gap-bottom="args.loaderGapBottom ?? 0"
          :indicator-padding-top="args.indicatorPaddingTop ?? 0"
          :indicator-padding-bottom="args.indicatorPaddingBottom ?? 0"
          :min-loading-time="args.minLoadingTime ?? 0"
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
        </AbyssScrollView>
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
  <AbyssScrollView
    device="desktop"
    :disabled-top="false"
    :disabled-bottom="false"
    :loading-top="loadingTop"
    :loading-bottom="loadingBottom"
    @refresh-top="handleRefreshTop"
    @refresh-bottom="handleRefreshBottom"
  >
    <!-- przewijalna zawartość -->
  </AbyssScrollView>
</template>`,
      },
    },
  },
};

export const EmptyList: Story = {
  name: "Pusta lista",
  render: () => ({
    components: { AbyssScrollView },
    setup: useReloadHandlers,
    template: `
      <div :style="'${reloadStoryFrameStyle(360, 420)}'">
        <p :style="'${RELOAD_STORY_HINT_STYLE}'">
          Treść ma min-height 100% viewportu + wysokość loaderów — odświeżanie działa nawet bez elementów.
        </p>
        <AbyssScrollView
          device="desktop"
          :style="'${RELOAD_STORY_RELOAD_STYLE}'"
          :loading-top="loadingTop"
          :loading-bottom="loadingBottom"
          :disabled-top="false"
          :disabled-bottom="false"
          @refresh-top="handleRefreshTop"
          @refresh-bottom="handleRefreshBottom"
        >
          <p style="margin: auto; text-align: center; opacity: 0.45;">
            Brak elementów
          </p>
        </AbyssScrollView>
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
<AbyssScrollView
  :loading-top="loadingTop"
  :loading-bottom="loadingBottom"
  @refresh-top="handleRefreshTop"
  @refresh-bottom="handleRefreshBottom"
>
  <p>Brak elementów</p>
</AbyssScrollView>`,
      },
    },
  },
};

function useTopLoadingStoryDemo() {
  const topReloadRef = ref<InstanceType<typeof AbyssScrollView> | null>(null);
  const loadingTop = ref(false);

  async function simulateTopLoading(): Promise<void> {
    if (loadingTop.value) {
      return;
    }

    loadingTop.value = true;
    await new Promise((resolve) => setTimeout(resolve, RELOAD_SIMULATION_MS));
    loadingTop.value = false;
  }

  function positionTopLoaderForDemo(): void {
    const reload = topReloadRef.value;
    const viewport = reload?.viewportEl;
    const topLoader = reload?.topLoaderEl;

    if (!viewport || !topLoader) {
      return;
    }

    const applyScroll = (): void => {
      viewport.scrollTop = Math.min(
        topLoader.offsetHeight,
        viewport.scrollHeight - viewport.clientHeight,
      );
    };

    if (reload?.withSuppressedActivation) {
      reload.withSuppressedActivation(applyScroll);
      return;
    }

    applyScroll();
  }

  onMounted(() => {
    void nextTick(() => {
      positionTopLoaderForDemo();
      void simulateTopLoading();
    });
  });

  return {
    topReloadRef,
    loadingTop,
    simulateTopLoading,
  };
}

function useBottomLoadingStoryDemo() {
  const bottomReloadRef = ref<InstanceType<typeof AbyssScrollView> | null>(null);
  const loadingBottom = ref(false);

  async function simulateBottomLoading(): Promise<void> {
    if (loadingBottom.value) {
      return;
    }

    loadingBottom.value = true;
    await new Promise((resolve) => setTimeout(resolve, RELOAD_SIMULATION_MS));
    loadingBottom.value = false;
  }

  function positionBottomLoaderForDemo(): void {
    const reload = bottomReloadRef.value;
    const viewport = reload?.viewportEl;
    const bottomLoader = reload?.bottomLoaderEl;

    if (!viewport || !bottomLoader) {
      return;
    }

    const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
    const applyScroll = (): void => {
      viewport.scrollTop = Math.max(0, maxScrollTop - bottomLoader.offsetHeight);
    };

    if (reload?.withSuppressedActivation) {
      reload.withSuppressedActivation(applyScroll);
      return;
    }

    applyScroll();
  }

  onMounted(() => {
    void nextTick(() => {
      positionBottomLoaderForDemo();
      void simulateBottomLoading();
    });
  });

  return {
    bottomReloadRef,
    loadingBottom,
    simulateBottomLoading,
  };
}

export const LoadingStates: Story = {
  name: "Stany ładowania",
  render: () => ({
    components: { AbyssScrollView },
    setup() {
      const items = demoItems.slice(0, 8);
      const topDemo = useTopLoadingStoryDemo();
      const bottomDemo = useBottomLoadingStoryDemo();

      return {
        items,
        reloadSimulationMs: RELOAD_SIMULATION_MS,
        ...topDemo,
        ...bottomDemo,
      };
    },
    template: `
      <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); width: min(100%, 960px);">
        <div :style="'${reloadStoryFrameStyle(320, 280)}'">
          <p :style="'${RELOAD_STORY_HINT_STYLE}'">
            Ładowanie u góry — symulacja {{ reloadSimulationMs / 1000 }} s, potem spinner znika.
          </p>
          <AbyssScrollView
            ref="topReloadRef"
            device="desktop"
            data-testid="abyss-scroll-view-loading-top"
            :style="'${RELOAD_STORY_RELOAD_STYLE}'"
            :loading-top="loadingTop"
            :loading-bottom="false"
            :disabled-top="false"
            disabled-bottom
            @refresh-top="simulateTopLoading"
          >
            <div
              v-for="item in items"
              :key="'top-' + item.id"
              style="padding: 12px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
            >
              {{ item.label }}
            </div>
          </AbyssScrollView>
        </div>

        <div :style="'${reloadStoryFrameStyle(320, 280)}'">
          <p :style="'${RELOAD_STORY_HINT_STYLE}'">
            Ładowanie u dołu — symulacja {{ reloadSimulationMs / 1000 }} s, potem spinner znika.
          </p>
          <AbyssScrollView
            ref="bottomReloadRef"
            device="desktop"
            data-testid="abyss-scroll-view-loading-bottom"
            :style="'${RELOAD_STORY_RELOAD_STYLE}'"
            :loading-top="false"
            :loading-bottom="loadingBottom"
            disabled-top
            :disabled-bottom="false"
            @refresh-bottom="simulateBottomLoading"
          >
            <div
              v-for="item in items"
              :key="'bottom-' + item.id"
              style="padding: 12px; margin-bottom: 8px; border-radius: 8px; background: rgba(255,255,255,0.04);"
            >
              {{ item.label }}
            </div>
          </AbyssScrollView>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Po wejściu w story oba loadery startują w stanie ładowania na 1,5 s, " +
          "a potem rodzic ustawia `loadingTop` / `loadingBottom` na `false`, co uruchamia chowanie loadera w komponencie.",
      },
      source: {
        code: `
<AbyssScrollView loading-top>
  <!-- zawartość -->
</AbyssScrollView>`,
      },
    },
  },
};

export const LoadingStatesEmptyList: Story = {
  name: "Stany ładowania — pusta lista",
  render: () => ({
    components: { AbyssScrollView, AbyssInfo },
    setup() {
      const topDemo = useTopLoadingStoryDemo();
      const bottomDemo = useBottomLoadingStoryDemo();

      return {
        reloadSimulationMs: RELOAD_SIMULATION_MS,
        emptyStateStyle: RELOAD_STORY_EMPTY_STATE_STYLE,
        ...topDemo,
        ...bottomDemo,
      };
    },
    template: `
      <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); width: min(100%, 960px);">
        <div :style="'${reloadStoryFrameStyle(320, 280)}'">
          <p :style="'${RELOAD_STORY_HINT_STYLE}'">
            Pusty stan — ładowanie u góry ({{ reloadSimulationMs / 1000 }} s).
          </p>
          <AbyssScrollView
            ref="topReloadRef"
            device="desktop"
            data-testid="abyss-scroll-view-loading-top-empty"
            :style="'${RELOAD_STORY_RELOAD_STYLE}'"
            :loading-top="loadingTop"
            :loading-bottom="false"
            :disabled-top="false"
            disabled-bottom
            @refresh-top="simulateTopLoading"
          >
            <div :style="emptyStateStyle">
              <AbyssInfo type="hint" icon="inbox" style="max-width: 280px;">
                Brak wpisów w archiwum
              </AbyssInfo>
            </div>
          </AbyssScrollView>
        </div>

        <div :style="'${reloadStoryFrameStyle(320, 280)}'">
          <p :style="'${RELOAD_STORY_HINT_STYLE}'">
            Pusty stan — ładowanie u dołu ({{ reloadSimulationMs / 1000 }} s).
          </p>
          <AbyssScrollView
            ref="bottomReloadRef"
            device="desktop"
            data-testid="abyss-scroll-view-loading-bottom-empty"
            :style="'${RELOAD_STORY_RELOAD_STYLE}'"
            :loading-top="false"
            :loading-bottom="loadingBottom"
            disabled-top
            :disabled-bottom="false"
            @refresh-bottom="simulateBottomLoading"
          >
            <div :style="emptyStateStyle">
              <AbyssInfo type="hint" icon="inbox" style="max-width: 280px;">
                Brak wpisów w archiwum
              </AbyssInfo>
            </div>
          </AbyssScrollView>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Wariant `Stany ładowania` z pustą listą i `AbyssInfo` — sprawdza zachowanie loaderów " +
          "gdy jedyną treścią jest empty state (jak w Archiwum).",
      },
      source: {
        code: `
<AbyssScrollView :loading-bottom="loadingBottom" @refresh-bottom="handleRefreshBottom">
  <div class="empty-state">
    <AbyssInfo type="hint" icon="inbox">Brak wpisów w archiwum</AbyssInfo>
  </div>
</AbyssScrollView>`,
      },
    },
  },
};

export const OnlyTop: Story = {
  name: "Tylko od góry",
  args: {
    device: "desktop",
    disabledBottom: true,
    disabledTop: false,
  },
  render: (args) => ({
    components: { AbyssScrollView },
    setup() {
      const handlers = useReloadHandlers();
      return { args, demoItems, ...handlers };
    },
    template: `
      <div :style="'${reloadStoryFrameStyle(360, 420)}'">
        <AbyssScrollView
          device="desktop"
          :style="'${RELOAD_STORY_RELOAD_STYLE}'"
          :loading-top="loadingTop"
          :disabled-top="false"
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
        </AbyssScrollView>
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
<AbyssScrollView
  device="desktop"
  :disabled-top="false"
  :loading-top="loadingTop"
  disabled-bottom
  @refresh-top="handleRefreshTop"
>
  <!-- zawartość -->
</AbyssScrollView>`,
      },
    },
  },
};
