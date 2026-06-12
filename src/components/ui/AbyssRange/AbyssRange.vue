<template>
  <q-range
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @pan="$emit('pan', $event)"
    @change="$emit('change', $event)"
    :min="min"
    :max="max"
    :step="step"
    :snap="snap"
    :reverse="false"
    :vertical="vertical"
    color="white"
    :label="label"
    :label-always="labelAlways"
    :left-label-value="leftLabelValue"
    :right-label-value="rightLabelValue"
    label-color="rgba(255, 255, 255, 0.8)"
    label-text-color="rgba(0, 0, 0, 0.8)"
    :switch-label-side="switchLabelSide"
    :readonly="readonly"
    :disable="disable"
    thumb-size="20px"
    track-size="8px"
    :inner-min="innerMin"
    :inner-max="innerMax"
    :markers="markers"
    :marker-labels="markerLabels"
    :switch-marker-labels-side="switchMarkerLabelsSide"
    :drag-range="dragRange"
    :drag-only-range="dragOnlyRange"
    :name="name"
    :class="['abyss-range', $props.class]"
    :style="style"
    v-bind="$attrs"
  >
    <template v-if="$slots['marker-label']" #marker-label="scope">
      <slot name="marker-label" v-bind="scope" />
    </template>
    <template v-if="$slots['marker-label-group']" #marker-label-group="scope">
      <slot name="marker-label-group" v-bind="scope" />
    </template>
  </q-range>
</template>

<script setup lang="ts">
import type { SliderMarkerLabels } from 'quasar';

export interface AbyssRangeValue {
  min: number | null;
  max: number | null;
}

export interface AbyssRangeProps {
  modelValue?: AbyssRangeValue | null;
  min?: number;
  max?: number;
  step?: number;
  snap?: boolean;
  vertical?: boolean;
  label?: boolean;
  labelAlways?: boolean;
  leftLabelValue?: string | number;
  rightLabelValue?: string | number;
  switchLabelSide?: boolean;
  readonly?: boolean;
  disable?: boolean;
  innerMin?: number;
  innerMax?: number;
  markers?: boolean | number;
  markerLabels?: SliderMarkerLabels;
  switchMarkerLabelsSide?: boolean;
  dragRange?: boolean;
  dragOnlyRange?: boolean;
  name?: string;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

withDefaults(defineProps<AbyssRangeProps>(), {
  min: 0,
  max: 100,
  step: 1,
  snap: false,
  vertical: false,
  label: false,
  labelAlways: false,
  readonly: false,
  disable: false,
  switchMarkerLabelsSide: false,
  dragRange: false,
  dragOnlyRange: false,
  style: '',
  class: '',
});

defineEmits<{
  'update:modelValue': [value: AbyssRangeValue | null];
  pan: [phase: 'start' | 'end'];
  change: [value: AbyssRangeValue | null];
}>();
</script>

<style scoped lang="scss">
.abyss-range.q-slider {
  :deep(.q-slider__track-container) {
    .q-slider__track {
      background-color: rgba(white, 0.03);
      box-shadow: inset 0 0 0 1px rgba(white, 0.1);

      .q-slider__inner {
        background-color: rgba(white, 0.2);
        box-shadow: inset 0 0 0 1px rgba(white, 0.1);
      }

      .q-slider__selection {
        background-color: white;
        box-shadow: $glow-base;
        border-radius: 4px;
      }

      .q-slider__thumb {
        .q-slider__thumb-shape {
          border-radius: 50%;
          background-color: white;
          box-shadow: $glow-medium;
        }

        .q-slider__focus-ring {
          transition: $transition-medium;
          background: transparent;
          background-position: center;
          background-image: radial-gradient(
            circle closest-side at center,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
        }

        .q-slider__pin {
          color: white;

          .q-slider__text {
            color: black;
          }
        }
      }
    }

    .q-slider__marker-labels-container {
      .q-slider__marker-label {
        color: rgba(white, 0.5);
        font-size: 11px;
        font-weight: 400;
        white-space: nowrap;
      }
    }
  }

  &.q-slider--enabled.q-slider--editable {
    :deep(.q-slider__track-container) {
      .q-slider__track {
        &:hover {
          .q-slider__thumb {
            .q-slider__focus-ring {
              opacity: 1;
              transform: scale3d(2, 2, 1);
            }
          }
        }
      }
    }
  }
}
</style>
