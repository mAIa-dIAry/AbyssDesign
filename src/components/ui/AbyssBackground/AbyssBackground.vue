<template>
  <div class="abyss-background">
    <div class="abyss-background__stage" aria-hidden="true">
      <div
        class="abyss-background__layer abyss-background__layer--current"
        :style="currentLayerStyle"
      />
      <div
        v-for="(layer, layerIndex) in fadingLayers"
        :key="layer.id"
        class="abyss-background__layer abyss-background__layer--fading"
        :style="buildFadingLayerStyle(layerIndex)"
        @animationend="removeFadingLayer(layer.id)"
      />
    </div>
    <div class="abyss-background__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import {
  DEFAULT_GRADIENT_COLORS,
  useGradient,
} from '@/composables/useGradient';

interface FadingGradientLayer {
  id: number;
  gradientCss: string;
}

const BACKGROUND_FADE_DURATION_MS = 3000;

interface Props {
  colors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => DEFAULT_GRADIENT_COLORS,
});

const { gradientCss, gradientStyle, setColors } = useGradient(props.colors);
const fadingLayers = ref<FadingGradientLayer[]>([]);
const fadingLayerTimeoutIds = new Map<number, number>();
const currentLayerStyle = computed(() => ({
  ...gradientStyle.value,
  zIndex: 0,
}));

let nextFadingLayerId = 1;

function buildFadingLayerStyle(layerIndex: number) {
  const layer = fadingLayers.value[layerIndex];

  return {
    background: layer?.gradientCss,
    zIndex: fadingLayers.value.length - layerIndex,
    animationDuration: `${BACKGROUND_FADE_DURATION_MS}ms`,
  };
}

function removeFadingLayer(layerId: number): void {
  const timeoutId = fadingLayerTimeoutIds.get(layerId);
  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId);
    fadingLayerTimeoutIds.delete(layerId);
  }

  fadingLayers.value = fadingLayers.value.filter(
    (layer) => layer.id !== layerId,
  );
}

function queueFadingLayer(previousGradientCss: string): void {
  const layerId = nextFadingLayerId;
  nextFadingLayerId += 1;

  fadingLayers.value = [
    ...fadingLayers.value,
    {
      id: layerId,
      gradientCss: previousGradientCss,
    },
  ];

  const timeoutId = window.setTimeout(() => {
    removeFadingLayer(layerId);
  }, BACKGROUND_FADE_DURATION_MS);

  fadingLayerTimeoutIds.set(layerId, timeoutId);
}

watch(
  () => props.colors,
  (newColors) => {
    const previousGradientCss = gradientCss.value;
    setColors(newColors);

    if (previousGradientCss === gradientCss.value) {
      return;
    }

    queueFadingLayer(previousGradientCss);
  },
);

onUnmounted(() => {
  for (const timeoutId of fadingLayerTimeoutIds.values()) {
    window.clearTimeout(timeoutId);
  }

  fadingLayerTimeoutIds.clear();
});
</script>

<style scoped lang="scss">
.abyss-background {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  &__stage {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__layer {
    position: absolute;
    inset: 0;

    &--fading {
      animation-name: abyss-background-fade-out;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}

@keyframes abyss-background-fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
