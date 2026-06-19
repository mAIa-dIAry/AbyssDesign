<template>
  <div class="abyss-info" :class="`abyss-info--${type}`" v-bind="$attrs">
    <div class="abyss-info__header">
      <span v-if="icon" class="material-symbols-rounded abyss-info__icon">
        {{ icon }}
      </span>
      <span class="abyss-info__title">{{ title }}</span>
    </div>
    <div class="abyss-info__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

export type AbyssInfoType =
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'neutral';

export interface AbyssInfoProps {
  type?: AbyssInfoType;
  title: string;
  icon?: string;
  class?: string;
  style?: string | Record<string, string>;
}

const props = withDefaults(defineProps<AbyssInfoProps>(), {
  type: 'info',
});

if (import.meta.env.DEV) {
  watch(
    () => props.title,
    (title) => {
      if (!title.trim()) {
        console.error(
          '[AbyssInfo] Prop "title" is required and cannot be empty.',
        );
      }
    },
    { immediate: true },
  );
}
</script>

<style scoped lang="scss">
.abyss-info {
  --info-color: #{$info};

  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 3px solid var(--info-color);
  background-color: color-mix(in srgb, var(--info-color) 10%, transparent);

  &--info {
    --info-color: #{$info};
  }

  &--warning {
    --info-color: #{$warning};
  }

  &--danger {
    --info-color: #{$negative};
  }

  &--success {
    --info-color: #{$positive};
  }

  &--neutral {
    --info-color: rgba(255, 255, 255, 0.5);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__icon {
    font-size: 18px;
    color: var(--info-color);
    line-height: 1;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--info-color);
    line-height: 1.3;
    transform: translateY(2px);
  }

  &__content {
    font-size: 13px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);

    &:empty {
      display: none;
    }
  }
}
</style>
