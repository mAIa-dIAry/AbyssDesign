<template>
  <q-btn
    :label="label"
    :icon="icon || undefined"
    :icon-right="iconRight || undefined"
    :ripple="{ early: true }"
    no-wrap
    :class="[
      'abyss-button',
      {
        'icon-only': icon && !label,
        'size-small': size === 'small',
        'full-width': fullWidth,
        gradient: gradient,
        current: isCurrent && !gradient,
        toggled: toggled && !gradient && !isCurrent,
        embedded: embedded && !flat && !gradient && !isCurrent,
        flat: flat && !gradient && !isCurrent,
      },
      $props.class,
    ]"
    :style="buttonStyle"
    :disable="disable"
    :loading="loading"
    :percentage="percentage"
    v-bind="$attrs"
  >
    <AbyssBackground
      v-if="gradient"
      class="abyss-button__gradient-background"
      :colors="gradientColors"
    />

    <!-- Forward default slot -->
    <template v-if="$slots.default">
      <slot></slot>
    </template>

    <!-- Forward loading slot -->
    <template v-if="$slots.loading" v-slot:loading>
      <div class="loading-slot">
        <slot name="loading"></slot>
      </div>
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import { DEFAULT_GRADIENT_COLORS } from '@/composables/useGradient';
import { NAVIGATION_CURRENT_ROUTE_KEY } from '@/components/ui/AbyssNavigation/navigationContext';

export interface AbyssButtonProps {
  label?: string;
  icon?: string;
  iconRight?: string;
  route?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  current?: boolean;
  size?: 'normal' | 'small';
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  disable?: boolean;
  loading?: boolean;
  percentage?: number;
  embedded?: boolean;
  flat?: boolean;
  toggled?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
}

const props = withDefaults(defineProps<AbyssButtonProps>(), {
  label: '',
  icon: '',
  iconRight: '',
  route: '',
  fullWidth: false,
  style: '',
  size: 'normal',
  class: '',
  current: false,
  disable: false,
  loading: false,
  percentage: 0,
  embedded: false,
  flat: false,
  toggled: false,
  gradient: false,
});

const injectedCurrentRoute = inject(NAVIGATION_CURRENT_ROUTE_KEY, ref(''));

const isCurrent = computed(
  () =>
    props.current ||
    (!!props.route &&
      !!injectedCurrentRoute.value &&
      props.route === injectedCurrentRoute.value),
);

const gradientColors = computed(
  () => props.gradientColors ?? DEFAULT_GRADIENT_COLORS,
);

const buttonStyle = computed(() => {
  return props.style;
});
</script>

<style scoped lang="scss">
$shadow-frame-soft-inverted:
  inset 0px 1px 1px 0px rgba(0, 0, 0, 0.3),
  inset 0px 0px 0px 1px rgba(255, 255, 255, 0.06);

.abyss-button {
  --font-size: 16px;
  --padding-x: var(--font-size);
  --padding-y: 12px;
  --icon-size: 24px;
  --border-radius: 8px;
  --border-top-left-radius: var(--border-radius);
  --border-top-right-radius: var(--border-radius);
  --border-bottom-right-radius: var(--border-radius);
  --border-bottom-left-radius: var(--border-radius);
  --button-border-radius: var(--border-top-left-radius)
    var(--border-top-right-radius) var(--border-bottom-right-radius)
    var(--border-bottom-left-radius);
  border-radius: var(--button-border-radius);
  position: relative;
  color: white;
  background-color: rgba(white, 0.02);
  box-shadow: $shadow-base;
  transition: all 0.3s ease-out;
  padding: var(--padding-y) var(--padding-x);
  text-transform: none;
  font-weight: 400;
  outline-color: white;
  min-height: calc(var(--icon-size) + var(--padding-y) * 2);
  line-height: var(--icon-size);
  font-size: var(--font-size);

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    display: none;
    pointer-events: none;
    border-radius: inherit;
    clip-path: inset(0 round var(--button-border-radius));
  }

  &:not(.embedded, .flat, .gradient) {
    box-shadow: $shadow-base, $shadow-frame-soft;
  }

  &.size-small {
    --font-size: 12px;
    --padding-y: 8px;
    --icon-size: 16px;
    --border-radius: 6px;
  }

  :deep() {
    .q-focus-helper {
      display: none;
    }

    .q-ripple {
      opacity: 0.2;
    }

    .q-icon,
    .q-spinner {
      &.on-left {
        margin-right: calc(var(--padding-x) / 2);
      }
      &.on-right {
        margin-left: calc(var(--padding-x) / 2);
      }
      font-size: var(--icon-size);
    }

    .q-btn__progress-indicator {
      background-color: rgba(white, 0.05);
    }

    .q-btn__content {
      position: relative;
      z-index: 1;
      transition: all 0.3s ease-out;

      .block {
        width: auto;
        overflow: hidden;
      }
    }
  }

  &[role='progressbar'] {
    margin-top: 0px;
    cursor: progress;
    box-shadow: $shadow-disabled;
    transform: translateY(1px);

    :deep() {
      .q-ripple {
        opacity: 0;
      }

      .absolute-full:has(.loading-slot) {
        position: static;
      }

      .q-btn__content {
        position: absolute;
      }
    }
  }

  &[role='progressbar']:not(.embedded, .flat, .gradient) {
    box-shadow: $shadow-disabled, $shadow-frame-soft;
  }

  .loading-slot {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &:not([disabled], [role='progressbar'], .current) {
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: rgba(white, 0.04);
        box-shadow: $shadow-hover;
        transform: translateY(-1px);
      }

      &:hover:not(.embedded, .flat, .gradient) {
        box-shadow: $shadow-hover, $shadow-frame-soft;
      }
    }

    &:focus-visible {
      background-color: rgba(white, 0.04);
      box-shadow: $shadow-hover;
      transform: translateY(-1px);
    }

    &:focus-visible:not(.embedded, .flat, .gradient) {
      box-shadow: $shadow-hover, $shadow-frame-soft;
    }

    &:focus-visible {
      outline: 1px solid rgba(white, 0.4) !important;
      outline-offset: 0px;
    }

    &:active {
      background-color: rgba(white, 0.03);
      box-shadow: $shadow-active;
      transform: translateY(0.5px);
    }

    &:active:not(.flat, .gradient) {
      box-shadow: $shadow-active, $shadow-frame-soft;
    }
  }

  &.icon-only {
    padding: var(--padding-y);
  }

  &[disabled] {
    box-shadow: $shadow-disabled;
    transform: translateY(1px);
  }

  &[disabled]:not(.embedded, .flat, .gradient) {
    box-shadow: $shadow-disabled, $shadow-frame-soft;
  }

  &.current {
    background-color: rgba(black, 0.25);
    box-shadow: $shadow-current, $shadow-frame-soft-inverted;
    pointer-events: none;

    :deep(.q-ripple) {
      opacity: 0.08;
    }
  }

  &.toggled {
    background-color: rgba(black, 0.25);
    box-shadow:
      $shadow-base,
      $shadow-frame-soft,
      inset 0 0 0 1px rgba(white, 0.1);

    &:not([disabled], [role='progressbar']) {
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background-color: rgba(black, 0.32);
          box-shadow:
            $shadow-hover,
            $shadow-frame-soft,
            inset 0 0 0 1px rgba(white, 0.08);
          transform: translateY(-1px);
        }
      }

      &:focus-visible {
        background-color: rgba(black, 0.32);
        box-shadow:
          $shadow-hover,
          $shadow-frame-soft,
          inset 0 0 0 1px rgba(white, 0.08);
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline-color: rgba(white, 0.5) !important;
      }

      &:active {
        background-color: rgba(black, 0.38);
        box-shadow:
          $shadow-active,
          $shadow-frame-soft,
          inset 0 0 0 1px rgba(white, 0.22);
        transform: translateY(0.5px);
      }
    }
  }

  &.embedded {
    box-shadow: $shadow-zero;
    background-color: transparent;

    &:not([disabled], [role='progressbar'], .current) {
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          box-shadow: $shadow-hover, $shadow-frame-soft;
        }
      }
    }
  }

  &.flat {
    --border-width: 1px;
    box-shadow: $shadow-zero;
    background-color: transparent;
    transform: none;
    border: var(--border-width) solid transparent;
    padding: calc(var(--padding-y) - var(--border-width))
      calc(var(--padding-x) - var(--border-width));

    &:not([disabled], [role='progressbar'], .current) {
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background-color: rgba(white, 0.04);
          border-color: rgba(white, 0.08);
          box-shadow: none;
          transform: none;
        }
      }

      &:focus-visible {
        background-color: rgba(white, 0.04);
        border-color: rgba(white, 0.08);
        transform: none;
      }

      &:active {
        background-color: rgba(white, 0.03);
        border-color: rgba(white, 0.22);
        box-shadow: none;
        transform: none;
      }
    }

    &[disabled] {
      box-shadow: $shadow-zero;
      transform: none;
    }

    &.icon-only {
      padding: calc(var(--padding-y) - var(--border-width));
    }
  }

  &.gradient {
    background-color: transparent;
    --gradient-overlay: #{rgba(black, 0.5)};
    --gradient-frame-width: 1px;

    &::after {
      display: block;
      z-index: 1;
      inset: var(--gradient-frame-width);
      border-radius: calc(
          var(--border-top-left-radius) - var(--gradient-frame-width)
        )
        calc(var(--border-top-right-radius) - var(--gradient-frame-width))
        calc(var(--border-bottom-right-radius) - var(--gradient-frame-width))
        calc(var(--border-bottom-left-radius) - var(--gradient-frame-width));
      clip-path: inset(
        0 round
          calc(var(--border-top-left-radius) - var(--gradient-frame-width))
          calc(var(--border-top-right-radius) - var(--gradient-frame-width))
          calc(var(--border-bottom-right-radius) - var(--gradient-frame-width))
          calc(var(--border-bottom-left-radius) - var(--gradient-frame-width))
      );
      background: var(--gradient-overlay);
      transition: background-color 0.3s ease-out;
    }

    .abyss-button__gradient-background {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      border-radius: inherit;
      clip-path: inset(0 round var(--button-border-radius));
    }

    :deep(.q-btn__content) {
      position: static;
      z-index: auto;
    }

    :deep(.q-btn__content > :not(.abyss-button__gradient-background)) {
      position: relative;
      z-index: 2;
    }

    :deep(.q-focus-helper) {
      display: none;
    }

    :deep(.q-ripple) {
      opacity: 0.3;
    }

    &:not([disabled], [role='progressbar'], .current) {
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          --gradient-overlay: #{rgba(black, 0.45)};
        }
      }

      &:focus-visible {
        --gradient-overlay: #{rgba(black, 0.45)};
      }

      &:active {
        --gradient-overlay: #{rgba(black, 0.42)};
      }
    }
  }
}
</style>
