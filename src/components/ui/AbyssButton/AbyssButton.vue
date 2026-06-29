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
        'size-medium': size === 'medium',
        'size-big': size === 'big',
        'full-width': fullWidth,
        gradient: gradient,
        current: isCurrent && !gradient,
        toggled: toggled && !gradient && !isCurrent,
        embedded: embedded && !flat && !gradient && !isCurrent,
        flat: flat && !isCurrent,
      },
      $props.class,
    ]"
    :style="buttonStyle"
    :disable="disable"
    :loading="loading"
    :percentage="percentage"
    v-bind="$attrs"
  >
    <div
      v-if="gradient"
      class="abyss-button__gradient-layers"
      aria-hidden="true"
    >
      <AbyssBackground
        class="abyss-button__gradient-fill"
        :colors="resolvedGradientColors"
      />
      <div v-if="flat" class="abyss-button__gradient-frame" aria-hidden="true">
        <AbyssBackground
          class="abyss-button__gradient-frame-layer"
          :colors="resolvedGradientColors"
        />
        <AbyssBackground
          class="abyss-button__gradient-frame-layer abyss-button__gradient-frame-layer--reduced"
          :colors="resolvedGradientColors"
        />
        <div class="abyss-button__gradient-active-border" aria-hidden="true" />
      </div>
    </div>

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
import {
  resolveGradientColors,
  type GradientColorsInput,
} from '@/defines/semantic-gradients';
import { NAVIGATION_CURRENT_ROUTE_KEY } from '@/components/ui/AbyssNavigation/navigationContext';

export interface AbyssButtonProps {
  label?: string;
  icon?: string;
  iconRight?: string;
  route?: string;
  fullWidth?: boolean;
  style?: string | Record<string, string>;
  current?: boolean;
  size?: 'small' | 'medium' | 'big';
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
  gradientColors?: GradientColorsInput;
}

const props = withDefaults(defineProps<AbyssButtonProps>(), {
  label: '',
  icon: '',
  iconRight: '',
  route: '',
  fullWidth: false,
  style: '',
  size: 'big',
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

const resolvedGradientColors = computed(() =>
  resolveGradientColors(props.gradientColors),
);

const buttonStyle = computed(() => {
  return props.style;
});
</script>

<style scoped lang="scss">
$shadow-frame-soft-inverted:
  inset 0px 1px 1px 0px rgba(0, 0, 0, 0.3),
  inset 0px 0px 0px 1px rgba(255, 255, 255, 0.06);

@mixin abyss-button-gradient-inner-frame {
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
}

@mixin abyss-button-corner-radius {
  border-top-left-radius: var(--border-top-left-radius);
  border-top-right-radius: var(--border-top-right-radius);
  border-bottom-right-radius: var(--border-bottom-right-radius);
  border-bottom-left-radius: var(--border-bottom-left-radius);
}

@mixin abyss-button-corner-clip {
  clip-path: inset(
    0 round var(--border-top-left-radius) var(--border-top-right-radius)
      var(--border-bottom-right-radius) var(--border-bottom-left-radius)
  );
}

@mixin abyss-button-gradient-frame-outer-radius-vars {
  --gradient-frame-outer-tl: max(
    0px,
    calc(var(--border-top-left-radius) - var(--gradient-frame-radius-offset-outer))
  );
  --gradient-frame-outer-tr: max(
    0px,
    calc(var(--border-top-right-radius) - var(--gradient-frame-radius-offset-outer))
  );
  --gradient-frame-outer-br: max(
    0px,
    calc(
      var(--border-bottom-right-radius) - var(--gradient-frame-radius-offset-outer)
    )
  );
  --gradient-frame-outer-bl: max(
    0px,
    calc(
      var(--border-bottom-left-radius) - var(--gradient-frame-radius-offset-outer)
    )
  );
}

@mixin abyss-button-gradient-frame-inner-radius-vars {
  --gradient-frame-inner-tl: max(
    0px,
    calc(var(--border-top-left-radius) - var(--gradient-frame-radius-offset-inner))
  );
  --gradient-frame-inner-tr: max(
    0px,
    calc(var(--border-top-right-radius) - var(--gradient-frame-radius-offset-inner))
  );
  --gradient-frame-inner-br: max(
    0px,
    calc(
      var(--border-bottom-right-radius) - var(--gradient-frame-radius-offset-inner)
    )
  );
  --gradient-frame-inner-bl: max(
    0px,
    calc(
      var(--border-bottom-left-radius) - var(--gradient-frame-radius-offset-inner)
    )
  );
}

@mixin abyss-button-gradient-frame-mask-base {
  box-sizing: border-box;
  padding: var(--gradient-frame-width);
  -webkit-mask-image:
    linear-gradient(#fff 0 0),
    linear-gradient(#fff 0 0);
  -webkit-mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-image:
    linear-gradient(#fff 0 0),
    linear-gradient(#fff 0 0);
  mask-clip: content-box, border-box;
  mask-composite: exclude;
}

@mixin abyss-button-gradient-frame-outer-radius {
  border-top-left-radius: var(--gradient-frame-outer-tl);
  border-top-right-radius: var(--gradient-frame-outer-tr);
  border-bottom-right-radius: var(--gradient-frame-outer-br);
  border-bottom-left-radius: var(--gradient-frame-outer-bl);
}

@mixin abyss-button-gradient-frame-inner-radius {
  border-top-left-radius: var(--gradient-frame-inner-tl);
  border-top-right-radius: var(--gradient-frame-inner-tr);
  border-bottom-right-radius: var(--gradient-frame-inner-br);
  border-bottom-left-radius: var(--gradient-frame-inner-bl);
}

@mixin abyss-button-gradient-frame-mask {
  @include abyss-button-gradient-frame-mask-base;
  @include abyss-button-gradient-frame-outer-radius;
}

@mixin abyss-button-gradient-frame-mask-reduced {
  @include abyss-button-gradient-frame-mask-base;
  @include abyss-button-gradient-frame-inner-radius;
}

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
    --padding-x: 12px;
    --padding-y: 8px;
    --icon-size: 16px;
    --border-radius: 6px;
    min-height: 32px;
    height: 32px;

    &.icon-only {
      min-width: 32px;
      width: 32px;
    }
  }

  &.size-medium {
    --font-size: 12px;
    --padding-x: 16px;
    --padding-y: 12px;
    --icon-size: 16px;
    --border-radius: 6px;
    min-height: 40px;
    height: 40px;

    &.icon-only {
      min-width: 40px;
      width: 40px;
    }
  }

  &.size-big {
    --font-size: 16px;
    --padding-x: 16px;
    --padding-y: 12px;
    --icon-size: 24px;
    --border-radius: 8px;
    min-height: 48px;
    height: 48px;

    &.icon-only {
      min-width: 48px;
      width: 48px;
    }
  }

  &.full-width {
    width: 100%;

    &.size-small,
    &.size-medium,
    &.size-big {
      height: 100%;
    }

    &.icon-only {
      min-width: 0;
      width: 100%;
      height: 100%;
    }
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
    --gradient-overlay-opacity: 0;
    --gradient-fill-opacity: 0;
    --gradient-frame-width: 1px;
    overflow: hidden;

    .abyss-button__gradient-layers {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      @include abyss-button-corner-radius;
      @include abyss-button-corner-clip;
    }

    .abyss-button__gradient-fill {
      position: absolute;
      inset: 0;
      @include abyss-button-corner-radius;

      :deep(.abyss-background__stage),
      :deep(.abyss-background__layer) {
        @include abyss-button-corner-radius;
      }
    }

    :deep(.q-btn__content) {
      position: static;
      z-index: auto;
    }

    :deep(.q-btn__content > :not(.abyss-button__gradient-layers)) {
      position: relative;
      z-index: 2;
    }

    :deep(.q-focus-helper) {
      display: none;
    }

    :deep(.q-ripple) {
      opacity: 0.3;
    }

    &:not(.flat) {
      .abyss-button__gradient-fill {
        opacity: 1;
      }

      &::after {
        @include abyss-button-gradient-inner-frame;
        display: block;
        z-index: 1;
        background: var(--gradient-overlay);
        transition: background-color 0.3s ease-out;
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

    &.flat {
      --gradient-frame-radius-offset-outer: 1px;
      --gradient-frame-radius-offset-inner: -1px;
      --gradient-active-border-color: #{rgba(white, 0.22)};
      --gradient-active-border-opacity: 0;
      @include abyss-button-gradient-frame-outer-radius-vars;
      @include abyss-button-gradient-frame-inner-radius-vars;
      overflow: visible;

      .abyss-button__gradient-layers {
        overflow: visible;
        clip-path: none;
      }

      &::after {
        @include abyss-button-gradient-inner-frame;
        display: block;
        z-index: 1;
        background: var(--gradient-overlay);
        opacity: var(--gradient-overlay-opacity);
        transition:
          opacity 0.2s ease-out,
          background-color 0.3s ease-out;
      }

      .abyss-button__gradient-fill {
        opacity: var(--gradient-fill-opacity);
        transition: opacity 0.2s ease-out;
      }

      .abyss-button__gradient-frame {
        position: absolute;
        inset: 0;
        z-index: 1;

        :deep(.abyss-button__gradient-frame-layer) {
          @include abyss-button-gradient-frame-mask;
          position: absolute;
          inset: 0;
        }

        :deep(.abyss-button__gradient-frame-layer--reduced) {
          @include abyss-button-gradient-frame-mask-reduced;
        }

        :deep(.abyss-background__stage),
        :deep(.abyss-background__layer) {
          border-radius: inherit;
        }

        .abyss-button__gradient-active-border {
          position: absolute;
          inset: 0;
          z-index: 2;
          box-sizing: border-box;
          pointer-events: none;
          border: var(--gradient-frame-width) solid var(--gradient-active-border-color);
          @include abyss-button-gradient-frame-outer-radius;
          opacity: var(--gradient-active-border-opacity);
          transition: opacity 0.3s ease-out;
        }
      }

      &:not([disabled], [role='progressbar'], .current) {
        @media (hover: hover) and (pointer: fine) {
          &:hover {
            --gradient-fill-opacity: 1;
            --gradient-overlay-opacity: 1;
            --gradient-overlay: #{rgba(black, 0.45)};
          }
        }

        &:focus-visible {
          --gradient-fill-opacity: 1;
          --gradient-overlay-opacity: 1;
          --gradient-overlay: #{rgba(black, 0.45)};
        }

        &:active {
          --gradient-fill-opacity: 1;
          --gradient-overlay-opacity: 1;
          --gradient-overlay: #{rgba(black, 0.42)};
          --gradient-active-border-opacity: 1;
        }
      }

      --border-width: 1px;
      box-shadow: $shadow-zero;
      transform: none;
      border: var(--border-width) solid transparent;
      padding: calc(var(--padding-y) - var(--border-width))
        calc(var(--padding-x) - var(--border-width));

      &.icon-only {
        padding: calc(var(--padding-y) - var(--border-width));
      }

      &:not([disabled], [role='progressbar'], .current) {
        @media (hover: hover) and (pointer: fine) {
          &:hover {
            border-color: transparent;
            background-color: transparent;
            box-shadow: none;
            transform: none;
          }
        }

        &:focus-visible {
          border-color: transparent;
          background-color: transparent;
          transform: none;
        }

        &:active {
          border-color: transparent;
          background-color: transparent;
          transform: none;
        }
      }

      &[disabled] {
        box-shadow: $shadow-zero;
        transform: none;
      }
    }
  }
}
</style>
