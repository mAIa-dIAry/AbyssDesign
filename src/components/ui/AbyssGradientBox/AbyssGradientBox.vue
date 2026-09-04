<template>
  <div
    class="abyss-gradient-box"
    :class="{ 'abyss-gradient-box--active': active }"
    :style="computedStyle"
    @click="emit('click')"
  >
    <div class="abyss-gradient-box__inner">
      <div class="abyss-gradient-box__overlay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';

export interface AbyssGradientBoxProps {
  active?: boolean;
  colors?: string[];
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssGradientBoxProps>(), {
  active: false,
  style: '',
  class: '',
});

const { gradientCss, setColors } = useGradient(
  props.colors ?? DEFAULT_GRADIENT_COLORS,
);

watch(
  () => props.colors,
  (newColors) => setColors(newColors ?? DEFAULT_GRADIENT_COLORS),
);

const emit = defineEmits<{
  click: [];
}>();

const computedStyle = computed(() => [
  props.style,
  { '--gradient': gradientCss.value },
]);
</script>

<style scoped lang="scss">
.abyss-gradient-box {
  --border-radius: 8px;
  --padding: 4px;
  --border-color: transparent;
  --overlay-opacity: 0.5;

  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  height: auto;
  padding: var(--padding);
  border-radius: var(--border-radius);
  background-color: rgba(white, 0.02);
  border: 1px solid var(--border-color);
  box-shadow: $shadow-base;
  outline: 0px solid rgba(white, 0.05);
  outline-offset: 2px;
  transition:
    outline-width 0.15s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: calc(var(--border-radius) - var(--padding));
    background: var(--gradient);
    overflow: hidden;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: black;
    border-radius: inherit;
    opacity: var(--overlay-opacity);
    transition: $transition-medium;
  }

  &:not(.abyss-gradient-box--active) {
    cursor: pointer;

    &:hover {
      background-color: rgba(white, 0.04);
      box-shadow: $shadow-hover;
      transform: translateY(-1px);
      --overlay-opacity: 0.35;
    }

    &:active {
      background-color: rgba(white, 0.03);
      box-shadow: $shadow-active;
      transform: translateY(0.5px);
      --overlay-opacity: 0.4;
    }
  }

  &--active {
    --border-color: #{rgba(white, 0.15)};
    background-color: rgba(black, 0.125);
    outline-width: 4px;
    --overlay-opacity: 0;
  }
}
</style>
