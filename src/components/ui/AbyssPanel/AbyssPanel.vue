<template>
  <section
    class="abyss-panel"
    :class="[props.class, { 'abyss-panel--flush': props.flush }]"
    :style="props.style"
    :aria-label="props.ariaLabel"
  >
    <div
      v-if="hasTitle"
      class="abyss-panel__title"
      role="heading"
      aria-level="2"
    >
      <slot name="title">{{ props.title }}</slot>
    </div>

    <div class="abyss-panel__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

export interface AbyssPanelProps {
  title?: string;
  ariaLabel?: string;
  /** Usuwa padding sekcji — treść slotu zarządza własnym odstępem wewnętrznym. */
  flush?: boolean;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssPanelProps>(), {
  flush: false,
});
const slots = useSlots();

const hasTitle = computed(() => {
  return Boolean(props.title?.trim() || slots.title);
});
</script>

<style scoped lang="scss">
.abyss-panel {
  --panel-radius: 12px;
  --panel-surface-background: #{rgba(white, 0.01)};
  --panel-background: #{rgba(white, 0.01)};

  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: var(--panel-radius);
  padding: 16px;
  background: var(--panel-background);
  box-shadow: $shadow-small, $shadow-frame-soft;

  &--flush {
    padding: 0;
    gap: 0;

    .abyss-panel__content {
      gap: 0;
    }
  }

  &__title {
    margin: 0;
    padding: 0;
    color: rgba(white, 0.72);
    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
}
</style>
