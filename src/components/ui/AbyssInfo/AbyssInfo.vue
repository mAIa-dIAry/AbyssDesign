<template>
  <div class="abyss-info" :class="`abyss-info--${type}`" v-bind="$attrs">
    <AbyssBackground
      class="abyss-info__gradient"
      :colors="gradientColors"
      aria-hidden="true"
    />

    <div class="abyss-info__icon">
      <q-icon :name="icon" />
    </div>

    <div class="abyss-info__panel">
      <div class="abyss-info__panel-overlay" aria-hidden="true" />
      <div
        class="abyss-info__panel-content"
        :class="{ 'abyss-info__panel-content--title-only': isTitleOnly }"
      >
        <div v-if="title" class="abyss-info__title">{{ title }}</div>
        <div v-if="hasContent" class="abyss-info__content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment, Text, computed, useSlots, watch, type VNode } from 'vue';
import AbyssBackground from '@/components/ui/AbyssBackground/AbyssBackground.vue';
import { resolveGradientColors } from '@/defines/semantic-gradients';

export type AbyssInfoType =
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'hint';

export interface AbyssInfoProps {
  type?: AbyssInfoType;
  title?: string;
  icon: string;
  class?: string;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssInfoProps>(), {
  type: 'info',
});

const gradientColors = computed(() => resolveGradientColors(props.type));

const slots = useSlots();

function slotHasContent(nodes: VNode[] | undefined): boolean {
  if (!nodes?.length) {
    return false;
  }

  return nodes.some((node) => {
    if (node.type === Comment) {
      return false;
    }

    if (node.type === Text) {
      return String(node.children ?? '').trim().length > 0;
    }

    return true;
  });
}

const hasContent = computed(() => slotHasContent(slots.default?.()));
const isTitleOnly = computed(
  () => Boolean(props.title?.trim()) && !hasContent.value,
);

if (import.meta.env.DEV) {
  watch(
    () => props.icon,
    (icon) => {
      if (!icon.trim()) {
        console.error(
          '[AbyssInfo] Prop "icon" is required and cannot be empty.',
        );
      }
    },
    { immediate: true },
  );

  watch(
    () => slots.default?.(),
    (nodes) => {
      if (!slotHasContent(nodes)) {
        console.error(
          '[AbyssInfo] Default slot content is required and cannot be empty.',
        );
      }
    },
    { immediate: true },
  );
}
</script>

<style scoped lang="scss">
.abyss-info {
  --info-icon-size: 24px;
  --info-icon-column-width: 48px;
  --info-panel-overlay: #{rgba(black, 0.5)};

  position: relative;
  display: grid;
  grid-template-columns: var(--info-icon-column-width) 1fr;
  grid-template-areas: 'icon panel';
  align-items: stretch;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: $shadow-small, $shadow-frame-soft;

  &__gradient {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;

    :deep(.abyss-background__content) {
      display: none;
    }
  }

  &__icon {
    grid-area: icon;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--info-icon-column-width);
    color: black;

    :deep(.q-icon) {
      font-size: var(--info-icon-size);
      line-height: 1;
    }
  }

  &__panel {
    grid-area: panel;
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  &__panel-overlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: var(--info-panel-overlay);

    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: 0;
      width: 16px;
      height: calc(100% + 16px);
      box-shadow: inset 8px 0 8px -4px rgba(black, 0.22);
      clip-path: polygon(
        0 0,
        8px 0,
        16px 8px,
        16px calc(100% - 8px),
        8px 100%,
        0 100%
      );
      pointer-events: none;
    }
  }

  &__panel-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    box-sizing: border-box;
    min-height: var(--info-icon-column-width);
    padding: 12px 14px;

    &--title-only {
      // Single-line title: keep optical vertical center with the icon column.
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: white;
    line-height: 1.3;
  }

  &__content {
    font-size: 13px;
    line-height: 1.5;
    color: white;
  }
}
</style>
