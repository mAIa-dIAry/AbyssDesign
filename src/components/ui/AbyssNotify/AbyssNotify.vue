<template>
  <Transition name="abyss-notify" appear @after-leave="onAfterLeave">
    <div
      v-if="isVisible"
      class="abyss-notify-shell"
      :ref="onShellRef"
      @mouseenter="onPointerEnter"
      @mouseleave="onPointerLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <div class="abyss-notify-shell__inner">
      <div
        :class="['abyss-notify', `abyss-notify--${type}`, $props.class]"
        :style="style"
        role="status"
        aria-live="polite"
        v-bind="$attrs"
      >
      <AbyssBackground
        class="abyss-notify__gradient"
        :colors="gradientColors"
        aria-hidden="true"
      />

      <div class="abyss-notify__content">
        <div class="abyss-notify__overlay" aria-hidden="true" />

        <q-btn
          v-if="hasDescription"
          class="abyss-notify__header abyss-notify__header--toggle"
          :class="{ 'abyss-notify__header--expanded': isExpanded }"
          flat
          unelevated
          no-caps
          :ripple="{ early: true }"
          :aria-expanded="isExpanded"
          :aria-label="message"
          @click="toggleExpanded"
        >
          <span class="abyss-notify__icon">
            <q-icon :name="resolvedIcon" />
          </span>
          <span
            class="abyss-notify__title-collapse"
            :class="{ 'abyss-notify__title-collapse--open': isExpanded }"
          >
            <span class="abyss-notify__title-collapse-inner">
              <span class="abyss-notify__message-sizer" aria-hidden="true">{{
                message
              }}</span>
              <span class="abyss-notify__message">{{ message }}</span>
            </span>
          </span>
          <span v-if="hasCount" class="abyss-notify__count" aria-hidden="true">
            <span class="abyss-notify__count-badge">
              <span
                v-if="countRippleKey"
                :key="countRippleKey"
                class="abyss-notify__count-ripple"
              />
              <span class="abyss-notify__count-value">{{ count }}</span>
            </span>
          </span>
          <span class="abyss-notify__chevron" aria-hidden="true">
            <q-icon name="sym_r_expand_more" />
          </span>
        </q-btn>

        <div v-else class="abyss-notify__header">
          <span class="abyss-notify__icon">
            <q-icon :name="resolvedIcon" />
          </span>
          <span class="abyss-notify__message">{{ message }}</span>
          <span v-if="hasCount" class="abyss-notify__count">
            <span class="abyss-notify__count-badge">
              <span
                v-if="countRippleKey"
                :key="countRippleKey"
                class="abyss-notify__count-ripple"
              />
              <span class="abyss-notify__count-value">{{ count }}</span>
            </span>
          </span>
        </div>

        <div
          v-if="hasDescription"
          class="abyss-notify__collapse"
          :class="{ 'abyss-notify__collapse--open': isExpanded }"
        >
          <div class="abyss-notify__collapse-inner">
            <div class="abyss-notify__description">{{ description }}</div>
          </div>
        </div>

      </div>

      <q-btn
        v-if="closeable"
        class="abyss-notify__close"
        flat
        unelevated
        no-caps
        :ripple="{ early: true }"
        :aria-label="closeLabel"
        :style="autoCloseStyle"
        @click="onClose"
      >
        <svg
          v-if="hasAutoClose"
          :key="timerKey"
          class="abyss-notify__close-timer"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <circle
            class="abyss-notify__close-timer-track"
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke-width="1.75"
          />
          <circle
            class="abyss-notify__close-timer-bar"
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke-width="1.75"
            stroke-linecap="round"
            pathLength="1"
          />
        </svg>
        <q-icon name="sym_r_close" />
      </q-btn>
      </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from 'vue';
import {
  attachNotifyQueueOverflow,
  findNotifyQueueHost,
  scheduleNotifyQueueOverflow,
} from '@/components/ui/AbyssNotify/abyssNotifyQueueOverflow';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import type { AbyssInfoType } from '@/components/ui/AbyssInfo/AbyssInfo.vue';
import { resolveGradientColors } from '@/defines/semantic-gradients';

export type AbyssNotifyType = AbyssInfoType;

const DEFAULT_ICONS: Record<AbyssNotifyType, string> = {
  info: 'info',
  warning: 'warning',
  danger: 'error',
  success: 'check_circle',
  hint: 'lightbulb',
};

export interface AbyssNotifyProps {
  type?: AbyssNotifyType;
  message?: string;
  description?: string;
  count?: number;
  icon?: string;
  closeable?: boolean;
  closeLabel?: string;
  autoClose?: number;
  modelValue?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AbyssNotifyProps>(), {
  type: 'info',
  message: '',
  description: '',
  icon: '',
  closeable: true,
  closeLabel: 'Zamknij',
  modelValue: true,
  style: '',
  class: '',
});

const emit = defineEmits<{
  close: [];
  'update:modelValue': [value: boolean];
  'after-leave': [];
}>();

const isExpanded = ref(false);
const countRippleKey = ref(0);
const timerKey = ref(0);
const isHovered = ref(false);
const isFocusWithin = ref(false);

let autoCloseTimer: ReturnType<typeof setTimeout> | undefined;
let autoCloseStartedAt = 0;
let autoCloseRemaining = 0;

const isVisible = computed(() => props.modelValue);

const hasDescription = computed(() => props.description.trim().length > 0);

const hasCount = computed(() => {
  const value = props.count;
  return typeof value === 'number' && Number.isFinite(value) && value >= 2;
});

const hasAutoClose = computed(() => {
  const value = props.autoClose;
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
});

const autoCloseStyle = computed(() => {
  if (!hasAutoClose.value) {
    return undefined;
  }

  return {
    '--notify-auto-close': `${props.autoClose}ms`,
  };
});

const gradientColors = computed(() => resolveGradientColors(props.type));

const resolvedIcon = computed(
  () => props.icon.trim() || DEFAULT_ICONS[props.type],
);

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      isExpanded.value = false;
    }
  },
);

watch(
  () => props.count,
  (next, prev) => {
    if (
      prev === undefined ||
      typeof next !== 'number' ||
      !Number.isFinite(next) ||
      next < 2
    ) {
      return;
    }

    countRippleKey.value += 1;
  },
);

function toggleExpanded(): void {
  isExpanded.value = !isExpanded.value;
}

function clearAutoCloseTimer(): void {
  if (autoCloseTimer !== undefined) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = undefined;
  }
}

function pauseAutoCloseTimer(): void {
  if (autoCloseTimer === undefined) {
    return;
  }

  autoCloseRemaining = Math.max(
    0,
    autoCloseRemaining - (Date.now() - autoCloseStartedAt),
  );
  clearAutoCloseTimer();
}

function resumeAutoCloseTimer(): void {
  if (
    !props.modelValue ||
    !hasAutoClose.value ||
    autoCloseTimer !== undefined
  ) {
    return;
  }

  if (autoCloseRemaining <= 0) {
    onClose();
    return;
  }

  autoCloseStartedAt = Date.now();
  autoCloseTimer = setTimeout(() => {
    autoCloseTimer = undefined;
    onClose();
  }, autoCloseRemaining);
}

function onPointerEnter(): void {
  isHovered.value = true;
  pauseAutoCloseTimer();
}

function onPointerLeave(): void {
  isHovered.value = false;
  if (!isFocusWithin.value) {
    resumeAutoCloseTimer();
  }
}

function onFocusIn(): void {
  isFocusWithin.value = true;
  pauseAutoCloseTimer();
}

function onFocusOut(event: FocusEvent): void {
  const root = event.currentTarget as HTMLElement | null;
  const next = event.relatedTarget as Node | null;
  isFocusWithin.value = Boolean(root && next && root.contains(next));
  if (!isHovered.value && !isFocusWithin.value) {
    resumeAutoCloseTimer();
  }
}

function onClose(): void {
  clearAutoCloseTimer();
  emit('update:modelValue', false);
  emit('close');
}

function startAutoCloseTimer(): void {
  clearAutoCloseTimer();
  if (!props.modelValue || !hasAutoClose.value) {
    return;
  }

  autoCloseRemaining = props.autoClose as number;
  autoCloseStartedAt = Date.now();
  timerKey.value += 1;

  if (isHovered.value || isFocusWithin.value) {
    return;
  }

  autoCloseTimer = setTimeout(() => {
    autoCloseTimer = undefined;
    onClose();
  }, autoCloseRemaining);
}

function onAfterLeave(): void {
  emit('after-leave');
}

let detachQueueOverflow: (() => void) | undefined;
const shellEl = ref<HTMLElement | null>(null);

function onShellRef(
  el: Element | ComponentPublicInstance | null,
): void {
  const next = el instanceof HTMLElement ? el : null;

  if (next === shellEl.value) {
    return;
  }

  detachQueueOverflow?.();
  detachQueueOverflow = undefined;
  shellEl.value = next;

  const host = findNotifyQueueHost(next?.parentElement);

  if (!host) {
    return;
  }

  detachQueueOverflow = attachNotifyQueueOverflow(host);
}

watch(isExpanded, () => {
  const host = findNotifyQueueHost(shellEl.value?.parentElement);

  if (host) {
    scheduleNotifyQueueOverflow(host);
  }
});

watch(
  () => [props.modelValue, props.autoClose, props.count] as const,
  () => {
    startAutoCloseTimer();
  },
  { immediate: true },
);

onUnmounted(() => {
  detachQueueOverflow?.();
  clearAutoCloseTimer();
});
</script>

<style scoped lang="scss">
.abyss-notify-shell {
  --notify-stack-gap: 8px;
  --notify-motion: 0.2s;
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;

  &__inner {
    min-width: 0;
    min-height: 0;

    &::after {
      content: '';
      display: block;
      height: var(--notify-stack-gap);
    }
  }
}

.abyss-notify {
  --notify-overlay: #{rgba(black, 0.5)};
  --notify-header-height: 46px;
  --notify-title-size: 14px;
  --notify-title-line-height: 1.5;
  --notify-title-line: calc(
    var(--notify-title-size) * var(--notify-title-line-height)
  );
  --notify-title-padding-y: calc(
    (var(--notify-header-height) - var(--notify-title-line)) / 2
  );

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1px;
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  min-width: 0;
  min-height: calc(var(--notify-header-height) + 2px);
  padding: 1px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: $shadow-small, $shadow-frame-soft;

  &__gradient {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;

    :deep(.abyss-background__content) {
      display: none;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    border-radius: 7px;
    overflow: hidden;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;
    background: var(--notify-overlay);
  }

  &__header {
    position: relative;
    z-index: 1;
    display: flex;
    flex-shrink: 0;
    align-items: flex-start;
    gap: 12px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: var(--notify-header-height);
    min-height: var(--notify-header-height);
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    box-shadow: none;
    color: white;
    font: inherit;
    text-align: left;
    overflow: hidden;

    &--toggle {
      height: auto;
      min-height: var(--notify-header-height);
      min-width: 0;
      max-width: 100%;
      padding: 0;
      white-space: normal;
      cursor: pointer;
      transition:
        background-color 0.3s ease-out,
        border-color 0.3s ease-out;

      :deep(.q-focus-helper) {
        display: none;
      }

      :deep(.q-ripple) {
        color: white;
        opacity: 0.35;
        border-radius: inherit;
      }

      :deep(.q-btn__content) {
        align-items: flex-start;
        justify-content: flex-start;
        gap: 12px;
        width: 100%;
        min-width: 0;
        max-width: 100%;
        padding: 0 12px;
        overflow: hidden;
        color: inherit;
        text-align: left;
      }

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background-color: rgba(white, 0.06);
          border-color: rgba(white, 0.1);
        }
      }

      &:focus-visible {
        background-color: rgba(white, 0.06);
        border-color: rgba(white, 0.1);
      }

      &:active {
        background-color: rgba(white, 0.08);
        border-color: rgba(white, 0.16);
      }
    }
  }

  &__icon,
  &__chevron {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    height: var(--notify-header-height);
    color: white;

    :deep(.q-icon) {
      font-size: 24px;
      line-height: 1;
      color: inherit;
    }
  }

  &__chevron {
    :deep(.q-icon) {
      transition: transform var(--notify-motion) ease;
    }
  }

  &__header--expanded &__chevron :deep(.q-icon) {
    transform: rotate(180deg);
  }

  &__count {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: var(--notify-header-height);
    overflow: visible;
  }

  &__count-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    overflow: visible;
    border-radius: 999px;
    background: white;
    color: rgba(black, 0.82);
    font-size: 11px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__count-ripple {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: white;
    pointer-events: none;
    animation: abyss-notify-count-ripple 0.4s ease-out forwards;
  }

  &__count-value {
    position: relative;
    z-index: 1;
  }

  &__message {
    min-width: 0;
    flex: 1;
    padding-top: var(--notify-title-padding-y);
    padding-bottom: var(--notify-title-padding-y);
    overflow: hidden;
    font-size: var(--notify-title-size);
    font-weight: 600;
    line-height: var(--notify-title-line-height);
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__title-collapse {
    display: grid;
    flex: 1;
    min-width: 0;
    padding-top: var(--notify-title-padding-y);
    padding-bottom: var(--notify-title-padding-y);
    grid-template-rows: minmax(var(--notify-title-line), 0fr);
    transition: grid-template-rows var(--notify-motion) ease;
    text-align: left;

    &--open {
      grid-template-rows: minmax(var(--notify-title-line), 1fr);
    }

    .abyss-notify__message {
      position: absolute;
      inset: 0;
      flex: none;
      padding: 0;
    }

    &--open .abyss-notify__message {
      overflow-wrap: anywhere;
      text-overflow: unset;
      white-space: normal;
    }
  }

  &__title-collapse-inner {
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  &__message-sizer {
    display: block;
    width: 100%;
    max-width: 100%;
    visibility: hidden;
    font-size: var(--notify-title-size);
    font-weight: 600;
    line-height: var(--notify-title-line-height);
    overflow-wrap: anywhere;
    white-space: normal;
  }

  &__collapse {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--notify-motion) ease;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__collapse-inner {
    min-height: 0;
    overflow: hidden;
  }

  &__description {
    position: relative;
    z-index: 1;
    padding: 0 12px 10px;
    font-size: 13px;
    line-height: 1.4;
    color: white;
    opacity: 0.85;
  }

  &__close {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    align-self: flex-start;
    box-sizing: border-box;
    width: 40px;
    min-width: 40px;
    height: var(--notify-header-height);
    min-height: var(--notify-header-height);
    padding: 0;
    border-radius: 7px;
    border: 1px solid transparent;
    background-color: transparent;
    box-shadow: none;
    color: white;
    transition:
      background-color 0.3s ease-out,
      border-color 0.3s ease-out;

    :deep(.q-focus-helper) {
      display: none;
    }

    :deep(.q-ripple) {
      opacity: 0.35;
    }

    :deep(.q-btn__content) {
      position: relative;
      width: 100%;
      height: 100%;
      color: inherit;
    }

    :deep(.q-icon) {
      position: relative;
      z-index: 1;
      font-size: 24px;
      color: inherit;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: rgba(white, 0.12);
        border-color: rgba(white, 0.2);
      }
    }

    &:focus-visible {
      background-color: rgba(white, 0.12);
      border-color: rgba(white, 0.2);
    }

    &:active {
      background-color: rgba(white, 0.16);
      border-color: rgba(white, 0.4);
    }
  }

  &__close-timer {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    width: 34px;
    height: 34px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    overflow: visible;
    color: white;
    opacity: 1;
    transition: opacity var(--notify-motion) ease;

    circle {
      fill: none;
      stroke: currentColor;
    }
  }

  &__close-timer-track {
    opacity: 0.28;
  }

  &__close-timer-bar {
    transform: rotate(-90deg);
    transform-box: fill-box;
    transform-origin: center;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: abyss-notify-close-timer var(--notify-auto-close) linear forwards;
  }
}

.abyss-notify-shell:hover,
.abyss-notify-shell:focus-within {
  .abyss-notify__close-timer {
    opacity: 0.5;
  }

  .abyss-notify__close-timer-bar {
    animation-play-state: paused;
  }
}

.abyss-notify-enter-active,
.abyss-notify-leave-active {
  transition:
    grid-template-rows var(--notify-motion) ease,
    transform var(--notify-motion) ease,
    opacity var(--notify-motion) ease;
}

.abyss-notify-leave-active:last-child {
  transition:
    transform var(--notify-motion) ease,
    opacity var(--notify-motion) ease;
}

.abyss-notify-enter-from {
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-12px);
}

.abyss-notify-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(12px);

  &:last-child {
    grid-template-rows: 1fr;
  }
}

@keyframes abyss-notify-count-ripple {
  from {
    transform: scale(1);
    opacity: 0.7;
  }

  to {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes abyss-notify-close-timer {
  to {
    stroke-dashoffset: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .abyss-notify__count-ripple {
    animation: none;
  }
}
</style>

<style lang="scss">
.abyss-notify-queue {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: min(100%, calc(420px + 16px));
  max-width: 100%;
  max-height: min(240px, 70vh);
  min-width: 0;
  min-height: 0;
  padding: 12px 8px;
  box-sizing: border-box;
  overflow: visible;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  @include scrollbar;

  > .abyss-notify-shell,
  > .abyss-notify {
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
}
</style>
