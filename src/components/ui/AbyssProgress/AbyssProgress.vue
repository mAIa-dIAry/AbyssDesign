<template>
  <div
    :class="[
      'abyss-progress',
      {
        'abyss-progress--indeterminate': indeterminate,
        'abyss-progress--no-glow': !glow,
      },
      $props.class,
    ]"
    :style="[styleVars, style]"
    v-bind="$attrs"
  >
    <div class="abyss-progress__track">
      <div class="abyss-progress__bar" :style="barStyle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface AbyssProgressProps {
  /** Wartość postępu od 0 do 1 */
  value?: number;
  /** Kolor paska postępu (CSS color) */
  color?: string;
  /** Kolor tła tracka (CSS color) */
  trackColor?: string;
  /** Kolor obramowania tracka (CSS color) */
  borderColor?: string;
  /** Czy pasek ma emitować poświatę */
  glow?: boolean;
  /** Tryb nieokreślony – animacja bez ustalonej wartości */
  indeterminate?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssProgressProps>(), {
  value: 0,
  indeterminate: false,
  style: '',
  class: '',
  color: 'white',
  trackColor: '',
  borderColor: '',
  glow: true,
});

const barStyle = computed(() => ({
  ...(!props.indeterminate && {
    width: `${Math.min(Math.max(props.value ?? 0, 0), 1) * 100}%`,
  }),
}));

const styleVars = computed(() => ({
  '--progress-color': props.color,
  '--glow-color': props.color,
  ...(props.trackColor ? { '--progress-track-color': props.trackColor } : {}),
  ...(props.borderColor
    ? { '--progress-border-color': props.borderColor }
    : {}),
}));
</script>

<style scoped lang="scss">
@use 'sass:math';

$indet-gradient-background-width: 300%;
$indet-gradient-shadow-width: 50%;
$indet-animation-speed-multiplier: 0.8;
$indet-gradient-softness-multiplier: 4;

@keyframes abyss-progress-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

@keyframes abyss-progress-shimmer {
  0% {
    background-position: $indet-gradient-background-width center;
  }

  100% {
    background-position: -$indet-gradient-background-width center;
  }
}

$indet-animation-duration: 3s *
  math.div($indet-gradient-background-width, 100%) *
  $indet-animation-speed-multiplier;

.abyss-progress {
  &__track {
    position: relative;
    height: 8px;
    border-radius: 4px;
    border: 1px solid var(--progress-border-color, transparent);
    background-color: var(
      --progress-track-color,
      color-mix(in srgb, var(--progress-color) 20%, transparent)
    );
  }

  &__bar {
    height: 100%;
    border-radius: 4px;
    background-color: var(--progress-color);
    transition: width 0.3s ease;
    position: relative;
    min-width: 8px;

    &::before {
      content: '';
      position: absolute;
      inset: 0 0 0 0;
      border-radius: 4px;
      box-shadow: $glow-medium;
      opacity: 1;
    }
  }

  &--no-glow {
    .abyss-progress__bar::before {
      display: none;
    }
  }

  &--indeterminate {
    .abyss-progress__bar {
      width: 100%;
      background-color: transparent;
      border: 1px solid
        color-mix(in srgb, var(--progress-color) 2%, transparent);

      &::before {
        animation: abyss-progress-pulse math.div($indet-animation-duration, 2)
          ease-in-out infinite;
      }
      background-image: shimmer-gradient(
        var(--progress-color),
        color-mix(in srgb, var(--progress-color) 20%, transparent),
        $indet-gradient-shadow-width,
        $indet-gradient-softness-multiplier
      );

      background-size: $indet-gradient-background-width 100%;
      animation: abyss-progress-shimmer $indet-animation-duration linear
        infinite;
    }
  }
}
</style>
