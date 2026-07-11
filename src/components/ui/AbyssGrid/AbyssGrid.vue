<template>
  <div
    class="abyss-grid"
    :class="[
      `abyss-grid--align-${props.align}`,
      {
        'abyss-grid--limited': props.maxColumns > 0,
        'abyss-grid--min-row-size': hasMinRowSize,
        'abyss-grid--content-rows': props.contentRows,
      },
      props.class,
    ]"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface AbyssGridProps {
  align?: 'left' | 'right';
  maxColumns?: number;
  columnSize?: string;
  columnGap?: string;
  rowGap?: string;
  rowSize?: string;
  /** Wiersze o wysokości treści — bez wyrównywania wysokości między wierszami (np. etykieta + pole). */
  contentRows?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}

const props = withDefaults(defineProps<AbyssGridProps>(), {
  align: 'left',
  maxColumns: 0,
  columnSize: '360px',
  columnGap: '12px',
  rowGap: '12px',
  rowSize: '0px',
  contentRows: false,
  style: '',
  class: '',
});

const hasMinRowSize = computed(() => props.rowSize !== '0px');

const computedStyle = computed(() => [
  props.style,
  {
    '--column-size': props.columnSize,
    '--column-gap': props.columnGap,
    ...(props.maxColumns > 0
      ? {
          '--max-columns': String(props.maxColumns),
          '--limited-column-size': `max(${props.columnSize}, calc((100% - ((var(--max-columns) - 1) * ${props.columnGap})) / var(--max-columns)))`,
        }
      : {}),
    '--row-gap': props.rowGap,
    '--row-size': props.rowSize,
  },
]);
</script>

<style scoped lang="scss">
.abyss-grid {
  display: grid;
  inline-size: 100%;
  container-type: inline-size;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, var(--column-size)), 1fr)
  );
  grid-auto-rows: auto;
  column-gap: var(--column-gap);
  row-gap: var(--row-gap);
  align-content: start;
  align-items: stretch;

  &--min-row-size {
    grid-auto-rows: minmax(var(--row-size), auto);
  }

  &--content-rows {
    grid-auto-rows: max-content;
    align-items: start;
    align-content: start;
  }

  > * {
    direction: ltr;
    min-width: 0;
  }

  &--align-right {
    direction: rtl;
  }

  &--limited {
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(100%, var(--limited-column-size)), 1fr)
    );
  }
}
</style>
