<template>
  <div class="abyss-pin-input" :class="$props.class" :style="style">
    <div
      class="abyss-pin-input__dots"
      role="status"
      :aria-label="ariaLabel"
      :tabindex="resolvedTabindex"
      :aria-disabled="disable || undefined"
    >
      <span
        v-for="index in pinLength"
        :key="index"
        class="abyss-pin-input__dot"
        :class="{
          'abyss-pin-input__dot--filled': index <= filledLength,
          'abyss-pin-input__dot--active': index === activeDotIndex,
        }"
      />
    </div>

    <p v-if="errorMessage" class="abyss-pin-input__error" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PIN_LENGTH } from '../../../utils/pinCode';

export interface AbyssPinInputProps {
  modelValue?: string;
  pinLength?: number;
  errorMessage?: string;
  ariaLabel?: string;
  tabindex?: number;
  disable?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssPinInputProps>(), {
  modelValue: '',
  pinLength: PIN_LENGTH,
  errorMessage: '',
  ariaLabel: 'Wprowadzony kod PIN',
  tabindex: 0,
  disable: false,
  style: '',
  class: '',
});

const filledLength = computed(() => props.modelValue.length);
const activeDotIndex = computed(() => {
  if (filledLength.value >= props.pinLength) {
    return null;
  }

  return filledLength.value + 1;
});
const resolvedTabindex = computed(() => (props.disable ? -1 : props.tabindex));
</script>

<style scoped lang="scss">
.abyss-pin-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;

  &__dots {
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 32px;
    min-height: 32px;
    padding: 6px 10px;
    border-radius: 10px;
    outline: none;

    &:focus-visible {
      box-shadow: 0 0 0 2px rgb(255 255 255 / 35%);
    }
  }

  &__dot {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid rgb(255 255 255 / 55%);
    box-sizing: border-box;
    transform: scale(0.7);
    transform-origin: center;
    transition:
      transform 120ms ease,
      background-color 120ms ease,
      border-color 120ms ease;

    &--filled {
      background: #fff;
      border-color: #fff;
    }

    &--active {
      transform: scale(1);
      border-color: rgb(255 255 255 / 90%);
    }
  }

  &__error {
    margin: 0;
    width: 100%;
    color: $negative;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>
