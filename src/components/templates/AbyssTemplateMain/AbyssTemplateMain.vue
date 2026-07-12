<template>
  <div
    :class="[
      'abyss-scroll-view',
      `device--${device}`,
      {
        'abyss-scroll-view--safe-area': safeAreaActive,
        'abyss-scroll-view--safe-area-in-template': safeAreaActive && safeAreaInTemplate,
        'abyss-scroll-view--has-top-bar': hasTopBar,
        'orientation--landscape': safeAreaActive && orientation === 'landscape',
        'orientation--portrait': safeAreaActive && orientation === 'portrait',
        'abyss-scroll-view--hide-end-spacer': hideEndContentSpacer,
      },
      $props.class,
    ]"
    :style="[rootStyle, style]"
  >
    <div
      class="abyss-scroll-view__frame"
      :class="{ 'abyss-scroll-view__frame--safe-area': safeAreaActive }"
    >
      <div
        v-if="safeAreaActive"
        class="abyss-scroll-view__safe-top"
        aria-hidden="true"
      />

      <div v-if="hasTopBar" class="abyss-scroll-view__top-bar">
        <slot name="top-bar" />
      </div>

      <div
        class="abyss-scroll-view__scroll-host"
        :class="{
          'abyss-scroll-view__scroll-host--safe-area': safeAreaActive,
          'abyss-scroll-view__scroll-host--with-top-bar': hasTopBar,
        }"
      >
        <div
          ref="viewportEl"
          class="abyss-scroll-view__viewport"
          :class="[`device--${device}`]"
          v-bind="$attrs"
          @scroll="handleScroll"
          @scrollend.passive="handleScrollEnd"
          @touchstart.passive="handleTouchStart"
          @touchend.passive="handleTouchEnd"
          @touchcancel.passive="handleTouchCancel"
          @wheel.passive="handleWheel"
        >
          <div class="abyss-scroll-view__content">
            <div
              class="abyss-scroll-view__content-spacer abyss-scroll-view__content-spacer--start"
              aria-hidden="true"
            />

            <div
              v-if="!disabledTop"
              ref="topLoaderEl"
              class="abyss-scroll-view__loader abyss-scroll-view__loader--top"
              :class="{ 'abyss-scroll-view__loader--large': size === 'large' }"
              aria-hidden="true"
            >
              <AbyssTemplateMainIndicator :loading="effectiveLoadingTop" :size="size" />
            </div>

            <div
              v-if="!disabledTop"
              class="abyss-scroll-view__content-spacer abyss-scroll-view__content-spacer--after-top-loader"
              aria-hidden="true"
            />

            <div
              class="abyss-scroll-view__body"
              :class="[`device--${device}`]"
            >
              <slot />
            </div>

            <div
              v-if="!disabledBottom"
              class="abyss-scroll-view__content-spacer abyss-scroll-view__content-spacer--before-bottom-loader"
              aria-hidden="true"
            />

            <div
              v-if="!disabledBottom"
              ref="bottomLoaderEl"
              class="abyss-scroll-view__loader abyss-scroll-view__loader--bottom"
              :class="{ 'abyss-scroll-view__loader--large': size === 'large' }"
              aria-hidden="true"
            >
              <AbyssTemplateMainIndicator
                :loading="effectiveLoadingBottom"
                :size="size"
              />
            </div>

            <div
              v-if="showEndContentSpacer"
              class="abyss-scroll-view__content-spacer abyss-scroll-view__content-spacer--end"
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          v-if="showRightSafeInset"
          class="abyss-scroll-view__safe-right"
          aria-hidden="true"
        />
      </div>

      <div
        v-if="showBottomSafeInset"
        class="abyss-scroll-view__safe-bottom"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, watch } from "vue";
import AbyssTemplateMainIndicator from "@/components/templates/AbyssTemplateMain/AbyssTemplateMainIndicator.vue";
import { useKeyboardState } from "@/composables/useKeyboardState";

const DEFAULT_LOADER_HEIGHT = 56;
const DEFAULT_LOADER_HEIGHT_LARGE = 64;
const DEFAULT_ACTIVATION_THRESHOLD = 8;
const MOBILE_SCROLL_CONTENT_SPACER_PX = 12;
const DESKTOP_SCROLL_CONTENT_SPACER_PX = 24;
/** Minimalny przyrost scrollTop (px) przy aktywacji — chroni przed fałszywym triggerem po programatycznym scrollu. */
const REFRESH_SCROLL_DELTA = 12;

export interface AbyssTemplateMainProps {
  /** Urządzenie — determinuje preset paddingów treści (SCSS). */
  device: "mobile" | "desktop" | "web";
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
  /** Minimalny czas (ms) utrzymania stanu ładowania po zakończeniu odświeżania. */
  minLoadingTime?: number;
  /**
   * Mobile: rezerwuje inset safe-area spacerami (góra + opcjonalnie offset nawigacji).
   * Wewnętrzny viewport scrolla pozostaje bez zmian.
   */
  safeArea?: boolean;
  /**
   * Gdy `true` — bez offsetu nawigacji (widok w `AbyssTemplate`).
   * Dotyczy tylko `safeArea` na mobile.
   */
  safeAreaInTemplate?: boolean;
  /** Orientacja — offset nawigacji gdy `safeAreaInTemplate` jest `false`. */
  orientation?: "portrait" | "landscape";
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
}

/** @deprecated Use AbyssTemplateMainProps */
export type AbyssScrollViewProps = AbyssTemplateMainProps;

const props = withDefaults(defineProps<AbyssTemplateMainProps>(), {
  loadingTop: false,
  loadingBottom: false,
  disabledTop: true,
  disabledBottom: true,
  activationThreshold: DEFAULT_ACTIVATION_THRESHOLD,
  size: "default",
  minLoadingTime: 0,
  safeArea: false,
  safeAreaInTemplate: true,
  orientation: "portrait",
  class: "",
  style: "",
});

const slots = useSlots();
const { isKeyboardVisible } = useKeyboardState();

const hasTopBar = computed(() => Boolean(slots["top-bar"]));

const hideEndContentSpacer = computed(
  () => props.device !== "mobile" || isKeyboardVisible.value,
);

const showEndContentSpacer = computed(() => !hideEndContentSpacer.value);

const safeAreaActive = computed(
  () => props.safeArea && props.device === "mobile",
);

const scrollContentSpacerPx = computed(() =>
  props.device === "mobile"
    ? MOBILE_SCROLL_CONTENT_SPACER_PX
    : DESKTOP_SCROLL_CONTENT_SPACER_PX,
);

const showBottomSafeInset = computed(
  () =>
    safeAreaActive.value &&
    !props.safeAreaInTemplate &&
    props.orientation === "portrait",
);

const showRightSafeInset = computed(
  () =>
    safeAreaActive.value &&
    !props.safeAreaInTemplate &&
    props.orientation === "landscape",
);

const emit = defineEmits<{
  "refresh-top": [];
  "refresh-bottom": [];
}>();

const viewportEl = ref<HTMLElement | null>(null);
const topLoaderEl = ref<HTMLElement | null>(null);
const bottomLoaderEl = ref<HTMLElement | null>(null);
const topLoaderMeasuredPx = ref(0);
const bottomLoaderMeasuredPx = ref(0);

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
let bodyResizeObserver: ResizeObserver | null = null;
let viewportLayoutObserver: ResizeObserver | null = null;
let loaderResizeObserver: ResizeObserver | null = null;
let bottomRefreshCooldownUntil: number | null = null;
let bottomRefreshCooldownTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialTopScrollPositionReady = true;

const BOTTOM_REFRESH_COOLDOWN_MS = 300;

/** Debug scrolla — nie usuwać (diagnoza AbyssScrollView). */
function logScrollDebug(event: string, details: Record<string, unknown>): void {
  console.log("[AbyssScrollView]", event, details);
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
  pendingTop.value = false;
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

function clearBottomRefreshCooldown(): void {
  if (bottomRefreshCooldownTimer !== null) {
    clearTimeout(bottomRefreshCooldownTimer);
    bottomRefreshCooldownTimer = null;
  }

  bottomRefreshCooldownUntil = null;
}

function isBottomRefreshCooldownActive(): boolean {
  return (
    bottomRefreshCooldownUntil !== null &&
    Date.now() < bottomRefreshCooldownUntil
  );
}

function beginBottomRefreshCooldown(): void {
  clearBottomRefreshCooldown();
  bottomRefreshCooldownUntil = Date.now() + BOTTOM_REFRESH_COOLDOWN_MS;
  bottomRefreshCooldownTimer = setTimeout(() => {
    bottomRefreshCooldownTimer = null;
    bottomRefreshCooldownUntil = null;
  }, BOTTOM_REFRESH_COOLDOWN_MS);
}

function isInBottomLoaderZone(
  container: HTMLElement,
  scrollTop: number,
): boolean {
  const contentMaxScroll = getContentMaxScrollTop(container);

  return (
    scrollTop > contentMaxScroll + 1 ||
    isBottomScrollPartial(container, scrollTop) ||
    isBottomScrollActivated(container, scrollTop)
  );
}

function enforceBottomRefreshCooldown(
  container: HTMLElement,
  scrollTop: number,
): void {
  if (
    !isBottomRefreshCooldownActive() ||
    props.disabledBottom ||
    programmaticScrollTarget !== null
  ) {
    return;
  }

  if (!isInBottomLoaderZone(container, scrollTop)) {
    return;
  }

  const contentMaxScroll = getContentMaxScrollTop(container);

  if (Math.abs(container.scrollTop - contentMaxScroll) >= 1) {
    restoreScrollAfterBottomLoading("smooth");
  }
}

function restoreScrollAfterBottomLoading(
  behavior: ScrollBehavior = "smooth",
): void {
  const container = viewportEl.value;

  if (!container || props.disabledBottom) {
    return;
  }

  const targetScroll = getContentMaxScrollTop(container);

  if (Math.abs(container.scrollTop - targetScroll) < 1) {
    lastScrollTop = targetScroll;
    programmaticScrollTarget = null;
    return;
  }

  startProgrammaticScroll(targetScroll);
  container.scrollTo({
    top: targetScroll,
    behavior,
  });
}

function finishLoadingBottom(): void {
  pendingBottom.value = false;
  const startedAt = loadingBottomStartedAt ?? Date.now();
  loadingBottomStartedAt = null;

  const remaining = minLoadingTimeMs.value - (Date.now() - startedAt);

  const onLoadingFinished = (): void => {
    beginBottomRefreshCooldown();
    restoreScrollAfterBottomLoading("smooth");
  };

  if (remaining > 0) {
    holdLoadingBottom.value = true;
    clearBottomLoadingFinishTimer();
    bottomLoadingFinishTimer = setTimeout(() => {
      bottomLoadingFinishTimer = null;
      holdLoadingBottom.value = false;
      onLoadingFinished();
    }, remaining);
    return;
  }

  onLoadingFinished();
}

/** Ukryta strefa nad treścią (spacer start + loader + spacer za loaderem). */
const topLoaderScrollInsetPx = computed(() => {
  if (props.disabledTop) {
    return 0;
  }

  return scrollContentSpacerPx.value + topLoaderMeasuredPx.value;
});

/** Ukryta strefa pod treścią (spacer przed loaderem + loader) — bez spacera po loaderze widocznego w viewport. */
const bottomLoaderScrollInsetPx = computed(() => {
  if (props.disabledBottom) {
    return 0;
  }

  return bottomLoaderMeasuredPx.value + scrollContentSpacerPx.value;
});

const rootStyle = computed(() => ({
  "--abyss-scroll-view-loader-height": `${loaderHeight.value}px`,
  "--abyss-scroll-view-content-spacer-size": `${scrollContentSpacerPx.value}px`,
  "--abyss-scroll-view-top-inset": `${topLoaderScrollInsetPx.value}px`,
  "--abyss-scroll-view-bottom-inset": `${bottomLoaderScrollInsetPx.value}px`,
}));

function getMaxScrollTop(container: HTMLElement): number {
  return container.scrollHeight - container.clientHeight;
}

function getContentMinScrollTop(): number {
  if (props.disabledTop) {
    return 0;
  }

  return topLoaderScrollInsetPx.value;
}

function markInitialTopScrollPositionReady(): void {
  if (props.disabledTop) {
    isInitialTopScrollPositionReady = true;
    return;
  }

  const container = viewportEl.value;

  if (!container) {
    return;
  }

  const minScroll = getContentMinScrollTop();

  if (minScroll <= 0 || container.scrollTop >= minScroll) {
    isInitialTopScrollPositionReady = true;
  }
}

function applyInitialContentScrollPosition(): void {
  const container = viewportEl.value;

  if (!container) {
    return;
  }

  if (props.disabledTop) {
    isInitialTopScrollPositionReady = true;
    lastScrollTop = container.scrollTop;
    return;
  }

  const minScroll = getContentMinScrollTop();

  if (minScroll <= 0) {
    return;
  }

  if (container.scrollTop >= minScroll) {
    markInitialTopScrollPositionReady();
    lastScrollTop = container.scrollTop;
    return;
  }

  withSuppressedActivation(() => {
    startProgrammaticScroll(minScroll);
    container.scrollTop = minScroll;
    lastScrollTop = minScroll;
    markInitialTopScrollPositionReady();
  });
}

function getContentMaxScrollTop(container: HTMLElement): number {
  const absoluteMax = getMaxScrollTop(container);

  if (props.disabledBottom) {
    return Math.max(0, absoluteMax);
  }

  return Math.max(0, absoluteMax - bottomLoaderScrollInsetPx.value);
}

function shouldDeferContentClamp(): boolean {
  return (
    activationSuppressedDepth > 0 ||
    programmaticScrollTarget !== null ||
    effectiveLoadingBottom.value ||
    pendingBottom.value ||
    effectiveLoadingTop.value ||
    pendingTop.value ||
    isTouchActive ||
    hasUserScrollIntent()
  );
}

function clampScrollToContentZone(behavior: ScrollBehavior = "auto"): void {
  const container = viewportEl.value;

  if (!container || shouldDeferContentClamp()) {
    return;
  }

  const minScroll = getContentMinScrollTop();
  const maxScroll = getContentMaxScrollTop(container);
  const clamped = Math.min(Math.max(container.scrollTop, minScroll), maxScroll);

  if (clamped === container.scrollTop) {
    lastScrollTop = container.scrollTop;
    markInitialTopScrollPositionReady();
    return;
  }

  startProgrammaticScroll(clamped);
  container.scrollTo({ top: clamped, behavior });
  lastScrollTop = clamped;
  markInitialTopScrollPositionReady();
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

  const hideScrollTop = topLoaderScrollInsetPx.value;

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
  const hideScrollTop = Math.max(0, maxScrollTop - bottomLoaderScrollInsetPx.value);

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
    !holdLoadingBottom.value &&
    !isBottomRefreshCooldownActive()
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

  clearBottomRefreshCooldown();
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
  if (!isInitialTopScrollPositionReady) {
    return;
  }

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

  if (isBottomRefreshCooldownActive()) {
    enforceBottomRefreshCooldown(container, scrollTop);
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

  startProgrammaticScroll(topLoaderScrollInsetPx.value);
  container.scrollTo({
    top: topLoaderScrollInsetPx.value,
    behavior: "smooth",
  });
}

function hideBottomLoader(): void {
  const container = viewportEl.value;

  if (!container || props.disabledBottom) {
    return;
  }

  const scrollTop = container.scrollTop;
  const contentMaxScroll = getContentMaxScrollTop(container);

  if (scrollTop > contentMaxScroll) {
    restoreScrollAfterBottomLoading("smooth");
    return;
  }

  if (
    !isBottomScrollActivated(container, scrollTop) &&
    !isBottomScrollPartial(container, scrollTop)
  ) {
    return;
  }

  restoreScrollAfterBottomLoading("smooth");
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

  if (isBottomRefreshCooldownActive()) {
    enforceBottomRefreshCooldown(container, scrollTop);
  }

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
        if (isBottomRefreshCooldownActive()) {
          restoreScrollAfterBottomLoading("smooth");
        } else {
          cancelProgrammaticScroll("user-scroll");
        }
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
    clampScrollToContentZone("auto");
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

function syncLoaderSectionHeights(): void {
  topLoaderMeasuredPx.value =
    !props.disabledTop && topLoaderEl.value
      ? topLoaderEl.value.offsetHeight
      : 0;
  bottomLoaderMeasuredPx.value =
    !props.disabledBottom && bottomLoaderEl.value
      ? bottomLoaderEl.value.offsetHeight
      : 0;
}

function observeLoaderSections(): void {
  loaderResizeObserver?.disconnect();
  loaderResizeObserver = null;
  syncLoaderSectionHeights();

  const nodes: HTMLElement[] = [];

  if (!props.disabledTop && topLoaderEl.value) {
    nodes.push(topLoaderEl.value);
  }

  if (!props.disabledBottom && bottomLoaderEl.value) {
    nodes.push(bottomLoaderEl.value);
  }

  if (nodes.length === 0) {
    return;
  }

  loaderResizeObserver = new ResizeObserver(() => {
    syncLoaderSectionHeights();
    clampScrollToContentZone();
  });

  for (const node of nodes) {
    loaderResizeObserver.observe(node);
  }
}

function observeBodyResize(): void {
  const body = viewportEl.value?.querySelector(".abyss-scroll-view__body");

  if (!(body instanceof HTMLElement)) {
    return;
  }

  bodyResizeObserver = new ResizeObserver(() => {
    clampScrollToContentZone();
  });
  bodyResizeObserver.observe(body);
}

function observeViewportLayout(): void {
  viewportLayoutObserver?.disconnect();

  const viewport = viewportEl.value;

  if (!viewport) {
    return;
  }

  viewportLayoutObserver = new ResizeObserver(() => {
    clampScrollToContentZone();
  });

  viewportLayoutObserver.observe(viewport);

  if (viewport.parentElement) {
    viewportLayoutObserver.observe(viewport.parentElement);
  }
}

watch(
  () => props.disabledTop,
  (disabledTop) => {
    isInitialTopScrollPositionReady = disabledTop;

    if (!disabledTop) {
      void nextTick(() => {
        applyInitialContentScrollPosition();
      });
    }
  },
);

watch(
  () => [props.disabledTop, props.disabledBottom, props.size] as const,
  () => {
    void nextTick(() => {
      observeLoaderSections();
      applyInitialContentScrollPosition();
      clampScrollToContentZone();
    });
  },
);

onMounted(() => {
  isInitialTopScrollPositionReady = props.disabledTop;

  void nextTick(() => {
    const container = viewportEl.value;

    if (!container) {
      return;
    }

    observeLoaderSections();
    applyInitialContentScrollPosition();

    requestAnimationFrame(() => {
      applyInitialContentScrollPosition();

      if (!isInitialTopScrollPositionReady) {
        clampScrollToContentZone();
      }

      observeBodyResize();
      observeViewportLayout();

      if (lastScrollTop === -1) {
        lastScrollTop = container.scrollTop;
      }

      scrollDirection = "down";
      programmaticScrollTarget = null;
    });
  });
});

onUnmounted(() => {
  clearTopLoadingFinishTimer();
  clearBottomLoadingFinishTimer();
  clearBottomRefreshCooldown();
  bodyResizeObserver?.disconnect();
  bodyResizeObserver = null;
  viewportLayoutObserver?.disconnect();
  viewportLayoutObserver = null;
  loaderResizeObserver?.disconnect();
  loaderResizeObserver = null;
});

defineExpose({
  viewportEl,
  topLoaderEl,
  bottomLoaderEl,
  hideTopLoader,
  hideBottomLoader,
  getContentMaxScrollTop,
  clampScrollToContentZone,
  isTopLoaderActivated,
  isBottomLoaderActivated,
  withSuppressedActivation,
});
</script>

<style scoped lang="scss">
.abyss-scroll-view {
  --abyss-scroll-view-content-spacer-size: 12px;
  --abyss-scroll-view-top-bar-padding-top: 24px;
  --abyss-scroll-view-content-padding-top: 24px;
  --abyss-scroll-view-content-padding-inline: 24px;
  --abyss-scroll-view-content-padding-bottom: 24px;
  --abyss-scroll-view-indicator-padding-top: 0px;
  --abyss-scroll-view-indicator-padding-bottom: 0px;

  &.device--desktop,
  &.device--web {
    --abyss-scroll-view-content-spacer-size: 24px;
    --abyss-scroll-view-top-bar-mask-size: 12px;
    --abyss-scroll-view-top-bar-padding-top: 24px;
    --abyss-scroll-view-content-padding-top: 0px;
    --abyss-scroll-view-content-padding-bottom: 0px;
    --abyss-scroll-view-content-padding-inline: 24px;
  }

  &.device--mobile {
    --abyss-scroll-view-top-bar-padding-top: 12px;
    --abyss-scroll-view-content-padding-top: 8px;
    --abyss-scroll-view-content-padding-inline: 8px;
    --abyss-scroll-view-content-padding-bottom: 24px;
  }

  &.device--mobile.orientation--portrait:not(.abyss-scroll-view--safe-area) {
    --abyss-scroll-view-indicator-padding-top: 24px;
    --abyss-scroll-view-indicator-padding-bottom: 24px;
  }

  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;

  &__frame {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
  }

  &__top-bar {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    min-width: 0;
    box-sizing: border-box;
    padding-top: var(--abyss-scroll-view-top-bar-padding-top);
    padding-inline: var(--abyss-scroll-view-content-padding-inline);
  }

  &--has-top-bar &__body {
    padding-top: 0;
  }

  &__scroll-host {
    display: contents;

    &--with-top-bar {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
    }

    &--safe-area {
      display: flex;
      flex: 1 1 auto;
      flex-direction: row;
      min-height: 0;
      min-width: 0;
    }
  }

  &--safe-area {
    --abyss-scroll-view-safe-area-mask-size: 12px;

    &.device--mobile:not(.abyss-scroll-view--safe-area-in-template) {
      &.orientation--portrait .abyss-scroll-view__body {
        padding-inline: max(8px, env(safe-area-inset-left, 0px))
          max(8px, env(safe-area-inset-right, 0px));
      }

      &.orientation--landscape .abyss-scroll-view__body {
        padding-left: max(8px, env(safe-area-inset-left, 0px));
      }
    }
  }

  &__safe-top {
    flex-shrink: 0;
    width: 100%;
    height: max(
      0px,
      env(safe-area-inset-top, 0px) -
        var(--abyss-scroll-view-safe-area-mask-size, 12px)
    );
  }

  &--safe-area-in-template.device--mobile &__safe-top {
    height: env(safe-area-inset-top, 0px);
  }

  &__safe-bottom {
    flex-shrink: 0;
    width: 100%;
    height: calc(72px + max(8px, env(safe-area-inset-bottom, 0px)));
  }

  &__safe-right {
    flex-shrink: 0;
    width: calc(80px + max(8px, env(safe-area-inset-right, 0px)));
    align-self: stretch;
  }

  &--safe-area.device--mobile {
    --abyss-scroll-view-content-padding-top: 0px;
    --abyss-scroll-view-content-padding-bottom: 0px;
    --abyss-scroll-view-indicator-padding-top: 0px;
    --abyss-scroll-view-indicator-padding-bottom: 0px;

    .abyss-scroll-view__viewport {
      mask-image: linear-gradient(
        to bottom,
        transparent 0,
        black var(--abyss-scroll-view-safe-area-mask-size, 12px),
        black
          calc(100% - var(--abyss-scroll-view-safe-area-mask-size, 12px)),
        transparent 100%
      );
    }
  }

  &.device--desktop.abyss-scroll-view--has-top-bar,
  &.device--web.abyss-scroll-view--has-top-bar {
    .abyss-scroll-view__viewport {
      mask-image: linear-gradient(
        to bottom,
        transparent 0,
        black var(--abyss-scroll-view-top-bar-mask-size, 12px),
        black 100%
      );
    }
  }

  &__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    @include scrollbar;
  }

  &__content {
    display: flex;
    flex-direction: column;
    min-height: calc(
      100% + var(--abyss-scroll-view-top-inset) +
        var(--abyss-scroll-view-bottom-inset)
    );
  }

  &__body {
    flex: 1 1 auto;
    min-height: calc(
      100% - 2 * var(--abyss-scroll-view-content-spacer-size, 12px)
    );
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: var(--abyss-scroll-view-content-padding-top);
    padding-inline: var(--abyss-scroll-view-content-padding-inline);
    padding-bottom: var(--abyss-scroll-view-content-padding-bottom);
  }

  &.abyss-scroll-view--hide-end-spacer &__body {
    min-height: calc(
      100% - var(--abyss-scroll-view-content-spacer-size, 12px)
    );
  }

  &__content-spacer {
    flex-shrink: 0;
    height: var(--abyss-scroll-view-content-spacer-size, 12px);
  }

  &__loader {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    min-height: var(--abyss-scroll-view-loader-height);

    &--top {
      padding-top: var(--abyss-scroll-view-indicator-padding-top);
    }

    &--bottom {
      padding-bottom: var(--abyss-scroll-view-indicator-padding-bottom);
    }
  }
}
</style>
