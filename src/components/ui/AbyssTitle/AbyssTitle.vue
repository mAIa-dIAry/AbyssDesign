<template>
  <div
    class="abyss-title"
    :class="`abyss-title--${size}`"
    :style="hasGradient ? { '--title-gradient': gradientCss } : {}"
  >
    <span
      class="abyss-title__content"
      :class="{ 'abyss-title__content--gradient': hasGradient }"
    >
      <q-icon v-if="icon" :name="icon" class="abyss-title__icon" />
      <slot>{{ label }}</slot>
    </span>
    <div v-if="separator" class="abyss-title__separator" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';

export type AbyssTitleSize = 'lg' | 'md' | 'sm';

export interface AbyssTitleProps {
  size?: AbyssTitleSize;
  icon?: string;
  label?: string;
  separator?: boolean;
  colors?: string[];
}

const props = withDefaults(defineProps<AbyssTitleProps>(), {
  size: 'md',
  separator: false,
});

const hasGradient = computed(
  () => Array.isArray(props.colors) && props.colors.length >= 2,
);

const { gradientCss, setColors } = useGradient(DEFAULT_GRADIENT_COLORS);

watch(
  () => props.colors,
  (newColors) => {
    if (newColors && newColors.length >= 2) {
      setColors(newColors);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.abyss-title {
  --font-size: 18px;
  --font-weight: 600;
  --icon-size: 22px;
  --title-gradient: none;

  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  line-height: 1.3;
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  width: 100%;

  &__content {
    display: flex;
    align-items: center;
    gap: 8px;

    &--gradient {
      background: var(--title-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-weight: 800;
    }
  }

  &__icon {
    flex-shrink: 0;
    font-size: var(--icon-size);
    position: static;
  }

  &__separator {
    flex: 1;
    height: 1px;
    background-color: rgba(white, 0.12);
  }

  &--lg {
    --font-size: 20px;
    --font-weight: 500;
    --icon-size: 32px;
  }

  &--md {
    --font-size: 18px;
    --font-weight: 500;
    --icon-size: 25px;
  }

  &--sm {
    --font-size: 16px;
    --font-weight: 700;
    --icon-size: 20px;
  }
}
</style>
