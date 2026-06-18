<template>
  <div :class="['abyss-reload', $props.class]" :style="[rootStyle, style]">
    <div
      ref="viewportEl"
      class="abyss-reload__viewport"
      v-bind="$attrs"
      @scroll="handleScroll"
      @scrollend.passive="handleScrollEnd"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
      @touchcancel.passive="handleTouchEnd"
      @wheel.passive="handleWheel"
    >
      <div class="abyss-reload__content">
        <div
          v-if="!disabledTop"
          ref="topLoaderEl"
          class="abyss-reload__loader abyss-reload__loader--top"
          :class="{ 'abyss-reload__loader--large': size === 'large' }"
          aria-hidden="true"
        >
          <AbyssReloadIndicator :loading="effectiveLoadingTop" :size="size" />
        </div>

        <div class="abyss-reload__body">
          <slot />
        </div>

        <div
          v-if="!disabledBottom"
          ref="bottomLoaderEl"
          class="abyss-reload__loader abyss-reload__loader--bottom"
          :class="{ 'abyss-reload__loader--large': size === 'large' }"
          aria-hidden="true"
        >
          <AbyssReloadIndicator
            :loading="effectiveLoadingBottom"
            :size="size"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import AbyssReloadIndicator from "@/components/ui/AbyssReload/AbyssReloadIndicator.vue";

const DEFAULT_LOADER_HEIGHT = 56;
const DEFAULT_LOADER_HEIGHT_LARGE = 64;
const DEFAULT_ACTIVATION_THRESHOLD = 8;

export interface AbyssReloadProps {
  /** Stan ładowania wskaźnika u góry (fade ikony → spinner). */
  loadingTop?: boolean;
  /** Stan ładowania wskaźnika u dołu (fade ikony → spinner). */
  loadingBottom?: boolean;
  /** Wyłącza odświeżanie od góry. */
  disabledTop?: boolean;
  /** Wyłącza odświeżanie od dołu. */
  disabledBottom?: boolean;
  /** Próg scrollTop (px) od górnej/dolnej krawędzi, przy którym następuje aktywacja odświeżenia. */
  activationThreshold?: number;
  /** Rozmiar wskaźnika odświeżania. */
  size?: "default" | "large";
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssReloadProps>(), {
  loadingTop: false,
  loadingBottom: false,
  disabledTop: false,
  disabledBottom: false,
  activationThreshold: DEFAULT_ACTIVATION_THRESHOLD,
  size: "default",
  class: "",
  style: "",
});

const emit = defineEmits<{
  "refresh-top": [];
  "refresh-bottom": [];
}>();

const viewportEl = ref<HTMLElement | null>(null);
const topLoaderEl = ref<HTMLElement | null>(null);
const bottomLoaderEl = ref<HTMLElement | null>(null);

const pendingTop = ref(false);
const pendingBottom = ref(false);

let lastScrollTop = -1;
let scrollDirection: "up" | "down" = "down";
let isTouchActive = false;
let programmaticScrollTarget: number | null = null;

/** Debug scrolla — nie usuwać (diagnoza AbyssReload). */
function logScrollDebug(event: string, details: Record<string, unknown>): void {
  console.log("[AbyssReload]", event, details);
}

const loaderHeight = computed(() =>
  props.size === "large" ? DEFAULT_LOADER_HEIGHT_LARGE : DEFAULT_LOADER_HEIGHT,
);

const activationThresholdPx = computed(
  () => props.activationThreshold ?? DEFAULT_ACTIVATION_THRESHOLD,
);

const effectiveLoadingTop = computed(
  () => props.loadingTop || pendingTop.value,
);

const effectiveLoadingBottom = computed(
  () => props.loadingBottom || pendingBottom.value,
);

const rootStyle = computed(() => ({
  "--abyss-reload-loader-height": `${loaderHeight.value}px`,
  "--abyss-reload-top-inset": props.disabledTop
    ? "0px"
    : `${loaderHeight.value}px`,
  "--abyss-reload-bottom-inset": props.disabledBottom
    ? "0px"
    : `${loaderHeight.value}px`,
}));

function getMaxScrollTop(container: HTMLElement): number {
  return container.scrollHeight - container.clientHeight;
}

function isTopScrollActivated(scrollTop: number): boolean {
  return scrollTop <= activationThresholdPx.value;
}

function isBottomScrollActivated(
  container: HTMLElement,
  scrollTop: number,
): boolean {
  return scrollTop >= getMaxScrollTop(container) - activationThresholdPx.value;
}

function isTopScrollPartial(
  container: HTMLElement,
  scrollTop: number,
): boolean {
  const loader = topLoaderEl.value;

  if (!loader || props.disabledTop) {
    return false;
  }

  const hideScrollTop = loader.offsetHeight;

  return scrollTop > activationThresholdPx.value && scrollTop < hideScrollTop;
}

function isBottomScrollPartial(
  container: HTMLElement,
  scrollTop: number,
): boolean {
  const loader = bottomLoaderEl.value;

  if (!loader || props.disabledBottom) {
    return false;
  }

  const maxScrollTop = getMaxScrollTop(container);
  const hideScrollTop = Math.max(0, maxScrollTop - loader.offsetHeight);

  return (
    scrollTop > hideScrollTop &&
    scrollTop < maxScrollTop - activationThresholdPx.value
  );
}

function isTopLoaderActivated(): boolean {
  const container = viewportEl.value;

  if (!container) {
    return false;
  }

  return isTopScrollActivated(container.scrollTop);
}

function isBottomLoaderActivated(): boolean {
  const container = viewportEl.value;

  if (!container) {
    return false;
  }

  return isBottomScrollActivated(container, container.scrollTop);
}

function canRefreshTop(): boolean {
  return !props.disabledTop && !props.loadingTop && !pendingTop.value;
}

function canRefreshBottom(): boolean {
  return !props.disabledBottom && !props.loadingBottom && !pendingBottom.value;
}

function triggerRefreshTop(): void {
  if (!canRefreshTop()) {
    return;
  }

  pendingTop.value = true;
  logScrollDebug("refresh-top", {
    scrollTop: viewportEl.value?.scrollTop ?? null,
    direction: scrollDirection,
    loadingTop: true,
    loadingTopProp: props.loadingTop,
    pendingTop: pendingTop.value,
    loadingBottom: effectiveLoadingBottom.value,
  });
  emit("refresh-top");
}

function triggerRefreshBottom(): void {
  if (!canRefreshBottom()) {
    return;
  }

  pendingBottom.value = true;
  logScrollDebug("refresh-bottom", {
    scrollTop: viewportEl.value?.scrollTop ?? null,
    direction: scrollDirection,
    loadingBottom: true,
    loadingBottomProp: props.loadingBottom,
    pendingBottom: pendingBottom.value,
    loadingTop: effectiveLoadingTop.value,
  });
  emit("refresh-bottom");
}

function checkTopActivation(scrollTop: number): void {
  if (props.disabledTop || !isTopScrollActivated(scrollTop)) {
    return;
  }

  if (effectiveLoadingTop.value) {
    return;
  }

  if (!canRefreshTop()) {
    logScrollDebug("activation-blocked-top", {
      scrollTop,
      direction: scrollDirection,
      loadingTopProp: props.loadingTop,
      pendingTop: pendingTop.value,
    });
    return;
  }

  triggerRefreshTop();
}

function checkBottomActivation(
  container: HTMLElement,
  scrollTop: number,
): void {
  if (props.disabledBottom || !isBottomScrollActivated(container, scrollTop)) {
    return;
  }

  if (effectiveLoadingBottom.value) {
    return;
  }

  if (!canRefreshBottom()) {
    logScrollDebug("activation-blocked-bottom", {
      scrollTop,
      direction: scrollDirection,
      loadingBottomProp: props.loadingBottom,
      pendingBottom: pendingBottom.value,
    });
    return;
  }

  triggerRefreshBottom();
}

function startProgrammaticScroll(target: number): void {
  programmaticScrollTarget = target;
  logScrollDebug("programmatic-scroll-start", { target });
}

function cancelProgrammaticScroll(reason: string): void {
  const container = viewportEl.value;

  if (!container || programmaticScrollTarget === null) {
    return;
  }

  const scrollTop = container.scrollTop;
  container.scrollTo({ top: scrollTop, behavior: "auto" });
  programmaticScrollTarget = null;
  logScrollDebug("programmatic-scroll-cancelled", { scrollTop, reason });
}

function shouldCheckTopActivation(scrollTop: number): boolean {
  if (scrollDirection === "up") {
    return true;
  }

  if (!isTopScrollActivated(scrollTop)) {
    return false;
  }

  return programmaticScrollTarget === null;
}

function shouldCheckBottomActivation(
  container: HTMLElement,
  scrollTop: number,
): boolean {
  if (scrollDirection === "down") {
    return true;
  }

  if (!isBottomScrollActivated(container, scrollTop)) {
    return false;
  }

  return programmaticScrollTarget === null;
}

function hideTopLoader(): void {
  const container = viewportEl.value;
  const loader = topLoaderEl.value;

  if (!container || !loader || props.disabledTop) {
    return;
  }

  startProgrammaticScroll(loader.offsetHeight);
  container.scrollTo({
    top: loader.offsetHeight,
    behavior: "smooth",
  });
}

function hideBottomLoader(): void {
  const container = viewportEl.value;
  const loader = bottomLoaderEl.value;

  if (!container || !loader || props.disabledBottom) {
    return;
  }

  const maxScrollTop = container.scrollHeight - container.clientHeight;
  const targetScrollTop = Math.max(0, maxScrollTop - loader.offsetHeight);

  startProgrammaticScroll(targetScrollTop);
  container.scrollTo({
    top: targetScrollTop,
    behavior: "smooth",
  });
}

function hidePartialLoaders(): void {
  if (effectiveLoadingTop.value || effectiveLoadingBottom.value) {
    return;
  }

  const container = viewportEl.value;

  if (!container) {
    return;
  }

  const scrollTop = container.scrollTop;

  if (!props.disabledTop && isTopScrollPartial(container, scrollTop)) {
    hideTopLoader();
  }

  if (!props.disabledBottom && isBottomScrollPartial(container, scrollTop)) {
    hideBottomLoader();
  }
}

function handleScroll(): void {
  const container = viewportEl.value;

  if (!container) {
    return;
  }

  const scrollTop = container.scrollTop;

  if (lastScrollTop !== -1) {
    if (scrollTop > lastScrollTop) {
      scrollDirection = "down";
    } else if (scrollTop < lastScrollTop) {
      scrollDirection = "up";
    }

    if (programmaticScrollTarget !== null) {
      const userOpposesProgrammaticScroll =
        (programmaticScrollTarget > scrollTop && scrollTop < lastScrollTop) ||
        (programmaticScrollTarget < scrollTop && scrollTop > lastScrollTop);

      if (userOpposesProgrammaticScroll) {
        cancelProgrammaticScroll("user-scroll");
      }
    }
  }

  if (shouldCheckTopActivation(scrollTop)) {
    checkTopActivation(scrollTop);
  }

  if (shouldCheckBottomActivation(container, scrollTop)) {
    checkBottomActivation(container, scrollTop);
  }

  logScrollDebug("scroll", {
    scrollTop,
    lastScrollTop,
    direction: scrollDirection,
    programmaticScrollTarget,
    activationThreshold: activationThresholdPx.value,
    loadingTop: effectiveLoadingTop.value,
    loadingBottom: effectiveLoadingBottom.value,
    loadingTopProp: props.loadingTop,
    loadingBottomProp: props.loadingBottom,
    pendingTop: pendingTop.value,
    pendingBottom: pendingBottom.value,
    topActivated: isTopScrollActivated(scrollTop),
    bottomActivated: isBottomScrollActivated(container, scrollTop),
  });

  lastScrollTop = scrollTop;
}

function handleScrollEnd(): void {
  if (!isTouchActive && programmaticScrollTarget !== null) {
    logScrollDebug("programmatic-scroll-complete", {
      scrollTop: viewportEl.value?.scrollTop ?? null,
      target: programmaticScrollTarget,
    });
    programmaticScrollTarget = null;
  }

  if (isTouchActive) {
    return;
  }

  hidePartialLoaders();
}

function handleTouchStart(): void {
  cancelProgrammaticScroll("touchstart");
  isTouchActive = true;
}

function handleTouchEnd(): void {
  isTouchActive = false;
  hidePartialLoaders();
}

function handleWheel(): void {
  cancelProgrammaticScroll("wheel");
}

watch(
  () => props.loadingTop,
  (loading, wasLoading) => {
    if (loading) {
      pendingTop.value = false;
      return;
    }

    if (wasLoading) {
      hideTopLoader();
    }
  },
);

watch(
  () => props.loadingBottom,
  (loading, wasLoading) => {
    if (loading) {
      pendingBottom.value = false;
      return;
    }

    if (wasLoading) {
      hideBottomLoader();
    }
  },
);

onMounted(() => {
  void nextTick(() => {
    const container = viewportEl.value;
    const topLoader = topLoaderEl.value;

    if (!container) {
      return;
    }

    if (
      topLoader &&
      !props.disabledTop &&
      container.scrollTop < topLoader.offsetHeight
    ) {
      container.scrollTop = topLoader.offsetHeight;
    }

    lastScrollTop = container.scrollTop;
    scrollDirection = "down";
    programmaticScrollTarget = null;
  });
});

defineExpose({
  viewportEl,
  topLoaderEl,
  bottomLoaderEl,
  hideTopLoader,
  hideBottomLoader,
  isTopLoaderActivated,
  isBottomLoaderActivated,
});
</script>

<style scoped lang="scss">
.abyss-reload {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;

  &__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  &__content {
    display: flex;
    flex-direction: column;
    min-height: calc(
      100% + var(--abyss-reload-top-inset) + var(--abyss-reload-bottom-inset)
    );
  }

  &__body {
    flex: 1 1 auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__loader {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    height: var(--abyss-reload-loader-height);
  }
}
</style>
