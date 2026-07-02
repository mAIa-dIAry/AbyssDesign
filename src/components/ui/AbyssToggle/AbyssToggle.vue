<template>
  <div
    class="abyss-toggle-container"
    :class="{ 'abyss-toggle-container--inline': inline }"
  >
    <div
      v-if="label"
      class="abyss-toggle-row"
      :class="{ 'abyss-toggle-row--right-label': rightLabel }"
    >
      <AbyssInputLabel :label="label" />
      <q-toggle
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :icon="icon"
        :checked-icon="checkedIcon"
        :unchecked-icon="uncheckedIcon"
        :indeterminate-icon="indeterminateIcon"
        :true-value="trueValue"
        :false-value="falseValue"
        :toggle-indeterminate="toggleIndeterminate"
        :indeterminate-value="indeterminateValue"
        :toggle-order="toggleOrder"
        :disable="disable"
        :class="['abyss-toggle', $props.class]"
        :style="style"
        v-bind="$attrs"
      >
        <template v-if="$slots.default">
          <slot />
        </template>
      </q-toggle>
    </div>
    <q-toggle
      v-else
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :icon="icon"
      :checked-icon="checkedIcon"
      :unchecked-icon="uncheckedIcon"
      :indeterminate-icon="indeterminateIcon"
      :true-value="trueValue"
      :false-value="falseValue"
      :toggle-indeterminate="toggleIndeterminate"
      :indeterminate-value="indeterminateValue"
      :toggle-order="toggleOrder"
      :disable="disable"
      :class="['abyss-toggle', $props.class]"
      :style="style"
      v-bind="$attrs"
    >
      <template v-if="$slots.default">
        <slot />
      </template>
    </q-toggle>
  </div>
</template>

<script setup lang="ts">
import AbyssInputLabel from '@/components/ui/AbyssInputLabel/AbyssInputLabel.vue';

export interface AbyssToggleProps {
  modelValue?: unknown;
  label?: string;
  rightLabel?: boolean;
  icon?: string;
  checkedIcon?: string;
  uncheckedIcon?: string;
  indeterminateIcon?: string;
  trueValue?: unknown;
  falseValue?: unknown;
  toggleIndeterminate?: boolean;
  indeterminateValue?: unknown;
  toggleOrder?: 'tf' | 'ft';
  disable?: boolean;
  inline?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

withDefaults(defineProps<AbyssToggleProps>(), {
  label: '',
  rightLabel: false,
  icon: '',
  checkedIcon: '',
  uncheckedIcon: '',
  indeterminateIcon: '',
  toggleIndeterminate: false,
  toggleOrder: 'tf',
  disable: false,
  inline: false,
  style: '',
  class: '',
});

defineEmits<{
  'update:modelValue': [value: unknown];
}>();
</script>

<style scoped lang="scss">
.abyss-toggle-container {
  width: 100%;
  container-type: inline-size;

  &--inline {
    width: fit-content;
    min-width: max-content;
  }
}

.abyss-toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  &--right-label {
    flex-direction: row-reverse;
  }

  .abyss-toggle-container--inline & {
    width: fit-content;
  }

  :deep(.abyss-input-label) {
    flex: 1 1 auto;
    min-width: 0;
  }

  .abyss-toggle-container--inline & :deep(.abyss-input-label) {
    flex: 0 0 auto;
  }
}

.abyss-toggle {
  flex: 0 0 auto;
  padding: 6px 0;
  gap: 8px;
  width: auto;

  :deep() {
    .q-toggle__inner {
      --background-color: #{rgba(white, 0.02)};
      --border-color: #{rgba(white, 0.15)};
      --thumb-color: #{rgba(white, 0.15)};
      --icon-color: white;
      --thumb-offset: 0px;
      --thumb-border-width: 0px;
      --thumb-border-color: #{rgba(white, 0.3)};
      padding: 0;
      width: 64px;
      height: 36px;
      border-radius: 18px;
      transform: translateY(0px);
      transition: $transition-medium;
      box-shadow: $shadow-base;

      .q-toggle__track {
        width: 100%;
        height: 100%;
        border-radius: 18px;
        border: 1px solid var(--border-color);
        transition: $transition-medium;
        background-color: var(--background-color);
      }

      .q-toggle__thumb {
        width: 30px;
        height: 30px;
        top: 3px;
        left: 3px;
        border-radius: 50%;
        box-shadow: none;
        transition: $transition-medium;
        background-color: var(--thumb-color);
        transform: translateX(var(--thumb-offset));
        box-shadow: inset 0 0 0 var(--thumb-border-width)
          var(--thumb-border-color);

        &::after,
        &::before {
          display: none;
        }

        .q-icon {
          font-size: 21px;
          transition: $transition-medium;
          color: var(--icon-color);
          opacity: 1;
        }
      }

      &--indet {
        --background-color: #{rgba(white, 0.1)};
        --thumb-color: transparent;
        --icon-color: white;
        --thumb-offset: 14px;
        --thumb-border-width: 4px;
      }

      &--truthy {
        --background-color: #{rgba(white, 0.2)};
        --thumb-color: #{rgba(white, 0.8)};
        --icon-color: black;
        --thumb-offset: 28px;
      }
    }

    .q-toggle__label {
      display: none;
    }
  }

  &:not(.disabled) {
    :deep() {
      .q-toggle__inner {
        &:hover {
          transform: translateY(-1px);
          box-shadow: $shadow-hover;
          --border-color: #{rgba(white, 0.35)};
        }

        &:active {
          box-shadow: $shadow-active;
          transform: translateY(0.5px);
          --border-color: #{rgba(white, 0.7)};
        }
      }
    }
  }

  &.disabled {
    opacity: 1 !important;

    :deep() {
      .q-toggle__inner {
        box-shadow: $shadow-disabled;
        transform: translateY(1px);
        --border-color: transparent;
        opacity: 0.5;
      }
    }
  }
}
</style>
