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
      @touchcancel.passive="handleTouchCancel"
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

        <div
          v-if="paddingTopPx > 0"
          class="abyss-reload__spacer abyss-reload__spacer--top"
          aria-hidden="true"
          :style="topSpacerStyle"
        />

        <div class="abyss-reload__body">
          <slot />
        </div>

        <div
          v-if="paddingBottomPx > 0"
          class="abyss-reload__spacer abyss-reload__spacer--bottom"
          aria-hidden="true"
          :style="bottomSpacerStyle"
        />

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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AbyssReloadIndicator from "@/components/ui/AbyssReload/AbyssReloadIndicator.vue";

const DEFAULT_LOADER_HEIGHT = 56;
const DEFAULT_LOADER_HEIGHT_LARGE = 64;
const DEFAULT_ACTIVATION_THRESHOLD = 8;
/** Minimalny przyrost scrollTop (px) przy aktywacji — chroni przed fałszywym triggerem po programatycznym scrollu. */
const REFRESH_SCROLL_DELTA = 12;

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
  /** Odstęp (px) między górnym wskaźnikiem a treścią listy. */
  paddingTop?: number;
  /** Odstęp (px) między treścią listy a dolnym wskaźnikiem. */
  paddingBottom?: number;
  /** Wewnętrzny padding (px) wrappera górnego wskaźnika od zewnętrznej krawędzi listy. */
  indicatorPaddingTop?: number;
  /** Wewnętrzny padding (px) wrappera dolnego wskaźnika od zewnętrznej krawędzi listy. */
  indicatorPaddingBottom?: number;
  /** Minimalny czas (ms) utrzymania stanu ładowania po zakończeniu odświeżania. */
  minLoadingTime?: number;
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
  paddingTop: 0,
  paddingBottom: 0,
  indicatorPaddingTop: 0,
  indicatorPaddingBottom: 0,
  minLoadingTime: 0,
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
const holdLoadingTop = ref(false);
const holdLoadingBottom = ref(false);

let lastScrollTop = -1;
let scrollDirection: "up" | "down" = "down";
let isTouchActive = false;
let activationSuppressedDepth = 0;
let programmaticScrollTarget: number | null = null;
type UserScrollGestureKind = "touch" | "wheel";
let activeUserScrollGesture: UserScrollGestureKind | null = null;
let bottomUserScrollAccum = 0;
let topUserScrollAccum = 0;
let touchStartScrollTop: number | null = null;
let loadingTopStartedAt: number | null = null;
let loadingBottomStartedAt: number | null = null;
let topLoadingFinishTimer: ReturnType<typeof setTimeout> | null = null;
let bottomLoadingFinishTimer: ReturnType<typeof setTimeout> | null = null;

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
  () => props.loadingTop || pendingTop.value || holdLoadingTop.value,
);

const effectiveLoadingBottom = computed(
  () => props.loadingBottom || pendingBottom.value || holdLoadingBottom.value,
);

const minLoadingTimeMs = computed(() => Math.max(0, props.minLoadingTime ?? 0));

function clearTopLoadingFinishTimer(): void {
  if (topLoadingFinishTimer !== null) {
    clearTimeout(topLoadingFinishTimer);
    topLoadingFinishTimer = null;
  }
}

function clearBottomLoadingFinishTimer(): void {
  if (bottomLoadingFinishTimer !== null) {
    clearTimeout(bottomLoadingFinishTimer);
    bottomLoadingFinishTimer = null;
  }
}

function markLoadingTopStarted(): void {
  if (loadingTopStartedAt === null) {
    loadingTopStartedAt = Date.now();
  }
}

function markLoadingBottomStarted(): void {
  if (loadingBottomStartedAt === null) {
    loadingBottomStartedAt = Date.now();
  }
}

function finishLoadingTop(): void {
  const startedAt = loadingTopStartedAt ?? Date.now();
  loadingTopStartedAt = null;

  const remaining = minLoadingTimeMs.value - (Date.now() - startedAt);

  if (remaining > 0) {
    holdLoadingTop.value = true;
    clearTopLoadingFinishTimer();
    topLoadingFinishTimer = setTimeout(() => {
      topLoadingFinishTimer = null;
      holdLoadingTop.value = false;
      hideTopLoader();
    }, remaining);
    return;
  }

  hideTopLoader();
}

function finishLoadingBottom(): void {
  const startedAt = loadingBottomStartedAt ?? Date.now();
  loadingBottomStartedAt = null;

  const remaining = minLoadingTimeMs.value - (Date.now() - startedAt);

  if (remaining > 0) {
    holdLoadingBottom.value = true;
    clearBottomLoadingFinishTimer();
    bottomLoadingFinishTimer = setTimeout(() => {
      bottomLoadingFinishTimer = null;
      holdLoadingBottom.value = false;
      hideBottomLoader();
    }, remaining);
    return;
  }

  hideBottomLoader();
}

const paddingTopPx = computed(() => Math.max(0, props.paddingTop ?? 0));
const paddingBottomPx = computed(() => Math.max(0, props.paddingBottom ?? 0));
const indicatorPaddingTopPx = computed(() =>
  Math.max(0, props.indicatorPaddingTop ?? 0),
);
const indicatorPaddingBottomPx = computed(() =>
  Math.max(0, props.indicatorPaddingBottom ?? 0),
);

const topSpacerStyle = computed(() => ({
  height: `${paddingTopPx.value}px`,
}));

const bottomSpacerStyle = computed(() => ({
  height: `${paddingBottomPx.value}px`,
}));

const topSectionInsetPx = computed(() => {
  if (props.disabledTop) {
    return paddingTopPx.value;
  }

  return (
    loaderHeight.value +
    indicatorPaddingTopPx.value +
    paddingTopPx.value
  );
});

const bottomSectionInsetPx = computed(() => {
  if (props.disabledBottom) {
    return paddingBottomPx.value;
  }

  return (
    loaderHeight.value +
    indicatorPaddingBottomPx.value +
    paddingBottomPx.value
  );
});

const rootStyle = computed(() => ({
  "--abyss-reload-loader-height": `${loaderHeight.value}px`,
  "--abyss-reload-indicator-padding-top": `${indicatorPaddingTopPx.value}px`,
  "--abyss-reload-indicator-padding-bottom": `${indicatorPaddingBottomPx.value}px`,
  "--abyss-reload-top-inset": `${topSectionInsetPx.value}px`,
  "--abyss-reload-bottom-inset": `${bottomSectionInsetPx.value}px`,
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

function isActivationSuppressed(): boolean {
  return activationSuppressedDepth > 0;
}

function beginUserScrollGesture(kind: UserScrollGestureKind): void {
  activeUserScrollGesture = kind;
}

function endUserScrollGesture(): void {
  activeUserScrollGesture = null;
  resetUserScrollAccum();
}

function hasUserScrollIntent(): boolean {
  return isTouchActive || activeUserScrollGesture !== null;
}

function resetUserScrollAccum(): void {
  bottomUserScrollAccum = 0;
  topUserScrollAccum = 0;
}

function trackUserScrollAccum(scrollDelta: number): void {
  if (!isTouchActive && !hasUserScrollIntent()) {
    return;
  }

  if (scrollDelta > 0) {
    bottomUserScrollAccum += scrollDelta;
    topUserScrollAccum = 0;
    return;
  }

  if (scrollDelta < 0) {
    topUserScrollAccum += Math.abs(scrollDelta);
    bottomUserScrollAccum = 0;
  }
}

function tryActivateAtScrollPosition(
  container: HTMLElement,
  scrollTop: number,
): void {
  if (shouldCheckTopActivation(scrollTop)) {
    checkTopActivation(scrollTop);
  }

  if (shouldCheckBottomActivation(container, scrollTop)) {
    checkBottomActivation(container, scrollTop);
  }
}

function releaseSuppressedActivation(): void {
  activationSuppressedDepth = Math.max(0, activationSuppressedDepth - 1);

  const container = viewportEl.value;

  if (container) {
    lastScrollTop = container.scrollTop;
  }
}

function withSuppressedActivation(callback: () => void): void {
  activationSuppressedDepth += 1;

  const container = viewportEl.value;
  const scrollTopBefore = container?.scrollTop ?? 0;

  try {
    callback();
  } finally {
    void nextTick(() => {
      const current = viewportEl.value;

      if (!current) {
        releaseSuppressedActivation();
        return;
      }

      if (current.scrollTop !== scrollTopBefore) {
        const onScrollEnd = (): void => {
          current.removeEventListener("scrollend", onScrollEnd);
          releaseSuppressedActivation();
        };

        current.addEventListener("scrollend", onScrollEnd, { once: true });
        return;
      }

      releaseSuppressedActivation();
    });
  }
}

function canRefreshTop(): boolean {
  return (
    !props.disabledTop &&
    !props.loadingTop &&
    !pendingTop.value &&
    !holdLoadingTop.value
  );
}

function canRefreshBottom(): boolean {
  return (
    !props.disabledBottom &&
    !props.loadingBottom &&
    !pendingBottom.value &&
    !holdLoadingBottom.value
  );
}

function triggerRefreshTop(): void {
  if (!canRefreshTop()) {
    return;
  }

  pendingTop.value = true;
  markLoadingTopStarted();
  topUserScrollAccum = 0;
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
  markLoadingBottomStarted();
  bottomUserScrollAccum = 0;
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
  if (isActivationSuppressed()) {
    return;
  }

  if (!hasUserScrollIntent()) {
    return;
  }

  const scrollDelta = scrollTop - lastScrollTop;
  const hasEnoughTopScroll =
    scrollDelta <= -REFRESH_SCROLL_DELTA ||
    topUserScrollAccum >= REFRESH_SCROLL_DELTA;

  if (!hasEnoughTopScroll) {
    return;
  }

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
  if (isActivationSuppressed()) {
    return;
  }

  if (!hasUserScrollIntent()) {
    return;
  }

  const scrollDelta = scrollTop - lastScrollTop;
  const hasEnoughBottomScroll =
    scrollDelta >= REFRESH_SCROLL_DELTA ||
    bottomUserScrollAccum >= REFRESH_SCROLL_DELTA;

  if (!hasEnoughBottomScroll) {
    return;
  }

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

  const scrollTop = container.scrollTop;
  const maxScrollTop = getMaxScrollTop(container);
  const targetScrollTop = Math.max(0, maxScrollTop - loader.offsetHeight);

  if (
    !isBottomScrollActivated(container, scrollTop) &&
    !isBottomScrollPartial(container, scrollTop)
  ) {
    return;
  }

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
  let scrollDelta = 0;

  if (lastScrollTop !== -1) {
    scrollDelta = scrollTop - lastScrollTop;

    if (scrollTop > lastScrollTop) {
      scrollDirection = "down";
    } else if (scrollTop < lastScrollTop) {
      scrollDirection = "up";
    }

    trackUserScrollAccum(scrollDelta);

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

  const container = viewportEl.value;

  if (container) {
    tryActivateAtScrollPosition(container, container.scrollTop);
  }

  hidePartialLoaders();
  endUserScrollGesture();
}

function handleTouchStart(): void {
  cancelProgrammaticScroll("touchstart");
  isTouchActive = true;
  resetUserScrollAccum();
  beginUserScrollGesture("touch");
  touchStartScrollTop = viewportEl.value?.scrollTop ?? null;
}

function handleTouchEnd(): void {
  isTouchActive = false;

  const container = viewportEl.value;

  if (container) {
    tryActivateAtScrollPosition(container, container.scrollTop);

    if (touchStartScrollTop === container.scrollTop) {
      endUserScrollGesture();
    }
  } else {
    endUserScrollGesture();
  }

  touchStartScrollTop = null;
}

function handleTouchCancel(): void {
  isTouchActive = false;
  touchStartScrollTop = null;
  endUserScrollGesture();
}

function handleWheel(): void {
  cancelProgrammaticScroll("wheel");
  beginUserScrollGesture("wheel");
}

watch(
  () => props.loadingTop,
  (loading, wasLoading) => {
    if (loading) {
      pendingTop.value = false;
      markLoadingTopStarted();
      return;
    }

    if (wasLoading) {
      finishLoadingTop();
    }
  },
);

watch(
  () => props.loadingBottom,
  (loading, wasLoading) => {
    if (loading) {
      pendingBottom.value = false;
      markLoadingBottomStarted();
      return;
    }

    if (wasLoading) {
      finishLoadingBottom();
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

onUnmounted(() => {
  clearTopLoadingFinishTimer();
  clearBottomLoadingFinishTimer();
});

defineExpose({
  viewportEl,
  topLoaderEl,
  bottomLoaderEl,
  hideTopLoader,
  hideBottomLoader,
  isTopLoaderActivated,
  isBottomLoaderActivated,
  withSuppressedActivation,
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
    overflow-x: hidden;
    overflow-y: auto;
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
    box-sizing: border-box;
    min-height: var(--abyss-reload-loader-height);

    &--top {
      padding-top: var(--abyss-reload-indicator-padding-top);
    }

    &--bottom {
      padding-bottom: var(--abyss-reload-indicator-padding-bottom);
    }
  }

  &__spacer {
    flex-shrink: 0;
    width: 100%;
  }
}
</style>
