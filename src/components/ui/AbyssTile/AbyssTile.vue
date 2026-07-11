<template>
  <div
    class="abyss-tile"
    :class="{
      'abyss-tile--monospace': props.monospace,
      'abyss-tile--truncate': props.truncate,
    }"
  >
    <div v-if="hasTitle" class="abyss-tile__title">
      {{ props.title }}
    </div>

    <div class="abyss-tile__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface AbyssTileProps {
  title?: string;
  monospace?: boolean;
  /** Obcina treść w jednej linii z wielokropkiem — pełna wartość dostępna poza kafelkiem. */
  truncate?: boolean;
}

const props = withDefaults(defineProps<AbyssTileProps>(), {
  truncate: false,
});

const hasTitle = computed(() => Boolean(props.title?.trim()));
</script>

<style scoped lang="scss">
.abyss-tile {
  --panel-radius: 12px;
  --panel-surface-background: #{rgba(white, 0.01)};

  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  border-radius: var(--panel-radius);
  padding: 8px 12px;
  background: var(--panel-surface-background);
  border: 1px solid rgba(white, 0.04);

  &__title {
    color: rgba(white, 0.5);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__content {
    min-width: 0;
    color: rgba(white, 0.88);
    font-size: 0.92rem;
    line-height: 1.35;
    word-break: break-word;
  }

  &--truncate &__content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
  }

  &--monospace &__content {
    font-family: var(--font-family-mono);
    letter-spacing: 0.04em;
  }
}
</style>
