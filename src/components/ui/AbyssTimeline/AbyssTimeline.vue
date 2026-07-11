<template>
  <div
    ref="containerEl"
    class="abyss-timeline"
    :class="{ 'abyss-timeline--mobile': isMobile }"
    v-touch-pan.horizontal.mouse="handlePan"
  >
    <div class="abyss-timeline__inner" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TouchPan } from 'quasar';

const vTouchPan = TouchPan;

interface AbyssTimelineProps {
  autoHideDelay?: number;
}

const props = withDefaults(defineProps<AbyssTimelineProps>(), {
  autoHideDelay: 2000,
});

const LEFT_COLUMN_WIDTH = 98;
const MOBILE_BREAKPOINT = 560;

const containerEl = ref<HTMLElement | null>(null);
const containerWidth = ref(Infinity);
const isMobile = computed(() => containerWidth.value <= MOBILE_BREAKPOINT);
const areTransitionsEnabled = ref(false);

let resizeObserver: ResizeObserver | null = null;
let transitionActivationFrame: number | null = null;

function scheduleTransitionActivation(): void {
  if (typeof window === 'undefined' || transitionActivationFrame !== null) {
    return;
  }

  transitionActivationFrame = window.requestAnimationFrame(() => {
    areTransitionsEnabled.value = true;
    transitionActivationFrame = null;
  });
}

onMounted(() => {
  // v8 ignore next
  if (!containerEl.value) return;
  resizeObserver = new ResizeObserver((entries) => {
    const isFirstMeasurement = containerWidth.value === Infinity;
    containerWidth.value = entries[0]?.contentRect.width ?? Infinity;

    if (isFirstMeasurement) {
      scheduleTransitionActivation();
    }
  });
  resizeObserver.observe(containerEl.value);
});

const panOffset = ref(0);
const panStartOffset = ref(0);
const isPanning = ref(false);
let snapBackTimer: ReturnType<typeof setTimeout> | null = null;

interface TouchPanEvent {
  offset?: { x?: number; y?: number };
  isFirst?: boolean;
  isFinal?: boolean;
}

function scheduleAutoHide(): void {
  if (snapBackTimer !== null) clearTimeout(snapBackTimer);
  snapBackTimer = setTimeout(() => {
    panOffset.value = 0;
    snapBackTimer = null;
  }, props.autoHideDelay);
}

function handlePan(event: TouchPanEvent): void {
  if (!isMobile.value) return;

  if (event.isFirst) {
    isPanning.value = true;
    panStartOffset.value = panOffset.value;
    if (snapBackTimer !== null) {
      clearTimeout(snapBackTimer);
      snapBackTimer = null;
    }
  }

  panOffset.value = Math.max(
    0,
    Math.min(LEFT_COLUMN_WIDTH, panStartOffset.value + (event.offset?.x ?? 0)),
  );

  if (event.isFinal) {
    isPanning.value = false;
    if (panOffset.value >= LEFT_COLUMN_WIDTH / 2) {
      panOffset.value = LEFT_COLUMN_WIDTH;
      scheduleAutoHide();
    } else {
      panOffset.value = 0;
    }
  }
}

const innerStyle = computed(() => {
  if (!isMobile.value) return {};
  const offset = panOffset.value - LEFT_COLUMN_WIDTH;
  return {
    transform: `translateX(${offset}px)`,
    transition:
      isPanning.value || !areTransitionsEnabled.value
        ? 'none'
        : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    width: `calc(100% + ${LEFT_COLUMN_WIDTH}px)`,
  };
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  if (transitionActivationFrame !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(transitionActivationFrame);
  }
  if (snapBackTimer !== null) clearTimeout(snapBackTimer);
});

// Exposed for testing: allows direct call to scheduleAutoHide to cover
// the `if (snapBackTimer !== null) clearTimeout(...)` branch in line 57
defineExpose({ scheduleAutoHide });
</script>

<style scoped lang="scss">
.abyss-timeline {
  width: 100%;
  min-width: 0;

  &--mobile {
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    padding-right: 8px;
  }
}
</style>
